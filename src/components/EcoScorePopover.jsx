import React from 'react';
import { X, CheckCircle2, ShieldCheck, Leaf, Package, Wind, Award, MapPin } from 'lucide-react';

export default function EcoScorePopover({ product, scoreData, onClose }) {
  if (!scoreData) return null;

  const { score, grade, gradeLabel, colorTheme, breakdown } = scoreData;

  const icons = {
    material: Leaf,
    packaging: Package,
    carbon: Wind,
    certifications: Award,
    shipping: MapPin
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ecoscore-popover-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-surface border border-line rounded-3xl p-6 sm:p-7 shadow-soft-xl text-text max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-line">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
                Transparent Formula
              </span>
              <span className="text-xs text-muted">Zero Greenwashing</span>
            </div>
            <h3 id="ecoscore-popover-title" className="text-xl font-serif font-bold mt-1 text-heading">
              How is this Eco-Score Calculated?
            </h3>
            {product && (
              <p className="text-sm text-secondary mt-0.5 line-clamp-1">
                Product: <span className="font-medium text-heading">{product.name}</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close Eco-Score breakdown"
            className="w-9 h-9 rounded-full flex items-center justify-center text-muted hover:text-heading hover:bg-surface-sunken transition-colors focus-visible:outline-2 focus-visible:outline-focus"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Score Summary Banner */}
        <div className="my-5 p-4 rounded-2xl bg-surface-sunken border border-line flex items-center justify-between shadow-soft-xs">
          <div className="flex items-center gap-3">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-serif font-bold border shadow-soft-xs ${colorTheme.badge}`}
            >
              {grade}
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted">Composite Score</div>
              <div className="text-2xl font-serif font-bold text-heading">
                {score} <span className="text-sm font-normal text-muted">/ 100</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colorTheme.badge}`}>
              {gradeLabel}
            </span>
            <div className="text-xs text-muted mt-1">Multi-factor Lifecycle Assessment</div>
          </div>
        </div>

        {/* Uncertainty Band & Data Completeness (Feature 10) */}
        {scoreData.uncertaintyMargin !== undefined && (
          <div className="mb-5 p-3.5 rounded-2xl bg-surface-raised border border-line space-y-1.5 shadow-soft-xs text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-heading flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Confidence Band &amp; Provenance
              </span>
              <span className="font-mono font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">
                {scoreData.uncertaintyBand || `[${scoreData.minScore} - ${scoreData.maxScore}]`} (±{scoreData.uncertaintyMargin} pts)
              </span>
            </div>
            <p className="text-[11px] text-secondary leading-relaxed">
              {scoreData.uncertaintyReason}
            </p>
          </div>
        )}

        {/* 5-Factor Weighted Breakdown List */}
        <div className="space-y-3.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted">
            Lifecycle Pillars & Score Weights
          </h4>

          {Object.entries(breakdown).map(([key, item]) => {
            const Icon = icons[key] || ShieldCheck;
            const percentage = Math.round((item.score / item.max) * 100);

            return (
              <div
                key={key}
                className="p-3.5 rounded-xl bg-surface border border-line hover:border-primary/40 transition-colors shadow-soft-xs"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-heading">
                        {item.name}
                      </span>
                      <span className="ml-2 text-xs font-medium text-muted">
                        (Weight: {item.weight})
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-serif font-bold text-heading">
                      {item.score}
                    </span>
                    <span className="text-xs text-muted">/{item.max} pts</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-line rounded-full overflow-hidden my-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      percentage >= 80 ? 'bg-primary' : percentage >= 50 ? 'bg-secondary' : 'bg-warning'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <p className="text-xs text-secondary mt-1 leading-relaxed">
                  {item.explanation}
                </p>
              </div>
            );
          })}
        </div>

        {/* Open Standard Callout */}
        <div className="mt-5 p-3.5 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-text leading-relaxed">
            <strong>Open & Verifiable:</strong> EcoMart scores are mathematically calculated from manufacturer material sheets, certified carbon audits, and local transport coordinates to empower intentional shopping.
          </p>
        </div>

        {/* Close Button */}
        <div className="mt-5">
          <button
            onClick={onClose}
            className="w-full min-h-[44px] py-2.5 px-4 rounded-2xl bg-primary text-primary-contrast hover:bg-primary-hover font-bold text-sm shadow-soft-sm hover:shadow-soft-md transition-all focus-visible:outline-2 focus-visible:outline-focus"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
