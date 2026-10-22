import React from 'react';

export default function SegmentedControl({
  options = [], // [{ value: 'a', label: 'Option A' }] or ['a', 'b']
  value,
  onChange,
  className = ''
}) {
  return (
    <div
      role="radiogroup"
      className={`inline-flex items-center p-1 rounded-xl bg-surface-sunken border border-line select-none ${className}`}
    >
      {options.map((opt) => {
        const val = typeof opt === 'object' ? opt.value : opt;
        const label = typeof opt === 'object' ? opt.label : opt;
        const Icon = typeof opt === 'object' ? opt.icon : null;
        const isSelected = value === val;

        return (
          <button
            key={val}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(val)}
            className={`flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer min-h-[36px] ${
              isSelected
                ? 'bg-surface-raised text-heading shadow-soft-sm'
                : 'text-secondary hover:text-heading'
            }`}
          >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
