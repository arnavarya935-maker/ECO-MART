import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Eye, Target, Compass } from 'lucide-react';
import { useT } from '../../context/I18nContext';
import { useTheme } from '../../context/ThemeContext';

export default function WhoWeAre() {
  const { t } = useT();
  const { reduceEffects } = useTheme();

  const motionProps = reduceEffects
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
      };

  const cards = [
    {
      id: 'who',
      icon: Compass,
      title: t('whoWeAre.who_title', 'Who Are We'),
      tagline: t('whoWeAre.who_tagline', 'Conscious Commerce Initiative'),
      body: t(
        'whoWeAre.who_body',
        'EcoMart is a student-led sustainability initiative and open-source platform. We combine objective lifecycle math with everyday consumer goods to bring scientific clarity to mindful households.'
      )
    },
    {
      id: 'vision',
      icon: Eye,
      title: t('whoWeAre.vision_title', 'Our Vision'),
      tagline: t('whoWeAre.vision_tagline', 'True Circular Living'),
      body: t(
        'whoWeAre.vision_body',
        'A future where daily essentials are designed for regeneration—harvested from natural botanical fibers, zero landfill runoff, and free from persistent synthetic microplastics.'
      )
    },
    {
      id: 'mission',
      icon: Target,
      title: t('whoWeAre.mission_title', 'Our Mission'),
      tagline: t('whoWeAre.mission_tagline', 'Algorithmic Transparency'),
      body: t(
        'whoWeAre.mission_body',
        'To demystify greenwashing through open-access cradle-to-gate impact scoring, certified plastic-free catalogs, and automated one-click cart transformations.'
      )
    }
  ];

  return (
    <section className="py-16 sm:py-24 border-b border-line/60 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Leaf-icon divider */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px bg-line flex-1 max-w-[120px]" />
          <div className="w-9 h-9 rounded-full bg-surface-accent border border-primary/20 flex items-center justify-center text-primary shadow-soft-xs">
            <Leaf className="w-4 h-4" />
          </div>
          <div className="h-px bg-line flex-1 max-w-[120px]" />
        </div>

        {/* Section Header */}
        <motion.div {...motionProps} className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
            {t('whoWeAre.eyebrow', 'Foundational Purpose')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-sans font-bold text-heading tracking-tight text-balance">
            Rooted in nature, driven by empirical transparency.
          </h2>
          <p className="text-sm sm:text-base font-sans text-text-secondary leading-relaxed">
            {t(
              'whoWeAre.subline',
              'We believe true sustainability requires neither compromise nor blind faith. Here is why we built EcoMart.'
            )}
          </p>
        </motion.div>

        {/* Three Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            const cardMotion = reduceEffects
              ? {}
              : {
                  initial: { opacity: 0, y: 20 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true },
                  transition: { duration: 0.6, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }
                };

            return (
              <motion.div
                key={card.id}
                {...cardMotion}
                className="p-7 sm:p-8 rounded-3xl bg-surface-raised border border-line/80 hover:border-primary/40 shadow-soft-sm hover:shadow-soft-md transition-all space-y-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-surface-accent border border-primary/20 text-primary flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
                    {card.tagline}
                  </span>
                  <h3 className="text-xl font-sans font-bold text-heading mt-0.5">
                    {card.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm font-sans text-text-secondary leading-relaxed">
                  {card.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
