import React, { useState } from 'react';
import { Car, Utensils, Zap, ShoppingBag, Sparkles, RefreshCw, Leaf } from 'lucide-react';

export default function CarbonFootprintCalculator() {
  const [transportKm, setTransportKm] = useState(15);
  const [dietType, setDietType] = useState('vegetarian'); // 'vegan' (1.2), 'vegetarian' (1.7), 'mixed' (3.3)
  const [electricityKwh, setElectricityKwh] = useState(120);
  const [monthlyShopping, setMonthlyShopping] = useState('mindful'); // 'minimal' (15), 'mindful' (35), 'heavy' (85)

  // Calculations in kg CO2 per month
  const transportCo2 = Math.round(transportKm * 30 * 0.12);
  const dietCo2 = Math.round(dietType === 'vegan' ? 120 : dietType === 'vegetarian' ? 180 : 350);
  const energyCo2 = Math.round(electricityKwh * 0.82);
  const shoppingCo2 = Math.round(monthlyShopping === 'minimal' ? 25 : monthlyShopping === 'mindful' ? 55 : 130);

  const totalMonthlyCo2 = transportCo2 + dietCo2 + energyCo2 + shoppingCo2;
  const annualTons = (totalMonthlyCo2 * 12 / 1000).toFixed(2);
  const nationalAvg = 2.4; // India average tons/yr per capita

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-md max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100 dark:border-stone-800">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
            Interactive Lifestyle Audit
          </span>
          <h3 className="text-2xl font-black text-stone-900 dark:text-stone-100 mt-2">
            Personal Carbon Footprint Calculator
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Adjust your monthly habits to see how transport, diet, energy, and shopping shape your footprint.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-center shrink-0">
          <div className="text-xs font-bold text-stone-600 dark:text-stone-300">Annual Emissions</div>
          <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">{annualTons} tons CO₂</div>
          <div className="text-[10px] text-stone-500 font-medium">National Avg: {nationalAvg} tons/yr</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sliders and Selectors */}
        <div className="space-y-5">
          {/* Transport */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300">
                <Car className="w-4 h-4 text-emerald-600" /> Daily Commute (km)
              </span>
              <span className="text-emerald-700 dark:text-emerald-300 font-black">{transportKm} km/day</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              value={transportKm}
              onChange={(e) => setTransportKm(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <div className="text-[11px] text-stone-500">Monthly: ~{transportCo2} kg CO₂</div>
          </div>

          {/* Diet */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300">
                <Utensils className="w-4 h-4 text-emerald-600" /> Primary Diet Style
              </span>
              <span className="text-emerald-700 dark:text-emerald-300 font-black capitalize">{dietType}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {['vegan', 'vegetarian', 'mixed'].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDietType(d)}
                  className={`py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                    dietType === d
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-600'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <div className="text-[11px] text-stone-500">Monthly: ~{dietCo2} kg CO₂</div>
          </div>

          {/* Electricity */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300">
                <Zap className="w-4 h-4 text-emerald-600" /> Monthly Electricity
              </span>
              <span className="text-emerald-700 dark:text-emerald-300 font-black">{electricityKwh} kWh</span>
            </div>
            <input
              type="range"
              min="30"
              max="400"
              value={electricityKwh}
              onChange={(e) => setElectricityKwh(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <div className="text-[11px] text-stone-500">Monthly: ~{energyCo2} kg CO₂</div>
          </div>

          {/* Shopping */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300">
                <ShoppingBag className="w-4 h-4 text-emerald-600" /> Shopping & Packaging Habits
              </span>
              <span className="text-emerald-700 dark:text-emerald-300 font-black capitalize">{monthlyShopping}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {['minimal', 'mindful', 'heavy'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setMonthlyShopping(s)}
                  className={`py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                    monthlyShopping === s
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="text-[11px] text-stone-500">Monthly: ~{shoppingCo2} kg CO₂</div>
          </div>
        </div>

        {/* Breakdown Chart Visualization */}
        <div className="p-6 rounded-3xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex flex-col justify-between space-y-6">
          <div>
            <h4 className="text-sm font-black text-stone-900 dark:text-stone-100 mb-1">
              Monthly Emissions Breakdown
            </h4>
            <div className="text-xs text-stone-500 mb-4">Total: {totalMonthlyCo2} kg CO₂ / month</div>

            {/* Visual proportional bars */}
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-bold text-stone-700 dark:text-stone-300 mb-1">
                  <span>🚗 Transport</span>
                  <span>{transportCo2} kg ({Math.round((transportCo2 / totalMonthlyCo2) * 100)}%)</span>
                </div>
                <div className="w-full h-3 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-600 rounded-full" style={{ width: `${(transportCo2 / totalMonthlyCo2) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-stone-700 dark:text-stone-300 mb-1">
                  <span>🥗 Diet & Groceries</span>
                  <span>{dietCo2} kg ({Math.round((dietCo2 / totalMonthlyCo2) * 100)}%)</span>
                </div>
                <div className="w-full h-3 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${(dietCo2 / totalMonthlyCo2) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-stone-700 dark:text-stone-300 mb-1">
                  <span>⚡ Home Energy</span>
                  <span>{energyCo2} kg ({Math.round((energyCo2 / totalMonthlyCo2) * 100)}%)</span>
                </div>
                <div className="w-full h-3 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(energyCo2 / totalMonthlyCo2) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-stone-700 dark:text-stone-300 mb-1">
                  <span>🛍️ Shopping & Goods</span>
                  <span>{shoppingCo2} kg ({Math.round((shoppingCo2 / totalMonthlyCo2) * 100)}%)</span>
                </div>
                <div className="w-full h-3 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-600 rounded-full" style={{ width: `${(shoppingCo2 / totalMonthlyCo2) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-emerald-300 dark:border-emerald-800 text-xs text-stone-700 dark:text-stone-300 space-y-1">
            <div className="font-black text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
              <Leaf className="w-4 h-4" /> EcoMart Reduction Impact:
            </div>
            <p className="text-[11px] leading-relaxed">
              By replacing single-use items with EcoMart zero-waste alternatives, you immediately shave ~420 kg CO₂ and eliminate ~18kg of plastic waste per year!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
