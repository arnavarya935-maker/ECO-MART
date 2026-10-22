import React, { useState, useMemo } from 'react';
import { Sparkles, RotateCcw, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import productsData from '../../data/products.json';
import { getPersonalizedRanking, resetPreferences, getStoredSignals } from '../../lib/preferenceModel';
import ProductCard from '../ProductCard';

export default function ForYouRow({ title = 'Personalized For You', className = '' }) {
  const { userPriorities, showToast } = useCart();
  const [signalVersion, setSignalVersion] = useState(0);

  // Re-fetch personalized products when priorities or signalVersion changes
  const recommendedProducts = useMemo(() => {
    void signalVersion;
    const ranked = getPersonalizedRanking(productsData, userPriorities);
    return ranked.slice(0, 4);
  }, [userPriorities, signalVersion]);

  const signals = useMemo(() => {
    void signalVersion;
    return getStoredSignals();
  }, [signalVersion]);

  const hasLearnedSignals = useMemo(() => {
    const totalViews = Object.values(signals.categoryViews || {}).reduce((a, b) => a + b, 0);
    return totalViews > 0 || signals.swapsAccepted > 0;
  }, [signals]);

  const handleReset = () => {
    resetPreferences();
    setSignalVersion((v) => v + 1);
    if (showToast) {
      showToast('On-device preferences reset to neutral baseline.', 'info');
    }
  };

  if (!recommendedProducts || recommendedProducts.length === 0) return null;

  return (
    <section aria-labelledby="for-you-heading" className={`space-y-4 ${className}`}>
      {/* Header with Title, Privacy Badge, and Reset Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-primary-subtle text-primary border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
            </span>
            <h2 id="for-you-heading" className="text-xl sm:text-2xl font-serif font-bold text-heading">
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-sans text-secondary">
            <span>Ranked by multi-criteria priorities and local habits</span>
            <span className="text-muted">•</span>
            <span className="text-[11px] font-semibold text-primary bg-primary-subtle px-2 py-0.5 rounded-full border border-primary/20">
              {hasLearnedSignals ? 'Active On-Device Learning' : 'Neutral Baseline'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {hasLearnedSignals && (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-line bg-surface-raised hover:bg-surface-sunken text-xs font-sans font-semibold text-muted hover:text-heading transition cursor-pointer min-h-[36px]"
              title="Clear learned signals on this device"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset My Preferences</span>
            </button>
          )}
        </div>
      </div>

      {/* Privacy Guarantee Strip */}
      <div className="flex items-center gap-2 p-2.5 px-3.5 rounded-2xl bg-surface-sunken border border-line text-[11px] font-sans text-muted">
        <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
        <span>
          <strong>100% On-Device Learning:</strong> Your browsing history, category views and swap selections never leave this browser. Zero cloud telemetry.
        </span>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {recommendedProducts.map((product) => (
          <div key={product.id} className="flex flex-col space-y-2">
            {/* Transparent Reason Badge */}
            <div className="flex items-center gap-1.5 text-[11px] font-sans font-semibold text-primary bg-primary-subtle/80 border border-primary/20 px-3 py-1 rounded-xl">
              <Sparkles className="w-3 h-3 text-primary shrink-0" />
              <span className="line-clamp-1">{product.personalizedReason}</span>
            </div>
            <ProductCard product={product} rankingDetails={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
