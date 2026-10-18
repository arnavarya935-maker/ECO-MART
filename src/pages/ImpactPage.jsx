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
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full inline-block">
          Tangible Planetary Accounting
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#0B3B2C]">
          Environmental Impact Ledger
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
          Shopping responsibly shouldn't be an abstract feeling. At EcoMart, every item added or swapped
          calculates exact grams of plastic diverted, kilograms of CO₂ avoided, and litres of water saved.
        </p>
      </div>

      {/* Main Live Cart Impact Dashboard */}
      <ImpactDashboard showHeader={true} />

      {/* Educational Explainer Grid: How Benchmarks Work */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Open Scientific Benchmarks
          </span>
          <h3 className="text-xl font-black text-[#0B3B2C] mt-1">
            How Are Impact Savings Calculated?
          </h3>
          <p className="text-xs text-stone-500 max-w-xl mt-1">
            We map each sustainable item directly against its conventional petrochemical market equivalent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
            <div className="p-2 w-fit rounded-xl bg-sky-100 text-sky-700">
              <Wind className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-stone-900">
              CO₂ Lifecycle Delta
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Compares cradle-to-gate emissions of virgin plastics and polyesters against organic plant fibres, cold-pressed oils, and salvaged woods.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
            <div className="p-2 w-fit rounded-xl bg-rose-100 text-rose-700">
              <Ban className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-stone-900">
              Plastic Diversion Formula
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Every packaging wrapper, bottle, or synthetic handle eliminated is tracked in exact grams (1 standard 500ml PET bottle ≈ 20 grams of virgin polymer).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
            <div className="p-2 w-fit rounded-xl bg-teal-100 text-teal-700">
              <Droplets className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-stone-900">
              Freshwater Conservation
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Waterless solid shampoo formulas and rain-fed jute/bamboo crops consume up to 90% less freshwater than chemical mill cotton or petrochemical synthesis.
            </p>
          </div>
        </div>
      </section>

      {/* Action Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0B3B2C] to-[#047857] text-white gap-4 shadow-sm">
        <div>
          <div className="font-black text-base sm:text-lg">Want to maximize your eco-points?</div>
          <p className="text-xs text-emerald-100 mt-0.5">
            Let the Eco Agent inspect your selections and suggest 1-tap swaps.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAgentOpen(true)}
            className="px-5 py-3 rounded-2xl bg-white text-[#0B3B2C] hover:bg-stone-100 font-extrabold text-xs shadow-2xs transition min-h-[44px]"
          >
            Review Cart with Agent
          </button>
          <Link
            to="/shop"
            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition min-h-[44px] flex items-center justify-center"
          >
            Explore Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
