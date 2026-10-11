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
        className="group relative flex flex-col justify-between bg-white dark:bg-[#0a0a0a] rounded-xs border border-black/10 dark:border-white/10 shadow-lg hover:border-black/30 dark:hover:border-white/30 transition-all duration-300 cursor-pointer overflow-hidden will-change-transform"
      >
        {/* Viewfinder Brackets on Hover */}
        <span className="bracket bracket-tl !w-3 !h-3 opacity-0 group-hover:opacity-100 transition-opacity !border-[#2563eb] dark:!border-[#A8C7FA]" />
        <span className="bracket bracket-br !w-3 !h-3 opacity-0 group-hover:opacity-100 transition-opacity !border-[#2563eb] dark:!border-[#A8C7FA]" />

        {/* Top Graphic Showcase with Real Product Photo */}
        <div className="relative h-52 w-full overflow-hidden bg-neutral-100 dark:bg-[#050505] border-b border-black/10 dark:border-white/10">
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
            <span className="text-[9px] font-space-mono font-bold tracking-[0.15em] uppercase px-2 py-0.5 rounded-2xs bg-white/90 dark:bg-black/90 text-black dark:text-white border border-black/15 dark:border-white/20 backdrop-blur-sm shadow-sm">
              {product.category}
            </span>
            {product.badge && (
              <span className="text-[9px] font-space-mono font-bold px-2 py-0.5 rounded-2xs bg-[#E2D3B6] text-black shadow-sm">
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
              className="p-1.5 rounded-2xs bg-white/90 dark:bg-black/90 border border-black/15 dark:border-white/20 hover:scale-110 active:scale-95 shadow-xs backdrop-blur-sm transition-all cursor-pointer text-neutral-600 dark:text-neutral-400"
            >
              <Heart
                className={`w-3.5 h-3.5 transition-colors ${
                  isFavorited
                    ? 'fill-[#F1C6D4] text-[#e11d48]'
                    : 'hover:text-black dark:hover:text-white'
                }`}
              />
            </button>

            {/* Eco-Score Badge */}
            <EcoScoreBadge scoreData={ecoScoreData} product={product} size="sm" />
          </div>

          {/* Floating Hover Controls (3D Quick View & Compare) */}
          <div className="absolute bottom-3 inset-x-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 font-space-mono">
            {/* 3D Inspect Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShow3DModal(true);
              }}
              className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-2xs bg-white dark:bg-black/90 text-black dark:text-white border border-black/20 dark:border-white/30 hover:bg-black hover:text-white shadow-xs transition-all active:scale-95 cursor-pointer font-bold"
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
              className={`inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-2xs shadow-xs transition-all cursor-pointer font-bold ${
                isCompared
                  ? 'bg-[#E2D3B6] text-black font-bold'
                  : 'bg-white dark:bg-black/90 text-black dark:text-white border border-black/20 dark:border-white/30 hover:bg-black hover:text-white'
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
            <div className="flex items-center gap-2 mb-2 font-space-mono">
              <span className={`text-[9px] font-bold border px-2 py-0.5 rounded-2xs ${pkgBadge.className}`}>
                {pkgBadge.text}
              </span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                {product.madeInKm} km away
              </span>
            </div>

            <h3 className="font-newsreader italic text-lg leading-snug line-clamp-2 text-[#0a0a0a] dark:text-white group-hover:text-[#2563eb] dark:group-hover:text-[#A8C7FA] transition-colors">
              {product.name}
            </h3>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2 font-sans font-normal">
              {product.description}
            </p>

            {/* Environmental Metrics Strip with Telemetry Tiles */}
            <div className="grid grid-cols-3 gap-1.5 my-3 py-2 px-2.5 rounded-2xs bg-neutral-50 dark:bg-[#050505] border border-black/10 dark:border-white/10 text-[10px] font-space-mono">
              <div className="flex items-center gap-1" title="Lifecycle Carbon Footprint">
                <Wind className="w-3 h-3 text-[#2563eb] dark:text-[#A8C7FA] shrink-0" />
                <span className="text-neutral-800 dark:text-neutral-300 font-bold">{product.carbonKg}kg</span>
              </div>
              <div className="flex items-center gap-1" title="Freshwater Consumed">
                <Droplets className="w-3 h-3 text-[#b45309] dark:text-[#E2D3B6] shrink-0" />
                <span className="text-neutral-800 dark:text-neutral-300 font-bold">{product.waterLitres}L</span>
              </div>
              <div className="flex items-center gap-1" title="Plastic Packaging Waste">
                <Ban className="w-3 h-3 text-rose-600 dark:text-[#F1C6D4] shrink-0" />
                <span className="text-neutral-800 dark:text-neutral-300 font-bold">{product.plasticGrams}g</span>
              </div>
            </div>
          </div>

          {/* Footer: Price & Add to Cart */}
          <div className="pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
            <div>
              <div className="text-[9px] font-space-mono uppercase text-neutral-500 tracking-wider">INDEX VALUE</div>
              <div className="text-base font-bold font-space-mono text-[#2563eb] dark:text-[#A8C7FA]">
                ₹{product.price.toLocaleString('en-IN')}
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xs bg-[#0a0a0a] dark:bg-[#A8C7FA] hover:bg-[#2563eb] text-white dark:text-black font-space-mono font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <ShoppingBag className="w-3 h-3" />
              <span>Add</span>
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
