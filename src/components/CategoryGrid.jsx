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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;

            return (
              <div
                key={cat.name}
                onClick={() => onSelectCategory(isSelected ? null : cat.name)}
                className={`group relative p-6 rounded-3xl bg-gradient-to-br ${cat.gradient} border transition-all duration-300 cursor-pointer shadow-xs hover:shadow-lg ${cat.border} ${
                  isSelected
                    ? 'border-emerald-600 ring-2 ring-emerald-600/30 dark:ring-emerald-500/40'
                    : 'border-stone-200/90 dark:border-stone-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-4xl p-2.5 rounded-2xl bg-white/80 dark:bg-stone-850/80 shadow-xs border border-white/40 dark:border-stone-700 select-none group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore →
                  </span>
                </div>

                <div className="mt-5">
                  <h3 className="text-lg font-black text-stone-900 dark:text-stone-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-300 transition-colors">
                    {cat.name}
                  </h3>
                  <div className="text-xs font-bold text-emerald-800 dark:text-emerald-400 mt-0.5">
                    {cat.tagline}
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">
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
