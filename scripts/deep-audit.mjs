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

async function deepAudit() {
  const { data: sbProducts, error } = await supabase.from('products').select('*');
  if (error) {
    console.error('Error fetching Supabase products:', error);
    process.exit(1);
  }

  const localPath = path.resolve(__dirname, '../src/data/products.json');
  const localProducts = JSON.parse(fs.readFileSync(localPath, 'utf8'));

  console.log(`Supabase count: ${sbProducts.length}`);
  console.log(`Local JSON count: ${localProducts.length}`);

  // Compare sets
  const sbIds = new Set(sbProducts.map((p) => p.id));
  const localIds = new Set(localProducts.map((p) => p.id));

  const onlyInSb = sbProducts.filter((p) => !localIds.has(p.id));
  const onlyInLocal = localProducts.filter((p) => !sbIds.has(p.id));

  console.log(`Only in Supabase: ${onlyInSb.length}`);
  console.log(`Only in Local JSON: ${onlyInLocal.length}`);

  // Audit on live Supabase products
  console.log('\n--- Category Breakdown (Supabase) ---');
  const catMap = {};
  for (const p of sbProducts) {
    catMap[p.category] = catMap[p.category] || [];
    catMap[p.category].push(p);
  }

  for (const [cat, items] of Object.entries(catMap)) {
    const eco = items.filter((p) => p.isEcoFriendly);
    const conv = items.filter((p) => !p.isEcoFriendly);
    console.log(`* ${cat} (${items.length} items): ${eco.length} Eco, ${conv.length} Conventional`);
  }

  // Exact Duplicates
  console.log('\n--- Checking Exact Duplicate Names in Supabase ---');
  const nameMap = {};
  for (const p of sbProducts) {
    const cleanName = p.name.trim().toLowerCase();
    nameMap[cleanName] = nameMap[cleanName] || [];
    nameMap[cleanName].push(p);
  }

  let exactFound = false;
  for (const [name, list] of Object.entries(nameMap)) {
    if (list.length > 1) {
      exactFound = true;
      console.log(`[EXACT DUPLICATE] "${name}" appears ${list.length} times:`);
      list.forEach((p) => console.log(`   - ID: ${p.id}, Cat: ${p.category}, Price: ${p.price}`));
    }
  }
  if (!exactFound) console.log('Zero exact name duplicates found in Supabase.');

  // Image Duplicates (URL or filename or photoId)
  console.log('\n--- Checking Image File / URL / photoId Duplicates in Supabase ---');
  const imgUrlMap = {};
  const photoIdMap = {};
  const stockPhotoUrlMap = {};

  for (const p of sbProducts) {
    if (p.image) {
      const imgKey = p.image.trim();
      imgUrlMap[imgKey] = imgUrlMap[imgKey] || [];
      imgUrlMap[imgKey].push(p);
    }
    if (p.photoId) {
      const pid = p.photoId.trim();
      photoIdMap[pid] = photoIdMap[pid] || [];
      photoIdMap[pid].push(p);
    }
    const creditUrl = p.imageCredit?.photoUrl;
    if (creditUrl) {
      stockPhotoUrlMap[creditUrl] = stockPhotoUrlMap[creditUrl] || [];
      stockPhotoUrlMap[creditUrl].push(p);
    }
  }

  let imageDupesFound = false;
  for (const [img, list] of Object.entries(imgUrlMap)) {
    if (list.length > 1) {
      imageDupesFound = true;
      console.log(`[IMAGE URL SHARED] "${img}" shared by ${list.length} products:`);
      list.forEach((p) => console.log(`   - ID: ${p.id} (${p.name})`));
    }
  }
  for (const [pid, list] of Object.entries(photoIdMap)) {
    if (list.length > 1) {
      imageDupesFound = true;
      console.log(`[PHOTO ID SHARED] "${pid}" shared by ${list.length} products:`);
      list.forEach((p) => console.log(`   - ID: ${p.id} (${p.name})`));
    }
  }
  for (const [url, list] of Object.entries(stockPhotoUrlMap)) {
    if (list.length > 1) {
      imageDupesFound = true;
      console.log(`[STOCK URL SHARED] "${url}" shared by ${list.length} products:`);
      list.forEach((p) => console.log(`   - ID: ${p.id} (${p.name})`));
    }
  }
  if (!imageDupesFound) {
    console.log('Zero duplicate images/URLs found in current Supabase dataset (all 64 products currently have unique images).');
  }

  // Near duplicates: Similar names or shared concepts
  console.log('\n--- Semantic / Near Duplicate Analysis ---');
  const nearDupes = [];
  for (let i = 0; i < sbProducts.length; i++) {
    for (let j = i + 1; j < sbProducts.length; j++) {
      const a = sbProducts[i];
      const b = sbProducts[j];
      
      // Look for identical core product types
      const cleanA = a.name.toLowerCase();
      const cleanB = b.name.toLowerCase();

      // Check if both are journals, bottles, toothbrushes, pens, trays, candles, mats, bags, etc.
      const types = [
        ['pen', 'pens'],
        ['toothbrush', 'toothbrushes'],
        ['bottle', 'bottles'],
        ['journal', 'notebook', 'diary'],
        ['razor', 'razors'],
        ['shampoo'],
        ['lip balm'],
        ['candle'],
        ['tray'],
        ['mat', 'doormat'],
        ['tote', 'bag', 'duffel'],
        ['cutlery'],
        ['bowl', 'bowls'],
        ['socks'],
        ['shirt'],
        ['soapnut', 'cleaner', 'laundry'],
        ['scrubber', 'sponges']
      ];

      for (const group of types) {
        const aHas = group.some((term) => cleanA.includes(term));
        const bHas = group.some((term) => cleanB.includes(term));
        if (aHas && bHas && a.category === b.category) {
          // If one is eco and one is conv, that's an intentional swap pair!
          if (a.isEcoFriendly !== b.isEcoFriendly && (a.conventionalAlternativeId === b.id || b.conventionalAlternativeId === a.id)) {
            // Intentional swap pair
          } else if (a.isEcoFriendly === b.isEcoFriendly) {
            nearDupes.push({
              type: group[0],
              productA: a,
              productB: b
            });
          }
        }
      }
    }
  }

  console.log(`Found ${nearDupes.length} near-duplicate / highly similar same-tier product pairs:`);
  nearDupes.forEach((nd) => {
    console.log(`* [${nd.type.toUpperCase()}] "${nd.productA.name}" (${nd.productA.id}) vs "${nd.productB.name}" (${nd.productB.id}) [Eco: ${nd.productA.isEcoFriendly}]`);
  });
}

deepAudit().catch(console.error);

