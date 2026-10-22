import React from 'react';

export default function Badge({
  children,
  variant = 'emerald', // 'forest' | 'emerald' | 'teal' | 'amber' | 'neutral' | 'danger'
  size = 'md',        // 'sm' | 'md' | 'lg'
  className = '',
  icon: Icon
}) {
  const variants = {
    forest: 'bg-surface-accent text-heading border-line',
    emerald: 'bg-success-subtle text-primary border-primary/20',
    teal: 'bg-info-subtle text-secondary border-secondary/20',
    amber: 'bg-warning-subtle text-warning border-warning/20',
    neutral: 'bg-surface-sunken text-text border-line',
    danger: 'bg-danger-subtle text-danger border-danger/30'
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 font-bold',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 font-bold'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border tracking-tight select-none ${
        variants[variant] || variants.emerald
      } ${sizes[size] || sizes.md} ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}
