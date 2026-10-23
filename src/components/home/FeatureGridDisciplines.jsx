import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FeatureGridDisciplines() {
  return (
    <section id="disciplines" aria-labelledby="disciplines-heading" className="relative bg-surface py-20 md:py-28 border-b border-line">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        {/* Section Header with Numbered Eyebrow */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-line pb-8">
          <div>
            <div className="font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-primary flex items-center gap-2">
              <span>01</span>
              <span className="w-4 h-px bg-primary/40" />
              <span>CORE ARCHITECTURE</span>
            </div>
            <h2 id="disciplines-heading" className="mt-3 font-sans text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-heading text-balance">
              Four disciplines. One closed-loop system.
            </h2>
          </div>
          <p className="max-w-[34ch] text-xs sm:text-sm text-text-secondary leading-relaxed font-sans">
            How EcoMart replaces guesswork with mathematical rigor, client-side intelligence, and verified lifecycle data.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: 0-100 EcoScore Engine (Col span 2 on md or large card) */}
          <article className="svc-card group flex flex-col justify-between" aria-label="EcoScore Lifecycle Engine">
            {/* Live Mini-Visual: Animated SVG Gauge */}
            <div className="w-full h-44 sm:h-48 rounded-xl bg-surface-sunken/80 border border-line p-4 flex items-center justify-between overflow-hidden relative">
              <div className="absolute inset-0 bg-radial-at-c from-primary/10 via-transparent to-transparent pointer-events-none" />

              {/* Gauge Left: Circular Progress Ring */}
              <div className="relative flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.08)" strokeWidth="6" fill="none" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#10B981"
                    strokeWidth="6"
                    strokeDasharray="251.2"
                    strokeDashoffset="25"
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-mono text-2xl sm:text-3xl font-bold text-heading leading-none">96</span>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-primary font-bold mt-0.5">Grade A</span>
                </div>
              </div>

              {/* Gauge Right: Algorithmic Breakdown Bars */}
              <div className="flex-1 pl-6 space-y-2.5 font-mono text-[10px] text-text-secondary">
                <div>
                  <div className="flex justify-between text-heading font-medium">
                    <span>Renewable Materials (30%)</span>
                    <span className="text-primary font-bold">28.5</span>
                  </div>
                  <div className="w-full h-1 bg-surface-raised rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-primary rounded-full w-[95%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-heading font-medium">
                    <span>Lifecycle Carbon (25%)</span>
                    <span className="text-primary font-bold">24.0</span>
                  </div>
                  <div className="w-full h-1 bg-surface-raised rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-primary rounded-full w-[96%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-heading font-medium">
                    <span>Zero Plastic Packaging (20%)</span>
                    <span className="text-primary font-bold">20.0</span>
                  </div>
                  <div className="w-full h-1 bg-surface-raised rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-primary rounded-full w-[100%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-sans text-lg font-bold text-heading">Life-Cycle EcoScore Engine</h3>
                <p className="mt-1.5 text-xs text-text-secondary leading-relaxed max-w-md">
                  Transparent 0–100 algorithmic grading evaluating raw materials, packaging degradation, transport emissions, and third-party certifications.
                </p>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0 font-bold">
                AUDITED
              </span>
            </div>
          </article>

          {/* Card 2: Cart Knapsack Optimizer */}
          <article className="svc-card group flex flex-col justify-between" aria-label="Cart Knapsack Optimizer">
            {/* Live Mini-Visual: Animated Before/After Knapsack Swap */}
            <div className="w-full h-44 sm:h-48 rounded-xl bg-surface-sunken/80 border border-line p-4 flex flex-col justify-center overflow-hidden relative">
              <div className="flex items-center justify-between px-2">
                {/* Conventional Item */}
                <div className="flex items-center gap-3 bg-surface-raised/70 border border-line px-3 py-2 rounded-xl">
                  <div className="w-3 h-3 rounded-full bg-red-400/80 animate-pulse" />
                  <div>
                    <div className="text-[11px] font-mono text-heading font-semibold">Plastic Bottle</div>
                    <div className="text-[9px] font-mono text-text-muted">₹299 · 78g Plastic</div>
                  </div>
                </div>

                {/* Animated Arrow */}
                <div className="flex flex-col items-center px-2">
                  <div className="w-12 h-px bg-gradient-to-r from-red-400 to-primary relative">
                    <span className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-primary animate-ping" />
                  </div>
                  <span className="text-[9px] font-mono text-primary uppercase font-bold mt-1">Swap</span>
                </div>

                {/* Eco Swapped Item */}
                <div className="flex items-center gap-3 bg-surface-raised border border-primary/40 px-3 py-2 rounded-xl shadow-soft-sm">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <div>
                    <div className="text-[11px] font-mono text-heading font-semibold">Copper Bottle</div>
                    <div className="text-[9px] font-mono text-primary font-bold">Grade A · 0g Plastic</div>
                  </div>
                </div>
              </div>

              {/* Knapsack Budget Constraint Meter */}
              <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between text-[10px] font-mono">
                <span className="text-text-muted">Knapsack Cap: ₹1,500</span>
                <span className="text-primary font-bold">Optimized Cart: ₹1,496 (Headroom: ₹4)</span>
              </div>
            </div>

            <div className="mt-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-sans text-lg font-bold text-heading">Multiple-Choice Knapsack Optimizer</h3>
                <p className="mt-1.5 text-xs text-text-secondary leading-relaxed max-w-md">
                  Exact dynamic programming (DP) maximizes ecological impact gain while strictly respecting household budget limits.
                </p>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20 shrink-0 font-bold">
                EXACT DP
              </span>
            </div>
          </article>

          {/* Card 3: Zero Greenwashing Audit */}
          <article className="svc-card group flex flex-col justify-between" aria-label="Zero Greenwashing Audit">
            {/* Live Mini-Visual: Verification Badges & Metrics */}
            <div className="w-full h-44 sm:h-48 rounded-xl bg-surface-sunken/80 border border-line p-4 flex flex-col justify-center overflow-hidden relative">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded-lg bg-surface-raised/70 border border-line">
                  <div className="text-[10px] font-mono text-text-muted uppercase">Chemical Screening</div>
                  <div className="text-xs font-mono font-bold text-heading mt-0.5">0 Synthetic Dyes</div>
                  <div className="text-[9px] font-mono text-primary mt-1">✓ Passed 14 Criteria</div>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-raised/70 border border-line">
                  <div className="text-[10px] font-mono text-text-muted uppercase">Packaging Metric</div>
                  <div className="text-xs font-mono font-bold text-heading mt-0.5">100% Compostable</div>
                  <div className="text-[9px] font-mono text-primary mt-1">✓ Kraft & Seed Paper</div>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-raised/70 border border-line">
                  <div className="text-[10px] font-mono text-text-muted uppercase">Supply Radius</div>
                  <div className="text-xs font-mono font-bold text-heading mt-0.5">&lt; 200 km Made</div>
                  <div className="text-[9px] font-mono text-primary mt-1">✓ Regional Artisans</div>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-raised/70 border border-line">
                  <div className="text-[10px] font-mono text-text-muted uppercase">Third-Party Certs</div>
                  <div className="text-xs font-mono font-bold text-heading mt-0.5">FSC · PETA · USDA</div>
                  <div className="text-[9px] font-mono text-primary mt-1">✓ Cryptographically Checked</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-sans text-lg font-bold text-heading">Zero-Greenwashing Verification</h3>
                <p className="mt-1.5 text-xs text-text-secondary leading-relaxed max-w-md">
                  Algorithmic screening prevents deceptive buzzwords by validating raw materials against strict circular economy criteria.
                </p>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0 font-bold">
                AUDITED
              </span>
            </div>
          </article>

          {/* Card 4: Client-Side Offline Architecture */}
          <article className="svc-card group flex flex-col justify-between" aria-label="100% Offline Architecture">
            {/* Live Mini-Visual: Offline Topology Diagram */}
            <div className="w-full h-44 sm:h-48 rounded-xl bg-surface-sunken/80 border border-line p-4 flex flex-col justify-center items-center overflow-hidden relative">
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full border border-line bg-surface-raised flex items-center justify-center text-primary font-mono text-xs font-bold shadow-soft-sm">
                    Client
                  </div>
                  <span className="text-[9px] font-mono text-text-muted mt-1">Browser Engine</span>
                </div>

                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <div className="w-12 h-px bg-primary/40" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full border border-primary/40 bg-primary/10 flex items-center justify-center text-primary font-mono text-xs font-bold shadow-soft-sm">
                    Agent
                  </div>
                  <span className="text-[9px] font-mono text-text-muted mt-1">Local Knapsack</span>
                </div>
              </div>

              <div className="mt-4 px-3 py-1 rounded-full bg-surface-raised border border-line text-[10px] font-mono text-text-secondary flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>Zero Cloud Dependency · 100% Private Offline Execution</span>
              </div>
            </div>

            <div className="mt-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-sans text-lg font-bold text-heading">100% Offline-Native Architecture</h3>
                <p className="mt-1.5 text-xs text-text-secondary leading-relaxed max-w-md">
                  All intent matching, fuzzy dictionaries, and knapsack optimizations run in local JavaScript without pinging remote servers.
                </p>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0 font-bold">
                AIR-GAPPED
              </span>
            </div>
          </article>
        </div>

        {/* Section Bottom Link */}
        <div className="mt-12 flex justify-start">
          <Link
            to="/how-it-works"
            className="group inline-flex min-h-[44px] items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted hover:text-primary transition-colors"
          >
            <span>Explore Scientific Methodology</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
