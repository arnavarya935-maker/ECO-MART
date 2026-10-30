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
        Eco Sense Core Principles: Honest, Simple, and Helpful
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
              className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-emerald-900/20 dark:text-emerald-400/20 select-none hover:text-primary transition-colors"
            >
              VERIFY <span className="text-primary/40 mx-2 sm:mx-4">·</span>
            </span>
          ))}
        </div>

        {/* Row 2: COMPARE (Moving Right) */}
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
              className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-teal-900/25 dark:text-teal-400/25 select-none hover:text-secondary transition-colors"
            >
              COMPARE <span className="text-secondary/40 mx-2 sm:mx-4">·</span>
            </span>
          ))}
        </div>

        {/* Row 3: CHOOSE (Moving Left) */}
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
              className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-forest-900/20 dark:text-emerald-500/20 select-none hover:text-heading transition-colors"
            >
              CHOOSE <span className="text-primary/40 mx-2 sm:mx-4">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
