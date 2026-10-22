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
            className="p-1 rounded-full hover:bg-primary/20 transition text-primary cursor-pointer min-w-[24px] min-h-[24px] flex items-center justify-center"
            aria-label={`Clear filter ${chip.label}`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={onClearAll}
        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-sans font-medium text-muted hover:text-danger transition cursor-pointer min-h-[32px]"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset All</span>
      </button>
    </div>
  );
}

