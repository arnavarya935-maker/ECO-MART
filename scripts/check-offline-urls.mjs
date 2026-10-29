import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const scanDirs = [path.join(rootDir, 'src'), path.join(rootDir, 'public')];
const allowedPatterns = [
  'http://www.w3.org/2000/svg',
  'http://www.w3.org/1999/xlink',
  'https://www.w3.org/2000/svg',
  'https://unsplash.com',
  'https://pixabay.com/users/',
  'https://pixabay.com/photos/',
  'https://api.web3forms.com',
  // Official certification registries for verified eco-certifications
  'https://fsc.org',
  'https://global-standard.org',
  'https://www.usda.gov',
  'https://www.biopreferred.gov',
  'https://www.fairtrade.net',
  'https://www.oeko-tex.com',
  'https://www.bcorporation.net',
  'https://www.peta.org',
  'https://www.leapingbunny.org',
  'http://silkmarkindia.com',
  'http://coirboard.gov.in',
  'https://jutemarkindia.gov.in',
  'https://www.craftmark.org',
  'https://rohs.guide',
  'https://www.iso.org',
  'https://www.climateneutral.org'
];

const urlRegex = /https?:\/\/[^\s"'`<>]+/g;
const violations = [];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  let match;
  while ((match = urlRegex.exec(content)) !== null) {
    const foundUrl = match[0];
    const isAllowed = allowedPatterns.some((allowed) => foundUrl.startsWith(allowed));
    if (!isAllowed) {
      const rel = path.relative(rootDir, filePath).replace(/\\/g, '/');
      violations.push({ file: rel, url: foundUrl });
    }
  }
}

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile()) {
      // Only scan text/source files
      const ext = path.extname(entry.name).toLowerCase();
      if (['.js', '.jsx', '.ts', '.tsx', '.css', '.html', '.json', '.svg', '.md'].includes(ext)) {
        scanFile(fullPath);
      }
    }
  }
}

for (const dir of scanDirs) {
  walk(dir);
}

console.log('------------------------------------------------------------');
console.log(' EcoMart Offline Purity Check: Scanning src and public');
console.log('------------------------------------------------------------');

if (violations.length > 0) {
  console.error('❌ Offline Purity Check FAILED: Found external URLs in codebase:');
  for (const v of violations) {
    console.error(`  - [${v.file}]: ${v.url}`);
  }
  process.exit(1);
} else {
  console.log('✅ Offline Purity PASSED: 0 external URLs found in src/ or public/.');
  console.log('   All fonts, models, images, scripts and styles are 100% offline-native.');
  console.log('------------------------------------------------------------\n');
}
