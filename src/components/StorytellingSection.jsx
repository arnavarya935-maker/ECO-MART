import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

const STORY_STAGES = [
  {
    step: '01',
    title: 'The Linear Crisis',
    subtitle: 'From Petrochemicals to Landfill',
    description: 'Conventional consumer goods follow an extractive linear pipeline: crude oil is refined into single-use plastics and packaging that sit in landfills and ocean gyres for over 450 years.',
    stat: '91% of plastic ever made has never been recycled.',
    badge: 'Linear Waste Problem',
    icon: '🛢️',
    cardBorder: 'border-danger/30 bg-danger-subtle'
  },
  {
    step: '02',
    title: 'Regenerative Material Audit',
    subtitle: 'Harvesting Without Extraction',
    description: 'EcoMart items swap petroleum with renewable botanical wonders: fast-growing Moso bamboo, organic beeswax, unbleached cotton canvas, and antimicrobial neem wood.',
    stat: 'Bamboo absorbs 35% more CO₂ than equivalent timber forest stands.',
    badge: 'Raw Material Revolution',
    icon: '🎋',
    cardBorder: 'border-primary/30 bg-primary-subtle'
  },
  {
    step: '03',
    title: 'Decentralized Artisan Empowerment',
    subtitle: 'Handcrafted in Regional Indian Clusters',
    description: 'We partner directly with verified handloom cooperatives and cottage artisans across Tamil Nadu, West Bengal, and Kerala, eliminating middlemen and cross-continent cargo emissions.',
    stat: 'Average transport distance reduced from 8,500km to under 650km.',
    badge: 'Fair Trade & Local',
    icon: '👐',
    cardBorder: 'border-secondary/30 bg-secondary-subtle'
  },
  {
    step: '04',
    title: 'Full Circular Return',
    subtitle: 'Back to Soil in 180 Days',
    description: 'When an item finishes its long useful lifespan, it can be buried in backyard soil or municipal compost. Zero microplastics, zero heavy metal residue—pure biological nutrients.',
    stat: '100% biodegradable packaging breakdown within 180 days.',
    badge: 'Circular Biosphere',
    icon: '🌱',
    cardBorder: 'border-primary/40 bg-surface-accent'
  }
];

export default function StorytellingSection() {
  const [activeStage, setActiveStage] = useState(0);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-subtle text-primary border border-primary/20 text-xs font-sans font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Interactive Storytelling</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-heading tracking-tight">
          From Waste to Wonder
        </h2>
        <p className="font-sans text-xs sm:text-sm text-secondary mt-2">
          Discover how everyday items are reimagined from extractive fossil fuels into circular biological harmony.
        </p>

        {/* Stage Navigation Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {STORY_STAGES.map((st, idx) => (
            <button
              key={st.step}
              type="button"
              onClick={() => setActiveStage(idx)}
              className={`px-4 py-2.5 min-h-[44px] rounded-2xl text-xs font-sans font-medium transition-all flex items-center gap-2 cursor-pointer ${
                activeStage === idx
                  ? 'bg-primary text-text-inverted shadow-soft-sm font-semibold'
                  : 'bg-surface-sunken text-secondary hover:text-heading hover:bg-surface-accent border border-line'
              }`}
            >
              <span className="font-mono text-[11px] opacity-80">{st.step}</span>
              <span className="hidden sm:inline">{st.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Active Stage Showcase Card */}
      <div className={`p-8 sm:p-12 rounded-3xl border transition-all duration-300 shadow-soft-md ${STORY_STAGES[activeStage].cardBorder}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-sans font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-surface-raised text-heading border border-line shadow-soft-sm">
                STAGE {STORY_STAGES[activeStage].step}: {STORY_STAGES[activeStage].badge}
              </span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-heading tracking-tight">
              {STORY_STAGES[activeStage].title}
            </h3>
            <div className="text-sm font-sans font-semibold text-primary">
              {STORY_STAGES[activeStage].subtitle}
            </div>

            <p className="text-sm sm:text-base font-sans text-text leading-relaxed max-w-2xl">
              {STORY_STAGES[activeStage].description}
            </p>

            <div className="p-4 rounded-2xl bg-surface-raised border border-line text-xs sm:text-sm font-sans text-heading inline-block shadow-soft-sm">
              📊 <strong className="font-semibold">Audited Impact:</strong> {STORY_STAGES[activeStage].stat}
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-surface-raised flex items-center justify-center text-7xl shadow-soft-md border-4 border-surface-raised">
              {STORY_STAGES[activeStage].icon}
            </div>
            <div className="flex items-center gap-2 mt-6">
              <button
                type="button"
                onClick={() => setActiveStage((prev) => (prev > 0 ? prev - 1 : STORY_STAGES.length - 1))}
                className="px-4 py-2 min-h-[44px] rounded-xl bg-surface-raised text-heading text-xs font-sans font-medium border border-line hover:bg-surface-sunken cursor-pointer shadow-soft-sm"
              >
                ← Previous
              </button>
              <button
                type="button"
                onClick={() => setActiveStage((prev) => (prev + 1) % STORY_STAGES.length)}
                className="px-4 py-2 min-h-[44px] rounded-xl bg-primary text-text-inverted text-xs font-sans font-medium hover:bg-primary-hover shadow-soft-sm cursor-pointer"
              >
                Next Stage →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

