import React from 'react';

export default function Card({
  children,
  className = '',
  clean = true,
  hover = true,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-3xl p-6 transition-all duration-200 ${
        clean
          ? 'bg-white dark:bg-[#0D1F18] border border-stone-200/90 dark:border-emerald-800/50 shadow-[0_4px_16px_-2px_rgba(11,59,44,0.05)]'
          : 'bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800'
      } ${hover ? 'hover:shadow-lg hover:-translate-y-0.5' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
