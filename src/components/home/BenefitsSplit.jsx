import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Heart, CheckCircle2, Droplets, Trash2, Wind, Sparkles, Users, Smile, Shield } from 'lucide-react';
import { useT } from '../../context/I18nContext';
import { useTheme } from '../../context/ThemeContext';

export default function BenefitsSplit() {
  const { t } = useT();
  const { reduceEffects } = useTheme();

  const motionProps = reduceEffects
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
      };

  const environmentalBenefits = [
    {
      title: 'Zero Landfill Accumulation',
      desc: '100% biodegradable and home-compostable organic materials returning cleanly to soil.',
      icon: Trash2
    },
    {
      title: 'Clean Waterways & Runoff',
      desc: 'Zero synthetic chemical surfactants, preventing toxic residue in local watersheds.',
      icon: Droplets
    },
    {
      title: 'Low-Carbon Sourcing',
      desc: 'Short supply chains and renewable botanical harvesting reducing cradle-to-gate CO₂e.',
      icon: Wind
    },
    {
      title: 'Microplastic Eradication',
      desc: 'Natural bamboo, organic cotton, and coconut fiber eliminating shedding in wash cycles.',
      icon: Globe
    }
  ];

  const socialBenefits = [
    {
      title: 'Toxin-Free Household Care',
      desc: 'Pure botanical formulas completely free of endocrine disruptors, BPA, and phthalates.',
      icon: Shield
    },
    {
      title: 'Dignified Artisan Partnerships',
      desc: 'Fair living wages paid directly to certified ethical rural craft cooperatives.',
      icon: Users
    },
    {
      title: 'Hypoallergenic & Gentle',
      desc: 'Non-irritating natural formulations safe for children, pets, and sensitive skin.',
      icon: Sparkles
    },
    {
      title: 'Lasting Durability & Savings',
      desc: 'High-character, refillable and reusable goods lowering recurring replacement costs.',
      icon: Smile
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 border-b border-line/60 bg-surface-sunken/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eyebrow and Section Header */}
        <motion.div {...motionProps} className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
            {t('benefits.eyebrow', 'Dual-Impact Architecture')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-sans font-bold text-heading tracking-tight text-balance">
            Holistic benefits for both our planet and your personal sanctuary.
          </h2>
          <p className="text-sm sm:text-base font-sans text-text-secondary leading-relaxed">
            {t(
              'benefits.subline',
              'Every product in our catalog must meet strict dual-criteria: non-toxic for your immediate family, restorative for the broader biosphere.'
            )}
          </p>
        </motion.div>

        {/* 2-Column Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* Column 1: Environmental Benefits */}
          <motion.div
            {...motionProps}
            className="p-8 sm:p-10 rounded-3xl bg-surface-raised border border-line/80 shadow-soft-sm space-y-6"
          >
            <div className="flex items-center gap-3 border-b border-line pb-4">
              <div className="w-10 h-10 rounded-2xl bg-surface-accent text-primary border border-primary/20 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold">
                  Biocentric Impact
                </span>
                <h3 className="text-xl font-sans font-bold text-heading">
                  Environmental Benefits
                </h3>
              </div>
            </div>

            <ul className="space-y-4">
              {environmentalBenefits.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.title} className="flex items-start gap-3.5">
                    <div className="w-7 h-7 rounded-lg bg-surface-accent text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <div className="text-sm font-bold text-heading flex items-center gap-2">
                        <span>{item.title}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          {/* Column 2: Social & Health Benefits */}
          <motion.div
            {...motionProps}
            className="p-8 sm:p-10 rounded-3xl bg-surface-raised border border-line/80 shadow-soft-sm space-y-6"
          >
            <div className="flex items-center gap-3 border-b border-line pb-4">
              <div className="w-10 h-10 rounded-2xl bg-surface-accent text-secondary border border-secondary/20 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-secondary font-bold">
                  Human Wellbeing
                </span>
                <h3 className="text-xl font-sans font-bold text-heading">
                  Social &amp; Health Benefits
                </h3>
              </div>
            </div>

            <ul className="space-y-4">
              {socialBenefits.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.title} className="flex items-start gap-3.5">
                    <div className="w-7 h-7 rounded-lg bg-surface-accent text-secondary flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <div className="text-sm font-bold text-heading flex items-center gap-2">
                        <span>{item.title}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-secondary shrink-0" />
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
