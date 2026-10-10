import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import EcoScorePopover from './EcoScorePopover';

export default function EcoScoreBadge({ product, scoreData, size = 'md', showPopoverButton = true }) {
  const [showPopover, setShowPopover] = useState(false);
  const data = scoreData || (product ? product.ecoScoreData : null);

  if (!data) return null;

  const { score, grade, colorTheme } = data;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3.5 py-1.5 font-semibold'
  };

  return (
    <div className="relative inline-flex items-center">
      <div
        className={`inline-flex items-center gap-1.5 rounded-full border font-medium transition-all ${colorTheme.badge} ${sizeClasses[size]}`}
      >
        <span className={`w-2 h-2 rounded-full ${colorTheme.dot} animate-pulse`} />
        <span>Grade {grade}</span>
        <span className="opacity-40">•</span>
        <span className="font-bold">{score}/100</span>

        {showPopoverButton && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowPopover(true);
            }}
            className="ml-1 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            title="How is this score calculated?"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {showPopover && (
        <EcoScorePopover
          product={product}
          scoreData={data}
          onClose={() => setShowPopover(false)}
        />
      )}
    </div>
  );
}
