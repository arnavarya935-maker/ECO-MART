import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env manually
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

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log(`Connecting to Supabase at ${supabaseUrl}...`);
  const productsPath = path.resolve(__dirname, '../src/data/products.json');
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

  console.log(`Seeding ${products.length} products into Supabase "products" table in batches...`);

  const batchSize = 10;
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    let payload = batch;
    let { error } = await supabase
      .from('products')
      .upsert(payload, { onConflict: 'id' });

    if (error && error.message && error.message.includes("'barcode'")) {
      // Remote schema lacks barcode column, strip it for remote sync while keeping local source of truth
      payload = batch.map(({ barcode, ...rest }) => rest);
      const retry = await supabase
        .from('products')
        .upsert(payload, { onConflict: 'id' });
      error = retry.error;
    }

    if (error) {
      console.error(`Failed to seed batch ${i / batchSize + 1}:`, error.message);
      if (error.code === 'PGRST205' || error.message.includes('not find the table')) {
        console.error('\nNOTE: The "products" table does not exist yet.');
        console.error('Please open your Supabase Dashboard -> SQL Editor, run the SQL script in "supabase/schema.sql", and run this seed script again!\n');
      }
      process.exit(1);
    }
    console.log(`  Seeded items ${i + 1} to ${Math.min(i + batchSize, products.length)}`);
  }

  console.log(`Successfully seeded ${products.length} products into Supabase!`);
}

seed().catch((err) => {
  console.error('Unexpected seed error:', err);
  process.exit(1);
});
