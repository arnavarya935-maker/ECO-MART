import React, { useState } from 'react';
import {
  Wrench,
  X,
  Clock,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { REPAIR_REUSE_GUIDES } from '../../lib/circularityEngine';

export default function RepairGuidesModal({ isOpen, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState(REPAIR_REUSE_GUIDES[0].category);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const activeGuide = REPAIR_REUSE_GUIDES.find((g) => g.category === selectedCategory) || REPAIR_REUSE_GUIDES[0];

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] bg-surface-raised border border-line rounded-3xl shadow-soft-xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-line flex items-center justify-between bg-surface-sunken">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-heading">
                  Repair &amp; Reuse Maintenance Guides
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-raised border border-line text-text-muted">
                  Right to Repair
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                Extend product longevity and prevent premature replacement with simple DIY care.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowHowItWorks(!showHowItWorks)}
              className="p-2 rounded-xl border border-line bg-surface hover:bg-surface-sunken text-text-muted hover:text-heading text-xs font-mono flex items-center gap-1 transition"
            >
              <HelpCircle className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline">How it works</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl border border-line text-text-muted hover:text-heading hover:bg-surface transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* How it works drawer */}
        {showHowItWorks && (
          <div className="p-4 bg-surface border-b border-line text-xs space-y-1.5 animate-fade-in text-left">
            <div className="flex items-center gap-1.5 font-serif font-bold text-heading">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Durability &amp; Repairability Philosophy</span>
            </div>
            <p className="text-text-secondary leading-relaxed">
              True sustainability begins by keeping items in use for as long as possible. Our guides provide tested methods to clean, sand, re-oil, and mend organic materials using everyday non-toxic household supplies.
            </p>
          </div>
        )}

        {/* Category Pills */}
        <div className="p-3 border-b border-line bg-surface flex gap-2 overflow-x-auto scrollbar-thin">
          {REPAIR_REUSE_GUIDES.map((g) => (
            <button
              key={g.category}
              type="button"
              onClick={() => setSelectedCategory(g.category)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium whitespace-nowrap transition cursor-pointer ${
                selectedCategory === g.category
                  ? 'bg-primary text-white font-bold shadow-soft-xs'
                  : 'bg-surface-sunken border border-line text-text-secondary hover:text-heading'
              }`}
            >
              {g.category}
            </button>
          ))}
        </div>

        {/* Guide Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-left font-sans">
          {/* Overview Banner */}
          <div className="p-4 rounded-2xl bg-surface-sunken border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono text-text-muted uppercase">Target Item Type</span>
              <h4 className="font-serif font-bold text-base text-heading">{activeGuide.itemType}</h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-xl bg-surface border border-line text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                Difficulty: {activeGuide.difficulty}
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-surface border border-line text-xs font-mono text-text-muted flex items-center gap-1">
                <Clock className="w-3 h-3" /> ~{activeGuide.timeMinutes}m
              </span>
            </div>
          </div>

          {/* Tools Required */}
          <div className="p-4 rounded-2xl bg-surface border border-line space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-text-muted block">
              Required Supplies &amp; Non-Toxic Tools
            </span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-heading">
              {activeGuide.tools.map((t, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-text-muted block">
              Step-by-Step Care &amp; Restoration
            </span>
            <div className="space-y-2">
              {activeGuide.steps.map((step, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-surface-sunken border border-line flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-heading leading-relaxed font-medium">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Longevity Payoff */}
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between text-xs">
            <span className="font-serif font-bold text-emerald-700 dark:text-emerald-300">
              Lifespan Extension Payoff:
            </span>
            <span className="font-mono font-bold text-emerald-800 dark:text-emerald-200">
              {activeGuide.lifespanExtension}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-line bg-surface-sunken flex items-center justify-between text-[11px] font-mono text-text-muted">
          <span>EcoMart Right to Repair Program</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-primary text-white font-semibold text-xs transition cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
