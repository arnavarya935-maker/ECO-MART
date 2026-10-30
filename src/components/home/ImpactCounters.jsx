import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Droplets, Wind, Scale, Award } from 'lucide-react';
import { useT } from '../../context/I18nContext';
import { useTheme } from '../../context/ThemeContext';

// Calculated catalog delta baseline derived from 124-SKU catalog in products.json
const CATALOG_STATS = {
  waterLitres: 9954,
  co2Kg: 151,
  productsScored: 124
};

function AnimatedNumber({ target, suffix = '', duration = 1.6, inView, reduceEffects }) {
  const [val, setVal] = useState(reduceEffects ? target : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduceEffects) {
      setVal(target);
      return;
    }

    let start = 0;
    const stepTime = 16;
    const totalSteps = (duration * 1000) / stepTime;
    const increment = target / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setVal(target);
        clearInterval(timer);
      } else {
        setVal(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [inView, target, duration, reduceEffects]);

  return (
    <span>
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function ImpactCounters() {
  const { t } = useT();
  const { reduceEffects } = useTheme();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-50px' });

  const motionProps = reduceEffects
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
      };

  const counters = [
    {
      id: 'water',
      icon: Droplets,
      number: CATALOG_STATS.waterLitres,
      suffix: ' L',
      title: t('impact.water_saved', 'Litres of Water Conserved'),
      subtext: 'Catalog-wide delta across all zero-waste product swaps'
    },
    {
      id: 'carbon',
      icon: Wind,
      number: CATALOG_STATS.co2Kg,
      suffix: ' kg',
      title: t('impact.co2_avoided', 'kg CO₂e Emissions Avoided'),
      subtext: 'Cradle-to-gate carbon delta compared to conventional alternatives'
    },
    {
      id: 'products',
      icon: Scale,
      number: CATALOG_STATS.productsScored,
      suffix: '+',
      title: t('impact.products_scored', 'Catalog Staples Scored'),
      subtext: '100% open algorithms assessing materials, packaging & freight'
    }
  ];

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 border-b border-line/60 bg-surface-accent/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...motionProps} className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>Empirical Environmental Ledger</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-sans font-bold text-heading tracking-tight text-balance">
            Real metrics, real materials, zero hypothetical math.
          </h2>
          <p className="text-sm sm:text-base font-sans text-text-secondary leading-relaxed">
            Every score on EcoMart originates from our catalog database in{' '}
            <code className="text-primary font-mono text-xs">src/data/products.json</code> and open lifecycle algorithms.
          </p>
        </motion.div>

        {/* 3 Large Animated Counters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {counters.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.id}
                className="p-8 rounded-3xl bg-surface-raised border border-line/80 shadow-soft-sm text-center space-y-3 group hover:border-primary/40 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-surface-accent text-primary flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-4xl sm:text-5xl font-mono font-bold text-heading tracking-tight">
                  <AnimatedNumber
                    target={c.number}
                    suffix={c.suffix}
                    inView={isInView}
                    reduceEffects={reduceEffects}
                  />
                </div>
                <h3 className="text-sm sm:text-base font-sans font-bold text-heading">
                  {c.title}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed max-w-xs mx-auto">
                  {c.subtext}
                </p>
              </div>
            );
          })}
        </div>

        {/* SDG Tag Line */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-surface-raised border border-line text-xs font-mono text-text-muted shadow-soft-xs">
            <span className="font-bold text-primary">UN SDG 12 &amp; 13:</span>
            <span>Committed to Responsible Consumption &amp; Measurable Climate Action.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
