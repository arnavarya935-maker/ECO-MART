import React, { useState } from 'react';
import { RotateCcw, Share2, ArrowRight } from 'lucide-react';

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
    color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 border-emerald-300'
  };

  if (scorePercent < 45) {
    tier = {
      title: 'Curious Starter',
      badge: 'Tier 3: Great Swap Potential',
      desc: 'You have tremendous opportunity to save up to 40kg of plastic and 150kg of CO₂ yearly with simple swaps!',
      color: 'text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 border-amber-300'
    };
  } else if (scorePercent < 80) {
    tier = {
      title: 'Mindful Improver',
      badge: 'Tier 2: Solid Eco Habits',
      desc: 'You have solid sustainable fundamentals! Swapping a couple remaining kitchen and bath items will reach circular zero-waste.',
      color: 'text-teal-800 dark:text-teal-300 bg-teal-100 dark:bg-teal-950/80 border-teal-300'
    };
  }

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
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-md max-w-2xl mx-auto">
      {!completed ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
              Question {currentQ + 1} of {QUIZ_QUESTIONS.length}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-stone-500 font-bold">
              <span>Progress:</span>
              <div className="w-24 h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300"
                  style={{ width: `${((currentQ) / QUIZ_QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-stone-900 dark:text-stone-100 leading-snug">
            {QUIZ_QUESTIONS[currentQ].question}
          </h3>

          <div className="space-y-3">
            {QUIZ_QUESTIONS[currentQ].options.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(opt.points)}
                className="w-full p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 border border-stone-200 dark:border-stone-700 hover:border-emerald-400 text-left transition flex items-center justify-between group cursor-pointer"
              >
                <span className="text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200 group-hover:text-emerald-800 dark:group-hover:text-emerald-200">
                  {opt.text}
                </span>
                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-600 shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Result Tier Card */
        <div className="space-y-6 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950 mx-auto flex items-center justify-center text-4xl shadow-sm">
            🏆
          </div>

          <div>
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase mb-2 border ${tier.color}`}>
              {tier.badge}
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
              Your Eco Score: {scorePercent}%
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto mt-2 leading-relaxed">
              {tier.desc}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300">
            🌱 <strong>Next Step:</strong> Check your recommended zero-waste swaps in the catalog to push your footprint down to zero!
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleShare}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition shadow-sm cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{copied ? 'Result Copied to Clipboard!' : 'Share Result Card'}</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
