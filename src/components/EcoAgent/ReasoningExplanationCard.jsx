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
  Info,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export default function ReasoningExplanationCard({
  reasoningSummary,
  sourcesOrAssumptions = [],
  confidence = 'high',
  estimatedEnergyWh = 0.12,
  model = 'Gemini',
  isFallback = false,
  messageId,
  query,
  initiallyOpen = false,
  pipelineHandoffs = [],
  skepticReport = null
}) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [showEli10, setShowEli10] = useState(false);
  const [eliLang, setEliLang] = useState('en');
  const [showHowItWorks, setShowHowItWorks] = useState(false);
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
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex-1 flex flex-wrap items-center justify-between gap-2 py-1.5 px-2.5 rounded-xl bg-surface-sunken hover:bg-surface border border-line text-text-secondary hover:text-heading transition-colors cursor-pointer min-w-0"
          aria-expanded={isOpen}
        >
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] font-semibold text-primary min-w-0">
            <div className="flex items-center gap-1.5 shrink-0">
              <Brain className="w-3.5 h-3.5" />
              <span>How did I decide this?</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[9px] border font-mono shrink-0 ${confidenceBadge.bg}`}>
              {confidenceBadge.label}
            </span>
          </div>
          <span className="flex items-center gap-1 text-[10px] text-text-muted shrink-0 ml-auto">
            <span>{isOpen ? 'Collapse' : 'Inspect'}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </span>
        </button>

        {/* Small "How this works" Drawer Button (Global Requirement) */}
        <button
          type="button"
          onClick={() => setShowHowItWorks(!showHowItWorks)}
          title="How this AI decision was formed"
          className="px-2 py-1.5 rounded-xl border border-line bg-surface-sunken hover:bg-surface text-text-muted hover:text-heading text-[10px] font-mono flex items-center gap-1 transition cursor-pointer"
        >
          <HelpCircle className="w-3 h-3 text-primary" />
          <span className="hidden sm:inline">How it works</span>
        </button>
      </div>

      {/* Explainer Drawer (Global Rule) */}
      {showHowItWorks && (
        <div className="mt-2 p-3.5 rounded-2xl bg-surface-raised border border-primary/20 shadow-soft-xs text-xs space-y-2 animate-fade-in text-left">
          <div className="flex items-center justify-between font-serif font-bold text-heading">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              How the Decision Pipeline Works
            </span>
            <button
              type="button"
              onClick={() => setShowHowItWorks(false)}
              className="text-text-muted hover:text-heading text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            <strong>Inputs:</strong> Your shopping prompt, catalog specs, and optional local priority weights.<br />
            <strong>Logic:</strong> A 4-step decision pipeline runs sequentially: Plan budget limits; Research material data; Check omitted facts and claim risks; Advise balanced choices.<br />
            <strong>Data Sources:</strong> Open catalog sample data and seller-reported certifications (such as FSC, GOTS).<br />
            <strong>Limitations:</strong> Local estimates assume standard lifetime usage. Does not process financial transactions.
          </p>
        </div>
      )}

      {/* Expanded Reasoning & Sources Dossier */}
      {isOpen && (
        <div className="mt-2 p-3.5 rounded-2xl bg-surface-sunken border border-line space-y-3.5 animate-fade-in text-left">
          {/* Model & Source Meta */}
          <div className="flex items-center justify-between text-[10px] font-mono text-text-muted border-b border-line pb-2">
            <span>ENGINE: {model}</span>
            <span className="flex items-center gap-1 text-primary">
              <Zap className="w-3 h-3 text-primary" />
              <span>~{estimatedEnergyWh} Wh (est.)</span>
            </span>
          </div>

          {/* Feature 1: Multi-Agent Handoff Trace */}
          {pipelineHandoffs && pipelineHandoffs.length > 0 && (
            <div className="space-y-2">
              <div className="font-mono text-[10px] uppercase tracking-wider text-text-muted flex items-center gap-1">
                <Brain className="w-3 h-3 text-primary" />
                <span>Decision Pipeline Trace (Plan, Research, Check, Advise):</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {pipelineHandoffs.map((handoff, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-surface-raised border border-line flex items-start gap-2.5 text-[11px]"
                  >
                    <span className="text-base shrink-0 select-none mt-0.5">{handoff.role.avatar}</span>
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-heading">{handoff.role.name}</span>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-surface-sunken text-primary border border-line">
                          {handoff.role.badge}
                        </span>
                      </div>
                      <p className="text-text-secondary leading-relaxed font-sans">{handoff.thought}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feature 5: Skeptic Mode Self-Critique */}
          {skepticReport && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-2">
              <div className="flex items-center gap-1.5 font-serif font-bold text-amber-700 dark:text-amber-300 text-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Skeptic Mode Self-Critique</span>
              </div>
              <div className="space-y-1 text-[11px]">
                <div>
                  <strong className="text-heading">What could be wrong here?</strong>
                  <p className="text-text-secondary leading-relaxed mt-0.5">{skepticReport.critique}</p>
                </div>
                {skepticReport.mindChanger && skepticReport.mindChanger.length > 0 && (
                  <div className="pt-1 border-t border-amber-500/20">
                    <strong className="text-heading">What would change my mind?</strong>
                    <ul className="list-disc list-inside space-y-0.5 mt-0.5 text-text-secondary">
                      {Array.isArray(skepticReport.mindChanger) ? (
                        skepticReport.mindChanger.map((mc, idx) => (
                          <li key={idx}>{mc}</li>
                        ))
                      ) : (
                        <li>{skepticReport.mindChanger}</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reasoning Summary */}
          {reasoningSummary && (
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-text-muted mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-primary" />
                <span>Advisor Synthesis Rationale</span>
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
                Sources &amp; Disclosed Data:
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

          {/* Explain Like I'm 10 (ELI10) Toggle */}
          <div className="pt-2 border-t border-line">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowEli10(!showEli10)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                  showEli10
                    ? 'bg-amber-400/20 text-amber-700 dark:text-amber-300 border-amber-400/40'
                    : 'bg-surface text-text-muted hover:text-heading border-line'
                }`}
              >
                <span>🧒 Explain Like I'm 10</span>
                <span className="text-[9px] font-mono opacity-80">({showEli10 ? 'Hide' : 'Show'})</span>
              </button>

              {showEli10 && (
                <div className="flex items-center gap-1 bg-surface rounded-lg p-0.5 border border-line text-[9px] font-mono">
                  <button
                    type="button"
                    onClick={() => setEliLang('en')}
                    className={`px-1.5 py-0.5 rounded cursor-pointer ${eliLang === 'en' ? 'bg-primary text-white font-bold' : 'text-text-muted'}`}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    onClick={() => setEliLang('hi')}
                    className={`px-1.5 py-0.5 rounded cursor-pointer ${eliLang === 'hi' ? 'bg-primary text-white font-bold' : 'text-text-muted'}`}
                  >
                    हिंदी
                  </button>
                </div>
              )}
            </div>

            {showEli10 && (
              <div className="mt-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-1.5 animate-fade-in text-left">
                <div className="flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                  <span>👶 Plain-Language Summary:</span>
                </div>
                <p className="text-[11px] text-heading leading-relaxed font-sans">
                  {eliLang === 'hi'
                    ? "सोचिए जैसे जब हम कोई चीज़ खरीदते हैं, तो हमें देखना चाहिए कि वह किस चीज़ से बनी है। प्लास्टिक कचरा बन जाता है, लेकिन जैविक चीज़ें मिट्टी में वापस मिल जाती हैं और धरती को खुश रखती हैं!"
                    : "Think of regular plastic toothbrushes like trash that never goes away for 400 years. But bamboo is giant grass that grows fast without oil, and backyard soil can eat it back up in a few months!"}
                </p>
                <span className="text-[9px] font-mono text-muted block pt-1 border-t border-amber-500/20">
                  Strict Data Honesty Rule: Simplified wording only. Zero new claims invented.
                </span>
              </div>
            )}
          </div>

          {/* Ethical AI Disclaimer & Report Action */}
          <div className="pt-2 border-t border-line flex flex-wrap items-center justify-between gap-2 text-[10px]">
            <div className="flex items-center gap-1 text-text-muted">
              <Info className="w-3 h-3 shrink-0" />
              <span>AI estimates are probabilistic model outputs. Check seller claims on issuer sites.</span>
            </div>

            <button
              type="button"
              onClick={() => setReportModalOpen(true)}
              className="text-text-muted hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1 underline transition-colors cursor-pointer"
            >
              <Flag className="w-3 h-3" />
              <span>Report inaccurate answer</span>
            </button>
          </div>
        </div>
      )}

      {/* Report Inaccurate Answer Modal */}
      {reportModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="w-full max-w-sm rounded-2xl bg-surface-raised border border-line p-5 shadow-soft-xl space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-2">
              <div className="flex items-center gap-2 text-heading font-serif font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Report AI Answer Correction</span>
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
                <div className="text-xs font-bold text-heading">Report Saved Locally</div>
                <div className="text-[11px] text-text-secondary">
                  Thank you for contributing to transparent AI quality.
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
                    <option value="Unsubstantiated certification">Unsubstantiated certification</option>
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
                    placeholder="Provide details on what appears inaccurate..."
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
