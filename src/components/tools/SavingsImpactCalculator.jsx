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
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-md max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-5">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
            Financial & Planetary Synergy
          </span>
          <h3 className="text-xl font-black text-stone-900 dark:text-stone-100 mt-2">
            Savings vs. Impact Switch Calculator
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Sustainable living is not an expense—it saves money by ending recurring disposable purchases.
          </p>
        </div>

        {/* Dynamic Total Box */}
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-center shrink-0">
          <div className="text-[11px] font-bold text-stone-500">Projected Annual Savings</div>
          <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">₹{totalCostSaved.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-800 dark:text-emerald-400 font-bold">+{totalCo2Saved.toFixed(1)}kg CO₂ • {totalPlasticItemsSaved} plastics avoided</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-xs font-bold text-stone-600 dark:text-stone-300">
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
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 shadow-2xs'
                    : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-stone-900 dark:text-stone-100">{sw.name}</span>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      readOnly
                      className="accent-emerald-600 rounded"
                    />
                  </div>
                  <p className="text-[11px] text-stone-500 leading-snug">{sw.desc}</p>
                </div>

                <div className="flex items-center justify-between text-xs font-bold pt-3 mt-2 border-t border-stone-200/60 dark:border-stone-700">
                  <span className="text-emerald-700 dark:text-emerald-300">Save ₹{sw.annualCostSaved}/yr</span>
                  <span className="text-stone-500 text-[11px]">~{sw.annualPlasticBottlesSaved} items avoided</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
