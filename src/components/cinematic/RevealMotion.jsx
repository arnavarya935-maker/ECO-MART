import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * RevealMotion
 * Fades up once on viewport entry (translateY + opacity only).
 * Staggered by 80ms if index or delay is provided.
 * Under reduced motion / Judge Mode: immediately visible with no animation.
 */
export default function RevealMotion({
  children,
  className = '',
  delay = 0,
  index = 0,
  as: Component = 'div',
  ...props
}) {
  const { reduceEffects, judgeMode } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  const effectiveDelay = delay || index * 80;

  useEffect(() => {
    if (reduceEffects || judgeMode) {
      setIsVisible(true);
      return;
    }

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -40px 0px', threshold: 0.1 }
    );

    if (domRef.current) {
      observer.observe(domRef.current);
    }

    return () => observer.disconnect();
  }, [reduceEffects, judgeMode]);

  // If reduced motion is active, render immediately with no transitions
  if (reduceEffects || judgeMode) {
    return (
      <Component className={className} {...props}>
        {children}
      </Component>
    );
  }

  return (
    <Component
      ref={domRef}
      className={`transition-all duration-700 ease-out will-change-transform ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
        transitionDelay: `${effectiveDelay}ms`,
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
