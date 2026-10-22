import React, { useState, useRef } from 'react';
import { MoveHorizontal, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function BeforeAfterSlider() {
  const [sliderPos, setSliderPos] = useState(50);
  const isDragging = useRef(false);

  const handleMove = (clientX, rect) => {
    const x = clientX - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pos);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.clientX, rect);
  };

  const handleTouchMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.touches[0].clientX, rect);
  };

  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary-subtle border border-primary/20 px-3.5 py-1 rounded-full shadow-soft-sm">
          Visual Lifestyle Audit
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-heading mt-2.5">
          Before & After: The Zero-Waste Transition
        </h2>
        <p className="text-xs sm:text-sm text-secondary mt-1 max-w-md mx-auto leading-relaxed">
          Drag the slider horizontally to reveal how swapping 5 everyday essentials transforms your living space.
        </p>
      </div>

      <div
        className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden border border-line shadow-soft-lg select-none cursor-ew-resize"
        onMouseDown={() => (isDragging.current = true)}
        onMouseUp={() => (isDragging.current = false)}
        onMouseLeave={() => (isDragging.current = false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* RIGHT SIDE: AFTER (Zero Waste Sanctuary) */}
        <div className="absolute inset-0 bg-gradient-to-br from-surface-accent via-surface to-surface-raised p-8 flex flex-col justify-between">
          <div className="flex justify-end">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-text-inverted text-xs font-bold shadow-soft-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-text-inverted" />
              AFTER: EcoMart Circular Sanctuary
            </span>
          </div>

          <div className="max-w-xs ml-auto text-right space-y-2">
            <div className="text-4xl">🌿🎋🫙</div>
            <h4 className="text-lg font-serif font-bold text-heading">
              Clean, Organic, Non-Toxic
            </h4>
            <p className="text-xs text-text leading-relaxed font-normal">
              Glass pantry jars, bamboo brushes, beeswax food covers, solid organic bars, and zero landfill plastic.
            </p>
            <div className="text-xs font-semibold text-primary">
              🌱 100% Biodegradable & Compostable
            </div>
          </div>
        </div>

        {/* LEFT SIDE: BEFORE (Petrochemical Conventional Clutter) */}
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-br from-danger-subtle via-surface-sunken to-surface p-8 flex flex-col justify-between overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <div className="flex justify-start min-w-[280px]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-danger text-text-inverted text-xs font-bold shadow-soft-sm">
              <AlertTriangle className="w-3.5 h-3.5" />
              BEFORE: Single-Use Clutter
            </span>
          </div>

          <div className="max-w-xs text-left space-y-2 min-w-[260px]">
            <div className="text-4xl">🧴🚯🗑️</div>
            <h4 className="text-lg font-serif font-bold text-danger">
              Microplastics & Extractive Waste
            </h4>
            <p className="text-xs text-text leading-relaxed font-normal">
              Single-use cling films, plastic toothbrushes, liquid bottles packed with chemical sulfates, and toxic runoff.
            </p>
            <div className="text-xs font-semibold text-danger">
              ⚠️ 450+ Years in Municipal Landfill
            </div>
          </div>
        </div>

        {/* DIVIDER HANDLE */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-surface-raised shadow-soft-md flex items-center justify-center pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="w-9 h-9 rounded-full bg-primary text-text-inverted flex items-center justify-center shadow-soft-md border-2 border-surface-raised -ml-0.5">
            <MoveHorizontal className="w-4 h-4 text-text-inverted" />
          </div>
        </div>
      </div>

      {/* Preset Buttons for Quick Comparison */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          type="button"
          onClick={() => setSliderPos(20)}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-danger/40 text-danger hover:bg-danger-subtle min-h-[44px] transition-colors focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
        >
          Show Before View
        </button>
        <button
          type="button"
          onClick={() => setSliderPos(50)}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-line text-heading hover:bg-surface-sunken min-h-[44px] transition-colors focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
        >
          50 / 50 Split
        </button>
        <button
          type="button"
          onClick={() => setSliderPos(80)}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-primary/30 text-primary hover:bg-primary-subtle min-h-[44px] transition-colors focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
        >
          Show After View
        </button>
      </div>
    </section>
  );
}
