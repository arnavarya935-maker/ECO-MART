import fs from 'node:fs';
import path from 'node:path';

const productsPath = path.resolve('src/data/products.json');
const creditsPath = path.resolve('public/images/CREDITS.md');
const imagesDir = path.resolve('public/images/products');

const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

console.log('=== Eco Sense Product Image Mismatch Scanner ===');

// Rules for identifying mismatched photos:
// 1. Specifically reported live defects:
//    - out-07 (coconut shell soap dish showing bread)
//    - clean-01 / clean products showing nuts / edible food
//    - clean-02, clean-04 (showing confetti / torch / bath sponge / cutlery instead of toilet brush / loofah coir scrubber)
//    - clean-03 (cleaner tabs showing blue 2kg tub or latex gloves)
//    - bag-01 (tote bag showing clothes rack)
//    - clean-02-conv, clean-03-conv, clean-04-conv (reusing laundry powder photo for glass cleaner / toilet brush)
// 2. Clear semantic category & subject mismatches:
//    - Product is in Cleaning & Laundry but photo is food, cutlery, or clothing
//    - Product is in Bags but photo is a clothes rack, wardrobe, or furniture
//    - Product is in Kitchen/Travel but photo is bread when product is a non-food durable (soap dish)

function isMismatched(product) {
  const id = product.id;
  const name = product.name.toLowerCase();
  const cat = product.category.toLowerCase();
  const alt = (product.alt || '').toLowerCase();
  const query = (product.imageQuery || '').toLowerCase();
  const photoId = (product.photoId || '').toLowerCase();
  const photoUrl = (product.imageCredit?.photoUrl || '').toLowerCase();

  // 1. Coconut shell soap dish showing bread
  if (id === 'out-07' || (name.includes('soap dish') && (alt.includes('bread') || photoUrl.includes('bread') || query.includes('bread')))) {
    return { mismatched: true, reason: 'Soap dish shows bread photo instead of coconut shell holder' };
  }

  // 2. Bags showing clothes rack
  if (cat.includes('bag') && (id === 'bag-01' || alt.includes('clothes rack') || alt.includes('hanging against') || photoUrl.includes('wall') || photoUrl.includes('rack'))) {
    return { mismatched: true, reason: 'Tote bag photo shows clothes rack / wall hanging background' };
  }

  // 3. Cleaning & Laundry products showing nuts, confetti, torch, or reused cutlery/powder
  if (cat.includes('cleaning')) {
    if (id === 'clean-01' || photoUrl.includes('nuts') || photoUrl.includes('almonds') || alt.includes('nuts') || alt.includes('almond')) {
      return { mismatched: true, reason: 'Soapnut cleaner shows edible nuts (almonds/hazelnuts) instead of soapberries' };
    }
    if (id === 'clean-02' || photoId === 'photo-1584308666744-24d5c474f2ae' || alt.includes('sponge') && name.includes('coir')) {
      return { mismatched: true, reason: 'Dish scrubber shows cutlery/torch/party background or sea bath sponge instead of coir scrubber' };
    }
    if (id === 'clean-03' || name.includes('cleaner tabs')) {
      return { mismatched: true, reason: 'Surface cleaner tabs shows blue 2kg powder container / surgical gloves' };
    }
    if (id === 'clean-04' || photoId === 'photo-1584308666744-24d5c474f2ae') {
      return { mismatched: true, reason: 'Artisan toilet brush shows cutlery or confetti/torch instead of beechwood brush' };
    }
    if (id === 'clean-02-conv' || id === 'clean-03-conv' || id === 'clean-04-conv') {
      if (photoId === 'photo-1585670210693-e7fdd16b142e' || alt.includes('washing powder')) {
        return { mismatched: true, reason: 'Reuses synthetic laundry powder tub photo for sponge/caddy/glass cleaner' };
      }
    }
  }

  return { mismatched: false };
}

const mismatchedList = [];

for (const p of products) {
  const check = isMismatched(p);
  if (check.mismatched) {
    mismatchedList.push({ product: p, reason: check.reason });
  }
}

console.log(`\nFound ${mismatchedList.length} mismatched product photos:`);
mismatchedList.forEach(({ product, reason }) => {
  console.log(`- [${product.id}] "${product.name}" (${product.category})`);
  console.log(`    Current: ${product.image}`);
  console.log(`    Issue:   ${reason}`);
});

// Switch each mismatched product to its existing SVG placeholder beside it
let updatedCount = 0;
for (const item of mismatchedList) {
  const p = item.product;
  const targetSvg = `/images/products/${p.id}.svg`;
  const svgDiskPath = path.join(imagesDir, `${p.id}.svg`);
  
  if (fs.existsSync(svgDiskPath)) {
    p.image = targetSvg;
    p.images = [targetSvg];
    updatedCount++;
    console.log(`  -> Switched ${p.id} to placeholder ${targetSvg}`);
  } else {
    console.warn(`  -> Warning: SVG placeholder not found on disk for ${p.id}: ${svgDiskPath}`);
  }
}

// Write updated products.json
fs.writeFileSync(productsPath, JSON.stringify(products, null, 2) + '\n', 'utf-8');
console.log(`\nUpdated ${updatedCount} products in ${productsPath}`);

// Update CREDITS.md with "Needs a better photo" list
let creditsContent = fs.readFileSync(creditsPath, 'utf-8');
const needsPhotoSection = `\n\n## Needs a Better Photo (Placeholder SVG Active)\n\nThe following products currently display on-brand vector SVG placeholders because available stock photos did not accurately match the product description:\n\n` +
  mismatchedList.map(({ product, reason }) => `- **\`${product.id}\`** — *${product.name}* (${product.category}): ${reason}. Using \`${product.id}.svg\`.`).join('\n') + '\n';

// Remove existing "Needs a Better Photo" section if present, then append
creditsContent = creditsContent.split('## Needs a Better Photo')[0].trim() + needsPhotoSection;
fs.writeFileSync(creditsPath, creditsContent, 'utf-8');
console.log(`Updated ${creditsPath} with "Needs a better photo" list.`);
