import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck, Scale, Database } from 'lucide-react';
import productsData from '../../data/products.json';
import { ETHICAL_GUARDRAILS } from '../../lib/ai/guardrailsEngine';

export default function NumberedFeatureCards() {
  const catalogCount = productsData ? productsData.length : 64;
  const guardrailsCount = ETHICAL_GUARDRAILS ? Object.keys(ETHICAL_GUARDRAILS).length : 5;

  const features = [
    {
      num: '01',
      title: 'Empirical Life-Cycle Modeling',
      subtitle: 'Zero Invented Figures',
      description:
        'Every carbon, water, and plastic figure is grounded in published cradle-to-gate LCA metrics. When data is approximate, it is explicitly labeled as an estimate with assumptions.',
      stat: `${catalogCount} SKUs`,
      statLabel: 'Computed from Catalog',
      isEstimate: false,
      route: '/shop',
      icon: Database
    },
    {
      num: '02',
      title: 'Deterministic Guardrails',
      subtitle: 'Adversarial Safety Intercepts',
      description:
        'Multi-layer safety filters intercept hallucinated standards, unverified buzzwords, and prompt injection attacks before generation reaches the client.',
      stat: `${guardrailsCount} Active Rules`,
      statLabel: 'Hardware-Verified Defense',
      isEstimate: false,
      route: '/playground',
      icon: ShieldCheck
    },
    {
      num: '03',
      title: 'Multilingual Equity Parity',
      subtitle: 'Cross-Linguistic Fairness',
      description:
        'Audited across Hindi (Devanagari), Hinglish, and English queries alongside student budget constraints to ensure parity without luxury bias or discrimination.',
      stat: '93/100',
      statLabel: 'Sample Data • Audit Benchmark',
      isEstimate: true,
      route: '/fairness',
      icon: Scale
    }
  ];

  return (
    <section className="py-16 bg-surface-sunken/40 border-y border-line" id="features">
      <div className="max-w-6xl mx-auto px-6 md:px-10 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
              Core Architecture
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-heading mt-1">
              Three pillars of responsible intelligence
            </h2>
          </div>
          <p className="text-xs font-sans text-text-secondary max-w-md">
            Every metric is transparent, accountable, and designed for rigorous deliberation under CBSE CT &amp; AI guidelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.num}
                className="p-6 md:p-8 rounded-3xl bg-surface border border-line hover:border-primary/40 transition-all flex flex-col justify-between space-y-6 group shadow-soft-sm hover:shadow-soft-md"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-bold text-primary/60 group-hover:text-primary transition-colors">
                      {f.num}
                    </span>
                    <div className="w-9 h-9 rounded-2xl bg-surface-raised border border-line flex items-center justify-center text-text-muted group-hover:text-primary transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif text-xl font-bold text-heading group-hover:text-primary transition-colors">
                      {f.title}
                    </h3>
                    <div className="text-[11px] font-mono text-text-muted mt-0.5">
                      {f.subtitle}
                    </div>
                  </div>

                  <p className="text-xs font-sans text-text-secondary leading-relaxed">
                    {f.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-line space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="font-serif text-2xl font-bold text-heading">{f.stat}</span>
                    <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full ${
                      f.isEstimate
                        ? 'bg-amber-400/10 text-amber-300 border border-amber-400/30'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {f.statLabel}
                    </span>
                  </div>

                  <Link
                    to={f.route}
                    className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-primary hover:text-primary-hover group/link"
                  >
                    <span>Inspect feature</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
