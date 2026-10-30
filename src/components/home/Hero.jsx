import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Utensils, Sparkles, Home, ShieldCheck } from 'lucide-react';
import { useT } from '../../context/I18nContext';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import Safe3D from '../3D/Safe3D';
import LeafParticles from '../LeafParticles';

const LeafyGlobe3D = React.lazy(() => import('../3D/LeafyGlobe3D'));

function HeroGlobeSkeleton() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-surface-sunken/40 animate-pulse select-none" aria-hidden="true">
      <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
        <span className="text-4xl select-none opacity-40">🌍</span>
      </div>
      <div className="mt-4 h-2.5 w-32 rounded-full bg-primary/15" />
    </div>
  );
}

export default function Hero() {
  const { t } = useT();
  const { reduceEffects } = useTheme();
  const { impact } = useCart();
  const cartCo2Saved = parseFloat(impact?.co2Saved) || 0;

  const [isMobileScreen, setIsMobileScreen] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 640 : false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

          {/* Right Column: Interactive 3D Biosphere Globe with Safe3D Fallback */}
          <motion.div
            {...motionProps}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl overflow-hidden border border-line bg-surface-raised shadow-soft-lg aspect-[4/5] sm:aspect-square lg:aspect-[4/5] flex items-center justify-center group">
              <Safe3D
                autoLoad
                fullCover
                forceFallback={isMobileScreen}
                fallbackImage="/images/products/kit-01-800.webp"
                fallbackTitle="Interactive 3D Biosphere"
                className="h-full w-full"
              >
                <React.Suspense fallback={<HeroGlobeSkeleton />}>
                  <LeafyGlobe3D cartCo2Saved={cartCo2Saved} />
                </React.Suspense>
              </Safe3D>

              {/* Floating Leaf Particles in card frame */}
              <LeafParticles />

              {/* Bottom Card Floating Trust Badge & Live Planet Impact */}
              <div className="absolute bottom-5 inset-x-5 p-4 rounded-2xl bg-surface/92 backdrop-blur-md border border-line shadow-soft-md flex items-center justify-between gap-3 z-10 pointer-events-auto">
                <div className="space-y-0.5 min-w-0">
                  <div className="text-xs font-bold text-heading truncate">
                    {t('hero.impact_title', 'Your Planet Impact')}
                  </div>
                  <div className="text-[11px] text-text-muted font-mono truncate">
                    {cartCo2Saved > 0
                      ? `${cartCo2Saved.toFixed(2)} kg CO₂ avoided in cart`
                      : t('hero.impact_live_prompt', 'Add zero-waste swaps to track live CO₂ avoided')}
                  </div>
                </div>
                <Link
                  to="/shop"
                  className="px-3.5 py-1.5 rounded-full bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition shrink-0 shadow-soft-xs cursor-pointer min-h-[34px] flex items-center justify-center"
                >
                  {t('hero.view_swaps', 'View Swaps')}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

