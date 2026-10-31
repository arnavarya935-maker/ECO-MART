import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Leaf, ArrowUpRight, Sparkles, Droplets, Trash2 } from 'lucide-react';

export default function GreenTechFooter({ onRequestAudit }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0F3D2E] text-white pt-16 pb-12 border-t border-[#2ECC71]/20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-[120px]">
        {/* Top Statement & CTA Band */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-14 border-b border-white/10">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#2ECC71] text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5" /> High-End Green-Tech SaaS
            </div>
            <h3 className="text-2xl sm:text-3xl font-sans font-bold text-white tracking-tight">
              Ready to elevate your residential estate or corporate campus?
            </h3>
            <p className="text-xs sm:text-sm text-white/75 leading-relaxed font-normal">
              Schedule a zero-obligation environmental hygiene audit. Our scientists and certified field operators compute customized material diversion schedules and chemical eradication benchmarks.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onRequestAudit}
              className="px-6 py-3.5 rounded-full bg-[#2ECC71] text-[#0F3D2E] hover:bg-[#2ECC71]/90 text-xs font-bold shadow-[0px_10px_25px_rgba(46,204,113,0.3)] flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
            >
              <span>Request Eco-Audit</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <Link
              to="/shop"
              className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/15 text-xs font-semibold text-center flex items-center justify-center min-h-[48px]"
            >
              Browse Eco Catalog
            </Link>
          </div>
        </div>

        {/* Multi-column Link Index */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-12 text-xs font-sans">
          <div className="space-y-3">
            <div className="font-mono font-bold uppercase tracking-wider text-[#2ECC71]">
              Services
            </div>
            <ul className="space-y-2 text-white/80">
              <li><a href="#core-services" className="hover:text-white transition">Eco-Cleaning Botanical</a></li>
              <li><a href="#core-services" className="hover:text-white transition">Solid Waste Closed-Loop</a></li>
              <li><a href="#core-services" className="hover:text-white transition">Green Sanitization (HOCl)</a></li>
              <li><a href="#impact-estimator" className="hover:text-white transition">Residential Estimator</a></li>
              <li><a href="#impact-estimator" className="hover:text-white transition">Corporate B2B Auditing</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="font-mono font-bold uppercase tracking-wider text-[#2ECC71]">
              Science & Standards
            </div>
            <ul className="space-y-2 text-white/80">
              <li><a href="#impact-dashboard" className="hover:text-white transition">Impact Telemetry Dashboard</a></li>
              <li><Link to="/truth-lab" className="hover:text-white transition">Truth Lab Benchmarks</Link></li>
              <li><Link to="/learn" className="hover:text-white transition">Chemical Purity Criteria</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition">Lifecycle Methodology</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="font-mono font-bold uppercase tracking-wider text-[#2ECC71]">
              Platform & Tools
            </div>
            <ul className="space-y-2 text-white/80">
              <li><Link to="/shop" className="hover:text-white transition">Eco Catalog Store</Link></li>
              <li><Link to="/tools" className="hover:text-white transition">Calculators & Toolkits</Link></li>
              <li><Link to="/scan" className="hover:text-white transition">Packaging Scanner</Link></li>
              <li><Link to="/news" className="hover:text-white transition">Environmental News</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="font-mono font-bold uppercase tracking-wider text-[#2ECC71]">
              Account & Legal
            </div>
            <ul className="space-y-2 text-white/80">
              <li><Link to="/login" className="hover:text-white transition">Client Portal Sign In</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact Support</Link></li>
              <li><Link to="/settings" className="hover:text-white transition">Accessibility & Settings</Link></li>
              <li><Link to="/profile" className="hover:text-white transition">Data Privacy Center</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & School Notice */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/60">
          <div>
            &copy; {currentYear} Eco Sense Platform. All rights reserved.
          </div>
          <div className="text-center sm:text-right">
            Sample products and metrics for a school project. Prices and impact numbers are estimates.
          </div>
        </div>
      </div>
    </footer>
  );
}

