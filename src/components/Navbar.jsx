import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Sparkles, Leaf, Search, Heart, Scale } from 'lucide-react';
import { useCart } from '../context/CartContext';
import UserMenu from './UserMenu';

export default function Navbar() {
  const location = useLocation();
  const { impact, setIsCartOpen, setIsAgentOpen, wishlist, compareList, setIsCompareOpen } = useCart();
  const currentPath = location.pathname;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Catalog' },
    { path: '/tools', label: 'Eco Tools' },
    { path: '/impact', label: 'Impact Proof' },
    { path: '/community', label: 'Collective' },
    { path: '/how-it-works', label: 'Methodology' }
  ];

  const isLinkActive = (path) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-surface/95 backdrop-blur-md border-b border-line transition-colors shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group select-none py-1 focus-visible:outline-2 focus-visible:outline-focus rounded-xl"
        >
          <div className="w-10 h-10 rounded-2xl bg-heading text-surface-raised flex items-center justify-center font-bold shadow-soft-sm group-hover:scale-105 transition-transform duration-200">
            <Leaf className="w-5 h-5 text-primary" />
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-heading">
                Eco<span className="text-primary italic">Mart</span>
              </span>
              <span className="text-[10px] font-sans font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-accent border border-primary/20 text-primary hidden sm:inline-block">
                Sustainable Living
              </span>
            </div>
          </div>
        </Link>

        {/* Navigation Links - Desktop */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-sans font-medium tracking-normal" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`transition-colors py-2 relative min-h-[44px] flex items-center ${
                isLinkActive(link.path)
                  ? 'text-heading font-semibold'
                  : 'text-secondary hover:text-heading'
              }`}
            >
              {link.label}
              {isLinkActive(link.path) && (
                <span className="absolute bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
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
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl border border-line bg-surface-sunken hover:bg-surface-sunken text-secondary text-xs font-sans font-medium transition cursor-pointer min-h-[44px]"
          >
            <Search className="w-3.5 h-3.5 text-muted" />
            <span className="hidden sm:inline text-muted">Search products...</span>
            <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] font-mono bg-surface-raised border border-line rounded text-muted font-semibold">
              ⌘K
            </kbd>
          </button>

          {/* Wishlist Button */}
          <Link
            to="/wishlist"
            title="Saved Items"
            className="relative p-2.5 rounded-2xl border border-line bg-surface-raised hover:bg-surface-sunken text-secondary hover:text-danger transition min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          >
            <Heart className="w-4 h-4" />
            {wishlist && wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-danger text-surface-raised text-[9px] font-sans font-bold flex items-center justify-center shadow-xs">
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
              className="relative p-2.5 rounded-2xl border border-line bg-surface-raised hover:bg-surface-sunken text-secondary hover:text-secondary transition min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            >
              <Scale className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-secondary text-surface-raised text-[9px] font-sans font-bold flex items-center justify-center shadow-xs">
                {compareList.length}
              </span>
            </button>
          )}

          {/* User Account Menu */}
          <UserMenu />

          {/* Launch EcoAgent AI Co-Pilot */}
          <button
            type="button"
            onClick={() => setIsAgentOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border border-primary/20 bg-surface-accent hover:bg-surface-accent text-heading text-xs font-sans font-medium transition cursor-pointer min-h-[44px]"
            title="Launch Offline Eco Agent Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="hidden sm:inline">Eco Agent</span>
          </button>

          {/* Cart Trigger with bounce */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-heading hover:bg-heading-hover text-surface-raised text-xs font-sans font-medium transition-all shadow-soft-sm active:scale-95 cursor-pointer min-h-[44px]"
          >
            <ShoppingBag className="w-4 h-4 text-primary" />
            <span className="hidden sm:inline">Cart</span>
            {impact.totalItems > 0 && (
              <span className="px-1.5 py-0.2 bg-primary text-surface-raised text-[10px] rounded-full font-bold animate-bounce-subtle">
                {impact.totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

