import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Leaf,
  Search,
  Heart,
  Globe,
  ChevronDown,
  Menu,
  X,
  Swords,
  Camera,
  Store,
  RefreshCw,
  ShieldCheck,
  Scale,
  Sliders,
  FileCheck,
  Bot
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useT } from '../context/I18nContext';
import { FEATURES } from '../lib/features';
import UserMenu from './UserMenu';
import ThemeToggle from './ThemeToggle';

const MORE_LINKS = [
  { path: '/courtroom', label: 'AI Courtroom', icon: Swords, badge: 'Simulated trial' },
  { path: '/scan', label: 'Label Scanner', icon: Camera, badge: 'Vision OCR' },
  { path: '/kirana', label: 'Kirana Mode', icon: Store, badge: 'Desi packaging' },
  { path: '/transform', label: 'Cart Transformer', icon: RefreshCw, badge: '1-tap swap' },
  { path: '/eco-check', label: 'Eco Check', icon: ShieldCheck, badge: 'Purity audit' },
  { path: '/fairness', label: 'Fairness Lab', icon: Scale, badge: 'Linguistic parity' },
  { path: '/playground', label: 'Decision Playground', icon: Sliders, badge: 'Counterfactuals' },
  { path: '/self-audit', label: 'AI Self-Audit', icon: FileCheck, badge: 'Transparency' }
];

export default function Navbar() {
  const location = useLocation();
  const { impact, setIsCartOpen, setIsAgentOpen, wishlist } = useCart();
  const { t, lang, toggleLanguage } = useT();
  const currentPath = location.pathname;

  const [isScrolled, setIsScrolled] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const moreRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click or escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setMoreOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMoreOpen(false);
    setMobileMenuOpen(false);
  }, [currentPath]);

  const primaryLinks = [
    { path: '/', label: lang === 'hi' ? 'होम' : 'Home' },
    { path: '/shop', label: t('nav.shop', 'Shop') },
    {
      id: 'agent',
      label: t('nav.agent', 'Eco Agent'),
      isAction: true,
      onClick: () => setIsAgentOpen(true)
    },
    { path: '/tools', label: t('nav.tools', 'Tools') },
    { path: '/how-it-works', label: t('nav.howItWorks', 'How it works') }
  ];

  const isLinkActive = (path) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  const isMoreActive = MORE_LINKS.some((item) => currentPath.startsWith(item.path));

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-surface/90 backdrop-blur-xl border-b border-line shadow-soft-sm'
          : 'bg-surface/60 backdrop-blur-md border-b border-line/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group select-none py-1 focus-visible:outline-2 focus-visible:outline-focus rounded-full"
        >
          <div className="w-9 h-9 rounded-full bg-surface-raised border border-line text-primary flex items-center justify-center font-bold shadow-soft-xs group-hover:scale-105 group-hover:border-primary/50 transition-all duration-200">
            <Leaf className="w-4 h-4 text-primary" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold tracking-tight text-heading">
              Eco<span className="text-primary italic">Mart</span>
            </span>
            <span className="text-xs font-sans font-medium px-2 py-0.5 rounded-full bg-surface-accent border border-primary/20 text-primary hidden sm:inline-block">
              Agent
            </span>
          </div>
        </Link>

        {/* 5 Primary Navigation Links + More Dropdown (Sentence case, no wrapping) */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium" aria-label="Main Navigation">
          {primaryLinks.map((link) => {
            if (link.isAction) {
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={link.onClick}
                  className="flex items-center gap-1.5 text-text-secondary hover:text-heading transition-colors py-2 cursor-pointer font-sans"
                >
                  <Bot className="w-4 h-4 text-primary" />
                  <span>{link.label}</span>
                </button>
              );
            }

            const active = isLinkActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors py-2 relative flex items-center whitespace-nowrap font-sans ${
                  active ? 'text-primary font-semibold' : 'text-text-secondary hover:text-heading'
                }`}
              >
                <span>{link.label}</span>
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}

          {/* More Mega-Menu Dropdown */}
          <div className="relative" ref={moreRef}>
            <button
              type="button"
              onClick={() => setMoreOpen((prev) => !prev)}
              className={`flex items-center gap-1 py-2 font-sans transition-colors cursor-pointer whitespace-nowrap ${
                isMoreActive || moreOpen ? 'text-primary font-semibold' : 'text-text-secondary hover:text-heading'
              }`}
              aria-expanded={moreOpen}
              aria-haspopup="true"
            >
              <span>More</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${moreOpen ? 'rotate-180 text-primary' : 'text-text-muted'}`}
              />
            </button>

            {/* Dropdown Panel */}
            {moreOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 p-2.5 rounded-2xl bg-surface-raised border border-line shadow-soft-lg z-50 animate-scale-up grid grid-cols-1 gap-1">
                <div className="px-3 py-1.5 text-[11px] font-sans font-semibold uppercase tracking-wider text-text-muted border-b border-line mb-1">
                  Responsible AI Labs & Tools
                </div>
                {MORE_LINKS.map((item) => {
                  const Icon = item.icon;
                  const active = currentPath.startsWith(item.path);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-sans transition-all ${
                        active
                          ? 'bg-surface-accent text-primary font-semibold'
                          : 'text-text hover:bg-surface-sunken hover:text-heading'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-primary shrink-0" />
                        <span className="font-medium text-heading">{item.label}</span>
                      </div>
                      <span className="text-[10px] text-text-muted font-normal bg-surface px-2 py-0.5 rounded-md border border-line">
                        {item.badge}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Action Controls (Clean, uncluttered, tooltips) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Command Palette Trigger */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('toggle-command-palette'))}
            title="Search & Quick Actions (Ctrl+K)"
            aria-label="Search and command palette"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-line bg-surface-raised/70 hover:bg-surface-raised text-text-muted hover:text-heading text-xs font-sans transition cursor-pointer min-h-[40px]"
          >
            <Search className="w-3.5 h-3.5 text-text-muted" />
            <span className="hidden sm:inline font-medium">Search</span>
            <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] bg-surface-sunken border border-line rounded text-text-muted font-mono font-semibold">
              ⌘K
            </kbd>
          </button>

          {/* Theme Toggle (Dark / Light) */}
          <ThemeToggle />

          {/* Language Switch Button */}
          {FEATURES.HINDI_LANGUAGE && (
            <button
              type="button"
              onClick={toggleLanguage}
              title={lang === 'en' ? 'Switch to Hindi (हिंदी)' : 'Switch to English'}
              aria-label={`Switch language: ${lang === 'en' ? 'Hindi' : 'English'}`}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-line bg-surface-raised/70 hover:bg-surface-raised text-heading text-xs font-sans font-medium transition cursor-pointer min-h-[40px]"
            >
              <Globe className="w-3.5 h-3.5 text-primary" />
              <span>{lang === 'en' ? 'हिंदी' : 'EN'}</span>
            </button>
          )}

          {/* Wishlist Button */}
          <Link
            to="/wishlist"
            title="Saved Wishlist"
            aria-label="View wishlist"
            className="relative p-2.5 rounded-full border border-line bg-surface-raised/70 hover:bg-surface-raised text-text-muted hover:text-danger transition min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
          >
            <Heart className="w-4 h-4" />
            {wishlist && wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-danger text-white text-[9px] font-mono font-bold flex items-center justify-center shadow-xs">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Judge Demo Walkthrough Trigger */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('open-judge-walkthrough'))}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-sans text-xs font-semibold transition-all shadow-soft-xs cursor-pointer min-h-[40px]"
            title="Launch Responsible AI competition demo walkthrough"
            aria-label="Launch Judge Demo Walkthrough"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>Judge Demo</span>
          </button>

          {/* User Account Menu */}
          <UserMenu />

          {/* Cart Trigger with live count badge */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-primary hover:bg-primary-hover text-primary-contrast text-xs font-semibold shadow-soft-xs transition-all cursor-pointer min-h-[40px]"
            aria-label={`Shopping cart with ${impact.totalItems} items`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-sans">{t('nav.cart', 'Cart')}</span>
            {impact.totalItems > 0 && (
              <span className="px-1.5 py-0.2 bg-white text-primary text-[10px] rounded-full font-bold ml-0.5">
                {impact.totalItems}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-full border border-line bg-surface-raised/70 text-text-muted hover:text-heading cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label={mobileMenuOpen ? 'Close navigation drawer' : 'Open navigation drawer'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Clean, non-cramped slide-down menu) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-18 bg-surface/98 backdrop-blur-2xl border-b border-line shadow-soft-lg p-5 space-y-4 max-h-[85vh] overflow-y-auto z-40 animate-slide-down">
          <div className="space-y-1">
            <div className="text-[11px] font-sans font-semibold uppercase tracking-wider text-text-muted px-2 py-1">
              Primary Navigation
            </div>
            {primaryLinks.map((link) => {
              if (link.isAction) {
                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => {
                      link.onClick();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans font-medium text-text hover:bg-surface-sunken"
                  >
                    <Bot className="w-4 h-4 text-primary" />
                    <span>{link.label}</span>
                  </button>
                );
              }
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans font-medium ${
                    isLinkActive(link.path)
                      ? 'bg-surface-accent text-primary font-semibold'
                      : 'text-text hover:bg-surface-sunken'
                  }`}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-line space-y-1">
            <div className="text-[11px] font-sans font-semibold uppercase tracking-wider text-text-muted px-2 py-1">
              Responsible AI Labs & Tools
            </div>
            <div className="grid grid-cols-2 gap-2">
              {MORE_LINKS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl bg-surface-raised border border-line text-xs font-sans font-medium flex items-center gap-2 text-heading"
                  >
                    <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-line flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                window.dispatchEvent(new CustomEvent('open-judge-walkthrough'));
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-700 dark:text-amber-300"
            >
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>Launch Judge Demo</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
