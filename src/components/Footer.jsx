import React from 'react';
import { Leaf, ShieldCheck, Heart, Sparkles, MapPin } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="mt-20 border-t border-[#33333a] light:border-zinc-200 bg-[#0b0b0d] light:bg-[#fafafa] text-[#aaaab0] light:text-zinc-600 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand & Manifesto */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-white light:bg-black text-black light:text-white flex items-center justify-center font-black">
                <Leaf className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              </div>
              <span className="font-bold text-xl tracking-tighter text-[#f4f4f2] light:text-zinc-950">
                ECO<span className="text-emerald-400">MART</span>
              </span>
            </div>

            <p className="text-sm text-[#aaaab0] light:text-zinc-600 max-w-md leading-relaxed font-normal">
              Autonomous cognitive commerce co-pilot. Every transaction verified through transparent 0-100 lifecycle scoring and zero-greenwash principles.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-sm bg-[#111116] light:bg-white text-emerald-400 light:text-emerald-700 border border-[#33333a] light:border-zinc-300">
                🌱 100% Zero-Plastic SKUs
              </span>
              <span className="px-2.5 py-1 rounded-sm bg-[#111116] light:bg-white text-zinc-300 light:text-zinc-700 border border-[#33333a] light:border-zinc-300">
                ⚡ Offline Native Architecture
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#f4f4f2] light:text-zinc-900 mb-4 font-semibold">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs font-mono">
              <li>
                <button
                  onClick={() => setActivePage('shop')}
                  className="hover:text-white light:hover:text-black transition cursor-pointer"
                >
                  Product Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('impact')}
                  className="hover:text-white light:hover:text-black transition cursor-pointer"
                >
                  Impact Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('how-it-works')}
                  className="hover:text-white light:hover:text-black transition cursor-pointer"
                >
                  Architecture & Logic
                </button>
              </li>
              <li>
                <span className="text-zinc-600">Zero Greenwash Protocol</span>
              </li>
            </ul>
          </div>

          {/* Scoring Methodology */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#f4f4f2] light:text-zinc-900 mb-4 font-semibold">
              Scoring Weights
            </h4>
            <ul className="space-y-2 text-xs font-mono text-[#aaaab0] light:text-zinc-500">
              <li>• Renewable Materials (30%)</li>
              <li>• Plastic-Free Packaging (20%)</li>
              <li>• Carbon Footprint (25%)</li>
              <li>• Verified Certifications (15%)</li>
              <li>• Transport Logistics (10%)</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-6 border-t border-[#33333a] light:border-zinc-200 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-zinc-500 gap-4">
          <div>
            © 2026 EcoMart. Payload Modern Marketing Design Theme.
          </div>
          <div className="flex items-center gap-1 text-emerald-400">
            <span>Powered by Autonomous EcoAgent v3.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
