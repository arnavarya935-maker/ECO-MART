import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShieldCheck, Zap, Mail, CheckCircle2, Award } from 'lucide-react';

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

  return (
    <footer className="mt-24 border-t border-line bg-surface-sunken text-secondary transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Manifesto (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-heading text-surface-raised flex items-center justify-center font-bold shadow-soft-sm">
                <Leaf className="w-5 h-5 text-primary" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-heading">
                Eco<span className="text-primary italic">Mart</span>
              </span>
            </div>

            <p className="text-sm font-sans text-secondary max-w-md leading-relaxed">
              Every item in our collection is rigorously vetted for life cycle sustainability, zero single-use plastics, and verified ethical sourcing. Making thoughtful, restorative consumption effortless.
            </p>

            {/* Trust Marks */}
            <div className="pt-2 flex flex-wrap gap-2 text-xs font-sans font-medium">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-raised text-heading border border-line shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-primary" />
                Zero Plastic Packaging
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-raised text-heading border border-line shadow-2xs">
                <Award className="w-4 h-4 text-secondary" />
                Verified Impact Scores
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-raised text-heading border border-line shadow-2xs">
                <Zap className="w-4 h-4 text-warning" />
                100% Offline Capable
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-serif text-sm font-bold text-heading mb-4 tracking-tight">
              Curated Catalog
            </h4>
            <ul className="space-y-2.5 text-xs font-sans font-medium text-secondary">
              <li>
                <Link to="/shop" className="hover:text-heading transition">
                  Sustainable Catalog
                </Link>
              </li>
              <li>
                <Link to="/tools" className="hover:text-heading transition">
                  Starter Kits & Bundles
                </Link>
              </li>
              <li>
                <Link to="/impact" className="hover:text-heading transition">
                  Verified Impact Metrics
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-heading transition">
                  Community Collective
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-heading transition">
                  Methodology & Science
                </Link>
              </li>
            </ul>
          </div>

          {/* Scoring Methodology */}
          <div>
            <h4 className="font-serif text-sm font-bold text-heading mb-4 tracking-tight">
              Eco Score Formula
            </h4>
            <ul className="space-y-2 text-xs font-sans font-medium text-secondary">
              <li className="flex items-center justify-between">
                <span>Renewable Materials</span>
                <span className="font-semibold text-heading">30%</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Plastic-Free Pack</span>
                <span className="font-semibold text-heading">20%</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Carbon Savings</span>
                <span className="font-semibold text-heading">25%</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Certifications</span>
                <span className="font-semibold text-heading">15%</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Regional Sourcing</span>
                <span className="font-semibold text-heading">10%</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Field */}
          <div>
            <h4 className="font-serif text-sm font-bold text-heading mb-4 tracking-tight">
              Stay Conscious
            </h4>
            <p className="text-xs font-sans text-secondary mb-3 leading-relaxed">
              Curated seasonal guides, circular living tips, and new ethical artisan additions.
            </p>

            {newsletterSubscribed ? (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-surface-accent border border-primary/20 text-heading text-xs font-sans font-medium">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>You're subscribed! Thank you.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 min-h-[44px] text-xs font-sans bg-surface-raised rounded-2xl border border-line focus:outline-2 focus:outline-focus text-text placeholder:text-muted"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 min-h-[44px] px-4 rounded-2xl bg-heading hover:bg-heading-hover text-surface-raised text-xs font-sans font-medium transition cursor-pointer shadow-soft-sm"
                >
                  Join Newsletter
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between text-xs font-sans text-muted gap-4">
          <div>
            © 2026 EcoMart. Mindful, transparent, circular lifestyle.
          </div>
          <div className="flex flex-wrap items-center gap-2 text-heading font-medium">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Autonomous EcoAgent Engine v3.0 Active</span>
            <span className="px-2 py-0.5 rounded-full bg-surface text-[10px] text-muted border border-line font-mono">
              v1.2.0-offline (Build: 2026.10)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

