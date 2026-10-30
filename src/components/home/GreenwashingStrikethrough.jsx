import React, { useRef } from 'react';
import { AlertTriangle, ShieldAlert, ArrowRight, Sparkles } from 'lucide-react';
import { useScrollProgress, isReducedMotion } from '../../lib/scrollAnimation';
import { Link } from 'react-router-dom';

export default function GreenwashingStrikethrough() {
  const containerRef = useRef(null);
  const reduced = isReducedMotion();

  // 400px of comfortable scroll travel for desktop scrubbing
  const { progress } = useScrollProgress(containerRef, {
    pinTravel: 450,
    disabled: reduced
  });

  // Effective scrub progress (1 when reduced motion)
  const p = reduced ? 1 : progress;

  // Calculate strike states
  // Phase 1: 0.20 - 0.40 -> strike 1 (100% natural)
  // Phase 2: 0.40 - 0.60 -> strike 2 (eco-friendly)
  // Phase 3: 0.60 - 0.80 -> strike 3 (chemical free)
  // Phase 4: 0.80 - 1.00 -> Trust score countup to 18
  const strike1Progress = reduced ? 1 : Math.max(0, Math.min(1, (p - 0.2) / 0.2));
  const strike2Progress = reduced ? 1 : Math.max(0, Math.min(1, (p - 0.4) / 0.2));
  const strike3Progress = reduced ? 1 : Math.max(0, Math.min(1, (p - 0.6) / 0.2));
  const scoreProgress = reduced ? 1 : Math.max(0, Math.min(1, (p - 0.75) / 0.25));

  const trustScore = Math.round(scoreProgress * 18);

  return (
    <section
      ref={containerRef}
      id="greenwash-strikethrough"
      className="relative w-full bg-surface py-12 md:py-24 border-b border-line selection:bg-emerald-500/20"
      style={{
        // On desktop allow pin travel space; on mobile keep standard auto height
        minHeight: reduced ? 'auto' : 'clamp(600px, 130vh, 1000px)'
      }}
    >
      {/* Sticky viewport frame on desktop */}
      <div className="sticky top-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase bg-primary-subtle text-primary border border-primary/20 mb-4">
            <ShieldAlert className="w-3.5 h-3.5 text-primary" />
            Claim Detective (Simple Rules)
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-medium text-heading tracking-tight">
            Watch deceptive marketing unravel in real time.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-text-secondary">
            Vague buzzwords fail our claim radar. Scroll to inspect how Eco Sense flags unsubstantiated greenwashing claims.
          </p>
        </div>

        {/* Claim Audit Card */}
        <div className="relative rounded-2xl bg-surface-raised border border-line shadow-card overflow-hidden p-6 sm:p-10 transition-colors">
          {/* Subtle Ambient Radial Glow */}
          <div
            className="absolute -top-24 -right-24 w-72 h-72 rounded-full pointer-events-none transition-opacity duration-500"
            style={{
              background: 'radial-gradient(circle, rgba(239, 68, 68, 0.12) 0%, transparent 70%)',
              opacity: strike3Progress > 0 ? 1 : 0.2
            }}
          />

          {/* Top Label & Context Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-line">
            <div className="flex items-center gap-2">
              <span className="inline-block px-2.5 py-1 rounded text-xs font-mono font-semibold tracking-wider uppercase bg-amber-500/10 text-amber-500 border border-amber-500/30">
                Example claim
              </span>
              <span className="text-xs text-text-muted hidden sm:inline">
                Standard consumer product marketing sentence
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
              <span>Scroll Scrub:</span>
              <div className="w-16 h-1.5 bg-surface-sunken rounded-full overflow-hidden border border-line">
                <div
                  className="h-full bg-primary transition-all duration-75"
                  style={{ width: `${Math.round(p * 100)}%` }}
                />
              </div>
              <span className="w-8 text-right font-bold text-heading">{Math.round(p * 100)}%</span>
            </div>
          </div>

          {/* Marketing Sentence with Animated Strike-Throughs */}
          <div className="py-8 sm:py-12">
            <div className="text-xl sm:text-2xl md:text-3xl font-serif text-heading leading-relaxed sm:leading-loose">
              &ldquo;Our daily shampoo is crafted with{' '}
              {/* Word 1: 100% natural */}
              <span className="relative inline-block font-sans font-semibold text-heading mx-1 px-1">
                <span className={strike1Progress > 0.8 ? 'text-text-muted' : 'text-heading'}>
                  100% natural
                </span>
                {/* Red Strike Line */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-[3px] bg-red-500 rounded shadow-[0_0_8px_rgba(239,68,68,0.8)] pointer-events-none transition-all"
                  style={{
                    width: `${strike1Progress * 100}%`,
                    opacity: strike1Progress > 0 ? 1 : 0
                  }}
                />
              </span>
              {' '}ingredients, rigorously certified{' '}
              {/* Word 2: eco-friendly */}
              <span className="relative inline-block font-sans font-semibold text-heading mx-1 px-1">
                <span className={strike2Progress > 0.8 ? 'text-text-muted' : 'text-heading'}>
                  eco-friendly
                </span>
                {/* Red Strike Line */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-[3px] bg-red-500 rounded shadow-[0_0_8px_rgba(239,68,68,0.8)] pointer-events-none transition-all"
                  style={{
                    width: `${strike2Progress * 100}%`,
                    opacity: strike2Progress > 0 ? 1 : 0
                  }}
                />
              </span>
              , and completely{' '}
              {/* Word 3: chemical free */}
              <span className="relative inline-block font-sans font-semibold text-heading mx-1 px-1">
                <span className={strike3Progress > 0.8 ? 'text-text-muted' : 'text-heading'}>
                  chemical free
                </span>
                {/* Red Strike Line */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-[3px] bg-red-500 rounded shadow-[0_0_8px_rgba(239,68,68,0.8)] pointer-events-none transition-all"
                  style={{
                    width: `${strike3Progress * 100}%`,
                    opacity: strike3Progress > 0 ? 1 : 0
                  }}
                />
              </span>
              {' '}for guilt-free peace of mind.&rdquo;
            </div>

            {/* Accessible screen reader description */}
            <div className="sr-only">
              Example claim: &ldquo;Our daily shampoo is crafted with 100% natural ingredients, rigorously certified eco-friendly, and completely chemical free for guilt-free peace of mind.&rdquo;
              Audit outcome: Flagged for greenwashing under simple claim rules. Final trust score 18 out of 100.
            </div>

            {/* Diagnostic Badges Revealed as User Scrubs */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                className="p-3 rounded-lg border text-xs font-mono transition-all duration-300"
                style={{
                  borderColor: strike1Progress > 0.5 ? 'rgba(239, 68, 68, 0.4)' : 'var(--color-line)',
                  backgroundColor: strike1Progress > 0.5 ? 'rgba(239, 68, 68, 0.08)' : 'var(--color-surface-sunken)',
                  opacity: strike1Progress > 0.2 ? 1 : 0.35,
                  transform: strike1Progress > 0.2 ? 'translateY(0)' : 'translateY(4px)'
                }}
              >
                <div className="flex items-center gap-1.5 font-bold text-red-400 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>&quot;100% natural&quot;</span>
                </div>
                <p className="text-text-muted">
                  Vague & unsubstantiated. Omits processing agents and water carrier.
                </p>
              </div>

              <div
                className="p-3 rounded-lg border text-xs font-mono transition-all duration-300"
                style={{
                  borderColor: strike2Progress > 0.5 ? 'rgba(239, 68, 68, 0.4)' : 'var(--color-line)',
                  backgroundColor: strike2Progress > 0.5 ? 'rgba(239, 68, 68, 0.08)' : 'var(--color-surface-sunken)',
                  opacity: strike2Progress > 0.2 ? 1 : 0.35,
                  transform: strike2Progress > 0.2 ? 'translateY(0)' : 'translateY(4px)'
                }}
              >
                <div className="flex items-center gap-1.5 font-bold text-red-400 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>&quot;eco-friendly&quot;</span>
                </div>
                <p className="text-text-muted">
                  Generic claim without defined lifecycle boundaries or accredited standard.
                </p>
              </div>

              <div
                className="p-3 rounded-lg border text-xs font-mono transition-all duration-300"
                style={{
                  borderColor: strike3Progress > 0.5 ? 'rgba(239, 68, 68, 0.4)' : 'var(--color-line)',
                  backgroundColor: strike3Progress > 0.5 ? 'rgba(239, 68, 68, 0.08)' : 'var(--color-surface-sunken)',
                  opacity: strike3Progress > 0.2 ? 1 : 0.35,
                  transform: strike3Progress > 0.2 ? 'translateY(0)' : 'translateY(4px)'
                }}
              >
                <div className="flex items-center gap-1.5 font-bold text-red-400 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>&quot;chemical free&quot;</span>
                </div>
                <p className="text-text-muted">
                  Factually meaningless. Water and plants are chemical compounds.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Trust Score Count-Up & Resolution */}
          <div className="pt-6 border-t border-line flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 w-full md:w-auto">
              {/* Trust Score Radial Badge */}
              <div
                className="relative flex items-center justify-center w-20 h-20 rounded-2xl border transition-all duration-300"
                style={{
                  backgroundColor: scoreProgress > 0.5 ? 'rgba(239, 68, 68, 0.12)' : 'var(--color-surface-sunken)',
                  borderColor: scoreProgress > 0.5 ? 'rgba(239, 68, 68, 0.4)' : 'var(--color-line)'
                }}
              >
                <div className="text-center">
                  <div className="text-2xl font-mono font-bold tracking-tight text-red-400">
                    {trustScore}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
                    / 100
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-heading">
                    Sample Trust Score
                  </span>
                  <span
                    className="inline-block px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase transition-all duration-200"
                    style={{
                      backgroundColor: scoreProgress > 0.8 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      color: scoreProgress > 0.8 ? '#EF4444' : '#F59E0B'
                    }}
                  >
                    {scoreProgress > 0.8 ? 'Deceptive Claim Flagged' : 'Auditing in progress...'}
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-1">
                  {scoreProgress > 0.8
                    ? '3 claim issues detected. Product blocked from recommended tier.'
                    : 'Scrub further to reveal the check score and breakdown.'}
                </p>
              </div>
            </div>

            {/* Action Link to Full Scanner/Detective */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <Link
                to="/scan"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-sunken hover:bg-surface-accent border border-line text-xs font-mono font-semibold uppercase tracking-wider text-heading transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                Scan Real Product Label
                <ArrowRight className="w-3.5 h-3.5 text-text-muted" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
