import { describe, it, expect, beforeEach } from 'vitest';
import { en } from '../src/i18n/en.js';
import { hi } from '../src/i18n/hi.js';
import { parseShoppingIntent } from '../src/lib/ecoAgent.js';

describe('Phase 7: i18n & Hindi/English Bilingual Support', () => {
  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  it('contains valid non-empty dictionaries with matching major keys', () => {
    expect(en['nav.shop']).toBeDefined();
    expect(hi['nav.shop']).toBeDefined();
    expect(en['hero.title']).toBeDefined();
    expect(hi['hero.title']).toBeDefined();
    expect(hi['cart.checkout']).toBeDefined();
    expect(hi['settings.language']).toBeDefined();

    // Verify all English keys have a corresponding Hindi translation
    const enKeys = Object.keys(en);
    enKeys.forEach((key) => {
      expect(hi[key]).toBeDefined();
      expect(typeof hi[key]).toBe('string');
      expect(hi[key].length).toBeGreaterThan(0);
    });
  });

  it('parses Hindi and Hinglish queries for cheapest price intent', () => {
    const res1 = parseShoppingIntent('sabse sasta product dikhao');
    expect(res1.sortBy).toBe('price-asc');

    const res2 = parseShoppingIntent('कम दाम वाला सामान');
    expect(res2.sortBy).toBe('price-asc');

    const res3 = parseShoppingIntent('sasti green bottle');
    expect(res3.sortBy).toBe('price-asc');
  });

  it('parses Hindi gift queries accurately', () => {
    const res1 = parseShoppingIntent('dost ke liye tohfa under 1000');
    expect(res1.isGift).toBe(true);
    expect(res1.maxBudget).toBe(1000);

    const res2 = parseShoppingIntent('माता पिता के लिए उपहार');
    expect(res2.isGift).toBe(true);
  });

  it('parses Hindi categories accurately', () => {
    const resKitchen = parseShoppingIntent('रसोई के बर्तन');
    expect(resKitchen.category).toBe('Kitchen');

    const resCare = parseShoppingIntent('organic sabun');
    expect(resCare.category).toBe('Personal Care');

    const resBags = parseShoppingIntent('cotton jhola');
    expect(resBags.category).toBe('Bags');
  });

  it('parses Hindi cart review query', () => {
    const resCart = parseShoppingIntent('thela check karo');
    expect(resCart.isCartReview).toBe(true);

    const resDevanagari = parseShoppingIntent('झोला जांचें');
    expect(resDevanagari.isCartReview).toBe(true);
  });
});
