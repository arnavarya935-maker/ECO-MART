import React from 'react';
import { X, Trash2, ShoppingBag, Wind, Droplets, Ban } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { calculateEcoScore } from '../lib/ecoScore';
import EcoScoreBadge from './EcoScoreBadge';
import ProductImage from './ProductImage';

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
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl p-6 sm:p-8 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100">
                Product Lifecycle Comparison
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                {compareList.length}/3 Selected
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Compare sustainability metrics side-by-side to make the cleanest choice.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {compareList.length > 0 && (
              <button
                type="button"
                onClick={clearCompare}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-medium transition"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsCompareOpen(false)}
              className="p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto pt-6">
          {compareList.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">⚖️</div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">No products in compare list</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto">
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
                    className="flex flex-col rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800 p-4 relative"
                  >
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeFromCompare(product.id)}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-white dark:bg-stone-800 text-stone-400 hover:text-rose-500 shadow-sm z-10 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* Image */}
                    <div className="h-40 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 relative mb-3">
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

                    <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 line-clamp-1">
                      {product.name}
                    </h4>
                    <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{product.category}</div>
                    <div className="text-base font-black text-stone-900 dark:text-stone-100 mt-1">
                      ₹{product.price.toLocaleString('en-IN')}
                    </div>

                    {/* Score Bar */}
                    <div className="mt-4 pt-4 border-t border-stone-200/60 dark:border-stone-700/60">
                      <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span className="text-stone-600 dark:text-stone-300">Eco-Score</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">{score.score}/100 ({score.grade})</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${score.score}%` }}
                        />
                      </div>
                    </div>

                    {/* Breakdown Metrics */}
                    <div className="mt-4 space-y-2.5 text-xs">
                      <div className="flex items-center justify-between py-1 border-b border-stone-200/40 dark:border-stone-800">
                        <span className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400">
                          <Wind className="w-3.5 h-3.5 text-sky-500" /> Carbon
                        </span>
                        <span className="font-bold text-stone-850 dark:text-stone-200">{product.carbonKg} kg CO₂</span>
                      </div>

                      <div className="flex items-center justify-between py-1 border-b border-stone-200/40 dark:border-stone-800">
                        <span className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400">
                          <Droplets className="w-3.5 h-3.5 text-blue-500" /> Water
                        </span>
                        <span className="font-bold text-stone-850 dark:text-stone-200">{product.waterLitres} L</span>
                      </div>

                      <div className="flex items-center justify-between py-1 border-b border-stone-200/40 dark:border-stone-800">
                        <span className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400">
                          <Ban className="w-3.5 h-3.5 text-rose-500" /> Plastic Waste
                        </span>
                        <span className="font-bold text-stone-850 dark:text-stone-200">{product.plasticGrams} g</span>
                      </div>

                      <div className="flex items-center justify-between py-1 border-b border-stone-200/40 dark:border-stone-800">
                        <span className="text-stone-500 dark:text-stone-400">Packaging</span>
                        <span className="font-bold capitalize text-stone-850 dark:text-stone-200">{product.packaging.replace('-', ' ')}</span>
                      </div>

                      <div className="flex items-center justify-between py-1 border-b border-stone-200/40 dark:border-stone-800">
                        <span className="text-stone-500 dark:text-stone-400">Distance</span>
                        <span className="font-bold text-stone-850 dark:text-stone-200">{product.madeInKm} km</span>
                      </div>

                      <div className="py-1">
                        <div className="text-stone-500 dark:text-stone-400 mb-1">Certifications</div>
                        <div className="flex flex-wrap gap-1">
                          {(product.certifications || []).map((c, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-750 text-stone-700 dark:text-stone-300 font-medium">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Add to Cart */}
                    <div className="mt-4 pt-3">
                      <button
                        type="button"
                        onClick={() => addToCart(product)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow transition active:scale-98"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                      </button>
                    </div>
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
