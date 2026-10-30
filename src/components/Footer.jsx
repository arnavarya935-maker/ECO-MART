import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  CheckCircle2,
  ArrowUp,
  MessageCircle,
  MapPin,
  Clock
} from 'lucide-react';
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
      {/* Organic Wave Curve Transition into Deep Forest Footer */}
      <div className="w-full overflow-hidden leading-none select-none pointer-events-none -mb-1 mt-16 sm:mt-24">
        <svg
          viewBox="0 0 1440 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-12 sm:h-16 lg:h-24 block text-[#072418] fill-current"
          preserveAspectRatio="none"
        >
          <path
            d="M0,96 C240,32 540,8 840,40 C1080,66 1280,88 1440,96 L1440,96 L0,96 Z"
          />
          <path
            d="M0,96 C240,32 540,8 840,40 C1080,66 1280,88 1440,96"
            stroke="rgba(52, 211, 153, 0.35)"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      <footer className="relative isolate overflow-hidden bg-gradient-to-b from-[#072418] via-[#051A11] to-[#030E09] text-emerald-100/90 transition-colors">
        {/* Soft Ambient Radial Emerald Glow */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(16,185,129,0.18),transparent)]"
          aria-hidden="true"
        />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-4">
          {/* Responsive 4-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
            {/* Column 1: Brand & Manifesto */}
            <div className="space-y-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2.5 group select-none py-1 focus-visible:outline-2 focus-visible:outline-focus rounded-xl"
                aria-label="Eco Sense Home"
              >
                <img
                  src="/images/logo-dark.png"
                  alt="Eco Sense - Shop with purpose"
                  width="140"
                  height="43"
                  className="h-10 sm:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                />
              </Link>

              <p className="text-[13px] leading-[1.5] font-sans text-emerald-100/75 max-w-sm">
                An open-source eco-shopping platform and academic initiative. Making thoughtful, circular living effortless with transparent lifecycle scoring.
              </p>

              {/* Social Icons */}
              <div className="pt-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-300/80 block mb-2.5">
                  Follow Our Movement
                </span>
                <div className="flex items-center gap-2.5">
                  {[
                    { label: 'Instagram', icon: InstagramIcon, href: '#instagram' },
                    { label: 'Twitter', icon: TwitterIcon, href: '#twitter' },
                    { label: 'LinkedIn', icon: LinkedinIcon, href: '#linkedin' },
                    { label: 'GitHub', icon: GithubIcon, href: '#github' }
                  ].map((s) => {
                    const Icon = s.icon;
                    return (
                      <a
                        key={s.label}
                        href={s.href}
                        aria-label={`Visit our ${s.label} profile`}
                        className="w-9 h-9 rounded-full border border-white/10 bg-white/5 hover:bg-emerald-500/20 hover:border-emerald-400/40 text-emerald-200 hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-soft-xs min-h-[36px] min-w-[36px]"
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Column 2: Trust & Legal */}
            <div className="space-y-4">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                Trust &amp; Legal
              </p>
              <ul className="space-y-2 text-[13px] leading-[1.5] font-sans text-emerald-100/75">
                <li>
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent('open-privacy-center'))}
                    className="hover:text-emerald-300 hover:translate-x-0.5 transition-all py-1 text-left cursor-pointer"
                  >
                    Privacy Policy &amp; Data Rights
                  </button>
                </li>
                <li>
                  <Link to="/how-it-works" className="hover:text-emerald-300 hover:translate-x-0.5 transition-all py-1 inline-block">
                    Terms of Service &amp; Fair Use
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-emerald-300 hover:translate-x-0.5 transition-all py-1 inline-block">
                    Refund &amp; Return Policy
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent('open-accessibility-center'))}
                    className="hover:text-emerald-300 hover:translate-x-0.5 transition-all py-1 text-left cursor-pointer"
                  >
                    Accessibility Center &amp; WCAG AA
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent('open-feedback-inbox'))}
                    className="hover:text-emerald-300 hover:translate-x-0.5 transition-all py-1 text-left cursor-pointer"
                  >
                    Community Feedback &amp; Suggestions
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact Block */}
            <div className="space-y-4">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                Contact &amp; Origin
              </p>
              <div className="space-y-3 text-[13px] leading-[1.5] text-emerald-100/75">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Bangalore, Karnataka, India</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <a href="mailto:contact@ecosense.eco" className="hover:text-emerald-300 hover:underline">
                    contact@ecosense.eco
                  </a>
                </div>
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Mon–Fri: 9:00 AM – 6:00 PM IST</span>
                </div>
              </div>
            </div>

            {/* Column 4: Newsletter Signup */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                  Stay Conscious
                </p>
                <button
                  type="button"
                  onClick={scrollToTop}
                  aria-label="Back to top"
                  className="w-9 h-9 rounded-full border border-white/15 bg-white/5 hover:bg-emerald-500/20 hover:border-emerald-400/40 flex items-center justify-center text-emerald-300 hover:text-white transition cursor-pointer shadow-soft-xs min-h-[36px] min-w-[36px]"
                  title="Scroll to top"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[13px] leading-[1.5] text-emerald-100/75">
                Receive our bi-weekly dispatch on zero-waste packaging, ingredient transparency, and new artisan additions.
              </p>

              {newsletterSubscribed ? (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-white text-[13px] leading-[1.4] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>You are subscribed! Thank you.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2.5">
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-300/60" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 min-h-[44px] text-[13px] leading-[1.4] font-sans bg-white/10 rounded-xl border border-white/20 focus:outline-2 focus:outline-emerald-400 text-white placeholder:text-emerald-200/50"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 min-h-[44px] px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-forest-950 text-[13px] font-mono font-bold uppercase tracking-wider transition cursor-pointer shadow-soft-sm hover:shadow-soft-md"
                  >
                    Join Newsletter
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Bottom Copyright Row */}
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[13px] leading-[1.4] font-sans text-emerald-200/60 gap-4">
            <div>
              © 2026 Eco Sense Project. All rights reserved.
            </div>
            <div className="flex flex-wrap items-center gap-4 text-[13px] font-sans text-emerald-100/70">
              <Link to="/shop" className="hover:text-emerald-300 transition py-1">Shop</Link>
              <Link to="/truth-lab" className="hover:text-emerald-300 transition py-1">Truth Lab</Link>
              <Link to="/how-it-works" className="hover:text-emerald-300 transition py-1">How It Works</Link>
              <Link to="/settings" className="hover:text-emerald-300 transition py-1">Settings</Link>
            </div>
          </div>
        </div>

        {/* Large Eco Sense Low-Contrast Wordmark */}
        <div className="w-full overflow-hidden select-none pointer-events-none mt-6 pb-8 text-center px-4" aria-hidden="true">
          <p className="font-sans font-black tracking-tight text-[clamp(2.8rem,11vw,11.5rem)] text-white/[0.04] leading-none uppercase truncate">
            <span>ECO SENSE</span>
            <span className="text-[0.25em] align-super text-emerald-400/30 ml-2">®</span>
          </p>
        </div>
      </footer>

      {/* Floating WhatsApp / Chat Button Bottom-Right */}
      <div className="fixed bottom-20 sm:bottom-6 right-5 z-40">
        <button
          type="button"
          onClick={() => setIsAgentOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 min-h-[44px] rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-soft-lg hover:shadow-soft-xl transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-focus border border-emerald-400/30"
          aria-label="Open Eco Sense Chat & Instant Assistance"
        >
          <MessageCircle className="w-4 h-4 text-white" />
          <span className="text-[13px] font-semibold font-sans tracking-wide">
            Chat with Eco Agent
          </span>
        </button>
      </div>
    </>
  );
}
