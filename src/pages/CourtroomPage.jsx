import React, { useState, useEffect, useRef } from 'react';
import {
  Gavel,
  Shield,
  AlertTriangle,
  Play,
  RotateCcw,
  FastForward,
  MessageSquare,
  Sparkles,
  Info
} from 'lucide-react';
import { CACHED_DEBATES, generateDynamicCourtroomDebate } from '../lib/ai/courtroomEngine.js';

export default function CourtroomPage() {
  const [selectedDebateId, setSelectedDebateId] = useState(CACHED_DEBATES[0].id);
  const [activeDebate, setActiveDebate] = useState(CACHED_DEBATES[0]);
  const [customClaimInput, setCustomClaimInput] = useState('');
  const [currentStep, setCurrentStep] = useState(0); // 0: ready, 1: prosecutor, 2: defender, 3: objection window, 4: objection answered, 5: verdict
  const [isStreaming, setIsStreaming] = useState(false);
  const [userObjection, setUserObjection] = useState(null);
  const [customObjectionInput, setCustomObjectionInput] = useState('');
  const [showObjectionInput, setShowObjectionInput] = useState(false);

  const turnsEndRef = useRef(null);

  // Auto-scroll as turns unfold
  useEffect(() => {
    if (turnsEndRef.current && currentStep > 0) {
      turnsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentStep, userObjection]);

  // Stepper timer
  useEffect(() => {
    let timer;
    if (isStreaming) {
      if (currentStep === 0) {
        timer = setTimeout(() => setCurrentStep(1), 700);
      } else if (currentStep === 1) {
        timer = setTimeout(() => setCurrentStep(2), 2200);
      } else if (currentStep === 2) {
        // Pause at objection window so user can interact!
        timer = setTimeout(() => {
          setCurrentStep(3);
          setIsStreaming(false);
        }, 2200);
      } else if (currentStep === 4) {
        timer = setTimeout(() => setCurrentStep(5), 2400);
      }
    }
    return () => clearTimeout(timer);
  }, [isStreaming, currentStep]);

  const handleSelectDebate = (debateId) => {
    const found = CACHED_DEBATES.find((d) => d.id === debateId);
    if (found) {
      setSelectedDebateId(debateId);
      setActiveDebate(found);
      resetDebate();
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customClaimInput.trim()) return;
    const dynamicDebate = generateDynamicCourtroomDebate(customClaimInput);
    setSelectedDebateId(dynamicDebate.id);
    setActiveDebate(dynamicDebate);
    resetDebate();
  };

  const resetDebate = () => {
    setCurrentStep(0);
    setIsStreaming(false);
    setUserObjection(null);
    setCustomObjectionInput('');
    setShowObjectionInput(false);
  };

  const startDebate = () => {
    resetDebate();
    setIsStreaming(true);
  };

  const skipToVerdict = () => {
    setIsStreaming(false);
    if (!userObjection && activeDebate.objectionPresets?.[0]) {
      setUserObjection(activeDebate.objectionPresets[0]);
    }
    setCurrentStep(5);
  };

  const handleRaiseObjection = (preset) => {
    setUserObjection(preset);
    setCurrentStep(4);
    setIsStreaming(true);
  };

  const handleCustomObjectionSubmit = (e) => {
    e.preventDefault();
    if (!customObjectionInput.trim()) return;
    const obj = { id: 'custom-user-obj', question: `Objection: ${customObjectionInput.trim()}` };
    setUserObjection(obj);
    setShowObjectionInput(false);
    setCurrentStep(4);
    setIsStreaming(true);
  };

  const handleSkipObjection = () => {
    setUserObjection({ id: 'skipped', question: 'No objection raised by the audience.' });
    setCurrentStep(5);
  };

  // Get response to objection
  const getObjectionText = () => {
    if (!userObjection) return null;
    if (activeDebate.objectionResponses?.[userObjection.id]) {
      return activeDebate.objectionResponses[userObjection.id];
    }
    return activeDebate.defaultObjectionResponse || {
      prosecutor: 'The objection highlights unverified data gaps in the brand’s self-declared credentials.',
      defender: 'A valid consumer concern; sustainability claims must be substantiated with clear packaging data.'
    };
  };

  const objectionResponses = getObjectionText();

  return (
    <div className="min-h-screen bg-sand-50 py-10 px-4 sm:px-6 lg:px-8 text-forest-900 transition-colors">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-line shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-forest-900/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-forest-900/10 text-forest-900 mb-3">
                <Gavel className="w-3.5 h-3.5" />
                <span>Responsible AI Deliberation</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-heading">
                The AI Courtroom
              </h1>
              <p className="text-muted mt-2 text-sm sm:text-base max-w-2xl">
                Simulated turn-by-turn legal trial of environmental claims. The Prosecutor exposes greenwashing; the Defender presents honest sustainable merits; the Judge renders an evidentiary verdict.
              </p>
            </div>

            {/* Mandatory Ethics Note */}
            <div className="bg-sand-100 rounded-2xl p-4 border border-line text-xs space-y-1.5 max-w-xs self-start">
              <div className="flex items-center gap-1.5 font-bold text-heading">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>AI Roles, Simulated Debate</span>
              </div>
              <p className="text-muted leading-relaxed">
                Roles are governed by strict guardrails: they <strong>must never invent</strong> certifications, lab standards, or false statistics.
              </p>
            </div>
          </div>

          {/* Quick Preset Selector Chips */}
          <div className="mt-6 pt-6 border-t border-line/60">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted block mb-3">
              Featured Example Trials:
            </span>
            <div className="flex flex-wrap gap-2">
              {CACHED_DEBATES.map((deb) => (
                <button
                  key={deb.id}
                  onClick={() => handleSelectDebate(deb.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all text-left border ${
                    selectedDebateId === deb.id
                      ? 'bg-forest-900 text-white border-forest-900 shadow-sm'
                      : 'bg-surface-raised hover:bg-sand-100 text-heading border-line'
                  }`}
                >
                  <span className="font-semibold block">{deb.title}</span>
                  <span className="opacity-75 text-[10px]">{deb.category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Claim Input */}
          <form onSubmit={handleCustomSubmit} className="mt-4 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={customClaimInput}
              onChange={(e) => setCustomClaimInput(e.target.value)}
              placeholder="Or enter any product packaging claim to put on trial..."
              className="flex-1 bg-surface-raised border border-line rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-900/20 text-heading"
            />
            <button
              type="submit"
              disabled={!customClaimInput.trim()}
              className="px-5 py-2.5 bg-forest-900 text-white text-sm font-semibold rounded-xl hover:bg-forest-800 transition disabled:opacity-50 shrink-0"
            >
              Put on Trial
            </button>
          </form>
        </div>

        {/* Claim on Trial Billboard */}
        <div className="bg-forest-900 text-white rounded-3xl p-6 shadow-md border border-forest-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs tracking-wider uppercase font-mono text-emerald-300">
              Claim Under Subpoena
            </span>
            <blockquote className="text-xl sm:text-2xl font-serif font-semibold italic text-sand-50">
              "{activeDebate.claim}"
            </blockquote>
            <div className="flex items-center gap-2 pt-2">
              {activeDebate.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-white/10 text-sand-100 border border-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Courtroom Controls */}
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            {currentStep === 0 ? (
              <button
                onClick={startDebate}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-forest-950 font-bold text-sm shadow-sm transition"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Begin Trial</span>
              </button>
            ) : (
              <>
                <button
                  onClick={resetDebate}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-sand-100 transition"
                  title="Reset Courtroom"
                  aria-label="Reset Courtroom"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                {currentStep < 5 && (
                  <button
                    onClick={skipToVerdict}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-sand-100 font-semibold text-xs transition"
                  >
                    <FastForward className="w-4 h-4" />
                    <span>Skip to Verdict</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Turn-by-Turn Courtroom Proceedings */}
        {currentStep > 0 && (
          <div className="space-y-6">
            {/* Step 1: Prosecutor Opening */}
            <div
              className={`transition-all duration-500 transform ${
                currentStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="bg-surface rounded-3xl p-6 sm:p-7 border border-line shadow-sm border-l-4 border-l-rose-500">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-xl">
                      {activeDebate.prosecutorOpening.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-heading text-base">
                          {activeDebate.prosecutorOpening.role}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 font-semibold uppercase tracking-wider">
                          Greenwashing Indictment
                        </span>
                      </div>
                      <span className="text-xs text-muted">
                        {activeDebate.prosecutorOpening.speaker}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-muted">Turn 1 / 4</span>
                </div>

                <p className="font-semibold text-sm sm:text-base text-heading mb-3">
                  "{activeDebate.prosecutorOpening.summary}"
                </p>

                <ul className="space-y-2 mb-4">
                  {activeDebate.prosecutorOpening.points.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted">
                      <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-line/60">
                  <span className="text-[11px] font-semibold text-muted uppercase">
                    Evidence Cited:
                  </span>
                  {activeDebate.prosecutorOpening.evidenceCited?.map((ev, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-sand-100 text-[11px] font-mono text-forest-800 border border-line"
                    >
                      {ev}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 2: Defender Response */}
            {currentStep >= 2 && (
              <div
                className={`transition-all duration-500 transform ${
                  currentStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <div className="bg-surface rounded-3xl p-6 sm:p-7 border border-line shadow-sm border-l-4 border-l-emerald-600">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-xl">
                        {activeDebate.defenderOpening.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-heading text-base">
                            {activeDebate.defenderOpening.role}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 font-semibold uppercase tracking-wider">
                            Substantiated Defense
                          </span>
                        </div>
                        <span className="text-xs text-muted">
                          {activeDebate.defenderOpening.speaker}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-muted">Turn 2 / 4</span>
                  </div>

                  <p className="font-semibold text-sm sm:text-base text-heading mb-3">
                    "{activeDebate.defenderOpening.summary}"
                  </p>

                  <ul className="space-y-2 mb-4">
                    {activeDebate.defenderOpening.points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted">
                        <span className="text-emerald-600 font-bold shrink-0 mt-0.5">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-line/60">
                    <span className="text-[11px] font-semibold text-muted uppercase">
                      Evidence Cited:
                    </span>
                    {activeDebate.defenderOpening.evidenceCited?.map((ev, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-sand-100 text-[11px] font-mono text-forest-800 border border-line"
                      >
                        {ev}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Interactive Mid-Debate Objection Window */}
            {currentStep === 3 && (
              <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-3xl p-6 sm:p-7 shadow-md animate-pulse-once">
                <div className="flex items-center gap-2.5 text-amber-700 font-bold text-sm uppercase tracking-wider mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Court Interlocutory: Raise an Objection</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-heading mb-2">
                  The court invites the consumer to cross-examine both parties:
                </h3>
                <p className="text-xs sm:text-sm text-muted mb-4">
                  Select a critical consumer objection or pose your own question to challenge the arguments.
                </p>

                <div className="space-y-2.5">
                  {activeDebate.objectionPresets?.map((obj) => (
                    <button
                      key={obj.id}
                      onClick={() => handleRaiseObjection(obj)}
                      className="w-full text-left p-3.5 rounded-2xl bg-surface hover:bg-sand-100 border border-line text-xs sm:text-sm font-medium text-heading transition flex items-center justify-between gap-3 group"
                    >
                      <span className="group-hover:text-forest-900 font-semibold">{obj.question}</span>
                      <span className="text-xs px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-800 shrink-0 font-bold">
                        Object
                      </span>
                    </button>
                  ))}

                  {showObjectionInput ? (
                    <form onSubmit={handleCustomObjectionSubmit} className="pt-2 flex gap-2">
                      <input
                        type="text"
                        value={customObjectionInput}
                        onChange={(e) => setCustomObjectionInput(e.target.value)}
                        placeholder="State your objection to the court..."
                        className="flex-1 bg-surface border border-line rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-heading"
                        autoFocus
                      />
                      <button
                        type="submit"
                        disabled={!customObjectionInput.trim()}
                        className="px-4 py-2.5 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-500 transition disabled:opacity-50"
                      >
                        Submit Objection
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => setShowObjectionInput(true)}
                        className="text-xs font-semibold text-forest-900 hover:underline inline-flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Type a custom objection...</span>
                      </button>

                      <button
                        onClick={handleSkipObjection}
                        className="text-xs text-muted hover:text-heading"
                      >
                        Skip objection & proceed to verdict →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Objection Raised & Responses */}
            {currentStep >= 4 && userObjection && userObjection.id !== 'skipped' && (
              <div className="space-y-4">
                {/* User Objection Banner */}
                <div className="bg-sand-100 border border-line rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-forest-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    YOU
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-heading italic">
                    "{userObjection.question}"
                  </div>
                </div>

                {/* Counter Responses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-surface rounded-2xl p-5 border border-line text-xs space-y-2 border-l-4 border-l-rose-500">
                    <span className="font-bold text-rose-600 uppercase tracking-wider block">
                      Prosecutor Cross-Response:
                    </span>
                    <p className="text-muted leading-relaxed">
                      {objectionResponses?.prosecutor}
                    </p>
                  </div>
                  <div className="bg-surface rounded-2xl p-5 border border-line text-xs space-y-2 border-l-4 border-l-emerald-600">
                    <span className="font-bold text-emerald-700 uppercase tracking-wider block">
                      Defender Mitigation:
                    </span>
                    <p className="text-muted leading-relaxed">
                      {objectionResponses?.defender}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Judge Verdict */}
            {currentStep >= 5 && (
              <div className="bg-surface rounded-3xl p-6 sm:p-8 border-2 border-forest-900 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-forest-900 text-sand-50 flex items-center justify-center text-2xl shadow-sm">
                      {activeDebate.judgeVerdict.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-heading text-lg">
                          Final Judicial Ruling
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-forest-900 text-white font-mono uppercase">
                          Enforceable Verdict
                        </span>
                      </div>
                      <span className="text-xs text-muted">
                        {activeDebate.judgeVerdict.speaker}
                      </span>
                    </div>
                  </div>

                  {/* Trust Score Gauge */}
                  <div className="flex items-center gap-3 bg-sand-100 px-4 py-2 rounded-2xl border border-line self-start sm:self-auto">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-muted block">
                        Evidentiary Trust
                      </span>
                      <span className="text-2xl font-black text-heading">
                        {activeDebate.judgeVerdict.trustScore}
                        <span className="text-xs font-normal text-muted">/100</span>
                      </span>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-xl text-xs font-bold border ${activeDebate.judgeVerdict.verdictClass}`}
                    >
                      {activeDebate.judgeVerdict.verdict}
                    </div>
                  </div>
                </div>

                {/* Judicial Reasoning */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted">
                    Ratio Decidendi (Judicial Synthesis)
                  </h4>
                  <p className="text-sm sm:text-base text-heading leading-relaxed font-serif">
                    {activeDebate.judgeVerdict.reasoning}
                  </p>
                </div>

                {/* Mandated Remedies */}
                <div className="bg-sand-50 rounded-2xl p-5 border border-line space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-forest-900 block">
                    Mandated Labeling Remedies:
                  </span>
                  <ul className="space-y-1.5">
                    {activeDebate.judgeVerdict.remedies?.map((rem, i) => (
                      <li key={i} className="text-xs text-muted flex items-start gap-2">
                        <span className="text-forest-900 font-bold">§{i + 1}.</span>
                        <span>{rem}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Buyer Guidance Card */}
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-0.5">
                    <span className="font-bold text-emerald-900 block">
                      Consumer Takeaway for Responsible Shoppers:
                    </span>
                    <p className="text-emerald-800 leading-relaxed">
                      {activeDebate.judgeVerdict.buyerGuidance}
                    </p>
                  </div>
                </div>

                {/* Footnote */}
                <div className="text-[11px] text-muted text-center pt-2 flex items-center justify-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  <span>
                    Simulated responsible debate generated locally. No corporate sponsorships or ad revenue influence verdicts.
                  </span>
                </div>
              </div>
            )}

            <div ref={turnsEndRef} />
          </div>
        )}
      </div>
    </div>
  );
}
