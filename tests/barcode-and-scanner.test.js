import { describe, it, expect } from 'vitest';
import {
  calculateEan13CheckDigit,
  calculateUpcACheckDigit,
  validateBarcode,
  estimateEcoScoreFromExternal,
  findGreenerCatalogSwaps
} from '../src/lib/barcodeUtils.js';
import { auditSingleClaim, auditLabelClaims } from '../src/lib/claimChecker.js';
import { sanitizeScanLabelOutput } from '../server/proxyServer.js';

describe('Part 1 & 2: Barcode and Scanner Test Suite', () => {
  describe('Barcode Checksum & Validation Engine', () => {
    it('accurately calculates EAN-13 check digits using modulo-10 algorithm', () => {
      // 301762042200 -> check digit 3 (Nutella)
      expect(calculateEan13CheckDigit('301762042200')).toBe(3);
      // 544900000099 -> check digit 6 (Coca-Cola)
      expect(calculateEan13CheckDigit('544900000099')).toBe(6);
      // 807680951375 -> check digit 3 (Barilla Pesto)
      expect(calculateEan13CheckDigit('807680951375')).toBe(3);
      // 541012600695 -> check digit 7 (Lotus Biscoff)
      expect(calculateEan13CheckDigit('541012600695')).toBe(7);
      // 871570042137 -> check digit 7 (Heinz Ketchup)
      expect(calculateEan13CheckDigit('871570042137')).toBe(7);
    });

    it('accurately calculates UPC-A check digits', () => {
      // 01234567890 -> check digit 5
      expect(calculateUpcACheckDigit('01234567890')).toBe(5);
      // 04900000044 -> check digit 3
      expect(calculateUpcACheckDigit('04900000044')).toBe(3);
    });

    it('validates 5 real Open Food Facts EAN-13 barcodes as valid', () => {
      const realBarcodes = [
        '3017620422003', // Nutella
        '5449000000996', // Coca-Cola
        '8076809513753', // Barilla Pesto
        '5410126006957', // Lotus Biscoff
        '8715700421377'  // Heinz Ketchup
      ];

      for (const code of realBarcodes) {
        const result = validateBarcode(code);
        expect(result.valid).toBe(true);
        expect(result.format).toBe('EAN-13');
      }
    });

    it('rejects invalid EAN-13 checksums', () => {
      const invalidResult = validateBarcode('3017620422009'); // Correct is 3, not 9
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.error).toContain('Invalid EAN-13 checksum');
    });

    it('validates EAN-8 format and checksum', () => {
      const validEan8 = validateBarcode('96385074');
      expect(validEan8.valid).toBe(true);
      expect(validEan8.format).toBe('EAN-8');

      const invalidEan8 = validateBarcode('96385071');
      expect(invalidEan8.valid).toBe(false);
      expect(invalidEan8.error).toContain('Invalid EAN-8 checksum');
    });

    it('validates UPC-A format and checksum', () => {
      const validUpc = validateBarcode('012345678905');
      expect(validUpc.valid).toBe(true);
      expect(validUpc.format).toBe('UPC-A');

      const invalidUpc = validateBarcode('012345678908');
      expect(invalidUpc.valid).toBe(false);
      expect(invalidUpc.error).toContain('Invalid UPC-A checksum');
    });

    it('validates Code 128 and QR codes correctly', () => {
      const code128 = validateBarcode('ECO-SENSE-2026-X');
      expect(code128.valid).toBe(true);
      expect(code128.format).toBe('Code 128');

      const qr = validateBarcode('https://ecosense.org/product/eco-bamboo-brush');
      expect(qr.valid).toBe(true);
      expect(qr.format).toBe('QR / URL');
    });
  });

  describe('Eco-Score Estimate from External Registry', () => {
    it('labels external scores explicitly as estimates with data source', () => {
      const offProduct = {
        product_name: 'Nutella',
        ecoscore_grade: 'e',
        ecoscore_score: 22,
        packaging: 'Plastic jar, plastic lid',
        ingredients_text: 'Sugar, palm oil, hazelnuts 13%, skimmed milk powder 8.7%'
      };

      const estimate = estimateEcoScoreFromExternal(offProduct, 'Open Food Facts');
      expect(estimate.isEstimate).toBe(true);
      expect(estimate.dataSource).toBe('Open Food Facts');
      expect(estimate.grade).toBe('E');
      expect(estimate.score).toBeLessThanOrEqual(40);
      expect(estimate.breakdown).toBeDefined();
      expect(estimate.breakdown.materials).toBeDefined();
      expect(estimate.breakdown.packaging).toBeDefined();
    });

    it('recommends greener catalogue alternatives with higher eco score', () => {
      const swaps = findGreenerCatalogSwaps('Food & Pantry', 30);
      expect(Array.isArray(swaps)).toBe(true);
      for (const swap of swaps) {
        expect(swap.score).toBeGreaterThan(30);
      }
    });
  });

  describe('Claim Checker Engine', () => {
    it('marks claims supported when backed by visible certification', () => {
      const result = auditSingleClaim('100% Organic Cotton', [
        { name: 'GOTS Certified Organic', has_license_number: true }
      ]);
      expect(result.verdict).toBe('supported by a visible certification');
      expect(result.category).toBe('supported');
      expect(result.gradeScore).toBeGreaterThanOrEqual(85);
    });

    it('flags vague buzzwords as prohibited without lifecycle proof', () => {
      const result = auditSingleClaim('100% Natural and Earth-Friendly Formula', []);
      expect(result.verdict).toBe('vague term');
      expect(result.category).toBe('vague');
      expect(result.gradeScore).toBeLessThanOrEqual(40);
      expect(result.reasoning).toContain('prohibited by green advertising guidelines');
    });

    it('flags specific claims without printed certs as unverified', () => {
      const result = auditSingleClaim('Compostable within 90 days', []);
      expect(result.verdict).toBe('unverified');
      expect(result.category).toBe('unverified');
    });

    it('calculates overall label integrity grade and summary', () => {
      const claims = [
        'Pure green botanical ingredients',
        'Save our planet initiative'
      ];
      const audit = auditLabelClaims(claims, []);
      expect(['D', 'E']).toContain(audit.finalGrade);
      expect(audit.vagueCount).toBeGreaterThanOrEqual(1);
      expect(audit.hasClaims).toBe(true);
    });

    it('awards Grade A to clean labels backed entirely by visible certs', () => {
      const claims = ['GOTS organic certified cotton', 'Fair trade artisan woven'];
      const certs = [
        { name: 'GOTS Certified Organic', has_license_number: true },
        { name: 'Fair Trade Certified', has_license_number: true }
      ];
      const audit = auditLabelClaims(claims, certs);
      expect(audit.finalGrade).toBe('A');
      expect(audit.vagueCount).toBe(0);
      expect(audit.supportedCount).toBe(2);
    });
  });

  describe('Vision Label Sanitization and Legibility Guard', () => {
    it('sets is_readable: false and reports unreadable_reason honestly when text is blurry', () => {
      const raw = {
        is_product_label: true,
        is_readable: false,
        unreadable_reason: 'Photo is out of focus and text cannot be read.',
        legibility: 'poor'
      };

      const sanitized = sanitizeScanLabelOutput(raw, 'gemini-3-flash-preview');
      expect(sanitized.is_readable).toBe(false);
      expect(sanitized.unreadable_reason).toContain('out of focus');
      expect(sanitized.product_name).toBeNull();
    });

    it('sanitizes materials, packaging_type, claims, and recycling_symbols', () => {
      const raw = {
        is_product_label: true,
        product_name: 'Eco Dish Soap',
        brand: 'BioClean',
        materials: ['Coconut Surfactants', 'Aloe Vera'],
        packaging_type: '100% PCR Bottle',
        claims: ['Zero Plastic', 'Vegan Formula'],
        certifications_visible: [{ name: 'Leaping Bunny', has_license_number: true }],
        recycling_symbols: ['HDPE 2'],
        country_of_origin: 'India'
      };

      const sanitized = sanitizeScanLabelOutput(raw, 'gemini-3-flash-preview');
      expect(sanitized.product_name).toBe('Eco Dish Soap');
      expect(sanitized.brand).toBe('BioClean');
      expect(sanitized.materials).toEqual(['Coconut Surfactants', 'Aloe Vera']);
      expect(sanitized.packaging_type).toBe('100% PCR Bottle');
      expect(sanitized.claims).toEqual(['Zero Plastic', 'Vegan Formula']);
      expect(sanitized.certifications_visible).toHaveLength(1);
      expect(sanitized.recycling_symbols).toEqual(['HDPE 2']);
      expect(sanitized.country_of_origin).toBe('India');
    });
  });

  describe('5 Verified Open Food Facts Barcodes End-to-End Cascade', () => {
    const verifiedSamples = [
      {
        barcode: '3017620422003',
        expectedName: 'Nutella',
        brand: 'Ferrero',
        expectedGrade: 'e'
      },
      {
        barcode: '5449000000996',
        expectedName: 'Coca-Cola',
        brand: 'The Coca-Cola Company',
        expectedGrade: 'e'
      },
      {
        barcode: '8076809513753',
        expectedName: 'Barilla Pesto Genovese',
        brand: 'Barilla',
        expectedGrade: 'd'
      },
      {
        barcode: '5410126006957',
        expectedName: 'Lotus Biscoff',
        brand: 'Lotus',
        expectedGrade: 'e'
      },
      {
        barcode: '8715700421377',
        expectedName: 'Heinz Tomato Ketchup',
        brand: 'Heinz',
        expectedGrade: 'd'
      }
    ];

    for (const sample of verifiedSamples) {
      it(`successfully processes barcode ${sample.barcode} (${sample.expectedName})`, () => {
        const validation = validateBarcode(sample.barcode);
        expect(validation.valid).toBe(true);
        expect(validation.format).toBe('EAN-13');

        // Simulate Open Food Facts payload received from /api/barcode
        const mockOffProduct = {
          code: sample.barcode,
          product_name: sample.expectedName,
          brands: sample.brand,
          ecoscore_grade: sample.expectedGrade,
          ecoscore_score: sample.expectedGrade === 'e' ? 25 : 45,
          packaging: 'Standard commercial packaging',
          ingredients_text: 'Sample ingredient listing'
        };

        const estimate = estimateEcoScoreFromExternal(mockOffProduct, 'Open Food Facts');
        expect(estimate.isEstimate).toBe(true);
        expect(estimate.dataSource).toBe('Open Food Facts');
        expect(estimate.grade.toLowerCase()).toBe(sample.expectedGrade);

        // Find greener swaps
        const greenerSwaps = findGreenerCatalogSwaps('Food & Pantry', estimate.score);
        expect(Array.isArray(greenerSwaps)).toBe(true);
      });
    }
  });
});
