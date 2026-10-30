import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowUpRight, Sparkles, Check } from 'lucide-react';
import { useT } from '../../context/I18nContext';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductsContext';
import { calculateEcoScore } from '../../lib/ecoScore';
import RevealMotion from './RevealMotion';

export default function CinematicMosaic() {
  const { lang } = useT();
  const { addToCart } = useCart();
  const { products, loading } = useProducts();

  // Pick 3 high-grade eco products for the mosaic
  const itemLarge = products.find((p) => p.id === 'kit-01') || products[0];
  const itemStacked1 = products.find((p) => p.id === 'per-01') || products[1];
  const itemStacked2 = products.find((p) => p.id === 'hom-01') || products[2];

  const scoreLarge = itemLarge ? calculateEcoScore(itemLarge) : null;
  const score1 = itemStacked1 ? calculateEcoScore(itemStacked1) : null;
  const score2 = itemStacked2 ? calculateEcoScore(itemStacked2) : null;

  return (
    <section
      id="chapter-02"
      className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-line/60"
      aria-label="Chapter 02: Selected Alternatives"
    >
      {/* Chapter Section Header with Hairline Rule */}
      <RevealMotion delay={0}>
        <div className="flex items-center gap-4 mb-8">
          <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-primary whitespace-nowrap">
            02 — Selected Alternatives
          </span>
          <div className="h-px bg-line flex-1" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted px-2 py-0.5 rounded bg-surface-raised border border-line">
            Curated Swaps
          </span>
        </div>
      </RevealMotion>

      {/* Section Headline */}
      <div className="max-w-2xl mb-12">
        <RevealMotion delay={80}>
          <h2 className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-tight text-heading leading-[1.08] text-balance">
            {lang === 'hi'
              ? 'पारंपरिक वस्तुओं को जागरूक विकल्पों से बदलें।'
              : 'Replace conventional with conscious.'}
          </h2>
        </RevealMotion>
      </div>

      {/* Mosaic Grid: 1 Large Left Card + 2 Stacked Right Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Large Featured Card (7 cols on lg) */}
        {itemLarge && (
          <div className="lg:col-span-7">
            <RevealMotion delay={160}>
              <div className="group relative rounded-2xl bg-surface-raised/80 border border-line p-6 shadow-soft-md backdrop-blur-sm flex flex-col justify-between h-full transition-all duration-300 hover:border-primary/40">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-primary uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{itemLarge.category}</span>
                    </span>
                    {scoreLarge && (
                      <span className="px-2.5 py-1 rounded-full bg-surface-sunken border border-primary/30 text-xs font-mono font-bold text-primary">
                        Grade {scoreLarge.grade} • {scoreLarge.score}/100
                      </span>
                    )}
                  </div>

                  {/* Packshot on soft lighter panel */}
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[#0E2218] border border-line/60 flex items-center justify-center p-6 mb-5">
                    <img
                      src={itemLarge.image}
                      alt={itemLarge.name}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex items-baseline justify-between gap-3 mb-2">
                    <h3 className="text-lg sm:text-xl font-bold text-heading group-hover:text-primary transition-colors">
                      {itemLarge.name}
                    </h3>
                    <span className="text-xl font-mono font-bold text-heading">
                      ₹{itemLarge.price}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-4">
                    {itemLarge.description}
                  </p>

                  <div className="flex flex-wrap gap-2 text-[11px] font-mono text-text-muted mb-6">
                    <span className="px-2 py-0.5 rounded bg-surface border border-line">
                      Material: {itemLarge.material}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-surface border border-line text-primary">
                      {itemLarge.packaging}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-line/60">
                  <button
                    type="button"
                    onClick={() => addToCart(itemLarge)}
                    className="min-h-[44px] flex-1 py-2.5 px-4 rounded-xl bg-primary text-primary-contrast font-semibold text-xs flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                  <Link
                    to={`/product/${itemLarge.id}`}
                    className="min-h-[44px] px-4 py-2.5 rounded-xl bg-surface hover:bg-surface-sunken border border-line text-heading text-xs font-medium flex items-center gap-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-focus"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </RevealMotion>
          </div>
        )}

        {/* Stacked Cards (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Stacked Card 1 */}
          {itemStacked1 && (
            <RevealMotion delay={240}>
              <div className="group rounded-2xl bg-surface-raised/80 border border-line p-5 shadow-soft-sm backdrop-blur-sm transition-all duration-300 hover:border-primary/40 flex flex-col justify-between">
                <div className="flex gap-4 items-start">
                  {/* Smaller Packshot Thumbnail */}
                  <div className="w-24 h-24 shrink-0 rounded-xl bg-[#0E2218] border border-line/60 flex items-center justify-center p-2 overflow-hidden">
                    <img
                      src={itemStacked1.image}
                      alt={itemStacked1.name}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-mono text-primary uppercase">
                        {itemStacked1.category}
                      </span>
                      {score1 && (
                        <span className="text-[10px] font-mono font-bold text-primary px-1.5 py-0.5 rounded bg-surface border border-primary/20">
                          Grade {score1.grade}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-heading truncate group-hover:text-primary transition-colors">
                      {itemStacked1.name}
                    </h3>
                    <div className="text-xs font-mono font-bold text-heading mt-0.5 mb-1">
                      ₹{itemStacked1.price}
                    </div>
                    <p className="text-[11px] text-text-secondary line-clamp-2">
                      {itemStacked1.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 mt-3 border-t border-line/60">
                  <button
                    type="button"
                    onClick={() => addToCart(itemStacked1)}
                    className="min-h-[44px] flex-1 py-1.5 px-3 rounded-lg bg-surface hover:bg-surface-sunken border border-line text-xs font-medium text-heading flex items-center justify-center gap-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-primary" />
                    <span>Add to Cart</span>
                  </button>
                  <Link
                    to={`/product/${itemStacked1.id}`}
                    className="min-h-[44px] px-3 py-1.5 rounded-lg border border-line hover:bg-surface text-text-secondary hover:text-heading text-xs flex items-center justify-center focus-visible:outline-2 focus-visible:outline-focus"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </RevealMotion>
          )}

          {/* Stacked Card 2 */}
          {itemStacked2 && (
            <RevealMotion delay={320}>
              <div className="group rounded-2xl bg-surface-raised/80 border border-line p-5 shadow-soft-sm backdrop-blur-sm transition-all duration-300 hover:border-primary/40 flex flex-col justify-between">
                <div className="flex gap-4 items-start">
                  {/* Smaller Packshot Thumbnail */}
                  <div className="w-24 h-24 shrink-0 rounded-xl bg-[#0E2218] border border-line/60 flex items-center justify-center p-2 overflow-hidden">
                    <img
                      src={itemStacked2.image}
                      alt={itemStacked2.name}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-mono text-primary uppercase">
                        {itemStacked2.category}
                      </span>
                      {score2 && (
                        <span className="text-[10px] font-mono font-bold text-primary px-1.5 py-0.5 rounded bg-surface border border-primary/20">
                          Grade {score2.grade}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-heading truncate group-hover:text-primary transition-colors">
                      {itemStacked2.name}
                    </h3>
                    <div className="text-xs font-mono font-bold text-heading mt-0.5 mb-1">
                      ₹{itemStacked2.price}
                    </div>
                    <p className="text-[11px] text-text-secondary line-clamp-2">
                      {itemStacked2.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 mt-3 border-t border-line/60">
                  <button
                    type="button"
                    onClick={() => addToCart(itemStacked2)}
                    className="min-h-[44px] flex-1 py-1.5 px-3 rounded-lg bg-surface hover:bg-surface-sunken border border-line text-xs font-medium text-heading flex items-center justify-center gap-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-primary" />
                    <span>Add to Cart</span>
                  </button>
                  <Link
                    to={`/product/${itemStacked2.id}`}
                    className="min-h-[44px] px-3 py-1.5 rounded-lg border border-line hover:bg-surface text-text-secondary hover:text-heading text-xs flex items-center justify-center focus-visible:outline-2 focus-visible:outline-focus"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </RevealMotion>
          )}
        </div>
      </div>
    </section>
  );
}
