import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight, Layers, FileWarning, Biohazard } from 'lucide-react';
import { useT } from '../../context/I18nContext';
import { useTheme } from '../../context/ThemeContext';

export default function ProblemSection() {
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

  const outcomes = [
    {
      icon: Layers,
      stat: '91% Plastic Waste',
      title: 'Packaging That Outlives Generations',
      body: 'The vast majority of single-use consumer packaging is never recycled, fragmenting into pervasive microplastics in air, soil, and drinking water.'
    },
    {
      icon: FileWarning,
      stat: '40%+ Vague Claims',
      title: 'Unchecked Greenwashing in E-Commerce',
      body: 'Puffery like "eco-friendly" and "all-natural" lacks regulatory bite, making it nearly impossible for mindful households to identify genuinely sustainable goods.'
    },
    {
      icon: Biohazard,
      stat: 'Hidden Endocrine Residues',
      title: 'Synthetic Toxicity in Daily Rituals',
      body: 'Conventional cleaning solvents and toiletries frequently harbor petroleum-derived fragrances, parabens, and phthalates absorbed directly through skin.'
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 border-b border-line/60 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & Outcomes */}
          <motion.div {...motionProps} className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warning/10 border border-warning/20 text-warning text-xs font-mono font-semibold">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{t('problem.eyebrow', 'The Problem')}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold text-heading tracking-tight leading-tight text-balance">
              Modern consumption is drowning in plastic and deceptive marketing claims.
            </h2>

            <p className="text-sm sm:text-base font-sans text-text-secondary leading-relaxed">
              {t(
                'problem.subline',
                'Everyday shopping decisions shouldn’t require a toxicology degree. Traditional marketplaces prioritize high margins over ecological durability.'
              )}
            </p>

            <div className="space-y-4 pt-2">
              {outcomes.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="p-5 rounded-2xl bg-surface-raised border border-line/80 shadow-soft-xs flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-surface-accent text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">
                          {item.stat}
                        </span>
                        <h3 className="text-sm font-bold text-heading">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        {item.body}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <Link
                to="/how-it-works"
                className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-hover transition group"
              >
                <span>See how Eco Sense scores every claim with our own rules</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Thoughtful Photographic Illustration */}
          <motion.div {...motionProps} className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-line bg-surface-raised shadow-soft-md aspect-[4/5] flex items-center justify-center group">
              <img
                src="/images/products/home-02-800.webp"
                alt="Artisanal clay and coconut zero-waste homeware replacing plastic"
                width="800"
                height="1000"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-6 inset-x-6 p-5 rounded-2xl bg-surface/90 backdrop-blur-md border border-line space-y-1 text-left">
                <div className="text-[10px] font-mono uppercase tracking-wider text-primary font-semibold">
                  The Sustainable Remedy
                </div>
                <div className="text-sm font-bold text-heading">
                  Pure Botanicals &amp; Regenerative Crafts
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  Replacing single-use plastic staples with heirloom materials that enrich the earth upon end-of-life.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

