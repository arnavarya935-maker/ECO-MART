import { describe, it, expect, beforeEach } from 'vitest';
import productsData from '../src/data/products.json';
import {
  recordSignal,
  getPersonalizedRanking,
  resetPreferences,
  getStoredSignals
} from '../src/lib/preferenceModel';
import { DEFAULT_PRIORITIES } from '../src/lib/decisionEngine';

describe('Phase 6 - Personalised "For You" (On-Device Learning)', () => {
  beforeEach(() => {
    resetPreferences();
  });

  it('records category views, product opens, and swap signals locally', () => {
    recordSignal('category_view', 'Kitchen');
    recordSignal('category_view', 'Kitchen');
    recordSignal('product_open', { id: 'prod-001', category: 'Kitchen' });
    recordSignal('swap_accepted');

    const signals = getStoredSignals();
    expect(signals.categoryViews['Kitchen']).toBe(3);
    expect(signals.productOpens['prod-001']).toBe(1);
    expect(signals.swapsAccepted).toBe(1);
  });

  it('boosts products from preferred categories in personalized ranking', () => {
    // Baseline ranking without signals
    const neutralRanking = getPersonalizedRanking(productsData, DEFAULT_PRIORITIES, {
      categoryViews: {},
      productOpens: {},
      wishlistAdds: {},
      cartAdds: {},
      swapsAccepted: 0,
      swapsDeclined: 0
    });
    expect(neutralRanking.length).toBeGreaterThan(0);

    // Ranking with strong Kitchen preference
    const kitchenSignals = {
      categoryViews: { Kitchen: 5 },
      productOpens: {},
      wishlistAdds: {},
      cartAdds: {},
      swapsAccepted: 0,
      swapsDeclined: 0
    };
    const personalizedRanking = getPersonalizedRanking(productsData, DEFAULT_PRIORITIES, kitchenSignals);

    // Top items should include Kitchen products with personalized reasons
    const topPick = personalizedRanking[0];
    expect(topPick.category).toBe('Kitchen');
    expect(topPick.personalizedReason).toContain('Kitchen');
    expect(topPick.personalizationBoost).toBeGreaterThan(0);
  });

  it('boosts zero-plastic items when swaps have been accepted', () => {
    const swapSignals = {
      categoryViews: {},
      productOpens: {},
      wishlistAdds: {},
      cartAdds: {},
      swapsAccepted: 3,
      swapsDeclined: 0
    };
    const ranked = getPersonalizedRanking(productsData, DEFAULT_PRIORITIES, swapSignals);
    const zeroPlasticPicks = ranked.filter((p) => p.plasticGrams === 0);
    expect(zeroPlasticPicks[0].personalizedReason).toContain('plastic-free swaps');
  });

  it('resetPreferences clears all learned signals back to default baseline', () => {
    recordSignal('category_view', 'Stationery');
    recordSignal('swap_accepted');
    expect(getStoredSignals().swapsAccepted).toBe(1);

    resetPreferences();
    const cleared = getStoredSignals();
    expect(cleared.swapsAccepted).toBe(0);
    expect(Object.keys(cleared.categoryViews).length).toBe(0);
  });
});
