import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, ShieldCheck } from 'lucide-react';
import { findGlossaryTerm } from '../../lib/glossary';

export default function GlossaryTooltip({ term, children }) {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef(null);
  const triggerRef = useRef(null);

  const termData = findGlossaryTerm(term);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  if (!termData) {
    return <span>{children || term}</span>;
  }

  return (
    <span className="relative inline-flex items-baseline group">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 border-b border-dotted border-primary/60 text-heading font-medium hover:text-primary transition-colors cursor-pointer select-none text-left"
        aria-label={`Definition of ${termData.term}`}
        aria-expanded={open}
      >
        <span>{children || termData.term}</span>
        <HelpCircle className="w-3 h-3 text-primary/70 inline shrink-0" />
      </button>

      {open && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-label={`Glossary: ${termData.term}`}
          className="absolute bottom-full left-0 mb-2 w-72 sm:w-80 p-4 rounded-2xl bg-surface-raised border border-line shadow-soft-lg z-50 animate-fade-in text-left text-text"
        >
          <div className="flex items-start justify-between gap-2 border-b border-line pb-2 mb-2">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                {termData.category}
              </span>
              <h4 className="font-serif font-bold text-sm text-heading mt-1">
                {termData.term}
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-muted hover:text-heading text-xs p-1"
              aria-label="Close glossary popover"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-secondary leading-relaxed font-sans mb-2.5">
            {termData.fullDef}
          </p>

          <div className="p-2.5 rounded-xl bg-surface-sunken border border-line text-[11px] text-muted space-y-1">
            <div className="flex items-center gap-1 font-semibold text-heading">
              <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>Scientific Standard: {termData.source}</span>
            </div>
            <p className="text-[10px] text-secondary leading-tight">
              {termData.registryTip}
            </p>
          </div>
        </div>
      )}
    </span>
  );
}
