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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#FAF8F5] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-2xl text-stone-800 dark:text-stone-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full">
                Transparent Formula
              </span>
              <span className="text-xs text-stone-500">Zero Greenwashing</span>
            </div>
            <h3 className="text-xl font-bold mt-1 text-stone-900 dark:text-stone-100">
              How is this Eco-Score Calculated?
            </h3>
            {product && (
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-0.5 line-clamp-1">
                Product: <span className="font-medium text-stone-800 dark:text-stone-200">{product.name}</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-200/60 dark:hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Score Summary Banner */}
        <div className="my-5 p-4 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black border shadow-inner ${colorTheme.badge}`}
            >
              {grade}
            </div>
            <div>
              <div className="text-sm font-semibold text-stone-500 dark:text-stone-400">Composite Score</div>
              <div className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">
                {score} <span className="text-sm font-normal text-stone-400">/ 100</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colorTheme.badge}`}>
              {gradeLabel}
            </span>
            <div className="text-xs text-stone-500 mt-1">Multi-factor Lifecycle Assessment</div>
          </div>
        </div>

        {/* 5-Factor Weighted Breakdown List */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Lifecycle Pillars & Score Weights
          </h4>

          {Object.entries(breakdown).map(([key, item]) => {
            const Icon = icons[key] || ShieldCheck;
            const percentage = Math.round((item.score / item.max) * 100);

            return (
              <div
                key={key}
                className="p-3.5 rounded-xl bg-white dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700/60 hover:border-emerald-300 dark:hover:border-emerald-700/60 transition"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        {item.name}
                      </span>
                      <span className="ml-2 text-xs font-medium text-stone-400">
                        (Weight: {item.weight})
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      {item.score}
                    </span>
                    <span className="text-xs text-stone-400">/{item.max} pts</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-stone-100 dark:bg-stone-700 rounded-full overflow-hidden my-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      percentage >= 80 ? 'bg-emerald-500' : percentage >= 50 ? 'bg-teal-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                  {item.explanation}
                </p>
              </div>
            );
          })}
        </div>

        {/* Open Standard Callout */}
        <div className="mt-5 p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-900/50 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
            <strong>Open & Verifiable:</strong> EcoMart scores are mathematically calculated from manufacturer material sheets, certified carbon audits, and local transport coordinates to empower intentional shopping.
          </p>
        </div>

        {/* Close Button */}
        <div className="mt-5 text-right">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-stone-900 text-stone-50 hover:bg-stone-800 dark:bg-emerald-700 dark:hover:bg-emerald-600 font-medium text-sm transition shadow-sm"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
