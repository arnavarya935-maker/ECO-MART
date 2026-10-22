import React, { useState } from 'react';
import { Search, Recycle, Trash2, Sprout } from 'lucide-react';

const RECYCLING_ITEMS = [
  { item: 'Bamboo Toothbrush Handle', stream: 'Backyard Compost', bin: 'Wet / Organic Waste', tip: 'Snap off bristles with pliers first; 100% bamboo body breaks down in 180 days.', icon: Sprout, color: 'text-primary bg-primary/10 border-primary/20' },
  { item: 'Castor Bristles (Toothbrush)', stream: 'Industrial Compost', bin: 'Dry Recyclables', tip: 'Bio-nylon based on castor bean oil. Put in municipal dry bin.', icon: Recycle, color: 'text-accent bg-accent/10 border-accent/20' },
  { item: 'Beeswax Food Wraps', stream: 'Compost / Fire Tinder', bin: 'Wet Compost', tip: 'After 1 year of washings, cut into strips for backyard compost or natural fireplace firestarters.', icon: Sprout, color: 'text-primary bg-primary/10 border-primary/20' },
  { item: 'Kraft Paper Packaging', stream: 'Paper Recycling', bin: 'Blue / Dry Paper Bin', tip: '100% unbleached post-consumer kraft paper can be recycled 5-7 times.', icon: Recycle, color: 'text-info bg-info/10 border-info/20' },
  { item: 'Single-Use Plastic Film / Cling Wrap', stream: 'Non-Recyclable Landfill', bin: 'Red / Hazard Waste', tip: 'LDPE thin film chokes recycling facility sorting machines. Swap for beeswax wraps!', icon: Trash2, color: 'text-danger bg-danger/10 border-danger/20' },
  { item: 'Coconut Shell Bowl', stream: 'Backyard Compost', bin: 'Organic Waste', tip: 'Pure coconut husk. Natural garden mulch after years of kitchen dining use.', icon: Sprout, color: 'text-primary bg-primary/10 border-primary/20' },
  { item: 'Copper Vessel', stream: 'Infinitely Recyclable Metal', bin: 'Metal Scrap Guild', tip: 'Copper never degrades in quality and can be melted down endlessly.', icon: Recycle, color: 'text-warning bg-warning/10 border-warning/20' }
];

export default function RecyclingGuide() {
  const [query, setQuery] = useState('');

  const filtered = RECYCLING_ITEMS.filter((i) =>
    i.item.toLowerCase().includes(query.toLowerCase()) ||
    i.stream.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-line shadow-soft-sm max-w-3xl mx-auto space-y-6">
      <div className="border-b border-line pb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
          Circular Disposal Index
        </span>
        <h3 className="text-xl font-serif font-bold text-heading mt-2">
          Where Does This Go? Quick Disposal Lookup
        </h3>
        <p className="text-xs sm:text-sm text-secondary mt-0.5">
          Type an everyday product or material to learn exact municipal disposal and composting rules.
        </p>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search item (e.g. bamboo, beeswax, copper, cling wrap, paper)..."
          className="w-full pl-10 pr-4 py-2.5 rounded-full bg-surface-sunken border border-line text-xs sm:text-sm text-text focus:outline-hidden focus:border-primary min-h-[44px]"
        />
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {filtered.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border ${item.color} space-y-1.5`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-semibold text-heading">
                  {item.item}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface border border-line text-text">
                  {item.bin}
                </span>
              </div>
              <div className="flex items-start gap-2 text-xs text-secondary">
                <Icon className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{item.tip}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
