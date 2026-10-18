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
      className="fixed inset-0 z-60 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg select-none perspective-1000"
        onClick={(e) => e.stopPropagation()}
        style={{ perspective: '1200px' }}
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between mb-3 text-white">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
              3D Quick View & Lifecycle Inspect
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFlipped(!isFlipped)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold backdrop-blur-md transition"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Flip Card ({isFlipped ? 'Front' : 'Lifecycle Specs'})</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3D Flip Container */}
        <div
          className="relative w-full transition-transform duration-700 preserve-3d"
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* FRONT FACE */}
          <div
            className="w-full rounded-3xl overflow-hidden bg-[#FAF7F0] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {/* Product Image */}
            <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-stone-100 dark:bg-stone-850">
              <ProductImage
                src={product.image}
                alt={product.name}
                className="w-full h-full"
                category={product.category}
                fallbackIcon={product.icon}
                priority={true}
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-stone-900/80 text-white backdrop-blur-md text-xs font-bold">
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
                <h3 className="text-xl font-black text-stone-900 dark:text-stone-100">
                  {product.name}
                </h3>
                <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                  {product.description}
                </p>
              </div>

              {/* Price and action */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-200 dark:border-stone-800">
                <div>
                  <span className="text-[10px] font-bold uppercase text-stone-400">Price</span>
                  <div className="text-2xl font-black text-stone-900 dark:text-stone-100">
                    ₹{product.price.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFlipped(true)}
                    className="px-4 py-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs hover:bg-stone-200 transition"
                  >
                    Inspect Back →
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(product);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition active:scale-95"
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
            className="absolute inset-0 w-full h-full rounded-3xl overflow-y-auto bg-[#0F3D2E] text-white border border-emerald-500/40 shadow-2xl p-6 sm:p-7 space-y-5 backface-hidden"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-emerald-600/40">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{product.icon}</span>
                <div>
                  <h4 className="font-extrabold text-sm text-white line-clamp-1">{product.name}</h4>
                  <span className="text-[10px] text-emerald-300">Detailed Lifecycle Breakdown</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-emerald-300">Grade {ecoScoreData.grade}</span>
                <div className="text-lg font-black">{ecoScoreData.score}/100</div>
              </div>
            </div>

            {/* Environmental stats */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-black/20 border border-emerald-500/20">
                <Wind className="w-4 h-4 text-sky-400 mx-auto mb-1" />
                <div className="text-xs font-bold">{product.carbonKg}kg</div>
                <div className="text-[9px] text-stone-300">CO₂ Lifecycle</div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/20 border border-emerald-500/20">
                <Droplets className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                <div className="text-xs font-bold">{product.waterLitres}L</div>
                <div className="text-[9px] text-stone-300">Freshwater</div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/20 border border-emerald-500/20">
                <Ban className="w-4 h-4 text-rose-400 mx-auto mb-1" />
                <div className="text-xs font-bold">{product.plasticGrams}g</div>
                <div className="text-[9px] text-stone-300">Plastic Waste</div>
              </div>
            </div>

            {/* 5-Pillar mini bars */}
            <div className="space-y-2 text-xs">
              {Object.entries(ecoScoreData.breakdown).map(([k, item]) => (
                <div key={k} className="space-y-0.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-emerald-200">{item.name}</span>
                    <span className="font-bold text-white">{item.score}/{item.max}</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 rounded-full"
                      style={{ width: `${(item.score / item.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Swap comparison if available */}
            {greenerAlt && !product.isEcoFriendly && (
              <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-400/40 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Agent Recommendation</span>
                </div>
                <p className="text-[11px] text-stone-200 leading-snug">
                  Swap to <strong>{greenerAlt.name}</strong> to save{' '}
                  {comparison?.co2Saved}kg CO₂ and {comparison?.plasticSaved}g plastic!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    addToCart(greenerAlt);
                    onClose();
                  }}
                  className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Choose Greener Swap</span>
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsFlipped(false)}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition"
            >
              ← Flip Back to Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
