import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
  X,
  Terminal,
  Swords,
  Sliders,
  Inbox,
  Gavel,
  Scan,
  FileCheck,
  BookOpen,
  Lock,
  Eye,
  MessageSquare,
  Newspaper,
  Compass
} from 'lucide-react';
import { ECO_GLOSSARY_TERMS } from '../lib/glossary';

export default function CommandPalette({ isOpen: controlledOpen, onClose: controlledClose }) {
  const [internalOpen, setInternalOpen] = useState(true);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const handleClose = useCallback(() => {
    if (controlledClose) controlledClose();
    else setInternalOpen(false);
  }, [controlledClose]);

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
        if (isOpen) {
          handleClose();
        } else {
          if (controlledClose) controlledClose(true);
          else setInternalOpen(true);
        }
      } else if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    const handleCustomToggle = () => {
      if (isOpen) {
        handleClose();
      } else {
        if (controlledClose) controlledClose(true);
        else setInternalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('toggle-command-palette', handleCustomToggle);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('toggle-command-palette', handleCustomToggle);
    };
  }, [isOpen, controlledClose, handleClose]);

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
        handleClose();
      }
    },
    {
      id: 'action-agent',
      type: 'action',
      title: 'Launch Eco Agent AI Co-Pilot',
      subtitle: 'Ask about conscious swaps, honesty logs, or eco scores',
      icon: Sparkles,
      perform: () => {
        setIsAgentOpen(true);
        handleClose();
      }
    },
    {
      id: 'action-what-if',
      type: 'action',
      title: 'What-If Cart Simulator',
      subtitle: 'Simulate live CO2, water, and plastic deltas with quantity & swap controls',
      icon: Sparkles,
      perform: () => {
        navigate('/impact?tab=what_if');
        handleClose();
      }
    },
    {
      id: 'action-claim-radar',
      type: 'action',
      title: 'Greenwashing Claim Radar (5-Axis Audit)',
      subtitle: 'Inspect vague wording, proof, certifications, specificity, and comparison baseline',
      icon: Sparkles,
      perform: () => {
        window.dispatchEvent(new CustomEvent('open-greenwashing-detective'));
        handleClose();
      }
    },
    {
      id: 'action-cart-transformer',
      type: 'action',
      title: 'Cart Transformer: Paste Shopping List',
      subtitle: 'Transform handwritten/typed lists into a budget-respecting sustainable cart',
      icon: Sparkles,
      perform: () => {
        navigate('/transform');
        handleClose();
      }
    },
    {
      id: 'action-fairness-lab',
      type: 'action',
      title: 'Fairness Lab: Linguistic & Socioeconomic Parity',
      subtitle: 'Audit consistency across English, Hindi, Hinglish and budget personas',
      icon: Sparkles,
      perform: () => {
        navigate('/fairness');
        handleClose();
      }
    },
    {
      id: 'action-playground',
      type: 'action',
      title: 'Break the AI Playground: Adversarial Testing',
      subtitle: 'Test 5 ethical guardrails against jailbreaks and fake ISO inventions',
      icon: Sparkles,
      perform: () => {
        navigate('/playground');
        handleClose();
      }
    },
    {
      id: 'action-blackbox',
      type: 'action',
      title: 'AI Black Box Telemetry Log',
      subtitle: 'Inspect append-only interaction audit trail, confidence, energy estimates, and JSON export',
      icon: Terminal,
      perform: () => {
        navigate('/blackbox');
        handleClose();
      }
    },
    {
      id: 'action-duel',
      type: 'action',
      title: 'Human vs AI Duel',
      subtitle: 'Test your greenwashing detection instincts against the calibrated AI benchmark',
      icon: Swords,
      perform: () => {
        navigate('/duel');
        handleClose();
      }
    },
    {
      id: 'action-counterfactual',
      type: 'action',
      title: 'Counterfactual Decision Slider',
      subtitle: 'Simulate decision flip boundaries as budget and urgency thresholds shift',
      icon: Sliders,
      perform: () => {
        navigate('/counterfactual');
        handleClose();
      }
    },
    {
      id: 'action-ethics-inbox',
      type: 'action',
      title: 'Open AI Ethics Inbox',
      subtitle: 'Review and approve/dismiss flagged greenwash claims and low-confidence decisions',
      icon: Inbox,
      perform: () => {
        window.dispatchEvent(new CustomEvent('open-ethics-inbox'));
        handleClose();
      }
    },
    {
      id: 'action-courtroom',
      type: 'action',
      title: 'AI Courtroom: Packaging Claims on Trial',
      subtitle: 'Turn-by-turn simulated legal debate with Prosecutor, Defender, and Judge',
      icon: Gavel,
      perform: () => {
        navigate('/courtroom');
        handleClose();
      }
    },
    {
      id: 'action-scan',
      type: 'action',
      title: 'Product Label Scanner',
      subtitle: 'Transcribe printed packaging text with Gemini Vision (Images not saved)',
      icon: Scan,
      perform: () => {
        navigate('/scan');
        handleClose();
      }
    },
    {
      id: 'action-news',
      type: 'action',
      title: 'Eco News & Industry Watch',
      subtitle: 'Curated environmental reporting on greenwashing, EPR policy, and circular materials',
      icon: Newspaper,
      perform: () => {
        navigate('/news');
        handleClose();
      }
    },
    {
      id: 'action-dilemmas',
      type: 'action',
      title: 'Ethics Dilemma Cards',
      subtitle: 'Explore real-world tradeoffs where AI refuses to make moral choices for you',
      icon: Compass,
      perform: () => {
        navigate('/dilemmas');
        handleClose();
      }
    },
    {
      id: 'action-self-audit',
      type: 'action',
      title: 'AI Self-Audit Session Report',
      subtitle: 'Generate verifiable session report of uncertainties, bias risks, and guardrails',
      icon: FileCheck,
      perform: () => {
        navigate('/self-audit');
        handleClose();
      }
    },
    {
      id: 'action-kirana',
      type: 'action',
      title: 'Desi Kirana Mode (किराना मोड)',
      subtitle: 'Simplified high-contrast Hindi-first layout with Web Speech voice input/output',
      icon: Store,
      perform: () => {
        navigate('/kirana');
        handleClose();
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
        handleClose();
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
        handleClose();
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
        handleClose();
      }
    },
    {
      id: 'nav-impact',
      type: 'navigation',
      title: 'Impact Command Center',
      subtitle: 'Category carbon drilldown, habit line curve, trust score histogram',
      icon: LineChart,
      perform: () => {
        navigate('/impact');
        handleClose();
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
        handleClose();
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
        handleClose();
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
        handleClose();
      }
    },
    {
      id: 'nav-settings',
      type: 'navigation',
      title: 'Go to Settings & Accessibility',
      subtitle: 'Font size, dyslexia font, high-contrast toggle',
      icon: Settings,
      group: 'Pages & Navigation',
      perform: () => {
        navigate('/settings');
        handleClose();
      }
    },
    {
      id: 'nav-transparency',
      type: 'navigation',
      title: 'Agent Transparency & Safety Report',
      subtitle: 'Model specifications, guardrails, and automated report card',
      icon: FileCheck,
      group: 'Pages & Navigation',
      perform: () => {
        navigate('/transparency');
        handleClose();
      }
    },
    {
      id: 'action-privacy',
      type: 'action',
      title: 'Privacy Center & Data Export',
      subtitle: 'Inspect local storage inventory, export JSON backup, or wipe local data',
      icon: Lock,
      group: 'Privacy & Data',
      perform: () => {
        window.dispatchEvent(new CustomEvent('open-privacy-center'));
        handleClose();
      }
    },
    {
      id: 'action-accessibility',
      type: 'action',
      title: 'Accessibility & Ergonomics Center',
      subtitle: 'Text size scale, OpenDyslexic font, high contrast, and kids mode',
      icon: Eye,
      group: 'Tools & Truth Lab',
      perform: () => {
        window.dispatchEvent(new CustomEvent('open-accessibility-center'));
        handleClose();
      }
    },
    {
      id: 'action-feedback',
      type: 'action',
      title: 'Feedback & Claim Reporting Inbox',
      subtitle: 'Submit honest sustainability feedback or export community reports',
      icon: MessageSquare,
      group: 'Tools & Truth Lab',
      perform: () => {
        window.dispatchEvent(new CustomEvent('open-feedback-inbox'));
        handleClose();
      }
    },
    {
      id: 'nav-how-it-works',
      type: 'navigation',
      title: 'Methodology: How Eco-Score Works',
      subtitle: 'Read our 0-100 lifecycle formula standards',
      icon: HelpCircle,
      group: 'Pages & Navigation',
      perform: () => {
        navigate('/how-it-works');
        handleClose();
      }
    }
  ], [navigate, setIsCartOpen, setIsAgentOpen, reduceEffects, toggleReduceEffects, handleClose]);

  // Filter items based on query with grouped structure
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return actions.slice(0, 10).map((a) => ({ ...a, group: a.group || 'Quick Actions' }));
    }

    // 1. Match products
    const matchingProducts = productsData
      .filter((p) => {
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.material || '').toLowerCase().includes(q)
        );
      })
      .slice(0, 5)
      .map((p) => ({
        id: `prod-${p.id}`,
        type: 'product',
        group: 'Products',
        title: p.name,
        subtitle: `₹${p.price} • ${p.category} • ${p.material}`,
        icon: Store,
        perform: () => {
          navigate(`/product/${p.id}`);
          handleClose();
        }
      }));

    // 2. Match actions & tools
    const matchingTools = actions
      .filter((a) => {
        return (
          (a.group?.includes('Tools') || a.type === 'action') &&
          (a.title.toLowerCase().includes(q) || a.subtitle.toLowerCase().includes(q))
        );
      })
      .map((a) => ({ ...a, group: 'Tools & Truth Lab' }));

    // 3. Match pages
    const matchingPages = actions
      .filter((a) => {
        return (
          a.type === 'navigation' &&
          !matchingTools.some((t) => t.id === a.id) &&
          (a.title.toLowerCase().includes(q) || a.subtitle.toLowerCase().includes(q))
        );
      })
      .map((a) => ({ ...a, group: 'Pages & Hubs' }));

    // 4. Match Glossary Terms
    const matchingGlossary = (ECO_GLOSSARY_TERMS || [])
      .filter((item) => {
        return (
          item.term.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          (item.shortDef || '').toLowerCase().includes(q)
        );
      })
      .slice(0, 4)
      .map((item) => ({
        id: `glossary-${item.term}`,
        type: 'glossary',
        group: 'Eco Glossary Terms',
        title: item.term,
        subtitle: `${item.category}: ${item.shortDef}`,
        icon: BookOpen,
        perform: () => {
          navigate('/tools');
          handleClose();
        }
      }));

    return [...matchingProducts, ...matchingTools, ...matchingPages, ...matchingGlossary];
  }, [query, actions, navigate, handleClose]);

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
      className="fixed inset-0 z-command-palette flex items-start justify-center pt-16 sm:pt-24 px-4 bg-heading/50 backdrop-blur-xs animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-2xl bg-surface-raised rounded-3xl shadow-soft-xl border border-line overflow-hidden text-text animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-line bg-surface-raised">
          <Search className="w-5 h-5 text-primary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search products, tools, pages, or eco terms..."
            className="flex-1 bg-transparent text-sm sm:text-base font-medium outline-hidden placeholder:text-muted text-heading"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSelectedIndex(0);
                inputRef.current?.focus();
              }}
              aria-label="Clear search query"
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-sunken text-muted hover:text-text transition-colors focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline px-2 py-0.5 text-[10px] font-mono font-bold bg-surface-sunken border border-line rounded-md text-muted shadow-soft-xs">
            ESC
          </kbd>
        </div>

        {/* Results List with Grouped Categories */}
        <div className="max-h-[60vh] overflow-y-auto p-2.5 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-muted">
              <p className="text-sm font-serif font-bold text-heading">No matching commands or products found</p>
              <p className="text-xs mt-1 text-muted">Try searching for "bamboo", "GOTS", "courtroom", or "carbon"</p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon || Store;
              const isSelected = idx === selectedIndex;
              const prevGroup = idx > 0 ? filteredItems[idx - 1].group : null;
              const showGroupHeader = item.group && item.group !== prevGroup;

              return (
                <React.Fragment key={item.id}>
                  {showGroupHeader && (
                    <div className="px-3 pt-3 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-primary">
                      {item.group}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={item.perform}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-left transition-colors min-h-[44px] focus-visible:outline-2 focus-visible:outline-focus cursor-pointer ${
                      isSelected
                        ? 'bg-surface-accent text-heading border border-primary/20 shadow-soft-xs'
                        : 'hover:bg-surface-sunken text-text border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-heading text-primary'
                            : 'bg-surface-sunken text-secondary border border-line'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold truncate text-heading">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-muted truncate mt-0.5">
                          {item.subtitle}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pl-2 shrink-0">
                      {item.type === 'product' && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-surface-accent text-primary border border-primary/20 font-mono">
                          Product
                        </span>
                      )}
                      {item.type === 'glossary' && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 font-mono">
                          Glossary
                        </span>
                      )}
                      {item.type === 'action' && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-warning-subtle text-warning border border-warning/20 font-mono">
                          Tool
                        </span>
                      )}
                      <ArrowRight
                        className={`w-4 h-4 transition-transform ${
                          isSelected ? 'text-heading translate-x-0.5' : 'text-muted'
                        }`}
                      />
                    </div>
                  </button>
                </React.Fragment>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-5 py-2.5 bg-surface-sunken border-t border-line flex items-center justify-between text-[11px] text-muted">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-surface-raised border border-line rounded-md mr-1 shadow-soft-xs">↑↓</kbd>
              Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-surface-raised border border-line rounded-md mr-1 shadow-soft-xs">↵</kbd>
              Select
            </span>
          </div>
          <span className="font-medium text-primary">Local Command Index</span>
        </div>
      </div>
    </div>
  );
}
