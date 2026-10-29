/**
 * EcoMart Transparency & Greenwash Intelligence Engine
 * Deterministic, Local-First, and Grounded in FTC & ASCI Advertising Guidelines.
 */

// Curated database of environmental claims and regulated certification frameworks
export const CERTIFICATIONS_DATABASE = [
  {
    id: 'fsc',
    name: 'FSC (Forest Stewardship Council)',
    issuer: 'Forest Stewardship Council International',
    category: 'Forestry & Wood',
    focus: 'Responsible forestry, protecting biodiversity and indigenous rights.',
    strength: 'High on chain of custody (FSC 100% vs FSC Mix).',
    limitations: 'FSC Mix allows up to 30% uncertified controlled wood. Does not cover chemical bleaching.',
    registryCheckUrl: 'info.fsc.org',
    disclaimer: 'Claimed on label, check the issuer\'s registry.'
  },
  {
    id: 'gots',
    name: 'GOTS (Global Organic Textile Standard)',
    issuer: 'Global Standard gGmbH',
    category: 'Textiles',
    focus: 'Organic fibers, non-toxic processing, fair wastewater treatment, social criteria.',
    strength: 'Gold standard for organic apparel (>=95% certified organic fibers).',
    limitations: 'Does not measure garment use-phase energy or post-consumer recyclability.',
    registryCheckUrl: 'global-standard.org',
    disclaimer: 'Claimed on label, check the issuer\'s registry.'
  },
  {
    id: 'fairtrade',
    name: 'Fairtrade Certified',
    issuer: 'Fairtrade International',
    category: 'Social & Agriculture',
    focus: 'Guaranteed minimum price and social premium for smallholder farmers.',
    strength: 'Protects producer livelihood and prohibits child labour.',
    limitations: 'Focuses primarily on economic fairness; agricultural pesticide limits vary by crop.',
    registryCheckUrl: 'fairtrade.net',
    disclaimer: 'Claimed on label, check the issuer\'s registry.'
  },
  {
    id: 'oeko-tex',
    name: 'OEKO-TEX Standard 100',
    issuer: 'International OEKO-TEX Association',
    category: 'Safety & Chemicals',
    focus: 'Laboratory tested for harmful substances (heavy metals, formaldehyde, pesticides).',
    strength: 'Consumer chemical safety and skin hypoallergenic assurance.',
    limitations: 'Certifies consumer safety, NOT that the cotton was grown organically.',
    registryCheckUrl: 'oeko-tex.com',
    disclaimer: 'Claimed on label, check the issuer\'s registry.'
  },
  {
    id: 'usda-organic',
    name: 'USDA Organic',
    issuer: 'United States Department of Agriculture',
    category: 'Agriculture & Food',
    focus: 'Prohibits synthetic fertilizers, sewage sludge, irradiation, and genetic engineering.',
    strength: 'Strict annual third-party audits of agricultural soil.',
    limitations: 'Does not govern transport carbon or packaging recyclability.',
    registryCheckUrl: 'organic.ams.usda.gov',
    disclaimer: 'Claimed on label, check the issuer\'s registry.'
  },
  {
    id: 'energy-star',
    name: 'Energy Star',
    issuer: 'US EPA / Global Affiliates',
    category: 'Appliances & Tech',
    focus: 'Operational electrical efficiency vs federal minimum standards.',
    strength: 'Rigorous standardized laboratory power testing.',
    limitations: 'Measures operational phase only; ignores embodied carbon in silicon mining.',
    registryCheckUrl: 'energystar.gov',
    disclaimer: 'Claimed on label, check the issuer\'s registry.'
  },
  {
    id: 'leaping-bunny',
    name: 'Leaping Bunny',
    issuer: 'Cruelty Free International',
    category: 'Animal Welfare',
    focus: 'Zero animal testing across all ingredient supplier tiers.',
    strength: 'Fixed cut-off date with mandatory ongoing supply chain audits.',
    limitations: 'Cruelty-free does not mean vegan (can contain beeswax or honey) or biodegradable.',
    registryCheckUrl: 'leapingbunny.org',
    disclaimer: 'Claimed on label, check the issuer\'s registry.'
  },
  {
    id: 'cpcb-recycled',
    name: 'CPCB EPR Plastic Compliance',
    issuer: 'Central Pollution Control Board (India)',
    category: 'Packaging',
    focus: 'Extended Producer Responsibility plastic waste collection and minimum recycled content.',
    strength: 'Mandatory statutory tracking for packaging recyclers.',
    limitations: 'Compliance self-reported annually by producers; collection rates vary by state.',
    registryCheckUrl: 'cpcb.nic.in',
    disclaimer: 'Claimed on label, check the issuer\'s registry.'
  }
];

// Regulated greenwashing lexicon keywords according to ISO 14021 & ASCI Green Claims Code
export const GREENWASH_LEXICON = [
  {
    pattern: /\b(100%\s*natural|all\s*natural|purely\s*natural)\b/i,
    term: '100% Natural',
    category: 'Vague / Meaningless',
    severity: 'high',
    reason: 'Natural does not mean non-toxic or sustainably harvested. Arsenic and petroleum are also natural substances.',
    regulatoryStandard: 'ASCI Code 2024 / FTC § 260.4'
  },
  {
    pattern: /\b(eco[- ]friendly|planet[- ]friendly|earth[- ]friendly|green\b)/i,
    term: 'Eco-Friendly / Green',
    category: 'Broad Unqualified Claim',
    severity: 'high',
    reason: 'Broad terms deceive consumers into believing the item has zero net impact across its entire lifecycle.',
    regulatoryStandard: 'FTC § 260.4 / EU Green Claims Directive'
  },
  {
    pattern: /\b(chemical[- ]free|zero\s*chemicals|no\s*chemicals)\b/i,
    term: 'Chemical Free',
    category: 'Scientifically Impossible',
    severity: 'high',
    reason: 'All matter (water, oxygen, plant cellulose) consists of chemical compounds. Misleads consumers on hazard risks.',
    regulatoryStandard: 'Advertising Standards Council of India'
  },
  {
    pattern: /\b(carbon\s*neutral|net\s*zero)\b/i,
    term: 'Carbon Neutral / Net Zero',
    category: 'Unverified Offset Risk',
    severity: 'medium',
    reason: 'Often relies on unverified future tree planting or cheap avoided-deforestation credits without real gross emissions cuts.',
    regulatoryStandard: 'ISO 14068-1 Carbon Neutrality Standard'
  },
  {
    pattern: /\b(biodegradable)\b/i,
    term: 'Biodegradable (Unqualified)',
    category: 'Misleading End-of-Life',
    severity: 'medium',
    reason: 'Without specifying timescale and environment (industrial facility vs home compost vs landfill where it creates methane), this claim is deceptive.',
    regulatoryStandard: 'FTC § 260.7 / EN 13432'
  },
  {
    pattern: /\b(sustainable)\b/i,
    term: 'Sustainable',
    category: 'Vague buzzword',
    severity: 'medium',
    reason: 'Overused as a lifestyle buzzword without empirical lifecycle metrics, baseline year, or third-party audit.',
    regulatoryStandard: 'UNEP Consumer Information Programme'
  }
];

/**
 * Scan text (such as product name, description, claims) for greenwashing buzzwords
 * @param {string} text
 * @returns {Array} List of matched flagged phrases
 */
export function detectGreenwashPhrases(text) {
  if (!text || typeof text !== 'string') return [];
  const matches = [];

  GREENWASH_LEXICON.forEach((item) => {
    const match = text.match(item.pattern);
    if (match) {
      matches.push({
        matchedText: match[0],
        term: item.term,
        category: item.category,
        severity: item.severity,
        reason: item.reason,
        regulatoryStandard: item.regulatoryStandard
      });
    }
  });

  return matches;
}

export const detectGreenwash = detectGreenwashPhrases;

/**
 * Calculate Brand Transparency Scorecard
 * Measures disclosed lifecycle parameters vs undisclosed gaps.
 * @param {Object} product
 * @returns {Object} Scorecard with score (0-100), grade, disclosed list, and missing list
 */
export function calculateTransparencyScore(product) {
  if (!product || typeof product !== 'object') {
    return {
      score: 0,
      grade: 'F',
      disclosedCount: 0,
      totalTracked: 8,
      disclosed: [],
      missing: [],
      summary: 'No product information available'
    };
  }

  const checklist = [
    {
      id: 'carbon',
      name: 'Embodied Carbon (kg CO₂e)',
      disclosed: typeof product.carbonKg === 'number' && !Number.isNaN(product.carbonKg),
      value: product.carbonKg != null ? `${product.carbonKg} kg CO₂` : null
    },
    {
      id: 'plastic',
      name: 'Plastic Content (g)',
      disclosed: typeof product.plasticGrams === 'number' && !Number.isNaN(product.plasticGrams),
      value: product.plasticGrams != null ? `${product.plasticGrams} g` : null
    },
    {
      id: 'water',
      name: 'Water Footprint (L)',
      disclosed: typeof product.waterLitres === 'number' && !Number.isNaN(product.waterLitres),
      value: product.waterLitres != null ? `${product.waterLitres} L` : null
    },
    {
      id: 'materials',
      name: 'Specific Raw Materials',
      disclosed: Boolean(product.material && product.material.trim().length > 0),
      value: product.material || null
    },
    {
      id: 'provenance',
      name: 'Manufacturing Origin & Distance',
      disclosed: typeof product.madeInKm === 'number' || Boolean(product.origin),
      value: product.origin || (product.madeInKm ? `${product.madeInKm} km` : null)
    },
    {
      id: 'packaging',
      name: 'Packaging Material Breakdown',
      disclosed: Boolean(product.packaging && product.packaging.trim().length > 0),
      value: product.packaging || null
    },
    {
      id: 'disposal',
      name: 'End-of-Life Disposal Route',
      disclosed: Boolean(product.disposal || product.secondLife || product.lifecycle),
      value: product.disposal || 'Disposal advice disclosed'
    },
    {
      id: 'certifications',
      name: 'Auditable Certifications',
      disclosed: Array.isArray(product.certifications) && product.certifications.length > 0,
      value: Array.isArray(product.certifications) ? product.certifications.join(', ') : null
    }
  ];

  const disclosed = checklist.filter((item) => item.disclosed);
  const missing = checklist.filter((item) => !item.disclosed);

  const score = Math.round((disclosed.length / checklist.length) * 100);

  let grade = 'D';
  if (score >= 85) grade = 'A';
  else if (score >= 70) grade = 'B';
  else if (score >= 50) grade = 'C';

  let summary = 'Limited disclosures. Key lifecycle metrics are withheld.';
  if (grade === 'A') {
    summary = 'Exceptional data transparency across cradle-to-grave lifecycle parameters.';
  } else if (grade === 'B') {
    summary = 'Solid environmental disclosure with minor gaps in end-of-life or packaging.';
  } else if (grade === 'C') {
    summary = 'Moderate transparency. Carbon or water footprints rely on estimates.';
  }

  return {
    score,
    grade,
    disclosedCount: disclosed.length,
    totalTracked: checklist.length,
    disclosed,
    missing,
    summary
  };
}

/**
 * Generate a prefilled, structured mailto email asking the brand for missing lifecycle data.
 * Client-side only. Nothing is sent automatically.
 * @param {Object} product
 * @param {Array} missingItems
 * @returns {string} mailto URI
 */
export function generateBrandEmailDraft(product, missingItems = []) {
  if (!product) return '';
  const brandName = product.brand || 'Customer Relations';
  const productName = product.name || 'Your Product';

  const missingList = missingItems.length > 0
    ? missingItems.map((m) => `• ${m.name}`).join('\n')
    : '• Embodied Carbon (cradle-to-gate kg CO₂e)\n• Primary Packaging Material & Recyclability\n• Exact End-of-Life Instructions';

  const subject = encodeURIComponent(`Sustainability Inquiry: Disclosed Environmental Metrics for ${productName}`);
  const body = encodeURIComponent(
`Dear ${brandName} Team,

I am evaluating the purchase of ${productName} on Eco Sense and would appreciate transparency on the following environmental data:

${missingList}

As a conscious shopper, I prefer brands that share clear environmental data and third-party certifications.

Thank you for your commitment to transparent environmental stewardship.

Warm regards,
An Eco Sense Shopper`
  );

  return `mailto:sustainability@${brandName.toLowerCase().replace(/\s+/g, '')}.com?subject=${subject}&body=${body}`;
}

/**
 * Side-by-side claim comparison for two products
 * @param {Object} prodA
 * @param {Object} prodB
 * @returns {Object} Comparative claim diff analysis
 */
export function compareProductClaims(prodA, prodB) {
  if (!prodA || !prodB) return null;

  const textA = `${prodA.name || ''} ${prodA.description || ''} ${(prodA.claims || []).join(' ')}`;
  const textB = `${prodB.name || ''} ${prodB.description || ''} ${(prodB.claims || []).join(' ')}`;

  const flagsA = detectGreenwashPhrases(textA);
  const flagsB = detectGreenwashPhrases(textB);

  const transA = calculateTransparencyScore(prodA);
  const transB = calculateTransparencyScore(prodB);

  let recommendation = 'Both products maintain comparable levels of disclosure.';
  if (transA.score > transB.score + 15) {
    recommendation = `${prodA.name} provides significantly clearer lifecycle disclosures with fewer unverified buzzwords.`;
  } else if (transB.score > transA.score + 15) {
    recommendation = `${prodB.name} provides significantly clearer lifecycle disclosures with fewer unverified buzzwords.`;
  }

  return {
    productA: {
      id: prodA.id,
      name: prodA.name,
      transparency: transA,
      flaggedPhrases: flagsA,
      claimCount: (prodA.claims || []).length
    },
    productB: {
      id: prodB.id,
      name: prodB.name,
      transparency: transB,
      flaggedPhrases: flagsB,
      claimCount: (prodB.claims || []).length
    },
    recommendation
  };
}
