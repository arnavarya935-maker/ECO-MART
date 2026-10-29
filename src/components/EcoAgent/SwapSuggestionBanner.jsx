import React, { useState } from 'react';
import { Sparkles, RefreshCw, X, ChevronDown, ChevronUp, ShoppingBag, Compass } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function SwapSuggestionBanner() {
  const {
    isCartOpen,
    activeSwapAlert,
    dismissSwapAlert,
    copilotNudge,
    dismissCopilotNudge,
    swapItemInCart,
    setIsCartOpen
  } = useCart();

  const navigate = useNavigate();
  const [showReasoning, setShowReasoning] = useState(false);

  // Active nudge can come from copilotEngine or activeSwapAlert
  const activeNudge = copilotNudge || (activeSwapAlert ? {
    id: 'legacy-swap',
    type: 'swap',
    title: 'Greener Swap Recommended 🌱',
    message: `Upgrade from ${activeSwapAlert.conventionalProduct.name} to ${activeSwapAlert.greenerProduct.name}?`,
    trigger: 'Conventional or low-grade item added to cart',
    reasoning: `The item added contains plastic or elevated carbon. Swapping avoids: ${activeSwapAlert.impact?.summary || 'significant lifecycle waste'}.`,
    product: activeSwapAlert.conventionalProduct,
    greenerProduct: activeSwapAlert.greenerProduct,
    impact: activeSwapAlert.impact,
    actionLabel: '1-Tap Swap',
    actionType: 'swap'
  } : null);

  if (!activeNudge || isCartOpen) return null;

  const handleDismiss = () => {
    if (dismissCopilotNudge) dismissCopilotNudge();
    if (dismissSwapAlert) dismissSwapAlert();
  };

  const handleAction = () => {
    if (activeNudge.actionType === 'swap' && activeNudge.greenerProduct) {
      swapItemInCart(activeNudge.product.id, activeNudge.greenerProduct);
    } else if (activeNudge.actionType === 'open_cart') {
      setIsCartOpen(true);
      handleDismiss();
    } else if (activeNudge.actionType === 'browse' && activeNudge.category) {
      navigate(`/shop?category=${encodeURIComponent(activeNudge.category)}`);
      handleDismiss();
    } else {
      handleDismiss();
    }
  };

  return (
    <div
      role="region"
      aria-label="Eco Copilot Recommendation"
      className="fixed top-20 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl animate-slide-up"
    >
      <div className="bg-surface-raised text-text-primary rounded-3xl p-4 sm:p-5 shadow-soft-lg border border-line flex flex-col gap-3">
        {/* Top Row: Icon + Title + Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3 w-full sm:w-auto">
            <div className="p-2.5 rounded-2xl bg-primary-subtle text-primary shrink-0 border border-primary/20">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-sans font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary-subtle text-primary border border-primary/20">
                  Eco Copilot
                </span>
                <span className="text-xs font-sans text-muted">Active Reasoning</span>
              </div>
              <h4 className="text-sm font-serif font-bold mt-1 text-heading">
                {activeNudge.title || `Upgrade from ${activeNudge.product?.name} to ${activeNudge.greenerProduct?.name}?`}
              </h4>
              <p className="text-xs font-sans text-secondary mt-0.5">
                {activeNudge.message || `🌱 ${activeNudge.impact?.summary}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
            {activeNudge.actionType === 'swap' ? (
              <>
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="px-3 py-2 text-xs font-sans font-semibold text-muted hover:text-heading min-h-[44px] transition-colors cursor-pointer"
                >
                  Keep Original
                </button>
                <button
                  type="button"
                  onClick={handleAction}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-primary hover:bg-primary-hover text-text-inverted font-sans font-bold text-xs shadow-soft-sm transition-all active:scale-95 shrink-0 min-h-[44px] cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{activeNudge.actionLabel || '1-Tap Swap'}</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleAction}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-primary hover:bg-primary-hover text-text-inverted font-sans font-bold text-xs shadow-soft-sm transition-all active:scale-95 shrink-0 min-h-[44px] cursor-pointer"
              >
                {activeNudge.actionType === 'open_cart' ? (
                  <ShoppingBag className="w-3.5 h-3.5" />
                ) : (
                  <Compass className="w-3.5 h-3.5" />
                )}
                <span>{activeNudge.actionLabel || 'Review'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss Copilot nudge"
              className="w-9 h-9 rounded-full flex items-center justify-center text-muted hover:text-heading hover:bg-surface-sunken transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* "Why am I seeing this?" Expandable Explanation */}
        <div className="border-t border-line/60 pt-2">
          <button
            type="button"
            onClick={() => setShowReasoning(!showReasoning)}
            className="flex items-center gap-1.5 text-xs font-sans font-semibold text-muted hover:text-primary transition-colors cursor-pointer"
            aria-expanded={showReasoning}
          >
            <span>Why am I seeing this?</span>
            {showReasoning ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {showReasoning && (
            <div className="mt-2 p-3 rounded-2xl bg-surface-sunken border border-line text-xs font-sans space-y-1 animate-slide-up">
              <div className="flex items-start gap-1.5 text-secondary">
                <strong className="text-heading font-semibold shrink-0">Trigger:</strong>
                <span>{activeNudge.trigger || 'Multi-criteria cart analysis'}</span>
              </div>
              <div className="flex items-start gap-1.5 text-secondary">
                <strong className="text-heading font-semibold shrink-0">Reasoning:</strong>
                <span>{activeNudge.reasoning || 'Evaluates lifecycle estimates to recommend lower-carbon options (estimate).'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
