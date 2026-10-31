import { describe, it, expect } from 'vitest';
import productsData from '../src/data/products.json';
import {
  computePriorityRanking,
  detectPriorityPhrase,
  extractRequestedNoun,
  filterProductsByRequestedType,
  generatePriorityTradeoffs,
  stripStrayAsterisks
} from '../src/lib/decisionEngine';
import { sendAgentQuery } from '../src/lib/ecoAgent';

describe('Deterministic Code-Ranking for Priority Queries', () => {
  const allowedDrinkwareKeywords = ['bottle', 'flask', 'jug', 'tumbler', 'thermos', 'canteen', 'pitcher'];

  it('detects priority phrases accurately', () => {
    expect(detectPriorityPhrase('water bottle, lowest carbon')).toBe('lowest_carbon');
    expect(detectPriorityPhrase('water bottle, save money')).toBe('save_money');
    expect(detectPriorityPhrase('water bottle, cheapest')).toBe('save_money');
    expect(detectPriorityPhrase('water bottle, cut plastic')).toBe('cut_plastic');
    expect(detectPriorityPhrase('just a regular water bottle')).toBe(null);
  });

  it('extracts requested noun without priority phrase or filler words', () => {
    expect(extractRequestedNoun('water bottle, lowest carbon')).toBe('water bottle');
    expect(extractRequestedNoun('water bottle, save money')).toBe('water bottle');
    expect(extractRequestedNoun('water bottle, cheapest')).toBe('water bottle');
    expect(extractRequestedNoun('water bottle, cut plastic')).toBe('water bottle');
  });

  it('filters catalog strictly to requested product type (never includes candles or soap)', () => {
    const bottles = filterProductsByRequestedType(productsData, 'water bottle, lowest carbon');
    expect(bottles.length).toBeGreaterThan(0);
    bottles.forEach((item) => {
      const match = allowedDrinkwareKeywords.some((kw) =>
        item.name.toLowerCase().includes(kw) || item.category.toLowerCase().includes(kw)
      );
      expect(match).toBe(true);
      expect(item.name.toLowerCase()).not.toContain('candle');
      expect(item.name.toLowerCase()).not.toContain('shampoo');
    });
  });

  describe('Priority 1: "water bottle, lowest carbon"', () => {
    it('ranks in CODE with kit-05 (0.38 kg) as #1 and all items matching bottle type', () => {
      const ranking = computePriorityRanking(productsData, 'water bottle, lowest carbon');
      expect(ranking).toBeDefined();
      expect(ranking.priority).toBe('lowest_carbon');
      expect(ranking.winner.id).toBe('kit-05');
      expect(ranking.winner.carbonKg).toBe(0.38);

      // Verify every recommended item matches requested vessel type
      ranking.products.forEach((p) => {
        const matches = allowedDrinkwareKeywords.some((kw) =>
          p.name.toLowerCase().includes(kw) || p.category.toLowerCase().includes(kw)
        );
        expect(matches).toBe(true);
      });

      // Verify sorted strictly ascending by carbonKg
      for (let i = 1; i < ranking.products.length; i++) {
        expect(ranking.products[i].carbonKg).toBeGreaterThanOrEqual(ranking.products[i - 1].carbonKg);
      }
    });

    it('end-to-end via sendAgentQuery: #1 is kit-05, all items match bottle family', async () => {
      const res = await sendAgentQuery('water bottle, lowest carbon', { cart: [] }, 'en', productsData);
      expect(res.data.length).toBeGreaterThan(0);
      expect(res.data[0].id).toBe('kit-05');
      res.data.forEach((p) => {
        const matches = allowedDrinkwareKeywords.some((kw) =>
          p.name.toLowerCase().includes(kw) || p.category.toLowerCase().includes(kw)
        );
        expect(matches).toBe(true);
      });
    });
  });

  describe('Priority 2: "water bottle, save money" / "cheapest"', () => {
    it('ranks in CODE with kit-05 (Rs 599) as #1 and all items matching bottle type', () => {
      const ranking = computePriorityRanking(productsData, 'water bottle, save money');
      expect(ranking).toBeDefined();
      expect(ranking.priority).toBe('save_money');
      expect(ranking.winner.id).toBe('kit-05');
      expect(ranking.winner.price).toBe(599);

      // Verify every item matches bottle family
      ranking.products.forEach((p) => {
        const matches = allowedDrinkwareKeywords.some((kw) =>
          p.name.toLowerCase().includes(kw) || p.category.toLowerCase().includes(kw)
        );
        expect(matches).toBe(true);
      });

      // Verify sorted strictly ascending by price
      for (let i = 1; i < ranking.products.length; i++) {
        expect(ranking.products[i].price).toBeGreaterThanOrEqual(ranking.products[i - 1].price);
      }
    });

    it('comparison box for "save money" says #1 is cheaper / costs less, NOT costs more', () => {
      const ranking = computePriorityRanking(productsData, 'water bottle, save money');
      const tradeoffs = generatePriorityTradeoffs(ranking.winner, ranking.runnerUp, ranking.priority);

      expect(tradeoffs).toBeDefined();
      expect(tradeoffs.winnerName).toBe(ranking.winner.name);
      expect(tradeoffs.runnerUpName).toBe(ranking.runnerUp.name);

      const beatsText = tradeoffs.beats.join(' ');
      const givesUpText = tradeoffs.givesUp.join(' ');

      expect(beatsText.toLowerCase()).toMatch(/costs? ₹?\d+ less|best budget pick/i);
      expect(givesUpText.toLowerCase()).not.toContain('costs');
    });

    it('end-to-end via sendAgentQuery for "water bottle, save money": kit-05 is #1', async () => {
      const res = await sendAgentQuery('water bottle, save money', { cart: [] }, 'en', productsData);
      expect(res.data[0].id).toBe('kit-05');
      expect(res.tradeoffs).toBeDefined();
      expect(res.tradeoffs.beats.join(' ').toLowerCase()).toMatch(/costs? ₹?\d+ less|best budget pick/i);
    });

    it('end-to-end via sendAgentQuery for "water bottle, cheapest": kit-05 is #1', async () => {
      const res = await sendAgentQuery('water bottle, cheapest', { cart: [] }, 'en', productsData);
      expect(res.data[0].id).toBe('kit-05');
    });
  });

  describe('Priority 3: "water bottle, cut plastic"', () => {
    it('ranks in CODE with kit-05 (0g plastic) as #1 and all items matching bottle type', () => {
      const ranking = computePriorityRanking(productsData, 'water bottle, cut plastic');
      expect(ranking).toBeDefined();
      expect(ranking.priority).toBe('cut_plastic');
      expect(ranking.winner.id).toBe('kit-05');
      expect(ranking.winner.plasticGrams).toBe(0);

      ranking.products.forEach((p) => {
        const matches = allowedDrinkwareKeywords.some((kw) =>
          p.name.toLowerCase().includes(kw) || p.category.toLowerCase().includes(kw)
        );
        expect(matches).toBe(true);
      });
    });

    it('end-to-end via sendAgentQuery for "water bottle, cut plastic": kit-05 is #1', async () => {
      const res = await sendAgentQuery('water bottle, cut plastic', { cart: [] }, 'en', productsData);
      expect(res.data[0].id).toBe('kit-05');
    });
  });

  describe('Edge cases: Fewer than 2 items hide comparison box', () => {
    it('hides comparison box if only 1 item exists for query', () => {
      const mockSingleCatalog = [
        { id: 'kit-05', name: 'Terracotta Clay Water Jug', category: 'Kitchen', isEcoFriendly: true, price: 599, carbonKg: 0.38, plasticGrams: 0, ecoScore: 92 }
      ];
      const ranking = computePriorityRanking(mockSingleCatalog, 'water bottle, lowest carbon');
      expect(ranking.products.length).toBe(1);
      expect(ranking.runnerUp).toBeNull();

      const tradeoffs = generatePriorityTradeoffs(ranking.winner, ranking.runnerUp, ranking.priority);
      expect(tradeoffs).toBeNull();
    });
  });

  describe('Markdown / Asterisk Sanitization', () => {
    it('strips stray asterisks so no raw ** or * appear in output', () => {
      const textWithAsterisks = 'Here is **#1 Winner** with *0g plastic* and a lone * bullet';
      const cleaned = stripStrayAsterisks(textWithAsterisks);
      expect(cleaned).toBe('Here is #1 Winner with 0g plastic and a lone  bullet');
      expect(cleaned).not.toContain('*');
    });
  });
});
