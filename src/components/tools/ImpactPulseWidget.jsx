import React, { useState } from 'react';
import { ChevronUp, ChevronDown, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function ImpactPulseWidget() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { impact } = useCart();

  if (isDismissed) return null;

  return (
    <aside
      aria-label="Impact Pulse Widget"
      className="fixed bottom-6 left-6 z-40 animate-slide-up select-none"
    >
      <div className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-emerald-400/50 rounded-2xl shadow-xl overflow-hidden transition-all duration-200">
        {/* Collapsed Header Pill */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2.5 px-3.5 py-2 cursor-pointer hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40 transition"
        >
          <div className="relative">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block animate-ping absolute inset-0 opacity-75" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 block relative" />
          </div>

          <div className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
            <span>Impact Pulse:</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">
              {impact.totalPlasticSavedGrams}g Plastic Diverted
            </span>
          </div>

          <button
            type="button"
            className="text-stone-400 hover:text-stone-600 ml-1"
            aria-label={isExpanded ? "Collapse impact pulse" : "Expand impact pulse"}
          >
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Expanded Details Flyout */}
        {isExpanded && (
          <div className="p-4 pt-2 border-t border-stone-100 dark:border-stone-800 space-y-3 w-72 text-xs">
            <div className="flex items-center justify-between text-stone-500 font-bold uppercase text-[10px]">
              <span>Cart Planetary Delta</span>
              <button
                type="button"
                onClick={() => setIsDismissed(true)}
                className="hover:text-rose-500"
                aria-label="Close widget"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
                <div className="font-black text-emerald-800 dark:text-emerald-300">
                  {impact.totalCo2SavedKg.toFixed(2)} kg
                </div>
                <div className="text-[10px] text-stone-500 font-medium">CO₂ Prevented</div>
              </div>
              <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800">
                <div className="font-black text-teal-800 dark:text-teal-300">
                  {impact.totalWaterSavedLitres} L
                </div>
                <div className="text-[10px] text-stone-500 font-medium">Water Saved</div>
              </div>
            </div>

            <div className="text-[11px] text-stone-600 dark:text-stone-400 leading-snug">
              🌱 Your cart averages <strong>Grade {impact.averageGrade}</strong> across {impact.totalItems} audited items.
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
