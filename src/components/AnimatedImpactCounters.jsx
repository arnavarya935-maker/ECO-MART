import React, { useEffect, useState } from 'react';
import { Leaf, Droplets, ShieldCheck, TreePine, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function AnimatedImpactCounters() {
  const { reduceEffects } = useTheme();
  const [counts, setCounts] = useState({
    co2: reduceEffects ? 14820 : 0,
    plastic: reduceEffects ? 89400 : 0,
    trees: reduceEffects ? 3120 : 0,
    water: reduceEffects ? 450000 : 0
  });

  useEffect(() => {
    if (reduceEffects) {
      setCounts({ co2: 14820, plastic: 89400, trees: 3120, water: 450000 });
      return;
    }

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

  const metrics = [
    {
      id: 'co2',
      label: 'CO₂ Footprint Diverted',
      value: `${counts.co2.toLocaleString()} kg`,
      sub: 'Equivalent to 62,000 car km',
      icon: Leaf,
      color: 'text-emerald-700 dark:text-emerald-300',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
    },
    {
      id: 'plastic',
      label: 'Single-Use Plastics Avoided',
      value: `${counts.plastic.toLocaleString()} pcs`,
      sub: 'Prevented from landfill & oceans',
      icon: ShieldCheck,
      color: 'text-teal-700 dark:text-teal-300',
      bg: 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800'
    },
    {
      id: 'trees',
      label: 'Mature Trees Preserved',
      value: `${counts.trees.toLocaleString()} trees`,
      sub: 'Via 100% tree-free paper & bamboo',
      icon: TreePine,
      color: 'text-green-800 dark:text-green-300',
      bg: 'bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800'
    },
    {
      id: 'water',
      label: 'Freshwater Conserved',
      value: `${(counts.water / 1000).toFixed(0)}k Litres`,
      sub: 'From organic non-toxic processing',
      icon: Droplets,
      color: 'text-cyan-700 dark:text-cyan-300',
      bg: 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800'
    }
  ];

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-black uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verified Collective Milestones</span>
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
          Tangible Impact You Can Verify
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
          Every audited purchase and swap adds up to measurable ecological restoration.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.id}
              className={`p-6 rounded-3xl border ${m.bg} shadow-xs transition-all hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-2xl bg-white dark:bg-stone-900 shadow-2xs ${m.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Audited</span>
              </div>
              <div className={`text-2xl sm:text-3xl font-black tracking-tight ${m.color}`}>
                {m.value}
              </div>
              <div className="text-xs font-bold text-stone-800 dark:text-stone-200 mt-1">
                {m.label}
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                {m.sub}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
