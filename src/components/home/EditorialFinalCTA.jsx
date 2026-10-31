import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles, ShoppingBag } from 'lucide-react';
import { useT } from '../../context/I18nContext';

export default function EditorialFinalCTA() {
  const { lang } = useT();

  return (
    <section
      id="final-cta"
      aria-labelledby="cta-heading"
      className="relative bg-surface py-24 md:py-32 border-b border-line overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 md:px-10 text-center">
        <div className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AUTONOMOUS ECO AGENT · NO VAGUE CLAIMS</span>
        </div>

        <h2
          id="cta-heading"
          className="mt-6 font-sans text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-heading text-balance leading-[1.08]"
        >
          Make every purchase a vote for a restored planet.
        </h2>

        <p className="mt-5 mx-auto max-w-xl font-sans text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed">
          Transform your ordinary grocery or household list into a greener cart in seconds. Expose hidden footprints, eliminate plastic waste, and calculate circular swaps.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/transform"
            className="liquid-pill liquid-pill-emerald group cursor-pointer"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            <span>Transform Your Cart</span>
            <ArrowUpRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          <Link
            to="/shop"
            className="liquid-pill liquid-pill-dark group cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 mr-2 text-primary" />
            <span>Explore Sustainable Catalog</span>
          </Link>
        </div>

        {/* Small Trust Metrics */}
        <div className="mt-12 pt-8 border-t border-line/60 flex flex-wrap items-center justify-center gap-6 sm:gap-10 font-mono text-[10px] sm:text-[11px] text-text-muted uppercase tracking-wider">
          <span>PACKAGING DETAILS SHOWN FOR EVERY PRODUCT</span>
          <span>·</span>
          <span>FSC & USDA LISTED</span>
          <span>·</span>
          <span>ZERO CLOUD TRACKING</span>
        </div>
      </div>
    </section>
  );
}
