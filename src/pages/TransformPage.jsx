import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useT } from '../context/I18nContext';
import productsData from '../data/products.json';
import { calculateEcoScore } from '../lib/ecoScore';
import { transformShoppingList, matchItem } from '../lib/cartTransformer';
import TransformerInputCard from '../components/transformer/TransformerInputCard';
import TransformerThinking from '../components/transformer/TransformerThinking';
import TransformerComparison from '../components/transformer/TransformerComparison';
import TransformerSummaryBar from '../components/transformer/TransformerSummaryBar';
import TransformerActions from '../components/transformer/TransformerActions';

export default function TransformPage() {
  const location = useLocation();
  const { userPriorities } = useCart();
  const { t } = useT();

  const resultsHeadingRef = useRef(null);

  // Initial text from router state or localStorage
  const [text, setText] = useState(() => {
    try {
      if (location.state?.prefilledList) {
        return location.state.prefilledList;
      }
      return localStorage.getItem('ecomart_last_transformer_list') || '';
    } catch {
      return '';
    }
  });

  const [budget, setBudget] = useState(() => {
    return location.state?.budget || '';
  });
  const [stage, setStage] = useState('input'); // 'input' | 'thinking' | 'result'
  const [resultData, setResultData] = useState(null);

  // Persist text on change
  useEffect(() => {
    try {
      if (text) {
        localStorage.setItem('ecomart_last_transformer_list', text);
      }
    } catch {}
  }, [text]);

  // Execute list transformation
  const handleTransform = () => {
    if (!text.trim()) return;

    const customBudgetVal = budget && !isNaN(Number(budget)) ? Number(budget) : null;
    const transformed = transformShoppingList(text, productsData, userPriorities, customBudgetVal);

    setResultData(transformed);
    setStage('thinking');
  };

  const handleThinkingComplete = () => {
    setStage('result');
    setTimeout(() => {
      resultsHeadingRef.current?.focus();
    }, 100);
  };

  // Recompute live totals when user modifies choices
  const recalculateLiveTotals = (updatedItems) => {
    let priceBefore = 0;
    let priceAfter = 0;
    let plasticSaved = 0;
    let co2Saved = 0;
    let waterSaved = 0;
    let swappedCount = 0;
    let keptCount = 0;
    let totalQty = 0;
    let weightedBefore = 0;
    let weightedAfter = 0;

    updatedItems.forEach((item) => {
      if (!item.before && !item.after) return;
      const qty = item.qty || 1;
      const base = item.before || item.after;
      const chosen = item.after || item.before;

      const baseScore = calculateEcoScore(base).score;
      const chosenScore = calculateEcoScore(chosen).score;

      priceBefore += (base.price || 0) * qty;
      priceAfter += (chosen.price || 0) * qty;
      totalQty += qty;
      weightedBefore += baseScore * qty;
      weightedAfter += chosenScore * qty;

      if (chosen.id !== base.id) {
        swappedCount++;
        plasticSaved += Math.max(0, ((base.plasticGrams || 0) - (chosen.plasticGrams || 0)) * qty);
        co2Saved += Math.max(0, ((base.carbonKg || 0) - (chosen.carbonKg || 0)) * qty);
        waterSaved += Math.max(0, ((base.waterLitres || 0) - (chosen.waterLitres || 0)) * qty);
      } else {
        keptCount++;
      }
    });

    const purposeScoreBefore = totalQty > 0 ? Math.round(weightedBefore / totalQty) : 0;
    const purposeScoreAfter = totalQty > 0 ? Math.round(weightedAfter / totalQty) : 0;

    return {
      priceBefore,
      priceAfter,
      priceDelta: priceAfter - priceBefore,
      purposeScoreBefore,
      purposeScoreAfter,
      ecoScoreBefore: purposeScoreBefore,
      ecoScoreAfter: purposeScoreAfter,
      plasticSaved: Math.round(plasticSaved),
      co2Saved: Number(co2Saved.toFixed(2)),
      waterSaved: Math.round(waterSaved),
      itemsSwapped: swappedCount,
      itemsKept: keptCount,
      itemsUnmatched: resultData?.totals?.itemsUnmatched || 0,
      itemsAmbiguous: resultData?.totals?.itemsAmbiguous || 0,
      effectiveBudget: resultData?.budget || 0,
      overBudget: (resultData?.budget || 0) > 0 && priceAfter > (resultData?.budget || 0)
    };
  };

  // Toggle single item between greener alternative and baseline
  const handleToggleItem = (index) => {
    if (!resultData?.items?.[index]) return;

    const updatedItems = [...resultData.items];
    const item = { ...updatedItems[index] };

    if (item.status === 'swapped') {
      // Revert to conventional baseline
      item.status = 'kept';
      item.after = item.before;
      item.tradeoff = 'Reverted to conventional baseline';
    } else {
      // Switch back to greener alternative
      const originalGroupAlt = item.alternatives?.[0] || item.after;
      item.status = 'swapped';
      item.after = originalGroupAlt;
      item.tradeoff = `₹${(item.after.price - item.before.price) * (item.qty || 1)} delta`;
    }

    updatedItems[index] = item;
    const liveTotals = recalculateLiveTotals(updatedItems);

    setResultData({
      ...resultData,
      items: updatedItems,
      totals: liveTotals
    });
  };

  // Select a different greener alternative from dropdown
  const handleSelectAlternative = (index, newAlternative) => {
    if (!resultData?.items?.[index] || !newAlternative) return;

    const updatedItems = [...resultData.items];
    const item = { ...updatedItems[index] };

    const oldAfter = item.after;
    item.after = newAlternative;
    item.status = 'swapped';
    item.alternatives = [
      ...item.alternatives.filter((a) => a.id !== newAlternative.id),
      oldAfter
    ].filter((p) => p && p.id !== item.before?.id);

    const priceDelta = (newAlternative.price - item.before.price) * (item.qty || 1);
    item.tradeoff = priceDelta > 0 ? `₹${priceDelta} more` : `₹${Math.abs(priceDelta)} cheaper`;

    updatedItems[index] = item;
    const liveTotals = recalculateLiveTotals(updatedItems);

    setResultData({
      ...resultData,
      items: updatedItems,
      totals: liveTotals
    });
  };

  // Resolve ambiguous chip selection on the fly
  const handleResolveAmbiguity = (index, selectedChip) => {
    if (!resultData?.items?.[index]) return;

    const updatedItems = [...resultData.items];
    const item = { ...updatedItems[index] };

    const matched = matchItem(selectedChip, productsData);
    if (matched.status === 'matched') {
      const conv = matched.baselineProduct;
      const eco = matched.primaryEcoProduct;
      item.status = 'swapped';
      item.before = conv;
      item.after = eco;
      item.name = selectedChip;
      item.reason = `Upgraded ${selectedChip} to eco alternative.`;
      item.tradeoff = `₹${(eco.price - conv.price) * (item.qty || 1)} delta`;
      item.alternatives = (matched.greenerIds || [])
        .map((id) => productsData.find((p) => p.id === id))
        .filter((p) => p && p.id !== eco.id);

      updatedItems[index] = item;
      const liveTotals = recalculateLiveTotals(updatedItems);

      setResultData({
        ...resultData,
        items: updatedItems,
        totals: liveTotals
      });
    }
  };

  const handleReset = () => {
    setStage('input');
    setResultData(null);
  };

  return (
    <div className="min-h-screen bg-surface text-text py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Page Title & Mission Statement */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('transformer.badge', 'Local AI • Multi-Choice Knapsack Optimiser')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-heading">
          {t('transformer.title', 'Cart Transformer')}
        </h1>
        <p className="text-sm sm:text-base text-secondary max-w-2xl leading-relaxed">
          {t(
            'transformer.subtitle',
            'Paste your ordinary shopping list — our Eco Agent transforms it into a sustainable, budget-respecting cart.'
          )}
        </p>
      </div>

      {/* Stage 1: Input Form */}
      {stage === 'input' && (
        <TransformerInputCard
          text={text}
          setText={setText}
          budget={budget}
          setBudget={setBudget}
          onTransform={handleTransform}
          loading={false}
        />
      )}

      {/* Stage 2: Thinking & Reasoning Trace */}
      {stage === 'thinking' && resultData && (
        <TransformerThinking
          trace={resultData.trace}
          onComplete={handleThinkingComplete}
        />
      )}

      {/* Stage 3: Results & Comparison */}
      {stage === 'result' && resultData && (
        <div className="space-y-8 animate-fade-in">
          {/* Header Bar with Back Button */}
          <div className="flex items-center justify-between border-b border-line pb-4">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 text-xs font-medium text-secondary hover:text-heading cursor-pointer transition min-h-[36px] px-2 focus-visible:outline-2 focus-visible:outline-focus"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Edit List</span>
            </button>

            <h2
              id="results-heading"
              ref={resultsHeadingRef}
              tabIndex={-1}
              className="text-base sm:text-lg font-serif font-bold text-heading focus-visible:outline-none"
            >
              Sustainable Transformation Results
            </h2>

            <span className="text-xs text-muted font-sans font-medium">
              {resultData.items.length} items evaluated
            </span>
          </div>

          {/* Impact Summary Bar */}
          <TransformerSummaryBar totals={resultData.totals} />

          {/* Action Bar */}
          <TransformerActions
            items={resultData.items}
            totals={resultData.totals}
            onReset={handleReset}
          />

          {/* Side-by-side Before vs After Comparison */}
          <TransformerComparison
            items={resultData.items}
            onToggleItem={handleToggleItem}
            onSelectAlternative={handleSelectAlternative}
            onResolveAmbiguity={handleResolveAmbiguity}
          />

          {/* Footer Action Bar */}
          <TransformerActions
            items={resultData.items}
            totals={resultData.totals}
            onReset={handleReset}
          />
        </div>
      )}
    </div>
  );
}
