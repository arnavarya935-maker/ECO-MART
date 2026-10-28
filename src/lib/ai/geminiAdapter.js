/**
 * EcoMart Responsible AI Adapter
 * Swappable interface for LLM calls (Gemini 2.5 Flash via secure backend proxy)
 * with robust offline/cached fallback to guarantee deterministic local reliability.
 */

import { queryEcoCatalog, KNOWN_DICTIONARY, isOffTopicQuery, OFF_TOPIC_ANSWER } from '../ecoAgent.js';
import productsData from '../../data/products.json';

// Curated verified knowledge cache for common sustainable shopping scenarios
const VERIFIED_FALLBACK_ANSWERS = [
  {
    triggers: ['hi', 'hello', 'hey', 'namaste', 'kaise ho', 'good morning', 'good afternoon', 'good evening', 'greetings', 'help'],
    answer:
      "Hello! I am your Eco Sense Shopping Assistant. I'm here to help you find eco-friendly products, avoid single-use plastics, and compare products across our catalog. What would you like to shop or check today?",
    reasoning_summary:
      'Warm conversational greeting welcoming the shopper to conscious shopping choices.',
    sources_or_assumptions: [
      'Eco Sense AI interaction protocol'
    ],
    confidence: 'high',
    estimated_energy_wh: 0.02,
    recommended_categories: ['Kitchen', 'Personal Care', 'Home', 'Bags'],
    suggestedProducts: ['care-01', 'kit-01', 'stat-01']
  },
  {
    triggers: ['bamboo', 'toothbrush', 'brush', 'teeth', 'plastic toothbrush'],
    answer:
      'Swapping a petroleum plastic toothbrush for an FSC-certified organic bamboo toothbrush avoids ~80g of plastic per year. Moso bamboo degrades in backyard compost in ~180 days, whereas polypropylene plastic persists for over 450 years shedding microplastics.',
    reasoning_summary:
      'Evaluated cradle-to-grave raw extraction (Moso bamboo vs petroleum cracking) and backyard compostability standards. Prioritized 100% plastic-free packaging.',
    sources_or_assumptions: [
      'Central Pollution Control Board (CPCB) plastic packaging benchmarks',
      'FSC Certification Standard for sustainable bamboo harvesting',
      'Assumes replacement cycle of 1 brush every 3 months'
    ],
    confidence: 'high',
    estimated_energy_wh: 0.12,
    recommended_categories: ['Personal Care'],
    suggestedProducts: ['pers-01', 'care-01']
  },
  {
    triggers: ['kitchen', 'wrap', 'cling wrap', 'foil', 'food wrap', 'beeswax'],
    answer:
      'Reusable beeswax food wraps made from organic cotton and jojoba oil eliminate single-use LDPE cling wrap. A pack of 3 wraps lasts approximately 120-150 washes and is 100% backyard compostable at end-of-life.',
    reasoning_summary:
      'Calculated multi-use durability offset against petroleum PVC/LDPE sheeting. Identified zero toxic plasticizer leaching into acidic food.',
    sources_or_assumptions: [
      'GOTS (Global Organic Textile Standard) cotton benchmarks',
      'Assumes hand-washing with cool water (hot water melts beeswax coating)'
    ],
    confidence: 'high',
    estimated_energy_wh: 0.11,
    recommended_categories: ['Kitchen'],
    suggestedProducts: ['kit-02']
  },
  {
    triggers: ['gift', 'present', 'birthday', 'under 1000', 'budget'],
    answer:
      'For a conscious gift under ₹1000, consider pairing an Organic Bamboo Cutlery Travel Set (₹349) with a Recycled Seed Paper Notebook (₹299). Both are crafted by regional artisan clusters with zero plastic packaging.',
    reasoning_summary:
      'Applied knapsack budget constraint (Max ₹1000) and maximized combined EcoScore (both items Grade A, EcoScore > 92).',
    sources_or_assumptions: [
      'EcoMart verified artisan catalog dataset',
      'Assumes recipient has access to standard soil/pot for plantable seed paper'
    ],
    confidence: 'high',
    estimated_energy_wh: 0.13,
    recommended_categories: ['Kitchen', 'Stationery'],
    suggestedProducts: ['kit-01', 'stat-01']
  },
  {
    triggers: ['shampoo', 'hair', 'soap', 'neem', 'bottle'],
    answer:
      'Cold-pressed solid shampoo bars eliminate the plastic bottle and the heavy transport emissions of shipping 80% liquid water. One 85g bar replaces approximately two 250ml plastic shampoo bottles.',
    reasoning_summary:
      'Audited concentrated solid formulation vs diluted liquid transit weight. Verified zero sodium lauryl sulfate (SLS) aquatic toxicity.',
    sources_or_assumptions: [
      'Lifecycle transportation density metrics (liquid vs dry concentrate)',
      'Zero plastic container requirement'
    ],
    confidence: 'high',
    estimated_energy_wh: 0.12,
    recommended_categories: ['Personal Care'],
    suggestedProducts: ['care-03']
  }
];

/**
 * Generate fallback answer using local deterministic engine
 */
export function generateLocalFallbackAnswer(query, _language = 'en') {
  if (isOffTopicQuery(query)) {
    return {
      answer: OFF_TOPIC_ANSWER,
      reasoning_summary: 'Friendly redirect to conscious shopping features.',
      sources_or_assumptions: [],
      confidence: 'high',
      estimated_energy_wh: 0,
      recommended_products: [],
      recommended_categories: [],
      isFallback: true,
      isOffTopic: true,
      source: 'local_verified_cache',
      model: 'Built-in helper'
    };
  }

  const lower = query.toLowerCase();

  // 1. Check curated high-confidence answers
  for (const item of VERIFIED_FALLBACK_ANSWERS) {
    if (item.triggers.some((t) => lower.includes(t))) {
      const prods = (item.suggestedProducts || [])
        .map((id) => productsData.find((p) => p.id === id))
        .filter(Boolean);

      return {
        answer: item.answer,
        reasoning_summary: item.reasoning_summary,
        sources_or_assumptions: item.sources_or_assumptions,
        confidence: item.confidence,
        estimated_energy_wh: item.estimated_energy_wh,
        recommended_products: prods,
        recommended_categories: item.recommended_categories || [],
        isFallback: true,
        source: 'local_verified_cache',
        model: 'Eco Sense Offline Engine'
      };
    }
  }

  // 2. Query verified catalog via intelligent multi-token matching
  const hasRecognizedNoun = (KNOWN_DICTIONARY || []).some((term) => lower.includes(term));
  const catalogResponse = queryEcoCatalog(productsData, query);
  const matched = Array.isArray(catalogResponse) ? catalogResponse : (catalogResponse?.results || []);
  const hasNameMatch = matched.some((p) => p.nameMatched);
  const isValidCatalogMatch = (hasRecognizedNoun || hasNameMatch) && matched.length > 0;

  if (isValidCatalogMatch) {
    const topItems = matched.slice(0, 3);
    const itemNames = topItems.map((p) => `"${p.name}" (₹${p.price}, EcoScore: ${p.ecoScore || 90})`).join(', ');
    const answerText = `I found good choices from our catalog: ${itemNames}. Each avoids single-use plastics and uses biodegradable or recyclable materials.`;

    return {
      answer: answerText,
      reasoning_summary: 'Matched against local catalog using keyword tokens and MCDM sustainability scoring.',
      sources_or_assumptions: [
        'Eco Sense Product Catalog (64 sample items)',
        'Deterministic 0–100 EcoScore Lifecycle Formula'
      ],
      confidence: 'high',
      estimated_energy_wh: 0.01,
      recommended_products: topItems,
      recommended_categories: [...new Set(topItems.map((p) => p.category))],
      isFallback: true,
      source: 'local_catalog_engine',
      model: 'Eco Sense Offline Catalog Engine'
    };
  }

  return {
    answer: `I am not sure of a catalog match for "${query}". For sustainable shopping: look for 3rd-party certifications (FSC/GOTS), verify plastic-free packaging, and avoid vague claims like "100% eco-friendly". You can explore categories like Kitchen, Personal Care, Home, or Bags!`,
    reasoning_summary: 'Query had no direct catalog SKU match. Providing helpful category directions and anti-greenwashing guidance.',
    sources_or_assumptions: [
      'Eco Sense Product Catalog (64 sample items)',
      'Deterministic 0–100 EcoScore Lifecycle Formula (ISO 14040 principles)'
    ],
    confidence: 'low',
    estimated_energy_wh: 0.01,
    recommended_products: [],
    recommended_categories: ['Kitchen', 'Personal Care', 'Home', 'Bags'],
    isFallback: true,
    source: 'local_catalog_engine',
    model: 'Eco Sense Smart Rules Engine'
  };
}


/**
 * Main Eco Agent Query Dispatcher
 * Calls the secure backend proxy (/api/agent), falling back gracefully to local verified intelligence.
 */
export async function askEcoAgent({ query, language = 'en', context = {}, mode = null }) {
  if (!query || !query.trim()) {
    return {
      answer: "Please ask a question about sustainable swaps, materials, or product footprints.",
      reasoning_summary: "Empty input received.",
      sources_or_assumptions: [],
      confidence: "low",
      estimated_energy_wh: 0,
      isFallback: true
    };
  }

  if (isOffTopicQuery(query)) {
    return {
      answer: OFF_TOPIC_ANSWER,
      reasoning_summary: 'Friendly redirect to conscious shopping features.',
      sources_or_assumptions: [],
      confidence: 'high',
      estimated_energy_wh: 0,
      recommended_products: [],
      recommended_categories: [],
      isFallback: false,
      isOffTopic: true,
      source: 'local_verified_cache',
      model: 'Built-in helper'
    };
  }

  const isOnline = mode
    ? mode === 'online'
    : (typeof window !== 'undefined'
      ? (localStorage.getItem('ecomart_agent_mode') !== 'offline')
      : true);

  if (!isOnline) {
    return generateLocalFallbackAnswer(query, language);
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const res = await fetch('/api/agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({ query: query.trim(), language, context })
    });

    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data && data.source === 'local_fallback') {
        const fallback = generateLocalFallbackAnswer(query, language);
        return {
          ...fallback,
          fallbackReason: data.reason || 'UNKNOWN'
        };
      }

      if (data && (data.source === 'gemini' || data.source === 'cloud-llm') && (data.answer || data.reply)) {
        const text = data.answer || data.reply;
        // Enriched with catalog items if relevant
        const catRes = queryEcoCatalog(productsData, query);
        const matched = (Array.isArray(catRes) ? catRes : (catRes?.results || [])).slice(0, 3);

        // Strict verification: product prices, EcoScores and numbers always come from our catalogue code.
        // If the cloud model returned any products not in our data, drop them.
        const candidateProducts = Array.isArray(data.recommended_products) && data.recommended_products.length > 0
          ? data.recommended_products
          : matched;

        const verifiedProducts = candidateProducts
          .map((p) => {
            const catalogItem = productsData.find(
              (item) => item.id === p.id || item.name.toLowerCase() === (p.name || '').toLowerCase()
            );
            if (!catalogItem) return null;
            return {
              ...catalogItem
            };
          })
          .filter(Boolean)
          .slice(0, 3);

        return {
          answer: text,
          reasoning_summary: data.reasoning_summary || 'Evaluated via Gemini against environmental impact factors.',
          sources_or_assumptions: Array.isArray(data.sources_or_assumptions)
            ? data.sources_or_assumptions
            : ['Independent lifecycle analysis', 'Packaging benchmarks'],
          confidence: data.confidence || 'high',
          estimated_energy_wh: Number(data.estimated_energy_wh) || 0.12,
          recommended_products: verifiedProducts,
          isFallback: false,
          source: 'gemini',
          model: data.model || 'Gemini'
        };
      }
    }
  } catch (_err) {
    // Network down, timeout (20s), or backend endpoint offline
  }

  // Graceful degradation: local verified fallback
  return generateLocalFallbackAnswer(query, language);
}

/**
 * Greenwashing Detective Dispatcher
 * Calls /api/detect-greenwash with deterministic fallback
 */
export async function auditGreenwashingClaim({ text, language = 'en' }) {
  if (!text || !text.trim()) {
    return {
      trust_score: 50,
      verdict: 'No Claim Provided',
      plain_verdict_explanation: 'Please enter a product packaging claim or marketing label to audit.',
      flagged_phrases: [],
      missing_proofs: [],
      estimated_energy_wh: 0,
      isFallback: true
    };
  }

  const isOnline = typeof window !== 'undefined'
    ? (localStorage.getItem('ecomart_agent_mode') !== 'offline' && (typeof navigator === 'undefined' || navigator.onLine))
    : true;

  if (!isOnline) {
    return generateLocalGreenwashingVerdict(text);
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);

    const res = await fetch('/api/detect-greenwash', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({ text: text.trim(), language })
    });

    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data && data.source === 'gemini' && typeof data.trust_score === 'number') {
        return {
          ...data,
          radar_axes: data.radar_axes || computeClaimRadarAxes(text, data),
          isFallback: false,
          model: data.model || 'Gemini 3 Flash'
        };
      }
    }
  } catch {
    // Network or proxy unavailable
  }

  // Local Rule-Based Detective Heuristics Fallback
  return generateLocalGreenwashingVerdict(text);
}

/**
 * Local Rule-Based Greenwashing Detective Fallback
 */
export function generateLocalGreenwashingVerdict(text) {
  const flagged = [];
  const missing = [];
  let deduction = 0;

  const patterns = [
    {
      regex: /\b(100%\s*(eco-friendly|green|natural|pure))\b/i,
      issue: 'Absolute claims like "100% eco-friendly" violate FTC Green Guides without comprehensive lifecycle proof.'
    },
    {
      regex: /\b(eco-friendly\s*plastic|biodegradable\s*plastic|ocean\s*plastic)\b/i,
      issue: 'Plastic oxo-degradation or generic "ocean plastic" claims often mask microplastic fragmentation.'
    },
    {
      regex: /\b(chemical[\s-]*free)\b/i,
      issue: 'Scientifically misleading: all matter is chemical. Used to instill fear without specifying banned ingredients.'
    },
    {
      regex: /\b(zero[\s-]*harm|clean[\s-]*planet)\b/i,
      issue: 'Unsubstantiated broad environmental benefit claim.'
    }
  ];

  for (const p of patterns) {
    const match = text.match(p.regex);
    if (match) {
      flagged.push({ phrase: match[0], issue: p.issue });
      deduction += 25;
    }
  }

  // Check for presence of real certifications
  const hasCert = /\b(fsc|usda\s*organic|gots|fair\s*trade|india\s*organic|astm\s*d6400|en\s*13432)\b/i.test(text);

  if (!hasCert) {
    missing.push('No verifiable third-party certification number (e.g. FSC, GOTS, USDA Biobased).');
    missing.push('No published laboratory degradation standard (e.g. ISO 14855 / ASTM D6400).');
    deduction += 20;
  }

  const trustScore = Math.max(10, Math.min(100, 100 - deduction));
  let verdict = 'Verified Sustainable';
  let explanation = 'The claim references specific verifiable standards and avoids unqualified broad buzzwords.';

  if (trustScore < 45) {
    verdict = 'High Greenwashing Risk';
    explanation = 'This statement exhibits high greenwashing indicators: vague uncertified buzzwords and zero independent audits.';
  } else if (trustScore < 75) {
    verdict = 'Plausible but Unverified';
    explanation = 'The claim sounds well-intentioned but lacks published third-party chain-of-custody numbers.';
  }

  return {
    trust_score: trustScore,
    verdict,
    plain_verdict_explanation: explanation,
    flagged_phrases: flagged,
    missing_proofs: missing,
    radar_axes: computeClaimRadarAxes(text),
    positive_elements: hasCert ? ['Mentions legitimate certification standards'] : ['Packaging material specified'],
    recommendation: 'Check the back label for official certifier license codes before purchasing.',
    estimated_energy_wh: 0.04,
    isFallback: true,
    source: 'local_heuristic_detective',
    model: 'Eco Sense Rule-Based Detective'
  };
}

/**
 * Computes 5-Axis Environmental Claim Radar Scores (0 to 100)
 */
export function computeClaimRadarAxes(text, _auditResult = null) {
  const lower = (text || '').toLowerCase();

  // 1. Vague Wording (100 = concrete & clear; low = vague buzzwords)
  let vagueScore = 95;
  if (/100%\s*(eco|green|natural|pure)/i.test(lower)) vagueScore -= 35;
  if (/chemical[\s-]*free/i.test(lower)) vagueScore -= 25;
  if (/zero[\s-]*harm|save\s*the\s*earth|clean\s*planet/i.test(lower)) vagueScore -= 25;
  if (/ocean[\s-]*plastic/i.test(lower) && !/certified|recycled\s*\d+%/i.test(lower)) vagueScore -= 20;
  vagueScore = Math.max(10, Math.min(100, vagueScore));

  // 2. Verifiable Proof (100 = backed by accredited lab or LCA benchmark)
  let proofScore = 30;
  if (/astm|en\s*13432|iso\s*14040|iso\s*14021|lab|lca|lifecycle|cpcb/i.test(lower)) proofScore += 50;
  if (/\d+%\s*(recycled|post-consumer|bio-based|organic)/i.test(lower)) proofScore += 20;
  proofScore = Math.max(10, Math.min(100, proofScore));

  // 3. Third-Party Certification (100 = accredited registry citation)
  let certScore = 20;
  if (/fsc|gots|usda\s*organic|fair\s*trade|india\s*organic/i.test(lower)) certScore += 60;
  if (/astm\s*d6400|en\s*13432|tuv\s*austria/i.test(lower)) certScore += 20;
  certScore = Math.max(10, Math.min(100, certScore));

  // 4. Specificity & Material Boundaries
  let specScore = 35;
  if (/bamboo|cotton|jute|kraft|neem|soy\s*wax|glass|aluminum|beeswax/i.test(lower)) specScore += 30;
  if (/\d+(\.\d+)?\s*(g|kg|l|%|days|months)/i.test(lower)) specScore += 25;
  if (/handle|packaging|bristles|coating/i.test(lower)) specScore += 10;
  specScore = Math.max(10, Math.min(100, specScore));

  // 5. Comparison Basis (Disclosing trade-offs without false equivalence)
  let compScore = 40;
  if (/trade-off|however|hand-wash|cold-water|pluck|separate|compost/i.test(lower)) compScore += 40;
  if (/replaces|instead of|compared to/i.test(lower)) compScore += 20;
  compScore = Math.max(10, Math.min(100, compScore));

  return {
    vague_wording: vagueScore,
    proof: proofScore,
    verifiable_proof: proofScore,
    certification: certScore,
    specificity: specScore,
    comparison_basis: compScore
  };
}
