import React from 'react';
import { ShoppingBag, Sparkles, Leaf } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';

export default function Navbar({ activePage, setActivePage }) {
  const { impact, setIsCartOpen, setIsAgentOpen, wishlist, compareList, setIsCompareOpen } = useCart();

  const navLinks = [
    { id: 'home', label: 'Index' },
    { id: 'shop', label: 'Catalog' },
    { id: 'tools', label: 'Telemetry' },
    { id: 'community', label: 'Collective' },
    { id: 'impact', label: 'Impact' },
    { id: 'how-it-works', label: 'Methodology' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#f4f4f5]/90 dark:bg-[#030303]/90 backdrop-blur-md border-b border-black/10 dark:border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo - Futuristic Editorial Viewfinder */}
        <div
          onClick={() => setActivePage('home')}
          className="flex items-center gap-3 cursor-pointer group select-none relative py-1"
        >
          <div className="relative w-8 h-8 rounded-sm bg-white dark:bg-[#0a0a0a] border border-black/15 dark:border-white/20 flex items-center justify-center font-bold text-black dark:text-white group-hover:border-[#2563eb] transition-colors shadow-xs">
            <span className="bracket bracket-tl !border-[#2563eb] dark:!border-[#A8C7FA]" />
            <span className="bracket bracket-br !border-[#2563eb] dark:!border-[#A8C7FA]" />
            <Leaf className="w-4 h-4 text-[#2563eb] dark:text-[#A8C7FA]" />
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-newsreader italic text-2xl font-light tracking-tight text-[#0a0a0a] dark:text-white">
                Eco<span className="font-sans font-bold not-italic tracking-tighter text-[#2563eb] dark:text-[#A8C7FA]">Mart</span>
              </span>
              <span className="text-[9px] font-space-mono uppercase tracking-[0.2em] px-1.5 py-0.5 rounded-xs bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[#2563eb] dark:text-[#A8C7FA] hidden sm:inline-block font-semibold">
                M3.0 // AUTONOMOUS
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links - Space Mono Editorial Minimalist */}
        <nav className="hidden md:flex items-center gap-7 text-[11px] font-space-mono uppercase tracking-wider">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActivePage(link.id)}
              className={`transition-colors py-1 cursor-pointer relative ${
                activePage === link.id
                  ? 'text-black dark:text-white font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              {activePage === link.id && (
                <span className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#2563eb] dark:bg-[#A8C7FA] animate-ping" />
              )}
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
            title="Saved Items"
            className="relative p-2 rounded-sm border border-black/10 dark:border-white/10 bg-white dark:bg-[#0a0a0a] text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:border-black/30 transition cursor-pointer shadow-2xs"
          >
            <span className="sr-only">Wishlist</span>
            <span className="text-xs leading-none">♡</span>
            {wishlist && wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#F1C6D4] text-black text-[8px] font-space-mono font-bold flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Compare Button */}
          {compareList && compareList.length > 0 && (
            <button
              type="button"
              onClick={() => setIsCompareOpen(true)}
              title="Compare Diagnostics"
              className="relative p-2 rounded-sm border border-black/10 dark:border-white/10 bg-white dark:bg-[#0a0a0a] text-neutral-600 dark:text-neutral-400 hover:text-[#2563eb] hover:border-[#2563eb]/40 transition cursor-pointer shadow-2xs"
            >
              <span className="sr-only">Compare</span>
              <span className="text-xs leading-none font-space-mono">◫</span>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#A8C7FA] text-black text-[8px] font-space-mono font-bold flex items-center justify-center">
                {compareList.length}
              </span>
            </button>
          )}

          {/* Dark / Light Mode Toggle */}
          <ThemeToggle />

          {/* User Account Menu */}
          <UserMenu setActivePage={setActivePage} />

          {/* Launch EcoAgent - Cyber Button */}
          <button
            type="button"
            onClick={() => setIsAgentOpen(true)}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xs border border-black/15 dark:border-white/20 bg-white dark:bg-[#0a0a0a] hover:border-[#2563eb] text-black dark:text-white font-space-mono text-[10px] uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-2xs group"
            title="Launch Cognitive AI Co-Pilot"
          >
            <span className="bracket bracket-tl !w-2 !h-2 !border-[#2563eb] dark:!border-[#A8C7FA]" />
            <span className="bracket bracket-br !w-2 !h-2 !border-[#2563eb] dark:!border-[#A8C7FA]" />
            <Sparkles className="w-3 h-3 text-[#2563eb] dark:text-[#A8C7FA] group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">AI Agent</span>
          </button>

          {/* Cart Trigger */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-xs bg-[#0a0a0a] dark:bg-[#A8C7FA] text-white dark:text-black font-space-mono text-[10px] font-bold uppercase tracking-wider hover:bg-[#2563eb] transition-all cursor-pointer shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Bag</span>
            {impact.totalItems > 0 && (
              <span className="ml-1 px-1 py-0.2 bg-white text-black dark:bg-black dark:text-white text-[9px] rounded-2xs font-bold">
                {impact.totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation */}
      <div className="flex md:hidden border-t border-black/10 dark:border-white/10 px-4 py-2 bg-[#f4f4f5] dark:bg-[#030303] justify-around overflow-x-auto text-[10px] font-space-mono uppercase tracking-wider">
        {navLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => setActivePage(link.id)}
            className={`px-2.5 py-1 rounded-xs transition ${
              activePage === link.id
                ? 'bg-black text-white dark:bg-white dark:text-black font-bold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-black'
            }`}
          >
            {link.label}
          </button>
        ))}
      </div>
    </header>
  );
}
