import React, { useState, useEffect } from 'react';
import { isFeatureEnabled } from '../../lib/features';

const CHAPTERS = [
  { id: 'chapter-00', num: '00', label: 'The First Choice' },
  { id: 'chapter-01', num: '01', label: 'The Living Ledger' },
  { id: 'chapter-02', num: '02', label: 'Selected Alternatives' },
  { id: 'chapter-03', num: '03', label: 'Five-Stage Atlas' },
  { id: 'chapter-04', num: '04', label: 'Take Action' }
];

export default function ChapterRail() {
  const [activeChapter, setActiveChapter] = useState('chapter-00');

  useEffect(() => {
    if (!isFeatureEnabled('cinematicLanding')) return;

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveChapter(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '-35% 0px -45% 0px',
      threshold: 0
    });

    CHAPTERS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  if (!isFeatureEnabled('cinematicLanding')) return null;

  const scrollToChapter = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav
      aria-label="Chapter navigation rail"
      className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-30 flex-col items-end gap-3.5 select-none"
    >
      <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-text-muted/60 writing-mode-vertical rotate-180 mb-1">
        Chapters
      </span>

      {CHAPTERS.map((ch) => {
        const isActive = activeChapter === ch.id;

        return (
          <button
            key={ch.id}
            type="button"
            onClick={() => scrollToChapter(ch.id)}
            aria-label={`Jump to Chapter ${ch.num}: ${ch.label}`}
            aria-current={isActive ? 'true' : undefined}
            className="group relative flex items-center justify-end gap-2.5 py-1 focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
          >
            {/* Hover Tooltip Label */}
            <span
              className={`text-[10px] font-mono tracking-wider transition-all duration-200 pointer-events-none whitespace-nowrap px-2 py-0.5 rounded bg-surface-raised/90 border border-line backdrop-blur-sm ${
                isActive
                  ? 'opacity-100 text-heading translate-x-0'
                  : 'opacity-0 -translate-x-2 text-text-secondary group-hover:opacity-100 group-hover:translate-x-0'
              }`}
            >
              {ch.num} • {ch.label}
            </span>

            {/* Indicator Dot / Line */}
            <div className="relative flex items-center justify-center w-5 h-5">
              <span
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? 'w-2 h-2 bg-primary ring-4 ring-primary/20 scale-125'
                    : 'w-1 h-1 bg-text-muted/40 group-hover:w-1.5 group-hover:h-1.5 group-hover:bg-text-secondary'
                }`}
              />
            </div>
          </button>
        );
      })}
    </nav>
  );
}

