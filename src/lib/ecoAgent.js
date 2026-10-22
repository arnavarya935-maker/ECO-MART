import { calculateEcoScore, compareProductImpact } from './ecoScore.js';
import {
  rankProducts,
  parsePriorityIntent,
  formatPrioritiesSummary,
  DEFAULT_PRIORITIES
} from './decisionEngine.js';

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
// Category Keyword Dictionary - strictly matched using word boundaries (\b)
export const CATEGORY_KEYWORDS = {
  'Kitchen': [
    'kitchen', 'cutlery', 'bowl', 'bowls', 'cook', 'cooking', 'food', 'utensil', 'utensils',
    'cookware', 'straw', 'straws', 'mug', 'mugs', 'cups', 'cup', 'plate', 'plates',
    'container', 'containers', 'pantry', 'rasoi', 'dining', 'chopsticks', 'fork', 'forks',
    'spoon', 'spoons', 'knife', 'knives', 'pan', 'dish', 'dishes', 'रसोई', 'बर्तन', 'chamach'
  ],
  'Personal Care': [
    'personal care', 'shampoo', 'soap', 'soaps', 'toothbrush', 'toothbrushes', 'razor',
    'razors', 'toothpaste', 'floss', 'skincare', 'bath', 'bathroom', 'hygiene', 'shave',
    'shaving', 'deodorant', 'comb', 'lotion', 'brush', 'brushes', 'lip balm', 'salve',
    'neem', 'body wash', 'साबुन', 'टूथब्रश', 'sabun'
  ],
  'Fashion': [
    'fashion', 'shirt', 'shirts', 'sneaker', 'sneakers', 'shoe', 'shoes', 'sock', 'socks',
    'wear', 'clothing', 'apparel', 'tee', 't-shirt', 'tshirt', 'scarf', 'kapde', 'fabric',
    'textile', 'slippers', 'kurta', 'dress', 'कपड़े', 'जूते', 'kapda'
  ],
  'Stationery': [
    'stationery', 'notebook', 'notebooks', 'pen', 'pens', 'paper', 'papers', 'desk',
    'diary', 'diaries', 'pencil', 'pencils', 'journal', 'journals', 'notepad', 'notepads',
    'किताब', 'डायरी', 'कलम', 'kitab'
  ],
  'Home': [
    'home', 'candle', 'candles', 'tray', 'trays', 'mat', 'mats', 'decor', 'planter',
    'planters', 'cushion', 'cushions', 'bed', 'linen', 'room', 'dorm', 'hostel',
    'blanket', 'coaster', 'coasters', 'ghar', 'kamra', 'घर', 'mombatti'
  ],
  'Bags': [
    'bag', 'bags', 'tote', 'totes', 'backpack', 'backpacks', 'sack', 'sacks', 'pouch',
    'pouches', 'messenger', 'jhola', 'thaila', 'thaili', 'handbag', 'handbags', 'झोला', 'थैला', 'thela'
  ],
  'Outdoor & Travel': [
    'outdoor', 'outdoors', 'travel', 'traveling', 'travelling', 'camp', 'camping',
    'solar', 'lantern', 'lanterns', 'thermos', 'bottle', 'bottles', 'flask', 'yoga',
    'trek', 'hiking', 'commute', 'बोतल'
  ],
  'Cleaning & Laundry': [
    'cleaning', 'cleaner', 'cleaners', 'laundry', 'soapnut', 'soapnuts', 'detergent',
    'detergents', 'loofah', 'scrub', 'scrubber', 'sponge', 'sponges', 'wash', 'safai', 'सफाई'
  ]
};

// Recipient / Gift synonyms
export const RECIPIENT_KEYWORDS = [
  'sister', 'brother', 'dad', 'father', 'mother', 'mom', 'boss', 'teacher',
  'friend', 'friends', 'kid', 'kids', 'colleague', 'colleagues', 'parents',
  'partner', 'wife', 'husband', 'bhai', 'behen', 'mata', 'pita', 'dost'
];

export const GIFT_KEYWORDS = ['gift', 'gifts', 'gifting', 'present', 'presents', 'surprise', 'tohfa', 'tofa', 'uphaar', 'उपहार', 'तोहफ़ा', 'तोहफा'];

// Price sorting intent keywords (English + Hinglish + Hindi)
export const CHEAP_KEYWORDS = [
  'cheapest', 'cheaper', 'budget', 'affordable', 'sasta', 'sasti', 'saste',
  'sabse sasta', 'sabse sasti', 'lowest price', 'low price', 'economical',
  'least expensive', 'कम दाम', 'सस्ता', 'सस्ती', 'सबसे सस्ता', 'कम कीमत'
];

// Dictionary of known domain words for typo fuzzy matching (Levenshtein <= 2 on words >= 5)
export const KNOWN_DICTIONARY = [
  'toothbrush', 'shampoo', 'cutlery', 'notebook', 'detergent', 'cleaner',
  'toothpaste', 'soapnut', 'backpack', 'planter', 'candle', 'loofah',
  'bottle', 'straw', 'razor', 'lip balm', 'journal', 'cushion',
  'kitchen', 'personal care', 'stationery', 'fashion', 'cleaning',
  'outdoor', 'travel', 'bamboo', 'organic', 'copper', 'terracotta',
  'wallet', 'coasters', 'sneakers', 'blanket'
];

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'for', 'in', 'on', 'at', 'to', 'of', 'and', 'or', 'my', 'me',
  'with', 'under', 'below', 'less', 'than', 'rs', 'inr', 'rupees', 'option', 'options',
  'show', 'find', 'get', 'give', 'item', 'items', 'product', 'products', 'chahiye',
  'dikhao', 'green', 'eco', 'friendly', 'good', 'best', 'some', 'any', 'please'
]);

/**
 * Robust whole-word / word-boundary tester.
 * Prevents "open" matching "pen", "everywhere" matching "wear", "material" matching "mat", etc.
 */
export function testWordBoundary(text, keyword) {
  if (!text || !keyword) return false;
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const rx = new RegExp(`(^|[^a-zA-Z0-9\u0900-\u097F])${escaped}([^a-zA-Z0-9\u0900-\u097F]|$)`, 'i');
  return rx.test(text);
}

/**
 * Computes Levenshtein edit distance between two strings
 */
export function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const aLen = a.length;
  const bLen = b.length;
  const row = new Array(bLen + 1);
  for (let j = 0; j <= bLen; j++) row[j] = j;

  for (let i = 1; i <= aLen; i++) {
    let prev = i;
    for (let j = 1; j <= bLen; j++) {
      let val;
      if (a[i - 1] === b[j - 1]) {
        val = row[j - 1];
      } else {
        val = Math.min(row[j - 1] + 1, prev + 1, row[j] + 1);
      }
      row[j - 1] = prev;
      prev = val;
    }
    row[bLen] = prev;
  }
  return row[bLen];
}

/**
 * Parses freeform natural language text to extract intent, budget, category, and requirements.
 * Accepts optional conversation context from previous turns for multi-turn continuity.
 */
export function parseShoppingIntent(query, context = null) {
  const text = (query || '').toLowerCase().trim();

  const intent = {
    rawQuery: query,
    isCartReview: false,
    isEducational: false,
    isGoalPlanning: false,
    isWhyNot: false,
    whyNotTarget: null,
    selectIndex: null,
    maxBudget: null,
    minBudget: null,
    category: null,
    packaging: null,
    targetGrade: null,
    recipient: null,
    isGift: false,
    sortBy: null, // 'price-asc' | null
    wantsConventional: false,
    didYouMean: null,
    typoOriginal: null,
    clarification: null,
    keywords: [],
    explanation: ''
  };

  // 1. Goal-based planning detection: "dorm room", "starter kit", "student", "zero waste kit", "setup under"
  const isGoal =
    /dorm|student|starter\s+kit|setup|set\s+up|basket\s+builder|assemble\s+a\s+basket|zero\s+waste\s+(dorm|room|kit|setup)/i.test(text);
  if (isGoal) {
    intent.isGoalPlanning = true;
  }

  // 2. "Why not <product>?" follow-up detection
  const whyNotMatch = text.match(/why\s+not\s+(?:the\s+)?([a-z0-9\s-]+)/i);
  if (whyNotMatch && whyNotMatch[1]) {
    intent.isWhyNot = true;
    intent.whyNotTarget = whyNotMatch[1].trim();
  }

  // 3. Selection follow-up: "show me the second one", "second option", "first one"
  if (/second\s+(?:one|option|item)|show\s+(?:me\s+)?(?:the\s+)?second/i.test(text)) {
    intent.selectIndex = 1;
  } else if (/first\s+(?:one|option|item)|show\s+(?:me\s+)?(?:the\s+)?first/i.test(text)) {
    intent.selectIndex = 0;
  } else if (/third\s+(?:one|option|item)|show\s+(?:me\s+)?(?:the\s+)?third/i.test(text)) {
    intent.selectIndex = 2;
  }

  if (
    testWordBoundary(text, 'review my cart') ||
    testWordBoundary(text, 'cart review') ||
    testWordBoundary(text, 'analyze my cart') ||
    testWordBoundary(text, 'check cart') ||
    testWordBoundary(text, 'thela check') ||
    testWordBoundary(text, 'jhola check') ||
    testWordBoundary(text, 'review cart') ||
    testWordBoundary(text, 'thela dekho') ||
    text.includes('झोला जांचें') ||
    text.includes('टोकरी जांचें') ||
    text.includes('झोला चेक') ||
    text.includes('थेला चेक')
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

  // Budget detection (e.g., "under 1000", "below 500", "under rs 600", "under ₹1500", "under 300", "under 2000")
  const budgetMatch = text.match(/(?:under|below|less than|within|max)\s*(?:rs\.?|inr|₹)?\s*(\d+)/i) ||
                      text.match(/(\d+)\s*(?:rs|rupees|inr)?\s*budget/i);
  if (budgetMatch && budgetMatch[1]) {
    intent.maxBudget = parseInt(budgetMatch[1], 10);
  }

  // Sort by price ascending (cheapest / sasta / affordable / cheaper)
  for (const cheapKw of CHEAP_KEYWORDS) {
    if (testWordBoundary(text, cheapKw)) {
      intent.sortBy = 'price-asc';
      break;
    }
  }

  // Category detection using strict word boundaries to avoid false positives like "open" -> "pen"
  for (const [catName, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (testWordBoundary(text, kw)) {
        intent.category = catName;
        break;
      }
    }
    if (intent.category) break;
  }

  // Multi-turn context reuse
  if (context) {
    // Follow-up: "something cheaper" or "cheaper"
    if ((text.includes('cheaper') || text.includes('sasta') || text.includes('less expensive')) && !intent.category) {
      if (context.lastCategory) intent.category = context.lastCategory;
      if (context.lastResults && context.lastResults[0]?.price) {
        const topPrice = context.lastResults[0].price;
        const cheaper = context.lastResults.filter((p) => p.price < topPrice);
        if (cheaper.length > 0) {
          intent.maxBudget = Math.max(...cheaper.map((p) => p.price));
        } else {
          intent.maxBudget = context.lastBudget || topPrice;
        }
      }
    }

    // Follow-up: "now for bags" or "now for kitchen"
    if (intent.category && !intent.maxBudget && context.lastBudget) {
      intent.maxBudget = context.lastBudget;
    }

    // Follow-up: "under 500 instead"
    if (intent.maxBudget && !intent.category && context.lastCategory) {
      intent.category = context.lastCategory;
    }

    // Carry over recipient if not overridden
    if (!intent.recipient && context.lastRecipient) {
      intent.recipient = context.lastRecipient;
      intent.isGift = true;
    }
  }

  // Recipient / Gift intent
  for (const giftKw of GIFT_KEYWORDS) {
    if (testWordBoundary(text, giftKw)) {
      intent.isGift = true;
      break;
    }
  }

  for (const recKw of RECIPIENT_KEYWORDS) {
    if (testWordBoundary(text, recKw)) {
      intent.isGift = true;
      intent.recipient = recKw;
      break;
    }
  }

  // Packaging requirement: "reduce plastic", "no plastic", "plastic free", "zero plastic"
  if (
    testWordBoundary(text, 'plastic-free') ||
    testWordBoundary(text, 'plastic free') ||
    testWordBoundary(text, 'zero plastic') ||
    testWordBoundary(text, 'no plastic') ||
    testWordBoundary(text, 'reduce plastic') ||
    testWordBoundary(text, 'cut plastic')
  ) {
    intent.packaging = 'plastic-free';
  }

  // Conventional product intent: ONLY when user explicitly asks for conventional/disposable
  const wantsConventional =
    testWordBoundary(text, 'conventional') ||
    testWordBoundary(text, 'disposable') ||
    /show\s+plastic/i.test(text) ||
    /compare\s+plastic/i.test(text) ||
    /plastic\s+vs/i.test(text);
  intent.wantsConventional = wantsConventional;

  // Grade requirement
  if (text.includes('grade a') || testWordBoundary(text, 'best') || text.includes('top eco') || text.includes('greenest')) {
    intent.targetGrade = 'A';
  }

  // Clarifying questions: if query is overly vague (e.g. just "gift", "recommend something")
  const words = text.split(/\s+/).filter(Boolean);
  if (
    words.length <= 2 &&
    !intent.category &&
    !intent.maxBudget &&
    !intent.isGoalPlanning &&
    !intent.isCartReview
  ) {
    if (text === 'gift' || text === 'gifts' || text === 'present' || text === 'gifting') {
      const giftChips = [
        { label: "🎁 Under ₹500", prompt: "Eco-friendly gift under 500" },
        { label: "👩‍🏫 For Teacher", prompt: "Conscious gift for teacher under 1000" },
        { label: "🎋 For Kitchen", prompt: "Sustainable kitchen gift" },
        { label: "🌿 Self-Care", prompt: "Plastic-free personal care gift" }
      ];
      intent.clarification = {
        question: "I'd love to help pick the right conscious gift! What's your target budget or recipient?",
        options: giftChips,
        chips: giftChips
      };
    } else if (text === 'recommend' || text === 'help' || text === 'suggest' || text === 'something green') {
      const recChips = [
        { label: "🎋 Zero-Plastic Kitchen", prompt: "Plastic-free kitchen essentials" },
        { label: "🧼 Bathroom Swaps", prompt: "Plastic-free personal care items" },
        { label: "🧺 Dorm Starter Kit", prompt: "Set up a zero-plastic dorm room under 2000" },
        { label: "💰 Under ₹300", prompt: "Cheapest green option under 300" }
      ];
      intent.clarification = {
        question: "Which lifestyle area would you like to make more sustainable today?",
        options: recChips,
        chips: recChips
      };
    }
  }

  // Typo detection using Levenshtein distance on words of length >= 5
  for (const w of words) {
    if (w.length >= 5 && !STOP_WORDS.has(w) && isNaN(Number(w))) {
      const isKnown = KNOWN_DICTIONARY.includes(w) ||
        Object.values(CATEGORY_KEYWORDS).some((list) => list.includes(w));
      if (!isKnown) {
        let bestCandidate = null;
        let minDistance = 3;
        for (const dictWord of KNOWN_DICTIONARY) {
          const d = levenshtein(w, dictWord);
          if (d <= 2 && d < minDistance) {
            minDistance = d;
            bestCandidate = dictWord;
          }
        }
        if (bestCandidate) {
          intent.didYouMean = bestCandidate;
          intent.typoOriginal = w;
          break;
        }
      }
    }
  }

  return intent;
}

import { detectGreenwashing } from './ecoScore.js';

/**
 * Compares winner vs runner-up across price, lifecycle CO2, packaging, and certifications
 * to explain trade-offs transparently.
 */
export function generateTradeoffs(winner, runnerUp) {
  if (!winner || !runnerUp) return null;
  const beats = [];
  const givesUp = [];

  const scoreDiff = (winner.ecoScoreData?.score || 0) - (runnerUp.ecoScoreData?.score || 0);
  if (scoreDiff > 0) {
    beats.push(`Higher EcoScore (+${scoreDiff} pts)`);
  }
  const co2Diff = (runnerUp.carbonKg || 0) - (winner.carbonKg || 0);
  if (co2Diff > 0.05) {
    beats.push(`Lower CO2 footprint (-${co2Diff.toFixed(2)} kg CO2e)`);
  }
  if (winner.packaging === 'plastic-free' && runnerUp.packaging !== 'plastic-free') {
    beats.push('100% plastic-free packaging (vs non-zero plastic packaging)');
  }
  const certDiff = (winner.certifications?.length || 0) - (runnerUp.certifications?.length || 0);
  if (certDiff > 0) {
    beats.push(`More verified certifications (+${certDiff})`);
  }
  if (winner.price < runnerUp.price) {
    beats.push(`Costs ₹${runnerUp.price - winner.price} less`);
  } else if (winner.price > runnerUp.price) {
    givesUp.push(`Costs ₹${winner.price - runnerUp.price} more upfront than runner-up`);
  }

  if (winner.madeInKm > runnerUp.madeInKm + 200) {
    givesUp.push(`Transport distance is ${winner.madeInKm} km (vs ${runnerUp.madeInKm} km)`);
  }

  return {
    winnerName: winner.name,
    runnerUpName: runnerUp.name,
    beats: beats.length > 0 ? beats : ['Higher overall lifecycle integrity'],
    givesUp: givesUp.length > 0 ? givesUp : ['Requires slightly higher upfront investment for lifetime durability']
  };
}

/**
 * Goal-Based Planning Engine:
 * Selects an optimal multi-category basket maximizing EcoScore within a strict budget,
 * avoiding duplicate product types and calculating lifecycle savings vs conventional items.
 */
export function planBasket(goal, budget = 2000, allProducts = []) {
  const goalLower = (goal || '').toLowerCase();
  const targetBudget = Number(budget) || 2000;

  // Filter eco-friendly items
  const ecoProducts = (allProducts || []).filter((p) => p.isEcoFriendly);

  // Target categories based on goal
  let targetCategories = [];
  if (goalLower.includes('dorm') || goalLower.includes('student') || goalLower.includes('room')) {
    targetCategories = ['Home', 'Personal Care', 'Stationery', 'Kitchen', 'Bags'];
  } else if (goalLower.includes('kitchen')) {
    targetCategories = ['Kitchen', 'Cleaning & Laundry'];
  } else if (goalLower.includes('bathroom') || goalLower.includes('hygiene')) {
    targetCategories = ['Personal Care', 'Cleaning & Laundry'];
  } else {
    targetCategories = ['Kitchen', 'Personal Care', 'Home', 'Stationery', 'Bags', 'Cleaning & Laundry'];
  }

  // Pre-score items and calculate score-per-rupee
  const scoredItems = ecoProducts.map((p) => {
    const scoreData = calculateEcoScore(p);
    const score = scoreData ? scoreData.score : 80;
    const scorePerRupee = score / Math.max(p.price, 1);
    return {
      ...p,
      ecoScoreData: scoreData,
      score,
      scorePerRupee,
      greenwashing: detectGreenwashing(p)
    };
  });

  // Sort candidates by score-per-rupee descending
  scoredItems.sort((a, b) => b.scorePerRupee - a.scorePerRupee);

  const selectedItems = [];
  const selectedCategories = new Set();
  const selectedTypes = new Set();
  let currentCost = 0;

  function getItemType(item) {
    const name = item.name.toLowerCase();
    if (name.includes('toothbrush')) return 'toothbrush';
    if (name.includes('shampoo')) return 'shampoo';
    if (name.includes('razor')) return 'razor';
    if (name.includes('cutlery') || name.includes('fork') || name.includes('spoon')) return 'cutlery';
    if (name.includes('notebook') || name.includes('journal')) return 'notebook';
    if (name.includes('pen')) return 'pen';
    if (name.includes('bottle') || name.includes('thermos')) return 'bottle';
    if (name.includes('tote') || name.includes('bag')) return 'bag';
    if (name.includes('candle')) return 'candle';
    if (name.includes('scrub') || name.includes('loofah') || name.includes('sponge')) return 'scrubber';
    if (name.includes('cleaner') || name.includes('detergent') || name.includes('soapnut')) return 'detergent';
    return item.category;
  }

  // Pass 1: Ensure category diversity (pick best item per target category within budget)
  for (const cat of targetCategories) {
    const catCandidate = scoredItems.find(
      (p) => p.category === cat &&
        !selectedCategories.has(cat) &&
        !selectedTypes.has(getItemType(p)) &&
        currentCost + p.price <= targetBudget
    );
    if (catCandidate) {
      selectedItems.push(catCandidate);
      selectedCategories.add(cat);
      selectedTypes.add(getItemType(catCandidate));
      currentCost += catCandidate.price;
    }
  }

  // Pass 2: Fill remaining budget with highest score-per-rupee items without duplicate types
  for (const item of scoredItems) {
    const type = getItemType(item);
    if (!selectedTypes.has(type) && currentCost + item.price <= targetBudget) {
      selectedItems.push(item);
      selectedTypes.add(type);
      selectedCategories.add(item.category);
      currentCost += item.price;
    }
  }

  // Lifecycle savings vs conventional alternatives
  let totalCo2Saved = 0;
  let totalPlasticAvoided = 0;
  let totalWaterSaved = 0;
  let scoreSum = 0;

  const productMap = new Map((allProducts || []).map((p) => [p.id, p]));

  selectedItems.forEach((p) => {
    scoreSum += p.score;
    let baseCarbon = (p.carbonKg || 0.4) * 4;
    let basePlastic = 120;
    let baseWater = (p.waterLitres || 15) * 3;

    if (p.conventionalAlternativeId && productMap.has(p.conventionalAlternativeId)) {
      const conv = productMap.get(p.conventionalAlternativeId);
      baseCarbon = conv.carbonKg || baseCarbon;
      basePlastic = conv.plasticGrams || basePlastic;
      baseWater = conv.waterLitres || baseWater;
    }

    totalCo2Saved += Math.max(0, baseCarbon - (p.carbonKg || 0));
    totalPlasticAvoided += Math.max(0, basePlastic - (p.plasticGrams || 0));
    totalWaterSaved += Math.max(0, baseWater - (p.waterLitres || 0));
  });

  const averageEcoScore = selectedItems.length > 0 ? Math.round(scoreSum / selectedItems.length) : 0;

  return {
    type: 'basket-plan',
    goal,
    budget: targetBudget,
    totalPrice: currentCost,
    remainingBudget: targetBudget - currentCost,
    itemCount: selectedItems.length,
    items: selectedItems,
    results: selectedItems,
    count: selectedItems.length,
    averageEcoScore,
    savings: {
      co2Saved: Number(totalCo2Saved.toFixed(2)),
      plasticSaved: Math.round(totalPlasticAvoided),
      waterSaved: Math.round(totalWaterSaved)
    },
    trace: [
      { step: 'Understood goal', detail: `Goal: "${goal}" (Budget: ₹${targetBudget})` },
      { step: 'Constraints identified', detail: `Cross-category diversity across ${targetCategories.join(', ')} with no duplicate product types` },
      { step: 'Optimization model', detail: 'Knapsack greedy pass on EcoScore per Rupee with diversity constraints' },
      { step: 'Curated basket', detail: `${selectedItems.length} items across ${selectedCategories.size} categories totaling ₹${currentCost}` },
      { step: 'Impact audited', detail: `Lifecycle savings: ${totalCo2Saved.toFixed(1)}kg CO2, ${Math.round(totalPlasticAvoided)}g plastic, ${Math.round(totalWaterSaved)}L water` },
      { step: 'Decision', detail: `Assembled balanced basket leaving ₹${targetBudget - currentCost} cushion with ${averageEcoScore}/100 average EcoScore` }
    ],
    explanation: `I crafted a conscious starter kit of ${selectedItems.length} items across ${selectedCategories.size} categories for ₹${currentCost} (under your ₹${targetBudget} budget), saving ${totalCo2Saved.toFixed(1)}kg CO2e and ${Math.round(totalPlasticAvoided)}g virgin plastic!`
  };
}

/**
 * Searches and ranks products based on parsed intent, attaching transparent "Why I picked this" reasoning,
 * reasoning trace, trade-offs, and greenwashing check.
 */
export function queryEcoCatalog(allProducts, userQuery, context = null, weights = null) {
  const intent = parseShoppingIntent(userQuery, context);
  const activeWeights = weights || context?.userPriorities || DEFAULT_PRIORITIES;
  const prioritiesSummary = formatPrioritiesSummary(activeWeights);

  // 1. Clarification needed for vague queries
  if (intent.clarification) {
    return {
      type: 'clarification',
      intent,
      clarification: intent.clarification,
      results: [],
      count: 0,
      trace: [
        { step: 'Understood goal', detail: `User asked broad prompt: "${userQuery}"` },
        { step: 'Constraints identified', detail: 'Ambiguous budget and category parameters' },
        { step: 'Decision', detail: 'Prompting for single clarifying refinement instead of guessing random products' }
      ]
    };
  }

  // 2. Goal-based planning
  if (intent.isGoalPlanning) {
    return planBasket(userQuery, intent.maxBudget || 2000, allProducts);
  }

  // 3. "Why not <product>?" follow-up
  if (intent.isWhyNot && intent.whyNotTarget) {
    const targetLower = intent.whyNotTarget.toLowerCase();
    const candidate = (allProducts || []).find(
      (p) => p.name.toLowerCase().includes(targetLower) || p.id.toLowerCase().includes(targetLower)
    );
    const topPrevious = context?.lastResults?.[0];

    if (candidate && topPrevious) {
      const candScore = calculateEcoScore(candidate);
      const topScore = calculateEcoScore(topPrevious);
      const reasons = [];

      if (candidate.price > topPrevious.price) {
        reasons.push(`Costs ₹${candidate.price - topPrevious.price} more (₹${candidate.price} vs ₹${topPrevious.price})`);
      }
      if (candScore.score < topScore.score) {
        reasons.push(`Has lower EcoScore (${candScore.score}/100 vs ${topScore.score}/100)`);
      }
      if (candidate.carbonKg > topPrevious.carbonKg) {
        reasons.push(`Emits more CO2e (${candidate.carbonKg}kg vs ${topPrevious.carbonKg}kg)`);
      }
      if (candidate.packaging !== 'plastic-free' && topPrevious.packaging === 'plastic-free') {
        reasons.push('Does not offer 100% plastic-free packaging');
      }

      return {
        type: 'why-not-comparison',
        intent,
        candidate,
        topPrevious,
        reasons: reasons.length > 0 ? reasons : ['Top pick demonstrated superior material proximity and durability'],
        results: [candidate],
        count: 1,
        trace: [
          { step: 'Understood goal', detail: `User asked why "${candidate.name}" was not ranked #1` },
          { step: 'Comparative analysis', detail: `Benchmarked "${candidate.name}" against top pick "${topPrevious.name}"` },
          { step: 'Trade-off evaluated', detail: reasons.join(' • ') },
          { step: 'Decision', detail: `Kept "${topPrevious.name}" as top recommendation due to superior price-to-impact profile` }
        ]
      };
    }
  }

  // 4. Educational query
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
            "Grades: A (85-100), B (70-84), C (55-69), D (40-54), E (0-39).",
      trace: [
        { step: 'Understood goal', detail: 'Educational inquiry about the 5-pillar EcoScore formula' },
        { step: 'Information retrieved', detail: 'Material (30%), Packaging (20%), Carbon (25%), Certifications (15%), Proximity (10%)' },
        { step: 'Decision', detail: 'Displayed transparent scoring methodology breakdown' }
      ]
    };
  }

  // 5. Standard Catalog Search & Scoring
  const productsWithScore = (allProducts || []).map((p) => ({
    ...p,
    ecoScoreData: calculateEcoScore(p),
    greenwashing: detectGreenwashing(p)
  }));

  // Filter out conventional products unless explicitly requested
  let candidates = intent.wantsConventional
    ? productsWithScore
    : productsWithScore.filter((p) => p.isEcoFriendly);

  // Apply Category Filter if detected
  if (intent.category) {
    candidates = candidates.filter((p) => p.category === intent.category);
  }

  // Apply Budget Filter if specified
  if (intent.maxBudget) {
    candidates = candidates.filter((p) => p.price <= intent.maxBudget);
  }

  // Apply Packaging Filter if specified
  if (intent.packaging) {
    candidates = candidates.filter((p) => p.packaging === intent.packaging);
  }

  // Apply Grade Filter
  if (intent.targetGrade) {
    candidates = candidates.filter((p) => p.ecoScoreData.grade === intent.targetGrade);
  }

  // Extract non-stop search terms, ignoring generic descriptors, actions, and broad category locations
  const DESCRIPTOR_WORDS = new Set([
    ...CHEAP_KEYWORDS,
    ...GIFT_KEYWORDS,
    'option', 'options', 'item', 'items', 'product', 'products', 'green', 'eco',
    'sustainable', 'plastic', 'alternative', 'alternatives', 'thing', 'things',
    'sasta', 'sasti', 'chahiye', 'dikhao'
  ]);

  const ACTION_WORDS = new Set([
    'reduce', 'cut', 'avoid', 'stop', 'zero', 'free', 'without', 'replace',
    'swap', 'switch', 'need', 'want', 'buy', 'looking', 'search', 'setup',
    'set', 'use', 'using', 'starter', 'kit', 'essentials',
    'open', 'find', 'show', 'give', 'get', 'pick', 'explore', 'bring', 'suggest', 'recommend'
  ]);

  const BROAD_CATEGORY_WORDS = new Set([
    'kitchen', 'bathroom', 'bath', 'hygiene', 'room', 'dorm', 'hostel', 'home',
    'house', 'office', 'desk', 'travel', 'outdoor', 'laundry', 'pantry', 'wardrobe'
  ]);

  const queryWords = (intent.rawQuery || '').toLowerCase().match(/[a-z0-9\u0900-\u097F]+/g) || [];
  const searchTerms = queryWords.filter(
    (w) => w.length > 2 &&
      !STOP_WORDS.has(w) &&
      !DESCRIPTOR_WORDS.has(w) &&
      !ACTION_WORDS.has(w) &&
      !BROAD_CATEGORY_WORDS.has(w) &&
      isNaN(Number(w))
  );

  // Identify if user searched for a specific product noun (e.g. "shampoo", "toothbrush", "cutlery")
  const isBroadQuery = searchTerms.length === 0 || (intent.category && searchTerms.every((term) =>
    term === intent.category.toLowerCase()
  ));

  const scoredCandidates = candidates.map((p) => {
    let termMatchCount = 0;
    let termMatchScore = 0;
    const nameLower = p.name.toLowerCase();
    const descLower = (p.description || '').toLowerCase();
    const matLower = (p.material || '').toLowerCase();
    const highLower = (p.ecoHighlights || []).join(' ').toLowerCase();

    searchTerms.forEach((term) => {
      let matched = false;
      if (nameLower.includes(term)) {
        termMatchScore += 50;
        matched = true;
      }
      if (descLower.includes(term)) {
        termMatchScore += 20;
        matched = true;
      }
      if (matLower.includes(term)) {
        termMatchScore += 25;
        matched = true;
      }
      if (highLower.includes(term)) {
        termMatchScore += 15;
        matched = true;
      }
      if (matched) termMatchCount += 1;
    });

    let relevance = p.ecoScoreData.score + termMatchScore;

    // Recipient-specific relevance boost for gifts
    if (intent.recipient === 'teacher') {
      if (p.category === 'Stationery' || nameLower.includes('journal') || nameLower.includes('candle')) {
        relevance += 40;
      }
    } else if (intent.isGift) {
      if (p.category === 'Stationery' || p.category === 'Home' || nameLower.includes('set') || nameLower.includes('kit')) {
        relevance += 25;
      }
    }

    // Build transparent reasoning
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
      termMatchScore,
      termMatchCount,
      reasoning: reasons.join(' • ')
    };
  });

  // Relevance threshold filtering:
  // If specific search terms were provided and it's not a broad query,
  // do NOT include candidates that had 0 term matches (e.g. shampoo should not return razor or toothbrush)!
  let filteredResults = scoredCandidates;
  if (searchTerms.length > 0 && !isBroadQuery) {
    const strictlyMatching = scoredCandidates.filter((p) => p.termMatchScore > 0);
    if (strictlyMatching.length > 0) {
      filteredResults = strictlyMatching;
    } else if (intent.didYouMean) {
      filteredResults = [];
    } else {
      filteredResults = [];
    }
  }

  // Sort results:
  if (intent.sortBy === 'price-asc') {
    filteredResults.sort((a, b) => {
      if (a.price !== b.price) {
        return a.price - b.price;
      }
      return b.relevanceScore - a.relevanceScore;
    });
  } else if (filteredResults.length > 0) {
    filteredResults = rankProducts(filteredResults, activeWeights);
  }

  // If follow-up asked for specific index (e.g. "show me the second one")
  let topResults = filteredResults.slice(0, 4);
  if (intent.selectIndex !== null && filteredResults[intent.selectIndex]) {
    topResults = [filteredResults[intent.selectIndex], ...filteredResults.filter((_, i) => i !== intent.selectIndex).slice(0, 3)];
  }

  // Trade-offs calculation between winner and runner-up
  const tradeoffs = topResults.length >= 2 ? generateTradeoffs(topResults[0], topResults[1]) : null;

  // Reasoning trace array
  const trace = [
    {
      step: 'Understood goal',
      detail: intent.explanation ||
        (intent.isGift
          ? `Searching gift recommendations${intent.recipient ? ` for ${intent.recipient}` : ''}`
          : intent.category
            ? `Filter conscious catalog for category: ${intent.category}`
            : `Search across catalog for "${userQuery}"`)
    },
    {
      step: 'Constraints identified',
      detail: [
        intent.category ? `Category: ${intent.category}` : 'All categories',
        intent.maxBudget ? `Budget <= ₹${intent.maxBudget}` : null,
        intent.packaging ? 'Packaging: 100% plastic-free' : null,
        intent.sortBy === 'price-asc' ? 'Sort: Lowest price first' : 'Sort: Priority-weighted MCDM'
      ].filter(Boolean).join(' • ')
    },
    {
      step: 'Priorities applied',
      detail: prioritiesSummary
    },
    {
      step: 'Candidates matched',
      detail: `Evaluated ${candidates.length} products; filtered ${filteredResults.length} relevant candidate(s)`
    },
    {
      step: 'Scored & Ranked',
      detail: intent.sortBy === 'price-asc'
        ? 'Ranked strictly by price ascending with verified eco-score guarantee'
        : 'Ranked by 5-pillar EcoScore + query keyword relevance'
    }
  ];

  if (tradeoffs) {
    trace.push({
      step: 'Trade-offs evaluated',
      detail: `Winner "${tradeoffs.winnerName}" vs Runner-up "${tradeoffs.runnerUpName}": ${tradeoffs.beats.slice(0, 2).join('; ')}`
    });
  }

  if (topResults.length > 0) {
    trace.push({
      step: 'Decision',
      detail: `Selected ${topResults[0].name} (₹${topResults[0].price}, EcoScore: ${topResults[0].ecoScoreData.score}/100)`
    });
  } else if (intent.didYouMean) {
    trace.push({
      step: 'Decision',
      detail: `No exact matches; detected likely typo and suggested "${intent.didYouMean}"`
    });
  } else {
    trace.push({
      step: 'Decision',
      detail: 'No products satisfied all constraints; invited category exploration without fake padding'
    });
  }

  return {
    type: 'search-results',
    intent,
    didYouMean: intent.didYouMean,
    tradeoffs,
    trace,
    results: topResults,
    count: topResults.length,
    prioritiesSummary
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
export async function sendAgentQuery(arg1, arg2, arg3, arg4) {
  let query;
  let cartItems = [];
  let allProducts = [];
  let context = null;

  if (typeof arg1 === 'object' && arg1 !== null && 'query' in arg1) {
    query = arg1.query;
    cartItems = arg1.cartItems || [];
    allProducts = arg1.allProducts || [];
    context = arg1.context || null;
  } else {
    query = arg1;
    allProducts = arg2 || [];
    cartItems = arg3 || [];
    context = arg4 || null;
  }

  // Check if user is requesting a priority adjustment (e.g. "I care most about price", "plastic matters more", "lowest carbon")
  const priorityAdjustment = parsePriorityIntent(query, context?.userPriorities);
  if (priorityAdjustment) {
    const summary = formatPrioritiesSummary(priorityAdjustment);
    const ecoCandidates = (allProducts || []).filter((p) => p.isEcoFriendly);
    const ranked = rankProducts(ecoCandidates, priorityAdjustment);
    const topPicks = ranked.slice(0, 4);
    const tradeoffs = topPicks.length >= 2 ? generateTradeoffs(topPicks[0], topPicks[1]) : null;

    return {
      source: 'local-rule-engine',
      newPriorities: priorityAdjustment,
      message: `${summary}.\n\nI have adjusted your active decision weights. Here are your top recommendations:`,
      data: topPicks,
      analysis: {
        results: topPicks,
        count: topPicks.length,
        prioritiesSummary: summary
      },
      tradeoffs,
      trace: [
        { step: 'Understood goal', detail: `User updated decision priority: "${query}"` },
        { step: 'Weights updated', detail: summary },
        { step: 'Scored & Ranked', detail: `Evaluated ${ranked.length} eco items with updated multi-criteria weights` },
        { step: 'Decision', detail: `Ranked #${1} ${topPicks[0]?.name || ''} as best match for your new priorities` }
      ],
      basketPlan: null,
      clarification: null,
      didYouMean: null,
      cartReview: null
    };
  }

  const qLower = (query || '').toLowerCase();
  if (qLower.includes('eco check') || qLower.includes('check product') || qLower.includes('analyze product') || qLower.includes('external product')) {
    return {
      source: 'local-rule-engine',
      message: "You can evaluate any outside purchase with our on-device Eco Check analyzer! Paste any product description, material list, or packaging claims to audit greenwashing and discover verified alternatives:\n\n👉 Navigate to 'Eco Check' in the top navigation or visit /eco-check directly.",
      data: (allProducts || []).filter((p) => p.isEcoFriendly).slice(0, 3),
      analysis: null,
      tradeoffs: null,
      trace: [
        { step: 'Understood goal', detail: 'Inquiry about external product greenwashing analysis' },
        { step: 'Feature routed', detail: 'Directed user to Eco Check Any Product tool (/eco-check)' }
      ],
      basketPlan: null,
      clarification: null,
      didYouMean: null,
      cartReview: null
    };
  }

  const intent = parseShoppingIntent(query, context);
  const localResponse = queryEcoCatalog(allProducts, query, context);

  let cartReviewData = null;
  if (intent.isCartReview) {
    cartReviewData = auditCartSustainability(cartItems, allProducts);
  }

  // Attempt optional LLM enhancement behind try/catch with contract { query, context }
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800);

    const res = await fetch('/api/agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        context: {
          intent,
          lastCategory: context?.lastCategory,
          lastBudget: context?.lastBudget,
          searchResultsCount: localResponse.results ? localResponse.results.length : 0,
          cartReview: cartReviewData
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.reply && data.source === 'cloud-llm') {
        return {
          source: 'cloud-llm',
          message: data.reply,
          data: localResponse.results || [],
          analysis: localResponse,
          tradeoffs: localResponse.tradeoffs,
          trace: localResponse.trace || [],
          basketPlan: localResponse.type === 'basket-plan' ? localResponse : null,
          clarification: localResponse.clarification || null,
          didYouMean: localResponse.didYouMean,
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
  } else if (localResponse.type === 'clarification' && localResponse.clarification) {
    friendlyMessage = localResponse.clarification.question;
  } else if (localResponse.type === 'basket-plan') {
    friendlyMessage = localResponse.explanation;
  } else if (localResponse.type === 'why-not-comparison') {
    friendlyMessage = `Here is why "${localResponse.candidate.name}" wasn't chosen as #1 compared to "${localResponse.topPrevious.name}":\n• ${localResponse.reasons.join('\n• ')}`;
  } else if (intent.isCartReview) {
    if (!cartReviewData || cartReviewData.itemCount === 0) {
      friendlyMessage = "Your cart is empty! Pick items from the shop, and I'll analyze their lifecycle impact.";
    } else if (cartReviewData.lowGradeCount === 0) {
      friendlyMessage = `🌟 Fantastic job! All ${cartReviewData.itemCount} items in your cart are sustainably rated (Average Eco-Score: ${cartReviewData.averageScore}/100). No swaps needed!`;
    } else {
      friendlyMessage = `I reviewed your cart (Avg Eco-Score: ${cartReviewData.averageScore}/100). Found ${cartReviewData.lowGradeCount} conventional item(s) with high plastic or carbon impact. Here are greener alternatives to boost your score:`;
    }
  } else if (localResponse.didYouMean) {
    friendlyMessage = `I couldn't find an exact match for "${intent.typoOriginal || query}". Did you mean "${localResponse.didYouMean}"?`;
  } else if (localResponse.results && localResponse.results.length > 0) {
    const filters = [];
    if (intent.category) filters.push(`in ${intent.category}`);
    if (intent.maxBudget) filters.push(`under ₹${intent.maxBudget}`);
    if (intent.packaging) filters.push('100% plastic-free');
    if (intent.sortBy === 'price-asc') filters.push('lowest price first');
    const filterDesc = filters.length > 0 ? ` (${filters.join(', ')})` : '';
    const priorityLead = localResponse.prioritiesSummary ? `${localResponse.prioritiesSummary}.\n\n` : '';
    friendlyMessage = `${priorityLead}Here are ${localResponse.results.length} top-rated sustainable recommendations matching "${query}"${filterDesc}:`;
  } else {
    friendlyMessage = `I couldn't find an exact match for "${query}". Try searching for categories like "Kitchen", "Personal Care", "Bags" or terms like "plastic-free under 500".`;
  }

  return {
    source: 'local-rule-engine',
    message: friendlyMessage,
    data: localResponse.results || [],
    analysis: localResponse,
    tradeoffs: localResponse.tradeoffs,
    trace: localResponse.trace || [],
    basketPlan: localResponse.type === 'basket-plan' ? localResponse : null,
    clarification: localResponse.clarification || null,
    didYouMean: localResponse.didYouMean,
    cartReview: cartReviewData
  };
}
