import React, { useState } from 'react';
import { Sparkles, ArrowRight, Globe2, RefreshCw, Copy, Check, ShieldCheck, Leaf } from 'lucide-react';
import { useCart } from '../context/CartContext';
import LeafyGlobe3D from './3D/LeafyGlobe3D';
import Safe3D from './3D/Safe3D';

export default function Hero({ onExploreClick }) {
  const { setIsAgentOpen, setSelectedProduct, allProducts } = useCart();
  const [activeTab, setActiveTab] = useState('3d'); // '3d' | 'swap'
  const [copied, setCopied] = useState(false);

  const sampleProduct = (allProducts || []).find((p) => p.id === 'kit-01');

  const handleCopyCommand = () => {
    navigator.clipboard.writeText('npx ecomart-agent audit --strict');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden bg-[#f4f4f5] dark:bg-[#030303] pt-20 pb-28 md:pt-28 md:pb-36 border-b border-black/10 dark:border-white/10 bg-graph transition-colors">
      {/* Floating Orbital Color Nodes (Exact img2m3 Signature in Light Palette) */}
      <div className="pointer-events-none absolute inset-0 max-w-7xl mx-auto overflow-hidden hidden md:block">
        {/* Node 1: Primary Cerulean Cyan */}
        <div className="color-node absolute w-28 h-40 rounded-2xl bg-[#A8C7FA] flex flex-col justify-between p-3.5 left-8 lg:left-16 top-24 transform -rotate-12 pointer-events-auto shadow-lg border border-black/5">
          <span className="text-[9px] font-space-mono text-black/70 uppercase font-bold tracking-widest">
            01 // PRIMARY
          </span>
          <div>
            <div className="text-xs font-space-mono font-bold text-black">#A8C7FA</div>
            <div className="text-[9px] font-space-mono text-black/80 font-medium mt-0.5">-2.4kg CO₂</div>
          </div>
        </div>

        {/* Node 2: Secondary Rose Quartz */}
        <div className="color-node absolute w-24 h-44 rounded-full bg-[#F1C6D4] flex flex-col justify-between p-4 right-8 lg:right-20 top-20 transform rotate-12 pointer-events-auto shadow-lg border border-black/5">
          <span className="text-[9px] font-space-mono text-black/70 uppercase font-bold tracking-widest">
            02 // ROSE
          </span>
          <div>
            <div className="text-xs font-space-mono font-bold text-black">#F1C6D4</div>
            <div className="text-[9px] font-space-mono text-black/80 font-medium mt-0.5">0g PLASTIC</div>
          </div>
        </div>

        {/* Node 3: Tertiary Champagne Sand */}
        <div className="color-node absolute w-32 h-32 rounded-2xl bg-[#E2D3B6] flex flex-col justify-between p-3.5 left-10 lg:left-24 bottom-32 transform rotate-6 pointer-events-auto shadow-lg border border-black/5">
          <span className="text-[9px] font-space-mono text-black/70 uppercase font-bold tracking-widest">
            03 // TERTIARY
          </span>
          <div>
            <div className="text-xs font-space-mono font-bold text-black">#E2D3B6</div>
            <div className="text-[9px] font-space-mono text-black/80 font-medium mt-0.5">100% ARTISAN</div>
          </div>
        </div>

        {/* Node 4: Surface Architectural Card */}
        <div className="color-node absolute w-48 h-28 rounded-full bg-white dark:bg-[#111] border border-black/10 dark:border-white/20 flex flex-col justify-between p-5 right-12 lg:right-28 bottom-36 transform -rotate-6 pointer-events-auto shadow-lg">
          <span className="text-[9px] font-space-mono text-neutral-500 uppercase font-bold tracking-widest">
            04 // SURFACE
          </span>
          <div>
            <div className="text-xs font-space-mono font-bold text-black dark:text-white">#F4F4F5 LIGHT</div>
            <div className="text-[9px] font-space-mono text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">INDEX 98 • GRADE A</div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        {/* CENTERED EDITORIAL HERO CONTENT */}
        <div className="flex flex-col items-center text-center">
          {/* Micro Subheading Tag */}
          <div className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 rounded-2xs shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb] animate-ping" />
            <span className="font-space-mono text-[9px] md:text-[11px] tracking-[0.25em] text-[#2563eb] dark:text-[#A8C7FA] uppercase font-bold">
              AUTONOMOUS ECO-INTELLIGENCE // ARCHITECTURE M3.0
            </span>
          </div>

          {/* Massive Centered Headline (Exact img2m3 Typography) */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[7.5rem] leading-[0.92] tracking-tight font-light text-[#0a0a0a] dark:text-white mb-6 flex flex-col items-center">
            <span className="block font-sans font-light tracking-tight">
              Regenerative
            </span>
            <span className="block font-newsreader italic text-[#b45309] dark:text-[#E2D3B6] tracking-normal pl-8 md:pl-20">
              living systems.
            </span>
          </h1>

          {/* Editorial Paragraph */}
          <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 max-w-xl font-light leading-relaxed mx-auto mb-9 font-sans">
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
              className="px-6 py-3.5 rounded-xs border border-black/15 dark:border-white/20 hover:border-black dark:hover:border-white bg-white dark:bg-[#0a0a0a]/80 backdrop-blur-md text-[#0a0a0a] dark:text-white font-space-mono text-xs uppercase tracking-wider flex items-center gap-2 transition cursor-pointer hover:bg-neutral-100 dark:hover:bg-[#141414] shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#2563eb] dark:text-[#A8C7FA]" />
              <span>Launch Co-Pilot</span>
            </button>

            {/* Terminal Command Box */}
            <div className="px-3.5 py-3 rounded-xs bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 flex items-center gap-2 font-space-mono text-xs shadow-xs">
              <span className="text-[#2563eb] dark:text-[#A8C7FA] font-bold">$</span>
              <span className="text-neutral-700 dark:text-neutral-300 text-[11px]">npx ecomart audit</span>
              <button
                type="button"
                onClick={handleCopyCommand}
                className="p-1 rounded-2xs bg-neutral-100 dark:bg-white/10 hover:bg-neutral-200 text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition cursor-pointer ml-1"
                title="Copy terminal command"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* CENTERPIECE: ARCHITECTURAL VIEWFINDER CARD (3D EARTH & SWAP LOGIC) */}
        <div className="relative mt-2">
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
          <div className="editorial-card rounded-md p-4 sm:p-6 relative bg-white dark:bg-[#0a0a0a] shadow-xl overflow-hidden border border-black/10 dark:border-white/10">
            <span className="bracket bracket-tl !border-black/40 dark:!border-white/40 !w-5 !h-5" />
            <span className="bracket bracket-tr !border-black/40 dark:!border-white/40 !w-5 !h-5" />
            <span className="bracket bracket-bl !border-black/40 dark:!border-white/40 !w-5 !h-5" />
            <span className="bracket bracket-br !border-black/40 dark:!border-white/40 !w-5 !h-5" />

            {/* Viewfinder Top Control Strip */}
            <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-black/10 dark:border-white/10 gap-3">
              <div className="flex items-center gap-1 bg-[#f4f4f5] dark:bg-[#030303] border border-black/10 dark:border-white/10 p-1 rounded-xs font-space-mono text-[10px]">
                <button
                  type="button"
                  onClick={() => setActiveTab('3d')}
                  className={`flex items-center gap-1 px-3.5 py-1.5 rounded-2xs transition cursor-pointer ${
                    activeTab === '3d'
                      ? 'bg-black text-white dark:bg-white dark:text-black font-bold'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <Globe2 className="w-3 h-3" />
                  <span>3D Planet Globe</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('swap')}
                  className={`flex items-center gap-1 px-3.5 py-1.5 rounded-2xs transition cursor-pointer ${
                    activeTab === 'swap'
                      ? 'bg-black text-white dark:bg-white dark:text-black font-bold'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>AI Swap Logic</span>
                </button>
              </div>

              <div className="flex items-center gap-2 font-space-mono text-[10px] text-neutral-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>ACTIVE COGNITIVE DIAGNOSTICS</span>
                <span className="text-black/20 dark:text-white/20">|</span>
                <span className="text-emerald-700 dark:text-[#A8C7FA] font-bold">100% OFFLINE CAPABLE</span>
              </div>
            </div>

            {/* TAB CONTENT: 3D EARTH GLOBE */}
            {activeTab === '3d' && (
              <div className="relative aspect-video sm:aspect-[21/9] rounded-xs overflow-hidden bg-[#fafafa] dark:bg-black border border-black/10 dark:border-white/10 flex items-center justify-center p-4">
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

            {/* TAB CONTENT: SWAP LOGIC DEMO */}
            {activeTab === 'swap' && (
              <div className="p-6 rounded-xs bg-[#fafafa] dark:bg-[#050505] border border-black/10 dark:border-white/10 space-y-4 font-space-mono">
                {/* Before */}
                <div className="p-4 rounded-xs bg-white dark:bg-[#111] border border-rose-300 dark:border-rose-900/40 flex items-center justify-between text-xs shadow-xs">
                  <div>
                    <div className="text-neutral-500 line-through">
                      Single-Use Plastic Cutlery (50 pcs)
                    </div>
                    <div className="text-[10px] text-rose-600 dark:text-rose-400 mt-0.5">
                      Grade E • 145g Plastic • 2.45kg CO₂
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-2xs bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 font-bold">
                    Grade E
                  </span>
                </div>

                {/* Swap Indicator */}
                <div className="flex items-center justify-center -my-1 text-[#2563eb] dark:text-[#A8C7FA] text-xs">
                  <span className="bg-white dark:bg-[#030303] px-3 py-1 rounded-xs border border-black/10 dark:border-white/10 flex items-center gap-1.5 text-[10px] shadow-2xs font-bold">
                    <Sparkles className="w-3 h-3 text-[#2563eb] dark:text-[#A8C7FA]" />
                    <span>EcoAgent Proposes Greener Swap</span>
                  </span>
                </div>

                {/* After */}
                <div className="p-4 rounded-xs bg-white dark:bg-[#111] border border-emerald-300 dark:border-emerald-500/40 flex items-center justify-between text-xs shadow-xs">
                  <div>
                    <div className="text-black dark:text-white font-bold">
                      Organic Bamboo Cutlery Set
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-bold">
                      Grade A • 0g Plastic • 0.35kg CO₂
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-2xs bg-emerald-600 text-white">
                    Grade A
                  </span>
                </div>

                {sampleProduct && (
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(sampleProduct)}
                    className="w-full py-2.5 rounded-xs bg-white dark:bg-[#030303] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border border-black/15 dark:border-white/20 text-xs text-neutral-800 dark:text-neutral-300 transition text-center cursor-pointer shadow-xs font-bold"
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
