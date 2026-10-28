/**
 * EcoMart Sustainable Terminology Glossary & Knowledge Base
 * Curated environmental science, lifecycle analysis (LCA), and regulatory definitions.
 * All definitions reference established ISO 14040, FTC Green Guides, or CPCB guidelines.
 */

export const GLOSSARY_TERMS = [
  {
    term: 'Embodied Carbon',
    category: 'Science',
    shortDef: 'Sum of all greenhouse gas emissions during material extraction, manufacture, and transit.',
    fullDef: 'The total greenhouse gas emissions (in kg CO₂ equivalent) generated across the cradle-to-gate lifecycle of a material or product, including mining/harvesting, industrial refining, factory assembly, and freight transport before it reaches the consumer.',
    source: 'ISO 14040 / GHG Protocol Standard',
    registryTip: 'Look for third-party Environmental Product Declarations (EPDs) audited according to EN 15804.'
  },
  {
    term: 'Circular Economy',
    category: 'Framework',
    shortDef: 'An economic system eliminating waste by circulating materials at highest utility.',
    fullDef: 'A regenerative economic framework designed to decouple economic growth from finite resource consumption. Products are purposefully designed for disassembly, repair, refurbishment, remanufacture, and biological composting.',
    source: 'Ellen MacArthur Foundation',
    registryTip: 'Contrast with linear "take-make-waste" industrial models.'
  },
  {
    term: 'Cradle-to-Grave',
    category: 'Science',
    shortDef: 'Full lifecycle assessment from initial raw material extraction to final disposal.',
    fullDef: 'A comprehensive life-cycle assessment (LCA) methodology that accounts for the environmental impacts of a product from the moment raw inputs are extracted (cradle), through production, distribution, customer use, and ultimate landfill, incineration, or recycling (grave).',
    source: 'ISO 14044 Life Cycle Assessment Framework',
    registryTip: 'Eco Sense lifecycle scores are calibrated to cradle-to-grave boundary assumptions.'
  },
  {
    term: 'Post-Consumer Recycled (PCR)',
    category: 'Materials',
    shortDef: 'Materials made from items already used and recycled by households or businesses.',
    fullDef: 'Pelletized polymers, metals, or paper fibers produced exclusively from consumer goods that have fulfilled their intended lifecycle, collected through municipal or commercial waste streams, preventing virgin raw material extraction.',
    source: 'ASTM International D7209 / ISO 14021',
    registryTip: 'Distinct from "pre-consumer" factory floor off-cuts which never reached an actual customer.'
  },
  {
    term: 'GOTS Certified',
    category: 'Certification',
    shortDef: 'Global Organic Textile Standard: certified organic fibers, living wages, non-toxic dyes.',
    fullDef: 'The worldwide leading textile processing standard for organic fibers. Requires at least 95% certified organic crop origin, complete prohibition of toxic heavy-metal dyes, formal wastewater treatment at dyehouses, and verified living wages.',
    source: 'Global Standard gGmbH',
    registryTip: 'Always verify the supplier license code (e.g. GOTS-CU-123456) in the public gots-org registry.'
  },
  {
    term: 'FSC 100% Certified',
    category: 'Certification',
    shortDef: 'Forest Stewardship Council: sustainably harvested timber and bamboo with zero deforestation.',
    fullDef: 'An independent accreditation verifying that wood, bamboo, or paper products originate from forests certified against strict environmental, social, and economic criteria that prohibit deforestation and respect indigenous territorial sovereignty.',
    source: 'Forest Stewardship Council A.C.',
    registryTip: 'Chain-of-Custody (CoC) code format: FSC-C######. Check at info.fsc.org.'
  },
  {
    term: 'Greenwashing',
    category: 'Regulatory',
    shortDef: 'Deceptive marketing exaggerating eco-friendliness without proof.',
    fullDef: 'The practice of making unsubstantiated, vague, or exaggerated environmental marketing claims (e.g. "pure nature", "eco-friendly", "chemical-free") to deceive consumers into believing a product is ecologically beneficial when verifiable evidence is absent.',
    source: 'FTC Green Guides (16 CFR Part 260) & ASCI Guidelines',
    registryTip: 'Look for narrow, qualified claims with concrete measurements over sweeping adjectives.'
  },
  {
    term: 'Microplastics',
    category: 'Pollution',
    shortDef: 'Polymer particles smaller than 5 millimeters shedding into waterways and ecosystems.',
    fullDef: 'Tiny plastic fragments (< 5 mm) originating from synthetic apparel (polyester, nylon, acrylic) during laundry cycles, cosmetic microbeads, or degrading municipal plastic waste that accumulate in ocean food webs and municipal drinking water.',
    source: 'UN Environment Programme (UNEP)',
    registryTip: 'Natural organic fibers like cotton, jute, and hemp biodegrade safely without shedding persistent synthetic polymers.'
  },
  {
    term: 'Biodegradable vs Compostable',
    category: 'Materials',
    shortDef: 'Compostable requires specific conditions to yield non-toxic humus; biodegradable is unregulated.',
    fullDef: '"Biodegradable" simply means a material can be broken down by microorganisms over an unspecified period of time (which could be decades). "Compostable" requires verified breakdown within 90-180 days under controlled temperature/humidity, yielding nutrient-rich humus without chemical residue.',
    source: 'ASTM D6400 / EN 13432 Standards',
    registryTip: 'Check whether a product is certified "Home Compostable" (ambient temperatures) vs "Industrial Facility Only".'
  },
  {
    term: 'Food Miles & Freight Proximity',
    category: 'Logistics',
    shortDef: 'Distance goods travel from production center to consumer, impacting transit emissions.',
    fullDef: 'The distance food, raw materials, or artisan crafts travel from initial extraction/cultivation through manufacturing to the final household destination. Eco Sense rewards regional Indian artisan clusters (< 500 km) for low intra-state transit energy.',
    source: 'Supply Chain Carbon Accounting Standard',
    registryTip: 'Local surface rail and EV freight emit up to 85% less CO₂e per ton-km than air freight.'
  }
];

export const ECO_GLOSSARY_TERMS = GLOSSARY_TERMS;

/**
 * Searches glossary terms by substring match in term, category, or definition
 */
export function searchGlossary(query) {
  if (!query || !query.trim()) return GLOSSARY_TERMS;
  const q = query.toLowerCase().trim();
  return GLOSSARY_TERMS.filter(
    (item) =>
      item.term.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.shortDef.toLowerCase().includes(q) ||
      item.fullDef.toLowerCase().includes(q)
  );
}

/**
 * Finds a specific glossary term by exact or close name match
 */
export function findGlossaryTerm(termName) {
  if (!termName) return null;
  const lower = termName.toLowerCase().trim();
  return (
    GLOSSARY_TERMS.find((t) => t.term.toLowerCase() === lower) ||
    GLOSSARY_TERMS.find((t) => t.term.toLowerCase().includes(lower)) ||
    null
  );
}
