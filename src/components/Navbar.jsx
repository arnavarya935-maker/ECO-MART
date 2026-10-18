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
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group select-none py-1 focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-xl"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
            <Leaf className="w-5 h-5 text-white" />
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black tracking-tight text-[#0B3B2C]">
                Eco<span className="text-emerald-600">Mart</span>
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 hidden sm:inline-block">
                Sustainable Living
              </span>
            </div>
          </div>
        </Link>

        {/* Navigation Links - Desktop */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-bold tracking-tight">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`transition-colors py-1 relative ${
                isLinkActive(link.path)
                  ? 'text-emerald-700 font-extrabold'
                  : 'text-stone-600 hover:text-emerald-800'
              }`}
            >
              {link.label}
              {isLinkActive(link.path) && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Command Palette Trigger (Feature 18) */}
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(new CustomEvent('toggle-command-palette'));
            }}
            title="Search & Quick Actions (Ctrl+K)"
            className="flex items-center gap-2 px-3 py-2 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-600 text-xs font-medium transition cursor-pointer shadow-2xs min-h-[44px]"
          >
            <Search className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden sm:inline text-stone-500">Search products...</span>
            <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] font-mono bg-white border border-stone-200 rounded text-stone-400 font-bold">
              ⌘K
            </kbd>
          </button>

          {/* Wishlist Button */}
          <Link
            to="/wishlist"
            title="Saved Items"
            className="relative p-2.5 rounded-2xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 hover:text-rose-600 transition shadow-2xs min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <Heart className="w-4 h-4" />
            {wishlist && wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-extrabold flex items-center justify-center shadow-xs">
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
              className="relative p-2.5 rounded-2xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 hover:text-teal-700 transition shadow-2xs min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <Scale className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-teal-600 text-white text-[9px] font-extrabold flex items-center justify-center shadow-xs">
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
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border border-emerald-200 bg-[#E8F5EE] hover:bg-emerald-100/80 text-emerald-800 text-xs font-bold transition shadow-2xs cursor-pointer min-h-[44px]"
            title="Launch Offline Eco Agent Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Eco Agent</span>
          </button>

          {/* Cart Trigger */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold transition shadow-xs cursor-pointer min-h-[44px]"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {impact.totalItems > 0 && (
              <span className="px-1.5 py-0.2 bg-white text-emerald-800 text-[10px] rounded-full font-black">
                {impact.totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
