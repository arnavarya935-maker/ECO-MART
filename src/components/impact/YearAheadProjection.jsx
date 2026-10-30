import React, { useState, useMemo, lazy, Suspense } from 'react';
import {
  Calendar,
  Wind,
  Ban,
  Droplets,
  Coins,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import productsData from '../../data/products.json';
import { calculateEquivalences } from '../../lib/conversionConstants';

// Lazy-load Recharts for performance budget compliance
const ResponsiveContainer = lazy(() =>
  import('recharts').then((m) => ({ default: m.ResponsiveContainer }))
);
const AreaChart = lazy(() =>
  import('recharts').then((m) => ({ default: m.AreaChart }))
);
const Area = lazy(() =>
  import('recharts').then((m) => ({ default: m.Area }))
);
const XAxis = lazy(() =>
  import('recharts').then((m) => ({ default: m.XAxis }))
);
const YAxis = lazy(() =>
  import('recharts').then((m) => ({ default: m.YAxis }))
);
const Tooltip = lazy(() =>
  import('recharts').then((m) => ({ default: m.Tooltip }))
);

const DEFAULT_BASKET_ITEMS = [
  { id: 'prod-001', name: 'Bamboo Cutting Board Set', category: 'Kitchen', price: 649, carbonKg: 0.8, plasticGrams: 0, waterLitres: 45, convCarbonKg: 3.4, convPlasticGrams: 280, convPrice: 499, frequency: 'yearly' },
  { id: 'prod-003', name: 'Organic Neem Shampoo Bar', category: 'Personal Care', price: 249, carbonKg: 0.3, plasticGrams: 0, waterLitres: 12, convCarbonKg: 1.8, convPlasticGrams: 95, convPrice: 320, frequency: 'monthly' },
  { id: 'prod-006', name: 'Beeswax Food Wraps (Pack of 3)', category: 'Kitchen', price: 399, carbonKg: 0.4, plasticGrams: 0, waterLitres: 20, convCarbonKg: 2.1, convPlasticGrams: 150, convPrice: 280, frequency: 'quarterly' },
  { id: 'prod-012', name: 'Plant-Based Laundry Detergent', category: 'Cleaning & Laundry', price: 449, carbonKg: 0.9, plasticGrams: 0, waterLitres: 35, convCarbonKg: 4.2, convPlasticGrams: 320, convPrice: 420, frequency: 'monthly' }
];

const MULTIPLIER_MAP = {
  weekly: 52,
  monthly: 12,
  quarterly: 4,
  yearly: 1
};

export default function YearAheadProjection({ onOpenPurposeReport }) {
  const { cartItems } = useCart();
  const [metricView, setMetricView] = useState('carbon'); // 'carbon' | 'plastic' | 'cost'

  // If user has cart items, derive from cart; otherwise use representative recurring eco basket
  const [itemFrequencies, setItemFrequencies] = useState(() => {
    const initial = {};
    const items = cartItems.length > 0 ? cartItems.map((ci) => ci.product) : DEFAULT_BASKET_ITEMS;
    items.forEach((item) => {
      // Sensible defaults based on category
      if (item.category === 'Personal Care' || item.category === 'Cleaning & Laundry') {
        initial[item.id] = 'monthly';
      } else if (item.category === 'Stationery' || item.category === 'Kitchen') {
        initial[item.id] = 'quarterly';
      } else {
        initial[item.id] = 'yearly';
      }
    });
    return initial;
  });

  const activeItems = useMemo(() => {
    if (cartItems.length > 0) {
      return cartItems.map((ci) => {
        const prod = ci.product;
        const convId = prod.conventionalAlternativeId || prod.conventionalId;
        const conv = convId ? productsData.find((p) => p.id === convId) : null;
        return {
          id: prod.id,
          name: prod.name,
          category: prod.category,
          price: prod.price * ci.quantity,
          carbonKg: (prod.carbonKg || 0.5) * ci.quantity,
          plasticGrams: (prod.plasticGrams || 0) * ci.quantity,
          waterLitres: (prod.waterLitres || 20) * ci.quantity,
          convPrice: (conv ? conv.price : prod.price * 1.1) * ci.quantity,
          convCarbonKg: (conv ? conv.carbonKg : prod.carbonKg * 2.8) * ci.quantity,
          convPlasticGrams: (conv ? conv.plasticGrams : 180) * ci.quantity,
          convWaterLitres: (conv ? conv.waterLitres : prod.waterLitres * 2.2) * ci.quantity
        };
      });
    }
    return DEFAULT_BASKET_ITEMS;
  }, [cartItems]);

  const updateFrequency = (id, freq) => {
    setItemFrequencies((prev) => ({ ...prev, [id]: freq }));
  };

  // Calculate annual totals
  const annualTotals = useMemo(() => {
    let ecoCarbon = 0;
    let convCarbon = 0;
    let ecoPlastic = 0;
    let convPlastic = 0;
    let ecoWater = 0;
    let convWater = 0;
    let ecoCost = 0;
    let convCost = 0;

    activeItems.forEach((item) => {
      const mult = MULTIPLIER_MAP[itemFrequencies[item.id] || 'yearly'] || 1;
      ecoCarbon += item.carbonKg * mult;
      convCarbon += item.convCarbonKg * mult;
      ecoPlastic += item.plasticGrams * mult;
      convPlastic += item.convPlasticGrams * mult;
      ecoWater += item.waterLitres * mult;
      convWater += (item.convWaterLitres || item.waterLitres * 2) * mult;
      ecoCost += item.price * mult;
      convCost += (item.convPrice || item.price * 1.15) * mult;
    });

    const co2Saved = Math.max(0, convCarbon - ecoCarbon);
    const plasticSaved = Math.max(0, convPlastic - ecoPlastic);
    const waterSaved = Math.max(0, convWater - ecoWater);
    const moneySaved = Math.max(0, convCost - ecoCost);

    return {
      ecoCarbon,
      convCarbon,
      co2Saved,
      ecoPlastic,
      convPlastic,
      plasticSaved,
      ecoWater,
      convWater,
      waterSaved,
      ecoCost,
      convCost,
      moneySaved
    };
  }, [activeItems, itemFrequencies]);

  // Generate 12-month projection series
  const projectionSeries = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((m, idx) => {
      const fraction = (idx + 1) / 12;
      return {
        month: m,
        conventionalCarbon: Number((annualTotals.convCarbon * fraction).toFixed(1)),
        ecoMartCarbon: Number((annualTotals.ecoCarbon * fraction).toFixed(1)),
        conventionalPlastic: Number(((annualTotals.convPlastic / 1000) * fraction).toFixed(2)),
        ecoMartPlastic: Number(((annualTotals.ecoPlastic / 1000) * fraction).toFixed(2)),
        conventionalCost: Math.round(annualTotals.convCost * fraction),
        ecoMartCost: Math.round(annualTotals.ecoCost * fraction)
      };
    });
  }, [annualTotals]);

  const equivalences = useMemo(() => {
    return calculateEquivalences({
      co2Kg: annualTotals.co2Saved,
      plasticGrams: annualTotals.plasticSaved,
      waterLitres: annualTotals.waterSaved
    });
  }, [annualTotals]);

  return (
    <div className="bg-surface-raised rounded-3xl border border-line p-6 sm:p-8 shadow-soft-sm space-y-8">
      {/* Header and Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary-subtle text-primary border border-primary/20">
              <Calendar className="w-5 h-5 text-primary" />
            </span>
            <span className="text-xs font-sans font-bold uppercase tracking-wider text-primary">
              12-Month Planetary Projection
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-heading mt-2">
            If You Keep Shopping Like This For 12 Months
          </h2>
          <p className="text-xs sm:text-sm font-sans text-secondary mt-1">
            Configure how frequently you restock items to model your multi-year footprint delta against conventional commercial alternatives.
          </p>
        </div>

        {onOpenPurposeReport && (
          <button
            type="button"
            onClick={onOpenPurposeReport}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary hover:bg-primary-hover text-primary-contrast font-sans font-bold text-xs shadow-soft-sm transition active:scale-95 shrink-0 cursor-pointer min-h-[44px]"
          >
            <FileText className="w-4 h-4 text-primary-contrast" />
            <span>Generate Purpose Report</span>
          </button>
        )}
      </div>

      {/* Rebuy Frequency Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-muted">
            Configure Rebuy Frequency Per Product
          </h3>
          <span className="text-[11px] font-sans text-muted">
            {cartItems.length > 0 ? `Derived from ${cartItems.length} active cart items` : 'Default recurring eco essentials'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {activeItems.map((item) => (
            <div key={item.id} className="p-3.5 rounded-2xl bg-surface-sunken border border-line space-y-2">
              <div className="text-xs font-serif font-bold text-heading line-clamp-1">
                {item.name}
              </div>
              <div className="text-[11px] font-sans text-muted">
                ₹{item.price} • {item.category}
              </div>
              <div className="pt-1">
                <label htmlFor={`freq-${item.id}`} className="sr-only">Rebuy frequency for {item.name}</label>
                <select
                  id={`freq-${item.id}`}
                  value={itemFrequencies[item.id] || 'yearly'}
                  onChange={(e) => updateFrequency(item.id, e.target.value)}
                  className="w-full text-xs font-sans font-semibold rounded-xl bg-surface-raised border border-line py-1.5 px-2.5 text-heading focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
                >
                  <option value="weekly">Weekly (52x/yr)</option>
                  <option value="monthly">Monthly (12x/yr)</option>
                  <option value="quarterly">Quarterly (4x/yr)</option>
                  <option value="yearly">Yearly (1x/yr)</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Annual Projection Highlight Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-primary-subtle border border-primary/20 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-sans font-bold text-primary">
            <Wind className="w-4 h-4" />
            <span>Annual CO₂ Avoided</span>
          </div>
          <div className="text-2xl font-serif font-bold text-heading">
            {annualTotals.co2Saved.toFixed(1)} <span className="text-xs font-sans font-normal text-muted">kg</span>
          </div>
          <div className="text-[10px] font-sans text-primary font-medium">
            Estimate vs conventional market
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-accent-subtle border border-accent/20 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-sans font-bold text-accent">
            <Ban className="w-4 h-4" />
            <span>Plastic Diverted</span>
          </div>
          <div className="text-2xl font-serif font-bold text-heading">
            {(annualTotals.plasticSaved / 1000).toFixed(2)} <span className="text-xs font-sans font-normal text-muted">kg</span>
          </div>
          <div className="text-[10px] font-sans text-accent font-medium">
            Estimate ({annualTotals.plasticSaved}g eliminated)
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-secondary-subtle border border-secondary/20 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-sans font-bold text-secondary">
            <Droplets className="w-4 h-4" />
            <span>Water Conserved</span>
          </div>
          <div className="text-2xl font-serif font-bold text-heading">
            {Math.round(annualTotals.waterSaved)} <span className="text-xs font-sans font-normal text-muted">L</span>
          </div>
          <div className="text-[10px] font-sans text-secondary font-medium">
            Estimate via closed-loop processes
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-sunken border border-line space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-sans font-bold text-heading">
            <Coins className="w-4 h-4 text-primary" />
            <span>Annual Money Saved</span>
          </div>
          <div className="text-2xl font-serif font-bold text-heading">
            ₹{annualTotals.moneySaved.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] font-sans text-muted font-medium">
            Estimate vs throwaway rebuys
          </div>
        </div>
      </div>

      {/* Projection Chart & Path Comparison */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif font-bold text-lg text-heading">
              12-Month Cumulative Trajectory
            </h3>
            <p className="text-xs font-sans text-secondary">
              Comparing conventional consumption vs sample Eco Sense choices over 12 months.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-surface-sunken p-1 rounded-2xl border border-line self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setMetricView('carbon')}
              className={`px-3 py-1.5 rounded-xl text-xs font-sans font-bold transition min-h-[36px] cursor-pointer ${
                metricView === 'carbon' ? 'bg-surface-raised text-heading shadow-soft-xs border border-line' : 'text-muted hover:text-heading'
              }`}
            >
              Carbon (kg)
            </button>
            <button
              type="button"
              onClick={() => setMetricView('plastic')}
              className={`px-3 py-1.5 rounded-xl text-xs font-sans font-bold transition min-h-[36px] cursor-pointer ${
                metricView === 'plastic' ? 'bg-surface-raised text-heading shadow-soft-xs border border-line' : 'text-muted hover:text-heading'
              }`}
            >
              Plastic (kg)
            </button>
            <button
              type="button"
              onClick={() => setMetricView('cost')}
              className={`px-3 py-1.5 rounded-xl text-xs font-sans font-bold transition min-h-[36px] cursor-pointer ${
                metricView === 'cost' ? 'bg-surface-raised text-heading shadow-soft-xs border border-line' : 'text-muted hover:text-heading'
              }`}
            >
              Financial (₹)
            </button>
          </div>
        </div>

        {/* Chart Viewport */}
        <div className="h-64 sm:h-72 w-full bg-surface-sunken rounded-2xl border border-line p-4">
          <Suspense fallback={<div className="h-full flex items-center justify-center text-xs text-muted">Loading projection chart...</div>}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionSeries} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="ecoGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D97706" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#D97706" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="var(--color-muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--color-muted)" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-line)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: 'var(--color-text)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={
                    metricView === 'carbon' ? 'conventionalCarbon' :
                    metricView === 'plastic' ? 'conventionalPlastic' : 'conventionalCost'
                  }
                  name="Conventional Path"
                  stroke="#D97706"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#convGrad)"
                />
                <Area
                  type="monotone"
                  dataKey={
                    metricView === 'carbon' ? 'ecoMartCarbon' :
                    metricView === 'plastic' ? 'ecoMartPlastic' : 'ecoMartCost'
                  }
                  name="Eco Sense Path"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#ecoGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Suspense>
        </div>

        {/* Accessible Alternative Table for Screen Readers & High Accessibility */}
        <div className="sr-only">
          <table>
            <caption>Monthly 12-Month Projection Comparing Conventional Path vs Eco Sense Path</caption>
            <thead>
              <tr>
                <th>Month</th>
                <th>Conventional Path</th>
                <th>Eco Sense Path</th>
              </tr>
            </thead>
            <tbody>
              {projectionSeries.map((row) => (
                <tr key={row.month}>
                  <td>{row.month}</td>
                  <td>{metricView === 'carbon' ? row.conventionalCarbon : metricView === 'plastic' ? row.conventionalPlastic : row.conventionalCost}</td>
                  <td>{metricView === 'carbon' ? row.ecoMartCarbon : metricView === 'plastic' ? row.ecoMartPlastic : row.ecoMartCost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-sans pt-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary" />
            <span className="font-semibold text-heading">Eco Sense Path (Sustainable)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-accent" />
            <span className="font-semibold text-heading">Conventional Path (Petrochemical)</span>
          </div>
        </div>
      </div>

      {/* Human-scale Real World Equivalences */}
      <div className="p-5 rounded-2xl bg-surface-sunken border border-line space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-heading">
            Tangible Equivalence Benchmarks (Approximate)
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-sans">
          <div className="p-3 rounded-xl bg-surface-raised border border-line">
            <div className="text-muted font-medium">Urban Trees Equivalent</div>
            <div className="text-sm font-bold text-heading mt-0.5">{equivalences.trees}</div>
            <div className="text-[10px] text-muted italic">EPA urban absorption standard</div>
          </div>
          <div className="p-3 rounded-xl bg-surface-raised border border-line">
            <div className="text-muted font-medium">Driving Emissions Avoided</div>
            <div className="text-sm font-bold text-heading mt-0.5">{equivalences.kmDriven}</div>
            <div className="text-[10px] text-muted italic">EEA average petrol car standard</div>
          </div>
          <div className="p-3 rounded-xl bg-surface-raised border border-line">
            <div className="text-muted font-medium">Bottles Diverted</div>
            <div className="text-sm font-bold text-heading mt-0.5">{equivalences.bottles}</div>
            <div className="text-[10px] text-muted italic">20g PET bottle weight baseline</div>
          </div>
          <div className="p-3 rounded-xl bg-surface-raised border border-line">
            <div className="text-muted font-medium">Showers Saved</div>
            <div className="text-sm font-bold text-heading mt-0.5">{equivalences.showers}</div>
            <div className="text-[10px] text-muted italic">65L standard shower baseline</div>
          </div>
        </div>
      </div>
    </div>
  );
}
