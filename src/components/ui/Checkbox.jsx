import React from 'react';
import { Check } from 'lucide-react';

export default function Checkbox({
  checked = false,
  onChange,
  label,
  id,
  disabled = false,
  className = '',
  description
}) {
  const checkboxId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <label
      htmlFor={checkboxId}
      className={`inline-flex items-start gap-3 cursor-pointer select-none py-1.5 min-h-[44px] items-center ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      <div className="relative flex items-center justify-center shrink-0">
        <input
          id={checkboxId}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange && onChange(e.target.checked)}
          className="peer sr-only"
        />
        <div
          className={`w-5 h-5 rounded-md border transition-all duration-150 flex items-center justify-center ${
            checked
              ? 'bg-primary border-primary text-surface-raised shadow-xs'
              : 'bg-surface-raised border-line hover:border-primary'
          } peer-focus-visible:ring-2 peer-focus-visible:ring-focus peer-focus-visible:ring-offset-2`}
        >
          {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </div>
      </div>

      {(label || description) && (
        <div className="text-left">
          {label && <div className="text-sm font-semibold text-heading leading-tight">{label}</div>}
          {description && <div className="text-xs text-muted mt-0.5">{description}</div>}
        </div>
      )}
    </label>
  );
}
