import React from 'react';
import { Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Modal } from './ui/Modal';

export default function AchievementUnlockedModal() {
  const { unlockedBadge, dismissBadge } = useCart();

  if (!unlockedBadge) return null;

  return (
    <Modal
      isOpen={Boolean(unlockedBadge)}
      onClose={dismissBadge}
      title="Achievement Unlocked!"
      maxWidth="max-w-sm"
    >
      <div className="text-center">
        {/* Animated Badge Icon Container */}
        <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 via-surface to-surface-sunken border border-primary/30 flex items-center justify-center text-4xl shadow-soft-md mb-4 animate-bounce-subtle">
          {unlockedBadge.icon || '🌱'}
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold border border-primary/20 uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-accent" /> Achievement Unlocked!
        </div>

        <h3 className="text-xl font-serif font-bold text-heading">{unlockedBadge.title}</h3>

        <p className="mt-2 text-xs text-muted leading-relaxed">
          {unlockedBadge.desc}
        </p>

        {unlockedBadge.points && (
          <div className="mt-3.5 inline-block px-3 py-1 rounded-xl bg-accent/10 text-accent border border-accent/30 text-xs font-semibold">
            +{unlockedBadge.points} Eco-Points Earned
          </div>
        )}

        <div className="mt-6">
          <button
            type="button"
            onClick={dismissBadge}
            className="w-full min-h-[44px] py-2.5 px-4 rounded-2xl bg-primary hover:bg-primary-hover text-primary-contrast text-xs font-bold transition-all shadow-soft-sm hover:shadow-soft-md focus-visible:outline-2 focus-visible:outline-focus"
          >
            Awesome! Continue
          </button>
        </div>
      </div>
    </Modal>
  );
}
