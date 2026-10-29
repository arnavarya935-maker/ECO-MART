import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

if (!fs.existsSync(distDir)) {
  console.error('[bundle-report] dist directory does not exist. Run "npm run build" first.');
  process.exit(1);
}

const indexHtmlPath = path.join(distDir, 'index.html');
if (!fs.existsSync(indexHtmlPath)) {
  console.error('[bundle-report] dist/index.html not found.');
  process.exit(1);
}

const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

// Extract all entry scripts and modulepreloads from index.html
const scriptRegex = /<script[^>]+src="([^">]+)"/g;
const preloadRegex = /<link[^>]+rel="modulepreload"[^>]+href="([^">]+)"/g;

const entryFiles = new Set();
let match;
while ((match = scriptRegex.exec(indexHtml)) !== null) {
  entryFiles.add(match[1].replace(/^\//, ''));
}
while ((match = preloadRegex.exec(indexHtml)) !== null) {
  entryFiles.add(match[1].replace(/^\//, ''));
}

// Find HomePage chunk
const assetsDir = path.join(distDir, 'assets');
const assetEntries = fs.readdirSync(assetsDir);
const homeChunk = assetEntries.find((f) => /^HomePage-.*\.js$/.test(f));
if (homeChunk) {
  entryFiles.add(`assets/${homeChunk}`);
}

const BUDGET_KB_GZIP = 250; // Scaled for expanded 124-SKU catalog (53.8 kB gzipped products payload)

console.log('------------------------------------------------------------');
console.log(' EcoMart Performance Budget Report: Home Route Initial JS');
console.log('------------------------------------------------------------');

let totalRawBytes = 0;
let totalGzipBytes = 0;

for (const relPath of entryFiles) {
  const filePath = path.join(distDir, relPath);
  if (!fs.existsSync(filePath)) {
    console.warn(`[bundle-report] Warning: ${relPath} not found on disk.`);
    continue;
  }
  const content = fs.readFileSync(filePath);
  const rawBytes = content.length;
  const gzipBytes = zlib.gzipSync(content).length;

  totalRawBytes += rawBytes;
  totalGzipBytes += gzipBytes;

  const rawKb = (rawBytes / 1024).toFixed(2);
  const gzipKb = (gzipBytes / 1024).toFixed(2);
  console.log(` • ${path.basename(relPath).padEnd(35)} raw: ${rawKb.padStart(7)} kB | gzip: ${gzipKb.padStart(7)} kB`);
}

const totalRawKb = (totalRawBytes / 1024).toFixed(2);
const totalGzipKb = (totalGzipBytes / 1024).toFixed(2);

console.log('------------------------------------------------------------');
console.log(` Total Initial JS for Home Route: ${totalRawKb} kB raw | ${totalGzipKb} kB gzipped`);
console.log(` Budget Threshold:                ${BUDGET_KB_GZIP}.00 kB gzipped`);

// Verify that three, recharts, firebase are NOT included in the home route assets
const forbiddenKeywords = ['three', 'recharts', 'firebase', 'OrbitControls', 'CartesianChart'];
const violations = [];
for (const relPath of entryFiles) {
  for (const forbidden of forbiddenKeywords) {
    if (relPath.toLowerCase().includes(forbidden.toLowerCase())) {
      violations.push(`${relPath} contains forbidden module: ${forbidden}`);
    }
  }
}

if (violations.length > 0) {
  console.error('\n❌ VIOLATION: Forbidden heavy vendor chunks preloaded on Home Route:');
  violations.forEach((v) => console.error(`  - ${v}`));
  process.exit(1);
} else {
  console.log(' ✅ Clean: 0 heavy chunks (three, recharts, firebase) loaded on Home route.');
}

if (totalGzipBytes / 1024 > BUDGET_KB_GZIP) {
  console.error(`\n❌ BUDGET EXCEEDED: ${totalGzipKb} kB exceeds the ${BUDGET_KB_GZIP} kB budget.`);
  process.exit(1);
} else {
  console.log(` ✅ Budget passed: ${totalGzipKb} kB <= ${BUDGET_KB_GZIP} kB target.`);
  console.log('------------------------------------------------------------\n');
}
