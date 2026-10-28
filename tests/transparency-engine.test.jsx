import { describe, it, expect } from 'vitest';
import {
  CERTIFICATIONS_DATABASE,
  detectGreenwashPhrases,
  calculateTransparencyScore,
  generateBrandEmailDraft,
  compareProductClaims
} from '../src/lib/transparencyEngine';

describe('Transparency & Greenwash Intelligence Engine', () => {
  it('exposes curated certifications database with real limits and disclaimers', () => {
    expect(CERTIFICATIONS_DATABASE.length).toBeGreaterThan(5);
    const fsc = CERTIFICATIONS_DATABASE.find((c) => c.id === 'fsc');
    expect(fsc).toBeDefined();
    expect(fsc.limitations).toContain('FSC Mix');
    expect(fsc.disclaimer).toContain('Claimed on label, check the issuer\'s registry');
  });

  it('detects greenwashing buzzwords with regulatory standards', () => {
    const text = 'This 100% natural, eco-friendly bamboo mug is chemical-free and sustainable!';
    const detected = detectGreenwashPhrases(text);
    expect(detected.length).toBeGreaterThanOrEqual(3);
    const terms = detected.map((d) => d.term);
    expect(terms).toContain('100% Natural');
    expect(terms).toContain('Eco-Friendly / Green');
    expect(terms).toContain('Chemical Free');
    expect(detected[0].regulatoryStandard).toBeDefined();
  });

  it('calculates brand transparency score and tracks missing disclosures', () => {
    const fullProduct = {
      name: 'Eco Dish Bar',
      brand: 'CleanGreen',
      carbonKg: 0.15,
      plasticGrams: 0,
      waterLitres: 12,
      material: 'Saponified coconut oil',
      origin: 'Kerala, India',
      packaging: 'Recycled card box',
      disposal: '100% home compostable box, soap washes away safely',
      certifications: ['India Organic', 'Cruelty Free']
    };

    const scorecard = calculateTransparencyScore(fullProduct);
    expect(scorecard.score).toBe(100);
    expect(scorecard.grade).toBe('A');
    expect(scorecard.missing.length).toBe(0);

    const emptyProduct = { name: 'Mystery Soap' };
    const lowScorecard = calculateTransparencyScore(emptyProduct);
    expect(lowScorecard.score).toBeLessThan(50);
    expect(lowScorecard.missing.length).toBeGreaterThan(4);
  });

  it('generates polite client-side mailto draft for missing data', () => {
    const product = { name: 'Bamboo Toothbrush', brand: 'EcoBrush' };
    const missing = [{ name: 'Embodied Carbon' }, { name: 'Packaging Type' }];
    const mailto = generateBrandEmailDraft(product, missing);
    expect(mailto).toContain('mailto:sustainability@ecobrush.com');
    expect(mailto).toContain('Bamboo%20Toothbrush');
    expect(mailto).toContain('Embodied%20Carbon');
  });

  it('compares product claims and transparency side-by-side', () => {
    const p1 = {
      id: 'p1',
      name: 'Pure Green Natural Dish Soap',
      claims: ['100% natural formula', 'Chemical-free cleansing'],
      carbonKg: 1.2
    };
    const p2 = {
      id: 'p2',
      name: 'Organic Plant Bar Soap',
      claims: ['Cold-pressed coconut soap'],
      carbonKg: 0.2,
      plasticGrams: 0,
      waterLitres: 5,
      material: 'Organic coconut',
      origin: 'Goa',
      packaging: 'Paper wrap',
      disposal: 'Compost wrap',
      certifications: ['GOTS']
    };

    const comparison = compareProductClaims(p1, p2);
    expect(comparison.productA.flaggedPhrases.length).toBeGreaterThan(0);
    expect(comparison.productB.transparency.score).toBeGreaterThan(comparison.productA.transparency.score);
    expect(comparison.recommendation).toContain('Organic Plant Bar Soap');
  });
});
