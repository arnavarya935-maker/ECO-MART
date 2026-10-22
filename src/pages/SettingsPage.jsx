import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import {
  Zap,
  ZapOff,
  Volume2,
  VolumeX,
  Trash2,
  CheckCircle2,
  Eye,
  Type
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

export default function SettingsPage() {
  const {
    reduceEffects,
    toggleReduceEffects,
    highContrast,
    setHighContrast,
    dyslexicFont,
    setDyslexicFont,
    textSize,
    setTextSize
  } = useTheme();

  const { clearCart, setOrders, setWishlist } = useCart();

  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('ecomart_sound_enabled');
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [resetConfirm, setResetConfirm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem('ecomart_sound_enabled', JSON.stringify(next));
    showFeedback('Sound preferences updated');
  };

  const showFeedback = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleResetAllData = () => {
    try {
      localStorage.removeItem('ecomart_cart');
      localStorage.removeItem('ecomart_orders');
      localStorage.removeItem('ecomart_wishlist');
      localStorage.removeItem('ecomart_quiz_result');
      localStorage.removeItem('ecomart_challenges');
      localStorage.removeItem('ecomart_pledges');
      localStorage.removeItem('ecomart_recent');
      localStorage.removeItem('ecomart_first_run_goal');
      if (clearCart) clearCart();
      if (setOrders) setOrders([]);
      if (setWishlist) setWishlist([]);
      setResetConfirm(false);
      showFeedback('All local data reset to default successfully.');
    } catch {
      setResetConfirm(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in pb-24">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-line gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
              Preferences & Accessibility
            </span>
            <span className="text-xs text-muted font-medium">100% Offline Storage</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-heading mt-1.5 tracking-tight">
            Application Settings
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            Configure visual ergonomics, accessibility, audio cues, and offline device storage.
          </p>
        </div>

        {successMsg && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20 shadow-soft-xs">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Feature 29: Accessibility Text Size */}
        <Card clean={true} className="space-y-4 bg-surface border border-line shadow-soft-sm rounded-3xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-surface-sunken border border-line flex items-center justify-center text-heading">
              <Type className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-heading">
                Text Size Scale
              </h3>
              <p className="text-[11px] text-muted font-normal">
                Adjust typography scaling for optimal reading
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2">
            {[
              { id: 'normal', label: 'Default' },
              { id: 'large', label: 'Large (+12%)' },
              { id: 'xlarge', label: 'XL (+25%)' }
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setTextSize(s.id);
                  showFeedback(`Text scale set to ${s.label}`);
                }}
                className={`py-2 px-3 rounded-full text-xs font-medium border transition cursor-pointer min-h-[44px] ${
                  textSize === s.id
                    ? 'bg-primary text-primary-contrast border-primary shadow-soft-xs'
                    : 'bg-surface-sunken hover:bg-surface text-secondary border-line'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Feature 29: Dyslexia-Friendly Font & High Contrast */}
        <Card clean={true} className="space-y-4 bg-surface border border-line shadow-soft-sm rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-surface-sunken border border-line flex items-center justify-center text-heading">
                <Eye className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-heading">
                  Dyslexia-Friendly Font
                </h3>
                <p className="text-[11px] text-muted font-normal">
                  High-legibility typeface with weighted baselines
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setDyslexicFont(!dyslexicFont);
                showFeedback(dyslexicFont ? 'Standard font restored' : 'Dyslexia font activated');
              }}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors cursor-pointer min-h-[44px] ${
                dyslexicFont ? 'bg-primary' : 'bg-surface-sunken border border-line'
              }`}
              aria-label="Toggle Dyslexia font"
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-surface shadow-soft-xs transition-transform ${
                  dyslexicFont ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="pt-2 border-t border-line flex items-center justify-between">
            <div>
              <span className="font-semibold text-xs text-heading block">High Contrast Mode</span>
              <span className="text-[11px] text-muted">Enhanced WCAG AAA contrast ratio</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setHighContrast(!highContrast);
                showFeedback(highContrast ? 'Standard contrast restored' : 'High contrast active');
              }}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors cursor-pointer min-h-[44px] ${
                highContrast ? 'bg-primary' : 'bg-surface-sunken border border-line'
              }`}
              aria-label="Toggle High contrast"
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-surface shadow-soft-xs transition-transform ${
                  highContrast ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </Card>

        {/* Performance & School Laptops (Rule 5 & Feature 4) */}
        <Card clean={true} className="space-y-4 bg-surface border border-line shadow-soft-sm rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-warning/10 border border-warning/20 flex items-center justify-center text-warning">
                {reduceEffects ? <ZapOff className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-heading">
                  Reduce Effects Mode
                </h3>
                <p className="text-[11px] text-muted font-normal">
                  Optimized for school laptops & battery saver
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                toggleReduceEffects();
                showFeedback(reduceEffects ? 'Effects enabled' : 'Reduce effects active');
              }}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors cursor-pointer min-h-[44px] ${
                reduceEffects ? 'bg-warning' : 'bg-surface-sunken border border-line'
              }`}
              aria-label="Toggle Reduce effects"
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-surface shadow-soft-xs transition-transform ${
                  reduceEffects ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-secondary leading-relaxed font-normal">
            Disables 3D canvases, floating leaf particles, and cursor parallax. Saves GPU cycles and delivers consistent 60fps on modest hardware.
          </p>
          <div className="pt-2">
            <Badge variant={reduceEffects ? 'warning' : 'neutral'} size="sm">
              Status: {reduceEffects ? 'Effects Reduced (High Performance)' : 'Full Visual Effects Enabled'}
            </Badge>
          </div>
        </Card>

        {/* Audio Feedback (Feature 62) */}
        <Card clean={true} className="space-y-4 bg-surface border border-line shadow-soft-sm rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-surface-sunken border border-line flex items-center justify-center text-heading">
                {soundEnabled ? <Volume2 className="w-5 h-5 text-primary" /> : <VolumeX className="w-5 h-5 text-muted" />}
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-heading">
                  Web Audio Synthesizer
                </h3>
                <p className="text-[11px] text-muted font-normal">
                  100% offline audio chimes & clicks
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleSound}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors cursor-pointer min-h-[44px] ${
                soundEnabled ? 'bg-primary' : 'bg-surface-sunken border border-line'
              }`}
              aria-label="Toggle sound"
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-surface shadow-soft-xs transition-transform ${
                  soundEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-secondary leading-relaxed font-normal">
            Synthesizes lightweight, pleasant UI sound cues using the local Web Audio API. Zero external audio downloads needed. (Muted by default).
          </p>
          <div className="pt-2">
            <Badge variant={soundEnabled ? 'primary' : 'neutral'} size="sm">
              Status: {soundEnabled ? 'Sound Effects Enabled' : 'Muted (Default)'}
            </Badge>
          </div>
        </Card>
      </div>

      {/* Local Storage & Privacy Management */}
      <Card clean={true} className="border border-line bg-surface shadow-soft-sm rounded-3xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center text-danger shrink-0 mt-0.5">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-heading">
                Reset Local Storage & Data
              </h3>
              <p className="text-xs text-secondary mt-0.5 leading-relaxed">
                Clear locally cached cart items, order history, quiz scores, and restart the first-run experience.
              </p>
            </div>
          </div>

          {!resetConfirm ? (
            <Button
              variant="danger"
              size="sm"
              onClick={() => setResetConfirm(true)}
            >
              Clear All Data
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="danger"
                size="sm"
                onClick={handleResetAllData}
              >
                Confirm Reset
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setResetConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
