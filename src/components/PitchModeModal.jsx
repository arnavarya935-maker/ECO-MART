import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SlidersHorizontal,
  Search,
  Sparkles,
  Layers,
  FileText,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowRight,
  Award,
  CheckCircle2,
  Wand2
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { FEATURES } from '../lib/features.js';

const PITCH_STEPS = [
  {
    step: 1,
    title: 'Multi-Criteria Decision Engine',
    subtitle: 'Autonomous, Transparent AI Ranking',
    icon: SlidersHorizontal,
    badge: 'Phase 1 • AI Core',
    description:
      'Unlike opaque recommendation black boxes, EcoMart empowers judges and shoppers with a live 7-dimension normalized weighted decision engine (Price, Carbon, Plastic, Water, Local km, Certifications, EcoScore). Move the sliders to see cards re-rank live with a "Why this rank?" contribution breakdown.',
    actionLabel: 'Explore Shop & Move Sliders',
    actionRoute: '/shop?showPriorities=1'
  },
  {
    step: 2,
    title: 'Cart Transformer',
    subtitle: 'Ordinary List to Sustainable Cart',
    icon: Wand2,
    badge: 'Competition Star • AI Knapsack',
    description:
      'The star moment of the live demo: paste or speak any ordinary shopping list. The Eco Agent parses items, matches them to catalogue alternatives, executes an exact multi-choice knapsack optimization within the user\'s budget, and displays an auditable Before vs After impact comparison with 1-tap cart checkout.',
    actionLabel: 'Launch Cart Transformer Demo',
    actionRoute: '/transform'
  },
  {
    step: 3,
    title: 'Eco Check Any Product',
    subtitle: 'Paste-a-Product Greenwash Detector',
    icon: Search,
    badge: 'Phase 2 • Real World',
    description:
      'Test any real-world product paste or claim (e.g. "100% eco friendly plastic bottle"). The offline heuristic engine detects greenwashing red flags, scores the item honestly, and maps it to 3 catalog alternatives with estimated CO₂ and plastic deltas.',
    actionLabel: 'Launch Eco Check Analyzer',
    actionRoute: '/eco-check'
  },
  {
    step: 4,
    title: 'Proactive Copilot',
    subtitle: 'Autonomous Reasoning Without Prompting',
    icon: Sparkles,
    badge: 'Phase 3 • Agentic AI',
    description:
      'The Eco Agent does not wait to be asked. It speaks up non-blockingly when conventional items enter the cart or thresholds are crossed, offering 1-tap greener swaps with an expandable "Why am I seeing this?" reasoning breakdown. Rate-limited to max 5/session and respects Judge Mode.',
    actionLabel: 'Trigger Demo Copilot Nudge',
    actionRoute: null,
    isCopilotDemo: true
  },
  {
    step: 5,
    title: 'Product Lifecycle Explorer',
    subtitle: '5-Stage Cradle-to-Grave Analysis',
    icon: Layers,
    badge: 'Phase 4 • Lifecycle',
    description:
      'Inspect every product across 5 physical stages: Material Extraction, Making, Transport, Packaging, and End of Life. Compares directly against conventional alternatives using honest quantitative numbers and labelled qualitative metrics.',
    actionLabel: 'View Bamboo Toothbrush Lifecycle',
    actionRoute: '/product/care-01'
  },
  {
    step: 6,
    title: 'Year-Ahead Projection & Purpose Report',
    subtitle: '12-Month Impact & Shareable Card',
    icon: FileText,
    badge: 'Phase 5 • Purpose Proof',
    description:
      'Calculates annual projected carbon avoidance, plastic diversion, and water conserved based on rebuy frequency. One-click export generates a clean, offline Purpose Report card (PNG + print-to-PDF) using documented EPA/EEA conversion factors.',
    actionLabel: 'Open Impact Proof & Report',
    actionRoute: '/impact'
  }
];

export default function PitchModeModal({ isOpen, onClose }) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const navigate = useNavigate();
  const { triggerCopilotDemo } = useCart();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && currentStepIdx < PITCH_STEPS.length - 1) {
        setCurrentStepIdx((prev) => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentStepIdx > 0) {
        setCurrentStepIdx((prev) => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStepIdx, onClose]);

  if (!isOpen || !FEATURES.PITCH_MODE) return null;

  const currentStep = PITCH_STEPS[currentStepIdx];
  const IconComponent = currentStep.icon;

  const handleAction = () => {
    if (currentStep.isCopilotDemo) {
      if (triggerCopilotDemo) triggerCopilotDemo();
      onClose();
    } else if (currentStep.actionRoute) {
      navigate(currentStep.actionRoute);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/60 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Pitch Mode Tour"
    >
      <div className="relative w-full max-w-2xl bg-surface border border-line rounded-3xl shadow-soft-lg p-6 sm:p-8 space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-line">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-primary text-primary-contrast flex items-center justify-center shadow-soft-xs">
              <Award className="w-4 h-4" />
            </span>
            <div>
              <div className="text-[10px] font-sans font-bold uppercase tracking-wider text-primary">
                Competition Pitch Mode (Press P to Toggle)
              </div>
              <h2 className="text-xl font-serif font-bold text-heading">
                Judge Demo Tour • Step {currentStep.step} of {PITCH_STEPS.length}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-secondary hover:text-heading hover:bg-surface-sunken transition cursor-pointer"
            aria-label="Close pitch mode tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Dots */}
        <div className="flex items-center gap-2 justify-between">
          {PITCH_STEPS.map((s, idx) => (
            <button
              key={s.step}
              type="button"
              onClick={() => setCurrentStepIdx(idx)}
              className={`flex-1 h-2 rounded-full transition-all cursor-pointer ${
                idx === currentStepIdx
                  ? 'bg-primary ring-2 ring-primary/30'
                  : idx < currentStepIdx
                  ? 'bg-primary/50'
                  : 'bg-surface-sunken border border-line'
              }`}
              title={`Step ${s.step}: ${s.title}`}
            />
          ))}
        </div>

        {/* Active Step Content Card */}
        <div className="p-6 rounded-2xl bg-surface-raised border border-line shadow-soft-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-surface-sunken border border-line flex items-center justify-center text-primary shadow-soft-xs">
                <IconComponent className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                  {currentStep.badge}
                </span>
                <h3 className="text-lg font-serif font-bold text-heading mt-1">
                  {currentStep.title}
                </h3>
              </div>
            </div>
          </div>

          <p className="text-sm font-sans text-secondary leading-relaxed">
            {currentStep.description}
          </p>

          <div className="pt-2 flex justify-start">
            <button
              type="button"
              onClick={handleAction}
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast font-sans font-semibold text-xs flex items-center gap-2 shadow-soft-sm transition active:scale-98 cursor-pointer"
            >
              <span>{currentStep.actionLabel}</span>
              <ArrowRight className="w-4 h-4 text-primary-contrast" />
            </button>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => setCurrentStepIdx((prev) => Math.max(0, prev - 1))}
            disabled={currentStepIdx === 0}
            className={`px-4 py-2 rounded-xl border border-line text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              currentStepIdx === 0
                ? 'opacity-40 cursor-not-allowed text-muted'
                : 'text-heading hover:bg-surface-sunken'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="text-xs text-muted font-sans font-medium">
            Use <kbd className="px-1.5 py-0.5 rounded bg-surface-sunken border border-line text-[10px]">←</kbd> and{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-surface-sunken border border-line text-[10px]">→</kbd> to navigate
          </span>

          {currentStepIdx < PITCH_STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStepIdx((prev) => Math.min(PITCH_STEPS.length - 1, prev + 1))}
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast text-xs font-semibold flex items-center gap-1.5 transition shadow-soft-xs cursor-pointer"
            >
              <span>Next Feature</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast text-xs font-semibold flex items-center gap-1.5 transition shadow-soft-xs cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Finish Pitch Tour</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
