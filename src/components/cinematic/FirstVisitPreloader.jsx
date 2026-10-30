import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { isFeatureEnabled } from '../../lib/features';

/**
 * FirstVisitPreloader
 * Thin progress bar + short loading status on the very first session visit.
 * At most ~850ms, never in Judge Mode or reduced motion.
 */
export default function FirstVisitPreloader() {
  const { reduceEffects, judgeMode } = useTheme();
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('00 — Calibrating environmental baseline...');

  useEffect(() => {
    if (!isFeatureEnabled('cinematicShell') || reduceEffects || judgeMode) {
      return;
    }

    try {
      const seen = sessionStorage.getItem('ecosense_preloader_seen');
      if (seen) return;
    } catch {
      return;
    }

    setActive(true);

    const t1 = setTimeout(() => {
      setProgress(45);
      setMessage('01 — Tuning circular telemetry...');
    }, 250);

    const t2 = setTimeout(() => {
      setProgress(88);
      setMessage('02 — Synchronizing local models...');
    }, 550);

    const t3 = setTimeout(() => {
      setProgress(100);
      setMessage('Ready.');
    }, 780);

    const t4 = setTimeout(() => {
      setActive(false);
      try {
        sessionStorage.setItem('ecosense_preloader_seen', 'true');
      } catch {}
    }, 950);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [reduceEffects, judgeMode]);

  if (!active) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[100] bg-surface flex flex-col justify-between p-6 sm:p-10 pointer-events-none transition-opacity duration-300"
      style={{ opacity: progress === 100 ? 0 : 1 }}
    >
      {/* Top Hairline Progress Bar */}
      <div className="w-full h-0.5 bg-line overflow-hidden rounded-full">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Center Minimal Wordmark */}
      <div className="flex flex-col items-center justify-center my-auto space-y-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary font-semibold">
          Eco Sense
        </span>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-tight text-heading">
          Shop with purpose.
        </h1>
      </div>

      {/* Bottom Status Ticker */}
      <div className="flex items-center justify-between text-xs font-mono text-text-muted">
        <span>{message}</span>
        <span className="tabular-nums font-semibold">{progress}%</span>
      </div>
    </div>
  );
}
