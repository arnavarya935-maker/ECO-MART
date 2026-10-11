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
        className="group relative flex flex-col justify-between bg-[#111116] light:bg-white rounded-md border border-[#33333a] light:border-zinc-200 shadow-xl hover:border-[#555562] transition-all duration-300 cursor-pointer overflow-hidden will-change-transform"
      >
        {/* Top Graphic Showcase with Real Product Photo */}
        <div className="relative h-52 w-full overflow-hidden bg-[#07080b] light:bg-zinc-100 border-b border-[#33333a] light:border-zinc-200">
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
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-sm bg-[#0b0b0d]/90 light:bg-white/90 text-white light:text-black border border-[#33333a] light:border-zinc-300 backdrop-blur-sm shadow-sm">
              {product.category}
            </span>
            {product.badge && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm bg-amber-400 text-stone-950 shadow-sm">
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
              className="p-1.5 rounded-sm bg-[#0b0b0d]/90 light:bg-white/90 border border-[#33333a] light:border-zinc-200 hover:scale-110 active:scale-95 shadow-md backdrop-blur-sm transition-all cursor-pointer"
            >
              <Heart
                className={`w-3.5 h-3.5 transition-colors ${
                  isFavorited
                    ? 'fill-rose-500 text-rose-500'
                    : 'text-[#aaaab0] hover:text-white light:text-zinc-600'
                }`}
              />
            </button>

            {/* Eco-Score Badge */}
            <EcoScoreBadge scoreData={ecoScoreData} product={product} size="sm" />
          </div>

          {/* Floating Hover Controls (3D Quick View & Compare) */}
          <div className="absolute bottom-3 inset-x-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 font-mono">
            {/* 3D Inspect Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShow3DModal(true);
              }}
              className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-sm bg-[#16161d] text-white border border-[#33333a] hover:bg-white hover:text-black shadow-md transition-all active:scale-95 cursor-pointer"
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
              className={`inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-sm shadow-md transition-all cursor-pointer ${
                isCompared
                  ? 'bg-amber-400 text-black font-bold'
                  : 'bg-[#16161d] text-white border border-[#33333a] hover:bg-white hover:text-black'
              }`}
            >
              {isCompared ? '✓ Compared' : '+ Compare'}
            </button>
          </div>
        </div>

        {/* Product Content Body */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Packaging & Origin Pill */}
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-mono font-bold border px-2 py-0.5 rounded-sm ${pkgBadge.className}`}>
                {pkgBadge.text}
              </span>
              <span className="text-[11px] font-mono text-[#aaaab0] light:text-zinc-500">
                {product.madeInKm} km away
              </span>
            </div>

            <h3 className="font-bold text-[#f4f4f2] light:text-zinc-900 text-base leading-snug line-clamp-2 group-hover:text-emerald-400 transition-colors">
              {product.name}
            </h3>

            <p className="text-xs text-[#aaaab0] light:text-zinc-600 mt-1 line-clamp-2 font-normal">
              {product.description}
            </p>

            {/* Environmental Metrics Strip with Colored Accent Tiles */}
            <div className="grid grid-cols-3 gap-1.5 my-3 py-2 px-2.5 rounded-sm bg-[#07080b] light:bg-zinc-50 border border-[#222228] light:border-zinc-200 text-[11px] font-mono">
              <div className="flex items-center gap-1.5" title="Lifecycle Carbon Footprint">
                <div className="p-1 rounded bg-[#16161d] text-sky-400">
                  <Wind className="w-3 h-3 shrink-0" />
                </div>
                <span className="text-zinc-200 light:text-zinc-700">{product.carbonKg}kg</span>
              </div>
              <div className="flex items-center gap-1.5" title="Freshwater Consumed">
                <div className="p-1 rounded bg-[#16161d] text-blue-400">
                  <Droplets className="w-3 h-3 shrink-0" />
                </div>
                <span className="text-zinc-200 light:text-zinc-700">{product.waterLitres}L</span>
              </div>
              <div className="flex items-center gap-1.5" title="Plastic Packaging Waste">
                <div className="p-1 rounded bg-[#16161d] text-rose-400">
                  <Ban className="w-3 h-3 shrink-0" />
                </div>
                <span className="text-zinc-200 light:text-zinc-700">{product.plasticGrams}g</span>
              </div>
            </div>
          </div>

          {/* Footer: Price & Add to Cart */}
          <div className="pt-3 border-t border-[#33333a] light:border-zinc-200 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase text-[#aaaab0] tracking-wider">Price</div>
              <div className="text-lg font-bold font-mono text-[#f4f4f2] light:text-zinc-900">
                ₹{product.price.toLocaleString('en-IN')}
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-sm bg-[#f4f4f2] light:bg-zinc-900 text-[#0b0b0d] light:text-white hover:bg-emerald-400 hover:text-black font-semibold text-xs border border-transparent hover:border-[#33333a] transition-all cursor-pointer"
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
