import React, { useState } from 'react';
import { ArrowRight, RefreshCw, Check, HelpCircle, ChevronDown, CheckCircle2 } from 'lucide-react';
import ProductImage from '../ProductImage';
import EcoScoreBadge from '../EcoScoreBadge';
import { calculateEcoScore } from '../../lib/ecoScore';
import { useT } from '../../context/I18nContext';

export default function TransformerComparison({
  items = [],
  onToggleItem,
  onSelectAlternative,
  onResolveAmbiguity
}) {
  const { t } = useT();
  const [openAltIndex, setOpenAltIndex] = useState(null);

  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Column Headers (Desktop) */}
      <div className="hidden lg:grid grid-cols-2 gap-6 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-line" />
          <span>{t('transformer.beforeCart', 'Your Usual Cart')}</span>
        </div>
        <div className="flex items-center gap-2 text-primary">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span>{t('transformer.afterCart', 'Your Sustainable Cart')}</span>
        </div>
      </div>

      {/* Item Rows */}
      <div className="space-y-4">
        {items.map((item, idx) => {
          const qty = item.qty || 1;
          const isAltOpen = openAltIndex === idx;

          // Unmatched Row
          if (item.status === 'unmatched') {
            return (
              <div
                key={`unmatched-${idx}`}
                className="p-5 rounded-3xl bg-surface border border-line/60 shadow-soft-xs space-y-2 opacity-80"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-surface-sunken text-secondary">
                      {qty}x
                    </span>
                    <span className="text-sm font-medium text-heading capitalize">
                      {item.raw || item.name}
                    </span>
                  </div>
                  <span className="text-xs text-muted flex items-center gap-1 font-medium">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{t('transformer.unmatched', 'Not in catalog')}</span>
                  </span>
                </div>
                <p className="text-xs text-secondary leading-relaxed">
                  We could not find a verified match for &ldquo;{item.name}&rdquo; in our sustainable catalogue.
                  {item.suggestion && (
                    <span> Did you mean <strong className="text-heading">&ldquo;{item.suggestion}&rdquo;</strong>?</span>
                  )}
                </p>
              </div>
            );
          }

          // Ambiguous Row with Clarifying Chips
          if (item.status === 'ambiguous') {
            return (
              <div
                key={`ambiguous-${idx}`}
                className="p-5 rounded-3xl bg-surface-raised border border-primary/30 shadow-soft-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-surface-sunken text-secondary">
                      {qty}x
                    </span>
                    <span className="text-sm font-medium text-heading capitalize">
                      {item.raw || item.name}
                    </span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                    Clarification Needed
                  </span>
                </div>
                <p className="text-xs text-secondary">
                  {item.clarifyingQuestion || 'Which product type did you mean?'}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(item.chips || []).map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => onResolveAmbiguity?.(idx, chip)}
                      className="px-3.5 py-1.5 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-primary-contrast border border-primary/20 text-xs font-medium transition cursor-pointer min-h-[36px] focus-visible:outline-2 focus-visible:outline-focus"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            );
          }

          const before = item.before;
          const after = item.after || before;
          const beforeScore = before ? calculateEcoScore(before) : null;
          const afterScore = after ? calculateEcoScore(after) : null;
          const isSwapped = item.status === 'swapped' && before?.id !== after?.id;
          const isKept = item.status === 'kept';
          const isNoBetter = item.status === 'no-better-option';

          return (
            <div
              key={`row-${idx}-${before?.id || ''}`}
              className="p-5 sm:p-6 rounded-3xl bg-surface border border-line shadow-soft-xs transition space-y-4"
            >
              {/* Row Sub-header: Item Query & Quantity */}
              <div className="flex items-center justify-between border-b border-line pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-surface-sunken text-primary">
                    {qty}x
                  </span>
                  <h4 className="text-sm sm:text-base font-serif font-bold text-heading capitalize">
                    {item.raw || item.name}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  {isSwapped && (
                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Greener Swap</span>
                    </span>
                  )}
                  {isKept && (
                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      Already Sustainable
                    </span>
                  )}
                  {isNoBetter && (
                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-surface-sunken text-secondary border border-line">
                      Usual Baseline
                    </span>
                  )}
                </div>
              </div>

              {/* Two Column Before / After Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-stretch">
                {/* Left Side: Before (Conventional Baseline) */}
                <div className="p-4 rounded-2xl bg-surface-raised/60 border border-line/70 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-line">
                      <ProductImage
                        src={before?.image}
                        alt={before?.name || ''}
                        fallbackIcon={before?.icon || '📦'}
                        category={before?.category}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-sans text-muted">Usual Choice</div>
                      <div className="text-xs sm:text-sm font-medium text-heading truncate" title={before?.name}>
                        {before?.name || 'Conventional Item'}
                      </div>
                      <div className="text-xs font-semibold text-secondary mt-0.5">
                        ₹{(before?.price || 0) * qty}
                        {qty > 1 && <span className="text-[10px] text-muted font-normal"> (₹{before?.price} ea)</span>}
                      </div>
                    </div>
                  </div>

                  {beforeScore && (
                    <div className="shrink-0">
                      <EcoScoreBadge
                        score={beforeScore.score}
                        grade={beforeScore.grade}
                        size="sm"
                        variant="pill"
                      />
                    </div>
                  )}
                </div>

                {/* Right Side: After (Sustainable Choice) */}
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col justify-between gap-3 relative">
                  <div className="flex items-center justify-between gap-3 min-w-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-primary/30">
                        <ProductImage
                          src={after?.image}
                          alt={after?.name || ''}
                          fallbackIcon={after?.icon || '🎋'}
                          category={after?.category}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-sans text-primary font-semibold">Sustainable Choice</div>
                        <div className="text-xs sm:text-sm font-semibold text-heading truncate" title={after?.name}>
                          {after?.name}
                        </div>
                        <div className="text-xs font-bold text-heading mt-0.5">
                          ₹{(after?.price || 0) * qty}
                          {qty > 1 && <span className="text-[10px] text-muted font-normal"> (₹{after?.price} ea)</span>}
                        </div>
                      </div>
                    </div>

                    {afterScore && (
                      <div className="shrink-0">
                        <EcoScoreBadge
                          score={afterScore.score}
                          grade={afterScore.grade}
                          size="sm"
                          variant="pill"
                        />
                      </div>
                    )}
                  </div>

                  {/* Tradeoff and Action Toggles */}
                  <div className="pt-2 border-t border-primary/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="text-secondary font-sans text-[11px] leading-tight">
                      {item.tradeoff}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Toggle: Keep Original */}
                      {isSwapped && (
                        <button
                          type="button"
                          onClick={() => onToggleItem?.(idx)}
                          className="px-2.5 py-1 rounded-lg bg-surface-sunken hover:bg-surface border border-line text-[11px] font-medium text-secondary hover:text-heading cursor-pointer transition min-h-[32px] flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-focus"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>{t('transformer.keepOriginal', 'Keep original')}</span>
                        </button>
                      )}

                      {/* Revert back if currently kept at baseline */}
                      {!isSwapped && before?.id !== after?.id && (
                        <button
                          type="button"
                          onClick={() => onToggleItem?.(idx)}
                          className="px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-primary-contrast border border-primary/20 text-[11px] font-medium cursor-pointer transition min-h-[32px] flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-focus"
                        >
                          <Check className="w-3 h-3" />
                          <span>Switch to Eco</span>
                        </button>
                      )}

                      {/* Alternatives Dropdown Button */}
                      {item.alternatives && item.alternatives.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setOpenAltIndex(isAltOpen ? null : idx)}
                          className="px-2.5 py-1 rounded-lg bg-surface-sunken hover:bg-surface border border-line text-[11px] font-medium text-secondary hover:text-heading cursor-pointer transition min-h-[32px] flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-focus"
                        >
                          <span>{t('transformer.chooseAnother', 'Choose another')}</span>
                          <ChevronDown className={`w-3 h-3 transition-transform ${isAltOpen ? 'rotate-180' : ''}`} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expandable Alternatives Drawer */}
                  {isAltOpen && item.alternatives && (
                    <div className="mt-3 p-3 rounded-2xl bg-surface border border-line shadow-soft-sm space-y-2 animate-slide-up">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                        Other greener alternatives in catalog:
                      </div>
                      <div className="space-y-2">
                        {item.alternatives.map((alt) => {
                          const altScore = calculateEcoScore(alt);
                          return (
                            <div
                              key={alt.id}
                              onClick={() => {
                                onSelectAlternative?.(idx, alt);
                                setOpenAltIndex(null);
                              }}
                              className="p-2.5 rounded-xl border border-line hover:border-primary/40 bg-surface-raised hover:bg-primary/5 flex items-center justify-between gap-3 cursor-pointer transition"
                            >
                              <div className="min-w-0">
                                <div className="text-xs font-medium text-heading truncate">{alt.name}</div>
                                <div className="text-[11px] text-secondary">₹{alt.price * qty}</div>
                              </div>
                              <EcoScoreBadge
                                score={altScore.score}
                                grade={altScore.grade}
                                size="sm"
                                variant="pill"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Real Reason Breakdown */}
              {item.reason && (
                <div className="text-xs text-secondary font-sans leading-relaxed flex items-center gap-2 pt-1">
                  <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>{item.reason}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
