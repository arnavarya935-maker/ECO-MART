import React from 'react';
import { Sun, Moon, Zap, ZapOff } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ showMotionToggle = true }) {
  const { theme, toggleTheme, reduceEffects, toggleReduceEffects } = useTheme();

  return (
    <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-stone-100/90 dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700/80">
      {/* Dark / Light Mode Toggle */}
      <button
        type="button"
        onClick={toggleTheme}
        className="p-1.5 rounded-xl text-stone-700 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-stone-700 transition shadow-2xs cursor-pointer"
        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-label="Toggle color theme"
      >
        {theme === 'dark' ? (
          <Sun className="w-4 h-4 text-amber-400" />
        ) : (
          <Moon className="w-4 h-4 text-emerald-800" />
        )}
      </button>

      {/* Reduce Effects Global Toggle (Feature 4 & Rule 5) */}
      {showMotionToggle && (
        <button
          type="button"
          onClick={toggleReduceEffects}
          className={`p-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 ${
            reduceEffects
              ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300/50'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-white dark:hover:bg-stone-700'
          }`}
          title={
            reduceEffects
              ? 'Reduce effects: ACTIVE (3D & heavy animations disabled for low battery / school laptops)'
              : 'Reduce effects: OFF (Click to disable 3D, particles & heavy animations for school laptops)'
          }
          aria-label="Toggle Reduce effects"
        >
          {reduceEffects ? (
            <ZapOff className="w-4 h-4 text-amber-600" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
        </button>
      )}
    </div>
  );
}
