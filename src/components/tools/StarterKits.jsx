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
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Curated Bundles
            </span>
            <span className="text-xs text-stone-500 font-semibold">1-Click Sustainable Kits</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0B3B2C] mt-1">
            Zero-Waste Starter Kits
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
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
              className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {kit.badge}
                  </span>
                  <div className="text-right">
                    <span className="text-xs text-stone-400 line-through mr-1.5 font-semibold">₹{kit.originalPrice}</span>
                    <span className="text-lg font-black text-stone-900">₹{kit.bundlePrice}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-black text-[#0B3B2C] leading-snug">
                    {kit.name}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {kit.tagline}
                  </p>
                </div>

                {/* Combined Impact Pill */}
                <div className="p-3 rounded-2xl bg-[#E8F5EE] border border-emerald-200/80 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <div className="text-[10px] font-bold text-emerald-700">CO₂ Avoided</div>
                    <div className="font-black text-emerald-900">{kit.co2Saved}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-amber-700">Plastic Saved</div>
                    <div className="font-black text-amber-900">{kit.plasticAvoided}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-sky-700">Water Saved</div>
                    <div className="font-black text-sky-900">{kit.waterSaved}</div>
                  </div>
                </div>

                {/* Items in this bundle */}
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400 block">
                    Included Items:
                  </span>
                  <div className="space-y-1.5">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 text-xs text-stone-700">
                        <span className="text-base">{item.icon}</span>
                        <span className="font-semibold truncate">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 1-Click Add-All Button */}
              <button
                type="button"
                onClick={() => handleAddBundle(kit)}
                className="w-full py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center justify-center gap-2 transition active:scale-98 shadow-2xs min-h-[44px]"
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
