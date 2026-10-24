import React, { useState, useMemo, useCallback } from 'react';
import { X, Sparkles, TrendingUp, ShoppingBag, Info, Filter } from 'lucide-react';
import { calculateEcoScore } from '../../lib/ecoScore';
import { useCart } from '../../context/CartContext';
import EcoScoreBadge from '../EcoScoreBadge';

export default function TradeoffExplorerModal({ isOpen, onClose, products = [] }) {
  const { addToCart, showToast, addToCompare, setIsCompareOpen } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [onlyPareto, setOnlyPareto] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  // Compute EcoScore and coordinates for products
  const scoredProducts = useMemo(() => {
    return products.map((p) => {
      const eco = calculateEcoScore(p);
      return {
        ...p,
        ecoScore: eco?.score || 50,
        grade: eco?.grade || 'C',
        uncertaintyMargin: eco?.uncertaintyMargin || 5
      };
    });
  }, [products]);

  // Categories
  const categories = useMemo(() => {
    return ['All', ...new Set(scoredProducts.map((p) => p.category))];
  }, [scoredProducts]);

  // Filter products
  const filteredProducts = useMemo(() => {
    let list = scoredProducts;
    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory);
    }
    return list;
  }, [scoredProducts, selectedCategory]);

  // Compute Pareto Frontier
  // A product is on the Pareto frontier if no other product has <= price AND > ecoScore
  const { paretoItems, frontierPoints } = useMemo(() => {
    const sorted = [...filteredProducts].sort((a, b) => a.price - b.price);
    const pareto = [];
    let maxScoreSeen = -1;

    for (const item of sorted) {
      if (item.ecoScore > maxScoreSeen) {
        pareto.push(item);
        maxScoreSeen = item.ecoScore;
      }
    }

    return {
      paretoItems: new Set(pareto.map((p) => p.id)),
      frontierPoints: pareto
    };
  }, [filteredProducts]);

  // Plot Dimensions
  const plotWidth = 720;
  const plotHeight = 360;
  const padding = useMemo(() => ({ top: 30, right: 40, bottom: 50, left: 60 }), []);

  const innerWidth = plotWidth - padding.left - padding.right;
  const innerHeight = plotHeight - padding.top - padding.bottom;

  // Axis ranges
  const maxPrice = useMemo(() => {
    const max = Math.max(...filteredProducts.map((p) => p.price), 2000);
    return Math.ceil(max / 500) * 500;
  }, [filteredProducts]);

  const minPrice = 0;
  const minScore = 30;
  const maxScore = 100;

  const scaleX = useCallback((price) => {
    const clamped = Math.max(minPrice, Math.min(maxPrice, price));
    return padding.left + ((clamped - minPrice) / (maxPrice - minPrice)) * innerWidth;
  }, [maxPrice, innerWidth, padding.left]);

  const scaleY = useCallback((score) => {
    const clamped = Math.max(minScore, Math.min(maxScore, score));
    return padding.top + innerHeight - ((clamped - minScore) / (maxScore - minScore)) * innerHeight;
  }, [innerHeight, padding.top]);

  // SVG Path for Pareto Frontier
  const frontierPath = useMemo(() => {
    if (frontierPoints.length === 0) return '';
    return frontierPoints
      .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${scaleX(p.price)} ${scaleY(p.ecoScore)}`)
      .join(' ');
  }, [frontierPoints, scaleX, scaleY]);

  const activeFocus = selectedProduct || hoveredProduct;

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Tradeoff Explorer (Price vs EcoScore Pareto Frontier)"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in text-left"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl rounded-3xl bg-surface-raised border border-line p-6 sm:p-7 shadow-soft-2xl space-y-5 animate-scale-up max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-line pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-xl text-heading">
                  Trade-off Explorer &amp; Pareto Frontier
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-mono font-bold uppercase">
                  Multi-Objective Optimization
                </span>
              </div>
              <p className="text-xs text-secondary mt-0.5">
                Compare price investment vs lifecycle sustainability. Find non-dominated &ldquo;sweet spot&rdquo; products.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Tradeoff Explorer"
            className="w-9 h-9 rounded-full flex items-center justify-center text-muted hover:text-heading hover:bg-surface-sunken transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-surface-sunken p-3 rounded-2xl border border-line">
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-[10px] font-mono uppercase text-muted mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-contrast border-primary shadow-soft-xs'
                    : 'bg-surface text-secondary border-line hover:text-heading'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Pareto Only Toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none shrink-0 text-xs font-semibold text-heading">
            <input
              type="checkbox"
              checked={onlyPareto}
              onChange={(e) => setOnlyPareto(e.target.checked)}
              className="accent-primary rounded cursor-pointer"
            />
            <span>Highlight Pareto Frontier Only</span>
          </label>
        </div>

        {/* 2D Scatter Chart Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Chart SVG Canvas (8 Cols) */}
          <div className="lg:col-span-8 bg-surface rounded-2xl border border-line p-4 shadow-soft-xs relative overflow-hidden">
            <div className="flex items-center justify-between text-[11px] text-muted mb-2 font-mono">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                Pareto Non-Dominated Frontier
              </span>
              <span>Y: EcoScore (0-100) • X: Price (₹)</span>
            </div>

            <svg
              viewBox={`0 0 ${plotWidth} ${plotHeight}`}
              className="w-full h-auto select-none overflow-visible"
            >
              {/* Gridlines - Horizontal (Score) */}
              {[40, 60, 80, 100].map((score) => {
                const y = scaleY(score);
                return (
                  <g key={score}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={plotWidth - padding.right}
                      y2={y}
                      stroke="var(--color-line)"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                    <text
                      x={padding.left - 10}
                      y={y + 4}
                      fill="var(--color-text-muted)"
                      fontSize="10"
                      textAnchor="end"
                      fontFamily="monospace"
                    >
                      {score}
                    </text>
                  </g>
                );
              })}

              {/* Gridlines - Vertical (Price) */}
              {[500, 1000, 1500, 2000, 2500]
                .filter((p) => p <= maxPrice)
                .map((price) => {
                  const x = scaleX(price);
                  return (
                    <g key={price}>
                      <line
                        x1={x}
                        y1={padding.top}
                        x2={x}
                        y2={plotHeight - padding.bottom}
                        stroke="var(--color-line)"
                        strokeDasharray="4 4"
                        strokeWidth="1"
                      />
                      <text
                        x={x}
                        y={plotHeight - padding.bottom + 18}
                        fill="var(--color-text-muted)"
                        fontSize="10"
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        ₹{price}
                      </text>
                    </g>
                  );
                })}

              {/* Axis Labels */}
              <text
                x={padding.left}
                y={padding.top - 12}
                fill="var(--color-heading)"
                fontSize="11"
                fontWeight="bold"
              >
                ↑ EcoScore (Higher is cleaner)
              </text>
              <text
                x={plotWidth - padding.right}
                y={plotHeight - padding.bottom + 36}
                fill="var(--color-heading)"
                fontSize="11"
                fontWeight="bold"
                textAnchor="end"
              >
                Price (₹) →
              </text>

              {/* Pareto Frontier Curve */}
              {frontierPath && (
                <path
                  d={frontierPath}
                  fill="none"
                  stroke="var(--color-primary)"
                  strokeWidth="2.5"
                  strokeDasharray="2 2"
                  className="opacity-80"
                />
              )}

              {/* Product Scatter Nodes */}
              {filteredProducts.map((p) => {
                const cx = scaleX(p.price);
                const cy = scaleY(p.ecoScore);
                const isPareto = paretoItems.has(p.id);
                const isSelected = selectedProduct?.id === p.id;
                const isHovered = hoveredProduct?.id === p.id;

                if (onlyPareto && !isPareto) return null;

                const nodeRadius = isPareto ? (isSelected || isHovered ? 9 : 7) : 5;
                const strokeColor = isPareto ? 'var(--color-primary)' : 'var(--color-line)';
                const fillColor = isPareto
                  ? 'var(--color-primary)'
                  : p.ecoScore >= 80
                  ? 'var(--color-secondary)'
                  : 'var(--color-surface-sunken)';

                return (
                  <g
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    onMouseEnter={() => setHoveredProduct(p)}
                    onMouseLeave={() => setHoveredProduct(null)}
                    className="cursor-pointer transition-transform duration-200"
                  >
                    {/* Pulsing ring for Pareto optimal items */}
                    {isPareto && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={nodeRadius + 4}
                        fill="none"
                        stroke="var(--color-primary)"
                        strokeWidth="1.5"
                        opacity="0.35"
                        className="animate-ping"
                      />
                    )}

                    <circle
                      cx={cx}
                      cy={cy}
                      r={nodeRadius}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isSelected || isHovered ? 3 : 1.5}
                      className="transition-all hover:scale-125"
                    />

                    {/* Node label for key frontier points */}
                    {isPareto && (
                      <text
                        x={cx + 10}
                        y={cy + 3}
                        fill="var(--color-heading)"
                        fontSize="9"
                        fontWeight="600"
                        className="pointer-events-none drop-shadow-xs"
                      >
                        {p.name.slice(0, 12)}..
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Details / Inspection Drawer (4 Cols) */}
          <div className="lg:col-span-4 bg-surface rounded-2xl border border-line p-5 shadow-soft-xs space-y-4">
            {activeFocus ? (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-start justify-between gap-2 border-b border-line pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted block">
                      {activeFocus.category}
                    </span>
                    <h3 className="font-serif font-bold text-base text-heading leading-tight mt-0.5">
                      {activeFocus.name}
                    </h3>
                  </div>
                  <EcoScoreBadge
                    score={activeFocus.ecoScore}
                    grade={activeFocus.grade}
                    size="sm"
                    variant="ring"
                  />
                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-muted">Price: </span>
                    <span className="text-xl font-serif font-bold text-heading">
                      ₹{activeFocus.price}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-muted">EcoScore: </span>
                    <span className="text-lg font-serif font-bold text-primary">
                      {activeFocus.ecoScore}/100
                    </span>
                  </div>
                </div>

                {/* Pareto Status Banner */}
                <div
                  className={`p-3 rounded-xl border text-xs space-y-1 ${
                    paretoItems.has(activeFocus.id)
                      ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 border-emerald-500/30'
                      : 'bg-surface-sunken text-secondary border-line'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    {paretoItems.has(activeFocus.id) ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Pareto Optimal Choice</span>
                      </>
                    ) : (
                      <>
                        <Info className="w-3.5 h-3.5 text-muted" />
                        <span>Dominated Trade-off</span>
                      </>
                    )}
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {paretoItems.has(activeFocus.id)
                      ? 'No other item in this catalog offers a higher EcoScore at a lower or equal price.'
                      : 'Frontier items exist that offer equivalent or better sustainability at a similar price tier.'}
                  </p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-sans">
                  <div className="p-2 rounded-lg bg-surface-sunken border border-line">
                    <span className="text-muted block text-[10px]">Embodied Carbon</span>
                    <span className="font-bold text-heading">{activeFocus.carbonKg} kg CO₂</span>
                  </div>
                  <div className="p-2 rounded-lg bg-surface-sunken border border-line">
                    <span className="text-muted block text-[10px]">Plastic Waste</span>
                    <span className="font-bold text-heading">{activeFocus.plasticGrams} g</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2 border-t border-line">
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(activeFocus, 1);
                      showToast(`Added ${activeFocus.name} to cart`, 'success');
                    }}
                    className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast font-bold text-xs flex items-center justify-center gap-2 shadow-soft-xs transition-colors cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-primary-contrast" />
                    <span>Add to Cart (₹{activeFocus.price})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      addToCompare?.(activeFocus);
                      setIsCompareOpen?.(true);
                      showToast(`Added ${activeFocus.name} to compare`, 'info');
                    }}
                    className="w-full py-2 rounded-xl bg-surface-sunken hover:bg-surface text-secondary border border-line text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>+ Add to Compare Matrix</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-muted space-y-2">
                <div className="w-10 h-10 rounded-full bg-surface-sunken border border-line text-secondary mx-auto flex items-center justify-center text-lg">
                  📍
                </div>
                <h4 className="font-serif font-bold text-sm text-heading">Click any dot on the chart</h4>
                <p className="text-xs text-secondary max-w-[200px] mx-auto">
                  Inspect tradeoffs, price-efficiency, and Pareto frontier optimality.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
