import React from 'react';
import { X, RotateCcw, SlidersHorizontal } from 'lucide-react';

export default function ShopFilterDrawer({
  isOpen,
  onClose,
  priceRange,
  onPriceChange,
  maxPriceLimit,
  selectedGrade,
  onGradeChange,
  onlyPlasticFree,
  onTogglePlasticFree,
  onlyEcoFriendly,
  onToggleEcoFriendly,
  selectedCert,
  onCertChange,
  availableCerts,
  onResetFilters,
  resultCount
}) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Filter Catalog"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden text-stone-900 max-h-[85vh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
            <h3 className="font-black text-base text-[#0B3B2C]">Filter Catalog</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* 1. Price Range Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-extrabold text-stone-850">
              <span>Max Price</span>
              <span className="text-emerald-700 text-sm font-black">₹{priceRange}</span>
            </div>
            <input
              type="range"
              min="100"
              max={maxPriceLimit}
              step="50"
              value={priceRange}
              onChange={(e) => onPriceChange(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-bold">
              <span>₹100</span>
              <span>₹{maxPriceLimit}</span>
            </div>
          </div>

          {/* 2. Eco Score Grade Filter */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <span className="font-extrabold text-stone-850 block">Minimum Eco-Score Grade</span>
            <div className="grid grid-cols-5 gap-2">
              {['All', 'A', 'B', 'C', 'D'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => onGradeChange(g)}
                  className={`py-2 text-center rounded-xl font-bold border transition ${
                    selectedGrade === g
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                >
                  {g === 'All' ? 'Any' : `Grade ${g}`}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Sustainable Attributes */}
          <div className="space-y-2.5 pt-2 border-t border-stone-100">
            <span className="font-extrabold text-stone-850 block">Sustainability Standards</span>

            <label className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 hover:bg-stone-100/70 border border-stone-200 cursor-pointer transition select-none">
              <input
                type="checkbox"
                checked={onlyPlasticFree}
                onChange={(e) => onTogglePlasticFree(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-600 accent-emerald-700"
              />
              <div>
                <span className="font-bold text-stone-850 block">100% Zero-Plastic Packaging</span>
                <span className="text-[11px] text-stone-500">Biodegradable paper, glass, or cotton only</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 hover:bg-stone-100/70 border border-stone-200 cursor-pointer transition select-none">
              <input
                type="checkbox"
                checked={onlyEcoFriendly}
                onChange={(e) => onToggleEcoFriendly(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-600 accent-emerald-700"
              />
              <div>
                <span className="font-bold text-stone-850 block">Certified Eco Items Only</span>
                <span className="text-[11px] text-stone-500">Excludes conventional items used for swapping</span>
              </div>
            </label>
          </div>

          {/* 4. Third-Party Certifications */}
          {availableCerts && availableCerts.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <span className="font-extrabold text-stone-850 block">Verified Certification</span>
              <div className="flex flex-wrap gap-1.5">
                {availableCerts.map((cert) => {
                  const isSelected = selectedCert === cert;
                  return (
                    <button
                      key={cert}
                      type="button"
                      onClick={() => onCertChange(isSelected ? null : cert)}
                      className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition ${
                        isSelected
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {cert}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-stone-600 hover:text-rose-600 font-bold text-xs transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-xs transition text-center"
          >
            Show {resultCount} Result{resultCount !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
}
