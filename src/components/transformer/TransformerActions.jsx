import React, { useState } from 'react';
import { ShoppingBag, Copy, Share2, RotateCcw, Check, Sparkles } from 'lucide-react';
import { useCart, fireGreenConfetti } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useT } from '../../context/I18nContext';
import ShareableImpactCard from '../community/ShareableImpactCard';

export default function TransformerActions({
  items = [],
  totals,
  onReset
}) {
  const { addToCart, setIsCartOpen, showToast } = useCart();
  const { reduceEffects } = useTheme();
  const { t } = useT();

  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [addingAll, setAddingAll] = useState(false);

  const validProducts = items
    .filter((item) => (item.status === 'swapped' || item.status === 'kept') && (item.after || item.before))
    .map((item) => ({
      product: item.after || item.before,
      qty: item.qty || 1
    }));

  const handleAddAll = () => {
    if (validProducts.length === 0) return;
    setAddingAll(true);

    validProducts.forEach(({ product, qty }) => {
      addToCart(product, qty);
    });

    if (!reduceEffects) {
      fireGreenConfetti();
    }

    showToast(`Added ${validProducts.length} sustainable items to your cart!`, 'success');
    setIsCartOpen(true);

    setTimeout(() => {
      setAddingAll(false);
    }, 600);
  };

  const handleCopyList = async () => {
    const listLines = validProducts.map(({ product, qty }) => {
      return `• ${qty}x ${product.name} (₹${product.price * qty})`;
    });

    const summaryText = [
      '🌱 My Eco Sense Sustainable Basket:',
      ...listLines,
      `\nTotal: ₹${totals?.priceAfter || 0}`,
      `Plastic Avoided: ${totals?.plasticSaved || 0}g`,
      `CO₂ Diverted: ${totals?.co2Saved || 0}kg`,
      `Purpose Score: ${totals?.purposeScoreAfter || 0}/100`,
      '\nCalculated on Eco Sense — Shop with Purpose.'
    ].join('\n');

    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      showToast('Sustainable list copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Unable to copy to clipboard', 'warning');
    }
  };

  return (
    <div className="space-y-4">
      {/* Primary Actions Grid */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-3xl bg-surface border border-line shadow-soft-sm">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2.5 rounded-full bg-surface-sunken hover:bg-surface border border-line text-xs font-medium text-secondary hover:text-heading cursor-pointer transition min-h-[44px] flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-focus"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('transformer.startOverCta', 'Start Over')}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyList}
            className="px-4 py-2.5 rounded-full bg-surface-sunken hover:bg-surface border border-line text-xs font-medium text-secondary hover:text-heading cursor-pointer transition min-h-[44px] flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-focus"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : t('transformer.copyListCta', 'Copy List')}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            className="px-4 py-2.5 rounded-full bg-surface-sunken hover:bg-surface border border-line text-xs font-medium text-secondary hover:text-heading cursor-pointer transition min-h-[44px] flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-focus"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{t('transformer.shareCardCta', 'Impact Card')}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleAddAll}
          disabled={addingAll || validProducts.length === 0}
          className="px-7 py-3 rounded-full bg-primary hover:bg-primary-hover text-primary-contrast font-medium text-xs sm:text-sm cursor-pointer transition shadow-soft-md min-h-[44px] flex items-center justify-center gap-2 active:scale-98 focus-visible:outline-2 focus-visible:outline-focus"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>
            {addingAll ? 'Adding...' : t('transformer.addAllCta', 'Add All to Cart')}
          </span>
          <Sparkles className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Shareable Impact Certificate Modal */}
      {showShareModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/60 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-2xl bg-surface border border-line rounded-3xl shadow-soft-xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <h3 className="text-lg font-serif font-bold text-heading">
                Sustainable Cart Impact Certificate
              </h3>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="p-2 rounded-xl text-secondary hover:text-heading hover:bg-surface-sunken transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <ShareableImpactCard
              customPlastic={totals?.plasticSaved}
              customCo2={totals?.co2Saved}
              customWater={totals?.waterSaved}
              purposeScoreBefore={totals?.purposeScoreBefore}
              purposeScoreAfter={totals?.purposeScoreAfter}
            />
          </div>
        </div>
      )}
    </div>
  );
}
