import React, { useState } from 'react';
import { ShoppingBag, Eye, Wind, Droplets, Ban, Check, ArrowRight, RotateCw, Heart } from 'lucide-react';
import { calculateEcoScore } from '../lib/ecoScore';
import EcoScoreBadge from './EcoScoreBadge';
import ProductImage from './ProductImage';
import Product3DFlipCard from './3D/Product3DFlipCard';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function ProductCard({ product, onSelect }) {
  const {
    addToCart,
    setSelectedProduct,
    wishlist,
    toggleWishlist,
    isInWishlist,
    compareList,
    addToCompare,
    removeFromCompare,
    trackRecentlyViewed
  } = useCart();
  const { reducedMotion } = useTheme();
  const [show3DModal, setShow3DModal] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const ecoScoreData = calculateEcoScore(product);

  const isFavorited = isInWishlist ? isInWishlist(product.id) : false;
  const isCompared = compareList ? compareList.some((p) => p.id === product.id) : false;

  const handleMouseMove = (e) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      rotateX: (-y / 15).toFixed(2),
      rotateY: (x / 15).toFixed(2)
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const handleCardClick = () => {
    if (trackRecentlyViewed) trackRecentlyViewed(product);
    if (onSelect) onSelect(product);
    else setSelectedProduct(product);
  };

  const getPackagingBadge = (pkg) => {
    if (pkg === 'plastic-free') {
      return {
        text: 'Zero Plastic',
        className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
      };
    }
    if (pkg === 'recycled') {
      return {
        text: 'Recycled Pack',
        className: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border-teal-200 dark:border-teal-800'
      };
    }
    return {
      text: 'Plastic Packaging',
      className: 'bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border-stone-300 dark:border-stone-700'
    };
  };

  const pkgBadge = getPackagingBadge(product.packaging);

  return (
    <>
      <div
        onClick={handleCardClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: !reducedMotion && (tilt.rotateX !== 0 || tilt.rotateY !== 0)
            ? `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateY(-4px)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
          transition: reducedMotion || (tilt.rotateX === 0 && tilt.rotateY === 0) ? 'transform 0.4s ease, box-shadow 0.3s ease' : 'none'
        }}
        className="group relative flex flex-col justify-between bg-white dark:bg-[#0D1F18] rounded-3xl border border-stone-200/90 dark:border-[#1B382D] shadow-[0_4px_16px_-2px_rgba(11,59,44,0.06)] hover:shadow-[0_16px_32px_-4px_rgba(11,59,44,0.12)] hover:border-emerald-500/60 dark:hover:border-emerald-500/60 transition-all duration-300 cursor-pointer overflow-hidden will-change-transform"
      >
        {/* Top Graphic Showcase with Real Product Photo */}
        <div className="relative h-52 w-full overflow-hidden bg-[#F7FAF8] dark:bg-stone-900">
          <ProductImage
            src={product.image}
            alt={product.name}
            className="w-full h-full group-hover:scale-105 transition-transform duration-500"
            category={product.category}
            fallbackIcon={product.icon}
            enableZoom={true}
          />

          {/* Top Floating Category & Badge */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 items-start z-10">
            <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-stone-900/90 text-white backdrop-blur-sm shadow-sm">
              {product.category}
            </span>
            {product.badge && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 shadow-sm">
                {product.badge}
              </span>
            )}
          </div>

          {/* Top Right Actions: Eco-Score Badge & Wishlist Heart */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            {/* Wishlist Heart Toggle */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product);
              }}
              title={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
              className="p-1.5 rounded-full bg-white/95 dark:bg-stone-900/95 hover:scale-110 active:scale-95 shadow-md backdrop-blur-sm transition-all"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isFavorited
                    ? 'fill-rose-500 text-rose-500'
                    : 'text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white'
                }`}
              />
            </button>

            {/* Eco-Score Badge */}
            <EcoScoreBadge scoreData={ecoScoreData} product={product} size="sm" />
          </div>

          {/* Floating Hover Controls (3D Quick View & Compare) */}
          <div className="absolute bottom-3 inset-x-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            {/* 3D Inspect Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShow3DModal(true);
              }}
              className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all active:scale-95"
            >
              <RotateCw className="w-3 h-3" /> 3D View
            </button>

            {/* Compare Toggle */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (isCompared) {
                  removeFromCompare(product.id);
                } else {
                  addToCompare(product);
                }
              }}
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full shadow-md transition-all ${
                isCompared
                  ? 'bg-amber-400 text-stone-950 font-black'
                  : 'bg-white/95 dark:bg-stone-900/95 text-stone-800 dark:text-stone-200 hover:bg-white'
              }`}
            >
              {isCompared ? '✓ Compared' : '+ Compare'}
            </button>
          </div>
        </div>

        {/* Product Content Body */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Packaging & Origin Pill */}
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full ${pkgBadge.className}`}>
                {pkgBadge.text}
              </span>
              <span className="text-[11px] font-semibold text-stone-600 dark:text-stone-300">
                {product.madeInKm} km away
              </span>
            </div>

            <h3 className="font-extrabold text-[#0B3B2C] dark:text-stone-100 text-base leading-snug line-clamp-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
              {product.name}
            </h3>

            <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 line-clamp-2 font-medium">
              {product.description}
            </p>

            {/* Environmental Metrics Strip with Colored Accent Tiles */}
            <div className="grid grid-cols-3 gap-1.5 my-3.5 py-2 px-2.5 rounded-2xl bg-[#F7FAF8] dark:bg-stone-900/90 border border-stone-200/90 dark:border-stone-800 text-[11px]">
              <div className="flex items-center gap-1.5" title="Lifecycle Carbon Footprint">
                <div className="p-1 rounded-lg bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300">
                  <Wind className="w-3 h-3 shrink-0" />
                </div>
                <span className="font-bold text-stone-800 dark:text-stone-200">{product.carbonKg}kg</span>
              </div>
              <div className="flex items-center gap-1.5" title="Freshwater Consumed">
                <div className="p-1 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">
                  <Droplets className="w-3 h-3 shrink-0" />
                </div>
                <span className="font-bold text-stone-800 dark:text-stone-200">{product.waterLitres}L</span>
              </div>
              <div className="flex items-center gap-1.5" title="Plastic Packaging Waste">
                <div className="p-1 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300">
                  <Ban className="w-3 h-3 shrink-0" />
                </div>
                <span className="font-bold text-stone-800 dark:text-stone-200">{product.plasticGrams}g</span>
              </div>
            </div>
          </div>

          {/* Footer: Price & Add to Cart */}
          <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Price</div>
              <div className="text-lg font-black text-stone-900 dark:text-stone-100">
                ₹{product.price.toLocaleString('en-IN')}
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs shadow-sm hover:shadow active:scale-95 transition-all group-hover:translate-x-0.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3D Quick View Flip Modal */}
      {show3DModal && (
        <Product3DFlipCard
          product={product}
          onClose={() => setShow3DModal(false)}
        />
      )}
    </>
  );
}
