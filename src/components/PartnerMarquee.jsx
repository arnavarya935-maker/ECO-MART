import React from 'react';

const PARTNERS = [
  { name: 'GOTS Organic', code: 'Global Organic Textile Standard', icon: '🌿' },
  { name: 'FSC Certified', code: '100% Responsibly Managed Forestry', icon: '🌲' },
  { name: 'Fair Trade India', code: 'Direct-to-Artisan Guaranteed Pay', icon: '🤝' },
  { name: 'Plastic-Free Trust', code: 'Zero Synthetic Polymers Audited', icon: '🚯' },
  { name: 'India Organic', code: 'NPOP Agricultural Certified', icon: '🇮🇳' },
  { name: 'Cruelty-Free Leaping', code: '100% Vegan & Never Animal Tested', icon: '🐰' },
  { name: 'Carbon Neutral Standard', code: 'Lifecycle Diverted & Offset', icon: '🌍' }
];

export default function PartnerMarquee() {
  return (
    <div className="py-8 bg-stone-50/80 dark:bg-stone-900/60 border-y border-stone-200/80 dark:border-stone-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-3 text-center">
        <span className="text-[11px] font-black uppercase tracking-widest text-stone-600 dark:text-stone-400">
          Independently Audited Certifications & Ethical Standards
        </span>
      </div>

      <div className="relative w-full overflow-x-auto no-scrollbar py-2">
        <div className="flex items-center gap-6 justify-center min-w-max px-4">
          {PARTNERS.map((p, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-700/80 shadow-2xs hover:border-emerald-400 transition"
            >
              <span className="text-xl">{p.icon}</span>
              <div>
                <div className="text-xs font-black text-stone-900 dark:text-stone-100">{p.name}</div>
                <div className="text-[10px] text-stone-500 dark:text-stone-400">{p.code}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
