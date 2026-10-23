import React from 'react';
import { X } from 'lucide-react';

export default function Chip({
  children,
  active = false,
  onClick,
  onRemove,
  icon: Icon,
  className = ''
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all duration-150 select-none min-h-[36px] sm:min-h-[40px] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
        active
          ? 'bg-primary text-primary-contrast shadow-soft-sm hover:bg-primary-hover'
          : 'bg-surface-raised text-text border border-line hover:bg-surface-sunken hover:border-line'
      } ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{children}</span>
      {onRemove && (
        <span
          role="button"
          tabIndex={0}
          aria-label="Remove filter"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 p-0.5 rounded-full hover:bg-black/10 transition-colors"
        >
          <X className="w-3 h-3" />
        </span>
      )}
    </button>
  );
}
