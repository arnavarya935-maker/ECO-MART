import React from 'react';
import { Sparkles, Leaf, ShieldCheck, ArrowRight, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function WelcomeModal() {
  const { welcomeModalOpen, dismissWelcomeModal } = useCart();

  if (!welcomeModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <button
          type="button"
          onClick={dismissWelcomeModal}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300/40 mb-4">
          <Sparkles className="w-3.5 h-3.5" /> Welcome to EcoMart
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 leading-tight">
          Don’t just shop. <br />
          <span className="text-emerald-600 dark:text-emerald-400">Shop with purpose.</span>
        </h2>

        <p className="mt-3 text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
          EcoMart pairs every product with transparent lifecycle metrics (carbon, water, plastic) and an automated <strong>Eco-Score Engine</strong> that suggests cleaner swaps right inside your cart.
        </p>

        <div className="mt-5 space-y-2.5">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/60 dark:border-stone-800">
            <Leaf className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-stone-900 dark:text-stone-100">Live Impact Calculator</div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400">Watch CO₂ and plastic waste decrease dynamically as you swap items.</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/60 dark:border-stone-800">
            <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-stone-900 dark:text-stone-100">100% Offline Capable</div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400">Works seamlessly with or without internet. Real photos and 3D visualizers run locally.</div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={dismissWelcomeModal}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-lg shadow-emerald-900/20 active:scale-98 transition-all"
          >
            <span>Start Exploring</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
