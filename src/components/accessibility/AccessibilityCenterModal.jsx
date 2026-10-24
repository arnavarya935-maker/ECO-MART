import React from 'react';
import {
  Eye,
  Type,
  Zap,
  ZapOff,
  Sun,
  Smile,
  Volume2,
  VolumeX,
  X,
  RotateCcw,
  Check,
  ShieldCheck
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function AccessibilityCenterModal({ isOpen, onClose }) {
  const {
    highContrast,
    setHighContrast,
    dyslexicFont,
    setDyslexicFont,
    textSize,
    setTextSize,
    reduceEffects,
    toggleReduceEffects,
    kidsMode,
    toggleKidsMode
  } = useTheme();

  if (!isOpen) return null;

  const handleResetDefaults = () => {
    setHighContrast(false);
    setDyslexicFont(false);
    setTextSize('normal');
    if (reduceEffects) toggleReduceEffects();
    if (kidsMode) toggleKidsMode();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-modals flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-left text-text"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-surface-raised border border-line rounded-3xl shadow-soft-xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-line bg-surface flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
                WCAG 2.1 AA Compliant
              </span>
              <span className="text-xs text-muted font-medium">Display &amp; Ergonomics</span>
            </div>
            <h3 className="font-serif font-bold text-2xl text-heading mt-1">
              Accessibility &amp; Ergonomics Center
            </h3>
            <p className="text-xs text-secondary mt-0.5">
              Customize visual contrast, typography legibility, motion physics, and simplified controls.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-xl text-muted hover:text-heading hover:bg-surface-sunken transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close Accessibility Center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* 1. Text Size Selector */}
          <div className="p-4 rounded-2xl bg-surface border border-line space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-serif font-bold text-sm text-heading">
                <Type className="w-4 h-4 text-primary" />
                <span>Text Size Scale</span>
              </div>
              <span className="text-xs font-mono text-muted uppercase">
                Active: {textSize}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'normal', label: 'Default', size: '100%' },
                { id: 'large', label: 'Large', size: '+15%' },
                { id: 'xlarge', label: 'Extra Large', size: '+30%' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTextSize(opt.id)}
                  className={`p-2.5 min-h-[44px] rounded-xl border text-xs font-semibold transition cursor-pointer text-center flex flex-col items-center justify-center ${
                    textSize === opt.id
                      ? 'bg-primary text-primary-contrast border-primary shadow-soft-xs'
                      : 'bg-surface-sunken hover:bg-surface border-line text-secondary'
                  }`}
                >
                  <div>{opt.label}</div>
                  <div className={`text-xs font-normal ${textSize === opt.id ? 'text-primary-contrast/80' : 'text-muted'}`}>
                    {opt.size}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Dyslexia-Friendly Font */}
          <div className="p-4 rounded-2xl bg-surface border border-line flex items-center justify-between gap-4">
            <div>
              <div className="font-serif font-bold text-sm text-heading">
                Dyslexia-Friendly Typography
              </div>
              <p className="text-xs text-secondary mt-0.5">
                Switches interface typography to weighted baseline font designed to alleviate letter confusion.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDyslexicFont(!dyslexicFont)}
              className={`px-4 py-2 min-h-[44px] rounded-xl text-xs font-semibold border transition cursor-pointer shrink-0 inline-flex items-center justify-center ${
                dyslexicFont
                  ? 'bg-primary text-primary-contrast border-primary shadow-soft-xs'
                  : 'bg-surface-sunken text-secondary border-line hover:text-heading'
              }`}
            >
              {dyslexicFont ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* 3. High Contrast Mode */}
          <div className="p-4 rounded-2xl bg-surface border border-line flex items-center justify-between gap-4">
            <div>
              <div className="font-serif font-bold text-sm text-heading">
                High Contrast Stark Borders
              </div>
              <p className="text-xs text-secondary mt-0.5">
                Elevates border opacities and stark monochrome backgrounds for outdoor sunlight legibility.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setHighContrast(!highContrast)}
              className={`px-4 py-2 min-h-[44px] rounded-xl text-xs font-semibold border transition cursor-pointer shrink-0 inline-flex items-center justify-center ${
                highContrast
                  ? 'bg-primary text-primary-contrast border-primary shadow-soft-xs'
                  : 'bg-surface-sunken text-secondary border-line hover:text-heading'
              }`}
            >
              {highContrast ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* 4. Reduced Motion */}
          <div className="p-4 rounded-2xl bg-surface border border-line flex items-center justify-between gap-4">
            <div>
              <div className="font-serif font-bold text-sm text-heading">
                Reduced Motion &amp; 3D Animation
              </div>
              <p className="text-xs text-secondary mt-0.5">
                Disables WebGL renders, parallax scrolling, and animated carousel transitions.
              </p>
            </div>
            <button
              type="button"
              onClick={toggleReduceEffects}
              className={`px-4 py-2 min-h-[44px] rounded-xl text-xs font-semibold border transition cursor-pointer shrink-0 inline-flex items-center justify-center ${
                reduceEffects
                  ? 'bg-primary text-primary-contrast border-primary shadow-soft-xs'
                  : 'bg-surface-sunken text-secondary border-line hover:text-heading'
              }`}
            >
              {reduceEffects ? 'Reduced' : 'Standard'}
            </button>
          </div>

          {/* 5. Kids Mode */}
          <div className="p-4 rounded-2xl bg-surface border border-line flex items-center justify-between gap-4">
            <div>
              <div className="font-serif font-bold text-sm text-heading flex items-center gap-1.5">
                <Smile className="w-4 h-4 text-accent" />
                <span>Kids &amp; Family Friendly Mode</span>
              </div>
              <p className="text-xs text-secondary mt-0.5">
                Enlarges interactive touch targets to 48px+, adds friendly emoji guidance, and simplifies complex jargon.
              </p>
            </div>
            <button
              type="button"
              onClick={toggleKidsMode}
              className={`px-4 py-2 min-h-[44px] rounded-xl text-xs font-semibold border transition cursor-pointer shrink-0 inline-flex items-center justify-center ${
                kidsMode
                  ? 'bg-accent text-accent-contrast border-accent shadow-soft-xs font-bold'
                  : 'bg-surface-sunken text-secondary border-line hover:text-heading'
              }`}
            >
              {kidsMode ? 'Active 🎈' : 'Off'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-surface border-t border-line flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="text-xs text-secondary hover:text-heading flex items-center gap-1.5 cursor-pointer font-medium min-h-[44px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Standard Defaults</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 min-h-[44px] rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast text-xs font-semibold transition cursor-pointer shadow-soft-xs inline-flex items-center justify-center"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
