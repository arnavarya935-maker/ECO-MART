import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env
const envPath = path.resolve(__dirname, '../.env');
let supabaseUrl = process.env.VITE_SUPABASE_URL;
let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...parts] = trimmed.split('=');
    const val = parts.join('=').trim().replace(/^["']|["']$/g, '');
    if (key === 'VITE_SUPABASE_URL' && !supabaseUrl) supabaseUrl = val;
    if (key === 'SUPABASE_SERVICE_ROLE_KEY') supabaseKey = val;
    if (key === 'VITE_SUPABASE_ANON_KEY' && !supabaseKey) supabaseKey = val;
  }
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runAudit() {
  console.log('Querying Supabase at:', supabaseUrl);
  const { data: products, error } = await supabase.from('products').select('*');

  if (error) {
    console.error('Supabase fetch error:', error);
    process.exit(1);
  }

  console.log(`\n=== TOTAL PRODUCTS IN SUPABASE: ${products.length} ===`);

  // 1. Products per category
  const categories = {};
  for (const p of products) {
    categories[p.category] = categories[p.category] || [];
    categories[p.category].push(p);
  }

  console.log('\n--- 1. PRODUCTS PER CATEGORY ---');
  for (const [cat, list] of Object.entries(categories)) {
    const ecoCount = list.filter((p) => p.isEcoFriendly).length;
    const convCount = list.filter((p) => !p.isEcoFriendly).length;
    console.log(`Category "${cat}": ${list.length} total (${ecoCount} Eco, ${convCount} Conventional)`);
    for (const p of list) {
      console.log(`  - [${p.id}] ${p.name} | Price: ₹${p.price} | Eco: ${p.isEcoFriendly} | Alt: ${p.conventionalAlternativeId || 'none'}`);
    }
  }

  // 2. Exact and near-duplicate products
  console.log('\n--- 2. EXACT & NEAR DUPLICATE AUDIT ---');
  const nameMap = new Map();
  for (const p of products) {
    const norm = p.name.trim().toLowerCase();
    if (!nameMap.has(norm)) nameMap.set(norm, []);
    nameMap.get(norm).push(p);
  }

  let exactDupesCount = 0;
  for (const [norm, list] of nameMap.entries()) {
    if (list.length > 1) {
      exactDupesCount++;
      console.log(`EXACT DUPLICATE NAME: "${list[0].name}" (${list.length} occurrences):`);
      list.forEach((p) => console.log(`   ID: ${p.id}, Category: ${p.category}, Price: ₹${p.price}, Image: ${p.image}`));
    }
  }
  if (exactDupesCount === 0) console.log('No exact same-name duplicates found by string equality.');

  // Check near duplicates (e.g. string similarity or sharing core keywords)
  console.log('\nChecking near-duplicates...');
  const pairs = [];
  for (let i = 0; i < products.length; i++) {
    for (let j = i + 1; j < products.length; j++) {
      const a = products[i];
      const b = products[j];
      const nameA = a.name.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
      const nameB = b.name.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
      
      // Token overlap
      const wordsA = new Set(nameA.split(' '));
      const wordsB = new Set(nameB.split(' '));
      const intersection = [...wordsA].filter((w) => wordsB.has(w) && w.length > 3);
      
      if (nameA === nameB) {
        // already caught
      } else if (nameA.includes(nameB) || nameB.includes(nameA) || intersection.length >= 3) {
        pairs.push({ a, b, commonWords: intersection });
      }
    }
  }
  console.log(`Found ${pairs.length} potential near-duplicate pairs:`);
  for (const pair of pairs) {
    console.log(`   "${pair.a.name}" [${pair.a.id}] <---> "${pair.b.name}" [${pair.b.id}] (Common: ${pair.commonWords.join(', ')})`);
  }

  // 3. Shared images
  console.log('\n--- 3. SHARED IMAGE FILES OR URLS ---');
  const imageMap = new Map();
  for (const p of products) {
    const img = p.image || 'NO_IMAGE';
    if (!imageMap.has(img)) imageMap.set(img, []);
    imageMap.get(img).push(p);
  }

  let sharedImageCount = 0;
  for (const [img, list] of imageMap.entries()) {
    if (list.length > 1) {
      sharedImageCount++;
      console.log(`IMAGE USED BY ${list.length} PRODUCTS: ${img}`);
      list.forEach((p) => console.log(`   - [${p.id}] ${p.name} (${p.category})`));
    }
  }
  console.log(`Total images shared by >1 product: ${sharedImageCount}`);
}

runAudit().catch(console.error);

