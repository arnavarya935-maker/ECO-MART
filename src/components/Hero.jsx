import React, { useState } from 'react';
import { Sparkles, ArrowRight, Play, Pause, Volume2, VolumeX, Globe2, RefreshCw, Radio, Copy, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import LeafyGlobe3D from './3D/LeafyGlobe3D';
import Safe3D from './3D/Safe3D';

const VIDEO_FEEDS = {
  forest: {
    title: 'CANOPY TELEMETRY // ASSAM RESERVES',
    coords: '24°18\'N 93°44\'E',
    co2: '-48.6 kg/day',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4',
    poster: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80'
  },
  ocean: {
    title: 'HYDROSPHERE REEF // LAKSHADWEEP',
    coords: '08°12\'N 73°02\'E',
    co2: '-62.1 kg/day',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4',
    poster: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
  }
};

export default function Hero({ onExploreClick }) {
  const { setIsAgentOpen, setSelectedProduct, allProducts } = useCart();
  const [activeTab, setActiveTab] = useState('forest'); // 'forest' | 'ocean' | '3d' | 'swap'
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [copied, setCopied] = useState(false);

  const sampleProduct = (allProducts || []).find((p) => p.id === 'kit-01');

  const handleCopyCommand = () => {
    navigator.clipboard.writeText('npx ecomart-agent audit --strict');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden bg-[#030303] pt-20 pb-28 md:pt-28 md:pb-36 border-b border-white/10 bg-graph transition-colors">
      {/* Ambient Pulsing Atmospheric Orbs */}
      <div className="ambient-orb bg-[#A8C7FA] top-1/4 left-1/2 -translate-x-1/2" />
      <div className="ambient-orb bg-[#F1C6D4] bottom-10 right-10" />

      {/* Floating Orbital Color Nodes (Exact img2m3 Aesthetic) */}
      <div className="pointer-events-none absolute inset-0 max-w-7xl mx-auto overflow-hidden hidden md:block">
        {/* Node 1: Primary Cyan */}
        <div className="color-node absolute w-28 h-40 rounded-2xl bg-[#A8C7FA]/90 flex flex-col justify-between p-3.5 left-8 lg:left-16 top-24 transform -rotate-12 pointer-events-auto">
          <span className="text-[9px] font-space-mono text-black/70 uppercase font-bold tracking-widest">
            01 // PRIMARY
          </span>
          <div>
            <div className="text-xs font-space-mono font-bold text-black">#A8C7FA</div>
            <div className="text-[9px] font-space-mono text-black/80 font-medium mt-0.5">-2.4kg CO₂</div>
          </div>
        </div>

        {/* Node 2: Secondary Rose Quartz */}
        <div className="color-node absolute w-24 h-44 rounded-full bg-[#F1C6D4]/90 flex flex-col justify-between p-4 right-8 lg:right-20 top-20 transform rotate-12 pointer-events-auto">
          <span className="text-[9px] font-space-mono text-black/70 uppercase font-bold tracking-widest">
            02 // ROSE
          </span>
          <div>
            <div className="text-xs font-space-mono font-bold text-black">#F1C6D4</div>
            <div className="text-[9px] font-space-mono text-black/80 font-medium mt-0.5">0g PLASTIC</div>
          </div>
        </div>

        {/* Node 3: Tertiary Champagne */}
        <div className="color-node absolute w-32 h-32 rounded-2xl bg-[#E2D3B6]/90 flex flex-col justify-between p-3.5 left-10 lg:left-24 bottom-32 transform rotate-6 pointer-events-auto">
          <span className="text-[9px] font-space-mono text-black/70 uppercase font-bold tracking-widest">
            03 // TERTIARY
          </span>
          <div>
            <div className="text-xs font-space-mono font-bold text-black">#E2D3B6</div>
            <div className="text-[9px] font-space-mono text-black/80 font-medium mt-0.5">100% ARTISAN</div>
          </div>
        </div>

        {/* Node 4: Surface Void */}
        <div className="color-node absolute w-48 h-28 rounded-full bg-[#111111]/90 border border-white/20 flex flex-col justify-between p-5 right-12 lg:right-28 bottom-36 transform -rotate-6 pointer-events-auto">
          <span className="text-[9px] font-space-mono text-white/50 uppercase font-bold tracking-widest">
            04 // SURFACE
          </span>
          <div>
            <div className="text-xs font-space-mono font-bold text-white">#030303 VOID</div>
            <div className="text-[9px] font-space-mono text-emerald-400 font-medium mt-0.5">INDEX 98 • GRADE A</div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        {/* CENTERED EDITORIAL HERO CONTENT */}
        <div className="flex flex-col items-center text-center">
          {/* Micro Subheading Tag */}
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 bg-white/5 border border-white/10 rounded-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A8C7FA] animate-ping" />
            <span className="font-space-mono text-[9px] md:text-[11px] tracking-[0.25em] text-[#A8C7FA] uppercase font-bold">
              AUTONOMOUS ECO-INTELLIGENCE // ARCHITECTURE M3.0
            </span>
          </div>

          {/* Massive Centered Headline (Exact img2m3 Typography) */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[7.5rem] leading-[0.92] tracking-tight font-light text-white mb-6 flex flex-col items-center">
            <span className="block font-sans font-light tracking-tight">
              Regenerative
            </span>
            <span className="block font-newsreader italic text-[#E2D3B6] tracking-normal pl-8 md:pl-20">
              living systems.
            </span>
          </h1>

          {/* Editorial Paragraph */}
          <p className="text-sm md:text-base text-neutral-400 max-w-xl font-light leading-relaxed mx-auto mb-9 font-sans">
            Audit the mathematical lifecycle footprint of every household item. 
            Discover verified zero-plastic alternatives with our autonomous cognitive EcoAgent.
          </p>

          {/* Signature img2m3 Cyber Buttons Row */}
          <div className="relative flex flex-wrap items-center justify-center gap-4 btn-group mb-14">
            <div className="backdrop" />
            <button
              type="button"
              onClick={onExploreClick}
              className="cyber-button"
            >
              <div className="a l" />
              <div className="a r" />
              <div className="a t" />
              <div className="a b" />
              <span className="text font-space-mono tracking-widest uppercase text-xs md:text-sm font-bold flex items-center gap-2 text-white">
                Explore Catalog
                <ArrowRight className="w-4 h-4 ml-1 text-[#A8C7FA]" />
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsAgentOpen(true)}
              className="px-6 py-3.5 rounded-xs border border-white/20 hover:border-white bg-[#0a0a0a]/80 backdrop-blur-md text-white font-space-mono text-xs uppercase tracking-wider flex items-center gap-2 transition cursor-pointer hover:bg-[#141414]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#A8C7FA]" />
              <span>Launch Co-Pilot</span>
            </button>

            {/* Terminal Command Box */}
            <div className="px-3.5 py-3 rounded-xs bg-[#0a0a0a] border border-white/10 flex items-center gap-2 font-space-mono text-xs">
              <span className="text-[#A8C7FA] font-bold">$</span>
              <span className="text-neutral-300 text-[11px]">npx ecomart audit</span>
              <button
                type="button"
                onClick={handleCopyCommand}
                className="p-1 rounded-2xs bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition cursor-pointer ml-1"
                title="Copy terminal command"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* CENTERPIECE: CINEMATIC OBSERVATORY VIEWFINDER WINDOW */}
        <div className="relative mt-4">
          {/* Architectural Framing Lines */}
          <div className="f-top hidden sm:block" />
          <div className="f-bottom hidden sm:block" />
          <div className="f-left hidden sm:block" />
          <div className="f-right hidden sm:block" />
          <span className="cross-dot top-0 left-0" />
          <span className="cross-dot top-0 right-0" />
          <span className="cross-dot bottom-0 left-0" />
          <span className="cross-dot bottom-0 right-0" />

          {/* Viewfinder Main Frame */}
          <div className="editorial-card rounded-md p-3 sm:p-5 relative bg-[#070707] overflow-hidden">
            <span className="bracket bracket-tl !border-white/60 !w-5 !h-5" />
            <span className="bracket bracket-tr !border-white/60 !w-5 !h-5" />
            <span className="bracket bracket-bl !border-white/60 !w-5 !h-5" />
            <span className="bracket bracket-br !border-white/60 !w-5 !h-5" />

            {/* Viewfinder Top Control Strip */}
            <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-white/10 gap-3">
              <div className="flex items-center gap-1 bg-[#030303] border border-white/10 p-1 rounded-xs font-space-mono text-[10px]">
                <button
                  type="button"
                  onClick={() => setActiveTab('forest')}
                  className={`px-3 py-1 rounded-2xs transition cursor-pointer ${
                    activeTab === 'forest'
                      ? 'bg-[#A8C7FA] text-black font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Canopy Stream
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('ocean')}
                  className={`px-3 py-1 rounded-2xs transition cursor-pointer ${
                    activeTab === 'ocean'
                      ? 'bg-[#A8C7FA] text-black font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Oceanic Reef
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('3d')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-2xs transition cursor-pointer ${
                    activeTab === '3d'
                      ? 'bg-[#A8C7FA] text-black font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Globe2 className="w-3 h-3" />
                  <span>3D Planet</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('swap')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-2xs transition cursor-pointer ${
                    activeTab === 'swap'
                      ? 'bg-[#A8C7FA] text-black font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Swap Logic</span>
                </button>
              </div>

              <div className="flex items-center gap-2 font-space-mono text-[10px] text-neutral-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>60 FPS OPTICAL FEED</span>
                <span className="text-white/20">|</span>
                <span className="text-[#A8C7FA]">CO₂ FLUX -48.6 KG/DAY</span>
              </div>
            </div>

            {/* TAB CONTENT: VIDEO FEEDS */}
            {(activeTab === 'forest' || activeTab === 'ocean') && (
              <div className="relative aspect-video sm:aspect-[21/9] rounded-xs overflow-hidden bg-black border border-white/10 group">
                <div className="scanline-widget z-20" />
                <video
                  key={activeTab}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-cover filter contrast-[1.08] saturate-[1.15]"
                  src={VIDEO_FEEDS[activeTab].src}
                  poster={VIDEO_FEEDS[activeTab].poster}
                />

                {/* Top Corner Telemetry Stamp */}
                <div className="absolute top-4 left-4 z-20 bg-black/80 backdrop-blur-md px-3 py-1 rounded-2xs border border-white/20 font-space-mono text-[10px] text-[#A8C7FA] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{VIDEO_FEEDS[activeTab].title}</span>
                  <span className="text-white/40">●</span>
                  <span className="text-white/80">{VIDEO_FEEDS[activeTab].coords}</span>
                </div>

                {/* Bottom Right Controls */}
                <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 bg-black/80 backdrop-blur-md p-1.5 rounded-2xs border border-white/20">
                  <button
                    type="button"
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1 rounded text-white hover:text-[#A8C7FA] transition cursor-pointer"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 3D EARTH GLOBE */}
            {activeTab === '3d' && (
              <div className="relative aspect-video sm:aspect-[21/9] rounded-xs overflow-hidden bg-black border border-white/10 flex items-center justify-center p-4">
                <Safe3D
                  fallbackTitle="Interactive 3D Earth Biosphere"
                  fallbackSubtitle="3D planet paused under Reduce Effects."
                  fallbackEmoji="🌍"
                  className="w-full h-full"
                >
                  <LeafyGlobe3D />
                </Safe3D>
              </div>
            )}

            {/* TAB CONTENT: SWAP DEMO */}
            {activeTab === 'swap' && (
              <div className="p-6 rounded-xs bg-[#050505] border border-white/10 space-y-4 font-space-mono">
                <div className="p-4 rounded-xs bg-[#111] border border-rose-900/40 flex items-center justify-between text-xs">
                  <div>
                    <div className="text-neutral-400 line-through">
                      Single-Use Plastic Cutlery (50 pcs)
                    </div>
                    <div className="text-[10px] text-rose-400 mt-0.5">
                      Grade E • 145g Plastic • 2.45kg CO₂
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-2xs bg-rose-950 text-rose-300 border border-rose-800">
                    Grade E
                  </span>
                </div>

                <div className="flex items-center justify-center -my-1 text-[#A8C7FA] text-xs">
                  <span className="bg-[#030303] px-3 py-1 rounded-xs border border-white/10 flex items-center gap-1.5 text-[10px]">
                    <Sparkles className="w-3 h-3 text-[#A8C7FA]" />
                    <span>EcoAgent Proposes Greener Swap</span>
                  </span>
                </div>

                <div className="p-4 rounded-xs bg-[#111] border border-emerald-500/40 flex items-center justify-between text-xs">
                  <div>
                    <div className="text-white font-bold">
                      Organic Bamboo Cutlery Set
                    </div>
                    <div className="text-[10px] text-emerald-400 mt-0.5">
                      Grade A • 0g Plastic • 0.35kg CO₂
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-2xs bg-emerald-400 text-black">
                    Grade A
                  </span>
                </div>

                {sampleProduct && (
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(sampleProduct)}
                    className="w-full py-2.5 rounded-xs bg-[#030303] hover:bg-white hover:text-black border border-white/20 text-xs text-neutral-300 transition text-center cursor-pointer"
                  >
                    Inspect Bamboo Cutlery Specifications →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
