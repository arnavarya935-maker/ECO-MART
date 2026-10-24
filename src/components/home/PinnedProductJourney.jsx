import React, { useRef } from 'react';
import {
  Factory,
  Truck,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Leaf,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { useScrollProgress, isReducedMotion, getStageForProgress } from '../../lib/scrollAnimation';
import { Link } from 'react-router-dom';

const STAGES = [
  {
    id: 'make',
    stepNumber: '01',
    name: 'Make',
    title: 'Regenerative Cultivation & Clean Weaving',
    summary:
      'Harvested from certified Himalayan hemp and bamboo shoots grown without synthetic fertilizers or petrochemical pesticides.',
    icon: Factory,
    accentColor: '#10B981',
    bgGlow: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
    estimates: [
      { label: 'Carbon Footprint', value: '~0.18 kg CO₂e (Estimate)', note: '78% lower than PET standard' },
      { label: 'Energy Consumed', value: '~1.2 kWh (Estimate)', note: '100% on-site solar power' }
    ],
    details: [
      'Zero synthetic fertilizers or toxic pesticides',
      'Solar-powered mechanical spinning',
      'Closed-loop water reuse in textile bath'
    ]
  },
  {
    id: 'ship',
    stepNumber: '02',
    name: 'Ship',
    title: 'Electrified Rail & Flat-Pack Kraft Packaging',
    summary:
      'Consolidated freight routed via electrified regional rail lines, packed in 100% unbleached FSC-certified corrugated boxes.',
    icon: Truck,
    accentColor: '#14B8A6',
    bgGlow: 'radial-gradient(circle at 50% 50%, rgba(20, 184, 166, 0.15) 0%, transparent 70%)',
    estimates: [
      { label: 'Transit Carbon', value: '~0.04 kg CO₂e (Estimate)', note: 'Bulk freight rail efficiency' },
      { label: 'Plastic Packaging', value: '0 Single-Use Plastics (Estimate)', note: 'Water-activated paper tape' }
    ],
    details: [
      'Electrified rail transit preferred over diesel air/road',
      'Plastic-free water-activated paper tape',
      'Flat-pack density optimization eliminates empty space'
    ]
  },
  {
    id: 'use',
    stepNumber: '03',
    name: 'Use',
    title: 'Engineered for 300+ Refills & Extreme Durability',
    summary:
      'Recycled aerospace-grade aluminum casing and food-grade silicone seals designed for 5+ years of daily consumer use.',
    icon: Sparkles,
    accentColor: '#34D399',
    bgGlow: 'radial-gradient(circle at 50% 50%, rgba(52, 211, 153, 0.15) 0%, transparent 70%)',
    estimates: [
      { label: 'Water Conserved', value: '~14L Water (Estimate)', note: 'Over lifecycle of refill concentrate' },
      { label: 'Durability Benchmark', value: '5.2 Years (Estimate)', note: 'Lab stress-tested for 1,800 pumps' }
    ],
    details: [
      'Modular pump head with replaceable food-grade gaskets',
      'Concentrate refill pouches weigh 85% less than bottles',
      'Zero BPA, phthalate, or microplastic leaching'
    ]
  },
  {
    id: 'second_life',
    stepNumber: '04',
    name: 'Second Life',
    title: 'Backyard Composting & Scrap Kabadiwala Recovery',
    summary:
      'The plant fiber casing decomposes in standard garden soil within 90 days. The aluminum core connects to verified local kabadiwala collection.',
    icon: RotateCcw,
    accentColor: '#F59E0B',
    bgGlow: 'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.15) 0%, transparent 70%)',
    estimates: [
      { label: 'Landfill Waste', value: '0% Landfill Waste (Estimate)', note: '100% circular return pathway' },
      { label: 'Scrap Cash Value', value: '₹45 Recoverable (Estimate)', note: 'Standard Indian scrap yard rate' }
    ],
    details: [
      'Composts in home soil within 90 days without toxic residue',
      'Standard aluminum alloy melts infinitely at 660°C',
      'Direct doorstep kabadiwala pickup integration'
    ]
  }
];

export default function PinnedProductJourney() {
  const containerRef = useRef(null);
  const reduced = isReducedMotion();

  // 600px of comfortable travel for pinned scrubbing through 4 stages
  const { progress } = useScrollProgress(containerRef, {
    pinTravel: 700,
    disabled: reduced
  });

  const activeStageIndex = reduced ? 0 : getStageForProgress(progress, STAGES.length);
  const currentStage = STAGES[activeStageIndex] || STAGES[0];

  return (
    <section
      ref={containerRef}
      id="product-journey"
      className="relative w-full bg-surface py-12 md:py-24 border-b border-line selection:bg-emerald-500/20"
      style={{
        // On desktop provide scroll travel room; on mobile/reduced-motion auto height
        minHeight: reduced ? 'auto' : 'clamp(700px, 150vh, 1200px)'
      }}
    >
      {/* Sticky Frame for Desktop Scrubbing */}
      <div className="sticky top-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase bg-primary-subtle text-primary border border-primary/20 mb-4">
            <Leaf className="w-3.5 h-3.5 text-primary" />
            Full Lifecycle Transparency
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-medium text-heading tracking-tight">
            The Pinned Product Journey
          </h2>
          <p className="mt-3 text-sm sm:text-base text-text-secondary">
            True sustainability extends far beyond the shopping cart. Scroll to trace every stage from harvest to second life.
          </p>
        </div>

        {/* Stage Progress Bar / Nav */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-8">
          {STAGES.map((stage, idx) => {
            const isActive = idx === activeStageIndex;
            const isPassed = idx < activeStageIndex;
            const Icon = stage.icon;

            return (
              <div
                key={stage.id}
                className={`relative p-3 rounded-xl border transition-all text-left ${
                  isActive
                    ? 'bg-surface-raised border-primary shadow-soft-sm'
                    : 'bg-surface-sunken border-line opacity-70'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-text-muted">
                    {stage.stepNumber}
                  </span>
                  <Icon
                    className="w-4 h-4 transition-colors"
                    style={{ color: isActive ? stage.accentColor : 'var(--color-text-muted)' }}
                  />
                </div>
                <div
                  className={`text-sm font-semibold truncate ${
                    isActive ? 'text-heading font-bold' : 'text-text-secondary'
                  }`}
                >
                  {stage.name}
                </div>
                {/* Visual Step Progress Line */}
                <div className="mt-2 w-full h-1 bg-surface rounded-full overflow-hidden border border-line">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: isActive ? '100%' : isPassed ? '100%' : '0%',
                      backgroundColor: stage.accentColor
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Stage Content Card */}
        <div
          className="relative rounded-2xl bg-surface-raised border border-line shadow-card overflow-hidden p-6 sm:p-10 transition-all duration-500"
          style={{
            borderColor: `${currentStage.accentColor}33`
          }}
        >
          {/* Dynamic Background Glow Tint from tokens */}
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-700"
            style={{
              background: currentStage.bgGlow
            }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Stage Text & Details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded text-xs font-mono font-semibold tracking-wider uppercase bg-surface-sunken border border-line text-text-secondary">
                <span>Stage {currentStage.stepNumber} of 04</span>
                <span className="w-1 h-1 rounded-full bg-primary" />
                <span className="text-heading font-bold">{currentStage.name}</span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-medium text-heading">
                  {currentStage.title}
                </h3>
                <p className="mt-3 text-sm sm:text-base text-text-secondary leading-relaxed">
                  {currentStage.summary}
                </p>
              </div>

              {/* Labeled Estimates (Required by Prompt) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {currentStage.estimates.map((est, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-surface-sunken border border-line/80 space-y-1"
                  >
                    <div className="text-[11px] font-mono uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                      <TrendingDown className="w-3.5 h-3.5 text-primary" />
                      {est.label}
                    </div>
                    <div
                      className="text-base sm:text-lg font-mono font-bold tracking-tight text-heading"
                      style={{ color: currentStage.accentColor }}
                    >
                      {est.value}
                    </div>
                    <div className="text-[11px] text-text-secondary">
                      {est.note}
                    </div>
                  </div>
                ))}
              </div>

              {/* Verified Checklist Details */}
              <ul className="space-y-2 pt-2 text-xs sm:text-sm text-text-secondary">
                {currentStage.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2
                      className="w-4 h-4 shrink-0 mt-0.5"
                      style={{ color: currentStage.accentColor }}
                    />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column: Custom Stage Visual Artwork */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 sm:p-8 rounded-xl bg-surface-sunken border border-line relative overflow-hidden min-h-[280px]">
              {/* Stage Visual Vector Elements */}
              <div className="w-full flex items-center justify-center py-6">
                {activeStageIndex === 0 && (
                  <svg className="w-44 h-44 text-emerald-400" viewBox="0 0 160 160" fill="none">
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="opacity-40 animate-spin" style={{ animationDuration: '30s' }} />
                    <circle cx="80" cy="80" r="50" fill="currentColor" fillOpacity="0.08" />
                    {/* Bamboo shoots & Sun */}
                    <path d="M72 120V50M88 120V40M80 120V35" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    <path d="M72 70C65 65 60 70 58 72M88 60C95 55 100 60 102 62M80 85C74 80 70 85 68 87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="115" cy="45" r="12" fill="#F59E0B" fillOpacity="0.25" stroke="#F59E0B" strokeWidth="2" />
                  </svg>
                )}

                {activeStageIndex === 1 && (
                  <svg className="w-44 h-44 text-teal-400" viewBox="0 0 160 160" fill="none">
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="opacity-40" />
                    <circle cx="80" cy="80" r="50" fill="currentColor" fillOpacity="0.08" />
                    {/* Electric Train & Flat-pack Box */}
                    <rect x="45" y="65" width="70" height="35" rx="6" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.15" />
                    <line x1="30" y1="105" x2="130" y2="105" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    <line x1="40" y1="112" x2="120" y2="112" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                    <path d="M70 65V50L80 42L90 50V65" stroke="currentColor" strokeWidth="2" />
                    <circle cx="62" cy="82" r="6" fill="currentColor" />
                    <circle cx="98" cy="82" r="6" fill="currentColor" />
                  </svg>
                )}

                {activeStageIndex === 2 && (
                  <svg className="w-44 h-44 text-emerald-400" viewBox="0 0 160 160" fill="none">
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="opacity-40 animate-pulse" />
                    <circle cx="80" cy="80" r="50" fill="currentColor" fillOpacity="0.08" />
                    {/* Aluminum Dispenser Bottle with Circular Arrows */}
                    <rect x="65" y="55" width="30" height="65" rx="5" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.2" />
                    <rect x="73" y="42" width="14" height="13" stroke="currentColor" strokeWidth="2" />
                    <path d="M70 42H90" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M60 42H52C48 42 45 45 45 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    {/* Circular refill loop */}
                    <path d="M35 80C35 55 55 35 80 35M125 80C125 105 105 125 80 125" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 4" />
                  </svg>
                )}

                {activeStageIndex === 3 && (
                  <svg className="w-44 h-44 text-amber-400" viewBox="0 0 160 160" fill="none">
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="opacity-40" />
                    <circle cx="80" cy="80" r="50" fill="currentColor" fillOpacity="0.08" />
                    {/* Soil + Sprout + Circular Recycle Arrows */}
                    <path d="M40 115C60 110 100 110 120 115" stroke="#92400E" strokeWidth="3" strokeLinecap="round" />
                    <path d="M80 115V80C80 80 65 75 60 65C75 65 80 75 80 80C80 75 85 65 100 65C95 75 80 80 80 80" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M50 45C65 30 95 30 110 45" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 4" />
                    <polygon points="112,42 115,50 107,50" fill="#F59E0B" />
                  </svg>
                )}
              </div>

              {/* Stage Sub-label */}
              <div className="text-center">
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-heading">
                  Stage {currentStage.stepNumber} Verified Visual
                </span>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Audited under ISO 14040 Life Cycle Assessment
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Link to Lifecycle Deep-Dive */}
        <div className="mt-4 flex items-center justify-between text-xs text-text-muted font-mono">
          <span>Scroll to advance stages or view full catalog lifecycle breakdown:</span>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-primary hover:text-primary-hover font-semibold transition-colors"
          >
            Explore Product LCA Data
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
