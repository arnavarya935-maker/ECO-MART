import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { isFeatureEnabled } from '../../lib/features';

/**
 * VignetteOverlay
 * Subtle radial vignette darkening the viewport edges.
 * Disabled under reduced-motion, Judge Mode, or when cinematicShell is off.
 */
export default function VignetteOverlay() {
  const { reduceEffects, judgeMode, highContrast } = useTheme();

  if (!isFeatureEnabled('cinematicShell') || reduceEffects || judgeMode || highContrast) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[36] select-none transition-opacity duration-500"
      style={{
        background: 'radial-gradient(circle at 50% 50%, transparent 58%, rgba(2, 8, 5, 0.45) 100%)',
      }}
    />
  );
}
