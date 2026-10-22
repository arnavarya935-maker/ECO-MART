import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart, fireGreenConfetti } from '../../context/CartContext';
import productsData from '../../data/products.json';
import { playSound } from '../../lib/audio';

const KITS = [
  {
    id: 'kit-kitchen',
    name: 'Plastic-Free Kitchen Starter Kit',
    tagline: 'Eliminate single-use cling wraps, plastic cutlery, and synthetic dish sponges.',
    productIds: ['kit-01', 'kit-03', 'kit-04'],
    bundlePrice: 949,
    originalPrice: 1048,
    co2Saved: '4.8 kg',
    plasticAvoided: '240 g',
    waterSaved: '180 L',
    badge: 'Best-Seller Bundle'
  },
  {
    id: 'kit-bathroom',
    name: 'Zero-Waste Bathroom Essentials',
    tagline: 'Replace disposable nylon toothbrushes, shampoo bottles, and plastic packaging.',
    productIds: ['care-01', 'care-03', 'care-04'],
    bundlePrice: 749,
    originalPrice: 839,
    co2Saved: '3.9 kg',
    plasticAvoided: '195 g',
    waterSaved: '140 L',
    badge: 'Zero-Plastic'
  },
  {
    id: 'kit-student',
    name: 'Eco Student & Desk Set',
    tagline: 'Plantable seed paper notebook, recycled pencils, and sustainable everyday carry.',
    productIds: ['stat-01', 'stat-02', 'stat-03'],
    bundlePrice: 620,
    originalPrice: 698,
    co2Saved: '3.1 kg',
    plasticAvoided: '160 g',
    waterSaved: '110 L',
    badge: 'Popular for Gifting'
  }
];

export default function StarterKits() {
  const { addToCart, showToast } = useCart();
  const productMap = React.useMemo(() => new Map(productsData.map((p) => [p.id, p])), []);

  const handleAddBundle = (kit) => {
    let addedCount = 0;
    kit.productIds.forEach((pid) => {
      const prod = productMap.get(pid);
      if (prod) {
        addToCart(prod, 1);
        addedCount++;
      }
    });

    fireGreenConfetti();
    playSound('success');
    showToast(`Added ${addedCount} items from "${kit.name}" to cart!`, 'success');
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
              Curated Bundles
            </span>
            <span className="text-xs text-muted font-medium">1-Click Sustainable Kits</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-heading mt-1">
            Zero-Waste Starter Kits
          </h2>
          <p className="text-xs sm:text-sm text-secondary mt-0.5">
            Pre-assembled conscious bundles designed to switch entire rooms from virgin plastic to regenerative materials.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {KITS.map((kit) => {
          const items = kit.productIds.map((id) => productMap.get(id)).filter(Boolean);

          return (
            <div
              key={kit.id}
              className="p-6 rounded-3xl bg-surface border border-line shadow-soft-sm hover:shadow-soft-md transition-shadow flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {kit.badge}
                  </span>
                  <div className="text-right">
                    <span className="text-xs text-muted line-through mr-1.5 font-medium">₹{kit.originalPrice}</span>
                    <span className="text-lg font-bold text-heading">₹{kit.bundlePrice}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-serif font-bold text-heading leading-snug">
                    {kit.name}
                  </h3>
                  <p className="text-xs text-secondary mt-1 leading-relaxed">
                    {kit.tagline}
                  </p>
                </div>

                {/* Combined Impact Pill */}
                <div className="p-3 rounded-2xl bg-surface-sunken border border-line grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <div className="text-[10px] font-semibold text-primary">CO₂ Avoided</div>
                    <div className="font-bold text-heading">{kit.co2Saved}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-warning">Plastic Saved</div>
                    <div className="font-bold text-heading">{kit.plasticAvoided}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-accent">Water Saved</div>
                    <div className="font-bold text-heading">{kit.waterSaved}</div>
                  </div>
                </div>

                {/* Items in this bundle */}
                <div className="space-y-2 pt-2 border-t border-line">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted block">
                    Included Items:
                  </span>
                  <div className="space-y-1.5">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 text-xs text-secondary">
                        <span className="text-base">{item.icon}</span>
                        <span className="font-medium truncate">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 1-Click Add-All Button */}
              <button
                type="button"
                onClick={() => handleAddBundle(kit)}
                className="w-full py-3 px-4 rounded-full bg-primary hover:bg-primary-hover text-primary-contrast font-medium text-xs flex items-center justify-center gap-2 transition active:scale-98 shadow-soft-sm min-h-[44px] cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Entire Kit to Cart • ₹{kit.bundlePrice}</span>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
