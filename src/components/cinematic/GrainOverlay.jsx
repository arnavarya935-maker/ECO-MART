import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { isFeatureEnabled } from '../../lib/features';

/**
 * GrainOverlay
 * Procedural offline SVG film grain tile at ~5% opacity.
 * Switched off under grainOverlay=false, reduceEffects, Judge Mode, or High Contrast.
 */
export default function GrainOverlay() {
  const { reduceEffects, judgeMode, highContrast } = useTheme();

  if (!isFeatureEnabled('grainOverlay') || !isFeatureEnabled('cinematicShell') || reduceEffects || judgeMode || highContrast) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[37] opacity-[0.045] dark:opacity-[0.06] select-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
      }}
    />
  );
}
