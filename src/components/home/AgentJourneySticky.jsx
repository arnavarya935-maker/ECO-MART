import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    title: 'Understand',
    tagline: 'Semantic Intent & Constraint Extraction',
    description:
      'Ingests raw conversational shopping lists, typed notes, voice transcriptions, or barcode scans. Extracts target categories, quantities, unit preferences, and maximum budget thresholds entirely on-device.',
    engine: 'Offline Regex & Intent Tokenizer',
    visual: {
      type: 'tokens',
      input: '"toothbrush, shampoo, dish soap under ₹800"',
      parsed: [
        { key: 'Item 1', val: 'Toothbrush (Personal Care)', flag: 'Plastic Risk' },
        { key: 'Item 2', val: 'Shampoo (Bottled Liquid)', flag: 'Water & Plastic' },
        { key: 'Item 3', val: 'Dish Soap (Synthetic Surfactant)', flag: 'Chemical Toxins' },
        { key: 'Budget', val: 'Max ₹800 Ceiling', flag: 'Hard Constraint' },
      ],
    },
  },
  {
    num: '02',
    title: 'Match',
    tagline: 'Deterministic Catalog Matching',
    description:
      'Scans our verified offline catalog of sustainable Indian cottage artisan goods. Identifies functional equivalents that eliminate petroleum plastics and toxic petrochemicals.',
    engine: 'Cradle-to-Grave Knowledge Graph',
    visual: {
      type: 'matrix',
      matches: [
        { original: 'Plastic Toothbrush', matched: 'Organic Bamboo Toothbrush', delta: '-80g Plastic' },
        { original: 'Bottle Shampoo', matched: 'Solid Neem Shampoo Bar', delta: '-100% Water Shipped' },
        { original: 'Synthetic Dish Soap', matched: 'Coconut Coir & Dish Brick', delta: 'Zero Microplastics' },
      ],
    },
  },
  {
    num: '03',
    title: 'Optimise',
    tagline: 'Multi-Criteria Knapsack Solver',
    description:
      'Runs a client-side multi-objective knapsack optimizer. Maximizes collective EcoScore and carbon reduction while guaranteeing the final cart stays strictly below the user’s budget.',
    engine: 'Dynamic Programming Optimization',
    visual: {
      type: 'knapsack',
      budget: '₹800 Max',
      cartCost: '₹678 Total',
      savings: '₹122 Under Budget',
      carbonReduced: '84.2% Lower Footprint',
      plasticAvoided: '320g Diverted',
    },
  },
  {
    num: '04',
    title: 'Explain',
    tagline: 'Auditable Decision Transparency',
    description:
      'Generates a step-by-step reasoning trace with transparent data citations. The judge and user can inspect why each swap was made, down to transport kilometers and packaging degradation times.',
    engine: 'Verifiable Trace Generator',
    visual: {
      type: 'trace',
      steps: [
        '1. Audited bamboo cultivation: zero synthetic fertilizer, FSC certified.',
        '2. Validated packaging: 100% post-consumer recycled unbleached kraft.',
        '3. Evaluated logistics: artisan cluster in Tamil Nadu (<600km transit).',
        '4. Lifecycle verified: 180-day backyard compostable certification.',
      ],
    },
  },
];

export default function AgentJourneySticky() {
  const [activeStep, setActiveStep] = useState(0);
  const current = STEPS[activeStep];

  return (
    <section
      id="agent-journey"
      aria-labelledby="journey-heading"
      className="relative bg-surface py-20 md:py-28 border-b border-line"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        {/* Eyebrow */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-line pb-8">
          <div>
            <div className="font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-primary flex items-center gap-2">
              <span>03</span>
              <span className="w-4 h-px bg-primary/40" />
              <span>DECISION PIPELINE</span>
            </div>
            <h2
              id="journey-heading"
              className="mt-3 font-sans text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-heading text-balance"
            >
              How the Eco Agent works.
            </h2>
          </div>
          <p className="max-w-[34ch] text-xs sm:text-sm text-text-secondary leading-relaxed font-sans">
            A deterministic 4-stage pipeline that runs offline in under 45ms.
          </p>
        </div>

        {/* 2-Column Layout: Steps on Left, Sticky Schematic Visualizer on Right */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Numbered Step Cards (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            {STEPS.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => setActiveStep(idx)}
                  className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-surface-raised border-primary/40 shadow-soft-md'
                      : 'bg-surface-raised/30 border-line hover:border-line-subtle/80 hover:bg-surface-raised/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-mono text-xs font-bold tracking-wider ${
                        isActive ? 'text-primary' : 'text-text-muted'
                      }`}
                    >
                      STEP {step.num}
                    </span>
                    <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
                      {step.engine}
                    </span>
                  </div>

                  <h3 className="mt-2 font-sans text-xl font-bold tracking-tight text-heading">
                    {step.title} · <span className="font-normal text-text-secondary text-sm">{step.tagline}</span>
                  </h3>

                  <p className="mt-3 font-sans text-xs sm:text-sm text-text-secondary leading-relaxed">
                    {step.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right Column: Sticky Live Schematic Display (6 Cols) */}
          <div className="lg:col-span-6 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-line bg-surface-sunken p-6 sm:p-8 relative overflow-hidden shadow-soft-lg">
              {/* Header of Schematic */}
              <div className="flex items-center justify-between border-b border-line pb-4 font-mono text-[11px] text-text-muted uppercase tracking-wider">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                  <span>PIPELINE INSPECTOR</span>
                </span>
                <span className="text-primary font-bold">{current.num} / 04 ACTIVE</span>
              </div>

              {/* Dynamic Content based on activeStep */}
              <div className="mt-6 min-h-[320px] flex flex-col justify-between">
                {current.visual.type === 'tokens' && (
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg bg-surface border border-line font-mono text-xs text-text-muted">
                      <span className="text-primary font-bold">RAW INPUT: </span>
                      <span className="text-heading font-medium">{current.visual.input}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="font-mono text-[10px] uppercase text-text-muted tracking-wider">
                        Extracted Token Graph:
                      </div>
                      {current.visual.parsed.map((item) => (
                        <div
                          key={item.key}
                          className="flex items-center justify-between p-2.5 rounded-md bg-surface/70 border border-line font-mono text-xs"
                        >
                          <span className="text-text-secondary">{item.val}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                            {item.flag}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {current.visual.type === 'matrix' && (
                  <div className="space-y-4">
                    <div className="font-mono text-[10px] uppercase text-text-muted tracking-wider">
                      Zero-Waste Swap Matcher:
                    </div>
                    {current.visual.matches.map((m) => (
                      <div
                        key={m.original}
                        className="p-3 rounded-lg bg-surface border border-line space-y-1.5"
                      >
                        <div className="flex items-center justify-between font-mono text-xs">
                          <span className="line-through text-text-muted">{m.original}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-primary" />
                          <span className="text-primary font-semibold">{m.matched}</span>
                        </div>
                        <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{m.delta}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {current.visual.type === 'knapsack' && (
                  <div className="space-y-4">
                    <div className="font-mono text-[10px] uppercase text-text-muted tracking-wider">
                      Budget & Impact Optimization:
                    </div>
                    <div className="p-4 rounded-xl bg-surface border border-line space-y-3">
                      <div className="flex justify-between items-center font-mono text-xs">
                        <span className="text-text-muted">Constraint Bound:</span>
                        <span className="text-heading font-bold">{current.visual.budget}</span>
                      </div>
                      <div className="w-full bg-surface-sunken h-2 rounded-full overflow-hidden border border-line">
                        <div className="bg-primary h-full w-[84%] rounded-full" />
                      </div>
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-emerald-400 font-bold">{current.visual.cartCost}</span>
                        <span className="text-text-muted">{current.visual.savings}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-3 rounded-lg bg-surface border border-line font-mono">
                        <div className="text-[10px] text-text-muted uppercase">Carbon Cut</div>
                        <div className="text-sm font-bold text-primary mt-1">{current.visual.carbonReduced}</div>
                      </div>
                      <div className="p-3 rounded-lg bg-surface border border-line font-mono">
                        <div className="text-[10px] text-text-muted uppercase">Plastics Saved</div>
                        <div className="text-sm font-bold text-heading mt-1">{current.visual.plasticAvoided}</div>
                      </div>
                    </div>
                  </div>
                )}

                {current.visual.type === 'trace' && (
                  <div className="space-y-3">
                    <div className="font-mono text-[10px] uppercase text-text-muted tracking-wider">
                      Auditable Decision Trace:
                    </div>
                    {current.visual.steps.map((st, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-lg bg-surface border border-line font-mono text-[11px] text-text-secondary leading-snug flex items-start gap-2"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{st}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer of Schematic: Status Bar */}
                <div className="mt-6 pt-4 border-t border-line/60 flex items-center justify-between font-mono text-[10px] text-text-muted">
                  <span>LATENCY: &lt;45ms LOCAL</span>
                  <span className="text-primary font-semibold">100% CLIENT COMPLIANT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
