import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Radar,
  Brain,
  Globe2
} from 'lucide-react';
import ClaimRadarChart from '../detective/ClaimRadarChart';
import ReasoningExplanationCard from '../EcoAgent/ReasoningExplanationCard';

export default function AppWindowShowcase() {
  const [activeTab, setActiveTab] = useState('radar');

  return (
    <section className="py-16 md:py-24 bg-surface relative overflow-hidden" id="showcase">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-primary/8 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-raised border border-line text-primary font-mono text-[11px] font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Live Component Showcase
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-heading tracking-tight">
            An interface engineered for radical transparency
          </h2>
          <p className="text-sm font-sans text-text-secondary leading-relaxed">
            Every score has a breakdown. Every claim is cross-checked against independent registries. Test the live components directly below.
          </p>
        </div>

        {/* Framed Mockup Window */}
        <div className="rounded-3xl border border-line bg-surface-raised shadow-soft-xl overflow-hidden text-text">
          {/* Window Chrome Header */}
          <div className="px-5 py-3.5 bg-surface-sunken border-b border-line flex items-center justify-between gap-4">
            {/* Window control dots */}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600/40" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600/40" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600/40" />
              <span className="ml-3 font-mono text-[11px] text-text-muted hidden sm:inline">
                ecomart.local/dashboard/live-audit
              </span>
            </div>

            {/* Window title & live badge */}
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
                LOCAL AUDIT ENGINE
              </span>
            </div>
          </div>

          {/* Window Subnav / Tab switcher */}
          <div className="px-5 py-2.5 bg-surface/50 border-b border-line flex items-center gap-2 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('radar')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-sans font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'radar'
                  ? 'bg-surface-raised text-heading shadow-soft-xs border border-line'
                  : 'text-text-muted hover:text-heading'
              }`}
            >
              <Radar className="w-3.5 h-3.5 text-primary" />
              <span>5-Axis Claim Radar</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reasoning')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-sans font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'reasoning'
                  ? 'bg-surface-raised text-heading shadow-soft-xs border border-line'
                  : 'text-text-muted hover:text-heading'
              }`}
            >
              <Brain className="w-3.5 h-3.5 text-primary" />
              <span>Explainable AI &amp; ELI10</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('fairness')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-sans font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'fairness'
                  ? 'bg-surface-raised text-heading shadow-soft-xs border border-line'
                  : 'text-text-muted hover:text-heading'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5 text-primary" />
              <span>Fairness Parity Matrix</span>
            </button>
          </div>

          {/* Window Content Pane */}
          <div className="p-6 md:p-8 bg-surface space-y-6">
            {activeTab === 'radar' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-heading">
                      Live ISO 14021 Claim Decomposition
                    </h3>
                    <p className="text-xs text-text-secondary">
                      Compare an unaudited market claim with an EcoMart verified sustainable alternative.
                    </p>
                  </div>
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-1 text-xs font-mono text-primary font-bold hover:underline"
                  >
                    View in Catalog →
                  </Link>
                </div>

                <ClaimRadarChart
                  claimA={{
                    label: 'Market Item: "100% Eco-Pure Botanical Extract"',
                    axes: {
                      vague_wording: 22,
                      verifiable_proof: 18,
                      certification: 12,
                      specificity: 28,
                      comparison_basis: 30
                    }
                  }}
                  claimB={{
                    label: 'EcoMart Audited Item (Organic Bamboo Brush)',
                    axes: {
                      vague_wording: 94,
                      verifiable_proof: 90,
                      certification: 96,
                      specificity: 92,
                      comparison_basis: 88
                    }
                  }}
                />
              </div>
            )}

            {activeTab === 'reasoning' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-heading">
                      Explainable Reasoning &amp; Energy Meter
                    </h3>
                    <p className="text-xs text-text-secondary">
                      Exposing the AI's internal decision factors, assumptions, confidence grade, and energy cost per response.
                    </p>
                  </div>
                  <Link
                    to="/impact"
                    className="inline-flex items-center gap-1 text-xs font-mono text-primary font-bold hover:underline"
                  >
                    Explore Telemetry →
                  </Link>
                </div>

                <div className="p-5 rounded-2xl bg-surface-sunken border border-line space-y-4">
                  <div className="text-xs text-heading font-medium">
                    &ldquo;Solid castile shampoo bars eliminate 100% of single-use plastic bottles and avoid shipping 80% water weight by volume. However, cold-water hair rinsing may require an adjustment period for hard-water households.&rdquo;
                  </div>

                  <ReasoningExplanationCard
                    initiallyOpen={true}
                    reasoningSummary="Recommendation balances plastic packaging elimination against municipal water hardness tolerance. Selected from 12 personal care SKUs with verified palm-oil-free saponification."
                    sourcesOrAssumptions={[
                      "Formula: 100% saponified coconut & olive oils (RSPO certified)",
                      "Packaging: Unbleached post-consumer recycled cardboard (FSC certified)",
                      "Water Saved: ~750ml municipal water avoided in manufacturing formulation"
                    ]}
                    confidence="high"
                    estimatedEnergyWh={0.11}
                    model="Gemini 1.5 Flash (Deterministic Sample)"
                    messageId="showcase-msg-1"
                    query="Why do you recommend solid shampoo bars?"
                  />
                </div>
              </div>
            )}

            {activeTab === 'fairness' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-heading">
                      Cross-Linguistic Parity &amp; Equity Audit
                    </h3>
                    <p className="text-xs text-text-secondary">
                      Verifying that non-English queries and low-budget personas receive equally honest, non-predatory advice.
                    </p>
                  </div>
                  <Link
                    to="/fairness"
                    className="inline-flex items-center gap-1 text-xs font-mono text-primary font-bold hover:underline"
                  >
                    Launch Full Fairness Lab →
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-surface-sunken border border-line space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-heading">English Persona</span>
                      <span className="text-[10px] font-mono text-primary font-bold">Base Benchmark</span>
                    </div>
                    <p className="text-xs text-text-muted italic">&ldquo;Zero waste kitchen essentials&rdquo;</p>
                    <div className="text-[11px] text-text-secondary pt-1 border-t border-line/60">
                      Recommendation: Coconut scrub pad (₹79), Steel containers (₹349).
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface-sunken border border-line space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-heading">Hindi (Devanagari)</span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">95% Parity</span>
                    </div>
                    <p className="text-xs text-text-muted italic">&ldquo;किचन के लिए शून्य-अपशिष्ट विकल्प&rdquo;</p>
                    <div className="text-[11px] text-text-secondary pt-1 border-t border-line/60">
                      Recommendation: नारियल फाइबर स्क्रबर (₹79), स्टील डिब्बे (₹349).
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface-sunken border border-line space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-heading">Student Persona</span>
                      <span className="text-[10px] font-mono text-amber-400 font-bold">91% Parity</span>
                    </div>
                    <p className="text-xs text-text-muted italic">&ldquo;Hostel room zero waste on tight budget&rdquo;</p>
                    <div className="text-[11px] text-text-secondary pt-1 border-t border-line/60">
                      Recommendation: Multi-use coconut scrub (₹79), DIY repurposing advice.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
