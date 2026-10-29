/**
 * Eco Agent Regression Test Suite
 * Validates relevance-first item parsing, honest not-found handling,
 * ambiguity resolution, budget isolation across topics, and impact math.
 */

import fs from 'node:fs';
import path from 'node:path';
import {
  parseShoppingIntent,
  queryEcoCatalog,
  sendAgentQuery,
  scoreItemRelevance
} from '../src/lib/ecoAgent.js';

// Load verified catalogue
const productsPath = path.resolve('src/data/products.json');
const allProducts = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

let passed = 0;
let failed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${testName} - ${details}`);
    failed++;
  }
}

async function runTests() {
  console.log('========================================');
  console.log('🧪 RUNNING ECO AGENT REGRESSION TESTS');
  console.log('========================================\n');

  // TEST 1: "i am a college student i want a affordable brush and soap"
  console.log('--- Test 1: "i am a college student i want a affordable brush and soap" ---');
  const q1 = "i am a college student i want a affordable brush and soap";
  const intent1 = parseShoppingIntent(q1);
  const res1 = queryEcoCatalog(allProducts, q1);
  const fullRes1 = await sendAgentQuery({ query: q1, allProducts, cartItems: [] });

  assert(!intent1.isGoalPlanning, 'Query 1 is NOT treated as goal-planning/dorm basket');
  assert(intent1.maxBudget === null, 'Query 1 does NOT invent a ₹1000 budget');
  assert(intent1.sortBy === 'price-asc', 'Query 1 sets sort to price ascending');
  assert(
    intent1.requestedItems && intent1.requestedItems.length >= 2,
    'Query 1 parsed both requested items ("brush" and "soap")',
    JSON.stringify(intent1.requestedItems)
  );

  const returnedProductNames = (res1.results || []).map((p) => p.name.toLowerCase());
  const hasCandle = returnedProductNames.some((n) => n.includes('candle'));
  const hasLipBalm = returnedProductNames.some((n) => n.includes('lip balm'));
  const hasSeedPens = returnedProductNames.some((n) => n.includes('pen'));
  const hasBrush = returnedProductNames.some((n) => n.includes('brush'));

  assert(!hasCandle && !hasLipBalm && !hasSeedPens, 'Query 1 does NOT return candle, lip balm, or seed pens');
  assert(hasBrush, 'Query 1 returns a brush (e.g. bamboo toothbrush or beech wood brush)');
  assert(
    res1.explanation.toLowerCase().includes('soap') &&
    (res1.explanation.toLowerCase().includes('couldn\'t find') || res1.explanation.toLowerCase().includes('alternative') || returnedProductNames.some(n => n.includes('soap'))),
    'Query 1 honestly handles soap (found or closest natural alternative)'
  );
  assert(fullRes1.basketPlan === null, 'Query 1 does NOT attach a generic conscious basket plan');
  console.log('Sample answer:\n' + (res1.explanation || fullRes1.message) + '\n');

  // TEST 2: "shampoo bar"
  console.log('--- Test 2: "shampoo bar" ---');
  const q2 = "shampoo bar";
  const res2 = queryEcoCatalog(allProducts, q2);
  const items2 = res2.results || [];
  assert(items2.length > 0, 'Query 2 returns products');
  const allShampoo = items2.every((p) => p.name.toLowerCase().includes('shampoo') || p.description.toLowerCase().includes('shampoo') || p.name.toLowerCase().includes('bar'));
  assert(allShampoo, 'Query 2 returns matching shampoo bar items only');
  assert(items2[0].id === 'care-02', 'Top recommendation is care-02 (Solid Shampoo & Cleansing Bar)');
  console.log(`Top result: ${items2[0]?.name} (₹${items2[0]?.price})\n`);

  // TEST 3: "bamboo toothbrush under 150"
  console.log('--- Test 3: "bamboo toothbrush under 150" ---');
  const q3 = "bamboo toothbrush under 150";
  const intent3 = parseShoppingIntent(q3);
  const res3 = queryEcoCatalog(allProducts, q3);
  assert(intent3.maxBudget === 150, 'Query 3 parsed budget ceiling of ₹150');
  const itemsUnder150 = (res3.results || []).filter((p) => p.price <= 150 && p.name.toLowerCase().includes('toothbrush'));
  // In catalogue care-01 is ₹249, so no bamboo toothbrush is <= 150
  if (res3.isCategoryBudgetClosest) {
    assert(res3.results[0]?.name.toLowerCase().includes('toothbrush'), 'Query 3 provided closest real toothbrush option');
  } else {
    assert(itemsUnder150.length === 0, 'Query 3 strictly enforced budget or honestly reported no matches under ₹150');
  }
  console.log(`Result count: ${res3.results?.length || 0}\n`);

  // TEST 4: "gift for my mom under 800"
  console.log('--- Test 4: "gift for my mom under 800" ---');
  const q4 = "gift for my mom under 800";
  const intent4 = parseShoppingIntent(q4);
  const res4 = queryEcoCatalog(allProducts, q4);
  assert(intent4.isGift, 'Query 4 identified gift intent');
  assert(intent4.recipient === 'mom', 'Query 4 identified recipient as "mom"');
  assert(intent4.maxBudget === 800, 'Query 4 set maxBudget to ₹800');
  const allUnder800 = (res4.results || []).every((p) => p.price <= 800);
  assert(allUnder800 && (res4.results || []).length > 0, 'Query 4 all recommended items are <= ₹800');
  console.log(`Found ${res4.results?.length} gift options under ₹800 for mom\n`);

  // TEST 5: "cheapest soap"
  console.log('--- Test 5: "cheapest soap" ---');
  const q5 = "cheapest soap";
  const intent5 = parseShoppingIntent(q5);
  const res5 = queryEcoCatalog(allProducts, q5);
  assert(intent5.sortBy === 'price-asc', 'Query 5 sets sort by price ascending');
  assert(intent5.isAffordable, 'Query 5 identified affordable/cheap intent');
  assert((res5.results || []).length > 0, 'Query 5 returned recommendations');
  const q5Names = (res5.results || []).map((p) => p.name.toLowerCase());
  assert(!q5Names.some((n) => n.includes('lip balm') || n.includes('candle')), 'Query 5 does NOT substitute unrelated items like lip balm or candles');
  assert(q5Names.some((n) => n.includes('shampoo') || n.includes('soapnut')), 'Query 5 returns real cleansing alternatives (shampoo bar or soapnut wash)');
  // Verify prices are ascending
  let isSortedByPrice = true;
  for (let i = 1; i < (res5.results || []).length; i++) {
    if (res5.results[i].price < res5.results[i - 1].price) {
      isSortedByPrice = false;
      break;
    }
  }
  assert(isSortedByPrice, 'Query 5 returned candidates sorted by price ascending');
  console.log(`Top result: ${res5.results[0]?.name} (₹${res5.results[0]?.price})\n`);

  // TEST 6: Context Memory & Topic Switching
  console.log('--- Test 6: Context Memory Isolation (new topic must not inherit old budget) ---');
  // Turn 1: User asks for mom gift under 800
  const contextAfterTurn1 = {
    lastCategory: 'Home',
    lastBudget: 800,
    lastRecipient: 'mom',
    lastQuery: 'gift for my mom under 800'
  };

  // Turn 2: User asks a clearly new request: "shampoo bar"
  const intentTurn2 = parseShoppingIntent("shampoo bar", contextAfterTurn1);
  assert(
    intentTurn2.maxBudget === null,
    'Turn 2 ("shampoo bar") does NOT inherit ₹800 budget from previous turn',
    `maxBudget was: ${intentTurn2.maxBudget}`
  );
  assert(intentTurn2.category === 'Personal Care', 'Turn 2 identified category "Personal Care"');

  // Turn 3: User explicitly asks follow-up keeping budget: "what about notebooks within that budget?"
  const intentTurn3 = parseShoppingIntent("what about notebooks within that budget?", contextAfterTurn1);
  assert(
    intentTurn3.maxBudget === 800,
    'Turn 3 ("within that budget") explicitly inherits previous budget of ₹800',
    `maxBudget was: ${intentTurn3.maxBudget}`
  );

  console.log('\n========================================');
  console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log('========================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
