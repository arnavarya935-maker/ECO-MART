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
  className = 'h-80 w-full'
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
  const [loading, setLoading] = useState(true);

  // Quick progressive loader
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(timer);
  }, []);

  if (reduceEffects || !hasWebGL) {
    return (
      <div
        className={`flex flex-col items-center justify-center p-6 text-center rounded-3xl bg-gradient-to-br from-emerald-50/80 via-teal-50/40 to-white border border-emerald-300/60 shadow-xs ${className}`}
        role="region"
        aria-label={`${fallbackTitle} (2D Static Fallback)`}
      >
        {fallbackImage ? (
          <div className="w-full max-w-xs h-44 rounded-2xl overflow-hidden mb-3 relative flex items-center justify-center bg-white/80 border border-emerald-200/60 p-2 shadow-inner">
            <img
              src={fallbackImage}
              alt={fallbackTitle}
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-2xl bg-emerald-100 flex items-center justify-center text-4xl shadow-xs mb-3">
            {fallbackEmoji}
          </div>
        )}
        <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#0B3B2C]">
          <ZapOff className="w-3.5 h-3.5 text-amber-500" />
          <span>{fallbackTitle}</span>
        </div>
        <p className="text-xs text-stone-600 mt-1 max-w-xs font-medium">
          {fallbackSubtitle}
        </p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/85 backdrop-blur-xs rounded-3xl p-6">
          <div className="w-9 h-9 rounded-full border-3 border-emerald-600 border-t-transparent animate-spin mb-3" />
          <div className="text-xs font-extrabold text-[#0B3B2C] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>{loadingMessage}</span>
          </div>
          <div
            className="w-48 bg-stone-200 h-2 rounded-full overflow-hidden mt-3"
            role="progressbar"
            aria-label="3D scene loading progress"
          >
            <div className="bg-emerald-500 h-full w-3/4 animate-pulse rounded-full" />
          </div>
        </div>
      )}

      <Suspense
        fallback={
          <div className="w-full h-full flex flex-col items-center justify-center p-6">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin mb-2" />
            <span className="text-xs text-stone-500">{loadingMessage}</span>
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  );
}
