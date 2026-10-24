import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Camera,
  Swords,
  Scale,
  Activity,
  ArrowRight
} from 'lucide-react';
import { useScrollProgress, isReducedMotion } from '../../lib/scrollAnimation';

const FEATURE_CARDS = [
  {
    id: 'eco-agent',
    route: '/how-it-works',
    title: 'Eco Agent',
    tagline: 'Transparent Reasoning Engine',
    description:
      'Autonomous AI assistant that exposes verifiable decision steps, weights tradeoffs, and detects greenwashing before you checkout.',
    icon: Sparkles,
    badge: 'Core Intelligence',
    accentColor: '#047857',
    metric: 'Explainable Reasoning Traces'
  },
  {
    id: 'scanner',
    route: '/scan',
    title: 'Label Scanner',
    tagline: 'Vision-Powered Packaging Audit',
    description:
      'Photograph or upload product packaging. Vision AI extracts claims, cross-references ISO 14021 rules, and flags misleading green claims.',
    icon: Camera,
    badge: 'Vision AI',
    accentColor: '#0F766E',
    metric: 'Instant OCR • Offline Fallbacks'
  },
  {
    id: 'courtroom',
    route: '/courtroom',
    title: 'AI Courtroom',
    tagline: 'Simulated 3-Way Product Trial',
    description:
      'Prosecutor exposes greenwashing, Defender presents the strongest honest case, and Judge renders a binding Trust Score verdict.',
    icon: Swords,
    badge: 'Flagship Lab',
    accentColor: '#10B981',
    metric: '3 AI Roles • Real-time Objections'
  },
  {
    id: 'fairness',
    route: '/fairness',
    title: 'Fairness Lab',
    tagline: 'Cross-Linguistic Parity & Equity',
    description:
      'Audits recommendation parity across English, Hindi (Devanagari), Hinglish, and student vs affluent consumer personas.',
    icon: Scale,
    badge: 'Bias & Equity',
    accentColor: '#34D399',
    metric: 'Jaccard Parity: 93/100'
  },
  {
    id: 'impact',
    route: '/impact',
    title: 'Impact Command Center',
    tagline: 'Real-time Planetary Metrics',
    description:
      'Live LCA accounting tracking diverted plastics, avoided carbon emissions, and verified circular lifecycle savings.',
    icon: Activity,
    badge: 'LCA Intelligence',
    accentColor: '#B45309',
    metric: 'Carbon & Plastic Planetary Delta'
  }
];

export default function HorizontalFeatureGallery() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const reduced = isReducedMotion();

  // 650px of pin travel translates to horizontal travel across the 5 cards
  const { progress } = useScrollProgress(containerRef, {
    pinTravel: 650,
    disabled: reduced
  });

  // Calculate track horizontal translation
  // Card width is ~340px * 5 cards = ~1700px. Visible viewport ~1100px. Max scroll ~600px.
  const maxTranslate = 700;
  const translateX = reduced ? 0 : progress * maxTranslate;

  return (
    <section
      ref={containerRef}
      id="feature-gallery"
      className="relative w-full bg-surface py-12 md:py-20 border-b border-line selection:bg-emerald-500/20 overflow-hidden"
      style={{
        minHeight: reduced ? 'auto' : 'clamp(650px, 140vh, 1100px)'
      }}
    >
      {/* Sticky Frame for Desktop Horizontal Scrub */}
      <div className="sticky top-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase bg-primary-subtle text-primary border border-primary/20 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Interactive Lab Suite
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-medium text-heading tracking-tight">
              Responsible AI Feature Gallery
            </h2>
            <p className="mt-2 text-sm sm:text-base text-text-secondary">
              Scroll to explore our specialized auditing laboratories. Each card connects directly to a live interactive tool.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-text-muted">
            <span className="hidden sm:inline">Horizontal Scrub:</span>
            <div className="w-20 h-1.5 bg-surface-sunken rounded-full overflow-hidden border border-line">
              <div
                className="h-full bg-primary transition-all duration-75"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <span className="font-bold text-heading">{Math.round(progress * 100)}%</span>
          </div>
        </div>

        {/* Horizontal Track Wrapper */}
        <div className="relative w-full overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 scrollbar-none">
          <div
            ref={trackRef}
            className="flex gap-5 transition-transform duration-75 ease-out will-change-transform min-w-max sm:min-w-0"
            style={{
              transform: reduced ? 'none' : `translate3d(-${translateX}px, 0, 0)`
            }}
          >
            {FEATURE_CARDS.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.id}
                  className="w-[300px] sm:w-[350px] shrink-0 rounded-2xl bg-surface-raised border border-line shadow-card hover:border-primary/50 transition-all duration-200 flex flex-col justify-between p-6 sm:p-7 group"
                >
                  <div className="space-y-4">
                    {/* Top Row: Icon + Badge */}
                    <div className="flex items-center justify-between">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-105"
                        style={{
                          backgroundColor: `${card.accentColor}18`,
                          borderColor: `${card.accentColor}33`,
                          color: card.accentColor
                        }}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="px-2.5 py-1 rounded text-[11px] font-mono font-semibold uppercase tracking-wider bg-surface-sunken border border-line text-text-muted">
                        {card.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-display font-semibold text-heading group-hover:text-primary transition-colors">
                        {card.title}
                      </h3>
                      <div className="text-xs font-mono font-medium text-text-secondary mt-0.5">
                        {card.tagline}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed line-clamp-3">
                      {card.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-4 border-t border-line space-y-3">
                    <div className="text-[11px] font-mono text-text-muted">
                      {card.metric}
                    </div>

                    {/* Direct Real Route Link */}
                    <Link
                      to={card.route}
                      className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-lg bg-surface-sunken hover:bg-surface-accent border border-line hover:border-primary/40 text-xs font-mono font-semibold uppercase tracking-wider text-heading transition-all group-hover:text-primary"
                    >
                      <span>Launch {card.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
