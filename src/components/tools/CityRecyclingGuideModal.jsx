import React, { useState } from 'react';
import {
  MapPin,
  X,
  Recycle,
  AlertCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { CITY_RECYCLING_GUIDES } from '../../lib/circularityEngine';

export default function CityRecyclingGuideModal({ isOpen, onClose }) {
  const [selectedCity, setSelectedCity] = useState(CITY_RECYCLING_GUIDES[0].city);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const activeGuide = CITY_RECYCLING_GUIDES.find((c) => c.city === selectedCity) || CITY_RECYCLING_GUIDES[0];

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] bg-surface-raised border border-line rounded-3xl shadow-soft-xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-line flex items-center justify-between bg-surface-sunken">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-heading">
                  Local Municipal Recycling Guide
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Curated Sample Data
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                Segregation streams, color-coded bins, and e-waste policies across Indian cities.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowHowItWorks(!showHowItWorks)}
              className="p-2 rounded-xl border border-line bg-surface hover:bg-surface-sunken text-text-muted hover:text-heading text-xs font-mono flex items-center gap-1 transition"
            >
              <HelpCircle className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline">How it works</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl border border-line text-text-muted hover:text-heading hover:bg-surface transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* How it works drawer */}
        {showHowItWorks && (
          <div className="p-4 bg-surface border-b border-line text-xs space-y-1.5 animate-fade-in text-left">
            <div className="flex items-center gap-1.5 font-serif font-bold text-heading">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Municipal Solid Waste Norms</span>
            </div>
            <p className="text-text-secondary leading-relaxed">
              Guidelines are referenced from the Solid Waste Management Rules 2016 and published urban local body mandates (BBMP, BMC, MCD, GCC, GHMC). Data is verified curated guidance and labeled as sample municipal rules.
            </p>
          </div>
        )}

        {/* City Selector Pills */}
        <div className="p-3 border-b border-line bg-surface flex gap-1.5 overflow-x-auto scrollbar-thin">
          {CITY_RECYCLING_GUIDES.map((guide) => (
            <button
              key={guide.city}
              type="button"
              onClick={() => setSelectedCity(guide.city)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium whitespace-nowrap transition cursor-pointer ${
                selectedCity === guide.city
                  ? 'bg-primary text-white font-bold shadow-soft-xs'
                  : 'bg-surface-sunken border border-line text-text-secondary hover:text-heading'
              }`}
            >
              {guide.city}
            </button>
          ))}
        </div>

        {/* Content Details */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-left font-sans">
          <div className="flex items-center justify-between border-b border-line pb-2">
            <div>
              <span className="text-[10px] font-mono text-text-muted uppercase">
                Urban Local Body Authority
              </span>
              <h4 className="font-serif font-bold text-base text-heading">
                {activeGuide.authority} ({activeGuide.state})
              </h4>
            </div>
          </div>

          {/* Color-Coded Segregation Bins */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-text-muted block">
              Municipal Segregation Streams
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Wet Waste */}
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-emerald-700 dark:text-emerald-300 block">
                  Wet Compostable
                </span>
                <p className="text-xs text-heading font-medium">
                  {activeGuide.wetWasteColor}
                </p>
              </div>

              {/* Dry Waste */}
              <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/25 space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-teal-700 dark:text-teal-300 block">
                  Dry Recyclable
                </span>
                <p className="text-xs text-heading font-medium">
                  {activeGuide.dryWasteColor}
                </p>
              </div>

              {/* Sanitary / Hazard */}
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-rose-700 dark:text-rose-300 block">
                  Sanitary / Hazard
                </span>
                <p className="text-xs text-heading font-medium">
                  {activeGuide.sanitaryWasteColor}
                </p>
              </div>
            </div>
          </div>

          {/* E-Waste Policy */}
          <div className="p-4 rounded-2xl bg-surface-sunken border border-line space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-primary">
              <Recycle className="w-4 h-4" />
              <span>E-Waste &amp; Battery Drop-off Protocol</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              {activeGuide.eWastePolicy}
            </p>
          </div>

          {/* Special City Rules */}
          <div className="p-4 rounded-2xl bg-surface-sunken border border-line space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
              <AlertCircle className="w-4 h-4" />
              <span>Local Bylaws &amp; Bans</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              {activeGuide.specialRules}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-line bg-surface-sunken flex items-center justify-between text-[11px] font-mono text-text-muted">
          <span>Data source: Urban Municipal Swachh Portal (Curated)</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-primary text-white font-semibold text-xs transition cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
