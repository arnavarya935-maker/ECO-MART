import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, RefreshCw, BarChart2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useT } from '../context/I18nContext';
import Safe3D from './3D/Safe3D';

const LeafyGlobe3D = React.lazy(() => import('./3D/LeafyGlobe3D'));

export default function Hero() {
  const { setIsAgentOpen, impact } = useCart();
  const { t } = useT();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-surface-accent via-surface to-surface pt-12 pb-16 md:pt-16 md:pb-20 border-b border-line">
      {/* Static Radial Light Blobs */}
      <div className="hero-light-blob-left" aria-hidden="true" />
      <div className="hero-light-blob-right" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Clear Value Proposition (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-raised border border-line shadow-soft-sm text-heading text-xs font-sans font-medium mx-auto lg:mx-0">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>{t('hero.badge', 'Shop with Purpose • Transparent Impact Estimates')}</span>
            </div>

            {/* Main Headline with Fraunces serif and elegant gradient */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] hero-headline-gradient">
              {t('hero.title', "Don't just shop. Shop with purpose.")}
            </h1>

            {/* Supporting Paragraph answering why it matters */}
            <p className="text-sm sm:text-base text-secondary max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans font-normal">
              {t('hero.subtitle', 'Replace recurring disposable waste with durable, certified sustainable goods. We calculate the exact carbon, water, and plastic savings for every product.')}
            </p>

            {/* CTAs: 1 Primary, 1 Secondary */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              {/* Primary CTA */}
              <Link
                to="/shop"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast font-sans font-semibold text-sm flex items-center justify-center gap-2 shadow-soft-sm transition-all min-h-[44px]"
              >
                <span>{t('hero.exploreCta', 'Explore Sustainable Catalog')}</span>
                <ArrowRight className="w-4 h-4 text-primary-contrast" />
              </Link>

              {/* Secondary CTA */}
              <button
                type="button"
                onClick={() => setIsAgentOpen(true)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-surface-raised hover:bg-surface-sunken border border-line text-heading font-sans font-medium text-sm flex items-center justify-center gap-2 shadow-soft-sm transition min-h-[44px] cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span>{t('hero.agentCta', 'Consult Eco Agent Co-Pilot')}</span>
              </button>
            </div>

            {/* Value Highlights */}
            <div className="pt-4 grid grid-cols-3 gap-3 border-t border-line max-w-lg mx-auto lg:mx-0 text-left">
              <div className="space-y-0.5">
                <div className="text-xs font-sans font-semibold text-heading flex items-center gap-1.5">
                  <BarChart2 className="w-3.5 h-3.5 text-primary" /> 0-100 Score
                </div>
                <div className="text-[11px] font-sans text-muted">Transparent Lifecycle</div>
              </div>

              <div className="space-y-0.5">
                <div className="text-xs font-sans font-semibold text-heading flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-primary" /> 1-Tap Swaps
                </div>
                <div className="text-[11px] font-sans text-muted">Cleaner Alternatives</div>
              </div>

              <div className="space-y-0.5">
                <div className="text-xs font-sans font-semibold text-heading flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Offline Capable
                </div>
                <div className="text-[11px] font-sans text-muted">Fallback Mode Built-In</div>
              </div>
            </div>
          </div>

          {/* Right Column: Scroll-Linked 3D Biosphere in Safe3D (5 Cols) */}
          <div className="lg:col-span-5">
            <Safe3D
              featureName="Planetary Biosphere Visualizer"
              height="380px"
              staticFallbackImage="/images/products/kit-01.jpg"
            >
              <LeafyGlobe3D cartCo2Saved={parseFloat(impact.co2Saved) || 0} />
            </Safe3D>
          </div>
        </div>
      </div>
    </section>
  );
}

