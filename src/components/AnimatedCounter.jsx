import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function AnimatedCounter({ value = 0, duration = 1.2, decimals = 0, prefix = '', suffix = '' }) {
  const { reducedMotion } = useTheme();
  const [displayValue, setDisplayValue] = useState(reducedMotion ? value : 0);

  useEffect(() => {
    if (reducedMotion) {
      setDisplayValue(value);
      return;
    }

    const startValue = 0;
    const endValue = Number(value) || 0;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = (currentTime - startTime) / 1000;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (endValue - startValue) * easeProgress;

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setDisplayValue(endValue);
      }
    };

    const animId = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(animId);
  }, [value, duration, reducedMotion]);

  return (
    <span>
      {prefix}
      {Number(displayValue).toFixed(decimals)}
      {suffix}
    </span>
  );
}
