import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useT } from '../../context/I18nContext';
import Safe3D from '../3D/Safe3D';
import ContourCanvas from './ContourCanvas';

import productsData from '../../data/products.json';

const LeafyGlobe3D = React.lazy(() => import('../3D/LeafyGlobe3D'));

export default function EngineeringHero() {
  const { setIsAgentOpen, impact } = useCart();
  useT();

  const totalCatalog = productsData.length;
  const plasticFreeCount = productsData.filter((p) => p.packaging === 'plastic-free').length;
  const plasticFreePct = Math.round((plasticFreeCount / totalCatalog) * 100);

  return (
    <header id="hero" className="relative w-full overflow-hidden bg-surface antialiased pt-8 pb-16 md:pt-12 md:pb-24 border-b border-line">
      {/* Contour Canvas Animation (Emerald/Teal Contour Lines & Particles) */}
      <ContourCanvas />

      {/* Ambient Radial Glow behind Hero */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[120vw] max-w-[1300px] h-[550px] bg-gradient-to-b from-primary/15 via-secondary/8 to-transparent rounded-full blur-3xl opacity-80" />
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10">
        {/* Eyebrow place & established label */}
        <div className="flex items-center justify-between border-t border-line/60 pt-4 font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-text-muted">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="hidden sm:inline">AUTONOMOUS ECO AGENT ·</span> TECHNOPHILIA 7.0
          </span>
          <span className="text-primary font-bold">SERVER AI + OFFLINE FALLBACK</span>
        </div>

        {/* Hero Grid: Typography on Left, Biosphere Visualizer on Right */}
        <div className="mt-10 md:mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Headline & Subhead (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <h1 className="font-sans text-[clamp(2.5rem,6.8vw,5.2rem)] font-bold tracking-[-0.038em] leading-[1.03] text-heading text-balance">
              <span className="inline-block overflow-hidden pb-1">
                <span className="hero-word-reveal [animation-delay:80ms]">Shopping</span>
              </span>{' '}
              <span className="inline-block overflow-hidden pb-1">
                <span className="hero-word-reveal [animation-delay:160ms]">that</span>
              </span>{' '}
              <br className="hidden sm:inline" />
              <span className="inline-block overflow-hidden pb-1">
                <span className="hero-word-reveal [animation-delay:260ms] font-serif italic font-normal text-emerald-700 dark:text-emerald-400">
                  proves
                </span>
              </span>{' '}
              <span className="inline-block overflow-hidden pb-1">
                <span className="hero-word-reveal [animation-delay:340ms] font-serif italic font-normal text-emerald-700 dark:text-emerald-400">
                  its
                </span>
              </span>{' '}
              <span className="inline-block overflow-hidden pb-1">
                <span className="hero-word-reveal [animation-delay:420ms] font-serif italic font-normal text-emerald-700 dark:text-emerald-400">
                  claims
                </span>
              </span>
              <span className="inline-block w-2.5 h-2.5 bg-primary ml-2 translate-y-[-2px] rounded-xs shadow-[0_0_10px_rgba(4,120,87,0.5)] hero-settle [animation-delay:520ms]" aria-hidden="true" />
            </h1>

            <p className="max-w-[48ch] font-sans text-sm sm:text-base leading-[1.65] text-text-secondary text-pretty hero-settle [animation-delay:480ms]">
              An AI shopping assistant that exposes its reasoning, verifies certifications, detects greenwashing, and measures lifecycle impact—engineered with verifiable ethical guardrails, powered by a server AI proxy with an offline fallback.
            </p>

            {/* CTAs: Liquid Pill Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5 hero-settle [animation-delay:600ms]">
              <button
                type="button"
                onClick={() => setIsAgentOpen(true)}
                className="liquid-pill liquid-pill-emerald group cursor-pointer"
                id="hero-try-eco-agent-btn"
              >
                <Sparkles className="w-3.5 h-3.5 mr-2 text-surface" />
                <span>Try Eco Agent</span>
              </button>

              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open-judge-walkthrough'))}
                className="liquid-pill liquid-pill-dark group border border-amber-400/40 text-amber-700 dark:text-amber-300 hover:border-amber-400 cursor-pointer"
                id="hero-run-judge-demo-btn"
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-2 text-amber-600 dark:text-amber-400" />
                <span>Run Judge Demo</span>
              </button>

              <Link
                to="/shop"
                className="px-4 py-2 text-xs font-mono text-text-muted hover:text-heading flex items-center gap-1 transition"
              >
                <span>Browse Catalog</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Editorial Mini-Specs Strip - Real Computed Highlights */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-line/60 max-w-lg hero-settle [animation-delay:720ms]">
              <div>
                <div className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-text-muted">Sample Catalog</div>
                <div className="mt-1 text-xs sm:text-sm font-semibold text-heading font-mono">{totalCatalog} Audited Items</div>
              </div>
              <div>
                <div className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-text-muted">Packaging</div>
                <div className="mt-1 text-xs sm:text-sm font-semibold text-heading font-mono">{plasticFreePct}% Plastic-Free</div>
              </div>
              <div>
                <div className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-text-muted">Architecture</div>
                <div className="mt-1 text-xs sm:text-sm font-semibold text-heading font-mono">API + Offline Mode</div>
              </div>
            </div>
          </div>

          {/* Right Visual: Planetary Biosphere in Safe3D (5 Cols) */}
          <div className="lg:col-span-5 relative hero-settle [animation-delay:550ms]">
            <div className="relative rounded-3xl border border-line bg-surface-raised/80 p-2.5 backdrop-blur-md shadow-card overflow-hidden">
              <Safe3D
                fallbackTitle="Interactive 3D Biosphere"
                fallbackSubtitle="Visualizer paused under Reduce Effects or when WebGL is unavailable."
                fallbackEmoji="🌍"
                className="h-[380px] sm:h-[440px] w-full"
                autoLoad={true}
              >
                <LeafyGlobe3D cartCo2Saved={parseFloat(impact.co2Saved) || 0} />
              </Safe3D>

              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.16em] text-text-muted bg-surface/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-line shadow-soft-xs">
                <span className="flex items-center gap-1.5 text-heading font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                  Live 3D Biosphere • Spin to Explore
                </span>
                <span className="text-primary font-bold">CO₂ IMPACT (ESTIMATE)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
