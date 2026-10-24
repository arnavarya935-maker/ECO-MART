import { describe, it, expect, vi } from 'vitest';
import { SAMPLE_LABELS, scanProductLabel } from '../src/lib/ai/labelScanner.js';
import { calculateDownscaledDimensions } from '../src/lib/imageDownscale.js';

describe('Phase 2: Label Scanner Rebuild Test Suite', () => {
  describe('Sample Labels Integrity', () => {
    it('provides exactly 3 samples clearly labeled as fictional products', () => {
      expect(SAMPLE_LABELS).toHaveLength(3);
      for (const sample of SAMPLE_LABELS) {
        expect(sample.labelType).toBe('Sample label (fictional product)');
        expect(sample.transcription).toBeDefined();
        expect(sample.transcription.is_product_label).toBe(true);
      }
    });

    it('contains pure transcription without scores, verdicts, or fake certificates', () => {
      for (const sample of SAMPLE_LABELS) {
        const t = sample.transcription;
        // Strict prohibition: No trust score, verdict, or fake radar
        expect(t.trust_score).toBeUndefined();
        expect(t.verdict).toBeUndefined();
        expect(t.radar_axes).toBeUndefined();
        expect(t.flagged_phrases).toBeUndefined();

        // Check certifications printed
        if (t.certifications_printed?.length > 0) {
          for (const cert of t.certifications_printed) {
            expect(typeof cert.name).toBe('string');
            expect(typeof cert.has_license_number).toBe('boolean');
            // Must NOT have fabricated certificate registration number
            expect(cert.number).toBeUndefined();
            expect(cert.license_code).toBeUndefined();
          }
        }
      }
    });
  });

  describe('Non-Label Rejection', () => {
    it('returns is_product_label: false without analyzing when server reports non-label photo', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          source: 'gemini_vision',
          is_product_label: false,
          reason_if_not: 'Photo appears to be an outdoor landscape without product packaging.'
        })
      });
      global.fetch = mockFetch;

      const result = await scanProductLabel({
        imageBase64: 'data:image/jpeg;base64,12345'
      });

      expect(result.is_product_label).toBe(false);
      expect(result.reason_if_not).toContain('outdoor landscape');
      expect(result.product_name).toBeUndefined();
      expect(result.ingredients).toBeUndefined();
    });
  });

  describe('Failure Never Invents Text Rule', () => {
    it('throws an honest error and NEVER returns hardcoded/invented text when API and OCR fail', async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network offline'));
      global.fetch = mockFetch;

      // Scanning an unreadable or offline image must reject honestly
      await expect(
        scanProductLabel({
          imageBase64: 'data:image/jpeg;base64,invalid_data'
        })
      ).rejects.toThrow(/Could not read product label|On-device OCR/);
    });
  });

  describe('Image Downscale Dimension Calculation Utility', () => {
    it('scales down landscape images where width exceeds 1600px', () => {
      const dims = calculateDownscaledDimensions(3200, 1800, 1600);
      expect(dims.scaled).toBe(true);
      expect(dims.width).toBe(1600);
      expect(dims.height).toBe(900);
    });

    it('scales down portrait images where height exceeds 1600px', () => {
      const dims = calculateDownscaledDimensions(1200, 2400, 1600);
      expect(dims.scaled).toBe(true);
      expect(dims.height).toBe(1600);
      expect(dims.width).toBe(800);
    });

    it('does not scale images that are already smaller than 1600px', () => {
      const dims = calculateDownscaledDimensions(800, 600, 1600);
      expect(dims.scaled).toBe(false);
      expect(dims.width).toBe(800);
      expect(dims.height).toBe(600);
    });
  });

  describe('Certification Never Marked Verified Rule', () => {
    it('ensures sample and scanned results strictly label certifications without verified status', async () => {
      const sample = await scanProductLabel({ sampleId: 'sample-khadi-tote' });
      expect(sample.certifications_printed).toHaveLength(1);
      expect(sample.certifications_printed[0].name).toBe('GOTS Certified Organic');
      // Must NOT contain verified flags
      expect(sample.verified).toBeUndefined();
      expect(sample.certifications_printed[0].verified).toBeUndefined();
    });
  });
});
