import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsPath = path.resolve(__dirname, '../src/data/products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

const FORBIDDEN_MARKETING = [
  '100%',
  'compostable',
  'recyclable',
  'biodegradable',
  'chemical-free',
  'non-toxic',
  'certified',
  'zero-waste',
  'zero-plastic',
  'carbon neutral',
  'lab',
  'award'
];

const results = [];

for (const p of products) {
  const fields = {
    name: p.name || '',
    description: p.description || '',
    material: p.material || '',
    packaging: p.packaging || '',
    ecoHighlights: (p.ecoHighlights || []).join(' ')
  };

  const matches = [];

  for (const [fieldName, val] of Object.entries(fields)) {
    for (const term of FORBIDDEN_MARKETING) {
      const rx = new RegExp(`\\b${term.replace('%', '\\%')}\\b`, 'i');
      if (rx.test(val)) {
        matches.push({ field: fieldName, term, snippet: val });
      }
    }
  }

  if (matches.length > 0) {
    results.push({
      id: p.id,
      name: p.name,
      matches
    });
  }
}

console.log(`Audited ${products.length} products. Found ${results.length} products with marketing claim terms:\n`);
results.forEach((r) => {
  console.log(`- [${r.id}] ${r.name}`);
  r.matches.forEach((m) => {
    console.log(`    ${m.field}: "${m.term}" in snippet: "${m.snippet}"`);
  });
});

