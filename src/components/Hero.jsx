import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, RefreshCw, BarChart2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Safe3D from './3D/Safe3D';

const LeafyGlobe3D = React.lazy(() => import('./3D/LeafyGlobe3D'));

export default function Hero() {
  const { setIsAgentOpen, impact } = useCart();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#E8F5EE] via-[#FAF9F6] to-[#FAF9F6] pt-12 pb-16 md:pt-16 md:pb-20 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Clear Value Proposition (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-emerald-200 shadow-2xs text-[#0B3B2C] text-xs font-extrabold mx-auto lg:mx-0">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Offline-Native Sustainable E-Commerce</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0B3B2C] tracking-tight leading-[1.08]">
              Don’t Just Shop.{' '}
              <span className="text-emerald-700 block mt-1">Shop With Purpose.</span>
            </h1>

            {/* Supporting Paragraph answering why it matters */}
            <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Every item in our catalog is scored from <strong>0 to 100</strong> across 5 lifecycle pillars. 
              Our intelligent <strong>Eco Agent</strong> audits your cart and suggests cleaner, zero-waste swaps that save real kilograms of CO₂ and grams of ocean-bound plastic.
            </p>

            {/* CTAs: 1 Primary, 1 Secondary */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              {/* Primary CTA */}
              <Link
                to="/shop"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition active:scale-98 min-h-[44px]"
              >
                <span>Explore Sustainable Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Secondary CTA */}
              <button
                type="button"
                onClick={() => setIsAgentOpen(true)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-stone-50 border border-stone-200 text-[#0B3B2C] font-extrabold text-sm flex items-center justify-center gap-2 shadow-2xs transition min-h-[44px]"
              >
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Ask AI Eco Agent</span>
              </button>
            </div>

            {/* Value Highlights */}
            <div className="pt-4 grid grid-cols-3 gap-3 border-t border-stone-200/80 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="space-y-0.5">
                <div className="text-xs font-black text-emerald-800 flex items-center gap-1">
                  <BarChart2 className="w-3.5 h-3.5 text-emerald-600" /> 0-100 Score
                </div>
                <div className="text-[11px] text-stone-500">Transparent Lifecycle</div>
              </div>

              <div className="space-y-0.5">
                <div className="text-xs font-black text-emerald-800 flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-600" /> 1-Tap Swaps
                </div>
                <div className="text-[11px] text-stone-500">Cleaner Alternatives</div>
              </div>

              <div className="space-y-0.5">
                <div className="text-xs font-black text-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Offline
                </div>
                <div className="text-[11px] text-stone-500">Zero External CDNs</div>
              </div>
            </div>
          </div>

          {/* Right Column: Scroll-Linked 3D Biosphere in Safe3D (5 Cols) */}
          <div className="lg:col-span-5">
            <Safe3D
              featureName="Planetary Biosphere Visualizer"
              height="380px"
              staticFallbackImage="/images/products/kit-01.jpg"
            >
              <LeafyGlobe3D cartCo2Saved={parseFloat(impact.co2Saved) || 0} />
            </Safe3D>
          </div>
        </div>
      </div>
    </section>
  );
}
