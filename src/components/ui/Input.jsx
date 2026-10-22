import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function Input({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  icon: Icon,
  className = '',
  disabled = false,
  required = false,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-secondary tracking-wider uppercase"
        >
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-muted pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`w-full min-h-[44px] px-3.5 ${Icon ? 'pl-10' : ''} py-2.5 rounded-xl border bg-surface-raised text-sm text-text placeholder:text-muted transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary disabled:bg-surface-sunken disabled:opacity-60 disabled:cursor-not-allowed ${
            error
              ? 'border-danger focus:ring-danger/20 focus:border-danger'
              : 'border-line hover:border-line'
          }`}
          {...props}
        />
      </div>

      {error ? (
        <p className="flex items-center gap-1.5 text-xs text-danger font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="text-xs text-muted">{helperText}</p>
      ) : null}
    </div>
  );
}
