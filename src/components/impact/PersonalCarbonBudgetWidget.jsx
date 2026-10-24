import React, { useState } from 'react';
import { Gauge, Info, HelpCircle, Sparkles } from 'lucide-react';
import { calculatePersonalCarbonBudget } from '../../lib/impactEconomics';

export default function PersonalCarbonBudgetWidget({ consumedKg = 0, defaultLimitKg = 50, className = '' }) {
  const [monthlyLimit, setMonthlyLimit] = useState(() => {
    try {
      const saved = localStorage.getItem('ecomart_carbon_budget');
      return saved ? Number(saved) : defaultLimitKg;
    } catch {
      return defaultLimitKg;
    }
  });

  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const budget = calculatePersonalCarbonBudget(consumedKg, monthlyLimit);

  const handleUpdateLimit = (newLimit) => {
    setMonthlyLimit(newLimit);
    try {
      localStorage.setItem('ecomart_carbon_budget', String(newLimit));
    } catch {}
  };

  const statusColors = {
    safe: 'bg-emerald-500 text-emerald-600 dark:text-emerald-400',
    approaching: 'bg-amber-500 text-amber-600 dark:text-amber-400',
    exceeded: 'bg-rose-500 text-rose-600 dark:text-rose-400'
  };

  return (
    <div className={`p-4 rounded-3xl bg-surface-raised border border-line shadow-soft-xs space-y-3 text-left ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-xs sm:text-sm text-heading">
              Personal Carbon Budget
            </h4>
            <div className="text-[10px] font-mono text-text-muted">
              Monthly Ceiling: {monthlyLimit} kg CO₂e
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowHowItWorks(!showHowItWorks)}
          title="How monthly carbon budget works"
          className="p-1.5 rounded-xl border border-line bg-surface hover:bg-surface-sunken text-text-muted hover:text-heading transition cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-primary" />
        </button>
      </div>

      {/* How it works drawer */}
      {showHowItWorks && (
        <div className="p-3 rounded-2xl bg-surface-sunken border border-line text-xs space-y-1.5 animate-fade-in">
          <div className="flex items-center gap-1.5 font-serif font-bold text-heading">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>How Your Carbon Budget Works</span>
          </div>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            The 50 kg CO₂e/month baseline corresponds to the Paris Climate Agreement individual consumption target for lifestyle goods. As you add items to your cart, this bar tracks embodied emissions against your monthly allocation.
          </p>
        </div>
      )}

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono font-bold text-heading">
            {budget.consumedKg} <span className="text-[10px] text-text-muted font-normal">kg used ({budget.percentage}%)</span>
          </span>
          <span className="font-mono text-text-muted text-[11px]">
            {budget.remainingKg} kg left
          </span>
        </div>

        <div className="w-full h-2.5 rounded-full bg-surface-sunken border border-line overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              budget.status === 'exceeded'
                ? 'bg-rose-500'
                : budget.status === 'approaching'
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${budget.percentage}%` }}
          />
        </div>
      </div>

      {/* Tangible Equivalent Footnote */}
      <div className="p-2.5 rounded-2xl bg-surface-sunken border border-line text-[11px] text-text-secondary flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
        <div>
          <span>Your cart currently represents <strong>{budget.equivalentDescription}</strong>.</span>
          <span className="text-[10px] text-text-muted block mt-0.5">
            Grid emission baseline: 0.82 kg CO₂/kWh (CEA India 2024).
          </span>
        </div>
      </div>

      {/* Quick Budget Limit Adjuster */}
      <div className="flex items-center justify-between pt-1 border-t border-line text-[10px] font-mono text-text-muted">
        <span>Adjust monthly limit:</span>
        <div className="flex gap-1">
          {[30, 50, 75, 100].map((lim) => (
            <button
              key={lim}
              type="button"
              onClick={() => handleUpdateLimit(lim)}
              className={`px-1.5 py-0.5 rounded cursor-pointer ${
                monthlyLimit === lim
                  ? 'bg-primary text-white font-bold'
                  : 'bg-surface hover:bg-surface-sunken border border-line'
              }`}
            >
              {lim}kg
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
