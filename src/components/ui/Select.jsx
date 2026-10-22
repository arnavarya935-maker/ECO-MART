import React from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

export default function Select({
  label,
  id,
  options = [],
  value,
  onChange,
  error,
  helperText,
  className = '',
  disabled = false,
  placeholder = 'Select an option',
  ...props
}) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-bold text-heading tracking-tight uppercase"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full min-h-[44px] appearance-none px-3.5 pr-10 py-2.5 rounded-xl border bg-surface-raised text-sm text-text transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary disabled:bg-surface-sunken disabled:opacity-60 cursor-pointer ${
            error
              ? 'border-danger focus:ring-danger/20 focus:border-danger'
              : 'border-line hover:border-line'
          }`}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const text = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={val} value={val}>
                {text}
              </option>
            );
          })}
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error ? (
        <p className="flex items-center gap-1.5 text-xs text-danger font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="text-xs text-secondary">{helperText}</p>
      ) : null}
    </div>
  );
}
