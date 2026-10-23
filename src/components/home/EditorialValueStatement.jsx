import React from 'react';
import { ShieldCheck, Cpu, Leaf } from 'lucide-react';
import { useT } from '../../context/I18nContext';

export default function EditorialValueStatement() {
  const { lang } = useT();

  return (
    <section
      id="manifesto"
      aria-labelledby="manifesto-heading"
      className="relative bg-surface py-16 md:py-24 border-b border-line"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        {/* Eyebrow */}
        <div className="font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-primary flex items-center gap-2">
          <span>00</span>
          <span className="w-4 h-px bg-primary/40" />
          <span>EDITORIAL MANIFESTO</span>
        </div>

        {/* Large Editorial Headline */}
        <div className="mt-8">
          <h2
            id="manifesto-heading"
            className="font-sans text-[clamp(1.75rem,3.8vw,3.2rem)] font-bold tracking-tight text-heading leading-[1.15] text-balance max-w-4xl"
          >
            {lang === 'hi'
              ? 'हम दिखावे के हरित वादों को नकारते हैं। हर विकल्प का सत्यापन ठोस जीवनचक्र डेटा पर आधारित है।'
              : 'We reject superficial greenwashing. Every swap in EcoMart is verified across raw material extraction, zero-plastic packaging, and closed-loop recyclability.'}
          </h2>
        </div>

        {/* Editorial 3-Column Spec Strip */}
        <div className="mt-12 pt-8 border-t border-line/70 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary font-mono text-[11px] uppercase tracking-wider font-semibold">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Cradle-to-Grave Audit</span>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-sans">
              No generic carbon offsets. We evaluate raw extraction, transport kilometers, durability, and backyard compostability with transparent scoring.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary font-mono text-[11px] uppercase tracking-wider font-semibold">
              <Cpu className="w-4 h-4 text-primary" />
              <span>Client-Side Intelligence</span>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-sans">
              Zero network latency. Our autonomous decision agent, multi-criteria knapsack optimizer, and barcode parser run 100% locally in your browser.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary font-mono text-[11px] uppercase tracking-wider font-semibold">
              <Leaf className="w-4 h-4 text-primary" />
              <span>Strict Zero-Plastic Rule</span>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-sans">
              From organic bamboo to beeswax food wraps, all catalog items utilize 100% plastic-free packaging that returns safely to biological soil.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
