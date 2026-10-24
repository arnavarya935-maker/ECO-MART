import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Search,
  Scale,
  Camera,
  FileCheck,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { analyzeExternalProduct } from '../lib/ecoCheck';
import { useCart } from '../context/CartContext';
import productsData from '../data/products.json';
import ClaimEvidenceGraph from '../components/detective/ClaimEvidenceGraph';
import AgentReportCard from '../components/agent/AgentReportCard';
import CertificationDecoderModal from '../components/detective/CertificationDecoderModal';
import ClaimDiffModal from '../components/detective/ClaimDiffModal';
import ReportClaimModal from '../components/detective/ReportClaimModal';
import GreenwashLexiconHighlighter from '../components/detective/GreenwashLexiconHighlighter';
import BrandTransparencyCard from '../components/detective/BrandTransparencyCard';
import RelatedNewsPanel from '../components/news/RelatedNewsPanel';
import Tabs from '../components/ui/Tabs';
import Chip from '../components/ui/Chip';
import GlossaryTooltip from '../components/ui/GlossaryTooltip';

const TRUTH_TABS = [
  { id: 'radar', label: 'Claim Radar & Evidence' },
  { id: 'courtroom', label: 'AI Courtroom' },
  { id: 'scanner', label: 'Packaging OCR Scanner' },
  { id: 'audit', label: 'Agent Safety Report Card' }
];

const SAMPLE_CLAIMS = [
  '100% Eco-Friendly Bamboo Toothbrush in plastic packaging',
  'Organic Cotton Tote Bag certified GOTS with fair wages',
  'Biodegradable plant-based phone case (no industrial compost needed)',
  'Pure natural mineral deodorant, zero chemicals, safe earth'
];

export default function TruthLabPage() {
  const { userPriorities } = useCart();
  const [activeTab, setActiveTab] = useState('radar'); // 'radar' | 'scanner' | 'courtroom' | 'audit'
  const [claimInput, setClaimInput] = useState(SAMPLE_CLAIMS[0]);
  const [analyzedClaim, setAnalyzedClaim] = useState(SAMPLE_CLAIMS[0]);
  const [decoderOpen, setDecoderOpen] = useState(false);
  const [diffOpen, setDiffOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const analysis = React.useMemo(() => {
    if (!analyzedClaim.trim()) return null;
    return analyzeExternalProduct(analyzedClaim, userPriorities, productsData);
  }, [analyzedClaim, userPriorities]);

  const handleAudit = (claim) => {
    const text = (claim || claimInput).trim();
    if (!text) return;
    setClaimInput(text);
    setAnalyzedClaim(text);
  };

  return (
    <div className="min-h-screen bg-surface text-text pb-28 sm:pb-20">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-line pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                Hub 3 of 5
              </span>
              <span className="text-xs text-muted font-medium">
                Independent Verification &amp; Claim Forensics
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-heading mt-2 tracking-tight">
              The Truth Lab
            </h1>
            <p className="font-sans text-xs sm:text-sm text-secondary mt-1 max-w-2xl">
              Zero marketing fluff. Cross-audit brand claims for <GlossaryTooltip term="Greenwashing">greenwashing</GlossaryTooltip>, inspect packaging evidence graphs, evaluate <GlossaryTooltip term="Embodied Carbon">embodied carbon</GlossaryTooltip> data, or take contentious claims to the courtroom.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setDecoderOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-surface-raised hover:bg-surface border border-line hover:border-primary/40 text-heading text-xs font-semibold shadow-soft-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>📜 Cert Decoder</span>
            </button>
            <button
              type="button"
              onClick={() => setDiffOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-surface-raised hover:bg-surface border border-line hover:border-primary/40 text-heading text-xs font-semibold shadow-soft-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>⚖️ Claim Diff</span>
            </button>
            <button
              type="button"
              onClick={() => setReportOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-surface-raised hover:bg-surface border border-line hover:border-rose-500/40 text-rose-600 dark:text-rose-400 text-xs font-semibold shadow-soft-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>🚩 Report Claim</span>
            </button>
            <Link
              to="/courtroom"
              className="px-3.5 py-2 rounded-xl bg-surface-raised hover:bg-surface border border-line hover:border-primary/40 text-heading text-xs font-semibold shadow-soft-xs transition-colors inline-flex items-center gap-1.5"
            >
              <Scale className="w-3.5 h-3.5 text-primary" />
              <span>Courtroom</span>
            </Link>
            <Link
              to="/scan"
              className="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast text-xs font-bold shadow-soft-xs transition-colors inline-flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Label OCR</span>
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 overflow-x-auto pb-2">
          <Tabs tabs={TRUTH_TABS} activeTab={activeTab} onChange={setActiveTab} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Tab 1: Claim Radar & Evidence */}
        {activeTab === 'radar' && (
          <div className="space-y-6 text-left">
            {/* Input Form */}
            <div className="bg-surface-raised rounded-3xl p-6 border border-line shadow-soft-sm space-y-4">
              <label htmlFor="claim-search" className="font-serif font-bold text-base text-heading block">
                Paste any product claim, packaging copy, or marketing phrase:
              </label>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  id="claim-search"
                  type="text"
                  value={claimInput}
                  onChange={(e) => setClaimInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAudit();
                  }}
                  placeholder="e.g. 100% natural organic cotton bag with zero plastic..."
                  className="flex-1 px-4 py-3 rounded-2xl bg-surface-sunken border border-line text-xs font-medium text-heading focus:bg-surface focus:border-primary transition min-h-[44px]"
                />
                <button
                  type="button"
                  onClick={() => handleAudit()}
                  className="px-6 py-3 rounded-2xl bg-primary hover:bg-primary-hover text-primary-contrast font-bold text-xs flex items-center justify-center gap-2 shadow-soft-sm transition cursor-pointer shrink-0 min-h-[44px]"
                >
                  <Search className="w-4 h-4 text-primary-contrast" />
                  <span>Cross-Audit Evidence</span>
                </button>
              </div>

              {/* Sample Chips */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
                <span className="text-[10px] font-mono uppercase text-muted mr-1">Quick Samples:</span>
                {SAMPLE_CLAIMS.map((sample, idx) => (
                  <Chip
                    key={idx}
                    active={claimInput === sample}
                    onClick={() => handleAudit(sample)}
                  >
                    {sample.slice(0, 32)}...
                  </Chip>
                ))}
              </div>
            </div>

            {/* Analysis Results */}
            {analysis && (
              <div className="space-y-6 animate-fade-in">
                {/* Claim Evidence Graph (Feature 13 & 14) */}
                <ClaimEvidenceGraph
                  evidenceGraph={analysis.evidenceGraph}
                  evidenceGrade={analysis.evidenceGrade}
                  evidenceReason={analysis.evidenceReason}
                />

                {/* Signals breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-3xl bg-danger/5 border border-danger/25 space-y-2">
                    <div className="flex items-center gap-2 text-danger font-bold text-xs uppercase tracking-wider">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Red Flags &amp; Inconsistencies ({analysis.redFlags.length})</span>
                    </div>
                    {analysis.redFlags.length === 0 ? (
                      <p className="text-xs text-muted">No overt <GlossaryTooltip term="Greenwashing">greenwashing</GlossaryTooltip> inconsistencies detected in this text.</p>
                    ) : (
                      <ul className="space-y-1.5 text-xs text-heading">
                        {analysis.redFlags.map((flag, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-danger font-bold">•</span>
                            <span>{flag}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="p-5 rounded-3xl bg-primary/5 border border-primary/25 space-y-2">
                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verified Green Signals ({analysis.greenSignals.length})</span>
                    </div>
                    {analysis.greenSignals.length === 0 ? (
                      <p className="text-xs text-muted">No verifiable third-party certification cited (e.g. <GlossaryTooltip term="GOTS Certified">GOTS</GlossaryTooltip>).</p>
                    ) : (
                      <ul className="space-y-1.5 text-xs text-heading">
                        {analysis.greenSignals.map((signal, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                            <span>{signal}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* Feature 18 & 19: Brand Transparency Scorecard & Ask the Brand */}
            <div className="pt-4 border-t border-line">
              <div className="mb-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-primary font-bold">
                  Catalog Disclosures Audit
                </span>
                <h3 className="font-serif text-lg font-bold text-heading mt-0.5">
                  Brand Transparency Scorecard &amp; <GlossaryTooltip term="Cradle-to-Grave">Lifecycle Completeness</GlossaryTooltip>
                </h3>
              </div>
              <BrandTransparencyCard product={productsData[0]} />
            </div>
          </div>
        )}

        {/* Tab 2: Courtroom Quick Launch */}
        {activeTab === 'courtroom' && (
          <div className="bg-surface-raised rounded-3xl p-8 border border-line shadow-soft-sm text-center space-y-5 max-w-3xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-300 mx-auto flex items-center justify-center text-2xl">
              ⚖️
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-heading">
                AI Sustainability Courtroom
              </h3>
              <p className="text-xs text-secondary mt-1.5 max-w-lg mx-auto leading-relaxed">
                Experience dynamic legal cross-examinations where algorithmic Prosecution and Defense battle over corporate sustainability claims, culminating in a transparent Judicial Verdict.
              </p>
            </div>
            <Link
              to="/courtroom"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary hover:bg-primary-hover text-primary-contrast font-bold text-xs shadow-soft-sm transition-all"
            >
              <span>Launch Full Courtroom Simulation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Tab 3: Packaging OCR Scanner */}
        {activeTab === 'scanner' && (
          <div className="bg-surface-raised rounded-3xl p-8 border border-line shadow-soft-sm text-center space-y-5 max-w-3xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 text-primary mx-auto flex items-center justify-center text-2xl">
              📷
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-heading">
                Packaging Label Scanner
              </h3>
              <p className="text-xs text-secondary mt-1.5 max-w-lg mx-auto leading-relaxed">
                Scan ingredients, recycling resin codes, and claim labels on physical packaging. Uses on-device OCR with zero cloud uploads.
              </p>
            </div>
            <Link
              to="/scan"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary hover:bg-primary-hover text-primary-contrast font-bold text-xs shadow-soft-sm transition-all"
            >
              <span>Open Packaging Camera Scanner</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Tab 4: Agent Safety Report Card */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <AgentReportCard />
          </div>
        )}

        {/* Environmental Claims Industry News */}
        <div className="pt-6 border-t border-line">
          <RelatedNewsPanel
            topic="greenwashing"
            title="Claims & Regulatory Watch"
            description="Recent watchdog investigations, FTC updates, and global enforcement on deceptive environmental marketing."
            maxArticles={3}
          />
        </div>
      </div>

      {/* Detective & Transparency Modals */}
      <CertificationDecoderModal isOpen={decoderOpen} onClose={() => setDecoderOpen(false)} />
      <ClaimDiffModal isOpen={diffOpen} onClose={() => setDiffOpen(false)} />
      <ReportClaimModal isOpen={reportOpen} onClose={() => setReportOpen(false)} />
    </div>
  );
}
