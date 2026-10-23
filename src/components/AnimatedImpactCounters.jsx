import React, { useEffect, useState } from 'react';
import { Leaf, Droplets, ShieldCheck, TreePine } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function AnimatedImpactCounters() {
  const { reduceEffects } = useTheme();
  const STATIC_COUNTS = { co2: 14820, plastic: 89400, trees: 3120, water: 450000 };
  const [counts, setCounts] = useState({ co2: 0, plastic: 0, trees: 0, water: 0 });

  useEffect(() => {
    if (reduceEffects) return;

    const duration = 1800;
    const steps = 60;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step += 1;
      const progress = Math.min(step / steps, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setCounts({
        co2: Math.floor(14820 * ease),
        plastic: Math.floor(89400 * ease),
        trees: Math.floor(3120 * ease),
        water: Math.floor(450000 * ease),
      });

      if (step >= steps) clearInterval(timer);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [reduceEffects]);

  const effectiveCounts = reduceEffects ? STATIC_COUNTS : counts;

  const metrics = [
    {
      id: 'co2',
      label: 'CO₂ Diverted',
      value: `${effectiveCounts.co2.toLocaleString()} kg`,
      sub: 'Lifecycle fossil fuel emissions eliminated',
      icon: Leaf,
    },
    {
      id: 'plastic',
      label: 'Plastic Units Prevented',
      value: `${effectiveCounts.plastic.toLocaleString()} pcs`,
      sub: 'Diverted from municipal landfills and oceans',
      icon: ShieldCheck,
    },
    {
      id: 'trees',
      label: 'Native Trees Preserved',
      value: `${effectiveCounts.trees.toLocaleString()} trees`,
      sub: 'Through 100% bamboo & seed paper swaps',
      icon: TreePine,
    },
    {
      id: 'water',
      label: 'Freshwater Conserved',
      value: `${(effectiveCounts.water / 1000).toFixed(0)}k Litres`,
      sub: 'Saved via zero-toxic textile processing',
      icon: Droplets,
    },
  ];

  return (
    <section
      id="impact-milestones"
      aria-labelledby="impact-heading"
      className="relative bg-surface py-20 md:py-28 border-b border-line"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        {/* Eyebrow */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-line pb-8">
          <div>
            <div className="font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-primary flex items-center gap-2">
              <span>05</span>
              <span className="w-4 h-px bg-primary/40" />
              <span>COLLECTIVE AUDIT</span>
            </div>
            <h2
              id="impact-heading"
              className="mt-3 font-sans text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-heading text-balance"
            >
              Tangible impact. Verified down to grams.
            </h2>
          </div>
          <p className="max-w-[34ch] text-xs sm:text-sm text-text-secondary leading-relaxed font-sans">
            Every swap is recorded against independent cradle-to-grave benchmarks.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                className="group relative rounded-2xl border border-line bg-surface-raised/40 hover:bg-surface-raised/70 p-6 sm:p-7 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-lg bg-surface-sunken border border-line flex items-center justify-center text-primary">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-text-muted bg-surface px-2 py-0.5 rounded border border-line">
                    AUDITED
                  </span>
                </div>

                <div className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-heading tabular-nums">
                  {m.value}
                </div>

                <div className="font-mono text-xs font-semibold text-primary mt-2">
                  {m.label}
                </div>

                <div className="font-sans text-xs text-text-muted mt-1 leading-snug">
                  {m.sub}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
