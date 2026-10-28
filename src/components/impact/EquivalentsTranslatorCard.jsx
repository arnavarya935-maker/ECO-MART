import React, { useState } from 'react';
import { Wind, Ban, Droplets, HelpCircle, Sparkles } from 'lucide-react';
import { translateImpactEquivalents } from '../../lib/impactEconomics';

export default function EquivalentsTranslatorCard({ co2Kg = 0, plasticGrams = 0, waterLitres = 0, className = '' }) {
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const eq = translateImpactEquivalents({ co2Kg, plasticGrams, waterLitres });

  return (
    <div className={`p-4 sm:p-5 rounded-3xl bg-surface-raised border border-line shadow-soft-xs space-y-4 text-left ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm sm:text-base text-heading">
              Everyday Equivalents Translator
            </h4>
            <div className="text-[10px] font-mono text-text-muted">
              Grounded Real-World Analogies
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowHowItWorks(!showHowItWorks)}
          title="How equivalents are calculated"
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
            <span>Methodology &amp; Verification Assumptions</span>
          </div>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            {eq.assumptionsNote} Carbon conversions use Central Electricity Authority (CEA India 2024 grid baseline: 0.82 kg/kWh). Plastic weights use CPCB 500ml PET bottle standards (12 grams). Water use uses WHO daily minimum hydration benchmarks (2.5 L/day).
          </p>
        </div>
      )}

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Carbon */}
        <div className="p-3.5 rounded-2xl bg-surface-sunken border border-line space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-primary">
            <Wind className="w-4 h-4" />
            <span>Carbon Avoidance</span>
          </div>
          <div className="font-serif font-bold text-sm text-heading leading-snug">
            {eq.carbon.headline}
          </div>
          <p className="text-[11px] text-text-secondary leading-snug">
            {eq.carbon.secondary}
          </p>
          <div className="pt-1.5 border-t border-line/60 text-[9px] font-mono text-text-muted">
            {eq.carbon.citation}
          </div>
        </div>

        {/* Plastic */}
        <div className="p-3.5 rounded-2xl bg-surface-sunken border border-line space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
            <Ban className="w-4 h-4" />
            <span>Plastic Diverted</span>
          </div>
          <div className="font-serif font-bold text-sm text-heading leading-snug">
            {eq.plastic.headline}
          </div>
          <p className="text-[11px] text-text-secondary leading-snug">
            {eq.plastic.secondary}
          </p>
          <div className="pt-1.5 border-t border-line/60 text-[9px] font-mono text-text-muted">
            {eq.plastic.citation}
          </div>
        </div>

        {/* Water */}
        <div className="p-3.5 rounded-2xl bg-surface-sunken border border-line space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-teal-600 dark:text-teal-400">
            <Droplets className="w-4 h-4" />
            <span>Water Conserved</span>
          </div>
          <div className="font-serif font-bold text-sm text-heading leading-snug">
            {eq.water.headline}
          </div>
          <p className="text-[11px] text-text-secondary leading-snug">
            {eq.water.secondary}
          </p>
          <div className="pt-1.5 border-t border-line/60 text-[9px] font-mono text-text-muted">
            {eq.water.citation}
          </div>
        </div>
      </div>
    </div>
  );
}
