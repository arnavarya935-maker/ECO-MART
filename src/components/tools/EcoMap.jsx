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
    <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-line shadow-soft-sm max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-5">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
            Local Sourcing Transparency
          </span>
          <h3 className="text-2xl font-serif font-bold text-heading mt-2">
            Artisan Origins & Regional Eco Map
          </h3>
          <p className="text-xs sm:text-sm text-secondary mt-0.5">
            Click any regional cluster to inspect local materials, artisan communities, and audited items. Fully offline SVG.
          </p>
        </div>

        <div className="text-left sm:text-right text-xs text-secondary">
          <strong className="text-primary text-sm font-serif font-bold">4,210+</strong> Verified Artisans
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Offline Interactive Bundled SVG Map */}
        <div className="md:col-span-7 relative bg-surface-sunken p-6 rounded-3xl border border-line flex items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            className="w-full max-w-[340px] h-auto drop-shadow-soft-sm"
            aria-label="Offline interactive map of Indian artisan craft regions"
          >
            {/* Abstract stylised contour map */}
            <path
              d="M38 12 L54 10 L60 22 L70 28 L82 34 L88 42 L80 50 L70 48 L64 56 L58 64 L48 84 L40 92 L36 86 L34 72 L26 62 L22 48 L28 36 L34 26 Z"
              className="fill-primary/10 stroke-primary/30 stroke-1"
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
                    className={isSelected ? 'fill-primary stroke-surface stroke-2' : 'fill-heading stroke-surface stroke-1.5'}
                  />
                  <text
                    x={region.coordinates.x}
                    y={region.coordinates.y - 7}
                    textAnchor="middle"
                    className="text-[3.5px] font-bold fill-heading select-none"
                  >
                    {region.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Region Detailed Card */}
        <div className="md:col-span-5 p-6 rounded-3xl bg-surface-sunken border border-line space-y-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{selectedRegion.states}</span>
            </div>
            <h4 className="text-lg font-serif font-bold text-heading mt-1">
              {selectedRegion.name}
            </h4>
          </div>

          <div className="space-y-2 text-xs text-secondary">
            <div className="p-3 rounded-2xl bg-surface border border-line shadow-soft-xs">
              <span className="text-muted font-medium">Specialty Materials:</span>
              <div className="font-semibold text-heading mt-0.5">{selectedRegion.materials}</div>
            </div>
            <div className="p-3 rounded-2xl bg-surface border border-line shadow-soft-xs">
              <span className="text-muted font-medium">Community Impact:</span>
              <div className="font-semibold text-primary mt-0.5">{selectedRegion.impact}</div>
            </div>
            <div className="p-3 rounded-2xl bg-surface border border-line shadow-soft-xs">
              <span className="text-muted font-medium">Artisan Livelihoods:</span>
              <div className="font-semibold text-heading mt-0.5">{selectedRegion.artisans} local families</div>
            </div>
          </div>

          <div className="pt-2 border-t border-line">
            <div className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-2">
              Top Audited Items from this Hub:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selectedRegion.products.map((pName, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-surface border border-line text-[11px] font-medium text-text shadow-soft-xs"
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
