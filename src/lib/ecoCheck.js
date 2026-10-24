/**
 * Eco Check - External Product Sustainability Analyzer
 * Local-First Heuristic Analyzer
 *
 * Evaluates any product description or claims pasted by the user,
 * detects greenwashing, calculates an estimated EcoScore with confidence level,
 * identifies red flags / green signals, and maps to sustainable catalog alternatives.
 */

import { CATEGORY_KEYWORDS } from './ecoAgent.js';
import { rankProducts, DEFAULT_PRIORITIES } from './decisionEngine.js';
import { calculateEcoScore } from './ecoScore.js';

const NATURAL_MATERIALS = [
  'bamboo', 'organic cotton', 'cotton', 'hemp', 'jute', 'linen', 'cork',
  'steel', 'stainless steel', 'glass', 'wood', 'clay', 'terracotta', 'brass',
  'copper', 'beeswax', 'coconut', 'salvaged', 'reclaimed', 'cotton rag',
  'khadi', 'ahimsa silk', 'shea butter', 'loofah', 'soapnut'
];

const SYNTHETIC_MATERIALS = [
  'plastic', 'polyester', 'nylon', 'acrylic', 'polyurethane', 'pvc', 'vinyl',
  'polystyrene', 'styrofoam', 'melamine', 'virgin plastic', 'pet', 'polypropylene',
  'synthetic', 'microfiber', 'rayon', 'spandex'
];

const GREEN_PACKAGING = [
  'plastic-free', 'zero plastic', 'cardboard', 'glass jar', 'paper box',
  'compostable', 'seed paper', 'tin', 'aluminum can', 'recycled carton', 'jute pouch'
];

const PLASTIC_PACKAGING = [
  'plastic wrap', 'blister pack', 'bubble wrap', 'plastic pouch', 'polybag',
  'single-use plastic', 'shrink wrap', 'plastic bottle'
];

const CERTIFICATIONS_DICT = [
  'gots', 'fsc', 'fair trade', 'usda organic', 'oeko-tex', 'cradle to cradle',
  'zero waste', 'rainforest alliance', 'b corp', 'ecocert', 'cruelty-free', 'leaping bunny'
];

const BUZZWORDS = [
  '100% eco friendly', '100% eco-friendly', 'all natural', 'pure', 'green',
  'earth friendly', 'eco friendly', 'eco-friendly', 'eco safe', 'sustainable',
  'biodegradable', 'chemical free', 'chemical-free', 'non toxic', 'non-toxic',
  'clean beauty', 'planet friendly', 'bpa free', 'bpa-free', 'environmentally friendly'
];

/**
 * Heuristically parses and evaluates an external product description
 * @param {string} text - User inputted product name, spec, or claims
 * @param {Object} [userPriorities] - Active weights from Decision Engine
 * @param {Array} [allProducts] - Full catalog items
 * @returns {Object} Analysis results
 */
export function analyzeExternalProduct(text, userPriorities = DEFAULT_PRIORITIES, allProducts = []) {
  if (!text || typeof text !== 'string') {
    return {
      isVague: true,
      clarification: {
        question: "Please enter a product name, material, or packaging claims to analyze.",
        chips: [
          "Plastic water bottle, eco friendly, BPA free",
          "GOTS certified organic cotton t-shirt",
          "Polyester fleece jacket with recycled zipper",
          "Bamboo toothbrush in cardboard box"
        ]
      }
    };
  }

  const clean = text.trim();
  const lower = clean.toLowerCase();

  // 1. Check for overly vague inputs (e.g. single generic word or very short)
  const words = lower.match(/[a-z0-9]+/g) || [];
  if (clean.length < 5 || (words.length === 1 && !NATURAL_MATERIALS.includes(words[0]) && !SYNTHETIC_MATERIALS.includes(words[0]))) {
    return {
      isVague: true,
      rawInput: clean,
      clarification: {
        question: `Could you share a few more details about "${clean}"? For example, its material, packaging, or brand claims.`,
        chips: [
          `${clean} in plastic-free packaging`,
          `${clean} made of bamboo or organic cotton`,
          `${clean} with GOTS or FSC certification`
        ]
      }
    };
  }

  // 2. Extract detected signals
  const detectedNatural = NATURAL_MATERIALS.filter((m) => lower.includes(m));
  const withoutPlasticFree = lower.replace(/plastic-free|zero\s*plastic|non-plastic/g, '');
  const detectedSynthetic = SYNTHETIC_MATERIALS.filter((m) => {
    if (m === 'plastic') {
      return withoutPlasticFree.includes('plastic');
    }
    return lower.includes(m);
  });
  const detectedGreenPackaging = GREEN_PACKAGING.filter((p) => lower.includes(p));
  const detectedPlasticPackaging = PLASTIC_PACKAGING.filter((p) => lower.includes(p));
  const detectedCerts = CERTIFICATIONS_DICT.filter((c) => lower.includes(c));
  const detectedBuzzwords = BUZZWORDS.filter((b) => lower.includes(b));

  const redFlags = [];
  const greenSignals = [];

  // Check greenwashing: buzzwords present without certifications or with plastic
  const hasPlastic = detectedSynthetic.length > 0;
  const hasCerts = detectedCerts.length > 0;
  const hasBuzzwords = detectedBuzzwords.length > 0;

  if (hasPlastic) {
    redFlags.push(`Contains synthetic polymer material: ${detectedSynthetic.join(', ')}`);
  }

  if (detectedPlasticPackaging.length > 0) {
    redFlags.push(`Non-biodegradable packaging detected: ${detectedPlasticPackaging.join(', ')}`);
  }

  if (hasBuzzwords && hasPlastic) {
    redFlags.push(
      `Greenwashing Alert: Claims "${detectedBuzzwords.slice(0, 2).join(' / ')}" despite containing petroleum-based ${detectedSynthetic[0]}`
    );
  } else if (hasBuzzwords && !hasCerts) {
    redFlags.push(
      `Unverified environmental claims: mentions "${detectedBuzzwords[0]}" without standard third-party certification (e.g. GOTS, FSC, Fair Trade)`
    );
  }

  if (!hasCerts && !hasPlastic && detectedNatural.length === 0) {
    redFlags.push('No independent environmental certifications or material origins disclosed');
  }

  // Green signals
  if (detectedCerts.length > 0) {
    greenSignals.push(`Verified third-party certification: ${detectedCerts.map((c) => c.toUpperCase()).join(', ')}`);
  }

  if (detectedNatural.length > 0) {
    greenSignals.push(`Renewable or natural material: ${detectedNatural.join(', ')}`);
  }

  if (detectedGreenPackaging.length > 0) {
    greenSignals.push(`Low-impact packaging: ${detectedGreenPackaging.join(', ')}`);
  }

  // 3. Compute Estimated EcoScore
  let estimatedScore = 50;

  if (detectedNatural.length > 0) {
    estimatedScore += 22;
  }
  if (detectedSynthetic.length > 0) {
    estimatedScore -= 30;
  }
  if (detectedCerts.length > 0) {
    estimatedScore += 18;
  }
  if (detectedGreenPackaging.length > 0) {
    estimatedScore += 10;
  }
  if (detectedPlasticPackaging.length > 0) {
    estimatedScore -= 15;
  }
  if (hasBuzzwords && hasPlastic) {
    estimatedScore -= 12;
  }

  // Clamp estimated score between 12 and 96
  estimatedScore = Math.max(12, Math.min(96, estimatedScore));

  let grade = 'C';
  if (estimatedScore >= 85) grade = 'A';
  else if (estimatedScore >= 70) grade = 'B';
  else if (estimatedScore >= 55) grade = 'C';
  else if (estimatedScore >= 40) grade = 'D';
  else grade = 'E';

  // Confidence assessment
  let confidence = 'low';
  const signalCount =
    detectedNatural.length +
    detectedSynthetic.length +
    detectedCerts.length +
    detectedGreenPackaging.length +
    detectedPlasticPackaging.length;

  if (signalCount >= 3 || (detectedCerts.length > 0 && (detectedNatural.length > 0 || detectedSynthetic.length > 0))) {
    confidence = 'high';
  } else if (signalCount >= 1) {
    confidence = 'medium';
  }

  // 4. Map to closest catalog category
  let matchedCategory = 'Personal Care';
  for (const [cat, kws] of Object.entries(CATEGORY_KEYWORDS)) {
    if (kws.some((kw) => lower.includes(kw))) {
      matchedCategory = cat;
      break;
    }
  }

  // 5. Recommend up to 3 catalogue alternatives using user's active priorities
  const ecoCandidates = (allProducts || []).filter(
    (p) => p.isEcoFriendly && (p.category === matchedCategory || matchedCategory === 'All')
  );

  // If no category candidates, fallback to all eco items
  const pool = ecoCandidates.length > 0 ? ecoCandidates : (allProducts || []).filter((p) => p.isEcoFriendly);
  const ranked = rankProducts(pool, userPriorities);
  const alternatives = ranked.slice(0, 3).map((alt) => {
    // Estimate savings vs external item
    const extPlastic = hasPlastic ? 120 : (detectedSynthetic.length > 0 ? 80 : 25);
    const extCarbon = hasPlastic ? 2.6 : 1.8;

    const plasticSaved = Math.max(0, extPlastic - (alt.plasticGrams ?? 0));
    const carbonSaved = Math.max(0, Math.round((extCarbon - (alt.carbonKg ?? 0.5)) * 100) / 100);

    return {
      ...alt,
      estimatedPlasticSavedGrams: plasticSaved,
      estimatedCo2SavedKg: carbonSaved,
      ecoScoreData: calculateEcoScore(alt)
    };
  });

  // 6. Evidence Grades A through D (Feature 14)
  let evidenceGrade = 'C';
  let evidenceReason = '';
  if (detectedCerts.length >= 2 || (detectedCerts.length >= 1 && detectedNatural.length > 0 && !hasPlastic)) {
    evidenceGrade = 'A';
    evidenceReason = 'Grade A (Strong Substantiation): Backed by recognized independent third-party certifications and published lifecycle factors.';
  } else if (detectedCerts.length >= 1 || (detectedNatural.length > 0 && detectedGreenPackaging.length > 0 && !hasPlastic)) {
    evidenceGrade = 'B';
    evidenceReason = 'Grade B (Moderate Substantiation): Declared renewable material profile with standard low-impact packaging; independent registry lookup advised.';
  } else if (hasBuzzwords && (hasPlastic || detectedPlasticPackaging.length > 0)) {
    evidenceGrade = 'D';
    evidenceReason = 'Grade D (High Greenwash Risk / Unsubstantiated): Vague buzzwords contradicted by synthetic polymers or non-recyclable packaging.';
  } else {
    evidenceGrade = 'C';
    evidenceReason = 'Grade C (Weak Substantiation): Brand marketing assertions without verifiable third-party certification citations.';
  }

  // 7. Structured Claim Evidence Graph (Feature 13)
  const evidenceGraph = {
    claims: (detectedBuzzwords.length > 0 ? detectedBuzzwords : ['Sustainability Claim']).map((bw, i) => ({
      id: `claim-${i}`,
      label: `"${bw}"`,
      type: 'claim'
    })),
    audits: [
      {
        id: 'audit-material',
        label: detectedNatural.length > 0 ? `Natural: ${detectedNatural.join(', ')}` : hasPlastic ? `Synthetic: ${detectedSynthetic.join(', ')}` : 'Material: Unspecified',
        status: hasPlastic ? 'fail' : detectedNatural.length > 0 ? 'pass' : 'neutral'
      },
      {
        id: 'audit-packaging',
        label: detectedGreenPackaging.length > 0 ? `Packaging: ${detectedGreenPackaging.join(', ')}` : detectedPlasticPackaging.length > 0 ? `Packaging: ${detectedPlasticPackaging.join(', ')}` : 'Packaging: Unspecified',
        status: detectedPlasticPackaging.length > 0 ? 'fail' : detectedGreenPackaging.length > 0 ? 'pass' : 'neutral'
      },
      {
        id: 'audit-cert',
        label: detectedCerts.length > 0 ? `Registry: ${detectedCerts.join(', ').toUpperCase()}` : 'Registry: Zero Third-Party Certs',
        status: detectedCerts.length > 0 ? 'pass' : 'warning'
      }
    ],
    verdict: {
      grade: evidenceGrade,
      reason: evidenceReason,
      isGreenwashFlagged: evidenceGrade === 'D' || (hasBuzzwords && hasPlastic)
    }
  };

  return {
    isVague: false,
    rawInput: clean,
    estimatedScore,
    estimatedGrade: grade,
    evidenceGrade,
    evidenceReason,
    evidenceGraph,
    confidence, // 'low' | 'medium' | 'high'
    isEstimate: true,
    matchedCategory,
    redFlags,
    greenSignals,
    detectedMaterials: [...detectedNatural, ...detectedSynthetic],
    detectedCerts,
    detectedBuzzwords,
    alternatives,
    summary:
      grade === 'A' || grade === 'B'
        ? `This product displays strong sustainability indicators with an estimated EcoScore of ${estimatedScore}/100 (Grade ${grade}, Evidence Grade ${evidenceGrade}).`
        : `Caution recommended: contains flags such as ${redFlags[0] || 'synthetic materials'} with an estimated EcoScore of ${estimatedScore}/100 (Grade ${grade}, Evidence Grade ${evidenceGrade}).`
  };
}
