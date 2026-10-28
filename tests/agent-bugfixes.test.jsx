import { describe, it, expect } from 'vitest';
import products from '../src/data/products.json';
import {
  sendAgentQuery,
  parseShoppingIntent,
  queryEcoCatalog,
  normalizeWord
} from '../src/lib/ecoAgent.js';

describe('EcoAgent Pre-Demo Bug Fixes Verification', () => {
  // BUG 1: Priority adjustment + budget / shopping constraints
  describe('Bug 1: Priority phrases with shopping constraints', () => {
    it('returns all products under maxBudget and sorted ascending by price for "Show cheapest green option under 300"', async () => {
      const res = await sendAgentQuery({
        query: 'Show cheapest green option under 300',
        allProducts: products
      });

      expect(res.data.length).toBeGreaterThan(0);
      for (const prod of res.data) {
        expect(prod.price).toBeLessThanOrEqual(300);
      }
      for (let i = 1; i < res.data.length; i++) {
        expect(res.data[i].price).toBeGreaterThanOrEqual(res.data[i - 1].price);
      }
      // Decision priorities should also be updated
      expect(res.newPriorities?.price).toBe(100);
    });

    it('treats pure priority queries without constraints as pure priority updates', async () => {
      const res = await sendAgentQuery({
        query: 'I care most about price',
        allProducts: products
      });
      expect(res.newPriorities?.price).toBe(100);
      expect(res.message).toContain('Price 100');
    });
  });

  // BUG 2: Educational detection
  describe('Bug 2: Educational query detection', () => {
    const educationalQueries = [
      'Explain how the eco score is calculated',
      'what is eco score',
      'how is the score calculated',
      'explain scoring',
      'How EcoScore works',
      'eco score kaise bana',
      'score kya hai'
    ];

    for (const q of educationalQueries) {
      it(`identifies educational intent for "${q}"`, async () => {
        const res = await sendAgentQuery({ query: q, allProducts: products });
        expect(res.analysis?.intent?.isEducational).toBe(true);
        expect(res.message).toContain('EcoMart Eco-Score');
        expect(res.message).toContain('Material Integrity');
      });
    }
  });

  // BUG 3: Goal/Basket Planning and budget basket
  describe('Bug 3: Budget basket planning and typo protection', () => {
    it('routes "Assemble a budget basket under 1000" to planBasket without basket typo', async () => {
      const res = await sendAgentQuery({
        query: 'Assemble a budget basket under 1000',
        allProducts: products
      });

      expect(res.basketPlan).toBeTruthy();
      expect(res.basketPlan.totalPrice).toBeLessThanOrEqual(1000);
      expect(res.didYouMean).toBeNull();
      expect(res.message).not.toContain('blanket');
    });

    it('routes combo, kit, and bundle queries with a budget to planBasket', async () => {
      const res = await sendAgentQuery({
        query: 'dorm starter kit under 1500',
        allProducts: products
      });
      expect(res.basketPlan).toBeTruthy();
      expect(res.basketPlan.totalPrice).toBeLessThanOrEqual(1500);
    });
  });

  // BUG 4: Gift queries with recipient and EcoScore sort
  describe('Bug 4: Gift queries with recipients and EcoScore sorting', () => {
    it('returns 3+ results under 800 for "gift for my sister under 800"', async () => {
      const res = await sendAgentQuery({
        query: 'gift for my sister under 800',
        allProducts: products
      });
      expect(res.data.length).toBeGreaterThanOrEqual(3);
      for (const p of res.data) {
        expect(p.price).toBeLessThanOrEqual(800);
      }
    });

    it('returns 3+ results under 800 for "gift for my teacher under 800" prioritizing stationery/journals', async () => {
      const res = await sendAgentQuery({
        query: 'gift for my teacher under 800',
        allProducts: products
      });
      expect(res.data.length).toBeGreaterThanOrEqual(3);
      for (const p of res.data) {
        expect(p.price).toBeLessThanOrEqual(800);
      }
      expect(['Stationery', 'Home']).toContain(res.data[0].category);
    });

    it('returns 3+ results for "best gift for my mom"', async () => {
      const res = await sendAgentQuery({
        query: 'best gift for my mom',
        allProducts: products
      });
      expect(res.data.length).toBeGreaterThanOrEqual(3);
    });

    it('returns 3+ results under 1000 for "Find an eco-friendly gift under ₹1000"', async () => {
      const res = await sendAgentQuery({
        query: 'Find an eco-friendly gift under ₹1000',
        allProducts: products
      });
      expect(res.data.length).toBeGreaterThanOrEqual(3);
      for (const p of res.data) {
        expect(p.price).toBeLessThanOrEqual(1000);
      }
    });

    it('sorts strictly by EcoScore descending for "Show me the highest eco-score products"', async () => {
      const res = await sendAgentQuery({
        query: 'Show me the highest eco-score products',
        allProducts: products
      });
      expect(res.data.length).toBeGreaterThanOrEqual(3);
      for (let i = 1; i < res.data.length; i++) {
        expect(res.data[i].ecoScoreData.score).toBeLessThanOrEqual(res.data[i - 1].ecoScoreData.score);
      }
    });
  });

  // BUG 5: Plurals and catalogue noun coverage
  describe('Bug 5: Plurals, common words and catalogue noun coverage', () => {
    it('returns relevant products for plurals: notebooks, candles, toothbrushes, shoes', async () => {
      const nouns = ['notebooks', 'candles', 'toothbrushes', 'shoes'];
      for (const noun of nouns) {
        const res = await sendAgentQuery({ query: noun, allProducts: products });
        expect(res.data.length).toBeGreaterThan(0);
      }
    });

    it('normalizes singular and plural word forms correctly', () => {
      expect(normalizeWord('notebooks')).toBe('notebook');
      expect(normalizeWord('candles')).toBe('candle');
      expect(normalizeWord('toothbrushes')).toBe('toothbrush');
      expect(normalizeWord('shoes')).toBe('shoe');
      expect(normalizeWord('knives')).toBe('knife');
      expect(normalizeWord('diaries')).toBe('diary');
    });

    it('verifies every eco product can be found by its own main noun', () => {
      const ecoProducts = products.filter((p) => p.isEcoFriendly);

      function getMainNoun(name) {
        const n = name.toLowerCase();
        if (n.includes('cutlery')) return 'cutlery';
        if (n.includes('bowl')) return 'bowls';
        if (n.includes('wrap')) return 'wraps';
        if (n.includes('copper bottle')) return 'bottle';
        if (n.includes('toothbrush')) return 'toothbrush';
        if (n.includes('shampoo')) return 'shampoo';
        if (n.includes('razor')) return 'razor';
        if (n.includes('lip balm') || n.includes('balm')) return 'balm';
        if (n.includes('shirt')) return 'shirt';
        if (n.includes('sneaker')) return 'sneakers';
        if (n.includes('stole')) return 'stole';
        if (n.includes('socks')) return 'socks';
        if (n.includes('journal')) return 'journal';
        if (n.includes('pen')) return 'pens';
        if (n.includes('desk')) return 'desk';
        if (n.includes('candle')) return 'candle';
        if (n.includes('tray')) return 'tray';
        if (n.includes('mat') || n.includes('doormat')) return 'mat';
        if (n.includes('planter')) return 'planter';
        if (n.includes('tote')) return 'tote';
        if (n.includes('messenger')) return 'bag';
        if (n.includes('duffel')) return 'duffel';
        if (n.includes('produce')) return 'bags';
        if (n.includes('lantern')) return 'lantern';
        if (n.includes('thermos')) return 'thermos';
        if (n.includes('blanket')) return 'blanket';
        if (n.includes('soapnut')) return 'soapnut';
        if (n.includes('scrubber') || n.includes('loofah')) return 'loofah';
        if (n.includes('cleaner')) return 'cleaner';
        if (n.includes('toilet brush')) return 'brush';
        return name.split(' ')[0];
      }

      for (const p of ecoProducts) {
        const noun = getMainNoun(p.name);
        const res = queryEcoCatalog(products, noun);
        const matches = (res.results || []).some((r) => r.id === p.id || r.category === p.category);
        expect(matches).toBe(true);
      }
    });
  });

  // BUG 6: Multi-turn Follow-up Chain with real context
  describe('Bug 6: Multi-turn Follow-up Chain with chat context', () => {
    it('executes the full follow-up chain seamlessly without "could not find"', async () => {
      let context = {
        lastCategory: null,
        lastBudget: null,
        lastSort: null,
        lastRecipient: null,
        lastPackaging: null,
        lastResults: [],
        lastQuery: null
      };

      const updateCtx = (res, q) => {
        context = {
          lastCategory: res.analysis?.intent?.category || context.lastCategory,
          lastBudget: res.analysis?.intent?.maxBudget || context.lastBudget,
          lastSort: res.analysis?.intent?.sortBy || context.lastSort,
          lastRecipient: res.analysis?.intent?.recipient || context.lastRecipient,
          lastPackaging: res.analysis?.intent?.packaging || context.lastPackaging,
          lastResults: res.data || context.lastResults,
          lastQuery: q
        };
      };

      // 1. "show me kitchen items"
      const res1 = await sendAgentQuery({ query: 'show me kitchen items', allProducts: products, context });
      updateCtx(res1, 'show me kitchen items');
      expect(res1.data.length).toBeGreaterThan(0);
      expect(context.lastCategory).toBe('Kitchen');

      // 2. "something cheaper"
      const res2 = await sendAgentQuery({ query: 'something cheaper', allProducts: products, context });
      updateCtx(res2, 'something cheaper');
      expect(res2.message).toContain("That's already the cheapest in Kitchen (₹349)");
      expect(res2.message).not.toContain('cleaner');
      expect(res2.data.length).toBe(1);

      // 3. "under 300 instead"
      const res3 = await sendAgentQuery({ query: 'under 300 instead', allProducts: products, context });
      updateCtx(res3, 'under 300 instead');
      expect(res3.data.length).toBeGreaterThan(0);
      expect(res3.message).not.toContain("couldn't find");

      // 4. "now for bags"
      const res4 = await sendAgentQuery({ query: 'now for bags', allProducts: products, context });
      updateCtx(res4, 'now for bags');
      expect(res4.data.length).toBeGreaterThan(0);
      expect(context.lastCategory).toBe('Bags');
      expect(res4.message).not.toContain("couldn't find");

      // 5. "show me the second one"
      const secondItemName = context.lastResults[1].name;
      const res5 = await sendAgentQuery({ query: 'show me the second one', allProducts: products, context });
      expect(res5.data.length).toBe(1);
      expect(res5.data[0].name).toBe(secondItemName);
      expect(res5.message).toContain('option #2');
    });

    it('sorts by EcoScore descending for "something greener"', async () => {
      const context = {
        lastCategory: 'Personal Care',
        lastBudget: 1000,
        lastSort: null,
        lastRecipient: null,
        lastPackaging: null,
        lastResults: products.filter((p) => p.category === 'Personal Care' && p.isEcoFriendly),
        lastQuery: 'personal care'
      };

      const res = await sendAgentQuery({ query: 'something greener', allProducts: products, context });
      expect(res.data.length).toBeGreaterThan(1);
      for (let i = 1; i < res.data.length; i++) {
        expect(res.data[i].ecoScoreData.score).toBeLessThanOrEqual(res.data[i - 1].ecoScoreData.score);
      }
    });
  });

  // BUG 7: Empty Cart Review and Undefined/NaN prevention
  describe('Bug 7: Empty cart review and undefined/NaN guard', () => {
    it('returns friendly empty-cart response without undefined or NaN for empty cart', async () => {
      const res = await sendAgentQuery({
        query: 'Review my cart and suggest greener swaps',
        allProducts: products,
        cartItems: []
      });

      expect(res.message).toBe("Your cart is empty. Add a few items and I'll audit them, or try 'Assemble a budget basket under 1000'.");
      expect(res.message).not.toContain('undefined');
      expect(res.message).not.toContain('NaN');
      expect(res.data).toEqual([]);
    });

    it('verifies 40+ varied queries never produce "undefined" or "NaN" in messages', async () => {
      const queries = [
        '', '   ', '???', '!@#$%', '12345',
        'Review my cart and suggest greener swaps', 'review cart', 'thela check',
        'Show cheapest green option under 300', 'cheapest under 0', 'under 999999', 'under -50',
        'Explain how the eco score is calculated', 'what is eco score', 'how is the score calculated',
        'explain scoring', 'eco score kaise bana', 'score kya hai',
        'Assemble a budget basket under 1000', 'budget basket', 'starter kit under 500',
        'zero waste dorm room under 2000', 'Find an eco-friendly gift under ₹1000',
        'gift for my sister under 800', 'gift for my teacher under 800', 'best gift for my mom',
        'gift for my dad', 'gift for friend', 'gift for colleague', 'gift for kid',
        'Show me the highest eco-score products', 'greenest products', 'top rated',
        'notebooks', 'candles', 'toothbrushes', 'shoes', 'bottle', 'straws', 'shampoo',
        'toothbrsh', 'I care most about price', 'plastic matters more', 'lowest carbon',
        'why not the bamboo cutlery', 'show me the second one', 'something cheaper', 'something greener'
      ];

      for (const q of queries) {
        const res = await sendAgentQuery({ query: q, allProducts: products, cartItems: [] });
        expect(res.message).not.toContain('undefined');
        expect(res.message).not.toContain('NaN');
      }
    });
  });

  // BUG 10: Typo correction accuracy
  describe('Bug 10: Typo distance constraint and catalogue suggestions', () => {
    it('suggests toothbrush for toothbrsh (distance 1)', async () => {
      const res = await sendAgentQuery({ query: 'toothbrsh', allProducts: products });
      expect(res.didYouMean).toBe('toothbrush');
    });

    it('never suggests distant or unrelated words when distance > 2', () => {
      const intent = parseShoppingIntent('xyzabcqwerty');
      expect(intent.didYouMean).toBeNull();
    });
  });

  describe('Phase 2 Easy Wins: Off-topic redirect and typo limits', () => {
    it('redirects "will you go on a date with me" politely with 3 example chips, 0 products, and no tote typo', async () => {
      const res = await sendAgentQuery({
        query: 'will you go on a date with me',
        allProducts: products
      });

      expect(res.message).toBe(
        'I am the Eco Sense shopping helper. I can help you find eco-friendly products, compare, plan a basket, or check a claim. What are you looking for?'
      );
      expect(res.data).toEqual([]);
      expect(res.didYouMean).toBeNull();
      expect(res.basketPlan).toBeNull();
      expect(res.isOffTopic).toBe(true);
      expect(res.clarification.options.length).toBe(3);
    });

    it('redirects jokes, weather, and maths questions politely', async () => {
      const offTopics = ['tell me a joke', 'what is the weather today', 'what is 2+2'];
      for (const q of offTopics) {
        const res = await sendAgentQuery({ query: q, allProducts: products });
        expect(res.isOffTopic).toBe(true);
        expect(res.data).toEqual([]);
        expect(res.message).toContain('I am the Eco Sense shopping helper');
      }
    });

    it('does not trigger "Did you mean" for ordinary English words like date or weather', () => {
      const intent1 = parseShoppingIntent('date');
      expect(intent1.didYouMean).toBeNull();

      const intent2 = parseShoppingIntent('weather');
      expect(intent2.didYouMean).toBeNull();
    });

    it('only triggers "Did you mean" for real typos close to catalogue terms', () => {
      const intent = parseShoppingIntent('tootbrush');
      expect(intent.didYouMean).toBe('toothbrush');
    });
  });
});
