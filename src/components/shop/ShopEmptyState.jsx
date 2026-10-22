import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

export default function ShopEmptyState({ onReset, onSearchSuggestion }) {
  const suggestions = ['Bamboo Cutlery', 'Organic Cotton', 'Seed Paper', 'Solid Shampoo', 'Copper Tumbler'];

  return (
    <div className="py-20 px-6 text-center bg-surface-raised rounded-3xl border border-line shadow-soft-sm space-y-5 my-6">
      <div className="w-16 h-16 rounded-3xl bg-surface-sunken text-primary flex items-center justify-center mx-auto text-2xl border border-line shadow-soft-sm">
        <SearchX className="w-8 h-8 text-primary" />
      </div>

      <div className="space-y-1.5">
        <h3 className="font-serif text-xl font-bold text-heading tracking-tight">
          No sustainable products matched your filter criteria
        </h3>
        <p className="font-sans text-xs sm:text-sm text-muted max-w-md mx-auto leading-relaxed">
          Try broadening your price range, clearing specific certification filters, or exploring our recommended conscious keywords.
        </p>
      </div>

      {/* Suggested keywords */}
      <div className="space-y-2 pt-2">
        <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-muted block">
          Try Searching For:
        </span>
        <div className="flex flex-wrap justify-center gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSearchSuggestion(s)}
              className="px-3.5 py-2 min-h-[36px] rounded-full bg-surface-sunken hover:bg-surface-accent hover:text-primary text-text text-xs font-sans font-medium transition border border-line cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Reset button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-2xl bg-primary hover:bg-primary-hover text-text-inverted font-sans font-medium text-xs shadow-soft-sm transition cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset All Filters</span>
        </button>
      </div>
    </div>
  );
}

