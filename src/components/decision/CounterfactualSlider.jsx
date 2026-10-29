import React, { useState, useMemo } from 'react';
import {
  Info,
  RotateCcw,
  Scale,
  CheckCircle2
} from 'lucide-react';

const SCENARIOS = [
  {
    id: 'hygiene',
    title: 'Personal Care & Oral Hygiene',
    category: 'Personal Care',
    description: 'Explore the price boundary between petroleum-derived disposables and regenerative bamboo.',
    baseConventional: {
      id: 'care-01-conv',
      name: 'Nylon Bristle Plastic Toothbrushes (Pack of 4)',
      price: 120,
      materials: 'Virgin Polypropylene',
      co2Kg: 0.85,
      plasticGrams: 80,
      packaging: 'Blister Pack Plastic',
      badge: 'Conventional Benchmark'
    },
    baseSustainable: {
      id: 'care-01',
      name: 'FSC Certified Organic Bamboo Toothbrush Set',
      price: 249,
      materials: 'Regenerative Moso Bamboo',
      co2Kg: 0.12,
      plasticGrams: 0,
      packaging: 'Unbleached Kraft Paper',
      badge: 'Estimated Sustainable'
    },
    flipBudgetThreshold: 240
  },
  {
    id: 'kitchen',
    title: 'Kitchen Cling Wrap vs Reusables',
    category: 'Kitchen',
    description: 'Explore when durability and washable longevity flip the algorithm away from single-use LDPE wrap.',
    baseConventional: {
      id: 'kit-02-conv',
      name: 'Single-Use LDPE Cling Film Roll (30m)',
      price: 180,
      materials: 'Low-Density Polyethylene',
      co2Kg: 1.2,
      plasticGrams: 140,
      packaging: 'Plastic Shrinkwrap',
      badge: 'Conventional Benchmark'
    },
    baseSustainable: {
      id: 'kit-02',
      name: 'Organic Beeswax & Jojoba Food Wrap (Set of 3)',
      price: 499,
      materials: 'GOTS Cotton & Beeswax',
      co2Kg: 0.28,
      plasticGrams: 0,
      packaging: 'Recycled Cardboard',
      badge: 'Estimated Sustainable'
    },
    flipBudgetThreshold: 450
  }
];

export default function CounterfactualSlider() {
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);
  const scenario = SCENARIOS[selectedScenarioIdx];

  const [budget, setBudget] = useState(300);
  const [plasticPriorityWeight, setPlasticPriorityWeight] = useState(70); // 0 to 100
  const [packagingStrict, setPackagingStrict] = useState(true);

  // Counterfactual Recommendation Flip Engine
  const evaluation = useMemo(() => {
    const isAboveFlipThreshold =
      budget >= scenario.flipBudgetThreshold &&
      (plasticPriorityWeight >= 40 || packagingStrict);

    const activeRec = isAboveFlipThreshold ? scenario.baseSustainable : scenario.baseConventional;
    const alternative = isAboveFlipThreshold ? scenario.baseConventional : scenario.baseSustainable;

    const co2Delta = Number((scenario.baseConventional.co2Kg - scenario.baseSustainable.co2Kg).toFixed(2));
    const plasticDelta = scenario.baseConventional.plasticGrams - scenario.baseSustainable.plasticGrams;

    return {
      isFlipped: isAboveFlipThreshold,
      activeRec,
      alternative,
      co2Delta,
      plasticDelta,
      threshold: scenario.flipBudgetThreshold
    };
  }, [scenario, budget, plasticPriorityWeight, packagingStrict]);

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-line shadow-card max-w-4xl mx-auto space-y-6 text-text">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-primary/10 text-primary border border-primary/20">
              <Scale className="w-5 h-5" />
            </span>
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-primary">
              What-If Decision Boundary
            </span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-heading mt-2">
            Counterfactual Recommendation Slider
          </h3>
          <p className="text-xs sm:text-sm text-secondary mt-1 max-w-xl">
            See exactly when and why the AI recommendation flips as you adjust budget limits, environmental weighting, and packaging constraints.
          </p>
        </div>

        {/* Scenario Selector */}
        <div className="flex items-center gap-1.5 bg-surface-sunken p-1 rounded-2xl border border-line self-start sm:self-auto">
          {SCENARIOS.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setSelectedScenarioIdx(idx);
                setBudget(s.flipBudgetThreshold + 50);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                selectedScenarioIdx === idx
                  ? 'bg-primary text-white font-bold'
                  : 'text-muted hover:text-heading'
              }`}
            >
              {s.title.split('&')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Control Sliders Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5 rounded-2xl bg-surface-sunken border border-line">
        {/* Slider 1: Budget */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="font-bold text-heading">Max Budget Limit:</span>
            <span className="text-primary font-black text-sm">₹{budget}</span>
          </div>
          <input
            type="range"
            min="100"
            max="800"
            step="10"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer"
            aria-label="Adjust budget threshold"
          />
          <div className="flex justify-between text-[10px] font-mono text-muted">
            <span>₹100</span>
            <span className="text-amber-400 font-bold">Flip at ~₹{scenario.flipBudgetThreshold}</span>
            <span>₹800</span>
          </div>
        </div>

        {/* Slider 2: Plastic Elimination Weight */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="font-bold text-heading">Plastic Priority:</span>
            <span className="text-emerald-400 font-black text-sm">{plasticPriorityWeight}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={plasticPriorityWeight}
            onChange={(e) => setPlasticPriorityWeight(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
            aria-label="Adjust plastic priority weighting"
          />
          <div className="flex justify-between text-[10px] font-mono text-muted">
            <span>Economic focus</span>
            <span>Strict Zero-Plastic</span>
          </div>
        </div>

        {/* Toggle 3: Packaging Filter */}
        <div className="flex flex-col justify-between space-y-2">
          <span className="text-xs font-mono font-bold text-heading">Packaging Constraint:</span>
          <button
            type="button"
            onClick={() => setPackagingStrict(!packagingStrict)}
            className={`w-full py-2 px-3 rounded-xl text-xs font-semibold border transition-colors cursor-pointer flex items-center justify-between ${
              packagingStrict
                ? 'bg-primary/10 border-primary text-primary font-bold'
                : 'bg-surface border-line text-muted hover:text-heading'
            }`}
          >
            <span>Strict Plastic-Free Only</span>
            <span>{packagingStrict ? 'ON' : 'OFF'}</span>
          </button>
          <span className="text-[10px] text-muted">Reject synthetic polywraps</span>
        </div>
      </div>

      {/* Flip Status Banner */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs font-mono transition-all ${
        evaluation.isFlipped
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
      }`}>
        <div className="flex items-center gap-2">
          {evaluation.isFlipped ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <RotateCcw className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span>
            {evaluation.isFlipped
              ? `✅ RECOMMENDATION FLIPPED: Sustainable Choice (${evaluation.activeRec.name.slice(0, 36)}...) Chosen!`
              : `⚠️ CONVENTIONAL DEFAULT ACTIVE: Budget or priority below flip threshold (Need ₹${scenario.flipBudgetThreshold}+)`}
          </span>
        </div>

        <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface border border-line text-heading shrink-0">
          Threshold: ₹{scenario.flipBudgetThreshold}
        </span>
      </div>

      {/* Side-by-Side Product Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
        {/* Selected Product Card */}
        <div className={`p-5 rounded-2xl border space-y-3 ${
          evaluation.isFlipped
            ? 'bg-surface-raised border-primary shadow-soft-sm'
            : 'bg-surface-sunken border-line opacity-75'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
              evaluation.isFlipped ? 'bg-primary/20 text-primary' : 'bg-surface text-muted'
            }`}>
              {scenario.baseSustainable.badge}
            </span>
            <span className="font-mono font-bold text-sm text-heading">
              ₹{scenario.baseSustainable.price}
            </span>
          </div>

          <div>
            <h4 className="font-bold text-sm text-heading">{scenario.baseSustainable.name}</h4>
            <span className="text-xs text-muted block mt-0.5">Material: {scenario.baseSustainable.materials}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-2 border-t border-line/60">
            <div>CO₂e: <strong>{scenario.baseSustainable.co2Kg} kg</strong></div>
            <div>Plastic: <strong>{scenario.baseSustainable.plasticGrams} g</strong></div>
          </div>
        </div>

        {/* Conventional Benchmark Card */}
        <div className={`p-5 rounded-2xl border space-y-3 ${
          !evaluation.isFlipped
            ? 'bg-surface-raised border-amber-500/40 shadow-soft-sm'
            : 'bg-surface-sunken border-line opacity-75'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-surface text-muted">
              {scenario.baseConventional.badge}
            </span>
            <span className="font-mono font-bold text-sm text-heading">
              ₹{scenario.baseConventional.price}
            </span>
          </div>

          <div>
            <h4 className="font-bold text-sm text-heading">{scenario.baseConventional.name}</h4>
            <span className="text-xs text-muted block mt-0.5">Material: {scenario.baseConventional.materials}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-2 border-t border-line/60">
            <div>CO₂e: <strong>{scenario.baseConventional.co2Kg} kg</strong></div>
            <div>Plastic: <strong>{scenario.baseConventional.plasticGrams} g</strong></div>
          </div>
        </div>
      </div>

      {/* Plain Words Explanation & Boundary Limits */}
      <div className="p-4 rounded-2xl bg-surface-sunken border border-line text-xs text-secondary leading-relaxed space-y-2 text-left">
        <div className="flex items-center gap-1.5 font-bold text-heading">
          <Info className="w-4 h-4 text-primary shrink-0" />
          <span>Why Did the Recommendation Flip? (Plain-Language Explanation)</span>
        </div>
        <p>
          At budgets below ₹{scenario.flipBudgetThreshold}, petroleum disposables dominate standard shopping algorithms because their raw material costs are subsidized by fossil infrastructure. However, once the shopper increases their budget to ₹{scenario.flipBudgetThreshold}+ or raises their plastic-reduction priority, the multi-criteria optimization function prioritizes cradle-to-grave circularity, flipping the winning recommendation to the zero-waste alternative.
        </p>
        <span className="text-[10px] font-mono text-muted block pt-1 border-t border-line/60">
          Decision Boundary Limit: This counterfactual simulator assumes 1-for-1 item replacement with equal functional utility over standard 90-day intervals.
        </span>
      </div>
    </div>
  );
}
