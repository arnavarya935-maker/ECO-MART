import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  Leaf,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { analyzeExternalProduct } from '../lib/ecoCheck';
import { useCart } from '../context/CartContext';
import { FEATURES } from '../lib/features';
import productsData from '../data/products.json';
import EcoScoreBadge from '../components/EcoScoreBadge';
import ProductImage from '../components/ProductImage';
import ClaimEvidenceGraph from '../components/detective/ClaimEvidenceGraph';

const EXAMPLE_QUERIES = [
  'Plastic water bottle, eco friendly, BPA free',
  'GOTS certified organic cotton t-shirt',
  'Polyester gym shirt with breathable mesh',
  'Handmade bamboo toothbrush with nylon bristles'
];

export default function EcoCheckPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { userPriorities, addToCart } = useCart();

  const initialQuery = searchParams.get('q') || '';
  const [inputText, setInputText] = useState(initialQuery);
  const [analyzedQuery, setAnalyzedQuery] = useState(initialQuery);

  const analysis = useMemo(() => {
    if (!analyzedQuery.trim()) return null;
    return analyzeExternalProduct(analyzedQuery, userPriorities, productsData);
  }, [analyzedQuery, userPriorities]);

  const handleRunAnalysis = (textToAnalyze) => {
    const q = (textToAnalyze || inputText).trim();
    if (!q) return;
    setInputText(q);
    setAnalyzedQuery(q);
    setSearchParams({ q }, { replace: true });
  };

  const handleChipClick = (chipText) => {
    setInputText(chipText);
    handleRunAnalysis(chipText);
  };

  if (!FEATURES.ECO_CHECK) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-serif font-bold text-heading">Eco Check is currently disabled</h2>
        <p className="text-sm text-muted mt-2">This feature is toggled off in safety feature flags.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-text pb-28 sm:pb-20">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-subtle text-primary border border-primary/20 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-World Offline AI Tool</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-heading tracking-tight">
          Eco Check Any Product
        </h1>
        <p className="text-sm font-sans text-secondary mt-2 max-w-2xl leading-relaxed">
          Evaluating a purchase outside EcoMart? Paste the product description, material list, or brand claims.
          Our on-device heuristic analyzer detects greenwashing, estimates lifecycle impact, and recommends verified alternatives.
        </p>

        {/* Search Input Box */}
        <div className="mt-6 bg-surface-raised border border-line rounded-3xl p-4 shadow-card">
          <label htmlFor="eco-check-input" className="block text-xs font-sans uppercase font-bold text-muted tracking-wider mb-2">
            Paste product title, specs, or packaging claims
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                id="eco-check-input"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRunAnalysis()}
                placeholder="e.g. 100% eco friendly plastic water bottle, BPA free"
                className="w-full pl-10 pr-4 py-3 min-h-[44px] rounded-2xl bg-surface border border-line text-sm font-sans text-heading placeholder:text-muted focus-visible:outline-2 focus-visible:outline-focus shadow-soft-xs"
              />
            </div>
            <button
              type="button"
              onClick={() => handleRunAnalysis()}
              className="px-6 py-3 min-h-[44px] rounded-2xl bg-primary hover:bg-primary-hover text-primary-contrast font-sans font-semibold text-xs transition shadow-soft-sm cursor-pointer flex items-center justify-center gap-2 active:scale-98"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary-contrast" />
              <span>Analyze Product</span>
            </button>
          </div>

          {/* Example Suggestions */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2 border-t border-line/60">
            <span className="text-[11px] font-sans text-muted font-medium">Try examples:</span>
            {EXAMPLE_QUERIES.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => handleChipClick(example)}
                className="text-[11px] font-sans px-2.5 py-1 rounded-xl bg-surface hover:bg-surface-sunken text-secondary hover:text-heading border border-line transition-colors cursor-pointer"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Clarifying Prompt if Vague */}
        {analysis && analysis.isVague && (
          <div className="mt-6 p-5 rounded-3xl bg-warning-subtle border border-warning/30 text-heading animate-fade-in">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <h3 className="font-serif text-sm font-bold text-heading">
                  More Details Needed
                </h3>
                <p className="text-xs text-secondary mt-1">
                  {analysis.clarification.question}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {analysis.clarification.chips.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleChipClick(chip)}
                      className="text-xs font-sans px-3 py-1.5 rounded-xl bg-surface-raised text-heading border border-line hover:border-primary transition-all cursor-pointer shadow-soft-xs"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Results Display */}
        {analysis && !analysis.isVague && (
          <div className="mt-8 space-y-6 animate-fade-in">
            {/* Score & Verdict Card */}
            <div className="bg-surface-raised border border-line rounded-3xl p-6 shadow-card">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-line">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-2xl bg-surface border border-line shadow-soft-xs">
                    <EcoScoreBadge
                      scoreData={{ score: analysis.estimatedScore, grade: analysis.estimatedGrade }}
                      size="lg"
                      variant="ring"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-accent text-primary border border-primary/20">
                        Estimate
                      </span>
                      <span className="text-xs font-sans text-muted">
                        Confidence: <strong className="text-heading capitalize">{analysis.confidence}</strong>
                      </span>
                    </div>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-heading mt-1">
                      Estimated EcoScore: {analysis.estimatedScore} / 100
                    </h2>
                    <p className="text-xs font-sans text-secondary mt-0.5">
                      Matched Category: <strong className="text-heading">{analysis.matchedCategory}</strong>
                    </p>
                  </div>
                </div>

                <div className="w-full sm:w-auto p-3 rounded-2xl bg-surface border border-line text-xs font-sans text-secondary max-w-sm">
                  {analysis.summary}
                </div>
              </div>

              {/* Red Flags & Green Signals Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                {/* Red Flags */}
                <div className="p-4 rounded-2xl bg-danger/5 border border-danger/20">
                  <div className="flex items-center gap-2 text-danger font-serif text-sm font-bold mb-2.5">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Red Flags ({analysis.redFlags.length})</span>
                  </div>
                  {analysis.redFlags.length === 0 ? (
                    <p className="text-xs text-muted">No overt greenwashing or synthetic polymer hazards detected.</p>
                  ) : (
                    <ul className="space-y-2 text-xs font-sans text-heading">
                      {analysis.redFlags.map((flag, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-danger shrink-0 mt-0.5" />
                          <span>{flag}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Green Signals */}
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2 text-primary font-serif text-sm font-bold mb-2.5">
                    <Leaf className="w-4 h-4" />
                    <span>Green Signals ({analysis.greenSignals.length})</span>
                  </div>
                  {analysis.greenSignals.length === 0 ? (
                    <p className="text-xs text-muted">No verified certifications or natural materials recognized in input.</p>
                  ) : (
                    <ul className="space-y-2 text-xs font-sans text-heading">
                      {analysis.greenSignals.map((signal, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          <span>{signal}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Claim Evidence Graph & Provenance (Feature 13 & 14) */}
            {analysis.evidenceGraph && (
              <ClaimEvidenceGraph
                evidenceGraph={analysis.evidenceGraph}
                evidenceGrade={analysis.evidenceGrade}
                evidenceReason={analysis.evidenceReason}
              />
            )}

            {/* Sustainable Alternatives from EcoMart Catalog */}
            <div className="bg-surface-raised border border-line rounded-3xl p-6 shadow-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-heading">
                      Switch & Save: Verified EcoMart Alternatives
                    </h3>
                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary-subtle text-primary border border-primary/20">
                      Estimate
                    </span>
                  </div>
                  <p className="text-xs font-sans text-muted">
                    Ranked by your active priorities in <strong className="text-heading">{analysis.matchedCategory}</strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/shop?category=${encodeURIComponent(analysis.matchedCategory)}`)}
                  className="text-xs font-sans font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                >
                  <span>Explore full {analysis.matchedCategory} aisle</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {analysis.alternatives.length === 0 ? (
                <p className="text-xs text-muted py-4">No verified catalogue alternatives found for this specific query.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {analysis.alternatives.map((alt) => (
                    <div
                      key={alt.id}
                      className="p-4 rounded-2xl bg-surface border border-line hover:border-primary transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="aspect-square rounded-xl overflow-hidden bg-surface-sunken mb-3 relative">
                          <ProductImage
                            src={alt.image}
                            alt={alt.name}
                            category={alt.category}
                            fallbackIcon={alt.icon}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <EcoScoreBadge scoreData={alt.ecoScoreData} size="xs" variant="badge" />
                          </div>
                        </div>

                        <h4 className="font-serif text-sm font-bold text-heading line-clamp-1">
                          {alt.name}
                        </h4>
                        <div className="text-xs font-bold text-heading mt-1">
                          ₹{alt.price}
                        </div>

                        {/* Estimated Savings Metrics */}
                        <div className="mt-3 p-2.5 rounded-xl bg-surface-raised border border-line text-[11px] font-sans space-y-1">
                          <div className="flex items-center justify-between text-warning font-medium">
                            <span>Avoids plastic:</span>
                            <strong>~{alt.estimatedPlasticSavedGrams}g (Estimate)</strong>
                          </div>
                          <div className="flex items-center justify-between text-primary font-medium">
                            <span>Avoids CO₂:</span>
                            <strong>~{alt.estimatedCo2SavedKg}kg (Estimate)</strong>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-line flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => addToCart(alt, 1)}
                          className="flex-1 py-2 px-3 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
                        >
                          <ShoppingBag className="w-3 h-3 text-primary-contrast" />
                          <span>Add to Cart</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate(`/product/${alt.id}`)}
                          className="p-2 rounded-xl bg-surface-sunken hover:bg-line text-secondary hover:text-heading cursor-pointer transition-colors"
                          title="View product details"
                          aria-label={`View details for ${alt.name}`}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
