import React from 'react';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon,
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-extrabold rounded-2xl transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none';

  const variants = {
    primary: 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-md shadow-emerald-900/15',
    secondary: 'bg-stone-100 hover:bg-stone-200 text-stone-900 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-100 border border-stone-200 dark:border-stone-700',
    outline: 'bg-white hover:bg-emerald-50/50 text-[#0B3B2C] border-2 border-emerald-600/30 hover:border-emerald-600 dark:bg-[#0D1F18] dark:text-stone-100 dark:border-emerald-700',
    ghost: 'bg-transparent hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-900/15'
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-xl',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3.5 gap-2.5 rounded-2xl'
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children}
    </button>
  );
}
