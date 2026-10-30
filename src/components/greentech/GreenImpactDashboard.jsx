import React, { useState } from 'react';
import { BarChart3, TrendingUp, Droplets, Trash2, Wind, ShieldCheck, Download, RefreshCw } from 'lucide-react';

const TIME_HORIZONS = [
  { id: 'month', label: 'This Month' },
  { id: 'quarter', label: 'Last Quarter' },
  { id: 'ytd', label: 'Year to Date' },
  { id: 'all', label: 'Cumulative All-Time' }
];

const METRICS_DATA = {
  month: {
    wasteDivertedTons: 14.8,
    runoffPreventedLiters: 285400,
    co2eAvoidedMT: 42.8,
    circularCompliancePct: 98.4,
    facilitiesServed: 128,
    chartPoints: [22, 38, 45, 62, 78, 88, 98]
  },
  quarter: {
    wasteDivertedTons: 46.2,
    runoffPreventedLiters: 890100,
    co2eAvoidedMT: 134.5,
    circularCompliancePct: 97.9,
    facilitiesServed: 340,
    chartPoints: [30, 48, 65, 80, 110, 125, 142]
  },
  ytd: {
    wasteDivertedTons: 182.5,
    runoffPreventedLiters: 3410000,
    co2eAvoidedMT: 512.0,
    circularCompliancePct: 98.8,
    facilitiesServed: 820,
    chartPoints: [50, 75, 110, 160, 210, 280, 360]
  },
  all: {
    wasteDivertedTons: 640.0,
    runoffPreventedLiters: 12800000,
    co2eAvoidedMT: 1890.0,
    circularCompliancePct: 99.1,
    facilitiesServed: 1940,
    chartPoints: [100, 190, 320, 510, 780, 1100, 1500]
  }
};

export default function GreenImpactDashboard() {
  const [timeHorizon, setTimeHorizon] = useState('month');
  const [sectorFilter, setSectorFilter] = useState('all');

  const current = METRICS_DATA[timeHorizon];

  // Helper for circular progress SVG strokeDashoffset (circumference = 2 * PI * 40 ≈ 251.2)
  const circleCircumference = 251.2;
  const progressOffset = circleCircumference - (circleCircumference * (current.circularCompliancePct / 100));

  return (
    <section id="impact-dashboard" className="py-16 sm:py-24 bg-white border-y border-[#0F3D2E]/8 relative overflow-hidden">
      {/* Background Micro Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(#0F3D2E_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-[120px] relative">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F3D2E] bg-[#2ECC71]/20 border border-[#2ECC71]/40 px-3 py-1 rounded-full inline-block">
              Telemetry & Science Dashboard
            </span>
            <h2 className="text-3xl sm:text-4xl font-sans font-bold text-[#0F3D2E] tracking-tight">
              Real-Time Ecological Telemetry
            </h2>
            <p className="text-sm sm:text-base text-[#2C3E50] leading-relaxed">
              Transparent reporting of material diversion and toxin eradication across all active commercial campuses and residential client properties.
            </p>
          </div>

          {/* Time Horizon Segmented Filter */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#F0F5F2] border border-[#0F3D2E]/8 self-start lg:self-auto">
            {TIME_HORIZONS.map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => setTimeHorizon(h.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer min-h-[38px] ${
                  timeHorizon === h.id
                    ? 'bg-[#0F3D2E] text-white shadow-soft-xs'
                    : 'text-[#2C3E50] hover:text-[#0F3D2E]'
                }`}
              >
                {h.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Main Data KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {/* Card 1: Waste Diverted */}
          <div className="p-6 rounded-3xl bg-[#F0F5F2]/70 border border-[#0F3D2E]/8 shadow-[0px_10px_30px_rgba(15,61,46,0.03)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase font-bold text-[#2C3E50]/70">Solid Waste</span>
              <div className="w-8 h-8 rounded-xl bg-[#2ECC71]/15 flex items-center justify-center">
                <Trash2 className="w-4 h-4 text-[#0F3D2E]" />
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-mono font-bold text-[#0F3D2E] tracking-tight">
                {current.wasteDivertedTons} <span className="text-sm font-sans font-semibold text-[#2C3E50]">MT</span>
              </div>
              <div className="text-xs font-semibold text-[#2ECC71] mt-1 flex items-center gap-1 font-mono">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+18.4% diversion vs baseline</span>
              </div>
            </div>
            <p className="text-[11px] text-[#2C3E50]/75 border-t border-[#0F3D2E]/8 pt-2.5">
              Decentralized composting & closed-loop paper/plastic segregation.
            </p>
          </div>

          {/* Card 2: Chemical Runoff */}
          <div className="p-6 rounded-3xl bg-[#F0F5F2]/70 border border-[#0F3D2E]/8 shadow-[0px_10px_30px_rgba(15,61,46,0.03)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase font-bold text-[#2C3E50]/70">Water Integrity</span>
              <div className="w-8 h-8 rounded-xl bg-[#2ECC71]/15 flex items-center justify-center">
                <Droplets className="w-4 h-4 text-[#0F3D2E]" />
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-mono font-bold text-[#0F3D2E] tracking-tight">
                {(current.runoffPreventedLiters / 1000).toFixed(1)}k <span className="text-sm font-sans font-semibold text-[#2C3E50]">Liters</span>
              </div>
              <div className="text-xs font-semibold text-[#2ECC71] mt-1 flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero VOC effluent</span>
              </div>
            </div>
            <p className="text-[11px] text-[#2C3E50]/75 border-t border-[#0F3D2E]/8 pt-2.5">
              Persistent quaternary ammonium & chlorine runoff eliminated.
            </p>
          </div>

          {/* Card 3: Carbon Avoided */}
          <div className="p-6 rounded-3xl bg-[#F0F5F2]/70 border border-[#0F3D2E]/8 shadow-[0px_10px_30px_rgba(15,61,46,0.03)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase font-bold text-[#2C3E50]/70">Climate Impact</span>
              <div className="w-8 h-8 rounded-xl bg-[#2ECC71]/15 flex items-center justify-center">
                <Wind className="w-4 h-4 text-[#0F3D2E]" />
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-mono font-bold text-[#0F3D2E] tracking-tight">
                {current.co2eAvoidedMT} <span className="text-sm font-sans font-semibold text-[#2C3E50]">MT CO2e</span>
              </div>
              <div className="text-xs font-semibold text-[#2ECC71] mt-1 flex items-center gap-1 font-mono">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Methane prevention</span>
              </div>
            </div>
            <p className="text-[11px] text-[#2C3E50]/75 border-t border-[#0F3D2E]/8 pt-2.5">
              Avoided landfill anaerobic emissions from organic waste degradation.
            </p>
          </div>

          {/* Card 4: Circular Compliance Gauge */}
          <div className="p-6 rounded-3xl bg-[#F0F5F2]/70 border border-[#0F3D2E]/8 shadow-[0px_10px_30px_rgba(15,61,46,0.03)] flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono uppercase font-bold text-[#2C3E50]/70">Compliance</span>
              <div className="text-3xl sm:text-4xl font-mono font-bold text-[#0F3D2E] mt-1">
                {current.circularCompliancePct}%
              </div>
              <div className="text-[11px] font-semibold text-[#0F3D2E] mt-1">
                Zero-Waste Protocol
              </div>
              <p className="text-[10px] text-[#2C3E50]/70 mt-1">
                {current.facilitiesServed} active clients
              </p>
            </div>

            {/* Circular Progress Indicator */}
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#0F3D2E"
                  strokeWidth="8"
                  strokeOpacity="0.1"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#2ECC71"
                  strokeWidth="8"
                  strokeDasharray={circleCircumference}
                  strokeDashoffset={progressOffset}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <span className="absolute font-mono font-bold text-xs text-[#0F3D2E]">
                {current.circularCompliancePct}%
              </span>
            </div>
          </div>
        </div>

        {/* Vector Curve Chart: Monthly Cumulative Diversion Telemetry */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#F0F5F2]/40 border border-[#0F3D2E]/8 shadow-[0px_10px_30px_rgba(15,61,46,0.02)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h4 className="font-sans font-bold text-base text-[#0F3D2E]">
                Cumulative Material Recovery & Diversion Curve
              </h4>
              <p className="text-xs text-[#2C3E50]/80">
                Smooth vector spline telemetry computed across all certified residential clusters and B2B corporate facilities.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-[#0F3D2E]">
                <span className="w-3 h-3 rounded-full bg-[#2ECC71]" /> Metric Tons Diverted
              </span>
            </div>
          </div>

          {/* SVG Vector Chart */}
          <div className="w-full h-48 sm:h-56 relative pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2ECC71" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#2ECC71" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="50" x2="700" y2="50" stroke="#0F3D2E" strokeOpacity="0.08" strokeDasharray="4 4" />
              <line x1="0" y1="100" x2="700" y2="100" stroke="#0F3D2E" strokeOpacity="0.08" strokeDasharray="4 4" />
              <line x1="0" y1="150" x2="700" y2="150" stroke="#0F3D2E" strokeOpacity="0.08" strokeDasharray="4 4" />

              {/* Area Fill */}
              <path
                d="M 0 170 Q 116 140, 233 110 T 466 60 T 700 20 L 700 190 L 0 190 Z"
                fill="url(#curveGradient)"
              />

              {/* Spline Line */}
              <path
                d="M 0 170 Q 116 140, 233 110 T 466 60 T 700 20"
                fill="none"
                stroke="#2ECC71"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Data Point Markers */}
              {[
                { x: 0, y: 170 },
                { x: 116, y: 145 },
                { x: 233, y: 110 },
                { x: 350, y: 85 },
                { x: 466, y: 60 },
                { x: 583, y: 38 },
                { x: 700, y: 20 }
              ].map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r="5"
                  fill="#0F3D2E"
                  stroke="#2ECC71"
                  strokeWidth="2.5"
                />
              ))}
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between text-[11px] font-mono text-[#2C3E50]/70 pt-3">
              <span>Wk 1</span>
              <span>Wk 2</span>
              <span>Wk 3</span>
              <span>Wk 4</span>
              <span>Wk 5</span>
              <span>Wk 6</span>
              <span>Active Cycle</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
