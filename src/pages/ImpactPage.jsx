import React from 'react';
import { Link } from 'react-router-dom';
import ImpactDashboard from '../components/ImpactDashboard';
import { useCart } from '../context/CartContext';
import { Droplets, Ban, Wind } from 'lucide-react';

export default function ImpactPage() {
  const { setIsAgentOpen } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-fade-in pb-24">
      {/* Top Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-3.5 py-1 rounded-full inline-block">
          Tangible Planetary Accounting
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-heading tracking-tight">
          Environmental Impact Ledger
        </h1>
        <p className="text-sm sm:text-base text-secondary leading-relaxed max-w-xl mx-auto">
          Shopping responsibly shouldn't be an abstract feeling. At EcoMart, every item added or swapped
          calculates exact grams of plastic diverted, kilograms of CO₂ avoided, and litres of water saved.
        </p>
      </div>

      {/* Main Live Cart Impact Dashboard */}
      <ImpactDashboard showHeader={true} />

      {/* Educational Explainer Grid: How Benchmarks Work */}
      <section className="p-6 sm:p-8 rounded-3xl bg-surface border border-line shadow-soft-sm space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Open Scientific Benchmarks
          </span>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-heading mt-1">
            How Are Impact Savings Calculated?
          </h3>
          <p className="text-xs sm:text-sm text-secondary max-w-xl mt-1">
            We map each sustainable item directly against its conventional petrochemical market equivalent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-surface-sunken border border-line space-y-2.5">
            <div className="p-2 w-fit rounded-xl bg-surface text-secondary">
              <Wind className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-sm text-heading">
              CO₂ Lifecycle Delta
            </h4>
            <p className="text-xs text-secondary leading-relaxed">
              Compares cradle-to-gate emissions of virgin plastics and polyesters against organic plant fibres, cold-pressed oils, and salvaged woods.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-surface-sunken border border-line space-y-2.5">
            <div className="p-2 w-fit rounded-xl bg-surface text-accent">
              <Ban className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-sm text-heading">
              Plastic Diversion Formula
            </h4>
            <p className="text-xs text-secondary leading-relaxed">
              Every packaging wrapper, bottle, or synthetic handle eliminated is tracked in exact grams (1 standard 500ml PET bottle ≈ 20 grams of virgin polymer).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-surface-sunken border border-line space-y-2.5">
            <div className="p-2 w-fit rounded-xl bg-surface text-primary">
              <Droplets className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-sm text-heading">
              Freshwater Conservation
            </h4>
            <p className="text-xs text-secondary leading-relaxed">
              Waterless solid shampoo formulas and rain-fed jute/bamboo crops consume up to 90% less freshwater than chemical mill cotton or petrochemical synthesis.
            </p>
          </div>
        </div>
      </section>

      {/* Action Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 sm:p-8 rounded-3xl bg-primary text-primary-contrast gap-4 shadow-soft-md border border-primary">
        <div>
          <div className="font-serif font-bold text-lg sm:text-xl text-primary-contrast">Want to maximize your eco-points?</div>
          <p className="text-xs sm:text-sm text-primary-contrast/80 mt-1">
            Let the Eco Agent inspect your selections and suggest 1-tap swaps.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAgentOpen(true)}
            className="px-5 py-3 rounded-full bg-surface text-primary hover:bg-surface-sunken font-bold text-xs shadow-soft-xs transition min-h-[44px] cursor-pointer focus-visible:outline-2 focus-visible:outline-focus"
          >
            Review Cart with Agent
          </button>
          <Link
            to="/shop"
            className="px-5 py-3 rounded-full bg-primary-hover hover:bg-primary-hover/90 text-primary-contrast border border-primary-contrast/20 font-bold text-xs transition min-h-[44px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-focus"
          >
            Explore Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
