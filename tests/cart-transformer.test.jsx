import React from 'react';
import { describe, it, expect } from 'vitest';
import {
  parseShoppingList,
  matchItem,
  transformShoppingList
} from '../src/lib/cartTransformer.js';
import productsData from '../src/data/products.json';
import TransformerThinking from '../src/components/transformer/TransformerThinking';
import TransformerSummaryBar from '../src/components/transformer/TransformerSummaryBar';
import TransformerComparison from '../src/components/transformer/TransformerComparison';
import { EXAMPLE_PRESETS } from '../src/components/transformer/TransformerInputCard';
import { en } from '../src/i18n/en.js';
import { hi } from '../src/i18n/hi.js';

describe('Cart Transformer Engine - Phase 1 & 4', () => {
  describe('parseShoppingList', () => {
    it('parses standard comma-separated list with quantity and budget', () => {
      const input = 'toothbrush, shampoo bottle, 2 plastic water bottles, notebooks, dish soap, polybags under ₹1500';
      const parsed = parseShoppingList(input);

      expect(parsed.isEmpty).toBe(false);
      expect(parsed.budget).toBe(1500);
      expect(parsed.items.length).toBe(6);

      const bottleItem = parsed.items.find((i) => i.name.includes('water bottle'));
      expect(bottleItem).toBeDefined();
      expect(bottleItem.qty).toBe(2);
    });

    it('handles alternative budget phrasings (below, budget, tak, within)', () => {
      expect(parseShoppingList('toothbrush below 500').budget).toBe(500);
      expect(parseShoppingList('shampoo budget ₹800').budget).toBe(800);
      expect(parseShoppingList('notebooks 1200 tak').budget).toBe(1200);
      expect(parseShoppingList('water bottle within 1000 rupees').budget).toBe(1000);
      expect(parseShoppingList('shampoo under 50').budget).toBe(50);
    });

    it('handles Hinglish numbers and phrases ("do", "teen", "ki bottle")', () => {
      const parsed = parseShoppingList('2 plastic ki bottle, tooth brush, sabun, notebok');
      expect(parsed.items.length).toBe(4);

      const bottle = parsed.items.find((i) => i.name.includes('plastic bottle'));
      expect(bottle).toBeDefined();
      expect(bottle.qty).toBe(2);

      const hindiWordParsed = parseShoppingList('do bottle, teen notebook');
      expect(hindiWordParsed.items[0].qty).toBe(2);
      expect(hindiWordParsed.items[1].qty).toBe(3);
    });

    it('handles bullets, numbered lists, "+", "&", and "and"', () => {
      const input = '1. toothbrush\n2. shampoo\n- 2 notebooks & 3 pens + dish soap and polybags';
      const parsed = parseShoppingList(input);
      expect(parsed.items.length).toBe(6);
    });

    it('merges duplicate items by summing their quantities', () => {
      const input = 'toothbrush, 2 toothbrush, notebook, 3x notebook';
      const parsed = parseShoppingList(input);
      expect(parsed.items.length).toBe(2);

      const tb = parsed.items.find((i) => i.name.toLowerCase() === 'toothbrush');
      expect(tb.qty).toBe(3);

      const nb = parsed.items.find((i) => i.name.toLowerCase() === 'notebook');
      expect(nb.qty).toBe(4);
    });

    it('caps input at 25 items and sets cappedAt25 flag', () => {
      const longList = Array.from({ length: 30 }, (_, i) => `item ${i + 1}`).join(', ');
      const parsed = parseShoppingList(longList);
      expect(parsed.items.length).toBe(25);
      expect(parsed.cappedAt25).toBe(true);
    });

    it('handles empty or whitespace-only inputs gracefully', () => {
      expect(parseShoppingList('').isEmpty).toBe(true);
      expect(parseShoppingList('   \n\t  ').isEmpty).toBe(true);
      expect(parseShoppingList(null).isEmpty).toBe(true);
      expect(parseShoppingList(undefined).isEmpty).toBe(true);
    });
  });

  describe('matchItem', () => {
    it('matches common household terms and plurals to catalogue items', () => {
      const m1 = matchItem('toothbrush', productsData);
      expect(m1.status).toBe('matched');
      expect(m1.typeKey).toBe('toothbrush');

      const m2 = matchItem('shampoo bottle', productsData);
      expect(m2.status).toBe('matched');
      expect(m2.typeKey).toBe('shampoo');

      const m3 = matchItem('notebooks', productsData);
      expect(m3.status).toBe('matched');
      expect(m3.typeKey).toBe('notebook');
    });

    it('handles typos within edit distance <= 2 on catalogue terms', () => {
      const typo1 = matchItem('toothbrsh', productsData);
      expect(typo1.status).toBe('matched');
      expect(typo1.typeKey).toBe('toothbrush');

      const typo2 = matchItem('notebok', productsData);
      expect(typo2.status).toBe('matched');
      expect(typo2.typeKey).toBe('notebook');
    });

    it('returns ambiguous status with clarifying chips for bare "bottle"', () => {
      const amb = matchItem('bottle', productsData);
      expect(amb.status).toBe('ambiguous');
      expect(amb.clarifyingQuestion).toContain('water bottle or a shampoo bottle');
      expect(amb.chips).toEqual(['Water bottle', 'Shampoo bottle']);
    });

    it('reports unmatched items honestly with no unrelated suggestions for distance > 2', () => {
      const unmatched = matchItem('spaceship', productsData);
      expect(unmatched.status).toBe('unmatched');
      expect(unmatched.suggestion).toBeNull();
      expect(unmatched.confidence).toBe(0);
    });
  });

  describe('optimizeCart & knapsack', () => {
    it('keeps total price <= budget whenever feasible', () => {
      const result = transformShoppingList(
        'toothbrush, shampoo bottle, 2 plastic water bottles, notebooks, dish soap, polybags under ₹1500',
        productsData
      );

      expect(result.totals.priceAfter).toBeLessThanOrEqual(1500);
      expect(result.totals.priceAfter).toBeGreaterThan(0);
      expect(result.totals.itemsSwapped).toBeGreaterThan(0);
      expect(result.trace.length).toBe(5);
    });

    it('never picks an option with a lower EcoScore than baseline', () => {
      const result = transformShoppingList('toothbrush, shampoo, notebooks', productsData);
      for (const item of result.items) {
        if (item.status === 'swapped' && item.before && item.after) {
          expect(item.after.isEcoFriendly).toBe(true);
        }
      }
    });

    it('picks higher impact swap when budget allows only one upgrade', () => {
      // Baseline: toothbrush (120) + shampoo (280) = 400.
      // Upgrades: toothbrush -> 249 (+129), shampoo -> 320 (+40).
      // If budget is 450: only shampoo upgrade (+40) fits within 450 (440 <= 450).
      const result = transformShoppingList('toothbrush, shampoo', productsData, undefined, 450);
      expect(result.totals.priceAfter).toBeLessThanOrEqual(450);
      const swapped = result.items.filter((i) => i.status === 'swapped');
      expect(swapped.length).toBe(1);
      expect(swapped[0].name.toLowerCase()).toContain('shampoo');
    });

    it('defaults budget to baseline * 1.15 when no budget is specified', () => {
      const result = transformShoppingList('toothbrush, shampoo', productsData);
      const expectedDefaultBudget = Math.round(result.totals.priceBefore * 1.15);
      expect(result.budget).toBe(expectedDefaultBudget);
    });

    it('flags overBudget when budget is too low, returning sensible cheapest options', () => {
      const result = transformShoppingList('toothbrush, shampoo under ₹50', productsData);
      expect(result.totals.overBudget).toBe(true);
      expect(result.overBudget).toBe(true);
      expect(result.totals.priceAfter).toBeGreaterThan(50);
    });
  });

  describe('totals consistency across 40 diverse inputs', () => {
    const variedInputs = [
      '',
      '   ',
      'toothbrush',
      'shampoo bottle',
      '2 plastic water bottles',
      'dish soap',
      'polybags',
      'notebooks, pens',
      'notebook, pen, desk tidy',
      'cutlery, straw, bowls',
      'cling wrap, food wrap',
      'shaving razor, lip balm',
      'shirt, sneakers',
      'socks, scarf, stole',
      'soy candle, terracotta pot',
      'serving tray, doormat',
      'ceramic planter, flower pot',
      'laptop bag, gym duffel',
      'camping lantern, flashlight',
      'yoga mat, picnic blanket',
      'laundry powder, cleaner spray',
      'toilet brush, bathroom cleaner',
      'bottle',
      'bottles',
      'spaceship',
      'alien spaceship, galaxy',
      'toothbrsh',
      'notebok',
      'sabun',
      '2 plastic ki bottle, tooth brush, sabun, notebok',
      'do bottle, teen notebook, char pen',
      'bamboo toothbrush, solid shampoo bar, copper bottle',
      'plantable seed paper journal, cork bullet journal',
      'toothbrush, shampoo under ₹50',
      'toothbrush, shampoo, water bottle under ₹800',
      'notebooks, pens, water bottle, backpack under ₹1500',
      'toothbrush, shampoo bottle, soap, razor, toilet brush under ₹1200',
      'dish soap, sponges, food cling wrap, cutlery, carry bags under ₹1000',
      '1. toothbrush\n2. shampoo\n3. notebooks',
      'toothbrush and shampoo & notebooks + dish soap'
    ];

    it('never produces NaN or undefined across 40 diverse inputs', () => {
      expect(variedInputs.length).toBe(40);

      for (const input of variedInputs) {
        const res = transformShoppingList(input, productsData);
        expect(Number.isNaN(res.totals.priceBefore)).toBe(false);
        expect(Number.isNaN(res.totals.priceAfter)).toBe(false);
        expect(Number.isNaN(res.totals.purposeScoreBefore)).toBe(false);
        expect(Number.isNaN(res.totals.purposeScoreAfter)).toBe(false);
        expect(Number.isNaN(res.totals.plasticSaved)).toBe(false);
        expect(Number.isNaN(res.totals.co2Saved)).toBe(false);
        expect(Number.isNaN(res.totals.waterSaved)).toBe(false);

        const json = JSON.stringify(res);
        expect(json.includes('NaN')).toBe(false);
        expect(json.includes('undefined')).toBe(false);
      }
    });

    it('ensures quantity-weighted per-item sums equal total savings', () => {
      const res = transformShoppingList(
        'toothbrush, shampoo bottle, 2 plastic water bottles, notebooks, dish soap, polybags',
        productsData
      );

      let calcPlastic = 0;
      let calcCo2 = 0;
      let calcPriceBefore = 0;
      let calcPriceAfter = 0;

      for (const item of res.items) {
        if (!item.before && !item.after) continue;
        const qty = item.qty || 1;
        const base = item.before || item.after;
        const chosen = item.after || item.before;

        calcPriceBefore += (base.price || 0) * qty;
        calcPriceAfter += (chosen.price || 0) * qty;

        if (item.status === 'swapped' && chosen.id !== base.id) {
          calcPlastic += Math.max(0, ((base.plasticGrams || 0) - (chosen.plasticGrams || 0)) * qty);
          calcCo2 += Math.max(0, ((base.carbonKg || 0) - (chosen.carbonKg || 0)) * qty);
        }
      }

      expect(res.totals.priceBefore).toBe(calcPriceBefore);
      expect(res.totals.priceAfter).toBe(calcPriceAfter);
      expect(res.totals.plasticSaved).toBe(Math.round(calcPlastic));
      expect(res.totals.co2Saved).toBe(Number(calcCo2.toFixed(2)));
    });

    it('recognises already-eco items and keeps them with zero or minimal delta', () => {
      const result = transformShoppingList(
        'bamboo toothbrush, solid shampoo bar, copper bottle',
        productsData
      );

      const keptItems = result.items.filter((i) => i.status === 'kept');
      expect(keptItems.length).toBeGreaterThan(0);
      expect(result.totals.purposeScoreBefore).toBeGreaterThanOrEqual(80);
      expect(result.totals.purposeScoreAfter).toBeGreaterThanOrEqual(result.totals.purposeScoreBefore);
    });
  });

  describe('UI & I18n Integration', () => {
    it('defines all required preset examples in English and Hindi', () => {
      expect(EXAMPLE_PRESETS.length).toBe(4);
      for (const preset of EXAMPLE_PRESETS) {
        expect(en[preset.labelKey]).toBeDefined();
        expect(hi[preset.labelKey]).toBeDefined();
        expect(preset.text.length).toBeGreaterThan(0);
      }
    });

    it('has all transformer translation keys populated in both en and hi dictionaries', () => {
      const requiredKeys = [
        'transformer.title',
        'transformer.subtitle',
        'transformer.badge',
        'transformer.inputPlaceholder',
        'transformer.budgetLabel',
        'transformer.transformCta',
        'transformer.thinkingTitle',
        'transformer.beforeCart',
        'transformer.afterCart',
        'transformer.purposeScore',
        'transformer.purposeScoreTooltip',
        'transformer.addAllCta',
        'transformer.startOverCta'
      ];

      for (const key of requiredKeys) {
        expect(en[key]).toBeDefined();
        expect(hi[key]).toBeDefined();
      }
    });

    it('exports functional React components for thinking, summary, and comparison', () => {
      expect(typeof TransformerThinking).toBe('function');
      expect(typeof TransformerSummaryBar).toBe('function');
      expect(typeof TransformerComparison).toBe('function');
    });
  });
});
