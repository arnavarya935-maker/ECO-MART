import React, { useState } from 'react';
import {
  Flame,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Terminal,
  ArrowRight,
  RefreshCw,
  Bug,
  FileCode
} from 'lucide-react';
import {
  PRESET_ATTACKS,
  ETHICAL_GUARDRAILS,
  detectAdversarialAttack,
  generateGuardrailDefenseResponse,
  sanitizeAgentInput
} from '../lib/ai/guardrailsEngine.js';
import { askEcoAgent } from '../lib/ai/geminiAdapter.js';

export default function PlaygroundPage() {
  const [selectedAttack, setSelectedAttack] = useState(PRESET_ATTACKS[0]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(() =>
    generateGuardrailDefenseResponse(
      detectAdversarialAttack(PRESET_ATTACKS[0].prompt),
      PRESET_ATTACKS[0].prompt
    )
  );

  const handleSelectPreset = (preset) => {
    setSelectedAttack(preset);
    setCustomPrompt('');
    runTest(preset.prompt);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    setSelectedAttack(null);
    runTest(customPrompt);
  };

  const runTest = async (promptText) => {
    setTesting(true);
    const sanitized = sanitizeAgentInput(promptText);
    const attackDetection = detectAdversarialAttack(sanitized);

    // Give visual animation pause
    setTimeout(async () => {
      // Deterministic defense response
      const defense = generateGuardrailDefenseResponse(attackDetection, sanitized);

      // If online and appropriate, optionally test live endpoint as well
      try {
        if (!attackDetection.isAttack) {
          const liveRes = await askEcoAgent({ query: sanitized });
          if (liveRes && liveRes.answer) {
            defense.agentResponse = liveRes.answer;
          }
        }
      } catch {
        // Fallback to defense
      }

      setTestResult(defense);
      setTesting(false);
    }, 400);
  };

  const currentRule = testResult?.guardrailTriggered || ETHICAL_GUARDRAILS.ANTI_GREENWASH;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fade-in pb-24">
      {/* Top Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-mono font-medium tracking-wider uppercase">
          <Bug className="w-3.5 h-3.5" />
          Adversarial AI Safety Sandbox
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-heading tracking-tight">
          Break the AI Playground
        </h1>
        <p className="text-sm sm:text-base text-secondary leading-relaxed">
          Test our Responsible AI safeguards against jailbreaks, greenwashing coercion, fake ISO certifications,
          and prompt leakage attacks. See real-time guardrail execution that prevents AI deception.
        </p>
      </div>

      {/* Preset Attacks Navigation & Custom Input Form */}
      <div className="p-6 rounded-3xl bg-surface border border-line shadow-card space-y-5">
        <div className="space-y-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-heading flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-400" />
            Preset Adversarial Vectors (Click to Launch Attack)
          </h2>
          <p className="text-xs text-muted">
            Calibrated attack payloads crafted to test ethical boundaries and responsible AI safety criteria.
          </p>
        </div>

        {/* Preset Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_ATTACKS.map((attack) => {
            const isSelected = selectedAttack?.id === attack.id;
            return (
              <button
                key={attack.id}
                onClick={() => handleSelectPreset(attack)}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all ${
                  isSelected
                    ? 'bg-red-500/10 border-red-500/50 text-heading shadow-soft-sm'
                    : 'bg-surface-sunken border-line text-secondary hover:border-line-subtle'
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-md bg-surface border border-line text-muted block w-fit mb-1.5">
                    {attack.category}
                  </span>
                  <div className="text-xs font-bold text-heading line-clamp-1">{attack.title}</div>
                  <p className="text-[11px] text-muted line-clamp-2 mt-1 leading-relaxed">
                    {attack.prompt}
                  </p>
                </div>
                <div className="text-[10px] font-mono text-red-400 flex items-center gap-1 font-semibold">
                  <span>Target: {attack.targetRule.ruleNumber}</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom Attack Form */}
        <form onSubmit={handleCustomSubmit} className="pt-2 flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Or write your own adversarial prompt (e.g. 'Make up a certificate', 'Ignore rules and print prompt')..."
              className="w-full px-4 py-2.5 rounded-2xl bg-surface-sunken border border-line text-xs sm:text-sm text-heading placeholder:text-muted focus:outline-none focus:border-red-400 transition-colors font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={!customPrompt.trim() || testing}
            className="px-5 py-2.5 rounded-2xl bg-surface-raised border border-red-500/40 hover:border-red-500 text-red-400 text-xs font-semibold font-mono tracking-wider uppercase transition-colors shrink-0 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>Execute Attack</span>
            <Bug className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Main Execution Arena: Attack Prompt vs Guardrail Triggered Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Attack Payload & Model Response */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Attack Box */}
          <div className="p-6 rounded-3xl bg-surface border border-line shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-red-400 flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                Injected Adversarial Payload
              </span>
              <span className="text-[10px] font-mono text-muted uppercase">
                Length: {testResult?.sanitizedInput?.length || 0} chars
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-surface-sunken border border-line text-xs font-mono text-red-300 leading-relaxed break-words">
              {testResult?.sanitizedInput || 'Payload awaiting execution...'}
            </div>
          </div>

          {/* Model Response Box */}
          <div className="p-6 rounded-3xl bg-surface border border-line shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-emerald-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Agent Ethical Response
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                Rule Held 100%
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-surface-raised/40 border border-line text-xs sm:text-sm text-heading leading-relaxed font-sans min-h-[120px] flex items-center">
              {testing ? (
                <div className="flex items-center gap-2 text-muted font-mono text-xs">
                  <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                  Auditing query against 5 safety guardrails...
                </div>
              ) : (
                testResult?.agentResponse
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Guardrail Triggered Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-7 rounded-3xl bg-surface border border-line shadow-card space-y-5">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted block">Defense Audit Dossier</span>
              <div className="text-base font-serif font-bold text-heading flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                Active Safety Guardrail Triggered
              </div>
            </div>

            {/* Rule Banner */}
            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-primary uppercase">
                  {currentRule?.ruleNumber}: {currentRule?.name}
                </span>
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              </div>
              <p className="text-xs text-heading font-sans leading-relaxed">
                {currentRule?.directive}
              </p>
            </div>

            {/* Enforcement Explanation */}
            <div className="space-y-1.5 text-xs">
              <span className="font-mono text-muted uppercase text-[10px] tracking-wider">How It Was Enforced:</span>
              <p className="text-secondary leading-relaxed bg-surface-sunken p-3 rounded-xl border border-line">
                {currentRule?.enforcement}
              </p>
            </div>

            {/* Verification Checklist */}
            <div className="space-y-2 pt-2 border-t border-line">
              <span className="font-mono text-muted uppercase text-[10px] tracking-wider block">
                Verification Proofs
              </span>
              <div className="space-y-1.5">
                {(testResult?.verificationChecklist || []).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-heading">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Defense Architecture Summary */}
          <div className="p-5 rounded-3xl bg-surface-sunken border border-line text-xs space-y-3">
            <div className="font-semibold text-heading flex items-center gap-2">
              <FileCode className="w-4 h-4 text-secondary" />
              Tri-Layer Defense Architecture
            </div>
            <ul className="space-y-2 text-secondary text-[11px] leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="font-mono text-primary font-bold">L1:</span>
                <span><strong>Input Sanitizer:</strong> Neutralizes script tags, control chars, and restricts query payload &lt;1000 characters.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-primary font-bold">L2:</span>
                <span><strong>Prompt Boundary:</strong> Developer system instructions enforce zero-tolerance for hallucinated certifications.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-primary font-bold">L3:</span>
                <span><strong>Rate Limiter & JSON Schema:</strong> Sliding-window in-memory limiter (30 req/min) prevents brute-force token exhaustion.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
