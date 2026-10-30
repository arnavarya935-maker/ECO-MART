import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  X,
  ShoppingBag,
  Bot,
  RefreshCw,
  ShieldCheck,
  BarChart3,
  Barcode,
  Camera,
  Store,
  BookOpen,
  Newspaper,
  Swords,
  Sliders,
  Scale,
  HelpCircle,
  Gavel,
  FileCheck,
  Users,
  Wrench,
  Package,
  Heart,
  User,
  Settings,
  Mail,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useT } from '../../context/I18nContext';
import { useCart } from '../../context/CartContext';

export default function HamburgerDrawer({ isOpen, onClose }) {
  const { t, lang } = useT();
  const { setIsAgentOpen } = useCart();
  const location = useLocation();
  const drawerRef = useRef(null);
  const closeBtnRef = useRef(null);

  // Body scroll lock and Escape key listener
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Focus trap
      if (e.key === 'Tab' && drawerRef.current) {
        const focusables = drawerRef.current.querySelectorAll(
          'a[href], button:not([disabled]), input, [tabindex="0"]'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);

    // Initial focus on close button
    if (closeBtnRef.current) {
      setTimeout(() => closeBtnRef.current?.focus(), 50);
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const GROUPS = [
    {
      title: lang === 'hi' ? 'मुख्य खरीदारी' : 'Core Commerce & Action',
      number: '01',
      links: [
        { path: '/shop', label: lang === 'hi' ? 'दुकान (Shop)' : 'Product Catalog', icon: ShoppingBag, desc: 'Discover items with lifecycle estimates' },
        {
          action: () => {
            onClose();
            setIsAgentOpen(true);
          },
          label: lang === 'hi' ? 'इको एजेंट (Eco Agent)' : 'Eco Agent AI Assistant',
          icon: Bot,
          desc: 'Live conversational sustainable helper'
        },
        { path: '/transform', label: lang === 'hi' ? 'सामान बदलें (Swap My List)' : 'Swap My List', icon: RefreshCw, desc: 'Convert everyday list to sustainable basket' },
        { path: '/truth-lab', label: lang === 'hi' ? 'सच्चाई जांच (Check a Claim)' : 'Check a Claim (Truth Lab)', icon: ShieldCheck, desc: 'Test packaging claims against facts' },
        { path: '/impact', label: lang === 'hi' ? 'मेरा प्रभाव (My Impact)' : 'My Impact Dashboard', icon: BarChart3, desc: 'Track carbon savings and diverted plastic' }
      ]
    },
    {
      title: lang === 'hi' ? 'स्कैनर व तुरंत इनपुट' : 'Fast Scanners & Input',
      number: '02',
      links: [
        { path: '/barcodes', label: lang === 'hi' ? 'बारकोड स्कैनर' : 'Barcode Scanner', icon: Barcode, desc: 'Offline EAN-13 instant product barcode lookup' },
        { path: '/scan', label: lang === 'hi' ? 'लेबल स्कैनर' : 'Camera Label Scanner', icon: Camera, desc: 'Optical character scan for greenwash terms' },
        { path: '/kirana', label: lang === 'hi' ? 'किराना मोड' : 'Desi Kirana Mode', icon: Store, desc: 'Quick voice-enabled grocery shopping' }
      ]
    },
    {
      title: lang === 'hi' ? 'रिसर्च व प्लेग्राउंड' : 'Research & Playgrounds',
      number: '03',
      links: [
        { path: '/learn', label: lang === 'hi' ? 'सीखें (Learn)' : 'Learn Hub', icon: BookOpen, desc: 'Guides on certifications and circular choices' },
        { path: '/news', label: lang === 'hi' ? 'समाचार (News)' : 'Eco News', icon: Newspaper, desc: 'Curated circular commerce developments' },
        { path: '/duel', label: lang === 'hi' ? 'उत्पाद तुलना (Duel)' : 'Product Duel', icon: Swords, desc: 'Side-by-side environmental lifecycle face-off' },
        { path: '/playground', label: lang === 'hi' ? 'प्राथमिकता प्लेग्राउंड' : 'Decision Playground', icon: Sliders, desc: 'Adjust personal weights for carbon, plastic, and price' },
        { path: '/dilemmas', label: lang === 'hi' ? 'नैतिक दुविधाएं' : 'Moral Dilemmas', icon: Scale, desc: 'Nuanced trade-offs between cost and planet' },
        { path: '/how-it-works', label: lang === 'hi' ? 'यह कैसे काम करता है' : 'How It Works', icon: HelpCircle, desc: 'Clear methodology and scoring formulas' }
      ]
    },
    {
      title: lang === 'hi' ? 'पारदर्शिता व समुदाय' : 'Integrity & Community',
      number: '04',
      links: [
        { path: '/courtroom', label: lang === 'hi' ? 'AI कोर्टरूम' : 'AI Courtroom', icon: Gavel, desc: 'Simulated debate on controversial claims' },
        { path: '/self-audit', label: lang === 'hi' ? 'AI सेल्फ-ऑडिट' : 'AI Self-Audit', icon: FileCheck, desc: 'Deterministic algorithmic fairness report' },
        { path: '/community', label: lang === 'hi' ? 'समुदाय' : 'Community & Pledges', icon: Users, desc: 'Conscious tips from fellow shoppers' },
        { path: '/tools', label: lang === 'hi' ? 'टूल्स' : 'Tools & Calculators', icon: Wrench, desc: 'Footprint estimators and starter bundles' }
      ]
    },
    {
      title: lang === 'hi' ? 'खाता व सेटिंग्स' : 'Account & Controls',
      number: '05',
      links: [
        { path: '/orders', label: lang === 'hi' ? 'मेरे ऑर्डर' : 'My Orders', icon: Package, desc: 'Past receipts with carbon audit receipts' },
        { path: '/wishlist', label: lang === 'hi' ? 'विशलिस्ट' : 'Saved Wishlist', icon: Heart, desc: 'Bookmarked sustainable alternatives' },
        { path: '/profile', label: lang === 'hi' ? 'प्रोफ़ाइल' : 'User Profile', icon: User, desc: 'On-device badges and footprint achievements' },
        { path: '/settings', label: lang === 'hi' ? 'सेटिंग्स' : 'Settings & Accessibility', icon: Settings, desc: 'Theme, Judge Mode, high contrast, text size' },
        { path: '/contact', label: lang === 'hi' ? 'संपर्क करें' : 'Contact Us', icon: Mail, desc: 'Send feedback, queries, or school project ideas' },
        {
          action: () => {
            onClose();
            window.dispatchEvent(new CustomEvent('open-privacy-center'));
          },
          label: lang === 'hi' ? 'प्राइवेसी सेंटर' : 'Privacy Center & Data',
          icon: Lock,
          desc: '100% on-device data telemetry inventory'
        }
      ]
    }
  ];

  return (
    <div
      ref={drawerRef}
      role="dialog"
      aria-modal="true"
      aria-label={lang === 'hi' ? 'साइट नेविगेशन मेन्यू' : 'Site Navigation Menu'}
      className="fixed inset-0 z-[80] flex justify-end animate-in fade-in duration-200"
    >
      {/* Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-surface/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet Content */}
      <div className="relative w-full max-w-2xl bg-surface-raised border-l border-line h-full flex flex-col shadow-2xl z-10 overflow-hidden">
        {/* Sheet Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-line shrink-0">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="Eco Sense"
              width="120"
              height="37"
              className="h-8 w-auto object-contain dark:hidden"
            />
            <img
              src="/images/logo-dark.png"
              alt="Eco Sense"
              width="120"
              height="37"
              className="h-8 w-auto object-contain hidden dark:block"
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
              Index
            </span>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label={lang === 'hi' ? 'मेन्यू बंद करें' : 'Close navigation menu'}
            className="w-10 h-10 rounded-full border border-line flex items-center justify-center text-heading hover:bg-surface transition-colors focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Grouped Feature Directory */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 overscroll-contain">
          {GROUPS.map((group) => (
            <div key={group.number} className="space-y-3">
              {/* Group Eyebrow Rule */}
              <div className="flex items-center justify-between border-b border-line pb-1.5">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xs text-primary font-bold">{group.number}</span>
                  <h3 className="font-mono text-xs uppercase tracking-wider text-heading font-semibold">
                    {group.title}
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-text-muted">
                  {group.links.length} {lang === 'hi' ? 'आइटम' : 'routes'}
                </span>
              </div>

              {/* Grid of Link Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {group.links.map((item, idx) => {
                  const Icon = item.icon;
                  const isActive = item.path && location.pathname === item.path;

                  if (item.action) {
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={item.action}
                        className="group flex items-start gap-3 p-3 rounded-xl border border-line bg-surface hover:bg-surface-accent/30 transition-all text-left focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-surface-raised border border-line text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-sans text-xs font-semibold text-heading flex items-center justify-between">
                            <span className="truncate">{item.label}</span>
                            <ArrowRight className="w-3 h-3 text-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                          </div>
                          <p className="text-[11px] text-text-muted line-clamp-1 mt-0.5 font-sans">
                            {item.desc}
                          </p>
                        </div>
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={`group flex items-start gap-3 p-3 rounded-xl border transition-all text-left focus-visible:outline-2 focus-visible:outline-focus ${
                        isActive
                          ? 'border-primary/50 bg-primary/10'
                          : 'border-line bg-surface hover:bg-surface-accent/30'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-surface-raised border border-line text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-sans text-xs font-semibold text-heading flex items-center justify-between">
                          <span className="truncate">{item.label}</span>
                          <ArrowRight className="w-3 h-3 text-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                        </div>
                        <p className="text-[11px] text-text-muted line-clamp-1 mt-0.5 font-sans">
                          {item.desc}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sheet Footer Statement */}
        <div className="px-6 py-4 border-t border-line bg-surface text-center text-xs font-mono text-text-muted shrink-0">
          <span>Eco Sense — Shop with sense. Shop with purpose.</span>
        </div>
      </div>
    </div>
  );
}

