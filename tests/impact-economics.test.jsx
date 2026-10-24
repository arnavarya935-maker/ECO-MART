import { describe, it, expect } from 'vitest';
import {
  translateImpactEquivalents,
  calculateCostPerUse,
  calculatePersonalCarbonBudget
} from '../src/lib/impactEconomics';

describe('Impact Economics & Equivalents Engine', () => {
  it('translates raw CO2, plastic, and water into tangible verified equivalents', () => {
    const eq = translateImpactEquivalents({ co2Kg: 5, plasticGrams: 120, waterLitres: 150 });
    expect(eq.carbon.headline).toContain('km in an electric vehicle');
    expect(eq.plastic.headline).toContain('single-use 500ml plastic bottles');
    expect(eq.water.headline).toContain('days of clean drinking water');
    expect(eq.assumptionsNote).toBeDefined();
  });

  it('computes durability cost-per-use and calculates break-even threshold', () => {
    // Durable bamboo razor ₹500 used 300 times vs disposable razor ₹25 used 5 times
    const econ = calculateCostPerUse({
      durablePrice: 500,
      durableUsesCount: 300,
      disposablePrice: 25,
      disposableUsesCount: 5
    });

    expect(econ.durable.costPerUse).toBeLessThan(econ.disposable.costPerUse);
    expect(econ.breakEvenUses).toBe(100);
    expect(econ.netLifetimeSavings).toBe(1000); // (25/5)*300 - 500 = 1500 - 500 = 1000
    expect(econ.verdict).toContain('Breaks even after 100 uses');
  });

  it('calculates personal monthly carbon budget consumption status', () => {
    const budgetSafe = calculatePersonalCarbonBudget(15, 50);
    expect(budgetSafe.status).toBe('safe');
    expect(budgetSafe.remainingKg).toBe(35);
    expect(budgetSafe.percentage).toBe(30);

    const budgetWarning = calculatePersonalCarbonBudget(42, 50);
    expect(budgetWarning.status).toBe('approaching');

    const budgetExceeded = calculatePersonalCarbonBudget(65, 50);
    expect(budgetExceeded.status).toBe('exceeded');
    expect(budgetExceeded.isOverBudget).toBe(true);
  });
});
