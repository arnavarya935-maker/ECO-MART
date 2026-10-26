import { calculateEcoScore, compareProductImpact, detectGreenwashing } from './ecoScore.js';
import {
  rankProducts,
  parsePriorityIntent,
  formatPrioritiesSummary,
  DEFAULT_PRIORITIES
} from './decisionEngine.js';

/**
 * Eco Agent Local Intelligence Engine
 * Provides offline natural-language parsing, swap suggestions, cart analysis,
 * goal-based basket planning, and transparent multi-criteria reasoning.
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

// Category Keyword Dictionary - strictly matched using word boundaries (\b)
export const CATEGORY_KEYWORDS = {
  'Kitchen': [
    'kitchen', 'cutlery', 'bowl', 'bowls', 'cook', 'cooking', 'food', 'utensil', 'utensils',
    'cookware', 'straw', 'straws', 'mug', 'mugs', 'cups', 'cup', 'plate', 'plates',
    'container', 'containers', 'pantry', 'rasoi', 'dining', 'chopsticks', 'fork', 'forks',
    'spoon', 'spoons', 'knife', 'knives', 'pan', 'pans', 'dish', 'dishes', 'wrap', 'wraps',
    'beeswax', 'copper bottle', 'रसोई', 'बर्तन', 'chamach'
  ],
  'Personal Care': [
    'personal care', 'shampoo', 'shampoos', 'soap', 'soaps', 'toothbrush', 'toothbrushes',
    'razor', 'razors', 'toothpaste', 'floss', 'skincare', 'bath', 'bathroom', 'hygiene',
    'shave', 'shaving', 'deodorant', 'comb', 'combs', 'lotion', 'brush', 'brushes',
    'lip balm', 'balm', 'balms', 'salve', 'neem', 'body wash', 'साबुन', 'टूथब्रश', 'sabun'
  ],
  'Fashion': [
    'fashion', 'shirt', 'shirts', 'sneaker', 'sneakers', 'shoe', 'shoes', 'sock', 'socks',
    'wear', 'clothing', 'apparel', 'tee', 't-shirt', 'tshirt', 'scarf', 'scarves', 'stole',
    'stoles', 'kapde', 'fabric', 'textile', 'slippers', 'kurta', 'dress', 'कपड़े', 'जूते', 'kapda'
  ],
  'Stationery': [
    'stationery', 'notebook', 'notebooks', 'pen', 'pens', 'paper', 'papers', 'desk',
    'diary', 'diaries', 'pencil', 'pencils', 'journal', 'journals', 'notepad', 'notepads',
    'tidy', 'stand', 'organizer', 'bullet journal', 'किताब', 'डायरी', 'कलम', 'kitab'
  ],
  'Home': [
    'home', 'candle', 'candles', 'tray', 'trays', 'mat', 'mats', 'doormat', 'doormats',
    'decor', 'planter', 'planters', 'pot', 'pots', 'cushion', 'cushions', 'bed', 'linen',
    'room', 'dorm', 'hostel', 'coaster', 'coasters', 'ghar', 'kamra',
    'घर', 'mombatti'
  ],
  'Bags': [
    'bag', 'bags', 'tote', 'totes', 'backpack', 'backpacks', 'sack', 'sacks', 'pouch',
    'pouches', 'duffel', 'duffels', 'messenger', 'jhola', 'thaila', 'thaili', 'handbag',
    'handbags', 'झोला', 'थैला', 'thela'
  ],
  'Outdoor & Travel': [
    'outdoor', 'outdoors', 'travel', 'traveling', 'travelling', 'camp', 'camping',
    'solar', 'lantern', 'lanterns', 'thermos', 'thermoses', 'bottle', 'bottles', 'flask',
    'flasks', 'yoga', 'trek', 'hiking', 'commute', 'blanket', 'blankets', 'picnic', 'picnic blanket', 'yoga mat', 'बोतल'
  ],
  'Cleaning & Laundry': [
    'cleaning', 'cleaner', 'cleaners', 'laundry', 'soapnut', 'soapnuts', 'detergent',
    'detergents', 'loofah', 'loofahs', 'scrub', 'scrubber', 'scrubbers', 'sponge',
    'sponges', 'wash', 'safai', 'सफाई', 'toilet brush', 'brush', 'brushes'
  ]
};

// Recipient / Gift synonyms
export const RECIPIENT_KEYWORDS = [
  'sister', 'brother', 'dad', 'father', 'mother', 'mom', 'boss', 'teacher',
  'friend', 'friends', 'kid', 'kids', 'colleague', 'colleagues', 'parents',
  'partner', 'wife', 'husband', 'bhai', 'behen', 'mata', 'pita', 'dost'
];

export const GIFT_KEYWORDS = [
  'gift', 'gifts', 'gifting', 'present', 'presents', 'surprise',
  'tohfa', 'tofa', 'uphaar', 'उपहार', 'तोहफ़ा', 'तोहफा'
];

// Price sorting intent keywords (English + Hinglish + Hindi)
export const CHEAP_KEYWORDS = [
  'cheapest', 'cheaper', 'budget', 'affordable', 'sasta', 'sasti', 'saste',
  'sabse sasta', 'sabse sasti', 'lowest price', 'low price', 'economical',
  'least expensive', 'कम दाम', 'सस्ता', 'सस्ती', 'सबसे सस्ता', 'कम कीमत'
];

// Catalogue domain dictionary for typo checking (real domain words only)
export const KNOWN_DICTIONARY = [
  'toothbrush', 'toothbrushes', 'shampoo', 'shampoos', 'cutlery', 'notebook', 'notebooks',
  'journal', 'journals', 'diary', 'diaries', 'candle', 'candles', 'bottle', 'bottles',
  'thermos', 'straw', 'straws', 'razor', 'razors', 'lip balm', 'balm', 'sneakers', 'sneaker',
  'shoe', 'shoes', 'sock', 'socks', 'shirt', 'shirts', 'tote', 'totes', 'pouch', 'pouches',
  'bag', 'bags', 'backpack', 'backpacks', 'duffel', 'duffels', 'tray', 'trays', 'mat', 'mats',
  'doormat', 'planter', 'planters', 'cushion', 'cushions', 'blanket', 'blankets', 'soapnut',
  'soapnuts', 'detergent', 'detergents', 'cleaner', 'cleaners', 'loofah', 'loofahs',
  'scrubber', 'scrubbers', 'soap', 'soaps', 'pen', 'pens', 'pencil', 'pencils', 'bowl',
  'bowls', 'plate', 'plates', 'cup', 'cups', 'mug', 'mugs', 'spoon', 'spoons', 'fork', 'forks',
  'knife', 'knives', 'lantern', 'lanterns', 'wrap', 'wraps', 'stole', 'stoles', 'scarf',
  'bamboo', 'copper', 'terracotta', 'cotton', 'jute', 'coir', 'teak', 'neem', 'khadi', 'hemp',
  'kitchen', 'personal care', 'stationery', 'fashion', 'cleaning', 'outdoor', 'home'
];

// Stop words to ignore during search term extraction & typo correction
export const STOP_WORDS = new Set([
  'a', 'an', 'the', 'for', 'in', 'on', 'at', 'to', 'of', 'and', 'or', 'my', 'me',
  'with', 'under', 'below', 'less', 'than', 'rs', 'inr', 'rupees', 'option', 'options',
  'show', 'find', 'get', 'give', 'item', 'items', 'product', 'products', 'chahiye',
  'dikhao', 'green', 'eco', 'friendly', 'good', 'best', 'nice', 'some', 'any', 'please',
  'now', 'instead', 'want', 'need', 'i', 'thing', 'things', 'something', 'one', 'ones',
  'like', 'looking', 'look', 'search', 'buy', 'shop', 'explore', 'about', 'most',
  'take', 'bring', 'suggest', 'recommend', 'could', 'would', 'can', 'tell', 'make',
  'already', 'more', 'also', 'just', 'all'
]);

// Protected words that must NEVER be treated as typos or corrected to unrelated words
const PROTECTED_TYPO_WORDS = new Set([
  'basket', 'kit', 'bundle', 'starter', 'combo', 'essentials', 'setup', 'set',
  'cheaper', 'cheapest', 'greener', 'greenest', 'instead', 'now', 'second',
  'first', 'third', 'dorm', 'room', 'cleaner', 'cleaners',
  ...STOP_WORDS,
  ...RECIPIENT_KEYWORDS,
  ...GIFT_KEYWORDS,
  ...CHEAP_KEYWORDS
]);

// Common domain synonyms mapping terms to catalogue words
export const SYNONYM_MAP = {
  shoe: ['sneaker', 'sneakers', 'shoes', 'footwear'],
  shoes: ['sneaker', 'sneakers', 'shoe', 'footwear'],
  sneaker: ['shoe', 'shoes', 'footwear'],
  sneakers: ['shoe', 'shoes', 'footwear'],
  notebook: ['journal', 'diary', 'notepad'],
  notebooks: ['journal', 'journals', 'diary', 'diaries', 'notepad'],
  journal: ['notebook', 'diary'],
  journals: ['notebooks', 'diaries'],
  diary: ['journal', 'notebook'],
  diaries: ['journals', 'notebooks'],
  candle: ['candles', 'mombatti', 'decor'],
  candles: ['candle', 'mombatti', 'decor'],
  bottle: ['thermos', 'flask', 'bottles'],
  bottles: ['bottle', 'thermos', 'flasks'],
  pen: ['pencil', 'pens', 'pencils'],
  pens: ['pen', 'pencil', 'pencils'],
  tote: ['bag', 'bags', 'totes'],
  totes: ['tote', 'bag', 'bags'],
  bag: ['tote', 'backpack', 'duffel', 'sack', 'pouch'],
  bags: ['tote', 'totes', 'backpack', 'backpacks', 'duffel', 'pouch', 'pouches'],
  loofah: ['scrubber', 'scrub', 'sponge'],
  loofahs: ['scrubber', 'scrubbers', 'sponges'],
  scrubber: ['loofah', 'sponge'],
  scrubbers: ['loofah', 'loofahs', 'sponges'],
  cleaner: ['detergent', 'soapnut', 'tabs'],
  cleaners: ['detergent', 'detergents', 'soapnuts', 'tabs']
};

/**
 * Normalises plural/singular forms, irregular nouns, and word variations
 */
export function normalizeWord(word) {
  if (!word || typeof word !== 'string') return '';
  const w = word.toLowerCase().trim();
  if (w.length <= 2) return w;

  const irregulars = {
    knives: 'knife',
    teeth: 'tooth',
    feet: 'foot',
    children: 'child',
    people: 'person',
    leaves: 'leaf',
    shelves: 'shelf',
    shoes: 'shoe',
    sneakers: 'sneaker',
    socks: 'sock',
    candles: 'candle',
    notebooks: 'notebook',
    diaries: 'diary',
    journals: 'journal',
    toothbrushes: 'toothbrush',
    brushes: 'brush',
    bottles: 'bottle',
    straws: 'straw',
    totes: 'tote',
    pouches: 'pouch',
    glasses: 'glass',
    dishes: 'dish',
    boxes: 'box',
    cups: 'cup',
    plates: 'plate',
    bowls: 'bowl',
    spoons: 'spoon',
    forks: 'fork',
    razors: 'razor',
    soaps: 'soap',
    cleaners: 'cleaner',
    detergents: 'detergent',
    loofahs: 'loofah',
    scrubbers: 'scrubber',
    bags: 'bag',
    mats: 'mat',
    planters: 'planter',
    blankets: 'blanket',
    towels: 'towel',
    shirts: 'shirt',
    pens: 'pen',
    pencils: 'pencil',
    lanterns: 'lantern',
    wraps: 'wrap',
    soapnuts: 'soapnut'
  };

  if (irregulars[w]) return irregulars[w];

  // -ies -> -y (diaries -> diary)
  if (w.endsWith('ies') && w.length > 4) {
    return w.slice(0, -3) + 'y';
  }
  // -ves -> -f / -fe (scarves -> scarf)
  if (w.endsWith('ves') && w.length > 4) {
    return w.slice(0, -3) + 'f';
  }
  // -shes, -ches, -sses, -xes, -zes -> strip -es (toothbrushes -> toothbrush)
  if (/(?:sh|ch|ss|x|z)es$/i.test(w) && w.length > 4) {
    return w.slice(0, -2);
  }
  // General trailing -s (except words ending in ss like glass, floss)
  if (w.endsWith('s') && !w.endsWith('ss') && w.length > 3) {
    return w.slice(0, -1);
  }
  return w;
}

/**
 * Robust whole-word / word-boundary tester.
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
    isCheaperFollowUp: false,
    isGreenerFollowUp: false,
    maxBudget: null,
    minBudget: null,
    category: null,
    packaging: null,
    targetGrade: null,
    recipient: null,
    isGift: false,
    sortBy: null, // 'price-asc' | 'ecoscore-desc' | null
    wantsConventional: false,
    didYouMean: null,
    typoOriginal: null,
    clarification: null,
    keywords: [],
    explanation: ''
  };

  // 1. Budget detection
  // Supports: under 1000, under ₹300, below 800, max 500, less than 500, budget 1000, 1000 budget, 300 se kam, 1000 tak
  const budgetMatch =
    text.match(/(?:under|below|less than|within|max|budget of)\s*(?:rs\.?|inr|₹)?\s*(\d+)/i) ||
    text.match(/(?:rs\.?|inr|₹)?\s*(\d+)\s*(?:rs|rupees|inr)?\s*(?:budget|or less|max|se kam|ke andar|tak)/i) ||
    text.match(/budget\s+(?:is\s+)?(?:rs\.?|inr|₹)?\s*(\d+)/i);
  if (budgetMatch && budgetMatch[1]) {
    intent.maxBudget = parseInt(budgetMatch[1], 10);
  }

  // 2. Goal-based planning & Budget basket detection
  // Any query containing basket/kit/bundle/starter/set up/setup/combo/essentials + budget (or "budget basket")
  const hasBasketTerm = /\b(?:basket|kit|bundle|starter|set\s*up|setup|combo|essentials)\b/i.test(text);
  const hasBudgetBasket = /\bbudget\s+basket\b/i.test(text);
  const hasGoalWord = /dorm|student|zero\s+waste\s+(dorm|room|kit|setup)/i.test(text);
  const isAssembleBasket = /assemble\s+(?:a\s+)?(?:budget\s+)?basket/i.test(text);

  if (hasBudgetBasket || hasGoalWord || isAssembleBasket || (hasBasketTerm && intent.maxBudget !== null)) {
    intent.isGoalPlanning = true;
    if (!intent.maxBudget) {
      intent.maxBudget = 1000;
    }
  }

  // 3. Selection follow-up: "show me the second one", "second option", "first one"
  if (/second\s+(?:one|option|item)|show\s+(?:me\s+)?(?:the\s+)?second/i.test(text)) {
    intent.selectIndex = 1;
  } else if (/first\s+(?:one|option|item)|show\s+(?:me\s+)?(?:the\s+)?first/i.test(text)) {
    intent.selectIndex = 0;
  } else if (/third\s+(?:one|option|item)|show\s+(?:me\s+)?(?:the\s+)?third/i.test(text)) {
    intent.selectIndex = 2;
  }

  // 4. "Why not <product>?" follow-up detection
  const whyNotMatch = text.match(/why\s+not\s+(?:the\s+)?([a-z0-9\s-]+)/i);
  if (whyNotMatch && whyNotMatch[1]) {
    intent.isWhyNot = true;
    intent.whyNotTarget = whyNotMatch[1].trim();
  }

  // 5. Cart Review detection
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

  // 6. Educational detection (Score calculation explanation in EN, HI, Hinglish)
  const isEducationalScore =
    /(?:eco[\s-]?score|ecoscore|sustainability\s+score|rating|scoring|स्कोर|\bscore\b)/i.test(text) &&
    /\b(?:how|explain|calculate|calculated|calculating|formula|meaning|what\s+is|kaise|kya\s+hai|samjhao|batao|नियम|works?|working)\b/i.test(text);

  const isEducationalDirect =
    /\b(?:what\s+is\s+eco[\s-]?score|how\s+is\s+(?:the\s+)?score\s+calculated|explain\s+scoring|how\s+scoring\s+works|score\s+kya\s+hai|eco\s+score\s+kaise\s+bana|how\s+does\s+eco[\s-]?score)\b/i.test(text) ||
    text.includes('how agent works');

  if (isEducationalScore || isEducationalDirect) {
    intent.isEducational = true;
    intent.explanation = 'Explaining the 5-pillar Eco-Score calculation formula';
    return intent;
  }

  // 7. Sort detection
  // Price ascending
  for (const cheapKw of CHEAP_KEYWORDS) {
    if (testWordBoundary(text, cheapKw)) {
      intent.sortBy = 'price-asc';
      break;
    }
  }

  // EcoScore descending
  if (
    /highest\s+(?:eco[\s-]?score|ecoscore|score|rated|products?)|greenest|top\s+(?:rated|eco|picks)|best\s+eco[\s-]?score/i.test(text)
  ) {
    intent.sortBy = 'ecoscore-desc';
  }

  // 8. Category detection
  for (const [catName, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (testWordBoundary(text, kw) || testWordBoundary(text, normalizeWord(kw))) {
        intent.category = catName;
        break;
      }
    }
    if (intent.category) break;
  }

  // 9. Multi-turn conversation context continuity
  if (context) {
    // "something cheaper" or "cheaper"
    const isCheaperRequest =
      /\b(?:cheaper|sasta|less\s+expensive|more\s+affordable|lower\s+price)\b/i.test(text) ||
      text.includes('something cheaper');
    if (isCheaperRequest) {
      intent.isCheaperFollowUp = true;
      intent.sortBy = 'price-asc';
      if (!intent.category && context.lastCategory) {
        intent.category = context.lastCategory;
      }
      if (context.lastResults && context.lastResults.length > 0) {
        const topPrice = context.lastResults[0]?.price || context.lastBudget || 1000;
        const cheaper = context.lastResults.filter((p) => p.price < topPrice);
        if (cheaper.length > 0) {
          intent.maxBudget = Math.max(...cheaper.map((p) => p.price));
        } else if (context.lastBudget && topPrice < context.lastBudget) {
          intent.maxBudget = topPrice;
        } else {
          intent.maxBudget = Math.max(topPrice - 1, 50);
        }
      } else if (context.lastBudget) {
        intent.maxBudget = Math.max(context.lastBudget - 50, 50);
      }
    }

    // "something greener" or "more eco friendly"
    const isGreenerRequest =
      /\b(?:greener|more\s+eco|more\s+eco[\s-]friendly|better\s+eco[\s-]?score|higher\s+eco[\s-]?score)\b/i.test(text);
    if (isGreenerRequest) {
      intent.isGreenerFollowUp = true;
      intent.sortBy = 'ecoscore-desc';
      if (!intent.category && context.lastCategory) {
        intent.category = context.lastCategory;
      }
    }

    // "under 300 instead" / budget override without category
    if (intent.maxBudget && !intent.category && context.lastCategory) {
      intent.category = context.lastCategory;
    }

    // "now for bags" / category change keeping previous budget
    if (intent.category && !intent.maxBudget && context.lastBudget) {
      intent.maxBudget = context.lastBudget;
    }

    // Carry over recipient if not overridden
    if (!intent.recipient && context.lastRecipient) {
      intent.recipient = context.lastRecipient;
      intent.isGift = true;
    }
  }

  // 10. Recipient / Gift intent
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

  // 11. Packaging requirement
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

  // 12. Conventional product intent
  const wantsConventional =
    testWordBoundary(text, 'conventional') ||
    testWordBoundary(text, 'disposable') ||
    /show\s+plastic/i.test(text) ||
    /compare\s+plastic/i.test(text) ||
    /plastic\s+vs/i.test(text);
  intent.wantsConventional = wantsConventional;

  // 13. Grade requirement
  if (text.includes('grade a') || testWordBoundary(text, 'best') || text.includes('top eco') || text.includes('greenest')) {
    intent.targetGrade = 'A';
  }

  // 14. Clarifying questions for overly vague queries
  const words = text.split(/\s+/).filter(Boolean);
  if (
    words.length <= 2 &&
    !intent.category &&
    !intent.maxBudget &&
    !intent.isGoalPlanning &&
    !intent.isCartReview &&
    !intent.selectIndex &&
    !intent.isCheaperFollowUp &&
    !intent.isGreenerFollowUp
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
        { label: "🧺 Dorm Starter Kit", prompt: "Assemble a budget basket under 1000" },
        { label: "💰 Under ₹300", prompt: "Cheapest green option under 300" }
      ];
      intent.clarification = {
        question: "Which lifestyle area would you like to make more sustainable today?",
        options: recChips,
        chips: recChips
      };
    }
  }

  // 15. Typo detection using Levenshtein distance on domain words (Bug 10: distance <= 2, real terms only)
  for (const w of words) {
    const normW = normalizeWord(w);
    if (
      w.length >= 4 &&
      !PROTECTED_TYPO_WORDS.has(w) &&
      !PROTECTED_TYPO_WORDS.has(normW) &&
      isNaN(Number(w))
    ) {
      const isKnown =
        KNOWN_DICTIONARY.includes(w) ||
        KNOWN_DICTIONARY.includes(normW) ||
        Object.values(CATEGORY_KEYWORDS).some((list) => list.includes(w) || list.includes(normW));

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

/**
 * Compares winner vs runner-up across price, lifecycle CO2, packaging, and certifications
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
 * Selects an optimal multi-category basket maximizing EcoScore within a strict budget.
 */
export function planBasket(goal, budget = 1000, allProducts = []) {
  const goalLower = (goal || '').toLowerCase();
  const targetBudget = Number(budget) || 1000;

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

  // Pass 1: Ensure category diversity within budget
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
    explanation: `I crafted a conscious basket of ${selectedItems.length} items across ${selectedCategories.size} categories for ₹${currentCost} (under your ₹${targetBudget} budget), saving ${totalCo2Saved.toFixed(1)}kg CO2e and ${Math.round(totalPlasticAvoided)}g virgin plastic!`
  };
}

/**
 * Searches and ranks products based on parsed intent, attaching transparent reasoning,
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

  // 2. Goal-based planning & Budget basket
  if (intent.isGoalPlanning) {
    return planBasket(userQuery, intent.maxBudget || 1000, allProducts);
  }

  // 3. Selection follow-up: "show me the second one"
  if (intent.selectIndex !== null && context?.lastResults && context.lastResults.length > intent.selectIndex) {
    const selectedItem = context.lastResults[intent.selectIndex];
    return {
      type: 'select-item',
      intent,
      results: [selectedItem],
      count: 1,
      explanation: `Here is option #${intent.selectIndex + 1} from your previous search: ${selectedItem.name} (₹${selectedItem.price})`,
      trace: [
        { step: 'Understood goal', detail: `User selected option #${intent.selectIndex + 1} from previous context` },
        { step: 'Information retrieved', detail: `Retrieved "${selectedItem.name}" (₹${selectedItem.price}) from lastResults` },
        { step: 'Decision', detail: `Displayed selected item #${intent.selectIndex + 1}` }
      ]
    };
  }

  // 4. "Why not <product>?" follow-up
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

  // 5. Educational query
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

  // 6. Standard Catalog Search & Scoring
  const productsWithScore = (allProducts || []).map((p) => ({
    ...p,
    ecoScoreData: calculateEcoScore(p),
    greenwashing: detectGreenwashing(p)
  }));

  // Filter out conventional products unless explicitly requested
  let candidates = intent.wantsConventional
    ? productsWithScore
    : productsWithScore.filter((p) => p.isEcoFriendly);

  // Apply Category Filter if detected (allows cross-category domain nouns like bottle, mat, brush)
  if (intent.category) {
    const isGenericNoun = /^(?:bottle|bottles|brush|brushes|mat|mats)$/i.test((intent.rawQuery || '').trim());
    if (!isGenericNoun) {
      candidates = candidates.filter((p) => p.category === intent.category);
    }
  }

  // Follow-up: "something cheaper"
  if (intent.isCheaperFollowUp) {
    const prevTopPrice = context?.lastResults?.[0]?.price;
    const cat = intent.category || context?.lastResults?.[0]?.category;
    const catPool = (allProducts || []).filter((p) => p.isEcoFriendly && (!cat || p.category === cat));

    if (typeof prevTopPrice === 'number') {
      const cheaperItems = catPool
        .filter((p) => p.price < prevTopPrice)
        .map((p) => ({ ...p, ecoScoreData: calculateEcoScore(p), greenwashing: detectGreenwashing(p) }))
        .sort((a, b) => a.price - b.price);

      if (cheaperItems.length > 0) {
        candidates = cheaperItems;
        intent.sortBy = 'price-asc';
      } else {
        // Nothing cheaper in this category
        const sortedPool = [...catPool]
          .map((p) => ({ ...p, ecoScoreData: calculateEcoScore(p), greenwashing: detectGreenwashing(p) }))
          .sort((a, b) => a.price - b.price);
        const cheapestInCat = sortedPool[0];

        if (cheapestInCat) {
          const catName = cat || 'this category';
          return {
            type: 'search-results',
            intent,
            isCheapestInCat: true,
            explanation: `That's already the cheapest in ${catName} (₹${cheapestInCat.price})`,
            didYouMean: null,
            tradeoffs: null,
            results: [cheapestInCat],
            count: 1,
            prioritiesSummary,
            trace: [
              { step: 'Understood goal', detail: `User requested cheaper option in ${catName}` },
              { step: 'Price audit', detail: `Audited ${catPool.length} eco items in ${catName}` },
              { step: 'Decision', detail: `Identified ${cheapestInCat.name} (₹${cheapestInCat.price}) as already the cheapest available item` }
            ]
          };
        }
      }
    }
  }

  // Apply Budget Filter if specified (STRICT maxBudget)
  if (intent.maxBudget !== null && typeof intent.maxBudget === 'number') {
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

  // If category was specified with a budget, but no eco items in that category are <= maxBudget:
  // e.g. Kitchen items start at 349, Bags start at 379. Provide the closest affordable alternatives
  // so follow-up interactions (e.g. "show me the second one") never hit dead ends.
  let isCategoryBudgetClosest = false;
  if (candidates.length === 0 && intent.category && intent.maxBudget !== null) {
    const catEcoItems = (allProducts || [])
      .filter((p) => p.isEcoFriendly && p.category === intent.category)
      .map((p) => ({ ...p, ecoScoreData: calculateEcoScore(p), greenwashing: detectGreenwashing(p) }))
      .sort((a, b) => a.price - b.price);

    if (catEcoItems.length > 0) {
      candidates = catEcoItems;
      isCategoryBudgetClosest = true;
    }
  }

  // Extract search terms
  const DESCRIPTOR_WORDS = new Set([
    ...CHEAP_KEYWORDS,
    ...GIFT_KEYWORDS,
    'option', 'options', 'item', 'items', 'product', 'products', 'green', 'eco',
    'sustainable', 'plastic', 'alternative', 'alternatives', 'thing', 'things',
    'sasta', 'sasti', 'chahiye', 'dikhao', 'choice', 'choices',
    'highest', 'greenest', 'top', 'rated', 'score', 'scores', 'ecoscore', 'scoring',
    'picks', 'grade', 'rank', 'rankings', 'rating'
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

  const RECIPIENT_WORD_SET = new Set(RECIPIENT_KEYWORDS);

  const queryWords = (intent.rawQuery || '').toLowerCase().match(/[a-z0-9\u0900-\u097F]+/g) || [];
  const searchTerms = queryWords.filter(
    (w) => w.length >= 3 &&
      !STOP_WORDS.has(w) &&
      !DESCRIPTOR_WORDS.has(w) &&
      !ACTION_WORDS.has(w) &&
      !BROAD_CATEGORY_WORDS.has(w) &&
      !RECIPIENT_WORD_SET.has(w) &&
      isNaN(Number(w))
  );

  // Broad query if no specific product noun was searched, or query is a gift query, or EcoScore desc sort
  const isBroadQuery =
    intent.isGift ||
    intent.sortBy === 'ecoscore-desc' ||
    isCategoryBudgetClosest ||
    searchTerms.length === 0 ||
    (intent.category && searchTerms.every((term) => term === intent.category.toLowerCase() || normalizeWord(term) === intent.category.toLowerCase()));

  const scoredCandidates = candidates.map((p) => {
    let termMatchCount = 0;
    let termMatchScore = 0;
    const nameLower = p.name.toLowerCase();
    const descLower = (p.description || '').toLowerCase();
    const matLower = (p.material || '').toLowerCase();
    const highLower = (p.ecoHighlights || []).join(' ').toLowerCase();

    let nameMatched = false;
    searchTerms.forEach((term) => {
      let matched = false;
      const normTerm = normalizeWord(term);
      const synonyms = SYNONYM_MAP[term] || SYNONYM_MAP[normTerm] || [];

      const matchesWord = (target) =>
        target.includes(term) ||
        target.includes(normTerm) ||
        synonyms.some((syn) => target.includes(syn));

      if (matchesWord(nameLower)) {
        termMatchScore += 100;
        nameMatched = true;
        matched = true;
      }
      if (matchesWord(descLower)) {
        termMatchScore += 20;
        matched = true;
      }
      if (matchesWord(matLower)) {
        termMatchScore += 25;
        matched = true;
      }
      if (matchesWord(highLower)) {
        termMatchScore += 15;
        matched = true;
      }
      if (matched) termMatchCount += 1;
    });

    let relevance = p.ecoScoreData.score + termMatchScore;

    // Recipient-specific relevance bonuses for gift queries
    if (intent.isGift) {
      const rec = intent.recipient;
      if (rec === 'teacher') {
        if (p.category === 'Stationery' || nameLower.includes('journal') || nameLower.includes('candle') || nameLower.includes('pen') || nameLower.includes('desk')) {
          relevance += 40;
        }
      } else if (['mom', 'mother', 'mata'].includes(rec)) {
        if (p.category === 'Home' || p.category === 'Personal Care' || nameLower.includes('candle') || nameLower.includes('planter') || nameLower.includes('wrap') || nameLower.includes('balm')) {
          relevance += 35;
        }
      } else if (['sister', 'behen'].includes(rec)) {
        if (p.category === 'Personal Care' || p.category === 'Fashion' || p.category === 'Home' || nameLower.includes('candle') || nameLower.includes('tote') || nameLower.includes('balm') || nameLower.includes('journal')) {
          relevance += 35;
        }
      } else if (['brother', 'bhai'].includes(rec)) {
        if (p.category === 'Fashion' || p.category === 'Outdoor & Travel' || nameLower.includes('bottle') || nameLower.includes('thermos') || nameLower.includes('bag') || nameLower.includes('backpack')) {
          relevance += 35;
        }
      } else if (['dad', 'father', 'pita'].includes(rec)) {
        if (p.category === 'Outdoor & Travel' || p.category === 'Home' || p.category === 'Stationery' || nameLower.includes('copper') || nameLower.includes('thermos') || nameLower.includes('desk') || nameLower.includes('razor')) {
          relevance += 35;
        }
      } else if (['friend', 'friends', 'dost'].includes(rec)) {
        if (p.category === 'Personal Care' || p.category === 'Stationery' || p.category === 'Home' || nameLower.includes('bottle') || nameLower.includes('candle') || nameLower.includes('tote')) {
          relevance += 30;
        }
      } else if (['colleague', 'colleagues', 'boss'].includes(rec)) {
        if (p.category === 'Stationery' || nameLower.includes('journal') || nameLower.includes('pen') || nameLower.includes('desk') || nameLower.includes('candle')) {
          relevance += 35;
        }
      } else if (['kid', 'kids'].includes(rec)) {
        if (p.category === 'Stationery' || nameLower.includes('pen') || nameLower.includes('notebook') || nameLower.includes('bamboo')) {
          relevance += 35;
        }
      } else {
        // Generic gift
        if (p.category === 'Stationery' || p.category === 'Home' || p.category === 'Personal Care' || nameLower.includes('set') || nameLower.includes('kit') || nameLower.includes('candle')) {
          relevance += 25;
        }
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
      nameMatched,
      reasoning: reasons.join(' • ')
    };
  });

  // Relevance filtering:
  // If specific product search terms were provided and it's not a broad/gift query,
  // filter by strictly matching terms, prioritizing direct product name matches
  let filteredResults = scoredCandidates;
  if (searchTerms.length > 0 && !isBroadQuery) {
    const strictlyMatching = scoredCandidates.filter((p) => p.termMatchScore > 0);
    const nameMatching = strictlyMatching.filter((p) => p.nameMatched);
    if (nameMatching.length > 0) {
      filteredResults = nameMatching;
    } else if (strictlyMatching.length > 0) {
      filteredResults = strictlyMatching;
    } else {
      filteredResults = [];
    }
  }

  // Strictly enforce maxBudget on all results (unless category budget was relaxed to show closest options)
  if (!isCategoryBudgetClosest && intent.maxBudget !== null && typeof intent.maxBudget === 'number') {
    filteredResults = filteredResults.filter((p) => p.price <= intent.maxBudget);
  }

  // Sort results:
  if (intent.sortBy === 'price-asc') {
    filteredResults.sort((a, b) => {
      if (a.price !== b.price) {
        return a.price - b.price;
      }
      return b.relevanceScore - a.relevanceScore;
    });
  } else if (intent.sortBy === 'ecoscore-desc') {
    filteredResults.sort((a, b) => {
      const scoreA = a.ecoScoreData?.score || 0;
      const scoreB = b.ecoScoreData?.score || 0;
      if (scoreB !== scoreA) {
        return scoreB - scoreA;
      }
      return (a.carbonKg || 0) - (b.carbonKg || 0);
    });
  } else if (filteredResults.length > 0) {
    if (intent.isGift) {
      filteredResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
    } else {
      filteredResults = rankProducts(filteredResults, activeWeights);
    }
  }

  // Top results slice (strictly enforcing budget unless category budget was relaxed)
  let topResults = filteredResults.slice(0, 4);
  if (!isCategoryBudgetClosest && intent.maxBudget !== null && typeof intent.maxBudget === 'number') {
    topResults = topResults.filter((p) => p.price <= intent.maxBudget);
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
        intent.sortBy === 'price-asc' ? 'Sort: Lowest price first' : intent.sortBy === 'ecoscore-desc' ? 'Sort: Highest EcoScore first' : 'Sort: Priority-weighted MCDM'
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
        : intent.sortBy === 'ecoscore-desc'
          ? 'Ranked strictly by EcoScore descending'
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
    isCategoryBudgetClosest,
    explanation: isCategoryBudgetClosest
      ? `${intent.category} items start at ₹${topResults[0]?.price || 349} (${topResults[0]?.name || ''}). Here are the most affordable conscious options closest to your ₹${intent.maxBudget} budget:`
      : '',
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
      itemCount: 0,
      averageScore: 0,
      lowGradeCount: 0,
      summary: "Your cart is empty. Add a few items and I'll audit them, or try 'Assemble a budget basket under 1000'.",
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

  // Low grade items (Grade C, D, or E)
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

  const totalQuantity = itemsScored.reduce((sum, i) => sum + (i.cartItem.quantity || 1), 0);
  const avgScore = totalQuantity > 0
    ? Math.round(itemsScored.reduce((sum, i) => sum + i.score * (i.cartItem.quantity || 1), 0) / totalQuantity)
    : 0;

  return {
    itemCount: cartItems.length,
    averageScore: avgScore,
    lowGradeCount: lowGradeItems.length,
    suggestions,
    worstItems: lowGradeItems.map((i) => i.product),
    summary: lowGradeItems.length === 0
      ? `🌟 Fantastic job! All ${cartItems.length} items in your cart are sustainably rated (Average Eco-Score: ${avgScore}/100). No swaps needed!`
      : `I reviewed your cart (Avg Eco-Score: ${avgScore}/100). Found ${lowGradeItems.length} conventional item(s) with high plastic or carbon impact. Here are greener alternatives to boost your score:`
  };
}

/**
 * Dispatch agent message with optional remote LLM fallback.
 * Signature supports both { query, cartItems, allProducts, context } and (query, allProducts, cartItems, context)
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

  // 1. Priority adjustment check
  const priorityAdjustment = parsePriorityIntent(query, context?.userPriorities);

  // 2. Parse natural language intent with multi-turn continuity
  const intent = parseShoppingIntent(query, context);

  // Check if the query has active shopping constraints (budget, category, packaging, recipient, basket plan, cart review, educational)
  const hasShoppingConstraints = Boolean(
    intent.maxBudget !== null ||
    intent.category !== null ||
    intent.packaging !== null ||
    intent.recipient !== null ||
    intent.isGift ||
    intent.isGoalPlanning ||
    intent.isCartReview ||
    intent.isEducational ||
    intent.selectIndex !== null ||
    intent.isCheaperFollowUp ||
    intent.isGreenerFollowUp ||
    intent.whyNotTarget !== null
  );

  // Check if query has product-bearing search nouns
  const hasProductKeywords = !hasShoppingConstraints && (() => {
    const qWords = (query || '').toLowerCase().match(/[a-z0-9\u0900-\u097F]+/g) || [];
    return qWords.some((w) =>
      !STOP_WORDS.has(w) &&
      !CHEAP_KEYWORDS.includes(w) &&
      !GIFT_KEYWORDS.includes(w) &&
      !['priority', 'priorities', 'care', 'most', 'matters', 'matter', 'more', 'about', 'focus', 'lowest', 'carbon', 'plastic', 'price', 'local', 'water', 'certs'].includes(w) &&
      (KNOWN_DICTIONARY.includes(w) || KNOWN_DICTIONARY.includes(normalizeWord(w)))
    );
  })();

  // Treat as PURE priority change ONLY when there are no shopping constraints and no product nouns
  if (priorityAdjustment && !hasShoppingConstraints && !hasProductKeywords) {
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
        prioritiesSummary: summary,
        intent
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

  // Use updated priorities if available, else context priorities, else DEFAULT_PRIORITIES
  const activeWeights = priorityAdjustment || context?.userPriorities || DEFAULT_PRIORITIES;
  const localResponse = queryEcoCatalog(allProducts, query, context, activeWeights);

  let cartReviewData = null;
  if (intent.isCartReview) {
    cartReviewData = auditCartSustainability(cartItems, allProducts);
  }

  // Attempt optional LLM enhancement when online mode is active
  try {
    const isOnline = typeof window !== 'undefined'
      ? (localStorage.getItem('ecomart_agent_mode') !== 'offline' && (typeof navigator === 'undefined' || navigator.onLine !== false))
      : true;

    if (isOnline) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

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
        if (data && data.reply && (data.source === 'cloud-llm' || data.source === 'gemini')) {
          return {
            source: 'cloud-llm',
            message: data.reply,
            data: localResponse.results || [],
            analysis: {
              ...localResponse,
              intent: localResponse.intent || intent
            },
            tradeoffs: localResponse.tradeoffs,
            trace: localResponse.trace || [],
            basketPlan: localResponse.type === 'basket-plan' ? localResponse : null,
            clarification: localResponse.clarification || null,
            didYouMean: localResponse.didYouMean,
            cartReview: cartReviewData,
            newPriorities: priorityAdjustment || null
          };
        }
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
  } else if (localResponse.type === 'select-item') {
    friendlyMessage = localResponse.explanation;
  } else if (localResponse.isCheapestInCat) {
    friendlyMessage = localResponse.explanation;
  } else if (localResponse.isCategoryBudgetClosest) {
    friendlyMessage = localResponse.explanation;
  } else if (localResponse.type === 'why-not-comparison') {
    friendlyMessage = `Here is why "${localResponse.candidate.name}" wasn't chosen as #1 compared to "${localResponse.topPrevious.name}":\n• ${localResponse.reasons.join('\n• ')}`;
  } else if (intent.isCartReview) {
    if (!cartItems || cartItems.length === 0 || !cartReviewData || cartReviewData.itemCount === 0) {
      friendlyMessage = "Your cart is empty. Add a few items and I'll audit them, or try 'Assemble a budget basket under 1000'.";
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
    if (intent.sortBy === 'ecoscore-desc') filters.push('highest EcoScore first');
    const filterDesc = filters.length > 0 ? ` (${filters.join(', ')})` : '';
    const priorityLead = priorityAdjustment ? `${formatPrioritiesSummary(priorityAdjustment)}.\n\n` : (localResponse.prioritiesSummary ? `${localResponse.prioritiesSummary}.\n\n` : '');
    friendlyMessage = `${priorityLead}Here are ${localResponse.results.length} top-rated sustainable recommendations matching "${query}"${filterDesc}:`;
  } else {
    if (intent.category && intent.maxBudget) {
      friendlyMessage = `I couldn't find items in ${intent.category} under ₹${intent.maxBudget}. Try exploring other categories like "Personal Care", "Home", or "Bags".`;
    } else {
      friendlyMessage = `I couldn't find an exact match for "${query}". Try searching for categories like "Kitchen", "Personal Care", "Bags" or terms like "plastic-free under 500".`;
    }
  }

  // Prevent any "undefined" or "NaN" in user-facing message strings
  if (friendlyMessage.includes('undefined') || friendlyMessage.includes('NaN')) {
    friendlyMessage = friendlyMessage
      .replace(/\bundefined\b/g, '')
      .replace(/\bNaN\b/g, '0')
      .replace(/\s+/g, ' ')
      .trim();
  }

  const returnData = (intent.isCartReview && (!cartItems || cartItems.length === 0))
    ? []
    : (localResponse.results || []);

  return {
    source: 'local-rule-engine',
    message: friendlyMessage,
    data: returnData,
    analysis: {
      ...localResponse,
      intent: localResponse.intent || intent
    },
    tradeoffs: localResponse.tradeoffs,
    trace: localResponse.trace || [],
    basketPlan: localResponse.type === 'basket-plan' ? localResponse : null,
    clarification: localResponse.clarification || null,
    didYouMean: localResponse.didYouMean || null,
    cartReview: cartReviewData,
    newPriorities: priorityAdjustment || null
  };
}
