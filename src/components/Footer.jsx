import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShieldCheck, Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-stone-200 bg-[#fbfbf9] text-stone-600 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand & Manifesto */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-bold shadow-xs">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-[#0B3B2C]">
                Eco<span className="text-emerald-600">Mart</span>
              </span>
            </div>

            <p className="text-sm text-stone-600 max-w-md leading-relaxed">
              Every purchase on EcoMart is audited for verified ecological impact, zero single-use plastic, and ethical local production. Making sustainable choices effortless, transparent, and rewarding.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-semibold">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/60 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                100% Zero-Plastic Packaging
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200/60 shadow-2xs">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                Offline-First Architecture
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs font-medium text-stone-600">
              <li>
                <Link to="/shop" className="hover:text-emerald-700 transition">
                  Sustainable Catalog
                </Link>
              </li>
              <li>
                <Link to="/tools" className="hover:text-emerald-700 transition">
                  Starter Kits & Budget Builder
                </Link>
              </li>
              <li>
                <Link to="/impact" className="hover:text-emerald-700 transition">
                  Impact Proof & Metrics
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-emerald-700 transition">
                  Eco Collective
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-emerald-700 transition">
                  Life Cycle Methodology
                </Link>
              </li>
            </ul>
          </div>

          {/* Scoring Methodology */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-4">
              Eco Score Formula
            </h4>
            <ul className="space-y-2 text-xs font-medium text-stone-600">
              <li>• Renewable Materials (30%)</li>
              <li>• Plastic-Free Packaging (20%)</li>
              <li>• Carbon Savings (25%)</li>
              <li>• Verified Certifications (15%)</li>
              <li>• Transport & Local Origin (10%)</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <div>
            © 2026 EcoMart. Fast, verified, and transparent sustainable shopping.
          </div>
          <div className="flex items-center gap-2 text-emerald-800 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Autonomous EcoAgent Engine v3.0 Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
