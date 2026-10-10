import React from 'react';
import { Leaf, ShieldCheck, Heart, Sparkles, MapPin } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="mt-20 border-t border-stone-200 dark:border-stone-800/80 bg-white dark:bg-[#06110D] text-stone-700 dark:text-stone-300 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Manifesto */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white">
                <Leaf className="w-5 h-5 text-emerald-200" />
              </div>
              <span className="font-black text-xl tracking-tight text-stone-900 dark:text-stone-100">
                Eco<span className="text-emerald-700 dark:text-emerald-400">Mart</span>
              </span>
            </div>

            <p className="text-sm text-stone-600 dark:text-stone-400 max-w-md leading-relaxed">
              Every purchase casts a vote for the world we want to inhabit.
              EcoMart pairs artisanal sustainable goods with an intelligent Eco Agent that
              calculates real lifecycle footprints and swaps high-impact items for verified alternatives.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
                🌱 100% Plastic-Free Catalog
              </span>
              <span className="px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-semibold border border-teal-200 dark:border-teal-800">
                ⚡ Offline Native Architecture
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-stone-100 mb-3">
              Explore & Understand
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActivePage('shop')}
                  className="hover:text-emerald-700 dark:hover:text-emerald-400 transition"
                >
                  Sustainable Catalog (60+ items)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('impact')}
                  className="hover:text-emerald-700 dark:hover:text-emerald-400 transition"
                >
                  Live Impact Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('how-it-works')}
                  className="hover:text-emerald-700 dark:hover:text-emerald-400 transition"
                >
                  How EcoMart Agent Works
                </button>
              </li>
              <li>
                <span className="text-stone-400">Zero Greenwashing Policy</span>
              </li>
            </ul>
          </div>

          {/* Scoring Methodology */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-stone-100 mb-3">
              5-Pillar EcoScore
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-500 dark:text-stone-400">
              <li>• Renewable Materials (30%)</li>
              <li>• Plastic-Free Packaging (20%)</li>
              <li>• Carbon Footprint (25%)</li>
              <li>• Verified Certifications (15%)</li>
              <li>• Transport Distance (10%)</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <div>
            © 2026 EcoMart. Built for conscious shoppers everywhere.
          </div>
          <div className="flex items-center gap-1 text-emerald-800 dark:text-emerald-400 font-medium">
            <span>Theme: "Don't just shop. Shop with purpose."</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
