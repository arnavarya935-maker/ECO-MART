import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  FileCheck,
  BarChart,
  Eye,
  ArrowUpRight
} from 'lucide-react';
import { ETHICAL_GUARDRAILS } from '../../lib/ai/guardrailsEngine';

const BOARD_RULES = [
  {
    id: 'never_invent_cert',
    ruleNumber: 'Rule 1',
    name: 'Never Invent Certification',
    description: 'Refuses fabricated standards or nonexistent ISO codes (e.g. ISO-99999). Only accredited registries (FSC, GOTS, USDA, CPCB) are accepted.',
    status: 'Enforced',
    statusColor: 'emerald',
    icon: FileCheck
  },
  {
    id: 'never_invent_stats',
    ruleNumber: 'Rule 2',
    name: 'Never Invent Statistics',
    description: 'Grounded in published lifecycle assessment benchmarks. Approximate illustrative figures are strictly labeled as estimates.',
    status: 'Enforced',
    statusColor: 'emerald',
    icon: BarChart
  },
  {
    id: 'refuse_greenwash',
    ruleNumber: 'Rule 3',
    name: 'Refuse Greenwashing',
    description: 'Intercepts demands to validate vague marketing buzzwords ("100% eco pure", "zero pollution") and mandates trade-off disclosure.',
    status: 'Enforced',
    statusColor: 'emerald',
    icon: ShieldCheck
  },
  {
    id: 'protect_privacy',
    ruleNumber: 'Rule 4',
    name: 'Protect Privacy & Zero PII',
    description: 'Client-side query sanitization strips personal names, telephone numbers, and email patterns before prompt dispatch. No PII in Black Box.',
    status: 'Enforced',
    statusColor: 'emerald',
    icon: Lock
  },
  {
    id: 'block_prompt_leak',
    ruleNumber: 'Rule 5',
    name: 'Block Injection & Jailbreak',
    description: 'Catches DAN-style system overrides, developer prompt extraction attempts, and confidential key probes at the proxy filter boundary.',
    status: 'Blocked',
    statusColor: 'amber',
    icon: ShieldAlert
  }
];

export default function GuardrailsBoard() {
  return (
    <section className="py-16 bg-surface-sunken/40 border-b border-line" id="guardrails">
      <div className="max-w-6xl mx-auto px-6 md:px-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
              AI Ethics Board
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-heading mt-1">
              Deterministic Guardrail Status
            </h2>
          </div>
          <Link
            to="/playground"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-raised border border-primary/30 text-primary hover:bg-primary/10 text-xs font-mono font-semibold transition cursor-pointer"
          >
            <span>Launch Adversarial Playground</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {BOARD_RULES.map((rule) => {
            const Icon = rule.icon;
            const isBlocked = rule.status === 'Blocked';
            return (
              <div
                key={rule.id}
                className="p-5 rounded-3xl bg-surface border border-line hover:border-primary/40 transition-all flex flex-col justify-between space-y-4 shadow-soft-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-text-muted uppercase">
                      {rule.ruleNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                        isBlocked
                          ? 'bg-amber-400/10 text-amber-300 border border-amber-400/30'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      ● {rule.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-surface-raised border border-line flex items-center justify-center text-primary shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-serif text-base font-bold text-heading leading-tight">
                      {rule.name}
                    </h3>
                  </div>

                  <p className="text-xs font-sans text-text-secondary leading-relaxed">
                    {rule.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-line/60 flex items-center justify-between text-[11px] font-mono text-text-muted">
                  <span>Audit Engine</span>
                  <span className="text-primary font-semibold">Active &amp; Enforced</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
