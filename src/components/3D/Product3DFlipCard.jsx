import React, { useState } from 'react';
import { X, RotateCw, ShoppingBag, Wind, Droplets, Ban, Sparkles, RefreshCw } from 'lucide-react';
import { calculateEcoScore, compareProductImpact } from '../../lib/ecoScore';
import EcoScoreBadge from '../EcoScoreBadge';
import ProductImage from '../ProductImage';
import { useCart } from '../../context/CartContext';

export default function Product3DFlipCard({ product, onClose }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const { addToCart, allProducts } = useCart();

  if (!product) return null;

  const ecoScoreData = calculateEcoScore(product);
  const productMap = new Map((allProducts || []).map((p) => [p.id, p]));
  const greenerAlt = product.conventionalAlternativeId
    ? productMap.get(product.conventionalAlternativeId)
    : null;

  const comparison = greenerAlt
    ? compareProductImpact(product.isEcoFriendly ? product : greenerAlt, product.isEcoFriendly ? greenerAlt : product)
    : null;

  return (
    <div
      className="fixed inset-0 z-60 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg select-none"
        onClick={(e) => e.stopPropagation()}
        style={{ perspective: '1200px' }}
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between mb-3 text-primary-contrast">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-primary/20 text-accent text-xs font-semibold border border-primary/30">
              3D Quick View & Lifecycle Inspect
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFlipped(!isFlipped)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface/20 hover:bg-surface/30 text-surface text-xs font-medium backdrop-blur-md transition min-h-[44px] cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Flip Card ({isFlipped ? 'Front' : 'Lifecycle Specs'})</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-surface/20 hover:bg-surface/30 text-surface transition min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3D Flip Container */}
        <div
          className="relative w-full transition-transform duration-700"
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* FRONT FACE */}
          <div
            className="w-full rounded-3xl overflow-hidden bg-surface border border-line shadow-soft-xl"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {/* Product Image */}
            <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-surface-sunken">
              <ProductImage
                src={product.image}
                alt={product.name}
                className="w-full h-full"
                category={product.category}
                fallbackIcon={product.icon}
                priority={true}
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-surface/90 text-heading backdrop-blur-md text-xs font-semibold border border-line">
                  {product.category}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <EcoScoreBadge scoreData={ecoScoreData} product={product} size="md" showPopoverButton={false} />
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-serif font-bold text-heading">
                  {product.name}
                </h3>
                <p className="text-xs text-secondary mt-1 line-clamp-2">
                  {product.description}
                </p>
              </div>

              {/* Price and action */}
              <div className="flex items-center justify-between pt-2 border-t border-line">
                <div>
                  <span className="text-[10px] font-semibold uppercase text-muted">Price</span>
                  <div className="text-2xl font-serif font-bold text-heading">
                    ₹{product.price.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFlipped(true)}
                    className="px-4 py-2.5 rounded-full bg-surface-sunken text-heading font-medium text-xs hover:bg-surface border border-line transition min-h-[44px] cursor-pointer"
                  >
                    Inspect Back →
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(product);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-primary-contrast font-medium text-xs shadow-soft-sm transition active:scale-95 min-h-[44px] cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* BACK FACE (Lifecycle Footprint & Swap Recommendation) */}
          <div
            className="absolute inset-0 w-full h-full rounded-3xl overflow-y-auto bg-primary text-primary-contrast border border-primary/30 shadow-soft-xl p-6 sm:p-7 space-y-5"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-primary-contrast/20">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{product.icon}</span>
                <div>
                  <h4 className="font-serif font-bold text-sm text-primary-contrast line-clamp-1">{product.name}</h4>
                  <span className="text-[10px] text-accent">Detailed Lifecycle Breakdown</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-accent">Grade {ecoScoreData.grade}</span>
                <div className="text-lg font-serif font-bold">{ecoScoreData.score}/100</div>
              </div>
            </div>

            {/* Environmental stats */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-surface/10 border border-primary-contrast/15">
                <Wind className="w-4 h-4 text-accent mx-auto mb-1" />
                <div className="text-xs font-bold">{product.carbonKg}kg</div>
                <div className="text-[9px] text-primary-contrast/70">CO₂ Lifecycle</div>
              </div>
              <div className="p-2.5 rounded-xl bg-surface/10 border border-primary-contrast/15">
                <Droplets className="w-4 h-4 text-accent mx-auto mb-1" />
                <div className="text-xs font-bold">{product.waterLitres}L</div>
                <div className="text-[9px] text-primary-contrast/70">Freshwater</div>
              </div>
              <div className="p-2.5 rounded-xl bg-surface/10 border border-primary-contrast/15">
                <Ban className="w-4 h-4 text-warning mx-auto mb-1" />
                <div className="text-xs font-bold">{product.plasticGrams}g</div>
                <div className="text-[9px] text-primary-contrast/70">Plastic Waste</div>
              </div>
            </div>

            {/* 5-Pillar mini bars */}
            <div className="space-y-2 text-xs">
              {Object.entries(ecoScoreData.breakdown).map(([k, item]) => (
                <div key={k} className="space-y-0.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-primary-contrast/80">{item.name}</span>
                    <span className="font-bold text-primary-contrast">{item.score}/{item.max}</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${(item.score / item.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Swap comparison if available */}
            {greenerAlt && !product.isEcoFriendly && (
              <div className="p-3 rounded-2xl bg-surface/15 border border-primary-contrast/20 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-accent">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Agent Recommendation</span>
                </div>
                <p className="text-[11px] text-primary-contrast/90 leading-snug">
                  Swap to <strong>{greenerAlt.name}</strong> to save{' '}
                  {comparison?.co2Saved}kg CO₂ and {comparison?.plasticSaved}g plastic!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    addToCart(greenerAlt);
                    onClose();
                  }}
                  className="w-full py-2 rounded-full bg-accent hover:bg-accent/90 text-primary-contrast font-medium text-xs flex items-center justify-center gap-1.5 transition min-h-[44px] cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Choose Greener Swap</span>
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsFlipped(false)}
              className="w-full py-2.5 rounded-full bg-surface/10 hover:bg-surface/20 text-primary-contrast font-medium text-xs transition min-h-[44px] cursor-pointer"
            >
              ← Flip Back to Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
