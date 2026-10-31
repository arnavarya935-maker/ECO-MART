import React from 'react';
import { RotateCcw, SlidersHorizontal, Info } from 'lucide-react';
import { Drawer } from '../ui/Modal';
import { CATEGORIES, findCategory } from '../../data/categories.js';

const POPULAR_MATERIALS = [
  'All',
  'Bamboo',
  'Organic Cotton',
  'Stainless Steel',
  'Reclaimed Wood',
  'Glass',
  'Natural Jute',
  'Brass',
  'Terracotta / Clay',
  'Recycled Paper',
  'Coconut Coir'
];

const SEASONS = [
  { id: 'all', label: 'All Seasons' },
  { id: 'monsoon', label: '🌧️ Monsoon Essentials' },
  { id: 'summer', label: '☀️ Summer Zero-Waste' },
  { id: 'festive', label: '🪔 Festive Gifting' },
  { id: 'winter', label: '❄️ Winter Care' }
];

export default function ShopFilterDrawer({
  isOpen,
  onClose,
  category = 'all',
  onCategoryChange,
  priceRange,
  onPriceChange,
  maxPriceLimit = 3000,
  selectedGrade = 'all',
  onGradeChange,
  onlyPlasticFree = false,
  onTogglePlasticFree,
  ecoCertifiedOnly = false,
  onToggleEcoCertified,
  selectedCert = 'all',
  onCertChange,
  availableCerts = [],
  selectedMaterial = 'all',
  onMaterialChange,
  selectedSeason = 'all',
  onSeasonChange,
  minRating = 0,
  onRatingChange,
  inStockOnly = false,
  onToggleInStock,
  onResetFilters,
  resultCount = 0
}) {
  if (!isOpen) return null;

  const currentCatObj = findCategory(category);
  const currentCatId = currentCatObj?.id || 'all';

  const title = (
    <div className="flex items-center gap-2.5">
      <SlidersHorizontal className="w-4 h-4 text-primary" />
      <h3 className="font-serif text-lg font-bold text-heading tracking-tight">Filter Catalogue</h3>
    </div>
  );

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs font-sans">
        {/* 1. Category Department */}
        <div className="space-y-2">
          <span className="font-semibold text-heading text-sm block">Department Category</span>
          <select
            value={currentCatId}
            onChange={(e) => onCategoryChange && onCategoryChange(e.target.value)}
            className="w-full px-3.5 py-2.5 min-h-[44px] rounded-2xl bg-surface-sunken border border-line text-xs font-sans font-medium text-heading focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Price Range Slider */}
        <div className="space-y-2.5 pt-3 border-t border-line">
          <div className="flex items-center justify-between font-medium text-heading">
            <span className="font-semibold text-sm">Max Price Ceiling</span>
            <span className="text-primary text-sm font-bold">₹{priceRange}</span>
          </div>
          <input
            type="range"
            min="100"
            max={maxPriceLimit}
            step="50"
            value={priceRange}
            onChange={(e) => onPriceChange && onPriceChange(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer h-2 bg-surface-sunken rounded-lg"
          />
          <div className="flex justify-between text-[11px] text-muted font-medium">
            <span>₹100</span>
            <span>₹{maxPriceLimit}</span>
          </div>
        </div>

        {/* 3. Eco-Score Grade Filter */}
        <div className="space-y-2.5 pt-3 border-t border-line">
          <span className="font-semibold text-heading text-sm block">Minimum Eco-Score Grade</span>
          <div className="grid grid-cols-5 gap-2">
            {['all', 'A', 'B', 'C', 'D'].map((g) => {
              const isSelected = selectedGrade?.toLowerCase() === g.toLowerCase();
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => onGradeChange && onGradeChange(g)}
                  className={`py-2.5 min-h-[44px] text-center rounded-2xl font-medium border transition cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-text-inverted border-primary shadow-soft-sm font-semibold'
                      : 'bg-surface-sunken hover:bg-surface-accent text-text border-line'
                  }`}
                >
                  {g === 'all' ? 'Any' : `Grade ${g}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Sustainable Standards (Plastic-Free & Eco Certified with Tooltip) */}
        <div className="space-y-3 pt-3 border-t border-line">
          <span className="font-semibold text-heading text-sm block">Sustainability Standards</span>

          <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface-sunken hover:bg-surface-accent border border-line cursor-pointer transition select-none min-h-[44px]">
            <input
              type="checkbox"
              checked={onlyPlasticFree}
              onChange={(e) => onTogglePlasticFree && onTogglePlasticFree(e.target.checked)}
              className="w-4 h-4 rounded text-primary focus:ring-focus accent-primary cursor-pointer"
            />
            <div>
              <span className="font-semibold text-heading block">Plastic-Free Packaging</span>
              <span className="text-[11px] text-muted">Biodegradable paper, glass, or cotton only</span>
            </div>
          </label>

          {/* Eco Certified Only with Tooltip */}
          <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-surface-sunken hover:bg-surface-accent border border-line cursor-pointer transition select-none min-h-[44px]">
            <input
              type="checkbox"
              checked={ecoCertifiedOnly}
              onChange={(e) => onToggleEcoCertified && onToggleEcoCertified(e.target.checked)}
              className="w-4 h-4 rounded text-primary focus:ring-focus accent-primary cursor-pointer mt-0.5"
            />
            <div className="space-y-0.5 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-heading">Lists a certification (seller claim)</span>
                <span
                  className="inline-flex text-muted hover:text-heading cursor-help"
                  title="Shows products that list a certification. These are claims by the seller in sample data. Tap a badge to open the issuer's website to check."
                >
                  <Info className="w-3.5 h-3.5 text-primary" />
                </span>
              </div>
              <span className="text-[11px] text-muted block leading-tight">
                Shows products that list a certification. These are claims by the seller in sample data. Tap a badge to open the issuer's website to check.
              </span>
            </div>
          </label>
        </div>

        {/* 5. Specific Certification */}
        {availableCerts.length > 0 && (
          <div className="space-y-2 pt-3 border-t border-line">
            <span className="font-semibold text-heading text-sm block">Specific Certification Standard</span>
            <select
              value={selectedCert || 'all'}
              onChange={(e) => onCertChange && onCertChange(e.target.value)}
              className="w-full px-3.5 py-2.5 min-h-[44px] rounded-2xl bg-surface-sunken border border-line text-xs font-sans font-medium text-heading focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
            >
              <option value="all">Any Certification ({availableCerts.length} available)</option>
              {availableCerts.map((cert) => (
                <option key={cert} value={cert}>
                  {cert}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 6. Material Filter */}
        <div className="space-y-2 pt-3 border-t border-line">
          <span className="font-semibold text-heading text-sm block">Primary Material</span>
          <select
            value={selectedMaterial || 'all'}
            onChange={(e) => onMaterialChange && onMaterialChange(e.target.value)}
            className="w-full px-3.5 py-2.5 min-h-[44px] rounded-2xl bg-surface-sunken border border-line text-xs font-sans font-medium text-heading focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
          >
            {POPULAR_MATERIALS.map((mat) => (
              <option key={mat} value={mat === 'All' ? 'all' : mat}>
                {mat === 'All' ? 'All Materials' : mat}
              </option>
            ))}
          </select>
        </div>

        {/* 7. Seasonal Collection */}
        <div className="space-y-2 pt-3 border-t border-line">
          <span className="font-semibold text-heading text-sm block">Seasonal & Regional Collection</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SEASONS.map((s) => {
              const isSelected = selectedSeason?.toLowerCase() === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onSeasonChange && onSeasonChange(s.id)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-medium transition cursor-pointer ${
                    isSelected
                      ? 'bg-primary/10 border-primary text-primary font-semibold'
                      : 'bg-surface-sunken border-line text-text hover:bg-surface-accent'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 8. Customer Rating & In-Stock */}
        <div className="space-y-3 pt-3 border-t border-line">
          <span className="font-semibold text-heading text-sm block">Availability & Ratings</span>

          <div className="flex gap-2">
            {[
              { val: 0, label: 'Any Rating' },
              { val: 4.0, label: '★ 4.0+' },
              { val: 4.5, label: '★ 4.5+' }
            ].map((r) => (
              <button
                key={r.val}
                type="button"
                onClick={() => onRatingChange && onRatingChange(r.val)}
                className={`flex-1 py-2 rounded-xl text-xs font-medium border transition cursor-pointer ${
                  minRating === r.val
                    ? 'bg-primary text-text-inverted border-primary font-semibold'
                    : 'bg-surface-sunken border-line text-text hover:bg-surface-accent'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-3 p-3 rounded-2xl bg-surface-sunken hover:bg-surface-accent border border-line cursor-pointer transition select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => onToggleInStock && onToggleInStock(e.target.checked)}
              className="w-4 h-4 rounded text-primary focus:ring-focus accent-primary cursor-pointer"
            />
            <span className="font-semibold text-heading text-xs">In Stock Items Only</span>
          </label>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-line flex items-center justify-between gap-3 bg-surface-raised">
        <button
          type="button"
          onClick={onResetFilters}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-surface hover:bg-surface-sunken border border-line text-heading text-xs font-semibold transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-muted" />
          <span>Reset All</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-5 py-2.5 rounded-2xl bg-primary hover:bg-primary-hover text-primary-contrast text-xs font-semibold shadow-soft-sm transition cursor-pointer text-center"
        >
          View {resultCount} Product{resultCount !== 1 ? 's' : ''}
        </button>
      </div>
    </Drawer>
  );
}
