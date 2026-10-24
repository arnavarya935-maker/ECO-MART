import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load environment variables from .env.local and .env
function loadEnv() {
  const env = {};
  for (const filename of ['.env.local', '.env']) {
    const fullPath = path.join(rootDir, filename);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const match = trimmed.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          let val = match[2].trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!env[key]) env[key] = val;
        }
      }
    }
  }
  return env;
}

const env = loadEnv();
const UNSPLASH_KEY = env.UNSPLASH_ACCESS_KEY || process.env.UNSPLASH_ACCESS_KEY;
const PIXABAY_KEY = env.PIXABAY_API_KEY || process.env.PIXABAY_API_KEY;

if (!UNSPLASH_KEY && !PIXABAY_KEY) {
  console.error('[Error] Neither UNSPLASH_ACCESS_KEY nor PIXABAY_API_KEY found in .env.local or environment.');
  process.exit(1);
}

const productsJsonPath = path.join(rootDir, 'src/data/products.json');
const publicProductsDir = path.join(rootDir, 'public/images/products');
const outDir = path.join(__dirname, 'out');
const cacheFilePath = path.join(outDir, 'stock-cache.json');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
if (!fs.existsSync(publicProductsDir)) fs.mkdirSync(publicProductsDir, { recursive: true });

// Load cache
let cache = {};
if (fs.existsSync(cacheFilePath)) {
  try {
    cache = JSON.parse(fs.readFileSync(cacheFilePath, 'utf8'));
  } catch {
    cache = {};
  }
}

function saveCache() {
  fs.writeFileSync(cacheFilePath, JSON.stringify(cache, null, 2), 'utf8');
}

// Curated high-res, verified, face-free Pixabay photos for specific products
const DIRECT_PIXABAY_PHOTOS = {
  'home-01': 6668364,      // lemon & blackberry scented candle still life
  'home-04-conv': 215692,   // plastic garden plant pots
  'bag-01': 4364558,        // white organic cotton canvas tote mockup on hook
  'bag-02': 421456,         // natural woven jute shopping tote bag
  'bag-02-conv': 2616768,   // sleek laptop sleeve case for notebook computers
  'bag-03': 1867591,        // rugged canvas travel backpack
  'bag-03-conv': 7365977,   // gym fitness workout duffel bag
  'bag-04': 8544476,        // lemons in reusable mesh net produce bag
  'clean-01': 1118233,      // organic dried soapberries / soap nuts
  'clean-01-conv': 1500058, // laundry washing powder detergent scoop
  'clean-02': 3757293,      // natural wild-harvested sea bath sponges
  'clean-02-conv': 3081410, // dual-sided synthetic cleaning kitchen sponge
  'clean-03': 871135,       // effervescent dissolvable cleaning tablets
  'clean-04': 4017606,      // zero-waste wooden scrub cleaning brush
  'fash-01-conv': 591750,   // folded long-sleeve dress shirts
  'fash-02': 8212405,       // clean pair of casual canvas sneakers
  'fash-02-conv': 371625,   // synthetic athletic running trainers
  'fash-04-conv': 19562,    // athletic crew socks on laundry line
  'home-02-conv': 1283608,  // glasses & bottles on glossy serving tray
  'kit-04-conv': 60466,     // conventional plastic water bottles with caps
  'out-01': 574504,         // vintage outdoor kerosene camping lantern
  'out-01-conv': 7662681,   // tactical handheld LED flashlight torch
  'out-02-conv': 6576738,   // disposable plastic party drinking cups
  'out-03': 940359,         // rolled green yoga exercise mat
  'out-04-conv': 2644454,   // folded warm synthetic fleece travel blanket
  'stat-02-conv': 6527860   // plastic ballpoint pens on desk
};

// Curated query & descriptive alt mapping for all 64 products
const PRODUCT_QUERIES = {
  'kit-01': {
    query: 'bamboo cutlery set',
    alt: 'Handcrafted reusable bamboo fork, spoon, and chopsticks rolled in an organic cotton travel pouch.'
  },
  'kit-01-conv': {
    query: 'disposable plastic cutlery',
    alt: 'Single-use white plastic disposable forks and spoons packed in a plastic sleeve.'
  },
  'kit-02': {
    query: 'coconut shell bowl',
    alt: 'Smooth polished reclaimed natural coconut shell bowls sitting on an unadorned tabletop.'
  },
  'kit-02-conv': {
    query: 'plastic melamine dinner bowl',
    alt: 'Synthetic plastic melamine patterned dinner bowls on a countertop.'
  },
  'kit-03': {
    query: 'beeswax food wrap',
    alt: 'Reusable golden honeycomb patterned beeswax food storage wraps folded on a kitchen counter.'
  },
  'kit-03-conv': {
    query: 'plastic food wrap cling roll',
    alt: 'Disposable transparent PVC plastic food wrap film on a roll with cardboard cutter.'
  },
  'kit-04': {
    query: 'copper water bottle hammered',
    alt: 'Ayurvedic traditional hammered pure copper water bottle with leakproof brass cap.'
  },
  'kit-04-conv': {
    query: 'plastic water bottle',
    alt: 'Single-use disposable transparent PET plastic water bottles with blue screw caps.'
  },
  'care-01': {
    query: 'bamboo toothbrush eco',
    alt: 'Biodegradable natural Moso bamboo toothbrushes with charcoal bristles lying flat.'
  },
  'care-01-conv': {
    query: 'plastic toothbrush colorful',
    alt: 'Conventional injection-molded plastic toothbrushes with colorful nylon bristles.'
  },
  'care-02': {
    query: 'natural soap bar solid shampoo',
    alt: 'Handmade organic solid shampoo bar made with neem and argan botanical extracts.'
  },
  'care-02-conv': {
    query: 'plastic shampoo bottle',
    alt: 'Commercial liquid chemical shampoo in an opaque HDPE plastic pump bottle.'
  },
  'care-03': {
    query: 'metal safety razor vintage',
    alt: 'Precision-machined double-edge brass safety razor with stainless steel knurled handle.'
  },
  'care-03-conv': {
    query: 'disposable plastic razors pack',
    alt: 'Multi-blade disposable blue plastic razors packaged for single-use shaving.'
  },
  'care-04': {
    query: 'lip balm tin aluminum',
    alt: 'Natural raw shea butter and mint conditioning lip balm in a circular screw-top aluminium tin.'
  },
  'care-04-conv': {
    query: 'plastic lip balm tube',
    alt: 'Conventional petroleum jelly twist-up lip balm stick in a printed plastic tube.'
  },
  'fash-01': {
    query: 'organic cotton white shirt',
    alt: 'Breathable handspun organic Khadi cotton button-down shirt neatly folded.'
  },
  'fash-01-conv': {
    query: 'polyester dress shirt',
    alt: 'Classic pressed long-sleeve cotton-polyester blend formal dress shirts neatly folded.'
  },
  'fash-02': {
    query: 'canvas sneakers natural rubber',
    alt: 'Eco-conscious low-top sneakers constructed from organic canvas with vulcanized soles.'
  },
  'fash-02-conv': {
    query: 'white synthetic leather trainers',
    alt: 'Mass-produced synthetic athletic running shoes with molded rubber outsoles.'
  },
  'fash-03': {
    query: 'silk stole scarf textile',
    alt: 'Artisanal cruelty-free Ahimsa peace silk stole draped gracefully across neutral linen.'
  },
  'fash-03-conv': {
    query: 'printed acrylic scarf',
    alt: 'Mass-manufactured synthetic acrylic and polyester printed winter neck scarf.'
  },
  'fash-04': {
    query: 'bamboo socks plain',
    alt: 'Breathable antibacterial crew socks knitted from sustainable organic bamboo viscose.'
  },
  'fash-04-conv': {
    query: 'white athletic crew socks',
    alt: 'Line of freshly washed athletic socks hanging on a wooden clothespin dryer line.'
  },
  'stat-01': {
    query: 'seed paper notebook journal',
    alt: 'Artisanal plantable seed paper journal embedded with marigold and basil herb seeds.'
  },
  'stat-01-conv': {
    query: 'spiral notebook plastic cover',
    alt: 'Plastic-laminated spiral-bound student notebook with bleached wood-pulp pages.'
  },
  'stat-02': {
    query: 'recycled paper pens',
    alt: 'Stationery ballpoint pens rolled from reclaimed newsprint with biodegradable caps.'
  },
  'stat-02-conv': {
    query: 'ballpoint pens plastic',
    alt: 'Standard disposable plastic ballpoint pens with blue ink caps on an office desktop.'
  },
  'stat-03': {
    query: 'wooden desk organizer',
    alt: 'Hand-carved reclaimed teak wood desktop organizer with dedicated smartphone slot.'
  },
  'stat-03-conv': {
    query: 'acrylic desk organizer clear',
    alt: 'Molded clear acrylic plastic desk stationery caddy with multiple compartments.'
  },
  'stat-04': {
    query: 'cork notebook journal',
    alt: 'Sustainable tree-free notebook featuring a textured natural Mediterranean cork hardcover.'
  },
  'stat-04-conv': {
    query: 'leather diary notebook',
    alt: 'Petrochemical synthetic faux-PU leather executive personal diary with elastic band.'
  },
  'home-01': {
    query: 'soy scented candle',
    alt: 'Hand-poured lemon and blackberry scented soy wax candle in an amber glass jar.'
  },
  'home-01-conv': {
    query: 'paraffin candle glass',
    alt: 'Industrial paraffin wax candle scented with synthetic fragrance oils in a plastic tub.'
  },
  'home-02': {
    query: 'wooden serving tray',
    alt: 'Rustic serving tray handcrafted from upcycled pine wood with elegant brass handle inlays.'
  },
  'home-02-conv': {
    query: 'plastic serving tray',
    alt: 'Glossy injection-molded acrylic food serving tray holding glasses and bottles.'
  },
  'home-03': {
    query: 'coir doormat entrance',
    alt: 'Heavy-duty natural coconut coir entrance doormat with durable woven husk fibers.'
  },
  'home-03-conv': {
    query: 'rubber door mat',
    alt: 'Synthetic petroleum-based black PVC rubber scraper floor mat.'
  },
  'home-04': {
    query: 'ceramic plant pot succulent',
    alt: 'Unglazed porous ceramic self-watering herb planter with nutrient-rich potting soil.'
  },
  'home-04-conv': {
    query: 'plastic plant nursery pots',
    alt: 'Stacks of black injection-molded plastic garden seedling nursery pots and containers.'
  },
  'bag-01': {
    query: 'cotton canvas tote bag',
    alt: 'Sturdy heavyweight organic cotton canvas grocery shopping tote bag hanging against a clean wall.'
  },
  'bag-01-conv': {
    query: 'polypropylene non woven shopping bag',
    alt: 'Synthetic non-woven polypropylene plastic grocery bags in bright colors.'
  },
  'bag-02': {
    query: 'jute tote bag weave',
    alt: 'Handcrafted eco-friendly natural woven golden jute shopping tote bag.'
  },
  'bag-02-conv': {
    query: 'laptop sleeve briefcase',
    alt: 'Padded synthetic neoprene protective computer sleeve case for portable laptops.'
  },
  'bag-03': {
    query: 'canvas travel backpack',
    alt: 'Rugged weekend travel backpack crafted from heavy-duty organic canvas and reinforced webbing.'
  },
  'bag-03-conv': {
    query: 'gym sports duffel bag',
    alt: 'Durable synthetic leather gym fitness duffel bag designed for sports training gear.'
  },
  'bag-04': {
    query: 'mesh produce bags cotton',
    alt: 'Reusable organic mesh net grocery produce bag filled with fresh farmers market lemons.'
  },
  'bag-04-conv': {
    query: 'plastic produce grocery bag roll',
    alt: 'Perforated roll of clear ultrathin single-use plastic grocery store produce bags.'
  },
  'out-01': {
    query: 'vintage camping lantern oil',
    alt: 'Solar-rechargeable outdoor camping lantern inspired by vintage glass kerosene lanterns.'
  },
  'out-01-conv': {
    query: 'plastic camping flashlight torch',
    alt: 'Handheld battery-powered tactical LED camping flashlight torch for outdoor illumination.'
  },
  'out-02': {
    query: 'stainless steel thermos flask',
    alt: 'Vacuum-insulated food-grade recycled stainless steel travel flask with silicone seal.'
  },
  'out-02-conv': {
    query: 'disposable cups plastic',
    alt: 'Stack of disposable brightly colored plastic drinking party cups.'
  },
  'out-03': {
    query: 'cork yoga mat rolled',
    alt: 'Eco-friendly non-slip yoga exercise mat rolled neatly on a studio floor.'
  },
  'out-03-conv': {
    query: 'blue foam yoga mat exercise',
    alt: 'Conventional lightweight PVC foam fitness exercise mat in vibrant blue.'
  },
  'out-04': {
    query: 'rolled picnic blanket wool',
    alt: 'Woven organic cotton and wool outdoor picnic blanket secured with genuine leather straps.'
  },
  'out-04-conv': {
    query: 'fleece picnic blanket outdoor',
    alt: 'Soft folded synthetic fleece travel blanket backed with water-resistant polyester.'
  },
  'clean-01': {
    query: 'soap nuts berries organic',
    alt: 'Bowl of natural wild-harvested Himalayan soapberries and soapnuts for eco-friendly laundry.'
  },
  'clean-01-conv': {
    query: 'laundry detergent powder scoop',
    alt: 'Synthetic powdered chemical laundry detergent in an oversized tub with plastic scoop.'
  },
  'clean-02': {
    query: 'natural bath sponge sea',
    alt: 'Compostable dish scrubber and bath sponge made from natural porous wild-harvested sea sponge.'
  },
  'clean-02-conv': {
    query: 'yellow green kitchen sponge',
    alt: 'Commercial dual-sided yellow polyurethane foam sponge with green abrasive scouring pad.'
  },
  'clean-03': {
    query: 'cleaning tablet dissolvable effervescent',
    alt: 'Effervescent plant-based concentrated surface cleaner tablets in compostable paper wrap.'
  },
  'clean-03-conv': {
    query: 'blue glass cleaner spray bottle',
    alt: 'Single-use plastic spray trigger bottle containing blue chemical ammonia window cleaner.'
  },
  'clean-04': {
    query: 'wooden scrub brush bristle',
    alt: 'Zero-waste artisan cleaning brush crafted with beech wood handle and tough natural bristles.'
  },
  'clean-04-conv': {
    query: 'plastic toilet brush holder',
    alt: 'Standard molded polypropylene plastic toilet brush seated in a plastic drip holder caddy.'
  }
};

// Fetch specific Pixabay photo by ID
async function fetchPixabayById(id) {
  if (!PIXABAY_KEY) return null;
  const url = `https://pixabay.com/api/?key=${PIXABAY_KEY}&id=${id}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.hits || data.hits.length === 0) return null;
    const hit = data.hits[0];
    return {
      source: 'Pixabay',
      imageUrl: hit.largeImageURL || hit.webformatURL,
      downloadLocation: null,
      photographer: hit.user || 'Pixabay Contributor',
      photographerUrl: `https://pixabay.com/users/${hit.user}-${hit.user_id}/`,
      photoUrl: hit.pageURL || 'https://pixabay.com',
      license: 'Pixabay Content License'
    };
  } catch (err) {
    console.warn(`[Pixabay ID ${id} Fetch Error]`, err.message);
    return null;
  }
}

// Search Unsplash
async function searchUnsplash(query) {
  if (!UNSPLASH_KEY) return null;
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5&orientation=portrait`;
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` }
    });
    const remaining = res.headers.get('x-ratelimit-remaining');
    if (res.status === 403 || res.status === 429) {
      console.warn(`[Unsplash Rate Limit] Status ${res.status}. Falling back.`);
      return null;
    }
    if (!res.ok) return null;
    const data = await res.json();
    return { results: data.results || [], remaining: parseInt(remaining, 10) };
  } catch (err) {
    console.warn('[Unsplash Fetch Error]', err.message);
    return null;
  }
}

// Search Pixabay
async function searchPixabay(query) {
  if (!PIXABAY_KEY) return null;
  const url = `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(query)}&image_type=photo&orientation=vertical&safesearch=true&per_page=5`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return data.hits || [];
  } catch (err) {
    console.warn('[Pixabay Fetch Error]', err.message);
    return null;
  }
}

// Track Unsplash download endpoint according to API terms
async function trackUnsplashDownload(downloadLocation) {
  if (!downloadLocation || !UNSPLASH_KEY) return;
  try {
    await fetch(downloadLocation, {
      headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` }
    });
  } catch {
    // Non-blocking telemetry
  }
}

// Process downloaded image buffer into sizes and formats
async function processImage(buffer, id) {
  const SIZES = [
    { name: '400', width: 400, height: 500 },
    { name: '800', width: 800, height: 1000 },
    { name: '1200', width: 1200, height: 1500 }
  ];

  for (const size of SIZES) {
    const baseSharp = sharp(buffer)
      .resize(size.width, size.height, {
        fit: 'cover',
        position: sharp.strategy.attention
      });

    // 1. AVIF
    const avifPath = path.join(publicProductsDir, `${id}-${size.name}.avif`);
    await baseSharp.clone().avif({ quality: 75 }).toFile(avifPath);

    // 2. WebP
    const webpPath = path.join(publicProductsDir, `${id}-${size.name}.webp`);
    await baseSharp.clone().webp({ quality: 80 }).toFile(webpPath);

    // 3. JPEG
    const jpgPath = path.join(publicProductsDir, `${id}-${size.name}.jpg`);
    await baseSharp.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(jpgPath);

    // Save main default fallback at 800px as `${id}.jpg`
    if (size.name === '800') {
      const defaultJpgPath = path.join(publicProductsDir, `${id}.jpg`);
      await baseSharp.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(defaultJpgPath);
    }
  }

  // Generate 24x30 LQIP blur placeholder
  const lqipBuffer = await sharp(buffer)
    .resize(24, 30, { fit: 'cover' })
    .webp({ quality: 20 })
    .toBuffer();
  const lqip = `data:image/webp;base64,${lqipBuffer.toString('base64')}`;

  return lqip;
}

// Main execution
async function main() {
  console.log('='.repeat(80));
  console.log(' EcoMart Product Photography Fetcher & Processor (Phase 1)');
  console.log('='.repeat(80));
  console.log(`Unsplash Key: ${UNSPLASH_KEY ? 'Present' : 'None'}`);
  console.log(`Pixabay Key:  ${PIXABAY_KEY ? 'Present' : 'None'}`);

  const products = JSON.parse(fs.readFileSync(productsJsonPath, 'utf8'));
  const processedProducts = [];
  const usedPhotoUrls = new Set();

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const mapping = PRODUCT_QUERIES[p.id];
    const query = mapping ? mapping.query : p.name;
    const altText = mapping ? mapping.alt : `${p.name} - ${p.description}`;

    console.log(`\n[${i + 1}/${products.length}] Product: ${p.id} (${p.name})`);

    let candidate = null;

    // 1. Direct Pixabay photo ID override (curated clean, face-free photos)
    if (DIRECT_PIXABAY_PHOTOS[p.id]) {
      const directId = DIRECT_PIXABAY_PHOTOS[p.id];
      console.log(`  → Loading curated Pixabay photo ID: ${directId}...`);
      candidate = await fetchPixabayById(directId);
      if (candidate) {
        console.log(`  ✓ Pixabay Curated Match: by ${candidate.photographer} (${candidate.photoUrl})`);
        cache[p.id] = candidate;
        saveCache();
      }
    }

    // 2. Local cache check (if not in DIRECT override and url is unused)
    if (!candidate && cache[p.id] && cache[p.id].imageUrl && !usedPhotoUrls.has(cache[p.id].photoUrl)) {
      console.log(`  ✓ Found in local cache (${cache[p.id].source} by ${cache[p.id].photographer})`);
      candidate = cache[p.id];
    }

    // 3. Fallback to API search if still no candidate
    if (!candidate) {
      if (PIXABAY_KEY) {
        console.log(`  → Searching Pixabay for query: "${query}"...`);
        const hits = await searchPixabay(query);
        for (const hit of hits) {
          if (!usedPhotoUrls.has(hit.pageURL)) {
            candidate = {
              source: 'Pixabay',
              imageUrl: hit.largeImageURL || hit.webformatURL,
              downloadLocation: null,
              photographer: hit.user || 'Pixabay Contributor',
              photographerUrl: `https://pixabay.com/users/${hit.user}-${hit.user_id}/`,
              photoUrl: hit.pageURL || 'https://pixabay.com',
              license: 'Pixabay Content License'
            };
            console.log(`  ✓ Pixabay Search Match: by ${candidate.photographer}`);
            break;
          }
        }
      }
    }

    if (!candidate || !candidate.imageUrl) {
      console.error(`  ✗ Failed to find photo for ${p.id}.`);
      continue;
    }

    usedPhotoUrls.add(candidate.photoUrl);
    cache[p.id] = candidate;
    saveCache();

    // Download image
    console.log(`  → Downloading image from ${candidate.imageUrl.slice(0, 60)}...`);
    try {
      const imgRes = await fetch(candidate.imageUrl);
      if (!imgRes.ok) throw new Error(`HTTP ${imgRes.status}`);
      const arrayBuf = await imgRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuf);

      // Trigger Unsplash download tracking if applicable
      if (candidate.downloadLocation) {
        await trackUnsplashDownload(candidate.downloadLocation);
      }

      // Process with sharp: 400, 800, 1200 in AVIF, WebP, JPEG + 24px LQIP
      console.log('  → Processing multi-size (400, 800, 1200) AVIF/WebP/JPG & LQIP...');
      const lqip = await processImage(buffer, p.id);

      // Update product record
      p.image = `/images/products/${p.id}.jpg`;
      p.images = [
        `/images/products/${p.id}.jpg`,
        `/images/products/${p.id}.svg`
      ];
      p.alt = altText;
      p.lqip = lqip;
      p.imageCredit = {
        type: 'stock',
        source: candidate.source,
        photographer: candidate.photographer,
        photographerUrl: candidate.photographerUrl,
        photoUrl: candidate.photoUrl,
        license: candidate.license
      };

      processedProducts.push(p.id);
      console.log(`  ✓ Successfully processed ${p.id}`);
    } catch (err) {
      console.error(`  ✗ Error processing image for ${p.id}:`, err.message);
    }
  }

  // Write updated products.json
  fs.writeFileSync(productsJsonPath, JSON.stringify(products, null, 2), 'utf8');
  console.log('\n' + '='.repeat(80));
  console.log(`✓ Completed: ${processedProducts.length}/${products.length} products processed & verified.`);
  console.log('='.repeat(80));
}

main().catch((err) => {
  console.error('[Fatal Error]', err);
  process.exit(1);
});
