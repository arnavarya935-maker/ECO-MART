import React from 'react';
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
import AppWindowShowcase from '../components/home/AppWindowShowcase';
import NumberedFeatureCards from '../components/home/NumberedFeatureCards';
import AgentPipelinePanel from '../components/home/AgentPipelinePanel';
import GuardrailsBoard from '../components/home/GuardrailsBoard';
import EthicsInboxPreview from '../components/home/EthicsInboxPreview';
import InsightsDashboard from '../components/home/InsightsDashboard';
import ImpactTiers from '../components/home/ImpactTiers';
import HonestFeedbackSection from '../components/home/HonestFeedbackSection';
import EditorialFinalCTA from '../components/home/EditorialFinalCTA';
import SignatureShowcase from '../components/home/SignatureShowcase';
import ForYouRow from '../components/recommendations/ForYouRow';
import RecentlyViewedStrip from '../components/RecentlyViewedStrip';
import ResponsibleAILabsShowcase from '../components/home/ResponsibleAILabsShowcase';
import RelatedNewsPanel from '../components/news/RelatedNewsPanel';

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

      {/* Feedback section: Local "Share feedback" form + labeled representative scenarios */}
      <HonestFeedbackSection />

      {/* In the News strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <RelatedNewsPanel
          topic="greenwashing"
          title="In the News: Sustainability & Consumer Watch"
          description="Independent reports on corporate green claims, packaging waste laws, and circular supply chains."
          maxArticles={3}
        />
      </div>

      {/* Closing CTA */}
      <EditorialFinalCTA />
    </div>
  );
}
