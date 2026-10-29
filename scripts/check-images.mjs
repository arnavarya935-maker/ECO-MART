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

// Check for duplicate files across DIFFERENT products
let fileDuplicatesFound = false;
for (const [hash, fileList] of hashToFileMap.entries()) {
  if (fileList.length > 1) {
    // Extract product ID prefixes (e.g. 'kit-01-800.jpg' -> 'kit-01', 'kit-01.jpg' -> 'kit-01')
    const distinctPrefixes = new Set(
      fileList.map((f) => f.replace(/-(400|800|1200)\.(avif|webp|jpg)$/, '').replace(/\.(jpg|svg)$/, ''))
    );
    if (distinctPrefixes.size > 1) {
      fileDuplicatesFound = true;
      console.error(`[ERROR: DUPLICATE FILES ACROSS PRODUCTS] Hash ${hash.slice(0, 10)} shared by distinct products: ${[...distinctPrefixes].join(', ')} (${fileList.join(', ')})`);
    }
  }
}

// 2. Cross-reference products with images, metadata, credits, and variants
const missingPhotos = [];
const missingVariants = [];
const missingMetadata = [];
const productHashes = new Map(); // hash -> [productId]
const productUrls = new Map(); // photoUrl -> [productId]
const productImgMap = new Map(); // productId -> imageFile

let totalWebp400Size = 0;
let webp400Count = 0;

for (const p of products) {
  // Validate primary image
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

  // Validate photoUrl uniqueness from imageCredit
  if (p.imageCredit && p.imageCredit.photoUrl) {
    const u = p.imageCredit.photoUrl;
    if (!productUrls.has(u)) productUrls.set(u, []);
    productUrls.get(u).push(p.id);
  }

  // Validate 9 responsive variants: [400, 800, 1200] x [avif, webp, jpg]
  const expectedVariants = [
    `${p.id}-400.avif`, `${p.id}-400.webp`, `${p.id}-400.jpg`,
    `${p.id}-800.avif`, `${p.id}-800.webp`, `${p.id}-800.jpg`,
    `${p.id}-1200.avif`, `${p.id}-1200.webp`, `${p.id}-1200.jpg`
  ];

  for (const v of expectedVariants) {
    const vPath = path.join(imagesDir, v);
    if (!fs.existsSync(vPath)) {
      missingVariants.push({ id: p.id, variant: v });
    } else if (v.endsWith('-400.webp')) {
      const size = fs.statSync(vPath).size;
      totalWebp400Size += size;
      webp400Count++;
    }
  }

  // Validate descriptive alt text
  if (!p.alt || typeof p.alt !== 'string' || p.alt.trim().length < 20) {
    missingMetadata.push({ id: p.id, field: 'alt', reason: `Alt text too short or missing: "${p.alt || ''}"` });
  }

  // Validate LQIP inline placeholder
  if (!p.lqip || !p.lqip.startsWith('data:image/webp;base64,')) {
    missingMetadata.push({ id: p.id, field: 'lqip', reason: 'Missing or invalid LQIP base64 data URI' });
  }

  // Validate imageCredit
  if (!p.imageCredit) {
    missingMetadata.push({ id: p.id, field: 'imageCredit', reason: 'Missing imageCredit object' });
  } else {
    const reqFields = ['source', 'photographer', 'photoUrl', 'license'];
    for (const f of reqFields) {
      if (!p.imageCredit[f] || typeof p.imageCredit[f] !== 'string' || !p.imageCredit[f].trim()) {
        missingMetadata.push({ id: p.id, field: `imageCredit.${f}`, reason: `Missing required field: ${f}` });
      }
    }
  }
}

// Check for missing photos
if (missingPhotos.length > 0) {
  console.error(`\n[ERROR: MISSING PHOTOS] ${missingPhotos.length} product(s) have missing photos:`);
  missingPhotos.forEach((m) => console.error(`  - ${m.id} (${m.name}): ${m.reason}`));
}

// Check for missing responsive variants
if (missingVariants.length > 0) {
  console.error(`\n[ERROR: MISSING VARIANTS] ${missingVariants.length} variant file(s) missing:`);
  missingVariants.slice(0, 10).forEach((m) => console.error(`  - ${m.id}: missing ${m.variant}`));
  if (missingVariants.length > 10) console.error(`  ... and ${missingVariants.length - 10} more`);
}

// Check for missing metadata
if (missingMetadata.length > 0) {
  console.error(`\n[ERROR: MISSING METADATA] ${missingMetadata.length} product metadata issue(s):`);
  missingMetadata.forEach((m) => console.error(`  - ${m.id} [${m.field}]: ${m.reason}`));
}

// Check for products sharing identical primary images
let productDuplicatesFound = false;
for (const [hash, pidList] of productHashes.entries()) {
  if (pidList.length > 1) {
    productDuplicatesFound = true;
    console.error(`\n[ERROR: SHARED IMAGE HASH] Hash ${hash.slice(0, 10)} shared across products:`);
    pidList.forEach((id) => console.error(`  - Product ID: ${id} (file: ${productImgMap.get(id)})`));
  }
}

// Check for products sharing identical photo URLs
let duplicateUrlsFound = false;
for (const [pUrl, pidList] of productUrls.entries()) {
  if (pidList.length > 1) {
    duplicateUrlsFound = true;
    console.error(`\n[ERROR: SHARED PHOTO URL] URL "${pUrl}" shared across products: ${pidList.join(', ')}`);
  }
}

if (fileDuplicatesFound || missingPhotos.length > 0 || missingVariants.length > 0 || missingMetadata.length > 0 || productDuplicatesFound || duplicateUrlsFound) {
  console.error('\n❌ check-images failed: issues detected in product catalog images or metadata.');
  process.exit(1);
}

const avgWebp400Kb = webp400Count > 0 ? (totalWebp400Size / webp400Count / 1024).toFixed(1) : 0;
console.log(`\n[check-images] Performance Stats:`);
console.log(`  - Products verified: ${products.length}/${products.length}`);
console.log(`  - 400px WebP thumbnails indexed: ${webp400Count}`);
console.log(`  - Average 400px WebP thumbnail size: ${avgWebp400Kb} KB (Budget: <= 40 KB)`);
console.log('\n✅ check-images passed: 100% of products have unique images, all 9 responsive variants, descriptive alt text, LQIP blur, and full credits!\n');
process.exit(0);
