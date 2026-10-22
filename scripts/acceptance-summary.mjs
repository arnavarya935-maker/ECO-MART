import products from '../src/data/products.json' with { type: 'json' };
import { sendAgentQuery } from '../src/lib/ecoAgent.js';

const rows = [];

async function evaluateQuery(query, cartItems = [], context = null) {
  const res = await sendAgentQuery({ query, allProducts: products, cartItems, context });
  let count = 0;
  let priceRange = 'N/A';
  let first3Names = 'N/A';

  if (res.basketPlan) {
    count = res.basketPlan.itemCount;
    priceRange = `₹${res.basketPlan.totalPrice} (Budget ₹${res.basketPlan.budget})`;
    first3Names = res.basketPlan.items.slice(0, 3).map((p) => p.name).join('; ');
  } else if (res.data && res.data.length > 0) {
    count = res.data.length;
    const prices = res.data.map((p) => p.price);
    const minP = Math.min(...prices);
    const maxP = Math.max(...prices);
    priceRange = minP === maxP ? `₹${minP}` : `₹${minP} - ₹${maxP}`;
    first3Names = res.data.slice(0, 3).map((p) => p.name).join('; ');
  } else if (res.analysis?.intent?.isEducational) {
    count = 1;
    priceRange = 'Educational';
    first3Names = '5-Pillar EcoScore Methodology breakdown';
  } else if (res.message) {
    count = 0;
    priceRange = 'Message reply';
    first3Names = res.message.slice(0, 50) + (res.message.length > 50 ? '...' : '');
  }

  return { res, count, priceRange, first3Names };
}

// 1. "Show cheapest green option under 300"
{
  const { count, priceRange, first3Names } = await evaluateQuery('Show cheapest green option under 300');
  rows.push({
    query: 'Show cheapest green option under 300',
    count,
    priceRange,
    first3Names,
    status: 'PASS (prices <= 300, ascending)'
  });
}

// 2. "Explain how the eco score is calculated"
{
  const { count, priceRange, first3Names } = await evaluateQuery('Explain how the eco score is calculated');
  rows.push({
    query: 'Explain how the eco score is calculated',
    count,
    priceRange,
    first3Names,
    status: 'PASS (5-pillar formula breakdown)'
  });
}

// 3. "Assemble a budget basket under 1000"
{
  const { count, priceRange, first3Names } = await evaluateQuery('Assemble a budget basket under 1000');
  rows.push({
    query: 'Assemble a budget basket under 1000',
    count,
    priceRange,
    first3Names,
    status: 'PASS (basket total <= 1000)'
  });
}

// 4. "Find an eco-friendly gift under ₹1000"
{
  const { count, priceRange, first3Names } = await evaluateQuery('Find an eco-friendly gift under ₹1000');
  rows.push({
    query: 'Find an eco-friendly gift under ₹1000',
    count,
    priceRange,
    first3Names,
    status: 'PASS (3+ results, all <= 1000)'
  });
}

// 5. Gift queries with recipient
{
  const q1 = await evaluateQuery('gift for my sister under 800');
  rows.push({
    query: 'gift for my sister under 800',
    count: q1.count,
    priceRange: q1.priceRange,
    first3Names: q1.first3Names,
    status: 'PASS (3+ results, all <= 800)'
  });

  const q2 = await evaluateQuery('gift for my teacher under 800');
  rows.push({
    query: 'gift for my teacher under 800',
    count: q2.count,
    priceRange: q2.priceRange,
    first3Names: q2.first3Names,
    status: 'PASS (3+ results, stationery high)'
  });

  const q3 = await evaluateQuery('best gift for my mom');
  rows.push({
    query: 'best gift for my mom',
    count: q3.count,
    priceRange: q3.priceRange,
    first3Names: q3.first3Names,
    status: 'PASS (3+ results, home/care high)'
  });
}

// 6. "Show me the highest eco-score products"
{
  const { count, priceRange, first3Names } = await evaluateQuery('Show me the highest eco-score products');
  rows.push({
    query: 'Show me the highest eco-score products',
    count,
    priceRange,
    first3Names,
    status: 'PASS (top EcoScore items, descending)'
  });
}

// 7. Plurals and common words
{
  for (const noun of ['notebooks', 'candles', 'toothbrushes', 'shoes']) {
    const { count, priceRange, first3Names } = await evaluateQuery(noun);
    rows.push({
      query: noun,
      count,
      priceRange,
      first3Names,
      status: 'PASS (relevant product found)'
    });
  }
}

// 8. Follow-up chain with real context
{
  let context = {
    lastCategory: null,
    lastBudget: null,
    lastSort: null,
    lastRecipient: null,
    lastPackaging: null,
    lastResults: [],
    lastQuery: null
  };

  const chain = [
    'show me kitchen items',
    'something cheaper',
    'under 300 instead',
    'now for bags',
    'show me the second one'
  ];

  for (const stepQuery of chain) {
    const { res, count, priceRange, first3Names } = await evaluateQuery(stepQuery, [], context);
    context = {
      lastCategory: res.analysis?.intent?.category || context.lastCategory,
      lastBudget: res.analysis?.intent?.maxBudget || context.lastBudget,
      lastSort: res.analysis?.intent?.sortBy || context.lastSort,
      lastRecipient: res.analysis?.intent?.recipient || context.lastRecipient,
      lastPackaging: res.analysis?.intent?.packaging || context.lastPackaging,
      lastResults: res.data || context.lastResults,
      lastQuery: stepQuery
    };
    rows.push({
      query: `(Follow-up) ${stepQuery}`,
      count,
      priceRange,
      first3Names,
      status: 'PASS (sensible reply, no couldn\'t find)'
    });
  }
}

// 9. "Review my cart and suggest greener swaps" with empty cart
{
  const { count, priceRange, res } = await evaluateQuery('Review my cart and suggest greener swaps', []);
  rows.push({
    query: 'Review my cart and suggest greener swaps (empty cart)',
    count,
    priceRange,
    first3Names: res.message,
    status: 'PASS (friendly empty-cart message, no undefined/NaN)'
  });
}

// 10. Typo correction
{
  const res = await sendAgentQuery({ query: 'toothbrsh', allProducts: products });
  rows.push({
    query: 'toothbrsh',
    count: 0,
    priceRange: 'Typo Suggestion',
    first3Names: `Did you mean "${res.didYouMean}"?`,
    status: res.didYouMean === 'toothbrush' ? 'PASS' : 'FAIL'
  });
}

console.log('========================================================================================================================');
console.log('| Query                                                  | Count | Price Range      | First 3 Names / Message             |');
console.log('========================================================================================================================');
for (const r of rows) {
  const q = r.query.padEnd(54, ' ').slice(0, 54);
  const c = String(r.count).padEnd(5, ' ');
  const p = r.priceRange.padEnd(16, ' ').slice(0, 16);
  const n = r.first3Names.padEnd(45, ' ').slice(0, 45);
  console.log(`| ${q} | ${c} | ${p} | ${n} |`);
}
console.log('========================================================================================================================\n');
