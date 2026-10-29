import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateEan13, isValidEan13 } from '../src/lib/barcodeUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsPath = path.resolve(__dirname, '../src/data/products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

let assigned = 0;
const usedBarcodes = new Set();

const updated = products.map((p, idx) => {
  const barcode = generateEan13(idx + 1);
  if (!isValidEan13(barcode)) {
    throw new Error(`Generated invalid barcode: ${barcode}`);
  }
  if (usedBarcodes.has(barcode)) {
    throw new Error(`Duplicate barcode generated: ${barcode}`);
  }
  usedBarcodes.add(barcode);
  assigned++;

  return {
    ...p,
    barcode
  };
});

fs.writeFileSync(productsPath, JSON.stringify(updated, null, 2) + '\n', 'utf8');
console.log(`Successfully assigned ${assigned} unique, valid EAN-13 barcodes to products in ${productsPath}`);

