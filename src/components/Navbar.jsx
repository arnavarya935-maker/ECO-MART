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
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Scale,
  Camera,
  Store,
  Sliders,
  HelpCircle,
  FileCheck,
  Swords,
  RefreshCw,
  Mail,
  Users,
  BookOpen,
  Leaf
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useT } from '../context/I18nContext';
import { FEATURES } from '../lib/features';
import { CATEGORIES } from '../data/categories';
import UserMenu from './UserMenu';
import ThemeToggle from './ThemeToggle';

const MORE_LINKS = [
  { path: '/truth-lab', label: 'Truth Lab', desc: 'Compare products and test claims with facts', icon: ShieldCheck },
  { path: '/courtroom', label: 'AI Courtroom', desc: 'Mock trial testing marketing claims with facts', icon: Swords },
  { path: '/dilemmas', label: 'Moral Dilemmas', desc: 'Explore trade-offs between price, carbon, and plastic', icon: Scale },
  { path: '/self-audit', label: 'AI Self-Audit', desc: 'See tests for fairness and rules used by our helper', icon: FileCheck },
  { path: '/fairness', label: 'Fairness Lab', desc: 'Check that recommendations treat all categories fairly', icon: Scale },
  { path: '/duel', label: 'Product Duel', desc: 'Put two products side by side to compare harm to nature', icon: Swords },
  { path: '/scan', label: 'Label Scanner', desc: 'Use your camera to read product packaging', icon: Camera },
  { path: '/kirana', label: 'Kirana Mode', desc: 'Quick voice shopping for everyday household staples', icon: Store },
  { path: '/playground', label: 'Decision Playground', desc: 'Slide weights to choose what matters most to you', icon: Sliders },
  { path: '/how-it-works', label: 'How It Works', desc: 'Simple guide to how we score products and impact', icon: HelpCircle },
  { path: '/tools', label: 'Tools', desc: 'Helpful calculators and starter bundles', icon: RefreshCw },
  { path: '/contact', label: 'Contact Us', desc: 'Send us questions, suggestions or feedback', icon: Mail }
];

export default function Navbar() {
  const location = useLocation();
  const { impact, setIsCartOpen, setIsAgentOpen, wishlist } = useCart();
  const { t, lang, toggleLanguage } = useT();
  const currentPath = location.pathname;

  const [isScrolled, setIsScrolled] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [aboutMenuOpen, setAboutMenuOpen] = useState(false);
  const [impactMenuOpen, setImpactMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const shopRef = useRef(null);
  const aboutRef = useRef(null);
  const impactRef = useRef(null);
  const moreRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (shopRef.current && !shopRef.current.contains(e.target)) setShopMenuOpen(false);
      if (aboutRef.current && !aboutRef.current.contains(e.target)) setAboutMenuOpen(false);
      if (impactRef.current && !impactRef.current.contains(e.target)) setImpactMenuOpen(false);
      if (moreRef.current && !moreRef.current.contains(e.target)) setMoreMenuOpen(false);
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setShopMenuOpen(false);
        setAboutMenuOpen(false);
        setImpactMenuOpen(false);
        setMoreMenuOpen(false);
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
    setShopMenuOpen(false);
    setAboutMenuOpen(false);
    setImpactMenuOpen(false);
    setMoreMenuOpen(false);
    setMobileMenuOpen(false);
  }, [currentPath]);

  const isLinkActive = (path) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-surface/95 backdrop-blur-md border-b border-line shadow-soft-sm'
          : 'bg-surface/85 backdrop-blur-sm border-b border-line/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navbar Row */}
        <div className="h-18 flex items-center justify-between gap-4">
          {/* 1. LEFT: Brand Logo */}
          <div className="flex items-center shrink-0">
            <Link
              to="/"
              className="flex items-center gap-2 group select-none py-1 focus-visible:outline-2 focus-visible:outline-focus rounded-xl"
              aria-label={lang === 'hi' ? 'इको सेंस होम' : 'EcoSense Home'}
            >
              <img
                src="/images/logo.png"
                alt="EcoSense - Shop with purpose"
                width="140"
                height="43"
                className="h-10 sm:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-105 dark:hidden"
              />
              <img
                src="/images/logo-dark.png"
                alt="EcoSense - Shop with purpose"
                width="140"
                height="43"
                className="h-10 sm:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-105 hidden dark:block"
              />
              <span className="hidden sm:inline-flex text-[10px] font-sans font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-accent border border-primary/20 text-primary">
                Nature-Led
              </span>
            </Link>
          </div>

          {/* 2. CENTRE: Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('toggle-command-palette'))}
              className="w-full flex items-center gap-2 px-3.5 py-2 rounded-full border border-line bg-surface-sunken/60 hover:bg-surface-raised text-text-muted hover:text-text text-xs transition cursor-pointer shadow-soft-xs focus-visible:outline-2 focus-visible:outline-focus"
              aria-label="Search catalog or press Command K"
            >
              <Search className="w-3.5 h-3.5 text-text-muted shrink-0" />
              <span className="flex-1 text-left truncate">
                {t('nav.search_placeholder', 'Search eco products, materials, or brands...')}
              </span>
              <kbd className="px-1.5 py-0.5 text-[10px] bg-surface rounded border border-line font-mono font-semibold text-text-muted shrink-0">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* 3. RIGHT: Action Cluster (Mobile Search, Wishlist, Ask Agent, Cart, User, Hamburger) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Mobile Search Trigger */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('toggle-command-palette'))}
              title="Search (⌘K)"
              aria-label="Open search dialog"
              className="md:hidden p-2 rounded-full border border-line bg-surface-raised/70 text-text-muted hover:text-heading cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Saved Wishlist */}
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

            {/* Ask Eco Agent AI */}
            <button
              type="button"
              onClick={() => setIsAgentOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-sans font-semibold transition cursor-pointer min-h-[40px] shadow-soft-xs"
              title="Open Eco Agent"
              aria-label="Ask Eco Agent Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline font-sans">{t('nav.agent', 'Eco Agent')}</span>
            </button>

            {/* Shopping Cart with count badge */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-soft-xs transition cursor-pointer min-h-[40px]"
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

            {/* User / Login Menu */}
            <UserMenu />

            {/* Mobile Drawer Toggle */}
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

        {/* Primary Navigation Row (Desktop) */}
        <nav
          className="hidden lg:flex items-center justify-between border-t border-line/50 py-2.5 text-xs font-medium"
          aria-label="Main Navigation"
        >
          <div className="flex items-center gap-6 xl:gap-8">
            {/* 1. Home */}
            <Link
              to="/"
              className={`py-1 transition-colors relative font-sans ${
                isLinkActive('/') && currentPath === '/'
                  ? 'text-primary font-semibold'
                  : 'text-text-secondary hover:text-heading'
              }`}
            >
              <span>{t('nav.home', 'Home')}</span>
            </Link>

            {/* 2. Shop Dropdown Mega-Menu of Categories */}
            <div className="relative" ref={shopRef}>
              <button
                type="button"
                onClick={() => {
                  setShopMenuOpen((prev) => !prev);
                  setAboutMenuOpen(false);
                  setImpactMenuOpen(false);
                  setMoreMenuOpen(false);
                }}
                className={`flex items-center gap-1 py-1 font-sans transition-colors cursor-pointer ${
                  shopMenuOpen || isLinkActive('/shop')
                    ? 'text-primary font-semibold'
                    : 'text-text-secondary hover:text-heading'
                }`}
                aria-expanded={shopMenuOpen}
                aria-haspopup="true"
              >
                <span>{t('nav.shop', 'Shop')}</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    shopMenuOpen ? 'rotate-180 text-primary' : 'text-text-muted'
                  }`}
                />
              </button>

              {/* Shop Mega-Menu Dropdown */}
              {shopMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-[640px] p-5 rounded-3xl bg-surface-raised border border-line shadow-soft-lg z-50 animate-scale-up space-y-4">
                  <div className="flex items-center justify-between border-b border-line pb-2.5">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-heading">
                        All Sustainable Categories
                      </h4>
                      <p className="text-[11px] text-text-muted">
                        Cradle-to-gate certified essentials for everyday mindful living.
                      </p>
                    </div>
                    <Link
                      to="/shop"
                      onClick={() => setShopMenuOpen(false)}
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                      <span>View All Catalog</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/shop?category=${cat.id}`}
                        onClick={() => setShopMenuOpen(false)}
                        className="p-2.5 rounded-2xl bg-surface hover:bg-surface-accent border border-line/60 hover:border-primary/30 transition flex items-center gap-3 group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-surface-sunken overflow-hidden shrink-0 border border-line flex items-center justify-center">
                          <img
                            src={cat.image}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-200"
                            loading="lazy"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-heading group-hover:text-primary transition truncate">
                            {cat.label}
                          </div>
                          <div className="text-[10px] text-text-muted truncate">
                            {cat.tagline}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. About (Brand Story, Team) */}
            <div className="relative" ref={aboutRef}>
              <button
                type="button"
                onClick={() => {
                  setAboutMenuOpen((prev) => !prev);
                  setShopMenuOpen(false);
                  setImpactMenuOpen(false);
                  setMoreMenuOpen(false);
                }}
                className={`flex items-center gap-1 py-1 font-sans transition-colors cursor-pointer ${
                  aboutMenuOpen || isLinkActive('/how-it-works')
                    ? 'text-primary font-semibold'
                    : 'text-text-secondary hover:text-heading'
                }`}
                aria-expanded={aboutMenuOpen}
                aria-haspopup="true"
              >
                <span>About</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    aboutMenuOpen ? 'rotate-180 text-primary' : 'text-text-muted'
                  }`}
                />
              </button>

              {aboutMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 p-3 rounded-2xl bg-surface-raised border border-line shadow-soft-lg z-50 animate-scale-up space-y-1">
                  <Link
                    to="/how-it-works"
                    onClick={() => setAboutMenuOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-xs hover:bg-surface text-heading transition"
                  >
                    <BookOpen className="w-4 h-4 text-primary" />
                    <div>
                      <div className="font-semibold">Brand Story & Mission</div>
                      <div className="text-[10px] text-text-muted">Why we built EcoMart</div>
                    </div>
                  </Link>
                  <Link
                    to="/how-it-works"
                    onClick={() => setAboutMenuOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-xs hover:bg-surface text-heading transition"
                  >
                    <Users className="w-4 h-4 text-secondary" />
                    <div>
                      <div className="font-semibold">Our Team & Purpose</div>
                      <div className="text-[10px] text-text-muted">Science & school initiative</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* 4. Learn / Blog */}
            <Link
              to="/learn"
              className={`py-1 transition-colors font-sans ${
                isLinkActive('/learn')
                  ? 'text-primary font-semibold'
                  : 'text-text-secondary hover:text-heading'
              }`}
            >
              <span>Learn &amp; Blog</span>
            </Link>

            {/* 5. Impact Dropdown */}
            <div className="relative" ref={impactRef}>
              <button
                type="button"
                onClick={() => {
                  setImpactMenuOpen((prev) => !prev);
                  setShopMenuOpen(false);
                  setAboutMenuOpen(false);
                  setMoreMenuOpen(false);
                }}
                className={`flex items-center gap-1 py-1 font-sans transition-colors cursor-pointer ${
                  impactMenuOpen || isLinkActive('/impact')
                    ? 'text-primary font-semibold'
                    : 'text-text-secondary hover:text-heading'
                }`}
                aria-expanded={impactMenuOpen}
                aria-haspopup="true"
              >
                <span>{t('nav.impact', 'My Impact')}</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    impactMenuOpen ? 'rotate-180 text-primary' : 'text-text-muted'
                  }`}
                />
              </button>

              {impactMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 p-3 rounded-2xl bg-surface-raised border border-line shadow-soft-lg z-50 animate-scale-up space-y-1">
                  <Link
                    to="/impact"
                    onClick={() => setImpactMenuOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-xs hover:bg-surface text-heading transition"
                  >
                    <Leaf className="w-4 h-4 text-primary" />
                    <div>
                      <div className="font-semibold">Personal Impact Ledger</div>
                      <div className="text-[10px] text-text-muted">Your logged savings & badges</div>
                    </div>
                  </Link>
                  <Link
                    to="/eco-check"
                    onClick={() => setImpactMenuOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-xs hover:bg-surface text-heading transition"
                  >
                    <ShieldCheck className="w-4 h-4 text-secondary" />
                    <div>
                      <div className="font-semibold">Check a Claim</div>
                      <div className="text-[10px] text-text-muted">Verify eco packaging claims</div>
                    </div>
                  </Link>
                  <Link
                    to="/transform"
                    onClick={() => setImpactMenuOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-xs hover:bg-surface text-heading transition"
                  >
                    <RefreshCw className="w-4 h-4 text-primary" />
                    <div>
                      <div className="font-semibold">Swap My Cart</div>
                      <div className="text-[10px] text-text-muted">Greener alternative finder</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* 6. Contact */}
            <Link
              to="/contact"
              className={`py-1 transition-colors font-sans ${
                isLinkActive('/contact')
                  ? 'text-primary font-semibold'
                  : 'text-text-secondary hover:text-heading'
              }`}
            >
              <span>Contact</span>
            </Link>

            {/* 7. More (Deep Labs & Research Tools) */}
            <div className="relative" ref={moreRef}>
              <button
                type="button"
                onClick={() => {
                  setMoreMenuOpen((prev) => !prev);
                  setShopMenuOpen(false);
                  setAboutMenuOpen(false);
                  setImpactMenuOpen(false);
                }}
                className={`flex items-center gap-1 py-1 font-sans transition-colors cursor-pointer ${
                  moreMenuOpen
                    ? 'text-primary font-semibold'
                    : 'text-text-secondary hover:text-heading'
                }`}
                aria-expanded={moreMenuOpen}
                aria-haspopup="true"
              >
                <span>Labs &amp; Tools</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    moreMenuOpen ? 'rotate-180 text-primary' : 'text-text-muted'
                  }`}
                />
              </button>

              {moreMenuOpen && (
                <div className="absolute top-full -left-20 xl:left-0 mt-2 w-[500px] p-4 rounded-3xl bg-surface-raised border border-line shadow-soft-lg z-50 animate-scale-up space-y-3">
                  <div className="px-2 py-1 text-[11px] font-sans font-semibold uppercase tracking-wider text-text-muted flex items-center justify-between border-b border-line pb-1.5">
                    <span>Research Labs &amp; Simulators</span>
                    <span className="text-[10px] text-primary lowercase font-mono">12 interactive tools</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 max-h-[280px] overflow-y-auto pr-1">
                    {MORE_LINKS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setMoreMenuOpen(false)}
                          className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs hover:bg-surface-sunken transition text-heading"
                        >
                          <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
                          <div className="min-w-0">
                            <div className="font-semibold truncate">{item.label}</div>
                            <div className="text-[10px] text-text-muted truncate">{item.desc}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Preferences: Theme & Language */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
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
          </div>
        </nav>
      </div>

      {/* Mobile Slide-In Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-18 bg-surface/98 backdrop-blur-2xl border-b border-line shadow-soft-lg p-5 space-y-4 max-h-[85vh] overflow-y-auto z-40 animate-slide-down">
          {/* Mobile Search Input */}
          <div className="pb-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                window.dispatchEvent(new CustomEvent('toggle-command-palette'));
              }}
              className="w-full flex items-center gap-2 p-3 rounded-2xl border border-line bg-surface-sunken text-xs text-text-muted"
            >
              <Search className="w-4 h-4 text-text-muted" />
              <span>Search products, categories...</span>
            </button>
          </div>

          {/* Mobile Primary Nav Links */}
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-text-muted px-2 py-1">
              Main Menu
            </div>
            {[
              { path: '/', label: 'Home' },
              { path: '/shop', label: 'Shop Catalog' },
              { path: '/how-it-works', label: 'About & Brand Story' },
              { path: '/learn', label: 'Learn & Blog' },
              { path: '/impact', label: 'My Impact' },
              { path: '/contact', label: 'Contact Us' }
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium ${
                  isLinkActive(link.path)
                    ? 'bg-surface-accent text-primary font-semibold'
                    : 'text-text hover:bg-surface-sunken'
                }`}
              >
                <span>{link.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-text-muted" />
              </Link>
            ))}
          </div>

          {/* Mobile Categories Grid */}
          <div className="pt-2 border-t border-line space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-text-muted px-2">
              Browse Categories
            </div>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <Link
                  key={cat.id}
                  to={`/shop?category=${cat.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-surface-sunken border border-line text-xs font-medium text-heading"
                >
                  <div className="font-semibold text-primary truncate">{cat.label}</div>
                  <div className="text-[10px] text-text-muted truncate">{cat.tagline}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Preferences & Tools */}
          <div className="pt-3 border-t border-line flex items-center justify-between text-xs text-text-muted">
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
            <Link
              to="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-text-secondary hover:text-heading"
            >
              Settings
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
