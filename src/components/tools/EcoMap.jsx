import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

const ARTISAN_REGIONS = [
  {
    id: 'south',
    name: 'Southern Handloom & Coir Cluster',
    states: 'Tamil Nadu & Kerala',
    coordinates: { x: 42, y: 82 },
    materials: 'Organic GOTS Canvas, Coconut Coir, Brass',
    artisans: 1250,
    impact: 'Replaces ~35,000 plastic carry bags monthly',
    products: ['Organic Fair-Trade Cotton Tote', 'Natural Coir Kitchen Scrubbers']
  },
  {
    id: 'northeast',
    name: 'Northeast Bamboo & Agroforestry Hub',
    states: 'Assam & Tripura',
    coordinates: { x: 78, y: 40 },
    materials: 'FSC Moso Bamboo, Cane, Wild Herbal Extracts',
    artisans: 980,
    impact: 'Diverts 1.2M plastic toothbrushes from landfills',
    products: ['Compostable Bamboo Toothbrush', 'Bamboo Cutlery Travel Kit']
  },
  {
    id: 'west',
    name: 'Western Metalcraft & Textile Guilds',
    states: 'Gujarat & Maharashtra',
    coordinates: { x: 26, y: 52 },
    materials: 'Pure Hand-Hammered Copper, Khadi Cotton',
    artisans: 840,
    impact: 'Eliminates disposable bottled water dependency',
    products: ['Pure Hammered Copper Water Bottle', 'Organic Handspun Napkins']
  },
  {
    id: 'north',
    name: 'Northern Woodcraft & Terracotta Kilns',
    states: 'Uttar Pradesh & Uttarakhand',
    coordinates: { x: 46, y: 32 },
    materials: 'Antimicrobial Neem Wood, Natural Clay',
    artisans: 1140,
    impact: 'Prevents synthetic coating toxins & microplastics',
    products: ['Neem Wood Cooking Spoon Set', 'Terracotta Natural Cooler Bottle']
  }
];

export default function EcoMap() {
  const [selectedRegion, setSelectedRegion] = useState(ARTISAN_REGIONS[0]);

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-md max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-5">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
            Local Sourcing Transparency
          </span>
          <h3 className="text-2xl font-black text-stone-900 dark:text-stone-100 mt-2">
            Artisan Origins & Regional Eco Map
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Click any regional cluster to inspect local materials, artisan communities, and audited items. Fully offline SVG.
          </p>
        </div>

        <div className="text-right text-xs text-stone-500">
          <strong className="text-emerald-600 dark:text-emerald-400 text-sm">4,210+</strong> Verified Artisans
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Offline Interactive Bundled SVG Map */}
        <div className="md:col-span-7 relative bg-stone-50 dark:bg-stone-900/60 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 flex items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            className="w-full max-w-[340px] h-auto drop-shadow-md"
            aria-label="Offline interactive map of Indian artisan craft regions"
          >
            {/* Abstract stylised contour map */}
            <path
              d="M38 12 L54 10 L60 22 L70 28 L82 34 L88 42 L80 50 L70 48 L64 56 L58 64 L48 84 L40 92 L36 86 L34 72 L26 62 L22 48 L28 36 L34 26 Z"
              className="fill-emerald-100/60 dark:fill-emerald-950/40 stroke-emerald-500/40 stroke-1"
            />

            {/* Clickable cluster pins */}
            {ARTISAN_REGIONS.map((region) => {
              const isSelected = selectedRegion.id === region.id;
              return (
                <g
                  key={region.id}
                  onClick={() => setSelectedRegion(region)}
                  className="cursor-pointer transition-transform hover:scale-110"
                >
                  <circle
                    cx={region.coordinates.x}
                    cy={region.coordinates.y}
                    r={isSelected ? 6 : 4}
                    className={isSelected ? 'fill-emerald-600 stroke-white stroke-2 animate-pulse' : 'fill-teal-700 stroke-white stroke-1.5'}
                  />
                  <text
                    x={region.coordinates.x}
                    y={region.coordinates.y - 7}
                    textAnchor="middle"
                    className="text-[3.5px] font-black fill-stone-900 dark:fill-stone-100 select-none"
                  >
                    {region.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Region Detailed Card */}
        <div className="md:col-span-5 p-6 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>{selectedRegion.states}</span>
            </div>
            <h4 className="text-lg font-black text-stone-900 dark:text-stone-100 mt-1">
              {selectedRegion.name}
            </h4>
          </div>

          <div className="space-y-2 text-xs text-stone-700 dark:text-stone-300">
            <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-emerald-100 dark:border-emerald-900/50">
              <span className="text-stone-500 font-semibold">Specialty Materials:</span>
              <div className="font-bold text-stone-900 dark:text-stone-100 mt-0.5">{selectedRegion.materials}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-emerald-100 dark:border-emerald-900/50">
              <span className="text-stone-500 font-semibold">Community Impact:</span>
              <div className="font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">{selectedRegion.impact}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-emerald-100 dark:border-emerald-900/50">
              <span className="text-stone-500 font-semibold">Artisan Livelihoods:</span>
              <div className="font-bold text-stone-900 dark:text-stone-100 mt-0.5">{selectedRegion.artisans} local families</div>
            </div>
          </div>

          <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800">
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
              Top Audited Items from this Hub:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selectedRegion.products.map((pName, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-stone-900 border border-emerald-300/80 dark:border-emerald-800 text-[11px] font-bold text-stone-800 dark:text-stone-200"
                >
                  🌿 {pName}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
