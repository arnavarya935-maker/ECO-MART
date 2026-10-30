import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  CheckCircle2,
  ArrowUp,
  MessageCircle,
  MapPin,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useT } from '../context/I18nContext';
import { useCart } from '../context/CartContext';

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TwitterIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
    </svg>
  );
}

function LinkedinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GithubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

export default function Footer() {
  const { t, lang } = useT();
  const { setIsAgentOpen } = useCart();
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
    <>
      <footer className="relative isolate overflow-hidden mt-20 border-t border-line bg-surface text-text-secondary transition-colors">
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
            {/* Column 1: Brand & Manifesto (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2.5 group select-none py-1 focus-visible:outline-2 focus-visible:outline-focus rounded-xl"
                aria-label="EcoSense Home"
              >
                <img
                  src="/images/logo.png"
                  alt="EcoSense - Shop with purpose"
                  width="140"
                  height="43"
                  className="h-10 sm:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-105 dark:hidden"
                />
                <img
                  src="/images/logo-dark.png"
                  alt="EcoSense - Shop with purpose"
                  width="140"
                  height="43"
                  className="h-10 sm:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-105 hidden dark:block"
                />
              </Link>

              <p className="text-xs sm:text-sm font-sans text-text-secondary max-w-sm leading-relaxed">
                {lang === 'hi'
                  ? 'स्कूल प्रोजेक्ट और जागरूक समुदाय के लिए नमूना उत्पाद। विचारशील, शून्य-अपशिष्ट जीवनशैली को सहज बनाना।'
                  : 'An open-source eco-shopping platform and academic initiative. Making thoughtful, circular living effortless with transparent lifecycle scoring.'}
              </p>

              {/* Social Icons */}
              <div className="pt-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-text-muted block mb-2.5">
                  Follow Our Movement
                </span>
                <div className="flex items-center gap-2">
                  {[
                    { label: 'Instagram', icon: InstagramIcon, href: 'https://instagram.com' },
                    { label: 'Twitter', icon: TwitterIcon, href: 'https://twitter.com' },
                    { label: 'LinkedIn', icon: LinkedinIcon, href: 'https://linkedin.com' },
                    { label: 'GitHub', icon: GithubIcon, href: 'https://github.com/arnavarya935-maker/ECO-MART' }
                  ].map((s) => {
                    const Icon = s.icon;
                    return (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={`Visit our ${s.label} profile`}
                        className="w-8 h-8 rounded-full border border-line bg-surface-raised hover:bg-surface-accent text-text-secondary hover:text-primary transition flex items-center justify-center cursor-pointer shadow-soft-xs"
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Column 2: Quick Links (3 cols) */}
            <div className="lg:col-span-3 space-y-4">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                Trust &amp; Legal
              </p>
              <ul className="space-y-2 text-xs font-sans text-text-secondary">
                <li>
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent('open-privacy-center'))}
                    className="hover:text-heading transition py-1 text-left cursor-pointer"
                  >
                    Privacy Policy &amp; Data Rights
                  </button>
                </li>
                <li>
                  <Link to="/how-it-works" className="hover:text-heading transition py-1 inline-block">
                    Terms of Service &amp; Fair Use
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-heading transition py-1 inline-block">
                    Refund &amp; Return Policy
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent('open-accessibility-center'))}
                    className="hover:text-heading transition py-1 text-left cursor-pointer"
                  >
                    Accessibility Center &amp; WCAG AA
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent('open-feedback-inbox'))}
                    className="hover:text-heading transition py-1 text-left cursor-pointer"
                  >
                    Community Feedback &amp; Suggestions
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact Block (2 cols) */}
            <div className="lg:col-span-2 space-y-3">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                Contact &amp; Origin
              </p>
              <div className="space-y-2.5 text-xs text-text-secondary leading-relaxed">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  <span>Bangalore, Karnataka, India</span>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  <a href="mailto:contact@ecomart.eco" className="hover:underline">
                    contact@ecomart.eco
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  <span>Mon–Fri: 9:00 AM – 6:00 PM IST</span>
                </div>
              </div>
            </div>

            {/* Column 4: Newsletter Signup (3 cols) */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                  Stay Conscious
                </p>
                <button
                  type="button"
                  onClick={scrollToTop}
                  aria-label="Back to top"
                  className="w-8 h-8 rounded-full border border-line bg-surface-raised flex items-center justify-center text-text-muted hover:text-heading hover:border-primary/50 transition cursor-pointer shadow-soft-xs"
                  title="Scroll to top"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed">
                Receive our bi-weekly dispatch on zero-waste packaging, ingredient transparency, and new artisan additions.
              </p>

              {newsletterSubscribed ? (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-surface-accent border border-primary/20 text-heading text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span>You are subscribed! Thank you.</span>
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
                    className="w-full py-2.5 min-h-[44px] px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-mono font-semibold uppercase tracking-wider transition cursor-pointer shadow-soft-xs"
                  >
                    Join Newsletter
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Bottom Copyright Row */}
          <div className="mt-12 pt-6 border-t border-line/60 flex flex-col sm:flex-row items-center justify-between text-xs font-sans text-text-muted gap-4">
            <div>
              © 2026 {lang === 'hi' ? 'इको सेंस' : 'EcoSense'} Project. All rights reserved.
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-sans text-text-secondary">
              <Link to="/shop" className="hover:text-heading transition">Shop</Link>
              <Link to="/truth-lab" className="hover:text-heading transition">Truth Lab</Link>
              <Link to="/how-it-works" className="hover:text-heading transition">How It Works</Link>
              <Link to="/settings" className="hover:text-heading transition">Settings</Link>
            </div>
          </div>
        </div>

        {/* Large low-contrast "ECOMART®" wordmark */}
        <div className="relative mt-12 sm:mt-16 pb-16 overflow-hidden select-none pointer-events-none" aria-hidden="true">
          <div className="text-center px-4">
            <p className="font-mono text-[clamp(3.5rem,14vw,14rem)] font-bold tracking-tighter text-text-muted/10 leading-none">
              <span>ECOMART</span>
              <span className="text-[0.25em] align-super text-primary/30">®</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp / Chat Button Bottom-Right */}
      <div className="fixed bottom-20 sm:bottom-6 right-5 z-40">
        <button
          type="button"
          onClick={() => setIsAgentOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-primary hover:bg-primary-hover text-white shadow-soft-lg hover:shadow-soft-xl transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-focus"
          aria-label="Open EcoMart Chat & Instant Assistance"
        >
          <MessageCircle className="w-4 h-4 text-white" />
          <span className="text-xs font-semibold font-sans tracking-wide">
            Chat with Eco Agent
          </span>
        </button>
      </div>
    </>
  );
}
