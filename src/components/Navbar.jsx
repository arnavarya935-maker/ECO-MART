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
    <header className="sticky top-0 z-40 w-full bg-[#030303]/90 light:bg-[#f4f4f5]/90 backdrop-blur-md border-b border-white/10 light:border-black/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo - Futuristic Editorial Viewfinder */}
        <div
          onClick={() => setActivePage('home')}
          className="flex items-center gap-3 cursor-pointer group select-none relative py-1"
        >
          <div className="relative w-8 h-8 rounded-sm bg-[#0a0a0a] border border-white/20 flex items-center justify-center font-bold text-white group-hover:border-[#A8C7FA] transition-colors">
            <span className="bracket bracket-tl !border-[#A8C7FA]" />
            <span className="bracket bracket-br !border-[#A8C7FA]" />
            <Leaf className="w-4 h-4 text-[#A8C7FA]" />
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-newsreader italic text-2xl font-light tracking-tight text-white light:text-black">
                Eco<span className="font-sans font-bold not-italic tracking-tighter text-[#A8C7FA]">Mart</span>
              </span>
              <span className="text-[9px] font-space-mono uppercase tracking-[0.2em] px-1.5 py-0.5 rounded-xs bg-white/5 border border-white/10 text-[#A8C7FA] hidden sm:inline-block">
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
                  ? 'text-white light:text-black font-bold'
                  : 'text-neutral-400 hover:text-white light:text-neutral-600 light:hover:text-black'
              }`}
            >
              {activePage === link.id && (
                <span className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#A8C7FA] animate-ping" />
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
            className="relative p-2 rounded-sm border border-white/10 light:border-black/10 bg-[#0a0a0a] light:bg-white text-neutral-400 hover:text-white hover:border-white/30 transition cursor-pointer"
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
              className="relative p-2 rounded-sm border border-white/10 light:border-black/10 bg-[#0a0a0a] light:bg-white text-neutral-400 hover:text-[#A8C7FA] hover:border-[#A8C7FA]/40 transition cursor-pointer"
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
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xs border border-white/20 bg-[#0a0a0a] hover:border-[#A8C7FA] hover:bg-[#111] text-white font-space-mono text-[10px] uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xs group"
            title="Launch Cognitive AI Co-Pilot"
          >
            <span className="bracket bracket-tl !w-2 !h-2 !border-[#A8C7FA]" />
            <span className="bracket bracket-br !w-2 !h-2 !border-[#A8C7FA]" />
            <Sparkles className="w-3 h-3 text-[#A8C7FA] group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">AI Agent</span>
          </button>

          {/* Cart Trigger */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-[#A8C7FA] text-black font-space-mono text-[10px] font-bold uppercase tracking-wider hover:bg-white transition-all cursor-pointer shadow-[0_0_15px_rgba(168,199,250,0.3)]"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Bag</span>
            {impact.totalItems > 0 && (
              <span className="ml-1 px-1 py-0.2 bg-black text-white text-[9px] rounded-2xs">
                {impact.totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation */}
      <div className="flex md:hidden border-t border-white/10 px-4 py-2 bg-[#030303] justify-around overflow-x-auto text-[10px] font-space-mono uppercase tracking-wider">
        {navLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => setActivePage(link.id)}
            className={`px-2.5 py-1 rounded-xs transition ${
              activePage === link.id
                ? 'bg-white text-black font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {link.label}
          </button>
        ))}
      </div>
    </header>
  );
}
