import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Info,
  ArrowRight,
  ShoppingBag,
  Compass
} from 'lucide-react';
import {
  useScrollProgress,
  isReducedMotion,
  getStageForProgress
} from '../../lib/scrollAnimation';
import { useTheme } from '../../context/ThemeContext';

const SCENES = [
  {
    id: 'make',
    stepNumber: '01',
    name: 'Make',
    mood: 'Dawn Cultivation',
    title: 'Himalayan Harvest & Zero-Petrochemical Spinning',
    caption:
      'The journey starts at dawn. Regenerative organic hemp and bamboo are cultivated with rainwater and zero synthetic nitrates. Solar-powered mechanical looms weave fibers without toxic chemical baths.',
    metric: '~0.18 kg CO₂e (Estimate)',
    metricLabel: 'Embodied Carbon per Unit',
    assumptions:
      'Estimated under ISO 14040 cradle-to-gate LCA. 78% reduction compared against petrochemical polyester baselines.',
    accentColor: '#047857',
    skyColors: {
      light: 'linear-gradient(180deg, #E6F3EC 0%, #F5FBF7 50%, #FAF8F2 100%)',
      dark: 'linear-gradient(180deg, #071A12 0%, #0A2218 50%, #05100B 100%)'
    }
  },
  {
    id: 'ship',
    stepNumber: '02',
    name: 'Ship',
    mood: 'Intermodal Transit',
    title: 'Electrified Rail & Flat-Pack Kraft Packaging',
    caption:
      'Leaving the workshop, cargo moves via electrified regional rail networks rather than diesel air or long-haul trucking. Consolidated shipments use unbleached water-activated paper tape with zero single-use bubble wrap.',
    metric: '~0.04 kg CO₂e (Estimate)',
    metricLabel: 'Transit Footprint per 500km',
    assumptions:
      'Calculated based on Indian Railways electrified freight emissions coefficient (0.012 kg CO₂e/tonne-km) vs road freight (0.068 kg CO₂e/tonne-km).',
    accentColor: '#0F766E',
    skyColors: {
      light: 'linear-gradient(180deg, #CCFBF1 0%, #E8F7F4 50%, #FAF8F2 100%)',
      dark: 'linear-gradient(180deg, #041D1A 0%, #082924 50%, #05100B 100%)'
    }
  },
  {
    id: 'use',
    stepNumber: '03',
    name: 'Use',
    mood: 'Home Sanctuary',
    title: 'Minimalist Shelf Life & 300+ Concentrated Refills',
    caption:
      'Inside the home, the product sits gracefully on a bathroom or kitchen shelf. Aerospace-grade aluminum casing and food-grade silicone seals prevent microplastic leaching and last for 5+ years of daily use.',
    metric: '~14 L Water (Estimate)',
    metricLabel: 'Lifecycle Water Conserved',
    assumptions:
      'Conserved across 300+ concentrate refill cycles by eliminating the manufacturing, bottling, and freight of diluted water-based solutions.',
    accentColor: '#10B981',
    skyColors: {
      light: 'linear-gradient(180deg, #FEF3C7 0%, #F7F5EB 50%, #FAF8F2 100%)',
      dark: 'linear-gradient(180deg, #1C1504 0%, #151F19 50%, #05100B 100%)'
    }
  },
  {
    id: 'second_life',
    stepNumber: '04',
    name: 'Second Life',
    mood: 'Regenerative Garden',
    title: 'Backyard Composting & Scrap Kabadiwala Circularity',
    caption:
      'When its lifespan concludes, the plant-fiber casing naturally decomposes into nutrient-rich garden compost within 90 days. The aluminum core connects directly to verified local kabadiwala recycling.',
    metric: '100% Circular (Estimate)',
    metricLabel: 'Landfill Diversion Ratio',
    assumptions:
      '100% of material mass is classified as home-compostable (ASTM D6400) or indefinitely recyclable alloy (melt point 660°C).',
    accentColor: '#B45309',
    skyColors: {
      light: 'linear-gradient(180deg, #FEF9C3 0%, #E6F3EC 50%, #FAF8F2 100%)',
      dark: 'linear-gradient(180deg, #221703 0%, #0D261B 50%, #05100B 100%)'
    }
  }
];

export default function EcoJourneyScene() {
  const containerRef = useRef(null);
  const { reduceEffects, theme } = useTheme();
  const [activeTooltip, setActiveTooltip] = useState(null);
  const isDark = theme === 'dark';

  const reduced = isReducedMotion() || Boolean(reduceEffects);

  // 850px of smooth, non-trapping scroll travel for desktop parallax scrubbing
  const { progress } = useScrollProgress(containerRef, {
    pinTravel: 850,
    disabled: reduced
  });

  const p = reduced ? 1 : progress;
  const currentStageIndex = reduced ? 0 : getStageForProgress(p, SCENES.length);
  const currentStage = SCENES[currentStageIndex] || SCENES[0];

  // Dynamic parallax camera translation speeds (in pixels or %)
  const skyPanX = reduced ? 0 : -(p * 120);
  const farHillsX = reduced ? 0 : -(p * 180);
  const midHillsX = reduced ? 0 : -(p * 360);
  const foregroundX = reduced ? 0 : -(p * 640);
  const pathDashOffset = reduced ? 0 : 400 - p * 400;

  const scrollToStage = (stageIdx) => {
    if (!containerRef.current || typeof window === 'undefined') return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    // Map stage index to scroll offset within the pinned travel
    const targetOffset = scrollTop + rect.top + (stageIdx / SCENES.length) * 850;
    window.scrollTo({
      top: targetOffset,
      behavior: reduced ? 'auto' : 'smooth'
    });
  };

  // --------------------------------------------------------------------------
  // Reduced Motion / Static Fallback Presentation
  // --------------------------------------------------------------------------
  if (reduced) {
    return (
      <section
        id="eco-journey"
        aria-label="Eco Journey Lifecycle Story"
        className="relative w-full bg-surface py-16 px-4 sm:px-6 lg:px-8 border-b border-line selection:bg-emerald-500/20"
      >
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase bg-primary-subtle text-primary border border-primary/20">
              <Compass className="w-3.5 h-3.5 text-primary" />
              Eco Journey • Static View
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-medium text-heading">
              A Product&apos;s Life in Four Verifiable Scenes
            </h2>
            <p className="text-sm sm:text-base text-text-secondary">
              Trace a product from ethical raw cultivation through electrified transit, daily home usage, and second life regeneration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SCENES.map((scene) => (
              <article
                key={scene.id}
                className="p-6 sm:p-8 rounded-3xl bg-surface-raised border border-line shadow-card space-y-4 text-left"
              >
                <div className="flex items-center justify-between pb-3 border-b border-line">
                  <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase">
                    Stage {scene.stepNumber} • {scene.name}
                  </span>
                  <span className="text-[11px] font-mono text-text-muted">{scene.mood}</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-heading">{scene.title}</h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{scene.caption}</p>
                <div className="p-3 rounded-2xl bg-surface-sunken border border-line/60">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
                    {scene.metricLabel}
                  </div>
                  <div className="text-sm font-mono font-bold text-heading mt-0.5" style={{ color: scene.accentColor }}>
                    {scene.metric}
                  </div>
                  <div className="text-[11px] text-text-secondary mt-1">{scene.assumptions}</div>
                </div>
              </article>
            ))}
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/shop"
              className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-primary-contrast text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-soft-sm"
            >
              Browse Conscious Catalog
            </Link>
            <Link
              to="/tools"
              className="px-5 py-2.5 rounded-full bg-surface-sunken hover:bg-surface-accent border border-line text-xs font-mono font-semibold uppercase tracking-wider text-heading transition-colors"
            >
              Explore Second Life Tools
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // --------------------------------------------------------------------------
  // Dynamic Scroll-Driven Layered Parallax Scene (Desktop & Standard)
  // --------------------------------------------------------------------------
  return (
    <section
      ref={containerRef}
      id="eco-journey"
      aria-label="Interactive Eco Journey Parallax Story"
      className="relative w-full bg-surface border-b border-line selection:bg-emerald-500/20"
      style={{
        minHeight: 'clamp(750px, 150vh, 1200px)'
      }}
    >
      {/* Sticky Viewport Frame */}
      <div className="sticky top-16 sm:top-20 w-full h-[620px] sm:h-[680px] overflow-hidden flex flex-col justify-between">
        {/* Layer 1: Sky & Atmospheric Gradient Background */}
        <div
          aria-hidden="true"
          className="absolute inset-0 transition-all duration-700 pointer-events-none"
          style={{
            background: isDark ? currentStage.skyColors.dark : currentStage.skyColors.light
          }}
        />

        {/* Ambient Sun / Moon Glow Orb (Parallax depth 0.08) */}
        <div
          aria-hidden="true"
          className="absolute -top-12 right-[18%] w-80 h-80 rounded-full blur-3xl pointer-events-none transition-transform duration-300"
          style={{
            background:
              currentStageIndex === 3
                ? 'radial-gradient(circle, rgba(245, 158, 11, 0.28) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(4, 120, 87, 0.18) 0%, transparent 70%)',
            transform: `translate3d(${skyPanX * 0.2}px, 0, 0)`
          }}
        />

        {/* Layer 2: Far Hills & Distant Mountain Ridges (Parallax depth 0.15) */}
        <div
          aria-hidden="true"
          className="absolute bottom-16 inset-x-0 h-72 pointer-events-none will-change-transform"
          style={{
            transform: `translate3d(${farHillsX}px, 0, 0)`
          }}
        >
          <svg
            className="w-[2400px] h-full text-emerald-900/10 dark:text-emerald-400/5 transition-colors"
            viewBox="0 0 2400 300"
            fill="currentColor"
            preserveAspectRatio="none"
          >
            {/* Distant ridge wave with clean hand-drawn silhouette */}
            <path d="M0,180 Q300,100 600,160 T1200,140 T1800,110 T2400,170 L2400,300 L0,300 Z" />
            {/* Very far solar field shimmer on hilltop */}
            <polygon points="560,150 640,140 680,165 590,175" fill="currentColor" fillOpacity="0.4" />
            <polygon points="1720,105 1800,95 1840,120 1750,130" fill="currentColor" fillOpacity="0.4" />
          </svg>
        </div>

        {/* Layer 3: Mid Hills, Wind Turbines & Forest Groves (Parallax depth 0.35) */}
        <div
          aria-hidden="true"
          className="absolute bottom-12 inset-x-0 h-80 pointer-events-none will-change-transform"
          style={{
            transform: `translate3d(${midHillsX}px, 0, 0)`
          }}
        >
          <svg
            className="w-[2800px] h-full text-emerald-800/20 dark:text-emerald-500/10 transition-colors"
            viewBox="0 0 2800 320"
            fill="currentColor"
            preserveAspectRatio="none"
          >
            {/* Mid undulating ridge */}
            <path d="M0,190 Q350,130 700,210 T1400,170 T2100,195 T2800,180 L2800,320 L0,320 Z" />

            {/* Spinning Wind Turbine 1 (Make/Ship area) */}
            <g transform="translate(420, 110)">
              <line x1="0" y1="0" x2="0" y2="80" stroke="currentColor" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="4" fill="currentColor" />
              <g className="animate-spin" style={{ transformOrigin: '0px 0px', animationDuration: '8s' }}>
                <line x1="0" y1="0" x2="0" y2="-32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="0" y1="0" x2="28" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="0" y1="0" x2="-28" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </g>
            </g>

            {/* Spinning Wind Turbine 2 */}
            <g transform="translate(1680, 85)">
              <line x1="0" y1="0" x2="0" y2="90" stroke="currentColor" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="4" fill="currentColor" />
              <g className="animate-spin" style={{ transformOrigin: '0px 0px', animationDuration: '10s' }}>
                <line x1="0" y1="0" x2="0" y2="-34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="0" y1="0" x2="30" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="0" y1="0" x2="-30" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </g>
            </g>
          </svg>
        </div>

        {/* Layer 4: Discrete Scene Hand-Drawn Vignettes (4 Scenes along the track) */}
        <div
          aria-hidden="true"
          className="absolute bottom-16 inset-x-0 h-64 pointer-events-none will-change-transform"
          style={{
            transform: `translate3d(${midHillsX * 1.1}px, 0, 0)`
          }}
        >
          <div className="w-[3200px] h-full relative">
            {/* Scene 1: Make (X: 180px) -> Crafting Shed + Bamboo Grove + Solar array */}
            <div className="absolute left-[160px] bottom-4 flex items-end gap-3 text-emerald-800 dark:text-emerald-400">
              <svg className="w-48 h-40" viewBox="0 0 200 160" fill="none">
                {/* Bamboo stalk cluster */}
                <path d="M15,160 L15,40 M28,160 L28,30 M40,160 L40,55" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <path d="M15,70 Q2,65 0,70 M28,60 Q42,52 45,55 M40,90 Q50,85 52,88" stroke="currentColor" strokeWidth="2" />
                {/* Solar Crafting Workshop */}
                <polygon points="65,160 65,100 135,100 135,160" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />
                {/* Rooftop Solar Panels */}
                <polygon points="55,100 100,60 145,100" fill="#047857" fillOpacity="0.3" stroke="currentColor" strokeWidth="2" />
                <line x1="100" y1="60" x2="100" y2="100" stroke="currentColor" strokeWidth="1.5" />
                <line x1="77" y1="80" x2="123" y2="80" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                {/* Thinning steam condensing loop (zero pollution) */}
                <path d="M130,85 Q145,70 140,50 Q135,35 150,25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" className="animate-pulse" />
              </svg>
            </div>

            {/* Scene 2: Ship (X: 960px) -> Electric Delivery Van + Regional Railway */}
            <div className="absolute left-[920px] bottom-6 flex items-end text-teal-800 dark:text-teal-400">
              <svg className="w-56 h-36" viewBox="0 0 240 140" fill="none">
                {/* Overhead Electric Catenary Rail line */}
                <line x1="0" y1="20" x2="240" y2="20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 4" />
                <line x1="60" y1="20" x2="60" y2="70" stroke="currentColor" strokeWidth="1.5" />
                <line x1="180" y1="20" x2="180" y2="70" stroke="currentColor" strokeWidth="1.5" />
                {/* Electric delivery van */}
                <rect x="50" y="65" width="110" height="48" rx="8" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="2.5" />
                <path d="M160,80 L185,80 L195,95 L195,113 L160,113 Z" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="2" />
                <circle cx="85" cy="115" r="12" fill="currentColor" />
                <circle cx="170" cy="115" r="12" fill="currentColor" />
                <circle cx="85" cy="115" r="5" fill="#FAF8F2" />
                <circle cx="170" cy="115" r="5" fill="#FAF8F2" />
                {/* Lightning Bolt Electric Badge */}
                <polygon points="105,75 97,90 106,90 100,105 113,88 104,88" fill="#10B981" />
              </svg>
            </div>

            {/* Scene 3: Use (X: 1720px) -> Minimal Cozy Home Shelf & Durable Dispenser */}
            <div className="absolute left-[1680px] bottom-6 flex items-end text-emerald-900 dark:text-emerald-300">
              <svg className="w-52 h-44" viewBox="0 0 220 180" fill="none">
                {/* Window Frame with gentle sunlight beams */}
                <rect x="20" y="20" width="80" height="90" rx="6" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4" />
                <line x1="60" y1="20" x2="60" y2="110" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
                <line x1="20" y1="65" x2="100" y2="65" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
                {/* Solid Wood Minimal Shelf */}
                <rect x="10" y="140" width="200" height="12" rx="3" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.5" />
                {/* Reusable Aluminum Dispenser Bottle */}
                <rect x="125" y="65" width="38" height="75" rx="6" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="2" />
                <rect x="137" y="50" width="14" height="15" stroke="currentColor" strokeWidth="2" />
                <path d="M132,50 H154" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M125,50 H118 Q115,50 115,55" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                {/* Concentrate refill pouch */}
                <polygon points="65,95 85,95 88,140 62,140" fill="#047857" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="75" cy="118" r="4" fill="#047857" />
              </svg>
            </div>

            {/* Scene 4: Second Life (X: 2480px) -> Garden Soil + Sprouting Sapling in Upcycled Jar */}
            <div className="absolute left-[2440px] bottom-6 flex items-end text-amber-800 dark:text-amber-400">
              <svg className="w-56 h-48" viewBox="0 0 240 190" fill="none">
                {/* Garden planter bed */}
                <path d="M20,160 Q120,150 220,160" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
                {/* Glass upcycled jar turned flowerpot */}
                <rect x="90" y="100" width="60" height="60" rx="8" fill="#10B981" fillOpacity="0.15" stroke="currentColor" strokeWidth="2.5" />
                <rect x="96" y="90" width="48" height="10" rx="3" stroke="currentColor" strokeWidth="2" />
                {/* Rich potting soil inside */}
                <path d="M93,125 Q120,120 147,125 L147,155 L93,155 Z" fill="#78350F" fillOpacity="0.4" />
                {/* Sprouting Sapling Unfurling Green Leaves */}
                <path d="M120,125 L120,70" stroke="#047857" strokeWidth="3" strokeLinecap="round" />
                <path d="M120,85 Q100,75 95,82 Q105,95 120,88" fill="#10B981" stroke="#047857" strokeWidth="1.5" />
                <path d="M120,72 Q140,60 145,68 Q135,82 120,75" fill="#34D399" stroke="#047857" strokeWidth="1.5" />
                {/* Circular Kabadiwala arrows around jar */}
                <path d="M60,115 C55,85 80,60 110,60" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
                <polygon points="112,56 118,63 109,65" fill="#F59E0B" />
              </svg>
            </div>
          </div>
        </div>

        {/* Layer 5: Winding Path across the Ground (Parallax depth 0.6) */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 inset-x-0 h-28 pointer-events-none will-change-transform"
          style={{
            transform: `translate3d(${foregroundX * 0.4}px, 0, 0)`
          }}
        >
          <svg
            className="w-[3000px] h-full text-sand-200 dark:text-emerald-950/80 transition-colors"
            viewBox="0 0 3000 120"
            fill="none"
            preserveAspectRatio="none"
          >
            {/* Base ground fill */}
            <path d="M0,45 Q750,75 1500,40 T3000,50 L3000,120 L0,120 Z" fill="currentColor" fillOpacity="0.6" />
            {/* Cobblestone winding trail */}
            <path
              d="M0,65 Q750,95 1500,60 T3000,70"
              stroke="#047857"
              strokeWidth="4"
              strokeDasharray="8 6"
              strokeDashoffset={pathDashOffset}
              strokeOpacity="0.4"
            />
          </svg>
        </div>

        {/* Layer 6: Foreground Wild Grass & Leaf Silhouettes (Parallax depth 0.9 - Fast) */}
        <div
          aria-hidden="true"
          className="absolute -bottom-2 inset-x-0 h-20 pointer-events-none will-change-transform z-20"
          style={{
            transform: `translate3d(${foregroundX}px, 0, 0)`
          }}
        >
          <svg
            className="w-[3400px] h-full text-emerald-950/20 dark:text-emerald-400/10"
            viewBox="0 0 3400 90"
            fill="currentColor"
            preserveAspectRatio="none"
          >
            <path d="M0,90 L0,45 Q60,15 90,50 Q140,10 180,60 Q260,20 310,70 Q420,10 470,65 Q580,25 630,70 Q740,15 790,65 Q900,20 950,70 Q1060,10 1110,65 Q1220,25 1270,70 Q1380,15 1430,65 Q1540,20 1590,70 Q1700,10 1750,65 Q1860,25 1910,70 Q2020,15 2070,65 Q2180,20 2230,70 Q2340,10 2390,65 Q2500,25 2550,70 Q2660,15 2710,65 Q2820,20 2870,70 Q2980,10 3030,65 Q3140,25 3190,70 Q3300,15 3400,50 L3400,90 Z" />
          </svg>
        </div>

        {/* -------------------------------------------------------------
            Interactive HUD: Stage Progress Rail & Stage Details Overlay
            ------------------------------------------------------------- */}
        <div className="relative z-30 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 pb-4 flex flex-col justify-between h-full pointer-events-none">
          {/* Top Rail: Stage Switcher Tabs (Clickable & Accessible) */}
          <div className="flex items-center justify-between gap-4 pointer-events-auto">
            <div
              role="tablist"
              aria-label="Eco Journey Stages"
              className="flex items-center gap-1.5 p-1 rounded-full bg-surface-raised/90 backdrop-blur-md border border-line shadow-card text-xs font-mono"
            >
              {SCENES.map((s, idx) => {
                const isActive = idx === currentStageIndex;
                const isPassed = idx < currentStageIndex;
                return (
                  <button
                    key={s.id}
                    role="tab"
                    id={`stage-tab-${s.id}`}
                    aria-selected={isActive}
                    aria-controls={`stage-panel-${s.id}`}
                    onClick={() => scrollToStage(idx)}
                    className={`px-3 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                      isActive
                        ? 'bg-primary text-primary-contrast shadow-soft-xs'
                        : isPassed
                        ? 'text-primary hover:bg-surface-accent'
                        : 'text-text-muted hover:text-heading hover:bg-surface'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.accentColor }} />
                    <span>{s.stepNumber}</span>
                    <span className="hidden sm:inline">{s.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Scroll Scrub Percentage Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-raised/90 backdrop-blur-md border border-line shadow-soft-xs text-xs font-mono text-text-muted">
              <span>Scroll Progress:</span>
              <span className="font-bold text-heading">{Math.round(p * 100)}%</span>
            </div>
          </div>

          {/* Bottom Stage Details & Estimate Card */}
          <div
            id={`stage-panel-${currentStage.id}`}
            role="tabpanel"
            aria-labelledby={`stage-tab-${currentStage.id}`}
            className="pointer-events-auto max-w-xl p-5 sm:p-7 rounded-3xl bg-surface-raised/95 backdrop-blur-md border border-line shadow-soft-xl transition-all duration-300 space-y-3.5 mb-2"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-surface-sunken border border-line text-heading">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentStage.accentColor }} />
                <span>Stage {currentStage.stepNumber} • {currentStage.name}</span>
              </div>
              <span className="text-[11px] font-mono text-text-muted">{currentStage.mood}</span>
            </div>

            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-heading">
                {currentStage.title}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-text-secondary leading-relaxed">
                {currentStage.caption}
              </p>
            </div>

            {/* Labeled Estimate Box with Assumptions Popover */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-line/60">
              <div className="flex items-center gap-2">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
                    {currentStage.metricLabel}
                  </div>
                  <div className="text-sm sm:text-base font-mono font-bold" style={{ color: currentStage.accentColor }}>
                    {currentStage.metric}
                  </div>
                </div>

                {/* Assumptions Tooltip Trigger */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setActiveTooltip(activeTooltip === currentStage.id ? null : currentStage.id)}
                    className="p-1 rounded-full text-text-muted hover:text-heading hover:bg-surface-sunken transition-colors cursor-pointer"
                    aria-label={`View assumptions for ${currentStage.name} metric`}
                    title="View LCA Assumptions"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>

                  {activeTooltip === currentStage.id && (
                    <div className="absolute bottom-full left-0 mb-2 w-64 p-3 rounded-2xl bg-surface border border-line shadow-soft-xl text-xs text-text-secondary space-y-1 z-50">
                      <div className="font-mono text-[10px] font-bold text-heading uppercase">
                        Calculation Basis (ISO 14040)
                      </div>
                      <p className="text-[11px] leading-snug">{currentStage.assumptions}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* End of Story Final CTAs (Stage 4) */}
              {currentStageIndex === 3 ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary hover:bg-primary-hover text-primary-contrast text-xs font-mono font-semibold transition-all shadow-soft-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Shop Catalog</span>
                  </Link>
                  <Link
                    to="/tools"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-sunken hover:bg-surface-accent border border-line text-xs font-mono text-heading transition-colors"
                  >
                    <span>Second Life</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => scrollToStage(currentStageIndex + 1)}
                  className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-primary hover:underline cursor-pointer"
                >
                  <span>Next Stage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
