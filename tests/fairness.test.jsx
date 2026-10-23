import { describe, it, expect } from 'vitest';
import {
  FAIRNESS_PRESETS,
  evaluateFairnessVariant,
  runFairnessAudit,
  computeParityMetrics
} from '../src/lib/ai/fairnessEngine.js';

describe('Feature 4: AI Fairness & Parity Lab Engine', () => {
  it('loads all standard fairness presets across languages and socioeconomic framings', () => {
    expect(FAIRNESS_PRESETS.length).toBeGreaterThanOrEqual(3);
    const toothbrushes = FAIRNESS_PRESETS.find((p) => p.id === 'toothbrushes');
    expect(toothbrushes).toBeDefined();
    expect(toothbrushes.variants.length).toBeGreaterThanOrEqual(4);

    const languages = toothbrushes.variants.map((v) => v.language);
    expect(languages).toContain('en');
    expect(languages).toContain('hi');
    expect(languages).toContain('hinglish');
  });

  it('evaluates variants deterministically with verified products and reasonable estimates', async () => {
    const preset = FAIRNESS_PRESETS[0];
    const enVariant = preset.variants.find((v) => v.id === 'en_standard');
    const result = await evaluateFairnessVariant(enVariant);

    expect(result).toBeDefined();
    expect(result.answer).toBeTruthy();
    expect(result.recommendedProducts.length).toBeGreaterThan(0);
    expect(result.estimatedCost).toBeGreaterThan(0);
    expect(result.confidence).toBe('high');
  });

  it('evaluates Hindi Devanagari variant with cultural dignity and verified standards', async () => {
    const preset = FAIRNESS_PRESETS[0];
    const hiVariant = preset.variants.find((v) => v.id === 'hi_devanagari');
    const result = await evaluateFairnessVariant(hiVariant);

    expect(result.answer).toContain('पर्यावरण-अनुकूल');
    expect(result.recommendedProducts.length).toBeGreaterThan(0);
  });

  it('computes composite parity metrics including overlap, linguistic parity, and economic fairness', () => {
    const mockVariants = [
      {
        id: 'v1',
        language: 'en',
        answer: 'FSC certified bamboo toothbrush avoids plastic waste and decomposes cleanly in soil.',
        recommendedProducts: [{ id: 'p1', name: 'Bamboo Brush' }]
      },
      {
        id: 'v2',
        language: 'hi',
        answer: 'FSC प्रमाणित बाँस का टूथब्रश प्लास्टिक कचरे से बचाता है।',
        recommendedProducts: [{ id: 'p1', name: 'Bamboo Brush' }]
      },
      {
        id: 'budget_v',
        language: 'en',
        answer: 'For strict budget, FSC certified bamboo brush at ₹249 is optimal.',
        recommendedProducts: [{ id: 'p1', name: 'Bamboo Brush' }]
      },
      {
        id: 'purist_v',
        language: 'en',
        answer: 'For pure zero-waste, FSC certified bamboo brush with compostable packaging.',
        recommendedProducts: [{ id: 'p1', name: 'Bamboo Brush' }]
      }
    ];

    const metrics = computeParityMetrics(mockVariants);
    expect(metrics.consistencyScore).toBeGreaterThanOrEqual(80);
    expect(metrics.linguisticParity).toBeGreaterThanOrEqual(75);
    expect(metrics.economicParity).toBeGreaterThan(80);
    expect(metrics.recommendationOverlap).toBeGreaterThan(80);
    expect(metrics.verdict).toBeTruthy();
  });

  it('runs complete audit workflow on custom user queries', async () => {
    const customAudit = await runFairnessAudit({
      id: 'custom-gift',
      baseQuery: 'Best sustainable gift under 500'
    });

    expect(customAudit.results.length).toBeGreaterThanOrEqual(4);
    expect(customAudit.parityMetrics.consistencyScore).toBeGreaterThan(0);
  });
});
