import React, { useState } from 'react';

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
    <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-line shadow-soft-sm max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-5">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
            Resource Auditor
          </span>
          <h3 className="text-xl font-serif font-bold text-heading mt-2">
            Water & Energy Usage Estimator
          </h3>
          <p className="text-xs sm:text-sm text-secondary mt-0.5">
            Discover monthly household resource consumption from bathroom, laundry, and kitchen tasks.
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <div className="p-3 rounded-2xl bg-accent/10 border border-accent/20 text-center">
            <div className="text-[10px] font-semibold text-muted">Monthly Water</div>
            <div className="text-lg font-bold text-accent">{totalWaterLitres.toLocaleString()} L</div>
          </div>
          <div className="p-3 rounded-2xl bg-warning/10 border border-warning/20 text-center">
            <div className="text-[10px] font-semibold text-muted">Water Heating</div>
            <div className="text-lg font-bold text-warning">{totalEnergyKwh} kWh</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Shower */}
        <div className="p-4 rounded-2xl bg-surface-sunken border border-line space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-heading">🚿 Shower Duration per Person:</span>
            <span className="text-accent">{showerMinutes} minutes/day</span>
          </div>
          <input
            type="range"
            min="3"
            max="20"
            value={showerMinutes}
            onChange={(e) => setShowerMinutes(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer min-h-[44px]"
          />
          <div className="text-[11px] text-muted flex justify-between">
            <span>Monthly consumption: ~{showerWaterLitres}L</span>
            <span>Geyser heating: ~{showerEnergyKwh} kWh</span>
          </div>
        </div>

        {/* Laundry */}
        <div className="p-4 rounded-2xl bg-surface-sunken border border-line space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-heading">🧺 Washing Machine Loads:</span>
            <span className="text-accent">{laundryLoads} loads/week</span>
          </div>
          <input
            type="range"
            min="1"
            max="8"
            value={laundryLoads}
            onChange={(e) => setLaundryLoads(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer min-h-[44px]"
          />
          <div className="text-[11px] text-muted flex justify-between">
            <span>Monthly consumption: ~{laundryWaterLitres}L</span>
            <span>Motor & cycle power: ~{laundryEnergyKwh} kWh</span>
          </div>
        </div>

        {/* Kitchen Dishes */}
        <div className="p-4 rounded-2xl bg-surface-sunken border border-line space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-heading">🍽️ Dishwashing Method:</span>
            <span className="text-accent capitalize">{handwashVsDishwasher === 'tap' ? 'Running Tap' : 'Basin Soak'}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setHandwashVsDishwasher('tap')}
              className={`py-2 px-3 rounded-full text-xs font-semibold transition cursor-pointer min-h-[44px] ${
                handwashVsDishwasher === 'tap'
                  ? 'bg-primary text-primary-contrast shadow-soft-xs'
                  : 'bg-surface text-secondary border border-line hover:text-heading'
              }`}
            >
              Running Tap (~40L/day)
            </button>
            <button
              type="button"
              onClick={() => setHandwashVsDishwasher('basin')}
              className={`py-2 px-3 rounded-full text-xs font-semibold transition cursor-pointer min-h-[44px] ${
                handwashVsDishwasher === 'basin'
                  ? 'bg-primary text-primary-contrast shadow-soft-xs'
                  : 'bg-surface text-secondary border border-line hover:text-heading'
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
