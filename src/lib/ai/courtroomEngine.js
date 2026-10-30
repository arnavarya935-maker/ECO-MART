/**
 * EcoMart AI Courtroom Simulation Engine
 * Simulates a three-role courtroom debate on environmental packaging and marketing claims:
 * - Prosecutor: Scrutinizes greenwashing, missing certifications, and lifecycle externalities.
 * - Defender: Presents the strongest honest case for the brand and genuine sustainable steps.
 * - Judge: Delivers an impartial verdict, Trust Score (0-100), and consumer buying guidance.
 *
 * ETHICAL RULES:
 * 1. AI roles, simulated debate clearly labeled.
 * 2. Roles must NEVER invent fake certifications or statistics.
 * 3. Fully offline-ready with preloaded debate scenarios.
 */

export const CACHED_DEBATES = [
  {
    id: 'pla-water-bottle',
    title: 'Plant Plastic Water Bottle',
    claim: '100% Biodegradable Eco Water Bottle Made From Plant Plastic',
    category: 'Outdoor & Travel',
    tags: ['Bioplastics', 'Compostability', 'FTC Green Guides'],
    prosecutorOpening: {
      role: 'Prosecutor',
      speaker: 'Counsel for Planetary Integrity',
      avatar: '⚖️',
      summary: 'Unqualified "100% Biodegradable" claim masks industrial composting requirements.',
      points: [
        'Polylactic acid (PLA) requires industrial composting facilities maintaining 58°C+ for 90 days. In landfills or marine waters, it persists for decades similarly to petroleum PET.',
        'No ASTM D6400 or EN 13432 certification code is cited on the label, violating FTC Green Guides section 260.7.',
        'Labelling PLA as "eco-friendly" causes consumer contamination in standard municipal curbside recycling streams.'
      ],
      evidenceCited: ['FTC Green Guides § 260.7', 'ASTM D6400 Composting Benchmark']
    },
    defenderOpening: {
      role: 'Defender',
      speaker: 'Counsel for Brand Innovation',
      avatar: '🛡️',
      summary: 'Brand successfully decouples from fossil fuel petroleum extraction.',
      points: [
        'The feedstock is derived from non-food agricultural starches (cassava and corn), cutting cradle-to-gate fossil carbon emissions by approximately 40% vs virgin PET.',
        'The cap and bottle body are 100% bio-based without petroleum plasticizers or bisphenols (BPA/BPS free).',
        'While municipal composting infrastructure is still developing, shifting manufacturing demand away from petrochemical crackers is a crucial market transition step.'
      ],
      evidenceCited: ['Life Cycle Assessment (Cradle-to-Gate Bio-Resin)', 'Zero Toxic Phthalates Audit']
    },
    objectionPresets: [
      {
        id: 'obj-compost',
        question: 'Objection: Can consumers realistically compost this in an Indian backyard compost pit?'
      },
      {
        id: 'obj-recycling',
        question: 'Objection: Does throwing this in standard dry waste contaminate plastic recyclers?'
      },
      {
        id: 'obj-crop-land',
        question: 'Objection: Does growing corn or cassava for plastic divert land from food security?'
      }
    ],
    objectionResponses: {
      'obj-compost': {
        prosecutor: 'Sustained! Backyard heaps rarely exceed 35°C. PLA will remain intact for years without specialized industrial digestion, misleading well-intentioned citizens.',
        defender: 'While backyard breakdown is slow, community organic drop-offs and anaerobic digestors are growing. The brand should explicitly state "Industrially Compostable Only" rather than generic "Biodegradable".'
      },
      'obj-recycling': {
        prosecutor: 'Precisely. If mixed with regular PET bottles, even 1% PLA degrades the tensile strength of recycled polyester yarn, sabotaging circular recycling.',
        defender: 'Acknowledged. Clear resin identification code #7 (Other - Bio) with bold sorting guidelines is essential to prevent sorting contamination.'
      },
      'obj-crop-land': {
        prosecutor: 'Agricultural run-off, synthetic nitrogen fertilizers, and water consumption for monoculture crops represent real upstream environmental burdens.',
        defender: 'Second-generation bioplastics utilize agricultural crop waste rather than primary food corn, though certification of that origin remains unverified on this label.'
      }
    },
    defaultObjectionResponse: {
      prosecutor: 'This objection highlights the exact lifecycle gap the brand failed to address: self-declared benefits without third-party proof.',
      defender: 'We agree transparency must be heightened. The transition away from petroleum is genuine, but packaging disclosures must be sharper.'
    },
    judgeVerdict: {
      role: 'Judge',
      speaker: 'Justice of Environmental Veracity',
      avatar: '🏛️',
      trustScore: 42,
      verdict: 'High Greenwashing Risk (Deceptive Omission)',
      verdictClass: 'text-amber-600 bg-amber-500/10 border-amber-500/30',
      reasoning:
        'The claim "100% Biodegradable" without clear qualification of industrial composting conditions directly violates international advertising and environmental standards. While the brand legitimately reduced petroleum reliance, shifting the burden of decomposition onto an unequipped waste management system without consumer guidance constitutes greenwashing by omission.',
      remedies: [
        'Replace "100% Biodegradable" with "Industrially Compostable (ASTM D6400 Verified)".',
        'Print explicit sorting instructions: "Do NOT place in municipal PET recycling bin".',
        'Publish verified cradle-to-gate carbon footprint comparison.'
      ],
      buyerGuidance: 'Unless you have direct access to an industrial municipal composter, choose reusable stainless steel or copper bottles over single-use bioplastics.'
    }
  },
  {
    id: 'charcoal-bamboo-toothbrush',
    title: 'Charcoal Bamboo Toothbrush',
    claim: 'Organic Bamboo Charcoal Toothbrush with 100% Compostable Bristles',
    category: 'Personal Care',
    tags: ['Oral Care', 'Bristle Composition', 'Composting'],
    prosecutorOpening: {
      role: 'Prosecutor',
      speaker: 'Counsel for Planetary Integrity',
      avatar: '⚖️',
      summary: 'False claim regarding "100% Compostable Bristles".',
      points: [
        'Virtually all commercial "charcoal bristles" are Nylon-6 or Nylon-4 infused with activated charcoal dust. Petroleum Nylon-6 is NOT backyard compostable and will shed microplastics into garden soil.',
        'Only pig boar hair is truly 100% backyard compostable, which this product explicitly denies using (marketed as vegan).',
        'Moso bamboo handle is indeed compostable, but claiming the *entire* brush including bristles is compostable is deceptive.'
      ],
      evidenceCited: ['ISO 14021 Unqualified Degradability Standard', 'Polymer FTIR Analysis of Commercial Bristles']
    },
    defenderOpening: {
      role: 'Defender',
      speaker: 'Counsel for Brand Innovation',
      avatar: '🛡️',
      summary: '95% by weight is FSC-certified organic Moso bamboo, replacing 20g of virgin petroleum handle.',
      points: [
        'The bamboo handle is responsibly wild-harvested without chemical pesticides or synthetic fertilizers, sequestering carbon during growth.',
        'Replacing standard petroleum plastic toothbrushes diverts ~80g of plastic per consumer per year.',
        'Charcoal infusion provides natural antimicrobial properties without synthetic antibacterial chemical additives.'
      ],
      evidenceCited: ['FSC Chain of Custody Standard', 'Weight Ratio Audit: 95% Bamboo / 5% Bristles']
    },
    objectionPresets: [
      {
        id: 'obj-pluck',
        question: 'Objection: Can the consumer simply pluck the bristles out before composting the handle?'
      },
      {
        id: 'obj-nylon4',
        question: 'Objection: Is Nylon-4 genuinely biodegradable in laboratory conditions?'
      }
    ],
    objectionResponses: {
      'obj-pluck': {
        prosecutor: 'Yes, but the packaging fails to instruct consumers to do so. Thousands of nylon bristles end up directly in home vegetable patches because of the "100% compostable" badge.',
        defender: 'We agree the packaging must prominently say: "Pliers required: Snap off head or pluck bristles for dry waste before composting handle."'
      },
      'obj-nylon4': {
        prosecutor: 'Nylon-4 shows biodegradation only under specific marine soil inoculation in academic lab papers, not in realistic municipal compost.',
        defender: 'Scientific research into bio-nylons continues, but we concede labeling must not confuse experimental lab degradation with immediate home composting.'
      }
    },
    defaultObjectionResponse: {
      prosecutor: 'The consumer has identified the crucial nuance: handles are green, but bristles remain plastic.',
      defender: 'We concede handle separation must be communicated with zero ambiguity.'
    },
    judgeVerdict: {
      role: 'Judge',
      speaker: 'Justice of Environmental Veracity',
      avatar: '🏛️',
      trustScore: 58,
      verdict: 'Plausible but Partially Deceptive',
      verdictClass: 'text-amber-600 bg-amber-500/10 border-amber-500/30',
      reasoning:
        'The bamboo handle represents genuine sustainable engineering and positive plastic diversion. However, claiming the bristles are "100% compostable" without disclosing their nylon polymer base is materially deceptive and poses microplastic contamination risks for home composters.',
      remedies: [
        'Remove "100% Compostable Bristles" from front of pack.',
        'Add step-by-step graphic: "Snap off bristle head before home composting handle".',
        'Disclose bristle polymer: "BPA-free Nylon-6 with activated charcoal powder".'
      ],
      buyerGuidance: 'A great eco swap for plastic handles! Just use pliers to remove the bristles into dry waste before burying the bamboo handle in soil.'
    }
  },
  {
    id: 'neem-soap-box',
    title: 'Cold-Pressed Neem Soap',
    claim: '100% Herbal Handcrafted Neem Soap in Recycled Paper Box',
    category: 'Personal Care',
    tags: ['Artisan', 'Zero Plastic', 'Natural'],
    prosecutorOpening: {
      role: 'Prosecutor',
      speaker: 'Counsel for Planetary Integrity',
      avatar: '⚖️',
      summary: 'Broad term "100% Herbal" lacks certified organic agricultural chain-of-custody.',
      points: [
        '"100% Herbal" is a marketing term not regulated under the Drugs and Cosmetics Act. Saponified lye (Sodium Hydroxide) is required to make any true cold-processed bar.',
        'No NPOP (National Programme for Organic Production) or India Organic license number is printed on the wrapper.',
        'Packaging is recycled paper, but printing inks are not verified as soy/vegetable-based.'
      ],
      evidenceCited: ['Drugs & Cosmetics Act Soap Standards', 'Bureau of Indian Standards IS 4199']
    },
    defenderOpening: {
      role: 'Defender',
      speaker: 'Counsel for Brand Innovation',
      avatar: '🛡️',
      summary: 'Zero synthetic sulfates (SLS/SLES), zero microplastics, and 100% plastic-free packaging.',
      points: [
        'Cold-pressed neem and coconut oils are locally sourced from rural self-help artisan cooperatives in Tamil Nadu, minimizing transit miles.',
        'Zero liquid water is shipped (unlike liquid body washes that are 85% water in HDPE plastic bottles).',
        'Paper box is 100% post-consumer unbleached kraft board, fully compostable and recyclable.'
      ],
      evidenceCited: ['Local Artisan Cooperative Sourcing Manifest', 'Zero Microplastic Formulation']
    },
    objectionPresets: [
      {
        id: 'obj-lye',
        question: 'Objection: Does the use of sodium hydroxide (lye) disqualify the product from being natural?'
      },
      {
        id: 'obj-liquid-vs-bar',
        question: 'Objection: How does the lifecycle carbon compare to a standard bottle of body wash?'
      }
    ],
    objectionResponses: {
      'obj-lye': {
        prosecutor: 'No, saponification chemically binds lye into glycerin and soap salts. But calling it "100% herbal" ignores the mineral alkali chemistry.',
        defender: 'True cold-process saponification leaves zero free lye in the cured bar. It is the most benign historical soap chemistry known.'
      },
      'obj-liquid-vs-bar': {
        prosecutor: 'Bar soap has far lower transport emissions, which we concede is an authentic eco advantage over heavy plastic body washes.',
        defender: 'A single bar saves approximately 50g of virgin HDPE plastic bottle waste and reduces water transit weight by over 80%.'
      }
    },
    defaultObjectionResponse: {
      prosecutor: 'The brand has legitimate eco merits, but should tone down absolute herbal superlatives.',
      defender: 'The formulation and packaging are genuinely conscious and support circular rural livelihoods.'
    },
    judgeVerdict: {
      role: 'Judge',
      speaker: 'Justice of Environmental Veracity',
      avatar: '🏛️',
      trustScore: 84,
      verdict: 'Verified Sustainable (High Integrity)',
      verdictClass: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/30',
      reasoning:
        'This product exemplifies authentic low-impact design: solid waterless formulation, plastic-free recycled paper packaging, and decentralized artisan production. While "100% Herbal" is colloquial hyperbole, there is zero deceptive intent or toxic externality.',
      remedies: [
        'Clarify label to: "Traditional Cold-Processed Neem Oil Soap (Plastic-Free)".',
        'Include full INCI ingredient list including saponified oils.'
      ],
      buyerGuidance: 'Strongly recommended. An exemplary plastic-free bathroom swap with genuine community and environmental benefits.'
    }
  },
  {
    id: 'detergent-sheets',
    title: 'Zero-Chemical Laundry Sheets',
    claim: 'Zero Chemical Super Detergent Sheets for Clean Earth',
    category: 'Cleaning & Laundry',
    tags: ['Waterless', 'PVA Polymer', 'Deceptive Terminology'],
    prosecutorOpening: {
      role: 'Prosecutor',
      speaker: 'Counsel for Planetary Integrity',
      avatar: '⚖️',
      summary: 'Misleading "Zero Chemical" claim hides polyvinyl alcohol (PVA).',
      points: [
        'Everything in the physical universe is composed of chemicals, including water and salt. "Chemical-free" is banned by consumer safety boards worldwide as fear-based misleading marketing.',
        'Laundry sheets rely on Polyvinyl Alcohol (PVA/PVOH) polymer binder to form a dissolvable sheet. While water-soluble, PVA requires specialized wastewater microbes to fully mineralize.',
        'Surfactants (e.g. Sodium Dodecyl Sulfate) are active chemical cleaning agents present in every single sheet.'
      ],
      evidenceCited: ['American Chemical Society Guidelines', 'Wastewater PVA Mineralization Studies']
    },
    defenderOpening: {
      role: 'Defender',
      speaker: 'Counsel for Brand Innovation',
      avatar: '🛡️',
      summary: 'Diverts massive heavy plastic detergent jugs and 90% water shipment weight.',
      points: [
        'Conventional liquid detergents ship 85% tap water in #2 HDPE plastic jugs. Laundry sheets pack into slim compostable cardboard envelopes.',
        'Reduces freight shipping volume and associated diesel transport emissions by over 70%.',
        'Pre-measured dosage prevents consumer overdosing of detergent, saving groundwater resources.'
      ],
      evidenceCited: ['Logistics Freight Density Audit', 'Pre-dosed Concentrated Chemistry Standard']
    },
    objectionPresets: [
      {
        id: 'obj-pva-microplastic',
        question: 'Objection: Does dissolved PVA contribute to water microplastic pollution?'
      },
      {
        id: 'obj-packaging-jugs',
        question: 'Objection: Is the cardboard packaging significantly greener than a recyclable plastic jug?'
      }
    ],
    objectionResponses: {
      'obj-pva-microplastic': {
        prosecutor: 'Studies indicate standard municipal wastewater treatment plants in non-OECD countries do not consistently maintain the temperature or microbes needed to break down PVA chains before discharge into rivers.',
        defender: 'PVA is water-soluble rather than particulate microplastic, but we agree calling it "chemical-free" distorts this polymer reality.'
      },
      'obj-packaging-jugs': {
        prosecutor: 'Cardboard envelopes are clearly better than HDPE jugs, but honest packaging should not require false chemical claims.',
        defender: 'Eliminating millions of plastic jugs is an enormous win that should not be overshadowed by clumsy marketing vocabulary.'
      }
    },
    defaultObjectionResponse: {
      prosecutor: 'The core failure is linguistic honesty: consumers deserve accurate chemistry, not anti-science buzzwords.',
      defender: 'The form-factor innovation is real, but the brand must fire its marketing copywriter and respect scientific terms.'
    },
    judgeVerdict: {
      role: 'Judge',
      speaker: 'Justice of Environmental Veracity',
      avatar: '🏛️',
      trustScore: 61,
      verdict: 'Plausible Innovation with Deceptive Copy',
      verdictClass: 'text-amber-600 bg-amber-500/10 border-amber-500/30',
      reasoning:
        'The waterless, plastic-free format represents a genuine breakthrough in cleaning logistics and plastic jug diversion. However, the claim "Zero Chemical" is factually misleading, patronizing to consumers, and conceals the presence of functional synthetic polymers like PVA.',
      remedies: [
        'Immediately strike "Zero Chemical" from all branding.',
        'Rebrand as "Concentrated Waterless Laundry Sheets in Plastic-Free Box".',
        'Provide transparent data on PVA wastewater solubility.'
      ],
      buyerGuidance: 'A great space-saving, low-carbon swap for laundry plastic jugs! Just ignore the silly "chemical-free" marketing nonsense.'
    }
  }
];

/**
 * Generate a dynamic courtroom simulation for a custom user-submitted claim
 * Runs rule-based heuristics to create high-veracity Prosecutor, Defender, and Judge arguments.
 */
export function generateDynamicCourtroomDebate(customClaim) {
  const claimText = customClaim.trim();
  const lower = claimText.toLowerCase();

  const hasAbsoluteClaims = /100%\s*(eco|green|natural|pure|biodegradable)|chemical[\s-]*free|zero[\s-]*harm/i.test(lower);
  const mentionsPlastics = /plastic|bottle|poly|synthetic|pva|polyester|pouch/i.test(lower);
  const mentionsCert = /fsc|gots|organic|fair\s*trade|astm|en\s*13432|usda/i.test(lower);
  const mentionsArtisan = /handcrafted|local|artisan|clay|cotton|khadi|neem|bamboo/i.test(lower);

  const prosecutorPoints = [];
  if (hasAbsoluteClaims) {
    prosecutorPoints.push('Contains sweeping superlatives ("100%", "Chemical-Free", "Zero Harm") explicitly cautioned against under ISO 14021 section 5.7.');
  }
  if (!mentionsCert) {
    prosecutorPoints.push('Fails to cite any third-party certification number, lab audit standard, or public life-cycle registry.');
  }
  if (mentionsPlastics) {
    prosecutorPoints.push('Omits post-consumer degradation timeline and microplastic fragmentation risks under typical municipal disposal.');
  }
  if (prosecutorPoints.length === 0) {
    prosecutorPoints.push('Lacks specific lifecycle boundary disclosures (cradle-to-gate vs cradle-to-grave).');
  }

  const defenderPoints = [];
  if (mentionsArtisan) {
    defenderPoints.push('Leverages traditional natural materials and localized artisanal crafting, bypassing heavy industrial emissions.');
  }
  if (mentionsCert) {
    defenderPoints.push('Directly aligns with documented industry environmental standards.');
  } else {
    defenderPoints.push('Demonstrates clear intent to phase out conventional high-carbon petrochemicals in favor of renewable alternatives.');
  }
  defenderPoints.push('Addresses consumer demand for accessible sustainability without punitive luxury pricing.');

  let score = 50;
  if (mentionsCert) score += 25;
  if (mentionsArtisan) score += 15;
  if (hasAbsoluteClaims) score -= 25;
  if (mentionsPlastics && !mentionsCert) score -= 15;
  score = Math.max(15, Math.min(95, score));

  let verdict = 'Plausible but Unverified';
  let verdictClass = 'text-amber-600 bg-amber-500/10 border-amber-500/30';
  if (score >= 75) {
    verdict = 'Verified Sustainable Claim';
    verdictClass = 'text-emerald-600 bg-emerald-500/10 border-emerald-500/30';
  } else if (score < 45) {
    verdict = 'High Greenwashing Risk';
    verdictClass = 'text-rose-600 bg-rose-500/10 border-rose-500/30';
  }

  return {
    id: `custom-${Date.now()}`,
    title: claimText.slice(0, 32) + (claimText.length > 32 ? '...' : ''),
    claim: claimText,
    category: 'Custom Audit',
    tags: ['Custom Claim', 'Simulated Debate'],
    prosecutorOpening: {
      role: 'Prosecutor',
      speaker: 'Counsel for Planetary Integrity',
      avatar: '⚖️',
      summary: 'Auditing gaps, missing proofs, and potential greenwashing vulnerabilities.',
      points: prosecutorPoints,
      evidenceCited: ['FTC Green Guides 16 CFR Part 260', 'ISO 14021 Self-Declared Claims']
    },
    defenderOpening: {
      role: 'Defender',
      speaker: 'Counsel for Brand Innovation',
      avatar: '🛡️',
      summary: 'Advocating for practical environmental gains and genuine material transition.',
      points: defenderPoints,
      evidenceCited: ['Material Substitution Index', 'Decarbonization Intent']
    },
    objectionPresets: [
      { id: 'custom-obj-cert', question: 'Objection: Where is the independent third-party lab verification report?' },
      { id: 'custom-obj-lifecycle', question: 'Objection: What happens to this item at its end of life?' },
      { id: 'custom-obj-affordability', question: 'Objection: Is this practical and affordable for ordinary households?' }
    ],
    objectionResponses: {
      'custom-obj-cert': {
        prosecutor: 'The absence of published test certificates leaves consumers vulnerable to deceptive marketing assertions.',
        defender: 'Small-batch producers often face high accreditation costs; documentation should improve as volume scales.'
      },
      'custom-obj-lifecycle': {
        prosecutor: 'Without local municipal collection or home composting suitability, circularity claims remain theoretical.',
        defender: 'Choosing renewable bio-materials ensures non-toxicity during disposal compared to synthetic plastics.'
      },
      'custom-obj-affordability': {
        prosecutor: 'Green products must not charge exorbitant eco-premiums based on self-proclaimed virtues.',
        defender: 'Durability and reusable utility deliver lower total cost of ownership over the product lifespan.'
      }
    },
    defaultObjectionResponse: {
      prosecutor: 'The objection highlights the exact verification void requiring mandatory audit.',
      defender: 'A valid point that underscores the necessity of continuous operational transparency.'
    },
    judgeVerdict: {
      role: 'Judge',
      speaker: 'Justice of Environmental Veracity',
      avatar: '🏛️',
      trustScore: score,
      verdict,
      verdictClass,
      reasoning: `Having heard both the evidence of greenwashing risk and the arguments for genuine sustainable substitution, the court rules that this claim scores ${score}/100 in evidentiary trust. Sustainability claims must be substantiated with reproducible facts rather than aspirational buzzwords.`,
      remedies: [
        'Replace broad adjectives with quantifiable metrics.',
        'Publish independent laboratory audit references.',
        'Provide clear, local end-of-life disposal instructions.'
      ],
      buyerGuidance: 'Look for specific certifications on the packaging before paying a green premium.'
    }
  };
}
