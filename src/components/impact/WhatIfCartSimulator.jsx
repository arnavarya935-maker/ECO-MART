import React, { useState, useMemo } from 'react';
import {
  Sliders,
  Info,
  Droplets,
  Wind,
  Ban,
  RefreshCw
} from 'lucide-react';

const SIMULATION_ITEMS = [
  {
    id: 'sim_brush',
    name: 'Toothbrushes',
    conventional: {
      name: 'Polypropylene Plastic Toothbrush',
      plasticG: 22,
      co2Kg: 0.28,
      waterL: 45,
      price: 60
    },
    sustainable: {
      name: 'Moso Bamboo Toothbrush (Castor Bristles)',
      plasticG: 0,
      co2Kg: 0.08,
      waterL: 12,
      price: 85,
      productId: 'pers-01'
    },
    defaultQty: 4,
    unit: 'brushes/yr'
  },
  {
    id: 'sim_wrap',
    name: 'Food Wrap & Storage',
    conventional: {
      name: 'Single-Use PVC / LDPE Cling Film Roll',
      plasticG: 120,
      co2Kg: 0.95,
      waterL: 180,
      price: 180
    },
    sustainable: {
      name: 'Reusable Organic Beeswax Food Wraps (Pack of 3)',
      plasticG: 0,
      co2Kg: 0.22,
      waterL: 40,
      price: 349,
      productId: 'kit-02'
    },
    defaultQty: 2,
    unit: 'rolls/yr'
  },
  {
    id: 'sim_shampoo',
    name: 'Hair Wash Containers',
    conventional: {
      name: 'Liquid Shampoo in HDPE Plastic Bottle (250ml)',
      plasticG: 45,
      co2Kg: 0.72,
      waterL: 160,
      price: 240
    },
    sustainable: {
      name: 'Cold-Pressed Solid Neem Shampoo Bar (Plastic-Free)',
      plasticG: 0,
      co2Kg: 0.16,
      waterL: 20,
      price: 280,
      productId: 'care-03'
    },
    defaultQty: 6,
    unit: 'bottles/yr'
  },
  {
    id: 'sim_bag',
    name: 'Shopping & Groceries',
    conventional: {
      name: 'Single-Use Plastic Polyethylene Carry Bags',
      plasticG: 8,
      co2Kg: 0.05,
      waterL: 8,
      price: 5
    },
    sustainable: {
      name: 'Heavy-Duty Unbleached Organic Cotton Tote',
      plasticG: 0,
      co2Kg: 0.005,
      waterL: 2,
      price: 199,
      productId: 'bag-01'
    },
    defaultQty: 100,
    unit: 'bags/yr'
  }
];

export default function WhatIfCartSimulator() {
  const [quantities, setQuantities] = useState(() => {
    const init = {};
    SIMULATION_ITEMS.forEach((item) => {
      init[item.id] = item.defaultQty;
    });
    return init;
  });

  const [swapped, setSwapped] = useState(() => {
    const init = {};
    SIMULATION_ITEMS.forEach((item) => {
      init[item.id] = false; // false = conventional baseline; true = swapped to eco choice
    });
    return init;
  });

  const handleQtyChange = (id, val) => {
    setQuantities((prev) => ({ ...prev, [id]: Number(val) }));
  };

  const toggleSwap = (id) => {
    setSwapped((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSwapAll = (makeAllEco = true) => {
    const next = {};
    SIMULATION_ITEMS.forEach((item) => {
      next[item.id] = makeAllEco;
    });
    setSwapped(next);
  };

  // Compute Before vs After
  const simulationResults = useMemo(() => {
    let baselineCO2 = 0;
    let baselinePlastic = 0;
    let baselineWater = 0;

    let currentCO2 = 0;
    let currentPlastic = 0;
    let currentWater = 0;

    SIMULATION_ITEMS.forEach((item) => {
      const q = quantities[item.id] || 0;
      const isEco = swapped[item.id];

      // Baseline (100% conventional)
      baselineCO2 += item.conventional.co2Kg * q;
      baselinePlastic += item.conventional.plasticG * q;
      baselineWater += item.conventional.waterL * q;

      // Current selection
      const active = isEco ? item.sustainable : item.conventional;
      currentCO2 += active.co2Kg * q;
      currentPlastic += active.plasticG * q;
      currentWater += active.waterL * q;
    });

    const co2Saved = Math.max(0, baselineCO2 - currentCO2);
    const plasticSaved = Math.max(0, baselinePlastic - currentPlastic);
    const waterSaved = Math.max(0, baselineWater - currentWater);

    const co2ReductionPct = baselineCO2 > 0 ? Math.round((co2Saved / baselineCO2) * 100) : 0;
    const plasticReductionPct = baselinePlastic > 0 ? Math.round((plasticSaved / baselinePlastic) * 100) : 0;
    const waterReductionPct = baselineWater > 0 ? Math.round((waterSaved / baselineWater) * 100) : 0;

    return {
      baselineCO2: Number(baselineCO2.toFixed(2)),
      baselinePlastic: Math.round(baselinePlastic),
      baselineWater: Math.round(baselineWater),
      currentCO2: Number(currentCO2.toFixed(2)),
      currentPlastic: Math.round(currentPlastic),
      currentWater: Math.round(currentWater),
      co2Saved: Number(co2Saved.toFixed(2)),
      plasticSaved: Math.round(plasticSaved),
      waterSaved: Math.round(waterSaved),
      co2ReductionPct,
      plasticReductionPct,
      waterReductionPct
    };
  }, [quantities, swapped]);

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-line shadow-card space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
              Feature 2 • Interactive Simulator
            </span>
            <span className="text-[10px] font-mono text-muted uppercase">
              Cradle-to-Gate LCA Delta
            </span>
          </div>
          <h3 className="text-xl sm:text-3xl font-serif font-bold text-heading">
            What-If Cart Simulator
          </h3>
          <p className="text-xs sm:text-sm text-secondary">
            Adjust household consumption quantities and toggle 1-tap sustainable swaps to see real-time planetary savings.
          </p>
        </div>

        {/* Global Swap All Toggle Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSwapAll(true)}
            className="text-xs font-mono px-3.5 py-1.5 rounded-full bg-primary text-primary-contrast font-bold hover:opacity-90 transition shadow-soft-sm focus-visible:outline-2 focus-visible:outline-focus"
          >
            Swap All to Eco (100%)
          </button>
          <button
            onClick={() => handleSwapAll(false)}
            className="text-xs font-mono px-3.5 py-1.5 rounded-full border border-line bg-surface-sunken hover:border-line-subtle text-secondary transition focus-visible:outline-2 focus-visible:outline-focus"
          >
            Reset to Conventional
          </button>
        </div>
      </div>

      {/* Assumptions Banner */}
      <div className="flex items-center gap-2 text-[11px] text-muted font-mono bg-surface-sunken/60 px-3.5 py-2 rounded-2xl border border-line/40">
        <Info className="w-3.5 h-3.5 text-primary shrink-0" />
        <span><strong>Calculated Estimate:</strong> Delta measured against standard virgin petroleum extraction & municipal wastewater benchmarks (ISO 14040).</span>
      </div>

      {/* Real-time Dynamic Impact Deltas (Gauges / Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CO2 Delta */}
        <div className="p-5 rounded-2xl bg-surface-sunken border border-line space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-muted flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-primary" /> CO₂ Emission Delta
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md">
              -{simulationResults.co2ReductionPct}%
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-heading">
              {simulationResults.co2Saved}
            </span>
            <span className="font-mono text-xs text-muted">kg CO₂e avoided</span>
          </div>

          <div className="w-full bg-surface-raised rounded-full h-2 overflow-hidden border border-line/40">
            <div
              style={{ width: `${simulationResults.co2ReductionPct}%` }}
              className="bg-primary h-full rounded-full transition-all duration-500"
            />
          </div>

          <div className="flex justify-between text-[10px] font-mono text-muted">
            <span>Base: {simulationResults.baselineCO2} kg</span>
            <span className="text-primary font-bold">Now: {simulationResults.currentCO2} kg</span>
          </div>
        </div>

        {/* Plastic Delta */}
        <div className="p-5 rounded-2xl bg-surface-sunken border border-line space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-muted flex items-center gap-1.5">
              <Ban className="w-4 h-4 text-accent" /> Plastic Waste Diverted
            </span>
            <span className="text-xs font-mono font-bold text-accent bg-accent/10 border border-accent/30 px-2 py-0.5 rounded-md">
              -{simulationResults.plasticReductionPct}%
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-heading">
              {simulationResults.plasticSaved}
            </span>
            <span className="font-mono text-xs text-muted">grams diverted</span>
          </div>

          <div className="w-full bg-surface-raised rounded-full h-2 overflow-hidden border border-line/40">
            <div
              style={{ width: `${simulationResults.plasticReductionPct}%` }}
              className="bg-accent h-full rounded-full transition-all duration-500"
            />
          </div>

          <div className="flex justify-between text-[10px] font-mono text-muted">
            <span>Base: {simulationResults.baselinePlastic} g</span>
            <span className="text-accent font-bold">Now: {simulationResults.currentPlastic} g</span>
          </div>
        </div>

        {/* Water Delta */}
        <div className="p-5 rounded-2xl bg-surface-sunken border border-line space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-muted flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-secondary" /> Freshwater Conserved
            </span>
            <span className="text-xs font-mono font-bold text-secondary bg-secondary/10 border border-secondary/30 px-2 py-0.5 rounded-md">
              -{simulationResults.waterReductionPct}%
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-heading">
              {simulationResults.waterSaved}
            </span>
            <span className="font-mono text-xs text-muted">litres saved</span>
          </div>

          <div className="w-full bg-surface-raised rounded-full h-2 overflow-hidden border border-line/40">
            <div
              style={{ width: `${simulationResults.waterReductionPct}%` }}
              className="bg-secondary h-full rounded-full transition-all duration-500"
            />
          </div>

          <div className="flex justify-between text-[10px] font-mono text-muted">
            <span>Base: {simulationResults.baselineWater} L</span>
            <span className="text-secondary font-bold">Now: {simulationResults.currentWater} L</span>
          </div>
        </div>
      </div>

      {/* Interactive Products List with Quantity Sliders and 1-Tap Swaps */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-wider text-heading flex items-center gap-2">
          <Sliders className="w-4 h-4 text-primary" />
          Simulate Household Items & 1-Tap Swaps
        </h4>

        <div className="space-y-3.5">
          {SIMULATION_ITEMS.map((item) => {
            const isEco = swapped[item.id];
            const qty = quantities[item.id] || 0;
            const activeChoice = isEco ? item.sustainable : item.conventional;

            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 ${
                  isEco
                    ? 'bg-primary/5 border-primary/40 shadow-soft-sm'
                    : 'bg-surface-sunken border-line'
                }`}
              >
                {/* Product Name & Current Status */}
                <div className="space-y-1 flex-1 min-w-[240px]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-heading">{item.name}</span>
                    <span
                      className={`text-[9px] font-mono font-semibold uppercase px-2 py-0.5 rounded-md border ${
                        isEco
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      }`}
                    >
                      {isEco ? '🌱 Swapped to Eco' : '⚠️ Conventional Benchmark'}
                    </span>
                  </div>
                  <div className="text-xs text-secondary font-medium">
                    {activeChoice.name}
                  </div>
                </div>

                {/* Slider for Quantity */}
                <div className="space-y-1 w-full sm:w-60">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-muted">Quantity:</span>
                    <span className="font-bold text-heading">
                      {qty} {item.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max={item.id === 'sim_bag' ? '200' : '15'}
                    value={qty}
                    onChange={(e) => handleQtyChange(item.id, e.target.value)}
                    className="w-full accent-emerald-500 h-1.5 bg-surface-raised rounded-lg cursor-pointer"
                    aria-label={`Quantity slider for ${item.name}`}
                  />
                </div>

                {/* Item-level Lifecycle Footprint */}
                <div className="flex items-center gap-4 text-[11px] font-mono shrink-0">
                  <div>
                    <span className="text-muted block text-[10px]">CO₂</span>
                    <span className="font-bold text-heading">{(activeChoice.co2Kg * qty).toFixed(1)}kg</span>
                  </div>
                  <div>
                    <span className="text-muted block text-[10px]">Plastic</span>
                    <span className="font-bold text-heading">{Math.round(activeChoice.plasticG * qty)}g</span>
                  </div>
                  <div>
                    <span className="text-muted block text-[10px]">Water</span>
                    <span className="font-bold text-heading">{Math.round(activeChoice.waterL * qty)}L</span>
                  </div>
                </div>

                {/* 1-Tap Swap Action Button */}
                <button
                  type="button"
                  onClick={() => toggleSwap(item.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition flex items-center gap-1.5 shrink-0 focus-visible:outline-2 focus-visible:outline-focus cursor-pointer ${
                    isEco
                      ? 'bg-surface-raised border border-line hover:border-line-subtle text-secondary'
                      : 'bg-primary hover:bg-primary-hover text-primary-contrast shadow-soft-sm'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{isEco ? 'Revert to Conventional' : 'Swap to Eco Choice'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
