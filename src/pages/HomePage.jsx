import React from 'react';
import EngineeringHero from '../components/home/EngineeringHero';
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

export default function HomePage() {
  return (
    <div className="w-full bg-surface antialiased">
      {/* 2. Hero: Two-line headline about shopping that proves its claims, ContourCanvas, CTAs */}
      <EngineeringHero />

      {/* 3. Marquee of text chips naming check types (paused on hover and reduced motion) */}
      <CheckMarquee />

      {/* 4. App-window showcase: Framed mockup built from live EcoMart dashboard components */}
      <AppWindowShowcase />

      {/* 5. Three numbered feature cards (01/02/03) with one stat each */}
      <NumberedFeatureCards />

      {/* 6. Live "Eco Agent pipeline" panel: Orchestrator -> Workers -> Validator + live counters */}
      <AgentPipelinePanel />

      {/* 7. Guardrails board: 5 rules with status chips Enforced / Monitoring / Blocked */}
      <GuardrailsBoard />

      {/* 8. Ethics Inbox preview: Human-in-the-loop review queue */}
      <EthicsInboxPreview />

      {/* 9. Insights dashboard: Stat cards, session energy bar, bar chart, product-vs-check table */}
      <InsightsDashboard />

      {/* Product Catalog Showcase (Preserved live interactive shopping features) */}
      <div className="py-12 bg-surface border-b border-line">
        <SignatureShowcase />
        <div className="max-w-6xl mx-auto px-6 md:px-10 mt-6 space-y-6">
          <ForYouRow />
          <RecentlyViewedStrip />
        </div>
      </div>

      {/* 10. "Impact tiers" (Explorer / Classroom / School) describing feature scope, no prices */}
      <ImpactTiers />

      {/* 11. Feedback section: Local "Share feedback" form + labeled representative scenarios */}
      <HonestFeedbackSection />

      {/* 12. Closing CTA (Footer rendered in App.jsx with live proxy health check) */}
      <EditorialFinalCTA />
    </div>
  );
}
