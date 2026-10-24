/**
 * EcoMart Decision Engine - Priority-Weighted Multi-Criteria Decision Making (MCDM)
 * Local-First & Transparent.
 *
 * Evaluates products across 7 normalised dimensions:
 * 1. Price (lower is better)
 * 2. Carbon (lower is better, carbonKg)
 * 3. Plastic (lower is better, plasticGrams)
 * 4. Water (lower is better, waterLitres)
 * 5. Local sourcing (lower is better, madeInKm)
 * 6. Certifications count (higher is better)
 * 7. EcoScore (higher is better)
 */

import { calculateEcoScore } from './ecoScore.js';

export const DEFAULT_PRIORITIES = {
  price: 50,
  carbon: 50,
  plastic: 50,
  water: 50,
  local: 50,
  certs: 50,
  ecoScore: 50
};

export const PRIORITY_PRESETS = {
  balanced: {
    id: 'balanced',
    label: 'Balanced',
    description: 'Equal weighting across environmental and cost factors',
    weights: { price: 50, carbon: 50, plastic: 50, water: 50, local: 50, certs: 50, ecoScore: 50 }
  },
  save_money: {
    id: 'save_money',
    label: 'Save Money',
    description: 'Prioritize lowest price while maintaining eco standards',
    weights: { price: 100, carbon: 30, plastic: 25, water: 25, local: 20, certs: 20, ecoScore: 35 }
  },
  cut_plastic: {
    id: 'cut_plastic',
    label: 'Cut Plastic',
    description: 'Target zero plastic waste and non-plastic packaging',
    weights: { price: 30, carbon: 40, plastic: 100, water: 30, local: 30, certs: 40, ecoScore: 60 }
  },
  lowest_carbon: {
    id: 'lowest_carbon',
    label: 'Lowest Carbon',
    description: 'Minimize manufacturing & shipping greenhouse gas emissions',
    weights: { price: 30, carbon: 100, plastic: 40, water: 40, local: 60, certs: 40, ecoScore: 60 }
  },
  support_local: {
    id: 'support_local',
    label: 'Support Local',
    description: 'Shortest transit distance and regional artisan craft',
    weights: { price: 30, carbon: 40, plastic: 30, water: 30, local: 100, certs: 40, ecoScore: 50 }
  }
};

/**
 * Normalise a numeric value within [min, max].
 * For lowerIsBetter: min gets 1.0, max gets 0.0.
 * For higherIsBetter: max gets 1.0, min gets 0.0.
 * Handles ties (min === max) by returning 1.0.
 */
function normaliseValue(val, min, max, lowerIsBetter = false) {
  if (min === max || Number.isNaN(min) || Number.isNaN(max)) {
    return 1.0;
  }
  const clamped = Math.max(min, Math.min(max, val));
  if (lowerIsBetter) {
    return (max - clamped) / (max - min);
  }
  return (clamped - min) / (max - min);
}

/**
 * Human explanation builder for the dominant positive criterion
 */
function formatReason(criterion, product) {
  switch (criterion) {
    case 'plastic':
      return product.plasticGrams === 0
        ? 'Zero plastic waste (0g)'
        : `Low plastic footprint (${product.plasticGrams}g)`;
    case 'price':
      return `Affordable price (₹${product.price})`;
    case 'carbon':
      return `Low carbon footprint (${product.carbonKg}kg CO₂)`;
    case 'water':
      return `Low water usage (${product.waterLitres ?? 0}L)`;
    case 'local':
      return `Locally sourced (${product.madeInKm ?? 0} km away)`;
    case 'certs': {
      const count = Array.isArray(product.certifications) ? product.certifications.length : 0;
      return `${count} verified certification${count === 1 ? '' : 's'}`;
    }
    case 'ecoScore': {
      const score = typeof product.ecoScore === 'number' ? product.ecoScore : (calculateEcoScore(product)?.score || 50);
      return `High EcoScore (${score}/100)`;
    }
    default:
      return 'Meets sustainability standards';
  }
}

/**
 * Multi-criteria decision ranking engine
 * @param {Array} products - List of product items
 * @param {Object} [weights] - Criterion weights (0-100)
 * @param {Object} [constraints] - Optional filter constraints
 * @returns {Array} - Ranked products with score, breakdown, and explanation
 */
export function rankProducts(products, weights = DEFAULT_PRIORITIES, constraints = {}) {
  if (!Array.isArray(products) || products.length === 0) {
    return [];
  }

  // 1. Apply constraints/filters
  let candidates = products.filter((p) => {
    if (!p) return false;
    if (constraints.category && constraints.category !== 'All' && p.category !== constraints.category) {
      return false;
    }
    if (typeof constraints.maxPrice === 'number' && p.price > constraints.maxPrice) {
      return false;
    }
    if (typeof constraints.maxPlastic === 'number' && (p.plasticGrams ?? 0) > constraints.maxPlastic) {
      return false;
    }
    if (typeof constraints.minEcoScore === 'number') {
      const sc = typeof p.ecoScore === 'number' ? p.ecoScore : (calculateEcoScore(p)?.score || 0);
      if (sc < constraints.minEcoScore) return false;
    }
    if (constraints.onlyPlasticFree && p.packaging !== 'plastic-free') {
      return false;
    }
    if (constraints.onlyEcoFriendly && !p.isEcoFriendly) {
      return false;
    }
    if (constraints.searchQuery) {
      const q = constraints.searchQuery.toLowerCase().trim();
      const match =
        p.name.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.material && p.material.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  if (candidates.length === 0) {
    return [];
  }

  // 2. Clamp and validate weights
  const safeWeights = {
    price: Math.max(0, Math.min(100, Number(weights?.price ?? DEFAULT_PRIORITIES.price))),
    carbon: Math.max(0, Math.min(100, Number(weights?.carbon ?? DEFAULT_PRIORITIES.carbon))),
    plastic: Math.max(0, Math.min(100, Number(weights?.plastic ?? DEFAULT_PRIORITIES.plastic))),
    water: Math.max(0, Math.min(100, Number(weights?.water ?? DEFAULT_PRIORITIES.water))),
    local: Math.max(0, Math.min(100, Number(weights?.local ?? DEFAULT_PRIORITIES.local))),
    certs: Math.max(0, Math.min(100, Number(weights?.certs ?? DEFAULT_PRIORITIES.certs))),
    ecoScore: Math.max(0, Math.min(100, Number(weights?.ecoScore ?? DEFAULT_PRIORITIES.ecoScore)))
  };

  const totalWeight = Object.values(safeWeights).reduce((a, b) => a + b, 0) || 1;

  // 3. Extract ranges for normalisation across candidates
  const prices = candidates.map((p) => p.price ?? 0);
  const carbons = candidates.map((p) => p.carbonKg ?? 0);
  const plastics = candidates.map((p) => p.plasticGrams ?? 0);
  const waters = candidates.map((p) => p.waterLitres ?? 0);
  const locals = candidates.map((p) => p.madeInKm ?? 0);
  const certs = candidates.map((p) => (Array.isArray(p.certifications) ? p.certifications.length : 0));
  const ecoScores = candidates.map((p) =>
    typeof p.ecoScore === 'number' ? p.ecoScore : (calculateEcoScore(p)?.score || 50)
  );

  const stats = {
    price: { min: Math.min(...prices), max: Math.max(...prices) },
    carbon: { min: Math.min(...carbons), max: Math.max(...carbons) },
    plastic: { min: Math.min(...plastics), max: Math.max(...plastics) },
    water: { min: Math.min(...waters), max: Math.max(...waters) },
    local: { min: Math.min(...locals), max: Math.max(...locals) },
    certs: { min: Math.min(...certs), max: Math.max(...certs) },
    ecoScore: { min: Math.min(...ecoScores), max: Math.max(...ecoScores) }
  };

  // 4. Compute per-product scores and contributions
  const scored = candidates.map((product) => {
    const rawVal = {
      price: product.price ?? 0,
      carbon: product.carbonKg ?? 0,
      plastic: product.plasticGrams ?? 0,
      water: product.waterLitres ?? 0,
      local: product.madeInKm ?? 0,
      certs: Array.isArray(product.certifications) ? product.certifications.length : 0,
      ecoScore: typeof product.ecoScore === 'number' ? product.ecoScore : (calculateEcoScore(product)?.score || 50)
    };

    const norm = {
      price: normaliseValue(rawVal.price, stats.price.min, stats.price.max, true),
      carbon: normaliseValue(rawVal.carbon, stats.carbon.min, stats.carbon.max, true),
      plastic: normaliseValue(rawVal.plastic, stats.plastic.min, stats.plastic.max, true),
      water: normaliseValue(rawVal.water, stats.water.min, stats.water.max, true),
      local: normaliseValue(rawVal.local, stats.local.min, stats.local.max, true),
      certs: normaliseValue(rawVal.certs, stats.certs.min, stats.certs.max, false),
      ecoScore: normaliseValue(rawVal.ecoScore, stats.ecoScore.min, stats.ecoScore.max, false)
    };

    // Calculate contribution of each criterion to the final score (0-100 scale)
    const contributions = {};
    let weightedSum = 0;

    Object.keys(safeWeights).forEach((key) => {
      const w = safeWeights[key];
      const contributionPoints = (w * norm[key]) / totalWeight * 100;
      contributions[key] = Math.round(contributionPoints * 10) / 10;
      weightedSum += w * norm[key];
    });

    const finalScore = Math.round((weightedSum / totalWeight) * 1000) / 10;

    // Identify dominant factors for explanation (highest weighted impact)
    const factorRank = Object.keys(safeWeights)
      .filter((k) => safeWeights[k] > 0)
      .map((k) => ({
        criterion: k,
        impact: contributions[k],
        norm: norm[k],
        weight: safeWeights[k]
      }))
      .sort((a, b) => b.impact - a.impact || b.norm - a.norm);

    const topFactors = factorRank.slice(0, 2);
    const topReasons = topFactors.map((f) => formatReason(f.criterion, product));

    const explanation = topReasons.length > 0
      ? `Top factors: ${topReasons.join(' and ')}`
      : 'Balanced eco profile';

    return {
      ...product,
      finalScore,
      score: finalScore,
      contributions,
      normalizedScores: norm,
      topReasons,
      explanation,
      dominantCriterion: topFactors[0]?.criterion || 'ecoScore'
    };
  });

  // 5. Sort by final score descending, breaking ties with EcoScore, then price ascending
  scored.sort((a, b) => {
    if (b.finalScore !== a.finalScore) {
      return b.finalScore - a.finalScore;
    }
    const ecoA = typeof a.ecoScore === 'number' ? a.ecoScore : (calculateEcoScore(a)?.score || 0);
    const ecoB = typeof b.ecoScore === 'number' ? b.ecoScore : (calculateEcoScore(b)?.score || 0);
    if (ecoB !== ecoA) return ecoB - ecoA;
    return (a.price ?? 0) - (b.price ?? 0);
  });

  // Add rank index (1-based)
  return scored.map((item, idx) => ({
    ...item,
    rank: idx + 1
  }));
}

/**
 * Format active priorities as a human-friendly string for the agent
 */
export function formatPrioritiesSummary(weights) {
  const safe = { ...DEFAULT_PRIORITIES, ...weights };
  const labels = {
    plastic: 'Plastic',
    price: 'Price',
    carbon: 'Carbon',
    local: 'Local',
    water: 'Water',
    certs: 'Certifications',
    ecoScore: 'EcoScore'
  };
  // Sort by highest weight first
  const sorted = Object.entries(safe)
    .sort((a, b) => b[1] - a[1])
    .map(([key, val]) => `${labels[key] || key} ${val}`);
  return `Ranking with your priorities: ${sorted.join(', ')}`;
}

/**
 * Parse natural language priority intent from user input
 * Returns updated weights or null if no priority intent found
 */
export function parsePriorityIntent(query, currentWeights = DEFAULT_PRIORITIES) {
  if (!query || typeof query !== 'string') return null;
  const q = query.toLowerCase();

  // Presets
  if (q.includes('balanced') || q.includes('reset priorities') || q.includes('default priority')) {
    return { ...PRIORITY_PRESETS.balanced.weights };
  }
  if (q.includes('save money') || q.includes('cheapest first') || q.includes('budget priority')) {
    return { ...PRIORITY_PRESETS.save_money.weights };
  }
  if (q.includes('cut plastic') || q.includes('no plastic') || q.includes('zero plastic')) {
    return { ...PRIORITY_PRESETS.cut_plastic.weights };
  }
  if (q.includes('lowest carbon') || q.includes('cut carbon') || q.includes('zero carbon')) {
    return { ...PRIORITY_PRESETS.lowest_carbon.weights };
  }
  if (q.includes('support local') || q.includes('near me') || q.includes('local sourcing')) {
    return { ...PRIORITY_PRESETS.support_local.weights };
  }

  // Dimension specific adjustments
  const next = { ...DEFAULT_PRIORITIES, ...currentWeights };

  if (q.includes('care most about price') || q.includes('price matters more') || q.includes('priority to price') || q.includes('focus on price') || q.includes('cheapest')) {
    next.price = 100;
    next.carbon = Math.min(next.carbon, 40);
    next.plastic = Math.min(next.plastic, 40);
    return next;
  }
  if (q.includes('plastic matters more') || q.includes('care most about plastic') || q.includes('focus on plastic') || q.includes('priority to plastic')) {
    next.plastic = 100;
    return next;
  }
  if (q.includes('carbon matters more') || q.includes('care most about carbon') || q.includes('focus on carbon') || q.includes('priority to carbon')) {
    next.carbon = 100;
    return next;
  }
  if (q.includes('local matters more') || q.includes('care most about local') || q.includes('focus on local') || q.includes('priority to local')) {
    next.local = 100;
    return next;
  }
  if (q.includes('water matters more') || q.includes('care most about water') || q.includes('focus on water')) {
    next.water = 100;
    return next;
  }
  if (q.includes('certifications matter') || q.includes('care most about cert')) {
    next.certs = 100;
    return next;
  }

  return null;
}

/**
 * Computes category averages from catalog dataset (Feature 63)
 */
export function computeCategoryBenchmarks(products = []) {
  const categories = {};

  products.forEach((p) => {
    const cat = p.category || 'General';
    if (!categories[cat]) {
      categories[cat] = {
        count: 0,
        totalEcoScore: 0,
        totalPrice: 0,
        totalCarbon: 0,
        totalPlastic: 0,
        totalWater: 0
      };
    }
    const c = categories[cat];
    c.count += 1;
    c.totalEcoScore += Number(p.ecoScore || 70);
    c.totalPrice += Number(p.price || 0);
    c.totalCarbon += Number(p.carbonKg || p.carbon || 1.5);
    c.totalPlastic += Number(p.plasticGrams || p.plastic || 50);
    c.totalWater += Number(p.waterLitres || p.water || 100);
  });

  const benchmarks = {};
  Object.entries(categories).forEach(([cat, stats]) => {
    benchmarks[cat] = {
      category: cat,
      sampleSize: stats.count,
      avgEcoScore: Math.round(stats.totalEcoScore / stats.count),
      avgPrice: Math.round(stats.totalPrice / stats.count),
      avgCarbonKg: Number((stats.totalCarbon / stats.count).toFixed(2)),
      avgPlasticGrams: Math.round(stats.totalPlastic / stats.count),
      avgWaterLitres: Math.round(stats.totalWater / stats.count)
    };
  });

  return benchmarks;
}

/**
 * Compares a specific product to its category benchmarks
 */
export function compareProductToBenchmark(product, products = []) {
  if (!product) return null;
  const benchmarks = computeCategoryBenchmarks(products);
  const catBenchmark = benchmarks[product.category] || {
    avgEcoScore: 75,
    avgCarbonKg: 1.8,
    avgPlasticGrams: 80,
    avgPrice: 450,
    sampleSize: products.length
  };

  const prodScore = Number(product.ecoScore || 75);
  const prodCarbon = Number(product.carbonKg || product.carbon || 1.2);
  const prodPlastic = Number(product.plasticGrams || product.plastic || 10);

  return {
    category: product.category,
    sampleSize: catBenchmark.sampleSize,
    ecoScoreDelta: prodScore - catBenchmark.avgEcoScore,
    carbonDeltaKg: Number((catBenchmark.avgCarbonKg - prodCarbon).toFixed(2)),
    plasticDeltaGrams: Math.round(catBenchmark.avgPlasticGrams - prodPlastic),
    avgEcoScore: catBenchmark.avgEcoScore,
    avgCarbonKg: catBenchmark.avgCarbonKg,
    avgPlasticGrams: catBenchmark.avgPlasticGrams
  };
}
