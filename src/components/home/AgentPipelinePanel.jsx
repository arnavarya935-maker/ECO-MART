import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Radar,
  Wind,
  RotateCcw,
  Terminal,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const TELEMETRY_LOGS = [
  '[ORCHESTRATOR] Query dispatched: "Recommend zero-waste morning routine"',
  '[GUARDRAIL-01] ISO Certification check: No hallucinated standards requested... PASS',
  '[CLAIM-CHECKER] Scanning 12 catalog candidates for deceptive buzzwords... 0 flags',
  '[CARBON-ESTIMATOR] Computing cradle-to-gate LCA deltas vs conventional items... DONE',
  '[SECOND-LIFE] Circular trajectory calculated: Moso bamboo 120-day soil compost',
  '[JSON-VALIDATOR] Output schema conformant { answer, confidence: "high", energyWh: 0.09 }',
  '[TELEMETRY] Query finished in 48ms. Written to append-only Black Box store.'
];

export default function AgentPipelinePanel() {
  const { reduceEffects } = useTheme();
  const [logIndex, setLogIndex] = useState(0);

  useEffect(() => {
    if (reduceEffects) return;
    const interval = setInterval(() => {
      setLogIndex((prev) => (prev + 1) % TELEMETRY_LOGS.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [reduceEffects]);

  return (
    <section className="py-16 bg-surface border-b border-line" id="pipeline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Steps taken
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-heading mt-1">
              Autonomous Eco Agent pipeline
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
            <span className="px-2.5 py-1 rounded-full bg-surface-raised border border-line text-emerald-400 font-semibold">
              Deterministic Rule Engine
            </span>
          </div>
        </div>

        {/* Live Counters Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-surface-raised border border-line">
            <div className="text-[11px] font-mono text-text-muted uppercase">Checks Evaluated</div>
            <div className="text-2xl font-serif font-bold text-heading mt-1">142</div>
            <div className="text-[10px] font-mono text-emerald-400 mt-0.5">
              Sample data • Session simulation
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface-raised border border-line">
            <div className="text-[11px] font-mono text-text-muted uppercase">Guardrails Held</div>
            <div className="text-2xl font-serif font-bold text-amber-400 mt-1">19 Intercepts</div>
            <div className="text-[10px] font-mono text-text-muted mt-0.5">
              Adversarial Attacks Refused
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface-raised border border-line">
            <div className="text-[11px] font-mono text-text-muted uppercase">Avg Decision Confidence</div>
            <div className="text-2xl font-serif font-bold text-primary mt-1">96.4%</div>
            <div className="text-[10px] font-mono text-primary mt-0.5">
              Checked against claim rules
            </div>
          </div>
        </div>

        {/* Pipeline Architecture Diagram */}
        <div className="p-6 md:p-8 rounded-3xl bg-surface-raised border border-line space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Node 1: Orchestrator */}
            <div className="p-4 rounded-2xl bg-surface border border-primary/30 space-y-2 text-center md:text-left shadow-soft-xs">
              <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/30 text-primary flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <div className="font-serif font-bold text-sm text-heading">1. Orchestrator</div>
                <div className="text-[11px] font-mono text-text-muted">Prompt Sanitizer &amp; Intent Parser</div>
              </div>
              <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                PII Stripped
              </span>
            </div>

            {/* Middle 3 Workers (Span 2 cols on md) */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-3 rounded-2xl bg-surface-sunken border border-line text-center space-y-1.5">
                <Radar className="w-4 h-4 text-primary mx-auto" />
                <div className="text-xs font-bold text-heading">Claim Checker</div>
                <div className="text-[9px] font-mono text-text-muted">5-Axis Radar</div>
              </div>

              <div className="p-3 rounded-2xl bg-surface-sunken border border-line text-center space-y-1.5">
                <Wind className="w-4 h-4 text-teal-400 mx-auto" />
                <div className="text-xs font-bold text-heading">Carbon Estimator</div>
                <div className="text-[9px] font-mono text-text-muted">Cradle-to-Gate</div>
              </div>

              <div className="p-3 rounded-2xl bg-surface-sunken border border-line text-center space-y-1.5">
                <RotateCcw className="w-4 h-4 text-emerald-400 mx-auto" />
                <div className="text-xs font-bold text-heading">Second Life</div>
                <div className="text-[9px] font-mono text-text-muted">Circular End-of-Life</div>
              </div>
            </div>

            {/* Node 3: Output Validator */}
            <div className="p-4 rounded-2xl bg-surface border border-primary/30 space-y-2 text-center md:text-left shadow-soft-xs">
              <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/30 text-primary flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="font-serif font-bold text-sm text-heading">3. JSON Validator</div>
                <div className="text-[11px] font-mono text-text-muted">Output Guardrail Enforcer</div>
              </div>
              <span className="text-[9px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                Schema Strict
              </span>
            </div>
          </div>

          {/* Live Terminal Typing Log */}
          <div className="rounded-2xl bg-surface-sunken border border-line p-4 font-mono text-xs text-text-secondary space-y-2 overflow-hidden">
            <div className="flex items-center justify-between pb-2 border-b border-line/60 text-[10px] text-text-muted">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-primary" />
                <span>TERMINAL TELEMETRY FEED (AUTONOMOUS LOG)</span>
              </div>
              <span className="text-emerald-400">● EXECUTION LOG</span>
            </div>

            <div className="space-y-1 text-[11px]">
              {TELEMETRY_LOGS.map((log, idx) => {
                const isCurrent = idx === logIndex;
                return (
                  <div
                    key={log}
                    className={`transition-opacity duration-300 ${
                      isCurrent
                        ? 'text-primary font-semibold'
                        : idx < logIndex
                        ? 'text-text-muted opacity-60'
                        : 'text-text-muted opacity-30'
                    }`}
                  >
                    {isCurrent ? '> ' : '  '}
                    {log}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-mono pt-2">
            <Link
              to="/blackbox"
              className="text-primary hover:underline flex items-center gap-1.5 font-semibold"
            >
              <span>Inspect Full Tamper-Evident Black Box Log</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/playground"
              className="text-text-muted hover:text-heading flex items-center gap-1.5"
            >
              <span>Test Guardrail Triggers in AI Sandbox →</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
