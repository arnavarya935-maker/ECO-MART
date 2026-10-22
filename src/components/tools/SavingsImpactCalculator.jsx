import React, { useState } from 'react';

const COMMON_SWITCHES = [
  {
    name: 'Bottled Water vs Copper Bottle',
    annualPlasticBottlesSaved: 365,
    annualCostSaved: 5400,
    co2SavedKg: 28,
    desc: 'Buying 1 bottle/day (₹20) vs refilling a lifetime copper vessel.'
  },
  {
    name: 'Plastic Razor vs Safety Brass Razor',
    annualPlasticBottlesSaved: 48,
    annualCostSaved: 1800,
    co2SavedKg: 9.6,
    desc: 'Disposable plastic cartridges vs stainless steel recyclable blades.'
  },
  {
    name: 'Cling Film vs Beeswax Food Wraps',
    annualPlasticBottlesSaved: 120,
    annualCostSaved: 1200,
    co2SavedKg: 14.5,
    desc: '3 rolls of throwaway plastic wrap vs washable organic cotton wax wraps.'
  },
  {
    name: 'Paper Towels vs Reusable Cotton Dishcloths',
    annualPlasticBottlesSaved: 80,
    annualCostSaved: 2200,
    co2SavedKg: 22,
    desc: '12 paper towel rolls vs 3 machine-washable waffle cotton towels.'
  }
];

export default function SavingsImpactCalculator() {
  const [selectedSwitches, setSelectedSwitches] = useState(['Bottled Water vs Copper Bottle', 'Cling Film vs Beeswax Food Wraps']);

  const toggleSwitch = (name) => {
    if (selectedSwitches.includes(name)) {
      setSelectedSwitches(selectedSwitches.filter((s) => s !== name));
    } else {
      setSelectedSwitches([...selectedSwitches, name]);
    }
  };

  const totalCostSaved = COMMON_SWITCHES
    .filter((s) => selectedSwitches.includes(s.name))
    .reduce((sum, s) => sum + s.annualCostSaved, 0);

  const totalPlasticItemsSaved = COMMON_SWITCHES
    .filter((s) => selectedSwitches.includes(s.name))
    .reduce((sum, s) => sum + s.annualPlasticBottlesSaved, 0);

  const totalCo2Saved = COMMON_SWITCHES
    .filter((s) => selectedSwitches.includes(s.name))
    .reduce((sum, s) => sum + s.co2SavedKg, 0);

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-line shadow-soft-sm max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-5">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
            Financial & Planetary Synergy
          </span>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-heading mt-2">
            Savings vs. Impact Switch Calculator
          </h3>
          <p className="text-xs sm:text-sm text-secondary mt-0.5">
            Sustainable living is not an expense—it saves money by ending recurring disposable purchases.
          </p>
        </div>

        {/* Dynamic Total Box */}
        <div className="p-4 rounded-2xl bg-surface-sunken border border-line text-center shrink-0">
          <div className="text-[11px] font-semibold text-muted">Projected Annual Savings</div>
          <div className="text-2xl font-serif font-bold text-primary">₹{totalCostSaved.toLocaleString()}</div>
          <div className="text-[10px] text-secondary font-medium">+{totalCo2Saved.toFixed(1)}kg CO₂ • {totalPlasticItemsSaved} plastics avoided</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-xs font-semibold text-heading">
          Select Everyday Habits to Switch:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {COMMON_SWITCHES.map((sw) => {
            const isChecked = selectedSwitches.includes(sw.name);
            return (
              <div
                key={sw.name}
                onClick={() => toggleSwitch(sw.name)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isChecked
                    ? 'bg-primary/5 border-primary shadow-soft-xs'
                    : 'bg-surface-sunken border-line opacity-85 hover:opacity-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-heading">{sw.name}</span>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      readOnly
                      className="accent-primary rounded cursor-pointer w-4 h-4"
                    />
                  </div>
                  <p className="text-[11px] text-secondary leading-relaxed">{sw.desc}</p>
                </div>

                <div className="flex items-center justify-between text-xs font-medium pt-3 mt-3 border-t border-line">
                  <span className="text-primary font-semibold">Save ₹{sw.annualCostSaved}/yr</span>
                  <span className="text-muted text-[11px]">~{sw.annualPlasticBottlesSaved} items avoided</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
