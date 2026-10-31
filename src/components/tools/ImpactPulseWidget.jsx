import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronUp, ChevronDown, X, Bot, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function ImpactPulseWidget() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { impact, isAgentOpen, setIsAgentOpen } = useCart();

  const location = useLocation();
  const isProductDetail = location.pathname.startsWith('/product/');

  const plasticGrams = impact?.plasticAvoided ?? impact?.totalPlasticSavedGrams ?? 0;
  const co2Kg = Number(impact?.co2Saved ?? impact?.totalCo2SavedKg ?? impact?.savedCo2 ?? 0);
  const waterLitres = impact?.waterSaved ?? impact?.totalWaterSavedLitres ?? 0;
  const averageGrade = impact?.averageGrade ?? impact?.grade ?? 'N/A';
  const totalItems = impact?.totalItems ?? 0;

  if (isDismissed) return null;

  return (
    <>
      {/* -------------------------------------------------------------
          Desktop Layout: Impact Pulse on bottom-left, Chat on bottom-right
          ------------------------------------------------------------- */}
      <aside
        aria-label="Impact Pulse Widget"
        className="hidden md:block fixed bottom-6 left-6 z-widgets animate-slide-up select-none"
      >
        <div className="bg-surface/95 backdrop-blur-md border border-line shadow-soft-lg rounded-2xl overflow-hidden transition-all duration-200">
          {/* Collapsed Header Pill */}
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2.5 px-3.5 py-2 cursor-pointer hover:bg-surface-sunken transition min-h-[44px]"
          >
            <div className="relative">
              <span className="w-2.5 h-2.5 rounded-full bg-primary block animate-ping absolute inset-0 opacity-75" />
              <span className="w-2.5 h-2.5 rounded-full bg-primary block relative" />
            </div>

            <div className="text-xs font-medium text-heading flex items-center gap-1.5">
              <span className="text-text-muted">Impact Pulse:</span>
              {totalItems > 0 && plasticGrams > 0 ? (
                <span className="text-primary font-bold">
                  ~{plasticGrams}g Plastic Diverted <span className="text-xs text-text-muted font-normal">(Estimate)</span>
                </span>
              ) : (
                <span className="text-text-secondary font-normal italic text-xs">
                  Add items to see your estimated impact
                </span>
              )}
            </div>

            <button
              type="button"
              className="text-muted hover:text-text ml-1 cursor-pointer"
              aria-label={isExpanded ? 'Collapse impact pulse' : 'Expand impact pulse'}
            >
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Expanded Details Flyout */}
          {isExpanded && (
            <div className="p-4 pt-2 border-t border-line space-y-3 w-72 text-xs">
              <div className="flex items-center justify-between text-muted font-semibold uppercase text-xs">
                <span>Cart Planetary Delta (Estimate)</span>
                <button
                  type="button"
                  onClick={() => setIsDismissed(true)}
                  className="hover:text-danger cursor-pointer p-1"
                  aria-label="Close widget"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {totalItems > 0 ? (
                <>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-surface-sunken border border-line">
                      <div className="font-bold text-primary">
                        ~{co2Kg.toFixed(2)} kg
                      </div>
                      <div className="text-xs text-muted font-medium">CO₂ Prevented (Est.)</div>
                    </div>
                    <div className="p-2 rounded-xl bg-surface-sunken border border-line">
                      <div className="font-bold text-accent">
                        ~{waterLitres} L
                      </div>
                      <div className="text-xs text-muted font-medium">Water Saved (Est.)</div>
                    </div>
                  </div>

                  <div className="text-xs text-secondary leading-snug">
                    🌱 Your cart averages <strong className="text-heading">Grade {averageGrade}</strong> across {totalItems} cart items.
                  </div>
                </>
              ) : (
                <div className="py-2 text-xs text-text-secondary leading-relaxed bg-surface-sunken p-2.5 rounded-xl border border-line">
                  Your cart is empty. Add sustainable products to see your calculated plastic diversion, CO₂ savings, and water preservation estimates.
                </div>
              )}

              <div className="text-xs text-text-muted border-t border-line/60 pt-1.5">
                * Estimates derived from product LCA coefficients compared against petrochemical baselines.
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Desktop Floating Eco Agent Chat Trigger */}
      {!isAgentOpen && (
        <button
          type="button"
          onClick={() => setIsAgentOpen(true)}
          className="hidden md:flex fixed bottom-6 right-6 z-widgets items-center gap-2 px-4 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-primary-contrast shadow-soft-lg cursor-pointer transition-transform active:scale-95 text-xs font-medium focus-visible:outline-2 focus-visible:outline-focus min-h-[44px]"
          title="Ask Eco Agent AI"
        >
          <Bot className="w-4 h-4 text-accent" />
          <span>Ask Eco Agent</span>
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        </button>
      )}

      {/* -------------------------------------------------------------
          Mobile Layout: Single compact floating group above bottom tabs (hidden on product detail to avoid collision with buy bar)
          ------------------------------------------------------------- */}
      {!isProductDetail && (
        <aside
          aria-label="Mobile Impact & Chat Floating Controls"
          className="md:hidden fixed bottom-16 inset-x-3 z-widgets flex items-center justify-between gap-2 pointer-events-none select-none animate-slide-up"
        >
          {/* Compact Impact Pill */}
          <div className="relative pointer-events-auto">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-surface/95 backdrop-blur-md border border-line shadow-soft-sm text-xs font-semibold text-heading active:scale-98 transition min-h-[44px]"
              aria-label="Toggle Impact Details"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-primary font-bold">
                {totalItems > 0 && plasticGrams > 0 ? `~${plasticGrams}g Diverted (Est.)` : 'Impact Pulse'}
              </span>
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-muted" /> : <ChevronUp className="w-3.5 h-3.5 text-muted" />}
            </button>

            {/* Mobile Details Popover */}
            {isExpanded && (
              <div className="absolute bottom-12 left-0 p-3.5 bg-surface rounded-2xl border border-line shadow-soft-xl w-64 text-xs space-y-2 animate-slide-up">
                <div className="flex items-center justify-between text-muted font-semibold uppercase text-xs">
                  <span>Planetary Delta</span>
                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="hover:text-danger p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-center">
                  <div className="p-1.5 rounded-xl bg-surface-sunken border border-line">
                    <div className="font-bold text-primary text-xs">
                      {co2Kg.toFixed(2)} kg
                    </div>
                    <div className="text-xs text-muted">CO₂ Prevented</div>
                  </div>
                  <div className="p-1.5 rounded-xl bg-surface-sunken border border-line">
                    <div className="font-bold text-accent text-xs">
                      {waterLitres} L
                    </div>
                    <div className="text-xs text-muted">Water Saved</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Compact Chat Button */}
          {!isAgentOpen && (
            <button
              type="button"
              onClick={() => setIsAgentOpen(true)}
              className="pointer-events-auto flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-contrast shadow-soft-sm text-xs font-medium active:scale-95 transition min-h-[44px]"
              aria-label="Ask Eco Agent"
            >
              <Bot className="w-4 h-4 text-accent" />
              <span className="text-xs">Chat</span>
              <Sparkles className="w-3.5 h-3.5 text-accent" />
            </button>
          )}
        </aside>
      )}
    </>
  );
}
