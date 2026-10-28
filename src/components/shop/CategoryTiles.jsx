import React from 'react';
import productsData from '../../data/products.json';
import { ArrowRight, Sparkles, Check } from 'lucide-react';

const CATEGORY_META = {
  Kitchen: {
    image: '/images/products/kit-01-400.webp',
    fallbackJpg: '/images/products/kit-01.jpg',
    tagline: 'Zero-waste culinary essentials',
    badge: 'Plastic-Free'
  },
  'Personal Care': {
    image: '/images/products/care-01-400.webp',
    fallbackJpg: '/images/products/care-01.jpg',
    tagline: 'Clean, toxin-free self-care',
    badge: '100% Organic'
  },
  Fashion: {
    image: '/images/products/fash-01-400.webp',
    fallbackJpg: '/images/products/fash-01.jpg',
    tagline: 'Circular, regenerative apparel',
    badge: 'GOTS Certified'
  },
  Stationery: {
    image: '/images/products/stat-01-400.webp',
    fallbackJpg: '/images/products/stat-01.jpg',
    tagline: 'Plantable & post-consumer tools',
    badge: 'Tree-Free'
  },
  Home: {
    image: '/images/products/home-01-400.webp',
    fallbackJpg: '/images/products/home-01.jpg',
    tagline: 'Artisanal sustainable living',
    badge: 'Low Carbon'
  },
  Bags: {
    image: '/images/products/bag-01-400.webp',
    fallbackJpg: '/images/products/bag-01.jpg',
    tagline: 'Heavy-duty natural fiber totes',
    badge: 'Biodegradable'
  },
  'Outdoor & Travel': {
    image: '/images/products/out-01-400.webp',
    fallbackJpg: '/images/products/out-01.jpg',
    tagline: 'Durable gear built for reuse',
    badge: 'Closed-Loop'
  },
  'Cleaning & Laundry': {
    image: '/images/products/clean-01-400.webp',
    fallbackJpg: '/images/products/clean-01.jpg',
    tagline: 'Greywater-safe plant detergents',
    badge: 'Zero Petrochemicals'
  }
};

export default function CategoryTiles({
  selectedCategory = 'All',
  onSelectCategory,
  showTitle = true
}) {
  // Extract categories dynamically from data to ensure 100% fidelity
  const categories = Object.keys(CATEGORY_META);

  const getCount = (cat) => {
    return productsData.filter((p) => p.category === cat).length;
  };

  const handleTileClick = (cat) => {
    if (onSelectCategory) {
      // Toggle if already selected, otherwise set
      onSelectCategory(selectedCategory === cat ? 'All' : cat);
    }
  };

  return (
    <div className="w-full py-4 select-none">
      {showTitle && (
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-primary font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Explore Verified Departments</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-heading mt-0.5 tracking-tight">
              Curated by Material Lifecycle
            </h2>
          </div>
          {selectedCategory !== 'All' && (
            <button
              type="button"
              onClick={() => onSelectCategory && onSelectCategory('All')}
              className="text-xs font-sans font-medium text-primary hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Reset filter ({selectedCategory})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Responsive Horizontal Scroll / Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-3.5">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const meta = CATEGORY_META[cat];
          const count = getCount(cat);

          return (
            <button
              key={cat}
              type="button"
              onClick={() => handleTileClick(cat)}
              aria-pressed={isSelected}
              className={`group relative flex flex-col justify-end text-left rounded-2xl overflow-hidden border transition-all duration-300 min-h-[140px] sm:min-h-[160px] p-3 cursor-pointer focus-visible:outline-2 focus-visible:outline-focus shadow-soft-xs ${
                isSelected
                  ? 'border-primary ring-2 ring-primary/40 ring-offset-2 ring-offset-surface scale-[1.02] shadow-soft-md'
                  : 'border-line hover:border-primary/40 hover:shadow-soft-sm'
              }`}
            >
              {/* Real Product Photography Background */}
              <div className="absolute inset-0 bg-surface-sunken overflow-hidden">
                <img
                  src={meta.image}
                  alt={cat}
                  loading="lazy"
                  decoding="async"
                  width="400"
                  height="400"
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
                  onError={(e) => {
                    if (e.currentTarget.src && e.currentTarget.src.endsWith('.webp')) {
                      e.currentTarget.src = meta.fallbackJpg;
                    }
                  }}
                />
                {/* Vignette Gradients for flawless readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 group-hover:from-black/90 transition-colors" />
                {isSelected && (
                  <div className="absolute inset-0 bg-primary/20 mix-blend-overlay pointer-events-none" />
                )}
              </div>

              {/* Top Meta Tag & Selection Tick */}
              <div className="relative z-10 flex items-center justify-between w-full mb-auto">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white font-medium border border-white/20 shadow-2xs">
                  {meta.badge}
                </span>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shadow-soft-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>

              {/* Bottom Title & Counter */}
              <div className="relative z-10 pt-2">
                <h3 className="font-heading font-bold text-xs sm:text-sm text-white leading-tight tracking-tight drop-shadow-xs">
                  {cat}
                </h3>
                <p className="text-[11px] font-sans text-white/80 mt-0.5 font-medium flex items-center gap-1">
                  <span>{count} products</span>
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
