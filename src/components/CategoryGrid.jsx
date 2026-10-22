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
      desc: 'Bamboo cutlery, beeswax wraps, coconut bowls, pure copper vessels.'
    },
    {
      name: 'Personal Care',
      icon: '🧼',
      tagline: 'Waterless & Zero-Waste Grooming',
      desc: 'Castor bamboo toothbrushes, solid shampoo bars, brass safety razors.'
    },
    {
      name: 'Fashion',
      icon: '👔',
      tagline: 'Organic Khadi & Hemp Apparel',
      desc: 'GOTS organic cotton shirts, hemp sneakers, Ahimsa cruelty-free silk.'
    },
    {
      name: 'Stationery',
      icon: '🌱',
      tagline: 'Plantable Seed Papers & Pens',
      desc: 'Cotton rag journals with live seeds, recycled newsprint pens.'
    },
    {
      name: 'Home',
      icon: '🕯️',
      tagline: 'Natural Earthenware & Living',
      desc: 'Soy wax terracotta candles, coir door mats, reclaimed teak trays.'
    },
    {
      name: 'Bags',
      icon: '👜',
      tagline: 'Plastic-Free Daily Carry',
      desc: 'Heavyweight organic cotton totes, Bengal golden jute messengers.'
    },
    {
      name: 'Outdoor & Travel',
      icon: '🏕️',
      tagline: 'Zero-Trace Living',
      desc: 'Insulated stainless tumblers, solar lanterns, natural cork mats.'
    },
    {
      name: 'Cleaning & Laundry',
      icon: '🧽',
      tagline: 'Toxin-Free Bio Detergents',
      desc: 'Soapnut concentrates, biodegradable laundry sheets, coconut scrubbers.'
    }
  ];

  const handleSelect = (categoryName) => {
    if (onSelectCategory) {
      onSelectCategory(categoryName);
    }
    navigate(`/shop?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="py-12 bg-surface border-y border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-primary bg-primary-subtle px-2.5 py-0.5 rounded-full border border-primary/20">
                Explore by Category
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-heading mt-2 tracking-tight">
              Curated Departments
            </h2>
            <p className="font-sans text-xs sm:text-sm text-secondary mt-0.5">
              Thoughtfully vetted zero-plastic essentials across 8 daily lifestyle pillars.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => handleSelect(cat.name)}
              className="group p-5 rounded-3xl bg-surface-raised border border-line hover:border-primary shadow-soft-sm hover:shadow-soft-md transition-all duration-300 cursor-pointer flex flex-col justify-between select-none min-h-[150px]"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl p-2.5 rounded-2xl bg-surface-sunken border border-line-subtle group-hover:scale-105 transition-transform duration-200">
                    {cat.icon}
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                </div>
                <h3 className="font-serif font-bold text-base text-heading group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
                <p className="font-sans text-xs font-medium text-primary line-clamp-1 mt-0.5">
                  {cat.tagline}
                </p>
              </div>
              <p className="font-sans text-[11px] text-muted line-clamp-2 mt-3 leading-relaxed">
                {cat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

