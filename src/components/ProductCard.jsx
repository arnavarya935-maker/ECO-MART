import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Eye, Heart, Check, Wind, Ban, Sparkles } from 'lucide-react';
import { calculateEcoScore } from '../lib/ecoScore';
import EcoScoreBadge from './EcoScoreBadge';
import ProductImage from './ProductImage';
import { useCart } from '../context/CartContext';
import { playSound } from '../lib/audio';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const {
    addToCart,
    setSelectedProduct,
    toggleWishlist,
    isInWishlist,
    trackRecentlyViewed
  } = useCart();

  const [added, setAdded] = useState(false);
  const ecoScoreData = calculateEcoScore(product);
  const isFavorited = isInWishlist ? isInWishlist(product.id) : false;

  // Feature 23: Impact per rupee calculation
  // (CO2 in grams avoided + plastic grams) / price in rupees
  const impactScore = (product.carbonKg * 1000 + (product.plasticGrams || 0)) / product.price;
  const isHighImpactPerRupee = product.isEcoFriendly && impactScore >= 3.5;

  const handleCardClick = () => {
    if (trackRecentlyViewed) trackRecentlyViewed(product);
    navigate(`/product/${product.id}`);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    if (trackRecentlyViewed) trackRecentlyViewed(product);
    setSelectedProduct(product);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    playSound('pop');
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col justify-between bg-white rounded-3xl border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all duration-300 cursor-pointer overflow-hidden select-none"
    >
      {/* Top Graphic Showcase - Image First (Feature 12) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-50 border-b border-stone-100">
        <ProductImage
          src={product.image}
          alt={product.name}
          className="w-full h-full group-hover:scale-105 transition-transform duration-500 object-cover"
          category={product.category}
          fallbackIcon={product.icon}
        />

        {/* Top Left Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start z-10 pointer-events-none">
          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/95 text-stone-850 border border-stone-200/80 backdrop-blur-xs shadow-2xs">
            {product.category}
          </span>
          {isHighImpactPerRupee && (
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 backdrop-blur-xs shadow-2xs flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-emerald-600" /> High Impact / ₹
            </span>
          )}
        </div>

        {/* Top Right Eco-Score Ring & Wishlist Heart (Feature 12) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            title={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
            className="p-2 rounded-full bg-white/95 border border-stone-200 shadow-2xs hover:scale-110 active:scale-95 transition-all text-stone-600 min-h-[36px] min-w-[36px] flex items-center justify-center"
            aria-label="Wishlist"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorited ? 'fill-rose-500 text-rose-500' : 'hover:text-stone-900'
              }`}
            />
          </button>

          {/* Colored Eco Score Ring */}
          <div className="bg-white/95 rounded-full p-0.5 shadow-2xs border border-stone-200/60 backdrop-blur-xs">
            <EcoScoreBadge scoreData={ecoScoreData} size="sm" variant="ring" />
          </div>
        </div>

        {/* Quick View Button on Hover */}
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            type="button"
            onClick={handleQuickView}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl bg-white/95 text-stone-800 border border-stone-200 hover:bg-stone-50 shadow-sm transition-all active:scale-95 min-h-[36px]"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-700" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Information Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-extrabold text-sm sm:text-base leading-snug line-clamp-2 text-stone-900 group-hover:text-emerald-800 transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Environmental metrics */}
          <div className="flex items-center gap-3 mt-3 text-[11px] text-stone-600 font-semibold">
            <span className="flex items-center gap-1" title="Carbon footprint">
              <Wind className="w-3.5 h-3.5 text-emerald-600" /> {product.carbonKg}kg CO₂
            </span>
            <span className="flex items-center gap-1" title="Plastic packaging">
              <Ban className="w-3.5 h-3.5 text-amber-600" /> {product.plasticGrams}g plastic
            </span>
          </div>
        </div>

        {/* Bottom Price & One-Tap Add to Cart (Feature 12) */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Price</div>
            <div className="text-base sm:text-lg font-black text-[#0B3B2C]">
              ₹{product.price.toLocaleString('en-IN')}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-2xs transition active:scale-95 min-h-[40px]"
            aria-label="Add to cart"
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-200 animate-bounce" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
