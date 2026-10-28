import React, { useState, useMemo } from 'react';
import {
  Package,
  X,
  Sparkles,
  ShoppingBag,
  Check,
  HelpCircle
} from 'lucide-react';
import productsData from '../../data/products.json';
import { OCCASION_KITS } from '../../lib/personaEngine';
import { useCart } from '../../context/CartContext';
import EcoScoreBadge from '../EcoScoreBadge';

export default function OccasionKitsModal({ isOpen, onClose }) {
  const { addToCart } = useCart();
  const [selectedKitId, setSelectedKitId] = useState(OCCASION_KITS[0].id);
  const [addedAll, setAddedAll] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const selectedKit = useMemo(() => {
    return OCCASION_KITS.find((k) => k.id === selectedKitId) || OCCASION_KITS[0];
  }, [selectedKitId]);

  // Find products matching the kit's categories and keywords
  const kitItems = useMemo(() => {
    return productsData.filter((p) => {
      const matchCat = selectedKit.targetCategories.includes(p.category);
      const matchKw = selectedKit.suggestedItemKeywords.some((kw) =>
        p.name.toLowerCase().includes(kw.toLowerCase())
      );
      return matchCat && matchKw;
    }).slice(0, 4);
  }, [selectedKit]);

  const totalPrice = useMemo(() => {
    return kitItems.reduce((sum, item) => sum + (item.price || 0), 0);
  }, [kitItems]);

  const totalCarbon = useMemo(() => {
    return kitItems.reduce((sum, item) => sum + (item.carbonKg || 0), 0).toFixed(1);
  }, [kitItems]);

  const handleAddAllToCart = () => {
    kitItems.forEach((item) => addToCart(item, 1));
    setAddedAll(true);
    setTimeout(() => setAddedAll(false), 2500);
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
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-heading">
                  Seasonal &amp; Occasion Starter Kits
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-raised border border-line text-text-muted">
                  Pre-assembled Bundles
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                Thoughtfully assembled collections for life milestones, seasonal transitions, and festivals.
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
              <span>How Occasion Kits Work</span>
            </div>
            <p className="text-text-secondary leading-relaxed">
              Every occasion kit is dynamically pulled from in-stock catalog products matching life milestones (such as college move-in or monsoon care). Zero pre-packaged waste: products ship together in a single plastic-free consolidated package.
            </p>
          </div>
        )}

        {/* Kit Selector Tabs */}
        <div className="p-3 border-b border-line bg-surface flex gap-2 overflow-x-auto scrollbar-thin">
          {OCCASION_KITS.map((kit) => {
            const isSelected = selectedKitId === kit.id;
            return (
              <button
                key={kit.id}
                type="button"
                onClick={() => setSelectedKitId(kit.id)}
                className={`p-2.5 rounded-2xl border text-left whitespace-nowrap transition cursor-pointer flex items-center gap-2 shrink-0 ${
                  isSelected
                    ? 'bg-primary text-white font-semibold shadow-soft-xs'
                    : 'bg-surface-sunken border-line text-text-secondary hover:text-heading hover:bg-surface'
                }`}
              >
                <span className="text-base">{kit.icon}</span>
                <div>
                  <div className="text-xs">{kit.name}</div>
                  <div className={`text-[10px] font-mono ${isSelected ? 'text-white/80' : 'text-text-muted'}`}>
                    {kit.season}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Kit Details and Product Items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Kit Summary Card */}
          <div className="p-4 rounded-3xl bg-surface-sunken border border-line space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold">
                {selectedKit.season} • {selectedKit.budgetRange}
              </span>
              <span className="text-xs font-mono font-semibold text-text-muted">
                Embodied CO₂: ~{totalCarbon} kg
              </span>
            </div>
            <h4 className="font-serif font-bold text-base text-heading">
              {selectedKit.name}
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              {selectedKit.description}
            </p>
          </div>

          {/* Kit Items List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-serif font-bold text-sm text-heading">
                Included Sustainable Essentials ({kitItems.length})
              </span>
              <span className="text-xs font-mono font-bold text-heading">
                Kit Total: ₹{totalPrice}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {kitItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-surface border border-line flex items-center justify-between gap-3 shadow-soft-xs"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-text-muted uppercase">
                      {item.category}
                    </span>
                    <h5 className="font-serif font-bold text-xs text-heading line-clamp-1">
                      {item.name}
                    </h5>
                    <div className="text-xs font-mono font-bold text-heading">
                      ₹{item.price}
                    </div>
                  </div>
                  <EcoScoreBadge product={item} size="sm" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-line bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-text-muted">
            Includes plastic-free consolidated packaging and verified eco materials.
          </div>

          <button
            type="button"
            onClick={handleAddAllToCart}
            disabled={kitItems.length === 0}
            className={`py-2.5 px-5 rounded-2xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition shadow-soft-sm cursor-pointer ${
              addedAll
                ? 'bg-emerald-500 text-white'
                : 'bg-primary hover:opacity-90 text-white'
            }`}
          >
            {addedAll ? (
              <>
                <Check className="w-4 h-4" />
                <span>All {kitItems.length} Items Added to Cart!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add Complete Bundle to Cart (₹{totalPrice})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
