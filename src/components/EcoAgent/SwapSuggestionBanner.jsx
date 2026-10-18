import React from 'react';
import { Sparkles, RefreshCw, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function SwapSuggestionBanner() {
  const { activeSwapAlert, dismissSwapAlert, swapItemInCart } = useCart();

  if (!activeSwapAlert) return null;

  const { conventionalProduct, greenerProduct, impact } = activeSwapAlert;

  const handleSwap = () => {
    swapItemInCart(conventionalProduct.id, greenerProduct);
  };

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl animate-bounce-subtle">
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-4 sm:p-5 shadow-2xl border border-emerald-500/40 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3 w-full sm:w-auto">
          <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 shrink-0 border border-emerald-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500 text-stone-950">
                Eco Agent Alert
              </span>
              <span className="text-xs text-stone-400">Greener Swap Available!</span>
            </div>
            <h4 className="text-sm font-bold mt-1 text-white">
              Upgrade from {conventionalProduct.name} to {greenerProduct.name}?
            </h4>
            <p className="text-xs text-emerald-300 mt-0.5">
              🌱 <strong>{impact.summary}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={dismissSwapAlert}
            className="px-3 py-2 text-xs font-medium text-stone-400 hover:text-stone-200 transition"
          >
            Keep Original
          </button>
          <button
            type="button"
            onClick={handleSwap}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs shadow-md transition-all active:scale-95 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>1-Tap Swap</span>
          </button>
          <button
            type="button"
            onClick={dismissSwapAlert}
            className="p-1.5 text-stone-500 hover:text-stone-300 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
