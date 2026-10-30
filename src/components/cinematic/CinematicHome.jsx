import React, { lazy, Suspense, useState } from 'react';
import { ChevronDown, Sliders } from 'lucide-react';
import LayeredCanvasBackground from './LayeredCanvasBackground';
import ChapterRail from './ChapterRail';
import CinematicHero from './CinematicHero';
import CinematicStory from './CinematicStory';
import CinematicMosaic from './CinematicMosaic';
import CinematicAtlas from './CinematicAtlas';
import CinematicClosing from './CinematicClosing';

// Lazy-loaded extended playgrounds for below-the-fold inspection
const ResponsibleAILabsShowcase = lazy(() => import('../home/ResponsibleAILabsShowcase'));
const InsightsDashboard = lazy(() => import('../home/InsightsDashboard'));
const HonestFeedbackSection = lazy(() => import('../home/HonestFeedbackSection'));
const RecentlyViewedStrip = lazy(() => import('../RecentlyViewedStrip'));

export default function CinematicHome() {
  const [showExtendedLabs, setShowExtendedLabs] = useState(false);

  return (
    <div className="relative w-full antialiased text-text selection:bg-primary/20 selection:text-heading overflow-x-hidden">
      {/* 1. Atmospheric Non-WebGL Background (Layered Radial Gradients & Silhouettes) */}
      <LayeredCanvasBackground />

      {/* 2. Desktop Right-Aligned Chapter Navigation Rail */}
      <ChapterRail />

      {/* 3. Chapter 00: The First Choice (Split Hero) */}
      <CinematicHero />

      {/* 4. Chapter 01: The Living Ledger (Ruled Stats Band from Real Catalog Data) */}
      <CinematicStory />

      {/* 5. Chapter 02: Selected Alternatives (Live Mosaic: 1 Large + 2 Stacked Cards) */}
      <CinematicMosaic />

      {/* 6. Chapter 03: How Eco Sense Works (Five-Stage Numbered Atlas) */}
      <CinematicAtlas />

      {/* 7. Chapter 04: Take Action (Closing CTA to Swap My List) */}
      <CinematicClosing />

      {/* 8. Interactive Extended Laboratories Drawer (Preserves all deep research tools) */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-line/40 text-center">
        <button
          type="button"
          onClick={() => setShowExtendedLabs((prev) => !prev)}
          aria-expanded={showExtendedLabs}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-raised hover:bg-surface-sunken border border-line text-xs font-mono font-medium text-text-secondary hover:text-heading transition-colors focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5 text-primary" />
          <span>
            {showExtendedLabs
              ? 'Hide Extended Research Labs'
              : 'Inspect Extended Responsible AI Labs & Telemetry'}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              showExtendedLabs ? 'rotate-180' : ''
            }`}
          />
        </button>

        {showExtendedLabs && (
          <div className="mt-12 text-left space-y-12 animate-fade-in">
            <Suspense fallback={<div className="h-24 flex items-center justify-center text-xs font-mono text-text-muted">Loading labs...</div>}>
              <ResponsibleAILabsShowcase />
              <InsightsDashboard />
              <RecentlyViewedStrip />
              <HonestFeedbackSection />
            </Suspense>
          </div>
        )}
      </section>
    </div>
  );
}
