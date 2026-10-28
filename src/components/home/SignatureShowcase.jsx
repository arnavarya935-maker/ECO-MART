import React from 'react';
import { ArrowUpRight, ShoppingBag, CheckCircle2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useT } from '../../context/I18nContext';
import productsData from '../../data/products.json';

const SIGNATURE_IDS = ['kit-01', 'kit-02', 'care-01', 'care-03'];

export default function SignatureShowcase() {
  const { setSelectedProduct, addItem } = useCart();
  const { lang } = useT();

  const signatureProducts = SIGNATURE_IDS.map((id) =>
    productsData.find((p) => p.id === id)
  ).filter(Boolean);

  return (
    <section
      id="signature-showcase"
      aria-labelledby="signature-heading"
      className="relative bg-surface py-20 md:py-28 border-b border-line"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-line pb-8">
          <div>
            <div className="font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-primary flex items-center gap-2">
              <span>02</span>
              <span className="w-4 h-px bg-primary/40" />
              <span>SIGNATURE INNOVATIONS</span>
            </div>
            <h2
              id="signature-heading"
              className="mt-3 font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-heading text-balance"
            >
              Engineered alternatives. Zero compromise.
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/shop"
              className="font-mono text-xs uppercase tracking-wider text-primary hover:text-primary-hover flex items-center gap-1 transition-colors"
            >
              <span>Explore All {productsData.filter(p => p.isEcoFriendly).length} Verified Items</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Signature Products List */}
        <div className="mt-12 space-y-12">
          {signatureProducts.map((product, idx) => {
            const indexFormatted = String(idx + 1).padStart(2, '0');
            const conventionalItem = productsData.find(
              (p) => p.id === product.conventionalAlternativeId
            );

            return (
              <article
                key={product.id}
                className="group relative rounded-2xl border border-line bg-surface-raised/40 hover:bg-surface-raised/70 transition-all duration-300 p-6 sm:p-8 lg:p-10 overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Left: Product Packshot in soft panel (5 Cols) */}
                  <div className="lg:col-span-5 relative">
                    <div className="relative aspect-[4/3] w-full rounded-xl bg-surface-sunken border border-line/80 overflow-hidden p-6 flex items-center justify-center">
                      {/* Ambient corner glow */}
                      <div className="absolute -top-12 -left-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

                      <img
                        src={product.image}
                        alt={product.name}
                        width="800"
                        height="600"
                        className="w-full h-full object-contain filter drop-shadow-lg transition-transform duration-500 ease-out group-hover:scale-105"
                        loading="eager"
                        decoding="async"
                        onError={(e) => {
                          if (e.currentTarget.src && e.currentTarget.src.endsWith('.jpg')) {
                            e.currentTarget.src = product.image.replace(/\.jpg$/, '.svg');
                          }
                        }}
                      />

                      {/* Top left editorial badge */}
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-surface/85 backdrop-blur-md border border-line font-mono text-[10px] uppercase tracking-wider text-text-secondary">
                        {product.category}
                      </div>

                      {/* Bottom right price */}
                      <div className="absolute bottom-3 right-3 px-3 py-1 rounded-md bg-surface/85 backdrop-blur-md border border-line font-mono text-xs font-bold text-heading">
                        ₹{product.price}
                      </div>
                    </div>
                  </div>

                  {/* Right: Technical Spec & Details (7 Cols) */}
                  <div className="lg:col-span-7 space-y-5 text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-2xl sm:text-3xl font-light text-text-muted/60 tracking-wider">
                        {indexFormatted}
                      </span>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-semibold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>EcoScore: 94+ (Grade A)</span>
                      </div>
                    </div>

                    <h3 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-heading">
                      {product.name}
                    </h3>

                    <p className="font-sans text-xs sm:text-sm text-text-secondary leading-relaxed max-w-2xl">
                      {product.description}
                    </p>

                    {/* Metadata Chips: Category / Packaging / Material / Lifecycle */}
                    <div className="pt-2 flex flex-wrap gap-2">
                      <div className="px-2.5 py-1 rounded-md bg-surface border border-line font-mono text-[11px] text-text-secondary">
                        <span className="text-text-muted">Material:</span> {product.material}
                      </div>
                      <div className="px-2.5 py-1 rounded-md bg-surface border border-line font-mono text-[11px] text-text-secondary">
                        <span className="text-text-muted">Packaging:</span> {product.packaging}
                      </div>
                      <div className="px-2.5 py-1 rounded-md bg-surface border border-line font-mono text-[11px] text-text-secondary">
                        <span className="text-text-muted">Carbon:</span> {product.carbonKg}kg CO₂
                      </div>
                      <div className="px-2.5 py-1 rounded-md bg-surface border border-line font-mono text-[11px] text-text-secondary">
                        <span className="text-text-muted">Plastic:</span> 0g
                      </div>
                    </div>

                    {/* Conventional Replacement Callout */}
                    {conventionalItem && (
                      <div className="p-3 rounded-lg bg-surface-sunken/60 border border-line/60 font-mono text-[11px] text-text-muted flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>
                          Replaces <strong className="text-heading font-medium">{conventionalItem.name}</strong>, avoiding {conventionalItem.plasticGrams || 'single-use'}g petroleum plastic.
                        </span>
                      </div>
                    )}

                    {/* Action Links */}
                    <div className="pt-3 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedProduct(product)}
                        className="liquid-pill liquid-pill-dark group"
                      >
                        <span>{lang === 'hi' ? 'विवरण देखें' : 'View Specifications'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 ml-2 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => addItem(product)}
                        className="liquid-pill liquid-pill-emerald"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 mr-2" />
                        <span>Add to Cart · ₹{product.price}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
