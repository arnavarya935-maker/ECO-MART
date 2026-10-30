import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Globe } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useT } from '../../context/I18nContext';
import ThemeToggle from '../ThemeToggle';
import HamburgerDrawer from './HamburgerDrawer';

export default function CinematicNavbar() {
  const location = useLocation();
  const { impact, setIsCartOpen } = useCart();
  const { lang, toggleLanguage } = useT();
  const currentPath = location.pathname;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Scrolled state for backdrop blur
      setIsScrolled(currentScrollY > 25);

      // Hide on scroll down, show on scroll up
      if (currentScrollY > 120) {
        if (currentScrollY > lastScrollY.current && currentScrollY - lastScrollY.current > 5) {
          setIsVisible(false);
        } else if (lastScrollY.current - currentScrollY > 5) {
          setIsVisible(true);
        }
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openSearch = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  };

  const PRIMARY_NAV = [
    { path: '/shop', label: lang === 'hi' ? 'दुकान' : 'Shop' },
    { path: '/transform', label: lang === 'hi' ? 'सामान बदलें' : 'Swap My List' },
    { path: '/truth-lab', label: lang === 'hi' ? 'सच्चाई जांच' : 'Check a Claim' },
    { path: '/impact', label: lang === 'hi' ? 'प्रभाव' : 'My Impact' },
    { path: '/learn', label: lang === 'hi' ? 'सीखें' : 'Learn' },
    { path: '/news', label: lang === 'hi' ? 'समाचार' : 'News' }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          isScrolled
            ? 'bg-surface/85 backdrop-blur-md border-b border-line shadow-soft-xs'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left Brand Identity */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group select-none py-1 focus-visible:outline-2 focus-visible:outline-focus rounded-2xl"
            aria-label={lang === 'hi' ? 'इको सेंस होम' : 'Eco Sense Home'}
          >
            <img
              src="/images/logo.png"
              alt="Eco Sense - Shop with sense. Shop with purpose."
              width="132"
              height="41"
              className="h-9 sm:h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105 dark:hidden"
            />
            <img
              src="/images/logo-dark.png"
              alt="Eco Sense - Shop with sense. Shop with purpose."
              width="132"
              height="41"
              className="h-9 sm:h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105 hidden dark:block"
            />
            <span className="text-[10px] font-mono font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-surface-accent border border-primary/20 text-primary hidden md:inline-block">
              Agent
            </span>
          </Link>

          {/* Center Navigation Links with Two-Line Text-Swap Hover */}
          <nav className="hidden lg:flex items-center gap-1.5" aria-label="Main Navigation">
            {PRIMARY_NAV.map((item) => {
              const active = currentPath === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group relative px-3 py-1.5 rounded-xl font-sans text-xs font-medium transition-colors overflow-hidden focus-visible:outline-2 focus-visible:outline-focus ${
                    active
                      ? 'text-primary font-semibold'
                      : 'text-text-secondary hover:text-heading'
                  }`}
                >
                  {/* Two-Line Text-Swap Hover Effect */}
                  <span className="flex flex-col h-4 overflow-hidden">
                    <span className="transition-transform duration-200 group-hover:-translate-y-full will-change-transform leading-4">
                      {item.label}
                    </span>
                    <span className="transition-transform duration-200 group-hover:-translate-y-full will-change-transform text-primary font-semibold leading-4" aria-hidden="true">
                      {item.label}
                    </span>
                  </span>
                  {active && (
                    <span className="absolute bottom-0.5 left-3 right-3 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={openSearch}
              aria-label={lang === 'hi' ? 'खोजें (Ctrl+K)' : 'Search Products & Features (Ctrl+K)'}
              className="w-9 h-9 rounded-full border border-line flex items-center justify-center text-text-secondary hover:text-heading hover:bg-surface-raised transition-colors focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Language Toggle */}
            <button
              type="button"
              onClick={toggleLanguage}
              aria-label={lang === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}
              className="h-9 px-2.5 rounded-full border border-line flex items-center gap-1 text-xs font-mono text-text-secondary hover:text-heading hover:bg-surface-raised transition-colors focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-primary" />
              <span>{lang === 'hi' ? 'EN' : 'HI'}</span>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Cart Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Shopping cart with ${impact?.itemCount || 0} items`}
              className="h-9 px-3 rounded-full bg-primary text-primary-contrast hover:bg-primary-hover transition-all duration-200 flex items-center gap-1.5 text-xs font-bold shadow-soft-xs focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="tabular-nums">{impact?.itemCount || 0}</span>
            </button>

            {/* Hamburger Button (Three Parallel Lines) */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label={lang === 'hi' ? 'सभी सुविधाएं खोलें' : 'Open all features menu'}
              aria-expanded={drawerOpen}
              className="w-10 h-10 rounded-full border border-line bg-surface-raised flex flex-col items-center justify-center gap-1 text-heading hover:border-primary/50 hover:scale-105 transition-all focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
            >
              <span className="w-4 h-0.5 bg-current rounded-full" />
              <span className="w-4 h-0.5 bg-current rounded-full" />
              <span className="w-4 h-0.5 bg-current rounded-full" />
            </button>
          </div>
        </div>
      </header>

      {/* Hamburger Sheet Drawer */}
      <HamburgerDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

