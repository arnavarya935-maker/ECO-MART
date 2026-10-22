import React from 'react';

export default function Slider({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  label,
  valueDisplay,
  className = '',
  id
}) {
  const sliderId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`space-y-2 ${className}`}>
      {(label || valueDisplay) && (
        <div className="flex items-center justify-between text-xs font-bold text-heading select-none">
          {label && <label htmlFor={sliderId}>{label}</label>}
          {valueDisplay && <span className="text-primary font-black">{valueDisplay}</span>}
        </div>
      )}

      <div className="relative flex items-center min-h-[44px]">
        <input
          id={sliderId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange && onChange(Number(e.target.value))}
          style={{
            background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${percentage}%, var(--color-line) ${percentage}%, var(--color-line) 100%)`
          }}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        />
      </div>
    </div>
  );
}
