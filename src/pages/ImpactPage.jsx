import React, { useState } from 'react';
import ImpactDashboard from '../components/ImpactDashboard';
import YearAheadProjection from '../components/impact/YearAheadProjection';
import PurposeReportModal from '../components/impact/PurposeReportModal';
import CategoryCarbonBarChart from '../components/impact/CategoryCarbonBarChart';
import HabitLineChart from '../components/impact/HabitLineChart';
import TrustScoreHistogram from '../components/impact/TrustScoreHistogram';
import WhatIfCartSimulator from '../components/impact/WhatIfCartSimulator';
import { useCart } from '../context/CartContext';
import { Droplets, Ban, Wind, Activity, Sliders, BarChart3 } from 'lucide-react';

export default function ImpactPage() {
  const { setIsAgentOpen } = useCart();
  const [purposeReportOpen, setPurposeReportOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('command_center'); // 'command_center' | 'what_if' | 'cart_ledger'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-fade-in pb-24">
      {/* Top Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-3.5 py-1 rounded-full inline-block">
          Tangible Planetary Accounting • CBSE DLD 2026
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-heading tracking-tight">
          Impact Command Center & Ledger
        </h1>
        <p className="text-sm sm:text-base text-secondary leading-relaxed max-w-2xl mx-auto">
          Shopping responsibly shouldn't be an abstract feeling. Every item added or swapped calculates exact
          grams of plastic diverted, kilograms of CO₂ avoided, and litres of water saved according to ISO 14040.
        </p>

        {/* Navigation Mode Pill Tabs */}
        <div className="pt-3 flex justify-center">
          <div className="flex p-1 bg-surface-sunken border border-line rounded-full text-xs font-mono">
            <button
              onClick={() => setActiveTab('command_center')}
              className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'command_center'
                  ? 'bg-primary text-primary-contrast font-bold shadow-soft-sm'
                  : 'text-secondary hover:text-heading'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Command Charts
            </button>
            <button
              onClick={() => setActiveTab('what_if')}
              className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'what_if'
                  ? 'bg-primary text-primary-contrast font-bold shadow-soft-sm'
                  : 'text-secondary hover:text-heading'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              What-If Simulator
            </button>
            <button
              onClick={() => setActiveTab('cart_ledger')}
              className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'cart_ledger'
                  ? 'bg-primary text-primary-contrast font-bold shadow-soft-sm'
                  : 'text-secondary hover:text-heading'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              Live Cart Ledger
            </button>
          </div>
        </div>
      </div>

      {/* Mode 1: Interactive Command Center Charts */}
      {activeTab === 'command_center' && (
        <div className="space-y-10 animate-fade-in">
          {/* 1. Category Carbon Estimate with Drill-Down */}
          <CategoryCarbonBarChart />

          {/* 2. Habit Trajectory Line Chart */}
          <HabitLineChart />

          {/* 3. Greenwashing Trust Score Histogram */}
          <TrustScoreHistogram />
        </div>
      )}

      {/* Mode 2: What-If Cart Simulator */}
      {activeTab === 'what_if' && (
        <div className="animate-fade-in space-y-8">
          <WhatIfCartSimulator />
        </div>
      )}

      {/* Mode 3: Live Cart Ledger & Projections */}
      {activeTab === 'cart_ledger' && (
        <div className="animate-fade-in space-y-12">
          {/* Main Live Cart Impact Dashboard */}
          <ImpactDashboard showHeader={true} />

          {/* 12-Month Year Ahead Planetary Projection */}
          <YearAheadProjection onOpenPurposeReport={() => setPurposeReportOpen(true)} />
        </div>
      )}

      {/* Purpose Report Export Modal */}
      <PurposeReportModal
        isOpen={purposeReportOpen}
        onClose={() => setPurposeReportOpen(false)}
      />

      {/* Educational Explainer Grid: How Benchmarks Work */}
      <section className="p-6 sm:p-8 rounded-3xl bg-surface border border-line shadow-soft-sm space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Open Scientific Benchmarks
          </span>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-heading mt-1">
            How Are Impact Savings Calculated?
          </h3>
          <p className="text-xs sm:text-sm text-secondary max-w-xl mt-1">
            We map each sustainable item directly against its conventional petrochemical market equivalent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-surface-sunken border border-line space-y-2.5">
            <div className="p-2 w-fit rounded-xl bg-surface text-secondary">
              <Wind className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-sm text-heading">
              CO₂ Lifecycle Delta
            </h4>
            <p className="text-xs text-secondary leading-relaxed">
              Compares cradle-to-gate emissions of virgin plastics and polyesters against organic plant fibres, cold-pressed oils, and salvaged woods.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-surface-sunken border border-line space-y-2.5">
            <div className="p-2 w-fit rounded-xl bg-surface text-accent">
              <Ban className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-sm text-heading">
              Plastic Diversion Formula
            </h4>
            <p className="text-xs text-secondary leading-relaxed">
              Every packaging wrapper, bottle, or synthetic handle eliminated is tracked in exact grams (1 standard 500ml PET bottle ≈ 20 grams of virgin polymer).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-surface-sunken border border-line space-y-2.5">
            <div className="p-2 w-fit rounded-xl bg-surface text-primary">
              <Droplets className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-sm text-heading">
              Freshwater Conservation
            </h4>
            <p className="text-xs text-secondary leading-relaxed">
              Waterless solid shampoo formulas and rain-fed jute/bamboo crops consume up to 90% less freshwater than chemical mill cotton or petrochemical synthesis.
            </p>
          </div>
        </div>
      </section>

      {/* Action Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 sm:p-8 rounded-3xl bg-primary text-primary-contrast gap-4 shadow-soft-md border border-primary">
        <div>
          <div className="font-serif font-bold text-lg sm:text-xl text-primary-contrast">Want to test what-if scenarios on your custom list?</div>
          <p className="text-xs sm:text-sm text-primary-contrast/80 mt-1">
            Let the Eco Agent inspect your selections and suggest 1-tap swaps.
          </p>
        </div>
        <button
          onClick={() => setIsAgentOpen(true)}
          className="px-6 py-3 rounded-full bg-surface text-heading hover:bg-surface-sunken transition font-bold text-xs uppercase tracking-wider shrink-0 cursor-pointer shadow-soft-sm"
        >
          Launch Eco Agent
        </button>
      </div>
    </div>
  );
}
