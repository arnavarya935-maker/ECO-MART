import React, { Suspense, lazy } from 'react';
import Hero from '../components/home/Hero';
import WhoWeAre from '../components/home/WhoWeAre';
import BenefitsSplit from '../components/home/BenefitsSplit';
import PillarsStrip from '../components/home/PillarsStrip';
import ProblemSection from '../components/home/ProblemSection';
import ImpactCounters from '../components/home/ImpactCounters';

// Code-split below-the-fold sections to preserve initial home route performance budget (<250 kB gzipped)
const FromTheBlog = lazy(() => import('../components/home/FromTheBlog'));
const ReviewsSummary = lazy(() => import('../components/home/ReviewsSummary'));
const PartnersStrip = lazy(() => import('../components/home/PartnersStrip'));
const TestimonialsCarousel = lazy(() => import('../components/home/TestimonialsCarousel'));
const CtaBanner = lazy(() => import('../components/home/CtaBanner'));

export default function HomePage() {
  return (
    <div className="w-full bg-surface antialiased transition-colors">
      {/* 3. Hero Section with Fraunces Highlight & Leaf Particles */}
      <Hero />

      {/* 4. Who We Are: Leaf Divider & 3 Purpose Cards */}
      <WhoWeAre />

      {/* 5. Benefits Split: Environmental vs. Social & Health Checklists */}
      <BenefitsSplit />

      {/* 6. Pillars Strip: Botanical, Compostable, and Certified Credentials */}
      <PillarsStrip />

      {/* 7. Problem Section: Plastic Proliferation & Unchecked Greenwashing */}
      <ProblemSection />

      {/* 8. Impact Counters: Animated Live Catalog Data & SDG Indicators */}
      <ImpactCounters />

      {/* Below-the-fold sections with graceful loading */}
      <Suspense fallback={<div className="min-h-[200px]" />}>
        {/* 9. From The Blog: Field Reporting & Science Guides */}
        <FromTheBlog />

        {/* 10. Reviews Summary: Real Customer Submissions & Star Breakdown */}
        <ReviewsSummary />

        {/* 11. Partners Strip: Marquee Placeholder Slots */}
        <PartnersStrip />

        {/* 12. Testimonials Carousel: Accessible Keyboard & Touch Swipe Carousel */}
        <TestimonialsCarousel />

        {/* 13. Call-to-Action Banner: Coupon Offer & Account Creation */}
        <CtaBanner />
      </Suspense>
    </div>
  );
}
