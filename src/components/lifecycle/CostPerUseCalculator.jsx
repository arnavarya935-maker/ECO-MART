import React, { useState, useMemo } from 'react';
import { Coins, HelpCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { calculateCostPerUse } from '../../lib/impactEconomics';

export default function CostPerUseCalculator({ product, className = '' }) {
  const defaultPrice = product?.price || 499;
  const [lifespanUses, setLifespanUses] = useState(250);
  const [disposablePrice, setDisposablePrice] = useState(20);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const econ = useMemo(() => {
    return calculateCostPerUse({
      durablePrice: defaultPrice,
      durableUsesCount: lifespanUses,
      disposablePrice,
      disposableUsesCount: 1
    });
  }, [defaultPrice, lifespanUses, disposablePrice]);

  return (
    <div className={`p-4 sm:p-5 rounded-3xl bg-surface-raised border border-line shadow-soft-xs space-y-4 text-left ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm sm:text-base text-heading">
              Durability Economics &amp; Cost-Per-Use
            </h4>
            <div className="text-[10px] font-mono text-text-muted">
              Lifetime Financial Value vs Single-Use Consumables
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowHowItWorks(!showHowItWorks)}
          title="How cost per use is computed"
          className="p-1.5 rounded-xl border border-line bg-surface hover:bg-surface-sunken text-text-muted hover:text-heading transition cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-primary" />
        </button>
      </div>

      {/* How it works drawer */}
      {showHowItWorks && (
        <div className="p-3.5 rounded-2xl bg-surface-sunken border border-line text-xs space-y-1.5 animate-fade-in">
          <div className="flex items-center gap-1.5 font-serif font-bold text-heading">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>How Cost-Per-Use Is Calculated</span>
          </div>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            Durable Cost Per Use = Upfront Purchase Price ÷ Estimated Lifetime Uses. Disposable Spend = Disposable Unit Cost × Equivalent Uses. Net Savings = Disposable Spend − Upfront Price.
          </p>
        </div>
      )}

      {/* Comparison Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Durable Item */}
        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/25 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold">
            Conscious Durable Item
          </span>
          <div className="font-serif font-bold text-2xl text-heading">
            ₹{econ.durable.costPerUse} <span className="text-xs font-normal text-text-muted">/ use</span>
          </div>
          <p className="text-[11px] text-text-secondary">
            Based on ₹{defaultPrice} upfront spread across {lifespanUses} uses.
          </p>
        </div>

        {/* Disposable Alternative */}
        <div className="p-4 rounded-2xl bg-surface-sunken border border-line space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted font-bold">
            Disposable Alternative
          </span>
          <div className="font-serif font-bold text-2xl text-heading">
            ₹{econ.disposable.costPerUse} <span className="text-xs font-normal text-text-muted">/ use</span>
          </div>
          <p className="text-[11px] text-text-secondary">
            Would cost ~₹{econ.disposable.equivalentTotalSpend.toLocaleString('en-IN')} over {lifespanUses} single-use replacements.
          </p>
        </div>
      </div>

      {/* Summary Verdict Callout */}
      <div className="p-3.5 rounded-2xl bg-surface-sunken border border-line flex items-start gap-2.5">
        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-serif font-bold text-xs text-heading">
            Economic Payback Analysis
          </span>
          <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
            {econ.verdict}
          </p>
        </div>
      </div>

      {/* Interactive Simulation Sliders */}
      <div className="p-3.5 rounded-2xl bg-surface border border-line space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs font-mono text-text-muted mb-1">
            <span>Expected Lifespan Uses: {lifespanUses} times</span>
          </div>
          <input
            type="range"
            min="30"
            max="1000"
            step="10"
            value={lifespanUses}
            onChange={(e) => setLifespanUses(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer"
          />
        </div>

        <div>
          <div className="flex items-center justify-between text-xs font-mono text-text-muted mb-1">
            <span>Disposable Single-Use Price: ₹{disposablePrice}</span>
          </div>
          <input
            type="range"
            min="5"
            max="100"
            step="5"
            value={disposablePrice}
            onChange={(e) => setDisposablePrice(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
