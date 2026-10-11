import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Leaf, RefreshCw, CheckCircle2, Globe2, TrendingUp, Copy, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import LeafyGlobe3D from './3D/LeafyGlobe3D';
import Safe3D from './3D/Safe3D';

const TYPEWRITER_HEADLINES = [
  {
    prefix: 'The next-generation',
    highlight: 'carbon-intelligent',
    suffix: 'commerce engine.'
  },
  {
    prefix: 'Every transaction audited with',
    highlight: 'transparent 0-100 Eco-Scores',
    suffix: '& zero greenwash.'
  },
  {
    prefix: 'Autonomous AI co-pilot for',
    highlight: 'zero-plastic living',
    suffix: '& verified impact.'
  }
];

export default function Hero({ onExploreClick }) {
  const { setIsAgentOpen, setSelectedProduct, allProducts } = useCart();
  const [heroView, setHeroView] = useState('3d'); // '3d' | 'swap'
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % TYPEWRITER_HEADLINES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCommand = () => {
    navigator.clipboard.writeText('npx ecomart-agent audit --carbon-neutral');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleProduct = (allProducts || []).find((p) => p.id === 'kit-01');
  const currentHeadline = TYPEWRITER_HEADLINES[headlineIndex];

  return (
    <section className="relative overflow-hidden grid-bg bg-[#07080b] light:bg-[#fafafa] py-16 md:py-24 border-b border-[#33333a] light:border-zinc-200 transition-colors">
      {/* Ambient Payload Radial Glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 light:bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-purple-500/10 light:bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Payload High-Impact Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Announcement Pill Badge */}
            <div className="payload-pill rounded-full inline-flex items-center gap-2 px-3.5 py-1.5 border border-[#33333a] light:border-zinc-300 bg-[#111116] light:bg-white text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[#aaaab0] light:text-zinc-600 uppercase tracking-widest text-[11px]">
                ECO-AGENT v3.0 • AUTONOMOUS SUSTAINABILITY
              </span>
            </div>

            {/* Headline with tight letter spacing and high contrast */}
            <div className="min-h-[140px] sm:min-h-[160px] flex items-center">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-[#f4f4f2] light:text-zinc-950 tracking-tighter leading-[0.98] transition-all duration-500">
                {currentHeadline.prefix}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-white">
                  {currentHeadline.highlight}
                </span>{' '}
                {currentHeadline.suffix}
              </h1>
            </div>

            <p className="text-base sm:text-lg text-[#aaaab0] light:text-zinc-600 max-w-xl leading-relaxed font-normal">
              Every item transparently scored across materials, packaging, and lifecycle CO₂. 
              Our real-time Eco-Agent audits your cart and recommends lower-impact swaps before you checkout.
            </p>

            {/* CTAs and Code Box - Signature Payload Layout */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onExploreClick}
                className="payload-btn-primary flex items-center gap-2 px-6 py-3.5 rounded-sm font-semibold text-sm cursor-pointer shadow-sm active:scale-95"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsAgentOpen(true)}
                className="payload-btn-outline flex items-center gap-2 px-5 py-3.5 rounded-sm font-mono text-sm cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Launch Agent</span>
              </button>

              {/* Terminal Code Snippet Box */}
              <div className="payload-code rounded-sm px-3.5 py-3 flex items-center gap-2.5 text-xs text-zinc-300">
                <span className="text-emerald-400 font-bold">$</span>
                <span className="font-mono text-zinc-300 text-[11px] sm:text-xs">npx ecomart-agent audit</span>
                <button
                  type="button"
                  onClick={handleCopyCommand}
                  className="p-1 rounded bg-[#222228] hover:bg-[#33333e] text-zinc-300 hover:text-white transition cursor-pointer"
                  title="Copy command"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Technical Metrics Strip - Payload Grid Style */}
            <div className="pt-6 border-t border-[#33333a] light:border-zinc-200">
              <div className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 light:text-emerald-600 mb-3 flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Real-Time Collective Environmental Offset</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-sm bg-[#111116] light:bg-white border border-[#33333a] light:border-zinc-200">
                  <div className="text-base font-mono font-bold text-white light:text-zinc-900">
                    14,820 kg
                  </div>
                  <div className="text-[11px] text-[#aaaab0] light:text-zinc-500 font-mono">CO₂ Diverted</div>
                </div>
                <div className="p-3 rounded-sm bg-[#111116] light:bg-white border border-[#33333a] light:border-zinc-200">
                  <div className="text-base font-mono font-bold text-emerald-400 light:text-emerald-600">
                    89,400 pcs
                  </div>
                  <div className="text-[11px] text-[#aaaab0] light:text-zinc-500 font-mono">Plastic Avoided</div>
                </div>
                <div className="p-3 rounded-sm bg-[#111116] light:bg-white border border-[#33333a] light:border-zinc-200 col-span-2 sm:col-span-1">
                  <div className="text-base font-mono font-bold text-teal-400 light:text-teal-600">
                    4,210
                  </div>
                  <div className="text-[11px] text-[#aaaab0] light:text-zinc-500 font-mono">Artisans Supported</div>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 border-t border-[#33333a] light:border-zinc-200 grid grid-cols-3 gap-3 text-xs font-mono text-[#aaaab0] light:text-zinc-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>40+ Audited SKUs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Offline Native</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>0-100 Verified</span>
              </div>
            </div>
          </div>

          {/* Right Column: Payload Technical Card Frame */}
          <div className="lg:col-span-5 relative">
            <div className="p-5 rounded-md bg-[#111116] light:bg-white border border-[#33333a] light:border-zinc-300 shadow-2xl space-y-4">
              {/* Header with Technical View Tabs */}
              <div className="flex items-center justify-between pb-3 border-b border-[#33333a] light:border-zinc-200">
                <div className="flex items-center gap-1 p-1 rounded-sm bg-[#07080b] light:bg-zinc-100 border border-[#222228] light:border-zinc-200">
                  <button
                    type="button"
                    onClick={() => setHeroView('3d')}
                    className={`flex items-center gap-1 px-3 py-1 rounded-sm text-xs font-mono transition cursor-pointer ${
                      heroView === '3d'
                        ? 'bg-white light:bg-black text-black light:text-white font-semibold'
                        : 'text-[#aaaab0] light:text-zinc-600 hover:text-white'
                    }`}
                  >
                    <Globe2 className="w-3.5 h-3.5" />
                    <span>3D Planet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroView('swap')}
                    className={`flex items-center gap-1 px-3 py-1 rounded-sm text-xs font-mono transition cursor-pointer ${
                      heroView === 'swap'
                        ? 'bg-white light:bg-black text-black light:text-white font-semibold'
                        : 'text-[#aaaab0] light:text-zinc-600 hover:text-white'
                    }`}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Swap Demo</span>
                  </button>
                </div>

                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm bg-[#16161d] light:bg-zinc-100 text-emerald-400 light:text-emerald-700 border border-[#33333a] light:border-zinc-200">
                  {heroView === '3d' ? 'WEBGL RENDER' : 'COGNITIVE LOGIC'}
                </span>
              </div>

              {/* 3D GLOBE VIEW */}
              {heroView === '3d' ? (
                <div className="space-y-3">
                  <Safe3D
                    fallbackTitle="Interactive 3D Earth Biosphere"
                    fallbackSubtitle="3D planet paused under Reduce Effects or when WebGL is unavailable."
                    fallbackEmoji="🌍"
                    className="w-full"
                  >
                    <LeafyGlobe3D />
                  </Safe3D>
                  <div className="p-3 rounded-sm bg-[#07080b] light:bg-zinc-50 border border-[#222228] light:border-zinc-200 text-center">
                    <div className="text-xs font-mono text-emerald-400 light:text-emerald-700">
                      🌍 Procedural Earth Biosphere
                    </div>
                    <p className="text-[11px] text-[#aaaab0] light:text-zinc-500 mt-0.5 font-mono">
                      Rotate continents & observe floating carbon crystals in real-time.
                    </p>
                  </div>
                </div>
              ) : (
                /* SWAP DEMO VIEW */
                <div className="space-y-4">
                  {/* Conventional Card (Before) */}
                  <div className="p-3.5 rounded-sm bg-[#16161d] light:bg-zinc-50 border border-rose-900/40 light:border-rose-200 flex items-center justify-between opacity-80 font-mono">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🍴</span>
                      <div>
                        <div className="text-xs text-zinc-300 light:text-zinc-700 line-through">
                          Plastic Cutlery (50 pcs)
                        </div>
                        <div className="text-[11px] text-rose-400 font-medium">
                          Grade E • 145g Plastic • 2.45kg CO₂
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-sm bg-rose-950 text-rose-300 border border-rose-800">
                      Grade E
                    </span>
                  </div>

                  {/* Swap Arrow Indicator */}
                  <div className="flex items-center justify-center -my-1 text-emerald-400 font-mono text-xs">
                    <span className="bg-[#07080b] light:bg-zinc-100 px-3 py-1 rounded-sm border border-[#33333a] light:border-zinc-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>EcoAgent Proposes Greener Swap</span>
                    </span>
                  </div>

                  {/* Greener Product (After) */}
                  <div className="p-3.5 rounded-sm bg-[#16161d] light:bg-emerald-50 border border-emerald-500/40 light:border-emerald-300 flex items-center justify-between font-mono">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🎋</span>
                      <div>
                        <div className="text-xs font-bold text-white light:text-zinc-900">
                          Organic Bamboo Cutlery Set
                        </div>
                        <div className="text-[11px] text-emerald-400 light:text-emerald-700">
                          Grade A • 0g Plastic • 0.35kg CO₂
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-sm bg-emerald-500 text-black">
                      Grade A
                    </span>
                  </div>

                  {/* Tangible Savings Pill */}
                  <div className="p-3 rounded-sm bg-[#07080b] light:bg-zinc-100 border border-[#222228] light:border-zinc-200 text-center text-xs font-mono space-y-1">
                    <div className="text-emerald-400 light:text-emerald-700 font-bold">
                      🎉 Net Savings: -2.1 kg CO₂ & 145g packaging
                    </div>
                    <p className="text-[11px] text-[#aaaab0] light:text-zinc-500">
                      Pay ₹220 once for lifetime reusable organic bamboo.
                    </p>
                  </div>

                  {sampleProduct && (
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(sampleProduct)}
                      className="w-full py-2.5 rounded-sm bg-[#07080b] hover:bg-white hover:text-black light:bg-zinc-100 light:hover:bg-zinc-900 light:hover:text-white border border-[#33333a] light:border-zinc-300 text-xs font-mono transition text-center cursor-pointer"
                    >
                      Inspect Bamboo Cutlery Specs →
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
