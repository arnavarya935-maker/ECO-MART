import React from 'react';
import { X, Sparkles, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ExitIntentModal() {
  const {
    exitIntentOpen,
    dismissExitIntent,
    cartItems,
    impact,
    setIsCartOpen
  } = useCart();

  if (!exitIntentOpen || cartItems.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl p-6 overflow-hidden">
        <button
          type="button"
          onClick={dismissExitIntent}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 text-xs font-bold border border-amber-300/40 mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Before You Go
        </div>

        <h3 className="text-2xl font-black text-stone-900 dark:text-stone-100 leading-tight">
          Check Your Cart’s Eco-Score!
        </h3>

        <p className="mt-2 text-xs text-stone-600 dark:text-stone-300">
          You have {cartItems.length} conscious {cartItems.length === 1 ? 'item' : 'items'} in your cart right now.
        </p>

        {/* Eco-Score snapshot */}
        <div className="mt-4 p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-stone-400">Cart Sustainability Grade</div>
            <div className="text-lg font-black text-emerald-700 dark:text-emerald-400 mt-0.5">
              Score: {impact.averageScore}/100
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Avoiding ~{impact.savedCo2.toFixed(1)}kg CO₂
            </div>
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-black text-xl border border-emerald-300/40">
            {impact.grade}
          </div>
        </div>

        <div className="mt-5 flex gap-2.5">
          <button
            type="button"
            onClick={dismissExitIntent}
            className="flex-1 py-2.5 px-4 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            Keep Browsing
          </button>
          <button
            type="button"
            onClick={() => {
              dismissExitIntent();
              setIsCartOpen(true);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md active:scale-98 transition"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Review Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
