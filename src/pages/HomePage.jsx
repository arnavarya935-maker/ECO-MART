import React from 'react';
import EngineeringHero from '../components/home/EngineeringHero';
import EditorialValueStatement from '../components/home/EditorialValueStatement';
import FeatureGridDisciplines from '../components/home/FeatureGridDisciplines';
import SignatureShowcase from '../components/home/SignatureShowcase';
import AgentJourneySticky from '../components/home/AgentJourneySticky';
import AnimatedImpactCounters from '../components/AnimatedImpactCounters';
import FillInTheBlanksForm from '../components/home/FillInTheBlanksForm';
import EditorialFinalCTA from '../components/home/EditorialFinalCTA';
import RecentlyViewedStrip from '../components/RecentlyViewedStrip';
import ForYouRow from '../components/recommendations/ForYouRow';

export default function HomePage() {
  return (
    <div className="w-full bg-surface">
      {/* 1. Hero: Editorial headline, Italian serif italic emphasis, Safe3D biosphere visualizer */}
      <EngineeringHero />

      {/* 2. Short Value Statement: Philosophy & manifesto against greenwashing */}
      <EditorialValueStatement />

      {/* 3. Numbered Feature Grid: Four disciplines with live animated SVG/CSS mini-visuals */}
      <FeatureGridDisciplines />

      {/* 4. Featured Products Showcase: Signature Innovations with packshot panels and metadata chips */}
      <SignatureShowcase />

      {/* Recommended For You & Recently Viewed (Preserved features) */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-8 space-y-6">
        <ForYouRow />
        <RecentlyViewedStrip />
      </div>

      {/* 5. "How the Eco Agent works" Sticky Journey: Understand -> Match -> Optimise -> Explain */}
      <AgentJourneySticky />

      {/* 6. Impact Counters: Audited collective milestones (CO2, plastics, trees, water) */}
      <AnimatedImpactCounters />

      {/* 7. Fill-in-the-blanks sentence-style agent entry */}
      <FillInTheBlanksForm />

      {/* 8. Final Call-to-Action: Confident closing banner */}
      <EditorialFinalCTA />
    </div>
  );
}
