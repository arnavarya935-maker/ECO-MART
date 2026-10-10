import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Leaf, RefreshCw, CheckCircle2, Globe2, TrendingUp, Users, Droplets } from 'lucide-react';
import { useCart } from '../context/CartContext';
import LeafyGlobe3D from './3D/LeafyGlobe3D';

const TYPEWRITER_HEADLINES = [
  {
    prefix: 'Turn ordinary shopping into',
    highlight: 'responsible, sustainable',
    suffix: 'living.'
  },
  {
    prefix: 'Empower verified artisan hubs with',
    highlight: 'zero plastic waste & low CO₂',
    suffix: 'choices.'
  },
  {
    prefix: 'Audit your everyday items with our',
    highlight: 'transparent 0-100 Eco-Score',
    suffix: 'intelligence.'
  }
];

export default function Hero({ onExploreClick }) {
  const { setIsAgentOpen, setSelectedProduct, allProducts } = useCart();
  const [heroView, setHeroView] = useState('3d'); // '3d' | 'swap'
  const [headlineIndex, setHeadlineIndex] = useState(0);

  // Cycle hero headlines every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % TYPEWRITER_HEADLINES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Find sample bamboo item for interactive showcase
  const sampleProduct = (allProducts || []).find((p) => p.id === 'kit-01');
  const currentHeadline = TYPEWRITER_HEADLINES[headlineIndex];

  return (
    <section className="relative overflow-hidden py-10 md:py-16 bg-gradient-to-b from-[#E8F5EE] via-[#F7FAF8] to-white dark:from-[#06110D] dark:via-[#091812] dark:to-[#0D1F18] border-b border-stone-200/80 dark:border-stone-800">
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-400/15 dark:bg-emerald-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-teal-300/15 dark:bg-teal-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Value Proposition & Typewriter */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 dark:bg-emerald-950/80 text-[#0B3B2C] dark:text-emerald-200 text-xs font-black border border-emerald-300/50 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>THEME: "DON'T JUST SHOP. SHOP WITH PURPOSE."</span>
            </div>

            {/* Dynamic Cycling Headline */}
            <div className="min-h-[140px] sm:min-h-[160px] flex items-center">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0B3B2C] dark:text-stone-100 tracking-tight leading-[1.08] transition-all duration-500">
                {currentHeadline.prefix}{' '}
                <span className="text-emerald-600 dark:text-emerald-400 underline decoration-emerald-400/60 decoration-wavy decoration-2">
                  {currentHeadline.highlight}
                </span>{' '}
                {currentHeadline.suffix}
              </h1>
            </div>

            <p className="text-base sm:text-lg text-stone-700 dark:text-stone-300 max-w-xl leading-relaxed font-medium">
              Every item has a transparent 0-100 Eco-Score. Our built-in Eco Agent audits your cart,
              finds high-footprint items, and recommends greener swaps with exact CO₂ and plastic savings.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onExploreClick}
                className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-lg shadow-emerald-800/20 hover:shadow-xl transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <span>Browse Conscious Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsAgentOpen(true)}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-[#0D1F18] hover:bg-emerald-50/50 dark:hover:bg-[#122A20] text-[#0B3B2C] dark:text-stone-100 font-extrabold text-sm border border-stone-300 dark:border-stone-700 shadow-sm transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Chat with Eco Agent</span>
              </button>
            </div>

            {/* Live Community Impact Ticker */}
            <div className="pt-4 border-t border-emerald-600/15 dark:border-stone-800">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#0B3B2C] dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>Live Community Footprint Ticker (Today)</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div className="p-2.5 rounded-xl bg-white/90 dark:bg-[#0D1F18]/90 border border-emerald-500/20 shadow-2xs">
                  <div className="text-xs font-black text-[#0B3B2C] dark:text-emerald-300">
                    🌍 14,820 kg
                  </div>
                  <div className="text-[10px] text-stone-600 dark:text-stone-400 font-medium">CO₂ Diverted</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/90 dark:bg-[#0D1F18]/90 border border-emerald-500/20 shadow-2xs">
                  <div className="text-xs font-black text-teal-700 dark:text-teal-300">
                    🚯 89,400 pcs
                  </div>
                  <div className="text-[10px] text-stone-600 dark:text-stone-400 font-medium">Plastics Replaced</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/90 dark:bg-[#0D1F18]/90 border border-emerald-500/20 shadow-2xs col-span-2 sm:col-span-1">
                  <div className="text-xs font-black text-amber-700 dark:text-amber-300">
                    💚 4,210
                  </div>
                  <div className="text-[10px] text-stone-600 dark:text-stone-400 font-medium">Indian Artisans Supported</div>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 border-t border-emerald-500/15 dark:border-stone-800 grid grid-cols-3 gap-3 text-stone-600 dark:text-stone-400 text-xs">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold">40+ Audited Items</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold">100% Offline Capable</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold">Transparent 0-100 Formula</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Biosphere Globe & Swap Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0D1F18] border border-stone-200 dark:border-emerald-800/50 shadow-2xl space-y-4">
              {/* Header with View Tabs */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-100 dark:bg-stone-800">
                  <button
                    type="button"
                    onClick={() => setHeroView('3d')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      heroView === '3d'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                    }`}
                  >
                    <Globe2 className="w-3.5 h-3.5" />
                    <span>3D Planet Globe</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroView('swap')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      heroView === 'swap'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                    }`}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Live Swap Demo</span>
                  </button>
                </div>

                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {heroView === '3d' ? 'Interactive 3D' : 'Live Logic'}
                </span>
              </div>

              {/* 3D GLOBE VIEW */}
              {heroView === '3d' ? (
                <div className="space-y-3">
                  <LeafyGlobe3D />
                  <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-center">
                    <div className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                      🌍 Procedural 3D Earth Biosphere
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-0.5">
                      Drag to rotate continents & orbit floating eco-crystals. Built with Three.js primitives.
                    </p>
                  </div>
                </div>
              ) : (
                /* SWAP DEMO VIEW */
                <div className="space-y-4">
                  {/* Conventional Card (Before) */}
                  <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between opacity-80">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🍴</span>
                      <div>
                        <div className="text-xs font-bold text-stone-800 dark:text-stone-200 line-through">
                          Single-Use Plastic Cutlery (50 pcs)
                        </div>
                        <div className="text-[11px] text-rose-700 dark:text-rose-400 font-medium">
                          Grade E • 145g Plastic • 2.45kg CO₂
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-200">
                      Grade E
                    </span>
                  </div>

                  {/* Swap Arrow Indicator */}
                  <div className="flex items-center justify-center -my-1 text-emerald-700 dark:text-emerald-400">
                    <span className="text-xs font-bold bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Agent Proposes Greener Swap</span>
                    </span>
                  </div>

                  {/* Greener Product (After) */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🎋</span>
                      <div>
                        <div className="text-xs font-extrabold text-stone-900 dark:text-stone-100">
                          Organic Bamboo Cutlery Set
                        </div>
                        <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">
                          Grade A • 0g Plastic • 0.35kg CO₂
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
                      Grade A
                    </span>
                  </div>

                  {/* Tangible Savings Pill */}
                  <div className="p-3 rounded-2xl bg-stone-900 text-white text-center text-xs space-y-1">
                    <div className="text-emerald-400 font-extrabold">
                      🎉 Saves 2.1 kg CO₂ & 145g plastic packaging!
                    </div>
                    <p className="text-[11px] text-stone-400">
                      Costs ₹220 more for lifetime reusable organic bamboo.
                    </p>
                  </div>

                  {sampleProduct && (
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(sampleProduct)}
                      className="w-full py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 text-xs font-bold transition text-center"
                    >
                      Inspect Bamboo Cutlery Specifications →
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
