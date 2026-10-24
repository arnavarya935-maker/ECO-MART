import React, { useRef } from 'react';
import { ShieldCheck, Leaf, Scale, CheckCircle2, Sparkles } from 'lucide-react';
import { useScrollProgress, isReducedMotion } from '../../lib/scrollAnimation';

// Token-aligned mission sentence broken into words with embedded semantic inline icons
const MISSION_TOKENS = [
  { text: 'We', type: 'word' },
  { text: 'believe', type: 'word' },
  { text: 'commerce', type: 'word' },
  { text: 'should', type: 'word' },
  { text: 'never', type: 'word' },
  { text: 'demand', type: 'word' },
  { text: 'blind', type: 'word' },
  { text: 'faith.', type: 'word' },
  { type: 'icon', icon: ShieldCheck, color: '#10B981', label: 'Verified Shield' },
  { text: 'Every', type: 'word' },
  { text: 'single', type: 'word' },
  { text: 'claim', type: 'word' },
  { text: 'in', type: 'word' },
  { text: 'our', type: 'word' },
  { text: 'catalog', type: 'word' },
  { text: 'is', type: 'word' },
  { text: 'deconstructed', type: 'word' },
  { text: 'by', type: 'word' },
  { text: 'open', type: 'word' },
  { text: 'algorithms,', type: 'word' },
  { type: 'icon', icon: Scale, color: '#F59E0B', label: 'Balanced Fairness' },
  { text: 'audited', type: 'word' },
  { text: 'against', type: 'word' },
  { text: 'greenwashing,', type: 'word' },
  { text: 'and', type: 'word' },
  { text: 'proven', type: 'word' },
  { text: 'from', type: 'word' },
  { text: 'regenerative', type: 'word' },
  { text: 'soil', type: 'word' },
  { type: 'icon', icon: Leaf, color: '#14B8A6', label: 'Regenerative Leaf' },
  { text: 'to', type: 'word' },
  { text: 'its', type: 'word' },
  { text: 'infinite', type: 'word' },
  { text: 'second', type: 'word' },
  { text: 'life.', type: 'word' },
  { type: 'icon', icon: CheckCircle2, color: '#10B981', label: 'Verified Complete' }
];

export default function WordByWordMission() {
  const containerRef = useRef(null);
  const reduced = isReducedMotion();

  // Scroll progress through the section
  const { progress } = useScrollProgress(containerRef, {
    disabled: reduced
  });

  const totalTokens = MISSION_TOKENS.length;

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-surface py-16 sm:py-24 md:py-32 border-b border-line selection:bg-emerald-500/20"
      aria-label="Mission Manifesto"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtle Pill Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase bg-primary-subtle text-primary border border-primary/20 mb-8">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          The EcoMart Manifesto
        </div>

        {/* Word-by-word scrubbed paragraph */}
        <p className="text-2xl sm:text-3xl md:text-5xl font-display font-medium leading-relaxed sm:leading-snug text-heading">
          {MISSION_TOKENS.map((item, idx) => {
            if (reduced) {
              if (item.type === 'icon') {
                const Icon = item.icon;
                return (
                  <span
                    key={idx}
                    className="inline-flex items-center align-middle mx-1.5"
                    aria-hidden="true"
                  >
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: item.color }} />
                  </span>
                );
              }
              return (
                <span key={idx} className="inline-block mr-2 sm:mr-3 text-heading">
                  {item.text}
                </span>
              );
            }

            // Scrub calculations: start revealing after 15% section scroll, finish at 85%
            const startFrac = 0.15 + (idx / totalTokens) * 0.7;
            const tokenProgress = Math.max(0, Math.min(1, (progress - startFrac) / 0.05));
            const opacity = 0.15 + tokenProgress * 0.85;

            if (item.type === 'icon') {
              const Icon = item.icon;
              return (
                <span
                  key={idx}
                  className="inline-flex items-center align-middle mx-1.5 transition-all duration-150"
                  style={{
                    opacity,
                    transform: `scale(${0.8 + tokenProgress * 0.2})`
                  }}
                  aria-hidden="true"
                >
                  <Icon
                    className="w-6 h-6 sm:w-8 sm:h-8 drop-shadow"
                    style={{ color: item.color }}
                  />
                </span>
              );
            }

            return (
              <span
                key={idx}
                className="inline-block mr-2 sm:mr-3 transition-opacity duration-150"
                style={{
                  opacity,
                  color: tokenProgress > 0.8 ? 'var(--color-heading)' : 'var(--color-text-muted)'
                }}
              >
                {item.text}
              </span>
            );
          })}
        </p>

        {/* Screen reader accessible full text */}
        <p className="sr-only">
          We believe commerce should never demand blind faith. Every single claim in our catalog is deconstructed by open algorithms, audited against greenwashing, and proven from regenerative soil to its infinite second life.
        </p>

        <div className="mt-8 text-xs font-mono uppercase tracking-widest text-text-muted">
          Audited by EcoMart Open Governance Framework
        </div>
      </div>
    </section>
  );
}
