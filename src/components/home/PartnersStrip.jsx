import React from 'react';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import { useT } from '../../context/I18nContext';
import { useTheme } from '../../context/ThemeContext';

export default function PartnersStrip() {
  const { t } = useT();
  const { reduceEffects } = useTheme();

  const motionProps = reduceEffects
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
      };

  const partnerSlots = [
    { id: 'partner-1', label: 'Incubator / University Lab', slot: 'Partner Logo 01' },
    { id: 'partner-2', label: 'Ecosystem Foundation', slot: 'Partner Logo 02' },
    { id: 'partner-3', label: 'Clean Tech Accelerator', slot: 'Partner Logo 03' },
    { id: 'partner-4', label: 'Artisan Alliance', slot: 'Partner Logo 04' },
    { id: 'partner-5', label: 'Circular Materials Forum', slot: 'Partner Logo 05' }
  ];

  return (
    <section className="py-10 sm:py-14 lg:py-16 border-b border-line/60 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...motionProps} className="text-center space-y-2 mb-8">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-text-muted font-semibold">
            {t('partners.eyebrow', 'Incubated at & Supported by')}
          </p>
          <p className="text-xs text-text-secondary max-w-md mx-auto">
            Partner and institutional support slots (placeholder slots; real partner SVGs can be dropped here).
          </p>
        </motion.div>

        {/* Responsive Logo Strip / Marquee */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 items-center">
          {partnerSlots.map((p) => (
            <div
              key={p.id}
              className="h-20 rounded-2xl border border-dashed border-line hover:border-primary/50 bg-surface-raised hover:bg-surface-accent transition flex flex-col items-center justify-center p-3 text-center group cursor-default"
              title={`${p.label} - Placeholder slot ready for SVG logo`}
            >
              <Building2 className="w-4 h-4 text-text-muted group-hover:text-primary transition mb-1" />
              <span className="text-[11px] font-mono font-medium text-text-secondary group-hover:text-heading truncate max-w-full">
                {p.slot}
              </span>
              <span className="text-[9px] text-text-muted truncate max-w-full">
                {p.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

