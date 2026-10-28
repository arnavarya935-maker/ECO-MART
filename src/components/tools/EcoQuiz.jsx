import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, Share2, ArrowRight, Sparkles, Brain } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { HOUSEHOLD_PROFILES } from '../../lib/personaEngine';

// Foundational Initial Questions
const BASE_QUESTIONS = [
  {
    id: 'q1',
    question: 'How do you carry your groceries and shopping?',
    options: [
      { text: 'Single-use plastic bags from the store counter', points: 0 },
      { text: 'Paper bags provided by the store', points: 15 },
      { text: 'Heavyweight organic cotton / jute tote brought from home', points: 30 }
    ]
  },
  {
    id: 'q2',
    question: 'What kind of toothbrush and dental items do you use?',
    options: [
      { text: 'Plastic handle toothbrush replaced every 3 months', points: 0 },
      { text: 'Electric toothbrush with replaceable plastic heads', points: 15 },
      { text: '100% compostable FSC bamboo toothbrush with plant bristles', points: 30 }
    ]
  }
];

// Advanced Branch (User scored >= 45 on base questions)
const ADVANCED_QUESTIONS = [
  {
    id: 'q3_adv',
    level: 'Advanced',
    question: 'How do you verify environmental claims and third-party certifications on labels?',
    options: [
      { text: 'I trust terms like "100% Eco-Pure" and "Natural" on the packaging front', points: 5 },
      { text: 'I look for basic recycling logos and general sustainability symbols', points: 15 },
      { text: 'I verify license codes on accredited registries (GOTS, FSC, OEKO-TEX)', points: 30 }
    ]
  },
  {
    id: 'q4_adv',
    level: 'Advanced',
    question: 'What is your approach to product lifecycle and end-of-life handling?',
    options: [
      { text: 'Items go into standard municipal trash when worn out', points: 5 },
      { text: 'I place recyclable containers into dry municipal waste bins', points: 15 },
      { text: 'I prioritize repairable modular goods, upcycling, and home composting', points: 30 }
    ]
  }
];

// Foundational Branch (User scored < 45 on base questions)
const FOUNDATIONAL_QUESTIONS = [
  {
    id: 'q3_found',
    level: 'Foundational',
    question: 'How do you keep leftovers and food fresh in the kitchen?',
    options: [
      { text: 'Disposable PVC cling wrap film and foil rolls', points: 0 },
      { text: 'Plastic Tupperware containers', points: 15 },
      { text: 'Washable beeswax wraps and sealed glass containers', points: 30 }
    ]
  },
  {
    id: 'q4_found',
    level: 'Foundational',
    question: 'When buying personal care products (shampoo, soap, face wash):',
    options: [
      { text: 'Liquid formulas in single-use plastic bottles with pumps', points: 0 },
      { text: 'Refillable large jugs', points: 15 },
      { text: 'Solid cold-pressed bars in zero-waste compostable paper packaging', points: 30 }
    ]
  }
];

export default function EcoQuiz() {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [completed, setCompleted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Compute adaptive question list dynamically
  const initialPoints = (selectedAnswers[0] || 0) + (selectedAnswers[1] || 0);
  const isAdvancedBranch = initialPoints >= 45;

  const activeQuestions = [
    ...BASE_QUESTIONS,
    ...(isAdvancedBranch ? ADVANCED_QUESTIONS : FOUNDATIONAL_QUESTIONS)
  ];

  const handleSelectOption = (points) => {
    const updated = { ...selectedAnswers, [currentQIndex]: points };
    setSelectedAnswers(updated);

    if (currentQIndex < activeQuestions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      setCompleted(true);
    }
  };

  const totalScore = Object.values(selectedAnswers).reduce((a, b) => a + b, 0);
  const maxScore = activeQuestions.length * 30;
  const scorePercent = Math.round((totalScore / maxScore) * 100);

  let tier = {
    title: 'Conscious Earth Guardian',
    badge: 'Master of Circular Living',
    desc: 'Outstanding! Your daily routine eliminates single-use plastics and prioritizes biological replenishment.',
    color: 'text-primary bg-primary/10 border-primary/30'
  };

  if (scorePercent < 45) {
    tier = {
      title: 'Curious Starter',
      badge: 'Great Swap Potential',
      desc: 'You have tremendous opportunity to save up to 40kg of plastic and 150kg of CO₂ yearly with simple swaps!',
      color: 'text-warning bg-warning/10 border-warning/30'
    };
  } else if (scorePercent < 80) {
    tier = {
      title: 'Mindful Improver',
      badge: 'Solid Eco Habits',
      desc: 'You have solid sustainable fundamentals! Swapping a couple remaining kitchen and bath items will reach circular zero-waste.',
      color: 'text-accent bg-accent/10 border-accent/30'
    };
  }

  const navigate = useNavigate();
  const { updateUserPriorities } = useCart();

  const personaProfile = scorePercent >= 80
    ? HOUSEHOLD_PROFILES.minimalist
    : scorePercent >= 45
    ? HOUSEHOLD_PROFILES.family
    : HOUSEHOLD_PROFILES.student;

  const handleApplyPersonaToShop = () => {
    updateUserPriorities(personaProfile.weights, personaProfile.id);
    navigate('/shop');
  };

  const handleShare = () => {
    const shareText = `I scored ${scorePercent}% on the EcoMart Sustainability Quiz (${isAdvancedBranch ? 'Advanced' : 'Standard'} Adaptive Track)! Level: ${tier.title}. Audit your habits at EcoMart!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleReset = () => {
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setCompleted(false);
  };

  const currentQuestion = activeQuestions[currentQIndex];

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-line shadow-soft-sm max-w-2xl mx-auto text-left">
      {!completed ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-line pb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full font-mono">
                Question {currentQIndex + 1} of {activeQuestions.length}
              </span>
              {currentQIndex >= 2 && (
                <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                  isAdvancedBranch
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30'
                }`}>
                  Adaptive Track: {isAdvancedBranch ? 'Advanced LCA' : 'Practical Essentials'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted font-medium">
              <span>Progress:</span>
              <div className="w-20 h-2 bg-surface-sunken border border-line rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${((currentQIndex) / activeQuestions.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <h3 className="text-lg sm:text-xl font-serif font-bold text-heading leading-snug">
            {currentQuestion.question}
          </h3>

          <div className="space-y-3">
            {currentQuestion.options.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(opt.points)}
                className="w-full p-4 rounded-2xl bg-surface-sunken hover:bg-primary/5 border border-line hover:border-primary/40 text-left transition flex items-center justify-between group cursor-pointer min-h-[44px]"
              >
                <span className="text-xs sm:text-sm font-medium text-text group-hover:text-primary">
                  {opt.text}
                </span>
                <ArrowRight className="w-4 h-4 text-muted group-hover:text-primary shrink-0 ml-2" />
              </button>
            ))}
          </div>

          {currentQIndex >= 2 && (
            <div className="text-[11px] text-muted flex items-center gap-1.5 pt-1">
              <Brain className="w-3.5 h-3.5 text-primary" />
              <span>Adaptive engine adjusted questions based on your earlier sustainability responses.</span>
            </div>
          )}
        </div>
      ) : (
        /* Result Tier Card */
        <div className="space-y-6 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 mx-auto flex items-center justify-center text-4xl shadow-soft-xs">
            🏆
          </div>

          <div>
            <div className={`inline-block px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 border ${tier.color}`}>
              {tier.badge}
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-heading">
              Your Eco Score: {scorePercent}%
            </h3>
            <p className="text-xs sm:text-sm text-secondary max-w-md mx-auto mt-2 leading-relaxed">
              {tier.desc}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-surface-sunken border border-line text-xs text-secondary text-left space-y-1.5">
            <div className="flex items-center justify-between">
              <div>
                🌱 <strong>Matched Persona:</strong> {personaProfile.icon} <strong className="text-heading">{personaProfile.label}</strong>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-line text-primary font-bold">
                {isAdvancedBranch ? 'Advanced LCA Track' : 'Essential Habit Track'}
              </span>
            </div>
            <p className="text-[11px] text-muted">{personaProfile.description}</p>
          </div>

          {/* Action Row */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleApplyPersonaToShop}
              className="w-full py-3 px-6 rounded-2xl bg-primary hover:bg-primary-hover text-primary-contrast font-bold text-xs flex items-center justify-center gap-2 shadow-soft-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Personalize Catalog for My Persona ({personaProfile.label})</span>
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleShare}
                className="flex-1 py-2.5 rounded-xl border border-line bg-surface hover:bg-surface-sunken text-xs font-semibold text-heading transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-primary" />
                <span>{copied ? 'Copied to Clipboard!' : 'Share Score'}</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="py-2.5 px-4 rounded-xl border border-line bg-surface hover:bg-surface-sunken text-xs font-semibold text-secondary transition flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
