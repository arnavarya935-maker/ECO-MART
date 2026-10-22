import React, { useState } from 'react';
import {
  Leaf,
  Factory,
  Truck,
  Package,
  Recycle,
  Sparkles,
  ShieldCheck,
  Ban
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import productsData from '../../data/products.json';
import { getProductLifecycleStages } from '../../lib/lifecycleEngine.js';

export { getProductLifecycleStages };

const STAGE_ICONS = {
  material: Leaf,
  making: Factory,
  transport: Truck,
  packaging: Package,
  'end-of-life': Recycle
};

export default function ProductLifecycleTimeline({ product, className = '' }) {
  const { reduceEffects } = useTheme();
  const [showConventional, setShowConventional] = useState(false);
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  if (!product) return null;

  const convId = product.conventionalAlternativeId || product.conventionalId;
  const conventionalItem = convId ? productsData.find((p) => p.id === convId) : null;
  const stages = getProductLifecycleStages(product, productsData);
  const currentStage = stages[activeStageIndex];

  return (
    <div className={`bg-surface-raised rounded-3xl border border-line p-5 sm:p-7 shadow-soft-sm space-y-6 ${className}`}>
      {/* Header with Title and Comparison Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary-subtle text-primary border border-primary/20">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-heading">
              5-Stage Lifecycle Assessment
            </h3>
          </div>
          <p className="text-xs font-sans text-secondary mt-1">
            Cradle-to-grave analysis from raw harvesting to final circular return.
          </p>
        </div>

        {conventionalItem && (
          <div className="flex items-center gap-2 self-start sm:self-auto bg-surface-sunken p-1.5 rounded-2xl border border-line">
            <span className="text-xs font-sans font-medium text-heading pl-2">
              vs Conventional Alternative
            </span>
            <button
              type="button"
              onClick={() => setShowConventional(!showConventional)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer min-h-[36px] ${
                showConventional ? 'bg-primary' : 'bg-surface-sunken border border-line'
              }`}
              aria-label="Toggle comparison with conventional alternative"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-surface-raised shadow-soft-xs transition-transform ${
                  showConventional ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        )}
      </div>

      {/* Horizontal Interactive Timeline Track */}
      <div className="relative">
        {/* Track Line (Hidden on tiny screens) */}
        <div className="hidden sm:block absolute top-1/2 left-6 right-6 -translate-y-1/2 h-0.5 bg-line z-0" />

        {/* 5 Stage Nodes */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 relative z-10">
          {stages.map((stage, idx) => {
            const Icon = STAGE_ICONS[stage.id] || Sparkles;
            const isSelected = activeStageIndex === idx;

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveStageIndex(idx)}
                className={`flex flex-col items-center p-3 rounded-2xl border transition-all text-center cursor-pointer min-h-[44px] ${
                  isSelected
                    ? 'bg-surface-sunken border-primary shadow-soft-xs'
                    : 'bg-surface-raised border-line hover:border-primary/50'
                } ${reduceEffects ? '' : 'transition-transform duration-200 active:scale-95'}`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 transition-colors ${
                    isSelected
                      ? 'bg-primary text-text-inverted'
                      : 'bg-surface-sunken text-heading border border-line'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-xs font-sans font-bold text-heading">
                  {stage.name}
                </div>
                <div className="text-[10px] font-sans text-muted">
                  Stage {idx + 1}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Stage Detail Panel */}
      <div className="bg-surface-sunken rounded-2xl border border-line p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-sans font-bold uppercase tracking-wider text-primary">
              Stage {activeStageIndex + 1}: {currentStage.name}
            </span>
          </div>
          <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-primary-subtle text-primary border border-primary/20">
            Lifecycle Audit
          </span>
        </div>

        {/* Comparison Grid (Eco Option vs Conventional) */}
        <div className={`grid ${showConventional && conventionalItem ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-4`}>
          {/* Conscious Eco Item Details */}
          <div className="p-4 rounded-xl bg-surface-raised border border-primary/20 shadow-soft-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-sans font-bold text-heading flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" />
                {product.name}
              </span>
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-primary bg-primary-subtle px-2 py-0.5 rounded">
                Eco Choice
              </span>
            </div>

            <div className="text-sm font-serif font-bold text-heading">
              {currentStage.ecoTitle}
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-xs font-sans font-semibold text-primary">
                {currentStage.ecoMetric}
              </span>
              <span className="text-[10px] font-sans text-muted px-1.5 py-0.2 rounded bg-surface-sunken border border-line">
                {currentStage.ecoMetricType}
              </span>
            </div>

            <p className="text-xs font-sans text-secondary leading-relaxed pt-1 border-t border-line/60">
              {currentStage.ecoDetail}
              <span className="ml-1.5 text-[10px] font-sans text-muted italic">
                ({currentStage.ecoDetailType})
              </span>
            </p>
          </div>

          {/* Conventional Item Details (when toggled) */}
          {showConventional && conventionalItem && (
            <div className="p-4 rounded-xl bg-surface-raised border border-warning/30 shadow-soft-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans font-bold text-heading flex items-center gap-1.5">
                  <Ban className="w-4 h-4 text-warning" />
                  {conventionalItem.name}
                </span>
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-warning bg-warning/10 px-2 py-0.5 rounded">
                  Conventional
                </span>
              </div>

              <div className="text-sm font-serif font-bold text-heading">
                {currentStage.convTitle}
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-xs font-sans font-semibold text-warning">
                  {currentStage.convMetric}
                </span>
                <span className="text-[10px] font-sans text-muted px-1.5 py-0.2 rounded bg-surface-sunken border border-line">
                  {currentStage.convMetricType}
                </span>
              </div>

              <p className="text-xs font-sans text-secondary leading-relaxed pt-1 border-t border-line/60">
                {currentStage.convDetail}
                <span className="ml-1.5 text-[10px] font-sans text-muted italic">
                  ({currentStage.convDetailType})
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Step Navigation Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-line text-xs font-sans text-muted">
          <button
            type="button"
            disabled={activeStageIndex === 0}
            onClick={() => setActiveStageIndex((prev) => Math.max(0, prev - 1))}
            className="px-3 py-1.5 rounded-lg border border-line hover:bg-surface-raised disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition min-h-[36px]"
          >
            ← Previous Stage
          </button>
          <span>Stage {activeStageIndex + 1} of 5</span>
          <button
            type="button"
            disabled={activeStageIndex === stages.length - 1}
            onClick={() => setActiveStageIndex((prev) => Math.min(stages.length - 1, prev + 1))}
            className="px-3 py-1.5 rounded-lg border border-line hover:bg-surface-raised disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition min-h-[36px]"
          >
            Next Stage →
          </button>
        </div>
      </div>
    </div>
  );
}
