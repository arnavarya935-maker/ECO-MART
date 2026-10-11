import React from 'react';
import { Leaf } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="mt-20 border-t border-white/10 bg-[#030303] text-neutral-400 bg-graph transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand & Manifesto */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-2xs bg-[#0a0a0a] border border-white/20 flex items-center justify-center font-black">
                <span className="bracket bracket-tl !border-[#A8C7FA]" />
                <span className="bracket bracket-br !border-[#A8C7FA]" />
                <Leaf className="w-4 h-4 text-[#A8C7FA]" />
              </div>
              <span className="font-newsreader italic text-2xl font-light tracking-tight text-white">
                Eco<span className="font-sans font-bold not-italic tracking-tighter text-[#A8C7FA]">Mart</span>
              </span>
            </div>

            <p className="text-sm text-neutral-400 max-w-md leading-relaxed font-sans font-normal">
              Autonomous cognitive commerce co-pilot. Every transaction verified through transparent 0-100 lifecycle scoring and zero-greenwash principles.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-space-mono uppercase tracking-wider">
              <span className="px-2.5 py-1 rounded-2xs bg-[#0a0a0a] text-[#A8C7FA] border border-white/10">
                🌱 100% Zero-Plastic SKUs
              </span>
              <span className="px-2.5 py-1 rounded-2xs bg-[#0a0a0a] text-[#E2D3B6] border border-white/10">
                ⚡ Offline Native Architecture
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-space-mono text-[11px] uppercase tracking-[0.2em] text-[#A8C7FA] mb-4 font-semibold">
              INDEX // NAVIGATION
            </h4>
            <ul className="space-y-2.5 text-xs font-space-mono">
              <li>
                <button
                  onClick={() => setActivePage('shop')}
                  className="hover:text-white transition cursor-pointer"
                >
                  Product Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('impact')}
                  className="hover:text-white transition cursor-pointer"
                >
                  Impact Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('how-it-works')}
                  className="hover:text-white transition cursor-pointer"
                >
                  Architecture & Logic
                </button>
              </li>
              <li>
                <span className="text-neutral-600">Zero Greenwash Protocol</span>
              </li>
            </ul>
          </div>

          {/* Scoring Methodology */}
          <div>
            <h4 className="font-space-mono text-[11px] uppercase tracking-[0.2em] text-[#A8C7FA] mb-4 font-semibold">
              WEIGHTS // FORMULA
            </h4>
            <ul className="space-y-2 text-xs font-space-mono text-neutral-400">
              <li>• Renewable Materials (30%)</li>
              <li>• Plastic-Free Packaging (20%)</li>
              <li>• Carbon Footprint (25%)</li>
              <li>• Verified Certifications (15%)</li>
              <li>• Transport Logistics (10%)</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs font-space-mono text-neutral-500 gap-4">
          <div>
            © 2026 EcoMart. Futuristic Modern Editorial Architecture.
          </div>
          <div className="flex items-center gap-1.5 text-[#A8C7FA]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Autonomous EcoAgent v3.0 Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
