import React from 'react';
import { X, Trash2, ShoppingBag, Wind, Droplets, Ban } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { calculateEcoScore } from '../lib/ecoScore';
import EcoScoreBadge from './EcoScoreBadge';
import ProductImage from './ProductImage';
import { Modal } from './ui/Modal';

export default function ProductCompareModal() {
  const {
    compareList,
    removeFromCompare,
    clearCompare,
    isCompareOpen,
    setIsCompareOpen,
    addToCart
  } = useCart();

  if (!isCompareOpen) return null;

  return (
    <Modal
      isOpen={isCompareOpen}
      onClose={() => setIsCompareOpen(false)}
      title="Product Lifecycle Comparison"
      maxWidth="max-w-5xl"
    >
      <div className="flex flex-col max-h-[80vh]">
        {/* Subheader */}
        <div className="flex items-center justify-between pb-4 border-b border-line">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full bg-primary-subtle text-primary border border-primary/20 text-xs font-semibold">
                {compareList.length}/3 Selected
              </span>
            </div>
            <p className="text-xs text-secondary mt-1">
              Compare sustainability metrics side-by-side to make the cleanest choice.
            </p>
          </div>

          {compareList.length > 0 && (
            <button
              type="button"
              onClick={clearCompare}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-line bg-surface-raised text-muted hover:text-danger hover:border-danger/40 text-xs font-semibold transition-colors min-h-[44px] focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto pt-6">
          {compareList.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-surface-sunken border border-line text-secondary mx-auto flex items-center justify-center text-2xl shadow-soft-sm">
                ⚖️
              </div>
              <h3 className="text-lg font-serif font-bold text-heading">No products in compare list</h3>
              <p className="text-xs text-secondary mt-1 max-w-sm mx-auto leading-relaxed">
                Click "+ Compare" on any product card in the catalog to add up to 3 items here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {compareList.map((product) => {
                const score = calculateEcoScore(product);
                return (
                  <div
                    key={product.id}
                    className="flex flex-col rounded-2xl bg-surface-raised border border-line p-4 relative shadow-soft-sm hover:border-primary transition-colors"
                  >
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeFromCompare(product.id)}
                      aria-label={`Remove ${product.name} from comparison`}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-raised/90 text-muted hover:text-danger hover:bg-surface-raised border border-line shadow-soft-sm z-10 flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* Image */}
                    <div className="h-44 rounded-xl overflow-hidden bg-surface-sunken relative mb-3 border border-line">
                      <ProductImage
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        category={product.category}
                        fallbackIcon={product.icon}
                      />
                      <div className="absolute top-2 left-2">
                        <EcoScoreBadge scoreData={score} product={product} size="sm" />
                      </div>
                    </div>

                    <h4 className="font-serif font-bold text-sm text-heading line-clamp-1">
                      {product.name}
                    </h4>
                    <div className="text-xs text-muted mt-0.5">{product.category}</div>
                    <div className="text-base font-serif font-bold text-heading mt-1">
                      ₹{product.price.toLocaleString('en-IN')}
                    </div>

                    {/* Score Bar */}
                    <div className="mt-4 pt-4 border-t border-line">
                      <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                        <span className="text-secondary">Eco-Score</span>
                        <span className="text-primary font-bold">{score.score}/100 ({score.grade})</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-surface-sunken overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${score.score}%` }}
                        />
                      </div>
                    </div>

                    {/* Breakdown Metrics */}
                    <div className="mt-4 space-y-2 text-xs">
                      <div className="flex items-center justify-between py-1.5 border-b border-line">
                        <span className="flex items-center gap-1.5 text-secondary">
                          <Wind className="w-3.5 h-3.5 text-primary" /> Carbon
                        </span>
                        <span className="font-semibold text-heading">{product.carbonKg} kg CO₂</span>
                      </div>

                      <div className="flex items-center justify-between py-1.5 border-b border-line">
                        <span className="flex items-center gap-1.5 text-secondary">
                          <Droplets className="w-3.5 h-3.5 text-secondary" /> Water
                        </span>
                        <span className="font-semibold text-heading">{product.waterLitres} L</span>
                      </div>

                      <div className="flex items-center justify-between py-1.5 border-b border-line">
                        <span className="flex items-center gap-1.5 text-secondary">
                          <Ban className="w-3.5 h-3.5 text-accent" /> Plastic Waste
                        </span>
                        <span className="font-semibold text-heading">{product.plasticGrams} g</span>
                      </div>

                      <div className="flex items-center justify-between py-1.5 border-b border-line">
                        <span className="text-secondary">Packaging</span>
                        <span className="font-semibold capitalize text-heading">{product.packaging.replace('-', ' ')}</span>
                      </div>

                      <div className="flex items-center justify-between py-1.5 border-b border-line">
                        <span className="text-secondary">Distance</span>
                        <span className="font-semibold text-heading">{product.madeInKm} km</span>
                      </div>

                      <div className="pt-2">
                        <div className="text-secondary mb-1.5 font-medium">Certifications</div>
                        <div className="flex flex-wrap gap-1">
                          {(product.certifications || []).map((c, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-surface-sunken border border-line text-secondary font-medium">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Add to Cart */}
                    <div className="mt-5 pt-3 border-t border-line">
                      <button
                        type="button"
                        onClick={() => addToCart(product)}
                        className="w-full min-h-[44px] flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverted text-xs font-bold shadow-soft-sm hover:shadow-soft-md transition-all active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-text-inverted" /> Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
