import React from 'react';
import { Sparkles, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function AchievementUnlockedModal() {
  const { unlockedBadge, dismissBadge } = useCart();

  if (!unlockedBadge) return null;

  return (
    <div className="fixed inset-0 z-60 bg-stone-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-stone-900 to-stone-950 text-white rounded-3xl border border-emerald-500/40 shadow-2xl p-6 text-center overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <button
          type="button"
          onClick={dismissBadge}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Animated Badge Icon Container */}
        <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-4xl shadow-lg shadow-emerald-500/30 mb-4 animate-bounce">
          {unlockedBadge.icon || '🌱'}
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-400/30 uppercase tracking-wider mb-2">
          <Sparkles className="w-3 h-3 text-amber-400" /> Achievement Unlocked!
        </div>

        <h3 className="text-xl font-black text-white">{unlockedBadge.title}</h3>

        <p className="mt-2 text-xs text-stone-300 leading-relaxed">
          {unlockedBadge.desc}
        </p>

        {unlockedBadge.points && (
          <div className="mt-3 inline-block px-3 py-1 rounded-xl bg-amber-400/10 text-amber-300 border border-amber-400/30 text-xs font-bold">
            +{unlockedBadge.points} Eco-Points Earned
          </div>
        )}

        <div className="mt-6">
          <button
            type="button"
            onClick={dismissBadge}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md"
          >
            Awesome! Continue
          </button>
        </div>
      </div>
    </div>
  );
}
