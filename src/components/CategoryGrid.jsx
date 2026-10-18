import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CategoryGrid({ onSelectCategory }) {
  const navigate = useNavigate();

  const categories = [
    {
      name: 'Kitchen',
      icon: '🎋',
      tagline: 'Compostable & Reusable Dining',
      desc: 'Bamboo cutlery, beeswax wraps, coconut bowls, pure copper vessels.',
      gradient: 'from-amber-50 to-emerald-50/40',
      border: 'hover:border-amber-400'
    },
    {
      name: 'Personal Care',
      icon: '🧼',
      tagline: 'Waterless & Zero-Waste Grooming',
      desc: 'Castor bamboo toothbrushes, solid shampoo bars, brass safety razors.',
      gradient: 'from-emerald-50 to-teal-50/40',
      border: 'hover:border-emerald-400'
    },
    {
      name: 'Fashion',
      icon: '👔',
      tagline: 'Organic Khadi & Hemp Apparel',
      desc: 'GOTS organic cotton shirts, hemp sneakers, Ahimsa cruelty-free silk.',
      gradient: 'from-stone-50 to-amber-50/40',
      border: 'hover:border-stone-400'
    },
    {
      name: 'Stationery',
      icon: '🌱',
      tagline: 'Plantable Seed Papers & Pens',
      desc: 'Cotton rag journals with live seeds, recycled newsprint pens.',
      gradient: 'from-lime-50 to-emerald-50/40',
      border: 'hover:border-lime-400'
    },
    {
      name: 'Home',
      icon: '🕯️',
      tagline: 'Natural Earthenware & Living',
      desc: 'Soy wax terracotta candles, coir door mats, reclaimed teak trays.',
      gradient: 'from-orange-50 to-yellow-50/40',
      border: 'hover:border-orange-400'
    },
    {
      name: 'Bags',
      icon: '👜',
      tagline: 'Plastic-Free Daily Carry',
      desc: 'Heavyweight organic cotton totes, Bengal golden jute messengers.',
      gradient: 'from-teal-50 to-stone-50/40',
      border: 'hover:border-teal-400'
    },
    {
      name: 'Outdoor & Travel',
      icon: '🏕️',
      tagline: 'Zero-Trace Living',
      desc: 'Insulated stainless tumblers, solar lanterns, natural cork mats.',
      gradient: 'from-slate-50 to-emerald-50/40',
      border: 'hover:border-slate-400'
    },
    {
      name: 'Cleaning & Laundry',
      icon: '🧽',
      tagline: 'Toxin-Free Bio Detergents',
      desc: 'Soapnut concentrates, biodegradable laundry sheets, coconut scrubbers.',
      gradient: 'from-sky-50 to-teal-50/40',
      border: 'hover:border-sky-400'
    }
  ];

  const handleSelect = (categoryName) => {
    if (onSelectCategory) {
      onSelectCategory(categoryName);
    }
    navigate(`/shop?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Explore by Category
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0B3B2C] mt-1.5">
            Conscious Department Catalog
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Curated zero-plastic alternatives across 8 fundamental everyday categories.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.name}
            onClick={() => handleSelect(cat.name)}
            className={`group p-4 sm:p-5 rounded-3xl bg-gradient-to-br ${cat.gradient} bg-white border border-stone-200/90 shadow-2xs hover:shadow-md ${cat.border} transition-all duration-300 cursor-pointer flex flex-col justify-between select-none min-h-[140px]`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl p-2 rounded-2xl bg-white shadow-2xs border border-stone-100 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </span>
                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-stone-900 group-hover:text-emerald-800 transition-colors">
                {cat.name}
              </h3>
              <p className="text-[11px] font-semibold text-emerald-700 line-clamp-1 mt-0.5">
                {cat.tagline}
              </p>
            </div>
            <p className="text-[10px] text-stone-500 line-clamp-2 mt-2 leading-relaxed">
              {cat.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
