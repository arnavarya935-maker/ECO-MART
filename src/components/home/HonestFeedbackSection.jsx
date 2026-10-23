import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

const REPRESENTATIVE_SCENARIOS = [
  {
    role: 'CBSE CT & AI Deliberation Scenario A',
    title: 'Admission of Ignorance over Hallucination',
    quote:
      'When queried about municipal composting facilities in rural districts, the AI responded with "I\'m not sure" and cited data boundaries instead of inventing a nonexistent city recycling scheme.',
    tag: 'Honesty Meter'
  },
  {
    role: 'CBSE CT & AI Deliberation Scenario B',
    title: 'Adversarial Greenwash Refusal',
    quote:
      'When fed adversarial marketing prompts demanding certification for plastic bottles as "zero pollution", the agent triggered Rule #1 and explained why unqualified absolute claims violate FTC and ISO standards.',
    tag: 'Guardrails Engine'
  },
  {
    role: 'CBSE CT & AI Deliberation Scenario C',
    title: 'Cross-Linguistic Fairness Parity',
    quote:
      'Queries in Hindi (Devanagari) received the same calibrated advice as English queries without steering non-English speakers toward inferior options or inflated pricing.',
    tag: 'Fairness Lab'
  }
];

export default function HonestFeedbackSection() {
  const [role, setRole] = useState('Student Deliberator');
  const [topic, setTopic] = useState('AI Guardrail Safety');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const existing = JSON.parse(localStorage.getItem('ecomart_user_feedback') || '[]');
      existing.push({
        id: Date.now(),
        role,
        topic,
        comment,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('ecomart_user_feedback', JSON.stringify(existing));
      setSubmitted(true);
      setComment('');
      setTimeout(() => setSubmitted(false), 4000);
    } catch {}
  };

  return (
    <section className="py-16 bg-surface-sunken/40 border-b border-line" id="feedback">
      <div className="max-w-6xl mx-auto px-6 md:px-10 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-raised border border-line text-primary font-mono text-[11px] font-semibold uppercase tracking-wider">
            Transparency &amp; Evaluation
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-heading">
            Feedback &amp; Deliberation Scenarios
          </h2>
          <p className="text-xs font-sans text-text-secondary leading-relaxed">
            Data honesty rule strictly applied: No invented testimonials or fake customer reviews. Below are representative deliberation audit scenarios and a local feedback console.
          </p>
        </div>

        {/* Representative Deliberation Scenarios */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
            <AlertCircle className="w-4 h-4 text-primary" />
            <span className="font-semibold uppercase tracking-wider text-heading">
              Audited AI Behavior Scenarios (Representative Demonstration Data)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REPRESENTATIVE_SCENARIOS.map((sc) => (
              <div
                key={sc.title}
                className="p-6 rounded-3xl bg-surface border border-line flex flex-col justify-between space-y-4 shadow-soft-xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-text-muted uppercase">
                      {sc.role}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-sunken text-primary border border-line">
                      {sc.tag}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-heading">
                    {sc.title}
                  </h3>
                  <p className="text-xs font-sans text-text-secondary italic leading-relaxed">
                    &ldquo;{sc.quote}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Local Share Feedback Form */}
        <div className="rounded-3xl bg-surface border border-line p-6 md:p-8 space-y-6 max-w-2xl mx-auto shadow-soft-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-surface-raised border border-line text-primary flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-heading">
                Submit Deliberation Feedback
              </h3>
              <p className="text-xs text-text-secondary">
                Saved locally to browser storage for review in the AI Black Box and Ethics Inbox.
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-sans flex items-center gap-3 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div>
                <span className="font-bold block">Feedback Saved Locally!</span>
                <span>Thank you. Your evaluation is logged into session telemetry for review.</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-text-muted uppercase block mb-1.5">
                    Your Role / Perspective
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-raised border border-line text-xs font-sans text-heading focus:outline-2 focus:outline-focus min-h-[44px]"
                  >
                    <option value="Student Deliberator">Student Deliberator</option>
                    <option value="Teacher / Mentor">Teacher / Mentor</option>
                    <option value="CBSE Judge">CBSE Judge</option>
                    <option value="Conscious Shopper">Conscious Shopper</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-text-muted uppercase block mb-1.5">
                    Evaluation Topic
                  </label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-raised border border-line text-xs font-sans text-heading focus:outline-2 focus:outline-focus min-h-[44px]"
                  >
                    <option value="AI Guardrail Safety">AI Guardrail Safety</option>
                    <option value="Explanation Clarity & ELI10">Explanation Clarity &amp; ELI10</option>
                    <option value="Multilingual Fairness">Multilingual Fairness</option>
                    <option value="Lifecycle Carbon Estimates">Lifecycle Carbon Estimates</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-text-muted uppercase block mb-1.5">
                  Deliberation Notes or Observation
                </label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share what worked, observed hallucinations, or boundary test observations..."
                  className="w-full p-3 rounded-xl bg-surface-raised border border-line text-xs font-sans text-heading focus:outline-2 focus:outline-focus placeholder:text-text-muted"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast font-sans font-semibold text-xs flex items-center gap-2 transition cursor-pointer shadow-soft-xs min-h-[44px]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Log Evaluation Feedback</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
