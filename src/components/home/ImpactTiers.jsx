import React from 'react';
import { User, Users, ShieldCheck, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TIERS = [
  {
    id: 'shopper',
    name: 'Everyday Shopper',
    badge: 'Individual Swaps',
    icon: User,
    summary: 'For conscious individuals looking to verify sustainability claims and replace plastic essentials.',
    features: [
      '5-Axis Claim Radar on sustainable items',
      '1-Tap Cart Transformer with verified swaps',
      'Trust Passport generation with digital QR code',
      'What-If Cart Simulator with live footprint gauges',
      'Personal session carbon and plastic reduction tracking'
    ],
    highlight: false,
    cta: 'Explore Catalog',
    route: '/shop'
  },
  {
    id: 'household',
    name: 'Conscious Household',
    badge: 'Pantry & Family',
    icon: Users,
    summary: 'For families and shared pantries eliminating single-use packaging and reducing waste.',
    features: [
      'Camera-based Label Scanner with claim verification',
      'Kirana Mode for Indian unpackaged bulk staples',
      'Multilingual interface support (English & Hindi)',
      'Smart refill tracking and local artisan discovery',
      'Custom eco-priority weighting in decision engine'
    ],
    highlight: true,
    cta: 'Try Cart Transformer',
    route: '/transform'
  },
  {
    id: 'transparency',
    name: 'Transparency & Audit',
    badge: 'Community & Trust',
    icon: ShieldCheck,
    summary: 'For researchers, sustainability auditors, and community members demanding rigorous proof.',
    features: [
      'Simulated AI Courtroom trials for greenwashing claims',
      'Append-only local AI telemetry log (Black Box)',
      'Cross-linguistic fairness & neutrality evaluation',
      'Zero-tracking architecture with local-first storage',
      'Exportable JSON lifecycle audits for verified claims'
    ],
    highlight: false,
    cta: 'Enter AI Courtroom',
    route: '/courtroom'
  }
];

export default function ImpactTiers() {
  return (
    <section className="py-16 bg-surface border-b border-line" id="tiers">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-raised border border-line text-primary font-mono text-[11px] font-semibold uppercase tracking-wider">
            Verified Circular Scope
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-heading">
            What You Can Do with EcoMart
          </h2>
          <p className="text-xs font-sans text-text-secondary leading-relaxed">
            From single-tap swaps on everyday staples to rigorous multi-agent trials of sustainability claims.
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
                    Popular
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
                  <Link
                    to={tier.route}
                    className={`w-full py-2.5 px-4 rounded-xl font-sans font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-soft-xs ${
                      tier.highlight
                        ? 'bg-primary hover:bg-primary-hover text-primary-contrast'
                        : 'bg-surface-raised hover:bg-surface-sunken text-heading border border-line'
                    }`}
                  >
                    <span>{tier.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
