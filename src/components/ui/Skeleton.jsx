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
    text: 'rounded-md'
  };

  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-line/70 ${variants[variant] || variants.rect} ${width} ${height} ${className}`}
    />
  );
}
