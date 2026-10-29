import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsPath = path.resolve(__dirname, '../src/data/products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

function moderateText(text, isConventional = false) {
  if (!text || typeof text !== 'string') return text;

  let s = text;

  // Conventional items retain honest negative facts (Non-Biodegradable, Non-Recyclable, etc.)
  if (isConventional) {
    return s;
  }

  // Name fixes
  s = s.replace(/Zero-Waste Vintage Brass Safety Razor/g, 'Reusable Vintage Brass Safety Razor');
  s = s.replace(/Compostable Bamboo Toothbrush \(Pack of 4\)/g, 'Bamboo Toothbrush with Compostable Handle (Pack of 4)');

  // Replacements
  s = s.replace(/\bpacked in compostable paper\b/gi, 'packed in unbleached paper');
  s = s.replace(/\bPure Organic Cotton Biodegradable\b/gi, 'Pure Organic Cotton Canvas');
  s = s.replace(/\bbiodegradable card and strong enough to hold heavy folders\b/gi, 'sturdy card that holds heavy folders');
  s = s.replace(/\bPlantable Body \(natural material\) & Recyclable Zero Toxic Solvent Adhesives\b/gi, 'Recyclable Kraft Board with Water Adhesives');
  s = s.replace(/\bNatural Biodegradable Tree Latex\b/gi, 'Natural Tree Latex');
  s = s.replace(/\bPlant-based Biodegradable Lather\b/gi, 'Plant-based Lather');
  s = s.replace(/\bRecyclable Metal Wire\b/gi, 'Pure Copper Wire');
  s = s.replace(/\bBiodegradable Body\b/gi, 'Plantable Body');
  s = s.replace(/\bBiodegradable body \(natural material\) and lightweight\b/gi, 'Natural bamboo material and lightweight');
  s = s.replace(/\bRecycled Post-Consumer Kraft Fibers Biodegradable body \(natural material\) & Recyclable Zero Toxic Solvent Adhesives\b/gi, 'Recycled Kraft Fibers • Recyclable Card');
  s = s.replace(/\b10 recyclable Swedish steel blades\b/gi, '10 replaceable steel blades');
  s = s.replace(/\bRecyclable Steel Blades\b/gi, 'Replaceable Steel Blades');
  s = s.replace(/\b100%\s*biodegradable\b/gi, 'Natural');
  s = s.replace(/\b100%\s*recyclable\b/gi, 'Recyclable');
  s = s.replace(/\bcompletely compostable handle & bristles\b/gi, 'Compostable beech handle & coir bristles (check local rules)');
  s = s.replace(/\bcompletely compostable\b/gi, 'Compostable (check local rules)');
  s = s.replace(/\bfully biodegradable\b/gi, 'biodegradable card');
  s = s.replace(/\bcertified Cruelty-free vegan \(seller claim\)/gi, 'Cruelty-free vegan (seller claim)');
  s = s.replace(/\bPure Recyclable Copper Mesh\b/g, 'Pure Copper Mesh');
  s = s.replace(/\b100%\s*infinitely recyclable\b/gi, 'Can be recycled many times');
  s = s.replace(/\binfinitely recyclable\b/gi, 'can be recycled many times');
  s = s.replace(/\b100%\s*home compostable handle\b/gi, 'Bamboo handle can be composted (check local rules)');
  s = s.replace(/\b100%\s*home compostable\b/gi, 'Can be composted at home (check local rules)');
  s = s.replace(/\b100%\s*backyard compostable\b/gi, 'Can be composted at home (check local rules)');
  s = s.replace(/\bbackyard compostable at end of useful life\b/gi, 'Can be composted at home (check local rules)');
  s = s.replace(/\bbackyard compostable\b/gi, 'Can be composted at home (check local rules)');
  s = s.replace(/\b100%\s*compostable\b/gi, 'Handle can be composted (check local rules)');
  s = s.replace(/\b100%\s*plastic[\s-]*free\b/gi, 'Plastic-free');
  s = s.replace(/\b100%\s*plant[\s-]*based\b/gi, 'Plant-based');
  s = s.replace(/\b100%\s*natural\b/gi, 'Natural');
  s = s.replace(/\b100%\s*pure\b/gi, 'Pure');
  s = s.replace(/\b100%\s*recycled\b/gi, 'Recycled');
  s = s.replace(/\b100%\s*post-consumer\b/gi, 'Post-consumer');
  s = s.replace(/\b100%\s*cruelty-free vegan\b/gi, 'Cruelty-free vegan (seller claim)');
  s = s.replace(/\b100%\s*organic\b/gi, 'Organic (seller claim)');

  s = s.replace(/\bcompletely biodegradable\b/gi, 'Biodegradable body (natural material)');
  s = s.replace(/\bcompletely chemical-free\b/gi, 'free of synthetic coatings');
  s = s.replace(/\bchemical-free\b/gi, 'free of synthetic additives');
  s = s.replace(/\bChemical-Free\b/g, 'Free of Synthetic Additives');

  s = s.replace(/\bnon-toxic ink\b/gi, 'water-based ink (seller claim)');
  s = s.replace(/\bNon-Toxic Ink\b/g, 'Water-Based Ink (Seller Claim)');
  s = s.replace(/\bnon-toxic\b/gi, 'mild (seller claim)');

  s = s.replace(/\bcertified organic\b/gi, 'organic (seller claim)');
  s = s.replace(/\bCertified Organic\b/g, 'Organic (Seller Claim)');
  s = s.replace(/\bGOTS Certified\b/g, 'GOTS Organic (Seller Claim)');
  s = s.replace(/\bFSC Certified\b/g, 'FSC Bamboo (Seller Claim)');
  s = s.replace(/\bcertified 100% cruelty-free vegan\b/gi, 'PETA cruelty-free listed by maker');

  s = s.replace(/\bzero-waste\b/gi, 'low-waste');
  s = s.replace(/\bZero-Waste\b/g, 'Low-Waste');

  s = s.replace(/\bzero-plastic\b/gi, 'plastic-free');
  s = s.replace(/\bZero-Plastic\b/g, 'Plastic-Free');

  return s;
}

let modifiedCount = 0;

const updated = products.map((p) => {
  const isConv = p.isEcoFriendly === false || (p.id && p.id.endsWith('-conv'));

  const newName = moderateText(p.name, isConv);
  const newDesc = moderateText(p.description, isConv);
  const newMat = moderateText(p.material, isConv);
  const newPack = moderateText(p.packaging, isConv);
  const newHigh = (p.ecoHighlights || []).map((h) => moderateText(h, isConv));

  let changed = false;
  if (newName !== p.name || newDesc !== p.description || newMat !== p.material || newPack !== p.packaging) {
    changed = true;
  }
  if (JSON.stringify(newHigh) !== JSON.stringify(p.ecoHighlights)) {
    changed = true;
  }

  if (changed) modifiedCount++;

  return {
    ...p,
    name: newName,
    description: newDesc,
    material: newMat,
    packaging: newPack,
    ecoHighlights: newHigh
  };
});

fs.writeFileSync(productsPath, JSON.stringify(updated, null, 2) + '\n', 'utf8');
console.log(`Moderated ${modifiedCount} products in ${productsPath}`);
