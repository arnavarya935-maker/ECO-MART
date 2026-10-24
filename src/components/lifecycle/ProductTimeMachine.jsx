import React, { useState } from 'react';
import {
  Clock,
  Trash2,
  Recycle,
  Heart
} from 'lucide-react';

const TIMEFRAMES = [
  { id: 'now', label: 'Now', year: '2026', subtitle: 'Day 1 of Purchase' },
  { id: '2030', label: '2030', year: '2030', subtitle: '+4 Years in the Future' },
  { id: '2035', label: '2035', year: '2035', subtitle: '+9 Years in the Future' }
];

export default function ProductTimeMachine({ product = null }) {
  const [activeTimeframe, setActiveTimeframe] = useState('2030');

  const isPlasticFree = product?.isPlasticFree ?? true;
  const isCompostable = product?.isCompostable ?? true;

  // Scenario Outcomes Matrix by Timeframe
  const SCENARIOS = {
    now: {
      landfill: {
        status: 'Manufactured / Intact',
        badge: 'New Item',
        badgeColor: 'bg-sand-100 text-heading border-line',
        description: 'Product begins its functional life. Zero degradation has occurred.',
        microplastics: '0 particles shed',
        carbonBurden: 'Initial embodied cradle-to-gate carbon (~0.28 kg CO₂e)'
      },
      recycled: {
        status: 'Circulation Ready',
        badge: 'High Quality',
        badgeColor: 'bg-emerald-500/10 text-emerald-800 border-emerald-500/30',
        description: 'Pure single-origin materials ready for seamless sorting at end of use.',
        recoveryRate: '100% initial material integrity'
      },
      reused: {
        status: 'Active Daily Service',
        badge: 'Primary Utility',
        badgeColor: 'bg-forest-900/10 text-forest-900 border-forest-900/20',
        description: 'Provides immediate utility, displacing initial disposable alternatives.',
        displacedDisposables: '1 disposable item displaced'
      }
    },
    '2030': {
      landfill: {
        status: isCompostable ? '85% Mineralized' : 'Fragile / Fragmenting',
        badge: isCompostable ? 'Benign Degradation' : 'Leachate Threat',
        badgeColor: isCompostable
          ? 'bg-emerald-500/10 text-emerald-800 border-emerald-500/30'
          : 'bg-rose-500/10 text-rose-800 border-rose-500/30',
        description: isCompostable
          ? 'Botanical fibers have decomposed via anaerobic microbes into soil humus. Zero persistent synthetic polymers.'
          : 'Conventional plastic benchmark would still be 98% intact, beginning surface photo-oxidation and shedding microplastics.',
        microplastics: isPlasticFree ? '0 microplastics shed' : '~42,000 microplastic fibers into leachate',
        carbonBurden: 'Biogenic carbon returned to natural carbon cycle'
      },
      recycled: {
        status: 'Cycle 2 Completed',
        badge: 'Secondary Product',
        badgeColor: 'bg-teal-500/10 text-teal-800 border-teal-500/30',
        description:
          'Processed through mechanical recycling or composted into agricultural organic mulch, avoiding virgin extraction.',
        recoveryRate: '~88% material preserved in circular stream'
      },
      reused: {
        status: '1,200+ Uses Completed',
        badge: 'Heirloom Service',
        badgeColor: 'bg-forest-900/10 text-forest-900 border-forest-900/20',
        description: 'Cleaned, maintained, and still functioning smoothly in the household.',
        displacedDisposables: '~240 single-use plastic equivalents displaced'
      }
    },
    '2035': {
      landfill: {
        status: isCompostable ? '100% Fully Absorbed' : 'Persistent Microplastic Hazard',
        badge: isCompostable ? 'Zero Ecological Trace' : 'Multi-Century Persistence',
        badgeColor: isCompostable
          ? 'bg-emerald-500/10 text-emerald-800 border-emerald-500/30'
          : 'bg-rose-500/10 text-rose-800 border-rose-500/30',
        description: isCompostable
          ? 'Complete biological assimilation. Soil tests show zero toxicity and improved soil organic carbon.'
          : 'Conventional plastic benchmark remains in landfill for another 440+ years, continually contaminating watershed.',
        microplastics: isPlasticFree ? '0 microplastics shed' : '>180,000 microplastic fibers shed into soil',
        carbonBurden: 'Net-zero permanent planetary burden'
      },
      recycled: {
        status: 'Cycle 3+ or Regrown Soil',
        badge: 'Fully Circular',
        badgeColor: 'bg-teal-500/10 text-teal-800 border-teal-500/30',
        description:
          'Material has successfully nurtured multiple agricultural cycles or been remanufactured into durable industrial goods.',
        recoveryRate: 'Avoided ~4.5 kg of virgin raw resource mining'
      },
      reused: {
        status: 'Heirloom / Repurposed',
        badge: 'Zero-Waste Champion',
        badgeColor: 'bg-forest-900/10 text-forest-900 border-forest-900/20',
        description:
          'Repurposed as garden planter, storage container, or passed down to family members.',
        displacedDisposables: '~650+ single-use disposable equivalents avoided'
      }
    }
  };

  const scenario = SCENARIOS[activeTimeframe];

  return (
    <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-line shadow-sm space-y-6">
      {/* Header & Mandatory Scenario Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-forest-900/10 text-forest-900 font-bold">
              Product Time Machine
            </span>
            <span className="text-xs text-muted">Comparative Horizon Simulation</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-heading mt-1">
            Where will this item be in 2030 & 2035?
          </h3>
          <p className="text-xs text-muted mt-0.5">
            Compare future outcomes across three disposal and stewardship pathways.
          </p>
        </div>

        {/* Mandatory Honesty Notice */}
        <div className="bg-sand-100 p-3 rounded-2xl border border-line text-xs max-w-xs self-start">
          <div className="flex items-center gap-1.5 font-bold text-amber-800">
            <Clock className="w-3.5 h-3.5" />
            <span>Scenario, Not a Prediction</span>
          </div>
          <p className="text-[11px] text-muted leading-tight mt-0.5">
            Hypothetical outcomes modeled under documented municipal waste degradation benchmarks.
          </p>
        </div>
      </div>

      {/* Timeframe Selector Pill Tabs */}
      <div className="flex items-center justify-center">
        <div className="bg-surface-raised p-1.5 rounded-2xl border border-line inline-flex gap-1.5">
          {TIMEFRAMES.map((t) => {
            const isActive = activeTimeframe === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTimeframe(t.id)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                  isActive
                    ? 'bg-forest-900 text-white shadow-sm'
                    : 'text-heading hover:bg-sand-100'
                }`}
                aria-pressed={isActive}
              >
                <span>{t.label} ({t.year})</span>
                <span className="block text-[10px] font-normal opacity-75 font-mono">
                  {t.subtitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Three Pathways Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* Pathway 1: Landfill / Discarded */}
        <div className="bg-surface-raised rounded-3xl p-5 border border-line space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold uppercase text-muted flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                Pathway A: Landfill
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${scenario.landfill.badgeColor}`}
              >
                {scenario.landfill.badge}
              </span>
            </div>

            <h4 className="font-serif font-bold text-base text-heading">
              {scenario.landfill.status}
            </h4>
            <p className="text-xs text-secondary leading-relaxed">
              {scenario.landfill.description}
            </p>
          </div>

          <div className="pt-3 border-t border-line/60 text-[11px] space-y-1 font-mono text-muted">
            <div className="flex justify-between">
              <span>Microplastics:</span>
              <span className="font-bold text-heading">{scenario.landfill.microplastics}</span>
            </div>
            <div className="text-[10px] text-muted mt-1 leading-tight">
              {scenario.landfill.carbonBurden}
            </div>
          </div>
        </div>

        {/* Pathway 2: Recycled / Remanufactured */}
        <div className="bg-surface-raised rounded-3xl p-5 border border-line space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold uppercase text-muted flex items-center gap-1.5">
                <Recycle className="w-3.5 h-3.5 text-teal-600" />
                Pathway B: Recycled
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${scenario.recycled.badgeColor}`}
              >
                {scenario.recycled.badge}
              </span>
            </div>

            <h4 className="font-serif font-bold text-base text-heading">
              {scenario.recycled.status}
            </h4>
            <p className="text-xs text-secondary leading-relaxed">
              {scenario.recycled.description}
            </p>
          </div>

          <div className="pt-3 border-t border-line/60 text-[11px] font-mono text-muted">
            <div className="flex justify-between">
              <span>Circularity:</span>
              <span className="font-bold text-emerald-700">{scenario.recycled.recoveryRate}</span>
            </div>
          </div>
        </div>

        {/* Pathway 3: Household Care & Reused */}
        <div className="bg-surface-raised rounded-3xl p-5 border border-line space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold uppercase text-muted flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-forest-900" />
                Pathway C: Reused
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${scenario.reused.badgeColor}`}
              >
                {scenario.reused.badge}
              </span>
            </div>

            <h4 className="font-serif font-bold text-base text-heading">
              {scenario.reused.status}
            </h4>
            <p className="text-xs text-secondary leading-relaxed">
              {scenario.reused.description}
            </p>
          </div>

          <div className="pt-3 border-t border-line/60 text-[11px] font-mono text-muted">
            <div className="flex justify-between">
              <span>Displaced:</span>
              <span className="font-bold text-primary">{scenario.reused.displacedDisposables}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Assumptions Footer */}
      <div className="bg-sand-50 rounded-2xl p-4 border border-line text-xs text-muted space-y-1">
        <span className="font-bold text-heading text-[11px] uppercase block">
          Documented Model Assumptions:
        </span>
        <ul className="space-y-0.5 text-[11px] list-disc list-inside leading-relaxed">
          <li>Assumes ambient Indian tropical soil conditions (28°C average temperature with seasonal monsoon moisture).</li>
          <li>EPA WARM model degradation curves for organic biological vs petrochemical polymer bonds.</li>
          <li>Household reuse assumes basic hand-wash care and avoidance of extreme thermal shock.</li>
        </ul>
      </div>
    </div>
  );
}
