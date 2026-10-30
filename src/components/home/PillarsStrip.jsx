import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, RefreshCw, ShieldCheck } from 'lucide-react';
import { useT } from '../../context/I18nContext';
import { useTheme } from '../../context/ThemeContext';

export default function PillarsStrip() {
  const { t } = useT();
  const { reduceEffects } = useTheme();

  const motionProps = reduceEffects
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
      };

  const pillars = [
    {
      id: 'organic',
      icon: Sprout,
      badge: '100% Botanical',
      title: t('pillars.organic_title', 'Organic Ingredients'),
      desc: t('pillars.organic_desc', 'Bio-based harvests free from synthetic pesticides, parabens, and dyes.')
    },
    {
      id: 'compostable',
      icon: RefreshCw,
      badge: 'Zero Microplastics',
      title: t('pillars.compostable_title', 'Compostable Materials'),
      desc: t('pillars.compostable_desc', 'Biodegradable bamboo, coconut coir, and paper breaking down in 90–180 days.')
    },
    {
      id: 'certified',
      icon: ShieldCheck,
      badge: 'Seller-Listed',
      title: t('pillars.certified_title', 'Listed Standards'),
      desc: t('pillars.certified_desc', 'USDA Organic, GOTS, and FSC standards listed by sellers on packaging.')
    }
  ];

  return (
    <section className="py-10 sm:py-14 border-b border-line/60 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          {...motionProps}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
        >
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="p-5 sm:p-6 rounded-2xl bg-surface-raised border border-line/80 hover:border-primary/40 shadow-soft-xs hover:shadow-soft-sm transition-all flex items-start gap-4 group"
              >
                <div className="w-11 h-11 rounded-xl bg-surface-accent border border-primary/20 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-heading">
                      {pillar.title}
                    </h3>
                  </div>
                  <span className="inline-block text-[10px] font-mono uppercase tracking-wider text-primary font-semibold">
                    {pillar.badge}
                  </span>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

