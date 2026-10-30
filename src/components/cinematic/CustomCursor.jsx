import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { isFeatureEnabled } from '../../lib/features';

/**
 * CustomCursor
 * Lightweight cinematic cursor ring for desktop pointer:fine devices.
 * Disabled on touch, Judge Mode, reduceEffects, or high-contrast.
 */
export default function CustomCursor() {
  const { reduceEffects, judgeMode, highContrast } = useTheme();
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const cursorRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const animFrame = useRef(null);

  useEffect(() => {
    // Only run on pointer: fine devices
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    if (!isFeatureEnabled('customCursor') || !isFeatureEnabled('cinematicShell') || reduceEffects || judgeMode || highContrast) {
      return;
    }

    const onMouseMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);

      const targetEl = e.target;
      if (targetEl && targetEl.closest) {
        const isInteractive = targetEl.closest(
          'a, button, input, textarea, select, [role="button"], label, .cursor-pointer, .interactive'
        );
        setHovered(Boolean(isInteractive));
      }
    };

    const onMouseLeave = () => setVisible(false);
    const onMouseEnter = () => setVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    const render = () => {
      // Smooth linear interpolation for the outer ring
      pos.current.x += (target.current.x - pos.current.x) * 0.22;
      pos.current.y += (target.current.y - pos.current.y) * 0.22;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }
      animFrame.current = requestAnimationFrame(render);
    };

    animFrame.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, [reduceEffects, judgeMode, highContrast, visible]);

  if (!isFeatureEnabled('customCursor') || !isFeatureEnabled('cinematicShell') || reduceEffects || judgeMode || highContrast) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2 will-change-transform transition-opacity duration-300 hidden md:block"
      style={{
        opacity: visible ? 1 : 0,
      }}
    >
      <div
        className={`rounded-full border transition-all duration-200 ease-out ${
          hovered
            ? 'w-10 h-10 border-primary bg-primary/10 -ml-5 -mt-5 scale-110'
            : 'w-6 h-6 border-heading/40 bg-transparent -ml-3 -mt-3'
        }`}
      />
    </div>
  );
}
