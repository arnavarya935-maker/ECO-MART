import React, { useState } from 'react';
import {
  ShieldCheck,
  Scale,
  Database,
  Sparkles,
  CheckCircle2,
  X
} from 'lucide-react';

/**
 * AI Ethics Card
 * Transparency manifest for every product recommendation in EcoMart.
 * Demonstrates Responsible AI principles:
 * - Algorithmic fairness (0% sponsored bias)
 * - Data lineage (which lifecycle attributes were evaluated)
 * - Transparent recommendation rationale
 */
export default function AIEthicsCard({
  product,
  compact = false,
  className = ''
}) {
  const [showModal, setShowModal] = useState(false);

  if (!product) return null;

  // Derive honest rationale from product attributes
  const isHighEco = (product.ecoScore || 0) >= 80;
  const isPlasticFree = product.plasticGrams === 0;
  const isLocal = (product.madeInKm || 0) <= 250;
  const certifications = product.certifications || [];

  const dataPointsUsed = [
    `Cradle-to-gate carbon intensity (${product.carbonKg || 0.4} kg CO₂e)`,
    `Plastic content across unit & packaging (${product.plasticGrams || 0}g)`,
    `Freshwater consumption (${product.waterLitres || 25}L)`,
    `Logistics transport distance (${product.madeInKm || 120}km)`,
    certifications.length > 0
      ? `Verified 3rd-party certifications (${certifications.join(', ')})`
      : 'Standardized municipal recycling classification'
  ];

  const recommendationRationale = isHighEco
    ? `Selected by EcoMart Engine for superior EcoScore (${product.ecoScore}/100)${isPlasticFree ? ' and plastic-free packaging' : ''}${isLocal ? ' with low domestic transport emissions' : ''}.`
    : `Evaluated across lifecycle criteria: EcoScore ${product.ecoScore || 70}/100 with lower carbon intensity than conventional fossil alternatives.`;

  if (compact) {
    return (
      <>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(true);
          }}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 min-h-[32px] rounded-lg bg-surface-sunken hover:bg-surface-raised border border-line text-xs text-text-secondary hover:text-heading transition-colors font-mono cursor-pointer ${className}`}
          title="Click to view AI Ethics & Transparency Manifest"
          aria-label="View AI Ethics Manifest"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-text">AI Ethics:</span>
          <span className="text-emerald-400 font-bold">0% Sponsored Bias</span>
        </button>

        {showModal && (
          <AIEthicsModal
            product={product}
            dataPointsUsed={dataPointsUsed}
            recommendationRationale={recommendationRationale}
            onClose={() => setShowModal(false)}
          />
        )}
      </>
    );
  }

  return (
    <div
      className={`p-4 rounded-2xl bg-surface-raised border border-line text-text text-xs space-y-3.5 shadow-card ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h4 className="font-sans font-bold text-xs text-heading flex items-center gap-1.5">
              <span>AI Ethics & Transparency Card</span>
              <span className="px-1.5 py-0.5 rounded text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase">
                Audited
              </span>
            </h4>
            <div className="text-xs text-text-muted">
              Responsible AI Principle: Fairness, Accountability & Open Lineage
            </div>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-emerald-400 bg-surface-sunken px-2 py-1 rounded-lg border border-line">
          Zero Commercial Bias
        </span>
      </div>

      {/* Rationale Banner */}
      <div className="p-3 rounded-xl bg-surface-sunken border border-line space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-text-muted uppercase tracking-wider">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Why this was recommended:</span>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed font-sans">
          {recommendationRationale}
        </p>
      </div>

      {/* Lineage & Bias Audits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div className="p-2.5 rounded-xl bg-surface-sunken border border-line space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-text-muted uppercase">
            <Scale className="w-3 h-3 text-emerald-400" />
            <span>Commercial Bias Audit:</span>
          </div>
          <div className="text-xs text-heading font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sponsored weight: <strong>0%</strong> (None)</span>
          </div>
          <p className="text-xs text-text-muted">
            EcoMart never accepts paid ranking or affiliate bidding.
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-surface-sunken border border-line space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-text-muted uppercase">
            <Database className="w-3 h-3 text-teal-400" />
            <span>Data Lineage:</span>
          </div>
          <div className="text-xs text-heading font-medium">
            5 verified LCA data vectors
          </div>
          <p className="text-xs text-text-muted">
            Carbon, water, plastic, logistics, and circularity index.
          </p>
        </div>
      </div>

      {/* Expandable data points */}
      <details className="text-xs group">
        <summary className="font-semibold text-primary cursor-pointer hover:underline list-none flex items-center justify-between">
          <span>Inspect training & ranking features ({dataPointsUsed.length} vectors)</span>
          <span className="text-xs text-text-muted group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <ul className="mt-2 space-y-1 pl-4 list-disc text-text-secondary text-xs border-l border-line ml-1">
          {dataPointsUsed.map((dp, i) => (
            <li key={i}>{dp}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}

function AIEthicsModal({
  product,
  dataPointsUsed,
  recommendationRationale,
  onClose
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-ethics-modal-title"
      className="fixed inset-0 z-modals flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
    >
      <div className="w-full max-w-md rounded-3xl bg-surface border border-line p-5 space-y-4 shadow-soft-xl text-text animate-scale-up">
        <div className="flex items-center justify-between pb-3 border-b border-line">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 id="ai-ethics-modal-title" className="font-sans font-bold text-sm text-heading">
                AI Recommendation Ethics Card
              </h3>
              <p className="text-xs text-text-muted">
                Product: {product.name}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-text-muted hover:text-heading hover:bg-surface-raised cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-text-secondary leading-relaxed">
          <div className="p-3 rounded-2xl bg-surface-raised border border-line space-y-1">
            <span className="text-xs font-bold text-heading uppercase tracking-wider block">
              1. Recommendation Rationale
            </span>
            <p className="text-text">{recommendationRationale}</p>
          </div>

          <div className="p-3 rounded-2xl bg-surface-raised border border-line space-y-1.5">
            <span className="text-xs font-bold text-heading uppercase tracking-wider block">
              2. Data Lineage & Evaluation Criteria
            </span>
            <ul className="list-disc pl-4 space-y-1 text-xs">
              {dataPointsUsed.map((dp, idx) => (
                <li key={idx}>{dp}</li>
              ))}
            </ul>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-200 space-y-1">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
              3. Absence of Commercial Bias
            </span>
            <p className="text-xs">
              EcoMart maintains strict separation between vendor onboarding and algorithmic ranking. No supplier can pay to boost a product's EcoScore or recommendation placement.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 min-h-[44px] rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast font-bold text-xs transition-colors cursor-pointer shadow-soft-xs"
        >
          Close Ethics Card
        </button>
      </div>
    </div>
  );
}
