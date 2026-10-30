import React, { useMemo } from 'react';
import { useT } from '../../context/I18nContext';
import { useProducts } from '../../context/ProductsContext';
import { calculateEcoScore } from '../../lib/ecoScore';
import RevealMotion from './RevealMotion';

export default function CinematicStory() {
  const { lang } = useT();
  const { products, loading } = useProducts();

  // Compute stats strictly from real catalog data
  const stats = useMemo(() => {
    if (loading || !products || products.length === 0) {
      return {
        productCount: '...',
        categoryCount: '...',
        plasticFreePct: '...',
        avgScore: '...'
      };
    }

    const count = products.length;

    // Unique categories
    const categories = new Set(products.map((p) => p.category).filter(Boolean));
    const catCount = categories.size;

    // Plastic free packaging count
    const plasticFreeCount = products.filter(
      (p) => (p.packaging && p.packaging.toLowerCase().includes('plastic-free')) || p.plasticGrams === 0
    ).length;
    const plasticPct = Math.round((plasticFreeCount / count) * 100);

    // Average EcoScore
    const totalScore = products.reduce((acc, p) => {
      const s = calculateEcoScore(p);
      const val = s && typeof s.score === 'number' && !Number.isNaN(s.score) ? s.score : 75;
      return acc + val;
    }, 0);
    const avg = count > 0 && !Number.isNaN(totalScore) ? Math.round(totalScore / count) : 75;

    return {
      productCount: `${count}`,
      categoryCount: `${catCount}`,
      plasticFreePct: `${plasticPct}%`,
      avgScore: `${avg}/100`
    };
  }, [products, loading]);

  return (
    <section
      id="chapter-01"
      className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-line/60"
      aria-label="Chapter 01: The Living Ledger"
    >
      {/* Chapter Section Header with Hairline Rule */}
      <RevealMotion delay={0}>
        <div className="flex items-center gap-4 mb-12">
          <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-primary whitespace-nowrap">
            01 — The Living Ledger
          </span>
          <div className="h-px bg-line flex-1" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted px-2 py-0.5 rounded bg-surface-raised border border-line">
            Real Data Estimates
          </span>
        </div>
      </RevealMotion>

      {/* Narrative Headline & Plain Statement */}
      <div className="max-w-4xl space-y-6">
        <RevealMotion delay={80}>
          <h2 className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-tight text-heading leading-[1.08] text-balance">
            {lang === 'hi'
              ? 'हर खरीदारी का पर्यावरण पर एक निश्चित हिसाब होता है।'
              : 'Every product leaves an ecological footprint.'}
          </h2>
        </RevealMotion>

        <RevealMotion delay={160}>
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-light text-pretty">
            {lang === 'hi'
              ? 'पारंपरिक बाजार पैकेजिंग कचरे, परिवहन दूरी और रसायनों की जानकारी छिपाते हैं। इको सेंस एक स्कूल प्रतियोगिता प्रोजेक्ट है जो वास्तविक जीवनचक्र अनुमानों के साथ हर विकल्प की स्पष्ट तुलना प्रस्तुत करता है।'
              : 'Ordinary retail masks the cost of single-use plastic, freight mileage, and petroleum materials. Eco Sense calculates estimated carbon and diverted plastic across the catalog so shoppers can make conscious swaps with verifiable facts.'}
          </p>
        </RevealMotion>
      </div>

      {/* Ruled Stats Band */}
      <RevealMotion delay={240}>
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-line rounded-2xl overflow-hidden border border-line shadow-soft-sm">
          {/* Stat 1: Catalog Products */}
          <div className="bg-surface-raised/90 p-6 sm:p-8 flex flex-col justify-between space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-text-muted">
              Sample Products
            </span>
            <div className="text-3xl sm:text-4xl font-mono font-bold text-heading tabular-nums">
              {stats.productCount}
            </div>
            <p className="text-xs text-text-secondary leading-normal">
              Active sample goods indexed in local project catalog
            </p>
          </div>

          {/* Stat 2: Categories */}
          <div className="bg-surface-raised/90 p-6 sm:p-8 flex flex-col justify-between space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-text-muted">
              Everyday Categories
            </span>
            <div className="text-3xl sm:text-4xl font-mono font-bold text-heading tabular-nums">
              {stats.categoryCount}
            </div>
            <p className="text-xs text-text-secondary leading-normal">
              Kitchen, personal care, home, staples and cleaning
            </p>
          </div>

          {/* Stat 3: Plastic Free Packaging */}
          <div className="bg-surface-raised/90 p-6 sm:p-8 flex flex-col justify-between space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-text-muted">
              Plastic-Free Packaging
            </span>
            <div className="text-3xl sm:text-4xl font-mono font-bold text-primary tabular-nums">
              {stats.plasticFreePct}
            </div>
            <p className="text-xs text-text-secondary leading-normal">
              Paper, cloth, jute, or zero packaging alternatives
            </p>
          </div>

          {/* Stat 4: Average EcoScore */}
          <div className="bg-surface-raised/90 p-6 sm:p-8 flex flex-col justify-between space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-text-muted">
              Catalog EcoScore Mean
            </span>
            <div className="text-3xl sm:text-4xl font-mono font-bold text-heading tabular-nums">
              {stats.avgScore}
            </div>
            <p className="text-xs text-text-secondary leading-normal">
              Weighted composite of material, freight, and pack
            </p>
          </div>
        </div>
      </RevealMotion>
    </section>
  );
}
