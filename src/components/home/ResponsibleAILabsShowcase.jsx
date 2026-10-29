import React from 'react';
import { Link } from 'react-router-dom';
import {
  Gavel,
  Scan,
  Compass,
  FileCheck,
  Store,
  Layers,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

const LABS = [
  {
    id: 'courtroom',
    title: 'The AI Courtroom',
    tag: 'Simulated Trial',
    badge: 'Turn-by-Turn Debate',
    icon: Gavel,
    route: '/courtroom',
    accent: 'border-l-4 border-l-rose-500',
    description:
      'Prosecutor exposes greenwashing; Defender argues genuine merits; Judge delivers an evidentiary verdict. Raise an objection mid-trial.'
  },
  {
    id: 'scan',
    title: 'Product Label Scanner',
    tag: 'Vision & Radar',
    badge: 'Images Not Saved',
    icon: Scan,
    route: '/scan',
    accent: 'border-l-4 border-l-emerald-600',
    description:
      'Upload or capture a label photo. AI Vision extracts claims and checks them against simple claim rules with an interactive 5-axis Claim Radar.'
  },
  {
    id: 'dilemmas',
    title: 'Ethics Dilemma Cards',
    tag: 'Human Moral Choice',
    badge: 'Explicit AI Refusal',
    icon: Compass,
    route: '/dilemmas',
    accent: 'border-l-4 border-l-amber-500',
    description:
      'Real-world tradeoffs (affordability vs durability) where the AI refuses to pick for you, honoring human moral agency.'
  },
  {
    id: 'self-audit',
    title: 'AI Self-Audit Report',
    tag: 'Accountability',
    badge: 'Print-Ready PDF',
    icon: FileCheck,
    route: '/self-audit',
    accent: 'border-l-4 border-l-forest-900',
    description:
      'Synthesizes Black Box telemetry into an auditable session report detailing uncertainties, bias risks, and model improvements.'
  },
  {
    id: 'kirana',
    title: 'Desi Kirana Mode (किराना)',
    tag: 'Voice & High-Contrast',
    badge: 'Hindi-First Layout',
    icon: Store,
    route: '/kirana',
    accent: 'border-l-4 border-l-emerald-500',
    description:
      'High-contrast neighborhood grocery with large touch targets, Web Speech voice input ("बोलकर खोजें"), and read-aloud output.'
  },
  {
    id: 'ripple',
    title: 'Choice Ripple & Time Machine',
    tag: 'Lifecycle & 2030/2035',
    badge: 'Sankey & Scenarios',
    icon: Layers,
    route: '/product/kit-01',
    accent: 'border-l-4 border-l-teal-600',
    description:
      'Animated cradle-to-grave flow diagram with accessible table toggle, plus Now / 2030 / 2035 future degradation horizon modeling.'
  }
];

export default function ResponsibleAILabsShowcase() {
  return (
    <section className="py-16 bg-surface-sunken border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-forest-900/10 text-forest-900 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Responsible AI Laboratory Suite</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-heading">
              Evidence, Transparency & Human Agency
            </h2>
            <p className="text-muted mt-1 text-sm sm:text-base max-w-2xl">
              Explore our six interactive demonstration labs designed for verifiable responsible AI, fairness, and transparency.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-muted bg-surface px-3 py-2 rounded-xl border border-line self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Local-First Intelligence • Zero PII Retained</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {LABS.map((lab) => {
            const Icon = lab.icon;
            return (
              <Link
                key={lab.id}
                to={lab.route}
                className={`bg-surface rounded-3xl p-6 border border-line shadow-soft-xs hover:shadow-soft-md transition-all group flex flex-col justify-between space-y-4 ${lab.accent}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-sand-100 flex items-center justify-center text-forest-900 group-hover:bg-forest-900 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-sand-100 text-muted font-bold uppercase">
                      {lab.badge}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-muted tracking-wider block">
                      {lab.tag}
                    </span>
                    <h3 className="font-serif font-bold text-lg text-heading mt-0.5 group-hover:text-primary transition-colors">
                      {lab.title}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed mt-1.5">
                      {lab.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-line/60 flex items-center justify-between text-xs font-bold text-heading group-hover:text-primary transition-colors">
                  <span>Launch Interactive Lab</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
