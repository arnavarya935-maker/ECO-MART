import { describe, it, expect, vi, afterEach } from 'vitest';
import productsData from '../src/data/products.json';
import {
  parseShoppingIntent,
  queryEcoCatalog,
  planBasket,
  sendAgentQuery
} from '../src/lib/ecoAgent';
import { detectGreenwashing } from '../src/lib/ecoScore';

describe('Phase 1 & 2 - Eco Agent Parsing and Intelligence', () => {
  // 1. Word-boundary parsing
  it('identifies gift intent from "open a gift under 500" without falsely matching Stationery ("pen")', () => {
    const intent = parseShoppingIntent('open a gift under 500');
    expect(intent.isGift).toBe(true);
    expect(intent.category).not.toBe('Stationery');
    expect(intent.maxBudget).toBe(500);

    const catalogResponse = queryEcoCatalog(productsData, 'open a gift under 500');
    expect(catalogResponse.results.every((p) => p.price <= 500)).toBe(true);
  });

  // 2. Price sorting with Hinglish & English keywords
  it('correctly sorts by price ascending for "cheapest green option under 300"', () => {
    const intent = parseShoppingIntent('cheapest green option under 300');
    expect(intent.sortBy).toBe('price-asc');
    expect(intent.maxBudget).toBe(300);

    const response = queryEcoCatalog(productsData, 'cheapest green option under 300');
    expect(response.results.length).toBeGreaterThan(0);
    expect(response.results.every((p) => p.price <= 300)).toBe(true);
    // Ascending price verification
    for (let i = 1; i < response.results.length; i++) {
      expect(response.results[i].price).toBeGreaterThanOrEqual(response.results[i - 1].price);
    }
  });

  it('detects Hinglish "sasta" and sorts by price-asc', () => {
    const intent = parseShoppingIntent('sabse sasta bag dikhao');
    expect(intent.sortBy).toBe('price-asc');
    expect(intent.category).toBe('Bags');
  });

  // 3. Expanded vocabulary and synonyms
  it('maps "bathroom" to Personal Care and "dorm" to Home', () => {
    const intentBath = parseShoppingIntent('reduce plastic in my bathroom');
    expect(intentBath.category).toBe('Personal Care');

    const intentDorm = parseShoppingIntent('essentials for my dorm');
    expect(intentDorm.category).toBe('Home');
  });

  it('detects recipient synonyms (sister, teacher, friend) as gift intent', () => {
    const intentSister = parseShoppingIntent('gift for my sister under 1000');
    expect(intentSister.isGift).toBe(true);
    expect(intentSister.recipient).toBe('sister');

    const intentTeacher = parseShoppingIntent('sustainable appreciation gift for teacher');
    expect(intentTeacher.isGift).toBe(true);
    expect(intentTeacher.recipient).toBe('teacher');
  });

  // 4. Typos and no-match behavior
  it('detects typo in "toothbrsh" and suggests "toothbrush"', () => {
    const intent = parseShoppingIntent('toothbrsh');
    expect(intent.didYouMean).toBe('toothbrush');

    const response = queryEcoCatalog(productsData, 'toothbrsh');
    expect(response.didYouMean).toBe('toothbrush');
  });

  it('never pads "shampoo" with unrelated products like razors or lip balms', () => {
    const response = queryEcoCatalog(productsData, 'shampoo');
    expect(response.results.length).toBeGreaterThan(0);
    response.results.forEach((prod) => {
      const name = prod.name.toLowerCase();
      const desc = (prod.description || '').toLowerCase();
      const isShampooRelated = name.includes('shampoo') || desc.includes('shampoo') || name.includes('hair');
      expect(isShampooRelated).toBe(true);
      expect(name).not.toContain('razor');
      expect(name).not.toContain('lip balm');
    });
  });

  it('honestly returns count 0 for completely unmatchable search terms without fake padding', () => {
    const response = queryEcoCatalog(productsData, 'xyzunobtainiumquantumwidget');
    expect(response.results).toHaveLength(0);
    expect(response.count).toBe(0);
  });

  // 5. Goal-based basket planning
  it('plans a cross-category starter kit within budget without duplicate product types', () => {
    const plan = planBasket('zero waste dorm room under 2000', 2000, productsData);
    expect(plan.type).toBe('basket-plan');
    expect(plan.totalPrice).toBeLessThanOrEqual(2000);
    expect(plan.items.length).toBeGreaterThanOrEqual(3);

    // Multi-category diversity check
    const categories = new Set(plan.items.map((i) => i.category));
    expect(categories.size).toBeGreaterThanOrEqual(2);

    // Savings metrics
    expect(plan.savings.co2Saved).toBeGreaterThan(0);
    expect(plan.savings.plasticSaved).toBeGreaterThan(0);
    expect(plan.averageEcoScore).toBeGreaterThanOrEqual(70);

    // 6-step reasoning trace
    expect(plan.trace.length).toBe(6);
  });

  // 5b. Basket numbers and tradeoff consistency (single source of truth)
  it('for a basket query, the total shown in the summary equals the total used in the trade-off text, and the CO2 figures match', async () => {
    const res = await sendAgentQuery('college student, personal kit gift under 3000', productsData);
    expect(res.basketPlan).toBeDefined();
    expect(res.tradeoffs).toBeDefined();

    const basketTotal = res.basketPlan.totalPrice;
    const basketCo2 = res.basketPlan.savings.co2Saved;

    // Check that tradeoff text uses the exact same total and CO2 numbers
    const upfrontText = res.tradeoffs.givesUp.find((t) => t.includes('Upfront investment'));
    expect(upfrontText).toContain(`₹${basketTotal}`);

    const co2Text = res.tradeoffs.beats.find((t) => t.includes('lifecycle greenhouse gas emissions'));
    expect(co2Text).toContain(`${basketCo2}kg`);

    // Winner matches first product, runner-up matches second product
    if (res.basketPlan.items.length >= 2) {
      expect(res.tradeoffs.winnerName).toBe(res.basketPlan.items[0].name);
      expect(res.tradeoffs.runnerUpName).toBe(res.basketPlan.items[1].name);
    }
  });

  // 6. Visible reasoning trace and trade-offs
  it('generates transparent 6-step reasoning trace and trade-off comparison', () => {
    const response = queryEcoCatalog(productsData, 'plastic-free kitchen under 1000');
    expect(response.trace).toBeDefined();
    expect(response.trace.length).toBeGreaterThanOrEqual(5);

    if (response.results.length >= 2) {
      expect(response.tradeoffs).toBeDefined();
      expect(response.tradeoffs.winnerName).toBe(response.results[0].name);
      expect(response.tradeoffs.beats.length).toBeGreaterThan(0);
    }
  });

  // 7. Multi-turn conversation context memory
  it('reuses previous context for follow-up query "something cheaper"', () => {
    const prevContext = {
      lastCategory: 'Kitchen',
      lastBudget: 1000,
      lastResults: productsData.filter((p) => p.category === 'Kitchen' && p.price <= 1000)
    };

    const intent = parseShoppingIntent('something cheaper', prevContext);
    expect(intent.category).toBe('Kitchen');
    expect(intent.sortBy).toBe('price-asc');
    expect(intent.maxBudget).toBeLessThan(1000);
  });

  it('switches category but preserves budget for "now for bags"', () => {
    const prevContext = {
      lastCategory: 'Personal Care',
      lastBudget: 500,
      lastResults: []
    };

    const intent = parseShoppingIntent('now for bags', prevContext);
    expect(intent.category).toBe('Bags');
    expect(intent.maxBudget).toBe(500);
  });

  it('updates budget for "under 300 instead"', () => {
    const prevContext = {
      lastCategory: 'Stationery',
      lastBudget: 1000,
      lastResults: []
    };

    const intent = parseShoppingIntent('under 300 instead', prevContext);
    expect(intent.category).toBe('Stationery');
    expect(intent.maxBudget).toBe(300);
  });

  // 8. Greenwashing detection
  it('flags uncertified low-scoring products using buzzwords and leaves certified products clean', () => {
    const fakeProduct = {
      id: 'fake-01',
      name: 'Super Green Natural Eco Miracle Shampoo',
      category: 'Personal Care',
      price: 199,
      packaging: 'plastic',
      certifications: [],
      carbonKg: 4.5,
      waterLitres: 250,
      plasticGrams: 200,
      madeInKm: 1800,
      isEcoFriendly: false
    };

    const certifiedProduct = {
      id: 'cert-01',
      name: 'Organic Neem Shampoo Bar',
      category: 'Personal Care',
      price: 299,
      packaging: 'plastic-free',
      certifications: ['USDA Organic', 'Zero Waste'],
      carbonKg: 0.3,
      waterLitres: 15,
      plasticGrams: 0,
      madeInKm: 100,
      isEcoFriendly: true
    };

    const fakeCheck = detectGreenwashing(fakeProduct);
    expect(fakeCheck.isGreenwashed).toBe(true);
    expect(fakeCheck.reason).toContain('Claims');

    const certCheck = detectGreenwashing(certifiedProduct);
    expect(certCheck.isGreenwashed).toBe(false);
  });

  // 9. Clarifying questions for ambiguous single-word queries
  it('asks clarifying questions with quick chips for broad single-word prompt "gift"', () => {
    const response = queryEcoCatalog(productsData, 'gift');
    expect(response.type).toBe('clarification');
    expect(response.clarification).toBeDefined();
    expect(response.clarification.chips.length).toBeGreaterThanOrEqual(3);
  });
});

describe('Phase 3 - Optional Cloud LLM Contract', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('uses cloud-llm response when contract { query, context } matches and upstream returns reply', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        reply: 'Based on lifecycle auditing, these bamboo alternatives divert 300g of plastic.',
        source: 'cloud-llm'
      })
    });

    const res = await sendAgentQuery('plastic free kitchen', productsData, [], null);
    expect(res.source).toBe('cloud-llm');
    expect(res.message).toContain('divert 300g of plastic');
    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/agent',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('"query":"plastic free kitchen"')
      })
    );
  });

  it('silently falls back to local rule engine without errors when network fails or offline', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Failed to fetch (offline)'));

    const res = await sendAgentQuery('plastic free kitchen', productsData, [], null);
    expect(res.source).toBe('local-rule-engine');
    expect(res.message).toBeDefined();
    expect(res.data.length).toBeGreaterThan(0);
  });

  it('falls back to local rule engine when cloud returns local-rules status', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        reply: null,
        source: 'local-rules'
      })
    });

    const res = await sendAgentQuery('soap', productsData, [], null);
    expect(res.source).toBe('local-rule-engine');
  });
});
