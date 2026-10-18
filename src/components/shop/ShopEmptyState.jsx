import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

export default function ShopEmptyState({ onReset, onSearchSuggestion }) {
  const suggestions = ['Bamboo Cutlery', 'Organic Cotton', 'Seed Paper', 'Solid Shampoo', 'Copper Tumbler'];

  return (
    <div className="py-20 px-4 text-center bg-white rounded-3xl border border-stone-200/90 shadow-2xs space-y-5 my-6">
      <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-2xl border border-amber-200/60 shadow-2xs">
        <SearchX className="w-8 h-8 text-amber-700" />
      </div>

      <div className="space-y-1">
        <h3 className="font-black text-lg text-stone-900">
          No sustainable products matched your filter criteria
        </h3>
        <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
          Try broadening your price range, clearing specific certification filters, or exploring our recommended conscious keywords.
        </p>
      </div>

      {/* Suggested keywords */}
      <div className="space-y-2 pt-2">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400 block">
          Try Searching For:
        </span>
        <div className="flex flex-wrap justify-center gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSearchSuggestion(s)}
              className="px-3 py-1.5 rounded-full bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 text-xs font-bold transition border border-stone-200/60"
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
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-xs transition"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset All Filters</span>
        </button>
      </div>
    </div>
  );
}
