#!/usr/bin/env node
/**
 * scripts/check-data.mjs
 * Read-only validation script to audit the EcoMart product catalogue.
 * Verifies category counts (>= 8 per category), required fields, unique IDs,
 * swap alternative integrity, and numerical consistency.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const productsFilePath = path.join(projectRoot, 'src', 'data', 'products.json');

console.log('🔍 EcoMart Catalogue Audit Tool (Read-Only)');
console.log(`📁 File: ${productsFilePath}\n`);

if (!fs.existsSync(productsFilePath)) {
  console.error(`❌ Error: Catalogue file not found at ${productsFilePath}`);
  process.exit(1);
}

let products;
try {
  const content = fs.readFileSync(productsFilePath, 'utf8');
  products = JSON.parse(content);
} catch (err) {
  console.error(`❌ Error parsing JSON: ${err.message}`);
  process.exit(1);
}

if (!Array.isArray(products) || products.length === 0) {
  console.error('❌ Error: products.json does not contain a non-empty array of products.');
  process.exit(1);
}

let errorCount = 0;
const MIN_PER_CATEGORY = 8;
const categoryMap = {};
const idSet = new Set();
const productMap = new Map();

// 1. Audit IDs, Required Fields, and Types
products.forEach((p, idx) => {
  const label = p.id || `Product[${idx}]`;

  // ID uniqueness
  if (!p.id) {
    console.error(`❌ Missing 'id' at index ${idx}`);
    errorCount++;
  } else if (idSet.has(p.id)) {
    console.error(`❌ Duplicate product ID: "${p.id}"`);
    errorCount++;
  } else {
    idSet.add(p.id);
    productMap.set(p.id, p);
  }

  // Name
  if (!p.name || typeof p.name !== 'string' || !p.name.trim()) {
    console.error(`❌ ${label}: Missing or invalid 'name'`);
    errorCount++;
  }

  // Category
  if (!p.category || typeof p.category !== 'string' || !p.category.trim()) {
    console.error(`❌ ${label}: Missing or invalid 'category'`);
    errorCount++;
  } else {
    categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
  }

  // Price
  if (typeof p.price !== 'number' || p.price <= 0) {
    console.error(`❌ ${label}: Invalid 'price' (${p.price}), expected positive number`);
    errorCount++;
  }

  // Material & Packaging
  if (!p.material || typeof p.material !== 'string') {
    console.error(`❌ ${label}: Missing or invalid 'material'`);
    errorCount++;
  }
  if (!p.packaging || typeof p.packaging !== 'string') {
    console.error(`❌ ${label}: Missing or invalid 'packaging'`);
    errorCount++;
  }

  // Carbon Kg
  if (typeof p.carbonKg !== 'number' || p.carbonKg < 0) {
    console.error(`❌ ${label}: Invalid 'carbonKg' (${p.carbonKg}), expected non-negative number`);
    errorCount++;
  }

  // Certifications
  if (!Array.isArray(p.certifications)) {
    console.error(`❌ ${label}: 'certifications' should be an array`);
    errorCount++;
  }
});

// 2. Audit Swap Links (conventionalAlternativeId)
let swapLinksChecked = 0;
products.forEach((p) => {
  if (p.isEcoFriendly && p.conventionalAlternativeId) {
    swapLinksChecked++;
    if (!productMap.has(p.conventionalAlternativeId)) {
      console.error(`❌ Product "${p.id}" links to nonexistent alternative "${p.conventionalAlternativeId}"`);
      errorCount++;
    }
  }
});

// 3. Category Breakdown & Minimum Threshold Check
console.log('📦 Category Distribution:');
const categories = Object.keys(categoryMap).sort();
let belowThreshold = 0;

categories.forEach((cat) => {
  const count = categoryMap[cat];
  const isSufficient = count >= MIN_PER_CATEGORY;
  const mark = isSufficient ? '✅' : '❌';
  console.log(`   ${mark} ${cat.padEnd(22)} : ${count} items (minimum: ${MIN_PER_CATEGORY})`);
  if (!isSufficient) {
    belowThreshold++;
    errorCount++;
  }
});

console.log('\n📊 Summary Metrics:');
console.log(`   • Total Products          : ${products.length}`);
console.log(`   • Total Categories        : ${categories.length}`);
console.log(`   • Eco-Friendly Items      : ${products.filter((p) => p.isEcoFriendly).length}`);
console.log(`   • Conventional Items      : ${products.filter((p) => !p.isEcoFriendly).length}`);
console.log(`   • Verified Swap Links     : ${swapLinksChecked}`);
console.log(`   • Categories < ${MIN_PER_CATEGORY} Items  : ${belowThreshold}`);

if (errorCount > 0) {
  console.error(`\n❌ Catalogue check FAILED with ${errorCount} error(s).`);
  process.exit(1);
}

console.log('\n✅ ALL CATALOGUE AUDIT CHECKS PASSED (Every category has >= 8 products, zero errors).');
process.exit(0);
