import React, { useState, useMemo } from 'react';
import { Sliders, HelpCircle, Leaf, Truck, Recycle, RotateCcw } from 'lucide-react';

export default function SensitivitySliders({ product }) {
  const baseCarbon = Number(product?.carbonKg || 1.2);
  const baseLifespanMonths = product?.category === 'Home' ? 36 : product?.category === 'Stationery' ? 6 : 12;
  const baseDistanceKm = Number(product?.madeInKm || 350);

  const [lifespanMonths, setLifespanMonths] = useState(baseLifespanMonths);
  const [distanceKm, setDistanceKm] = useState(baseDistanceKm);
  const [disposalScenario, setDisposalScenario] = useState('compost');
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  // Dynamic footprint recalculation
  const recalculated = useMemo(() => {
    // 1. Lifespan impact (longer lifespan amortizes embodied footprint per year)
    const annualEmbodiedCarbon = (baseCarbon * 12) / Math.max(1, lifespanMonths);

    // 2. Transport impact: ~0.00015 kg CO2e per km by road / EV
    const transportCarbon = (distanceKm * 0.00018);

    // 3. Disposal impact
    let disposalCarbonDelta = 0;
    let disposalNote = '';
    if (disposalScenario === 'compost') {
      disposalCarbonDelta = -0.25;
      disposalNote = 'Diverts waste from landfill; sequesters organic carbon back to soil.';
    } else if (disposalScenario === 'recycling') {
      disposalCarbonDelta = -0.12;
      disposalNote = 'Recovered raw materials offset secondary virgin resource extraction.';
    } else {
      disposalCarbonDelta = +0.45;
      disposalNote = 'Anaerobic decomposition in municipal landfill generates methane emissions.';
    }

    const netAnnualCarbon = Math.max(0.05, parseFloat((annualEmbodiedCarbon + transportCarbon + disposalCarbonDelta).toFixed(2)));
    const baseAnnualCarbon = parseFloat(((baseCarbon * 12) / baseLifespanMonths + (baseDistanceKm * 0.00018)).toFixed(2));
    const deltaPercent = Math.round(((netAnnualCarbon - baseAnnualCarbon) / (baseAnnualCarbon || 1)) * 100);

    return {
      netAnnualCarbon,
      baseAnnualCarbon,
      deltaPercent,
      disposalNote
    };
  }, [baseCarbon, baseLifespanMonths, baseDistanceKm, lifespanMonths, distanceKm, disposalScenario]);

  const handleReset = () => {
    setLifespanMonths(baseLifespanMonths);
    setDistanceKm(baseDistanceKm);
    setDisposalScenario('compost');
  };

  if (!product) return null;

  return (
    <div className="bg-surface-raised rounded-3xl p-6 border border-line shadow-soft-sm space-y-6 text-left">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-line pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-heading">
              Sensitivity &amp; Use-Phase Simulator
            </h3>
            <p className="text-xs text-secondary mt-0.5">
              What happens when you use and dispose of this product differently?
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHowItWorks(!showHowItWorks)}
            className="p-2 rounded-xl text-muted hover:text-heading hover:bg-surface-sunken transition-colors cursor-pointer"
            title="How this calculation works"
            aria-label="How this calculation works"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-xl text-muted hover:text-heading hover:bg-surface-sunken transition-colors cursor-pointer"
            title="Reset to standard defaults"
            aria-label="Reset to standard defaults"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* "How this works" Drawer */}
      {showHowItWorks && (
        <div className="p-4 rounded-2xl bg-surface-sunken border border-line text-xs space-y-2 text-secondary animate-fade-in">
          <div className="font-bold text-heading flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5 text-primary" />
            <span>Honest Lifecycle Sensitivity Formulation</span>
          </div>
          <p className="leading-relaxed">
            Standard EcoScores evaluate a product assuming default consumer usage duration (e.g. {baseLifespanMonths} months) and regional delivery ({baseDistanceKm} km). In reality, extending product life by repairing or caring for it drastically drops its annual embodied footprint.
          </p>
          <div className="text-[10px] font-mono text-muted pt-1 border-t border-line">
            Formula: Net Annual CO₂ = (Embodied CO₂ × 12 / Lifespan Months) + (Distance × 0.18g/km) + End-of-Life Scenario Delta.
          </div>
        </div>
      )}

      {/* Recalculated Dynamic Impact Display Banner */}
      <div className="p-4 rounded-2xl bg-surface border border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-soft-xs">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted block">
            Simulated Annual Footprint
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-serif font-bold text-heading">
              {recalculated.netAnnualCarbon} kg CO₂e
            </span>
            <span className="text-xs text-muted">/ year</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-xl text-xs font-bold border ${
              recalculated.deltaPercent < 0
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                : recalculated.deltaPercent > 0
                ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30'
                : 'bg-surface-sunken text-muted border-line'
            }`}
          >
            {recalculated.deltaPercent < 0
              ? `${recalculated.deltaPercent}% lower than standard`
              : recalculated.deltaPercent > 0
              ? `+${recalculated.deltaPercent}% higher than standard`
              : 'Equal to standard profile'}
          </span>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="space-y-5">
        {/* Slider 1: Lifespan */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="lifespan-slider" className="font-semibold text-heading flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-primary" />
              <span>Lifespan Duration (Months of Use):</span>
            </label>
            <span className="font-mono font-bold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
              {lifespanMonths} months ({parseFloat((lifespanMonths / 12).toFixed(1))} yrs)
            </span>
          </div>
          <input
            id="lifespan-slider"
            type="range"
            min="3"
            max="60"
            step="3"
            value={lifespanMonths}
            onChange={(e) => setLifespanMonths(parseInt(e.target.value, 10))}
            className="w-full accent-primary h-2 bg-surface-sunken rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-muted font-mono">
            <span>3 mo (Disposed early)</span>
            <span>{baseLifespanMonths} mo (Standard)</span>
            <span>60 mo (Cared &amp; mended)</span>
          </div>
        </div>

        {/* Slider 2: Transport Distance */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="distance-slider" className="font-semibold text-heading flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-secondary" />
              <span>Delivery Transport Distance:</span>
            </label>
            <span className="font-mono font-bold text-secondary px-2 py-0.5 rounded bg-secondary/10 border border-secondary/20">
              {distanceKm} km
            </span>
          </div>
          <input
            id="distance-slider"
            type="range"
            min="25"
            max="2500"
            step="25"
            value={distanceKm}
            onChange={(e) => setDistanceKm(parseInt(e.target.value, 10))}
            className="w-full accent-secondary h-2 bg-surface-sunken rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-muted font-mono">
            <span>25 km (Local artisan)</span>
            <span>{baseDistanceKm} km (Regional hub)</span>
            <span>2,500 km (Long-haul transit)</span>
          </div>
        </div>

        {/* Control 3: Disposal Scenario */}
        <div className="space-y-2">
          <label className="font-semibold text-heading text-xs flex items-center gap-1.5">
            <Recycle className="w-3.5 h-3.5 text-accent" />
            <span>End-of-Life Disposal Route:</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'compost', label: '🌱 Organic Compost', delta: '-0.25 kg' },
              { id: 'recycling', label: '♻️ Closed Recycling', delta: '-0.12 kg' },
              { id: 'landfill', label: '🗑️ Standard Landfill', delta: '+0.45 kg' }
            ].map((route) => (
              <button
                key={route.id}
                type="button"
                onClick={() => setDisposalScenario(route.id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  disposalScenario === route.id
                    ? 'bg-primary/10 border-primary shadow-soft-xs text-heading'
                    : 'bg-surface-sunken border-line text-secondary hover:bg-surface'
                }`}
              >
                <div className="font-bold text-xs">{route.label}</div>
                <div className="text-[10px] text-muted mt-0.5">{route.delta} footprint impact</div>
              </button>
            ))}
          </div>
          <p className="text-[11px] text-muted italic mt-1">
            {recalculated.disposalNote}
          </p>
        </div>
      </div>
    </div>
  );
}
