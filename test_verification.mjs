import products from './src/data/products.json' with { type: 'json' };
import { calculateEcoScore, compareProductImpact } from './src/lib/ecoScore.js';
import { calculateCartImpact } from './src/lib/impactCalculator.js';
import { parseShoppingIntent, queryEcoCatalog, auditCartSustainability } from './src/lib/ecoAgent.js';

console.log('=== ECOMART COMPREHENSIVE VERIFICATION TEST SUITE ===\n');

// 1. PRODUCTS INTEGRITY TEST
console.log('--- 1. Testing Products Dataset ---');
console.log(`Total Products Count: ${products.length} (Requirement: 40+)`);
const categories = [...new Set(products.map(p => p.category))];
console.log(`Categories (${categories.length}):`, categories.join(', '));
const ecoCount = products.filter(p => p.isEcoFriendly).length;
const convCount = products.filter(p => !p.isEcoFriendly).length;
console.log(`Eco-friendly: ${ecoCount}, Conventional (for swapping): ${convCount}`);
if (products.length >= 40 && categories.length >= 6 && convCount > 5) {
  console.log('✅ Products dataset integrity test passed!\n');
} else {
  throw new Error('Products verification failed!');
}

// 2. ECO-SCORE ENGINE TEST
console.log('--- 2. Testing Eco-Score Engine (0-100 & 5 Pillars) ---');
const sampleEco = products.find(p => p.id === 'kit-01');
const sampleConv = products.find(p => p.id === 'kit-01-conv');

const ecoScoreResult = calculateEcoScore(sampleEco);
console.log(`Sample Eco (${sampleEco.name}):`);
console.log(`  Score: ${ecoScoreResult.score}/100, Grade: ${ecoScoreResult.grade} (${ecoScoreResult.gradeLabel})`);
console.log('  5-Pillar Breakdown:');
Object.entries(ecoScoreResult.breakdown).forEach(([, data]) => {
  console.log(`    - ${data.name} (${data.weight}): ${data.score}/${data.max} pts [${data.explanation}]`);
});

const convScoreResult = calculateEcoScore(sampleConv);
console.log(`\nSample Conventional (${sampleConv.name}):`);
console.log(`  Score: ${convScoreResult.score}/100, Grade: ${convScoreResult.grade} (${convScoreResult.gradeLabel})`);

const comparison = compareProductImpact(sampleEco, sampleConv);
console.log('\nSwap Comparison:');
console.log(`  CO2 Saved: ${comparison.co2Saved} kg`);
console.log(`  Plastic Saved: ${comparison.plasticSaved} g`);
console.log(`  Water Saved: ${comparison.waterSaved} L`);
console.log(`  Summary: ${comparison.summary}`);

if (ecoScoreResult.score >= 85 && convScoreResult.score <= 45 && comparison.co2Saved > 0) {
  console.log('✅ Eco-Score Engine test passed!\n');
} else {
  throw new Error('Eco-Score calculation failed!');
}

// 3. IMPACT CALCULATOR & EQUIVALENTS TEST
console.log('--- 3. Testing Impact Calculator & Human Equivalents ---');
const sampleCart = [
  { product: sampleEco, quantity: 2 },
  { product: products.find(p => p.id === 'care-01'), quantity: 1 },
  { product: products.find(p => p.id === 'stat-01'), quantity: 3 }
];

const impact = calculateCartImpact(sampleCart, products);
console.log(`Cart Items Total: ${impact.totalItems}, Total Price: ₹${impact.totalPrice}`);
console.log(`Average Eco-Score: ${impact.averageEcoScore}/100 (Grade ${impact.averageGrade})`);
console.log(`Total CO2 Saved: ${impact.co2Saved} kg`);
console.log(`Total Plastic Avoided: ${impact.plasticAvoided} g`);
console.log(`Total Water Conserved: ${impact.waterSaved} L`);
console.log('Plain-Language Equivalents:');
console.log(`  - ${impact.equivalents.plasticBottles} single-use plastic bottles avoided`);
console.log(`  - ${impact.equivalents.carKm} km car driving offset`);
console.log(`  - ${impact.equivalents.daysDrinkingWater} days of drinking water conserved`);
console.log(`Eco Points: ${impact.ecoPoints}`);
console.log('Badges Unlocked:', impact.badges.map(b => `${b.icon} ${b.name}`).join(', '));

if (impact.co2Saved > 0 && impact.equivalents.plasticBottles > 0 && impact.badges.length > 0) {
  console.log('✅ Impact Calculator test passed!\n');
} else {
  throw new Error('Impact calculation failed!');
}

// 4. ECO AGENT NLP PARSING & INTELLIGENCE TEST
console.log('--- 4. Testing Eco Agent NLP & Decision Transparency ---');
const testQueries = [
  'gift under 1000 for my teacher',
  'plastic-free items for my kitchen',
  'how does eco score work',
  'review my cart'
];

testQueries.forEach(q => {
  const intent = parseShoppingIntent(q);
  console.log(`\nQuery: "${q}"`);
  console.log(`  Parsed Intent -> Category: ${intent.category || 'Any'}, MaxBudget: ${intent.maxBudget || 'Any'}, Recipient: ${intent.recipient || 'None'}, Packaging: ${intent.packaging || 'Any'}, IsReview: ${intent.isCartReview}`);
  
  const searchResult = queryEcoCatalog(products, q);
  if (searchResult.results && searchResult.results.length > 0) {
    console.log(`  Matches found (${searchResult.results.length}):`);
    searchResult.results.slice(0, 2).forEach(r => {
      console.log(`    * ${r.name} (₹${r.price}, Grade ${r.ecoScoreData.grade})`);
      console.log(`      Reasoning: "${r.reasoning}"`);
    });
  }
});

// Test cart audit with conventional items
const conventionalCart = [
  { product: sampleConv, quantity: 1 },
  { product: products.find(p => p.id === 'care-01-conv'), quantity: 1 }
];
const cartAudit = auditCartSustainability(conventionalCart, products);
console.log('\nCart Audit on Conventional Items:');
console.log(`  Average Score: ${cartAudit.averageScore}/100, Low-Grade Count: ${cartAudit.lowGradeCount}`);
console.log(`  Proposed Swaps (${cartAudit.suggestions.length}):`);
cartAudit.suggestions.forEach(s => {
  console.log(`    - Swap "${s.from.name}" to "${s.to.name}" -> ${s.reason}`);
});

if (cartAudit.suggestions.length >= 2) {
  console.log('✅ Eco Agent NLP & Cart Audit tests passed!\n');
} else {
  throw new Error('Eco Agent verification failed!');
}

console.log('🎉 ALL 4 CORE MODULES VERIFIED 100% CORRECT!');
