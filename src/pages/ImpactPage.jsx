import React from 'react';
import ImpactDashboard from '../components/ImpactDashboard';
import { useCart } from '../context/CartContext';
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Trees, Droplets, Ban, Wind } from 'lucide-react';

export default function ImpactPage({ setActivePage }) {
  const { cartItems, setIsAgentOpen } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Top Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-full inline-block">
          Tangible Planetary Accounting
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-stone-900 dark:text-stone-100">
          Environmental Impact Ledger
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
          Shopping responsibly shouldn't be an abstract feeling. At EcoMart, every item added or swapped
          calculates exact grams of plastic diverted, kilograms of CO₂ avoided, and litres of water saved.
        </p>
      </div>

      {/* Main Live Cart Impact Dashboard */}
      <ImpactDashboard showHeader={true} />

      {/* Educational Explainer Grid: How Benchmarks Work */}
      <section className="p-8 rounded-3xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Open Scientific Benchmarks
          </span>
          <h3 className="text-xl font-black text-stone-900 dark:text-stone-100 mt-1">
            How Are Impact Savings Calculated?
          </h3>
          <p className="text-xs text-stone-500 max-w-xl mt-1">
            We map each sustainable item directly against its conventional market equivalent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2">
            <div className="p-2 w-fit rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-300">
              <Wind className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              CO₂ Lifecycle Delta
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              Compares cradle-to-gate emissions of virgin plastics/polyesters (average 4-8 kg CO₂/kg) against organic plant fibres, cold-pressed oils, and salvaged woods.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2">
            <div className="p-2 w-fit rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-300">
              <Ban className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              Plastic Diversion Formula
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              Every packaging wrapper, bottle, or synthetic handle eliminated is tracked in exact grams (1 standard 500ml PET bottle ≈ 20 grams of virgin polymer).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2">
            <div className="p-2 w-fit rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-300">
              <Droplets className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              Freshwater Conservation
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              Waterless solid shampoo formulas and rain-fed jute/bamboo crops consume up to 90% less freshwater than chemical mill cotton or petrochemical synthesis.
            </p>
          </div>
        </div>
      </section>

      {/* Action Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white gap-4">
        <div>
          <div className="font-bold text-base">Want to maximize your eco-points?</div>
          <p className="text-xs text-emerald-200">
            Let the Eco Agent inspect your selections and suggest 1-tap swaps.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAgentOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-white text-stone-900 hover:bg-stone-100 font-bold text-xs shadow-md transition"
          >
            Review Cart with Agent
          </button>
          <button
            type="button"
            onClick={() => setActivePage('shop')}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
          >
            Explore Catalog
          </button>
        </div>
      </div>
    </div>
  );
}
