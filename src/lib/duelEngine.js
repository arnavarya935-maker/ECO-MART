/**
 * Human vs AI Greenwashing Duel Engine
 * Curated labeled dataset of environmental claims with ground truth verdicts and audit traces.
 */

export const DUEL_CLAIMS = [
  {
    id: 'duel-01',
    claim: '100% Eco-Friendly water bottle made with pure ocean-bound plastic, completely chemical-free and zero harm to nature.',
    statement: '100% Eco-Friendly water bottle made with pure ocean-bound plastic, completely chemical-free and zero harm to nature.',
    productName: 'OceanSparkle Hydration Flask',
    isGreenwashing: true,
    aiTrustScore: 22,
    aiVerdict: 'Greenwash Flagged (Trust Score: 22/100)',
    groundTruth: 'GREENWASHING',
    violatesStandard: 'FTC Green Guides & ISO 14021',
    reasoning:
      'Absolute claims ("100% eco-friendly", "zero harm") violate FTC Green Guides. The term "chemical-free" is scientifically impossible. Ocean-bound plastic claim lacks accredited chain-of-custody (OBP) certification.',
    flaggedPhrases: ['100% eco-friendly', 'chemical-free', 'zero harm to nature'],
    missingProof: ['OceanBound Plastic (OBP) certificate', 'Lab migration testing for food safety']
  },
  {
    id: 'duel-02',
    claim: 'FSC-Certified Moso bamboo toothbrush with castor oil bio-bristles, packaged in 100% post-consumer recycled unbleached kraft paper.',
    statement: 'FSC-Certified Moso bamboo toothbrush with castor oil bio-bristles, packaged in 100% post-consumer recycled unbleached kraft paper.',
    productName: 'TerraRoot Bamboo Toothbrush',
    isGreenwashing: false,
    aiTrustScore: 94,
    aiVerdict: 'High Trust Claim (Trust Score: 94/100)',
    groundTruth: 'LEGITIMATE',
    violatesStandard: 'None (Fully Compliant)',
    reasoning:
      'Cites specific regenerative botanical species (Moso bamboo), names specific bristle chemistry (castor oil bio-based polymer), provides FSC third-party forestry standard, and specifies post-consumer recycled paper.',
    flaggedPhrases: [],
    missingProof: []
  },
  {
    id: 'duel-03',
    claim: 'All-natural herbal miracle dish wash: completely non-toxic and guaranteed to eliminate 100% of household carbon footprint.',
    statement: 'All-natural herbal miracle dish wash: completely non-toxic and guaranteed to eliminate 100% of household carbon footprint.',
    productName: 'EcoMiracle Kitchen Suds',
    isGreenwashing: true,
    aiTrustScore: 18,
    aiVerdict: 'Greenwash Flagged (Trust Score: 18/100)',
    groundTruth: 'GREENWASHING',
    violatesStandard: 'Comparative Equivalence Guidance',
    reasoning:
      'False equivalence and exaggerated claims. Washing dishes cannot eliminate a household\'s total carbon emissions. "Non-toxic" and "miracle" are unqualified marketing puffery without safety data sheets (MSDS).',
    flaggedPhrases: ['all-natural', 'miracle', 'eliminate 100% of household carbon footprint'],
    missingProof: ['Independent aquatic toxicity assessment', 'OECD 301B biodegradability test']
  },
  {
    id: 'duel-04',
    claim: 'GOTS-Certified organic cotton produce bags, handwoven by regional artisan clusters with zero synthetic chemical sizing agents.',
    statement: 'GOTS-Certified organic cotton produce bags, handwoven by regional artisan clusters with zero synthetic chemical sizing agents.',
    productName: 'Artisan Loom Produce Totes',
    isGreenwashing: false,
    aiTrustScore: 92,
    aiVerdict: 'High Trust Claim (Trust Score: 92/100)',
    groundTruth: 'LEGITIMATE',
    violatesStandard: 'None (Fully Compliant)',
    reasoning:
      'GOTS (Global Organic Textile Standard) is an accredited global standard ensuring organic fiber integrity and fair working conditions across the supply chain.',
    flaggedPhrases: [],
    missingProof: []
  },
  {
    id: 'duel-05',
    claim: 'Revolutionary bioplastic cutlery: completely decomposes in just 5 days inside standard municipal landfills.',
    statement: 'Revolutionary bioplastic cutlery: completely decomposes in just 5 days inside standard municipal landfills.',
    productName: 'QuickMelt PLA Cutlery',
    isGreenwashing: true,
    aiTrustScore: 26,
    aiVerdict: 'Greenwash Flagged (Trust Score: 26/100)',
    groundTruth: 'GREENWASHING',
    violatesStandard: 'ASTM D6400 Composting Rules',
    reasoning:
      'Municipal landfills are anaerobic environments lacking oxygen, heat, and active composting bacteria. PLA bioplastics persist for decades in landfills without commercial industrial composting facilities (ASTM D6400).',
    flaggedPhrases: ['completely decomposes in just 5 days', 'inside standard municipal landfills'],
    missingProof: ['Industrial composting facility validation (ASTM D6400 or EN 13432)']
  }
];

export function evaluateDuelGuess(claimId, userGuess) {
  const claim = DUEL_CLAIMS.find((c) => c.id === claimId);
  if (!claim) return { userAgreesWithTruth: false, pointsEarned: 0 };

  const isUserGuessingGreenwashing =
    userGuess === 'yes' ||
    userGuess === true ||
    userGuess === 'GREENWASHING' ||
    userGuess === 'flag';

  const userAgreesWithTruth = isUserGuessingGreenwashing === claim.isGreenwashing;

  return {
    claim,
    userAgreesWithTruth,
    pointsEarned: userAgreesWithTruth ? 100 : 0,
    aiAgreesWithTruth: true,
    explanation: claim.reasoning
  };
}
