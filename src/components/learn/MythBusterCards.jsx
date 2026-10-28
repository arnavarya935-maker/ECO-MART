import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen
} from 'lucide-react';

const DETAILED_MYTHS = [
  {
    id: 'myth-bioplastic',
    category: 'Packaging',
    myth: '“Compostable plastics break down safely in standard municipal landfills.”',
    verdict: 'Scientifically False',
    scientificTruth:
      'Compostable bioplastics (such as polylactic acid / PLA) require high-temperature industrial composting environments (58°C+, high humidity, and continuous aeration). In airtight anaerobic municipal landfills, they decompose extremely slowly over decades and produce potent methane greenhouse gas instead of harmless humus.',
    source: 'Federal Trade Commission (FTC) Green Guides § 260.7 & UNEP Bioplastics Assessment',
    actionableTip:
      'Only purchase bioplastics if your city or residential society has certified industrial wet organics composting.'
  },
  {
    id: 'myth-paper-vs-plastic',
    category: 'Shopping',
    myth: '“Kraft paper bags are unconditionally greener than thin plastic bags.”',
    verdict: 'Nuanced / Breakeven Required',
    scientificTruth:
      'Manufacturing a kraft paper bag consumes 3x to 4x more freshwater and energy than an equivalent thin HDPE plastic bag due to tree harvesting, chemical wood pulping, and high transport weight. A paper bag must be reused at least 4 to 8 times before its cradle-to-grave emissions drop below a single plastic bag.',
    source: 'UK Environment Agency Life Cycle Assessment of Supermarket Carrier Bags',
    actionableTip:
      'Always reuse the bag you already have (cotton, paper, or plastic) as many dozens of times as possible.'
  },
  {
    id: 'myth-chasing-arrows',
    category: 'Recycling',
    myth: '“The chasing-arrows mobius loop symbol means a package will be recycled by your municipal bin.”',
    verdict: 'Deceptive Marketing',
    scientificTruth:
      'The triangular mobius loop symbol was co-opted in the 1980s as the Resin Identification Code (RIC) system to identify plastic polymer types (e.g. #7 Other, #3 PVC). It indicates chemical resin composition, NOT whether municipal material recovery facilities (MRFs) have machinery or economic buyers to actually recycle that package.',
    source: 'ASTM International D7611 & Basel Action Network Waste Stream Audits',
    actionableTip:
      'In India and globally, #1 PET and #2 HDPE have high collection rates; avoid unnumbered mixed multilayer plastic pouches.'
  },
  {
    id: 'myth-bamboo-viscose',
    category: 'Textiles',
    myth: '“Bamboo fabric is always a pure natural chemical-free material.”',
    verdict: 'Misleading Greenwash',
    scientificTruth:
      'While raw bamboo grass grows rapidly without pesticides, transforming tough bamboo culms into silky clothing fibers almost always uses the conventional viscose/rayon chemical process. This dissolves cellulose with toxic carbon disulfide, sodium hydroxide, and sulfuric acid unless certified as closed-loop lyocell (TENCEL™).',
    source: 'US FTC Enforcement Warnings on Bamboo Rayon Labeling',
    actionableTip:
      'Look for "Mechanically processed bamboo linen" or "Closed-loop Bamboo Lyocell"; reject uncertified "bamboo viscose".'
  },
  {
    id: 'myth-electric-drying',
    category: 'Household',
    myth: '“Tumble dryers with eco-mode consume negligible energy.”',
    verdict: 'Factually Inaccurate',
    scientificTruth:
      'Electric tumble drying remains one of the single most energy-intensive appliances in modern homes, accounting for up to 60% of an apparel garment’s lifetime carbon emissions. In tropical climates like India, solar line-drying consumes 0 kilowatt-hours and UV sunlight provides natural antibacterial sterilization.',
    source: 'Bureau of Energy Efficiency (BEE) India Residential Energy Survey',
    actionableTip:
      'Line-dry garments on natural jute or stainless steel racks in ambient breezes whenever weather permits.'
  }
];

export default function MythBusterCards() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedId, setExpandedId] = useState(DETAILED_MYTHS[0].id);

  const categories = ['All', 'Packaging', 'Shopping', 'Recycling', 'Textiles', 'Household'];

  const filteredMyths =
    selectedCategory === 'All'
      ? DETAILED_MYTHS
      : DETAILED_MYTHS.filter((m) => m.category === selectedCategory);

  return (
    <div className="space-y-6 text-left">
      {/* Category Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-raised p-4 rounded-2xl border border-line shadow-soft-xs">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-heading">Filter by Domain:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-contrast font-bold shadow-soft-xs'
                  : 'bg-surface-sunken text-secondary hover:text-heading border border-line'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        {filteredMyths.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className="bg-surface-raised rounded-3xl border border-line shadow-soft-xs overflow-hidden transition-all text-left"
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer hover:bg-surface-sunken/40 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/30">
                      {item.verdict}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-heading">
                    {item.myth}
                  </h3>
                </div>

                <button
                  type="button"
                  className="p-1 rounded-xl text-muted hover:text-heading shrink-0 mt-1"
                  aria-label={isExpanded ? 'Collapse explanation' : 'Expand explanation'}
                >
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {isExpanded && (
                <div className="px-5 sm:px-6 pb-6 pt-1 space-y-4 border-t border-line/60 bg-surface/40 animate-fade-in">
                  <div className="p-4 rounded-2xl bg-surface-sunken border border-line space-y-2">
                    <div className="font-bold text-xs text-heading flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span>The Scientific Lifecycle Reality:</span>
                    </div>
                    <p className="text-xs text-secondary leading-relaxed font-sans">
                      {item.scientificTruth}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-muted pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-heading">Scientific Source:</span>
                      <span>{item.source}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs text-primary font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4 shrink-0 text-primary" />
                    <div>
                      <strong className="text-heading">Actionable Guideline: </strong>
                      <span className="text-secondary">{item.actionableTip}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
