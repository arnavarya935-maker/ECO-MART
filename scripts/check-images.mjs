import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const productsPath = path.resolve('src/data/products.json');
const imagesDir = path.resolve('public/images/products');

if (!fs.existsSync(productsPath)) {
  console.error('Error: products.json not found at', productsPath);
  process.exit(1);
}

if (!fs.existsSync(imagesDir)) {
  console.error('Error: public/images/products directory not found at', imagesDir);
  process.exit(1);
}

const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
console.log(`[check-images] Scanning ${products.length} products in catalog...`);

// 1. Hash every file in public/images/products
const fileHashMap = new Map(); // filename -> sha256
const hashToFileMap = new Map(); // sha256 -> [filenames]

const allFiles = fs.readdirSync(imagesDir);
for (const file of allFiles) {
  const filePath = path.join(imagesDir, file);
  const stat = fs.statSync(filePath);
  if (stat.isFile()) {
    const content = fs.readFileSync(filePath);
    const hash = crypto.createHash('sha256').update(content).digest('hex');
    fileHashMap.set(file, hash);
    if (!hashToFileMap.has(hash)) {
      hashToFileMap.set(hash, []);
    }
    hashToFileMap.get(hash).push(file);
  }
}

console.log(`[check-images] Indexed ${fileHashMap.size} files in public/images/products.`);

// Check for duplicate files in public/images/products
let fileDuplicatesFound = false;
for (const [hash, fileList] of hashToFileMap.entries()) {
  if (fileList.length > 1) {
    fileDuplicatesFound = true;
    console.error(`[ERROR: DUPLICATE FILES] Hash ${hash.slice(0, 10)} shared by: ${fileList.join(', ')}`);
  }
}

// 2. Cross-reference products with images
const missingPhotos = [];
const productHashes = new Map(); // hash -> [productId]
const productImgMap = new Map(); // productId -> imageFile

for (const p of products) {
  if (!p.image) {
    missingPhotos.push({ id: p.id, name: p.name, reason: 'No image property specified' });
    continue;
  }

  const baseFile = path.basename(p.image);
  const fullPath = path.join(imagesDir, baseFile);

  if (!fs.existsSync(fullPath)) {
    missingPhotos.push({ id: p.id, name: p.name, reason: `File does not exist: ${p.image}` });
    continue;
  }

  const hash = fileHashMap.get(baseFile);
  productImgMap.set(p.id, baseFile);
  if (!productHashes.has(hash)) {
    productHashes.set(hash, []);
  }
  productHashes.get(hash).push(p.id);
}

// Check for missing photos
if (missingPhotos.length > 0) {
  console.error(`\n[ERROR: MISSING PHOTOS] ${missingPhotos.length} product(s) have missing photos:`);
  missingPhotos.forEach(m => console.error(`  - ${m.id} (${m.name}): ${m.reason}`));
}

// Check for products sharing identical images
let productDuplicatesFound = false;
for (const [hash, pidList] of productHashes.entries()) {
  if (pidList.length > 1) {
    productDuplicatesFound = true;
    console.error(`\n[ERROR: SHARED IMAGE] Hash ${hash.slice(0, 10)} shared across products:`);
    pidList.forEach(id => console.error(`  - Product ID: ${id} (file: ${productImgMap.get(id)})`));
  }
}

if (fileDuplicatesFound || missingPhotos.length > 0 || productDuplicatesFound) {
  console.error('\n❌ check-images failed: duplicate or missing product images found.');
  process.exit(1);
}

console.log('✅ check-images passed: 100% of products have unique images and zero duplicates found in public/images/products.\n');
process.exit(0);
