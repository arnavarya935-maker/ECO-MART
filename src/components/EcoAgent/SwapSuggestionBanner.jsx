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
    <div
      role="region"
      aria-label="Eco Swap Recommendation"
      className="fixed top-20 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl animate-fade-in"
    >
      <div className="bg-surface text-text rounded-3xl p-4 sm:p-5 shadow-soft-xl border border-line backdrop-blur-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3.5 w-full sm:w-auto">
          <div className="p-2.5 rounded-2xl bg-primary/10 text-primary shrink-0 border border-primary/20 shadow-soft-xs">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Eco Agent Alert
              </span>
              <span className="text-xs text-muted">Greener Swap Available</span>
            </div>
            <h4 className="text-sm font-serif font-bold mt-1 text-heading">
              Upgrade from {conventionalProduct.name} to {greenerProduct.name}?
            </h4>
            <p className="text-xs text-primary font-medium mt-0.5">
              🌱 {impact.summary}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={dismissSwapAlert}
            className="px-3.5 py-2.5 text-xs font-semibold text-muted hover:text-heading min-h-[44px] transition-colors focus-visible:outline-2 focus-visible:outline-focus"
          >
            Keep Original
          </button>
          <button
            type="button"
            onClick={handleSwap}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-primary hover:bg-primary-hover text-primary-contrast font-bold text-xs shadow-soft-sm hover:shadow-soft-md transition-all active:scale-[0.99] shrink-0 min-h-[44px] focus-visible:outline-2 focus-visible:outline-focus"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>1-Tap Swap</span>
          </button>
          <button
            type="button"
            onClick={dismissSwapAlert}
            aria-label="Dismiss alert"
            className="w-9 h-9 rounded-full flex items-center justify-center text-muted hover:text-heading hover:bg-surface-sunken transition-colors focus-visible:outline-2 focus-visible:outline-focus"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
