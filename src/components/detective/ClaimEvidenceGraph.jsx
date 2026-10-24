import React from 'react';
import { ArrowRight, CheckCircle2, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';

export default function ClaimEvidenceGraph({ evidenceGraph, evidenceGrade, evidenceReason }) {
  if (!evidenceGraph) return null;

  const { claims = [], audits = [], verdict = {} } = evidenceGraph;
  const grade = evidenceGrade || verdict.grade || 'C';
  const reason = evidenceReason || verdict.reason || '';

  const gradeColors = {
    A: {
      badge: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30',
      label: 'Grade A: Strongly Substantiated',
      icon: CheckCircle2
    },
    B: {
      badge: 'bg-teal-500/15 text-teal-800 dark:text-teal-300 border-teal-500/30',
      label: 'Grade B: Moderately Substantiated',
      icon: CheckCircle2
    },
    C: {
      badge: 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30',
      label: 'Grade C: Weak Substantiation',
      icon: AlertTriangle
    },
    D: {
      badge: 'bg-rose-500/15 text-rose-800 dark:text-rose-300 border-rose-500/30',
      label: 'Grade D: High Greenwash Risk / Unsubstantiated',
      icon: XCircle
    }
  }[grade] || {
    badge: 'bg-surface-sunken text-muted border-line',
    label: `Grade ${grade}`,
    icon: HelpCircle
  };

  const VerdictIcon = gradeColors.icon;

  return (
    <div className="bg-surface-raised rounded-3xl p-5 sm:p-6 border border-line shadow-soft-sm space-y-5 text-left">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-xs">
            🌿
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-heading">
              Claim Evidence Graph &amp; Provenance
            </h4>
            <span className="text-xs text-muted font-mono uppercase tracking-wider block">
              Pillar-by-Pillar Verification Matrix
            </span>
          </div>
        </div>

        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${gradeColors.badge}`}>
          Evidence Grade {grade}
        </span>
      </div>

      {/* Visual Multi-Stage Graph */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
        {/* Stage 1: Declared Claims (3 cols) */}
        <div className="md:col-span-3 space-y-2">
          <span className="text-xs font-mono uppercase text-muted tracking-wider block font-bold">
            1. Declared Claims
          </span>
          <div className="space-y-1.5">
            {claims.map((claim) => (
              <div
                key={claim.id}
                className="p-2.5 rounded-xl bg-surface-sunken border border-line text-xs font-semibold text-heading truncate shadow-2xs"
                title={claim.label}
              >
                {claim.label}
              </div>
            ))}
          </div>
        </div>

        {/* Connector 1 (1 col) */}
        <div className="hidden md:flex md:col-span-1 justify-center text-muted">
          <ArrowRight className="w-4 h-4 text-primary" />
        </div>

        {/* Stage 2: Verification Audits (4 cols) */}
        <div className="md:col-span-4 space-y-2">
          <span className="text-xs font-mono uppercase text-muted tracking-wider block font-bold">
            2. Evidence Cross-Audit
          </span>
          <div className="space-y-1.5">
            {audits.map((audit) => {
              const statusClass =
                audit.status === 'pass'
                  ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 border-emerald-500/30'
                  : audit.status === 'fail'
                  ? 'bg-rose-500/10 text-rose-800 dark:text-rose-200 border-rose-500/30'
                  : 'bg-amber-500/10 text-amber-800 dark:text-amber-200 border-amber-500/30';

              return (
                <div
                  key={audit.id}
                  className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between gap-2 shadow-2xs ${statusClass}`}
                >
                  <span className="truncate">{audit.label}</span>
                  <span className="text-xs font-mono font-bold uppercase shrink-0">
                    {audit.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Connector 2 (1 col) */}
        <div className="hidden md:flex md:col-span-1 justify-center text-muted">
          <ArrowRight className="w-4 h-4 text-primary" />
        </div>

        {/* Stage 3: Verdict (2 cols) */}
        <div className="md:col-span-2 space-y-2">
          <span className="text-xs font-mono uppercase text-muted tracking-wider block font-bold">
            3. Final Grade
          </span>
          <div className={`p-3 rounded-2xl border text-center space-y-1 shadow-soft-xs ${gradeColors.badge}`}>
            <div className="w-9 h-9 rounded-xl bg-surface mx-auto flex items-center justify-center font-serif text-lg font-bold border border-line">
              {grade}
            </div>
            <div className="text-xs font-bold">{gradeColors.label.split(':')[0]}</div>
          </div>
        </div>
      </div>

      {/* Explanation Banner */}
      <div className="p-3.5 rounded-2xl bg-surface-sunken border border-line text-xs space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-heading">
          <VerdictIcon className="w-4 h-4 text-primary shrink-0" />
          <span>Audit Conclusion:</span>
        </div>
        <p className="text-xs text-secondary leading-relaxed pl-5">
          {reason}
        </p>
        <div className="text-xs font-sans text-muted pl-5 pt-1 border-t border-line/50">
          Note: Certifications are claimed on label. Check the respective issuer&rsquo;s public registry before purchasing.
        </div>
      </div>
    </div>
  );
}
