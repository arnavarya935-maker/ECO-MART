import React from 'react';
import { Zap, ZapOff } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ showMotionToggle = true }) {
  const { reduceEffects, toggleReduceEffects } = useTheme();

  return (
    <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-surface-sunken border border-line">
      {/* Reduce Effects Global Toggle (Feature 4 & Rule 5) */}
      {showMotionToggle && (
        <button
          type="button"
          onClick={toggleReduceEffects}
          className={`w-9 h-9 rounded-xl transition-colors cursor-pointer flex items-center justify-center focus-visible:outline-2 focus-visible:outline-focus ${
            reduceEffects
              ? 'bg-warning-subtle text-warning border border-warning/30 shadow-soft-xs'
              : 'text-secondary hover:text-heading hover:bg-surface-raised'
          }`}
          title={
            reduceEffects
              ? 'Reduce effects: ACTIVE (3D & heavy animations disabled for low battery / school laptops)'
              : 'Reduce effects: OFF (Click to disable 3D, particles & heavy animations)'
          }
          aria-label="Toggle Reduce effects"
        >
          {reduceEffects ? (
            <ZapOff className="w-4 h-4 text-warning" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
        </button>
      )}
    </div>
  );
}
