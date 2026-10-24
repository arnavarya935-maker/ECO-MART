import React, { useState, useEffect, useRef } from 'react';
import { isReducedMotion } from '../../lib/scrollAnimation';

const SECTIONS = [
  { id: 'hero', label: 'Intro' },
  { id: 'greenwash-strikethrough', label: 'Audit Claim' },
  { id: 'eco-journey', label: 'Eco Scene' },
  { id: 'product-journey', label: 'LCA Journey' },
  { id: 'feature-gallery', label: 'AI Labs' },
  { id: 'stacked-pillars', label: 'Pillars' }
];

export default function ScrollProgressBar() {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState(SECTIONS[0].id);
  const reduced = isReducedMotion();
  const rafId = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let isTabVisible = !document.hidden;
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (!isTabVisible && rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const updateScroll = () => {
      if (!isTabVisible) {
        rafId.current = null;
        return;
      }

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY || window.pageYOffset;
      const pct = totalHeight > 0 ? Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100)) : 0;
      setScrollPercent(Math.round(pct));

      // Find active section based on scroll offset
      const probeY = window.innerHeight * 0.35;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= probeY) {
            setActiveSectionId(SECTIONS[i].id);
            break;
          }
        }
      }

      rafId.current = null;
    };

    const onScroll = () => {
      if (!rafId.current && isTabVisible) {
        rafId.current = requestAnimationFrame(updateScroll);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateScroll();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({
        behavior: reduced ? 'auto' : 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <>
      {/* Top Emerald Scroll Progress Bar */}
      <div
        role="progressbar"
        aria-label="Landing page scroll progress"
        aria-valuenow={scrollPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-transparent pointer-events-none"
      >
        <div
          className="h-full bg-emerald-500 transition-all duration-75 ease-out shadow-[0_0_10px_rgba(16,185,129,0.8)]"
          style={{ width: `${scrollPercent}%` }}
        />
      </div>

      {/* Floating Active-Section Pill Indicator (Desktop only, unobtrusive top-right dock below navbar) */}
      <nav
        aria-label="Section quick navigation"
        className="hidden xl:flex fixed top-22 right-6 z-30 items-center gap-1 p-1 rounded-full bg-surface-raised/90 backdrop-blur-md border border-line shadow-soft-md text-xs font-sans select-none"
      >
        {SECTIONS.map((sec) => {
          const isActive = activeSectionId === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              className={`px-2.5 py-1 rounded-full transition-all duration-200 flex items-center gap-1.5 cursor-pointer text-xs ${
                isActive
                  ? 'bg-primary text-primary-contrast font-semibold shadow-soft-xs'
                  : 'text-text-muted hover:text-heading hover:bg-surface-sunken'
              }`}
              aria-current={isActive ? 'true' : undefined}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  isActive ? 'bg-primary-contrast' : 'bg-line'
                }`}
              />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
