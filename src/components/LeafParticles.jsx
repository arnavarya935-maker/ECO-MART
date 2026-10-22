import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const LEAF_COUNT = 10;

export default function LeafParticles() {
  const { reduceEffects } = useTheme();
  const [isTabVisible, setIsTabVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  if (reduceEffects || !isTabVisible) return null;

  // Stable procedural particle specs
  const particles = Array.from({ length: LEAF_COUNT }).map((_, i) => ({
    id: i,
    left: `${(i * 10 + 5) % 95}%`,
    duration: `${14 + (i % 5) * 3}s`,
    delay: `${(i * 1.8) % 8}s`,
    size: 14 + (i % 3) * 6,
    opacity: 0.15 + (i % 3) * 0.08
  }));

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-20" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: p.left,
            top: '-20px',
            animation: `floatLeaf ${p.duration} linear infinite`,
            animationDelay: p.delay,
            opacity: p.opacity
          }}
        >
          <svg
            width={p.size}
            height={p.size}
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-primary/40 transform rotate-45"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.85 0 3.58-.5 5.06-1.38L21 21l-.62-3.94C21.39 15.58 22 13.85 22 12c0-5.52-4.48-10-10-10zm-1 15v-4H8l5-7v4h3l-5 7z" />
          </svg>
        </div>
      ))}
      <style>{`
        @keyframes floatLeaf {
          0% {
            transform: translateY(-20px) rotate(0deg) translateX(0px);
          }
          50% {
            transform: translateY(50vh) rotate(180deg) translateX(25px);
          }
          100% {
            transform: translateY(105vh) rotate(360deg) translateX(-15px);
          }
        }
      `}</style>
    </div>
  );
}
