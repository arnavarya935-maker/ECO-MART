import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Shuffle, Sliders, ShieldCheck, BarChart3, ArrowRight } from 'lucide-react';
import { useT } from '../../context/I18nContext';
import RevealMotion from './RevealMotion';

const PLATES = [
  {
    num: '01',
    title: 'Understand',
    titleHi: 'समझें',
    desc: 'Scans ingredients, barcodes, and claim phrases for misleading greenwash terms.',
    descHi: 'भ्रामक दावों और सामग्री को पकड़ने के लिए बारकोड और लेबल स्कैन करता है।',
    path: '/scan',
    icon: Camera,
    tag: 'Input Analysis'
  },
  {
    num: '02',
    title: 'Match',
    titleHi: 'मिलान करें',
    desc: 'Pairs high-impact everyday goods with locally crafted, plastic-free alternatives.',
    descHi: 'रोज़मर्रा के अधिक प्रदूषण वाले सामान को स्थानीय पर्यावरण-अनुकूल विकल्पों से जोड़ता है।',
    path: '/shop',
    icon: Shuffle,
    tag: 'Catalog Mapping'
  },
  {
    num: '03',
    title: 'Optimise',
    titleHi: 'अनुकूलित करें',
    desc: 'Transforms entire shopping lists and recipes into conscious bundles in one tap.',
    descHi: 'पूरी खरीदारी सूची को एक क्लिक में टिकाऊ टोकरी में बदल देता है।',
    path: '/transform',
    icon: Sliders,
    tag: 'List Transformer'
  },
  {
    num: '04',
    title: 'Explain',
    titleHi: 'स्पष्टीकरण',
    desc: 'Exposes deterministic multi-agent reasoning, algorithmic weights, and guardrails.',
    descHi: 'AI के निर्णय के पीछे के नियम, निष्पक्षता और सुरक्षा प्रोटोकॉल दिखाता है।',
    path: '/truth-lab',
    icon: ShieldCheck,
    tag: 'Transparent AI'
  },
  {
    num: '05',
    title: 'Share',
    titleHi: 'प्रभाव साझा करें',
    desc: 'Tallies real diverted grams of plastic and carbon savings in a verifiable ledger.',
    descHi: 'बचाए गए प्लास्टिक और कम किए गए कार्बन का सटीक हिसाब दर्ज करता है।',
    path: '/impact',
    icon: BarChart3,
    tag: 'Impact Ledger'
  }
];

export default function CinematicAtlas() {
  const { lang } = useT();

  return (
    <section
      id="chapter-03"
      className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-line/60"
      aria-label="Chapter 03: How Eco Sense Works"
    >
      {/* Chapter Section Header with Hairline Rule */}
      <RevealMotion delay={0}>
        <div className="flex items-center gap-4 mb-8">
          <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-primary whitespace-nowrap">
            03 — How Eco Sense Works
          </span>
          <div className="h-px bg-line flex-1" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted px-2 py-0.5 rounded bg-surface-raised border border-line">
            Five-Stage Atlas
          </span>
        </div>
      </RevealMotion>

      {/* Section Headline */}
      <div className="max-w-3xl mb-12">
        <RevealMotion delay={80}>
          <h2 className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-tight text-heading leading-[1.08] text-balance">
            {lang === 'hi' ? 'इको सेंस कैसे काम करता है।' : 'How Eco Sense works.'}
          </h2>
        </RevealMotion>
        <RevealMotion delay={160}>
          <p className="mt-3 text-sm sm:text-base text-text-secondary leading-relaxed font-light">
            {lang === 'hi'
              ? 'पैकेजिंग स्कैन से लेकर प्रमाणित विकल्प तक, पांच पारदर्शी चरणों की एक शृंखला।'
              : 'A transparent five-stage loop designed to turn everyday shopping into conscious climate action.'}
          </p>
        </RevealMotion>
      </div>

      {/* Five Numbered Plates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {PLATES.map((plate, idx) => {
          const Icon = plate.icon;

          return (
            <RevealMotion key={plate.num} delay={180 + idx * 70}>
              <Link
                to={plate.path}
                className="group relative h-full flex flex-col justify-between p-5 rounded-2xl bg-surface-raised/80 hover:bg-surface-raised border border-line hover:border-primary/50 transition-all duration-300 shadow-soft-xs hover:shadow-soft-md focus-visible:outline-2 focus-visible:outline-focus"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-primary px-2 py-0.5 rounded bg-surface border border-line">
                      {plate.num}
                    </span>
                    <Icon className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
                  </div>

                  <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
                    {plate.tag}
                  </span>

                  <h3 className="text-base font-bold text-heading mt-1 mb-2 group-hover:text-primary transition-colors">
                    {lang === 'hi' ? plate.titleHi : plate.title}
                  </h3>

                  <p className="text-xs text-text-secondary leading-relaxed font-light">
                    {lang === 'hi' ? plate.descHi : plate.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-line/60 flex items-center justify-between text-xs font-mono text-text-muted group-hover:text-primary transition-colors">
                  <span>Explore Stage</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </RevealMotion>
          );
        })}
      </div>
    </section>
  );
}
