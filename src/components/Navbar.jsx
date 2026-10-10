import React from 'react';
import { ShoppingBag, Sparkles, Leaf, BarChart3, HelpCircle, Layers, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';

export default function Navbar({ activePage, setActivePage }) {
  const { cartItems, impact, setIsCartOpen, setIsAgentOpen, wishlist, compareList, setIsCompareOpen } = useCart();

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop Catalog' },
    { id: 'tools', label: 'Eco Tools' },
    { id: 'impact', label: 'Impact Dashboard' },
    { id: 'how-it-works', label: 'How It Works' }
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 dark:bg-[#0D1F18]/95 backdrop-blur-md border-b border-stone-200/90 dark:border-stone-800/80 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => setActivePage('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform">
            <Leaf className="w-6 h-6 text-emerald-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-2xl tracking-tight text-stone-900 dark:text-stone-100">
                Eco<span className="text-emerald-700 dark:text-emerald-400">Mart</span>
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40 hidden sm:inline-block">
                Eco Agent Inside
              </span>
            </div>
            <p className="text-[11px] font-medium text-stone-500 dark:text-stone-400 -mt-0.5 hidden sm:block">
              Don't just shop. Shop with purpose.
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-stone-100/80 dark:bg-stone-800/80 p-1.5 rounded-2xl border border-stone-200/60 dark:border-stone-700/60">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActivePage(link.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activePage === link.id
                  ? 'bg-white dark:bg-stone-700 text-emerald-800 dark:text-emerald-300 shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Wishlist Button */}
          <button
            type="button"
            onClick={() => setActivePage('wishlist')}
            title="View Saved Wishlist"
            className="relative p-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-rose-500 transition"
          >
            <span className="sr-only">Wishlist</span>
            <span className="text-base leading-none">❤️</span>
            {wishlist && wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Compare Button */}
          {compareList && compareList.length > 0 && (
            <button
              type="button"
              onClick={() => setIsCompareOpen(true)}
              title="Compare Products"
              className="relative p-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-emerald-500 transition"
            >
              <span className="sr-only">Compare</span>
              <span className="text-base leading-none">⚖️</span>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-stone-950 text-[9px] font-black flex items-center justify-center">
                {compareList.length}
              </span>
            </button>
          )}

          {/* Dark Mode & Reduced Motion Controls */}
          <ThemeToggle />

          {/* User Account Menu */}
          <UserMenu setActivePage={setActivePage} />

          {/* Ask Eco Agent Trigger Button */}
          <button
            type="button"
            onClick={() => setIsAgentOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-950/80 dark:to-teal-950/80 text-emerald-900 dark:text-emerald-200 hover:from-emerald-200 hover:to-teal-200 border border-emerald-300/60 dark:border-emerald-700/60 font-bold text-xs shadow-xs transition active:scale-95"
            title="Ask the conscious shopping AI agent"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-spin-slow" />
            <span className="hidden sm:inline">Ask Agent</span>
          </button>

          {/* Cart Trigger Button with Live Grade Badge */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-4 py-2 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-sm transition active:scale-95 cart-icon-bounce"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span>Cart</span>
            {impact.totalItems > 0 && (
              <span className="flex items-center gap-1 pl-1 border-l border-stone-700">
                <span className="bg-emerald-500 text-stone-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {impact.totalItems}
                </span>
                <span className="text-[10px] text-emerald-300 font-extrabold hidden sm:inline">
                  (Gr. {impact.averageGrade})
                </span>
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex md:hidden border-t border-stone-200 dark:border-stone-800 px-4 py-2 bg-stone-100/90 dark:bg-stone-850/90 justify-around overflow-x-auto text-xs">
        {navLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => setActivePage(link.id)}
            className={`px-3 py-1 rounded-lg font-bold shrink-0 ${
              activePage === link.id
                ? 'bg-emerald-700 text-white'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            {link.label}
          </button>
        ))}
      </div>
    </header>
  );
}
