import React, { useState } from 'react';
import {
  Factory,
  Truck,
  Sparkles,
  RotateCcw,
  Info,
  CheckCircle2,
  Wind,
  Droplets,
  Ban
} from 'lucide-react';

const STAGES = [
  {
    id: 'make',
    step: 0,
    title: '1. Make: Ethical Sourcing',
    icon: Factory,
    summary: 'Harvesting raw regenerative biomass and artisan cluster production with zero virgin petroleum.',
    getMetrics: (product) => ({
      co2: Number((product?.lifecycle?.manufacturing?.co2Kg || 0.18).toFixed(2)),
      water: Number((product?.waterSaved ? Math.round(product.waterSaved * 0.4) : 25)),
      plastic: 0,
      detail: `${product?.materials || 'Organic renewable materials'} sourced without synthetic petrochemical binders.`
    })
  },
  {
    id: 'ship',
    step: 1,
    title: '2. Ship: Plastic-Free Transit',
    icon: Truck,
    summary: 'Optimized transit density in unbleached post-consumer recycled kraft cartons without bubblewrap.',
    getMetrics: (_product) => ({
      co2: 0.04,
      water: 2,
      plastic: 0,
      detail: 'Packaged in 100% biodegradable corrugated cardboard. Zero single-use polystyrene air pillows.'
    })
  },
  {
    id: 'use',
    step: 2,
    title: '3. Use: Extended Longevity',
    icon: Sparkles,
    summary: 'Engineered for extended circular utility, eliminating recurring single-use replacements.',
    getMetrics: (product) => ({
      co2: Number(((product?.co2Saved || 0.8) * 0.7).toFixed(2)),
      water: Number(product?.waterSaved || 60),
      plastic: Number(product?.plasticSaved || 40),
      detail: `Replaces conventional single-use disposable alternatives throughout its active lifecycle.`
    })
  },
  {
    id: 'second_life',
    step: 3,
    title: '4. Second Life: Clean Circularity',
    icon: RotateCcw,
    summary: 'Backyard composting or clean circular material recovery without toxic microplastic leaching.',
    getMetrics: (product) => ({
      co2: 0.01,
      water: 0,
      plastic: 0,
      detail: `${product?.lifecycle?.endOfLife?.timeline || 'Decomposes in 90–180 days in organic soil'}. 100% non-polluting.`
    })
  }
];

export default function LifecycleTimelineScrubber({ product }) {
  const [activeStep, setActiveStep] = useState(0);

  if (!product) return null;

  const currentStage = STAGES[activeStep];
  const metrics = currentStage.getMetrics(product);

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-surface border border-line shadow-card space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
              Cradle-to-Grave Scrubber
            </span>
            <span className="text-[10px] font-mono text-muted uppercase">
              Sample Lifecycle Stages
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-serif font-bold text-heading">
            4-Stage Lifecycle Scrubber
          </h3>
        </div>

        <div className="text-xs font-mono text-muted">
          Stage {activeStep + 1} of 4: <span className="text-heading font-semibold">{currentStage.title.split(':')[0]}</span>
        </div>
      </div>

      {/* Interactive Horizontal Scrubber & Step Markers */}
      <div className="space-y-3 pt-2">
        <div className="relative">
          {/* Progress Track */}
          <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 h-1.5 bg-surface-sunken rounded-full overflow-hidden border border-line/40">
            <div
              style={{ width: `${(activeStep / (STAGES.length - 1)) * 100}%` }}
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 rounded-full"
            />
          </div>

          {/* 4 Interactive Step Buttons */}
          <div className="relative flex justify-between items-center z-10 px-2">
            {STAGES.map((stage, idx) => {
              const Icon = stage.icon;
              const isActive = activeStep === idx;
              const isPast = activeStep >= idx;

              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveStep(idx)}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer border focus-visible:outline-2 focus-visible:outline-focus ${
                    isActive
                      ? 'bg-primary text-primary-contrast border-primary shadow-soft-sm scale-110 font-bold'
                      : isPast
                      ? 'bg-surface-raised text-primary border-primary/50'
                      : 'bg-surface-sunken text-muted border-line hover:border-line-subtle'
                  }`}
                  aria-label={`Jump to stage ${stage.title}`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Stage Name Labels underneath */}
        <div className="flex justify-between items-center text-[11px] font-mono px-1 text-muted">
          {STAGES.map((stage, idx) => (
            <button
              key={stage.id}
              onClick={() => setActiveStep(idx)}
              className={`hover:text-heading transition-colors cursor-pointer text-center max-w-[80px] ${
                activeStep === idx ? 'text-primary font-bold' : ''
              }`}
            >
              {stage.id.toUpperCase().replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Native Range Slider for smooth keyboard scrubbing */}
      <div className="pt-1">
        <label htmlFor="lifecycle-scrubber" className="sr-only">
          Scrub through lifecycle stages
        </label>
        <input
          id="lifecycle-scrubber"
          type="range"
          min="0"
          max="3"
          step="1"
          value={activeStep}
          onChange={(e) => setActiveStep(Number(e.target.value))}
          className="w-full accent-emerald-500 h-1 bg-surface-sunken rounded-lg cursor-pointer"
        />
      </div>

      {/* Active Stage Detail & Dynamic Impact Bar */}
      <div className="p-5 rounded-2xl bg-surface-sunken border border-line space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-heading flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              {currentStage.title}
            </h4>
            <p className="text-xs text-secondary leading-relaxed">
              {currentStage.summary}
            </p>
          </div>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-surface border border-line text-muted uppercase shrink-0">
            {metrics.detail}
          </span>
        </div>

        {/* Per-Stage Impact Telemetry Strip */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-line/60 text-xs font-mono">
          <div className="p-3 rounded-xl bg-surface border border-line/60 flex items-center gap-2.5">
            <Wind className="w-4 h-4 text-primary shrink-0" />
            <div>
              <span className="text-[10px] text-muted block">Stage CO₂e</span>
              <span className="font-bold text-heading">{metrics.co2} kg</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface border border-line/60 flex items-center gap-2.5">
            <Droplets className="w-4 h-4 text-secondary shrink-0" />
            <div>
              <span className="text-[10px] text-muted block">Stage Water</span>
              <span className="font-bold text-heading">{metrics.water} L</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface border border-line/60 flex items-center gap-2.5">
            <Ban className="w-4 h-4 text-accent shrink-0" />
            <div>
              <span className="text-[10px] text-muted block">Plastic Used</span>
              <span className="font-bold text-heading">{metrics.plastic} g</span>
            </div>
          </div>
        </div>

        {/* Assumptions Label */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted pt-1">
          <Info className="w-3 h-3 text-primary shrink-0" />
          <span>Stage Estimate: Estimated based on sample category benchmarks.</span>
        </div>
      </div>
    </div>
  );
}
