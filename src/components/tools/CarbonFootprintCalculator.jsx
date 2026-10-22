import React, { useState } from 'react';
import { Car, Utensils, Zap, ShoppingBag, Leaf } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

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

  const chartData = [
    { name: 'Transport', co2: transportCo2, fill: 'var(--color-secondary)' },
    { name: 'Diet', co2: dietCo2, fill: 'var(--color-primary)' },
    { name: 'Energy', co2: energyCo2, fill: 'var(--color-accent)' },
    { name: 'Shopping', co2: shoppingCo2, fill: 'var(--color-primary-dark)' }
  ];

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-line shadow-soft-sm max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
            Interactive Lifestyle Audit
          </span>
          <h3 className="text-2xl font-serif font-bold text-heading mt-2">
            Personal Carbon Footprint Calculator
          </h3>
          <p className="text-xs sm:text-sm text-secondary mt-0.5">
            Adjust your monthly habits to see how transport, diet, energy, and shopping shape your footprint.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-surface-sunken border border-line text-center shrink-0">
          <div className="text-xs font-semibold text-muted">Annual Emissions</div>
          <div className="text-2xl font-serif font-bold text-heading">{annualTons} tons CO₂</div>
          <div className="text-[10px] text-muted font-medium">National Avg: {nationalAvg} tons/yr</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sliders and Selectors */}
        <div className="space-y-5">
          {/* Transport */}
          <div className="p-4 rounded-2xl bg-surface-sunken border border-line space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-heading">
                <Car className="w-4 h-4 text-primary" /> Daily Commute (km)
              </span>
              <span className="text-primary font-bold">{transportKm} km/day</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              value={transportKm}
              onChange={(e) => setTransportKm(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer min-h-[44px]"
            />
            <div className="text-[11px] text-muted">Monthly: ~{transportCo2} kg CO₂</div>
          </div>

          {/* Diet */}
          <div className="p-4 rounded-2xl bg-surface-sunken border border-line space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-heading">
                <Utensils className="w-4 h-4 text-primary" /> Primary Diet Style
              </span>
              <span className="text-primary font-bold capitalize">{dietType}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {['vegan', 'vegetarian', 'mixed'].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDietType(d)}
                  className={`py-2 rounded-full text-xs font-medium capitalize transition cursor-pointer min-h-[44px] focus-visible:outline-2 focus-visible:outline-focus ${
                    dietType === d
                      ? 'bg-primary text-primary-contrast shadow-soft-xs'
                      : 'bg-surface text-secondary border border-line hover:bg-surface-sunken'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <div className="text-[11px] text-muted">Monthly: ~{dietCo2} kg CO₂</div>
          </div>

          {/* Electricity */}
          <div className="p-4 rounded-2xl bg-surface-sunken border border-line space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-heading">
                <Zap className="w-4 h-4 text-primary" /> Monthly Electricity
              </span>
              <span className="text-primary font-bold">{electricityKwh} kWh</span>
            </div>
            <input
              type="range"
              min="30"
              max="400"
              value={electricityKwh}
              onChange={(e) => setElectricityKwh(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer min-h-[44px]"
            />
            <div className="text-[11px] text-muted">Monthly: ~{energyCo2} kg CO₂</div>
          </div>

          {/* Shopping */}
          <div className="p-4 rounded-2xl bg-surface-sunken border border-line space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-heading">
                <ShoppingBag className="w-4 h-4 text-primary" /> Shopping & Packaging Habits
              </span>
              <span className="text-primary font-bold capitalize">{monthlyShopping}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {['minimal', 'mindful', 'heavy'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setMonthlyShopping(s)}
                  className={`py-2 rounded-full text-xs font-medium capitalize transition cursor-pointer min-h-[44px] focus-visible:outline-2 focus-visible:outline-focus ${
                    monthlyShopping === s
                      ? 'bg-primary text-primary-contrast shadow-soft-xs'
                      : 'bg-surface text-secondary border border-line hover:bg-surface-sunken'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="text-[11px] text-muted">Monthly: ~{shoppingCo2} kg CO₂</div>
          </div>
        </div>

        {/* Breakdown Chart Visualization */}
        <div className="p-6 rounded-3xl bg-surface-sunken border border-line flex flex-col justify-between space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-heading mb-1">
              Monthly Emissions Breakdown
            </h4>
            <div className="text-xs text-muted mb-3">Total: {totalMonthlyCo2} kg CO₂ / month</div>

            {/* Recharts Bar Chart */}
            <div className="w-full h-36 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(val) => [`${val} kg CO₂`, 'Emissions']}
                    contentStyle={{ borderRadius: '16px', fontSize: '11px', fontWeight: '600', backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-line)', color: 'var(--color-text)', boxShadow: 'var(--shadow-soft-md)' }}
                  />
                  <Bar dataKey="co2" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Accessible screen-reader table alternative */}
            <div className="sr-only">
              <table>
                <caption>Monthly Carbon Emissions Breakdown</caption>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Emissions (kg CO₂)</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((item) => (
                    <tr key={item.name}>
                      <td>{item.name}</td>
                      <td>{item.co2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-medium text-text mb-1">
                  <span>🚗 Transport</span>
                  <span>{transportCo2} kg ({Math.round((transportCo2 / totalMonthlyCo2) * 100)}%)</span>
                </div>
                <div className="w-full h-2.5 bg-line rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full transition-all" style={{ width: `${(transportCo2 / totalMonthlyCo2) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium text-text mb-1">
                  <span>🥗 Diet & Groceries</span>
                  <span>{dietCo2} kg ({Math.round((dietCo2 / totalMonthlyCo2) * 100)}%)</span>
                </div>
                <div className="w-full h-2.5 bg-line rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(dietCo2 / totalMonthlyCo2) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium text-text mb-1">
                  <span>⚡ Home Energy</span>
                  <span>{energyCo2} kg ({Math.round((energyCo2 / totalMonthlyCo2) * 100)}%)</span>
                </div>
                <div className="w-full h-2.5 bg-line rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${(energyCo2 / totalMonthlyCo2) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium text-text mb-1">
                  <span>🛍️ Shopping & Goods</span>
                  <span>{shoppingCo2} kg ({Math.round((shoppingCo2 / totalMonthlyCo2) * 100)}%)</span>
                </div>
                <div className="w-full h-2.5 bg-line rounded-full overflow-hidden">
                  <div className="h-full bg-primary-dark rounded-full transition-all" style={{ width: `${(shoppingCo2 / totalMonthlyCo2) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface border border-primary/20 text-xs text-text space-y-1">
            <div className="font-semibold text-primary flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-primary" /> EcoMart Reduction Impact:
            </div>
            <p className="text-[11px] leading-relaxed text-secondary">
              By replacing single-use items with EcoMart zero-waste alternatives, you immediately shave ~420 kg CO₂ and eliminate ~18kg of plastic waste per year!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
