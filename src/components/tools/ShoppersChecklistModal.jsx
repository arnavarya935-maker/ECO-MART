import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  Printer,
  X,
  RotateCcw
} from 'lucide-react';

const DEFAULT_CHECKLIST = [
  {
    id: 'need',
    question: 'Need Assessment',
    prompt: 'Do I already own something that fulfills this exact function or can be borrowed/repaired?',
    category: 'Consumption Reduction'
  },
  {
    id: 'materials',
    question: 'Material Feedstock',
    prompt: 'Is this made from certified organic, renewable, or post-consumer recycled (PCR) feedstock rather than virgin petrochemicals?',
    category: 'Material Purity'
  },
  {
    id: 'packaging',
    question: 'Packaging Elimination',
    prompt: 'Is the packaging plastic-free (kraft paperboard, metal tin, or home compostable) without bubble wrap?',
    category: 'Packaging'
  },
  {
    id: 'repair',
    question: 'Durability & Repairability',
    prompt: 'Can this item be disassembled, patched, resoled, or repaired if an individual component wears out?',
    category: 'Circularity'
  },
  {
    id: 'claims',
    question: 'Certification Check',
    prompt: 'Does the product state specific accredited certification numbers (GOTS, FSC, OEKO-TEX) that can be checked on issuer websites?',
    category: 'Transparency'
  },
  {
    id: 'endoflife',
    question: 'End-of-Life Pathway',
    prompt: 'What happens when this product wears out? Can it be composted at home or collected by municipal recycling?',
    category: 'Disposal'
  }
];

export default function ShoppersChecklistModal({ isOpen, onClose }) {
  const [checkedItems, setCheckedItems] = useState({});
  const [productName, setProductName] = useState('');

  if (!isOpen) return null;

  const toggleCheck = (id) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const scorePercent = Math.round((checkedCount / DEFAULT_CHECKLIST.length) * 100);

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setCheckedItems({});
    setProductName('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-surface-raised border border-line rounded-3xl shadow-soft-xl flex flex-col max-h-[90vh] overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-line bg-surface flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
                Pre-Purchase Audit
              </span>
              <span className="text-xs text-muted font-medium">Feature 48</span>
            </div>
            <h3 className="font-serif font-bold text-2xl text-heading mt-1">
              Conscious Shopper's Pre-Purchase Checklist
            </h3>
            <p className="text-xs text-secondary mt-0.5">
              Run this 6-point audit before buying any new item to prevent buyer's remorse and unnecessary waste.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-muted hover:text-heading hover:bg-surface-sunken transition-colors cursor-pointer"
            aria-label="Close Checklist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audit Score Bar */}
        <div className="px-6 py-3.5 bg-surface-sunken border-b border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
              {checkedCount}/{DEFAULT_CHECKLIST.length}
            </div>
            <div>
              <div className="font-bold text-xs text-heading">
                Audit Score: {scorePercent}% Conscious Alignment
              </div>
              <div className="text-[11px] text-muted">
                {scorePercent === 100
                  ? '✓ Exceptional! Passes all 6 circular criteria.'
                  : scorePercent >= 65
                  ? 'Good alignment. Review unanswered criteria before buying.'
                  : 'Consider pausing purchase or finding an existing alternative.'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="p-2 rounded-xl bg-surface hover:bg-surface-raised border border-line text-secondary hover:text-heading text-xs transition cursor-pointer"
              title="Reset Checklist"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast font-semibold text-xs transition shadow-soft-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Product Name Input */}
        <div className="px-6 pt-4 pb-1">
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Enter target product name (e.g. Organic Cotton Kitchen Towel)..."
            className="w-full px-4 py-2.5 rounded-xl bg-surface border border-line text-xs font-medium text-heading placeholder:text-muted focus:outline-2 focus:outline-focus"
          />
        </div>

        {/* Checklist Items */}
        <div className="p-6 space-y-3 overflow-y-auto">
          {DEFAULT_CHECKLIST.map((item, idx) => {
            const isChecked = Boolean(checkedItems[item.id]);
            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 text-left ${
                  isChecked
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-surface border-line hover:bg-surface-sunken/60'
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 text-primary shrink-0 cursor-pointer"
                  aria-label={isChecked ? `Uncheck ${item.question}` : `Check ${item.question}`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Square className="w-5 h-5 text-muted" />
                  )}
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-muted">0{idx + 1}.</span>
                    <span className="font-serif font-bold text-sm text-heading">
                      {item.question}
                    </span>
                    <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-surface-sunken border border-line text-secondary">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-secondary leading-relaxed font-sans">
                    {item.prompt}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-surface border-t border-line flex items-center justify-between text-[11px] text-muted">
          <span>Printed copies format seamlessly via browser print preview.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-surface-sunken hover:bg-surface border border-line text-xs font-semibold text-heading cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
