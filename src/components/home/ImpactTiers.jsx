import React from 'react';
import { User, Users, School, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TIERS = [
  {
    id: 'explorer',
    name: 'Explorer',
    badge: 'Individual Learner',
    icon: User,
    summary: 'For students and conscious shoppers investigating real-world product sustainability.',
    features: [
      '5-Axis Claim Radar on catalog items',
      'Explainable AI reasoning + ELI10 toggle',
      'Trust Passport generation with offline SVG QR',
      'What-If Cart Simulator with live gauges',
      'Personal session energy telemetry (Wh)'
    ],
    highlight: false,
    cta: 'Explore Catalog',
    route: '/shop'
  },
  {
    id: 'classroom',
    name: 'Classroom',
    badge: 'Collaborative Lab',
    icon: Users,
    summary: 'For peer deliberation, ethics workshops, and cross-linguistic bias evaluations.',
    features: [
      'Fairness Lab multilingual tests (EN, HI, Hinglish)',
      'Break the AI adversarial prompt sandbox',
      '5-Round Human vs AI greenwash duel benchmark',
      'Classroom Impact Garden aggregated tracking',
      'Interactive Counterfactual decision boundary slider'
    ],
    highlight: true,
    cta: 'Launch Fairness Lab',
    route: '/fairness'
  },
  {
    id: 'school',
    name: 'School / District',
    badge: 'District Deliberations',
    icon: School,
    summary: 'For CBSE CT & AI showcase presentations, judge audits, and administrative governance.',
    features: [
      '10-Step scripted offline Judge Demo mode',
      'Append-only tamper-evident AI Black Box log',
      'Human-in-the-loop Ethics Inbox alert queue',
      'Zero-PII compliance and raw JSON log export',
      'Full offline runtime with zero external CDN reliance'
    ],
    highlight: false,
    cta: 'Run Judge Demo',
    route: '#',
    action: () => window.dispatchEvent(new CustomEvent('open-judge-walkthrough'))
  }
];

export default function ImpactTiers() {
  return (
    <section className="py-16 bg-surface border-b border-line" id="tiers">
      <div className="max-w-6xl mx-auto px-6 md:px-10 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-raised border border-line text-primary font-mono text-[11px] font-semibold uppercase tracking-wider">
            CBSE Deliberations Architecture
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-heading">
            Deployment &amp; Impact Tiers
          </h2>
          <p className="text-xs font-sans text-text-secondary leading-relaxed">
            Architectural scope designed for student inquiry, collaborative peer auditing, and district-level evaluation.
            <span className="block mt-1 font-mono text-amber-300 font-semibold">
              * Educational project concept only — zero commercial pricing or licensing.
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map((tier) => {
            const Icon = tier.icon;
            return (
              <div
                key={tier.id}
                className={`p-6 sm:p-8 rounded-3xl border transition-all flex flex-col justify-between space-y-6 ${
                  tier.highlight
                    ? 'bg-surface-raised border-primary/50 shadow-soft-md relative'
                    : 'bg-surface border-line hover:border-primary/30 shadow-soft-xs'
                }`}
              >
                {tier.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary text-primary-contrast font-mono text-[10px] font-bold uppercase tracking-wider shadow-soft-xs">
                    Recommended for Labs
                  </span>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-text-muted uppercase font-bold">
                      {tier.badge}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-surface-sunken border border-line flex items-center justify-center text-primary">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif text-2xl font-bold text-heading">
                      {tier.name}
                    </h3>
                    <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                      {tier.summary}
                    </p>
                  </div>

                  <div className="pt-2 space-y-2.5">
                    <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
                      Included Capabilities:
                    </div>
                    {tier.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-2 text-xs font-sans text-heading">
                        <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-line">
                  {tier.action ? (
                    <button
                      type="button"
                      onClick={tier.action}
                      className="w-full py-2.5 px-4 rounded-xl bg-surface-raised border border-amber-400/40 text-amber-300 hover:bg-amber-400/10 font-sans font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <span>{tier.cta}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <Link
                      to={tier.route}
                      className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast font-sans font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-soft-xs"
                    >
                      <span>{tier.cta}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
