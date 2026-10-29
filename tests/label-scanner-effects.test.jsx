import { describe, it, expect } from 'vitest';
import {
  evaluateNutritionTable,
  evaluateIngredients,
  buildOverviewSummary
} from '../src/lib/labelHealthRules.js';
import { scanProductLabel, SAMPLE_LABELS } from '../src/lib/ai/labelScanner.js';
import { sanitizeScanLabelOutput } from '../server/proxyServer.js';
import { auditLabelClaims } from '../src/lib/claimChecker.js';

describe('Label Scanner Health and Environmental Effects Evaluation Suite', () => {
  // Test 1: Uploaded Nutrition Facts panel
  describe('Test Case 1: Uploaded Nutrition Facts Panel', () => {
    const nutritionInput = [
      { nutrient: 'Calories', amount: '90', dv_percent: null },
      { nutrient: 'Total Fat', amount: '3g', dv_percent: 5 },
      { nutrient: 'Sodium', amount: '300mg', dv_percent: 13 },
      { nutrient: 'Total Carbohydrate', amount: '13g', dv_percent: 5 },
      { nutrient: 'Dietary Fibre', amount: '3g', dv_percent: 12 },
      { nutrient: 'Sugars', amount: '3g', dv_percent: null },
      { nutrient: 'Protein', amount: '3g', dv_percent: null },
      { nutrient: 'Vitamin A', amount: null, dv_percent: 80 },
      { nutrient: 'Vitamin C', amount: null, dv_percent: 60 },
      { nutrient: 'Calcium', amount: null, dv_percent: 4 },
      { nutrient: 'Iron', amount: null, dv_percent: 4 }
    ];

    it('evaluates sodium as moderate (13% DV)', () => {
      const evalResult = evaluateNutritionTable(nutritionInput);
      expect(evalResult.hasNutrition).toBe(true);
      const sodium = evalResult.evaluatedNutrients.find((n) => n.nutrient.toLowerCase().includes('sodium'));
      expect(sodium).toBeDefined();
      expect(sodium.status).toBe('moderate');
      expect(sodium.ruleUsed).toContain('10–19% (Moderate)');
    });

    it('evaluates fibre as good source (12% DV)', () => {
      const evalResult = evaluateNutritionTable(nutritionInput);
      const fibre = evalResult.evaluatedNutrients.find((n) => n.nutrient.toLowerCase().includes('fibre'));
      expect(fibre).toBeDefined();
      expect(fibre.status).toBe('good');
      expect(fibre.ruleUsed).toContain('Good Source of Fibre');
    });

    it('evaluates Vitamin A (80% DV) and Vitamin C (60% DV) as high / excellent source', () => {
      const evalResult = evaluateNutritionTable(nutritionInput);
      const vitA = evalResult.evaluatedNutrients.find((n) => n.nutrient.toLowerCase().includes('vitamin a'));
      const vitC = evalResult.evaluatedNutrients.find((n) => n.nutrient.toLowerCase().includes('vitamin c'));

      expect(vitA).toBeDefined();
      expect(vitA.status).toBe('excellent');
      expect(vitA.dv_percent).toBe(80);

      expect(vitC).toBeDefined();
      expect(vitC.status).toBe('excellent');
      expect(vitC.dv_percent).toBe(60);
    });

    it('returns honest message when ingredients are null (no ingredient assessment)', () => {
      const ingredientEval = evaluateIngredients(null, 'food');
      expect(ingredientEval.hasIngredients).toBe(false);
      expect(ingredientEval.message).toBe(
        'Ingredient effects cannot be assessed from this photo because no ingredient list was detected on the label.'
      );
      expect(ingredientEval.notableIngredients).toHaveLength(0);
    });

    it('correctly loads sample-nutrition-facts and produces valid Overview summary', async () => {
      const sample = await scanProductLabel({ sampleId: 'sample-nutrition-facts' });
      expect(sample.readable).toBe(true);
      expect(sample.serving_size).toBe('1/2 cup (114g)');
      expect(sample.ingredients).toBeNull();

      const nutEval = evaluateNutritionTable(sample.nutrition_table);
      const ingEval = evaluateIngredients(sample.ingredients, sample.product_type);
      const overview = buildOverviewSummary({
        productType: sample.product_type,
        productName: sample.name,
        nutritionEval: nutEval,
        ingredientEval: ingEval
      });

      expect(overview.goodList.length).toBeGreaterThan(0);
      expect(overview.shortSummary).toBeDefined();
    });
  });

  // Test 2: Packaged food with ingredients and recycling symbol
  describe('Test Case 2: Packaged Food with Ingredients and Recycling Symbol', () => {
    it('detects palm oil concern, allergens, and recycling symbol', async () => {
      const sample = await scanProductLabel({ sampleId: 'sample-packaged-food' });
      expect(sample.product_type).toBe('food');
      expect(sample.ingredients).toContain('Palm Oil');
      expect(sample.recycling_symbols).toContain('PP 5');

      const ingEval = evaluateIngredients(sample.ingredients, 'food');
      expect(ingEval.hasIngredients).toBe(true);

      const palmOil = ingEval.notableIngredients.find((i) => i.name === 'Palm Oil');
      expect(palmOil).toBeDefined();
      expect(palmOil.evidenceLevel).toBe('well established');
      expect(palmOil.whatItIs).toBeDefined();
      expect(palmOil.possibleConcern).toBeDefined();
      expect(palmOil.whoShouldBeCareful).toBeDefined();

      // Check allergens
      expect(ingEval.allergens.some((a) => a.includes('peanut'))).toBe(true);

      // Check claims audit
      const claimAudit = auditLabelClaims(sample.claims, sample.certifications_visible);
      expect(claimAudit.claimAudits.length).toBeGreaterThan(0);
    });
  });

  // Test 3: Shampoo or soap label (Personal Care)
  describe('Test Case 3: Personal Care Label (Shampoo)', () => {
    it('detects SLS and Methylparaben in personal care ingredients', async () => {
      const sample = await scanProductLabel({ sampleId: 'sample-shampoo' });
      expect(sample.product_type).toBe('personal_care');
      expect(sample.nutrition_table).toBeNull();

      const ingEval = evaluateIngredients(sample.ingredients, 'personal_care');
      expect(ingEval.hasIngredients).toBe(true);

      const sls = ingEval.notableIngredients.find((i) => i.name.includes('SLS'));
      expect(sls).toBeDefined();
      expect(sls.possibleGoodEffect).toMatch(/foam|clean/);

      const paraben = ingEval.notableIngredients.find((i) => i.name.includes('Paraben'));
      expect(paraben).toBeDefined();
      expect(paraben.evidenceLevel).toBe('debated');

      const fragrance = ingEval.notableIngredients.find((i) => i.name.includes('Fragrance'));
      expect(fragrance).toBeDefined();
    });
  });

  // Test 4: Cleaning product label
  describe('Test Case 4: Cleaning Product Label', () => {
    it('detects phosphates and assesses packaging sustainability', async () => {
      const sample = await scanProductLabel({ sampleId: 'sample-cleaning' });
      expect(sample.product_type).toBe('cleaning');

      const ingEval = evaluateIngredients(sample.ingredients, 'cleaning');
      const phosphate = ingEval.notableIngredients.find((i) => i.name.includes('Phosphate'));
      expect(phosphate).toBeDefined();
      expect(phosphate.possibleConcern).toContain('algal blooms');
      expect(phosphate.whoShouldBeCareful).toContain('septic');

      expect(sample.packaging_material).toContain('FSC-certified');
      expect(sample.recycling_symbols).toContain('PAP 20 (Cardboard)');
    });
  });

  // Test 5: Blurry photo & non-label photo
  describe('Test Case 5: Blurry Photo & Non-Label Photo Handling', () => {
    it('sanitizes unreadable blurry photo without inventing text', () => {
      const unreadableRaw = {
        readable: false,
        is_readable: false,
        unreadable_reason: 'Photo is blurry, camera was moving. Text could not be resolved.',
        legibility: 'poor'
      };

      const result = sanitizeScanLabelOutput(unreadableRaw);
      expect(result.readable).toBe(false);
      expect(result.is_readable).toBe(false);
      expect(result.unreadable_reason).toContain('blurry');
      expect(result.ingredients).toBeNull();
      expect(result.nutrition_table).toBeNull();
      expect(result.name).toBeNull();
    });

    it('sanitizes non-label photo honestly', () => {
      const nonLabelRaw = {
        is_product_label: false,
        readable: false,
        reason_if_not: 'Image depicts a mountain landscape with no consumer product packaging.'
      };

      const result = sanitizeScanLabelOutput(nonLabelRaw);
      expect(result.is_product_label).toBe(false);
      expect(result.reason_if_not).toContain('mountain landscape');
      expect(result.name).toBeNull();
    });
  });
});
