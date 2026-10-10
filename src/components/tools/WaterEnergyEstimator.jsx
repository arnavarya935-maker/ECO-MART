import React, { useState } from 'react';
import { Droplets, Zap, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

export default function WaterEnergyEstimator() {
  const [showerMinutes, setShowerMinutes] = useState(8);
  const [laundryLoads, setLaundryLoads] = useState(3);
  const [handwashVsDishwasher, setHandwashVsDishwasher] = useState('tap'); // 'tap' (40L), 'basin' (15L)

  // Calculations
  const showerWaterLitres = showerMinutes * 12 * 30; // 12L/min standard shower
  const showerEnergyKwh = Math.round(showerMinutes * 0.4 * 30); // 0.4 kWh per min electric geyser

  const laundryWaterLitres = laundryLoads * 60 * 4; // 60L per cycle
  const laundryEnergyKwh = laundryLoads * 1.5 * 4;

  const kitchenWaterLitres = (handwashVsDishwasher === 'tap' ? 40 : 15) * 30;

  const totalWaterLitres = showerWaterLitres + laundryWaterLitres + kitchenWaterLitres;
  const totalEnergyKwh = showerEnergyKwh + laundryEnergyKwh;

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-md max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-5">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
            Resource Auditor
          </span>
          <h3 className="text-xl font-black text-stone-900 dark:text-stone-100 mt-2">
            Water & Energy Usage Estimator
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Discover monthly household resource consumption from bathroom, laundry, and kitchen tasks.
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <div className="p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-800 text-center">
            <div className="text-[10px] font-bold text-stone-500">Monthly Water</div>
            <div className="text-lg font-black text-cyan-700 dark:text-cyan-300">{totalWaterLitres.toLocaleString()} L</div>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-center">
            <div className="text-[10px] font-bold text-stone-500">Water Heating</div>
            <div className="text-lg font-black text-amber-700 dark:text-amber-300">{totalEnergyKwh} kWh</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Shower */}
        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-stone-700 dark:text-stone-300">🚿 Shower Duration per Person:</span>
            <span className="text-cyan-700 dark:text-cyan-300">{showerMinutes} minutes/day</span>
          </div>
          <input
            type="range"
            min="3"
            max="20"
            value={showerMinutes}
            onChange={(e) => setShowerMinutes(Number(e.target.value))}
            className="w-full accent-cyan-600"
          />
          <div className="text-[11px] text-stone-500 flex justify-between">
            <span>Monthly consumption: ~{showerWaterLitres}L</span>
            <span>Geyser heating: ~{showerEnergyKwh} kWh</span>
          </div>
        </div>

        {/* Laundry */}
        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-stone-700 dark:text-stone-300">🧺 Washing Machine Loads:</span>
            <span className="text-cyan-700 dark:text-cyan-300">{laundryLoads} loads/week</span>
          </div>
          <input
            type="range"
            min="1"
            max="8"
            value={laundryLoads}
            onChange={(e) => setLaundryLoads(Number(e.target.value))}
            className="w-full accent-cyan-600"
          />
          <div className="text-[11px] text-stone-500 flex justify-between">
            <span>Monthly consumption: ~{laundryWaterLitres}L</span>
            <span>Motor & cycle power: ~{laundryEnergyKwh} kWh</span>
          </div>
        </div>

        {/* Kitchen Dishes */}
        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-stone-700 dark:text-stone-300">🍽️ Dishwashing Method:</span>
            <span className="text-cyan-700 dark:text-cyan-300 capitalize">{handwashVsDishwasher === 'tap' ? 'Running Tap' : 'Basin Soak'}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setHandwashVsDishwasher('tap')}
              className={`py-1.5 rounded-xl text-xs font-bold transition ${
                handwashVsDishwasher === 'tap'
                  ? 'bg-cyan-700 text-white shadow-xs'
                  : 'bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-600'
              }`}
            >
              Running Tap (~40L/day)
            </button>
            <button
              type="button"
              onClick={() => setHandwashVsDishwasher('basin')}
              className={`py-1.5 rounded-xl text-xs font-bold transition ${
                handwashVsDishwasher === 'basin'
                  ? 'bg-cyan-700 text-white shadow-xs'
                  : 'bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-600'
              }`}
            >
              Basin Soak (~15L/day)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
