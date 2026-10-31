import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight, ShieldCheck, Sparkles, BarChart3, Leaf } from 'lucide-react';

export default function GreenTechNav({ onRequestAudit, onOpenDashboard }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F8F9FA]/90 backdrop-blur-md shadow-[0px_10px_30px_rgba(15,61,46,0.06)] border-b border-[#0F3D2E]/10'
          : 'bg-[#F8F9FA]/80 backdrop-blur-sm border-b border-[#0F3D2E]/5'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-[120px] h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & SaaS Badge */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2.5 select-none focus-visible:outline-2 focus-visible:outline-[#2ECC71] rounded-xl"
            aria-label="Eco Sense Platform Home"
          >
            <img
              src="/images/logo.png"
              alt="Eco Sense - Green Cleaning & Waste Management"
              width="135"
              height="40"
              className="h-9 sm:h-10 w-auto object-contain"
            />
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-sans font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#0F3D2E]/5 text-[#0F3D2E] border border-[#0F3D2E]/10">
              <Sparkles className="w-3 h-3 text-[#2ECC71]" /> Green-Tech SaaS
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#2C3E50]">
          <button
            type="button"
            onClick={() => scrollToSection('core-services')}
            className="hover:text-[#0F3D2E] transition-colors py-1 cursor-pointer flex items-center gap-1"
          >
            <span>Services</span>
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('impact-estimator')}
            className="hover:text-[#0F3D2E] transition-colors py-1 cursor-pointer"
          >
            <span>Estimator</span>
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('impact-dashboard')}
            className="hover:text-[#0F3D2E] transition-colors py-1 cursor-pointer flex items-center gap-1.5"
          >
            <BarChart3 className="w-4 h-4 text-[#2ECC71]" />
            <span>Impact Dashboard</span>
          </button>
          <Link
            to="/shop"
            className="hover:text-[#0F3D2E] transition-colors py-1 flex items-center gap-1"
          >
            <span>Eco Catalog</span>
          </Link>
          <Link
            to="/learn"
            className="hover:text-[#0F3D2E] transition-colors py-1"
          >
            <span>Standards</span>
          </Link>
        </nav>

        {/* Right Action Cluster */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-xs font-semibold text-[#0F3D2E] hover:text-[#0F3D2E]/80 transition min-h-[44px] flex items-center"
          >
            Client Portal
          </Link>
          <button
            type="button"
            onClick={onRequestAudit}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0F3D2E] text-white hover:bg-[#0F3D2E]/90 text-xs font-semibold shadow-[0px_10px_20px_rgba(15,61,46,0.15)] hover:shadow-[0px_12px_24px_rgba(46,204,113,0.25)] hover:border-[#2ECC71] border border-transparent transition-all duration-200 cursor-pointer min-h-[44px]"
          >
            <span>Request Eco-Audit</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#2ECC71]" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            type="button"
            onClick={onRequestAudit}
            className="px-3 py-1.5 rounded-full bg-[#0F3D2E] text-white text-[11px] font-semibold min-h-[44px] flex items-center"
          >
            Audit
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl border border-[#0F3D2E]/10 bg-white text-[#0F3D2E] min-w-[48px] min-h-[48px] flex items-center justify-center cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Full-screen Mobile Overlay Menu (375px parity) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-20 bottom-0 bg-[#F8F9FA]/98 backdrop-blur-xl z-50 p-6 flex flex-col justify-between border-t border-[#0F3D2E]/10 overflow-y-auto animate-fade-in">
          <div className="space-y-4 pt-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#0F3D2E]/60">Platform Navigation</p>
            <div className="flex flex-col space-y-2">
              <button
                type="button"
                onClick={() => scrollToSection('core-services')}
                className="w-full text-left p-3.5 rounded-2xl bg-white border border-[#0F3D2E]/8 text-sm font-semibold text-[#0F3D2E] flex items-center justify-between min-h-[48px]"
              >
                <span>Core Services</span>
                <ArrowRight className="w-4 h-4 text-[#2ECC71]" />
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('impact-estimator')}
                className="w-full text-left p-3.5 rounded-2xl bg-white border border-[#0F3D2E]/8 text-sm font-semibold text-[#0F3D2E] flex items-center justify-between min-h-[48px]"
              >
                <span>Green Impact Estimator</span>
                <ArrowRight className="w-4 h-4 text-[#2ECC71]" />
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('impact-dashboard')}
                className="w-full text-left p-3.5 rounded-2xl bg-white border border-[#0F3D2E]/8 text-sm font-semibold text-[#0F3D2E] flex items-center justify-between min-h-[48px]"
              >
                <span>Live Impact Dashboard</span>
                <BarChart3 className="w-4 h-4 text-[#2ECC71]" />
              </button>
              <Link
                to="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-left p-3.5 rounded-2xl bg-white border border-[#0F3D2E]/8 text-sm font-semibold text-[#0F3D2E] flex items-center justify-between min-h-[48px]"
              >
                <span>Eco Shopping Catalog</span>
                <Leaf className="w-4 h-4 text-[#2ECC71]" />
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t border-[#0F3D2E]/10 space-y-3 pb-8">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onRequestAudit();
              }}
              className="w-full py-3.5 rounded-2xl bg-[#0F3D2E] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-soft-sm min-h-[48px]"
            >
              <span>Request Eco-Audit</span>
              <ArrowRight className="w-4 h-4 text-[#2ECC71]" />
            </button>
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-2xl bg-white border border-[#0F3D2E]/10 text-center text-xs font-semibold text-[#0F3D2E] block min-h-[48px] flex items-center justify-center"
            >
              Client Login & Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

