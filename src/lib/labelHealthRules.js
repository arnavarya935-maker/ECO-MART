/**
 * Health & Nutrition Rule-Based Evaluation Engine for Label Scanner
 * Evaluates %DV conventions and notable ingredient impacts completely in code.
 * 
 * Rules:
 * - %DV convention: <= 5% is Low, 10-19% is Good, >= 20% is High / Excellent.
 * - Nutrients to limit (Sodium, Saturated Fat, Added Sugar, Trans Fat): Flag if High (>=20%).
 * - Beneficial nutrients (Fibre, Protein, Vitamins, Minerals): Credit if Good (10-19%) or High (>=20%).
 * - Careful language: "may", "linked to", "limit if", no diagnosis, no alarmist wording.
 */

// Common notable ingredients database across food, personal care, and household cleaning
const NOTABLE_INGREDIENTS = [
  {
    pattern: /\b(palm\s*oil|palmitate|palm\s*kernel|elaeis\s*guineensis)\b/i,
    name: 'Palm Oil',
    whatItIs: 'A tropical vegetable oil extracted from the pulp and kernel of oil palm fruit.',
    possibleGoodEffect: 'Provides smooth texture and shelf-stability without industrial hydrogenation.',
    possibleConcern: 'High in palmitic saturated fatty acids; associated with tropical habitat conversion when unsustainably sourced.',
    whoShouldBeCareful: 'People monitoring daily saturated fat intake; look for RSPO certified sustainable sourcing.',
    evidenceLevel: 'well established'
  },
  {
    pattern: /\b(partially\s*hydrogenated|hydrogenated\s*vegetable\s*oil|shortening)\b/i,
    name: 'Partially Hydrogenated Oil (Trans Fat)',
    whatItIs: 'Liquid vegetable oil converted into solid fat via industrial hydrogenation.',
    possibleGoodEffect: 'Extends commercial baked-good shelf life at lower production cost.',
    possibleConcern: 'Raises LDL (bad) cholesterol while reducing protective HDL cholesterol.',
    whoShouldBeCareful: 'Individuals watching arterial and cardiovascular wellness; global health guidelines recommend minimizing intake.',
    evidenceLevel: 'well established'
  },
  {
    pattern: /\b(high\s*fructose\s*corn\s*syrup|corn\s*syrup|invert\s*sugar|dextrose|sucrose|glucose\s*syrup|cane\s*sugar|maltose)\b/i,
    name: 'Added Sugars / Corn Syrup',
    whatItIs: 'Refined simple carbohydrates added to sweeten and thicken processed foods.',
    possibleGoodEffect: 'Delivers rapid cellular energy and enhances palatable taste.',
    possibleConcern: 'Rapidly elevates blood glucose levels; excess consumption linked to dental cavities and metabolic fatigue.',
    whoShouldBeCareful: 'Individuals managing blood sugar, pre-diabetes, diabetes, or tooth sensitivity.',
    evidenceLevel: 'well established'
  },
  {
    pattern: /\b(aspartame|sucralose|acesulfame[\s-]*k|acesulfame\s*potassium|saccharin|neotame)\b/i,
    name: 'Artificial Sweetener',
    whatItIs: 'High-intensity synthetic non-caloric sugar substitute.',
    possibleGoodEffect: 'Imparts intense sweetness without contributing calories or causing dental caries.',
    possibleConcern: 'May affect sweet-taste perception over time; ongoing scientific evaluation on gut microbiome composition.',
    whoShouldBeCareful: 'People with phenylketonuria (PKU must avoid aspartame); individuals sensitive to intense sweeteners.',
    evidenceLevel: 'limited'
  },
  {
    pattern: /\b(monosodium\s*glutamate|msg|e621|glutamate)\b/i,
    name: 'Monosodium Glutamate (MSG)',
    whatItIs: 'The sodium salt of glutamic acid, an amino acid responsible for savory umami flavor.',
    possibleGoodEffect: 'Enhances savory flavor depth while allowing a 30% reduction in added dietary sodium.',
    possibleConcern: 'A small subset of consumers report mild transient flushing or headaches (scientifically debated).',
    whoShouldBeCareful: 'Individuals with self-reported MSG sensitivity; factor into overall sodium tallies.',
    evidenceLevel: 'debated'
  },
  {
    pattern: /\b(sodium\s*benzoate|potassium\s*sorbate|bha|bht|butylated\s*hydroxyanisole|sodium\s*nitrite|sodium\s*nitrate|e211|e202)\b/i,
    name: 'Synthetic Preservatives',
    whatItIs: 'Antimicrobial additives that prevent bacterial, mold, and yeast degradation.',
    possibleGoodEffect: 'Prevents food spoilage and dangerous foodborne illnesses (e.g. botulism).',
    possibleConcern: 'Benzoates may trigger mild allergic-type reactions or skin flares in a minority of sensitive individuals.',
    whoShouldBeCareful: 'People with asthma, aspirin sensitivity, or history of chronic urticaria.',
    evidenceLevel: 'limited'
  },
  {
    pattern: /\b(tartrazine|yellow\s*5|allura\s*red|red\s*40|sunset\s*yellow|yellow\s*6|brilliant\s*blue|blue\s*1|e102|e110|e129)\b/i,
    name: 'Artificial Food Colouring',
    whatItIs: 'Synthetic petroleum-derived dyes formulated for bright, uniform product color.',
    possibleGoodEffect: 'Restores visual color lost during industrial heat processing.',
    possibleConcern: 'Some pediatric studies suggest mild behavioral hyperactivity in sensitive children.',
    whoShouldBeCareful: 'Children and individuals with known sensitivity to azo dyes.',
    evidenceLevel: 'limited'
  },
  {
    pattern: /\b(sodium\s*lauryl\s*sulfate|sodium\s*laureth\s*sulfate|sls|sles)\b/i,
    name: 'Sodium Lauryl / Laureth Sulfate (SLS / SLES)',
    whatItIs: 'A synthetic anionic surfactant widely formulated into shampoos, washes, and soaps for lathering.',
    possibleGoodEffect: 'Generates rich foam and strips heavy grease and oils cleanly from hair and skin.',
    possibleConcern: 'May disrupt skin barrier lipids with frequent use, leading to dryness or contact irritation.',
    whoShouldBeCareful: 'People with eczema, sensitive skin, or dry scalp conditions.',
    evidenceLevel: 'well established'
  },
  {
    pattern: /\b(methylparaben|propylparaben|butylparaben|ethylparaben|paraben)\b/i,
    name: 'Parabens',
    whatItIs: 'Esters of p-hydroxybenzoic acid used as broad-spectrum antimicrobial preservatives in cosmetics.',
    possibleGoodEffect: 'Highly effective at preventing microbial and fungal contamination in water-based formulas.',
    possibleConcern: 'Weakly mimics estrogen in lab assays; subject to precautionary restrictions in leave-on infant products.',
    whoShouldBeCareful: 'Expectant mothers and infants; people looking for paraben-free personal care.',
    evidenceLevel: 'debated'
  },
  {
    pattern: /\b(phthalate|diethyl\s*phthalate|dep|synthetic\s*fragrance|parfum)\b/i,
    name: 'Phthalates / Synthetic Fragrance',
    whatItIs: 'Chemical solvents and fixatives used to anchor scents in perfumes, cleansers, and lotions.',
    possibleGoodEffect: 'Enables long-lasting pleasant scent dispersion.',
    possibleConcern: 'One of the leading triggers for contact allergies, headaches, and respiratory flares in sensitive people.',
    whoShouldBeCareful: 'Individuals with asthma, fragrance allergies, or reactive skin.',
    evidenceLevel: 'well established for allergy'
  },
  {
    pattern: /\b(triclosan|triclocarban)\b/i,
    name: 'Triclosan',
    whatItIs: 'A broad-spectrum synthetic antibacterial and antifungal agent.',
    possibleGoodEffect: 'Provides immediate antimicrobial reduction on surface contact.',
    possibleConcern: 'Concerns regarding environmental persistence in aquatic ecosystems and potential antimicrobial resistance.',
    whoShouldBeCareful: 'Frequent hand-washers; check municipal aquatic protection guidelines.',
    evidenceLevel: 'well established'
  },
  {
    pattern: /\b(phosphate|tripolyphosphate|phosphates)\b/i,
    name: 'Phosphates',
    whatItIs: 'Inorganic mineral salts added to laundry detergents and dish cleaners as water softeners.',
    possibleGoodEffect: 'Chelates hard-water minerals to boost detergent cleaning power.',
    possibleConcern: 'When discharged into waterways, excess phosphates feed algal blooms, depleting aquatic oxygen.',
    whoShouldBeCareful: 'Households connected to septic tanks or local freshwater ecosystems.',
    evidenceLevel: 'well established'
  },
  {
    pattern: /\b(polyethylene\s*beads|microbeads|polyethylene\s*microparticles)\b/i,
    name: 'Synthetic Microplastics',
    whatItIs: 'Tiny manufactured plastic particles added to scrubs and exfoliating cleansers.',
    possibleGoodEffect: 'Provides gentle mechanical exfoliation of dead skin cells.',
    possibleConcern: 'Passes through municipal wastewater filters into marine food chains; non-biodegradable.',
    whoShouldBeCareful: 'Environmentally-conscious consumers; many jurisdictions have banned microbeads in rinse-off cosmetics.',
    evidenceLevel: 'well established'
  }
];

const COMMON_ALLERGENS_REGEX = /\b(milk|dairy|egg|eggs|peanuts?|tree\s*nuts?|walnuts?|almonds?|cashews?|pistachios?|wheat|gluten|soy|soybeans?|sesame|fish|crustaceans?|shellfish|mustard|celery|sulphites?|sulfites?)\b/i;

/**
 * Evaluates nutrition table values in code using standard %DV rules
 */
export function evaluateNutritionTable(nutritionData) {
  if (!nutritionData) {
    return {
      hasNutrition: false,
      evaluatedNutrients: [],
      goodNutrients: [],
      watchOutNutrients: [],
      summaryMessage: 'No nutrition facts table detected on this label.'
    };
  }

  // Normalize nutrition data to array of items: { nutrient, amount, dv_percent }
  let items = [];
  if (Array.isArray(nutritionData)) {
    items = nutritionData;
  } else if (typeof nutritionData === 'object') {
    for (const [key, val] of Object.entries(nutritionData)) {
      if (typeof val === 'object' && val !== null) {
        items.push({
          nutrient: val.nutrient || key,
          amount: val.amount || (typeof val === 'string' ? val : null),
          dv_percent: val.dv_percent !== undefined ? Number(val.dv_percent) : null
        });
      } else {
        items.push({
          nutrient: key,
          amount: String(val),
          dv_percent: null
        });
      }
    }
  }

  if (items.length === 0) {
    return {
      hasNutrition: false,
      evaluatedNutrients: [],
      goodNutrients: [],
      watchOutNutrients: [],
      summaryMessage: 'No nutrition entries parsed.'
    };
  }

  const evaluated = [];
  const good = [];
  const watchOut = [];

  for (const item of items) {
    const rawName = String(item.nutrient || '').trim();
    const nameLower = rawName.toLowerCase();
    const dv = item.dv_percent !== null && !isNaN(item.dv_percent) ? Number(item.dv_percent) : null;
    const amountStr = String(item.amount || '').trim();

    let status = 'neutral';
    let badgeColor = 'bg-surface-sunken text-heading';
    let ruleUsed = 'Standard baseline';
    let explanation = '';

    // 1. Sodium (limit nutrient)
    if (nameLower.includes('sodium') || nameLower.includes('salt')) {
      if (dv !== null) {
        if (dv >= 20) {
          status = 'high';
          badgeColor = 'bg-amber-500/15 text-amber-800 border-amber-500/30';
          ruleUsed = '%DV ≥ 20% (High Sodium)';
          explanation = `High sodium content (${dv}% DV per serving). Health agencies advise limiting high sodium to support healthy blood pressure.`;
          watchOut.push({
            title: `High Sodium (${dv}% DV)`,
            why: `Provides ${dv}% of daily sodium in one serving (≥20% is considered high).`,
            traceableTo: `Printed: ${rawName} ${amountStr || ''} (${dv}% DV)`
          });
        } else if (dv >= 10) {
          status = 'moderate';
          badgeColor = 'bg-surface-sunken text-heading border-line';
          ruleUsed = '%DV 10–19% (Moderate)';
          explanation = `Moderate sodium content (${dv}% DV). Consider your total daily sodium intake.`;
        } else {
          status = 'low';
          badgeColor = 'bg-emerald-500/15 text-emerald-800 border-emerald-500/30';
          ruleUsed = '%DV ≤ 5% (Low Sodium)';
          explanation = `Low sodium (${dv}% DV). Suitable for sodium-conscious eating patterns.`;
          good.push({
            title: `Low Sodium (${dv}% DV)`,
            why: `Contains 5% or less of daily value for sodium.`,
            traceableTo: `Printed: ${rawName} ${amountStr || ''} (${dv}% DV)`
          });
        }
      }
    }

    // 2. Saturated Fat (limit nutrient)
    else if (nameLower.includes('saturated fat') || nameLower.includes('sat fat')) {
      if (dv !== null) {
        if (dv >= 20) {
          status = 'high';
          badgeColor = 'bg-amber-500/15 text-amber-800 border-amber-500/30';
          ruleUsed = '%DV ≥ 20% (High Saturated Fat)';
          explanation = `High saturated fat (${dv}% DV). Dietary guidelines recommend limiting saturated fats to support heart wellness.`;
          watchOut.push({
            title: `High Saturated Fat (${dv}% DV)`,
            why: `Contains ${dv}% DV per serving; frequent high intake may elevate LDL cholesterol.`,
            traceableTo: `Printed: ${rawName} ${amountStr || ''} (${dv}% DV)`
          });
        } else if (dv <= 5) {
          status = 'low';
          badgeColor = 'bg-emerald-500/15 text-emerald-800 border-emerald-500/30';
          ruleUsed = '%DV ≤ 5% (Low Saturated Fat)';
          explanation = `Low saturated fat (${dv}% DV).`;
          good.push({
            title: `Low Saturated Fat (${dv}% DV)`,
            why: `Meets the low saturated fat threshold of 5% DV or less.`,
            traceableTo: `Printed: ${rawName} ${amountStr || ''} (${dv}% DV)`
          });
        }
      }
    }

    // 3. Trans Fat (limit nutrient)
    else if (nameLower.includes('trans fat')) {
      const isZero = amountStr.startsWith('0') || amountStr.includes('0g') || dv === 0;
      if (!isZero && amountStr && !amountStr.startsWith('0')) {
        status = 'high';
        badgeColor = 'bg-amber-500/15 text-amber-800 border-amber-500/30';
        ruleUsed = 'Contains Trans Fat (>0g)';
        explanation = `Contains trans fat (${amountStr}). Global health bodies advise avoiding industrial trans fats.`;
        watchOut.push({
          title: `Contains Trans Fat (${amountStr})`,
          why: `Health authorities recommend minimizing all artificial trans fats.`,
          traceableTo: `Printed: ${rawName} ${amountStr}`
        });
      } else {
        status = 'good';
        badgeColor = 'bg-emerald-500/15 text-emerald-800 border-emerald-500/30';
        ruleUsed = '0g Trans Fat';
        explanation = '0g trans fat per serving.';
      }
    }

    // 4. Dietary Fibre (beneficial nutrient)
    else if (nameLower.includes('fibre') || nameLower.includes('fiber')) {
      if (dv !== null) {
        if (dv >= 20) {
          status = 'excellent';
          badgeColor = 'bg-emerald-500/15 text-emerald-800 border-emerald-500/30';
          ruleUsed = '%DV ≥ 20% (Excellent Source of Fibre)';
          explanation = `Excellent source of dietary fibre (${dv}% DV). Promotes digestive health and satiety.`;
          good.push({
            title: `Excellent Source of Fibre (${dv}% DV)`,
            why: `Provides 20% or more of daily recommended fibre in a single serving.`,
            traceableTo: `Printed: ${rawName} ${amountStr || ''} (${dv}% DV)`
          });
        } else if (dv >= 10) {
          status = 'good';
          badgeColor = 'bg-emerald-500/15 text-emerald-800 border-emerald-500/30';
          ruleUsed = '%DV 10–19% (Good Source of Fibre)';
          explanation = `Good source of dietary fibre (${dv}% DV). Supports digestive wellness.`;
          good.push({
            title: `Good Source of Fibre (${dv}% DV)`,
            why: `Provides between 10% and 19% of your daily fibre needs.`,
            traceableTo: `Printed: ${rawName} ${amountStr || ''} (${dv}% DV)`
          });
        }
      }
    }

    // 5. Sugars / Added Sugars (limit nutrient)
    else if (nameLower.includes('sugar') || nameLower.includes('added sugar')) {
      if (dv !== null && dv >= 20) {
        status = 'high';
        badgeColor = 'bg-amber-500/15 text-amber-800 border-amber-500/30';
        ruleUsed = '%DV ≥ 20% (High Sugar)';
        explanation = `High sugar content (${dv}% DV). Consider moderating frequency if watching blood glucose levels.`;
        watchOut.push({
          title: `High Sugar (${dv}% DV)`,
          why: `Provides 20% or more of the recommended daily limit for added sugars.`,
          traceableTo: `Printed: ${rawName} ${amountStr || ''} (${dv}% DV)`
        });
      } else if (dv !== null && dv <= 5) {
        status = 'low';
        badgeColor = 'bg-emerald-500/15 text-emerald-800 border-emerald-500/30';
        ruleUsed = '%DV ≤ 5% (Low Sugar)';
        explanation = `Low in sugar (${dv}% DV).`;
        good.push({
          title: `Low Sugar (${dv}% DV)`,
          why: `Contains 5% or less daily value for sugars.`,
          traceableTo: `Printed: ${rawName} ${amountStr || ''} (${dv}% DV)`
        });
      }
    }

    // 6. Protein (beneficial nutrient)
    else if (nameLower.includes('protein')) {
      if (dv !== null && dv >= 20) {
        status = 'excellent';
        badgeColor = 'bg-emerald-500/15 text-emerald-800 border-emerald-500/30';
        ruleUsed = '%DV ≥ 20% (High Protein)';
        explanation = `High in protein (${dv}% DV). Supports muscular health and satiety.`;
        good.push({
          title: `High Protein (${dv}% DV)`,
          why: `Provides 20% or more of daily value for protein.`,
          traceableTo: `Printed: ${rawName} ${amountStr || ''} (${dv}% DV)`
        });
      } else if (dv !== null && dv >= 10) {
        status = 'good';
        badgeColor = 'bg-emerald-500/15 text-emerald-800 border-emerald-500/30';
        ruleUsed = '%DV 10–19% (Good Source of Protein)';
        explanation = `Good source of protein (${dv}% DV).`;
      }
    }

    // 7. Vitamins & Essential Minerals (Vitamin A, C, D, Calcium, Iron, Potassium)
    else if (
      nameLower.includes('vitamin') ||
      nameLower.includes('calcium') ||
      nameLower.includes('iron') ||
      nameLower.includes('potassium')
    ) {
      if (dv !== null) {
        if (dv >= 20) {
          status = 'excellent';
          badgeColor = 'bg-emerald-500/15 text-emerald-800 border-emerald-500/30';
          ruleUsed = `%DV ≥ 20% (High in ${rawName})`;
          explanation = `High in ${rawName} (${dv}% DV). Delivers substantial daily micronutrient intake.`;
          good.push({
            title: `High in ${rawName} (${dv}% DV)`,
            why: `Provides 20% or more of daily recommended value for ${rawName}.`,
            traceableTo: `Printed: ${rawName} (${dv}% DV)`
          });
        } else if (dv >= 10) {
          status = 'good';
          badgeColor = 'bg-emerald-500/15 text-emerald-800 border-emerald-500/30';
          ruleUsed = `%DV 10–19% (Good Source of ${rawName})`;
          explanation = `Good source of ${rawName} (${dv}% DV).`;
          good.push({
            title: `Good Source of ${rawName} (${dv}% DV)`,
            why: `Provides between 10% and 19% of daily recommended value for ${rawName}.`,
            traceableTo: `Printed: ${rawName} (${dv}% DV)`
          });
        } else {
          status = 'low';
          badgeColor = 'bg-surface-sunken text-heading border-line';
          ruleUsed = `%DV < 10% (Low Contribution)`;
          explanation = `Low contribution of ${rawName} (${dv}% DV).`;
        }
      }
    }

    // 8. General Fat or Carbohydrate baseline
    else if (nameLower.includes('total fat')) {
      if (dv !== null && dv <= 5) {
        status = 'low';
        badgeColor = 'bg-emerald-500/15 text-emerald-800 border-emerald-500/30';
        ruleUsed = '%DV ≤ 5% (Low Total Fat)';
        explanation = `Low total fat (${dv}% DV).`;
        good.push({
          title: `Low Total Fat (${dv}% DV)`,
          why: `5% or less of daily value for fat per serving.`,
          traceableTo: `Printed: ${rawName} ${amountStr || ''} (${dv}% DV)`
        });
      }
    }

    evaluated.push({
      nutrient: rawName,
      amount: amountStr,
      dv_percent: dv,
      status,
      badgeColor,
      ruleUsed,
      explanation
    });
  }

  return {
    hasNutrition: true,
    evaluatedNutrients: evaluated,
    goodNutrients: good,
    watchOutNutrients: watchOut
  };
}

/**
 * Evaluates printed ingredients against notable compound knowledge base
 */
export function evaluateIngredients(ingredientsList, productType = 'other') {
  if (!ingredientsList || !Array.isArray(ingredientsList) || ingredientsList.length === 0) {
    return {
      hasIngredients: false,
      notableIngredients: [],
      allergens: [],
      message: 'Ingredient effects cannot be assessed from this photo because no ingredient list was detected on the label.'
    };
  }

  const ingredientsText = ingredientsList.join(', ');
  const detectedNotable = [];
  const detectedAllergens = new Set();

  for (const entry of NOTABLE_INGREDIENTS) {
    if (entry.pattern.test(ingredientsText)) {
      // Find exact matching word in list for clean traceability
      const matchingWord = ingredientsList.find((ing) => entry.pattern.test(ing)) || entry.name;
      detectedNotable.push({
        ...entry,
        printedText: matchingWord
      });
    }
  }

  // Scan for common declared allergens
  for (const ing of ingredientsList) {
    const match = ing.match(COMMON_ALLERGENS_REGEX);
    if (match) {
      detectedAllergens.add(match[0].toLowerCase());
    }
  }

  return {
    hasIngredients: true,
    notableIngredients: detectedNotable,
    allergens: Array.from(detectedAllergens),
    message: null
  };
}

/**
 * Synthesizes Overview Tab Good vs Watch Out highlights
 */
export function buildOverviewSummary({
  productType = 'other',
  productName = 'Product',
  nutritionEval = null,
  ingredientEval = null,
  claimAudit = null
}) {
  const goodList = [];
  const watchOutList = [];

  // Nutrition insights
  if (nutritionEval && nutritionEval.hasNutrition) {
    for (const g of nutritionEval.goodNutrients) {
      goodList.push(g);
    }
    for (const w of nutritionEval.watchOutNutrients) {
      watchOutList.push(w);
    }
  }

  // Ingredient insights
  if (ingredientEval && ingredientEval.hasIngredients) {
    for (const notIng of ingredientEval.notableIngredients) {
      if (notIng.name === 'Palm Oil' || notIng.name.includes('Trans Fat') || notIng.name.includes('Added Sugar')) {
        watchOutList.push({
          title: `Contains ${notIng.name}`,
          why: notIng.possibleConcern,
          traceableTo: `Printed ingredient: "${notIng.printedText}"`
        });
      } else if (notIng.name.includes('SLS') || notIng.name.includes('Paraben') || notIng.name.includes('Fragrance')) {
        watchOutList.push({
          title: `Contains ${notIng.name}`,
          why: notIng.possibleConcern,
          traceableTo: `Printed ingredient: "${notIng.printedText}"`
        });
      }

      if (notIng.possibleGoodEffect) {
        goodList.push({
          title: `Beneficial functionality: ${notIng.name}`,
          why: notIng.possibleGoodEffect,
          traceableTo: `Printed ingredient: "${notIng.printedText}"`
        });
      }
    }

    if (ingredientEval.allergens.length > 0) {
      watchOutList.push({
        title: `Declared Allergens: ${ingredientEval.allergens.join(', ')}`,
        why: 'People with specific food sensitivities or allergies should avoid this product.',
        traceableTo: `Identified from ingredients: ${ingredientEval.allergens.join(', ')}`
      });
    }
  }

  // Environmental Claim insights
  if (claimAudit && claimAudit.hasClaims) {
    for (const ca of claimAudit.claimAudits) {
      if (ca.category === 'supported') {
        goodList.push({
          title: `Verified Environmental Claim: "${ca.claim}"`,
          why: ca.reasoning,
          traceableTo: `Packaging claim verified by visible certification standard`
        });
      } else if (ca.category === 'vague') {
        watchOutList.push({
          title: `Vague Environmental Claim: "${ca.claim}"`,
          why: ca.reasoning,
          traceableTo: `Unsubstantiated marketing phrase without third-party proof`
        });
      }
    }
  }

  const shortSummary = generatePlainSummary(productType, productName, goodList.length, watchOutList.length);

  return {
    shortSummary,
    goodList,
    watchOutList
  };
}

function generatePlainSummary(type, name, goodCount, watchCount) {
  const typeDisplay = {
    food: 'Packaged food',
    beverage: 'Beverage',
    personal_care: 'Personal care product',
    cleaning: 'Household cleaning product',
    other: 'Product label'
  }[type] || 'Product label';

  if (goodCount > 0 && watchCount > 0) {
    return `${typeDisplay} showing ${goodCount} notable nutritional or material benefit(s) and ${watchCount} point(s) to watch.`;
  }
  if (goodCount > 0) {
    return `${typeDisplay} with ${goodCount} positive printed attribute(s) and no critical nutritional or ingredient concerns detected.`;
  }
  if (watchCount > 0) {
    return `${typeDisplay} with ${watchCount} ingredient or nutritional consideration(s) to keep in mind.`;
  }
  return `Transcription of visible printed text from packaging.`;
}
