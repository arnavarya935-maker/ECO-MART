import React from 'react';
import { X, RotateCcw } from 'lucide-react';

export default function ShopActiveChips({
  category,
  onClearCategory,
  priceRange,
  maxPriceLimit,
  onResetPrice,
  selectedGrade,
  onClearGrade,
  onlyPlasticFree,
  onTogglePlasticFree,
  onlyEcoFriendly,
  onToggleEcoFriendly,
  searchQuery,
  onClearSearch,
  sortBy,
  onResetSort,
  onClearAll
}) {
  const chips = [];

  if (category && category !== 'All') {
    chips.push({
      id: 'cat',
      label: `Category: ${category}`,
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

  if (priceRange < maxPriceLimit) {
    chips.push({
      id: 'price',
      label: `Under ₹${priceRange}`,
      onClear: onResetPrice
    });
  }

  if (selectedGrade && selectedGrade !== 'All') {
    chips.push({
      id: 'grade',
      label: `Grade ${selectedGrade}`,
      onClear: onClearGrade
    });
  }

  if (onlyPlasticFree) {
    chips.push({
      id: 'plastic',
      label: 'Zero Plastic Only',
      onClear: onTogglePlasticFree
    });
  }

  if (onlyEcoFriendly) {
    chips.push({
      id: 'eco',
      label: 'Eco Certified Only',
      onClear: onToggleEcoFriendly
    });
  }

  if (sortBy === 'impact-rupee') {
    chips.push({
      id: 'sort-impact',
      label: 'Sorted: Impact / Rupee',
      onClear: onResetSort
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap py-2 text-xs animate-fade-in">
      <span className="text-stone-400 font-bold text-[11px] uppercase tracking-wider mr-1">
        Active Filters:
      </span>

      {chips.map((chip) => (
        <span
          key={chip.id}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-bold shadow-2xs"
        >
          <span>{chip.label}</span>
          <button
            type="button"
            onClick={chip.onClear}
            className="p-0.5 rounded-full hover:bg-emerald-200/60 transition text-emerald-700"
            aria-label={`Clear filter ${chip.label}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={onClearAll}
        className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-500 hover:text-rose-600 transition ml-1"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Reset All</span>
      </button>
    </div>
  );
}
