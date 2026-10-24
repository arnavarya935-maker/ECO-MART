/**
 * EcoMart Persona, Household Profiles & Intent Engine
 * Deterministic and Local-First.
 */

export const HOUSEHOLD_PROFILES = {
  default: {
    id: 'default',
    label: 'Standard Shopper',
    icon: '🛒',
    badge: 'Standard',
    description: 'Balanced priorities across price, carbon, and plastic avoidance.',
    constraints: {},
    weights: { price: 50, carbon: 50, plastic: 50, water: 50, local: 50, certs: 50, ecoScore: 50 }
  },
  student: {
    id: 'student',
    label: 'Student / Dorm',
    icon: '🎒',
    badge: 'Budget & Compact',
    description: 'Affordable essentials under ₹800 with high durability and minimal waste.',
    constraints: { maxPrice: 800 },
    weights: { price: 90, carbon: 40, plastic: 80, water: 30, local: 30, certs: 30, ecoScore: 60 }
  },
  family: {
    id: 'family',
    label: 'Conscious Family',
    icon: '🏡',
    badge: 'Low-Tox & Plastic-Free',
    description: 'Non-toxic, plastic-free packaging for home, kitchen and child safety.',
    constraints: { minEcoScore: 60, onlyPlasticFree: true },
    weights: { price: 40, carbon: 60, plastic: 100, water: 50, local: 60, certs: 70, ecoScore: 80 }
  },
  senior: {
    id: 'senior',
    label: 'Gentle Living / Senior',
    icon: '🌿',
    badge: 'Local & Pure',
    description: 'Lightweight ergonomic essentials, hypoallergenic materials, and short-distance local sourcing.',
    constraints: { onlyEcoFriendly: true },
    weights: { price: 40, carbon: 50, plastic: 75, water: 50, local: 95, certs: 60, ecoScore: 75 }
  },
  minimalist: {
    id: 'minimalist',
    label: 'Zero-Waste Minimalist',
    icon: '✨',
    badge: 'Circular Purist',
    description: 'Strict 0g plastic, 100% recyclable or home-compostable circular essentials.',
    constraints: { onlyPlasticFree: true, minEcoScore: 70 },
    weights: { price: 30, carbon: 80, plastic: 100, water: 60, local: 70, certs: 60, ecoScore: 90 }
  }
};

/**
 * Predefined Occasion Kits built from catalog items
 */
export const OCCASION_KITS = [
  {
    id: 'dorm-movein',
    name: 'Eco Dorm & Room Move-in Kit',
    season: 'Back-to-School / Fall',
    icon: '🎒',
    description: 'Everything a student needs to start an eco room: toothbrushes, steel bottle, and organic cotton laundry bag.',
    budgetRange: 'Under ₹1500',
    targetCategories: ['Personal Care', 'Accessories', 'Kitchen'],
    suggestedItemKeywords: ['toothbrush', 'bottle', 'tote', 'bag']
  },
  {
    id: 'plastic-free-kitchen',
    name: 'Zero-Waste Kitchen Starter',
    season: 'All-Year',
    icon: '🍳',
    description: 'Eliminate kitchen plastic cling wrap and sponges with plant-fiber brushes and coconut scourers.',
    budgetRange: 'Under ₹2000',
    targetCategories: ['Kitchen', 'Home & Living'],
    suggestedItemKeywords: ['sponge', 'wrap', 'brush', 'scrub', 'chopping']
  },
  {
    id: 'festive-green-hamper',
    name: 'Conscious Festive Gift Hamper',
    season: 'Festivals / Celebrations',
    icon: '🪔',
    description: 'Artisan hand-poured soy wax candles, organic soaps, and seed paper gift stationery.',
    budgetRange: 'Under ₹2500',
    targetCategories: ['Home & Living', 'Personal Care'],
    suggestedItemKeywords: ['candle', 'soap', 'incense', 'paper']
  },
  {
    id: 'monsoon-care',
    name: 'Monsoon Clean Essentials',
    season: 'Monsoon',
    icon: '🌧️',
    description: 'Drying and moisture-resistant essentials: copper water vessel, neem wood comb, and loofahs.',
    budgetRange: 'Under ₹1200',
    targetCategories: ['Personal Care', 'Home & Living'],
    suggestedItemKeywords: ['comb', 'loofah', 'copper', 'soap']
  }
];

/**
 * Parse natural language shopping search intent
 * Example: "plastic-free kitchen under 800" -> category: Kitchen, maxPrice: 800, onlyPlasticFree: true
 * @param {string} rawQuery
 * @returns {Object} Extracted constraints and clean search keywords
 */
export function parseIntentSearch(rawQuery) {
  if (!rawQuery || typeof rawQuery !== 'string') {
    return {
      cleanQuery: '',
      extractedConstraints: {},
      recognizedChips: []
    };
  }

  const text = rawQuery.toLowerCase().trim();
  const constraints = {};
  const chips = [];
  let cleanWords = text;

  // 1. Detect max price: "under 800", "below 500", "< 1000", "under rs 1200", "under ₹500"
  const priceMatch = text.match(/(?:under|below|less than|max|<|rs\.?|₹)\s*(\d{2,5})/i);
  if (priceMatch) {
    const limit = parseInt(priceMatch[1], 10);
    if (!Number.isNaN(limit) && limit > 0) {
      constraints.maxPrice = limit;
      chips.push(`Max ₹${limit}`);
      cleanWords = cleanWords.replace(priceMatch[0], ' ');
    }
  }

  // 2. Detect plastic-free
  if (text.includes('plastic-free') || text.includes('plastic free') || text.includes('zero plastic') || text.includes('no plastic')) {
    constraints.onlyPlasticFree = true;
    chips.push('Plastic-Free Only');
    cleanWords = cleanWords
      .replace('plastic-free', ' ')
      .replace('plastic free', ' ')
      .replace('zero plastic', ' ')
      .replace('no plastic', ' ');
  }

  // 3. Detect eco-friendly filter
  if (text.includes('eco only') || text.includes('green only') || text.includes('organic only')) {
    constraints.onlyEcoFriendly = true;
    chips.push('Eco-Certified Only');
    cleanWords = cleanWords
      .replace('eco only', ' ')
      .replace('green only', ' ')
      .replace('organic only', ' ');
  }

  // 4. Detect categories
  const categoryKeywords = {
    'Kitchen': ['kitchen', 'cooking', 'cutlery', 'dish', 'sponge'],
    'Personal Care': ['bath', 'shampoo', 'soap', 'toothbrush', 'care', 'dental'],
    'Home & Living': ['home', 'living', 'candle', 'decor', 'cleaner'],
    'Apparel': ['apparel', 'clothing', 'shirt', 't-shirt', 'wear'],
    'Accessories': ['accessory', 'bag', 'tote', 'wallet', 'backpack']
  };

  for (const [catName, keywords] of Object.entries(categoryKeywords)) {
    for (const kw of keywords) {
      if (new RegExp(`\\b${kw}\\b`, 'i').test(text)) {
        constraints.category = catName;
        chips.push(catName);
        cleanWords = cleanWords.replace(new RegExp(`\\b${kw}\\b`, 'gi'), ' ');
        break;
      }
    }
    if (constraints.category) break;
  }

  const cleanQuery = cleanWords.replace(/\s+/g, ' ').trim();

  return {
    cleanQuery,
    extractedConstraints: constraints,
    recognizedChips: chips
  };
}

/**
 * Filter and rank gift recommendations
 * @param {Object} params - { recipient, occasion, budget, catalog }
 * @returns {Array} Curated gift products with plain-language recommendation note
 */
export function recommendGifts({ recipient = 'friend', occasion = 'birthday', budget = 2000, catalog = [] }) {
  if (!Array.isArray(catalog) || catalog.length === 0) return [];

  const maxBudget = Number(budget) || 2000;
  const candidates = catalog.filter((p) => (p.price ?? 0) <= maxBudget);

  const scored = candidates.map((p) => {
    let relevanceScore = 0;
    const name = (p.name || '').toLowerCase();
    const cat = (p.category || '').toLowerCase();

    // Occasion matching
    if (occasion === 'housewarming' && (cat.includes('home') || cat.includes('kitchen'))) {
      relevanceScore += 40;
    }
    if (occasion === 'festival' && (name.includes('candle') || name.includes('sweet') || cat.includes('living'))) {
      relevanceScore += 40;
    }
    if (occasion === 'birthday' && (cat.includes('accessories') || cat.includes('personal'))) {
      relevanceScore += 35;
    }

    // Recipient matching
    if (recipient === 'kid' && (name.includes('wood') || name.includes('toy') || cat.includes('stationery'))) {
      relevanceScore += 30;
    }
    if (recipient === 'colleague' && (name.includes('bottle') || name.includes('notebook') || name.includes('pen') || name.includes('tote'))) {
      relevanceScore += 30;
    }

    // General eco excellence bonus
    if (p.isEcoFriendly) relevanceScore += 20;
    if (p.packaging === 'plastic-free') relevanceScore += 15;

    let reason = `Ideal ${occasion} eco gift under ₹${maxBudget}. High circularity and zero virgin plastic.`;
    if (p.packaging === 'plastic-free') {
      reason += ' Ships in 100% plastic-free packaging.';
    }

    return {
      ...p,
      giftRelevance: relevanceScore,
      giftReason: reason
    };
  });

  scored.sort((a, b) => b.giftRelevance - a.giftRelevance);
  return scored.slice(0, 6);
}

let memorySwapStore = [];

/**
 * Record a smart swap decision (approve or reject) to local storage.
 * The agent uses this to avoid suggesting repeatedly rejected items.
 */
export function recordSwapDecision(swapId, approved, itemFrom, itemTo) {
  const entry = {
    id: swapId || `swap_${Date.now()}`,
    approved: Boolean(approved),
    fromId: itemFrom?.id,
    toId: itemTo?.id,
    toName: itemTo?.name,
    timestamp: new Date().toISOString()
  };

  memorySwapStore.unshift(entry);

  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem('ecomart_swap_decisions');
      const existing = raw ? JSON.parse(raw) : [];
      existing.unshift(entry);
      localStorage.setItem('ecomart_swap_decisions', JSON.stringify(existing.slice(0, 50)));
    }
  } catch {}
}

/**
 * Read past swap decisions to identify locally learned patterns
 */
export function getSwapLearnings() {
  let list = memorySwapStore;
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem('ecomart_swap_decisions');
      if (raw) {
        list = JSON.parse(raw);
      }
    }
  } catch {}

  const approvals = list.filter((item) => item.approved).length;
  const rejections = list.filter((item) => !item.approved);
  const rejectedIds = [...new Set(rejections.map((r) => r.toId).filter(Boolean))];
  return {
    totalDecisions: list.length,
    approvals,
    rejections: rejections.length,
    rejectedIds
  };
}
