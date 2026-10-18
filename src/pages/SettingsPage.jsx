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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Preferences & Accessibility
            </span>
            <span className="text-xs text-stone-500 font-bold">100% Offline Storage</span>
          </div>
          <h1 className="text-3xl font-black text-[#0B3B2C] mt-1.5">
            Application Settings
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Configure visual ergonomics, accessibility, audio cues, and offline device storage.
          </p>
        </div>

        {successMsg && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Feature 29: Accessibility Text Size */}
        <Card clean={true} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-[#0B3B2C]">
                Text Size Scale
              </h3>
              <p className="text-[11px] text-stone-500 font-medium">
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
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                  textSize === s.id
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Feature 29: Dyslexia-Friendly Font & High Contrast */}
        <Card clean={true} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-700">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm text-[#0B3B2C]">
                  Dyslexia-Friendly Font
                </h3>
                <p className="text-[11px] text-stone-500 font-medium">
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
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                dyslexicFont ? 'bg-teal-600' : 'bg-stone-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  dyslexicFont ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
            <div>
              <span className="font-black text-xs text-stone-900 block">High Contrast Mode</span>
              <span className="text-[11px] text-stone-500">Enhanced WCAG AAA contrast ratio</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setHighContrast(!highContrast);
                showFeedback(highContrast ? 'Standard contrast restored' : 'High contrast active');
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                highContrast ? 'bg-stone-900' : 'bg-stone-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  highContrast ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </Card>

        {/* Performance & School Laptops (Rule 5 & Feature 4) */}
        <Card clean={true} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700">
                {reduceEffects ? <ZapOff className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-black text-sm text-[#0B3B2C]">
                  Reduce Effects Mode
                </h3>
                <p className="text-[11px] text-stone-500 font-medium">
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
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                reduceEffects ? 'bg-amber-500' : 'bg-stone-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  reduceEffects ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed font-medium">
            Disables 3D canvases, floating leaf particles, and cursor parallax. Saves GPU cycles and delivers consistent 60fps on modest hardware.
          </p>
          <div className="pt-2">
            <Badge variant={reduceEffects ? 'amber' : 'neutral'} size="sm">
              Status: {reduceEffects ? 'Effects Reduced (High Performance)' : 'Full Visual Effects Enabled'}
            </Badge>
          </div>
        </Card>

        {/* Audio Feedback (Feature 62) */}
        <Card clean={true} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-700">
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-black text-sm text-[#0B3B2C]">
                  Web Audio Synthesizer
                </h3>
                <p className="text-[11px] text-stone-500 font-medium">
                  100% offline audio chimes & clicks
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleSound}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                soundEnabled ? 'bg-emerald-600' : 'bg-stone-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  soundEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed font-medium">
            Synthesizes lightweight, pleasant UI sound cues using the local Web Audio API. Zero external audio downloads needed. (Muted by default).
          </p>
          <div className="pt-2">
            <Badge variant={soundEnabled ? 'emerald' : 'neutral'} size="sm">
              Status: {soundEnabled ? 'Sound Effects Enabled' : 'Muted (Default)'}
            </Badge>
          </div>
        </Card>
      </div>

      {/* Local Storage & Privacy Management */}
      <Card clean={true} className="border-rose-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-700 shrink-0 mt-0.5">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-rose-900">
                Reset Local Storage & Data
              </h3>
              <p className="text-xs text-stone-600 mt-0.5">
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
