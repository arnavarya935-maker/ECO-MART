import { describe, it, expect } from 'vitest';
import productsData from '../src/data/products.json';
import { analyzeExternalProduct } from '../src/lib/ecoCheck';
import { DEFAULT_PRIORITIES } from '../src/lib/decisionEngine';

describe('Phase 2 - Eco Check Any Product', () => {
  it('flags plastic bottle with "eco friendly" claim as greenwashing and estimates low grade', () => {
    const input = 'Plastic water bottle, eco friendly, BPA free';
    const analysis = analyzeExternalProduct(input, DEFAULT_PRIORITIES, productsData);

    expect(analysis.isVague).toBe(false);
    expect(analysis.isEstimate).toBe(true);
    expect(analysis.redFlags.length).toBeGreaterThan(0);

    // Should flag synthetic material
    const hasPlasticFlag = analysis.redFlags.some((f) => f.toLowerCase().includes('plastic') || f.toLowerCase().includes('synthetic'));
    expect(hasPlasticFlag).toBe(true);

    // Should flag greenwashing / unverified claim
    const hasGreenwashFlag = analysis.redFlags.some((f) => f.toLowerCase().includes('greenwashing') || f.toLowerCase().includes('unverified'));
    expect(hasGreenwashFlag).toBe(true);

    // Should estimate low grade (D or E)
    expect(['D', 'E']).toContain(analysis.estimatedGrade);

    // Should recommend up to 3 catalogue alternatives
    expect(analysis.alternatives.length).toBe(3);
    expect(analysis.alternatives[0].estimatedPlasticSavedGrams).toBeGreaterThan(0);
  });

  it('scores GOTS organic cotton product with high score and green signals', () => {
    const input = 'GOTS certified organic cotton t-shirt with plastic-free packaging';
    const analysis = analyzeExternalProduct(input, DEFAULT_PRIORITIES, productsData);

    expect(analysis.isVague).toBe(false);
    expect(analysis.estimatedScore).toBeGreaterThanOrEqual(75);
    expect(['A', 'B']).toContain(analysis.estimatedGrade);
    expect(analysis.greenSignals.length).toBeGreaterThan(0);

    const hasCertSignal = analysis.greenSignals.some((s) => s.toLowerCase().includes('gots'));
    expect(hasCertSignal).toBe(true);
  });

  it('triggers clarifying question with quick chips for overly vague inputs', () => {
    const vague1 = analyzeExternalProduct('', DEFAULT_PRIORITIES, productsData);
    expect(vague1.isVague).toBe(true);
    expect(vague1.clarification).toBeDefined();
    expect(vague1.clarification.chips.length).toBeGreaterThan(0);

    const vague2 = analyzeExternalProduct('bottle', DEFAULT_PRIORITIES, productsData);
    expect(vague2.isVague).toBe(true);
    expect(vague2.clarification.question).toContain('bottle');
    expect(vague2.clarification.chips.length).toBeGreaterThan(0);
  });

  it('labels all output numbers as estimates honestly', () => {
    const analysis = analyzeExternalProduct('Polyester backpack', DEFAULT_PRIORITIES, productsData);
    expect(analysis.isEstimate).toBe(true);
    expect(typeof analysis.estimatedScore).toBe('number');
    expect(typeof analysis.confidence).toBe('string');
  });
});
