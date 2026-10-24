import React from 'react';
import { RotateCcw, SlidersHorizontal } from 'lucide-react';
import { Drawer } from '../ui/Modal';
import PrioritiesPanel from '../decision/PrioritiesPanel';

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

  const title = (
    <div className="flex items-center gap-2.5">
      <SlidersHorizontal className="w-4 h-4 text-primary" />
      <h3 className="font-serif text-lg font-bold text-heading tracking-tight">Filter Catalog</h3>
    </div>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
    >

        {/* Filters Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs font-sans">
          {/* Priorities MCDM Panel */}
          <PrioritiesPanel compact className="mb-2" />

          {/* 1. Price Range Slider */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between font-medium text-heading">
              <span className="font-semibold text-sm">Max Price</span>
              <span className="text-primary text-sm font-bold">₹{priceRange}</span>
            </div>
            <input
              type="range"
              min="100"
              max={maxPriceLimit}
              step="50"
              value={priceRange}
              onChange={(e) => onPriceChange(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer h-2 bg-surface-sunken rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-muted font-medium">
              <span>₹100</span>
              <span>₹{maxPriceLimit}</span>
            </div>
          </div>

          {/* 2. Eco Score Grade Filter */}
          <div className="space-y-2.5 pt-3 border-t border-line">
            <span className="font-semibold text-heading text-sm block">Minimum Eco-Score Grade</span>
            <div className="grid grid-cols-5 gap-2">
              {['All', 'A', 'B', 'C', 'D'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => onGradeChange(g)}
                  className={`py-2.5 min-h-[44px] text-center rounded-2xl font-medium border transition cursor-pointer ${
                    selectedGrade === g
                      ? 'bg-primary text-text-inverted border-primary shadow-soft-sm font-semibold'
                      : 'bg-surface-sunken hover:bg-surface-accent text-text border-line'
                  }`}
                >
                  {g === 'All' ? 'Any' : `Grade ${g}`}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Sustainable Attributes */}
          <div className="space-y-3 pt-3 border-t border-line">
            <span className="font-semibold text-heading text-sm block">Sustainability Standards</span>

            <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface-sunken hover:bg-surface-accent border border-line cursor-pointer transition select-none min-h-[44px]">
              <input
                type="checkbox"
                checked={onlyPlasticFree}
                onChange={(e) => onTogglePlasticFree(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-focus accent-primary cursor-pointer"
              />
              <div>
                <span className="font-semibold text-heading block">100% Zero-Plastic Packaging</span>
                <span className="text-[11px] text-muted">Biodegradable paper, glass, or cotton only</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface-sunken hover:bg-surface-accent border border-line cursor-pointer transition select-none min-h-[44px]">
              <input
                type="checkbox"
                checked={onlyEcoFriendly}
                onChange={(e) => onToggleEcoFriendly(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-focus accent-primary cursor-pointer"
              />
              <div>
                <span className="font-semibold text-heading block">Certified Eco Items Only</span>
                <span className="text-[11px] text-muted">Excludes conventional items used for swapping</span>
              </div>
            </label>
          </div>

          {/* 4. Third-Party Certifications */}
          {availableCerts && availableCerts.length > 0 && (
            <div className="space-y-2.5 pt-3 border-t border-line">
              <span className="font-semibold text-heading text-sm block">Certifications Claimed</span>
              <div className="flex flex-wrap gap-2">
                {availableCerts.map((cert) => {
                  const isSelected = selectedCert === cert;
                  return (
                    <button
                      key={cert}
                      type="button"
                      onClick={() => onCertChange(isSelected ? null : cert)}
                      className={`px-3.5 py-2 min-h-[44px] rounded-2xl border text-xs font-medium transition cursor-pointer ${
                        isSelected
                          ? 'bg-primary text-text-inverted border-primary font-semibold'
                          : 'bg-surface-sunken text-text border-line hover:bg-surface-accent'
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
        <div className="p-4 border-t border-line bg-surface-sunken flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-2xl text-muted hover:text-danger font-medium text-xs transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-5 min-h-[44px] rounded-2xl bg-primary hover:bg-primary-hover text-text-inverted font-medium text-xs shadow-soft-sm transition text-center cursor-pointer"
          >
            Show {resultCount} Result{resultCount !== 1 ? 's' : ''}
          </button>
        </div>
    </Drawer>
  );
}

