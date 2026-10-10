import React from 'react';

export default function Badge({
  children,
  variant = 'emerald', // 'emerald' | 'amber' | 'rose' | 'sky' | 'teal' | 'neutral'
  size = 'md',
  className = '',
  icon: Icon
}) {
  const variants = {
    emerald: 'bg-emerald-100 text-emerald-900 border-emerald-300/50 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700/60',
    amber: 'bg-amber-100 text-amber-900 border-amber-300/50 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-700/60',
    rose: 'bg-rose-100 text-rose-900 border-rose-300/50 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-700/60',
    sky: 'bg-sky-100 text-sky-900 border-sky-300/50 dark:bg-sky-950/80 dark:text-sky-300 dark:border-sky-700/60',
    teal: 'bg-teal-100 text-teal-900 border-teal-300/50 dark:bg-teal-950/80 dark:text-teal-300 dark:border-teal-700/60',
    neutral: 'bg-stone-100 text-stone-800 border-stone-200 dark:bg-stone-800 dark:text-stone-200 dark:border-stone-700'
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 font-bold',
    md: 'text-xs px-2.5 py-1 font-extrabold',
    lg: 'text-sm px-3.5 py-1.5 font-black'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border tracking-wide select-none ${
        variants[variant] || variants.emerald
      } ${sizes[size] || sizes.md} ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      {children}
    </span>
  );
}
