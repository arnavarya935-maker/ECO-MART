import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Utensils, Sparkles, Home, ShieldCheck } from 'lucide-react';
import { useT } from '../../context/I18nContext';
import { useTheme } from '../../context/ThemeContext';
import LeafParticles from '../LeafParticles';

export default function Hero() {
  const { t } = useT();
  const { reduceEffects } = useTheme();

  const [canPlayVideo, setCanPlayVideo] = useState(false);

  useEffect(() => {
    // Check constraints: screens >= 640px, no reduced motion, and no Save-Data
    const isSaveData = navigator?.connection?.saveData === true;
    const isWideEnough = typeof window !== 'undefined' && window.innerWidth >= 640;
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reduceEffects && !prefersReducedMotion && !isSaveData && isWideEnough) {
      setCanPlayVideo(true);
    } else {
      setCanPlayVideo(false);
    }
  }, [reduceEffects]);

  const categoryPills = [
    { id: 'kitchen', label: t('category.kitchen', 'Kitchen'), icon: Utensils, desc: 'Zero-waste' },
    { id: 'personal-care', label: t('category.personalCare', 'Personal Care'), icon: Sparkles, desc: 'Organic' },
    { id: 'home', label: t('category.home', 'Home'), icon: Home, desc: 'Artisanal' }
  ];

  const motionProps = reduceEffects
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
      };

  return (
    <section className="relative overflow-hidden pt-10 sm:pt-16 pb-16 sm:pb-24 border-b border-line/60 bg-gradient-to-b from-surface-accent/40 via-surface to-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Typographic Value Proposition */}
          <motion.div {...motionProps} className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Tagline Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-raised border border-line text-xs font-mono font-medium text-text-secondary shadow-soft-xs">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>{t('hero.eyebrow', 'Nature-Led Conscious Commerce · Est. 2026')}</span>
            </div>

            {/* Brand Tagline & Headline Block */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                <p className="font-serif italic text-lg sm:text-xl md:text-2xl font-semibold tracking-wide bg-gradient-to-r from-forest-900 via-emerald-600 to-teal-600 dark:from-emerald-300 dark:via-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                  {t('hero.tagline', 'Shop with sense, shop with purpose')}
                </p>
              </div>

              {/* Headline with italic Fraunces serif accent word */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-bold text-heading tracking-tight leading-[1.08] text-balance">
                Everyday living,{' '}
                <span className="font-serif italic font-normal text-primary underline decoration-primary/30 decoration-wavy decoration-1 underline-offset-8">
                  naturally
                </span>{' '}
                restorative.
              </h1>
            </div>

            {/* Subline */}
            <p className="text-base sm:text-lg font-sans text-text-secondary max-w-xl leading-relaxed">
              {t(
                'hero.subline',
                'Discover scientifically scored, plastic-conscious home and personal staples. Certified materials, transparent lifecycles, zero greenwashing.'
              )}
            </p>

            {/* Primary Action Button */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-soft-md hover:shadow-soft-lg transition-all cursor-pointer group min-h-[48px]"
              >
                <span>{t('hero.cta_discover', 'Discover More')}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/how-it-works"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-surface-raised hover:bg-surface border border-line text-heading text-sm font-semibold transition cursor-pointer min-h-[48px]"
              >
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>{t('hero.cta_how', 'Our Methodology')}</span>
              </Link>
            </div>

            {/* Three Category Tiles Underneath */}
            <div className="pt-4 border-t border-line/60">
              <p className="text-xs font-mono uppercase tracking-wider text-text-muted mb-3">
                {t('hero.featured_categories', 'Explore Essential Categories')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {categoryPills.map((pill) => {
                  const Icon = pill.icon;
                  return (
                    <Link
                      key={pill.id}
                      to={`/shop?category=${pill.id}`}
                      className="p-3 rounded-2xl bg-surface-raised hover:bg-surface-accent border border-line/80 hover:border-primary/40 transition flex items-center gap-3 group shadow-soft-xs"
                    >
                      <div className="w-9 h-9 rounded-xl bg-surface-accent group-hover:bg-primary/20 text-primary flex items-center justify-center shrink-0 transition">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-heading group-hover:text-primary transition truncate">
                          {pill.label}
                        </div>
                        <div className="text-[10px] text-text-muted font-mono truncate">
                          {pill.desc}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Visual Product / Lifestyle Card with Floating Leaves & Optional Video Slot */}
          <motion.div
            {...motionProps}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl overflow-hidden border border-line bg-surface-raised shadow-soft-lg aspect-[4/5] sm:aspect-square lg:aspect-[4/5] flex items-center justify-center group">
              {/* Optional Background Looping Video Slot */}
              {canPlayVideo && (
                <video
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="metadata"
                  poster="/images/products/kit-01-800.webp"
                  className="absolute inset-0 w-full h-full object-cover z-0 opacity-90 hidden"
                  onError={(e) => {
                    // Fall back to poster image seamlessly
                    e.currentTarget.style.display = 'none';
                  }}
                >
                  <source src="/videos/hero-nature.webm" type="video/webm" />
                  <source src="/videos/hero-nature.mp4" type="video/mp4" />
                </video>
              )}

              {/* High-Resolution Hero Nature Image */}
              <img
                src="/images/products/kit-01-800.webp"
                alt="Natural bamboo and coconut fiber conscious tableware"
                width="800"
                height="800"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="eager"
              />

              {/* Soft Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

              {/* Floating Leaf Particles in card */}
              <LeafParticles />

              {/* Bottom Card Floating Trust Badge */}
              <div className="absolute bottom-5 inset-x-5 p-4 rounded-2xl bg-surface/92 backdrop-blur-md border border-line shadow-soft-md flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-heading">
                    Zero-Waste Living Kit
                  </div>
                  <div className="text-[11px] text-text-muted font-mono">
                    Grade A · 100% Compostable
                  </div>
                </div>
                <Link
                  to="/shop?category=kitchen"
                  className="px-3 py-1.5 rounded-full bg-primary text-white text-xs font-medium hover:bg-primary-hover transition shrink-0"
                >
                  View Swaps
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

