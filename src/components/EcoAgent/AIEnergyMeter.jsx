import React, { useState } from 'react';
import { Zap, HelpCircle, X, Cpu, Leaf, Info } from 'lucide-react';

/**
 * AI Energy Meter
 * Responsible AI Showcase Component for CBSE Competition.
 * Measures and transparently reports estimated inference energy per query
 * and session cumulative total, clearly labeled as an estimate.
 */
export default function AIEnergyMeter({
  totalSessionWh = 0.24,
  lastQueryWh = 0.12,
  queryCount = 2,
  compact = false
}) {
  const [showExplainer, setShowExplainer] = useState(false);

  // Equivalences based on Indian Grid average (~450g CO2/kWh)
  // 1 Wh = 0.001 kWh -> ~0.45g CO2e
  const totalCo2Grams = (totalSessionWh * 0.45).toFixed(2);
  const ledBulbSeconds = Math.round((totalSessionWh / 10) * 3600); // 10W LED bulb

  if (compact) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowExplainer(true)}
          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-surface-sunken hover:bg-surface-raised border border-line text-[10px] text-text-secondary hover:text-heading transition-all cursor-pointer font-mono group"
          title="Click to view responsible AI energy breakdown"
          aria-label="AI Energy Meter: click for compute footprint estimate"
        >
          <Zap className="w-3 h-3 text-amber-400 group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-text">AI Compute:</span>
          <span className="text-emerald-400 font-bold">~{totalSessionWh.toFixed(2)} Wh</span>
          <span className="text-[9px] text-text-muted px-1 py-0.2 rounded bg-surface border border-line">
            est.
          </span>
        </button>

        {showExplainer && (
          <EnergyExplainerModal
            totalSessionWh={totalSessionWh}
            lastQueryWh={lastQueryWh}
            queryCount={queryCount}
            totalCo2Grams={totalCo2Grams}
            ledBulbSeconds={ledBulbSeconds}
            onClose={() => setShowExplainer(false)}
          />
        )}
      </>
    );
  }

  return (
    <div className="p-3.5 rounded-2xl bg-surface-raised border border-line text-text text-xs space-y-3 shadow-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-amber-400/10 border border-amber-400/25 text-amber-400 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div>
            <div className="font-sans font-bold text-xs text-heading flex items-center gap-1.5">
              <span>AI Compute Energy Meter</span>
              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded font-mono font-semibold bg-amber-400/10 text-amber-400 border border-amber-400/20">
                Estimate
              </span>
            </div>
            <div className="text-[10px] text-text-muted">
              Audited inference footprint for responsible AI
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowExplainer(true)}
          className="p-1 rounded-lg text-text-muted hover:text-heading hover:bg-surface transition-colors cursor-pointer"
          aria-label="Learn about AI energy estimates"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 rounded-xl bg-surface-sunken border border-line">
          <div className="text-[10px] text-text-muted">Current Session</div>
          <div className="text-sm font-mono font-bold text-emerald-400">
            ~{totalSessionWh.toFixed(2)} Wh
          </div>
          <div className="text-[9px] text-text-muted font-mono">{queryCount} queries</div>
        </div>

        <div className="p-2 rounded-xl bg-surface-sunken border border-line">
          <div className="text-[10px] text-text-muted">Per Response</div>
          <div className="text-sm font-mono font-bold text-heading">
            ~{lastQueryWh.toFixed(2)} Wh
          </div>
          <div className="text-[9px] text-text-muted font-mono">Gemini 1.5 Flash</div>
        </div>

        <div className="p-2 rounded-xl bg-surface-sunken border border-line">
          <div className="text-[10px] text-text-muted">Carbon Equiv.</div>
          <div className="text-sm font-mono font-bold text-amber-400">
            ~{totalCo2Grams}g CO₂e
          </div>
          <div className="text-[9px] text-text-muted font-mono">{ledBulbSeconds}s LED lamp</div>
        </div>
      </div>

      {/* Visual Energy Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] text-text-muted">
          <span>Model efficiency budget (Max 1.0 Wh)</span>
          <span className="font-mono text-emerald-400 font-semibold">
            {Math.min(100, Math.round((totalSessionWh / 1.0) * 100))}%
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-surface-sunken border border-line overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(8, (totalSessionWh / 1.0) * 100))}%` }}
          />
        </div>
      </div>

      {showExplainer && (
        <EnergyExplainerModal
          totalSessionWh={totalSessionWh}
          lastQueryWh={lastQueryWh}
          queryCount={queryCount}
          totalCo2Grams={totalCo2Grams}
          ledBulbSeconds={ledBulbSeconds}
          onClose={() => setShowExplainer(false)}
        />
      )}
    </div>
  );
}

function EnergyExplainerModal({
  totalSessionWh,
  lastQueryWh,
  queryCount,
  totalCo2Grams,
  ledBulbSeconds,
  onClose
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="energy-explainer-title"
      className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
    >
      <div className="w-full max-w-md rounded-3xl bg-surface border border-line p-5 space-y-4 shadow-soft-xl text-text animate-scale-up">
        <div className="flex items-center justify-between pb-3 border-b border-line">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-400 flex items-center justify-center">
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 id="energy-explainer-title" className="font-sans font-bold text-sm text-heading">
                Why Does an Eco App Track AI Energy?
              </h3>
              <p className="text-[10px] text-text-muted">
                CBSE Responsible AI Principle: Algorithmic Transparency
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-text-muted hover:text-heading hover:bg-surface-raised cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-text-secondary">
          <div className="p-3 rounded-2xl bg-surface-raised border border-line flex items-start gap-2.5">
            <Cpu className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-heading block">Compute Cost of Intelligence</span>
              <span>
                Running large language models (LLMs) requires tensor computations on cloud GPUs (like NVIDIA H100s or Google TPUs). A single prompt inference consumes roughly <strong>0.10 to 0.15 Watt-hours (Wh)</strong> of electricity, depending on context length.
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-surface-raised border border-line flex items-start gap-2.5">
            <Leaf className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-heading block">EcoMart's Optimization Strategy</span>
              <span>
                To minimize digital carbon waste, EcoMart employs:
              </span>
              <ul className="list-disc pl-4 mt-1 space-y-1 text-[11px]">
                <li><strong>Local deterministic caching:</strong> repetitive queries run 100% on device with 0 Wh cloud draw.</li>
                <li><strong>Gemini 1.5 Flash:</strong> chosen specifically for its lightweight parameter footprint compared to 1.5 Pro.</li>
                <li><strong>Hard token limits:</strong> constrained output schemas prevent token bloat.</li>
              </ul>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-200 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300 block">Auditing & Labeling Rule</span>
              <span>
                All compute values are explicitly declared as <strong>estimates</strong> based on published data center Power Usage Effectiveness (PUE) of 1.15. We never present synthetic estimates as measured laboratory facts.
              </span>
            </div>
          </div>
        </div>

        {/* Current Session Summary */}
        <div className="p-3 rounded-2xl bg-surface-sunken border border-line font-mono text-[11px] space-y-1">
          <div className="flex justify-between text-text-muted">
            <span>Session Queries:</span>
            <span className="text-heading">{queryCount}</span>
          </div>
          <div className="flex justify-between text-text-muted">
            <span>Latest Query Footprint:</span>
            <span className="text-emerald-400">~{lastQueryWh.toFixed(2)} Wh</span>
          </div>
          <div className="flex justify-between text-text-muted">
            <span>Cumulative Energy:</span>
            <span className="text-emerald-400 font-bold">~{totalSessionWh.toFixed(2)} Wh</span>
          </div>
          <div className="flex justify-between text-text-muted">
            <span>Estimated Carbon:</span>
            <span className="text-amber-400">~{totalCo2Grams}g CO₂e ({ledBulbSeconds}s 10W LED)</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast font-bold text-xs transition-colors cursor-pointer shadow-soft-xs"
        >
          Understood & Close
        </button>
      </div>
    </div>
  );
}
