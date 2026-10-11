import React from 'react';
import { ShoppingBag, Sparkles, Leaf, BarChart3, HelpCircle, Layers, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';

export default function Navbar({ activePage, setActivePage }) {
  const { cartItems, impact, setIsCartOpen, setIsAgentOpen, wishlist, compareList, setIsCompareOpen } = useCart();

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Catalog' },
    { id: 'tools', label: 'Eco Tools' },
    { id: 'community', label: 'Community' },
    { id: 'impact', label: 'Impact Dashboard' },
    { id: 'how-it-works', label: 'How It Works' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0b0de6] light:bg-[#fafafae6] backdrop-blur-md border-b border-[#33333a] light:border-zinc-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-4">
        {/* Brand Logo - Payload Bold Monolithic Aesthetic */}
        <div
          onClick={() => setActivePage('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-md bg-white light:bg-black text-black light:text-white flex items-center justify-center font-black shadow-sm group-hover:scale-105 transition-transform">
            <Leaf className="w-5 h-5 text-emerald-600 fill-emerald-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tighter text-[#f4f4f2] light:text-zinc-900">
                ECO<span className="text-emerald-400 light:text-emerald-600">MART</span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-sm bg-[#16161d] light:bg-zinc-100 text-emerald-400 light:text-emerald-600 border border-[#33333a] light:border-zinc-300 hidden sm:inline-block">
                AI COGNITIVE
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links - Payload Minimalist Style */}
        <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActivePage(link.id)}
              className={`transition-colors py-1 cursor-pointer ${
                activePage === link.id
                  ? 'text-white light:text-black font-semibold border-b border-emerald-400'
                  : 'text-[#aaaab0] light:text-zinc-500 hover:text-white light:hover:text-black'
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
            className="relative p-2 rounded-md border border-[#33333a] light:border-zinc-200 bg-[#111116] light:bg-white text-[#aaaab0] hover:text-white hover:border-[#484852] transition cursor-pointer"
          >
            <span className="sr-only">Wishlist</span>
            <span className="text-sm leading-none">❤️</span>
            {wishlist && wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center font-mono">
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
              className="relative p-2 rounded-md border border-[#33333a] light:border-zinc-200 bg-[#111116] light:bg-white text-[#aaaab0] hover:text-emerald-400 hover:border-[#484852] transition cursor-pointer"
            >
              <span className="sr-only">Compare</span>
              <span className="text-sm leading-none">⚖️</span>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-black text-[9px] font-bold flex items-center justify-center font-mono">
                {compareList.length}
              </span>
            </button>
          )}

          {/* Dark / Light Mode Toggle */}
          <ThemeToggle />

          {/* User Account Menu */}
          <UserMenu setActivePage={setActivePage} />

          {/* Ask Eco Agent Trigger Button - Payload Monospace Pill */}
          <button
            type="button"
            onClick={() => setIsAgentOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#33333a] light:border-zinc-300 bg-[#111116] light:bg-white text-[#f4f4f2] light:text-zinc-800 hover:bg-white hover:text-black light:hover:bg-zinc-900 light:hover:text-white font-mono text-xs transition-all duration-200 cursor-pointer shadow-xs"
            title="Ask the conscious shopping AI agent"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">EcoAgent</span>
          </button>

          {/* Cart Trigger Button - Payload Inverted Hover CTA */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#f4f4f2] light:bg-zinc-900 text-[#0b0b0d] light:text-white hover:bg-transparent hover:text-white hover:border hover:border-[#33333a] border border-transparent font-medium text-xs transition-all duration-200 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Cart</span>
            {impact.totalItems > 0 && (
              <span className="flex items-center gap-1 pl-1 border-l border-zinc-400 light:border-zinc-600">
                <span className="bg-emerald-500 text-black text-[10px] font-mono font-bold px-1 rounded-sm">
                  {impact.totalItems}
                </span>
                <span className="text-[10px] font-mono hidden sm:inline">
                  {impact.averageGrade}
                </span>
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex md:hidden border-t border-[#33333a] light:border-zinc-200 px-4 py-2 bg-[#0b0b0d] light:bg-zinc-50 justify-around overflow-x-auto text-xs font-mono">
        {navLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => setActivePage(link.id)}
            className={`px-3 py-1 rounded font-medium shrink-0 transition ${
              activePage === link.id
                ? 'bg-white light:bg-black text-black light:text-white'
                : 'text-[#aaaab0] light:text-zinc-600 hover:text-white'
            }`}
          >
            {link.label}
          </button>
        ))}
      </div>
    </header>
  );
}
