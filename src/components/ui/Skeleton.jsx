import React from 'react';

export default function Skeleton({
  variant = 'rect', // 'rect' | 'circle' | 'text'
  width = 'w-full',
  height = 'h-4',
  className = ''
}) {
  const variants = {
    rect: 'rounded-2xl',
    circle: 'rounded-full',
    text: 'rounded-lg'
  };

  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-stone-200/80 dark:bg-stone-800 ${variants[variant] || variants.rect} ${width} ${height} ${className}`}
    />
  );
}
