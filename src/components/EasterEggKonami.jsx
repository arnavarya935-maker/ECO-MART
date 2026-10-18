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

      <div className="pointer-events-auto p-6 rounded-3xl bg-stone-900 text-white border-2 border-emerald-400 shadow-2xl text-center space-y-3 max-w-sm animate-scale-in">
        <div className="text-5xl">🎊🍃🍄</div>
        <h3 className="text-xl font-black text-emerald-300">
          Secret Biosphere Unlocked!
        </h3>
        <p className="text-xs text-stone-300 leading-relaxed font-medium">
          You entered the classic Konami code: <br />
          <span className="font-mono text-emerald-400 text-[11px]">↑ ↑ ↓ ↓ ← → ← → B A</span>.
        </p>
        <button
          type="button"
          onClick={() => setTriggered(false)}
          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
        >
          Close Celebration
        </button>
      </div>
    </div>
  );
}
