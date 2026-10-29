import React from 'react';
import { CATEGORIES, isMatchingCategory, findCategory } from '../../data/categories.js';
import { ArrowRight, Sparkles, Check } from 'lucide-react';

export default function CategoryTiles({
  selectedCategory = 'all',
  onSelectCategory,
  showTitle = true,
  products = []
}) {
  const currentCategoryObj = findCategory(selectedCategory);
  const currentId = currentCategoryObj?.id || 'all';

  const getCategoryStats = (category) => {
    const list = products.filter((p) => isMatchingCategory(p.category, category.id));
    const total = list.length;
    if (total === 0) {
      return { count: 0, badge: category.badge };
    }
    const plasticFreeCount = list.filter((p) => p.packaging === 'plastic-free' || p.plasticGrams === 0).length;
    const plasticFreePercent = Math.round((plasticFreeCount / total) * 100);
    const badge = `${plasticFreePercent}% Plastic-Free`;
    return { count: total, badge };
  };

  const handleTileClick = (category) => {
    if (onSelectCategory) {
      onSelectCategory(currentId === category.id ? 'all' : category.id);
    }
  };

  return (
    <div className="w-full py-4 select-none">
      {showTitle && (
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-primary font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Explore Departments</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-heading mt-0.5 tracking-tight">
              Curated by Material Lifecycle
            </h2>
          </div>
          {currentId !== 'all' && (
            <button
              type="button"
              onClick={() => onSelectCategory && onSelectCategory('all')}
              className="text-xs font-sans font-medium text-primary hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Reset filter ({currentCategoryObj?.label || selectedCategory})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Responsive Horizontal Scroll / Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-3.5">
        {CATEGORIES.map((cat) => {
          const isSelected = currentId === cat.id;
          const { count, badge } = getCategoryStats(cat);

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleTileClick(cat)}
              aria-pressed={isSelected}
              className={`group relative flex flex-col justify-end text-left rounded-2xl overflow-hidden border transition-all duration-300 min-h-[140px] sm:min-h-[160px] p-3 cursor-pointer focus-visible:outline-2 focus-visible:outline-focus shadow-soft-xs ${
                isSelected
                  ? 'border-primary ring-2 ring-primary/40 ring-offset-2 ring-offset-surface scale-[1.02] shadow-soft-md'
                  : 'border-line hover:border-primary/40 hover:shadow-soft-sm'
              }`}
            >
              {/* Product Photography Background */}
              <div className="absolute inset-0 bg-surface-sunken overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.label}
                  loading="lazy"
                  decoding="async"
                  width="400"
                  height="400"
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
                  onError={(e) => {
                    if (e.currentTarget.src && e.currentTarget.src.endsWith('.webp') && cat.fallbackJpg) {
                      e.currentTarget.src = cat.fallbackJpg;
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
                  {badge}
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
                  {cat.label}
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
