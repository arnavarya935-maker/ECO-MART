import React, { useState, lazy, Suspense } from 'react';
import { Maximize2, X, ZoomIn, Box, Image as ImageIcon } from 'lucide-react';
import ProductImage from './ProductImage';

const Product3DViewer = lazy(() => import('./3D/Product3DViewer'));

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
        <div className="inline-flex p-1 rounded-2xl bg-surface-sunken border border-line">
          <button
            type="button"
            onClick={() => setViewMode('photo')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition min-h-[36px] cursor-pointer ${
              viewMode === 'photo'
                ? 'bg-surface-raised text-heading shadow-soft-sm'
                : 'text-secondary hover:text-heading'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-primary" />
            <span>Product Photos</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('3d')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition min-h-[36px] cursor-pointer ${
              viewMode === '3d'
                ? 'bg-surface-raised text-heading shadow-soft-sm'
                : 'text-secondary hover:text-heading'
            }`}
          >
            <Box className="w-3.5 h-3.5 text-primary" />
            <span>Interactive 3D Viewer</span>
          </button>
        </div>
      </div>

      {viewMode === '3d' ? (
        <Suspense
          fallback={
            <div className="h-72 sm:h-96 w-full rounded-3xl bg-surface-sunken border border-line flex flex-col items-center justify-center p-6 text-center">
              <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-2" />
              <span className="text-xs text-secondary font-medium">Loading 3D Visualizer...</span>
            </div>
          }
        >
          <Product3DViewer product={product} />
        </Suspense>
      ) : (
        <>
          {/* Main Showcase Image with Zoom */}
          <div
            className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden bg-surface-sunken border border-line cursor-crosshair group shadow-inner"
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
          className="absolute bottom-3 right-3 p-2.5 rounded-2xl bg-surface-raised/90 text-heading backdrop-blur-md shadow-soft-sm hover:scale-105 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          title="Open Fullscreen Lightbox"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Hover Hint */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-heading/80 text-text-inverted backdrop-blur-sm text-[10px] font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
              className={`relative w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                activeIdx === idx
                  ? 'border-primary ring-2 ring-primary/30'
                  : 'border-line opacity-70 hover:opacity-100'
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
          className="fixed inset-0 z-60 bg-heading/95 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute -top-12 right-0 p-2 text-text-inverted/80 hover:text-text-inverted rounded-full bg-surface-sunken/20 transition cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="rounded-3xl overflow-hidden max-h-[85vh] w-full flex items-center justify-center bg-surface-sunken shadow-soft-lg">
              <img
                src={activeSrc}
                alt={product.name}
                loading="lazy"
                decoding="async"
                width="800"
                height="800"
                className="max-h-[80vh] max-w-full object-contain rounded-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
