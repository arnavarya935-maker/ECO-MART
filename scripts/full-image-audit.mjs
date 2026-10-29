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

async function fullImageAudit() {
  const { data: products, error } = await supabase.from('products').select('*');
  if (error) {
    console.error('Error fetching Supabase products:', error);
    process.exit(1);
  }

  console.log(`\n=================== COMPREHENSIVE IMAGE AUDIT (${products.length} PRODUCTS) ===================`);

  // Check 1: image path (/images/products/...)
  const imageFieldMap = new Map();
  // Check 2: photoId
  const photoIdMap = new Map();
  // Check 3: imageQuery
  const imageQueryMap = new Map();
  // Check 4: photographer
  const photographerMap = new Map();
  // Check 5: imageCredit.photoUrl
  const photoUrlMap = new Map();

  for (const p of products) {
    const img = p.image || 'none';
    if (!imageFieldMap.has(img)) imageFieldMap.set(img, []);
    imageFieldMap.get(img).push(p);

    if (p.photoId) {
      if (!photoIdMap.has(p.photoId)) photoIdMap.set(p.photoId, []);
      photoIdMap.get(p.photoId).push(p);
    }

    if (p.imageQuery) {
      if (!imageQueryMap.has(p.imageQuery)) imageQueryMap.set(p.imageQuery, []);
      imageQueryMap.get(p.imageQuery).push(p);
    }

    if (p.photographer) {
      if (!photographerMap.has(p.photographer)) photographerMap.set(p.photographer, []);
      photographerMap.get(p.photographer).push(p);
    }

    const creditUrl = p.imageCredit?.photoUrl;
    if (creditUrl) {
      if (!photoUrlMap.has(creditUrl)) photoUrlMap.set(creditUrl, []);
      photoUrlMap.get(creditUrl).push(p);
    }
  }

  console.log('\n1. Primary image file paths:');
  let dupImages = 0;
  for (const [img, list] of imageFieldMap.entries()) {
    if (list.length > 1) {
      dupImages++;
      console.log(`   DUPLICATE PATH "${img}": shared by ${list.length} products: ${list.map(x => x.id).join(', ')}`);
    }
  }
  if (dupImages === 0) console.log('   All 64 products currently have distinct local filename paths (/images/products/${id}.jpg).');

  console.log('\n2. Underlying photoId / Unsplash-Pixabay asset IDs:');
  for (const [pid, list] of photoIdMap.entries()) {
    if (list.length > 1) {
      console.log(`   SHARED ASSET ID "${pid}" (${list.length} products):`);
      list.forEach(p => console.log(`      * [${p.id}] ${p.name} (Category: ${p.category})`));
    }
  }

  console.log('\n3. Image Queries:');
  for (const [q, list] of imageQueryMap.entries()) {
    if (list.length > 1) {
      console.log(`   SHARED IMAGE QUERY "${q}" (${list.length} products):`);
      list.forEach(p => console.log(`      * [${p.id}] ${p.name}`));
    }
  }

  console.log('\n4. Stock Credit Photo URLs:');
  for (const [url, list] of photoUrlMap.entries()) {
    if (list.length > 1) {
      console.log(`   SHARED CREDIT URL "${url}" (${list.length} products):`);
      list.forEach(p => console.log(`      * [${p.id}] ${p.name}`));
    }
  }
}

fullImageAudit().catch(console.error);

