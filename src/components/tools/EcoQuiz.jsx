import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, Share2, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { HOUSEHOLD_PROFILES } from '../../lib/personaEngine';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'How do you carry your groceries and shopping?',
    options: [
      { text: 'Single-use plastic bags from the store counter', points: 0 },
      { text: 'Paper bags provided by the store', points: 15 },
      { text: 'Heavyweight organic cotton / jute tote brought from home', points: 30 }
    ]
  },
  {
    id: 2,
    question: 'What kind of toothbrush and dental items do you use?',
    options: [
      { text: 'Plastic handle toothbrush replaced every 3 months', points: 0 },
      { text: 'Electric toothbrush with replaceable plastic heads', points: 15 },
      { text: '100% compostable FSC bamboo toothbrush with plant bristles', points: 30 }
    ]
  },
  {
    id: 3,
    question: 'How do you keep leftovers and food fresh in the kitchen?',
    options: [
      { text: 'Disposable PVC cling wrap film and foil rolls', points: 0 },
      { text: 'Plastic Tupperware containers', points: 15 },
      { text: 'Washable beeswax wraps and sealed glass containers', points: 30 }
    ]
  },
  {
    id: 4,
    question: 'When buying personal care products (shampoo, soap, face wash):',
    options: [
      { text: 'Liquid formulas in single-use plastic bottles with pumps', points: 0 },
      { text: 'Refillable large jugs', points: 15 },
      { text: 'Solid cold-pressed bars in zero-waste compostable paper packaging', points: 30 }
    ]
  }
];

export default function EcoQuiz() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [completed, setCompleted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSelectOption = (points) => {
    const updated = { ...selectedAnswers, [currentQ]: points };
    setSelectedAnswers(updated);

    if (currentQ < QUIZ_QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setCompleted(true);
    }
  };

  const totalScore = Object.values(selectedAnswers).reduce((a, b) => a + b, 0);
  const maxScore = QUIZ_QUESTIONS.length * 30;
  const scorePercent = Math.round((totalScore / maxScore) * 100);

  let tier = {
    title: 'Conscious Earth Guardian',
    badge: 'Tier 1: Master of Circular Living',
    desc: 'Outstanding! Your daily routine eliminates single-use plastics and prioritizes biological replenishment.',
    color: 'text-primary bg-primary/10 border-primary/30'
  };

  if (scorePercent < 45) {
    tier = {
      title: 'Curious Starter',
      badge: 'Tier 3: Great Swap Potential',
      desc: 'You have tremendous opportunity to save up to 40kg of plastic and 150kg of CO₂ yearly with simple swaps!',
      color: 'text-warning bg-warning/10 border-warning/30'
    };
  } else if (scorePercent < 80) {
    tier = {
      title: 'Mindful Improver',
      badge: 'Tier 2: Solid Eco Habits',
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
    const shareText = `I scored ${scorePercent}% on the EcoMart Sustainability Quiz! Level: ${tier.title}. Audit your habits at EcoMart!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleReset = () => {
    setCurrentQ(0);
    setSelectedAnswers({});
    setCompleted(false);
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-line shadow-soft-sm max-w-2xl mx-auto">
      {!completed ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
              Question {currentQ + 1} of {QUIZ_QUESTIONS.length}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-muted font-medium">
              <span>Progress:</span>
              <div className="w-24 h-2 bg-surface-sunken border border-line rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${((currentQ) / QUIZ_QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <h3 className="text-lg sm:text-xl font-serif font-bold text-heading leading-snug">
            {QUIZ_QUESTIONS[currentQ].question}
          </h3>

          <div className="space-y-3">
            {QUIZ_QUESTIONS[currentQ].options.map((opt, idx) => (
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

          <div className="p-4 rounded-2xl bg-surface-sunken border border-line text-xs text-secondary">
            🌱 <strong>Matched Persona:</strong> {personaProfile.icon} <strong className="text-heading">{personaProfile.label}</strong> ({personaProfile.badge}).
            <p className="text-[11px] text-text-muted mt-1">{personaProfile.description}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleApplyPersonaToShop}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-primary-contrast font-medium text-xs transition shadow-soft-sm cursor-pointer min-h-[44px]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Personalize Catalog for My Persona</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-line text-secondary font-medium text-xs hover:bg-surface-sunken hover:text-heading transition cursor-pointer min-h-[44px]"
            >
              <Share2 className="w-4 h-4" />
              <span>{copied ? 'Copied!' : 'Share'}</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-line text-secondary font-medium text-xs hover:bg-surface-sunken hover:text-heading transition cursor-pointer min-h-[44px]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
