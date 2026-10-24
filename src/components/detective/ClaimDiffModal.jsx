import React, { useState, useMemo } from 'react';
import {
  GitCompare,
  X,
  AlertTriangle,
  ShieldCheck,
  Check,
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import productsData from '../../data/products.json';
import { compareProductClaims } from '../../lib/transparencyEngine';

export default function ClaimDiffModal({ isOpen, onClose, initialProductA = null, initialProductB = null }) {
  const [productAId, setProductAId] = useState(() => initialProductA?.id || productsData[0]?.id);
  const [productBId, setProductBId] = useState(() => initialProductB?.id || productsData[1]?.id);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const productA = useMemo(() => productsData.find((p) => p.id === productAId) || productsData[0], [productAId]);
  const productB = useMemo(() => productsData.find((p) => p.id === productBId) || productsData[1], [productBId]);

  const diffResult = useMemo(() => {
    return compareProductClaims(productA, productB);
  }, [productA, productB]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] bg-surface-raised border border-line rounded-3xl shadow-soft-xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-line flex items-center justify-between bg-surface-sunken">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-lg text-heading">
                  Claim Diff: Side-by-Side Marketing Audit
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-raised border border-line text-text-muted">
                  Truth Lab Tool
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                Compare wording authenticity, greenwashing flags, and disclosure gaps between two items.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowHowItWorks(!showHowItWorks)}
              className="p-2 rounded-xl border border-line bg-surface hover:bg-surface-sunken text-text-muted hover:text-heading text-xs font-mono flex items-center gap-1 transition"
            >
              <HelpCircle className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline">How it works</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl border border-line text-text-muted hover:text-heading hover:bg-surface transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* How it works drawer */}
        {showHowItWorks && (
          <div className="p-4 bg-surface border-b border-line text-xs space-y-1.5 animate-fade-in">
            <div className="flex items-center gap-1.5 font-serif font-bold text-heading">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>How Claim Diff Works</span>
            </div>
            <p className="text-text-secondary leading-relaxed">
              We extract marketing claims, product descriptions, and technical specifications for both products. Our lexicon analyzer flags unqualified greenwashing buzzwords while our transparency engine compares verified lifecycle disclosures.
            </p>
          </div>
        )}

        {/* Product Selectors */}
        <div className="p-4 border-b border-line bg-surface grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-mono text-text-muted uppercase tracking-wider block mb-1">
              Product A (Baseline)
            </label>
            <select
              value={productAId}
              onChange={(e) => setProductAId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-surface-sunken border border-line text-xs font-sans text-heading focus:outline-none focus:border-primary"
            >
              {productsData.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (₹{p.price})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-mono text-text-muted uppercase tracking-wider block mb-1">
              Product B (Comparison Target)
            </label>
            <select
              value={productBId}
              onChange={(e) => setProductBId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-surface-sunken border border-line text-xs font-sans text-heading focus:outline-none focus:border-primary"
            >
              {productsData.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (₹{p.price})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Diff Comparison Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Recommendation Banner */}
          {diffResult && (
            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary">
                  Comparative Synthesis
                </span>
                <p className="text-xs text-heading mt-0.5 leading-relaxed font-sans">
                  {diffResult.recommendation}
                </p>
              </div>
            </div>
          )}

          {/* Side by side columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Column A */}
            <div className="p-4 rounded-3xl bg-surface-sunken border border-line space-y-3.5">
              <div className="border-b border-line pb-2">
                <span className="text-[10px] font-mono text-text-muted uppercase">Product A</span>
                <h4 className="font-serif font-bold text-base text-heading">{productA.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-surface border border-line">
                    Transparency: {diffResult?.productA.transparency.score}% (Grade {diffResult?.productA.transparency.grade})
                  </span>
                </div>
              </div>

              {/* Marketing Claims */}
              <div>
                <span className="text-[11px] font-mono text-text-muted uppercase block mb-1">
                  Declared Marketing Claims
                </span>
                <ul className="space-y-1">
                  {(productA.claims || ['Standard product specifications']).map((c, i) => (
                    <li key={i} className="text-xs text-heading flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Flagged Phrases */}
              <div>
                <span className="text-[11px] font-mono text-text-muted uppercase flex items-center gap-1 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  Flagged Buzzwords ({diffResult?.productA.flaggedPhrases.length || 0})
                </span>
                {diffResult?.productA.flaggedPhrases.length === 0 ? (
                  <div className="text-xs text-emerald-600 dark:text-emerald-400">
                    No unqualified buzzwords detected.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {diffResult?.productA.flaggedPhrases.map((flag, idx) => (
                      <div key={idx} className="p-2 rounded-xl bg-surface border border-amber-500/20 text-xs">
                        <div className="font-mono font-bold text-amber-600 dark:text-amber-400 text-[11px]">
                          "{flag.matchedText}" — {flag.category}
                        </div>
                        <div className="text-[10px] text-text-secondary mt-0.5">
                          {flag.reason}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Column B */}
            <div className="p-4 rounded-3xl bg-surface-sunken border border-line space-y-3.5">
              <div className="border-b border-line pb-2">
                <span className="text-[10px] font-mono text-text-muted uppercase">Product B</span>
                <h4 className="font-serif font-bold text-base text-heading">{productB.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-surface border border-line">
                    Transparency: {diffResult?.productB.transparency.score}% (Grade {diffResult?.productB.transparency.grade})
                  </span>
                </div>
              </div>

              {/* Marketing Claims */}
              <div>
                <span className="text-[11px] font-mono text-text-muted uppercase block mb-1">
                  Declared Marketing Claims
                </span>
                <ul className="space-y-1">
                  {(productB.claims || ['Standard product specifications']).map((c, i) => (
                    <li key={i} className="text-xs text-heading flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Flagged Phrases */}
              <div>
                <span className="text-[11px] font-mono text-text-muted uppercase flex items-center gap-1 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  Flagged Buzzwords ({diffResult?.productB.flaggedPhrases.length || 0})
                </span>
                {diffResult?.productB.flaggedPhrases.length === 0 ? (
                  <div className="text-xs text-emerald-600 dark:text-emerald-400">
                    No unqualified buzzwords detected.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {diffResult?.productB.flaggedPhrases.map((flag, idx) => (
                      <div key={idx} className="p-2 rounded-xl bg-surface border border-amber-500/20 text-xs">
                        <div className="font-mono font-bold text-amber-600 dark:text-amber-400 text-[11px]">
                          "{flag.matchedText}" — {flag.category}
                        </div>
                        <div className="text-[10px] text-text-secondary mt-0.5">
                          {flag.reason}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
