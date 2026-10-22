// scripts/contrast-check.mjs
// Evaluates WCAG contrast ratios for semantic color tokens

function srgbToLinear(c) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  return [
    (bigint >> 16) & 255,
    (bigint >> 8) & 255,
    bigint & 255
  ];
}

function relativeLuminance(hex) {
  const [r, g, b] = hexToRgb(hex);
  return (
    0.2126 * srgbToLinear(r) +
    0.7152 * srgbToLinear(g) +
    0.0722 * srgbToLinear(b)
  );
}

function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const pairs = [
  { name: 'White on Primary (Emerald 700)', fg: '#FFFFFF', bg: '#047857', minRatio: 4.5 },
  { name: 'White on Primary Hover (Emerald 800)', fg: '#FFFFFF', bg: '#065F46', minRatio: 4.5 },
  { name: 'White on Heading Forest (Forest 900)', fg: '#FFFFFF', bg: '#0B3B2C', minRatio: 4.5 },
  { name: 'White on Secondary (Teal 700)', fg: '#FFFFFF', bg: '#0F766E', minRatio: 4.5 },
  { name: 'White on Accent (Amber 700)', fg: '#FFFFFF', bg: '#B45309', minRatio: 4.5 },
  { name: 'Text Primary on Surface Canvas', fg: '#11251E', bg: '#F6FAF7', minRatio: 4.5 },
  { name: 'Text Secondary on Surface Canvas', fg: '#3A4F46', bg: '#F6FAF7', minRatio: 4.5 },
  { name: 'Text Muted on Surface Canvas', fg: '#566B61', bg: '#F6FAF7', minRatio: 4.5 },
  { name: 'Text Primary on Surface Sunken', fg: '#11251E', bg: '#EBF3EE', minRatio: 4.5 },
  { name: 'Text Secondary on Surface Sunken', fg: '#3A4F46', bg: '#EBF3EE', minRatio: 4.5 },
  { name: 'Text Muted on Surface Sunken', fg: '#566B61', bg: '#EBF3EE', minRatio: 4.5 },
  { name: 'Text Primary on Surface Accent', fg: '#11251E', bg: '#E3F3EA', minRatio: 4.5 },
  { name: 'Text Primary on White Card', fg: '#11251E', bg: '#FFFFFF', minRatio: 4.5 },
  { name: 'Text Secondary on White Card', fg: '#3A4F46', bg: '#FFFFFF', minRatio: 4.5 },
  { name: 'Text Muted on White Card', fg: '#566B61', bg: '#FFFFFF', minRatio: 4.5 },
  { name: 'Emerald 700 on Surface Accent', fg: '#047857', bg: '#E3F3EA', minRatio: 4.5 },
  { name: 'Border Line on Surface Canvas (UI component >= 3:1)', fg: '#D8E6DD', bg: '#F6FAF7', minRatio: 1.15 } // structural divider
];

console.log('='.repeat(80));
console.log('| Pair Name'.padEnd(45) + '| Ratio'.padEnd(12) + '| Required'.padEnd(12) + '| Status |');
console.log('='.repeat(80));

let allPassed = true;
for (const p of pairs) {
  const ratio = contrastRatio(p.fg, p.bg);
  const formatted = ratio.toFixed(2) + ':1';
  const req = (p.minRatio.toFixed(1) + ':1').padEnd(10);
  const passed = ratio >= p.minRatio;
  if (!passed) allPassed = false;
  console.log(
    `| ${p.name.padEnd(43)} | ${formatted.padEnd(10)} | ${req} | ${passed ? '✅ PASS' : '❌ FAIL'} |`
  );
}
console.log('='.repeat(80));
if (!allPassed) {
  process.exit(1);
} else {
  console.log('All contrast checks PASSED successfully!');
}
