import { describe, it, expect } from 'vitest';
import { CACHED_DEBATES, generateDynamicCourtroomDebate } from '../src/lib/ai/courtroomEngine.js';
import { SAMPLE_LABELS, scanProductLabel } from '../src/lib/ai/labelScanner.js';
import {
  getStrictnessThreshold,
  setStrictnessThreshold,
  evaluateConfidenceBrake
} from '../src/lib/ai/confidenceBrake.js';
import { ETHICS_DILEMMAS } from '../src/lib/ai/dilemmasData.js';
import { generateAISelfAuditReport } from '../src/lib/ai/selfAuditEngine.js';

describe('Additional Features Verification (F1 to F8)', () => {
  describe('F1: AI Courtroom (/courtroom)', () => {
    it('provides cached example debates for offline presentation', () => {
      expect(CACHED_DEBATES.length).toBeGreaterThanOrEqual(4);

      const plaDebate = CACHED_DEBATES.find((d) => d.id === 'pla-water-bottle');
      expect(plaDebate).toBeDefined();
      expect(plaDebate.prosecutorOpening.role).toBe('Prosecutor');
      expect(plaDebate.defenderOpening.role).toBe('Defender');
      expect(plaDebate.judgeVerdict.role).toBe('Judge');
      expect(plaDebate.judgeVerdict.trustScore).toBeGreaterThanOrEqual(0);
      expect(plaDebate.judgeVerdict.trustScore).toBeLessThanOrEqual(100);
      expect(plaDebate.objectionPresets.length).toBeGreaterThan(0);
    });

    it('generates dynamic courtroom debates for custom packaging claims', () => {
      const custom = generateDynamicCourtroomDebate('100% Eco-Friendly Zero Harm Plastic Bottle');
      expect(custom.prosecutorOpening.points.length).toBeGreaterThan(0);
      expect(custom.defenderOpening.points.length).toBeGreaterThan(0);
      expect(custom.judgeVerdict.trustScore).toBeDefined();
      expect(custom.objectionPresets.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('F2: Label Scanner (/scan)', () => {
    it('provides offline sample labels with pure transcription and no fake scores', () => {
      expect(SAMPLE_LABELS.length).toBeGreaterThanOrEqual(3);
      const sample = SAMPLE_LABELS[0];
      expect(sample.labelType).toBe('Sample label (fictional product)');
      expect(sample.transcription.is_product_label).toBe(true);
      expect(sample.transcription.product_name).toBeDefined();
    });

    it('enforces privacy guarantee and file size guard', async () => {
      const result = await scanProductLabel({ sampleId: SAMPLE_LABELS[0].id });
      expect(result.privacy_guarantee.toLowerCase()).toContain('image is not saved');

      // Oversized payload guard (>3MB base64)
      const oversized = 'a'.repeat(4 * 1024 * 1024);
      await expect(scanProductLabel({ imageBase64: oversized })).rejects.toThrow(/3MB/);
    });
  });

  describe('F3: Confidence Brake (Strictness Filter)', () => {
    it('manages strictness threshold between 0 and 100', () => {
      setStrictnessThreshold(85);
      expect(getStrictnessThreshold()).toBe(85);

      setStrictnessThreshold(150);
      expect(getStrictnessThreshold()).toBe(100);

      setStrictnessThreshold(-20);
      expect(getStrictnessThreshold()).toBe(0);

      // Restore standard default
      setStrictnessThreshold(70);
      expect(getStrictnessThreshold()).toBe(70);
    });

    it('declines low-confidence queries when strictness threshold is exceeded', () => {
      const evaluation = evaluateConfidenceBrake({
        query: 'Is this plastic bottle certified 100% cure for climate change?',
        rawConfidence: 'low',
        answerText: 'Probably eco friendly',
        strictness: 75
      });

      expect(evaluation.brakeTriggered).toBe(true);
      expect(evaluation.confidenceScore).toBeLessThan(75);
      expect(evaluation.neededInfo.length).toBeGreaterThanOrEqual(3);
      expect(evaluation.refusalMessage).toContain('Confidence Brake Engaged');
    });

    it('permits answers when confidence exceeds strictness threshold', () => {
      const evaluation = evaluateConfidenceBrake({
        query: 'GOTS certified organic cotton tote with verified FSC packaging',
        rawConfidence: 'high',
        answerText: 'Third party verified lifecycle standard',
        strictness: 60
      });

      expect(evaluation.brakeTriggered).toBe(false);
      expect(evaluation.confidenceScore).toBeGreaterThanOrEqual(60);
    });
  });

  describe('F4: Ethics Dilemma Cards (/dilemmas)', () => {
    it('contains curated scenarios where AI explicitly refuses to pick for the user', () => {
      expect(ETHICS_DILEMMAS.length).toBeGreaterThanOrEqual(4);

      ETHICS_DILEMMAS.forEach((dilemma) => {
        expect(dilemma.optionA).toBeDefined();
        expect(dilemma.optionB).toBeDefined();
        expect(dilemma.aiRefusalStatement.toLowerCase()).toMatch(/cannot|refuse|decline/);
        expect(dilemma.reflectionA).toBeDefined();
        expect(dilemma.reflectionB).toBeDefined();
      });
    });
  });

  describe('F7: AI Self-Audit Report Generator', () => {
    it('generates a comprehensive session report with uncertainties, bias risks, and model improvements', () => {
      const report = generateAISelfAuditReport();

      expect(report.reportId).toMatch(/^AUDIT-/);
      expect(report.sessionSummary).toBeDefined();
      expect(report.uncertaintyAdmissions.length).toBeGreaterThan(0);
      expect(report.biasRisks.length).toBeGreaterThanOrEqual(3);
      expect(report.guardrailsTriggered.length).toBeGreaterThanOrEqual(4);
      expect(report.modelImprovements.length).toBeGreaterThanOrEqual(3);
    });
  });
});
