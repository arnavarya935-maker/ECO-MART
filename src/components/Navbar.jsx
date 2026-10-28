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
  Bot,
  Bell,
  Eye,
  Newspaper,
  Sparkles,
  HelpCircle,
  Lock,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useT } from '../context/I18nContext';
import { FEATURES } from '../lib/features';
import UserMenu from './UserMenu';
import ThemeToggle from './ThemeToggle';

const MORE_LINKS = [
  { path: '/news', label: 'Eco News Watch', icon: Newspaper, badge: 'Live Updates' },
  { path: '/courtroom', label: 'AI Courtroom', icon: Swords, badge: 'Mock Trial' },
  { path: '/dilemmas', label: 'Moral Dilemmas', icon: Scale, badge: 'Ethical Trade-offs' },
  { path: '/self-audit', label: 'AI Self-Audit', icon: FileCheck, badge: 'Bias & Calibration' },
  { path: '/blackbox', label: 'BlackBox Audit', icon: ShieldCheck, badge: 'Reasoning Log' },
  { path: '/fairness', label: 'Fairness Lab', icon: Scale, badge: 'Demographic Parity' },
  { path: '/duel', label: 'LCA Product Duel', icon: Swords, badge: 'Carbon Face-off' },
  { path: '/scan', label: 'Label Scanner', icon: Camera, badge: 'Camera OCR' },
  { path: '/kirana', label: 'Kirana Mode', icon: Store, badge: 'Voice-First Hindi' },
  { path: '/transform', label: 'Cart Transformer', icon: RefreshCw, badge: 'Knapsack Solver' },
  { path: '/eco-check', label: 'Eco Check', icon: ShieldCheck, badge: 'Purity Audit' },
  { path: '/playground', label: 'Decision Playground', icon: Sliders, badge: 'Interactive Weights' },
  { path: '/transparency', label: 'Agent Transparency', icon: ShieldCheck, badge: 'Multi-Agent Specs' },
  { path: '/how-it-works', label: 'How It Works', icon: HelpCircle, badge: '5-Pillar Formula' }
];

export default function Navbar() {
  const location = useLocation();
  const { impact, setIsCartOpen, setIsAgentOpen, wishlist, agentMode, toggleAgentMode } = useCart();
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
    { path: '/shop', label: t('nav.shop', 'Shop') },
    { path: '/truth-lab', label: 'Truth Lab' },
    { path: '/impact', label: 'Impact' },
    { path: '/tools', label: 'Tools' },
    { path: '/learn', label: 'Learn' },
    { path: '/community', label: 'Community' }
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
          ? 'bg-surface/92 backdrop-blur-xl border-b border-line shadow-soft-sm'
          : 'bg-surface/75 backdrop-blur-md border-b border-line/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3">
        {/* 1. LEFT: Brand Logo */}
        <div className="flex items-center shrink-0">
          <Link
            to="/"
            className="flex items-center gap-2.5 group select-none py-1 focus-visible:outline-2 focus-visible:outline-focus rounded-full"
            aria-label={lang === 'hi' ? 'इको सेंस होम' : 'Eco Sense Home'}
          >
            <div className="w-9 h-9 rounded-full bg-surface-raised border border-line text-primary flex items-center justify-center font-bold shadow-soft-xs group-hover:scale-105 group-hover:border-primary/50 transition-all duration-200">
              <Leaf className="w-4 h-4 text-primary" />
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="font-heading text-2xl font-bold tracking-tight text-heading">
                {lang === 'hi' ? 'इको ' : 'Eco'}<span className="text-primary italic font-semibold">{lang === 'hi' ? 'सेंस' : 'Sense'}</span>
              </span>
              <span className="text-[10px] font-sans font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-accent border border-primary/20 text-primary hidden sm:inline-block">
                Agent
              </span>
            </div>
          </Link>
        </div>

        {/* 2. CENTRE: Main Navigation Links + More Menu */}
        <nav
          className="hidden lg:flex items-center gap-6 xl:gap-7 text-sm font-medium"
          aria-label="Main Navigation"
        >
          {primaryLinks.map((link) => {
            const active = isLinkActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors py-2 relative flex items-center whitespace-nowrap font-sans text-sm ${
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

          {/* More Dropdown Menu */}
          <div className="relative" ref={moreRef}>
            <button
              type="button"
              onClick={() => setMoreOpen((prev) => !prev)}
              className={`flex items-center gap-1.5 py-2 font-sans text-sm transition-colors cursor-pointer whitespace-nowrap ${
                isMoreActive || moreOpen
                  ? 'text-primary font-semibold'
                  : 'text-text-secondary hover:text-heading'
              }`}
              aria-expanded={moreOpen}
              aria-haspopup="true"
            >
              <span>More</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  moreOpen ? 'rotate-180 text-primary' : 'text-text-muted'
                }`}
              />
            </button>

            {/* More Mega-Menu Dropdown Panel */}
            {moreOpen && (
              <div className="absolute top-full -left-20 xl:left-0 mt-2 w-[520px] p-4 rounded-3xl bg-surface-raised border border-line shadow-soft-lg z-50 animate-scale-up space-y-3">
                {/* Secondary Feature Links (2 columns) */}
                <div>
                  <div className="px-2 py-1 text-[11px] font-sans font-semibold uppercase tracking-wider text-text-muted flex items-center justify-between border-b border-line/60 pb-1.5 mb-2">
                    <span>Research Labs & Tools</span>
                    <span className="text-[10px] text-primary lowercase font-mono">14 deep features</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 max-h-[300px] overflow-y-auto pr-1">
                    {MORE_LINKS.map((item) => {
                      const Icon = item.icon;
                      const active = currentPath.startsWith(item.path);

                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setMoreOpen(false)}
                          className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-sans transition-all min-h-[38px] ${
                            active
                              ? 'bg-surface-accent text-primary font-semibold'
                              : 'text-text hover:bg-surface-sunken hover:text-heading'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className="text-[10px] text-text-muted font-normal bg-surface px-1.5 py-0.5 rounded border border-line/70 shrink-0 ml-1 hidden sm:inline-block">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Preferences & Quick Toggles Sub-bar */}
                <div className="pt-2.5 border-t border-line/70 flex items-center justify-between gap-2 flex-wrap bg-surface-sunken/40 -mx-4 -mb-4 p-3 rounded-b-3xl">
                  {/* AI Mode Selector */}
                  <button
                    type="button"
                    onClick={toggleAgentMode}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-sans font-semibold transition cursor-pointer select-none ${
                      agentMode === 'online'
                        ? 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
                    }`}
                    title="Toggle Gemini Cloud AI vs Local Offline Heuristics"
                  >
                    {agentMode === 'online' ? (
                      <Wifi className="w-3 h-3 text-primary" />
                    ) : (
                      <WifiOff className="w-3 h-3 text-amber-500" />
                    )}
                    <span>{agentMode === 'online' ? 'Online AI' : 'Offline AI'}</span>
                  </button>

                  {/* Dark Mode Toggle */}
                  <div className="flex items-center gap-1">
                    <ThemeToggle />
                  </div>

                  {/* Language Toggle */}
                  {FEATURES.HINDI_LANGUAGE && (
                    <button
                      type="button"
                      onClick={toggleLanguage}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-line bg-surface hover:bg-surface-raised text-heading text-xs font-sans font-medium transition cursor-pointer"
                      title={lang === 'en' ? 'Switch to Hindi (हिंदी)' : 'Switch to English'}
                    >
                      <Globe className="w-3 h-3 text-primary" />
                      <span>{lang === 'en' ? 'हिंदी' : 'EN'}</span>
                    </button>
                  )}

                  {/* Utility Centers Quick Links */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('open-notification-center'));
                        setMoreOpen(false);
                      }}
                      title="Notifications"
                      className="p-1.5 rounded-full hover:bg-surface text-text-muted hover:text-heading transition cursor-pointer"
                    >
                      <Bell className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('open-accessibility-center'));
                        setMoreOpen(false);
                      }}
                      title="Accessibility Center"
                      className="p-1.5 rounded-full hover:bg-surface text-text-muted hover:text-heading transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('open-privacy-center'));
                        setMoreOpen(false);
                      }}
                      title="Privacy Center"
                      className="p-1.5 rounded-full hover:bg-surface text-text-muted hover:text-heading transition cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* 3. RIGHT: Tidy Action Cluster (Search, Wishlist, Ask Agent, Cart, User) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* A. Search Trigger (⌘K) */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('toggle-command-palette'))}
            title="Search & Quick Commands (Ctrl+K / ⌘K)"
            aria-label="Search catalog and commands"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-line bg-surface-raised/70 hover:bg-surface-raised text-text-secondary hover:text-heading text-xs font-sans transition cursor-pointer min-h-[40px]"
          >
            <Search className="w-3.5 h-3.5 text-text-muted" />
            <span className="hidden sm:inline font-medium">Search</span>
            <kbd className="hidden md:inline px-1.5 py-0.5 text-[10px] bg-surface-sunken border border-line rounded text-text-muted font-mono font-semibold">
              ⌘K
            </kbd>
          </button>

          {/* B. Wishlist Button */}
          <Link
            to="/wishlist"
            title="Saved Wishlist"
            aria-label="View wishlist"
            className="relative p-2.5 rounded-full border border-line bg-surface-raised/70 hover:bg-surface-raised text-text-secondary hover:text-danger transition min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
          >
            <Heart className="w-4 h-4" />
            {wishlist && wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-danger text-white text-[10px] font-mono font-bold flex items-center justify-center shadow-xs">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* C. Ask Agent AI Trigger Button */}
          <button
            type="button"
            onClick={() => setIsAgentOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary-active text-xs font-sans font-semibold transition-all cursor-pointer min-h-[40px] shadow-soft-xs"
            title="Open Eco Agent AI Chat"
            aria-label="Ask Eco Agent Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="font-sans">Ask Agent</span>
          </button>

          {/* D. Shopping Cart Button */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary hover:bg-primary-hover text-primary-contrast text-xs font-semibold shadow-soft-xs transition-all cursor-pointer min-h-[40px]"
            aria-label={`Shopping cart with ${impact.totalItems} items`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-sans">{t('nav.cart', 'Cart')}</span>
            {impact.totalItems > 0 && (
              <span className="px-1.5 py-0.2 bg-white text-primary text-[11px] rounded-full font-bold ml-0.5">
                {impact.totalItems}
              </span>
            )}
          </button>

          {/* E. User Account Menu */}
          <UserMenu />

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-full border border-line bg-surface-raised/70 text-text-muted hover:text-heading cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center ml-1"
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
          {/* Mobile AI Mode & Quick Settings Bar */}
          <div className="p-3 rounded-2xl bg-surface-sunken border border-line flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-heading">Eco Agent Mode</div>
              <div className="text-[11px] text-text-muted">
                {agentMode === 'online' ? 'Gemini 2.5 Flash Cloud' : 'Local Deterministic (0ms)'}
              </div>
            </div>
            <button
              type="button"
              onClick={toggleAgentMode}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 cursor-pointer ${
                agentMode === 'online'
                  ? 'bg-primary text-primary-contrast border-primary shadow-soft-xs'
                  : 'bg-amber-500 text-white border-amber-600'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white" />
              <span>{agentMode === 'online' ? 'Online' : 'Offline'}</span>
            </button>
          </div>

          {/* Mobile Primary Navigation Links */}
          <div className="space-y-1">
            <div className="text-xs font-sans font-semibold uppercase tracking-wider text-text-muted px-2 py-1">
              Primary Navigation
            </div>
            {primaryLinks.map((link) => (
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
            ))}
          </div>

          {/* Mobile Secondary Feature Links */}
          <div className="pt-2 border-t border-line space-y-1">
            <div className="text-xs font-sans font-semibold uppercase tracking-wider text-text-muted px-2 py-1">
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

          {/* Mobile Utility Controls Footer */}
          <div className="pt-2 border-t border-line flex items-center justify-between text-xs text-text-muted">
            <div className="flex items-center gap-2">
              <ThemeToggle />
              {FEATURES.HINDI_LANGUAGE && (
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="px-2.5 py-1 rounded-full border border-line bg-surface text-xs font-medium text-heading"
                >
                  {lang === 'en' ? 'हिंदी' : 'EN'}
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('open-accessibility-center'));
                  setMobileMenuOpen(false);
                }}
                className="px-2 py-1 text-xs hover:text-heading"
              >
                Accessibility
              </button>
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('open-privacy-center'));
                  setMobileMenuOpen(false);
                }}
                className="px-2 py-1 text-xs hover:text-heading"
              >
                Privacy
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
