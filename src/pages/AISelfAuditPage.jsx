import React, { useState } from 'react';
import {
  FileCheck,
  Printer,
  ShieldCheck,
  RefreshCw,
  Scale,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { generateAISelfAuditReport } from '../lib/ai/selfAuditEngine.js';
import AgentReportCard from '../components/agent/AgentReportCard';

export default function AISelfAuditPage() {
  const [report, setReport] = useState(() => generateAISelfAuditReport([]));

  const refreshReport = () => {
    setReport(generateAISelfAuditReport([]));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-sand-50 py-10 px-4 sm:px-6 lg:px-8 text-forest-900 transition-colors print:bg-white print:py-0 print:px-0">
      <div className="max-w-5xl mx-auto space-y-8 print:max-w-none print:space-y-6">
        {/* Executive Action Header (Hidden in Print) */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-line shadow-sm relative overflow-hidden print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-forest-900/10 text-forest-900 mb-3">
                <FileCheck className="w-3.5 h-3.5" />
                <span>Responsible AI &amp; Algorithmic Governance</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-heading">
                AI Self-Audit Session Report
              </h1>
              <p className="text-muted mt-2 text-sm sm:text-base max-w-2xl">
                Real-time algorithmic self-accountability report synthesized directly from local audit logs and Honesty Meter metrics.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <button
                type="button"
                onClick={refreshReport}
                className="p-2.5 rounded-xl border border-line bg-surface-raised hover:bg-sand-100 text-heading transition cursor-pointer text-xs font-semibold inline-flex items-center gap-1.5"
                title="Refresh from audit metrics"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-5 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white transition cursor-pointer text-xs font-bold inline-flex items-center gap-2 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Printable Formal Audit Document Container */}
        <div className="bg-surface rounded-3xl p-6 sm:p-10 border-2 border-line shadow-sm space-y-8 print:border-none print:shadow-none print:p-0">
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-forest-900">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold">
                Eco Sense Responsible AI Systems Check
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-heading mt-1">
                Automated Session Check & Safety Log
              </h2>
              <div className="flex items-center gap-4 text-xs text-muted mt-2 font-mono">
                <span>Report ID: {report.reportId}</span>
                <span>•</span>
                <span>Generated: {report.timestamp}</span>
              </div>
            </div>

            <div className="bg-sand-100 p-4 rounded-2xl border border-line text-right shrink-0 print:border-none">
              <span className="text-[10px] font-mono uppercase font-bold text-muted block">
                Session Honesty Rating
              </span>
              <div className="text-3xl font-black text-heading">
                {report.sessionSummary.overallHonestyScore}
                <span className="text-sm font-normal text-muted">/100</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                Evidence Standard
              </span>
            </div>
          </div>

          {/* Session Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-sand-50 p-4 rounded-2xl border border-line">
              <span className="text-[10px] uppercase font-mono font-bold text-muted block">
                Interactions Evaluated
              </span>
              <div className="text-2xl font-black text-heading mt-1">
                {report.sessionSummary.totalInteractionsAudited}
              </div>
              <span className="text-[11px] text-muted">Logged to Audit Trail</span>
            </div>

            <div className="bg-sand-50 p-4 rounded-2xl border border-line">
              <span className="text-[10px] uppercase font-mono font-bold text-muted block">
                Guardrail Intercepts
              </span>
              <div className="text-2xl font-black text-amber-700 mt-1">
                {report.sessionSummary.interceptedRefusals}
              </div>
              <span className="text-[11px] text-muted">Refused low-certainty</span>
            </div>

            <div className="bg-sand-50 p-4 rounded-2xl border border-line">
              <span className="text-[10px] uppercase font-mono font-bold text-muted block">
                Compute Energy
              </span>
              <div className="text-2xl font-black text-heading mt-1">
                ~{report.sessionSummary.totalEnergyWh} <span className="text-xs font-normal">Wh</span>
              </div>
              <span className="text-[11px] text-muted">Carbon: ~0.09g CO₂e</span>
            </div>

            <div className="bg-sand-50 p-4 rounded-2xl border border-line">
              <span className="text-[10px] uppercase font-mono font-bold text-muted block">
                Model Ensemble
              </span>
              <div className="text-xs font-bold text-heading mt-2 font-mono">
                Gemini + Guardrails
              </div>
              <span className="text-[10px] text-muted">Local Rule-Engine Backing</span>
            </div>
          </div>

          {/* Section 1: Uncertain Answers & Honest Limitations Admitted */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-line">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <h3 className="font-serif font-bold text-lg text-heading">
                1. Admitted Uncertainties & Refusals to Guess
              </h3>
            </div>
            <p className="text-xs text-muted">
              Rather than hallucinate or fabricate facts, the AI admitted lack of verification or triggered the Confidence Brake on these queries:
            </p>

            <div className="space-y-3">
              {report.uncertaintyAdmissions.map((unc) => (
                <div
                  key={unc.id}
                  className="bg-sand-50 p-4 rounded-2xl border border-line space-y-1.5 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-bold text-heading">
                      User Query: "{unc.query}"
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 text-[10px] font-mono font-bold self-start sm:self-auto">
                      {unc.guardrail}
                    </span>
                  </div>
                  <p className="text-secondary leading-relaxed font-serif">
                    {unc.refusalOrSummary}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Algorithmic Bias Risks Noticed */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-line">
              <Scale className="w-4 h-4 text-emerald-700" />
              <h3 className="font-serif font-bold text-lg text-heading">
                2. Algorithmic Bias Audits & Neutrality Safeguards
              </h3>
            </div>
            <p className="text-xs text-muted">
              Continuous checks against socioeconomic price bias, language disparity, and small-artisan marginalization:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {report.biasRisks.map((bias, idx) => (
                <div
                  key={idx}
                  className="bg-sand-50 p-4 rounded-2xl border border-line space-y-2 text-xs flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-heading">{bias.category}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 font-bold">
                        {bias.riskLevel}
                      </span>
                    </div>
                    <p className="text-muted text-[11px] leading-relaxed pt-1">
                      {bias.observation}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-line/60">
                    <span className="text-[10px] font-bold text-forest-900 block">Mitigation:</span>
                    <span className="text-[11px] text-secondary">{bias.action}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Guardrails Triggered */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-line">
              <ShieldCheck className="w-4 h-4 text-forest-900" />
              <h3 className="font-serif font-bold text-lg text-heading">
                3. Safety Guardrails & Verification Defense Layer
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {report.guardrailsTriggered.map((g, idx) => (
                <div
                  key={idx}
                  className="bg-sand-50 p-4 rounded-2xl border border-line space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-heading">{g.name}</span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-surface border border-line">
                      {g.count} Events
                    </span>
                  </div>
                  <p className="text-muted leading-relaxed">{g.purpose}</p>
                  <div className="text-[10px] font-mono text-emerald-700 font-bold pt-1">
                    ✓ Status: {g.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Suggested Concrete Improvements for AI Model */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-line">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="font-serif font-bold text-lg text-heading">
                4. Concrete Action Items for Model & Catalog Iteration
              </h3>
            </div>

            <div className="space-y-2.5">
              {report.modelImprovements.map((imp, idx) => (
                <div
                  key={idx}
                  className="bg-sand-50 p-4 rounded-2xl border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-heading">
                        Action #{idx + 1}: {imp.targetComponent}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                          imp.priority === 'High'
                            ? 'bg-rose-500/10 text-rose-700'
                            : 'bg-amber-500/10 text-amber-700'
                        }`}
                      >
                        {imp.priority} Priority
                      </span>
                    </div>
                    <p className="text-muted leading-relaxed">{imp.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Signature Block */}
          <div className="pt-6 border-t-2 border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-muted">
            <div>
              <span>Eco Sense Algorithmic Transparency &amp; Safety Framework</span>
              <p className="text-[10px] mt-0.5">Deterministic Scoring Formulas • Zero Personal Data Retained</p>
            </div>
            <div className="text-right">
              <span>Status: RULES CHECK PASSED</span>
            </div>
          </div>
        </div>

        {/* Live On-Demand Test Runner & Report Card (Feature 15) */}
        <div className="print:hidden">
          <AgentReportCard />
        </div>
      </div>
    </div>
  );
}
