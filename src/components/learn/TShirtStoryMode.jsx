import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Info,
  Droplets,
  Wind,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';

const STAGES = [
  {
    id: 1,
    title: 'Seed & Rain-Fed Organic Cotton',
    location: 'Wardha, Maharashtra',
    subtitle: 'Zero synthetic neurotoxic pesticides, 91% rain-fed agriculture',
    waterUsed: '240 Litres',
    waterConventional: '2,700 Litres',
    co2Emitted: '0.4 kg CO₂e',
    co2Conventional: '1.8 kg CO₂e',
    chemicals: '0g toxic pesticides',
    chemicalsConventional: '150g synthetic agrochemicals',
    description:
      'Grown alongside companion marigolds and pigeon peas that naturally deter bollworms. Deep root systems preserve topsoil nitrogen and rely on seasonal monsoon rainfall without groundwater depletion.',
    svgType: 'farm'
  },
  {
    id: 2,
    title: 'Solar Ginning & Plant-Based Dyeing',
    location: 'Erode, Tamil Nadu',
    subtitle: 'Closed-loop natural plant extracts with 98% water reclamation',
    waterUsed: '60 Litres',
    waterConventional: '600 Litres',
    co2Emitted: '0.6 kg CO₂e',
    co2Conventional: '1.4 kg CO₂e',
    chemicals: 'Zero heavy metals / GOTS certified',
    chemicalsConventional: 'Azo dyes, chlorine bleach & formaldehyde',
    description:
      'Raw cotton fibers are separated using rooftop solar power. Dyed using wild-harvested madder root and indigo. The effluent water undergoes biological reed-bed filtration and is reused for non-potable agricultural irrigation.',
    svgType: 'dye'
  },
  {
    id: 3,
    title: 'Fair Atelier Tailoring',
    location: 'Tiruppur, Tamil Nadu',
    subtitle: 'Worker-owned craft cooperative paying verified living wages',
    waterUsed: '5 Litres',
    waterConventional: '20 Litres',
    co2Emitted: '0.3 kg CO₂e',
    co2Conventional: '0.9 kg CO₂e',
    chemicals: 'Zero synthetic sizing chemicals',
    chemicalsConventional: 'Chemical softeners & microplastic threads',
    description:
      'Every seam is assembled using 100% organic cotton thread, eliminating polyester microplastic shedding. Artisans work in naturally ventilated daylit facilities with healthcare and statutory pensions.',
    svgType: 'tailor'
  },
  {
    id: 4,
    title: 'Mindful Wear & Cold Line-Drying',
    location: 'Your Conscious Household',
    subtitle: 'Washed cold at 30°C and sun-dried on a natural jute clothesline',
    waterUsed: '150 Litres (over 50 washes)',
    waterConventional: '900 Litres (hot tumble-dried)',
    co2Emitted: '0.5 kg CO₂e',
    co2Conventional: '2.4 kg CO₂e (electric dryer grid emissions)',
    chemicals: 'Zero synthetic detergent phosphates',
    chemicalsConventional: 'Microplastic shedding in machine effluent',
    description:
      'Over 60% of an apparel item’s lifecycle energy occurs in user laundering. Washing with ambient water and natural line drying quadruples fiber tensile longevity and eliminates dryer electricity.',
    svgType: 'care'
  },
  {
    id: 5,
    title: 'Second Life: Composting to Living Soil',
    location: 'Community Garden / Upcycling Atelier',
    subtitle: '100% biodegradable return to humus soil within 180 days',
    waterUsed: '0 Litres',
    waterConventional: 'Leaches methane in landfill',
    co2Emitted: '-0.3 kg Net Sequestration',
    co2Conventional: '+1.2 kg CO₂e (anaerobic landfill methane)',
    chemicals: 'Returns organic carbon to earth',
    chemicalsConventional: 'Synthetic elastane fibers persist for 200+ years',
    description:
      'At end-of-life, the untreated organic garment is either shredded into insulation felt or placed in household compost. Within 180 days, earthworms and soil bacteria convert it back to organic plant food.',
    svgType: 'compost'
  }
];

export default function TShirtStoryMode() {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const stage = STAGES[activeStageIndex];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStageIndex((prev) => (prev + 1) % STAGES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const renderArtwork = (type) => {
    switch (type) {
      case 'farm':
        return (
          <svg viewBox="0 0 600 320" className="w-full h-full" aria-hidden="true">
            <defs>
              <linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E0F2FE" />
                <stop offset="100%" stopColor="#FAF8F2" />
              </linearGradient>
              <linearGradient id="soil1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D97706" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#78350F" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            <rect width="600" height="320" fill="url(#sky1)" />
            {/* Sun */}
            <circle cx="500" cy="70" r="45" fill="#FDE68A" opacity="0.8" />
            <circle cx="500" cy="70" r="60" fill="#FEF3C7" opacity="0.4" />
            {/* Distant Hills */}
            <path d="M 0 190 Q 150 140 320 180 T 600 170 L 600 320 L 0 320 Z" fill="#BBF7D0" opacity="0.6" />
            {/* Soil Ground */}
            <path d="M 0 220 Q 200 200 400 215 T 600 210 L 600 320 L 0 320 Z" fill="url(#soil1)" />
            {/* Raindrops */}
            <g stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" opacity="0.7">
              <line x1="80" y1="60" x2="70" y2="90" />
              <line x1="120" y1="75" x2="110" y2="105" />
              <line x1="160" y1="65" x2="150" y2="95" />
              <line x1="200" y1="80" x2="190" y2="110" />
            </g>
            {/* Cotton Plant Stalks */}
            <g stroke="#15803D" strokeWidth="4" strokeLinecap="round">
              <path d="M 300 250 Q 295 190 300 130" />
              <path d="M 298 180 Q 260 160 250 140" />
              <path d="M 300 160 Q 340 140 355 125" />
            </g>
            {/* Leaves */}
            <ellipse cx="255" cy="150" rx="14" ry="8" fill="#22C55E" transform="rotate(-25 255 150)" />
            <ellipse cx="345" cy="135" rx="14" ry="8" fill="#22C55E" transform="rotate(25 345 135)" />
            {/* Fluffy Cotton Bolls */}
            <g fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5">
              <circle cx="290" cy="118" r="16" />
              <circle cx="310" cy="118" r="16" />
              <circle cx="300" cy="105" r="18" />
              <circle cx="300" cy="125" r="14" />
            </g>
            {/* Sepal Calyx */}
            <path d="M 290 128 Q 300 136 310 128 Q 300 142 290 128" fill="#854D0E" />
          </svg>
        );
      case 'dye':
        return (
          <svg viewBox="0 0 600 320" className="w-full h-full" aria-hidden="true">
            <defs>
              <linearGradient id="dyeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1E3A8A" />
                <stop offset="100%" stopColor="#1E1B4B" />
              </linearGradient>
            </defs>
            <rect width="600" height="320" fill="#FAF8F2" />
            {/* Wooden Atelier Floor */}
            <rect y="250" width="600" height="70" fill="#E2E8F0" opacity="0.6" />
            {/* Dye Vat */}
            <ellipse cx="300" cy="240" rx="110" ry="35" fill="#334155" />
            <rect x="190" y="160" width="220" height="80" fill="#475569" rx="12" />
            <ellipse cx="300" cy="160" rx="110" ry="30" fill="url(#dyeGrad)" />
            {/* Ripples in Vat */}
            <ellipse cx="300" cy="160" rx="65" ry="16" fill="none" stroke="#60A5FA" strokeWidth="2" opacity="0.6" />
            {/* Organic Cotton Fabric dipping */}
            <path d="M 270 40 C 270 120 280 140 285 175 C 315 175 320 140 330 40 Z" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2" />
            <path d="M 285 140 C 285 160 315 160 315 140 Z" fill="#2563EB" opacity="0.8" />
            {/* Solar Panel Badge on Wall */}
            <rect x="440" y="40" width="100" height="60" rx="8" fill="#0284C7" stroke="#0369A1" strokeWidth="2" />
            <line x1="440" y1="70" x2="540" y2="70" stroke="#E0F2FE" strokeWidth="1.5" />
            <line x1="490" y1="40" x2="490" y2="100" stroke="#E0F2FE" strokeWidth="1.5" />
            <text x="490" y="118" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#0284C7" fontWeight="bold">SOLAR GINNED</text>
          </svg>
        );
      case 'tailor':
        return (
          <svg viewBox="0 0 600 320" className="w-full h-full" aria-hidden="true">
            <rect width="600" height="320" fill="#F8FAFC" />
            {/* Table Surface */}
            <rect y="210" width="600" height="110" fill="#E2E8F0" />
            {/* T-Shirt Pattern Cut Piece */}
            <path
              d="M 230 110 L 270 130 C 285 125 315 125 330 130 L 370 110 L 410 160 L 370 180 L 370 270 L 230 270 L 230 180 L 190 160 Z"
              fill="#ECFDF5"
              stroke="#059669"
              strokeWidth="2.5"
              strokeDasharray="6 4"
            />
            {/* Tailor Shears */}
            <g transform="translate(130, 190) rotate(-35)">
              <circle cx="20" cy="15" r="10" fill="none" stroke="#D97706" strokeWidth="3" />
              <circle cx="20" cy="35" r="10" fill="none" stroke="#D97706" strokeWidth="3" />
              <path d="M 30 20 L 80 10" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
              <path d="M 30 30 L 80 40" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
              <circle cx="45" cy="25" r="3" fill="#D97706" />
            </g>
            {/* Living Wage Seal Badge */}
            <circle cx="480" cy="100" r="38" fill="#ECFDF5" stroke="#10B981" strokeWidth="3" />
            <text x="480" y="96" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#065F46">LIVING</text>
            <text x="480" y="112" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#065F46">WAGE</text>
          </svg>
        );
      case 'care':
        return (
          <svg viewBox="0 0 600 320" className="w-full h-full" aria-hidden="true">
            <rect width="600" height="320" fill="#FAF8F2" />
            {/* Sun & Blue Sky Arc */}
            <circle cx="100" cy="60" r="40" fill="#FDE68A" opacity="0.6" />
            {/* Natural Jute Clothesline */}
            <path d="M 0 110 Q 300 160 600 110" fill="none" stroke="#D97706" strokeWidth="3" strokeDasharray="5 3" />
            {/* Hanging Organic T-Shirt */}
            <g transform="translate(225, 90)">
              {/* Clothespins */}
              <rect x="42" y="18" width="6" height="14" fill="#B45309" rx="2" />
              <rect x="102" y="18" width="6" height="14" fill="#B45309" rx="2" />
              {/* Finished Organic T-Shirt in Breezy Curve */}
              <path
                d="M 20 40 L 50 25 C 65 35 85 35 100 25 L 130 40 L 145 75 L 125 85 L 120 160 L 30 160 L 25 85 L 5 75 Z"
                fill="#F0FDF4"
                stroke="#15803D"
                strokeWidth="2"
              />
              <path d="M 60 80 Q 75 95 90 80" stroke="#86EFAC" strokeWidth="2" fill="none" />
            </g>
            {/* Gentle Wind Swirls */}
            <path d="M 80 180 Q 140 165 200 180" stroke="#93C5FD" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 400 200 Q 460 185 520 200" stroke="#93C5FD" strokeWidth="2" fill="none" strokeLinecap="round" />
            <text x="300" y="290" textAnchor="middle" fontSize="12" fill="#047857" fontWeight="bold">
              Cold Ambient Wash · Sun-Dried · Zero Dryer Energy
            </text>
          </svg>
        );
      case 'compost':
        return (
          <svg viewBox="0 0 600 320" className="w-full h-full" aria-hidden="true">
            <defs>
              <linearGradient id="humus" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#78350F" />
                <stop offset="100%" stopColor="#451A03" />
              </linearGradient>
            </defs>
            <rect width="600" height="320" fill="#FEFCE8" />
            {/* Compost Bed */}
            <rect y="170" width="600" height="150" fill="url(#humus)" />
            {/* Biodegraded cotton fibers blending into soil */}
            <path d="M 180 230 Q 240 250 290 220" stroke="#FDE68A" strokeWidth="3" strokeDasharray="4 6" fill="none" />
            <path d="M 310 240 Q 370 230 420 260" stroke="#FDE68A" strokeWidth="3" strokeDasharray="4 6" fill="none" />
            {/* New Sapling Sprouting from the Decomposed Fiber Soil */}
            <g stroke="#15803D" strokeWidth="4" strokeLinecap="round">
              <path d="M 300 210 Q 300 150 295 100" />
            </g>
            {/* Fresh Leaves */}
            <ellipse cx="275" cy="110" rx="20" ry="10" fill="#22C55E" transform="rotate(-30 275 110)" />
            <ellipse cx="320" cy="95" rx="22" ry="11" fill="#16A34A" transform="rotate(25 320 95)" />
            <circle cx="295" cy="80" r="5" fill="#86EFAC" />
            <text x="300" y="295" textAnchor="middle" fontSize="12" fill="#FEF3C7" fontWeight="bold">
              100% Organic Fiber Returns as Soil Humus · Cradle to Cradle
            </text>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-surface-raised rounded-3xl border border-line shadow-soft-sm overflow-hidden text-left">
      {/* Top Header */}
      <div className="p-6 sm:p-8 border-b border-line bg-surface flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
              Interactive Story Mode
            </span>
            <span className="text-xs text-muted font-medium">
              Stage {activeStageIndex + 1} of {STAGES.length}
            </span>
          </div>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-heading mt-1.5 tracking-tight">
            The Life of a Conscious Organic T-Shirt
          </h2>
          <p className="text-xs sm:text-sm text-secondary mt-0.5 max-w-xl">
            Walk the circular journey of an organic cotton garment vs its conventional fast-fashion petrochemical twin.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3.5 py-2 rounded-xl bg-primary text-primary-contrast hover:bg-primary-hover text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-soft-xs cursor-pointer min-h-[40px]"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Pause Story' : 'Autoplay Story'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setActiveStageIndex(0);
            }}
            className="p-2 rounded-xl bg-surface-sunken hover:bg-surface border border-line text-secondary hover:text-heading transition-colors cursor-pointer"
            title="Reset to beginning"
            aria-label="Reset to beginning"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowExplanation(!showExplanation)}
            className="p-2 rounded-xl bg-surface-sunken hover:bg-surface border border-line text-secondary hover:text-heading transition-colors cursor-pointer"
            title="How metrics are calculated"
            aria-label="How metrics are calculated"
          >
            <Info className="w-4 h-4 text-primary" />
          </button>
        </div>
      </div>

      {/* Visual Canvas */}
      <div className="relative aspect-16/9 max-h-[360px] w-full border-b border-line bg-surface-sunken overflow-hidden">
        {renderArtwork(stage.svgType)}

        {/* Location Stamp */}
        <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-line text-[11px] font-mono text-heading shadow-soft-xs flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Stage {activeStageIndex + 1}: {stage.location}</span>
        </div>
      </div>

      {/* Stage Scrubber Tabs */}
      <div className="p-3 bg-surface border-b border-line overflow-x-auto flex items-center gap-2">
        {STAGES.map((s, idx) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setActiveStageIndex(idx);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-sans transition-all whitespace-nowrap cursor-pointer text-left flex items-center gap-1.5 ${
              activeStageIndex === idx
                ? 'bg-primary text-primary-contrast font-bold shadow-soft-xs'
                : 'bg-surface-sunken text-secondary border border-line hover:text-heading'
            }`}
          >
            <span className="font-mono text-[10px] opacity-75">{idx + 1}.</span>
            <span>{s.title.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Active Stage Details & Impact Ledger */}
      <div className="p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase text-primary tracking-wider">
            Lifecycle Milestone {activeStageIndex + 1}
          </span>
          <h3 className="font-serif font-bold text-xl sm:text-2xl text-heading mt-0.5">
            {stage.title}
          </h3>
          <p className="text-xs sm:text-sm text-secondary font-medium mt-0.5">
            {stage.subtitle}
          </p>
          <p className="text-xs text-secondary leading-relaxed mt-2 font-normal">
            {stage.description}
          </p>
        </div>

        {/* 3-Pillar Scientific Delta Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-surface border border-line space-y-1 text-left">
            <div className="flex items-center gap-1.5 text-xs text-primary font-bold">
              <Droplets className="w-4 h-4 text-primary" />
              <span>Water Consumption</span>
            </div>
            <div className="text-base font-serif font-bold text-heading">
              {stage.waterUsed}
            </div>
            <div className="text-[10px] text-muted line-through">
              Conventional: {stage.waterConventional}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface border border-line space-y-1 text-left">
            <div className="flex items-center gap-1.5 text-xs text-primary font-bold">
              <Wind className="w-4 h-4 text-primary" />
              <span>Greenhouse Emissions</span>
            </div>
            <div className="text-base font-serif font-bold text-heading">
              {stage.co2Emitted}
            </div>
            <div className="text-[10px] text-muted line-through">
              Conventional: {stage.co2Conventional}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface border border-line space-y-1 text-left">
            <div className="flex items-center gap-1.5 text-xs text-primary font-bold">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Chemical Load</span>
            </div>
            <div className="text-base font-serif font-bold text-heading">
              {stage.chemicals}
            </div>
            <div className="text-[10px] text-muted line-through">
              Conventional: {stage.chemicalsConventional}
            </div>
          </div>
        </div>

        {/* Navigation Step Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-line">
          <button
            type="button"
            disabled={activeStageIndex === 0}
            onClick={() => setActiveStageIndex((prev) => Math.max(0, prev - 1))}
            className="px-4 py-2 rounded-xl bg-surface-sunken hover:bg-surface border border-line text-xs font-semibold text-heading disabled:opacity-40 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous Stage</span>
          </button>

          <span className="text-[11px] font-mono text-muted">
            Stage {activeStageIndex + 1} of {STAGES.length}
          </span>

          <button
            type="button"
            disabled={activeStageIndex === STAGES.length - 1}
            onClick={() => setActiveStageIndex((prev) => Math.min(STAGES.length - 1, prev + 1))}
            className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast text-xs font-semibold disabled:opacity-40 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-soft-xs"
          >
            <span>Next Stage</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* How It Works Explainer Drawer */}
      {showExplanation && (
        <div className="p-6 bg-surface-sunken border-t border-line text-xs text-secondary space-y-2 text-left">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-sm text-heading">
              How are these cradle-to-grave numbers estimated?
            </h4>
            <span className="text-[10px] font-mono text-muted">
              ISO 14040 Life Cycle Assessment Methodology
            </span>
          </div>
          <p className="leading-relaxed">
            Data values reflect benchmark averages from the Textile Exchange Organic Cotton Life Cycle Assessment (2023) and peer-reviewed European Commission Joint Research Centre apparel footprint studies. Conventional comparative baselines assume virgin synthetic fertilizer, open-loop synthetic dyeing, electric coal-grid dryer laundering, and municipal landfill disposal.
          </p>
        </div>
      )}
    </div>
  );
}
