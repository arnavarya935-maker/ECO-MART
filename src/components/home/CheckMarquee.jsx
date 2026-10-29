import React from 'react';
import { Link } from 'react-router-dom';
import {
  Radar,
  Wind,
  RotateCcw,
  Scale,
  ShieldAlert,
  Terminal,
  CheckCircle2,
  Sliders,
  Gavel,
  Scan,
  Compass,
  FileCheck,
  Store
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const CHECKS = [
  { label: 'AI Courtroom', icon: Gavel, route: '/courtroom', tag: 'Simulated Trial' },
  { label: 'Label Scanner', icon: Scan, route: '/scan', tag: 'Vision & Radar' },
  { label: 'Ethics Dilemmas', icon: Compass, route: '/dilemmas', tag: 'Human Moral Choice' },
  { label: 'AI Self-Audit', icon: FileCheck, route: '/self-audit', tag: 'Auditable Report' },
  { label: 'Desi Kirana Mode', icon: Store, route: '/kirana', tag: 'Voice & High-Contrast' },
  { label: 'Greenwashing Check', icon: Radar, route: '/shop', tag: 'Claim Rules' },
  { label: 'Carbon Estimate', icon: Wind, route: '/impact', tag: 'Lifecycle LCA' },
  { label: 'Second Life Trajectory', icon: RotateCcw, route: '/shop', tag: 'Circular Stewardship' },
  { label: 'Fairness Test', icon: Scale, route: '/fairness', tag: 'Cross-Linguistic Parity' },
  { label: 'Guardrail Safety Test', icon: ShieldAlert, route: '/playground', tag: 'Multi-Tier Intercept' },
  { label: 'Zero-PII Black Box', icon: Terminal, route: '/blackbox', tag: 'Tamper-Evident' },
  { label: 'Counterfactual Flip Test', icon: Sliders, route: '/counterfactual', tag: 'Boundary Simulator' }
];

export default function CheckMarquee() {
  const { reduceEffects } = useTheme();

  return (
    <section
      aria-label="Verification and Check Types"
      className="w-full py-4 bg-surface-sunken border-y border-line overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto px-4 mb-2 flex items-center justify-between text-[11px] font-mono text-text-muted uppercase tracking-wider">
        <span className="flex items-center gap-1.5 text-primary font-bold">
          <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
          Autonomous Verifications Engine
        </span>
        <span className="hidden sm:inline">Hover to pause • Accessible chip navigation</span>
      </div>

      <div
        className={`relative w-full overflow-hidden ${
          reduceEffects ? 'flex flex-wrap justify-center gap-3 p-2' : ''
        }`}
      >
        {!reduceEffects ? (
          <div
            className="flex gap-4 w-max animate-marquee hover:[animation-play-state:paused]"
            style={{
              animation: 'marquee 28s linear infinite'
            }}
          >
            {/* Double array for seamless endless loop */}
            {[...CHECKS, ...CHECKS].map((check, idx) => {
              const Icon = check.icon;
              return (
                <Link
                  key={`${check.label}-${idx}`}
                  to={check.route}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-raised border border-line hover:border-primary/50 hover:bg-surface text-text-secondary hover:text-heading transition-all text-xs font-sans font-medium shrink-0 group focus-visible:outline-2 focus-visible:outline-focus"
                >
                  <Icon className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
                  <span>{check.label}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-sunken text-text-muted border border-line/60">
                    {check.tag}
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          CHECKS.map((check) => {
            const Icon = check.icon;
            return (
              <Link
                key={check.label}
                to={check.route}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-raised border border-line text-xs font-sans text-heading"
              >
                <Icon className="w-3.5 h-3.5 text-primary" />
                <span>{check.label}</span>
                <span className="text-[10px] font-mono text-text-muted">({check.tag})</span>
              </Link>
            );
          })
        )}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
