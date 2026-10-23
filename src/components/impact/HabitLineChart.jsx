import React, { useState, useMemo, useCallback } from 'react';
import { Table, TrendingDown } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function HabitLineChart() {
  const { cartItems } = useCart();
  const [weeks, setWeeks] = useState(12); // 4 | 8 | 12
  const [metric, setMetric] = useState('co2'); // 'co2' | 'plastic' | 'water'
  const [showTable, setShowTable] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Compute baseline weekly savings from current cart or representative household swaps
  const baseWeeklySavings = useMemo(() => {
    let co2 = 1.8; // kg
    let plastic = 120; // grams
    let water = 380; // liters

    if (cartItems && cartItems.length > 0) {
      const cartCo2 = cartItems.reduce((acc, item) => acc + (item.product?.co2Saved || 0.4) * item.quantity, 0);
      const cartPlastic = cartItems.reduce((acc, item) => acc + (item.product?.plasticSaved || 30) * item.quantity, 0);
      const cartWater = cartItems.reduce((acc, item) => acc + (item.product?.waterSaved || 60) * item.quantity, 0);
      if (cartCo2 > 0) co2 = Number(cartCo2.toFixed(2));
      if (cartPlastic > 0) plastic = Math.round(cartPlastic);
      if (cartWater > 0) water = Math.round(cartWater);
    }
    return { co2, plastic, water };
  }, [cartItems]);

  // Generate simulated weekly cumulative trajectory
  const timelineData = useMemo(() => {
    const points = [];
    const count = weeks;
    let cumCO2 = 0;
    let cumPlastic = 0;
    let cumWater = 0;

    for (let w = 1; w <= count; w++) {
      // Compound habit curve: as habit strengthens, adoption increases ~6% weekly
      const growthFactor = 1 + (w - 1) * 0.06;
      cumCO2 += baseWeeklySavings.co2 * growthFactor;
      cumPlastic += baseWeeklySavings.plastic * growthFactor;
      cumWater += baseWeeklySavings.water * growthFactor;

      points.push({
        week: `Week ${w}`,
        weekNum: w,
        co2: Number(cumCO2.toFixed(2)),
        plastic: Math.round(cumPlastic),
        water: Math.round(cumWater)
      });
    }
    return points;
  }, [weeks, baseWeeklySavings]);

  const getMetricVal = useCallback(
    (pt) => (metric === 'co2' ? pt.co2 : metric === 'plastic' ? pt.plastic : pt.water),
    [metric]
  );
  const metricUnit = metric === 'co2' ? 'kg' : metric === 'plastic' ? 'g' : 'L';
  const metricTitle = metric === 'co2' ? 'Cumulative CO₂ Avoided' : metric === 'plastic' ? 'Cumulative Plastic Diverted' : 'Freshwater Conserved';

  const maxVal = Math.max(...timelineData.map(getMetricVal), 1);
  const finalVal = getMetricVal(timelineData[timelineData.length - 1] || {});

  // Generate SVG path coordinates
  const width = 640;
  const height = 220;
  const paddingX = 40;
  const paddingY = 24;

  const svgPoints = useMemo(() => {
    return timelineData.map((pt, i) => {
      const x = paddingX + (i / (timelineData.length - 1 || 1)) * (width - 2 * paddingX);
      const val = getMetricVal(pt);
      const y = height - paddingY - (val / maxVal) * (height - 2 * paddingY);
      return { x, y, pt, val };
    });
  }, [timelineData, getMetricVal, maxVal]);

  const pathD = useMemo(() => {
    if (svgPoints.length === 0) return '';
    return svgPoints.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');
  }, [svgPoints]);

  const areaD = useMemo(() => {
    if (svgPoints.length === 0) return '';
    const firstX = svgPoints[0].x;
    const lastX = svgPoints[svgPoints.length - 1].x;
    const bottomY = height - paddingY;
    return `${pathD} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }, [pathD, svgPoints]);

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-line shadow-card space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary px-2.5 py-0.5 rounded-full bg-secondary/10 border border-secondary/20">
              Session & Habit Forecast
            </span>
            <span className="text-[10px] font-mono text-muted uppercase">
              Compound Habit Model
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-heading">
            {metricTitle} Trajectory
          </h3>
          <p className="text-xs text-secondary">
            Simulated reduction based on sustainable household alternatives over {weeks} consecutive weeks.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe selector */}
          <div className="flex rounded-full p-1 bg-surface-sunken border border-line text-xs font-mono">
            {[4, 8, 12].map((w) => (
              <button
                key={w}
                onClick={() => setWeeks(w)}
                className={`px-3 py-1 rounded-full transition-colors ${weeks === w ? 'bg-primary text-primary-contrast font-bold' : 'text-secondary hover:text-heading'}`}
              >
                {w}W
              </button>
            ))}
          </div>

          {/* Metric Selector */}
          <div className="flex rounded-full p-1 bg-surface-sunken border border-line text-xs font-mono">
            <button
              onClick={() => setMetric('co2')}
              className={`px-3 py-1 rounded-full transition-colors ${metric === 'co2' ? 'bg-secondary text-white font-bold' : 'text-secondary hover:text-heading'}`}
            >
              CO₂
            </button>
            <button
              onClick={() => setMetric('plastic')}
              className={`px-3 py-1 rounded-full transition-colors ${metric === 'plastic' ? 'bg-secondary text-white font-bold' : 'text-secondary hover:text-heading'}`}
            >
              Plastic
            </button>
            <button
              onClick={() => setMetric('water')}
              className={`px-3 py-1 rounded-full transition-colors ${metric === 'water' ? 'bg-secondary text-white font-bold' : 'text-secondary hover:text-heading'}`}
            >
              Water
            </button>
          </div>

          <button
            onClick={() => setShowTable(!showTable)}
            className="text-xs font-mono px-3.5 py-1.5 rounded-full border border-line bg-surface-sunken hover:border-primary/50 text-secondary transition-colors flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-focus"
            aria-label="Toggle accessible tabular view for trajectory chart"
          >
            <Table className="w-3.5 h-3.5" />
            {showTable ? 'View Chart' : 'View Table'}
          </button>
        </div>
      </div>

      {/* Assumptions Banner */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-sunken border border-line/60 text-xs text-secondary flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-primary" />
          <span>Projected {weeks}-Week Cumulative Milestone:</span>
          <span className="font-mono font-bold text-heading text-sm">
            {finalVal} {metricUnit} avoided
          </span>
        </div>
        <span className="text-[10px] font-mono text-muted">
          *Labeled Estimate: Standard ISO 14040 cradle-to-gate substitution benchmark.
        </span>
      </div>

      {showTable ? (
        /* Accessible Table View */
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-secondary border-collapse" aria-label="Simulated habit timeline table">
            <thead>
              <tr className="border-b border-line text-[11px] font-mono uppercase text-muted">
                <th className="py-2.5 px-3">Milestone</th>
                <th className="py-2.5 px-3">CO₂ Avoided (kg)</th>
                <th className="py-2.5 px-3">Plastic Diverted (g)</th>
                <th className="py-2.5 px-3">Freshwater Saved (L)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60 font-mono">
              {timelineData.map((d) => (
                <tr key={d.week} className="hover:bg-surface-sunken/50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-heading">{d.week}</td>
                  <td className="py-2.5 px-3">{d.co2} kg</td>
                  <td className="py-2.5 px-3">{d.plastic} g</td>
                  <td className="py-2.5 px-3">{d.water} L</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Accessible Hand-crafted SVG Chart */
        <div className="space-y-2">
          <div className="relative w-full overflow-hidden bg-surface-sunken rounded-2xl border border-line p-2">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-56 select-none"
              role="img"
              aria-label={`${metricTitle} chart over ${weeks} weeks reaching ${finalVal} ${metricUnit}.`}
            >
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-primary, #10b981)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--color-primary, #10b981)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Gridlines */}
              {[0.25, 0.5, 0.75, 1].map((pct, i) => {
                const y = height - paddingY - pct * (height - 2 * paddingY);
                return (
                  <line
                    key={i}
                    x1={paddingX}
                    y1={y}
                    x2={width - paddingX}
                    y2={y}
                    stroke="currentColor"
                    className="text-line-subtle"
                    strokeDasharray="4 4"
                  />
                );
              })}

              {/* Shaded Area Under Curve */}
              <path d={areaD} fill="url(#lineGradient)" />

              {/* Line Stroke */}
              <path
                d={pathD}
                fill="none"
                stroke="var(--color-primary, #10b981)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Data Nodes */}
              {svgPoints.map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r={hoveredPoint === i ? 6 : 3.5}
                  className="fill-surface stroke-primary cursor-pointer transition-all duration-150"
                  strokeWidth="2.5"
                  onMouseEnter={() => setHoveredPoint(i)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  onFocus={() => setHoveredPoint(i)}
                  onBlur={() => setHoveredPoint(null)}
                  tabIndex={0}
                  aria-label={`${pt.pt.week}: ${pt.val} ${metricUnit}`}
                />
              ))}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredPoint !== null && svgPoints[hoveredPoint] && (
              <div
                className="absolute pointer-events-none p-2 rounded-xl bg-surface border border-primary/50 text-[11px] font-mono shadow-soft-md transform -translate-x-1/2 -translate-y-full"
                style={{
                  left: `${(svgPoints[hoveredPoint].x / width) * 100}%`,
                  top: `${(svgPoints[hoveredPoint].y / height) * 100 - 4}%`
                }}
              >
                <span className="font-semibold text-heading block">{svgPoints[hoveredPoint].pt.week}</span>
                <span className="text-primary font-bold">{svgPoints[hoveredPoint].val} {metricUnit}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center text-[11px] font-mono text-muted px-2">
            <span>Week 1 (Baseline)</span>
            <span>Week {Math.round(weeks / 2)}</span>
            <span>Week {weeks} ({finalVal} {metricUnit})</span>
          </div>
        </div>
      )}
    </div>
  );
}
