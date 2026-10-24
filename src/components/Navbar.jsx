import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Sparkles, Leaf, Search, Heart, Scale, Globe } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useT } from '../context/I18nContext';
import { FEATURES } from '../lib/features';
import UserMenu from './UserMenu';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const location = useLocation();
  const { impact, setIsCartOpen, setIsAgentOpen, wishlist, compareList, setIsCompareOpen } = useCart();
  const { t, lang, toggleLanguage } = useT();
  const currentPath = location.pathname;

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: lang === 'hi' ? 'होम' : 'Home' },
    { path: '/shop', label: t('nav.shop', 'Catalog') },
    { path: '/courtroom', label: lang === 'hi' ? 'अदालत' : 'Courtroom' },
    { path: '/scan', label: lang === 'hi' ? 'स्कैन' : 'Scan' },
    { path: '/kirana', label: 'किराना' },
    ...(FEATURES.CART_TRANSFORMER ? [{ path: '/transform', label: t('nav.transform', 'Transformer') }] : []),
    { path: '/eco-check', label: t('nav.ecoCheck', 'Eco Check') },
    { path: '/tools', label: t('nav.tools', 'Eco Tools') },
    { path: '/fairness', label: 'Fairness' },
    { path: '/how-it-works', label: t('nav.howItWorks', 'Methodology') }
  ];

  const isLinkActive = (path) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-surface/85 backdrop-blur-xl border-b border-line shadow-soft-md'
          : 'bg-surface/40 backdrop-blur-md border-b border-line/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group select-none py-1 focus-visible:outline-2 focus-visible:outline-focus rounded-full"
        >
          <div className="w-9 h-9 rounded-full bg-surface-raised border border-line text-primary flex items-center justify-center font-bold shadow-soft-sm group-hover:scale-105 group-hover:border-primary/50 transition-all duration-200">
            <Leaf className="w-4 h-4 text-primary" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold tracking-tight text-heading">
              Eco<span className="text-primary italic">Mart</span>
            </span>
            <span className="text-[10px] font-mono font-medium uppercase tracking-[0.2em] px-2 py-0.5 rounded-full bg-surface-accent border border-primary/25 text-primary hidden sm:inline-block">
              AI Agent
            </span>
          </div>
        </Link>

        {/* Navigation Links - Desktop */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-mono uppercase tracking-[0.14em]" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`transition-colors py-2 relative min-h-[44px] flex items-center ln-sweep ${
                isLinkActive(link.path)
                  ? 'text-primary font-bold'
                  : 'text-text-muted hover:text-heading'
              }`}
            >
              {link.label}
              {isLinkActive(link.path) && (
                <span className="absolute bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              )}
            </Link>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Command Palette Trigger */}
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(new CustomEvent('toggle-command-palette'));
            }}
            title="Search & Quick Actions (Ctrl+K)"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-line bg-surface-raised/60 hover:bg-surface-raised hover:border-primary/40 text-text-muted hover:text-heading text-xs font-mono transition cursor-pointer min-h-[44px]"
          >
            <Search className="w-3.5 h-3.5 text-text-muted" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline px-1.5 py-0.5 text-[9px] font-mono bg-surface-sunken border border-line rounded text-text-muted font-bold">
              ⌘K
            </kbd>
          </button>

          {/* Theme & Motion Toggle (Dark / Light & Reduced Effects) */}
          <ThemeToggle />

          {/* Wishlist Button */}
          <Link
            to="/wishlist"
            title="Saved Items"
            className="relative p-2.5 rounded-full border border-line bg-surface-raised/60 hover:bg-surface-raised text-text-muted hover:text-danger transition min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          >
            <Heart className="w-4 h-4" />
            {wishlist && wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-danger text-white text-[9px] font-mono font-bold flex items-center justify-center shadow-xs">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Compare Button */}
          {compareList && compareList.length > 0 && (
            <button
              type="button"
              onClick={() => setIsCompareOpen(true)}
              title="Compare Diagnostics"
              className="relative p-2.5 rounded-full border border-line bg-surface-raised/60 hover:bg-surface-raised text-text-muted hover:text-secondary transition min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            >
              <Scale className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-contrast text-[9px] font-mono font-bold flex items-center justify-center shadow-xs">
                {compareList.length}
              </span>
            </button>
          )}

          {/* Language Switch Button (Phase 7) */}
          {FEATURES.HINDI_LANGUAGE && (
            <button
              type="button"
              onClick={toggleLanguage}
              title={lang === 'en' ? 'Switch to Hindi (हिंदी)' : 'Switch to English'}
              aria-label={`Current language: ${lang === 'en' ? 'English' : 'Hindi'}. Click to switch.`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-line bg-surface-raised/60 hover:bg-surface-raised text-heading text-xs font-mono font-semibold transition cursor-pointer min-h-[44px]"
            >
              <Globe className="w-3.5 h-3.5 text-primary" />
              <span>{lang === 'en' ? 'हिंदी' : 'EN'}</span>
            </button>
          )}

          {/* User Account Menu */}
          <UserMenu />

          {/* Judge Demo Mode Walkthrough Trigger */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('open-judge-walkthrough'))}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 font-mono text-xs font-bold transition-all shadow-soft-xs cursor-pointer min-h-[44px]"
            title="Launch 4-step Responsible AI competition demo walkthrough"
            aria-label="Launch Judge Demo Walkthrough"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span>Judge Demo</span>
          </button>

          {/* Launch EcoAgent AI Co-Pilot */}
          <button
            type="button"
            onClick={() => setIsAgentOpen(true)}
            className="liquid-pill liquid-pill-dark text-xs gap-1.5"
            title="Launch Responsible AI Eco Agent Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="hidden sm:inline">{t('nav.agent', 'Eco Agent')}</span>
          </button>

          {/* Cart Trigger with bounce */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="liquid-pill liquid-pill-emerald text-xs gap-2"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-surface" />
            <span className="hidden sm:inline">{t('nav.cart', 'Cart')}</span>
            {impact.totalItems > 0 && (
              <span className="px-1.5 py-0.2 bg-surface text-primary text-[10px] rounded-full font-bold ml-0.5">
                {impact.totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

