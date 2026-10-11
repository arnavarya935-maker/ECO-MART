import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Leaf, RefreshCw, CheckCircle2, Globe2, TrendingUp, Copy, Check, Video, Radio } from 'lucide-react';
import { useCart } from '../context/CartContext';
import LeafyGlobe3D from './3D/LeafyGlobe3D';
import Safe3D from './3D/Safe3D';

const TYPEWRITER_HEADLINES = [
  {
    prefix: 'The autonomous',
    highlight: 'carbon-intelligent',
    suffix: 'commerce architecture.'
  },
  {
    prefix: 'Every transaction audited with',
    highlight: 'transparent 0-100 Eco-Scores',
    suffix: '& zero greenwash.'
  },
  {
    prefix: 'An editorial co-pilot for',
    highlight: 'zero-plastic living',
    suffix: '& regenerative craft.'
  }
];

export default function Hero({ onExploreClick }) {
  const { setIsAgentOpen, setSelectedProduct, allProducts } = useCart();
  const [heroView, setHeroView] = useState('video'); // 'video' | '3d' | 'swap'
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % TYPEWRITER_HEADLINES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCommand = () => {
    navigator.clipboard.writeText('npx ecomart-agent audit --strict');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleProduct = (allProducts || []).find((p) => p.id === 'kit-01');
  const currentHeadline = TYPEWRITER_HEADLINES[headlineIndex];

  return (
    <section className="relative overflow-hidden bg-[#030303] py-18 md:py-28 border-b border-white/10 bg-graph transition-colors">
      {/* Ambient Looping Video Background Layer */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="ambient-video-backdrop opacity-20 filter contrast-125 saturate-150"
        src="https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4"
      />

      {/* Atmospheric Radial Orbs */}
      <div className="ambient-orb bg-[#A8C7FA] top-10 right-1/4 -translate-y-1/2" />
      <div className="ambient-orb bg-[#F1C6D4] bottom-0 left-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Modern Editorial Typography */}
          <div className="lg:col-span-7 space-y-7 text-left">
            {/* Viewfinder Pill Announcement */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xs bg-[#0a0a0a]/90 backdrop-blur-md border border-white/15 text-xs font-space-mono text-neutral-300 relative">
              <span className="bracket bracket-tl !w-2 !h-2 !border-[#A8C7FA]" />
              <span className="bracket bracket-br !w-2 !h-2 !border-[#A8C7FA]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#A8C7FA] animate-pulse" />
              <span className="uppercase tracking-[0.2em] text-[10px] text-[#A8C7FA]">
                EDITION M3.0 // AUTONOMOUS LIFE-CYCLE INTELLIGENCE
              </span>
            </div>

            {/* Display Headline with Editorial Serif & Modern Sans */}
            <div className="min-h-[140px] sm:min-h-[160px] flex items-center">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light text-white tracking-tight leading-[1.02] transition-all duration-500">
                <span className="font-newsreader italic text-[#E2D3B6]">
                  {currentHeadline.prefix}
                </span>{' '}
                <span className="font-sans font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#A8C7FA] via-white to-[#F1C6D4]">
                  {currentHeadline.highlight}
                </span>{' '}
                <span className="font-newsreader italic text-white/90">
                  {currentHeadline.suffix}
                </span>
              </h1>
            </div>

            <p className="text-base sm:text-lg text-neutral-400 max-w-xl leading-relaxed font-sans font-normal">
              Every item transparently scored across materials, packaging, and lifecycle CO₂. 
              Our real-time Eco-Agent audits your cart and recommends lower-impact swaps before checkout.
            </p>

            {/* Cyber Buttons & Command Deck */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onExploreClick}
                className="cyber-button rounded-xs group"
              >
                <span className="bracket bracket-tl !border-[#A8C7FA]" />
                <span className="bracket bracket-br !border-[#A8C7FA]" />
                <span className="flex items-center gap-2 text-[#A8C7FA] group-hover:text-white font-space-mono">
                  <span>Explore Index</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsAgentOpen(true)}
                className="px-5 py-3 rounded-xs border border-white/20 hover:border-white bg-[#0a0a0a]/80 backdrop-blur-sm text-white font-space-mono text-xs uppercase tracking-wider flex items-center gap-2 transition cursor-pointer hover:bg-[#141414]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#A8C7FA]" />
                <span>Launch Agent</span>
              </button>

              {/* Terminal Code Pill */}
              <div className="relative px-3 py-2.5 rounded-xs bg-[#0a0a0a] border border-white/10 flex items-center gap-2 text-xs font-space-mono">
                <span className="text-[#A8C7FA]">$</span>
                <span className="text-neutral-300 text-[11px]">npx ecomart audit</span>
                <button
                  type="button"
                  onClick={handleCopyCommand}
                  className="p-1 rounded-2xs bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition cursor-pointer ml-1"
                  title="Copy command"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Floating Color Nodes Strip (img2m3 signature) */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-3">
              <div className="color-node p-3 bg-[#0a0a0a]/80 border border-white/10">
                <div className="text-[10px] font-space-mono text-[#A8C7FA] uppercase tracking-wider">
                  01 // DIVERTER
                </div>
                <div className="text-base font-bold font-space-mono text-white mt-0.5">
                  14,820 kg
                </div>
                <div className="text-[10px] text-neutral-500 font-space-mono">CO₂ Preserved</div>
              </div>

              <div className="color-node p-3 bg-[#0a0a0a]/80 border border-white/10">
                <div className="text-[10px] font-space-mono text-[#E2D3B6] uppercase tracking-wider">
                  02 // CIRCULAR
                </div>
                <div className="text-base font-bold font-space-mono text-[#E2D3B6] mt-0.5">
                  89,400 pcs
                </div>
                <div className="text-[10px] text-neutral-500 font-space-mono">Plastic Avoided</div>
              </div>

              <div className="color-node p-3 bg-[#0a0a0a]/80 border border-white/10">
                <div className="text-[10px] font-space-mono text-[#F1C6D4] uppercase tracking-wider">
                  03 // ARTISANAL
                </div>
                <div className="text-base font-bold font-space-mono text-[#F1C6D4] mt-0.5">
                  4,210 Hubs
                </div>
                <div className="text-[10px] text-neutral-500 font-space-mono">Craft Empowered</div>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Viewfinder Card Frame with Video & 3D */}
          <div className="lg:col-span-5 relative">
            <div className="editorial-card rounded-md p-4 sm:p-5 relative bg-[#070707]">
              {/* Corner Viewfinder Brackets */}
              <span className="bracket bracket-tl !border-[#A8C7FA] !w-4 !h-4" />
              <span className="bracket bracket-tr !border-[#A8C7FA] !w-4 !h-4" />
              <span className="bracket bracket-bl !border-[#A8C7FA] !w-4 !h-4" />
              <span className="bracket bracket-br !border-[#A8C7FA] !w-4 !h-4" />

              {/* Header with Switcher Tabs */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-1 p-0.5 rounded-xs bg-[#030303] border border-white/10 font-space-mono text-[10px]">
                  <button
                    type="button"
                    onClick={() => setHeroView('video')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-2xs transition cursor-pointer ${
                      heroView === 'video'
                        ? 'bg-[#A8C7FA] text-black font-bold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Video className="w-3 h-3" />
                    <span>Video Feed</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroView('3d')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-2xs transition cursor-pointer ${
                      heroView === '3d'
                        ? 'bg-[#A8C7FA] text-black font-bold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Globe2 className="w-3 h-3" />
                    <span>3D Planet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroView('swap')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-2xs transition cursor-pointer ${
                      heroView === 'swap'
                        ? 'bg-[#A8C7FA] text-black font-bold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Swap Logic</span>
                  </button>
                </div>

                <span className="text-[9px] font-space-mono uppercase px-2 py-0.5 rounded-2xs bg-white/5 text-[#A8C7FA] border border-white/10">
                  {heroView === 'video' ? 'LIVE 60FPS' : heroView === '3d' ? 'WEBGL' : 'COGNITIVE'}
                </span>
              </div>

              {/* VIEW 1: AMBIENT VIDEO FEED */}
              {heroView === 'video' && (
                <div className="mt-3 space-y-3">
                  <div className="relative aspect-video rounded-xs overflow-hidden border border-white/10 bg-black group">
                    <div className="scanline-widget" />
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover filter contrast-110 saturate-125"
                      src="https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4"
                    />

                    {/* HUD Telemetry Overlay */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-2 px-2 py-0.5 bg-black/80 backdrop-blur-md rounded-2xs border border-white/20 text-[9px] font-space-mono text-[#A8C7FA]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>OPTICAL SENSOR // STREAM ACTIVE</span>
                    </div>

                    <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 px-2 py-0.5 bg-black/80 backdrop-blur-md rounded-2xs border border-white/20 text-[9px] font-space-mono text-white/80">
                      <span>24°18'N 93°44'E</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xs bg-[#050505] border border-white/10 text-center font-space-mono text-xs">
                    <div className="text-[#A8C7FA] text-[11px] font-bold">
                      📡 Real-Time Transpiration & Canopy Telemetry
                    </div>
                    <p className="text-[10px] text-neutral-400 mt-0.5">
                      Monitored via optical satellites to calculate raw material regenerative cycle.
                    </p>
                  </div>
                </div>
              )}

              {/* VIEW 2: 3D GLOBE */}
              {heroView === '3d' && (
                <div className="mt-3 space-y-3">
                  <Safe3D
                    fallbackTitle="Interactive 3D Earth Biosphere"
                    fallbackSubtitle="3D planet paused under Reduce Effects."
                    fallbackEmoji="🌍"
                    className="w-full"
                  >
                    <LeafyGlobe3D />
                  </Safe3D>
                  <div className="p-3 rounded-xs bg-[#050505] border border-white/10 text-center font-space-mono text-xs">
                    <div className="text-[#A8C7FA] text-[11px] font-bold">
                      🌍 Procedural Earth Biosphere
                    </div>
                    <p className="text-[10px] text-neutral-400 mt-0.5">
                      Drag to orbit continents and observe floating carbon crystals.
                    </p>
                  </div>
                </div>
              )}

              {/* VIEW 3: SWAP DEMO */}
              {heroView === 'swap' && (
                <div className="mt-3 space-y-3 font-space-mono">
                  {/* Before */}
                  <div className="p-3 rounded-xs bg-[#111] border border-rose-900/40 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-neutral-400 line-through">
                        Single-Use Cutlery (50 pcs)
                      </div>
                      <div className="text-[10px] text-rose-400 mt-0.5">
                        Grade E • 145g Plastic • 2.45kg CO₂
                      </div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-2xs bg-rose-950 text-rose-300 border border-rose-800">
                      Grade E
                    </span>
                  </div>

                  {/* Swap Indicator */}
                  <div className="flex items-center justify-center -my-1 text-[#A8C7FA] text-xs">
                    <span className="bg-[#050505] px-2.5 py-0.5 rounded-xs border border-white/10 flex items-center gap-1.5 text-[10px]">
                      <Sparkles className="w-3 h-3 text-[#A8C7FA]" />
                      <span>EcoAgent Proposes Greener Swap</span>
                    </span>
                  </div>

                  {/* After */}
                  <div className="p-3 rounded-xs bg-[#111] border border-emerald-500/40 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-white font-bold">
                        Organic Bamboo Cutlery Set
                      </div>
                      <div className="text-[10px] text-emerald-400 mt-0.5">
                        Grade A • 0g Plastic • 0.35kg CO₂
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-2xs bg-emerald-400 text-black">
                      Grade A
                    </span>
                  </div>

                  {sampleProduct && (
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(sampleProduct)}
                      className="w-full py-2 rounded-xs bg-[#030303] hover:bg-white hover:text-black border border-white/20 text-[11px] font-space-mono text-neutral-300 transition text-center cursor-pointer"
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
