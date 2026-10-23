import React from 'react';
import { Zap, ZapOff, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ showMotionToggle = true, showThemeToggle = true }) {
  const { isDark, toggleTheme, reduceEffects, toggleReduceEffects } = useTheme();

  return (
    <div className="flex items-center gap-1 p-1 rounded-full bg-surface-sunken/80 border border-line backdrop-blur-sm">
      {/* Dark / Light Theme Toggle */}
      {showThemeToggle && (
        <button
          type="button"
          onClick={toggleTheme}
          className="w-8 h-8 rounded-full transition-all cursor-pointer flex items-center justify-center text-text-muted hover:text-heading hover:bg-surface-raised active:scale-95 focus-visible:outline-2 focus-visible:outline-focus"
          title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Forest Theme'}
          aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Forest Theme'}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 text-emerald-700 transition-transform duration-300 hover:-rotate-12" />
          )}
        </button>
      )}

      {/* Reduce Effects Global Toggle (Feature 4 & Rule 5) */}
      {showMotionToggle && (
        <button
          type="button"
          onClick={toggleReduceEffects}
          className={`w-8 h-8 rounded-full transition-all cursor-pointer flex items-center justify-center active:scale-95 focus-visible:outline-2 focus-visible:outline-focus ${
            reduceEffects
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'text-text-muted hover:text-heading hover:bg-surface-raised'
          }`}
          title={
            reduceEffects
              ? 'Reduce effects: ACTIVE (3D & heavy animations disabled for low battery / school laptops)'
              : 'Reduce effects: OFF (Click to disable 3D, particles & heavy animations)'
          }
          aria-label="Toggle Reduce effects"
        >
          {reduceEffects ? (
            <ZapOff className="w-4 h-4 text-amber-400" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
        </button>
      )}
    </div>
  );
}
