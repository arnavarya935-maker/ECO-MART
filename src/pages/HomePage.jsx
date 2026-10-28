import React, { lazy, Suspense } from 'react';
import EngineeringHero from '../components/home/EngineeringHero';
import ScrollProgressBar from '../components/home/ScrollProgressBar';
import KineticTypeStrips from '../components/home/KineticTypeStrips';
import WordByWordMission from '../components/home/WordByWordMission';
import GreenwashingStrikethrough from '../components/home/GreenwashingStrikethrough';
import EcoJourneyScene from '../components/home/EcoJourneyScene';
import PinnedProductJourney from '../components/home/PinnedProductJourney';
import HorizontalFeatureGallery from '../components/home/HorizontalFeatureGallery';
import StickyStackedCards from '../components/home/StickyStackedCards';
import CheckMarquee from '../components/home/CheckMarquee';
import SignatureShowcase from '../components/home/SignatureShowcase';

// Below-the-fold components lazy-loaded for peak initial load performance
const ResponsibleAILabsShowcase = lazy(() => import('../components/home/ResponsibleAILabsShowcase'));
const AppWindowShowcase = lazy(() => import('../components/home/AppWindowShowcase'));
const NumberedFeatureCards = lazy(() => import('../components/home/NumberedFeatureCards'));
const AgentPipelinePanel = lazy(() => import('../components/home/AgentPipelinePanel'));
const GuardrailsBoard = lazy(() => import('../components/home/GuardrailsBoard'));
const EthicsInboxPreview = lazy(() => import('../components/home/EthicsInboxPreview'));
const InsightsDashboard = lazy(() => import('../components/home/InsightsDashboard'));
const ForYouRow = lazy(() => import('../components/recommendations/ForYouRow'));
const RecentlyViewedStrip = lazy(() => import('../components/RecentlyViewedStrip'));
const ImpactTiers = lazy(() => import('../components/home/ImpactTiers'));
const HonestFeedbackSection = lazy(() => import('../components/home/HonestFeedbackSection'));
const EditorialFinalCTA = lazy(() => import('../components/home/EditorialFinalCTA'));
const RelatedNewsPanel = lazy(() => import('../components/news/RelatedNewsPanel'));

export default function HomePage() {
  return (
    <div className="w-full bg-surface antialiased">
      {/* 8. Scroll Progress Bar & Floating Quick-Nav */}
      <ScrollProgressBar />

      {/* Hero: Two-line headline about shopping that proves its claims */}
      <EngineeringHero />

      {/* 3. Kinetic Type Hero Strips: Giant VERIFY / TRUST / PROVE strips with scroll velocity response */}
      <KineticTypeStrips />

      {/* Check types marquee */}
      <CheckMarquee />

      {/* 4. Word-by-Word Mission Reveal: Opacity scrubbed per word with inline semantic icons */}
      <WordByWordMission />

      {/* 1. Greenwashing Strike-through: Scroll-scrubbed marketing claim struck through + Trust Score count-up */}
      <GreenwashingStrikethrough />

      {/* Layered Parallax Story: Eco Journey (Make -> Ship -> Use -> Second Life) */}
      <EcoJourneyScene />

      {/* 2. Pinned Product Journey: Pinned 4-stage scrub (Make -> Ship -> Use -> Second Life) with labeled estimates */}
      <PinnedProductJourney />

      {/* 5. Horizontal Pinned Feature Gallery: Courtroom, Label Scanner, Fairness Lab, Black Box, Playground */}
      <HorizontalFeatureGallery />

      {/* 6 & 7. Sticky Stacked Cards & Clip-Path Reveals: Multi-Axis, Lifecycle, Transparency */}
      <StickyStackedCards />

      {/* Suspense boundary for below-the-fold features */}
      <Suspense fallback={<div className="min-h-[100px]" />}>
        {/* Flagship Responsible AI Laboratory Showcase (F1-F8) */}
        <ResponsibleAILabsShowcase />

        {/* App-window showcase: Framed mockup built from live EcoMart dashboard components */}
        <AppWindowShowcase />

        {/* Numbered feature cards (01/02/03) with key stats */}
        <NumberedFeatureCards />

        {/* Live "Eco Agent pipeline" panel: Orchestrator -> Workers -> Validator + live counters */}
        <AgentPipelinePanel />

        {/* Guardrails board: 5 rules with status chips Enforced / Monitoring / Blocked */}
        <GuardrailsBoard />

        {/* Ethics Inbox preview: Human-in-the-loop review queue */}
        <EthicsInboxPreview />

        {/* Insights dashboard: Stat cards, session energy bar, bar chart, product-vs-check table */}
        <InsightsDashboard />

        {/* Product Catalog Showcase (Preserved live interactive shopping features) */}
        <div className="py-12 bg-surface border-b border-line">
          <SignatureShowcase />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
            <ForYouRow />
            <RecentlyViewedStrip />
          </div>
        </div>

        {/* Impact tiers describing feature scope */}
        <ImpactTiers />

        {/* Related verified news */}
        <RelatedNewsPanel />

        {/* Honest feedback section with public ratings */}
        <HonestFeedbackSection />

        {/* Final editorial CTA banner */}
        <EditorialFinalCTA />
      </Suspense>
    </div>
  );
}
