import React, { useState, useMemo } from 'react';
import { useCart, fireGreenConfetti } from '../context/CartContext';
import { calculateEcoScore, compareProductImpact } from '../lib/ecoScore';
import { playSound } from '../lib/audio';
import {
  Sparkles,
  ArrowRight,
  Check,
  X,
  Wind,
  Ban,
  Droplets,
  RefreshCw
} from 'lucide-react';

export default function SwapMyCartModal({ isOpen, onClose }) {
  const { cartItems, allProducts, swapItemInCart, showToast } = useCart();
  const productMap = useMemo(() => new Map((allProducts || []).map((p) => [p.id, p])), [allProducts]);

  // Identify all swappable conventional items in cart
  const swappableItems = useMemo(() => {
    return cartItems
      .filter((item) => !item.product.isEcoFriendly && item.product.conventionalAlternativeId)
      .map((item) => {
        const alt = productMap.get(item.product.conventionalAlternativeId);
        if (!alt) return null;
        const comp = compareProductImpact(alt, item.product);
        const priceDiff = alt.price - item.product.price;
        return {
          cartItem: item,
          current: item.product,
          alternative: alt,
          currentScore: calculateEcoScore(item.product),
          altScore: calculateEcoScore(alt),
          comparison: comp,
          priceDiff,
          totalPriceDiff: priceDiff * item.quantity,
          totalCo2Saved: (comp.co2Saved * item.quantity).toFixed(2),
          totalPlasticSaved: (comp.plasticSaved * item.quantity).toFixed(0),
          totalWaterSaved: (comp.waterSaved * item.quantity).toFixed(0)
        };
      })
      .filter(Boolean);
  }, [cartItems, productMap]);

  // Track which swaps the user has unselected (default none unselected)
  const [unselectedSwapIds, setUnselectedSwapIds] = useState(new Set());

  const selectedSwapIds = useMemo(() => {
    return new Set(
      swappableItems
        .map((s) => s.current.id)
        .filter((id) => !unselectedSwapIds.has(id))
    );
  }, [swappableItems, unselectedSwapIds]);

  const toggleSelectSwap = (id) => {
    setUnselectedSwapIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Selected totals
  const selectedTotals = useMemo(() => {
    let co2 = 0;
    let plastic = 0;
    let water = 0;
    let priceDiff = 0;
    let count = 0;

    swappableItems.forEach((s) => {
      if (selectedSwapIds.has(s.current.id)) {
        co2 += parseFloat(s.totalCo2Saved);
        plastic += parseFloat(s.totalPlasticSaved);
        water += parseFloat(s.totalWaterSaved);
        priceDiff += s.totalPriceDiff;
        count++;
      }
    });

    return {
      co2: co2.toFixed(2),
      plastic: plastic.toFixed(0),
      water: water.toFixed(0),
      priceDiff,
      count
    };
  }, [swappableItems, selectedSwapIds]);

  if (!isOpen) return null;

  const handleApplySelectedSwaps = () => {
    if (selectedTotals.count === 0) return;

    swappableItems.forEach((s) => {
      if (selectedSwapIds.has(s.current.id)) {
        swapItemInCart(s.current.id, s.alternative);
      }
    });

    fireGreenConfetti();
    playSound('swap');
    showToast(
      `Successfully upgraded ${selectedTotals.count} items! Saved ${selectedTotals.co2}kg CO₂.`,
      'swap'
    );
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="swap-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden text-stone-900 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-200 bg-gradient-to-r from-[#E8F5EE] to-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 id="swap-modal-title" className="text-lg font-black text-[#0B3B2C]">
                Swap My Cart to Eco
              </h2>
              <p className="text-xs text-emerald-800 font-semibold">
                Upgrade conventional products to zero-waste alternatives
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          {swappableItems.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center text-xl">
                🌱
              </div>
              <h3 className="font-extrabold text-stone-900 text-base">Your Cart is Already 100% Eco-Friendly!</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Every single item in your bag currently meets top sustainable lifecycle standards. No conventional items detected!
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-xs text-stone-600 px-1">
                <span>
                  Found <strong>{swappableItems.length}</strong> conventional item(s) that can be swapped.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedSwapIds.size === swappableItems.length) {
                      setSelectedSwapIds(new Set());
                    } else {
                      setSelectedSwapIds(new Set(swappableItems.map((s) => s.current.id)));
                    }
                  }}
                  className="font-bold text-emerald-700 hover:underline"
                >
                  {selectedSwapIds.size === swappableItems.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              {/* Proposed Swaps List */}
              <div className="space-y-3">
                {swappableItems.map((s) => {
                  const isChecked = selectedSwapIds.has(s.current.id);
                  return (
                    <div
                      key={s.current.id}
                      onClick={() => toggleSelectSwap(s.current.id)}
                      className={`p-4 rounded-2xl border transition cursor-pointer select-none ${
                        isChecked
                          ? 'border-emerald-300 bg-[#FAFDFB] shadow-xs'
                          : 'border-stone-200 bg-stone-50 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Checkbox */}
                        <div
                          className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center border transition ${
                            isChecked
                              ? 'bg-emerald-700 border-emerald-700 text-white'
                              : 'border-stone-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>

                        {/* Swap comparison */}
                        <div className="flex-1 min-w-0">
                          {/* From -> To */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <div className="flex items-center gap-2 text-xs">
                              <span className="font-bold text-stone-500 line-through truncate max-w-[140px] sm:max-w-[180px]">
                                {s.current.name}
                              </span>
                              <ArrowRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                              <span className="font-black text-emerald-800 truncate max-w-[160px] sm:max-w-[200px]">
                                {s.alternative.name}
                              </span>
                            </div>

                            <span className="text-[11px] font-bold text-stone-700 shrink-0">
                              {s.totalPriceDiff > 0
                                ? `+₹${s.totalPriceDiff}`
                                : s.totalPriceDiff < 0
                                ? `-₹${Math.abs(s.totalPriceDiff)}`
                                : 'Same price'}
                            </span>
                          </div>

                          {/* Impact metrics pill */}
                          <div className="mt-2.5 flex items-center gap-2 text-[11px] flex-wrap">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center gap-1">
                              <Wind className="w-3 h-3 text-emerald-700" />
                              Save {s.totalCo2Saved} kg CO₂
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center gap-1">
                              <Ban className="w-3 h-3 text-amber-700" />
                              Save {s.totalPlasticSaved} g plastic
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-900 font-bold flex items-center gap-1">
                              <Droplets className="w-3 h-3 text-sky-700" />
                              Save {s.totalWaterSaved} L water
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer Impact Summary */}
        {swappableItems.length > 0 && (
          <div className="p-6 border-t border-stone-200 bg-stone-50 space-y-4">
            <div className="p-3.5 rounded-2xl bg-white border border-stone-200/90 flex items-center justify-around text-center text-xs">
              <div>
                <div className="text-[10px] font-bold uppercase text-stone-400">Total CO₂ Saved</div>
                <div className="text-base font-black text-emerald-700">
                  {selectedTotals.co2} kg
                </div>
              </div>
              <div className="h-8 w-px bg-stone-200" />
              <div>
                <div className="text-[10px] font-bold uppercase text-stone-400">Plastic Diverted</div>
                <div className="text-base font-black text-amber-600">
                  {selectedTotals.plastic} g
                </div>
              </div>
              <div className="h-8 w-px bg-stone-200" />
              <div>
                <div className="text-[10px] font-bold uppercase text-stone-400">Water Conserved</div>
                <div className="text-base font-black text-sky-600">
                  {selectedTotals.water} L
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-5 rounded-2xl border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-bold transition min-h-[44px]"
              >
                Keep Current
              </button>

              <button
                type="button"
                onClick={handleApplySelectedSwaps}
                disabled={selectedTotals.count === 0}
                className="flex-1 py-3 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white text-xs font-black flex items-center justify-center gap-2 shadow-sm transition min-h-[44px]"
              >
                <RefreshCw className="w-4 h-4" />
                <span>
                  Accept {selectedTotals.count} Eco Swap(s)
                  {selectedTotals.priceDiff !== 0 && ` (${selectedTotals.priceDiff > 0 ? `+₹${selectedTotals.priceDiff}` : `-₹${Math.abs(selectedTotals.priceDiff)}`})`}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
