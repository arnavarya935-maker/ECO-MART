import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { useT } from '../../context/I18nContext';

export default function ShopFilterBar({
  searchQuery,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
  sortBy,
  onSortChange,
  onOpenMobileFilters,
  activeFilterCount
}) {
  const { t } = useT();
  return (
    <div className="sticky top-18 z-30 bg-surface/95 backdrop-blur-md py-3.5 border-b border-line transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search input bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by product, material, or keyword..."
            className="w-full pl-10 pr-9 py-2.5 min-h-[44px] rounded-2xl bg-surface-raised border border-line text-xs sm:text-sm font-sans font-medium text-heading placeholder:text-muted focus-visible:outline-2 focus-visible:outline-focus shadow-soft-sm transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted hover:text-heading cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Clear search query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right controls: Category, Sort & Filter Drawer Button */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {/* Category Dropdown */}
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-3.5 py-2 min-h-[44px] rounded-2xl bg-surface-raised border border-line text-xs font-sans font-medium text-heading focus-visible:outline-2 focus-visible:outline-focus cursor-pointer shadow-soft-sm"
            aria-label="Filter by category"
          >
            <option value="All">{t('shop.allCategories', 'All Categories')} ({categories.length})</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] rounded-2xl bg-surface-raised border border-line shadow-soft-sm">
            <ArrowUpDown className="w-3.5 h-3.5 text-muted shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-transparent text-xs font-sans font-medium text-heading focus:outline-hidden cursor-pointer"
              aria-label="Sort products"
            >
              <option value="featured">{t('shop.sortFeatured', '✨ My Priorities (Decision Engine)')}</option>
              <option value="impact-rupee">{t('shop.sortImpactRupee', '🌱 Impact / Rupee')}</option>
              <option value="eco-desc">{t('shop.sortEcoScore', 'Eco-Score: Highest')}</option>
              <option value="price-asc">{t('shop.sortPriceLow', 'Price: Low to High')}</option>
              <option value="price-desc">{t('shop.sortPriceHigh', 'Price: High to Low')}</option>
              <option value="carbon-asc">Carbon: Lowest</option>
            </select>
          </div>

          {/* Mobile Filter Drawer Button */}
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="relative flex items-center gap-1.5 px-4 py-2 min-h-[44px] rounded-2xl bg-surface-raised border border-line hover:bg-surface-sunken text-heading text-xs font-sans font-medium transition shadow-soft-sm shrink-0 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
            <span>{t('shop.filters', 'Filters')}</span>
            {activeFilterCount > 0 && (
              <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-text-inverted text-xs font-sans font-bold flex items-center justify-center leading-none">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

