import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useT } from '../../context/I18nContext';
import Safe3D from '../3D/Safe3D';
import ContourCanvas from './ContourCanvas';

const LeafyGlobe3D = React.lazy(() => import('../3D/LeafyGlobe3D'));

export default function EngineeringHero() {
  const { setIsAgentOpen, impact } = useCart();
  const { t, lang } = useT();

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
            <span className="hidden sm:inline">AUTONOMOUS ECO AGENT ·</span> EST. 2026
          </span>
          <span className="text-primary font-bold">100% OFFLINE NATIVE</span>
        </div>

        {/* Hero Grid: Typography on Left, Biosphere Visualizer on Right */}
        <div className="mt-10 md:mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Headline & Subhead (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <h1 className="font-sans text-[clamp(2.5rem,6.8vw,5.2rem)] font-bold tracking-[-0.038em] leading-[1.03] text-heading text-balance">
              Shopping that <br className="hidden sm:inline" />
              <span className="font-serif italic font-normal text-emerald-400">
                proves its claims
              </span>
              <span className="inline-block w-2.5 h-2.5 bg-primary ml-2 translate-y-[-2px] rounded-xs shadow-[0_0_10px_rgba(16,185,129,0.9)]" aria-hidden="true" />
            </h1>

            <p className="max-w-[48ch] font-sans text-sm sm:text-base leading-[1.65] text-text-secondary text-pretty">
              An AI shopping assistant that exposes its reasoning, verifies certifications, detects greenwashing, and measures lifecycle impact—engineered with verifiable ethical guardrails, running 100% offline.
            </p>

            {/* CTAs: Liquid Pill Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
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
                className="liquid-pill liquid-pill-dark group border border-amber-400/40 text-amber-300 hover:border-amber-400 cursor-pointer"
                id="hero-run-judge-demo-btn"
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-2 text-amber-400" />
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

            {/* Editorial Mini-Specs Strip */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-line/60 max-w-lg">
              <div>
                <div className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-text-muted">Lifecycle</div>
                <div className="mt-1 text-xs sm:text-sm font-semibold text-heading font-mono">0–100 EcoScore</div>
              </div>
              <div>
                <div className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-text-muted">Packaging</div>
                <div className="mt-1 text-xs sm:text-sm font-semibold text-heading font-mono">0g Plastic</div>
              </div>
              <div>
                <div className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-text-muted">Engine</div>
                <div className="mt-1 text-xs sm:text-sm font-semibold text-heading font-mono">0ms CDN Lag</div>
              </div>
            </div>
          </div>

          {/* Right Visual: Planetary Biosphere in Safe3D (5 Cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl border border-line bg-surface-raised/60 p-2 backdrop-blur-md shadow-soft-lg overflow-hidden">
              <Safe3D
                featureName="Planetary Biosphere Visualizer"
                height="390px"
                staticFallbackImage="/images/products/kit-01.jpg"
              >
                <LeafyGlobe3D cartCo2Saved={parseFloat(impact.co2Saved) || 0} />
              </Safe3D>

              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.16em] text-text-muted bg-surface/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-line">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-primary" />
                  Verified Carbon Sink
                </span>
                <span className="text-primary font-bold">LIFECYCLE VERIFIED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
