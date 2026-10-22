/**
 * On-Device Personalization & Preference Learning Engine
 * 100% Offline & Private: Tracks interaction signals strictly in localStorage.
 * No remote telemetry, cookies, or cloud sync.
 */

import { rankProducts, DEFAULT_PRIORITIES } from './decisionEngine.js';

const STORAGE_KEY = 'ecomart_user_signals';

let memorySignals = null;

function createDefaultSignals() {
  return {
    categoryViews: {},
    productOpens: {},
    wishlistAdds: {},
    cartAdds: {},
    swapsAccepted: 0,
    swapsDeclined: 0,
    lastUpdated: 0
  };
}

/**
 * Load signals from localStorage safely
 * @returns {ReturnType<typeof createDefaultSignals>}
 */
export function getStoredSignals() {
  try {
    if (typeof localStorage !== 'undefined' && localStorage.getItem) {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          categoryViews: parsed.categoryViews || {},
          productOpens: parsed.productOpens || {},
          wishlistAdds: parsed.wishlistAdds || {},
          cartAdds: parsed.cartAdds || {},
          swapsAccepted: parsed.swapsAccepted || 0,
          swapsDeclined: parsed.swapsDeclined || 0,
          lastUpdated: parsed.lastUpdated || Date.now()
        };
      }
    }
  } catch {}

  if (memorySignals) {
    return JSON.parse(JSON.stringify(memorySignals));
  }
  return createDefaultSignals();
}

/**
 * Save signals to localStorage
 * @param {ReturnType<typeof createDefaultSignals>} signals
 */
export function saveSignals(signals) {
  signals.lastUpdated = Date.now();
  memorySignals = JSON.parse(JSON.stringify(signals));
  try {
    if (typeof localStorage !== 'undefined' && localStorage.setItem) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(signals));
    }
  } catch {}
}

/**
 * Record a single user action signal
 * @param {'category_view' | 'product_open' | 'wishlist_add' | 'cart_add' | 'swap_accepted' | 'swap_declined'} type
 * @param {string | object} payload
 */
export function recordSignal(type, payload) {
  const signals = getStoredSignals();

  switch (type) {
    case 'category_view': {
      const cat = typeof payload === 'string' ? payload : payload?.category;
      if (cat) {
        signals.categoryViews[cat] = (signals.categoryViews[cat] || 0) + 1;
      }
      break;
    }
    case 'product_open': {
      const id = typeof payload === 'string' ? payload : payload?.id;
      if (id) {
        signals.productOpens[id] = (signals.productOpens[id] || 0) + 1;
        if (payload?.category) {
          signals.categoryViews[payload.category] = (signals.categoryViews[payload.category] || 0) + 1;
        }
      }
      break;
    }
    case 'wishlist_add': {
      const id = typeof payload === 'string' ? payload : payload?.id;
      if (id) {
        signals.wishlistAdds[id] = (signals.wishlistAdds[id] || 0) + 1;
      }
      break;
    }
    case 'cart_add': {
      const id = typeof payload === 'string' ? payload : payload?.id;
      if (id) {
        signals.cartAdds[id] = (signals.cartAdds[id] || 0) + 1;
        if (payload?.category) {
          signals.categoryViews[payload.category] = (signals.categoryViews[payload.category] || 0) + 2;
        }
      }
      break;
    }
    case 'swap_accepted':
      signals.swapsAccepted += 1;
      break;
    case 'swap_declined':
      signals.swapsDeclined += 1;
      break;
    default:
      break;
  }

  saveSignals(signals);
  return signals;
}

/**
 * Reset all learned on-device signals
 */
export function resetPreferences() {
  memorySignals = null;
  try {
    if (typeof localStorage !== 'undefined' && localStorage.removeItem) {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {}
  return createDefaultSignals();
}

/**
 * Calculate personalized ranking combining multi-criteria decision engine
 * and learned on-device preference signals.
 * @param {Array} products
 * @param {object} [userPriorities]
 * @param {object} [mockSignals] optional override for unit tests
 * @returns {Array} ranked products with personalizedReason
 */
export function getPersonalizedRanking(products, userPriorities = DEFAULT_PRIORITIES, mockSignals = null) {
  if (!products || !Array.isArray(products) || products.length === 0) return [];

  const signals = mockSignals || getStoredSignals();

  // Base ranking from decision engine
  const baseRanked = rankProducts(products, userPriorities);

  // Apply signal-based adjustments
  const scored = baseRanked.map((item) => {
    let boost = 0;
    let reason = 'Selected based on your balanced sustainability priorities';

    const categoryViews = signals.categoryViews[item.category] || 0;
    if (categoryViews > 0) {
      const catBoost = Math.min(12, categoryViews * 2.5);
      boost += catBoost;
      reason = `Because you frequently explored ${item.category}`;
    }

    if (signals.swapsAccepted > 0 && item.plasticGrams === 0) {
      boost += 8;
      reason = 'Because you chose verified plastic-free swaps';
    } else if (signals.swapsAccepted > 0 && item.isEcoFriendly) {
      boost += 5;
      reason = 'Recommended based on your green upgrade history';
    }

    if (signals.wishlistAdds[item.id]) {
      boost += 6;
      reason = 'Saved in your personal wishlist collection';
    }

    if (signals.cartAdds[item.id]) {
      boost += 4;
      reason = 'Complementary to your recent conscious basket';
    }

    const finalPersonalizedScore = Number((item.score + boost).toFixed(2));

    return {
      ...item,
      personalizedScore: finalPersonalizedScore,
      personalizedReason: reason,
      personalizationBoost: boost
    };
  });

  return scored.sort((a, b) => b.personalizedScore - a.personalizedScore);
}
