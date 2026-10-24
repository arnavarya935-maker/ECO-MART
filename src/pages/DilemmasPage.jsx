import React, { useState } from 'react';
import {
  ShieldAlert,
  RotateCcw,
  CheckCircle2,
  Compass
} from 'lucide-react';
import { ETHICS_DILEMMAS } from '../lib/ai/dilemmasData.js';

export default function DilemmasPage() {
  const [selectedDilemmaId, setSelectedDilemmaId] = useState(ETHICS_DILEMMAS[0].id);
  const [userChoiceMap, setUserChoiceMap] = useState({});

  const activeDilemma = ETHICS_DILEMMAS.find((d) => d.id === selectedDilemmaId) || ETHICS_DILEMMAS[0];
  const userChoice = userChoiceMap[activeDilemma.id] || null;

  const handleSelectOption = (optionId) => {
    setUserChoiceMap((prev) => ({
      ...prev,
      [activeDilemma.id]: optionId
    }));
  };

  const handleResetChoice = () => {
    setUserChoiceMap((prev) => {
      const next = { ...prev };
      delete next[activeDilemma.id];
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-sand-50 py-10 px-4 sm:px-6 lg:px-8 text-forest-900 transition-colors">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header & Ethics Notice */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-line shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-forest-900/10 text-forest-900 mb-3">
                <Compass className="w-3.5 h-3.5" />
                <span>Responsible AI & Human Agency</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-heading">
                Ethics Dilemma Cards
              </h1>
              <p className="text-muted mt-2 text-sm sm:text-base max-w-2xl">
                Real-world sustainability involves profound human, financial, and ecological tradeoffs. Our AI explicitly refuses to make value judgments for you—because ethics belongs to human conscience.
              </p>
            </div>

            {/* Mandatory Ethics Label */}
            <div className="bg-sand-100 rounded-2xl p-4 border border-line text-xs space-y-1.5 max-w-xs self-start">
              <div className="flex items-center gap-1.5 font-bold text-heading">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Simulated Scenarios / Examples</span>
              </div>
              <p className="text-muted leading-relaxed">
                Local curated scenarios, labeled as examples. The AI presents tradeoffs neutrally and will never prescribe a single "correct" choice.
              </p>
            </div>
          </div>

          {/* Dilemma Selector Tabs */}
          <div className="mt-6 pt-6 border-t border-line/60">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted block mb-3">
              Explore Curated Scenarios:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              {ETHICS_DILEMMAS.map((d) => {
                const isSelected = selectedDilemmaId === d.id;
                const hasChosen = Boolean(userChoiceMap[d.id]);
                return (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDilemmaId(d.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-forest-900 text-white border-forest-900 shadow-sm'
                        : 'bg-surface-raised hover:bg-sand-100 text-heading border-line'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-mono uppercase opacity-75">
                        {d.category}
                      </span>
                      {hasChosen && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400" title="Explored" />
                      )}
                    </div>
                    <span className="font-bold text-xs sm:text-sm block line-clamp-1">
                      {d.title}
                    </span>
                    <span className="text-[11px] opacity-70 block mt-1">
                      {d.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active Dilemma Card */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-line shadow-sm space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-forest-900/10 text-forest-900 font-bold">
                Scenario Premise
              </span>
              <span className="text-xs text-muted font-medium">{activeDilemma.badge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-heading">
              {activeDilemma.title}
            </h2>
            <p className="text-sm sm:text-base text-muted leading-relaxed max-w-3xl">
              "{activeDilemma.premise}"
            </p>
          </div>

          {/* Side-by-Side Tradeoffs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Option A */}
            <div
              className={`p-6 rounded-3xl border-2 transition-all flex flex-col justify-between ${
                userChoice === 'opt-a'
                  ? 'bg-forest-900/5 border-forest-900 shadow-md ring-2 ring-forest-900/20'
                  : 'bg-surface-raised border-line hover:border-forest-900/30'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted">
                    Option A
                  </span>
                  {userChoice === 'opt-a' && (
                    <span className="px-2.5 py-0.5 rounded-full bg-forest-900 text-white text-[11px] font-bold">
                      Your Selection
                    </span>
                  )}
                </div>
                <h3 className="font-serif font-bold text-lg text-heading">
                  {activeDilemma.optionA.title}
                </h3>
                <p className="text-xs sm:text-sm text-secondary font-medium">
                  {activeDilemma.optionA.summary}
                </p>

                <div className="space-y-2 pt-2 border-t border-line/60 text-xs">
                  <div>
                    <span className="font-bold text-heading block">Ecological Impact:</span>
                    <span className="text-muted leading-relaxed">
                      {activeDilemma.optionA.environmentalTradeoff}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-heading block">Human / Economic Reality:</span>
                    <span className="text-muted leading-relaxed">
                      {activeDilemma.optionA.humanTradeoff}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => handleSelectOption('opt-a')}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition cursor-pointer ${
                    userChoice === 'opt-a'
                      ? 'bg-forest-900 text-white shadow-sm'
                      : 'bg-sand-100 hover:bg-forest-900 hover:text-white text-heading'
                  }`}
                >
                  {userChoice === 'opt-a' ? '✓ Selected Option A' : 'Choose Option A'}
                </button>
              </div>
            </div>

            {/* Option B */}
            <div
              className={`p-6 rounded-3xl border-2 transition-all flex flex-col justify-between ${
                userChoice === 'opt-b'
                  ? 'bg-forest-900/5 border-forest-900 shadow-md ring-2 ring-forest-900/20'
                  : 'bg-surface-raised border-line hover:border-forest-900/30'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted">
                    Option B
                  </span>
                  {userChoice === 'opt-b' && (
                    <span className="px-2.5 py-0.5 rounded-full bg-forest-900 text-white text-[11px] font-bold">
                      Your Selection
                    </span>
                  )}
                </div>
                <h3 className="font-serif font-bold text-lg text-heading">
                  {activeDilemma.optionB.title}
                </h3>
                <p className="text-xs sm:text-sm text-secondary font-medium">
                  {activeDilemma.optionB.summary}
                </p>

                <div className="space-y-2 pt-2 border-t border-line/60 text-xs">
                  <div>
                    <span className="font-bold text-heading block">Ecological Impact:</span>
                    <span className="text-muted leading-relaxed">
                      {activeDilemma.optionB.environmentalTradeoff}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-heading block">Human / Economic Reality:</span>
                    <span className="text-muted leading-relaxed">
                      {activeDilemma.optionB.humanTradeoff}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => handleSelectOption('opt-b')}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition cursor-pointer ${
                    userChoice === 'opt-b'
                      ? 'bg-forest-900 text-white shadow-sm'
                      : 'bg-sand-100 hover:bg-forest-900 hover:text-white text-heading'
                  }`}
                >
                  {userChoice === 'opt-b' ? '✓ Selected Option B' : 'Choose Option B'}
                </button>
              </div>
            </div>
          </div>

          {/* AI Explicit Refusal Box */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>AI Refusal: Value Judgments Belong to Humans</span>
            </div>
            <p className="text-xs sm:text-sm text-heading leading-relaxed italic font-serif">
              "{activeDilemma.aiRefusalStatement}"
            </p>
          </div>

          {/* Post-Choice Reflection */}
          {userChoice && (
            <div className="bg-surface rounded-2xl p-6 border-2 border-forest-900/40 shadow-sm space-y-3 animate-fade-in">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-serif font-bold text-base text-heading">
                    Ethical Reflection on Your Choice
                  </h4>
                </div>
                <button
                  onClick={handleResetChoice}
                  className="text-xs text-muted hover:text-heading inline-flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Rethink choice</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                {userChoice === 'opt-a' ? activeDilemma.reflectionA : activeDilemma.reflectionB}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
