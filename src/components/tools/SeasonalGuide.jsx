import React, { useState } from 'react';
import { Sun, CloudRain, Snowflake } from 'lucide-react';

const SEASONS = [
  {
    id: 'summer',
    name: 'Summer (Grishma)',
    icon: Sun,
    color: 'text-warning bg-warning/10 border-warning/30',
    produce: ['Mango (Alphonso, Dasheri)', 'Watermelon', 'Cucumber', 'Raw Mango (Aam Panna)', 'Bottle Gourd (Lauki)'],
    ecoPicks: ['Terracotta Natural Clay Cooler Bottle', 'Pure Hammered Copper Water Bottle', 'Organic Handloom Khadi Shirts'],
    ecoTip: 'Clay pots cool drinking water through natural porous evaporation, saving 180 kWh of refrigerator energy.'
  },
  {
    id: 'monsoon',
    name: 'Monsoon (Varsha)',
    icon: CloudRain,
    color: 'text-accent bg-accent/10 border-accent/30',
    produce: ['Corn (Bhutta)', 'Bitter Gourd (Karela)', 'Pomegranate', 'Plums', 'Ginger & Turmeric Roots'],
    ecoPicks: ['Neem Wood Cooking Spoons', 'Natural Antifungal Coir Scrubbers', 'Organic Cotton Umbrella Tote'],
    ecoTip: 'Antimicrobial neem wood prevents mould and fungal spores naturally during high humidity.'
  },
  {
    id: 'winter',
    name: 'Winter (Hemanta)',
    icon: Snowflake,
    color: 'text-info bg-info/10 border-info/30',
    produce: ['Mustard Greens (Sarson)', 'Spinach & Bathua', 'Guava', 'Oranges', 'Amla (Indian Gooseberry)'],
    ecoPicks: ['Cold-Pressed Virgin Coconut Oil Soap', 'Wild Beeswax Lip Balms', 'Pure Wool Handloom Throws'],
    ecoTip: 'Locally grown cold-weather greens require zero artificial greenhouse heating and zero synthetic fungicides.'
  }
];

export default function SeasonalGuide() {
  const [activeSeason, setActiveSeason] = useState(SEASONS[0]);

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-line shadow-soft-sm max-w-3xl mx-auto space-y-6">
      <div className="border-b border-line pb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
          Harmonious Living Cycles
        </span>
        <h3 className="text-xl font-serif font-bold text-heading mt-2">
          Seasonal Produce & Eco Products Guide
        </h3>
        <p className="text-xs sm:text-sm text-secondary mt-0.5">
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
              className={`p-3 rounded-2xl border text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer min-h-[44px] ${
                isSelected
                  ? 'bg-primary text-primary-contrast border-primary shadow-soft-xs'
                  : 'bg-surface-sunken border-line text-secondary hover:text-heading hover:bg-surface'
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
          <h4 className="font-serif font-bold text-base text-heading">
            {activeSeason.name}
          </h4>
          <p className="text-xs text-secondary mt-1 leading-relaxed">
            💡 <strong className="text-heading">Seasonal Wisdom:</strong> {activeSeason.ecoTip}
          </p>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-semibold text-heading uppercase tracking-wider">
            🥗 Peak Local Harvest:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {activeSeason.produce.map((p, idx) => (
              <span key={idx} className="px-3 py-1 rounded-full bg-surface text-xs font-medium text-text shadow-soft-2xs border border-line">
                {p}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-line">
          <div className="text-xs font-semibold text-heading uppercase tracking-wider">
            🛍️ Recommended EcoMart Lifestyle Swaps:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {activeSeason.ecoPicks.map((pick, idx) => (
              <span key={idx} className="px-3 py-1 rounded-full bg-primary text-primary-contrast text-xs font-medium shadow-soft-2xs">
                ✨ {pick}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
