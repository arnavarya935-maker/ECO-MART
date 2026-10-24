import { describe, it, expect } from 'vitest';
import {
  HOUSEHOLD_PROFILES,
  OCCASION_KITS,
  parseIntentSearch,
  recommendGifts,
  recordSwapDecision,
  getSwapLearnings
} from '../src/lib/personaEngine';

describe('Persona & Intent Search Engine', () => {
  it('provides student, family, senior, and minimalist household profiles', () => {
    expect(HOUSEHOLD_PROFILES.student).toBeDefined();
    expect(HOUSEHOLD_PROFILES.student.constraints.maxPrice).toBe(800);
    expect(HOUSEHOLD_PROFILES.family.constraints.onlyPlasticFree).toBe(true);
    expect(HOUSEHOLD_PROFILES.senior.weights.local).toBeGreaterThanOrEqual(90);
  });

  it('parses natural language shopping intents and extracts constraint chips', () => {
    const query = 'plastic-free kitchen under 800';
    const parsed = parseIntentSearch(query);
    expect(parsed.extractedConstraints.maxPrice).toBe(800);
    expect(parsed.extractedConstraints.onlyPlasticFree).toBe(true);
    expect(parsed.extractedConstraints.category).toBe('Kitchen');
    expect(parsed.recognizedChips).toContain('Max ₹800');
    expect(parsed.recognizedChips).toContain('Plastic-Free Only');
  });

  it('curates seasonal occasion kits from catalog categories', () => {
    expect(OCCASION_KITS.length).toBeGreaterThanOrEqual(4);
    const dorm = OCCASION_KITS.find((k) => k.id === 'dorm-movein');
    expect(dorm).toBeDefined();
    expect(dorm.targetCategories).toContain('Personal Care');
  });

  it('recommends gifts grounded in budget and occasion context', () => {
    const catalog = [
      { id: '1', name: 'Soy Candle', category: 'Home & Living', price: 450, isEcoFriendly: true, packaging: 'plastic-free' },
      { id: '2', name: 'Luxury Mattress', category: 'Home & Living', price: 15000 },
      { id: '3', name: 'Wooden Puzzle Toy', category: 'Home & Living', price: 350, isEcoFriendly: true }
    ];

    const festivalGifts = recommendGifts({ recipient: 'friend', occasion: 'festival', budget: 1000, catalog });
    expect(festivalGifts.length).toBeGreaterThan(0);
    expect(festivalGifts[0].price).toBeLessThanOrEqual(1000);
    expect(festivalGifts[0].id).toBe('1');
    expect(festivalGifts[0].giftReason).toBeDefined();
  });

  it('records and reads local swap decision history', () => {
    recordSwapDecision('swap_test_1', true, { id: 'plastic_brush' }, { id: 'bamboo_brush', name: 'Bamboo Toothbrush' });
    recordSwapDecision('swap_test_2', false, { id: 'shampoo_bottle' }, { id: 'shampoo_bar', name: 'Shampoo Bar' });

    const learnings = getSwapLearnings();
    expect(learnings.totalDecisions).toBeGreaterThanOrEqual(2);
    expect(learnings.rejectedIds).toContain('shampoo_bar');
  });
});
