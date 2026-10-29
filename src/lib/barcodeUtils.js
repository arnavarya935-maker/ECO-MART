/**
 * Pure offline EAN-13 barcode utilities (encoding, validation, and SVG generation).
 * Zero external dependencies, zero CDN.
 */

const L_CODES = [
  '0001101', '0011001', '0010011', '0111101', '0100011',
  '0110001', '0101111', '0111011', '0110111', '0001011'
];

const G_CODES = [
  '0100111', '0110011', '0011011', '0100001', '0011101',
  '0111001', '0000101', '0010001', '0001001', '0010111'
];

const R_CODES = [
  '1110010', '1100110', '1101100', '1000010', '1011100',
  '1001110', '1010000', '1000100', '1001000', '1110100'
];

const FIRST_DIGIT_STRUCTURE = [
  'LLLLLL', 'LLGLGG', 'LLGGLG', 'LLGGGL', 'LGLLGG',
  'LGGLLG', 'LGGGLL', 'LGLGLG', 'LGLGGL', 'LGGLGL'
];

/**
 * Calculates modulo-10 check digit for the first 12 digits of an EAN-13 code.
 * @param {string} digits12 - 12-digit numeric string
 * @returns {number} 0-9 check digit
 */
export function calculateEan13CheckDigit(digits12) {
  if (typeof digits12 !== 'string' || digits12.length < 12) {
    throw new Error('Expected 12 numeric digits to compute EAN-13 check digit');
  }

  let total = 0;
  for (let i = 0; i < 12; i++) {
    const d = parseInt(digits12[i], 10);
    if (isNaN(d)) throw new Error(`Invalid non-numeric character: "${digits12[i]}"`);
    // Odd positions (0, 2, 4...) weight 1, Even positions (1, 3, 5...) weight 3
    total += (i % 2 === 0) ? d : d * 3;
  }

  const remainder = total % 10;
  return remainder === 0 ? 0 : 10 - remainder;
}

/**
 * Validates whether a 13-digit string has a correct EAN-13 check digit.
 * @param {string} barcode
 * @returns {boolean}
 */
export function isValidEan13(barcode) {
  if (typeof barcode !== 'string' || !/^\d{13}$/.test(barcode)) {
    return false;
  }
  const expectedCheck = calculateEan13CheckDigit(barcode.slice(0, 12));
  return parseInt(barcode[12], 10) === expectedCheck;
}

/**
 * Generates a valid 13-digit Indian GS1 prefix (890) barcode for a given item index.
 * @param {number} index
 * @returns {string} 13-digit EAN-13 string
 */
export function generateEan13(index) {
  const prefix = '890';
  // 9-digit item number
  const paddedIndex = String(index).padStart(9, '0');
  const first12 = `${prefix}${paddedIndex}`;
  const checkDigit = calculateEan13CheckDigit(first12);
  return `${first12}${checkDigit}`;
}

/**
 * Encodes an EAN-13 string into binary module pattern (95 modules total: 3 start + 42 left + 5 center + 42 right + 3 end).
 * @param {string} barcode
 * @returns {string} 95-character '0' and '1' string
 */
export function encodeEan13Binary(barcode) {
  if (!isValidEan13(barcode)) {
    throw new Error(`Cannot encode invalid EAN-13 barcode: "${barcode}"`);
  }

  const firstDigit = parseInt(barcode[0], 10);
  const structure = FIRST_DIGIT_STRUCTURE[firstDigit];

  let binary = '101'; // Start guard

  // Left 6 digits
  for (let i = 0; i < 6; i++) {
    const digit = parseInt(barcode[i + 1], 10);
    const codeType = structure[i];
    binary += (codeType === 'L') ? L_CODES[digit] : G_CODES[digit];
  }

  binary += '01010'; // Center guard

  // Right 6 digits (including check digit)
  for (let i = 0; i < 6; i++) {
    const digit = parseInt(barcode[i + 7], 10);
    binary += R_CODES[digit];
  }

  binary += '101'; // End guard
  return binary;
}

/**
 * Generates an SVG string for an EAN-13 barcode with quiet zones and human-readable text.
 * @param {string} barcode
 * @param {Object} options
 * @returns {string} SVG markup
 */
export function generateBarcodeSvg(barcode, options = {}) {
  const {
    width = 240,
    height = 100,
    barColor = '#111827',
    bgColor = '#ffffff',
    showText = true
  } = options;

  if (!isValidEan13(barcode)) {
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><text x="10" y="30" fill="red">Invalid Barcode</text></svg>`;
  }

  const binary = encodeEan13Binary(barcode);
  const totalModules = 95;
  const quietZoneModules = 9;
  const totalWidthModules = totalModules + (quietZoneModules * 2); // 113 modules
  const moduleWidth = width / totalWidthModules;
  const barHeight = showText ? height * 0.72 : height;
  const guardExtraHeight = showText ? height * 0.08 : 0;

  let rects = [];

  for (let i = 0; i < binary.length; i++) {
    if (binary[i] === '1') {
      const x = (i + quietZoneModules) * moduleWidth;
      // Guard bars (start: 0..2, center: 45..49, end: 92..94) extend slightly lower
      const isGuard = (i <= 2) || (i >= 45 && i <= 49) || (i >= 92);
      const h = isGuard ? barHeight + guardExtraHeight : barHeight;
      rects.push(`<rect x="${x.toFixed(2)}" y="10" width="${moduleWidth.toFixed(2)}" height="${h.toFixed(2)}" fill="${barColor}" />`);
    }
  }

  const textMarkup = showText
    ? `<text x="${(width / 2).toFixed(2)}" y="${(height - 4).toFixed(2)}" font-family="monospace, monospace" font-size="12" font-weight="bold" fill="${barColor}" text-anchor="middle" letter-spacing="2">${barcode.slice(0, 1)} ${barcode.slice(1, 7)} ${barcode.slice(7)}</text>`
    : '';

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="EAN-13 Barcode ${barcode}">
    <rect width="${width}" height="${height}" fill="${bgColor}" />
    ${rects.join('')}
    ${textMarkup}
  </svg>`;
}
