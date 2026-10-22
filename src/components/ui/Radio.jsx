import React from 'react';

export default function Radio({
  checked = false,
  onChange,
  label,
  name,
  value,
  id,
  disabled = false,
  className = '',
  description
}) {
  const radioId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <label
      htmlFor={radioId}
      className={`inline-flex items-start gap-3 cursor-pointer select-none py-1.5 min-h-[44px] items-center ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      <div className="relative flex items-center justify-center shrink-0">
        <input
          id={radioId}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange && onChange(e.target.value)}
          className="peer sr-only"
        />
        <div
          className={`w-5 h-5 rounded-full border transition-all duration-150 flex items-center justify-center ${
            checked
              ? 'border-primary bg-surface-raised'
              : 'border-line bg-surface-raised hover:border-primary'
          } peer-focus-visible:ring-2 peer-focus-visible:ring-focus peer-focus-visible:ring-offset-2`}
        >
          {checked && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
        </div>
      </div>

      {(label || description) && (
        <div className="text-left">
          {label && <div className="text-sm font-semibold text-heading leading-tight">{label}</div>}
          {description && <div className="text-xs text-secondary mt-0.5">{description}</div>}
        </div>
      )}
    </label>
  );
}
