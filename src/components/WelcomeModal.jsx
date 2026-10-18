import React, { useState } from 'react';
import { Leaf, Ban, DollarSign, MapPin, ArrowRight, X, Sparkles, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { playSound } from '../lib/audio';

const GOALS = [
  {
    id: 'reduce-plastic',
    title: 'Eliminate Single-Use Plastic',
    subtitle: 'Zero-waste kitchen, bathroom & personal care essentials',
    icon: Ban,
    color: 'from-amber-500/10 to-emerald-500/10 border-amber-300'
  },
  {
    id: 'save-money',
    title: 'Conscious Savings & Reusables',
    subtitle: 'High ROI lifetime reusables replacing recurring purchases',
    icon: DollarSign,
    color: 'from-emerald-500/10 to-teal-500/10 border-emerald-300'
  },
  {
    id: 'support-local',
    title: 'Support Hyperlocal Artisans',
    subtitle: 'Regional Indian craft clusters under 200 km radius',
    icon: MapPin,
    color: 'from-sky-500/10 to-emerald-500/10 border-sky-300'
  }
];

export default function WelcomeModal() {
  const { welcomeModalOpen, dismissWelcomeModal, showToast } = useCart();
  const [currentStep, setCurrentStep] = useState(0); // 0, 1, 2
  const [selectedGoal, setSelectedGoal] = useState(() => {
    return localStorage.getItem('ecomart_first_run_goal') || 'reduce-plastic';
  });

  if (!welcomeModalOpen) return null;

  const handleFinish = () => {
    localStorage.setItem('ecomart_first_run_goal', selectedGoal);
    playSound('success');
    showToast(`Personalized for goal: ${GOALS.find((g) => g.id === selectedGoal)?.title}`, 'success');
    dismissWelcomeModal();
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
      playSound('click');
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      playSound('click');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl border border-stone-200 shadow-2xl p-6 sm:p-8 overflow-hidden space-y-6 text-stone-900 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            Step {currentStep + 1} of 3: {currentStep === 0 ? 'Welcome' : currentStep === 1 ? 'Choose Your Goal' : 'Ready'}
          </span>

          <button
            type="button"
            onClick={dismissWelcomeModal}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
            aria-label="Skip welcome guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Introduction */}
        {currentStep === 0 && (
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#E8F5EE] border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
              <Leaf className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h2 id="welcome-title" className="text-2xl font-black text-[#0B3B2C] tracking-tight">
                Welcome to EcoMart
              </h2>
              <p className="text-xs font-bold text-emerald-700">
                Sustainable shopping made effortless & transparent
              </p>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
              Every item in our 100% offline catalog is audited with an objective 0–100 Eco-Score formula. We track carbon emissions, plastic packaging, and transportation distance down to the exact gram.
            </p>
          </div>
        )}

        {/* Step 2: Choose Your Primary Goal (Feature 30) */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-black text-[#0B3B2C]">
                What is your main sustainability goal?
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                We will personalize your featured catalog recommendations to match.
              </p>
            </div>

            <div className="space-y-2.5">
              {GOALS.map((goal) => {
                const Icon = goal.icon;
                const isSelected = selectedGoal === goal.id;
                return (
                  <div
                    key={goal.id}
                    onClick={() => {
                      setSelectedGoal(goal.id);
                      playSound('click');
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-emerald-500 bg-[#E8F5EE]/60 shadow-xs ring-2 ring-emerald-500/20'
                        : 'border-stone-200 bg-stone-50 hover:bg-white'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-emerald-700 text-white' : 'bg-white border border-stone-200 text-stone-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs sm:text-sm text-stone-900">
                          {goal.title}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-emerald-700 stroke-[3]" />}
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                        {goal.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Confirmation & Ready */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-xs">
              <Sparkles className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-[#0B3B2C] tracking-tight">
                You're all set to make an impact!
              </h2>
              <p className="text-xs font-bold text-emerald-700">
                Active Goal: {GOALS.find((g) => g.id === selectedGoal)?.title}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-emerald-800">✓ 1-Tap Swaps:</span>
                <span>Get instant cleaner alternatives when adding conventional items.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-emerald-800">✓ 100% Offline:</span>
                <span>Works anytime without an internet connection or external servers.</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((idx) => (
              <span
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  currentStep === idx ? 'w-6 bg-emerald-600' : 'w-2 bg-stone-200'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-50 cursor-pointer min-h-[40px]"
              >
                Back
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-xs transition active:scale-95 cursor-pointer min-h-[40px]"
            >
              <span>{currentStep === 2 ? 'Start Exploring' : 'Continue'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
