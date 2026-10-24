import React, { useState } from 'react';
import {
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileSearch,
  Sparkles,
  Zap,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { auditGreenwashingClaim, computeClaimRadarAxes } from '../../lib/ai/geminiAdapter.js';
import ClaimRadarChart from './ClaimRadarChart.jsx';
import { useT } from '../../context/I18nContext';

const SAMPLE_CLAIMS = [
  {
    label: 'Dubious Plastic Bottle',
    claim: '100% eco-friendly green bottle made from pure ocean-bound plastic. Chemical-free and zero harm to nature.'
  },
  {
    label: 'Uncertified Cotton Bag',
    claim: 'All natural organic tote bag. Save the earth with completely sustainable pure earth fibers.'
  },
  {
    label: 'Verified Bamboo Product',
    claim: '100% FSC-Certified Moso Bamboo Cutlery Set. Packaged in unbleached post-consumer recycled kraft paper. Certified biodegradable under ASTM D6400.'
  }
];

export default function GreenwashingDetectiveModal({ isOpen, onClose }) {
  const [claimText, setClaimText] = useState(SAMPLE_CLAIMS[0].claim);
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [comparisonClaim, setComparisonClaim] = useState(SAMPLE_CLAIMS[2]);
  const { lang } = useT();

  if (!isOpen) return null;

  const handleRunAudit = async (customText) => {
    const textToAudit = customText || claimText;
    if (!textToAudit.trim()) return;

    setLoading(true);
    try {
      const result = await auditGreenwashingClaim({ text: textToAudit, language: lang });
      setAuditResult(result);
      try {
        const stored = JSON.parse(localStorage.getItem('ecomart_gw_audits') || '[]');
        stored.push({ claim: textToAudit.slice(0, 80), score: result.trust_score, timestamp: Date.now() });
        localStorage.setItem('ecomart_gw_audits', JSON.stringify(stored.slice(-20)));
      } catch {}
    } catch {
      // Fallback
      setAuditResult(null);
    } finally {
      setLoading(false);
    }
  };

  const getScoreBadge = (score) => {
    if (score >= 75) {
      return { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', label: 'GENUINE STANDARD' };
    }
    if (score >= 45) {
      return { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', label: 'UNVERIFIED CLAIM' };
    }
    return { color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30', label: 'HIGH RISK GREENWASH' };
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Greenwashing Detective Dossier"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl rounded-3xl bg-surface-raised border border-line shadow-soft-2xl overflow-hidden text-heading animate-scale-up my-8">
        {/* Detective Case File Top Header */}
        <div className="p-5 sm:p-6 bg-surface-sunken border-b border-line flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <FileSearch className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-400 font-bold">
                  CASE FILE #GW-2026 · AI ETHICS AUDIT
                </span>
              </div>
              <h2 className="font-serif font-bold text-lg sm:text-xl text-heading">
                Greenwashing Detective
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface border border-line hover:bg-surface-raised text-text-muted hover:text-heading flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close detective case file"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[calc(85vh-100px)] overflow-y-auto">
          {/* Claim Input Box */}
          <div className="space-y-2">
            <label htmlFor="claim-input" className="block font-mono text-xs uppercase tracking-wider text-text-muted">
              SUBMIT PACKAGING COPY OR ADVERTISING CLAIM FOR HEURISTIC & AI SCAN:
            </label>
            <textarea
              id="claim-input"
              rows={3}
              value={claimText}
              onChange={(e) => setClaimText(e.target.value)}
              placeholder="Paste product claim, e.g., '100% eco-friendly, chemical-free ocean plastic...' "
              className="w-full p-3.5 rounded-xl bg-surface-sunken border border-line font-sans text-xs sm:text-sm text-heading placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Preset Dubious Scenarios for Quick Live Demo */}
          <div className="space-y-1.5">
            <div className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
              Try a sample claim:
            </div>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_CLAIMS.map((sample) => (
                <button
                  key={sample.label}
                  type="button"
                  onClick={() => {
                    setClaimText(sample.claim);
                    handleRunAudit(sample.claim);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-surface border border-line hover:border-primary/50 text-[11px] font-mono text-text-secondary hover:text-heading transition-colors cursor-pointer"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div>
            <button
              type="button"
              onClick={() => handleRunAudit()}
              disabled={loading || !claimText.trim()}
              className="liquid-pill liquid-pill-emerald w-full justify-center group cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin text-primary-contrast" />
                  <span>Auditing via ISO 14021 & FTC Standards...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  <span>Run Detective Audit</span>
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>

          {/* Audit Results Dossier */}
          {auditResult && (
            <div className="mt-6 rounded-2xl bg-surface-sunken border border-line p-5 sm:p-6 space-y-5 animate-fade-in text-left">
              {/* Trust Score Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                    VERIFIED TRUST SCORE
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-mono text-4xl sm:text-5xl font-bold text-heading">
                      {auditResult.trust_score}
                    </span>
                    <span className="font-mono text-sm text-text-muted">/ 100</span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                    CASE VERDICT
                  </div>
                  <div
                    className={`mt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-mono text-xs font-bold ${
                      getScoreBadge(auditResult.trust_score).bg
                    } ${getScoreBadge(auditResult.trust_score).color}`}
                  >
                    <span>{auditResult.verdict || getScoreBadge(auditResult.trust_score).label}</span>
                  </div>
                </div>
              </div>

              {/* Plain Verdict Explanation */}
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-text-muted mb-1 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-primary" />
                  <span>Detective's Summary</span>
                </div>
                <p className="font-sans text-xs sm:text-sm text-heading leading-relaxed">
                  {auditResult.plain_verdict_explanation}
                </p>
              </div>

              {/* 5-Axis Claim Radar Chart & Comparative Overlay */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-mono uppercase tracking-wider text-muted font-bold">
                    Integrity Fingerprint Radar
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-muted">Compare with:</span>
                    <select
                      value={comparisonClaim ? comparisonClaim.label : 'none'}
                      onChange={(e) => {
                        const found = SAMPLE_CLAIMS.find((c) => c.label === e.target.value);
                        setComparisonClaim(found || null);
                      }}
                      className="text-[11px] font-mono px-2 py-1 rounded-lg bg-surface border border-line text-heading focus:outline-none"
                    >
                      <option value="none">None (Single Claim)</option>
                      {SAMPLE_CLAIMS.map((c) => (
                        <option key={c.label} value={c.label}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <ClaimRadarChart
                  claimA={{
                    label: 'Target Claim',
                    axes: auditResult.radar_axes || computeClaimRadarAxes(claimText)
                  }}
                  claimB={
                    comparisonClaim
                      ? {
                          label: comparisonClaim.label,
                          axes: computeClaimRadarAxes(comparisonClaim.claim)
                        }
                      : null
                  }
                />
              </div>

              {/* Flagged Vague Phrases */}
              {auditResult.flagged_phrases && auditResult.flagged_phrases.length > 0 && (
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-rose-400 mb-2 flex items-center gap-1 font-bold">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Flagged Vague or Deceptive Buzzwords ({auditResult.flagged_phrases.length})</span>
                  </div>
                  <div className="space-y-2">
                    {auditResult.flagged_phrases.map((flag, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-surface border border-rose-500/20 font-sans text-xs space-y-1"
                      >
                        <div className="font-mono font-bold text-rose-300">
                          &ldquo;{flag.phrase}&rdquo;
                        </div>
                        <div className="text-text-secondary text-[11px] leading-snug">
                          {flag.issue || flag.reason}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Independent Proofs */}
              {auditResult.missing_proofs && auditResult.missing_proofs.length > 0 && (
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1 font-bold">
                    <XCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Missing Third-Party Verification</span>
                  </div>
                  <ul className="space-y-1.5">
                    {auditResult.missing_proofs.map((miss, idx) => (
                      <li key={idx} className="text-xs text-text-secondary flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <span>{miss}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Positive Elements */}
              {auditResult.positive_elements && auditResult.positive_elements.length > 0 && (
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-primary mb-1 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    <span>Verified Aspects</span>
                  </div>
                  <ul className="space-y-1">
                    {auditResult.positive_elements.map((pos, idx) => (
                      <li key={idx} className="text-xs text-text-secondary flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <span>{pos}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Footer Meta */}
              <div className="pt-3 border-t border-line/60 flex items-center justify-between font-mono text-[10px] text-text-muted">
                <span>MODEL: {auditResult.model || 'Gemini 1.5 Flash'}</span>
                <span className="flex items-center gap-1 text-primary">
                  <Zap className="w-3 h-3 text-primary" />
                  <span>~{auditResult.estimated_energy_wh || 0.11} Wh compute</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
