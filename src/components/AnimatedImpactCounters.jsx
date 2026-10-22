import React, { useEffect, useState } from 'react';
import { Leaf, Droplets, ShieldCheck, TreePine, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function AnimatedImpactCounters() {
  const { reduceEffects } = useTheme();
  const STATIC_COUNTS = { co2: 14820, plastic: 89400, trees: 3120, water: 450000 };
  const [counts, setCounts] = useState({ co2: 0, plastic: 0, trees: 0, water: 0 });

  useEffect(() => {
    if (reduceEffects) return;

    const duration = 2000;
    const steps = 60;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step += 1;
      const progress = Math.min(step / steps, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setCounts({
        co2: Math.floor(14820 * ease),
        plastic: Math.floor(89400 * ease),
        trees: Math.floor(3120 * ease),
        water: Math.floor(450000 * ease)
      });

      if (step >= steps) clearInterval(timer);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [reduceEffects]);

  const effectiveCounts = reduceEffects ? STATIC_COUNTS : counts;

  const metrics = [
    {
      id: 'co2',
      label: 'CO₂ Footprint Diverted',
      value: `${effectiveCounts.co2.toLocaleString()} kg`,
      sub: 'Equivalent to 62,000 car km',
      icon: Leaf,
      iconColor: 'text-primary'
    },
    {
      id: 'plastic',
      label: 'Single-Use Plastics Avoided',
      value: `${effectiveCounts.plastic.toLocaleString()} pcs`,
      sub: 'Prevented from landfill & oceans',
      icon: ShieldCheck,
      iconColor: 'text-secondary'
    },
    {
      id: 'trees',
      label: 'Mature Trees Preserved',
      value: `${effectiveCounts.trees.toLocaleString()} trees`,
      sub: 'Via 100% tree-free paper & bamboo',
      icon: TreePine,
      iconColor: 'text-primary'
    },
    {
      id: 'water',
      label: 'Freshwater Conserved',
      value: `${(effectiveCounts.water / 1000).toFixed(0)}k Litres`,
      sub: 'From organic non-toxic processing',
      icon: Droplets,
      iconColor: 'text-secondary'
    }
  ];

  return (
    <section className="py-14 bg-surface border-y border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-subtle text-primary border border-primary/20 text-xs font-sans font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Verified Collective Milestones</span>
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-heading tracking-tight">
            Tangible Impact You Can Verify
          </h2>
          <p className="font-sans text-xs sm:text-sm text-secondary mt-1">
            Every audited purchase and swap adds up to measurable ecological restoration.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                className="p-6 rounded-3xl bg-surface-raised border border-line shadow-card hover:shadow-lift transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-2xl bg-surface-sunken border border-line-subtle ${m.iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-muted bg-surface-sunken px-2 py-0.5 rounded-full border border-line-subtle">
                    Audited
                  </span>
                </div>
                <div className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-heading tabular-nums">
                  {m.value}
                </div>
                <div className="text-xs font-sans font-semibold text-heading mt-1">
                  {m.label}
                </div>
                <div className="text-[11px] font-sans text-muted mt-0.5">
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

