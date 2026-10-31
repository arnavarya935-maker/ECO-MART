import React, { useState, useCallback } from 'react';
import { Brain, Trash2, RefreshCw, X, Sliders, DollarSign, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

function readMemoryFromStorage(userPriorities) {
  try {
    const budget = typeof localStorage !== 'undefined' ? localStorage.getItem('ecomart_stated_budget') : null;
    const cats = JSON.parse((typeof localStorage !== 'undefined' && localStorage.getItem('ecomart_viewed_categories')) || '[]');
    const goals = JSON.parse((typeof localStorage !== 'undefined' && localStorage.getItem('ecomart_active_goals')) || '[]');
    const signals = JSON.parse((typeof localStorage !== 'undefined' && localStorage.getItem('ecomart_preference_signals')) || '{"accepted":0,"declined":0}');

    return {
      budgetCeiling: budget ? parseInt(budget, 10) : null,
      favoriteCategories: Array.isArray(cats) ? cats.slice(0, 5) : [],
      savedGoals: Array.isArray(goals) ? goals : [],
      swapSignals: signals,
      customPriorities: userPriorities
    };
  } catch {
    return {
      budgetCeiling: null,
      favoriteCategories: [],
      savedGoals: [],
      swapSignals: { accepted: 0, declined: 0 },
      customPriorities: userPriorities
    };
  }
}

export default function AgentMemoryDrawer({ isOpen, onClose }) {
  const { userPriorities, resetPriorities } = useCart();
  const [memoryState, setMemoryState] = useState(() => readMemoryFromStorage(userPriorities));

  const refresh = useCallback(() => {
    setMemoryState(readMemoryFromStorage(userPriorities));
  }, [userPriorities]);

  const handleClearKey = (keyName) => {
    try {
      localStorage.removeItem(keyName);
      refresh();
    } catch {}
  };

  const handleWipeAll = () => {
    try {
      localStorage.removeItem('ecomart_stated_budget');
      localStorage.removeItem('ecomart_viewed_categories');
      localStorage.removeItem('ecomart_active_goals');
      localStorage.removeItem('ecomart_preference_signals');
      localStorage.removeItem('ecomart_gw_audits');
      resetPriorities?.();
      refresh();
    } catch {}
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="What the Eco Agent Remembers"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
    >
      <div className="w-full max-w-md rounded-3xl bg-surface-raised border border-line p-6 shadow-soft-2xl space-y-5 animate-scale-up text-left">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-heading">
                What I Remember
              </h2>
              <p className="text-[10px] text-text-muted font-mono uppercase tracking-wider">
                Local-First In-Memory &amp; LocalStorage State
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-sunken hover:bg-surface border border-line flex items-center justify-center text-text-muted hover:text-heading cursor-pointer transition-colors"
            aria-label="Close memory panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Memory Items List */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 text-xs">
          {/* Budget Limit Memory */}
          <div className="p-3.5 rounded-2xl bg-surface-sunken border border-line flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 font-semibold text-heading">
                <DollarSign className="w-3.5 h-3.5 text-primary" />
                <span>Budget Envelope</span>
              </div>
              <p className="text-[11px] text-text-secondary">
                {memoryState.budgetCeiling ? `₹${memoryState.budgetCeiling} per session limit` : 'No budget restriction stored'}
              </p>
            </div>
            {memoryState.budgetCeiling && (
              <button
                type="button"
                onClick={() => handleClearKey('ecomart_stated_budget')}
                className="text-text-muted hover:text-danger p-1 rounded transition-colors"
                title="Clear budget memory"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Decision Priorities */}
          <div className="p-3.5 rounded-2xl bg-surface-sunken border border-line flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 font-semibold text-heading">
                <Sliders className="w-3.5 h-3.5 text-primary" />
                <span>Sustainability Priorities</span>
              </div>
              <div className="flex flex-wrap gap-1 pt-1 font-mono text-[10px]">
                {userPriorities ? (
                  <>
                    <span className="px-2 py-0.5 rounded bg-surface border border-line">Carbon: {userPriorities.carbon || 25}%</span>
                    <span className="px-2 py-0.5 rounded bg-surface border border-line">Plastic: {userPriorities.plastic || 35}%</span>
                    <span className="px-2 py-0.5 rounded bg-surface border border-line">Price: {userPriorities.price || 25}%</span>
                  </>
                ) : (
                  <span className="text-text-muted">Standard balanced weighting</span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={resetPriorities}
              className="text-text-muted hover:text-danger p-1 rounded transition-colors"
              title="Reset priorities"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Frequently Browsed Categories */}
          <div className="p-3.5 rounded-2xl bg-surface-sunken border border-line space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-semibold text-heading">
                <Tag className="w-3.5 h-3.5 text-primary" />
                <span>Category Affinity Signals</span>
              </div>
              {memoryState.favoriteCategories.length > 0 && (
                <button
                  type="button"
                  onClick={() => handleClearKey('ecomart_viewed_categories')}
                  className="text-text-muted hover:text-danger p-1 rounded transition-colors"
                  title="Clear category memory"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {memoryState.favoriteCategories.length > 0 ? (
                memoryState.favoriteCategories.map((c, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-surface border border-line font-mono text-[10px] text-heading">
                    {c}
                  </span>
                ))
              ) : (
                <span className="text-text-muted text-[11px]">No frequent department affinity recorded yet.</span>
              )}
            </div>
          </div>

          {/* Proactive Swap Signals */}
          <div className="p-3.5 rounded-2xl bg-surface-sunken border border-line space-y-1">
            <div className="flex items-center justify-between font-semibold text-heading">
              <span>Smart Swap Decision History</span>
              <span className="font-mono text-[10px] text-primary">
                {memoryState.swapSignals.accepted} Accepted / {memoryState.swapSignals.declined} Declined
              </span>
            </div>
            <p className="text-[11px] text-text-secondary">
              The copilot suppresses swaps for product categories you frequently decline.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 border-t border-line flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleWipeAll}
            className="px-3.5 py-2 rounded-xl border border-danger/30 text-danger hover:bg-danger/10 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Wipe All Memory</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast text-xs font-semibold shadow-soft-xs transition cursor-pointer"
          >
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
}
