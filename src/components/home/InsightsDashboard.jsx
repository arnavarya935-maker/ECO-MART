import React from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Wind,
  CheckCircle2
} from 'lucide-react';
import CategoryCarbonBarChart from '../impact/CategoryCarbonBarChart';

const SAMPLE_COMPARISONS = [
  {
    name: 'Bamboo Toothbrush',
    material: '100% Moso Bamboo',
    carbon: 0.12,
    plastic: 0,
    trustScore: 96,
    verdict: 'Pass • GOTS/FSC'
  },
  {
    name: 'Conventional Plastic Brush',
    material: 'Virgin Polypropylene',
    carbon: 0.84,
    plastic: 18,
    trustScore: 24,
    verdict: 'Deceptive "Eco-Pure"'
  },
  {
    name: 'Solid Shampoo Bar',
    material: 'Saponified Coconut Oil',
    carbon: 0.28,
    plastic: 0,
    trustScore: 92,
    verdict: 'Pass • Zero Bottle'
  },
  {
    name: 'Stainless Steel Flask (1L)',
    material: 'Food-Grade 304 Steel',
    carbon: 2.1,
    plastic: 0,
    trustScore: 95,
    verdict: 'Pass • Infinite Life'
  }
];

export default function InsightsDashboard() {
  return (
    <section className="py-16 bg-surface-sunken/40 border-b border-line" id="insights">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
              Empirical Intelligence
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-heading mt-1">
              Insights &amp; Impact Telemetry
            </h2>
          </div>
          <Link
            to="/impact"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-primary hover:underline"
          >
            <span>Open Full Impact Command Center →</span>
          </Link>
        </div>

        {/* 3 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-surface border border-line shadow-soft-xs">
            <div className="flex items-center justify-between text-xs font-mono text-text-muted">
              <span>LIFECYCLE CARBON AUDITED</span>
              <Wind className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-serif font-bold text-heading mt-2">
              184.2 <span className="text-sm font-sans text-text-muted font-normal">kg CO₂e</span>
            </div>
            <div className="text-[10px] font-mono text-emerald-400 mt-1">
              Calculated across 64 catalog SKUs
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface border border-line shadow-soft-xs">
            <div className="flex items-center justify-between text-xs font-mono text-text-muted">
              <span>ESTIMATED SESSION ENERGY</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-serif font-bold text-heading mt-2">
              0.48 <span className="text-sm font-sans text-text-muted font-normal">Wh</span>
            </div>
            <div className="text-[10px] font-mono text-amber-300 mt-1">
              Estimate • ~3.2 min of 9W LED bulb light
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface border border-line shadow-soft-xs">
            <div className="flex items-center justify-between text-xs font-mono text-text-muted">
              <span>VERIFICATION ACCURACY</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-serif font-bold text-heading mt-2">
              98.2%
            </div>
            <div className="text-[10px] font-mono text-primary mt-1">
              Zero unverified certifications allowed
            </div>
          </div>
        </div>

        {/* Session Energy Bar Strip */}
        <div className="p-5 rounded-2xl bg-surface border border-line space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-1.5 text-heading font-semibold">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              AI Compute Footprint (Estimated vs LED Bulb Equivalent)
            </span>
            <span className="text-text-muted text-[10px]">
              Assumptions: ~0.12 Wh per 1K output tokens on inference
            </span>
          </div>

          <div className="w-full h-3 bg-surface-sunken rounded-full overflow-hidden border border-line flex">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
              style={{ width: '18%' }}
              title="Agent Inference Energy (18% of session budget)"
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-text-muted pt-0.5">
            <span>0.00 Wh (Baseline)</span>
            <span className="text-primary font-bold">0.48 Wh (Current Session Estimate)</span>
            <span>2.50 Wh (1 Hour LED Bulb Cap)</span>
          </div>
        </div>

        {/* Category Carbon Bar Chart */}
        <div className="rounded-3xl bg-surface border border-line p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-heading">
              Cradle-to-Gate Category Footprint
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-sunken text-emerald-400 border border-line">
              Interactive Drill-Down Ready
            </span>
          </div>
          <CategoryCarbonBarChart />
        </div>

        {/* Product-vs-Check Table */}
        <div className="rounded-3xl bg-surface border border-line p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-heading">
                Product vs Verification Matrix
              </h3>
              <p className="text-xs text-text-secondary">
                Comparing audited sustainable choices against conventional market items.
              </p>
            </div>
            <span className="text-[10px] font-mono text-text-muted">
              Sample Data • Verified Audit
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-sans text-left">
              <thead>
                <tr className="border-b border-line text-[10px] font-mono text-text-muted uppercase tracking-wider">
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3">Material Composition</th>
                  <th className="py-2.5 px-3">Carbon (kg)</th>
                  <th className="py-2.5 px-3">Plastic (g)</th>
                  <th className="py-2.5 px-3">Trust Score</th>
                  <th className="py-2.5 px-3">Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {SAMPLE_COMPARISONS.map((p) => (
                  <tr key={p.name} className="hover:bg-surface-sunken/60 transition-colors">
                    <td className="py-3 px-3 font-semibold text-heading">{p.name}</td>
                    <td className="py-3 px-3 text-text-secondary">{p.material}</td>
                    <td className="py-3 px-3 font-mono">{p.carbon}</td>
                    <td className="py-3 px-3 font-mono">{p.plastic}</td>
                    <td className="py-3 px-3 font-mono font-bold">
                      <span className={p.trustScore >= 80 ? 'text-emerald-400' : 'text-rose-400'}>
                        {p.trustScore}/100
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-text-secondary">{p.verdict}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
