/**
 * EcoMart Cinematic Scroll Animation Engine
 * Lightweight, performant, offline-first scroll animation utilities.
 * 
 * Features:
 * - IntersectionObserver + requestAnimationFrame tracking
 * - Native prefers-reduced-motion & html.reduced-motion bypass
 * - Automatic rAF pause when document is hidden (visibilitychange)
 * - Clamped velocity calculation to avoid motion sickness
 * - Zero external dependencies; 60fps on mid-range devices
 */

/**
 * Checks if reduced motion is requested by system or user toggle
 * @returns {boolean}
 */
export function isReducedMotion() {
  if (typeof window === 'undefined') return true;
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hasHtmlClass = document.documentElement.classList.contains('reduced-motion');
  return mediaQuery.matches || hasHtmlClass;
}

/**
 * Clamps a scroll velocity value to prevent jarring visual jumps
 * @param {number} velocity - Raw velocity in pixels/ms
 * @param {number} maxVelocity - Maximum absolute threshold
 * @returns {number} Clamped velocity
 */
export function clampVelocity(velocity, maxVelocity = 40) {
  if (typeof velocity !== 'number' || isNaN(velocity)) return 0;
  return Math.max(-maxVelocity, Math.min(maxVelocity, velocity));
}

/**
 * Computes normalized scroll progress (0 to 1) for a container relative to viewport
 * @param {DOMRect|{top: number, height: number}} rect - Element bounding client rect
 * @param {number} viewportHeight - Window innerHeight
 * @param {number} [pinTravel] - Additional travel distance if pinned (in px)
 * @returns {number} Progress between 0 and 1
 */
export function computeScrollProgress(rect, viewportHeight, pinTravel = 0) {
  if (!rect || typeof viewportHeight !== 'number' || viewportHeight <= 0) return 0;
  
  if (pinTravel > 0) {
    // Pinned calculation: progress occurs as the container scrolls through pinTravel
    const distanceScrolled = -rect.top;
    if (distanceScrolled <= 0) return 0;
    if (distanceScrolled >= pinTravel) return 1;
    return distanceScrolled / pinTravel;
  }

  // Normal view progress: 0 when element top hits bottom of viewport, 1 when element bottom hits top of viewport
  const totalTravel = viewportHeight + rect.height;
  if (totalTravel <= 0) return 0;
  const current = viewportHeight - rect.top;
  const progress = current / totalTravel;
  return Math.max(0, Math.min(1, progress));
}

/**
 * Determines active stage index (0 to stagesCount - 1) based on progress
 * @param {number} progress - Progress between 0 and 1
 * @param {number} stagesCount - Number of discrete stages
 * @returns {number} 0-indexed stage number
 */
export function getStageForProgress(progress, stagesCount) {
  if (!stagesCount || stagesCount <= 0) return 0;
  const clamped = Math.max(0, Math.min(0.9999, progress));
  return Math.floor(clamped * stagesCount);
}

/**
 * Calculates smooth bell-curve opacity and transition factor for a scene in a multi-scene sequence
 * @param {number} progress - Overall normalized scroll progress (0 to 1)
 * @param {number} sceneIndex - 0-indexed scene number
 * @param {number} totalScenes - Total number of scenes (e.g. 4)
 * @returns {{ opacity: number, isActive: boolean }}
 */
export function getScenePhase(progress, sceneIndex, totalScenes = 4) {
  if (totalScenes <= 0) return { opacity: 1, isActive: true };
  const step = 1 / totalScenes;
  const start = sceneIndex * step;
  const end = (sceneIndex + 1) * step;
  const center = start + step / 2;

  // Overlap window for natural cross-fade
  const overlap = step * 0.35;
  const windowStart = Math.max(0, start - (sceneIndex === 0 ? 0 : overlap));
  const windowEnd = Math.min(1, end + (sceneIndex === totalScenes - 1 ? 0 : overlap));

  let opacity = 0;
  if (progress >= windowStart && progress <= windowEnd) {
    if (sceneIndex === 0 && progress < center) {
      opacity = 1;
    } else if (sceneIndex === totalScenes - 1 && progress > center) {
      opacity = 1;
    } else if (progress <= center) {
      const denom = center - windowStart;
      opacity = denom > 0 ? (progress - windowStart) / denom : 1;
    } else {
      const denom = windowEnd - center;
      opacity = denom > 0 ? (windowEnd - progress) / denom : 0;
    }
  }

  const isActive = progress >= start && progress < (sceneIndex === totalScenes - 1 ? 1.01 : end);

  return {
    opacity: Math.max(0, Math.min(1, opacity)),
    isActive
  };
}

/**
 * Custom React hook for tracking scroll progress of a referenced element
 * Returns normalized progress (0 to 1), velocity, and isInView state.
 */
import { useState, useEffect, useRef } from 'react';

export function useScrollProgress(ref, options = {}) {
  const {
    pinTravel = 0,
    disabled = false,
    initialProgress = 0
  } = options;

  const [progress, setProgress] = useState(() => (disabled || isReducedMotion() ? 1 : initialProgress));
  const [velocity, setVelocity] = useState(0);
  const [isInView, setIsInView] = useState(() => (disabled || isReducedMotion()));

  const lastScrollY = useRef(0);
  const lastTimestamp = useRef(0);
  const rafId = useRef(null);
  const isTabVisible = useRef(true);

  useEffect(() => {
    if (disabled || typeof window === 'undefined' || isReducedMotion()) {
      return;
    }

    // Visibility listener to pause rAF when tab is hidden
    const handleVisibilityChange = () => {
      isTabVisible.current = !document.hidden;
      if (!isTabVisible.current && rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const targetEl = ref.current;
    if (!targetEl) {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      return;
    }

    // IntersectionObserver to only compute rAF when element is reasonably near viewport
    let isIntersecting = false;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isIntersecting = entry.isIntersecting;
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting) {
          scheduleUpdate();
        }
      },
      {
        rootMargin: '100px 0px 100px 0px',
        threshold: [0, 0.1, 0.5, 1.0]
      }
    );
    observer.observe(targetEl);

    const update = () => {
      if (!isTabVisible.current || !targetEl) {
        rafId.current = null;
        return;
      }

      const now = performance.now();
      const currentScrollY = window.scrollY || window.pageYOffset;
      const dt = Math.max(1, now - (lastTimestamp.current || now));
      const dy = currentScrollY - (lastScrollY.current || currentScrollY);
      
      const rawVelocity = (dy / dt) * 16.6; // normalized to ~60fps frame delta
      const clampedVel = clampVelocity(rawVelocity, 50);

      lastScrollY.current = currentScrollY;
      lastTimestamp.current = now;

      const rect = targetEl.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 800;
      const nextProgress = computeScrollProgress(rect, viewportHeight, pinTravel);

      setProgress((prev) => {
        // Only trigger state update if changed significantly (> 0.002) to prevent excessive renders
        return Math.abs(prev - nextProgress) > 0.002 ? nextProgress : prev;
      });

      setVelocity(clampedVel);

      rafId.current = null;
    };

    const scheduleUpdate = () => {
      if (!rafId.current && isTabVisible.current) {
        rafId.current = requestAnimationFrame(update);
      }
    };

    const onScroll = () => {
      if (isIntersecting) {
        scheduleUpdate();
      }
    };

    const onResize = () => {
      scheduleUpdate();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    // Initial check
    scheduleUpdate();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [ref, pinTravel, disabled]);

  return { progress, velocity, isInView };
}
