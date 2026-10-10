import React from 'react';
import Hero from '../components/Hero';
import CategoryGrid from '../components/CategoryGrid';
import ProductCard from '../components/ProductCard';
import ImpactDashboard from '../components/ImpactDashboard';
import LiveSwapDemo from '../components/LiveSwapDemo';
import PartnerMarquee from '../components/PartnerMarquee';
import AnimatedImpactCounters from '../components/AnimatedImpactCounters';
import StorytellingSection from '../components/StorytellingSection';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import TestimonialsCarousel from '../components/TestimonialsCarousel';
import { useCart } from '../context/CartContext';
import { Sparkles, ArrowRight, ShieldCheck, Award } from 'lucide-react';

export default function HomePage({ setActivePage, onCategorySelect }) {
  const { allProducts, setIsAgentOpen } = useCart();

  // Curate 6 top-rated Grade A eco picks
  const featuredPicks = (allProducts || [])
    .filter((p) => p.isEcoFriendly)
    .slice(0, 6);

  const handleCategoryClick = (category) => {
    if (onCategorySelect) onCategorySelect(category);
    setActivePage('shop');
  };

  return (
    <div className="space-y-12">
      {/* Hero with interactive swap simulation */}
      <Hero onExploreClick={() => setActivePage('shop')} />

      {/* Partner & Certification Marquee (Feature 40) */}
      <PartnerMarquee />

      {/* Animated Impact Counters (Feature 35) */}
      <AnimatedImpactCounters />

      {/* Category Tiles */}
      <CategoryGrid onSelectCategory={handleCategoryClick} />

      {/* Featured Eco Picks Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full">
                Curated Excellence
              </span>
              <span className="text-xs text-stone-500">Grade A Certified</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 mt-1">
              Featured Eco-Picks
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setActivePage('shop')}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 transition"
          >
            <span>View All 40+ Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPicks.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Storytelling Section ("From waste to wonder", Feature 34) */}
      <StorytellingSection />

      {/* Before / After Interactive Slider (Feature 42) */}
      <BeforeAfterSlider />

      {/* Live Swap Demo (Feature 24) */}
      <LiveSwapDemo />

      {/* Testimonials Carousel (Feature 41) */}
      <TestimonialsCarousel />

      {/* Live Impact Dashboard Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ImpactDashboard showHeader={true} />
      </section>

      {/* Agent Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-900 to-stone-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-3 max-w-xl text-center md:text-left z-10">
            <span className="text-xs uppercase font-extrabold tracking-wider px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              Meet Your AI Eco Guide
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Unsure which product has the lowest footprint?
            </h3>
            <p className="text-sm text-emerald-100/80 leading-relaxed">
              Ask our Eco Agent in natural language. Try queries like{' '}
              <span className="italic text-emerald-300">"plastic-free gifts under ₹1000"</span> or{' '}
              <span className="italic text-emerald-300">"audit my cart for greener swaps"</span>.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAgentOpen(true)}
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-stone-900 hover:bg-stone-100 font-extrabold text-sm shadow-lg transition active:scale-95 shrink-0 z-10"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Launch Eco Agent</span>
          </button>
        </div>
      </section>
    </div>
  );
}
