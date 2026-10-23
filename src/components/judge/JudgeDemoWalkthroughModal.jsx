import React, { useState } from 'react';
import {
  FileSearch,
  Brain,
  RotateCcw,
  Zap,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';
import ReasoningExplanationCard from '../EcoAgent/ReasoningExplanationCard';
import SecondLifeTab from '../lifecycle/SecondLifeTab';
import AIEnergyMeter from '../EcoAgent/AIEnergyMeter';
import productsData from '../../data/products.json';

const SCRIPTED_STEPS = [
  {
    step: 1,
    id: 'greenwashing',
    title: 'Greenwashing Detective Audit',
    subtitle: 'Auditing Vague Sustainability Claims',
    icon: FileSearch,
    badge: 'Step 1/4 • Integrity Audit',
    summary:
      'AI models must not blindly validate deceptive marketing. The Greenwashing Detective inspects text for unqualified buzzwords (e.g. "100% eco-friendly"), checks for missing independent certifications, and issues an evidence-based Trust Score.',
    highlight: 'Dossier #GW-2026: Vague claim penalized from 100 to 25/100.'
  },
  {
    step: 2,
    id: 'explainability',
    title: 'Explainable AI Decision Trace',
    subtitle: 'Transparent Reasoning & Assumption Checking',
    icon: Brain,
    badge: 'Step 2/4 • Explainability',
    summary:
      'Black-box answers are unacceptable in responsible AI. Every Eco Agent reply provides an expandable reasoning summary, explicit source assumptions (CPCB, FSC standards), confidence rating, and an audited local feedback mechanism to report inaccuracies.',
    highlight: 'Expandable "How did I decide this?" card with verified assumptions.'
  },
  {
    step: 3,
    id: 'secondlife',
    title: 'Circular Second Life Guidance',
    subtitle: 'Cradle-to-Grave Product Trajectory',
    icon: RotateCcw,
    badge: 'Step 3/4 • Circular Economy',
    summary:
      'Responsible shopping requires knowing product end-of-life before checkout. EcoMart maps products across a 3-step circular path (Reuse -> Repair/Recycle -> Dispose Responsibly) with category-specific composting timelines.',
    highlight: '3-step circular visual path comparing 120-day soil composting vs 450-year plastic waste.'
  },
  {
    step: 4,
    id: 'energy',
    title: 'AI Compute Energy Meter',
    subtitle: 'Auditing Digital Carbon Waste',
    icon: Zap,
    badge: 'Step 4/4 • Algorithmic Footprint',
    summary:
      'Running AI inference requires real electricity. EcoMart transparently estimates and displays the Watt-hour (Wh) footprint per response (~0.12 Wh), compares it to physical LED bulb hours, and highlights local caching to prevent unnecessary cloud compute waste.',
    highlight: 'Transparently labeled "AI Compute Estimate: ~0.12 Wh" with zero greenwashing.'
  }
];

export default function JudgeDemoWalkthroughModal({ isOpen, onClose }) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const sampleProduct = productsData.find((p) => p.id === 'pers-01') || productsData[0];

  if (!isOpen) return null;

  const current = SCRIPTED_STEPS[currentStepIdx];
  const Icon = current.icon;

  const handleNext = () => {
    if (currentStepIdx < SCRIPTED_STEPS.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="judge-walkthrough-title"
      className="fixed inset-0 z-modal flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div className="w-full max-w-4xl max-h-[92dvh] rounded-3xl bg-surface border border-line flex flex-col shadow-soft-xl overflow-hidden text-text animate-scale-up">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-surface-raised border-b border-line flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/15 border border-amber-400/30 text-amber-400 flex items-center justify-center shadow-soft-xs">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="judge-walkthrough-title" className="font-sans font-bold text-sm sm:text-base text-heading">
                  Judge Demo Mode: Responsible AI Showcase
                </h2>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-400 text-stone-950 uppercase">
                  CBSE 2026
                </span>
              </div>
              <p className="text-[11px] text-text-muted mt-0.5">
                4-Stage Scripted Walkthrough • 100% Deterministic Cached Fallback
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-text-muted hover:text-heading hover:bg-surface transition-colors cursor-pointer"
            aria-label="Close walkthrough"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Tabs */}
        <div className="grid grid-cols-4 border-b border-line bg-surface-sunken/60 text-xs font-sans">
          {SCRIPTED_STEPS.map((s, idx) => {
            const StepIcon = s.icon;
            const isActive = idx === currentStepIdx;
            const isDone = idx < currentStepIdx;

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentStepIdx(idx)}
                className={`p-3 text-left transition-all border-r border-line last:border-r-0 cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-surface text-heading border-b-2 border-b-primary font-bold'
                    : 'text-text-muted hover:text-heading hover:bg-surface/50'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                    isActive
                      ? 'bg-primary text-primary-contrast'
                      : isDone
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-surface-raised text-text-muted'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <StepIcon className="w-3.5 h-3.5" />}
                </div>
                <div className="truncate hidden sm:block">
                  <div className="text-[11px] font-medium truncate">{s.title}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-surface">
          {/* Step Meta Banner */}
          <div className="p-4 rounded-2xl bg-surface-raised border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-soft-xs">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                  {current.badge}
                </span>
                <h3 className="font-serif font-bold text-base text-heading">
                  {current.title}
                </h3>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  {current.summary}
                </p>
              </div>
            </div>

            <div className="sm:text-right shrink-0">
              <span className="px-2.5 py-1 rounded-xl bg-surface-sunken border border-line text-[11px] font-mono text-emerald-400 font-semibold block sm:inline-block">
                {current.highlight}
              </span>
            </div>
          </div>

          {/* Interactive Live Demonstration for Current Step */}
          <div className="p-4 sm:p-5 rounded-3xl bg-surface-sunken border border-line space-y-4">
            {currentStepIdx === 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-line text-xs font-mono text-text-muted">
                  <span>AUDITED CASE FILE: #GW-2026-DUBIOUS</span>
                  <span className="text-rose-400 font-bold">PENALIZED: TRUST SCORE 25/100</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-surface-raised border border-line font-serif italic text-xs text-text-secondary">
                  &ldquo;100% eco-friendly green bottle made from pure ocean-bound plastic. Chemical-free and zero harm to nature.&rdquo;
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-surface border border-rose-500/25 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase text-rose-400 flex items-center gap-1 font-mono">
                      <AlertTriangle className="w-3 h-3 text-rose-400" />
                      Flagged Vague Buzzwords (2)
                    </span>
                    <ul className="text-xs space-y-1 text-text-secondary pl-4 list-disc">
                      <li><strong>&ldquo;100% eco-friendly&rdquo;</strong>: Absolute claim violating FTC Green Guides without full LCA.</li>
                      <li><strong>&ldquo;zero harm to nature&rdquo;</strong>: Unsubstantiated blanket claim.</li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-2xl bg-surface border border-amber-500/25 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase text-amber-400 flex items-center gap-1 font-mono">
                      <ShieldCheck className="w-3 h-3 text-amber-400" />
                      Missing Independent Proof
                    </span>
                    <ul className="text-xs space-y-1 text-text-secondary pl-4 list-disc">
                      <li>No OceanBound Plastic (OBP) chain-of-custody cert.</li>
                      <li>No lab migration testing for food-grade safety.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {currentStepIdx === 1 && (
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-surface-raised border border-line text-xs leading-relaxed">
                  <span className="text-[10px] font-mono text-primary font-bold uppercase block mb-1">
                    AI Response (Gemini 1.5 Flash + Local Fallback Cache)
                  </span>
                  <p className="text-text">
                    Swapping a petroleum plastic toothbrush for an FSC-certified organic bamboo toothbrush avoids ~80g of plastic per year. Moso bamboo degrades in backyard compost in ~180 days, whereas polypropylene plastic persists for over 450 years shedding microplastics.
                  </p>
                </div>

                {/* Embedded Live Reasoning Explanation Card */}
                <ReasoningExplanationCard
                  reasoningSummary="Evaluated cradle-to-grave raw extraction (Moso bamboo vs petroleum cracking) and backyard compostability standards. Prioritized 100% plastic-free packaging."
                  sourcesOrAssumptions={[
                    'Central Pollution Control Board (CPCB) plastic packaging benchmarks',
                    'FSC Certification Standard for sustainable bamboo harvesting',
                    'Assumes replacement cycle of 1 brush every 3 months'
                  ]}
                  confidence="high"
                  estimatedEnergyWh={0.12}
                  model="Gemini 1.5 Flash"
                  isFallback={false}
                  messageId="judge-demo-msg-1"
                  query="Why swap petroleum plastic for organic bamboo toothbrush?"
                />
              </div>
            )}

            {currentStepIdx === 2 && (
              <div className="space-y-3">
                <SecondLifeTab product={sampleProduct} />
              </div>
            )}

            {currentStepIdx === 3 && (
              <div className="space-y-3">
                <AIEnergyMeter
                  totalSessionWh={0.48}
                  lastQueryWh={0.12}
                  queryCount={4}
                  compact={false}
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 sm:p-5 bg-surface-raised border-t border-line flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStepIdx === 0}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              currentStepIdx === 0
                ? 'opacity-40 cursor-not-allowed text-text-muted'
                : 'bg-surface hover:bg-surface-sunken text-heading border border-line'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="text-xs text-text-muted font-mono">
            {currentStepIdx + 1} of {SCRIPTED_STEPS.length}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast font-bold text-xs flex items-center gap-2 shadow-soft-xs transition-colors cursor-pointer"
          >
            <span>{currentStepIdx === SCRIPTED_STEPS.length - 1 ? 'Finish Showcase' : 'Next Step'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
