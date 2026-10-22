import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a'
];

export default function EasterEggKonami() {
  const [, setInputSequence] = useState([]);
  const [triggered, setTriggered] = useState(false);
  const { setUnlockedBadge } = useCart();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      setInputSequence((prev) => {
        const next = [...prev, e.key].slice(-10);
        const matches = KONAMI_CODE.every((key, idx) => next[idx] === key);

        if (matches) {
          setTriggered(true);
          if (setUnlockedBadge) {
            setUnlockedBadge({
              title: 'Secret Forest Ranger! 🍄',
              desc: 'You unlocked the legendary Konami Biosphere Easter Egg! 100 extra eco-karma awarded.',
              icon: '🎉',
              points: 100
            });
          }
          return [];
        }
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setUnlockedBadge]);

  if (!triggered) return null;

  return (
    <div className="fixed inset-0 z-60 pointer-events-none flex items-center justify-center overflow-hidden">
      {/* 25 leaf confetti particles */}
      {Array.from({ length: 25 }).map((_, i) => (
        <div
          key={i}
          className="absolute text-3xl animate-bounce"
          style={{
            left: `${(i * 4 + 2) % 96}%`,
            top: `${(i * 7 + 10) % 85}%`,
            animationDuration: `${1 + (i % 3) * 0.5}s`,
            animationDelay: `${(i * 0.1)}s`
          }}
        >
          {i % 4 === 0 ? '🌿' : i % 4 === 1 ? '🍃' : i % 4 === 2 ? '🎋' : '🌱'}
        </div>
      ))}

      <div className="pointer-events-auto p-6 sm:p-7 rounded-3xl bg-surface text-heading border border-line shadow-soft-xl text-center space-y-3.5 max-w-sm animate-slide-up">
        <div className="text-5xl">🎊🍃🍄</div>
        <h3 className="text-xl font-serif font-bold text-heading">
          Secret Biosphere Unlocked!
        </h3>
        <p className="text-xs text-muted leading-relaxed font-normal">
          You entered the classic Konami code: <br />
          <span className="font-mono text-primary text-[11px] font-bold">↑ ↑ ↓ ↓ ← → ← → B A</span>
        </p>
        <button
          type="button"
          onClick={() => setTriggered(false)}
          className="w-full min-h-[44px] px-5 py-2.5 rounded-2xl bg-primary hover:bg-primary-hover text-primary-contrast font-bold text-xs shadow-soft-sm hover:shadow-soft-md transition-all focus-visible:outline-2 focus-visible:outline-focus"
        >
          Close Celebration
        </button>
      </div>
    </div>
  );
}
