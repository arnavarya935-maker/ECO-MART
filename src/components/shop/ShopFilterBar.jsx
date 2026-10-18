import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';

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
  return (
    <div className="sticky top-18 z-30 bg-[#faf9f6]/95 backdrop-blur-md py-3.5 border-b border-stone-200/80 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search input bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by product, material, or keyword..."
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white border border-stone-200 text-xs sm:text-sm font-medium outline-hidden placeholder:text-stone-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 shadow-2xs transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right controls: Category scroll, Sort & Filter Drawer Button */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {/* Category Dropdown */}
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 focus:outline-hidden cursor-pointer shadow-2xs"
            aria-label="Filter by category"
          >
            <option value="All">All Categories (8)</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Sort Selector (Including Feature 23: Impact per Rupee) */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-stone-200 shadow-2xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-stone-700 focus:outline-hidden cursor-pointer"
              aria-label="Sort products"
            >
              <option value="featured">Featured Picks</option>
              <option value="impact-rupee">🌱 Impact / Rupee</option>
              <option value="eco-desc">Eco-Score: Highest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="carbon-asc">Carbon: Lowest</option>
            </select>
          </div>

          {/* Mobile Filter Drawer Button */}
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold transition shadow-2xs min-h-[38px] shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-700 text-white text-[9px] font-black flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
