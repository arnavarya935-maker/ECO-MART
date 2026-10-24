import React, { useRef } from 'react';
import { useScrollProgress, isReducedMotion } from '../../lib/scrollAnimation';

export default function KineticTypeStrips() {
  const containerRef = useRef(null);
  const reduced = isReducedMotion();

  const { progress, velocity } = useScrollProgress(containerRef, {
    disabled: reduced
  });

  // Calculate clamped offsets driven by scroll progress and scroll velocity
  // Row 1 moves LEFT: starts at 0%, scrolls left
  // Row 2 moves RIGHT: starts at -15%, scrolls right
  // Row 3 moves LEFT: starts at -5%, scrolls left
  const velFactor = reduced ? 0 : velocity * 1.5;

  const row1Offset = reduced ? 0 : -((progress * 160) + velFactor);
  const row2Offset = reduced ? 0 : ((progress * 160) + velFactor) - 100;
  const row3Offset = reduced ? 0 : -((progress * 140) + velFactor) - 40;

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-surface py-8 md:py-16 border-b border-line select-none"
      aria-label="Verification Principles"
    >
      <h2 className="sr-only">
        EcoMart Core Principles: Verify, Trust, and Prove
      </h2>

      {/* Cinematic Left & Right Vignette Masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 z-10 bg-gradient-to-r from-surface to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 z-10 bg-gradient-to-l from-surface to-transparent" />

      <div className="flex flex-col gap-2 sm:gap-4 whitespace-nowrap">
        {/* Row 1: VERIFY (Moving Left) */}
        <div
          aria-hidden="true"
          className="will-change-transform transition-transform ease-out duration-75 flex gap-8 items-center"
          style={{
            transform: `translate3d(${row1Offset}px, 0, 0)`
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-transparent select-none"
              style={{
                WebkitTextStroke: '1.5px rgba(16, 185, 129, 0.4)'
              }}
            >
              VERIFY <span className="text-emerald-500/50 mx-2 sm:mx-4">·</span>
            </span>
          ))}
        </div>

        {/* Row 2: TRUST (Moving Right) */}
        <div
          aria-hidden="true"
          className="will-change-transform transition-transform ease-out duration-75 flex gap-8 items-center"
          style={{
            transform: `translate3d(${row2Offset}px, 0, 0)`
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-text-muted/15 select-none hover:text-text-muted/30 transition-colors"
            >
              TRUST <span className="text-primary/30 mx-2 sm:mx-4">·</span>
            </span>
          ))}
        </div>

        {/* Row 3: PROVE (Moving Left) */}
        <div
          aria-hidden="true"
          className="will-change-transform transition-transform ease-out duration-75 flex gap-8 items-center"
          style={{
            transform: `translate3d(${row3Offset}px, 0, 0)`
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-transparent select-none"
              style={{
                WebkitTextStroke: '1.5px rgba(20, 184, 166, 0.4)'
              }}
            >
              PROVE <span className="text-teal-500/50 mx-2 sm:mx-4">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
