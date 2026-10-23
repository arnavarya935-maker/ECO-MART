import React, { useState, useEffect, Suspense } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sparkles, ZapOff } from 'lucide-react';

export default function Safe3D({
  children,
  fallbackTitle = '3D Visualizer',
  fallbackSubtitle = 'Visualizer paused under Reduce Effects or when WebGL is unavailable.',
  fallbackEmoji = '🌍',
  fallbackImage = null,
  loadingMessage = 'Loading 3D Visualizer...',
  className = 'h-80 w-full',
  autoLoad = false
}) {
  const { reduceEffects } = useTheme();
  const [hasWebGL] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch {
      return false;
    }
  });
  const [activated, setActivated] = useState(autoLoad);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activated) return;
    const timer = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(timer);
  }, [activated]);

  if (reduceEffects || !hasWebGL) {
    return (
      <div
        className={`flex flex-col items-center justify-center p-6 text-center rounded-3xl bg-gradient-to-br from-surface-accent via-surface-sunken to-surface-raised border border-primary/20 shadow-xs ${className}`}
        role="region"
        aria-label={`${fallbackTitle} (2D Static Fallback)`}
      >
        {fallbackImage ? (
          <div className="w-full max-w-xs h-44 rounded-2xl overflow-hidden mb-3 relative flex items-center justify-center bg-surface-raised/80 border border-line p-2 shadow-inner">
            <img
              src={fallbackImage}
              alt={fallbackTitle}
              loading="lazy"
              decoding="async"
              width="320"
              height="176"
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-2xl bg-surface-accent flex items-center justify-center text-4xl shadow-xs mb-3">
            {fallbackEmoji}
          </div>
        )}
        <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-heading">
          <ZapOff className="w-3.5 h-3.5 text-warning" />
          <span>{fallbackTitle}</span>
        </div>
        <p className="text-xs text-secondary mt-1 max-w-xs font-medium">
          {fallbackSubtitle}
        </p>
      </div>
    );
  }

  if (!activated) {
    return (
      <div
        className={`flex flex-col items-center justify-center p-6 text-center rounded-3xl bg-gradient-to-br from-surface-accent via-surface-sunken to-surface border border-primary/20 shadow-soft-sm group cursor-pointer transition-all duration-300 hover:shadow-soft-md ${className}`}
        onClick={() => setActivated(true)}
        role="region"
        aria-label={`${fallbackTitle} preview`}
      >
        <div className="w-20 h-20 rounded-2xl bg-surface-accent flex items-center justify-center text-4xl shadow-xs mb-4 group-hover:scale-105 transition-transform duration-300">
          {fallbackEmoji}
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-heading">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>{fallbackTitle}</span>
        </div>
        <p className="text-xs text-secondary mt-1.5 max-w-xs font-medium leading-relaxed">
          Interactive 3D model with orbital camera controls and live planetary metrics.
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setActivated(true);
          }}
          className="mt-4 px-5 py-2.5 rounded-2xl bg-primary hover:bg-primary-hover text-primary-contrast text-xs font-semibold flex items-center gap-2 shadow-soft-xs transition-all active:scale-98 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary-contrast" />
          <span>Explore in 3D</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-surface-raised/85 backdrop-blur-xs rounded-3xl p-6">
          <div className="w-9 h-9 rounded-full border-3 border-primary border-t-transparent animate-spin mb-3" />
          <div className="text-xs font-extrabold text-heading flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>{loadingMessage}</span>
          </div>
          <div
            className="w-48 bg-line h-2 rounded-full overflow-hidden mt-3"
            role="progressbar"
            aria-label="3D scene loading progress"
          >
            <div className="bg-primary h-full w-3/4 animate-pulse rounded-full" />
          </div>
        </div>
      )}

      <Suspense
        fallback={
          <div className="w-full h-full flex flex-col items-center justify-center p-6">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-2" />
            <span className="text-xs text-muted">{loadingMessage}</span>
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  );
}
