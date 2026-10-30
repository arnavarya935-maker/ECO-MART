import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
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
  Sparkles,
  HelpCircle,
  Lock,
  Wifi,
  WifiOff,
  Mail
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useT } from '../context/I18nContext';
import { FEATURES } from '../lib/features';
import UserMenu from './UserMenu';
import ThemeToggle from './ThemeToggle';

const MORE_LINKS = [
  { path: '/truth-lab', label: 'Truth Lab', desc: 'Compare products and test claims with facts', icon: ShieldCheck },
  { path: '/courtroom', label: 'AI Courtroom', desc: 'A fun mock trial testing marketing claims with facts', icon: Swords },
  { path: '/dilemmas', label: 'Moral Dilemmas', desc: 'Explore trade-offs between price, carbon, and plastic', icon: Scale },
  { path: '/self-audit', label: 'AI Self-Audit', desc: 'See tests for fairness and rules used by our helper', icon: FileCheck },
  { path: '/fairness', label: 'Fairness Lab', desc: 'Check that recommendations treat all categories fairly', icon: Scale },
  { path: '/duel', label: 'Product Duel', desc: 'Put two products side by side to compare harm to nature', icon: Swords },
  { path: '/scan', label: 'Label Scanner', desc: 'Use your camera to read product packaging', icon: Camera },
  { path: '/kirana', label: 'Kirana Mode', desc: 'Quick voice shopping for everyday household staples', icon: Store },
  { path: '/playground', label: 'Decision Playground', desc: 'Slide weights to choose what matters most to you', icon: Sliders },
  { path: '/how-it-works', label: 'How It Works', desc: 'Simple guide to how we score products and impact', icon: HelpCircle },
  { path: '/community', label: 'Community', desc: 'See sample pledges and tips from conscious shoppers', icon: Bot },
  { path: '/tools', label: 'Tools', desc: 'Helpful calculators and starter bundles', icon: RefreshCw },
  { path: '/contact', label: 'Contact Us', desc: 'Send us questions, suggestions or feedback', icon: Mail }
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
    { path: '/transform', label: t('nav.transform', 'Swap My List') },
    { path: '/eco-check', label: t('nav.ecoCheck', 'Check a Claim') },
    { path: '/impact', label: t('nav.impact', 'My Impact') },
    { path: '/learn', label: t('nav.learn', 'Learn') },
    { path: '/news', label: t('nav.news', 'News') },
    { path: '/settings', label: t('nav.settings', 'Settings') }
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
            className="flex items-center gap-2.5 group select-none py-1 focus-visible:outline-2 focus-visible:outline-focus rounded-2xl"
            aria-label={lang === 'hi' ? 'इको सेंस होम' : 'Eco Sense Home'}
          >
            <img
              src="/images/logo.png"
              alt="EcoSense - Shop with sense. Shop with purpose."
              width="140"
              height="43"
              className="h-10 sm:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-105 dark:hidden"
            />
            <img
              src="/images/logo-dark.png"
              alt="EcoSense - Shop with sense. Shop with purpose."
              width="140"
              height="43"
              className="h-10 sm:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-105 hidden dark:block"
            />
            <span className="text-[10px] font-sans font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-accent border border-primary/20 text-primary hidden md:inline-block">
              Agent
            </span>
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
                          <div className="flex flex-col min-w-0 pr-1">
                            <div className="flex items-center gap-2 truncate">
                              <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
                              <span className="font-medium text-heading truncate">{item.label}</span>
                            </div>
                            {item.desc && (
                              <span className="text-[10px] text-text-muted truncate ml-5.5">{item.desc}</span>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Preferences & Quick Toggles Sub-bar */}
                <div className="pt-2.5 border-t border-line/70 flex items-center justify-between gap-2 flex-wrap bg-surface-sunken/40 -mx-4 -mb-4 p-3 rounded-b-3xl">
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
            <span className="font-sans">{t('nav.agent', 'Eco Agent')}</span>
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
          {/* Mobile AI Status Bar */}
          <div className="p-3 rounded-2xl bg-surface-sunken border border-line flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-heading">Eco Agent</div>
              <div className="text-[11px] text-text-muted">
                Gemini Cloud AI Connected
              </div>
            </div>
            <div className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>Connected</span>
            </div>
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
                    className="p-2 rounded-xl bg-surface-raised border border-line text-xs font-sans font-medium flex flex-col gap-0.5 text-heading"
                  >
                    <div className="flex items-center gap-1.5 font-semibold text-primary truncate">
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.desc && (
                      <span className="text-[10px] text-text-muted truncate ml-5">{item.desc}</span>
                    )}
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
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1 text-xs hover:text-heading"
              >
                Contact
              </Link>
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
