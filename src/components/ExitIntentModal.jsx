import React from 'react';
import { Sparkles, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Modal } from './ui/Modal';

export default function ExitIntentModal() {
  const {
    exitIntentOpen,
    dismissExitIntent,
    cartItems,
    impact,
    setIsCartOpen
  } = useCart();

  if (!exitIntentOpen || cartItems.length === 0) return null;

  return (
    <Modal
      isOpen={exitIntentOpen}
      onClose={dismissExitIntent}
      title="Before You Go"
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-text">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold border border-accent/30 shadow-soft-xs">
          <Sparkles className="w-3.5 h-3.5 text-accent" /> Before You Go
        </div>

        <h3 className="text-2xl font-serif font-bold text-heading leading-tight">
          Check Your Cart’s Eco-Score
        </h3>

        <p className="text-xs text-muted">
          You have {cartItems.length} conscious {cartItems.length === 1 ? 'item' : 'items'} in your cart right now.
        </p>

        {/* Eco-Score snapshot */}
        <div className="p-4 rounded-2xl bg-surface-sunken border border-line flex items-center justify-between shadow-soft-xs">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-muted">Cart Sustainability Grade</div>
            <div className="text-lg font-serif font-bold text-primary mt-0.5">
              Score: {impact?.averageScore ?? impact?.averageEcoScore ?? 0}/100
            </div>
            <div className="text-xs text-muted mt-0.5">
              Avoiding ~{Number(impact?.savedCo2 ?? impact?.co2Saved ?? 0).toFixed(1)}kg CO₂
            </div>
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary font-serif font-bold text-xl border border-primary/20 shadow-soft-xs">
            {impact?.grade ?? impact?.averageGrade ?? 'A'}
          </div>
        </div>

        <div className="pt-2 flex gap-2.5">
          <button
            type="button"
            onClick={dismissExitIntent}
            className="flex-1 min-h-[44px] py-2.5 px-4 rounded-xl border border-line text-xs font-semibold text-secondary hover:bg-surface-sunken transition-colors focus-visible:outline-2 focus-visible:outline-focus"
          >
            Keep Browsing
          </button>
          <button
            type="button"
            onClick={() => {
              dismissExitIntent();
              setIsCartOpen(true);
            }}
            className="flex-1 min-h-[44px] flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast text-xs font-bold shadow-soft-sm hover:shadow-soft-md active:scale-[0.99] transition-all focus-visible:outline-2 focus-visible:outline-focus"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Review Cart</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
