import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Loader2, Sparkles, FastForward } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useT } from '../../context/I18nContext';

export default function TransformerThinking({ trace = [], onComplete }) {
  const { reduceEffects, judgeMode } = useTheme();
  const { t } = useT();
  const isInstant = reduceEffects || judgeMode;

  const [visibleStepCount, setVisibleStepCount] = useState(() => (isInstant ? trace.length : 1));
  const timerRef = useRef(null);

  useEffect(() => {
    if (isInstant) {
      onComplete?.();
      return;
    }

    if (visibleStepCount < trace.length) {
      timerRef.current = setTimeout(() => {
        setVisibleStepCount((prev) => prev + 1);
      }, 350);
    } else {
      timerRef.current = setTimeout(() => {
        onComplete?.();
      }, 300);
    }

    return () => clearTimeout(timerRef.current);
  }, [visibleStepCount, trace.length, isInstant, onComplete]);

  const handleSkip = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisibleStepCount(trace.length);
    onComplete?.();
  };

  return (
    <div
      role="region"
      aria-live="polite"
      aria-label="Agent Reasoning Trace"
      className="bg-surface border border-line rounded-3xl p-6 sm:p-8 shadow-soft-sm space-y-6 animate-fade-in"
    >
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-serif font-bold text-heading">
              {t('transformer.thinkingTitle', 'How I Decided')}
            </h3>
            <p className="text-xs text-secondary">
              Autonomous reasoning & multi-criteria knapsack optimization
            </p>
          </div>
        </div>

        {visibleStepCount < trace.length && !isInstant && (
          <button
            type="button"
            onClick={handleSkip}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-sunken hover:bg-surface-raised border border-line text-xs text-secondary hover:text-heading cursor-pointer transition focus-visible:outline-2 focus-visible:outline-focus"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>{t('transformer.skipThinking', 'Skip')}</span>
          </button>
        )}
      </div>

      <div className="space-y-3">
        {trace.slice(0, visibleStepCount).map((step, idx) => {
          const isCurrent = idx === visibleStepCount - 1 && visibleStepCount < trace.length;
          return (
            <div
              key={step.step}
              className={`p-4 rounded-2xl border transition-all ${
                isCurrent
                  ? 'bg-primary/5 border-primary/30 shadow-soft-xs'
                  : 'bg-surface-raised border-line'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0">
                  {isCurrent && !isInstant ? (
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  )}
                </span>
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Step {step.step} • {step.title}
                  </div>
                  <p className="text-xs sm:text-sm text-heading leading-relaxed">
                    {step.detail}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
