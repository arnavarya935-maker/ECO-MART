import React from 'react';
import Hero from '../components/Hero';
import RecentlyViewedStrip from '../components/RecentlyViewedStrip';
import CategoryGrid from '../components/CategoryGrid';
import LiveSwapDemo from '../components/LiveSwapDemo';
import AnimatedImpactCounters from '../components/AnimatedImpactCounters';
import StorytellingSection from '../components/StorytellingSection';
import TestimonialsCarousel from '../components/TestimonialsCarousel';

export default function HomePage() {
  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero: What/Why/Next with 1 primary & 1 secondary CTA + scroll-linked globe */}
      <Hero />

      {/* 2. Continue where you left off / Recently viewed (Feature 27) */}
      <RecentlyViewedStrip />

      {/* 3. Categories (Feature 10) */}
      <CategoryGrid />

      {/* 4. Featured Swaps (Live Swap Demo, Feature 10 & 24) */}
      <LiveSwapDemo />

      {/* 5. Impact Proof (Animated Impact Counters, Feature 10 & 35) */}
      <AnimatedImpactCounters />

      {/* 6. How It Works / Methodology ("From waste to wonder", Feature 10 & 34) */}
      <StorytellingSection />

      {/* 7. Testimonials (Customer review endorsements, Feature 10 & 41) */}
      <TestimonialsCarousel />
    </div>
  );
}
