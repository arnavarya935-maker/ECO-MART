import React, { useState } from 'react';
import { Maximize2, X, ZoomIn, Box, Image as ImageIcon } from 'lucide-react';
import ProductImage from './ProductImage';
import Product3DViewer from './3D/Product3DViewer';

export default function ProductGallery({ product }) {
  const images = Array.isArray(product?.images) && product.images.length > 0
    ? product.images
    : [product?.image || `/images/products/${product?.id}.jpg`];

  const [viewMode, setViewMode] = useState('photo'); // 'photo' | '3d'
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: 'center center', transform: 'scale(1)' });
  const [isHovered, setIsHovered] = useState(false);

  const activeSrc = images[activeIdx] || images[0];

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(1.8)'
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setZoomStyle({
      transformOrigin: 'center center',
      transform: 'scale(1)'
    });
  };

  return (
    <div className="space-y-3 w-full">
      {/* 2D Photo vs 3D Model View Mode Switcher */}
      <div className="flex items-center justify-between pb-1">
        <div className="inline-flex p-1 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
          <button
            type="button"
            onClick={() => setViewMode('photo')}
            className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              viewMode === 'photo'
                ? 'bg-white dark:bg-stone-900 text-[#0B3B2C] dark:text-emerald-300 shadow-xs'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>Product Photos</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('3d')}
            className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              viewMode === '3d'
                ? 'bg-white dark:bg-stone-900 text-[#0B3B2C] dark:text-emerald-300 shadow-xs'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Box className="w-3.5 h-3.5 text-emerald-600" />
            <span>Interactive 3D Viewer</span>
          </button>
        </div>
      </div>

      {viewMode === '3d' ? (
        <Product3DViewer product={product} />
      ) : (
        <>
          {/* Main Showcase Image with Zoom */}
          <div
            className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden bg-stone-100 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800 cursor-crosshair group shadow-inner"
            onMouseEnter={() => setIsHovered(true)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
        <div
          className="w-full h-full transition-transform duration-150 ease-out"
          style={isHovered ? zoomStyle : undefined}
        >
          <ProductImage
            src={activeSrc}
            alt={product.name}
            className="w-full h-full"
            category={product.category}
            fallbackIcon={product.icon}
            priority={true}
          />
        </div>

        {/* Fullscreen Lightbox Trigger Button */}
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="absolute bottom-3 right-3 p-2.5 rounded-2xl bg-white/90 dark:bg-stone-900/90 text-stone-800 dark:text-stone-200 backdrop-blur-md shadow-md hover:scale-105 transition-all"
          title="Open Fullscreen Lightbox"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Hover Hint */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-stone-900/60 text-white backdrop-blur-sm text-[10px] font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="w-3 h-3" /> Hover to Zoom
        </div>
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`relative w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                activeIdx === idx
                  ? 'border-emerald-600 ring-2 ring-emerald-500/30'
                  : 'border-stone-200 dark:border-stone-800 opacity-60 hover:opacity-100'
              }`}
            >
              <ProductImage
                src={img}
                alt={`${product.name} view ${idx + 1}`}
                className="w-full h-full"
                category={product.category}
                fallbackIcon={product.icon}
              />
            </button>
          ))}
        </div>
      )}
      </>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white rounded-full bg-white/10 transition"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="rounded-3xl overflow-hidden max-h-[85vh] w-full flex items-center justify-center bg-stone-900 shadow-2xl">
              <img
                src={activeSrc}
                alt={product.name}
                className="max-h-[80vh] max-w-full object-contain rounded-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
