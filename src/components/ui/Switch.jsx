import React from 'react';

export default function Switch({
  checked = false,
  onChange,
  label,
  description,
  id,
  disabled = false,
  className = ''
}) {
  const switchId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex items-center justify-between gap-4 py-1.5 min-h-[44px] ${className}`}>
      {(label || description) && (
        <label htmlFor={switchId} className="cursor-pointer select-none">
          {label && <div className="text-sm font-bold text-heading">{label}</div>}
          {description && <div className="text-xs text-secondary mt-0.5">{description}</div>}
        </label>
      )}

      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange && onChange(!checked)}
        className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
          checked ? 'bg-primary' : 'bg-line'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-surface-raised shadow-md ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
