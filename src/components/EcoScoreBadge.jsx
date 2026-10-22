import React, { useState } from 'react';
import EcoScorePopover from './EcoScorePopover';

export default function EcoScoreBadge({
  product,
  scoreData,
  score: rawScore,
  grade: rawGrade,
  size = 'md',
  showPopoverButton = false,
  variant = 'ring',
  onClick = null
}) {
  const [showPopover, setShowPopover] = useState(false);
  const data = scoreData || (product ? product.ecoScoreData : null);

  const score = rawScore !== undefined ? rawScore : data?.score || 90;
  const grade = rawGrade || data?.grade || 'A';

  // Ring colors based on grade (A deep green, B light green/teal, C amber, D orange, E/F red)
  const gradeColors = {
    A: { stroke: 'var(--color-primary)', bg: 'var(--color-primary-subtle)', text: 'var(--color-heading)' },
    B: { stroke: 'var(--color-secondary)', bg: 'var(--color-secondary-subtle)', text: 'var(--color-heading)' },
    C: { stroke: 'var(--color-accent)', bg: 'var(--color-accent-subtle)', text: 'var(--color-heading)' },
    D: { stroke: 'var(--color-warning)', bg: 'var(--color-warning-subtle)', text: 'var(--color-heading)' },
    E: { stroke: 'var(--color-danger)', bg: 'var(--color-danger-subtle)', text: 'var(--color-danger)' },
    F: { stroke: 'var(--color-danger)', bg: 'var(--color-danger-subtle)', text: 'var(--color-danger)' }
  };

  const currentTheme = gradeColors[grade] || gradeColors.A;

  // Circular ring dimensions
  const dimensions = {
    sm: { size: 36, stroke: 3, radius: 14, fontSize: 'text-[11px]' },
    md: { size: 44, stroke: 3.5, radius: 17, fontSize: 'text-xs' },
    lg: { size: 54, stroke: 4, radius: 21, fontSize: 'text-sm' }
  };

  const dim = dimensions[size] || dimensions.md;
  const circumference = 2 * Math.PI * dim.radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const handleClick = (e) => {
    if (onClick) {
      e.stopPropagation();
      onClick();
    } else if (showPopoverButton) {
      e.stopPropagation();
      setShowPopover(true);
    }
  };

  if (variant === 'pill') {
    return (
      <div className="relative inline-flex items-center">
        <div
          onClick={handleClick}
          role="status"
          aria-label={`Eco-Score ${score} out of 100, Grade ${grade}`}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-line bg-surface-raised shadow-soft-sm text-xs font-bold cursor-pointer"
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: currentTheme.stroke }}
          />
          <span style={{ color: currentTheme.text }}>Grade {grade}</span>
          <span className="text-muted">•</span>
          <span className="text-text">{score}/100</span>
        </div>
      </div>
    );
  }

  // Clear Colored Ring Layout (Feature 12)
  return (
    <div className="relative inline-flex items-center">
      <div
        onClick={handleClick}
        role="status"
        aria-label={`Eco-Score ${score} out of 100, Grade ${grade}`}
        title={`Eco-Score ${score}/100 (Grade ${grade})`}
        className="relative flex items-center justify-center cursor-pointer select-none group"
        style={{ width: dim.size, height: dim.size }}
      >
        <svg
          width={dim.size}
          height={dim.size}
          className="transform -rotate-90"
        >
          {/* Background track circle */}
          <circle
            cx={dim.size / 2}
            cy={dim.size / 2}
            r={dim.radius}
            fill={currentTheme.bg}
            stroke="var(--color-line)"
            strokeWidth={dim.stroke}
          />
          {/* Colored progress ring */}
          <circle
            cx={dim.size / 2}
            cy={dim.size / 2}
            r={dim.radius}
            fill="transparent"
            stroke={currentTheme.stroke}
            strokeWidth={dim.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Centered Grade Label */}
        <div
          className={`absolute font-black ${dim.fontSize} leading-none flex flex-col items-center justify-center`}
          style={{ color: currentTheme.text }}
        >
          <span>{grade}</span>
        </div>
      </div>

      {showPopover && data && (
        <EcoScorePopover
          product={product}
          scoreData={data}
          onClose={() => setShowPopover(false)}
        />
      )}
    </div>
  );
}
