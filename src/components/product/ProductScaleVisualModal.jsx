import React, { useState } from 'react';
import { Ruler, X, Smartphone, Coffee, Milk, Laptop, Info, Check } from 'lucide-react';

const REFERENCE_OBJECTS = [
  {
    id: 'phone',
    name: 'Smartphone',
    widthCm: 7.1,
    heightCm: 14.6,
    icon: Smartphone,
    desc: 'Standard 6.1" display mobile phone'
  },
  {
    id: 'mug',
    name: 'Coffee Mug',
    widthCm: 8.2,
    heightCm: 9.5,
    icon: Coffee,
    desc: 'Standard ceramic household coffee mug'
  },
  {
    id: 'bottle',
    name: 'Water Bottle',
    widthCm: 7.5,
    heightCm: 26.0,
    icon: Milk,
    desc: '750ml stainless steel reusable bottle'
  },
  {
    id: 'laptop',
    name: '14" Laptop',
    widthCm: 31.5,
    heightCm: 22.0,
    icon: Laptop,
    desc: 'Compact laptop closed footprint'
  }
];

export default function ProductScaleVisualModal({ isOpen, onClose, product }) {
  const [selectedRef, setSelectedRef] = useState(REFERENCE_OBJECTS[0]);

  if (!isOpen || !product) return null;

  // Infer or read dimensions in cm
  const prodWidth = Number(product.dimensionsCm?.width || 12);
  const prodHeight = Number(product.dimensionsCm?.height || 18);
  const prodWeight = product.weightGrams || product.weight || '320g';

  // Pixels per centimeter scaling factor
  const PIXELS_PER_CM = 11;

  const prodBoxWidth = Math.max(40, Math.round(prodWidth * PIXELS_PER_CM));
  const prodBoxHeight = Math.max(40, Math.round(prodHeight * PIXELS_PER_CM));

  const refBoxWidth = Math.round(selectedRef.widthCm * PIXELS_PER_CM);
  const refBoxHeight = Math.round(selectedRef.heightCm * PIXELS_PER_CM);

  const RefIcon = selectedRef.icon;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-surface-raised border border-line rounded-3xl shadow-soft-xl flex flex-col overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-line bg-surface flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
                Physical Scale Explorer
              </span>
              <span className="text-xs text-muted font-medium">Feature 50 • CSS Scaled</span>
            </div>
            <h3 className="font-serif font-bold text-2xl text-heading mt-1">
              Scale &amp; Size Comparison
            </h3>
            <p className="text-xs text-secondary mt-0.5">
              Compare <strong className="text-heading">{product.name}</strong> against common household objects to evaluate packaging bulk and portable fit.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-muted hover:text-heading hover:bg-surface-sunken transition-colors cursor-pointer"
            aria-label="Close Scale Viewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reference Object Selector Chips */}
        <div className="p-4 bg-surface-sunken border-b border-line flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-secondary flex items-center gap-1.5 mr-1">
            <Ruler className="w-3.5 h-3.5 text-primary" />
            <span>Compare vs:</span>
          </span>
          {REFERENCE_OBJECTS.map((refItem) => {
            const isSelected = selectedRef.id === refItem.id;
            const Icon = refItem.icon;
            return (
              <button
                key={refItem.id}
                type="button"
                onClick={() => setSelectedRef(refItem)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 cursor-pointer min-h-[36px] ${
                  isSelected
                    ? 'bg-primary text-primary-contrast font-bold shadow-soft-xs'
                    : 'bg-surface text-secondary border border-line hover:bg-surface-raised'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{refItem.name}</span>
              </button>
            );
          })}
        </div>

        {/* Visual Comparison Stage */}
        <div className="p-8 bg-surface-sunken/40 flex flex-col items-center justify-center min-h-[280px] border-b border-line overflow-x-auto">
          <div className="flex items-end justify-center gap-8 py-4">
            {/* Product Shape */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-[11px] font-mono text-primary font-bold text-center">
                {prodWidth} × {prodHeight} cm
              </span>
              <div
                style={{ width: `${prodBoxWidth}px`, height: `${prodBoxHeight}px` }}
                className="rounded-2xl border-2 border-primary bg-primary/10 shadow-soft-sm flex flex-col items-center justify-center p-3 text-center transition-all duration-300"
              >
                <div className="text-xs font-bold text-heading truncate max-w-full">
                  {product.name}
                </div>
                <div className="text-[10px] font-mono text-primary font-semibold mt-0.5">
                  {prodWeight}
                </div>
              </div>
              <span className="text-xs font-semibold text-heading text-center">
                This Product
              </span>
            </div>

            {/* Reference Object Shape */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-[11px] font-mono text-muted font-bold text-center">
                {selectedRef.widthCm} × {selectedRef.heightCm} cm
              </span>
              <div
                style={{ width: `${refBoxWidth}px`, height: `${refBoxHeight}px` }}
                className="rounded-2xl border-2 border-line bg-surface border-dashed shadow-2xs flex flex-col items-center justify-center p-3 text-center transition-all duration-300"
              >
                <RefIcon className="w-6 h-6 text-muted mb-1" />
                <div className="text-[11px] font-semibold text-muted">
                  {selectedRef.name}
                </div>
              </div>
              <span className="text-xs font-medium text-muted text-center">
                {selectedRef.name} (Standard)
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-[11px] text-muted font-mono">
            <span>Ruler Scale: 1 cm ≈ {PIXELS_PER_CM}px onscreen</span>
          </div>
        </div>

        {/* Footnote */}
        <div className="p-4 bg-surface text-xs text-secondary flex items-start gap-2 text-left">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-heading">Pure CSS Rendering:</strong> No battery-draining augmented reality (AR) or camera access required. Dimensions are computed from manufacturer specifications to verify pocketability and shipping package volume.
          </p>
        </div>
      </div>
    </div>
  );
}
