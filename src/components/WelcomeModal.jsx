import React, { useState } from 'react';
import { Leaf, Ban, DollarSign, MapPin, ArrowRight, Sparkles, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { playSound } from '../lib/audio';
import { Modal } from './ui/Modal';

const GOALS = [
  {
    id: 'reduce-plastic',
    title: 'Eliminate Single-Use Plastic',
    subtitle: 'Zero-waste kitchen, bathroom & personal care essentials',
    icon: Ban,
    color: 'from-warning/10 to-primary/10 border-warning/30'
  },
  {
    id: 'save-money',
    title: 'Conscious Savings & Reusables',
    subtitle: 'High ROI lifetime reusables replacing recurring purchases',
    icon: DollarSign,
    color: 'from-primary/10 to-accent/10 border-primary/30'
  },
  {
    id: 'support-local',
    title: 'Support Hyperlocal Artisans',
    subtitle: 'Regional Indian craft clusters under 200 km radius',
    icon: MapPin,
    color: 'from-info/10 to-primary/10 border-info/30'
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
    <Modal
      isOpen={welcomeModalOpen}
      onClose={dismissWelcomeModal}
      title={`Step ${currentStep + 1} of 3: ${currentStep === 0 ? 'Welcome' : currentStep === 1 ? 'Choose Your Goal' : 'Ready'}`}
      maxWidth="max-w-lg"
    >
      <div className="space-y-6 text-text">
        {/* Step 1: Introduction */}
        {currentStep === 0 && (
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-soft-xs">
              <Leaf className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-serif font-bold text-heading tracking-tight">
                Welcome to Eco Sense
              </h3>
              <p className="text-xs font-semibold text-primary">
                Sustainable shopping made effortless & transparent
              </p>
            </div>

            <p className="text-xs sm:text-sm text-muted leading-relaxed font-normal">
              EcoScore is a simple 0-100 score from our own rules: material (30), packaging (20), carbon estimate (25), certifications listed by the seller (15), travel distance (10). The numbers are sample estimates, not lab measurements.
            </p>
          </div>
        )}

        {/* Step 2: Choose Your Primary Goal (Feature 30) */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-serif font-bold text-heading">
                What is your main sustainability goal?
              </h3>
              <p className="text-xs text-muted mt-1">
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
                        ? 'border-primary bg-primary/10 shadow-soft-xs ring-2 ring-primary/20'
                        : 'border-line bg-surface-sunken/40 hover:bg-surface'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-primary text-primary-contrast' : 'bg-surface border border-line text-muted'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-xs sm:text-sm text-heading">
                          {goal.title}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-primary stroke-[3]" />}
                      </div>
                      <p className="text-[11px] text-muted mt-0.5 leading-snug">
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
            <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent shadow-soft-xs">
              <Sparkles className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-serif font-bold text-heading tracking-tight">
                You're all set to make an impact!
              </h3>
              <p className="text-xs font-semibold text-primary">
                Active Goal: {GOALS.find((g) => g.id === selectedGoal)?.title}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-surface-sunken border border-line text-xs text-secondary space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-primary">✓ 1-Tap Swaps:</span>
                <span>Get instant cleaner alternatives when adding conventional items.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-primary">✓ Local-First:</span>
                <span>Core catalog and scoring work locally with optional live features.</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-line">
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((idx) => (
              <span
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  currentStep === idx ? 'w-6 bg-primary' : 'w-2 bg-line'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2.5 rounded-xl border border-line bg-surface text-xs font-semibold text-secondary hover:bg-surface-sunken cursor-pointer min-h-[44px] transition-colors focus-visible:outline-2 focus-visible:outline-focus"
              >
                Back
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast font-bold text-xs shadow-soft-sm hover:shadow-soft-md transition-all active:scale-[0.99] cursor-pointer min-h-[44px] focus-visible:outline-2 focus-visible:outline-focus"
            >
              <span>{currentStep === 2 ? 'Start Exploring' : 'Continue'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
