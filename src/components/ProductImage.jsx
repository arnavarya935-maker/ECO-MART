import React, { useState } from 'react';
import { Eye, ImageOff } from 'lucide-react';

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

  const categoryBgs = {
    Kitchen: 'from-amber-100 to-orange-50 dark:from-amber-950/40 dark:to-stone-900',
    'Personal Care': 'from-emerald-100 to-teal-50 dark:from-emerald-950/40 dark:to-stone-900',
    Fashion: 'from-stone-200 to-amber-50 dark:from-stone-850 dark:to-stone-900',
    Stationery: 'from-lime-100 to-emerald-50 dark:from-lime-950/40 dark:to-stone-900',
    Home: 'from-orange-100 to-yellow-50 dark:from-orange-950/40 dark:to-stone-900',
    Bags: 'from-teal-100 to-stone-100 dark:from-teal-950/40 dark:to-stone-900',
    'Outdoor & Travel': 'from-slate-200 to-stone-100 dark:from-slate-900 dark:to-stone-900',
    'Cleaning & Laundry': 'from-sky-100 to-teal-50 dark:from-sky-950/40 dark:to-stone-900'
  };

  const bgGrad = categoryBgs[category] || 'from-stone-100 to-white dark:from-stone-800 dark:to-stone-900';

  return (
    <div
      onClick={onImageClick}
      className={`relative overflow-hidden bg-gradient-to-br ${bgGrad} flex items-center justify-center select-none ${
        onImageClick ? 'cursor-pointer group' : ''
      } ${className}`}
    >
      {/* Blur-up placeholder pulse while loading */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-stone-200/60 dark:bg-stone-800/60 backdrop-blur-md animate-pulse flex items-center justify-center">
          <span className="text-4xl filter blur-xs opacity-60">{fallbackIcon}</span>
        </div>
      )}

      {/* Main product image */}
      {!error && src ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover object-center transition-all duration-500 ${
            loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          } ${enableZoom ? 'group-hover:scale-108' : ''}`}
        />
      ) : null}

      {/* Graceful fallback icon if offline or image fails */}
      {(error || !src) && (
        <div className="flex flex-col items-center justify-center p-4 text-center z-10">
          <span className="text-5xl transform transition-transform group-hover:scale-115">
            {fallbackIcon}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mt-2">
            {category}
          </span>
        </div>
      )}

      {/* Hover zoom indicator overlay if enabled */}
      {onImageClick && (
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="p-2 rounded-full bg-white/90 dark:bg-stone-900/90 text-stone-800 dark:text-stone-100 shadow-md transform scale-90 group-hover:scale-100 transition-transform">
            <Eye className="w-4 h-4" />
          </span>
        </div>
      )}
    </div>
  );
}
