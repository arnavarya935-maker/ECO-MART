import React, { useState } from 'react';
import {
  ShieldCheck,
  Check,
  AlertCircle,
  Mail,
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { calculateTransparencyScore, generateBrandEmailDraft } from '../../lib/transparencyEngine';

export default function BrandTransparencyCard({ product, className = '' }) {
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const scorecard = calculateTransparencyScore(product);

  const mailtoLink = generateBrandEmailDraft(product, scorecard.missing);

  const gradeColors = {
    A: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    B: 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30',
    C: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    D: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
    F: 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/40'
  };

  return (
    <div className={`p-4 sm:p-5 rounded-3xl bg-surface-raised border border-line shadow-soft-xs space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-line pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-serif font-bold text-base text-heading">
                Brand Transparency Scorecard
              </h4>
              <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold border ${gradeColors[scorecard.grade] || gradeColors.C}`}>
                Grade {scorecard.grade} ({scorecard.score}%)
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              {scorecard.summary}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowHowItWorks(!showHowItWorks)}
          title="How transparency is calculated"
          className="p-1.5 rounded-xl border border-line bg-surface hover:bg-surface-sunken text-text-muted hover:text-heading transition cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-primary" />
        </button>
      </div>

      {/* How it works drawer */}
      {showHowItWorks && (
        <div className="p-3.5 rounded-2xl bg-surface-sunken border border-line text-xs space-y-1.5 animate-fade-in">
          <div className="flex items-center gap-1.5 font-serif font-bold text-heading">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>How Brand Transparency is Calculated</span>
          </div>
          <p className="text-text-secondary leading-relaxed">
            We evaluate 8 vital lifecycle disclosure criteria: Embodied Carbon, Plastic Weight, Water Footprint, Raw Material Composition, Factory Origin Distance, Packaging Materials, Disposal Guidelines, and Verifiable Certifications. Score = (Disclosed Criteria ÷ 8) × 100.
          </p>
        </div>
      )}

      {/* Disclosed vs Missing Criteria Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Disclosed */}
        <div className="p-3 rounded-2xl bg-surface-sunken/60 border border-line space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              Disclosed Metrics ({scorecard.disclosedCount}/{scorecard.totalTracked})
            </span>
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
            {scorecard.disclosed.length === 0 ? (
              <span className="text-xs text-text-muted">No full lifecycle metrics disclosed.</span>
            ) : (
              scorecard.disclosed.map((item) => (
                <div key={item.id} className="text-xs flex items-start gap-1.5 leading-snug">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <span className="text-heading font-medium">{item.name}</span>
                    {item.value && (
                      <span className="text-[11px] font-mono text-text-muted block">
                        {item.value}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Missing Disclosures & Brand Action */}
        <div className="p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-amber-700 dark:text-amber-300 font-semibold">
            <span className="flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              Undisclosed Data Gaps ({scorecard.missing.length})
            </span>
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
            {scorecard.missing.length === 0 ? (
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                Complete lifecycle disclosure. No omitted metrics!
              </div>
            ) : (
              scorecard.missing.map((item) => (
                <div key={item.id} className="text-xs flex items-center gap-1.5 text-text-secondary leading-snug">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5 shrink-0" />
                  <span>{item.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Feature 19: "Ask the Brand" Generator (client-side mailto) */}
      {scorecard.missing.length > 0 && (
        <div className="pt-2 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Info className="w-4 h-4 text-primary shrink-0" />
            <span>Missing data relies on regional averages. You can request direct disclosures.</span>
          </div>

          <a
            href={mailtoLink}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-surface-sunken hover:bg-surface border border-line text-xs font-mono font-medium text-heading hover:text-primary transition shadow-soft-xs cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 text-primary" />
            <span>Draft Inquiry to Brand</span>
          </a>
        </div>
      )}
    </div>
  );
}
