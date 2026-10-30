import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { isFeatureEnabled } from '../../lib/features';

/**
 * BackToTop
 * Appears after 1 screen of scroll on every page.
 * Fully keyboard accessible (Enter / Space), 44px touch target, smooth scroll to top.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isFeatureEnabled('cinematicShell')) return;

    const onScroll = () => {
      const isScrolledPastOneScreen = window.scrollY > (window.innerHeight || 600);
      setVisible(isScrolledPastOneScreen);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!isFeatureEnabled('cinematicShell')) return null;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      scrollToTop();
    }
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      onKeyDown={handleKeyDown}
      aria-label="Scroll back to top"
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-6 right-6 z-[35] w-11 h-11 rounded-full bg-surface-raised border border-line text-heading shadow-soft-md flex items-center justify-center transition-all duration-300 focus-visible:outline-2 focus-visible:outline-focus hover:scale-105 active:scale-95 ${
        visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <ArrowUp className="w-4 h-4 text-primary" />
    </button>
  );
}
