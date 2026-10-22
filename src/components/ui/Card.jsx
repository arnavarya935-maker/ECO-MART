import React from 'react';

export default function Card({
  children,
  className = '',
  padding = 'md', // 'none' | 'sm' | 'md' | 'lg'
  hover = false,
  onClick,
  clean = false,
  ...props
}) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div
      onClick={onClick}
      className={`${clean ? '' : 'bg-surface-raised border border-line shadow-soft-sm'} rounded-2xl transition-all duration-200 ${
        hover ? 'hover:shadow-soft-md hover:border-heading/20 hover:-translate-y-0.5 cursor-pointer' : ''
      } ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
