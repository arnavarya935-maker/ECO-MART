import React, { useState } from 'react';
import { ArrowUpRight, Info, ShieldCheck, Leaf, Droplets, Trash2 } from 'lucide-react';
import AnimatedCounter from '../AnimatedCounter';
import { useT } from '../../context/I18nContext';

export default function TransformerSummaryBar({ totals }) {
  const { t } = useT();
  const [showTooltip, setShowTooltip] = useState(false);

  if (!totals) return null;

  const {
    priceBefore = 0,
    priceAfter = 0,
    priceDelta = 0,
    purposeScoreBefore = 0,
    purposeScoreAfter = 0,
    plasticSaved = 0,
    co2Saved = 0,
    waterSaved = 0,
    itemsSwapped = 0,
    overBudget = false,
    effectiveBudget = 0
  } = totals;

  const scoreDelta = purposeScoreAfter - purposeScoreBefore;

  return (
    <div className="bg-surface border border-line rounded-3xl p-6 shadow-soft-md space-y-6">
      {/* Over-budget Notice Banner if applicable */}
      {overBudget && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 flex items-center justify-between gap-2">
          <span>
            ⚠️ Total list price (₹{priceAfter}) exceeds your ₹{effectiveBudget} budget by ₹{priceAfter - effectiveBudget}. Showing closest greener options.
          </span>
        </div>
      )}

      {/* Main Grid: Purpose Score + Impact Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Purpose Score Card */}
        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-primary">
              {t('transformer.purposeScore', 'Purpose Score')}
            </span>
            <button
              type="button"
              onClick={() => setShowTooltip(!showTooltip)}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="text-primary/70 hover:text-primary cursor-pointer p-0.5 focus-visible:outline-2 focus-visible:outline-focus"
              aria-label="How Purpose Score is calculated"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-heading">
              <AnimatedCounter value={purposeScoreAfter} decimals={0} />
            </span>
            <span className="text-xs text-muted">/100</span>
            {scoreDelta > 0 && (
              <span className="text-xs font-bold text-emerald-600 flex items-center">
                <ArrowUpRight className="w-3 h-3" />+{scoreDelta}
              </span>
            )}
          </div>

          <div className="text-[11px] text-secondary mt-1">
            Before: {purposeScoreBefore}/100
          </div>

          {/* Tooltip Overlay */}
          {showTooltip && (
            <div className="absolute top-full left-0 mt-2 z-20 w-64 p-3 rounded-2xl bg-surface-raised border border-line shadow-soft-lg text-[11px] text-secondary leading-relaxed">
              <p className="font-semibold text-heading mb-1">Purpose Score Formula:</p>
              <p>Quantity-weighted average EcoScore across all items in cart: round( Σ(EcoScore × Qty) / Σ(Qty) ).</p>
            </div>
          )}
        </div>

        {/* Plastic Saved */}
        <div className="p-4 rounded-2xl bg-surface-raised border border-line">
          <div className="flex items-center gap-1.5 text-[10px] font-sans font-semibold uppercase tracking-wider text-muted">
            <Trash2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('transformer.plasticSaved', 'Plastic Avoided')}</span>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-serif font-bold text-heading">
            <AnimatedCounter value={plasticSaved} decimals={0} suffix="g" />
          </div>
          <div className="text-[11px] text-secondary mt-1 flex items-center gap-1">
            <span>vs conventional</span>
            <span className="text-[9px] uppercase px-1 rounded bg-surface-sunken text-muted">Estimate</span>
          </div>
        </div>

        {/* CO2 Diverted */}
        <div className="p-4 rounded-2xl bg-surface-raised border border-line">
          <div className="flex items-center gap-1.5 text-[10px] font-sans font-semibold uppercase tracking-wider text-muted">
            <Leaf className="w-3.5 h-3.5 text-teal-600" />
            <span>{t('transformer.co2Saved', 'CO₂ Diverted')}</span>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-serif font-bold text-heading">
            <AnimatedCounter value={co2Saved} decimals={2} suffix="kg" />
          </div>
          <div className="text-[11px] text-secondary mt-1 flex items-center gap-1">
            <span>lifecycle footprint</span>
            <span className="text-[9px] uppercase px-1 rounded bg-surface-sunken text-muted">Estimate</span>
          </div>
        </div>

        {/* Water Conserved */}
        <div className="p-4 rounded-2xl bg-surface-raised border border-line">
          <div className="flex items-center gap-1.5 text-[10px] font-sans font-semibold uppercase tracking-wider text-muted">
            <Droplets className="w-3.5 h-3.5 text-sky-600" />
            <span>{t('transformer.waterSaved', 'Water Saved')}</span>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-serif font-bold text-heading">
            <AnimatedCounter value={waterSaved} decimals={0} suffix="L" />
          </div>
          <div className="text-[11px] text-secondary mt-1">
            freshwater conserved
          </div>
        </div>
      </div>

      {/* Spend Comparison Bar */}
      <div className="border-t border-line pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-muted block text-[10px] uppercase tracking-wider">
              {t('transformer.priceBefore', 'Usual Spend')}:
            </span>
            <span className="text-sm font-semibold text-secondary">₹{priceBefore}</span>
          </div>
          <span className="text-muted">→</span>
          <div>
            <span className="text-primary block text-[10px] uppercase tracking-wider font-semibold">
              {t('transformer.priceAfter', 'Sustainable Spend')}:
            </span>
            <span className="text-sm sm:text-base font-bold text-heading">₹{priceAfter}</span>
          </div>
          <div className="pl-2 border-l border-line">
            <span className="text-muted block text-[10px] uppercase tracking-wider">Delta:</span>
            <span className={`font-semibold ${priceDelta > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {priceDelta > 0 ? `+₹${priceDelta}` : `₹${priceDelta}`}
            </span>
          </div>
        </div>

        <div className="text-secondary font-medium flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
          <span>{itemsSwapped} item(s) upgraded to sustainable alternatives</span>
        </div>
      </div>
    </div>
  );
}
