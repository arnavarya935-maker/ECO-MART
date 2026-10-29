import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import {
  askEcoAgent,
  generateLocalFallbackAnswer,
  auditGreenwashingClaim,
  generateLocalGreenwashingVerdict
} from '../src/lib/ai/geminiAdapter.js';
import ReasoningExplanationCard from '../src/components/EcoAgent/ReasoningExplanationCard.jsx';
import AIEnergyMeter from '../src/components/EcoAgent/AIEnergyMeter.jsx';
import SecondLifeTab from '../src/components/lifecycle/SecondLifeTab.jsx';
import AIEthicsCard from '../src/components/decision/AIEthicsCard.jsx';
import productsData from '../src/data/products.json';

describe('Responsible AI Integration & Graceful Degradation', () => {
  describe('1. Gemini AI Adapter & Structured Schema', () => {
    it('returns structured JSON with all mandatory fields on local fallback', () => {
      const result = generateLocalFallbackAnswer('Tell me about bamboo toothbrushes vs plastic');
      expect(result).toBeDefined();
      expect(result.answer).toContain('bamboo toothbrush');
      expect(typeof result.reasoning_summary).toBe('string');
      expect(result.reasoning_summary.length).toBeGreaterThan(10);
      expect(Array.isArray(result.sources_or_assumptions)).toBe(true);
      expect(result.sources_or_assumptions.length).toBeGreaterThan(0);
      expect(['low', 'medium', 'high']).toContain(result.confidence);
      expect(typeof result.estimated_energy_wh).toBe('number');
      expect(result.estimated_energy_wh).toBeGreaterThan(0);
      expect(result.isFallback).toBe(true);
    });

    it('falls back gracefully when network/API call fails', async () => {
      const result = await askEcoAgent({ query: 'Find an eco-friendly gift under ₹1000' });
      expect(result).toBeDefined();
      expect(result.answer).toBeTruthy();
      expect(result.reasoning_summary).toBeTruthy();
      expect(result.sources_or_assumptions.length).toBeGreaterThan(0);
      expect(result.estimated_energy_wh).toBeGreaterThan(0);
    });

    it('returns "I am not sure" when asked about unknown products or unverified facts', () => {
      const result = generateLocalFallbackAnswer('What is the certified carbon of Martian space rocks?');
      expect(result.answer.toLowerCase()).toContain('not sure');
      expect(result.confidence).toBe('low');
    });
  });

  describe('2. Greenwashing Detective Audit', () => {
    it('detects vague buzzwords and penalizes trust score for deceptive claims', () => {
      const claim = '100% eco-friendly green bottle made from pure ocean-bound plastic. Chemical-free and zero harm to nature.';
      const verdict = generateLocalGreenwashingVerdict(claim);

      expect(verdict.trust_score).toBeLessThanOrEqual(50);
      expect(verdict.flagged_phrases.length).toBeGreaterThanOrEqual(1);
      expect(verdict.missing_proofs.length).toBeGreaterThanOrEqual(1);
      expect(verdict.verdict.toLowerCase()).toMatch(/high.*risk|misleading|vague/i);
    });

    it('awards high trust score to claims with verified certifications and specific metrics', () => {
      const claim = 'GOTS certified 100% organic cotton tote made in India. Reduces 0.8kg CO2e with plastic-free compostable paper packaging.';
      const verdict = generateLocalGreenwashingVerdict(claim);

      expect(verdict.trust_score).toBeGreaterThanOrEqual(80);
      expect(verdict.flagged_phrases.length).toBe(0);
      expect(verdict.verdict.toLowerCase()).toMatch(/verified|credible|low.*risk/i);
    });

    it('handles empty input safely', async () => {
      const emptyAudit = await auditGreenwashingClaim({ text: '' });
      expect(emptyAudit.trust_score).toBe(50);
      expect(emptyAudit.flagged_phrases).toEqual([]);
    });
  });

  describe('3. Explainable Answer Component (ReasoningExplanationCard)', () => {
    it('renders reasoning summary, confidence badge, sources, and energy estimate', () => {
      const html = renderToString(
        <ReasoningExplanationCard
          reasoningSummary="Evaluated cradle-to-grave raw extraction of bamboo vs petroleum cracking."
          sourcesOrAssumptions={['FSC Certification Standard', 'CPCB plastic packaging benchmarks']}
          confidence="high"
          estimatedEnergyWh={0.12}
          model="Gemini 1.5 Flash"
          messageId="msg-101"
          query="Why bamboo toothbrush?"
          initiallyOpen={true}
        />
      );

      expect(html).toContain('How did I decide this?');
      expect(html).toContain('High Confidence');
      expect(html).toContain('Evaluated cradle-to-grave');
      expect(html).toContain('FSC Certification Standard');
      expect(html).toContain('AI estimates are probabilistic');
      expect(html).toContain('0.12');
    });
  });

  describe('4. AI Energy Meter Component', () => {
    it('displays estimated Watt-hours and clearly labels values as estimates', () => {
      const html = renderToString(
        <AIEnergyMeter
          totalSessionWh={0.36}
          lastQueryWh={0.12}
          queryCount={3}
          compact={false}
        />
      );

      expect(html).toContain('AI Compute Energy Meter');
      expect(html).toContain('Estimate');
      expect(html).toContain('0.36');
      expect(html).toContain('0.12');
    });

    it('renders compact mode suitable for header bars', () => {
      const html = renderToString(
        <AIEnergyMeter
          totalSessionWh={0.24}
          lastQueryWh={0.12}
          queryCount={2}
          compact={true}
        />
      );

      expect(html).toContain('AI Compute:');
      expect(html).toContain('0.24');
      expect(html).toContain('est.');
    });
  });

  describe('5. Second Life Tab (Circularity Trajectory)', () => {
    it('renders 3-step visual path (Reuse -> Repair/Recycle -> Dispose Responsibly) for products', () => {
      const sampleItem = productsData[0];
      const html = renderToString(<SecondLifeTab product={sampleItem} />);

      expect(html).toContain('Second Life: Circular Economy Path');
      expect(html).toContain('Reuse');
      expect(html).toContain('Repair');
      expect(html).toContain('Dispose Responsibly');
      expect(html).toContain('Decomposition');
    });
  });

  describe('6. AI Ethics Card Component', () => {
    it('declares no ads or paid placement and shows data factors', () => {
      const sampleItem = productsData[0];
      const html = renderToString(<AIEthicsCard product={sampleItem} compact={false} />);

      expect(html).toContain('AI Ethics');
      expect(html).toContain('No Ads or Paid Placement');
      expect(html).toContain('No ads or paid placement in this project.');
      expect(html).toContain('Data used:');
    });

    it('renders compact clickable chip for product cards', () => {
      const sampleItem = productsData[0];
      const html = renderToString(<AIEthicsCard product={sampleItem} compact={true} />);

      expect(html).toContain('AI Ethics:');
      expect(html).toContain('No Ads or Paid Placement');
    });
  });
});
