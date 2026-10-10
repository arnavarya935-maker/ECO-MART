import React, { useState, useEffect, Suspense } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sparkles, ZapOff, AlertCircle } from 'lucide-react';

export default function Safe3D({
  children,
  fallbackTitle = 'Planetary 3D View',
  fallbackSubtitle = 'Visualizer paused under Reduce Effects or when WebGL is unavailable.',
  fallbackEmoji = '🌍',
  className = 'h-80 w-full'
}) {
  const { reduceEffects } = useTheme();
  const [hasWebGL, setHasWebGL] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
      }
    } catch (_e) {
      setHasWebGL(false);
    }
  }, []);

  // Simulate quick local model progress
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (reduceEffects || !hasWebGL) {
    return (
      <div
        className={`flex flex-col items-center justify-center p-8 text-center rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white dark:from-[#0D241C] dark:to-[#0D1F18] border border-emerald-300/60 dark:border-emerald-800/60 shadow-xs ${className}`}
      >
        <div className="w-20 h-20 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-4xl shadow-xs mb-3">
          {fallbackEmoji}
        </div>
        <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#0B3B2C] dark:text-emerald-300">
          <ZapOff className="w-3.5 h-3.5 text-amber-500" />
          <span>{fallbackTitle}</span>
        </div>
        <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 max-w-xs font-medium">
          {fallbackSubtitle}
        </p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 dark:bg-[#0D1F18]/80 backdrop-blur-xs rounded-3xl p-6">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin mb-3" />
          <div className="text-xs font-extrabold text-[#0B3B2C] dark:text-emerald-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Loading 3D Visualizer...</span>
          </div>
          <div className="w-48 bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-emerald-500 h-full w-2/3 animate-pulse" />
          </div>
        </div>
      )}

      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  );
}
