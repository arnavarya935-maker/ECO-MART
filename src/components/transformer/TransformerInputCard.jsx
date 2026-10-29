import React from 'react';
import { Sparkles, X, Wand2 } from 'lucide-react';
import VoiceInputButton from './VoiceInputButton';
import { useT } from '../../context/I18nContext';

export const EXAMPLE_PRESETS = [
  {
    id: 'student',
    labelKey: 'transformer.exampleStudent',
    defaultLabel: '🎒 Student Essentials (₹1500)',
    text: 'notebooks, pens, water bottle, backpack under ₹1500'
  },
  {
    id: 'bathroom',
    labelKey: 'transformer.exampleBathroom',
    defaultLabel: '🛁 Bathroom Restock (₹1200)',
    text: 'toothbrush, shampoo bottle, soap, razor, toilet brush under ₹1200'
  },
  {
    id: 'kitchen',
    labelKey: 'transformer.exampleKitchen',
    defaultLabel: '🍳 Kitchen Restock (₹1000)',
    text: 'dish soap, sponges, food cling wrap, cutlery, carry bags under ₹1000'
  },
  {
    id: 'hinglish',
    labelKey: 'transformer.exampleHinglish',
    defaultLabel: '🇮🇳 Hinglish Daily List',
    text: '2 plastic ki bottle, tooth brush, sabun, notebok'
  }
];

export default function TransformerInputCard({
  text,
  setText,
  budget,
  setBudget,
  onTransform,
  loading = false
}) {
  const { t } = useT();

  const handleVoiceTranscript = (transcript) => {
    if (!transcript) return;
    setText((prev) => (prev ? `${prev}, ${transcript}` : transcript));
  };

  const handleApplyPreset = (presetText) => {
    setText(presetText);
  };

  const handleClear = () => {
    setText('');
    setBudget('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || loading) return;
    onTransform();
  };

  return (
    <div className="bg-surface border border-line rounded-3xl p-6 sm:p-8 shadow-soft-sm space-y-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Header with Title and Clear Button */}
        <div className="flex items-center justify-between">
          <label
            htmlFor="cart-transformer-input"
            className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Enter Your Shopping List</span>
          </label>
          {text && (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-muted hover:text-heading flex items-center gap-1 cursor-pointer transition min-h-[36px] px-2 focus-visible:outline-2 focus-visible:outline-focus"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Textarea Container with Integrated Voice Button */}
        <div className="relative">
          <textarea
            id="cart-transformer-input"
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t(
              'transformer.inputPlaceholder',
              'e.g. toothbrush, shampoo bottle, 2 plastic water bottles, notebooks, dish soap, polybags under ₹1500'
            )}
            className="w-full p-4 pr-14 rounded-2xl bg-surface-raised border border-line focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm sm:text-base text-heading placeholder:text-muted transition resize-y font-sans leading-relaxed focus-visible:outline-none"
          />
          <div className="absolute right-3 bottom-3">
            <VoiceInputButton onTranscript={handleVoiceTranscript} disabled={loading} />
          </div>
        </div>

        {/* Product Input Tip */}
        <p className="text-xs text-secondary flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
          <span>
            {t(
              'transformer.inputTip',
              'Tip: Paste items from your grocery receipt or shopping list to calculate sustainable swaps.'
            )}
          </span>
        </p>

        {/* Controls Bar: Budget Input & Primary Action Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <div className="flex-1 flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted">
                ₹
              </span>
              <input
                id="cart-transformer-budget"
                type="number"
                min="0"
                step="10"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder={t('transformer.budgetPlaceholder', '₹ Max Budget (optional)')}
                aria-label={t('transformer.budgetLabel', 'Budget Limit (optional)')}
                className="w-full pl-8 pr-4 py-3 rounded-2xl bg-surface-raised border border-line focus:border-primary focus:ring-2 focus:ring-primary/20 text-xs sm:text-sm text-heading placeholder:text-muted transition min-h-[44px] focus-visible:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!text.trim() || loading}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium text-xs sm:text-sm transition cursor-pointer min-h-[44px] shadow-soft-sm active:scale-98 focus-visible:outline-2 focus-visible:outline-focus ${
              !text.trim() || loading
                ? 'bg-surface-sunken text-muted border border-line cursor-not-allowed'
                : 'bg-primary hover:bg-primary-hover text-primary-contrast shadow-soft-md'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {loading
                ? t('transformer.transforming', 'Analyzing & Optimising...')
                : t('transformer.transformCta', 'Transform My List')}
            </span>
          </button>
        </div>
      </form>

      {/* Preset Chips */}
      <div className="border-t border-line pt-4 space-y-2">
        <div className="text-[11px] font-sans font-semibold uppercase tracking-wider text-muted">
          {t('transformer.tryExample', 'Try an example:')}
        </div>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleApplyPreset(p.text)}
              className="px-3.5 py-1.5 rounded-full bg-surface-sunken hover:bg-surface-raised border border-line hover:border-primary/40 text-xs text-secondary hover:text-heading transition cursor-pointer min-h-[36px] flex items-center focus-visible:outline-2 focus-visible:outline-focus"
            >
              {t(p.labelKey, p.defaultLabel)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
