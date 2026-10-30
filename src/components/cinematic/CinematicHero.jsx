import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles, ShieldCheck, ShoppingBag, RefreshCw, BarChart3, Bot, CheckCircle2 } from 'lucide-react';
import { useT } from '../../context/I18nContext';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductsContext';
import { calculateEcoScore } from '../../lib/ecoScore';
import RevealMotion from './RevealMotion';

export default function CinematicHero() {
  const { lang } = useT();
  const { setIsAgentOpen, addToCart } = useCart();
  const { products, loading } = useProducts();

  // Pick top featured eco product from catalog
  const featuredProduct = products.find((p) => p.id === 'kit-01') || products[0] || null;
  const ecoScoreData = featuredProduct ? calculateEcoScore(featuredProduct) : null;

  return (
    <section
      id="chapter-00"
      className="relative min-h-[92vh] flex items-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      aria-label="Chapter 00: The First Choice"
    >
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Headline, Subtitle, Numbered Chips, Primary CTAs */}
        <div className="lg:col-span-7 space-y-8">
          <RevealMotion delay={0}>
            {/* Eyebrow Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-raised/80 border border-line text-[11px] font-mono uppercase tracking-[0.2em] text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span>Chapter 00 — The First Choice</span>
            </div>
          </RevealMotion>

          <RevealMotion delay={80}>
            {/* Display Headline */}
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-heading uppercase leading-[1.04] text-balance">
              {lang === 'hi' ? 'सोच समझकर खरीदारी करें।' : 'Shop with purpose.'}
            </h1>
          </RevealMotion>

          <RevealMotion delay={160}>
            {/* Plain Class-9 Subtitle */}
            <p className="text-base sm:text-lg text-text-secondary max-w-xl leading-relaxed text-pretty font-light">
              {lang === 'hi'
                ? 'सामान्य प्लास्टिक की वस्तुओं को आसान टिकाऊ विकल्पों से बदलें। वास्तविक जीवनचक्र प्रभाव की गणना करने वाले AI सहायक के साथ।'
                : 'Swap ordinary single-use items for cleaner alternatives with an AI helper that calculates real lifecycle impact.'}
            </p>
          </RevealMotion>

          {/* Four Numbered Hero Chips */}
          <RevealMotion delay={240}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <Link
                to="/shop"
                className="group p-3 rounded-xl bg-surface-raised/60 hover:bg-surface-raised border border-line hover:border-primary/40 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-focus"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-text-muted group-hover:text-primary mb-1">
                  <span>01</span>
                  <ShoppingBag className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </div>
                <div className="text-xs font-semibold text-heading group-hover:text-primary transition-colors">
                  Discover
                </div>
                <div className="text-[10px] text-text-secondary">Shop catalog</div>
              </Link>

              <Link
                to="/transform"
                className="group p-3 rounded-xl bg-surface-raised/60 hover:bg-surface-raised border border-line hover:border-primary/40 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-focus"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-text-muted group-hover:text-primary mb-1">
                  <span>02</span>
                  <RefreshCw className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </div>
                <div className="text-xs font-semibold text-heading group-hover:text-primary transition-colors">
                  Swap
                </div>
                <div className="text-[10px] text-text-secondary">Swap My List</div>
              </Link>

              <button
                type="button"
                onClick={() => setIsAgentOpen(true)}
                className="group p-3 rounded-xl bg-surface-raised/60 hover:bg-surface-raised border border-line hover:border-primary/40 transition-all duration-200 text-left focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-text-muted group-hover:text-primary mb-1">
                  <span>03</span>
                  <Bot className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </div>
                <div className="text-xs font-semibold text-heading group-hover:text-primary transition-colors">
                  Decide
                </div>
                <div className="text-[10px] text-text-secondary">Ask Eco Agent</div>
              </button>

              <Link
                to="/impact"
                className="group p-3 rounded-xl bg-surface-raised/60 hover:bg-surface-raised border border-line hover:border-primary/40 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-focus"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-text-muted group-hover:text-primary mb-1">
                  <span>04</span>
                  <BarChart3 className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </div>
                <div className="text-xs font-semibold text-heading group-hover:text-primary transition-colors">
                  Impact
                </div>
                <div className="text-[10px] text-text-secondary">My Impact</div>
              </Link>
            </div>
          </RevealMotion>

          {/* Primary Action Buttons */}
          <RevealMotion delay={320}>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => setIsAgentOpen(true)}
                className="min-h-[44px] px-6 py-2.5 rounded-full bg-primary text-primary-contrast font-medium text-sm flex items-center gap-2 hover:bg-primary-hover shadow-soft-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'hi' ? 'इको एजेंट शुरू करें' : 'Try Eco Agent'}</span>
              </button>

              <Link
                to="/truth-lab"
                className="min-h-[44px] px-6 py-2.5 rounded-full bg-surface-raised hover:bg-surface-raised/80 border border-line text-heading font-medium text-sm flex items-center gap-2 transition-all duration-200 hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-focus"
              >
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>{lang === 'hi' ? 'दावे की जांच करें' : 'Check a Product Claim'}</span>
              </Link>
            </div>
          </RevealMotion>
        </div>

        {/* Right Column: Live Featured Preview Card */}
        <div className="lg:col-span-5">
          <RevealMotion delay={200}>
            <div className="relative rounded-2xl bg-surface-raised/80 border border-line p-5 shadow-soft-lg backdrop-blur-md overflow-hidden">
              <div className="flex items-center justify-between mb-3 text-xs font-mono text-text-muted">
                <span className="flex items-center gap-1.5 text-primary">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Featured Alternative</span>
                </span>
                <span className="uppercase tracking-wider">
                  {loading || !featuredProduct ? '...' : featuredProduct.category}
                </span>
              </div>

              {/* Packshot on soft lighter panel */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#0E2218] border border-line/60 flex items-center justify-center p-4">
                {featuredProduct ? (
                  <img
                    src={featuredProduct.image}
                    alt={featuredProduct.name}
                    className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                    loading="eager"
                  />
                ) : (
                  <div className="text-text-muted text-xs">Loading packshot...</div>
                )}

                {/* EcoScore Badge */}
                {ecoScoreData && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-surface-raised/95 border border-primary/40 backdrop-blur-sm text-xs font-mono font-bold text-primary flex items-center gap-1">
                    <span>Grade {ecoScoreData.grade}</span>
                    <span className="text-text-muted">•</span>
                    <span>{ecoScoreData.score}/100</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="mt-4 space-y-2">
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="text-sm sm:text-base font-semibold text-heading line-clamp-1">
                    {featuredProduct ? featuredProduct.name : 'Loading item...'}
                  </h2>
                  <span className="text-base font-bold font-mono text-heading">
                    ₹{featuredProduct ? featuredProduct.price : '...'}
                  </span>
                </div>

                <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                  {featuredProduct ? featuredProduct.description : '...'}
                </p>

                {/* Impact specs */}
                {featuredProduct && (
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-line/60 text-[11px] font-mono">
                    <div className="text-text-secondary">
                      Plastic: <span className="text-primary font-bold">{featuredProduct.plasticGrams}g</span>
                    </div>
                    <div className="text-text-secondary">
                      Carbon: <span className="text-primary font-bold">{featuredProduct.carbonKg}kg CO₂</span>
                    </div>
                  </div>
                )}

                {/* Action Row */}
                <div className="pt-3 flex items-center gap-3">
                  {featuredProduct && (
                    <button
                      type="button"
                      onClick={() => addToCart(featuredProduct)}
                      className="min-h-[44px] flex-1 py-2 px-3 rounded-xl bg-primary text-primary-contrast font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-primary-hover transition-colors focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  )}

                  <Link
                    to={featuredProduct ? `/product/${featuredProduct.id}` : '/shop'}
                    className="min-h-[44px] px-3.5 py-2 rounded-xl bg-surface hover:bg-surface-sunken border border-line text-text-secondary hover:text-heading text-xs font-medium flex items-center gap-1 transition-colors focus-visible:outline-2 focus-visible:outline-focus"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </RevealMotion>
        </div>
      </div>
    </section>
  );
}
