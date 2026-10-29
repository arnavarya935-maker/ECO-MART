import React, { useState, useEffect, useMemo } from 'react';
import {
  Scale,
  Sparkles,
  Languages,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  DollarSign,
  Table,
  Info
} from 'lucide-react';
import {
  FAIRNESS_PRESETS,
  runFairnessAudit,
  runCatalogParitySuite
} from '../lib/ai/fairnessEngine.js';
import { askEcoAgent } from '../lib/ai/geminiAdapter.js';

export default function FairnessPage() {
  const [selectedPreset, setSelectedPreset] = useState(FAIRNESS_PRESETS[0]);
  const [customQuery, setCustomQuery] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditData, setAuditData] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  const executeAudit = async (presetOrText) => {
    setIsAuditing(true);
    try {
      // Custom live fetcher adapter allowing live Gemini when online
      const liveFetcher = async (q, l) => {
        const res = await askEcoAgent({ query: q, language: l });
        return res;
      };
      const result = await runFairnessAudit(presetOrText, liveFetcher);
      setAuditData(result);
    } catch (err) {
      console.error('Fairness audit error:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  // Run initial audit on mount
  useEffect(() => {
    executeAudit(selectedPreset);
  }, [selectedPreset]);

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customQuery.trim()) return;
    executeAudit({
      id: 'custom-' + Date.now(),
      title: `Audit: "${customQuery.slice(0, 32)}..."`,
      baseQuery: customQuery
    });
  };

  const defaultMetrics = useMemo(() => {
    return runCatalogParitySuite();
  }, []);

  const metrics = auditData?.parityMetrics || defaultMetrics;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fade-in pb-24">
      {/* Top Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-mono font-medium tracking-wider uppercase">
          <Scale className="w-3.5 h-3.5" />
          Responsible AI Parity Benchmark
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-heading tracking-tight">
          AI Fairness & Parity Lab
        </h1>
        <p className="text-sm sm:text-base text-secondary leading-relaxed">
          Evaluating linguistic parity, dialect dignity, and economic equity. Does our AI recommend the same standards
          to a Hindi speaker or a student on a budget as it does to an English speaker?
        </p>
      </div>

      {/* Preset Selector & Custom Input Bar */}
      <div className="p-6 rounded-3xl bg-surface border border-line shadow-card space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-heading flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Select Standard Multi-Turn Scenario
            </h2>
            <p className="text-xs text-muted">
              Choose a calibrated test case or test your own custom prompt across 4+ demographic dimensions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
              className="text-xs font-mono px-3 py-1.5 rounded-full border border-line bg-surface-sunken hover:border-primary/50 text-secondary transition-colors flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-focus"
              aria-label="Toggle between side-by-side card view and accessibility table view"
            >
              <Table className="w-3.5 h-3.5" />
              {viewMode === 'cards' ? 'View as Table' : 'View as Cards'}
            </button>

            <button
              onClick={() => executeAudit(selectedPreset)}
              disabled={isAuditing}
              className="text-xs font-mono px-3.5 py-1.5 rounded-full bg-primary text-primary-contrast font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
              Re-run Audit
            </button>
          </div>
        </div>

        {/* Preset Badges */}
        <div className="flex flex-wrap gap-2.5">
          {FAIRNESS_PRESETS.map((preset) => {
            const isSelected = selectedPreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  setSelectedPreset(preset);
                  setCustomQuery('');
                }}
                className={`text-xs px-4 py-2 rounded-2xl border transition-all text-left flex items-center gap-2 ${
                  isSelected
                    ? 'bg-primary/10 border-primary text-heading font-semibold shadow-soft-sm'
                    : 'bg-surface-sunken border-line text-secondary hover:border-line-subtle'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-primary" />
                {preset.title}
                <span className="text-[10px] text-muted font-mono uppercase">({preset.category})</span>
              </button>
            );
          })}
        </div>

        {/* Custom Input Form */}
        <form onSubmit={handleCustomSubmit} className="pt-2 flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder="Or enter custom question to test across languages and budget personas..."
              className="w-full px-4 py-2.5 rounded-2xl bg-surface-sunken border border-line text-xs sm:text-sm text-heading placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={!customQuery.trim() || isAuditing}
            className="px-5 py-2.5 rounded-2xl bg-surface-raised border border-primary/40 hover:border-primary text-primary text-xs font-semibold font-mono tracking-wider uppercase transition-colors shrink-0 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>Run Custom Audit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Fairness & Parity Score Card */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8 rounded-3xl bg-surface border border-line shadow-card">
        {/* Big Metric Dial */}
        <div className="lg:col-span-4 flex flex-col justify-between p-6 rounded-2xl bg-surface-sunken border border-line space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-muted tracking-wider">Composite Parity Metric</span>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded-md border ${metrics.badgeColor}`}>
                {metrics.verdict}
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-serif text-5xl sm:text-6xl font-bold text-heading">
                {metrics.consistencyScore}
              </span>
              <span className="text-xl font-mono text-muted">/100</span>
            </div>
            <p className="text-[11px] font-mono text-primary mt-1">
              {metrics.sampleNotice || 'measured on our sample catalog'}
            </p>
            <p className="text-xs text-secondary mt-1 leading-relaxed">
              Calculated using Jaccard recommendation overlap (40%), linguistic substantive parity (35%), and economic integrity (25%).
            </p>
          </div>

          {/* Sub-scores */}
          <div className="space-y-2 pt-4 border-t border-line/60 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-secondary flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5 text-primary" /> Linguistic Equity:
              </span>
              <span className="font-mono font-semibold text-heading">
                {typeof metrics.linguisticParity === 'number' ? `${metrics.linguisticParity}%` : (metrics.linguisticParity || 'Not measured')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-accent" /> Socioeconomic Integrity:
              </span>
              <span className="font-mono font-semibold text-heading">
                {typeof metrics.economicParity === 'number' ? `${metrics.economicParity}%` : (metrics.economicParity || 'Not measured')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-secondary" /> Recommendation Overlap:
              </span>
              <span className="font-mono font-semibold text-heading">
                {typeof metrics.recommendationOverlap === 'number' ? `${metrics.recommendationOverlap}%` : (metrics.recommendationOverlap || 'Not measured')}
              </span>
            </div>
          </div>
        </div>

        {/* Plain Language Explanation & Limits */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-primary uppercase tracking-wider font-semibold">
              <Info className="w-4 h-4" />
              What This Score Means in Plain Words
            </div>
            <p className="text-sm text-heading leading-relaxed font-sans">
              {metrics.explanation}
            </p>
            <p className="text-xs text-secondary leading-relaxed">
              In commercial LLMs, non-English queries often trigger simplified responses or hallucinated regional brands.
              Eco Sense's fairness guardrails enforce that Hindi, Hinglish, and low-budget queries receive the exact same
              rules and product benchmarks (e.g., plastic rules, FSC certifications, composting timelines).
            </p>
          </div>

          {/* Ethical Limits & Assumptions Box */}
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-1.5">
            <div className="font-semibold text-amber-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              Responsible AI Caveat & Metric Limits
            </div>
            <p className="text-text-muted leading-relaxed">
              High semantic consistency does not guarantee absence of subtle stylistic bias. Metrics are calculated against
              Eco Sense's sample 64-item catalogue and do not account for external commercial marketplace pricing volatility.
            </p>
          </div>
        </div>
      </section>

      {/* Side-by-Side Variant Cards OR Accessibility Table View */}
      {viewMode === 'cards' ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif font-bold text-heading">
              Parallel Responses Across 5 Framing Variations
            </h3>
            <span className="text-xs font-mono text-muted">
              {auditData?.results?.length || 0} Dimensions Evaluated
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(auditData?.results || []).map((res, idx) => (
              <div
                key={res.id || idx}
                className="p-5 rounded-3xl bg-surface border border-line shadow-card flex flex-col justify-between gap-4 transition-all hover:border-primary/40"
              >
                {/* Variant Header */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
                      {res.label}
                    </span>
                    <span className="text-[10px] font-mono text-muted uppercase">
                      {res.language?.toUpperCase()}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-surface-sunken border border-line/60 text-xs font-mono text-heading">
                    <span className="text-muted block text-[10px] uppercase tracking-wider mb-0.5">Input Prompt:</span>
                    "{res.query}"
                  </div>
                </div>

                {/* Agent Answer */}
                <div className="space-y-2.5 flex-1">
                  <span className="text-[10px] font-mono text-muted uppercase tracking-wider">Model Response:</span>
                  <p className="text-xs sm:text-sm text-heading leading-relaxed font-sans bg-surface-raised/40 p-3 rounded-2xl border border-line/40">
                    {res.answer}
                  </p>
                </div>

                {/* Analytical Dimensions: Tone, Est Cost, Products */}
                <div className="space-y-2 pt-3 border-t border-line text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-muted">Detected Tone:</span>
                    <span className="text-secondary font-sans font-medium">{res.tone}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted">Recommended:</span>
                    <span className="text-primary font-sans font-medium truncate max-w-[180px]">
                      {res.recommendedProducts?.[0]?.name || 'Bamboo Swaps'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted">Est. Item Cost:</span>
                    <span className="text-heading font-semibold">₹{res.estimatedCost || 249}</span>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-1">
                    {(res.lifecycleEmphasized || []).map((topic, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-surface-sunken border border-line text-secondary">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        /* Accessible Table View */
        <section className="p-6 rounded-3xl bg-surface border border-line shadow-card space-y-4 overflow-x-auto">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-serif font-bold text-heading">
              Evaluated Parity Matrix (WCAG Accessible Alternative)
            </h3>
            <span className="text-xs font-mono text-muted">Tabular Data Format</span>
          </div>

          <table className="w-full text-left text-xs text-secondary border-collapse">
            <thead>
              <tr className="border-b border-line text-[11px] font-mono uppercase text-muted">
                <th className="py-3 px-3">Dimension</th>
                <th className="py-3 px-3">Language</th>
                <th className="py-3 px-3">Tested Prompt</th>
                <th className="py-3 px-3">Model Response Extract</th>
                <th className="py-3 px-3">Primary Recommendation</th>
                <th className="py-3 px-3">Est. Price</th>
                <th className="py-3 px-3">Tone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {(auditData?.results || []).map((res) => (
                <tr key={res.id} className="hover:bg-surface-sunken/50 transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-heading">{res.label}</td>
                  <td className="py-3.5 px-3 font-mono">{res.language}</td>
                  <td className="py-3.5 px-3 max-w-[200px] truncate">{res.query}</td>
                  <td className="py-3.5 px-3 max-w-[280px]">{res.answer}</td>
                  <td className="py-3.5 px-3 text-primary font-medium">{res.recommendedProducts?.[0]?.name || 'N/A'}</td>
                  <td className="py-3.5 px-3 font-mono">₹{res.estimatedCost || 249}</td>
                  <td className="py-3.5 px-3">{res.tone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
