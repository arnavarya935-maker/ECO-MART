/**
 * Barcode Utilities: Validation, EAN/UPC Checksums, EcoScore Estimation, and Swaps
 */
import productsData from '../data/products.json';

/**
 * Calculate the EAN-13 modulo-10 check digit for the first 12 digits
 */
export function calculateEan13CheckDigit(digits12) {
  const str = String(digits12).replace(/\D/g, '').slice(0, 12);
  if (str.length !== 12) return null;
  const sum = str
    .split('')
    .reduce((acc, digit, idx) => acc + parseInt(digit, 10) * (idx % 2 === 0 ? 1 : 3), 0);
  return (10 - (sum % 10)) % 10;
}

/**
 * Calculate the UPC-A check digit for the first 11 digits
 */
export function calculateUpcACheckDigit(digits11) {
  const str = String(digits11).replace(/\D/g, '').slice(0, 11);
  if (str.length !== 11) return null;
  const sum = str
    .split('')
    .reduce((acc, digit, idx) => acc + parseInt(digit, 10) * (idx % 2 === 0 ? 3 : 1), 0);
  return (10 - (sum % 10)) % 10;
}

/**
 * Validate barcode format and check digit (EAN-13, EAN-8, UPC-A, UPC-E, Code 128, QR)
 */
export function validateBarcode(input) {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'Please enter a barcode number.', type: 'Unknown', format: 'Unknown' };
  }

  const code = input.trim();
  if (code.length === 0) {
    return { valid: false, error: 'Barcode cannot be empty.', type: 'Unknown', format: 'Unknown' };
  }

  // QR or alphanumeric Code 128
  if (!/^\d+$/.test(code)) {
    if (code.startsWith('http://') || code.startsWith('https://')) {
      return { valid: true, error: null, type: 'QR / URL', format: 'QR / URL', code };
    }
    if (code.length >= 3 && code.length <= 100) {
      return { valid: true, error: null, type: 'Code 128', format: 'Code 128', code };
    }
    return { valid: false, error: 'Invalid barcode character format.', type: 'Alphanumeric', format: 'Alphanumeric' };
  }

  // EAN-13 (13 digits)
  if (code.length === 13) {
    const sum = code
      .slice(0, 12)
      .split('')
      .reduce((acc, digit, idx) => acc + parseInt(digit, 10) * (idx % 2 === 0 ? 1 : 3), 0);
    const expected = (10 - (sum % 10)) % 10;
    const actual = parseInt(code[12], 10);
    if (expected !== actual) {
      return {
        valid: false,
        error: `Invalid EAN-13 checksum: check digit is ${actual}, expected ${expected}.`,
        type: 'EAN-13',
        format: 'EAN-13',
        code
      };
    }
    return { valid: true, error: null, type: 'EAN-13', format: 'EAN-13', code };
  }

  // UPC-A (12 digits)
  if (code.length === 12) {
    const sum = code
      .slice(0, 11)
      .split('')
      .reduce((acc, digit, idx) => acc + parseInt(digit, 10) * (idx % 2 === 0 ? 3 : 1), 0);
    const expected = (10 - (sum % 10)) % 10;
    const actual = parseInt(code[11], 10);
    if (expected !== actual) {
      return {
        valid: false,
        error: `Invalid UPC-A checksum: check digit is ${actual}, expected ${expected}.`,
        type: 'UPC-A',
        format: 'UPC-A',
        code
      };
    }
    return { valid: true, error: null, type: 'UPC-A', format: 'UPC-A', code };
  }

  // EAN-8 (8 digits)
  if (code.length === 8) {
    const sum = code
      .slice(0, 7)
      .split('')
      .reduce((acc, digit, idx) => acc + parseInt(digit, 10) * (idx % 2 === 0 ? 3 : 1), 0);
    const expected = (10 - (sum % 10)) % 10;
    const actual = parseInt(code[7], 10);
    if (expected !== actual) {
      return {
        valid: false,
        error: `Invalid EAN-8 checksum: check digit is ${actual}, expected ${expected}.`,
        type: 'EAN-8',
        format: 'EAN-8',
        code
      };
    }
    return { valid: true, error: null, type: 'EAN-8', format: 'EAN-8', code };
  }

  // UPC-E or other variable formats (6 to 14 digits)
  if (code.length >= 6 && code.length <= 14) {
    return { valid: true, error: null, type: `Numeric-${code.length}`, format: `Numeric-${code.length}`, code };
  }

  return {
    valid: false,
    error: `Unexpected barcode length (${code.length} digits). Standard barcodes are 8, 12, or 13 digits.`,
    type: 'Unknown',
    format: 'Unknown',
    code
  };
}

/**
 * Estimate EcoScore for external product scanned from Open Food / Beauty / Products Facts
 * All external data is explicitly labeled as an estimate with its data source.
 */
export function estimateEcoScoreFromExternal(data, sourceOverride = null) {
  if (!data) return null;

  const rawGrade = (data.ecoscore_grade || data.ecoscore || '').toLowerCase().trim();
  const rawScore = Number(data.ecoscore_score);
  const dataSource = sourceOverride || data.dataSource || data.source || 'Open Food Facts';

  if (!isNaN(rawScore) && rawScore > 0) {
    const grade = rawScore >= 80 ? 'A' : rawScore >= 65 ? 'B' : rawScore >= 50 ? 'C' : rawScore >= 35 ? 'D' : 'E';
    return {
      score: Math.round(rawScore),
      grade,
      isEstimate: true,
      dataSource,
      source: dataSource,
      breakdown: {
        materials: data.ingredients_text || 'Reported ingredients formulation',
        packaging: data.packaging ? `Reported packaging: ${data.packaging}` : 'Standard commercial packaging baseline',
        origins: data.origins || data.country_of_origin || 'Global supply chain',
        labels: data.labels || []
      }
    };
  }

  if (['a', 'b', 'c', 'd', 'e'].includes(rawGrade)) {
    const gradeScores = { a: 90, b: 75, c: 60, d: 45, e: 25 };
    return {
      score: gradeScores[rawGrade],
      grade: rawGrade.toUpperCase(),
      isEstimate: true,
      dataSource,
      source: dataSource,
      breakdown: {
        materials: data.ingredients_text || 'Standard ingredients profile',
        packaging: data.packaging ? `Reported packaging: ${data.packaging}` : 'Standard commercial packaging',
        origins: data.origins || data.country_of_origin || 'Global supply chain',
        labels: data.labels || []
      }
    };
  }

  // Heuristic estimation if registry lacks direct ecoscore
  let estimatedScore = 55;
  const pkg = (data.packaging || '').toLowerCase();
  const ing = (data.ingredients_text || '').toLowerCase();

  if (pkg.includes('plastic') || pkg.includes('sachet') || pkg.includes('pouch')) estimatedScore -= 15;
  if (pkg.includes('cardboard') || pkg.includes('glass') || pkg.includes('paper') || pkg.includes('metal')) estimatedScore += 10;
  if (ing.includes('organic') || ing.includes('bio') || ing.includes('fairtrade')) estimatedScore += 15;
  if (ing.includes('palm oil')) estimatedScore -= 15;

  const boundedScore = Math.max(20, Math.min(95, estimatedScore));
  const grade = boundedScore >= 80 ? 'A' : boundedScore >= 65 ? 'B' : boundedScore >= 50 ? 'C' : boundedScore >= 35 ? 'D' : 'E';

  return {
    score: boundedScore,
    grade,
    isEstimate: true,
    dataSource,
    source: dataSource,
    breakdown: {
      materials: ing || 'Reported formulation',
      packaging: pkg || 'Packaging not specified (default conventional baseline)',
      origins: data.country_of_origin || 'Unknown origin',
      labels: ['Estimated based on reported packaging & ingredients']
    }
  };
}

/**
 * Find greener alternatives in Eco Sense catalog for an externally scanned product
 */
export function findGreenerCatalogSwaps(scannedProduct, allProducts = []) {
  const catalog = Array.isArray(allProducts) && allProducts.length > 0
    ? allProducts
    : productsData;

  const ecoItems = catalog.filter((p) => p.isEcoFriendly);

  if (typeof scannedProduct === 'string') {
    const cat = scannedProduct.toLowerCase();
    const minScore = typeof allProducts === 'number' ? allProducts : 0;
    return ecoItems
      .filter((p) => (p.category.toLowerCase().includes(cat) || p.name.toLowerCase().includes(cat)) && (p.ecoScore || 80) >= minScore)
      .slice(0, 3);
  }

  if (!scannedProduct) return ecoItems.slice(0, 2);

  const name = (scannedProduct.product_name || scannedProduct.name || '').toLowerCase();
  const brand = (scannedProduct.brand || '').toLowerCase();
  const category = (scannedProduct.category || '').toLowerCase();

  // Score candidate relevance
  const scored = ecoItems.map((prod) => {
    let matchScore = 0;
    const pName = prod.name.toLowerCase();
    const pCat = prod.category.toLowerCase();
    const pDesc = (prod.description || '').toLowerCase();

    // Direct token overlap
    const tokens = `${name} ${category}`.split(/\s+/).filter((t) => t.length >= 3);
    for (const t of tokens) {
      if (pName.includes(t)) matchScore += 30;
      if (pCat.includes(t)) matchScore += 20;
      if (pDesc.includes(t)) matchScore += 10;
    }

    // Specific category associations
    if (name.includes('brush') && pName.includes('brush')) matchScore += 50;
    if (name.includes('soap') || name.includes('wash') || name.includes('shampoo')) {
      if (pCat === 'Personal Care' || pCat === 'Cleaning & Laundry') matchScore += 40;
    }
    if (name.includes('water') || name.includes('drink') || name.includes('cola') || name.includes('beverage')) {
      if (pName.includes('bottle') || pName.includes('thermos') || pCat === 'Outdoor & Travel') matchScore += 40;
    }
    if (name.includes('snack') || name.includes('spread') || name.includes('nutella') || name.includes('food')) {
      if (pCat === 'Kitchen' || pCat === 'Food & Pantry') matchScore += 30;
    }
    if (name.includes('bag') && (pCat === 'Bags' || pName.includes('tote'))) matchScore += 50;

    return { product: prod, matchScore, ecoScore: prod.carbonKg ? (100 - prod.carbonKg * 10) : 85 };
  });

  scored.sort((a, b) => b.matchScore - a.matchScore || b.ecoScore - a.ecoScore);

  const topMatches = scored.filter((s) => s.matchScore > 0).slice(0, 3).map((s) => s.product);

  if (topMatches.length === 0) {
    return ecoItems.slice(0, 2);
  }

  return topMatches;
}
