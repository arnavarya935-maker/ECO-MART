import React, { useState, useMemo } from 'react';
import {
  Gift,
  X,
  Sparkles,
  ShoppingBag,
  Check,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import productsData from '../../data/products.json';
import { recommendGifts } from '../../lib/personaEngine';
import { useCart } from '../../context/CartContext';
import EcoScoreBadge from '../EcoScoreBadge';

const RECIPIENTS = [
  { id: 'friend', label: 'Friend / Peer' },
  { id: 'colleague', label: 'Colleague / Boss' },
  { id: 'family', label: 'Family Member' },
  { id: 'kid', label: 'Child / Student' },
  { id: 'partner', label: 'Partner' }
];

const OCCASIONS = [
  { id: 'birthday', label: 'Birthday' },
  { id: 'housewarming', label: 'Housewarming' },
  { id: 'festival', label: 'Festive / Holiday' },
  { id: 'thankyou', label: 'Thank You' },
  { id: 'wellness', label: 'Self-Care' }
];

const BUDGET_PRESETS = [500, 1000, 1500, 2500, 5000];

export default function GiftFinderModal({ isOpen, onClose }) {
  const { addToCart } = useCart();
  const [recipient, setRecipient] = useState(RECIPIENTS[0].id);
  const [occasion, setOccasion] = useState(OCCASIONS[0].id);
  const [budget, setBudget] = useState(1500);
  const [addedIds, setAddedIds] = useState([]);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const recommendations = useMemo(() => {
    return recommendGifts({
      recipient,
      occasion,
      budget,
      catalog: productsData
    });
  }, [recipient, occasion, budget]);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setAddedIds((prev) => [...prev, product.id]);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== product.id));
    }, 2000);
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
        className="w-full max-w-3xl max-h-[90vh] bg-surface-raised border border-line rounded-3xl shadow-soft-xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-line flex items-center justify-between bg-surface-sunken">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-heading">
                  Curated Eco Gift Finder
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-raised border border-line text-text-muted">
                  Conscious Gifting
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                Zero plastic clutter. Match the recipient, celebration, and budget with meaningful circular gifts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowHowItWorks(!showHowItWorks)}
              className="p-2 rounded-xl border border-line bg-surface hover:bg-surface-sunken text-text-muted hover:text-heading text-xs font-mono flex items-center gap-1 transition"
            >
              <HelpCircle className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline">How it works</span>
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
          <div className="p-4 bg-surface border-b border-line text-xs space-y-1.5 animate-fade-in">
            <div className="flex items-center gap-1.5 font-serif font-bold text-heading">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>How Eco Gift Matching Works</span>
            </div>
            <p className="text-text-secondary leading-relaxed">
              We score the catalog against occasion relevance (e.g. housewarming highlights kitchen &amp; home living), recipient utility, and circularity criteria (plastic-free packaging and certified organic materials), constrained strictly to your maximum budget.
            </p>
          </div>
        )}

        {/* Selection Toolbar */}
        <div className="p-4 border-b border-line bg-surface space-y-3">
          {/* Recipient */}
          <div>
            <label className="text-[10px] font-mono text-text-muted uppercase tracking-wider block mb-1">
              Who is this gift for?
            </label>
            <div className="flex flex-wrap gap-1.5">
              {RECIPIENTS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRecipient(r.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-sans transition cursor-pointer ${
                    recipient === r.id
                      ? 'bg-primary text-white font-semibold shadow-soft-xs'
                      : 'bg-surface-sunken border border-line text-text-secondary hover:text-heading'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Occasion */}
          <div>
            <label className="text-[10px] font-mono text-text-muted uppercase tracking-wider block mb-1">
              What is the occasion?
            </label>
            <div className="flex flex-wrap gap-1.5">
              {OCCASIONS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setOccasion(o.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-sans transition cursor-pointer ${
                    occasion === o.id
                      ? 'bg-amber-500 text-white font-semibold shadow-soft-xs'
                      : 'bg-surface-sunken border border-line text-text-secondary hover:text-heading'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1">
              <span>Maximum Budget: ₹{budget}</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {BUDGET_PRESETS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBudget(b)}
                  className={`px-3 py-1 rounded-xl text-xs font-mono transition cursor-pointer ${
                    budget === b
                      ? 'bg-primary text-white font-bold'
                      : 'bg-surface-sunken border border-line text-text-secondary hover:text-heading'
                  }`}
                >
                  Under ₹{b}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="font-serif font-bold text-sm text-heading flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Curated Recommendations ({recommendations.length})</span>
            </span>
            <span className="text-[11px] font-mono text-text-muted">
              Within ₹{budget}
            </span>
          </div>

          {recommendations.length === 0 ? (
            <div className="p-8 text-center text-xs text-text-muted bg-surface-sunken rounded-3xl border border-line">
              No products found within ₹{budget}. Try increasing the budget range.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recommendations.map((prod) => {
                const isAdded = addedIds.includes(prod.id);
                return (
                  <div
                    key={prod.id}
                    className="p-4 rounded-3xl bg-surface-sunken border border-line space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold">
                            {prod.category}
                          </span>
                          <h4 className="font-serif font-bold text-sm text-heading mt-0.5 line-clamp-1">
                            {prod.name}
                          </h4>
                        </div>
                        <EcoScoreBadge product={prod} size="sm" />
                      </div>

                      <div className="text-sm font-serif font-bold text-heading mt-1">
                        ₹{prod.price}
                      </div>

                      <p className="text-[11px] text-text-secondary mt-1.5 leading-relaxed bg-surface p-2.5 rounded-2xl border border-line/60">
                        {prod.giftReason}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(prod)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-500 text-white'
                          : 'bg-primary hover:opacity-90 text-white shadow-soft-xs'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added to Cart!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add Gift to Cart (₹{prod.price})</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
