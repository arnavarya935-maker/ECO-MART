import React, { useState } from 'react';
import { Sparkles, Leaf, ShieldCheck, ArrowRight, ArrowLeft, X, Layers, Users, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';

const TOUR_STEPS = [
  {
    step: 1,
    title: 'Don’t Just Shop. Shop with Purpose.',
    subtitle: 'Transparent 0-100 Eco-Score Engine',
    desc: 'Every item in our catalog undergoes rigorous lifecycle auditing. We track carbon footprint, freshwater consumption, plastic packaging, and transportation distance down to the exact gram.',
    icon: Leaf,
    badge: 'Step 1 of 4: The Eco-Score'
  },
  {
    step: 2,
    title: 'Proactive Cart Swap Assistant',
    subtitle: '1-Tap Cleaner Product Upgrades',
    desc: 'When you add conventional petrochemical items to your cart, our built-in Eco Agent suggests cleaner, biodegradable alternatives—showing exact grams of plastic diverted and kilograms of CO₂ avoided.',
    icon: RefreshCw,
    badge: 'Step 2 of 4: Live Swap Intelligence'
  },
  {
    step: 3,
    title: '100% Offline & High Performance',
    subtitle: 'PWA Offline Cache & School Laptop Mode',
    desc: 'EcoMart works completely offline. All fonts, 3D visualizers, textures, and calculations are local. Use the "Reduce Effects" toggle anytime for ultra-fast low-spec school laptop performance.',
    icon: ShieldCheck,
    badge: 'Step 3 of 4: Resilient Technology'
  },
  {
    step: 4,
    title: 'Interactive Tools & Community',
    subtitle: 'Track Goals, Badges & Plant-a-Tree',
    desc: 'Explore the carbon footprint calculator, sign the pledge wall, take the eco quiz, and watch your virtual grove grow with every conscious order. Ready to shop with purpose?',
    icon: Users,
    badge: 'Step 4 of 4: Community & Tools'
  }
];

export default function WelcomeModal() {
  const { welcomeModalOpen, dismissWelcomeModal } = useCart();
  const [currentStep, setCurrentStep] = useState(0);

  if (!welcomeModalOpen) return null;

  const stepData = TOUR_STEPS[currentStep];
  const Icon = stepData.icon;

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      dismissWelcomeModal();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl p-6 sm:p-8 overflow-hidden space-y-6">
        {/* Glow accent */}
        <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
          <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
            {stepData.badge}
          </span>

          <button
            type="button"
            onClick={dismissWelcomeModal}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            aria-label="Skip tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shadow-xs">
            <Icon className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100">
              {stepData.title}
            </h2>
            <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
              {stepData.subtitle}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
            {stepData.desc}
          </p>
        </div>

        {/* Step Dots & Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((_, idx) => (
              <span
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  currentStep === idx ? 'w-6 bg-emerald-600' : 'w-2 bg-stone-300 dark:bg-stone-700'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-100 cursor-pointer"
              >
                Back
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition active:scale-95 cursor-pointer"
            >
              <span>{currentStep === TOUR_STEPS.length - 1 ? 'Get Started' : 'Next'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
