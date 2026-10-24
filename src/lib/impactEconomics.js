/**
 * EcoMart Impact Economics & Tangible Equivalents Engine
 * 100% Offline, Deterministic, and Grounded in Disclosed Assumptions.
 */

// Published conversion factors with citations
export const IMPACT_BENCHMARKS = {
  ELECTRIC_AUTO_KM_PER_KG_CO2: 8.33, // 1 kg CO2e is approx. 8.33 km in a typical EV auto (assuming 120g CO2/km grid emission)
  SMARTPHONE_CHARGES_PER_KG_CO2: 125, // 1 kWh ~ 0.82 kg CO2 in Indian grid; smartphone takes ~10Wh per full charge
  TREE_ABSORPTION_KG_CO2_YEAR: 21.77, // USDA Forest Service benchmark: mature tree absorbs ~21.8 kg CO2/year
  PET_BOTTLE_WEIGHT_GRAMS: 12.0, // Standard 500ml PET water bottle ~ 12 grams
  SINGLE_USE_POLYBAG_GRAMS: 5.5, // Standard HDPE carry bag ~ 5.5 grams
  ADULT_DAILY_DRINKING_WATER_LITRES: 2.5, // WHO hydration guideline
  STANDARD_BUCKET_BATH_LITRES: 15.0 // Bureau of Indian Standards bucket benchmark
};

/**
 * Convert abstract environmental metrics into tangible everyday equivalents
 * @param {Object} metrics - { co2Kg, plasticGrams, waterLitres }
 * @returns {Object} Human-scale relatable comparisons with disclosed methodology
 */
export function translateImpactEquivalents(metrics = {}) {
  const co2 = Math.max(0, Number(metrics.co2Kg) || 0);
  const plastic = Math.max(0, Number(metrics.plasticGrams) || 0);
  const water = Math.max(0, Number(metrics.waterLitres) || 0);

  const evKm = Math.round(co2 * IMPACT_BENCHMARKS.ELECTRIC_AUTO_KM_PER_KG_CO2);
  const phoneCharges = Math.round(co2 * IMPACT_BENCHMARKS.SMARTPHONE_CHARGES_PER_KG_CO2);
  const treeDays = Math.round((co2 / (IMPACT_BENCHMARKS.TREE_ABSORPTION_KG_CO2_YEAR / 365)));

  const petBottles = Math.round(plastic / IMPACT_BENCHMARKS.PET_BOTTLE_WEIGHT_GRAMS);
  const polybags = Math.round(plastic / IMPACT_BENCHMARKS.SINGLE_USE_POLYBAG_GRAMS);

  const drinkingDays = Math.round(water / IMPACT_BENCHMARKS.ADULT_DAILY_DRINKING_WATER_LITRES);
  const bucketBaths = Math.round(water / IMPACT_BENCHMARKS.STANDARD_BUCKET_BATH_LITRES);

  return {
    raw: { co2, plastic, water },
    carbon: {
      headline: `~${evKm} km in an electric vehicle`,
      secondary: `or ~${phoneCharges} full smartphone recharges`,
      treeOffsetDays: `Equivalent to ${treeDays} days of carbon capture by an adult tree`,
      citation: 'Grid factor: 0.82 kg CO₂/kWh (CEA India Baseline v19)'
    },
    plastic: {
      headline: `~${petBottles} single-use 500ml plastic bottles`,
      secondary: `or ~${polybags} plastic carry bags kept out of landfills`,
      citation: 'Weight standard: CPCB Plastic Packaging Benchmark (12g PET)'
    },
    water: {
      headline: `~${drinkingDays} days of clean drinking water`,
      secondary: `or ~${bucketBaths} standard 15-litre bucket baths`,
      citation: 'Hydration baseline: WHO Guidelines for Drinking-water Quality'
    },
    assumptionsNote: 'All equivalents are deterministic estimates derived from Indian municipal and grid baseline averages.'
  };
}

/**
 * Cost-Per-Use Durability Economic Calculator
 * Compares upfront investment of a long-lasting eco item vs recurring cost of single-use consumables.
 * @param {Object} params
 * @returns {Object} Comparative lifetime savings breakdown
 */
export function calculateCostPerUse({
  durablePrice,
  durableUsesCount,
  disposablePrice,
  disposableUsesCount = 1
}) {
  const pDurable = Math.max(1, Number(durablePrice) || 0);
  const uDurable = Math.max(1, Number(durableUsesCount) || 100);
  const pDisposable = Math.max(0.1, Number(disposablePrice) || 10);
  const uDisposable = Math.max(1, Number(disposableUsesCount) || 1);

  const costPerUseDurable = pDurable / uDurable;
  const costPerUseDisposable = pDisposable / uDisposable;

  // Equivalent disposable spend over the durable item's lifespan
  const equivalentDisposableTotalCost = costPerUseDisposable * uDurable;
  const netLifetimeSavings = Math.round(equivalentDisposableTotalCost - pDurable);

  const breakEvenUses = Math.ceil(pDurable / costPerUseDisposable);

  return {
    durable: {
      upfrontPrice: pDurable,
      estimatedLifespanUses: uDurable,
      costPerUse: Number(costPerUseDurable.toFixed(2))
    },
    disposable: {
      unitPrice: pDisposable,
      costPerUse: Number(costPerUseDisposable.toFixed(2)),
      equivalentTotalSpend: Math.round(equivalentDisposableTotalCost)
    },
    netLifetimeSavings,
    breakEvenUses,
    verdict: netLifetimeSavings > 0
      ? `Saves approximately ₹${netLifetimeSavings.toLocaleString('en-IN')} over ${uDurable} uses. Breaks even after ${breakEvenUses} uses.`
      : `Higher upfront cost. Breaks even after ${breakEvenUses} uses.`
  };
}

/**
 * Personal Carbon Budget Tracker
 * Tracks monthly consumption against an individual carbon budget ceiling.
 * @param {number} consumedKg
 * @param {number} monthlyLimitKg - Default 50 kg CO2e
 * @returns {Object}
 */
export function calculatePersonalCarbonBudget(consumedKg = 0, monthlyLimitKg = 50) {
  const limit = Math.max(5, Number(monthlyLimitKg) || 50);
  const consumed = Math.max(0, Number(consumedKg) || 0);
  const remaining = Math.max(0, limit - consumed);
  const percentage = Math.min(100, Math.round((consumed / limit) * 100));

  let status = 'safe'; // 'safe' | 'approaching' | 'exceeded'
  if (consumed > limit) {
    status = 'exceeded';
  } else if (percentage >= 80) {
    status = 'approaching';
  }

  const equivalents = translateImpactEquivalents({ co2Kg: consumed });

  return {
    limitKg: limit,
    consumedKg: Number(consumed.toFixed(1)),
    remainingKg: Number(remaining.toFixed(1)),
    percentage,
    status,
    equivalentDescription: equivalents.carbon.headline,
    isOverBudget: consumed > limit
  };
}
