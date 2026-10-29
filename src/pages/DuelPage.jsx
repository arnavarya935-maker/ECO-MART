import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Swords,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  ArrowRight,
  Flame,
  User,
  Bot
} from 'lucide-react';
import { DUEL_CLAIMS } from '../lib/duelEngine';

export default function DuelPage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userGuess, setUserGuess] = useState(null); // true (greenwashing) | false (legitimate)
  const [isAnswered, setIsAnswered] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const currentClaim = DUEL_CLAIMS[currentIdx];
  const isFinished = currentIdx >= DUEL_CLAIMS.length;

  const handleGuess = (guessedGreenwash) => {
    if (isAnswered) return;

    setUserGuess(guessedGreenwash);
    setIsAnswered(true);

    const isUserCorrect = guessedGreenwash === currentClaim.isGreenwashing;
    // AI has 100% accuracy on this curated benchmark
    setAiScore((prev) => prev + 1);

    if (isUserCorrect) {
      setUserScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNextRound = () => {
    setUserGuess(null);
    setIsAnswered(false);
    setCurrentIdx((prev) => prev + 1);
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setUserGuess(null);
    setIsAnswered(false);
    setUserScore(0);
    setAiScore(0);
    setStreak(0);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in pb-24 text-text">
      {/* Top Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono font-bold text-primary uppercase">
          <Swords className="w-4 h-4" />
          <span>Gamified AI Integrity Challenge</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-heading">
          Human vs AI Detective Duel
        </h1>
        <p className="text-sm sm:text-base text-secondary max-w-xl mx-auto leading-relaxed">
          Can you spot misleading claims faster than Eco Sense's AI helper? Read the claim, lock in your verdict, and compare your reasoning with the machine.
        </p>
      </div>

      {/* Duel Scoreboard */}
      <div className="grid grid-cols-3 gap-3 p-4 rounded-3xl bg-surface border border-line shadow-card text-center">
        {/* Human Score */}
        <div className="p-3 rounded-2xl bg-surface-sunken border border-line space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted font-bold uppercase">
            <User className="w-3.5 h-3.5 text-primary" />
            <span>You</span>
          </div>
          <div className="text-3xl font-serif font-black text-heading">{userScore}</div>
          <span className="text-[10px] text-muted">Correct Detections</span>
        </div>

        {/* Round Counter & Streak */}
        <div className="p-3 rounded-2xl bg-surface-sunken border border-line space-y-1">
          <div className="text-xs text-muted font-bold uppercase">Round</div>
          <div className="text-3xl font-serif font-black text-primary">
            {Math.min(currentIdx + 1, DUEL_CLAIMS.length)} <span className="text-xs font-normal text-muted">/ {DUEL_CLAIMS.length}</span>
          </div>
          <div className="text-[10px] font-mono text-amber-400 flex items-center justify-center gap-1">
            <Flame className="w-3 h-3 fill-current" />
            <span>Streak: {streak}</span>
          </div>
        </div>

        {/* AI Score */}
        <div className="p-3 rounded-2xl bg-surface-sunken border border-line space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted font-bold uppercase">
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Detective</span>
          </div>
          <div className="text-3xl font-serif font-black text-emerald-400">{aiScore}</div>
          <span className="text-[10px] text-muted">Reference Baseline</span>
        </div>
      </div>

      {/* Duel Arena */}
      {!isFinished ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-line shadow-card space-y-6 text-left">
          {/* Packaging Claim Card */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-muted">
              <span>PRODUCT: {currentClaim.productName}</span>
              <span>CASE FILE #{currentClaim.id.toUpperCase()}</span>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-surface-sunken border border-line font-serif text-base sm:text-lg text-heading italic leading-relaxed">
              &ldquo;{currentClaim.claim}&rdquo;
            </div>
          </div>

          {/* User Guess Buttons (Before Answering) */}
          {!isAnswered ? (
            <div className="space-y-3 pt-2">
              <span className="text-xs font-mono font-bold text-muted uppercase block text-center">
                YOUR VERDICT: IS THIS GREENWASHING OR LEGITIMATE?
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleGuess(true)}
                  className="py-4 px-5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/40 text-rose-400 font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 group shadow-soft-xs"
                >
                  <ShieldAlert className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span>🚨 Greenwashing! (Deceptive)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleGuess(false)}
                  className="py-4 px-5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 group shadow-soft-xs"
                >
                  <ShieldCheck className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span>✅ High Trust Claim (Honest)</span>
                </button>
              </div>
            </div>
          ) : (
            /* Post-Answer Reveal Section */
            <div className="space-y-5 animate-fade-in">
              {/* Verdict Result Banner */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs sm:text-sm font-bold ${
                userGuess === currentClaim.isGreenwashing
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              }`}>
                <div className="flex items-center gap-2">
                  {userGuess === currentClaim.isGreenwashing ? (
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 shrink-0" />
                  )}
                  <span>
                    {userGuess === currentClaim.isGreenwashing
                      ? '🎯 Spot on! Your intuition matched the ground truth!'
                      : '❌ Missed it! The packaging deceived your initial read.'}
                  </span>
                </div>

                <span className="text-xs font-mono uppercase px-2 py-0.5 rounded-full bg-surface border border-line text-heading shrink-0">
                  Ground Truth: {currentClaim.groundTruth}
                </span>
              </div>

              {/* AI Detective Audit Breakdown */}
              <div className="p-5 rounded-2xl bg-surface-sunken border border-line space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-primary flex items-center gap-1.5">
                    <Bot className="w-4 h-4" />
                    AI Detective Forensic Analysis
                  </span>
                  <span className="text-muted">{currentClaim.aiVerdict}</span>
                </div>

                <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                  {currentClaim.reasoning}
                </p>

                {currentClaim.flaggedPhrases && currentClaim.flaggedPhrases.length > 0 && (
                  <div className="pt-2 border-t border-line/60">
                    <span className="text-[10px] font-mono text-rose-400 font-bold uppercase block mb-1">
                      Flagged Misleading Buzzwords:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentClaim.flaggedPhrases.map((phrase, i) => (
                        <span key={i} className="px-2 py-0.5 rounded text-[11px] font-mono bg-rose-500/15 text-rose-300 border border-rose-500/25">
                          "{phrase}"
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Next Round Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleNextRound}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition shadow-soft-sm cursor-pointer flex items-center gap-2"
                >
                  <span>Next Claim</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Game Over Trophy Screen */
        <div className="p-8 sm:p-12 text-center rounded-3xl bg-surface border border-line shadow-card space-y-5 animate-scale-up">
          <Trophy className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-heading">
            Detective Duel Complete!
          </h2>
          <p className="text-sm text-secondary max-w-md mx-auto">
            You scored <strong className="text-heading font-black">{userScore} out of {DUEL_CLAIMS.length}</strong>! {userScore >= 4 ? 'You are very good at spotting misleading claims.' : 'Misleading claims can be tricky to spot — that is why Eco Sense builds tools to check claims honestly.'}
          </p>

          <div className="flex items-center justify-center gap-3 pt-3">
            <button
              type="button"
              onClick={handleRestart}
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition shadow-soft-sm cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again</span>
            </button>

            <Link
              to="/playground"
              className="px-5 py-2.5 rounded-xl bg-surface-sunken border border-line hover:border-primary text-heading text-xs font-semibold transition-colors"
            >
              Go to AI Playground →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
