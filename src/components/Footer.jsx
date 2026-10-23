import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShieldCheck, Zap, Mail, CheckCircle2, Award, ArrowUp } from 'lucide-react';

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative isolate overflow-hidden mt-28 border-t border-line bg-surface text-secondary transition-colors">
      <div className="relative z-20 max-w-6xl mx-auto px-6 md:px-10 pt-16 md:pt-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-12">
          {/* Brand & Manifesto (5 cols on md) */}
          <div className="md:col-span-5 space-y-5">
            <Link to="/" className="inline-flex items-center gap-3 group focus-visible:outline-2 focus-visible:outline-focus rounded-xl">
              <div className="w-10 h-10 rounded-2xl bg-surface-raised border border-line text-primary flex items-center justify-center font-bold shadow-soft-sm group-hover:scale-105 transition-transform duration-200">
                <Leaf className="w-5 h-5 text-primary" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-heading">
                Eco<span className="text-primary italic">Mart</span>
              </span>
            </Link>

            <p className="text-sm font-sans text-text-secondary max-w-sm leading-relaxed text-pretty">
              Every item in our collection is audited for life-cycle environmental impact, zero single-use plastics, and verified ethical circularity. Making thoughtful, restorative consumption effortless.
            </p>

            {/* Trust Marks */}
            <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-raised text-heading border border-line text-[11px] uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                Zero Plastic
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-raised text-heading border border-line text-[11px] uppercase tracking-wider">
                <Award className="w-3.5 h-3.5 text-secondary" />
                Verified Impact
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-raised text-heading border border-line text-[11px] uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                100% Offline
              </span>
            </div>
          </div>

          {/* Quick Navigation (2 cols) */}
          <nav aria-label="Footer Index" className="md:col-span-2 md:col-start-7">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted mb-5">
              Index
            </p>
            <ul className="space-y-2.5 text-xs font-sans font-medium text-text-secondary">
              <li>
                <Link to="/shop" className="ln-sweep hover:text-heading transition py-1 inline-block min-h-[32px]">
                  Sustainable Catalog
                </Link>
              </li>
              <li>
                <Link to="/transform" className="ln-sweep hover:text-heading transition py-1 inline-block min-h-[32px]">
                  Cart Transformer
                </Link>
              </li>
              <li>
                <Link to="/eco-check" className="ln-sweep hover:text-heading transition py-1 inline-block min-h-[32px]">
                  Eco Check Audit
                </Link>
              </li>
              <li>
                <Link to="/tools" className="ln-sweep hover:text-heading transition py-1 inline-block min-h-[32px]">
                  Eco Tools & Kits
                </Link>
              </li>
              <li>
                <Link to="/impact" className="ln-sweep hover:text-heading transition py-1 inline-block min-h-[32px]">
                  Verified Metrics
                </Link>
              </li>
            </ul>
          </nav>

          {/* Methodology & Science (2 cols) */}
          <div className="md:col-span-2">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted mb-5">
              Methodology
            </p>
            <ul className="space-y-2 text-xs font-mono text-text-secondary">
              <li className="flex items-center justify-between py-0.5">
                <span>Renewable Material</span>
                <span className="text-primary font-bold">30%</span>
              </li>
              <li className="flex items-center justify-between py-0.5">
                <span>Plastic Elimination</span>
                <span className="text-primary font-bold">20%</span>
              </li>
              <li className="flex items-center justify-between py-0.5">
                <span>Carbon Reduction</span>
                <span className="text-primary font-bold">25%</span>
              </li>
              <li className="flex items-center justify-between py-0.5">
                <span>Certifications</span>
                <span className="text-primary font-bold">15%</span>
              </li>
              <li className="flex items-center justify-between py-0.5">
                <span>Local Supply Chain</span>
                <span className="text-primary font-bold">10%</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Field & Back to top (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
                Stay Conscious
              </p>
              <button
                type="button"
                onClick={scrollToTop}
                aria-label="Back to top"
                className="w-9 h-9 rounded-full border border-line bg-surface-raised flex items-center justify-center text-text-muted hover:text-heading hover:border-primary/50 transition cursor-pointer"
                title="Scroll to top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs font-sans text-text-secondary leading-relaxed">
              Curated seasonal guides, circular living tips, and new ethical artisan additions.
            </p>

            {newsletterSubscribed ? (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-accent border border-primary/20 text-heading text-xs font-sans font-medium">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>You're subscribed! Thank you.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 min-h-[44px] text-xs font-sans bg-surface-raised rounded-xl border border-line focus:outline-2 focus:outline-focus text-text placeholder:text-text-muted"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 min-h-[44px] px-4 rounded-xl liquid-pill-emerald text-xs font-mono font-semibold uppercase tracking-wider transition cursor-pointer"
                >
                  Join Newsletter
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar Info */}
        <div className="mt-14 pt-6 border-t border-line/60 flex flex-col sm:flex-row items-center justify-between text-xs font-sans text-text-muted gap-4">
          <div>
            © 2026 EcoMart. Mindful, transparent, circular lifestyle.
          </div>
          <div className="flex flex-wrap items-center gap-2 text-heading font-medium">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[11px]">Autonomous EcoAgent Engine v3.0 Active</span>
            <span className="px-2 py-0.5 rounded-full bg-surface-raised text-[10px] text-text-muted border border-line font-mono">
              100% Offline Native
            </span>
          </div>
        </div>
      </div>

      {/* Monumental ECOMART Wordmark with Emerald Planet Glow */}
      <div className="relative mt-16 md:mt-24 pb-8 overflow-hidden">
        <div className="relative z-10 overflow-hidden px-[4vw]" aria-hidden="true">
          <p className="ft-mark text-[clamp(4.2rem,15vw,18rem)]">
            <span className="ft-char tracking-tighter">ECOMART</span>
            <span className="text-primary text-[0.25em] align-super ml-1 font-mono font-bold">®</span>
          </p>
        </div>
        <div className="relative h-[clamp(6rem,14vw,12rem)]">
          <div className="ft-glow" aria-hidden="true" />
          <div className="ft-planet" aria-hidden="true" />
        </div>
      </div>
    </footer>
  );
}

