import React, { useState } from 'react';
import { Search, Recycle, Trash2, Sprout } from 'lucide-react';

const RECYCLING_ITEMS = [
  { item: 'Bamboo Toothbrush Handle', stream: 'Backyard Compost', bin: 'Wet / Organic Waste', tip: 'Snap off bristles with pliers first; 100% bamboo body breaks down in 180 days.', icon: Sprout, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300' },
  { item: 'Castor Bristles (Toothbrush)', stream: 'Industrial Compost', bin: 'Dry Recyclables', tip: 'Bio-nylon based on castor bean oil. Put in municipal dry bin.', icon: Recycle, color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/60 border-teal-300' },
  { item: 'Beeswax Food Wraps', stream: 'Compost / Fire Tinder', bin: 'Wet Compost', tip: 'After 1 year of washings, cut into strips for backyard compost or natural fireplace firestarters.', icon: Sprout, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300' },
  { item: 'Kraft Paper Packaging', stream: 'Paper Recycling', bin: 'Blue / Dry Paper Bin', tip: '100% unbleached post-consumer kraft paper can be recycled 5-7 times.', icon: Recycle, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 border-blue-300' },
  { item: 'Single-Use Plastic Film / Cling Wrap', stream: 'Non-Recyclable Landfill', bin: 'Red / Hazard Waste', tip: 'LDPE thin film chokes recycling facility sorting machines. Swap for beeswax wraps!', icon: Trash2, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60 border-rose-300' },
  { item: 'Coconut Shell Bowl', stream: 'Backyard Compost', bin: 'Organic Waste', tip: 'Pure coconut husk. Natural garden mulch after years of kitchen dining use.', icon: Sprout, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300' },
  { item: 'Copper Vessel', stream: 'Infinitely Recyclable Metal', bin: 'Metal Scrap Guild', tip: 'Copper never degrades in quality and can be melted down endlessly.', icon: Recycle, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 border-amber-300' }
];

export default function RecyclingGuide() {
  const [query, setQuery] = useState('');

  const filtered = RECYCLING_ITEMS.filter((i) =>
    i.item.toLowerCase().includes(query.toLowerCase()) ||
    i.stream.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-md max-w-3xl mx-auto space-y-6">
      <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
        <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
          Circular Disposal Index
        </span>
        <h3 className="text-xl font-black text-stone-900 dark:text-stone-100 mt-2">
          Where Does This Go? Quick Disposal Lookup
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
          Type an everyday product or material to learn exact municipal disposal and composting rules.
        </p>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search item (e.g. bamboo, beeswax, copper, cling wrap, paper)..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-hidden focus:border-emerald-500"
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
                <span className="text-xs sm:text-sm font-black text-stone-900 dark:text-stone-100">
                  {item.item}
                </span>
                <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
                  {item.bin}
                </span>
              </div>
              <div className="flex items-start gap-2 text-xs text-stone-600 dark:text-stone-300">
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
