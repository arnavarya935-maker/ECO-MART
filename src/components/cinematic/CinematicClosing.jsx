import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Sparkles, ShieldCheck } from 'lucide-react';
import { useT } from '../../context/I18nContext';
import { useCart } from '../../context/CartContext';
import RevealMotion from './RevealMotion';

export default function CinematicClosing() {
  const { lang } = useT();
  const { setIsAgentOpen } = useCart();

  return (
    <section
      id="chapter-04"
      className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-line/60"
      aria-label="Chapter 04: Take Action"
    >
      {/* Chapter Section Header with Hairline Rule */}
      <RevealMotion delay={0}>
        <div className="flex items-center gap-4 mb-12">
          <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-primary whitespace-nowrap">
            04 — Take Action
          </span>
          <div className="h-px bg-line flex-1" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted px-2 py-0.5 rounded bg-surface-raised border border-line">
            Next Step
          </span>
        </div>
      </RevealMotion>

      {/* Main Closing Call to Action Container */}
      <div className="relative rounded-3xl bg-surface-raised/80 border border-line p-8 sm:p-14 lg:p-16 shadow-soft-lg backdrop-blur-md overflow-hidden text-center max-w-4xl mx-auto">
        {/* Subtle Ambient Radial Glow */}
        <div
          aria-hidden="true"
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none"
        />

        <RevealMotion delay={80}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-line text-[11px] font-mono uppercase tracking-widest text-primary mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Circular Shopping Helper</span>
          </div>
        </RevealMotion>

        <RevealMotion delay={160}>
          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-heading leading-[1.02] text-balance mb-6">
            {lang === 'hi' ? 'अपनी सूची से शुरुआत करें।' : 'Start with your list.'}
          </h2>
        </RevealMotion>

        <RevealMotion delay={240}>
          <p className="text-base sm:text-lg text-text-secondary max-w-xl mx-auto leading-relaxed font-light text-pretty mb-10">
            {lang === 'hi'
              ? 'अपनी नियमित खरीदारी सूची दर्ज करें और इको एजेंट को सेकंडों में सबसे साफ़ विकल्प खोजने दें।'
              : 'Paste your everyday grocery or household list. Our AI agent matches items to plastic-free alternatives and computes real diverted waste.'}
          </p>
        </RevealMotion>

        {/* Action Buttons */}
        <RevealMotion delay={320}>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/transform"
              className="min-h-[44px] px-8 py-3.5 rounded-full bg-primary text-primary-contrast font-bold text-sm flex items-center gap-2 hover:bg-primary-hover shadow-soft-md transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-focus"
            >
              <span>{lang === 'hi' ? 'सूची बदलें (Swap My List)' : 'Start with your list'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => setIsAgentOpen(true)}
              className="min-h-[44px] px-7 py-3.5 rounded-full bg-surface hover:bg-surface-sunken border border-line text-heading font-medium text-sm flex items-center gap-2 transition-all duration-200 hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
            >
              <Bot className="w-4 h-4 text-primary" />
              <span>{lang === 'hi' ? 'इको एजेंट से पूछें' : 'Chat with Eco Agent'}</span>
            </button>
          </div>
        </RevealMotion>

        {/* School Project Honest Sample Data Notice */}
        <div className="mt-12 pt-6 border-t border-line/60 flex items-center justify-center gap-2 text-xs font-sans text-text-muted">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span>Sample products for a school project. Prices and impact numbers are estimates.</span>
        </div>
      </div>
    </section>
  );
}
