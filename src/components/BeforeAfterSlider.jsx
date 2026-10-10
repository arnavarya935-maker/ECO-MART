import React, { useState, useRef } from 'react';
import { Sparkles, MoveHorizontal, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';

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
        <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-full">
          Visual Lifestyle Audit
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 mt-2">
          Before & After: The Zero-Waste Transition
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-md mx-auto">
          Drag the slider horizontally to reveal how swapping 5 everyday essentials transforms your living space.
        </p>
      </div>

      <div
        className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden border-2 border-stone-200 dark:border-stone-800 shadow-2xl select-none cursor-ew-resize"
        onMouseDown={() => (isDragging.current = true)}
        onMouseUp={() => (isDragging.current = false)}
        onMouseLeave={() => (isDragging.current = false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* RIGHT SIDE: AFTER (Zero Waste Sanctuary) */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-white dark:from-emerald-950/60 dark:via-stone-900 dark:to-stone-850 p-8 flex flex-col justify-between">
          <div className="flex justify-end">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5" />
              AFTER: EcoMart Circular Sanctuary
            </span>
          </div>

          <div className="max-w-xs ml-auto text-right space-y-2">
            <div className="text-4xl">🌿🎋🫙</div>
            <h4 className="text-lg font-black text-emerald-900 dark:text-emerald-200">
              Clean, Organic, Non-Toxic
            </h4>
            <p className="text-xs text-stone-700 dark:text-stone-300">
              Glass pantry jars, bamboo brushes, beeswax food covers, solid organic bars, and zero landfill plastic.
            </p>
            <div className="text-xs font-black text-emerald-700 dark:text-emerald-300">
              🌱 100% Biodegradable & Compostable
            </div>
          </div>
        </div>

        {/* LEFT SIDE: BEFORE (Petrochemical Conventional Clutter) */}
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-br from-rose-100/90 via-stone-200 to-stone-100 dark:from-rose-950/80 dark:via-stone-900 dark:to-stone-850 p-8 flex flex-col justify-between overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <div className="flex justify-start min-w-[280px]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-black shadow-md">
              <AlertTriangle className="w-3.5 h-3.5" />
              BEFORE: Single-Use Clutter
            </span>
          </div>

          <div className="max-w-xs text-left space-y-2 min-w-[260px]">
            <div className="text-4xl">🧴🚯🗑️</div>
            <h4 className="text-lg font-black text-rose-950 dark:text-rose-200">
              Microplastics & Extractive Waste
            </h4>
            <p className="text-xs text-stone-700 dark:text-stone-300">
              Single-use cling films, plastic toothbrushes, liquid bottles packed with chemical sulfates, and toxic runoff.
            </p>
            <div className="text-xs font-black text-rose-700 dark:text-rose-400">
              ⚠️ 450+ Years in Municipal Landfill
            </div>
          </div>
        </div>

        {/* DIVIDER HANDLE */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl flex items-center justify-center pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="w-9 h-9 rounded-full bg-stone-900 text-white flex items-center justify-center shadow-xl border-2 border-white -ml-0.5">
            <MoveHorizontal className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Preset Buttons for Quick Comparison */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          type="button"
          onClick={() => setSliderPos(20)}
          className="px-3 py-1 rounded-xl text-xs font-bold border border-rose-300 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40"
        >
          Show Before View
        </button>
        <button
          type="button"
          onClick={() => setSliderPos(50)}
          className="px-3 py-1 rounded-xl text-xs font-bold border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800"
        >
          50 / 50 Split
        </button>
        <button
          type="button"
          onClick={() => setSliderPos(80)}
          className="px-3 py-1 rounded-xl text-xs font-bold border border-emerald-400 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
        >
          Show After View
        </button>
      </div>
    </section>
  );
}
