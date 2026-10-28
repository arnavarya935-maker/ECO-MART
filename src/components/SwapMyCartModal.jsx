import React, { useState, useMemo } from 'react';
import { useCart, fireGreenConfetti } from '../context/CartContext';
import { calculateEcoScore, compareProductImpact } from '../lib/ecoScore';
import { playSound } from '../lib/audio';
import {
  Sparkles,
  ArrowRight,
  Check,
  Wind,
  Ban,
  Droplets,
  RefreshCw
} from 'lucide-react';
import { Modal } from './ui/Modal';

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Swap Cart to Eco"
      maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        {/* Header subtitle */}
        <div className="flex items-center gap-2 pb-2 border-b border-line text-xs text-secondary font-medium">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>Upgrade conventional products to sustainable alternatives</span>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          {swappableItems.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 text-primary mx-auto flex items-center justify-center text-2xl shadow-soft-xs">
                🌱
              </div>
              <h3 className="font-serif font-bold text-heading text-lg">All Items in Cart are Eco Choices</h3>
              <p className="text-xs text-muted max-w-sm mx-auto leading-relaxed">
                Every single item in your bag is an eco-friendly choice based on our data. No conventional items detected.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-xs text-secondary px-1">
                <span>
                  Found <strong className="text-heading font-bold">{swappableItems.length}</strong> conventional item{swappableItems.length === 1 ? '' : 's'} to upgrade.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedSwapIds.size === swappableItems.length) {
                      setUnselectedSwapIds(new Set(swappableItems.map((s) => s.current.id)));
                    } else {
                      setUnselectedSwapIds(new Set());
                    }
                  }}
                  className="font-bold text-primary hover:text-primary-hover transition-colors underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-focus"
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
                      className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                        isChecked
                          ? 'border-primary/40 bg-primary/5 shadow-soft-xs'
                          : 'border-line bg-surface-sunken/40 opacity-60 hover:opacity-80'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        {/* Checkbox */}
                        <div
                          className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center border transition-colors ${
                            isChecked
                              ? 'bg-primary border-primary text-primary-contrast'
                              : 'border-line bg-surface'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>

                        {/* Swap comparison */}
                        <div className="flex-1 min-w-0">
                          {/* From -> To */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <div className="flex items-center gap-2 text-xs">
                              <span className="font-medium text-muted line-through truncate max-w-[140px] sm:max-w-[180px]">
                                {s.current.name}
                              </span>
                              <ArrowRight className="w-3.5 h-3.5 text-muted shrink-0" />
                              <span className="font-bold text-heading truncate max-w-[160px] sm:max-w-[200px]">
                                {s.alternative.name}
                              </span>
                            </div>

                            <span className="text-[11px] font-semibold text-secondary shrink-0">
                              {s.totalPriceDiff > 0
                                ? `+₹${s.totalPriceDiff}`
                                : s.totalPriceDiff < 0
                                ? `-₹${Math.abs(s.totalPriceDiff)}`
                                : 'Same price'}
                            </span>
                          </div>

                          {/* Impact metrics pill */}
                          <div className="mt-2.5 flex items-center gap-2 text-[11px] flex-wrap">
                            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold flex items-center gap-1">
                              <Wind className="w-3 h-3 text-primary" />
                              Save {s.totalCo2Saved} kg CO₂
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/20 font-semibold flex items-center gap-1">
                              <Ban className="w-3 h-3 text-warning" />
                              Save {s.totalPlasticSaved} g plastic
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20 font-semibold flex items-center gap-1">
                              <Droplets className="w-3 h-3 text-secondary" />
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
          <div className="p-6 border-t border-line bg-surface-sunken space-y-4">
            <div className="p-4 rounded-2xl bg-surface border border-line flex items-center justify-around text-center text-xs shadow-soft-xs">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted">CO₂ Saved</div>
                <div className="text-base font-serif font-bold text-primary mt-0.5">
                  {selectedTotals.co2} kg
                </div>
              </div>
              <div className="h-8 w-px bg-line" />
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted">Plastic Diverted</div>
                <div className="text-base font-serif font-bold text-warning mt-0.5">
                  {selectedTotals.plastic} g
                </div>
              </div>
              <div className="h-8 w-px bg-line" />
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted">Water Conserved</div>
                <div className="text-base font-serif font-bold text-secondary mt-0.5">
                  {selectedTotals.water} L
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-5 rounded-2xl border border-line bg-surface hover:bg-surface-sunken text-secondary text-xs font-semibold transition-colors min-h-[44px] focus-visible:outline-2 focus-visible:outline-focus"
              >
                Keep Current
              </button>

              <button
                type="button"
                onClick={handleApplySelectedSwaps}
                disabled={selectedTotals.count === 0}
                className="flex-1 py-3 px-6 rounded-2xl bg-primary hover:bg-primary-hover disabled:opacity-40 text-primary-contrast text-xs font-bold flex items-center justify-center gap-2 shadow-soft-sm hover:shadow-soft-md transition-all min-h-[44px] focus-visible:outline-2 focus-visible:outline-focus"
              >
                <RefreshCw className="w-4 h-4" />
                <span>
                  Accept {selectedTotals.count} Eco Swap{selectedTotals.count === 1 ? '' : 's'}
                  {selectedTotals.priceDiff !== 0 && ` (${selectedTotals.priceDiff > 0 ? `+₹${selectedTotals.priceDiff}` : `-₹${Math.abs(selectedTotals.priceDiff)}`})`}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
