import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { isFeatureEnabled } from '../../lib/features';

/**
 * LayeredCanvasBackground
 * Tier 2 Non-WebGL Atmospheric Background
 *
 * Features:
 * - Layered radial gradients: deep forest-black canvas (#05100B), emerald ambient glow, warm amber horizon.
 * - Gentle pointer parallax (desktop only with pointer: fine, transform only, disabled in reduced-motion or judgeMode).
 * - Foreground silhouettes of grass and botanical leaf fronds rendered via original SVG paths.
 * - Mobile: pure static CSS background with zero touch/pointer listeners for 60fps performance.
 */
export default function LayeredCanvasBackground() {
  const { reduceEffects, judgeMode } = useTheme();
  const bgRef = useRef(null);
  const foliageRef = useRef(null);

  useEffect(() => {
    if (!isFeatureEnabled('cinematicLanding') || reduceEffects || judgeMode) {
      return;
    }

    // Only run pointer parallax on fine-pointer devices (desktop)
    const isFinePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = null;

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      if (!innerWidth || !innerHeight) return;
      targetX = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      targetY = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1
    };

    const render = () => {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      if (bgRef.current) {
        bgRef.current.style.transform = `translate3d(${currentX * -15}px, ${currentY * -15}px, 0)`;
      }
      if (foliageRef.current) {
        foliageRef.current.style.transform = `translate3d(${currentX * 18}px, ${currentY * 10}px, 0)`;
      }

      rafId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [reduceEffects, judgeMode]);

  if (!isFeatureEnabled('cinematicLanding')) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
    >
      {/* Base Canvas & Layered Ambient Gradients */}
      <div
        ref={bgRef}
        className="absolute -inset-10 will-change-transform transition-transform duration-100 ease-out"
        style={{
          background: `
            radial-gradient(ellipse 90% 60% at 50% 0%, rgba(16, 185, 129, 0.09) 0%, transparent 70%),
            radial-gradient(ellipse 80% 50% at 75% 45%, rgba(6, 78, 59, 0.12) 0%, transparent 65%),
            radial-gradient(ellipse 70% 40% at 20% 85%, rgba(245, 158, 11, 0.04) 0%, transparent 60%),
            radial-gradient(circle at 50% 100%, rgba(16, 185, 129, 0.06) 0%, transparent 55%),
            #05100B
          `
        }}
      />

      {/* Foreground Foliage & Grass Silhouettes (Pure SVG, 100% Original Vector Art) */}
      <div
        ref={foliageRef}
        className="absolute bottom-0 left-0 right-0 h-48 md:h-64 pointer-events-none will-change-transform opacity-30 dark:opacity-25"
      >
        <svg
          viewBox="0 0 1440 260"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover object-bottom"
          preserveAspectRatio="none"
        >
          {/* Layer 1: Distant grass blades */}
          <path
            d="M0 260 L0 210 Q 60 170 120 230 Q 180 180 240 240 Q 320 160 400 235 Q 480 190 560 245 Q 640 150 720 240 Q 820 175 920 250 Q 1020 185 1120 240 Q 1220 160 1320 235 Q 1380 200 1440 220 L1440 260 Z"
            fill="#081810"
            opacity="0.6"
          />

          {/* Layer 2: Middle botanical leaves and fern blades */}
          <path
            d="M0 260 L0 230 C 70 200 110 160 160 240 C 220 180 280 140 340 250 C 420 170 480 130 550 245 C 650 165 720 120 800 250 C 900 160 960 140 1040 240 C 1140 150 1220 170 1300 245 C 1370 190 1410 210 1440 235 L1440 260 Z"
            fill="#0A2216"
            opacity="0.8"
          />

          {/* Layer 3: Foreground delicate grass tufts and organic stems */}
          <path
            d="M40 260 Q 55 180 85 260 M120 260 Q 135 160 155 260 M260 260 Q 285 170 310 260 M460 260 Q 480 190 510 260 M680 260 Q 700 155 730 260 M880 260 Q 910 185 935 260 M1100 260 Q 1125 170 1150 260 M1280 260 Q 1305 180 1330 260"
            stroke="#10B981"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.25"
          />
        </svg>
      </div>
    </div>
  );
}

