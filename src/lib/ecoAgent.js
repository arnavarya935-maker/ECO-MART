import { calculateEcoScore, compareProductImpact } from './ecoScore.js';

/**
 * Eco Agent Local Intelligence Engine
 * Provides offline natural-language parsing, swap suggestions, cart analysis,
 * and transparent reasoning with optional LLM augmentation.
 */

// Preset quick query chips for the user interface
export const AGENT_QUICK_ACTIONS = [
  { id: 'gift', label: '🎁 Find a gift', prompt: 'Find an eco-friendly gift under ₹1000' },
  { id: 'kitchen', label: '🎋 Plastic-free kitchen', prompt: 'Show plastic-free items for my kitchen' },
  { id: 'cart-review', label: '🛒 Review my cart', prompt: 'Review my cart and suggest greener swaps' },
  { id: 'cheapest-green', label: '💰 Cheapest green option', prompt: 'Show cheapest green option under 300' },
  { id: 'grade-a', label: '⭐ Top Grade A Picks', prompt: 'Show me the highest eco-score products' },
  { id: 'how-scoring-works', label: '🔬 How EcoScore works', prompt: 'Explain how the eco score is calculated' }
];

/**
 * Parses freeform natural language text to extract intent, budget, category, and requirements.
 */
export function parseShoppingIntent(query) {
  const text = (query || '').toLowerCase().trim();

  const intent = {
    rawQuery: query,
    isCartReview: false,
    isEducational: false,
    maxBudget: null,
    minBudget: null,
    category: null,
    packaging: null,
    targetGrade: null,
    recipient: null,
    keywords: [],
    explanation: ''
  };

  if (
    text.includes('review my cart') ||
    text.includes('cart review') ||
    text.includes('analyze my cart') ||
    text.includes('check cart')
  ) {
    intent.isCartReview = true;
    intent.explanation = 'Analyzing your current cart items for sustainability opportunities';
    return intent;
  }

  if (
    text.includes('how is score') ||
    text.includes('how does eco score') ||
    text.includes('how scoring works') ||
    text.includes('how agent works') ||
    text.includes('explain score')
  ) {
    intent.isEducational = true;
    intent.explanation = 'Explaining the 5-pillar Eco-Score calculation formula';
    return intent;
  }

  // Budget detection (e.g., "under 1000", "below 500", "under rs 600", "under ₹1500")
  const budgetMatch = text.match(/(?:under|below|less than|within|max)\s*(?:rs\.?|inr|₹)?\s*(\d+)/i) ||
                      text.match(/(\d+)\s*(?:rs|rupees|inr)?\s*budget/i);
  if (budgetMatch && budgetMatch[1]) {
    intent.maxBudget = parseInt(budgetMatch[1], 10);
  }

  // Category detection
  if (text.includes('kitchen') || text.includes('cutlery') || text.includes('bowl') || text.includes('cook') || text.includes('food')) {
    intent.category = 'Kitchen';
  } else if (text.includes('personal care') || text.includes('shampoo') || text.includes('toothbrush') || text.includes('razor') || text.includes('soap')) {
    intent.category = 'Personal Care';
  } else if (text.includes('fashion') || text.includes('shirt') || text.includes('sneaker') || text.includes('shoe') || text.includes('sock') || text.includes('wear') || text.includes('cloth')) {
    intent.category = 'Fashion';
  } else if (text.includes('stationery') || text.includes('notebook') || text.includes('pen') || text.includes('paper') || text.includes('desk') || text.includes('diary')) {
    intent.category = 'Stationery';
  } else if (text.includes('home') || text.includes('candle') || text.includes('tray') || text.includes('mat') || text.includes('decor') || text.includes('planter')) {
    intent.category = 'Home';
  } else if (text.includes('bag') || text.includes('tote') || text.includes('backpack') || text.includes('sack') || text.includes('pouch') || text.includes('messenger')) {
    intent.category = 'Bags';
  } else if (text.includes('outdoor') || text.includes('travel') || text.includes('camp') || text.includes('solar') || text.includes('lantern') || text.includes('thermos') || text.includes('yoga')) {
    intent.category = 'Outdoor & Travel';
  } else if (text.includes('cleaning') || text.includes('laundry') || text.includes('soapnut') || text.includes('detergent') || text.includes('loofah') || text.includes('scrub') || text.includes('sponge')) {
    intent.category = 'Cleaning & Laundry';
  }

  // Recipient / Gift intent
  if (text.includes('gift') || text.includes('present') || text.includes('teacher') || text.includes('friend') || text.includes('mom') || text.includes('colleague')) {
    intent.isGift = true;
    if (text.includes('teacher')) intent.recipient = 'teacher';
    else if (text.includes('colleague') || text.includes('office')) intent.recipient = 'colleague';
  }

  // Packaging requirement
  if (text.includes('plastic-free') || text.includes('plastic free') || text.includes('zero plastic') || text.includes('no plastic')) {
    intent.packaging = 'plastic-free';
  }

  // Grade requirement
  if (text.includes('grade a') || text.includes('best') || text.includes('top eco') || text.includes('greenest') || text.includes('highest')) {
    intent.targetGrade = 'A';
  }

  return intent;
}

/**
 * Searches and ranks products based on parsed intent, attaching transparent "Why I picked this" reasoning.
 */
export function queryEcoCatalog(allProducts, userQuery) {
  const intent = parseShoppingIntent(userQuery);

  if (intent.isEducational) {
    return {
      type: 'educational',
      intent,
      text: "The EcoMart Eco-Score is an open formula evaluated out of 100 points:\n" +
            "1. Material Integrity (30 pts): Organic, upcycled, and natural materials score highest.\n" +
            "2. Plastic-Free Packaging (20 pts): 100% plastic-free & seed paper get full marks.\n" +
            "3. Carbon Footprint (25 pts): Cradle-to-gate lifecycle CO2 emissions.\n" +
            "4. Certifications (15 pts): GOTS Organic, FSC, Fair Trade, Zero Waste standards.\n" +
            "5. Sourcing Proximity (10 pts): Hyperlocal regional craft reduces transport mileage.\n\n" +
            "Grades: A (85-100), B (70-84), C (55-69), D (40-54), E (0-39)."
    };
  }

  let candidates = (allProducts || []).map((p) => {
    const scoreData = calculateEcoScore(p);
    return {
      ...p,
      ecoScoreData: scoreData
    };
  });

  // Filter out pure conventional products unless specifically searched
  if (!intent.rawQuery.toLowerCase().includes('conventional') && !intent.rawQuery.toLowerCase().includes('plastic')) {
    candidates = candidates.filter((p) => p.isEcoFriendly);
  }

  // Apply Category Filter
  if (intent.category) {
    candidates = candidates.filter((p) => p.category === intent.category);
  }

  // Apply Budget Filter
  if (intent.maxBudget) {
    candidates = candidates.filter((p) => p.price <= intent.maxBudget);
  }

  // Apply Packaging Filter
  if (intent.packaging) {
    candidates = candidates.filter((p) => p.packaging === intent.packaging);
  }

  // Apply Grade Filter
  if (intent.targetGrade) {
    candidates = candidates.filter((p) => p.ecoScoreData.grade === intent.targetGrade);
  }

  // Keyword match boosting
  const terms = (intent.rawQuery || '').toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  const scoredCandidates = candidates.map((p) => {
    let relevance = p.ecoScoreData.score; // Base relevance = eco-score
    let matchedTerms = [];

    terms.forEach((term) => {
      if (p.name.toLowerCase().includes(term)) {
        relevance += 25;
        matchedTerms.push(`name match '${term}'`);
      }
      if (p.description.toLowerCase().includes(term)) {
        relevance += 15;
        matchedTerms.push(`description match '${term}'`);
      }
      if (p.material.toLowerCase().includes(term)) {
        relevance += 20;
        matchedTerms.push(`material match '${term}'`);
      }
    });

    // Special logic for gifts for teacher
    if (intent.recipient === 'teacher') {
      if (p.category === 'Stationery' || p.name.includes('Journal') || p.name.includes('Candle')) {
        relevance += 40;
      }
    }

    // Build transparent "Why I picked this" reasoning
    const reasons = [];
    reasons.push(`Eco-Score: ${p.ecoScoreData.score}/100 (Grade ${p.ecoScoreData.grade})`);
    if (p.packaging === 'plastic-free') reasons.push('100% plastic-free packaging');
    if (p.certifications && p.certifications.length > 0) reasons.push(`${p.certifications.slice(0, 2).join(' & ')} verified`);
    if (p.carbonKg <= 0.5) reasons.push(`Ultra-low footprint of only ${p.carbonKg}kg CO2`);
    if (p.madeInKm <= 150) reasons.push(`Locally produced (${p.madeInKm} km away)`);
    if (intent.maxBudget && p.price <= intent.maxBudget) reasons.push(`Fits budget at ₹${p.price}`);

    return {
      ...p,
      relevanceScore: relevance,
      reasoning: reasons.join(' • ')
    };
  });

  // Sort by highest relevance
  scoredCandidates.sort((a, b) => b.relevanceScore - a.relevanceScore);

  const topResults = scoredCandidates.slice(0, 4);

  return {
    type: 'search-results',
    intent,
    results: topResults,
    count: topResults.length
  };
}

/**
 * Finds greener swap suggestion for a specific item (e.g. when added to cart).
 */
export function getSwapSuggestion(itemOrProduct, allProducts) {
  if (!itemOrProduct) return null;
  const product = itemOrProduct.product || itemOrProduct;

  const productMap = new Map((allProducts || []).map((p) => [p.id, p]));

  // Direct alternative mapping
  if (!product.isEcoFriendly && product.conventionalAlternativeId) {
    const greener = productMap.get(product.conventionalAlternativeId);
    if (greener) {
      return compareProductImpact(greener, product);
    }
  }

  // If item is Grade C or lower, look for highest grade item in same category
  const currentScore = calculateEcoScore(product);
  if (currentScore && currentScore.score < 70) {
    const categoryAlternatives = (allProducts || [])
      .filter((p) => p.category === product.category && p.isEcoFriendly && p.id !== product.id)
      .map((p) => ({ product: p, score: calculateEcoScore(p).score }))
      .sort((a, b) => b.score - a.score);

    if (categoryAlternatives.length > 0 && categoryAlternatives[0].score > currentScore.score) {
      return compareProductImpact(categoryAlternatives[0].product, product);
    }
  }

  return null;
}

/**
 * Performs a comprehensive cart sustainability audit.
 */
export function auditCartSustainability(cartItems, allProducts) {
  if (!cartItems || cartItems.length === 0) {
    return {
      summary: 'Your cart is currently empty! Add conscious goods to see your impact calculation.',
      worstItems: [],
      suggestions: []
    };
  }

  const itemsScored = cartItems.map((item) => {
    const p = item.product || item;
    const score = calculateEcoScore(p);
    return {
      cartItem: item,
      product: p,
      score: score.score,
      grade: score.grade,
      scoreData: score
    };
  });

  // Sort worst first
  itemsScored.sort((a, b) => a.score - b.score);

  // Worst offenders (Grade C, D, or E)
  const lowGradeItems = itemsScored.filter((item) => item.score < 70);

  // Top suggestions for swaps
  const suggestions = [];
  lowGradeItems.slice(0, 3).forEach((item) => {
    const swap = getSwapSuggestion(item.product, allProducts);
    if (swap) {
      suggestions.push({
        from: item.product,
        to: swap.greenerProduct,
        impact: swap,
        reason: `Upgrading from Grade ${item.grade} to Grade ${swap.greenScore.grade} saves ${swap.co2Saved}kg CO2 & ${swap.plasticSaved}g plastic`
      });
    }
  });

  const avgScore = Math.round(
    itemsScored.reduce((sum, i) => sum + i.score * (i.cartItem.quantity || 1), 0) /
    itemsScored.reduce((sum, i) => sum + (i.cartItem.quantity || 1), 0)
  );

  return {
    itemCount: cartItems.length,
    averageScore: avgScore,
    lowGradeCount: lowGradeItems.length,
    suggestions,
    worstItems: lowGradeItems.map((i) => i.product)
  };
}

/**
 * Dispatch agent message with optional remote LLM fallback.
 * Will try fetch('/api/agent', ...) with 1.8s timeout, falling back cleanly to local intelligence.
 */
export async function sendAgentQuery({ query, cartItems, allProducts }) {
  const localResponse = queryEcoCatalog(allProducts, query);

  // Check if intent is cart review
  const intent = parseShoppingIntent(query);
  let cartReviewData = null;
  if (intent.isCartReview) {
    cartReviewData = auditCartSustainability(cartItems, allProducts);
  }

  // Attempt optional LLM enhancement behind try/catch
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800);

    const res = await fetch('/api/agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        localAnalysis: {
          intent,
          searchResultsCount: localResponse.results ? localResponse.results.length : 0,
          cartReview: cartReviewData
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.reply) {
        return {
          source: 'llm',
          message: data.reply,
          data: localResponse,
          cartReview: cartReviewData
        };
      }
    }
  } catch {
    // Graceful offline fallback - expected behavior for static / offline deployments
  }

  // Local Rule-Based Template Generation
  let friendlyMessage = '';

  if (intent.isEducational) {
    friendlyMessage = localResponse.text;
  } else if (intent.isCartReview) {
    if (!cartReviewData || cartReviewData.itemCount === 0) {
      friendlyMessage = "Your cart is empty! Pick items from the shop, and I'll analyze their lifecycle impact.";
    } else if (cartReviewData.lowGradeCount === 0) {
      friendlyMessage = `🌟 Fantastic job! All ${cartReviewData.itemCount} items in your cart are sustainably rated (Average Eco-Score: ${cartReviewData.averageScore}/100). No swaps needed!`;
    } else {
      friendlyMessage = `I reviewed your cart (Avg Eco-Score: ${cartReviewData.averageScore}/100). Found ${cartReviewData.lowGradeCount} conventional item(s) with high plastic or carbon impact. Here are greener alternatives to boost your score:`;
    }
  } else if (localResponse.results && localResponse.results.length > 0) {
    const filters = [];
    if (intent.category) filters.push(`in ${intent.category}`);
    if (intent.maxBudget) filters.push(`under ₹${intent.maxBudget}`);
    if (intent.packaging) filters.push('100% plastic-free');
    const filterDesc = filters.length > 0 ? ` (${filters.join(', ')})` : '';

    friendlyMessage = `Here are ${localResponse.results.length} top-rated sustainable recommendations matching "${query}"${filterDesc}:`;
  } else {
    friendlyMessage = `I couldn't find an exact match for "${query}". Try searching for categories like "Kitchen", "Personal Care", "Bags" or terms like "plastic-free under 500".`;
  }

  return {
    source: 'local-rule-engine',
    message: friendlyMessage,
    data: localResponse,
    cartReview: cartReviewData
  };
}
