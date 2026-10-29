import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { findCategory } from '../../data/categories.js';

export default function ShopActiveChips({
  category = 'all',
  onClearCategory,
  priceRange,
  maxPriceLimit = 3000,
  onResetPrice,
  selectedGrade = 'all',
  onClearGrade,
  onlyPlasticFree = false,
  onTogglePlasticFree,
  ecoCertifiedOnly = false,
  onToggleEcoCertified,
  selectedCert = 'all',
  onClearCert,
  selectedMaterial = 'all',
  onClearMaterial,
  selectedSeason = 'all',
  onClearSeason,
  minRating = 0,
  onClearRating,
  inStockOnly = false,
  onToggleInStock,
  searchQuery = '',
  onClearSearch,
  sortBy = 'featured',
  onResetSort,
  onClearAll
}) {
  const chips = [];

  const catObj = findCategory(category);
  if (catObj && catObj.id !== 'all') {
    chips.push({
      id: 'category',
      label: `Department: ${catObj.label}`,
      onClear: onClearCategory
    });
  }

  if (searchQuery) {
    chips.push({
      id: 'search',
      label: `Search: "${searchQuery}"`,
      onClear: onClearSearch
    });
  }

  if (priceRange && priceRange < maxPriceLimit) {
    chips.push({
      id: 'price',
      label: `Under ₹${priceRange}`,
      onClear: onResetPrice
    });
  }

  if (selectedGrade && selectedGrade.toLowerCase() !== 'all') {
    chips.push({
      id: 'grade',
      label: `Grade ${selectedGrade.toUpperCase()}`,
      onClear: onClearGrade
    });
  }

  if (onlyPlasticFree) {
    chips.push({
      id: 'plastic',
      label: 'Plastic-Free Only',
      onClear: onTogglePlasticFree
    });
  }

  if (ecoCertifiedOnly) {
    chips.push({
      id: 'eco-certified',
      label: 'Eco Certified Only',
      onClear: onToggleEcoCertified
    });
  }

  if (selectedCert && selectedCert !== 'all') {
    chips.push({
      id: 'cert',
      label: `Cert: ${selectedCert}`,
      onClear: onClearCert
    });
  }

  if (selectedMaterial && selectedMaterial !== 'all') {
    chips.push({
      id: 'material',
      label: `Material: ${selectedMaterial}`,
      onClear: onClearMaterial
    });
  }

  if (selectedSeason && selectedSeason.toLowerCase() !== 'all') {
    const seasonLabels = {
      monsoon: 'Monsoon Essentials',
      summer: 'Summer Zero-Waste',
      festive: 'Festive Gifting',
      winter: 'Winter Care'
    };
    chips.push({
      id: 'season',
      label: `Season: ${seasonLabels[selectedSeason.toLowerCase()] || selectedSeason}`,
      onClear: onClearSeason
    });
  }

  if (minRating > 0) {
    chips.push({
      id: 'rating',
      label: `★ ${minRating}+ Stars`,
      onClear: onClearRating
    });
  }

  if (inStockOnly) {
    chips.push({
      id: 'instock',
      label: 'In Stock Only',
      onClear: onToggleInStock
    });
  }

  if (sortBy && sortBy !== 'featured') {
    const sortLabels = {
      'impact-rupee': 'Sorted: Impact / Rupee',
      'eco-desc': 'Sorted: Highest Eco-Score',
      'price-asc': 'Sorted: Price Low to High',
      'price-desc': 'Sorted: Price High to Low',
      'carbon-asc': 'Sorted: Lowest Carbon'
    };
    chips.push({
      id: 'sort',
      label: sortLabels[sortBy] || `Sorted: ${sortBy}`,
      onClear: onResetSort
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap py-2 text-xs font-sans animate-fade-in">
      <span className="text-muted font-medium text-[11px] uppercase tracking-wider mr-1">
        Active Filters:
      </span>

      {chips.map((chip) => (
        <span
          key={chip.id}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-subtle text-primary border border-primary/20 font-medium text-xs shadow-soft-sm"
        >
          <span>{chip.label}</span>
          <button
            type="button"
            onClick={chip.onClear}
            className="p-1 rounded-full hover:bg-primary/20 transition text-primary cursor-pointer min-w-[20px] min-h-[20px] flex items-center justify-center"
            aria-label={`Clear filter ${chip.label}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={onClearAll}
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-raised hover:bg-surface-sunken border border-line text-text-muted hover:text-heading text-xs font-semibold transition cursor-pointer ml-auto"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Reset All ({chips.length})</span>
      </button>
    </div>
  );
}
