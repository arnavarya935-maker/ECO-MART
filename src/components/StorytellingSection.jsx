import React, { useState } from 'react';
import { ArrowRight, Sparkles, RefreshCw, Layers, ShieldCheck, Heart, Leaf } from 'lucide-react';
import Button from './ui/Button';

const STORY_STAGES = [
  {
    step: '01',
    title: 'The Linear Crisis',
    subtitle: 'From Petrochemicals to Landfill',
    description: 'Conventional consumer goods follow an extractive linear pipeline: crude oil is refined into single-use plastics and packaging that sit in landfills and ocean gyres for over 450 years.',
    stat: '91% of plastic ever made has never been recycled.',
    badge: 'Linear Waste Problem',
    icon: '🛢️',
    color: 'border-rose-300 dark:border-rose-900 bg-rose-50/60 dark:bg-rose-950/20'
  },
  {
    step: '02',
    title: 'Regenerative Material Audit',
    subtitle: 'Harvesting Without Extraction',
    description: 'EcoMart items swap petroleum with renewable botanical wonders: fast-growing Moso bamboo, organic beeswax, unbleached cotton canvas, and antimicrobial neem wood.',
    stat: 'Bamboo absorbs 35% more CO₂ than equivalent timber forest stands.',
    badge: 'Raw Material Revolution',
    icon: '🎋',
    color: 'border-emerald-300 dark:border-emerald-900 bg-emerald-50/60 dark:bg-emerald-950/20'
  },
  {
    step: '03',
    title: 'Decentralized Artisan Empowerment',
    subtitle: 'Handcrafted in Regional Indian Clusters',
    description: 'We partner directly with verified handloom cooperatives and cottage artisans across Tamil Nadu, West Bengal, and Kerala, eliminating middlemen and cross-continent cargo emissions.',
    stat: 'Average transport distance reduced from 8,500km to under 650km.',
    badge: 'Fair Trade & Local',
    icon: '👐',
    color: 'border-teal-300 dark:border-teal-900 bg-teal-50/60 dark:bg-teal-950/20'
  },
  {
    step: '04',
    title: 'Full Circular Return',
    subtitle: 'Back to Soil in 180 Days',
    description: 'When an item finishes its long useful lifespan, it can be buried in backyard soil or municipal compost. Zero microplastics, zero heavy metal residue—pure biological nutrients.',
    stat: '100% biodegradable packaging breakdown within 180 days.',
    badge: 'Circular Biosphere',
    icon: '🌱',
    color: 'border-emerald-400 dark:border-emerald-800 bg-emerald-100/60 dark:bg-emerald-950/40'
  }
];

export default function StorytellingSection() {
  const [activeStage, setActiveStage] = useState(0);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Interactive Storytelling</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
          From Waste to Wonder
        </h2>
        <p className="text-sm text-stone-600 dark:text-stone-400 mt-2">
          Discover how everyday items are reimagined from extractive fossil fuels into circular biological harmony.
        </p>

        {/* Stage Navigation Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {STORY_STAGES.map((st, idx) => (
            <button
              key={st.step}
              type="button"
              onClick={() => setActiveStage(idx)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeStage === idx
                  ? 'bg-emerald-700 text-white shadow-md scale-105'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
              }`}
            >
              <span>{st.step}</span>
              <span className="hidden sm:inline">{st.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Active Stage Showcase Card */}
      <div className={`p-8 sm:p-12 rounded-3xl border-2 transition-all duration-300 shadow-xl ${STORY_STAGES[activeStage].color}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-2xs">
                STAGE {STORY_STAGES[activeStage].step}: {STORY_STAGES[activeStage].badge}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
              {STORY_STAGES[activeStage].title}
            </h3>
            <div className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
              {STORY_STAGES[activeStage].subtitle}
            </div>

            <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed max-w-2xl font-medium">
              {STORY_STAGES[activeStage].description}
            </p>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800 text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 inline-block shadow-xs">
              📊 <strong>Audited Impact:</strong> {STORY_STAGES[activeStage].stat}
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-white dark:bg-stone-900 flex items-center justify-center text-7xl shadow-xl border-4 border-white/60 dark:border-stone-800">
              {STORY_STAGES[activeStage].icon}
            </div>
            <div className="flex items-center gap-2 mt-6">
              <button
                type="button"
                onClick={() => setActiveStage((prev) => (prev > 0 ? prev - 1 : STORY_STAGES.length - 1))}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-900 text-xs font-bold border border-stone-200 dark:border-stone-700 hover:bg-stone-50"
              >
                ← Previous
              </button>
              <button
                type="button"
                onClick={() => setActiveStage((prev) => (prev + 1) % STORY_STAGES.length)}
                className="px-3 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 shadow-xs"
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
