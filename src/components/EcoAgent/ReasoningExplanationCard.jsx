import React, { useState } from 'react';
import {
  Brain,
  ShieldCheck,
  AlertTriangle,
  Flag,
  CheckCircle2,
  Zap,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';

export default function ReasoningExplanationCard({
  reasoningSummary,
  sourcesOrAssumptions = [],
  confidence = 'high',
  estimatedEnergyWh = 0.12,
  model = 'Gemini 1.5 Flash',
  isFallback = false,
  messageId,
  query,
  initiallyOpen = false
}) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportCategory, setReportCategory] = useState('Inaccurate lifecycle fact');
  const [reportNote, setReportNote] = useState('');
  const [reported, setReported] = useState(false);

  const confidenceBadge = {
    high: { bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', label: 'High Confidence' },
    medium: { bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30', label: 'Medium Confidence' },
    low: { bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30', label: 'Low Confidence (Caution)' }
  }[confidence] || { bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', label: 'High Confidence' };

  const handleReportSubmit = (e) => {
    e?.preventDefault();
    try {
      const existing = JSON.parse(localStorage.getItem('ecomart_reported_answers') || '[]');
      existing.push({
        id: messageId || Date.now(),
        query,
        category: reportCategory,
        note: reportNote,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('ecomart_reported_answers', JSON.stringify(existing));
      setReported(true);
      setTimeout(() => {
        setReportModalOpen(false);
        setReported(false);
      }, 1500);
    } catch {}
  };

  return (
    <div className="mt-2.5 pt-2 border-t border-line/60 font-sans text-xs">
      {/* Expandable Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-1 px-2 rounded-lg bg-surface-sunken/60 hover:bg-surface-sunken border border-line text-text-secondary hover:text-heading transition-colors cursor-pointer"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-primary">
          <Brain className="w-3.5 h-3.5" />
          <span>How did I decide this?</span>
          <span className={`px-2 py-0.5 rounded-full text-[9px] border font-mono ${confidenceBadge.bg}`}>
            {confidenceBadge.label}
          </span>
        </span>
        <span className="flex items-center gap-1 text-[10px] text-text-muted">
          <span>{isOpen ? 'Collapse' : 'Inspect'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </span>
      </button>

      {/* Expanded Reasoning & Sources Dossier */}
      {isOpen && (
        <div className="mt-2 p-3 rounded-xl bg-surface-sunken/90 border border-line space-y-3 animate-fade-in text-left">
          {/* Model & Source Meta */}
          <div className="flex items-center justify-between text-[10px] font-mono text-text-muted border-b border-line/60 pb-2">
            <span>ENGINE: {model} {isFallback && '(Offline Fallback)'}</span>
            <span className="flex items-center gap-1 text-primary">
              <Zap className="w-3 h-3 text-primary" />
              <span>~{estimatedEnergyWh} Wh (est.)</span>
            </span>
          </div>

          {/* Reasoning Summary */}
          {reasoningSummary && (
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-text-muted mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-primary" />
                <span>Decision Rationale</span>
              </div>
              <p className="text-[11px] text-heading leading-relaxed font-sans">
                {reasoningSummary}
              </p>
            </div>
          )}

          {/* Sources and Assumptions */}
          {sourcesOrAssumptions && sourcesOrAssumptions.length > 0 && (
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-text-muted mb-1">
                Sources & Underlying Assumptions:
              </div>
              <ul className="space-y-1">
                {sourcesOrAssumptions.map((src, i) => (
                  <li key={i} className="text-[11px] text-text-secondary flex items-start gap-1.5 leading-snug">
                    <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>{src}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Ethical AI Disclaimer & Report Action */}
          <div className="pt-2 border-t border-line/60 flex flex-wrap items-center justify-between gap-2 text-[10px]">
            <div className="flex items-center gap-1 text-text-muted">
              <Info className="w-3 h-3 shrink-0" />
              <span>AI estimates are probabilistic. Always verify packaging labels.</span>
            </div>

            <button
              type="button"
              onClick={() => setReportModalOpen(true)}
              className="text-text-muted hover:text-amber-400 flex items-center gap-1 underline transition-colors cursor-pointer"
            >
              <Flag className="w-3 h-3" />
              <span>Report wrong answer</span>
            </button>
          </div>
        </div>
      )}

      {/* Report Wrong Answer Modal */}
      {reportModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="w-full max-w-sm rounded-2xl bg-surface-raised border border-line p-5 shadow-soft-xl space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-2">
              <div className="flex items-center gap-2 text-heading font-serif font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Report AI Error</span>
              </div>
              <button
                type="button"
                onClick={() => setReportModalOpen(false)}
                className="text-text-muted hover:text-heading cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            {reported ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-primary mx-auto animate-bounce" />
                <div className="text-xs font-bold text-heading">Feedback Recorded Locally</div>
                <div className="text-[11px] text-text-secondary">
                  Thank you for contributing to responsible AI oversight.
                </div>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-mono text-text-muted mb-1">
                    ISSUE CATEGORY
                  </label>
                  <select
                    value={reportCategory}
                    onChange={(e) => setReportCategory(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg bg-surface-sunken border border-line text-heading"
                  >
                    <option value="Inaccurate lifecycle fact">Inaccurate lifecycle / carbon fact</option>
                    <option value="Hallucinated certification">Hallucinated / fake certification</option>
                    <option value="Biased recommendation">Biased recommendation</option>
                    <option value="Irrelevant response">Irrelevant response</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-text-muted mb-1">
                    CORRECTION / NOTE (OPTIONAL)
                  </label>
                  <textarea
                    rows={3}
                    value={reportNote}
                    onChange={(e) => setReportNote(e.target.value)}
                    placeholder="Provide details on why this answer is incorrect..."
                    className="w-full text-xs p-2 rounded-lg bg-surface-sunken border border-line text-heading placeholder:text-text-muted focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg border border-line text-xs text-text-secondary hover:text-heading"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-primary-contrast font-bold text-xs"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
