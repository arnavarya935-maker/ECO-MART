import React, { useState, useMemo } from 'react';
import {
  Calendar,
  X,
  Sparkles,
  Wind,
  Ban,
  CheckCircle2,
  TrendingUp,
  HelpCircle,
  Bell
} from 'lucide-react';
import { generateWeeklyEcoReview } from '../../lib/circularityEngine';
import { useCart } from '../../context/CartContext';

export default function WeeklyEcoReviewModal({ isOpen, onClose }) {
  const { orders, cartItems } = useCart();
  const [optInNotify, setOptInNotify] = useState(() => {
    try {
      return localStorage.getItem('ecomart_weekly_review_optin') === 'true';
    } catch {
      return true;
    }
  });
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const review = useMemo(() => {
    return generateWeeklyEcoReview(orders, cartItems);
  }, [orders, cartItems]);

  const handleToggleOptIn = (checked) => {
    setOptInNotify(checked);
    try {
      localStorage.setItem('ecomart_weekly_review_optin', String(checked));
    } catch {}
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[90vh] bg-surface-raised border border-line rounded-3xl shadow-soft-xl flex flex-col overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-line flex items-center justify-between bg-surface-sunken">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-heading">
                  Weekly Eco Review
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-raised border border-line text-text-muted">
                  Local Summary
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                {review.weekRange} • {review.ordersAudited} order{review.ordersAudited === 1 ? '' : 's'} recorded
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowHowItWorks(!showHowItWorks)}
              className="p-2 rounded-xl border border-line bg-surface hover:bg-surface-sunken text-text-muted hover:text-heading text-xs font-mono transition"
            >
              <HelpCircle className="w-3.5 h-3.5 text-primary" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl border border-line text-text-muted hover:text-heading hover:bg-surface transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* How it works drawer */}
        {showHowItWorks && (
          <div className="p-4 bg-surface border-b border-line text-xs space-y-1.5 animate-fade-in text-left">
            <div className="flex items-center gap-1.5 font-serif font-bold text-heading">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>About Weekly Reviews</span>
            </div>
            <p className="text-text-secondary leading-relaxed">
              {review.disclaimer} We aggregate your items to calculate carbon avoidance and generate 1 high-leverage suggestion.
            </p>
          </div>
        )}

        {/* Review Dossier Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 font-sans">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/25 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-primary">
                <Wind className="w-4 h-4" />
                <span>CO₂ Avoidance</span>
              </div>
              <div className="font-serif font-bold text-2xl text-heading">
                ~{review.co2AvoidedKg} <span className="text-xs font-normal text-text-muted">kg</span>
              </div>
              <p className="text-[10px] text-text-secondary">
                Cumulative planetary savings
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                <Ban className="w-4 h-4" />
                <span>Plastic Diverted</span>
              </div>
              <div className="font-serif font-bold text-2xl text-heading">
                ~{review.plasticAvoidedGrams} <span className="text-xs font-normal text-text-muted">grams</span>
              </div>
              <p className="text-[10px] text-text-secondary">
                Eliminated from landfills
              </p>
            </div>
          </div>

          {/* What Went Well */}
          <div className="p-4 rounded-2xl bg-surface-sunken border border-line space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Weekly Choice Highlight</span>
            </div>
            <p className="text-xs text-heading leading-relaxed font-medium">
              {review.highlight}
            </p>
          </div>

          {/* Actionable Improvement */}
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-primary">
              <TrendingUp className="w-4 h-4" />
              <span>Suggested Habit Upgrade</span>
            </div>
            <p className="text-xs text-heading leading-relaxed font-medium">
              {review.suggestedImprovement}
            </p>
          </div>

          {/* Opt-In Local Notification Setting */}
          <div className="p-3.5 rounded-2xl bg-surface border border-line flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary shrink-0" />
              <span>Show proactive weekly summary reminder in app</span>
            </div>
            <input
              type="checkbox"
              checked={optInNotify}
              onChange={(e) => handleToggleOptIn(e.target.checked)}
              className="accent-primary w-4 h-4 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-line bg-surface-sunken flex items-center justify-between text-[11px] font-mono text-text-muted">
          <span>Local browser audit · Zero cloud telemetry</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-primary text-white font-semibold text-xs transition cursor-pointer"
          >
            Close Review
          </button>
        </div>
      </div>
    </div>
  );
}
