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
  Type,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Globe,
  Sun,
  Moon,
  ShieldAlert
} from 'lucide-react';
import { useT } from '../context/I18nContext';
import { FEATURES } from '../lib/features';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { getStrictnessThreshold, setStrictnessThreshold } from '../lib/ai/confidenceBrake';

export default function SettingsPage() {
  const {
    theme,
    setTheme,
    reduceEffects,
    toggleReduceEffects,
    highContrast,
    setHighContrast,
    dyslexicFont,
    setDyslexicFont,
    textSize,
    setTextSize
  } = useTheme();

  const {
    clearCart,
    setOrders,
    setWishlist,
    setIsAgentOpen,
    copilotMuted,
    toggleCopilotMuted
  } = useCart();

  const { t, lang, setLang } = useT();

  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('ecomart_sound_enabled');
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [strictness, setStrictnessState] = useState(() => getStrictnessThreshold());
  const [resetConfirm, setResetConfirm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [aiHealth, setAiHealth] = useState(null);
  const [healthLoading, setHealthLoading] = useState(true);

  React.useEffect(() => {
    let isMounted = true;
    fetch('/api/health')
      .then((r) => r.json())
      .then((data) => {
        if (isMounted) {
          setAiHealth(data);
          setHealthLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setAiHealth({ status: 'error' });
          setHealthLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, []);

  const getAiHelperStatusText = () => {
    if (healthLoading) return 'AI helper: checking connection...';
    if (aiHealth?.status === 'working') {
      const sec = aiHealth.latencyMs ? (aiHealth.latencyMs / 1000).toFixed(1) : '1.2';
      return `AI helper: working, ${sec} s`;
    }
    const reasonMap = {
      key_missing: 'key missing',
      rate_limited: 'rate limited',
      model_error: 'model not found',
      error: 'network error'
    };
    const reason = reasonMap[aiHealth?.status] || 'not connected';
    return `AI helper: couldn't connect right now (${reason})`;
  };

  const handleStrictnessChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setStrictnessState(val);
    setStrictnessThreshold(val);
    showFeedback(`Agent strictness threshold set to ${val}%`);
  };

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

  const handleWipeAIMemory = () => {
    try {
      localStorage.removeItem('ecomart_user_priorities');
      localStorage.removeItem('ecomart_reported_answers');
      localStorage.removeItem('ecomart_recently_viewed');
      window.dispatchEvent(new CustomEvent('reset-demo'));
      showFeedback('AI memory, inferences, and decision weights wiped cleanly.');
    } catch {
      showFeedback('Failed to wipe AI memory.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in pb-24">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-line gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
              {t('settings.title', 'Preferences & Accessibility')}
            </span>
            <span className="text-xs text-muted font-medium">Local Storage</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-heading mt-1.5 tracking-tight">
            {lang === 'hi' ? 'एप्लिकेशन सेटिंग्स' : 'Application Settings'}
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            {lang === 'hi'
              ? 'इंटरफ़ेस भाषा, दृश्य एर्गोनॉमिक्स, ऑडियो और डिवाइस प्राथमिकताओं को कॉन्फ़िगर करें।'
              : 'Configure visual ergonomics, accessibility, audio cues, and local device storage.'}
          </p>
        </div>

        {successMsg && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20 shadow-soft-xs">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      {/* Phase 7: Bilingual Language Switcher Card */}
      {FEATURES.HINDI_LANGUAGE && (
        <Card clean={true} className="space-y-4 bg-surface border border-line shadow-soft-sm rounded-3xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-surface-sunken border border-line flex items-center justify-center text-heading">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-heading">
                  {t('settings.language', 'Language / भाषा')}
                </h3>
                <p className="text-[11px] text-muted font-normal">
                  {t('settings.languageDesc', 'Toggle bilingual interface with local typography support')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setLang('en');
                  showFeedback('Language switched to English');
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold border transition cursor-pointer min-h-[44px] ${
                  lang === 'en'
                    ? 'bg-primary text-primary-contrast border-primary shadow-soft-xs'
                    : 'bg-surface-sunken hover:bg-surface text-secondary border-line'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => {
                  setLang('hi');
                  showFeedback('भाषा हिंदी पर सेट की गई (Hindi Activated)');
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold border transition cursor-pointer min-h-[44px] ${
                  lang === 'hi'
                    ? 'bg-primary text-primary-contrast border-primary shadow-soft-xs'
                    : 'bg-surface-sunken hover:bg-surface text-secondary border-line'
                }`}
              >
                हिंदी (Hindi)
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Theme Appearance: Dark / Light Mode */}
      <Card clean={true} className="space-y-4 bg-surface border border-line shadow-soft-sm rounded-3xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-surface-sunken border border-line flex items-center justify-center text-heading">
              {theme === 'dark' ? <Moon className="w-5 h-5 text-emerald-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-heading">
                Theme & Canvas
              </h3>
              <p className="text-[11px] text-muted font-normal">
                Choose between warm cream light theme and deep forest dark theme
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setTheme('dark');
                showFeedback('Dark editorial theme activated (Forest Black)');
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition cursor-pointer min-h-[44px] flex items-center gap-1.5 ${
                theme === 'dark'
                  ? 'bg-primary text-primary-contrast border-primary shadow-soft-xs'
                  : 'bg-surface-sunken hover:bg-surface text-secondary border-line'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark (Default)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setTheme('light');
                showFeedback('Light theme activated (Warm Sand)');
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition cursor-pointer min-h-[44px] flex items-center gap-1.5 ${
                theme === 'light'
                  ? 'bg-primary text-primary-contrast border-primary shadow-soft-xs'
                  : 'bg-surface-sunken hover:bg-surface text-secondary border-line'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Light (Sand)</span>
            </button>
          </div>
        </div>
      </Card>

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
                  Local audio chimes & clicks
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
        
        {/* Proactive Copilot (Phase 3) */}
        <Card clean={true} className="space-y-4 bg-surface border border-line shadow-soft-sm rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-surface-sunken border border-line flex items-center justify-center text-heading">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-heading">
                  Proactive Eco Copilot
                </h3>
                <p className="text-[11px] text-muted font-normal">
                  Rate-limited intelligent nudges, swap alerts & budget tracking
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                toggleCopilotMuted();
                showFeedback(copilotMuted ? 'Eco Copilot nudges unmuted' : 'Eco Copilot nudges muted');
              }}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors cursor-pointer min-h-[44px] ${
                !copilotMuted ? 'bg-primary' : 'bg-surface-sunken border border-line'
              }`}
              aria-label="Toggle Copilot Muted"
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-surface shadow-soft-xs transition-transform ${
                  !copilotMuted ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-secondary leading-relaxed font-normal">
            Provides contextual recommendations with "Why am I seeing this?" reasoning when conventional items are added. Rate-limited to at most 1 per 20 seconds and 5 per session.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <Badge variant={copilotMuted ? 'warning' : 'primary'} size="sm">
              {copilotMuted ? 'Muted' : 'Active'}
            </Badge>
          </div>
        </Card>

        {/* Confidence Brake Strictness Slider (Feature F3) */}
        <Card clean={true} className="space-y-4 bg-surface border border-line shadow-soft-sm rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-heading">
                  Confidence Brake (Strictness)
                </h3>
                <p className="text-[11px] text-muted font-normal">
                  Decline low-certainty claims instead of guessing
                </p>
              </div>
            </div>
            <Badge variant={strictness >= 80 ? 'warning' : 'primary'} size="sm">
              {strictness}% Threshold
            </Badge>
          </div>
          <p className="text-xs text-secondary leading-relaxed font-normal">
            When Eco Agent certainty falls below this threshold, it refuses to guess, details exactly what lifecycle documentation is missing, and logs the interception in the Black Box and Honesty Meter.
          </p>
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-mono text-muted">
              <span>Lenient (40%)</span>
              <span className="font-bold text-primary">{strictness}% (Active)</span>
              <span>Ultra-Strict (90%)</span>
            </div>
            <input
              type="range"
              min="30"
              max="95"
              step="5"
              value={strictness}
              onChange={handleStrictnessChange}
              className="w-full accent-primary cursor-pointer h-2 bg-surface-sunken rounded-lg"
              aria-label="Confidence Brake Strictness Slider"
            />
          </div>
          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-muted">
              {strictness >= 85
                ? 'Ultra-Strict: Requires accredited third-party lab certificates.'
                : strictness >= 65
                ? 'Balanced: Declines unverified absolute claims & vague buzzwords.'
                : 'Permissive: Accepts qualitative consumer estimates.'}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAgentOpen(true);
                showFeedback('Opened Eco Agent to test Confidence Brake');
              }}
              className="text-xs"
            >
              Test in Agent
            </Button>
          </div>
        </Card>
      </div>


      {/* Responsible AI: Privacy & Memory Transparency Panel (Part 3 #7) */}
      <Card clean={true} className="border border-line bg-surface shadow-soft-sm rounded-3xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-heading">
                  AI Privacy & Memory Transparency Panel
                </h3>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase">
                  Responsible AI
                </span>
              </div>
              <p className="text-xs text-secondary mt-0.5 leading-relaxed">
                Algorithmic accountability: full transparent access to inspect, export, and wipe locally stored agent memory.
              </p>
              <div className="mt-2 inline-flex items-center gap-2 px-2.5 py-1 rounded-xl bg-surface-sunken border border-line text-xs font-mono">
                <span className={`w-2 h-2 rounded-full ${aiHealth?.status === 'working' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span className="text-text font-medium">{getAiHelperStatusText()}</span>
              </div>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleWipeAIMemory}
            className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Wipe AI Memory
          </Button>
        </div>

        {/* Live Audit of Stored Inferences */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
          <div className="p-3 rounded-2xl bg-surface-sunken border border-line space-y-1">
            <div className="font-mono text-[10px] text-text-muted uppercase">1. Decision Weights & Priorities</div>
            <div className="text-heading font-medium">Stored in LocalStorage ('ecomart_user_priorities')</div>
            <div className="text-[11px] text-text-secondary">Custom weights for price, carbon, plastic, and water. Never sent to remote ad networks.</div>
          </div>

          <div className="p-3 rounded-2xl bg-surface-sunken border border-line space-y-1">
            <div className="font-mono text-[10px] text-text-muted uppercase">2. Active Agent Session Context</div>
            <div className="text-heading font-medium">In-Memory Transient State</div>
            <div className="text-[11px] text-text-secondary">Last searched category, budget ceiling, and active greedy filters. Erased on page reload or wipe.</div>
          </div>

          <div className="p-3 rounded-2xl bg-surface-sunken border border-line space-y-1">
            <div className="font-mono text-[10px] text-text-muted uppercase">3. Reported Inaccuracies & Audits</div>
            <div className="text-heading font-medium">Stored Locally ('ecomart_reported_answers')</div>
            <div className="text-[11px] text-text-secondary">User feedback on hallucinations or wrong lifecycle facts, kept 100% on device for local review.</div>
          </div>

          <div className="p-3 rounded-2xl bg-surface-sunken border border-line space-y-1">
            <div className="font-mono text-[10px] text-emerald-400 uppercase font-bold">4. Analytics & AI Notice</div>
            <div className="text-heading font-medium">0 Tracking Cookies • 0 Ad Beacons</div>
            <div className="text-[11px] text-text-secondary">Eco Sense adds no analytics or ad trackers. Your cart and settings stay in this browser. When you chat or scan a label, the text or photo is sent to Google's Gemini AI to get an answer.</div>
          </div>
        </div>
      </Card>

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
