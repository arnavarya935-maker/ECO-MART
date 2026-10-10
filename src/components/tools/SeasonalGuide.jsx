import React, { useState } from 'react';
import { Sun, CloudRain, Snowflake, Leaf, Sparkles } from 'lucide-react';

const SEASONS = [
  {
    id: 'summer',
    name: 'Summer (Grishma)',
    icon: Sun,
    color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-300',
    produce: ['Mango (Alphonso, Dasheri)', 'Watermelon', 'Cucumber', 'Raw Mango (Aam Panna)', 'Bottle Gourd (Lauki)'],
    ecoPicks: ['Terracotta Natural Clay Cooler Bottle', 'Pure Hammered Copper Water Bottle', 'Organic Handloom Khadi Shirts'],
    ecoTip: 'Clay pots cool drinking water through natural porous evaporation, saving 180 kWh of refrigerator energy.'
  },
  {
    id: 'monsoon',
    name: 'Monsoon (Varsha)',
    icon: CloudRain,
    color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-300',
    produce: ['Corn (Bhutta)', 'Bitter Gourd (Karela)', 'Pomegranate', 'Plums', 'Ginger & Turmeric Roots'],
    ecoPicks: ['Neem Wood Cooking Spoons', 'Natural Antifungal Coir Scrubbers', 'Organic Cotton Umbrella Tote'],
    ecoTip: 'Antimicrobial neem wood prevents mould and fungal spores naturally during high humidity.'
  },
  {
    id: 'winter',
    name: 'Winter (Hemanta)',
    icon: Snowflake,
    color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-300',
    produce: ['Mustard Greens (Sarson)', 'Spinach & Bathua', 'Guava', 'Oranges', 'Amla (Indian Gooseberry)'],
    ecoPicks: ['Cold-Pressed Virgin Coconut Oil Soap', 'Wild Beeswax Lip Balms', 'Pure Wool Handloom Throws'],
    ecoTip: 'Locally grown cold-weather greens require zero artificial greenhouse heating and zero synthetic fungicides.'
  }
];

export default function SeasonalGuide() {
  const [activeSeason, setActiveSeason] = useState(SEASONS[0]);

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-md max-w-3xl mx-auto space-y-6">
      <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
        <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
          Harmonious Living Cycles
        </span>
        <h3 className="text-xl font-black text-stone-900 dark:text-stone-100 mt-2">
          Seasonal Produce & Eco Products Guide
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
          Eating and purchasing in tune with the season drastically reduces long-haul cold storage emissions.
        </p>
      </div>

      {/* Season Selector Tabs */}
      <div className="grid grid-cols-3 gap-2">
        {SEASONS.map((s) => {
          const Icon = s.icon;
          const isSelected = activeSeason.id === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveSeason(s)}
              className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                  : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{s.name.split(' (')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Season Card */}
      <div className={`p-6 rounded-3xl border ${activeSeason.color} space-y-5`}>
        <div>
          <h4 className="font-black text-base text-stone-900 dark:text-stone-100">
            {activeSeason.name}
          </h4>
          <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
            💡 <strong>Seasonal Wisdom:</strong> {activeSeason.ecoTip}
          </p>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider">
            🥗 Peak Local Harvest:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {activeSeason.produce.map((p, idx) => (
              <span key={idx} className="px-3 py-1 rounded-full bg-white dark:bg-stone-900 text-xs font-semibold text-stone-800 dark:text-stone-200 shadow-2xs border border-stone-200/60 dark:border-stone-700">
                {p}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-stone-200/60 dark:border-stone-700">
          <div className="text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider">
            🛍️ Recommended EcoMart Lifestyle Swaps:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {activeSeason.ecoPicks.map((pick, idx) => (
              <span key={idx} className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-2xs">
                ✨ {pick}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
