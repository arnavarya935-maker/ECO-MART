import React, { useRef } from 'react';
import {
  ShieldCheck,
  RotateCcw,
  Cpu,
  ArrowRight,
  Layers
} from 'lucide-react';
import { useScrollProgress, isReducedMotion } from '../../lib/scrollAnimation';
import { Link } from 'react-router-dom';

const STACK_CARDS = [
  {
    step: '01',
    title: 'Multi-Axis Claim Verification',
    headline: 'We audit marketing claims before products enter the catalog.',
    summary:
      'Manufacturers must submit verified third-party laboratory test reports, accredited supply-chain chain-of-custody certificates, and standardized lifecycle metrics. If claims are vague, our ISO 14021 engine flags or rejects them.',
    icon: ShieldCheck,
    accentColor: '#10B981',
    badge: 'Pillar 01 • Claim Integrity',
    bgTint: 'rgba(16, 185, 129, 0.08)',
    stats: [
      { label: 'Audit Points', val: '24 Independent Criteria' },
      { label: 'Rejection Rate', val: '31% of Submitted Claims' }
    ],
    route: '/detective',
    ctaText: 'Explore Claim Detective'
  },
  {
    step: '02',
    title: 'Full Lifecycle Carbon Accounting',
    headline: 'True impact extends far beyond shipping and packaging.',
    summary:
      'Every item in EcoMart is quantified across all four lifecycle phases: raw material cultivation, manufacturing energy, intermodal distribution, and end-of-life circular recovery. We provide realistic estimates with transparent assumptions.',
    icon: RotateCcw,
    accentColor: '#14B8A6',
    badge: 'Pillar 02 • Carbon Accounting',
    bgTint: 'rgba(20, 184, 166, 0.08)',
    stats: [
      { label: 'Methodology', val: 'ISO 14040 Compliant LCA' },
      { label: 'End-of-Life', val: '100% Circular Kabadiwala Routing' }
    ],
    route: '/products',
    ctaText: 'Browse Catalog Metrics'
  },
  {
    step: '03',
    title: 'Radical Model Transparency',
    headline: 'No black boxes. Inspect every token, decision, and bias audit.',
    summary:
      'EcoMart is built on open governance. Inspect adversarial attack intercepts in our Black Box, review cross-linguistic fairness audits in our Fairness Lab, and explore exact decision threshold boundaries in our Decision Playground.',
    icon: Cpu,
    accentColor: '#34D399',
    badge: 'Pillar 03 • AI Governance',
    bgTint: 'rgba(52, 211, 153, 0.08)',
    stats: [
      { label: 'Linguistic Parity', val: '95% EN / HI / Hinglish' },
      { label: 'Explainability', val: '100% Chain-of-Thought Visible' }
    ],
    route: '/self-audit',
    ctaText: 'View AI Self-Audit Report'
  }
];

export default function StickyStackedCards() {
  const containerRef = useRef(null);
  const reduced = isReducedMotion();

  // Track progress for subtle parallax offsets
  const { progress } = useScrollProgress(containerRef, {
    disabled: reduced
  });

  return (
    <section
      ref={containerRef}
      id="stacked-pillars"
      className="relative w-full bg-surface py-16 md:py-28 border-b border-line selection:bg-emerald-500/20"
      aria-label="Core Engineering Pillars"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase bg-primary-subtle text-primary border border-primary/20 mb-4">
            <Layers className="w-3.5 h-3.5 text-primary" />
            Engineering Pillars
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-medium text-heading tracking-tight">
            Built on Rigorous Proof, Not Marketing Buzz
          </h2>
          <p className="mt-3 text-sm sm:text-base text-text-secondary">
            Explore the three fundamental architecture principles that guarantee every EcoMart recommendation is reliable, verifiable, and fair.
          </p>
        </div>

        {/* Stacked Cards Container */}
        <div className="relative space-y-8 sm:space-y-12">
          {STACK_CARDS.map((card, idx) => {
            const Icon = card.icon;
            // Sticky top positioning with subtle stagger for desktop stacking
            const stickyTop = reduced ? 'auto' : `${80 + idx * 24}px`;
            // Subtle multi-layer parallax offset
            const parallaxY = reduced ? 0 : (progress - 0.3 * idx) * 20;

            return (
              <div
                key={card.step}
                className="rounded-3xl bg-surface-raised border border-line shadow-card overflow-hidden transition-all duration-300"
                style={{
                  position: reduced ? 'relative' : 'sticky',
                  top: stickyTop,
                  borderColor: `${card.accentColor}33`,
                  // Subtle clip-path curtain reveal styling
                  clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                  transform: reduced ? 'none' : `translateY(${Math.max(-10, Math.min(10, parallaxY))}px)`
                }}
              >
                {/* Background Ambient Glow & Subtle Multi-layer Parallax Mesh */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 85% 20%, ${card.bgTint} 0%, transparent 60%)`
                  }}
                />

                <div className="relative z-10 p-6 sm:p-10 md:p-12">
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-line">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-mono font-bold text-text-muted">
                        {card.step}
                      </span>
                      <span className="px-3 py-1 rounded text-xs font-mono font-semibold uppercase tracking-wider bg-surface-sunken border border-line text-text-secondary">
                        {card.badge}
                      </span>
                    </div>

                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center border"
                      style={{
                        backgroundColor: `${card.accentColor}18`,
                        borderColor: `${card.accentColor}40`,
                        color: card.accentColor
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="py-6 sm:py-8 space-y-4">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-medium text-heading">
                      {card.headline}
                    </h3>
                    <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-3xl">
                      {card.summary}
                    </p>
                  </div>

                  {/* Stats Grid & Action Link */}
                  <div className="pt-6 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="grid grid-cols-2 gap-4">
                      {card.stats.map((s, i) => (
                        <div key={i} className="space-y-0.5">
                          <div className="text-[11px] font-mono uppercase tracking-wider text-text-muted">
                            {s.label}
                          </div>
                          <div
                            className="text-sm sm:text-base font-mono font-bold text-heading"
                            style={{ color: card.accentColor }}
                          >
                            {s.val}
                          </div>
                        </div>
                      ))}
                    </div>

                    <Link
                      to={card.route}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-surface-sunken hover:bg-surface-accent border border-line text-xs font-mono font-semibold uppercase tracking-wider text-heading transition-colors"
                    >
                      <span>{card.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-primary" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
