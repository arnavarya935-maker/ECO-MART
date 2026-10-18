import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import productsData from '../data/products.json';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import {
  Search,
  Store,
  Wrench,
  Users,
  LineChart,
  HelpCircle,
  ShoppingBag,
  Sparkles,
  Zap,
  ArrowRight,
  Heart,
  User,
  Settings,
  X
} from 'lucide-react';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const { setIsCartOpen, setIsAgentOpen } = useCart();
  const { reduceEffects, toggleReduceEffects } = useTheme();

  // Listen for Ctrl+K, Cmd+K, or custom event
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    const handleCustomToggle = () => setIsOpen((prev) => !prev);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('toggle-command-palette', handleCustomToggle);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('toggle-command-palette', handleCustomToggle);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      setQuery('');
      setSelectedIndex(0);
      inputRef.current?.focus();
    }, 10);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Static navigation and actions
  const actions = useMemo(() => [
    {
      id: 'action-cart',
      type: 'action',
      title: 'Open Shopping Cart Drawer',
      subtitle: 'Review items and live sustainability impact',
      icon: ShoppingBag,
      perform: () => {
        setIsCartOpen(true);
        setIsOpen(false);
      }
    },
    {
      id: 'action-agent',
      type: 'action',
      title: 'Launch Eco Agent AI Co-Pilot',
      subtitle: 'Ask about conscious swaps or eco score breakdowns',
      icon: Sparkles,
      perform: () => {
        setIsAgentOpen(true);
        setIsOpen(false);
      }
    },
    {
      id: 'action-reduce-effects',
      type: 'action',
      title: `Toggle Reduce Effects (Currently ${reduceEffects ? 'ON' : 'OFF'})`,
      subtitle: 'Disable 3D canvases, particles, and heavy animations',
      icon: Zap,
      perform: () => {
        toggleReduceEffects();
        setIsOpen(false);
      }
    },
    {
      id: 'nav-shop',
      type: 'navigation',
      title: 'Go to Product Catalog',
      subtitle: 'Browse all 64 sustainable and alternative items',
      icon: Store,
      perform: () => {
        navigate('/shop');
        setIsOpen(false);
      }
    },
    {
      id: 'nav-tools',
      type: 'navigation',
      title: 'Go to Eco Tools & Telemetry',
      subtitle: 'Carbon footprint calculator, quiz, and eco map',
      icon: Wrench,
      perform: () => {
        navigate('/tools');
        setIsOpen(false);
      }
    },
    {
      id: 'nav-impact',
      type: 'navigation',
      title: 'Go to Impact Proof Dashboard',
      subtitle: 'Cumulative community savings & transparent ledger',
      icon: LineChart,
      perform: () => {
        navigate('/impact');
        setIsOpen(false);
      }
    },
    {
      id: 'nav-community',
      type: 'navigation',
      title: 'Go to Collective Community',
      subtitle: 'Conscious leaderboards and pledge wall',
      icon: Users,
      perform: () => {
        navigate('/community');
        setIsOpen(false);
      }
    },
    {
      id: 'nav-wishlist',
      type: 'navigation',
      title: 'View Saved Wishlist',
      subtitle: 'Check your saved eco favorites',
      icon: Heart,
      perform: () => {
        navigate('/wishlist');
        setIsOpen(false);
      }
    },
    {
      id: 'nav-profile',
      type: 'navigation',
      title: 'Go to User Profile',
      subtitle: 'Level progression, badges, and avatar',
      icon: User,
      perform: () => {
        navigate('/profile');
        setIsOpen(false);
      }
    },
    {
      id: 'nav-settings',
      type: 'navigation',
      title: 'Go to Settings & Accessibility',
      subtitle: 'Font size, dyslexia font, high-contrast toggle',
      icon: Settings,
      perform: () => {
        navigate('/settings');
        setIsOpen(false);
      }
    },
    {
      id: 'nav-how-it-works',
      type: 'navigation',
      title: 'Methodology: How Eco-Score Works',
      subtitle: 'Read our 0-100 lifecycle formula standards',
      icon: HelpCircle,
      perform: () => {
        navigate('/how-it-works');
        setIsOpen(false);
      }
    }
  ], [navigate, setIsCartOpen, setIsAgentOpen, reduceEffects, toggleReduceEffects]);

  // Filter items based on query
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return actions.slice(0, 8);
    }

    // Match products
    const matchingProducts = productsData
      .filter((p) => {
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q)
        );
      })
      .slice(0, 5)
      .map((p) => ({
        id: `prod-${p.id}`,
        type: 'product',
        title: p.name,
        subtitle: `₹${p.price} • ${p.category} • ${p.material}`,
        icon: Store,
        perform: () => {
          navigate(`/product/${p.id}`);
          setIsOpen(false);
        }
      }));

    // Match actions
    const matchingActions = actions.filter((a) => {
      return (
        a.title.toLowerCase().includes(q) ||
        a.subtitle.toLowerCase().includes(q)
      );
    });

    return [...matchingProducts, ...matchingActions];
  }, [query, actions, navigate]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].perform();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/40 backdrop-blur-xs animate-fade-in"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200/90 overflow-hidden text-stone-900 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-stone-200">
          <Search className="w-5 h-5 text-emerald-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, product, or action..."
            className="flex-1 bg-transparent text-sm sm:text-base font-medium outline-hidden placeholder:text-stone-400"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSelectedIndex(0);
                inputRef.current?.focus();
              }}
              className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline px-2 py-0.5 text-[10px] font-mono font-bold bg-stone-100 border border-stone-200 rounded text-stone-500">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-stone-500">
              <p className="text-sm font-semibold">No matching commands or products found</p>
              <p className="text-xs mt-1 text-stone-400">Try searching for "bamboo", "cart", or "calculator"</p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.perform}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-left transition ${
                    isSelected
                      ? 'bg-[#E8F5EE] text-[#0B3B2C] shadow-2xs'
                      : 'hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-bold truncate">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-stone-500 truncate">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-2 shrink-0">
                    {item.type === 'product' && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Product
                      </span>
                    )}
                    {item.type === 'action' && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                        Action
                      </span>
                    )}
                    <ArrowRight
                      className={`w-4 h-4 transition ${
                        isSelected ? 'text-emerald-700 translate-x-0.5' : 'text-stone-300'
                      }`}
                    />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-5 py-2.5 bg-stone-50 border-t border-stone-200/80 flex items-center justify-between text-[11px] text-stone-500">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-white border border-stone-200 rounded mr-1">↑↓</kbd>
              Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-white border border-stone-200 rounded mr-1">↵</kbd>
              Select
            </span>
          </div>
          <span>Offline search</span>
        </div>
      </div>
    </div>
  );
}
