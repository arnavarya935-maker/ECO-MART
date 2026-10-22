import React, { useState, useMemo } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart, fireGreenConfetti } from '../../context/CartContext';
import productsData from '../../data/products.json';
import { playSound } from '../../lib/audio';

export default function BudgetBasketBuilder() {
  const { addToCart, showToast } = useCart();
  const [budget, setBudget] = useState(1000);
  const [targetCategory, setTargetCategory] = useState('All');

  // Filter eco-friendly items
  const eligibleProducts = useMemo(() => {
    return productsData.filter((p) => {
      if (!p.isEcoFriendly) return false;
      if (targetCategory === 'All') return true;
      if (targetCategory === 'Kitchen' && p.category === 'Kitchen') return true;
      if (targetCategory === 'Personal Care' && p.category === 'Personal Care') return true;
      if (targetCategory === 'Stationery' && p.category === 'Stationery') return true;
      return false;
    });
  }, [targetCategory]);

  // Knapsack-like optimization: sort by impact per rupee (carbonKg / price) descending
  const optimizedBasket = useMemo(() => {
    const sorted = [...eligibleProducts].sort((a, b) => {
      const impactRatioA = (a.carbonKg * 2 + (a.plasticGrams || 0) * 0.05) / a.price;
      const impactRatioB = (b.carbonKg * 2 + (b.plasticGrams || 0) * 0.05) / b.price;
      return impactRatioB - impactRatioA;
    });

    let currentCost = 0;
    const basket = [];

    for (const item of sorted) {
      if (currentCost + item.price <= budget) {
        basket.push(item);
        currentCost += item.price;
      }
    }

    const totalCo2 = basket.reduce((acc, p) => acc + (p.carbonKg || 0.4), 0).toFixed(2);
    const totalPlastic = basket.reduce((acc, p) => acc + (p.plasticGrams || 60), 0);
    const totalWater = basket.reduce((acc, p) => acc + (p.waterLitres || 25), 0);

    return {
      items: basket,
      totalCost: currentCost,
      remainingBudget: budget - currentCost,
      totalCo2,
      totalPlastic,
      totalWater
    };
  }, [eligibleProducts, budget]);

  const handleAddAll = () => {
    if (optimizedBasket.items.length === 0) return;
    optimizedBasket.items.forEach((p) => addToCart(p, 1));
    fireGreenConfetti();
    playSound('success');
    showToast(
      `Added ${optimizedBasket.items.length} items from Budget Basket to cart! Total: ₹${optimizedBasket.totalCost}`,
      'success'
    );
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-line shadow-soft-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
              Automated Basket Optimizer
            </span>
            <span className="text-xs text-muted font-medium">Feature 22</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-heading mt-1">
            Budget Basket Builder
          </h3>
          <p className="text-xs sm:text-sm text-secondary mt-0.5">
            Set your budget and target area; our algorithm selects the items delivering maximum environmental impact per rupee.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddAll}
          disabled={optimizedBasket.items.length === 0}
          className="px-5 py-3 rounded-full bg-primary hover:bg-primary-hover disabled:opacity-40 text-primary-contrast text-xs font-medium flex items-center justify-center gap-2 shadow-soft-sm transition shrink-0 min-h-[44px] cursor-pointer focus-visible:outline-2 focus-visible:outline-focus"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Add Basket to Cart • ₹{optimizedBasket.totalCost}</span>
        </button>
      </div>

      {/* Controls: Budget Slider and Goal Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 rounded-2xl bg-surface-sunken border border-line">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-heading">
            <span>Your Target Budget</span>
            <span className="text-primary text-sm font-bold">₹{budget}</span>
          </div>
          <input
            type="range"
            min="300"
            max="3000"
            step="50"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer min-h-[44px]"
          />
          <div className="flex justify-between text-[10px] text-muted font-medium">
            <span>₹300</span>
            <span>₹1,500</span>
            <span>₹3,000</span>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold text-heading block">Focus Category</span>
          <div className="grid grid-cols-4 gap-1.5">
            {['All', 'Kitchen', 'Personal Care', 'Stationery'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setTargetCategory(cat)}
                className={`py-2 px-2 text-[11px] font-medium rounded-full border transition cursor-pointer min-h-[44px] focus-visible:outline-2 focus-visible:outline-focus ${
                  targetCategory === cat
                    ? 'bg-primary text-primary-contrast border-primary shadow-soft-xs'
                    : 'bg-surface hover:bg-surface-sunken text-secondary border-line'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Optimized Basket Summary */}
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-surface-sunken border border-line grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">Items Selected</div>
            <div className="text-base font-bold text-heading mt-0.5">{optimizedBasket.items.length} items</div>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">Total Spent</div>
            <div className="text-base font-bold text-primary mt-0.5">₹{optimizedBasket.totalCost}</div>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">CO₂ Avoidance</div>
            <div className="text-base font-bold text-primary mt-0.5">{optimizedBasket.totalCo2} kg</div>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">Plastic Diverted</div>
            <div className="text-base font-bold text-accent mt-0.5">{optimizedBasket.totalPlastic} g</div>
          </div>
        </div>

        {/* Selected Items List */}
        <div className="divide-y divide-line border border-line rounded-2xl overflow-hidden bg-surface shadow-soft-xs">
          {optimizedBasket.items.map((item) => (
            <div key={item.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-surface-sunken transition">
              <div className="flex items-center gap-3">
                <span className="text-xl p-2 rounded-xl bg-surface-sunken border border-line">{item.icon}</span>
                <div>
                  <span className="font-semibold text-heading block">{item.name}</span>
                  <span className="text-[11px] text-muted">{item.category} • {item.material}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-heading text-sm">₹{item.price}</span>
                <span className="text-[10px] text-primary block font-semibold">Grade A</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
