import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function CategoryGrid({ onSelectCategory, selectedCategory }) {
  const categories = [
    {
      name: 'Kitchen',
      icon: '🎋',
      tagline: 'Compostable & Reusable Dining',
      desc: 'Bamboo cutlery, beeswax wraps, coconut bowls, pure copper vessels.',
      gradient: 'from-amber-100 to-orange-50 dark:from-amber-950/40 dark:to-stone-900',
      border: 'hover:border-amber-400'
    },
    {
      name: 'Personal Care',
      icon: '🧼',
      tagline: 'Waterless & Zero-Waste Grooming',
      desc: 'Castor bamboo toothbrushes, solid shampoo bars, brass safety razors.',
      gradient: 'from-emerald-100 to-teal-50 dark:from-emerald-950/40 dark:to-stone-900',
      border: 'hover:border-emerald-400'
    },
    {
      name: 'Fashion',
      icon: '👔',
      tagline: 'Organic Khadi & Hemp Apparel',
      desc: 'GOTS organic cotton shirts, hemp sneakers, Ahimsa cruelty-free silk.',
      gradient: 'from-stone-200 to-amber-50 dark:from-stone-800/60 dark:to-stone-900',
      border: 'hover:border-stone-400'
    },
    {
      name: 'Stationery',
      icon: '🌱',
      tagline: 'Plantable Seed Papers & Pens',
      desc: 'Cotton rag journals with live seeds, recycled newsprint pens.',
      gradient: 'from-lime-100 to-emerald-50 dark:from-lime-950/40 dark:to-stone-900',
      border: 'hover:border-lime-400'
    },
    {
      name: 'Home',
      icon: '🕯️',
      tagline: 'Natural Earthenware & Upcycled Living',
      desc: 'Soy wax terracotta candles, coir door mats, reclaimed teak trays.',
      gradient: 'from-orange-100 to-yellow-50 dark:from-orange-950/40 dark:to-stone-900',
      border: 'hover:border-orange-400'
    },
    {
      name: 'Bags',
      icon: '👜',
      tagline: 'Plastic-Free Daily Carry',
      desc: 'Heavyweight organic cotton totes, Bengal golden jute messengers.',
      gradient: 'from-teal-100 to-stone-100 dark:from-teal-950/40 dark:to-stone-900',
      border: 'hover:border-teal-400'
    },
    {
      name: 'Outdoor & Travel',
      icon: '🏕️',
      tagline: 'Zero-Trace Sustainable Adventures',
      desc: 'Solar cedar lanterns, insulated stainless flasks, natural cork yoga mats.',
      gradient: 'from-slate-200 to-stone-100 dark:from-slate-900/40 dark:to-stone-900',
      border: 'hover:border-slate-400'
    },
    {
      name: 'Cleaning & Laundry',
      icon: '✨',
      tagline: 'Non-Toxic Greywater-Safe Home',
      desc: 'Himalayan soapberry wash, natural loofah scrubbers, surface tabs.',
      gradient: 'from-sky-100 to-teal-50 dark:from-sky-950/40 dark:to-stone-900',
      border: 'hover:border-sky-400'
    }
  ];

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full w-fit">
              Conscious Curations
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 mt-1">
              Shop by Sustainable Category
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 max-w-sm">
            Handpicked sustainable alternatives designed to eliminate disposable single-use plastics from your everyday life.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, idx) => {
            const isSelected = selectedCategory === cat.name;

            return (
              <div
                key={cat.name}
                onClick={() => onSelectCategory(isSelected ? null : cat.name)}
                className={`group relative p-5 rounded-xs bg-[#0a0a0a] light:bg-white border transition-all duration-300 cursor-pointer shadow-xl hover:border-white/30 ${
                  isSelected
                    ? 'border-[#A8C7FA] ring-1 ring-[#A8C7FA]/40 bg-[#111]'
                    : 'border-white/10 light:border-black/10'
                }`}
              >
                {/* Viewfinder Brackets */}
                <span className="bracket bracket-tl !w-2.5 !h-2.5 opacity-0 group-hover:opacity-100 transition-opacity !border-[#A8C7FA]" />
                <span className="bracket bracket-br !w-2.5 !h-2.5 opacity-0 group-hover:opacity-100 transition-opacity !border-[#A8C7FA]" />

                <div className="flex items-start justify-between">
                  <span className="text-3xl p-2 rounded-2xs bg-[#050505] light:bg-zinc-100 border border-white/10 select-none group-hover:scale-105 transition-transform">
                    {cat.icon}
                  </span>
                  <span className="text-[9px] font-space-mono uppercase px-2 py-0.5 rounded-2xs bg-white text-black light:bg-black light:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    0{idx + 1} // Open →
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="font-newsreader italic text-lg text-white light:text-zinc-900 group-hover:text-[#A8C7FA] transition-colors">
                    {cat.name}
                  </h3>
                  <div className="text-[10px] font-space-mono text-[#E2D3B6] light:text-amber-800 mt-0.5 uppercase tracking-wider">
                    {cat.tagline}
                  </div>
                  <p className="text-xs text-neutral-400 light:text-zinc-500 mt-2 leading-relaxed font-sans">
                    {cat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
