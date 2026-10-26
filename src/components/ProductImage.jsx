import React, { useState, useEffect, useRef } from 'react';
import { Eye } from 'lucide-react';

export default function ProductImage({
  src,
  alt = '',
  className = '',
  fallbackIcon = '🌿',
  category = 'General',
  enableZoom = false,
  onImageClick = null,
  priority = false
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const imgRef = useRef(null);

  useEffect(() => {
    setCurrentSrc(src);
    setError(false);
    setLoaded(false);
  }, [src]);

  // Check if image is already cached/complete on mount or src change
  useEffect(() => {
    if (imgRef.current && (imgRef.current.complete || imgRef.current.naturalWidth > 0)) {
      setLoaded(true);
    }
  }, [currentSrc]);

  const handleRef = (node) => {
    imgRef.current = node;
    if (node && (node.complete || node.naturalWidth > 0)) {
      setLoaded(true);
    }
  };

  const categoryBgs = {
    Kitchen: 'from-accent-subtle to-surface-sunken',
    'Personal Care': 'from-surface-accent to-surface-sunken',
    Fashion: 'from-surface-sunken to-surface-accent',
    Stationery: 'from-surface-accent to-surface-sunken',
    Home: 'from-accent-subtle to-surface-sunken',
    Bags: 'from-secondary-subtle to-surface-sunken',
    'Outdoor & Travel': 'from-surface-sunken to-surface',
    'Cleaning & Laundry': 'from-secondary-subtle to-surface-accent'
  };

  const bgGrad = categoryBgs[category] || 'from-surface-sunken to-surface-raised';

  const handleImageError = () => {
    if (currentSrc && currentSrc.endsWith('.jpg')) {
      // Try SVG fallback before erroring
      setCurrentSrc(currentSrc.replace(/\.jpg$/, '.svg'));
    } else {
      setError(true);
    }
  };

  return (
    <div
      onClick={onImageClick}
      className={`relative overflow-hidden bg-gradient-to-br ${bgGrad} flex items-center justify-center select-none ${
        className.includes('aspect-') ? '' : 'aspect-square'
      } ${onImageClick ? 'cursor-pointer group' : ''} ${className}`}
    >
      {/* Background placeholder while loading */}
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          <span className="text-3xl filter blur-xs">{fallbackIcon}</span>
        </div>
      )}

      {/* Main product image */}
      {!error && currentSrc ? (
        <img
          ref={handleRef}
          src={currentSrc}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          width="400"
          height="400"
          onLoad={() => setLoaded(true)}
          onError={handleImageError}
          className={`w-full h-full object-cover object-center transition-all duration-300 ${
            loaded ? 'opacity-100 scale-100' : 'opacity-90'
          } ${enableZoom ? 'group-hover:scale-105' : ''}`}
        />
      ) : null}

      {/* Graceful fallback icon if image fails completely */}
      {(error || !currentSrc) && (
        <div className="flex flex-col items-center justify-center p-4 text-center z-10">
          <span className="text-5xl transform transition-transform group-hover:scale-110">
            {fallbackIcon}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted mt-2">
            {category}
          </span>
        </div>
      )}

      {/* Hover zoom indicator overlay if enabled */}
      {onImageClick && (
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="p-2 rounded-full bg-surface-raised/90 text-heading shadow-md transform scale-90 group-hover:scale-100 transition-transform">
            <Eye className="w-4 h-4" />
          </span>
        </div>
      )}
    </div>
  );
}

