import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Eye, Heart, Check, Wind, Ban, Sparkles } from 'lucide-react';
import { calculateEcoScore } from '../lib/ecoScore';
import EcoScoreBadge from './EcoScoreBadge';
import ProductImage from './ProductImage';
import WhyRankPopover from './decision/WhyRankPopover';
import AIEthicsCard from './decision/AIEthicsCard';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { playSound } from '../lib/audio';

export default function ProductCard({ product, rankingDetails }) {
  const navigate = useNavigate();
  const { reduceEffects } = useTheme();
  const {
    addToCart,
    setSelectedProduct,
    toggleWishlist,
    isInWishlist,
    trackRecentlyViewed
  } = useCart();

  const [added, setAdded] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const ecoScoreData = calculateEcoScore(product);
  const isFavorited = isInWishlist ? isInWishlist(product.id) : false;

  // Impact per rupee calculation
  const impactScore = (product.carbonKg * 1000 + (product.plasticGrams || 0)) / product.price;
  const isHighImpactPerRupee = product.isEcoFriendly && impactScore >= 3.5;

  const handleMouseMove = (e) => {
    if (reduceEffects) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 6;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

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
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: !reduceEffects && (tilt.x || tilt.y)
          ? `perspective(900px) rotateX(${tilt.y.toFixed(1)}deg) rotateY(${tilt.x.toFixed(1)}deg) translateY(-2px)`
          : undefined,
        transition: 'transform 0.16s ease-out'
      }}
      className="group relative flex flex-col justify-between bg-surface-raised rounded-3xl border border-line shadow-card product-card-lift cursor-pointer overflow-hidden select-none isolate"
    >
      {/* Top Graphic Showcase - Image First */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface border-b border-line">
        <ProductImage
          src={product.image}
          alt={product.name}
          className="w-full h-full group-hover:scale-105 transition-transform duration-500 object-cover"
          category={product.category}
          fallbackIcon={product.icon}
        />

        {/* Top Left Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start z-2 pointer-events-none">
          <span className="text-xs font-sans font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-surface-raised/95 text-heading border border-line backdrop-blur-xs shadow-2xs">
            {product.category}
          </span>
          {isHighImpactPerRupee && (
            <span className="text-xs font-sans font-semibold px-2 py-0.5 rounded-full bg-surface-accent text-primary border border-primary/20 backdrop-blur-xs shadow-2xs flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-primary" /> High Impact / ₹
            </span>
          )}
        </div>

        {/* Top Right Eco-Score Ring & Wishlist Heart */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            title={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
            className="p-2.5 rounded-full bg-surface-raised/95 border border-line shadow-soft-sm hover:scale-105 active:scale-95 transition-all text-secondary min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Wishlist"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorited ? 'fill-danger text-danger' : 'hover:text-heading'
              }`}
            />
          </button>

          {/* Colored Eco Score Ring */}
          <div className="bg-surface-raised/95 rounded-full p-0.5 shadow-2xs border border-line backdrop-blur-xs">
            <EcoScoreBadge scoreData={ecoScoreData} size="sm" variant="ring" />
          </div>
        </div>

        {/* Quick View Button on Hover */}
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-2">
          <button
            type="button"
            onClick={handleQuickView}
            className="inline-flex items-center gap-1.5 text-xs font-sans font-medium px-4 py-2 rounded-xl bg-surface-raised/95 text-heading border border-line hover:bg-surface-sunken shadow-soft-sm transition-all active:scale-95 min-h-[44px] cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-primary" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Information Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-serif font-bold text-base leading-snug line-clamp-2 text-heading group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          <p className="text-xs font-sans text-muted mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Environmental metrics & Decision Engine Ranking */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
            <div className="flex items-center gap-3 text-xs font-sans text-secondary font-medium">
              <span className="flex items-center gap-1" title="Carbon footprint">
                <Wind className="w-3.5 h-3.5 text-primary" /> {product.carbonKg}kg CO₂
              </span>
              <span className="flex items-center gap-1" title="Plastic packaging">
                <Ban className="w-3.5 h-3.5 text-warning" /> {product.plasticGrams}g plastic
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={handleQuickView}
                className="text-xs font-sans font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer min-h-[32px]"
                title="Inspect EcoScore audit methodology and formula"
              >
                <Sparkles className="w-3 h-3 text-primary" />
                Why this score?
              </button>
              <AIEthicsCard compact={true} product={product} />
              {(rankingDetails || product.rank) && (
                <WhyRankPopover rankingDetails={rankingDetails || (product.rank ? product : null)} />
              )}
            </div>
          </div>
        </div>

        {/* Bottom Price & One-Tap Add to Cart */}
        <div className="pt-3 border-t border-line flex items-center justify-between gap-2">
          <div>
            <div className="text-xs font-sans uppercase font-medium text-muted tracking-wider">Price</div>
            <div className="text-base sm:text-lg font-sans font-bold text-heading">
              ₹{product.price.toLocaleString('en-IN')}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="flex items-center gap-1.5 px-4 py-2 min-h-[44px] rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast font-sans font-semibold text-xs shadow-soft-sm transition-all cursor-pointer active:scale-95"
            aria-label="Add to cart"
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3] text-primary-contrast" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-primary-contrast" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

