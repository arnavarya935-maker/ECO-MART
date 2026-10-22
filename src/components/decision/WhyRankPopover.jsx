import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Award } from 'lucide-react';
import ProgressBar from '../ui/ProgressBar';

export default function WhyRankPopover({ rankingDetails }) {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  if (!rankingDetails) return null;

  const { rank, finalScore, contributions, topReasons, explanation } = rankingDetails;

  const criteriaLabels = [
    { key: 'plastic', label: 'Plastic Minimization', color: 'bg-warning' },
    { key: 'price', label: 'Affordability', color: 'bg-primary' },
    { key: 'carbon', label: 'Carbon Reduction', color: 'bg-primary' },
    { key: 'local', label: 'Local Sourcing', color: 'bg-blue-600' },
    { key: 'water', label: 'Water Conservation', color: 'bg-cyan-600' },
    { key: 'certs', label: 'Certifications', color: 'bg-purple-600' },
    { key: 'ecoScore', label: 'EcoScore Baseline', color: 'bg-primary' }
  ];

  return (
    <div className="relative inline-block" ref={popoverRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold bg-surface-accent text-primary border border-primary/25 hover:bg-primary/10 transition-colors cursor-pointer shadow-soft-xs"
        title="View multi-criteria decision breakdown for this product"
        aria-expanded={open}
      >
        <Sparkles className="w-2.5 h-2.5 text-primary" />
        <span>#{rank} • Why this rank?</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Why this product ranked here"
          onClick={(e) => e.stopPropagation()}
          className="absolute left-0 bottom-full mb-2 w-72 sm:w-80 bg-surface-raised border border-line rounded-2xl shadow-soft-xl p-4 z-50 text-text animate-fade-in"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-line">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                #{rank}
              </div>
              <div>
                <h4 className="font-serif text-xs font-bold text-heading leading-tight">
                  Decision Engine Match
                </h4>
                <div className="text-[10px] font-sans text-muted">
                  Overall Score: <strong className="text-primary font-bold">{finalScore} / 100</strong>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1 rounded-lg hover:bg-surface-sunken text-muted hover:text-heading cursor-pointer transition-colors"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Explanation */}
          <div className="py-2.5">
            <div className="text-[10px] font-sans uppercase font-bold text-muted tracking-wider mb-1">
              Top Decision Factors
            </div>
            <div className="p-2 rounded-xl bg-surface border border-line text-xs font-sans text-heading space-y-1">
              {topReasons && topReasons.length > 0 ? (
                topReasons.map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-[11px] font-medium">
                    <Award className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </div>
                ))
              ) : (
                <p className="text-[11px] text-muted">{explanation}</p>
              )}
            </div>
          </div>

          {/* Contribution breakdown bars */}
          <div className="space-y-2 pt-1 border-t border-line/60">
            <div className="text-[10px] font-sans uppercase font-bold text-muted tracking-wider">
              Score Contribution by Criterion
            </div>
            {criteriaLabels.map((item) => {
              const val = contributions?.[item.key] ?? 0;
              return (
                <div key={item.key} className="space-y-0.5">
                  <div className="flex justify-between text-[10px] font-sans">
                    <span className="text-secondary font-medium">{item.label}</span>
                    <span className="font-bold text-heading">+{val} pts</span>
                  </div>
                  <ProgressBar
                    value={val}
                    max={30}
                    height="h-1.5"
                    color={item.color}
                  />
                </div>
              );
            })}
          </div>

          <div className="mt-3 pt-2 border-t border-line text-[9px] font-sans text-muted flex items-center justify-between">
            <span>Normalized using live catalog min-max</span>
            <span className="text-primary font-semibold">100% Offline AI</span>
          </div>
        </div>
      )}
    </div>
  );
}
