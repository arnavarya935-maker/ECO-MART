import React from 'react';

export default function ProgressRing({
  value = 0,
  max = 100,
  size = 56,
  strokeWidth = 5,
  color = 'var(--color-primary)',
  trackColor = 'var(--color-line)',
  label,
  sublabel,
  className = ''
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedValue = Math.min(Math.max(value, 0), max);
  const strokeDashoffset = circumference - (clampedValue / max) * circumference;

  return (
    <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-500 ease-out"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {label ? (
          <span className="text-xs font-black text-heading leading-none">{label}</span>
        ) : (
          <span className="text-xs font-black text-heading leading-none">{Math.round(clampedValue)}</span>
        )}
        {sublabel && (
          <span className="text-[9px] text-muted font-bold uppercase mt-0.5">{sublabel}</span>
        )}
      </div>
    </div>
  );
}
