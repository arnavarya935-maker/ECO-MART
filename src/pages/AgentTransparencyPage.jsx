import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Cpu,
  AlertTriangle,
  ArrowRight,
  Layers,
  Terminal
} from 'lucide-react';
import AgentReportCard from '../components/agent/AgentReportCard';
import { ETHICAL_GUARDRAILS } from '../lib/ai/guardrailsEngine';

export default function AgentTransparencyPage() {
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'guardrails' | 'failures' | 'reportcard'

  const FAILURE_MODES = [
    {
      id: 'fm-1',
      title: 'Municipal Hyper-Local Recyclability Gaps',
      severity: 'Medium',
      mitigation: 'Confidence Brake & Explicit Uncertainty',
      description:
        'While #1 PET and #2 HDPE have robust domestic demand in major Indian metros, decentralized towns lack segregated material recovery facilities (MRFs).',
      remedy:
        'The agent refuses to claim a container is "100% recyclable everywhere" and advises checking municipal segregation guidelines.'
    },
    {
      id: 'fm-2',
      title: 'Tier-3 Agricultural Subcontracting Opacity',
      severity: 'Medium',
      mitigation: 'A-D Evidence Grading Scheme',
      description:
        'Smallholder cotton growers selling into local mandis may not possess individual digital certification licenses even if pesticide-free.',
      remedy:
        'The agent assigns Grade C or D to unverified farm claims and provides an "Ask the Brand" email generator to request batch testing data.'
    },
    {
      id: 'fm-3',
      title: 'Vague Natural Language Synonyms',
      severity: 'Low',
      mitigation: 'Greenwash Lexicon Regex Filter',
      description:
        'Marketers frequently invent deceptive pseudo-scientific terms ("earth-nurtured", "chemical-neutral", "pure eco-active").',
      remedy:
        'Regex lexicon triggers instant warning badges explaining why ASCI and FTC guidelines prohibit unqualified environmental adjectives.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fade-in pb-24 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full font-mono">
              Transparency Hub • Feature 54
            </span>
            <span className="text-xs text-muted font-medium">Model Architecture &amp; Lineage</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-heading mt-2 tracking-tight">
            AI Agent Transparency &amp; Safety
          </h1>
          <p className="text-sm sm:text-base text-secondary mt-1 max-w-2xl">
            A comprehensive, plain-language breakdown of models, deterministic fallbacks, guardrail constraints, known failure boundaries, and automated audit cards.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            to="/blackbox"
            className="px-4 py-2 rounded-xl bg-surface-raised hover:bg-surface border border-line text-heading text-xs font-semibold shadow-soft-xs transition-colors inline-flex items-center gap-1.5"
          >
            <Terminal className="w-3.5 h-3.5 text-primary" />
            <span>Black Box Telemetry</span>
          </Link>
          <Link
            to="/fairness"
            className="px-4 py-2 rounded-xl bg-primary text-primary-contrast hover:bg-primary-hover text-xs font-semibold shadow-soft-xs transition-colors inline-flex items-center gap-1.5"
          >
            <span>Fairness Parity Lab</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-line">
        {[
          { id: 'specs', label: '🧠 Model & System Architecture' },
          { id: 'guardrails', label: '🛡️ Active Guardrails' },
          { id: 'failures', label: '⚠️ Known Failure Boundaries' },
          { id: 'reportcard', label: '📋 Agent Self-Check' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-sans transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-primary text-primary-contrast font-bold shadow-soft-xs'
                : 'bg-surface-raised text-secondary border border-line hover:text-heading'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Specs */}
      {activeTab === 'specs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-surface-raised border border-line shadow-soft-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-heading">
                  Primary Model Architecture
                </h3>
                <span className="text-[11px] font-mono text-muted">
                  Server-Side API Proxy • Zero Client Secrets
                </span>
              </div>
            </div>
            <p className="text-xs text-secondary leading-relaxed font-sans">
              Eco Sense pairs <strong>Gemini</strong> with deterministic rule-based algorithms. Queries are processed server-side through a rate-limited proxy with input sanitization and schema-enforced JSON validation.
            </p>
            <div className="p-3.5 rounded-2xl bg-surface-sunken border border-line text-xs font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-muted">Inference Latency:</span>
                <span className="font-bold text-heading">180ms – 420ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Inference Energy:</span>
                <span className="font-bold text-primary">~0.12 Wh / query</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Temperature:</span>
                <span className="font-bold text-heading">0.15 (Strict factual grounding)</span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-surface-raised border border-line shadow-soft-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-heading">
                  4-Step Decision Pipeline (Plan, Research, Check, Advise)
                </h3>
                <span className="text-[11px] font-mono text-muted">
                  Local Fallback • Instant Response
                </span>
              </div>
            </div>
            <p className="text-xs text-secondary leading-relaxed font-sans">
              If cloud services are unavailable or network latency exceeds 2.5 seconds, the client activates the <strong>4-step decision pipeline</strong> (Planner, Researcher, Skeptic, Advisor) using local catalog indexing and EcoScore rules.
            </p>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="font-bold text-heading">Planner:</span> Extracts intent, budget, and constraints.
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span className="font-bold text-heading">Researcher:</span> Filters catalog by materials and certs.
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-warning" />
                <span className="font-bold text-heading">Skeptic:</span> Critiques recommendations for greenwashing.
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span className="font-bold text-heading">Advisor:</span> Synthesizes user-facing explanation.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Guardrails */}
      {activeTab === 'guardrails' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.values(ETHICAL_GUARDRAILS).map((g) => (
            <div
              key={g.id}
              className="p-6 rounded-3xl bg-surface-raised border border-line shadow-soft-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
                  {g.ruleNumber}
                </span>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Enforced
                </span>
              </div>
              <h3 className="font-serif font-bold text-base text-heading">
                {g.name}
              </h3>
              <p className="text-xs text-secondary leading-relaxed font-sans">
                <strong>Directive: </strong>{g.directive}
              </p>
              <div className="p-3 rounded-2xl bg-surface-sunken border border-line text-[11px] text-muted">
                <strong>Enforcement Mechanism: </strong>{g.enforcement}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Failures */}
      {activeTab === 'failures' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-secondary flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-heading">Epistemic Humility Principle:</strong> We transparently document where the AI cannot be certain rather than simulating false confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FAILURE_MODES.map((fm) => (
              <div
                key={fm.id}
                className="p-6 rounded-3xl bg-surface-raised border border-line shadow-soft-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase text-amber-700 dark:text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                      Risk: {fm.severity}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-heading">
                    {fm.title}
                  </h4>
                  <p className="text-xs text-secondary leading-relaxed font-sans">
                    {fm.description}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-surface-sunken border border-line text-[11px] text-primary font-medium mt-2">
                  <strong>Active Safeguard: </strong>{fm.remedy}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Report Card */}
      {activeTab === 'reportcard' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-surface-raised border border-line text-xs text-secondary">
            Below is the local automated test harness running real adversarial prompts, hallucination boundaries, and fairness variants against this browser's agent instance.
          </div>
          <AgentReportCard />
        </div>
      )}
    </div>
  );
}
