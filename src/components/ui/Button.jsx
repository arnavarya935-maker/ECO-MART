import React from 'react';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'emerald' | 'outline' | 'ghost' | 'danger'
  size = 'md',        // 'sm' | 'md' | 'lg' | 'icon'
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-bold tracking-tight rounded-xl transition-all duration-200 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none min-h-[44px]';

  const variants = {
    primary: 'btn-gradient-heading text-surface-raised shadow-soft-sm hover:shadow-lift transition-all',
    secondary: 'bg-surface-raised hover:bg-surface text-heading border border-line shadow-soft-sm hover:shadow-card hover:-translate-y-px transition-all active:bg-surface-sunken',
    emerald: 'btn-gradient-primary text-surface-raised shadow-soft-sm hover:shadow-lift transition-all',
    outline: 'bg-transparent hover:bg-surface-accent text-primary border border-line hover:border-primary active:bg-surface-sunken hover:-translate-y-px transition-all',
    ghost: 'bg-transparent hover:bg-surface-accent text-heading active:bg-surface-sunken',
    danger: 'bg-danger hover:bg-danger/90 text-surface-raised shadow-soft-sm active:bg-danger/80'
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-2 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3 gap-2.5',
    icon: 'p-2.5 w-11 h-11'
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin shrink-0" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
}
