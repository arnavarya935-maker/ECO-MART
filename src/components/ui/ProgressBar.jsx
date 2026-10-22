import React from 'react';

export default function ProgressBar({
  value = 0,
  max = 100,
  label,
  valueText,
  color = 'bg-primary',
  height = 'h-2',
  className = '',
  showPercentage = false
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`space-y-1.5 ${className}`}>
      {(label || valueText || showPercentage) && (
        <div className="flex items-center justify-between text-xs font-semibold text-heading select-none">
          {label && <span>{label}</span>}
          {valueText ? (
            <span className="text-primary font-bold">{valueText}</span>
          ) : showPercentage ? (
            <span className="text-muted">{Math.round(percentage)}%</span>
          ) : null}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={`w-full ${height} bg-line rounded-full overflow-hidden`}
      >
        <div
          style={{ width: `${percentage}%` }}
          className={`h-full ${color} rounded-full transition-all duration-500 ease-out`}
        />
      </div>
    </div>
  );
}
