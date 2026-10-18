import React, { useState } from 'react';
import { Sparkles, Check, ShieldAlert, Leaf, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from './ui/Button';

const SWAP_DEMOS = [
  {
    id: 'swap-1',
    category: 'Personal Care',
    conventional: {
      name: 'Plastic Toothbrush (4-pack/yr)',
      image: '/images/products/pers-01.svg',
      material: 'Petroleum Polypropylene & Nylon',
      packaging: 'Plastic Blister Pack',
      carbonKg: 2.4,
      plasticGrams: 80,
      decomposeYears: '450+ years',
      annualCost: 320
    },
    eco: {
      productId: 'pers-01',
      name: 'Organic Bamboo Toothbrush (4-pack)',
      image: '/images/products/pers-01.webp',
      material: '100% FSC Bamboo & Castor Bristles',
      packaging: 'Recycled Kraft Paper (Zero Plastic)',
      carbonKg: 0.35,
      plasticGrams: 0,
      decomposeYears: '180 days (Compostable)',
      annualCost: 280,
      ecoScore: 94
    },
    impactSaved: {
      plastic: '80g eliminated',
      carbon: '85% lower carbon footprint',
      microplastics: '0 microplastics shedding'
    }
  },
  {
    id: 'swap-2',
    category: 'Kitchen',
    conventional: {
      name: 'Single-Use Cling Wrap Film (3 rolls/yr)',
      image: '/images/products/kit-02.svg',
      material: 'PVC / LDPE Plastic Sheeting',
      packaging: 'Plastic Shrink Film',
      carbonKg: 4.8,
      plasticGrams: 360,
      decomposeYears: '500+ years',
      annualCost: 450
    },
    eco: {
      productId: 'kit-02',
      name: 'Pure Beeswax Food Wraps (Pack of 3)',
      image: '/images/products/kit-02.webp',
      material: 'Organic Cotton, Beeswax & Jojoba Oil',
      packaging: 'Biodegradable Cardboard Sleeve',
      carbonKg: 0.6,
      plasticGrams: 0,
      decomposeYears: '100% Backyard Compostable',
      annualCost: 399,
      ecoScore: 92
    },
    impactSaved: {
      plastic: '360g plastic saved yearly',
      carbon: '87% lower carbon emission',
      microplastics: 'Food kept fresh without chemical leaching'
    }
  },
  {
    id: 'swap-3',
    category: 'Fashion & Bags',
    conventional: {
      name: 'Synthetic Polyester Carrier Bag',
      image: '/images/products/bag-01.svg',
      material: 'Virgin Polyester (Fossil-Fuel Derived)',
      packaging: 'Single-use plastic wrap',
      carbonKg: 5.2,
      plasticGrams: 140,
      decomposeYears: '200+ years',
      annualCost: 150
    },
    eco: {
      productId: 'bag-01',
      name: 'Organic Fair-Trade Cotton Tote',
      image: '/images/products/bag-01.webp',
      material: '100% GOTS Certified Organic Canvas',
      packaging: 'Compostable Paper Twine',
      carbonKg: 0.8,
      plasticGrams: 0,
      decomposeYears: 'Natural fiber cycle',
      annualCost: 299,
      ecoScore: 96
    },
    impactSaved: {
      plastic: 'Zero synthetic fibers',
      carbon: 'Locally handwoven in Tamil Nadu',
      microplastics: 'Zero ocean microfiber pollution'
    }
  }
];

export default function LiveSwapDemo() {
  const { allProducts, addToCart, setSelectedProduct } = useCart();
  const [selectedDemoIndex, setSelectedDemoIndex] = useState(0);
  const [swappedSuccess, setSwappedSuccess] = useState(false);

  const demo = SWAP_DEMOS[selectedDemoIndex];
  const targetProduct = (allProducts || []).find((p) => p.id === demo.eco.productId);

  const handleAddEco = () => {
    if (targetProduct) {
      addToCart(targetProduct);
      setSwappedSuccess(true);
      setTimeout(() => setSwappedSuccess(false), 2500);
    }
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Interactive Swap Studio</span>
        </div>
        <h2 className="text-3xl font-black text-stone-900 dark:text-stone-100">
          Compare the Swap in Real-Time
        </h2>
        <p className="text-sm text-stone-600 dark:text-stone-400 mt-2">
          See the tangible lifecycle difference when replacing everyday petrochemical items with audited sustainable alternatives.
        </p>

        {/* Swap Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {SWAP_DEMOS.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setSelectedDemoIndex(idx);
                setSwappedSuccess(false);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                selectedDemoIndex === idx
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {item.conventional.name.split(' (')[0]} → {item.eco.name.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Side by Side Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Conventional Card (Red/Gray Alert) */}
        <div className="rounded-3xl p-6 sm:p-8 bg-rose-50/50 dark:bg-rose-950/20 border-2 border-rose-200 dark:border-rose-900/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-300 text-xs font-black">
                <ShieldAlert className="w-3.5 h-3.5" />
                CONVENTIONAL CHOICE
              </span>
              <span className="text-xs text-rose-600 dark:text-rose-400 font-bold">Grade E</span>
            </div>

            <h3 className="text-xl font-black text-stone-900 dark:text-stone-100 mb-2">
              {demo.conventional.name}
            </h3>

            <div className="space-y-4 my-6 text-xs text-stone-700 dark:text-stone-300">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/80 dark:bg-stone-850/80 border border-rose-100 dark:border-rose-900/30">
                <span className="font-semibold text-stone-500">Material</span>
                <span className="font-bold text-rose-600 dark:text-rose-400">{demo.conventional.material}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/80 dark:bg-stone-850/80 border border-rose-100 dark:border-rose-900/30">
                <span className="font-semibold text-stone-500">Packaging</span>
                <span className="font-bold text-rose-600 dark:text-rose-400">{demo.conventional.packaging}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/80 dark:bg-stone-850/80 border border-rose-100 dark:border-rose-900/30">
                <span className="font-semibold text-stone-500">Plastic Waste</span>
                <span className="font-black text-rose-600 dark:text-rose-400">{demo.conventional.plasticGrams}g plastic per unit</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/80 dark:bg-stone-850/80 border border-rose-100 dark:border-rose-900/30">
                <span className="font-semibold text-stone-500">Landfill Lifespan</span>
                <span className="font-bold text-stone-600 dark:text-stone-400">{demo.conventional.decomposeYears}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/80 dark:bg-stone-850/80 border border-rose-100 dark:border-rose-900/30">
                <span className="font-semibold text-stone-500">Carbon Footprint</span>
                <span className="font-bold text-stone-800 dark:text-stone-200">{demo.conventional.carbonKg} kg CO₂</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/60 dark:bg-stone-850/60 border border-rose-200 dark:border-rose-900/30 text-xs text-rose-700 dark:text-rose-300">
            ⚠️ <strong>Environmental Consequence:</strong> Trapped in waterways and landfills for centuries, releasing petrochemical microplastics.
          </div>
        </div>

        {/* Eco Alternative Card (Emerald/Teal Glow) */}
        <div className="rounded-3xl p-6 sm:p-8 bg-emerald-50/60 dark:bg-emerald-950/20 border-2 border-emerald-500 dark:border-emerald-700 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black shadow-xs">
                <Leaf className="w-3.5 h-3.5" />
                ECO ALTERNATIVE
              </span>
              <span className="text-xs font-black text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
                EcoScore: {demo.eco.ecoScore} (Grade A)
              </span>
            </div>

            <h3 className="text-xl font-black text-stone-900 dark:text-stone-100 mb-2">
              {demo.eco.name}
            </h3>

            <div className="space-y-4 my-6 text-xs text-stone-700 dark:text-stone-300">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-stone-850 border border-emerald-200 dark:border-emerald-800 shadow-2xs">
                <span className="font-semibold text-stone-500">Material</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-300">{demo.eco.material}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-stone-850 border border-emerald-200 dark:border-emerald-800 shadow-2xs">
                <span className="font-semibold text-stone-500">Packaging</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-300">{demo.eco.packaging}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-stone-850 border border-emerald-200 dark:border-emerald-800 shadow-2xs">
                <span className="font-semibold text-stone-500">Plastic Waste</span>
                <span className="font-black text-emerald-700 dark:text-emerald-300">0g (100% Plastic-Free)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-stone-850 border border-emerald-200 dark:border-emerald-800 shadow-2xs">
                <span className="font-semibold text-stone-500">Biodegradability</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-300">{demo.eco.decomposeYears}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-stone-850 border border-emerald-200 dark:border-emerald-800 shadow-2xs">
                <span className="font-semibold text-stone-500">Carbon Footprint</span>
                <span className="font-bold text-emerald-800 dark:text-emerald-200">{demo.eco.carbonKg} kg CO₂ ({demo.impactSaved.carbon})</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-100/70 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200">
              🌱 <strong>Net Savings:</strong> {demo.impactSaved.plastic}. {demo.impactSaved.microplastics}.
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                onClick={handleAddEco}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-xs shadow-md"
              >
                {swappedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Added Eco Swap to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Adopt this Swap</span>
                  </>
                )}
              </Button>
              {targetProduct && (
                <Button
                  variant="outline"
                  onClick={() => setSelectedProduct(targetProduct)}
                  className="px-4 py-3 rounded-2xl text-xs font-bold shrink-0"
                >
                  View Details
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
