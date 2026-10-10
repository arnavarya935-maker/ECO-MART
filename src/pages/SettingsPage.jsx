import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Settings, Zap, ZapOff, Volume2, VolumeX, Moon, Sun, Trash2, RotateCcw, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

export default function SettingsPage({ setActivePage, onStartTour }) {
  const { theme, toggleTheme, reduceEffects, toggleReduceEffects } = useTheme();
  const { currentUser, logout } = useAuth();
  const { clearCart, setOrders, setWishlist } = useCart();

  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('ecomart_sound_enabled');
      return saved !== null ? JSON.parse(saved) : false; // Muted by default as required
    } catch (_e) {
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
      localStorage.removeItem('ecomart_viewed');
      localStorage.removeItem('ecomart_tour_seen');
      if (clearCart) clearCart();
      if (setOrders) setOrders([]);
      if (setWishlist) setWishlist([]);
      setResetConfirm(false);
      showFeedback('All local data reset to default successfully.');
    } catch (_e) {
      setResetConfirm(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 dark:border-stone-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full">
              Preferences
            </span>
            <span className="text-xs text-stone-500 font-bold">100% Offline Storage</span>
          </div>
          <h1 className="text-3xl font-black text-[#0B3B2C] dark:text-stone-100 mt-1">
            Application Settings
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
            Configure visual effects, battery saving, audio feedback, and local privacy storage.
          </p>
        </div>

        {successMsg && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 text-xs font-extrabold border border-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Performance & School Laptops (Rule 5 & Feature 4) */}
        <Card clean={true} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 flex items-center justify-center text-amber-700">
                {reduceEffects ? <ZapOff className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-black text-sm text-[#0B3B2C] dark:text-stone-100">
                  Reduce Effects Mode
                </h3>
                <p className="text-[11px] text-stone-500 font-medium">
                  Optimized for school laptops & low power
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleReduceEffects}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                reduceEffects ? 'bg-amber-500' : 'bg-stone-300 dark:bg-stone-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  reduceEffects ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-medium">
            Disables 3D canvases, heavy canvas particle animations, cursor parallax, and heavy transitions. Saves battery and delivers consistent 60fps on low-end hardware.
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
              <div className="w-10 h-10 rounded-2xl bg-teal-100 dark:bg-teal-950/80 flex items-center justify-center text-teal-700">
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-black text-sm text-[#0B3B2C] dark:text-stone-100">
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
                soundEnabled ? 'bg-emerald-600' : 'bg-stone-300 dark:bg-stone-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  soundEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-medium">
            Synthesizes lightweight, pleasant UI sound cues using the local Web Audio API. Zero external audio downloads needed. (Muted by default).
          </p>
          <div className="pt-2">
            <Badge variant={soundEnabled ? 'emerald' : 'neutral'} size="sm">
              Status: {soundEnabled ? 'Sound Effects Enabled' : 'Muted (Default)'}
            </Badge>
          </div>
        </Card>

        {/* Appearance & Color Palette */}
        <Card clean={true} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-700">
                {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-black text-sm text-[#0B3B2C] dark:text-stone-100">
                  Color Theme
                </h3>
                <p className="text-[11px] text-stone-500 font-medium">
                  Strict light theme default with optional dark mode
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={toggleTheme}>
              {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            </Button>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-medium">
            EcoMart's high-contrast light theme is carefully calibrated to WCAG AA guidelines with deep forest greens, emerald accents, and soft off-white backdrops.
          </p>
        </Card>

        {/* Guided Tour (Feature 63) */}
        <Card clean={true} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-950/80 flex items-center justify-center text-sky-700">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-[#0B3B2C] dark:text-stone-100">
                Interactive Onboarding
              </h3>
              <p className="text-[11px] text-stone-500 font-medium">
                Step-by-step tour of the Eco Agent features
              </p>
            </div>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-medium">
            Replay the welcome tour to learn about the 0-100 Eco-Score formula, proactive cart swap alerts, and our AI shopping assistant.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              if (onStartTour) onStartTour();
              else localStorage.removeItem('ecomart_tour_seen');
              showFeedback('Onboarding tour reset. Reload or visit Home to view.');
            }}
          >
            Launch Onboarding Tour
          </Button>
        </Card>
      </div>

      {/* Local Storage & Privacy Management */}
      <Card clean={true} className="border-rose-200 dark:border-rose-900/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/80 flex items-center justify-center text-rose-700 shrink-0 mt-0.5">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-rose-900 dark:text-rose-200">
                Reset Local Storage & Data
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                Clear locally cached cart items, order history, quiz scores, and reset the demo environment.
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
