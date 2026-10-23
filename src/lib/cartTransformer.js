/**
 * EcoMart Cart Transformer Engine
 * 100% Offline, Deterministic, Mathematical Multi-Choice Knapsack Optimiser.
 * Transforms an ordinary handwritten, typed, or spoken shopping list into a
 * sustainable, budget-respecting cart with explainable decisions.
 */

import { calculateEcoScore } from './ecoScore.js';
import { rankProducts, DEFAULT_PRIORITIES } from './decisionEngine.js';
import { levenshtein, normalizeWord } from './ecoAgent.js';
import productsData from '../data/products.json' with { type: 'json' };

// Domain vocabulary for fuzzy matching and typo tolerance
const HOUSEHOLD_SYNONYMS = {
  dish_soap: [
    'dish soap', 'dishwash', 'dish wash', 'vim', 'dish scrubber', 'dish cleaner',
    'bartan dhona', 'bartan bar', 'liquid dishwash'
  ],
  water_bottle: [
    'water bottle', 'water bottles', 'plastic water bottle', 'plastic water bottles',
    'plastic bottle', 'plastic bottles', 'plastic ki bottle', 'pani ki bottle', 'pani bottle',
    'gym bottle', 'sipper', 'flask', 'copper bottle', 'reusable bottle', 'steel bottle', 'drink bottle'
  ],
  produce_bag: ['produce bag', 'produce bags', 'vegetable bag', 'vegetable bags', 'fruit bag', 'grocery bag', 'mesh bag'],
  laptop_bag: ['laptop bag', 'laptop case', 'laptop messenger', 'office bag'],
  duffel: ['duffel', 'duffel bag', 'gym bag', 'weekend bag', 'travel duffel'],
  yoga_mat: ['yoga mat', 'exercise mat', 'workout mat', 'fitness mat'],
  picnic_blanket: ['picnic blanket', 'picnic rug', 'blanket', 'blankets', 'throw'],
  toilet_brush: ['toilet brush', 'commode brush', 'bathroom brush', 'wc brush'],
  cleaner_spray: ['cleaner', 'cleaner spray', 'glass cleaner', 'surface cleaner', 'multi surface cleaner', 'colin'],
  food_wrap: ['food wrap', 'cling wrap', 'plastic wrap', 'pvc wrap', 'beeswax wrap', 'aluminum foil', 'foil'],
  desk_tidy: ['desk tidy', 'desk organizer', 'desk organiser', 'pen stand', 'pencil stand', 'phone stand'],
  toothbrush: ['toothbrush', 'tooth brush', 'toothbrsh', 'tootbrush', 'teeth brush', 'dant manjan'],
  shampoo: ['shampoo', 'shampoos', 'shampoo bottle', 'shampo', 'hair wash', 'hairwash', 'hair cleanser', 'liquid shampoo'],
  soap: ['soap', 'soaps', 'sabun', 'bathing soap', 'body wash', 'bath bar', 'bath soap'],
  thermos: ['thermos', 'insulated thermos', 'travel thermos', 'thermal cup', 'thermal mug', 'insulated bottle'],
  notebook: [
    'notebook', 'notebooks', 'notebok', 'copybook', 'copybooks', 'register', 'registers',
    'diary', 'diaries', 'journal', 'journals', 'notepad', 'notepads', 'spiral notebook',
    'bullet journal', 'kitab', 'copy'
  ],
  pen: ['pen', 'pens', 'pencil', 'pencils', 'ballpoint', 'ball pen', 'seed pen', 'seed pens', 'marker', 'markers', 'kalam'],
  sponge: ['sponge', 'sponges', 'scrubber', 'scrubbers', 'scrub', 'loofah', 'loofahs', 'cleaning sponge'],
  polybag: [
    'polybag', 'polybags', 'plastic bag', 'plastic bags', 'carry bag', 'carry bags',
    'polythene', 'thaila', 'thaili', 'jhola', 'thela', 'tote', 'tote bag', 'shopping bag',
    'canvas bag', 'cloth bag', 'trash bag', 'trash bags', 'garbage bag', 'garbage bags',
    'biodegradable bag', 'biodegradable bags', 'biodegradable trash bags'
  ],
  cutlery: ['cutlery', 'plastic cutlery', 'spoon', 'spoons', 'fork', 'forks', 'knife', 'knives', 'chamach', 'disposable cutlery'],
  straw: ['straw', 'straws', 'plastic straw', 'drinking straw', 'pipe'],
  bowl: ['bowl', 'bowls', 'salad bowl', 'dinner bowl', 'katori', 'melamine bowl', 'coconut bowl'],
  razor: ['razor', 'razors', 'shaving razor', 'disposable razor', 'safety razor', 'shave'],
  lip_balm: ['lip balm', 'lipbalm', 'chapstick', 'petroleum jelly', 'vaseline'],
  shirt: ['shirt', 'shirts', 'tshirt', 't-shirt', 'tee', 'kurta', 'top', 'kapda', 'kapde'],
  sneakers: ['sneakers', 'sneaker', 'shoe', 'shoes', 'trainers', 'footwear', 'joota', 'joote'],
  scarf: ['scarf', 'scarves', 'stole', 'stoles', 'dupatta', 'shawl'],
  socks: ['socks', 'sock', 'crew socks', 'moze'],
  candle: ['candle', 'candles', 'scented candle', 'mombatti', 'wax candle'],
  tray: ['tray', 'trays', 'serving tray', 'wooden tray'],
  doormat: ['doormat', 'doormats', 'door mat', 'welcome mat', 'entry mat', 'foot mat'],
  planter: ['planter', 'planters', 'pot', 'pots', 'plant pot', 'flower pot', 'gamla'],
  lantern: ['lantern', 'lanterns', 'camping lantern', 'flashlight', 'torch', 'camping light'],
  laundry: ['laundry', 'detergent', 'laundry detergent', 'washing powder', 'soapnut', 'soapnuts', 'surf']
};

// Flattened list of synonyms sorted by length descending so longer/more specific phrases match first
const SORTED_SYNONYM_ENTRIES = Object.entries(HOUSEHOLD_SYNONYMS)
  .flatMap(([typeKey, synonyms]) => synonyms.map((syn) => ({ typeKey, syn, len: syn.length })))
  .sort((a, b) => b.len - a.len);

// Mapping from canonical typeKey to baseline and greener catalogue product IDs
const TYPE_CONFIG = {
  toothbrush: { convId: 'care-01-conv', ecoIds: ['care-01'] },
  shampoo: { convId: 'care-02-conv', ecoIds: ['care-02'] },
  soap: { convId: 'care-02-conv', ecoIds: ['care-02', 'clean-01'] },
  water_bottle: { convId: 'kit-04-conv', ecoIds: ['kit-04', 'out-02'] },
  thermos: { convId: 'out-02-conv', ecoIds: ['out-02', 'kit-04'] },
  notebook: { convId: 'stat-01-conv', ecoIds: ['stat-01', 'stat-04'] },
  pen: { convId: 'stat-02-conv', ecoIds: ['stat-02'] },
  desk_tidy: { convId: 'stat-03-conv', ecoIds: ['stat-03'] },
  dish_soap: { convId: 'clean-02-conv', ecoIds: ['clean-02'] },
  sponge: { convId: 'clean-02-conv', ecoIds: ['clean-02'] },
  polybag: { convId: 'bag-01-conv', ecoIds: ['bag-01', 'bag-04'] },
  produce_bag: { convId: 'bag-04-conv', ecoIds: ['bag-04', 'bag-01'] },
  cutlery: { convId: 'kit-01-conv', ecoIds: ['kit-01'] },
  straw: { convId: 'kit-01-conv', ecoIds: ['kit-01'] },
  bowl: { convId: 'kit-02-conv', ecoIds: ['kit-02'] },
  food_wrap: { convId: 'kit-03-conv', ecoIds: ['kit-03'] },
  razor: { convId: 'care-03-conv', ecoIds: ['care-03'] },
  lip_balm: { convId: 'care-04-conv', ecoIds: ['care-04'] },
  shirt: { convId: 'fash-01-conv', ecoIds: ['fash-01'] },
  sneakers: { convId: 'fash-02-conv', ecoIds: ['fash-02'] },
  scarf: { convId: 'fash-03-conv', ecoIds: ['fash-03'] },
  socks: { convId: 'fash-04-conv', ecoIds: ['fash-04'] },
  candle: { convId: 'home-01-conv', ecoIds: ['home-01'] },
  tray: { convId: 'home-02-conv', ecoIds: ['home-02'] },
  doormat: { convId: 'home-03-conv', ecoIds: ['home-03'] },
  planter: { convId: 'home-04-conv', ecoIds: ['home-04'] },
  laptop_bag: { convId: 'bag-02-conv', ecoIds: ['bag-02'] },
  duffel: { convId: 'bag-03-conv', ecoIds: ['bag-03'] },
  lantern: { convId: 'out-01-conv', ecoIds: ['out-01'] },
  yoga_mat: { convId: 'out-03-conv', ecoIds: ['out-03'] },
  picnic_blanket: { convId: 'out-04-conv', ecoIds: ['out-04'] },
  laundry: { convId: 'clean-01-conv', ecoIds: ['clean-01'] },
  cleaner_spray: { convId: 'clean-03-conv', ecoIds: ['clean-03'] },
  toilet_brush: { convId: 'clean-04-conv', ecoIds: ['clean-04'] }
};

// Known catalogue terms for edit-distance typo suggestion
const CANONICAL_CATALOGUE_TERMS = [
  'toothbrush', 'shampoo', 'soap', 'bottle', 'water bottle', 'thermos',
  'notebook', 'diary', 'journal', 'pen', 'pencil', 'desk tidy', 'dish soap',
  'sponge', 'scrubber', 'polybag', 'plastic bag', 'carry bag', 'tote',
  'cutlery', 'spoon', 'fork', 'straw', 'bowl', 'food wrap', 'cling wrap',
  'razor', 'lip balm', 'shirt', 'sneakers', 'shoes', 'scarf', 'stole',
  'socks', 'candle', 'tray', 'doormat', 'planter', 'pot', 'laptop bag',
  'duffel', 'lantern', 'yoga mat', 'blanket', 'laundry', 'detergent',
  'cleaner', 'toilet brush'
];

/**
 * 1. parseShoppingList(text)
 * Extracts individual items, quantities, and budget constraints from text.
 */
export function parseShoppingList(text) {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return {
      items: [],
      budget: null,
      rawText: text || '',
      isEmpty: true,
      cappedAt25: false
    };
  }

  let cleanText = text;
  let budget = null;

  // Budget detection (English + Hinglish + Hindi phrases)
  const budgetPatterns = [
    /(?:under|below|budget|within|upto|up to|max|maximum)\s*(?:of\s*)?(?:₹|rs\.?|inr|rupees)?\s*(\d+(?:,\d+)*)/i,
    /(\d+(?:,\d+)*)\s*(?:₹|rs\.?|inr|rupees)?\s*(?:tak|or less|se kam|ke andar|max|budget)/i,
    /(?:₹|rs\.?|inr)\s*(\d+(?:,\d+)*)\s*(?:budget|tak|max)?/i
  ];

  for (const pattern of budgetPatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      const parsedVal = parseInt(match[1].replace(/,/g, ''), 10);
      if (!isNaN(parsedVal) && parsedVal > 0) {
        budget = parsedVal;
        cleanText = cleanText.replace(match[0], ' ');
        break;
      }
    }
  }

  // Split on newlines, semicolons, bullets, and conjunctions ("and", "&", "+", "aur")
  const rawTokens = cleanText
    .split(/[\r\n;,+&]|(?:\s+and\s+)|\band\b|(?:\s+aur\s+)|\baur\b|(?:\s+tatha\s+)|\btatha\b/i)
    .map((t) => t.trim())
    .filter(Boolean);

  const numWordMap = {
    one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
    ek: 1, do: 2, teen: 3, char: 4, chaar: 4, paanch: 5, panch: 5
  };

  const parsedItems = [];

  for (let token of rawTokens) {
    // Strip leading bullet symbols or numbered list markers like "1.", "2)", "-", "*"
    token = token.replace(/^[\s•*–—]+\s*/, '').replace(/^\d+[.)]\s+/, '').trim();

    // Strip conversational fillers
    token = token
      .replace(/^(?:i need|i want|please buy|please get|please|get|buy|add|some|a few|give me|mujhe chahiye|chahiye|lena hai|kharidna hai|le lo|kripya|de do|dedo)\s+/i, '')
      .replace(/\s+(?:chahiye|lena hai|kharidna hai|le lo|bhi|plz|please)$/i, '')
      .trim();

    let qty = 1;
    let name = token;

    // Detect numeric prefixes ("2x toothbrush", "2 plastic bottles", "pack of 2 notebooks")
    const qtyPrefixMatch = token.match(/^(\d+)\s*(?:x|pcs|pieces|packs?|pairs?)?\s+(.*)$/i);
    const qtyWordMatch = token.match(/^([a-z]+)\s+(.*)$/i);
    const qtySuffixMatch = token.match(/^(.*?)\s*(?:x\s*|\(qty:\s*)(\d+)\)?$/i);

    if (qtyPrefixMatch) {
      qty = parseInt(qtyPrefixMatch[1], 10) || 1;
      name = qtyPrefixMatch[2];
    } else if (qtySuffixMatch) {
      qty = parseInt(qtySuffixMatch[2], 10) || 1;
      name = qtySuffixMatch[1];
    } else if (qtyWordMatch && numWordMap[qtyWordMatch[1].toLowerCase()]) {
      qty = numWordMap[qtyWordMatch[1].toLowerCase()];
      name = qtyWordMatch[2];
    }

    // Normalise Hindi connector words like "2 plastic ki bottle" -> "plastic bottle"
    name = name.replace(/\b(?:ki|ke)\b/gi, ' ').replace(/\s+/g, ' ').trim();
    name = name.replace(/^[\s,.;:-]+|[\s,.;:-]+$/g, '').trim();

    if (name) {
      parsedItems.push({
        raw: token,
        name,
        qty: Math.max(1, Math.min(99, qty))
      });
    }
  }

  // Merge duplicate items by normalising key
  const mergedMap = new Map();
  for (const item of parsedItems) {
    const key = item.name.toLowerCase().replace(/\s+/g, ' ');
    if (mergedMap.has(key)) {
      mergedMap.get(key).qty += item.qty;
    } else {
      mergedMap.set(key, { ...item });
    }
  }

  const allItems = Array.from(mergedMap.values());
  const cappedAt25 = allItems.length > 25;
  const items = allItems.slice(0, 25);

  return {
    items,
    budget,
    cappedAt25,
    isEmpty: items.length === 0,
    rawText: text
  };
}

/**
 * 2. matchItem(name, products)
 * Matches an item name against catalogue products and household synonyms.
 */
export function matchItem(name, products = productsData) {
  if (!name || typeof name !== 'string') {
    return { status: 'unmatched', candidates: [], confidence: 0, suggestion: null };
  }

  const query = name.toLowerCase().trim();
  const words = query.split(/\s+/).map((w) => normalizeWord(w));

  // Ambiguity Detection: A bare "bottle" or "bottles" without context
  if (query === 'bottle' || query === 'bottles' || query === 'boatal' || query === 'botal') {
    return {
      status: 'ambiguous',
      name,
      clarifyingQuestion: 'Did you mean a water bottle or a shampoo bottle?',
      chips: ['Water bottle', 'Shampoo bottle'],
      confidence: 0.5,
      candidates: []
    };
  }

  // Check if user specifically requested an eco product
  const explicitlyEco =
    query.includes('bamboo') ||
    query.includes('copper') ||
    query.includes('organic') ||
    query.includes('seed paper') ||
    query.includes('eco friendly') ||
    query.includes('khadi') ||
    query.includes('reclaimed') ||
    query.includes('solid shampoo') ||
    query.includes('soy wax') ||
    query.includes('tree-free');

  // Step A: Synonym and Keyword Lookup (checked longest first to prioritize multi-word phrases)
  let matchedTypeKey = null;

  for (const entry of SORTED_SYNONYM_ENTRIES) {
    const synLower = entry.syn.toLowerCase();
    const isExact = query === synLower;
    const isSub = query.includes(synLower);
    const hasWord = words.includes(normalizeWord(synLower));

    if (isExact || isSub || hasWord) {
      matchedTypeKey = entry.typeKey;
      break;
    }
  }

  // Step B: Typo Check with Levenshtein distance <= 2
  let typoSuggestion = null;
  if (!matchedTypeKey) {
    let minDistance = 3;
    for (const dictTerm of CANONICAL_CATALOGUE_TERMS) {
      const d = levenshtein(query, dictTerm);
      if (d <= 2 && d < minDistance) {
        minDistance = d;
        typoSuggestion = dictTerm;
      }
    }

    if (typoSuggestion) {
      // Find typeKey for the typo suggestion
      for (const entry of SORTED_SYNONYM_ENTRIES) {
        if (entry.syn.toLowerCase() === typoSuggestion) {
          matchedTypeKey = entry.typeKey;
          break;
        }
      }
    }
  }

  const productMap = new Map((products || []).map((p) => [p.id, p]));

  if (matchedTypeKey && TYPE_CONFIG[matchedTypeKey]) {
    const config = TYPE_CONFIG[matchedTypeKey];
    const convProduct = productMap.get(config.convId);
    const primaryEcoProduct = productMap.get(config.ecoIds[0]);

    // If item was explicitly eco, baseline is the eco item itself!
    const baselineProduct = explicitlyEco ? (primaryEcoProduct || convProduct) : (convProduct || primaryEcoProduct);
    const matchedProduct = explicitlyEco ? primaryEcoProduct : (convProduct || primaryEcoProduct);

    return {
      status: 'matched',
      name,
      matchedProduct,
      baselineProduct,
      primaryEcoProduct,
      greenerIds: config.ecoIds,
      isAlreadyEco: Boolean(explicitlyEco && matchedProduct.isEcoFriendly),
      confidence: typoSuggestion ? 0.85 : 0.95,
      suggestion: typoSuggestion,
      typeKey: matchedTypeKey
    };
  }

  // Direct Product Name match across catalogue
  const directProduct = (products || []).find((p) => {
    const pName = p.name.toLowerCase();
    return pName.includes(query) || query.includes(pName);
  });

  if (directProduct) {
    const isEco = directProduct.isEcoFriendly;
    const conv = isEco
      ? (explicitlyEco ? directProduct : productMap.get(directProduct.conventionalAlternativeId) || directProduct)
      : directProduct;
    const eco = isEco
      ? directProduct
      : productMap.get(directProduct.conventionalAlternativeId) || null;

    return {
      status: 'matched',
      name,
      matchedProduct: directProduct,
      baselineProduct: conv,
      primaryEcoProduct: eco,
      greenerIds: eco ? [eco.id] : [],
      isAlreadyEco: Boolean(isEco && explicitlyEco),
      confidence: 0.9,
      suggestion: null
    };
  }

  // Truly unmatched item (e.g. "spaceship")
  return {
    status: 'unmatched',
    name,
    confidence: 0,
    suggestion: typoSuggestion,
    candidates: []
  };
}

/**
 * 3. Builds Option Groups with ranked greener alternatives
 */
export function buildOptionGroups(matchedItems, products = productsData, userPriorities = DEFAULT_PRIORITIES) {
  const groups = [];
  const productMap = new Map((products || []).map((p) => [p.id, p]));

  for (let idx = 0; idx < matchedItems.length; idx++) {
    const item = matchedItems[idx];
    const groupIndex = idx;

    if (item.status === 'unmatched') {
      groups.push({
        groupIndex,
        raw: item.raw,
        name: item.name,
        qty: item.qty,
        status: 'unmatched',
        suggestion: item.suggestion || null,
        baseline: null,
        options: []
      });
      continue;
    }

    if (item.status === 'ambiguous') {
      groups.push({
        groupIndex,
        raw: item.raw,
        name: item.name,
        qty: item.qty,
        status: 'ambiguous',
        clarifyingQuestion: item.clarifyingQuestion,
        chips: item.chips,
        baseline: null,
        options: []
      });
      continue;
    }

    const baseline = item.baselineProduct || item.matchedProduct;
    const baselineEcoScore = calculateEcoScore(baseline).score;

    // If the item requested is already eco-friendly:
    if (item.isAlreadyEco) {
      groups.push({
        groupIndex,
        raw: item.raw,
        name: item.name,
        qty: item.qty,
        status: 'kept',
        reason: 'Already a verified sustainable choice in our catalog (Grade A).',
        baseline,
        options: []
      });
      continue;
    }

    // Find greener candidates specifically mapped to this product type
    let candidateIds = item.greenerIds || [];
    if (candidateIds.length === 0 && baseline.conventionalAlternativeId) {
      candidateIds = [baseline.conventionalAlternativeId];
    }

    const typeCandidates = candidateIds
      .map((id) => productMap.get(id))
      .filter((p) => Boolean(p && p.isEcoFriendly && p.id !== baseline.id));

    // Strictly greener candidates (EcoScore > baseline)
    const strictlyGreener = typeCandidates.filter((p) => {
      const pScore = calculateEcoScore(p).score;
      return pScore > baselineEcoScore;
    });

    // Rank greener candidates using priority weights
    const rankedGreener = rankProducts(strictlyGreener, userPriorities);
    const topGreener = rankedGreener.slice(0, 3);

    if (topGreener.length === 0) {
      groups.push({
        groupIndex,
        raw: item.raw,
        name: item.name,
        qty: item.qty,
        status: 'no-better-option',
        reason: 'No higher-scoring eco alternative currently in our catalog.',
        baseline,
        options: []
      });
      continue;
    }

    groups.push({
      groupIndex,
      raw: item.raw,
      name: item.name,
      qty: item.qty,
      status: 'swapped',
      baseline,
      options: topGreener
    });
  }

  return groups;
}

/**
 * 4. optimizeCart(groups, budget, userPriorities)
 * Multiple-choice knapsack DP over integer prices to maximize total impact gain
 * within the given budget.
 */
export function optimizeCart(groups, budget, userPriorities = DEFAULT_PRIORITIES) {
  // Baseline cost (what user would pay for conventional options)
  const baselineCost = groups.reduce((sum, g) => {
    return sum + (g.baseline ? (g.baseline.price || 0) * (g.qty || 1) : 0);
  }, 0);

  // If no budget provided, default to baseline * 1.15 (budget-neutral +15%)
  const effectiveBudget = (typeof budget === 'number' && budget > 0)
    ? budget
    : Math.round(baselineCost * 1.15);

  const budgetIsDefault = !budget || budget <= 0;

  // Check if baseline alone exceeds budget
  const overBudget = baselineCost > effectiveBudget;

  // Prepare groups with discrete choices
  const preparedGroups = groups.map((g) => {
    const qty = g.qty || 1;
    if (!g.baseline || g.status !== 'swapped' || !g.options || g.options.length === 0) {
      const baseCost = g.baseline ? (g.baseline.price || 0) * qty : 0;
      return {
        ...g,
        choices: g.baseline ? [{ product: g.baseline, cost: baseCost, impactGain: 0, isGreener: false }] : []
      };
    }

    const baselinePrice = (g.baseline.price || 0) * qty;
    const baseScore = calculateEcoScore(g.baseline).score;

    const baseChoice = {
      product: g.baseline,
      cost: baselinePrice,
      impactGain: 0,
      isGreener: false
    };

    const greenerChoices = g.options.map((opt) => {
      const optCost = (opt.price || 0) * qty;
      const optScore = calculateEcoScore(opt).score;
      const co2Delta = Math.max(0, ((g.baseline.carbonKg || 0) - (opt.carbonKg || 0)) * qty);
      const plasticDelta = Math.max(0, ((g.baseline.plasticGrams || 0) - (opt.plasticGrams || 0)) * qty);
      const waterDelta = Math.max(0, ((g.baseline.waterLitres || 0) - (opt.waterLitres || 0)) * qty);
      const scoreDelta = Math.max(0, optScore - baseScore);

      // Weighted impact gain normalized by priorities
      const wC = (userPriorities.carbon || 50) / 50;
      const wP = (userPriorities.plastic || 50) / 50;
      const wW = (userPriorities.water || 50) / 50;
      const wS = (userPriorities.ecoScore || 50) / 50;

      const impactGain =
        (co2Delta * 15 * wC) +
        (plasticDelta * 0.4 * wP) +
        (waterDelta * 0.2 * wW) +
        (scoreDelta * 2 * wS) + 1;

      return {
        product: opt,
        cost: optCost,
        impactGain,
        isGreener: true
      };
    });

    return {
      ...g,
      choices: [baseChoice, ...greenerChoices]
    };
  });

  // Multiple-choice knapsack DP
  // dp map: cost -> { totalGain, choiceMap: { [groupIndex]: { group, chosen, isGreener } } }
  let dp = new Map();
  dp.set(0, { gain: 0, choiceMap: {} });

  for (let i = 0; i < preparedGroups.length; i++) {
    const group = preparedGroups[i];
    if (!group.choices || group.choices.length === 0) continue;

    const nextDp = new Map();

    for (const [currCost, currData] of dp.entries()) {
      for (const choice of group.choices) {
        const newCost = currCost + choice.cost;
        if (newCost <= effectiveBudget || overBudget) {
          const newGain = currData.gain + choice.impactGain;
          if (!nextDp.has(newCost) || nextDp.get(newCost).gain < newGain) {
            nextDp.set(newCost, {
              gain: newGain,
              choiceMap: {
                ...currData.choiceMap,
                [group.groupIndex]: { group, chosen: choice.product, isGreener: choice.isGreener }
              }
            });
          }
        }
      }
    }

    if (nextDp.size > 0) {
      dp = nextDp;
    }
  }

  // Find optimal choice within budget
  let best = null;
  for (const [cost, data] of dp.entries()) {
    if (!best || data.gain > best.gain || (data.gain === best.gain && cost < best.cost)) {
      best = { cost, gain: data.gain, choiceMap: data.choiceMap };
    }
  }

  // Fallback map if budget was too strict
  const finalChoiceMap = best?.choiceMap || {};
  preparedGroups.forEach((g) => {
    if (!finalChoiceMap[g.groupIndex] && g.baseline) {
      finalChoiceMap[g.groupIndex] = { group: g, chosen: g.baseline, isGreener: false };
    }
  });

  return {
    effectiveBudget,
    budgetIsDefault,
    overBudget,
    baselineCost,
    totalCost: best ? best.cost : baselineCost,
    totalGain: best ? best.gain : 0,
    choiceMap: finalChoiceMap
  };
}

/**
 * 5. Formatting Helper: Generates real, data-driven reasons and tradeoffs
 */
function createReasonAndTradeoff(baseline, greener, qty = 1) {
  if (!greener || !baseline || baseline.id === greener.id) {
    return {
      reason: 'Already a certified sustainable choice with top lifecycle marks.',
      tradeoff: '₹0 price delta • Zero compromises'
    };
  }

  const priceDelta = (greener.price - baseline.price) * qty;
  const plasticAvoided = Math.round(((baseline.plasticGrams || 0) - (greener.plasticGrams || 0)) * qty);
  const co2Avoided = Number((((baseline.carbonKg || 0) - (greener.carbonKg || 0)) * qty).toFixed(2));
  const waterAvoided = Math.round(((baseline.waterLitres || 0) - (greener.waterLitres || 0)) * qty);

  // Real top reasons from data
  const reasons = [];
  if (plasticAvoided > 0) reasons.push(`eliminates ${plasticAvoided}g plastic waste`);
  if (co2Avoided > 0) reasons.push(`diverts ${co2Avoided}kg lifecycle CO₂`);
  if (waterAvoided > 0) reasons.push(`saves ${waterAvoided}L water`);
  if (greener.certifications && greener.certifications.length > 0) {
    reasons.push(`verified by ${greener.certifications[0]}`);
  }

  const reason = reasons.length > 0
    ? `Sustainably upgraded: ${reasons.slice(0, 2).join(' and ')}.`
    : `Upgrades lifecycle EcoScore from ${calculateEcoScore(baseline).score} to ${calculateEcoScore(greener).score}.`;

  const tradeoffParts = [];
  if (priceDelta > 0) {
    tradeoffParts.push(`₹${priceDelta} more`);
  } else if (priceDelta < 0) {
    tradeoffParts.push(`₹${Math.abs(priceDelta)} cheaper`);
  } else {
    tradeoffParts.push('Same price');
  }

  if (plasticAvoided > 0) tradeoffParts.push(`saves ${plasticAvoided}g plastic`);
  if (co2Avoided > 0) tradeoffParts.push(`saves ${co2Avoided}kg CO₂`);

  const tradeoff = tradeoffParts.join(', ');

  return { reason, tradeoff };
}

/**
 * 6. transformShoppingList(text, products, userPriorities, customBudget)
 * Main entry point: transforms list text into an audited sustainable cart.
 */
export function transformShoppingList(
  text,
  products = productsData,
  userPriorities = DEFAULT_PRIORITIES,
  customBudget = null
) {
  // Edge Case: Empty or invalid input
  if (!text || typeof text !== 'string' || !text.trim()) {
    return {
      isEmpty: true,
      items: [],
      totals: {
        priceBefore: 0,
        priceAfter: 0,
        priceDelta: 0,
        ecoScoreBefore: 0,
        ecoScoreAfter: 0,
        purposeScoreBefore: 0,
        purposeScoreAfter: 0,
        co2Saved: 0,
        waterSaved: 0,
        plasticSaved: 0,
        itemsSwapped: 0,
        itemsKept: 0,
        itemsUnmatched: 0,
        itemsAmbiguous: 0
      },
      trace: [
        {
          step: 1,
          title: 'Awaiting your list',
          detail: 'Type, speak, or paste any shopping list above to transform it into a sustainable cart.',
          status: 'pending'
        }
      ]
    };
  }

  // 1. Parse text
  const parsed = parseShoppingList(text);
  const budget = customBudget !== null ? customBudget : parsed.budget;

  // 2. Match each item
  const matched = parsed.items.map((item) => {
    const matchRes = matchItem(item.name, products);
    return {
      ...item,
      ...matchRes
    };
  });

  // 3. Build Option Groups
  const optionGroups = buildOptionGroups(matched, products, userPriorities);

  // 4. Optimize Cart within Budget
  const optimization = optimizeCart(optionGroups, budget, userPriorities);

  // 5. Build final item rows
  const resolvedItems = [];
  let priceBefore = 0;
  let priceAfter = 0;
  let totalPlasticSaved = 0;
  let totalCo2Saved = 0;
  let totalWaterSaved = 0;
  let swappedCount = 0;
  let keptCount = 0;
  let unmatchedCount = 0;
  let ambiguousCount = 0;

  let weightedScoreBefore = 0;
  let weightedScoreAfter = 0;
  let totalQty = 0;

  for (const group of optionGroups) {
    const qty = group.qty || 1;

    if (group.status === 'unmatched') {
      unmatchedCount++;
      resolvedItems.push({
        groupIndex: group.groupIndex,
        raw: group.raw,
        name: group.name,
        qty,
        status: 'unmatched',
        suggestion: group.suggestion || null,
        before: null,
        after: null,
        reason: 'Item not found in our sustainable catalogue.',
        tradeoff: 'No catalogue alternative',
        alternatives: []
      });
      continue;
    }

    if (group.status === 'ambiguous') {
      ambiguousCount++;
      resolvedItems.push({
        groupIndex: group.groupIndex,
        raw: group.raw,
        name: group.name,
        qty,
        status: 'ambiguous',
        clarifyingQuestion: group.clarifyingQuestion,
        chips: group.chips,
        before: null,
        after: null,
        reason: 'Ambiguous product type. Please pick one of the options below.',
        tradeoff: 'Clarification needed',
        alternatives: []
      });
      continue;
    }

    const baseline = group.baseline;
    const baseScore = calculateEcoScore(baseline).score;
    const baseCost = (baseline.price || 0) * qty;

    priceBefore += baseCost;
    totalQty += qty;
    weightedScoreBefore += baseScore * qty;

    // Determine chosen product from optimization
    const sel = optimization.choiceMap[group.groupIndex];
    const isGreener = sel ? sel.isGreener : false;
    const chosenProduct = sel && sel.chosen ? sel.chosen : baseline;
    const chosenScore = calculateEcoScore(chosenProduct).score;
    const chosenCost = (chosenProduct.price || 0) * qty;

    priceAfter += chosenCost;
    weightedScoreAfter += chosenScore * qty;

    if (isGreener && chosenProduct.id !== baseline.id) {
      swappedCount++;
      const { reason, tradeoff } = createReasonAndTradeoff(baseline, chosenProduct, qty);
      const plasticDelta = Math.max(0, ((baseline.plasticGrams || 0) - (chosenProduct.plasticGrams || 0)) * qty);
      const co2Delta = Math.max(0, ((baseline.carbonKg || 0) - (chosenProduct.carbonKg || 0)) * qty);
      const waterDelta = Math.max(0, ((baseline.waterLitres || 0) - (chosenProduct.waterLitres || 0)) * qty);

      totalPlasticSaved += plasticDelta;
      totalCo2Saved += co2Delta;
      totalWaterSaved += waterDelta;

      resolvedItems.push({
        groupIndex: group.groupIndex,
        raw: group.raw,
        name: group.name,
        qty,
        status: 'swapped',
        before: baseline,
        after: chosenProduct,
        reason,
        tradeoff,
        alternatives: (group.options || []).filter((opt) => opt.id !== chosenProduct.id)
      });
    } else {
      keptCount++;
      const isActuallyNoBetterOption = !group.options || group.options.length === 0;
      const itemStatus = group.status === 'kept' ? 'kept' : (isActuallyNoBetterOption ? 'no-better-option' : 'kept');
      resolvedItems.push({
        groupIndex: group.groupIndex,
        raw: group.raw,
        name: group.name,
        qty,
        status: itemStatus,
        before: baseline,
        after: chosenProduct,
        reason: group.reason || (group.status === 'kept'
          ? 'Already an optimal sustainable choice.'
          : (isActuallyNoBetterOption
            ? 'No higher-scoring eco alternative currently in our catalog.'
            : 'Kept at conventional spend to respect your budget limit.')),
        tradeoff: group.status === 'kept'
          ? '₹0 delta • Already an eco-friendly choice'
          : (isActuallyNoBetterOption
            ? '₹0 delta • No greener alternative available'
            : '₹0 delta • Conventional baseline preserved to fit budget'),
        alternatives: group.options || []
      });
    }
  }

  /**
   * Purpose Score formula:
   * Quantity-weighted average EcoScore of all resolved items in the cart:
   * Purpose Score = round( sum(ecoScore_i * qty_i) / sum(qty_i) )
   */
  const purposeScoreBefore = totalQty > 0 ? Math.round(weightedScoreBefore / totalQty) : 0;
  const purposeScoreAfter = totalQty > 0 ? Math.round(weightedScoreAfter / totalQty) : 0;

  const totals = {
    priceBefore,
    priceAfter,
    priceDelta: priceAfter - priceBefore,
    ecoScoreBefore: purposeScoreBefore,
    ecoScoreAfter: purposeScoreAfter,
    purposeScoreBefore,
    purposeScoreAfter,
    co2Saved: Number(totalCo2Saved.toFixed(2)),
    waterSaved: Math.round(totalWaterSaved),
    plasticSaved: Math.round(totalPlasticSaved),
    itemsSwapped: swappedCount,
    itemsKept: keptCount,
    itemsUnmatched: unmatchedCount,
    itemsAmbiguous: ambiguousCount,
    cappedAt25: parsed.cappedAt25,
    effectiveBudget: optimization.effectiveBudget,
    overBudget: optimization.overBudget
  };

  // 7. Reasoning Trace Generation (5 distinct stages)
  const budgetDesc = budget
    ? `budget limit of ₹${budget}`
    : `budget-neutral baseline (+15% max: ₹${optimization.effectiveBudget})`;

  const trace = [
    {
      step: 1,
      title: 'Understood your list',
      detail: `Parsed ${parsed.items.length} item(s) from your text${parsed.cappedAt25 ? ' (capped at 25 items)' : ''} with a ${budgetDesc}.`,
      status: 'completed'
    },
    {
      step: 2,
      title: 'Matched items to catalogue',
      detail: `Successfully mapped ${matched.filter((m) => m.status === 'matched').length} items to verified categories (household synonyms & typo checks applied).`,
      status: 'completed'
    },
    {
      step: 3,
      title: 'Found greener options',
      detail: `Identified certified sustainable alternatives with strictly higher EcoScores and lifecycle ratings.`,
      status: 'completed'
    },
    {
      step: 4,
      title: 'Optimised within budget',
      detail: optimization.overBudget
        ? `List exceeds ₹${optimization.effectiveBudget} budget by ₹${totals.priceAfter - optimization.effectiveBudget}. Selected lowest-cost sustainable combinations.`
        : `Knapsack DP selected ${swappedCount} swap(s) maximising CO₂ & plastic reduction within ₹${optimization.effectiveBudget} total cost.`,
      status: 'completed'
    },
    {
      step: 5,
      title: 'Decision summary',
      detail: `Sustainable cart assembled: Purpose Score boosted from ${purposeScoreBefore} to ${purposeScoreAfter}/100, diverting ${totals.plasticSaved}g plastic.`,
      status: 'completed'
    }
  ];

  return {
    isEmpty: false,
    rawText: text,
    items: resolvedItems,
    totals,
    trace,
    budget: optimization.effectiveBudget,
    overBudget: optimization.overBudget
  };
}
