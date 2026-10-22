import { describe, it, expect } from 'vitest';
import productsData from '../src/data/products.json';
import {
  rankProducts,
  DEFAULT_PRIORITIES,
  PRIORITY_PRESETS,
  parsePriorityIntent,
  formatPrioritiesSummary
} from '../src/lib/decisionEngine';

describe('Phase 1 - Priority-Weighted Decision Engine', () => {
  it('ranks products with default balanced weights and returns valid structure', () => {
    const ranked = rankProducts(productsData.slice(0, 10), DEFAULT_PRIORITIES);
    expect(ranked.length).toBe(10);
    expect(ranked[0].rank).toBe(1);
    expect(typeof ranked[0].finalScore).toBe('number');
    expect(ranked[0].contributions).toBeDefined();
    expect(ranked[0].explanation).toBeDefined();
    expect(ranked[0].explanation).toContain('Top factors:');
  });

  it('raising Plastic slider to 100 and Price to 0 puts lowest-plastic items first', () => {
    const weights = {
      price: 0,
      carbon: 10,
      plastic: 100,
      water: 10,
      local: 10,
      certs: 10,
      ecoScore: 20
    };
    const ranked = rankProducts(productsData, weights);
    // The top product should have 0 plastic
    expect(ranked[0].plasticGrams).toBe(0);
    expect(ranked[0].explanation.toLowerCase()).toContain('plastic');
  });

  it('raising Price slider to 100 and Plastic to 0 puts cheapest items first', () => {
    const weights = {
      price: 100,
      carbon: 0,
      plastic: 0,
      water: 0,
      local: 0,
      certs: 0,
      ecoScore: 0
    };
    const ranked = rankProducts(productsData, weights);
    // The cheapest item in the catalog should be ranked #1
    const minPrice = Math.min(...productsData.map((p) => p.price));
    expect(ranked[0].price).toBe(minPrice);
    expect(ranked[0].explanation.toLowerCase()).toContain('price');
  });

  it('ranking changes dynamically when switching between presets', () => {
    const saveMoneyRanked = rankProducts(productsData, PRIORITY_PRESETS.save_money.weights);
    const cutPlasticRanked = rankProducts(productsData, PRIORITY_PRESETS.cut_plastic.weights);
    const lowestCarbonRanked = rankProducts(productsData, PRIORITY_PRESETS.lowest_carbon.weights);

    // Rankings should differ across distinct presets
    expect(saveMoneyRanked[0].id).not.toBe(cutPlasticRanked[cutPlasticRanked.length - 1].id);
    expect(saveMoneyRanked[0].price).toBeLessThanOrEqual(cutPlasticRanked[0].price * 3);
    expect(lowestCarbonRanked[0].carbonKg).toBeLessThan(2.0);
  });

  it('handles ties and missing fields gracefully without NaN or errors', () => {
    const mockItems = [
      { id: 't1', name: 'Tie Item 1', price: 100, carbonKg: 1.0, plasticGrams: 0 },
      { id: 't2', name: 'Tie Item 2', price: 100, carbonKg: 1.0, plasticGrams: 0 }
    ];
    const ranked = rankProducts(mockItems, DEFAULT_PRIORITIES);
    expect(ranked.length).toBe(2);
    expect(ranked[0].finalScore).toBeGreaterThan(0);
    expect(Number.isNaN(ranked[0].finalScore)).toBe(false);
    expect(Number.isNaN(ranked[0].contributions.plastic)).toBe(false);
  });

  it('handles completely missing fields without throwing', () => {
    const defectiveItems = [
      { id: 'd1', name: 'Incomplete Item' } // missing all numeric fields
    ];
    const ranked = rankProducts(defectiveItems, DEFAULT_PRIORITIES);
    expect(ranked.length).toBe(1);
    expect(ranked[0].finalScore).toBeDefined();
    expect(ranked[0].rank).toBe(1);
  });

  it('explanation mentions the real dominant criterion that influenced the rank', () => {
    const weights = {
      price: 10,
      carbon: 10,
      plastic: 100,
      water: 10,
      local: 10,
      certs: 10,
      ecoScore: 10
    };
    const ranked = rankProducts(productsData, weights);
    expect(ranked[0].dominantCriterion).toBe('plastic');
    expect(ranked[0].explanation).toContain('plastic');
  });

  it('parses natural language priority updates from user input', () => {
    const priceIntent = parsePriorityIntent('I care most about price');
    expect(priceIntent).not.toBeNull();
    expect(priceIntent.price).toBe(100);

    const plasticIntent = parsePriorityIntent('plastic matters more to me');
    expect(plasticIntent).not.toBeNull();
    expect(plasticIntent.plastic).toBe(100);

    const presetIntent = parsePriorityIntent('show me lowest carbon options');
    expect(presetIntent).not.toBeNull();
    expect(presetIntent.carbon).toBe(100);
  });

  it('formats active priorities summary correctly for the agent', () => {
    const summary = formatPrioritiesSummary({ plastic: 80, price: 40 });
    expect(summary).toContain('Ranking with your priorities:');
    expect(summary).toContain('Plastic 80');
    expect(summary).toContain('Price 40');
  });
});
