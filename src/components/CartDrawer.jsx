import React, { useState, useMemo } from 'react';
import { Trash2, ShoppingBag, ArrowRight, RefreshCw, AlertTriangle, Sparkles, Undo2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useT } from '../context/I18nContext';
import { calculateEcoScore } from '../lib/ecoScore';
import EcoScoreBadge from './EcoScoreBadge';
import SwapMyCartModal from './SwapMyCartModal';
import { Drawer } from './ui/Modal';

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    updateQuantity,
    removeFromCart,
    swapItemInCart,
    impact,
    allProducts,
    setCheckoutModalOpen,
    undoLastRemoval,
    lastRemovedItem
  } = useCart();
  const { t } = useT();

  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);

  const productMap = useMemo(() => new Map((allProducts || []).map((p) => [p.id, p])), [allProducts]);

  // Check how many conventional items exist
  const conventionalCount = useMemo(() => {
    return cartItems.filter((i) => !i.product.isEcoFriendly && i.product.conventionalAlternativeId).length;
  }, [cartItems]);

  if (!isCartOpen) return null;

  // Free delivery threshold: ₹999
  const FREE_DELIVERY_THRESHOLD = 999;
  const progressPercent = Math.min(100, Math.round((impact.totalPrice / FREE_DELIVERY_THRESHOLD) * 100));
  const remainingForFree = Math.max(0, FREE_DELIVERY_THRESHOLD - impact.totalPrice);

  const cartTitle = (
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-2xl bg-surface-sunken text-primary border border-line-subtle flex items-center justify-center">
        <ShoppingBag className="w-4 h-4" />
      </div>
      <div>
        <h2 className="font-serif text-lg font-bold text-heading tracking-tight">{t('cart.title', 'Your Conscious Cart')}</h2>
        <div className="text-[11px] font-sans font-medium text-primary">
          {impact.totalItems} item{impact.totalItems !== 1 ? 's' : ''} • Avg Grade {impact.averageGrade}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Drawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        title={cartTitle}
        maxWidth="max-w-md"
        className="bg-surface"
      >

            {/* Free Delivery & Impact Goal Progress Bar */}
            <div className="px-5 py-3.5 bg-surface-raised border-b border-line font-sans">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-secondary">
                  {remainingForFree > 0
                    ? `Add ₹${remainingForFree} for FREE Carbon-Neutral Delivery`
                    : '🎉 FREE Carbon-Neutral Delivery Unlocked!'}
                </span>
                <span className="font-bold text-primary">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-sunken overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* "Swap My Cart" Trigger Strip */}
            {conventionalCount > 0 && (
              <div className="mx-4 mt-3 p-3.5 rounded-2xl bg-surface-accent border border-primary/20 shadow-soft-sm flex items-center justify-between gap-2 font-sans">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary shrink-0" />
                  <div className="text-xs">
                    <span className="font-semibold text-heading block">
                      {conventionalCount} conventional item{conventionalCount > 1 ? 's' : ''} found
                    </span>
                    <span className="text-[11px] text-secondary">
                      Upgrade all to zero-waste alternatives
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSwapModalOpen(true)}
                  className="px-3.5 py-1.5 min-h-[36px] rounded-xl btn-gradient-primary text-surface-raised text-xs font-sans font-medium shrink-0 transition-all shadow-soft-sm cursor-pointer"
                >
                  Swap My Cart
                </button>
              </div>
            )}

            {/* Undo notification banner if recently removed an item */}
            {lastRemovedItem && (
              <div className="mx-4 mt-2 p-2.5 rounded-xl bg-surface-sunken border border-line flex items-center justify-between text-xs font-sans">
                <span className="text-secondary truncate max-w-[200px]">
                  Removed "{lastRemovedItem.product.name}"
                </span>
                <button
                  type="button"
                  onClick={undoLastRemoval}
                  className="font-medium text-primary hover:text-heading flex items-center gap-1 cursor-pointer"
                >
                  <Undo2 className="w-3.5 h-3.5" /> Undo
                </button>
              </div>
            )}

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cartItems.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-surface-sunken text-primary mx-auto flex items-center justify-center text-3xl border border-line shadow-soft-sm">
                    🛍️
                  </div>
                  <h3 className="font-serif text-lg font-bold text-heading tracking-tight">Your bag is empty</h3>
                  <p className="text-xs font-sans text-muted max-w-xs mx-auto leading-relaxed">
                    Explore our curated zero-waste catalog and start making an everyday difference.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsCartOpen(false)}
                    className="px-6 py-2.5 min-h-[44px] rounded-2xl bg-primary text-text-inverted font-sans font-medium text-xs shadow-soft-sm hover:bg-primary-hover transition cursor-pointer"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => {
                  const product = item.product;
                  const ecoStats = calculateEcoScore(product);

                  let greenerAlternative = null;
                  if (!product.isEcoFriendly && product.conventionalAlternativeId) {
                    greenerAlternative = productMap.get(product.conventionalAlternativeId);
                  }

                  return (
                    <div
                      key={product.id}
                      className="p-4 rounded-2xl bg-surface-raised border border-line shadow-soft-sm space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-2xl p-2 rounded-2xl bg-surface-sunken border border-line-subtle shrink-0">
                            {product.icon}
                          </span>
                          <div className="min-w-0">
                            <h4 className="font-serif font-bold text-xs sm:text-sm text-heading truncate">
                              {product.name}
                            </h4>
                            <div className="text-xs font-sans font-bold text-heading mt-0.5">
                              ₹{product.price}
                            </div>
                          </div>
                        </div>
                        <EcoScoreBadge
                          score={ecoStats.score}
                          grade={ecoStats.grade}
                          size="sm"
                        />
                      </div>

                      {/* Quantity & Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-line-subtle">
                        <div className="flex items-center border border-line rounded-xl overflow-hidden bg-surface-sunken">
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, item.quantity - 1)}
                            className="px-2.5 py-1 min-h-[32px] text-xs font-sans font-medium hover:bg-surface-raised text-heading cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="px-2.5 py-1 text-xs font-sans font-bold text-heading">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, item.quantity + 1)}
                            className="px-2.5 py-1 min-h-[32px] text-xs font-sans font-medium hover:bg-surface-raised text-heading cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-sans font-bold text-heading">
                            ₹{(product.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFromCart(product.id)}
                            className="p-1.5 text-muted hover:text-danger transition min-w-[32px] min-h-[32px] flex items-center justify-center cursor-pointer"
                            title="Remove item"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Inline Swap Banner if conventional */}
                      {greenerAlternative && (
                        <div className="p-3 rounded-2xl bg-accent-subtle border border-accent/20 font-sans">
                          <div className="flex items-center justify-between text-xs font-semibold text-accent">
                            <span className="flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 text-accent" />
                              Conventional Product
                            </span>
                            <span className="text-[10px] text-accent bg-accent-subtle px-1.5 py-0.5 rounded border border-accent/20">
                              Grade {ecoStats.grade}
                            </span>
                          </div>
                          <p className="text-[11px] text-secondary mt-1">
                            Swap to <strong className="font-semibold text-heading">{greenerAlternative.name}</strong> to save{' '}
                            {Math.max(0, product.carbonKg - greenerAlternative.carbonKg).toFixed(1)}kg CO₂.
                          </p>
                          <button
                            type="button"
                            onClick={() => swapItemInCart(product.id, greenerAlternative)}
                            className="mt-2.5 w-full py-2 px-3 rounded-xl bg-primary hover:bg-primary-hover text-text-inverted font-sans font-medium text-xs flex items-center justify-center gap-1.5 shadow-soft-sm transition cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>1-Tap Swap to {greenerAlternative.name}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Checkout Summary */}
            {cartItems.length > 0 && (
              <div className="p-5 border-t border-line bg-surface-raised space-y-3 font-sans">
                {/* Live Impact Counters */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs p-3 rounded-2xl bg-primary-subtle border border-primary/20 text-heading font-medium">
                  <div>
                    🌱 <strong className="font-bold">{impact.co2Saved} kg</strong> {t('cart.co2Avoided', 'CO₂ Saved')}
                  </div>
                  <div>
                    🌊 <strong className="font-bold">{impact.plasticAvoided} g</strong> {t('cart.plasticDiverted', 'Plastic Saved')}
                  </div>
                </div>

                {/* Subtotal */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-medium text-secondary">{t('cart.subtotal', 'Total Amount')}</span>
                  <span className="font-serif text-2xl font-bold text-heading">
                    ₹{impact.totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Checkout Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    setCheckoutModalOpen(true);
                  }}
                  className="w-full py-3.5 px-6 min-h-[44px] rounded-xl btn-gradient-heading text-surface-raised font-sans font-medium text-sm flex items-center justify-center gap-2 shadow-soft-sm transition-all cursor-pointer"
                >
                  <span>{t('cart.checkout', 'Proceed to Simulated Checkout')}</span>
                  <ArrowRight className="w-4 h-4 text-emerald-300" />
                </button>
              </div>
            )}
      </Drawer>

      {/* Swap My Cart Modal */}
      <SwapMyCartModal
        isOpen={isSwapModalOpen}
        onClose={() => setIsSwapModalOpen(false)}
      />
    </>
  );
}

