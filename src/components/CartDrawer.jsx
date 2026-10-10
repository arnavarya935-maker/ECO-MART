import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, RefreshCw, AlertTriangle, Sparkles, Wind, Ban } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { calculateEcoScore, compareProductImpact } from '../lib/ecoScore';
import EcoScoreBadge from './EcoScoreBadge';

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    updateQuantity,
    removeFromCart,
    swapItemInCart,
    clearCart,
    impact,
    allProducts,
    setCheckoutModalOpen,
    setIsAgentOpen,
    appliedCoupon,
    applyCouponCode,
    removeCoupon
  } = useCart();

  const [pincode, setPincode] = useState('560034');
  const [estimatedDays, setEstimatedDays] = useState(null);
  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const productMap = new Map((allProducts || []).map((p) => [p.id, p]));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col text-stone-800 dark:text-stone-100">
          {/* Header */}
          <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-white dark:bg-stone-850">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              <h2 className="font-extrabold text-lg">Your Conscious Cart</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                {impact.totalItems} items
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-800 mx-auto flex items-center justify-center text-3xl">
                  🛒
                </div>
                <h3 className="font-bold text-lg text-stone-800 dark:text-stone-200">
                  Your cart is empty
                </h3>
                <p className="text-sm text-stone-500 max-w-xs mx-auto">
                  Browse our catalog of zero-waste kitchen, personal care, and home essentials.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs shadow-sm"
                >
                  Start Conscious Shopping
                </button>
              </div>
            ) : (
              <>
                {/* Live Cart Score Pill */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-between shadow-xs">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Average Cart Score
                    </div>
                    <div className="text-base font-extrabold text-stone-900 dark:text-stone-100">
                      Grade {impact.averageGrade} • {impact.averageEcoScore}/100
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsAgentOpen(true);
                    }}
                    className="flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Agent Audit</span>
                  </button>
                </div>

                {/* Items */}
                {cartItems.map((item) => {
                  const product = item.product;
                  const ecoStats = calculateEcoScore(product);

                  // Check if conventional with swap option
                  let greenerAlternative = null;
                  if (!product.isEcoFriendly && product.conventionalAlternativeId) {
                    greenerAlternative = productMap.get(product.conventionalAlternativeId);
                  }

                  return (
                    <div
                      key={product.id}
                      className="p-4 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/80 shadow-xs space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl p-2 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-100 dark:border-stone-700">
                            {product.icon}
                          </span>
                          <div>
                            <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 line-clamp-1">
                              {product.name}
                            </h4>
                            <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                              ₹{product.price}
                            </div>
                          </div>
                        </div>
                        <EcoScoreBadge scoreData={ecoStats} product={product} size="sm" showPopoverButton={false} />
                      </div>

                      {/* Quantity & Remove */}
                      <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-700/60">
                        <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-lg overflow-hidden bg-stone-50 dark:bg-stone-850">
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, item.quantity - 1)}
                            className="px-2.5 py-0.5 text-xs font-bold hover:bg-stone-200 dark:hover:bg-stone-700"
                          >
                            -
                          </button>
                          <span className="px-2.5 py-0.5 text-xs font-semibold">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, item.quantity + 1)}
                            className="px-2.5 py-0.5 text-xs font-bold hover:bg-stone-200 dark:hover:bg-stone-700"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                            ₹{(product.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFromCart(product.id)}
                            className="p-1 text-stone-400 hover:text-rose-600 transition"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Inline Swap Banner if product is conventional */}
                      {greenerAlternative && (
                        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
                          <div className="flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-200">
                            <span className="flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                              Conventional Item
                            </span>
                            <span className="text-[10px] text-amber-700 dark:text-amber-300">
                              Grade {ecoStats.grade}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-1">
                            Swap to <strong>{greenerAlternative.name}</strong> to save{' '}
                            {Math.max(0, (product.carbonKg - greenerAlternative.carbonKg)).toFixed(1)}kg CO₂.
                          </p>
                          <button
                            type="button"
                            onClick={() => swapItemInCart(product.id, greenerAlternative)}
                            className="mt-2 w-full py-1 px-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs flex items-center justify-center gap-1 shadow-2xs"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>1-Tap Swap to {greenerAlternative.name}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* Footer Checkout Bar */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 space-y-4">
              {/* Savings strip */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200 font-medium">
                <div>
                  🌱 <strong>{impact.co2Saved} kg</strong> CO₂ Saved
                </div>
                <div>
                  🌊 <strong>{impact.plasticAvoided} g</strong> Plastic Avoided
                </div>
              </div>

              {/* Pincode Delivery Estimator & Coupon strip */}
              <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
                {/* Pincode Estimator */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength="6"
                    placeholder="Enter PIN (e.g. 560034)"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (pincode.length === 6) {
                        setEstimatedDays(pincode.startsWith('5') ? '1-2 Days' : '2-3 Days');
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-stone-200 dark:bg-stone-750 text-stone-800 dark:text-stone-200 font-bold"
                  >
                    Estimate
                  </button>
                </div>
                {estimatedDays && (
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    ⚡ EV Delivery in {estimatedDays} to PIN {pincode} (Free)
                  </div>
                )}

                {/* Coupon Code Input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Coupon code (e.g. GREEN10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs uppercase focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (applyCouponCode) applyCouponCode(couponInput);
                      setCouponInput('');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                  >
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <div className="flex items-center justify-between text-[11px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 p-1.5 rounded-lg border border-emerald-300/40">
                    <span>✓ {appliedCoupon.label}</span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-stone-400 hover:text-rose-500 underline ml-2"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <div className="text-xs text-stone-400">Total Payable</div>
                  <div className="text-2xl font-black text-stone-900 dark:text-stone-100">
                    ₹{appliedCoupon ? Math.round(impact.totalPrice * (1 - appliedCoupon.percent / 100)).toLocaleString('en-IN') : impact.totalPrice.toLocaleString('en-IN')}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    setCheckoutModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md active:scale-95 transition-all"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
