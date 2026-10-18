import React, { useState, useMemo } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, RefreshCw, AlertTriangle, Sparkles, Undo2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { calculateEcoScore } from '../lib/ecoScore';
import EcoScoreBadge from './EcoScoreBadge';
import SwapMyCartModal from './SwapMyCartModal';

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

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart Drawer"
        className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs animate-fade-in"
      >
        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-[#faf9f6] border-l border-stone-200 shadow-2xl flex flex-col text-stone-900">
            {/* Header */}
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-extrabold text-base text-[#0B3B2C]">Your Conscious Cart</h2>
                  <div className="text-[11px] font-bold text-emerald-700">
                    {impact.totalItems} item{impact.totalItems !== 1 ? 's' : ''} • Avg Grade {impact.averageGrade}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Delivery & Impact Goal Progress Bar (Feature 14) */}
            <div className="px-5 py-3 bg-white border-b border-stone-100">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-stone-700">
                  {remainingForFree > 0
                    ? `Add ₹${remainingForFree} for FREE Carbon-Neutral Delivery`
                    : '🎉 FREE Carbon-Neutral Delivery Unlocked!'}
                </span>
                <span className="font-extrabold text-emerald-700">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* "Swap My Cart" Trigger Strip (Feature 19) */}
            {conventionalCount > 0 && (
              <div className="mx-4 mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-emerald-50 border border-emerald-300 shadow-xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold text-stone-900 block">
                      {conventionalCount} conventional item{conventionalCount > 1 ? 's' : ''} found
                    </span>
                    <span className="text-[11px] text-stone-600">
                      Upgrade all to zero-waste alternatives
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSwapModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shrink-0 transition shadow-2xs"
                >
                  Swap My Cart
                </button>
              </div>
            )}

            {/* Undo notification banner if recently removed an item */}
            {lastRemovedItem && (
              <div className="mx-4 mt-2 p-2.5 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-between text-xs">
                <span className="text-stone-600 truncate max-w-[200px]">
                  Removed "{lastRemovedItem.product.name}"
                </span>
                <button
                  type="button"
                  onClick={undoLastRemoval}
                  className="font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                >
                  <Undo2 className="w-3.5 h-3.5" /> Undo
                </button>
              </div>
            )}

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cartItems.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center text-3xl">
                    🛍️
                  </div>
                  <h3 className="font-black text-base text-stone-900">Your bag is empty</h3>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto">
                    Explore our curated zero-waste catalog and start making an everyday difference.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsCartOpen(false)}
                    className="px-5 py-2.5 rounded-2xl bg-emerald-700 text-white font-bold text-xs shadow-xs hover:bg-emerald-800 transition"
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
                      className="p-3.5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-2xl p-2 rounded-xl bg-stone-50 border border-stone-100 shrink-0">
                            {product.icon}
                          </span>
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs text-stone-900 truncate">
                              {product.name}
                            </h4>
                            <div className="text-xs font-black text-emerald-800 mt-0.5">
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
                      <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                        <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, item.quantity - 1)}
                            className="px-2.5 py-1 text-xs font-bold hover:bg-stone-200 text-stone-700"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="px-2.5 py-1 text-xs font-black text-stone-900">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, item.quantity + 1)}
                            className="px-2.5 py-1 text-xs font-bold hover:bg-stone-200 text-stone-700"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black text-stone-900">
                            ₹{(product.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFromCart(product.id)}
                            className="p-1 text-stone-400 hover:text-rose-600 transition"
                            title="Remove item"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Inline Swap Banner if conventional */}
                      {greenerAlternative && (
                        <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80">
                          <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                            <span className="flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                              Conventional Product
                            </span>
                            <span className="text-[10px] text-amber-700">
                              Grade {ecoStats.grade}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-600 mt-1">
                            Swap to <strong>{greenerAlternative.name}</strong> to save{' '}
                            {Math.max(0, product.carbonKg - greenerAlternative.carbonKg).toFixed(1)}kg CO₂.
                          </p>
                          <button
                            type="button"
                            onClick={() => swapItemInCart(product.id, greenerAlternative)}
                            className="mt-2 w-full py-1.5 px-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-2xs transition"
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
              <div className="p-5 border-t border-stone-200 bg-white space-y-3">
                {/* Live Impact Counters */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 font-semibold">
                  <div>
                    🌱 <strong>{impact.co2Saved} kg</strong> CO₂ Saved
                  </div>
                  <div>
                    🌊 <strong>{impact.plasticAvoided} g</strong> Plastic Saved
                  </div>
                </div>

                {/* Subtotal */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-bold text-stone-600">Total Amount</span>
                  <span className="text-xl font-black text-stone-900">
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
                  className="w-full py-3.5 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm flex items-center justify-center gap-2 shadow-sm transition active:scale-98 min-h-[44px]"
                >
                  <span>Proceed to Simulated Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Swap My Cart Modal (Feature 19) */}
      <SwapMyCartModal
        isOpen={isSwapModalOpen}
        onClose={() => setIsSwapModalOpen(false)}
      />
    </>
  );
}
