import { describe, it, expect } from 'vitest';
import {
  CITY_RECYCLING_GUIDES,
  REPAIR_REUSE_GUIDES,
  analyzePackaging,
  getSecondLifePosts,
  addSecondLifePost,
  generateWeeklyEcoReview,
  exportWishlistCode,
  importWishlistCode
} from '../src/lib/circularityEngine';

describe('Circularity, Recycling & Community Second Life Engine', () => {
  it('provides verified municipal recycling guidelines for Indian cities', () => {
    expect(CITY_RECYCLING_GUIDES.length).toBeGreaterThanOrEqual(4);
    const bંગ = CITY_RECYCLING_GUIDES.find((c) => c.city === 'Bengaluru');
    expect(bંગ).toBeDefined();
    expect(bંગ.wetWasteColor).toContain('Green');
    expect(bંગ.dryWasteColor).toContain('Blue');
  });

  it('provides category-specific repair guides with difficulty ratings', () => {
    expect(REPAIR_REUSE_GUIDES.length).toBeGreaterThanOrEqual(3);
    const kitchen = REPAIR_REUSE_GUIDES.find((g) => g.category === 'Kitchen');
    expect(kitchen.difficulty).toBeDefined();
    expect(kitchen.tools.length).toBeGreaterThan(0);
    expect(kitchen.steps.length).toBeGreaterThan(1);
  });

  it('analyzes packaging recyclability and disposal streams', () => {
    const plasticFree = analyzePackaging('100% plastic-free recycled kraft box');
    expect(plasticFree.grade).toBe('A');
    expect(plasticFree.isPlasticFree).toBe(true);
    expect(plasticFree.disposalStream).toContain('Paper');

    const mixed = analyzePackaging('virgin plastic blister pack with foil');
    expect(mixed.grade).toBe('D');
    expect(mixed.isPlasticFree).toBe(false);
  });

  it('stores and retrieves community second life board items locally', () => {
    const initial = getSecondLifePosts();
    expect(initial.length).toBeGreaterThan(0);

    const updated = addSecondLifePost({
      title: 'Glass Jars for Fermentation',
      category: 'Kitchen',
      city: 'Bengaluru',
      area: 'Koramangala',
      condition: 'Like New',
      description: 'Clean wide-mouth jars'
    });

    expect(updated[0].title).toBe('Glass Jars for Fermentation');
  });

  it('generates local weekly eco reviews with actionable improvements', () => {
    const review = generateWeeklyEcoReview([{ id: 'ord-1' }], [{ product: { isEcoFriendly: true } }]);
    expect(review.ordersAudited).toBe(1);
    expect(review.co2AvoidedKg).toBeGreaterThan(0);
    expect(review.suggestedImprovement).toBeDefined();
  });

  it('safely exports and imports wishlist collections via base64 URL codes', () => {
    const original = [{ id: 'prod-001' }, { id: 'prod-002' }, { id: 'prod-003' }];
    const code = exportWishlistCode(original);
    expect(code).toBeDefined();
    expect(typeof code).toBe('string');

    const importedIds = importWishlistCode(code);
    expect(importedIds).toEqual(['prod-001', 'prod-002', 'prod-003']);
  });
});
