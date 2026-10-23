import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * Pure HTML5 Canvas rendering gentle, undulating emerald and teal contour lines
 * with soft drifting micro-particles.
 * - Pauses rendering when browser tab is hidden (document.hidden)
 * - Disables animation when prefers-reduced-motion or reduceEffects is active
 * - High-DPI crisp canvas scaling with zero external dependencies
 */
export default function ContourCanvas({ className = '' }) {
  const canvasRef = useRef(null);
  const { reduceEffects } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = null;
    let isTabVisible = !document.hidden;

    // Detect system reduced-motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isReducedMotion = mediaQuery.matches || Boolean(reduceEffects);

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Particle field
    const particleCount = 28;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.6,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.35 + 0.1,
      color: Math.random() > 0.5 ? '16, 185, 129' : '20, 184, 166'
    }));

    let time = 0;

    const drawContourLines = (t) => {
      const lineCount = 5;
      const stepY = height / (lineCount + 1);

      for (let i = 1; i <= lineCount; i++) {
        const baseY = i * stepY;
        const color = i % 2 === 0 ? '16, 185, 129' : '20, 184, 166';
        const alpha = 0.08 + (i / lineCount) * 0.07;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(${color}, ${alpha})`;
        ctx.lineWidth = 1.25;

        for (let x = 0; x <= width; x += 20) {
          // Compound sinusoidal waves for natural topographic contours
          const wave1 = Math.sin(x * 0.003 + t * 0.0007 + i) * 22;
          const wave2 = Math.cos(x * 0.007 - t * 0.0005 + i * 0.7) * 14;
          const y = baseY + wave1 + wave2;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }
    };

    const drawParticles = () => {
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.fill();

        if (!isReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }
      });
    };

    const render = (timestamp) => {
      time = timestamp || 0;
      ctx.clearRect(0, 0, width, height);

      drawContourLines(time);
      drawParticles();

      if (!isReducedMotion && isTabVisible) {
        animId = requestAnimationFrame(render);
      }
    };

    // Initial render
    render(0);

    // Tab visibility handling
    const handleVisibility = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible && !isReducedMotion) {
        cancelAnimationFrame(animId);
        animId = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animId);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [reduceEffects]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
}
