import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;

    try {
      const existing = JSON.parse(localStorage.getItem('eco_newsletter_subscribers') || '[]');
      if (!existing.includes(email.trim())) {
        existing.push(email.trim());
        localStorage.setItem('eco_newsletter_subscribers', JSON.stringify(existing));
      }
    } catch (err) {
      console.warn(err);
    }

    setSubscribed(true);
    setEmail('');
  };

  return (
    <div className="p-8 sm:p-10 rounded-3xl bg-primary text-primary-contrast shadow-soft-md border border-primary relative overflow-hidden">
      <div className="max-w-2xl mx-auto text-center space-y-4 relative z-10">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary-contrast/10 text-primary-contrast text-xs font-semibold uppercase tracking-wider border border-primary-contrast/20">
          <Mail className="w-3.5 h-3.5" />
          <span>The Conscious Dispatch</span>
        </span>

        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-primary-contrast tracking-tight">
          Weekly Zero-Waste Swaps & Artisan Stories
        </h3>

        <p className="text-xs sm:text-sm text-primary-contrast/80 max-w-lg mx-auto font-normal leading-relaxed">
          Receive curated seasonal produce guides, craft cluster highlights, and new product lifecycle audits. Local-first subscription simulation.
        </p>

        {subscribed ? (
          <div className="p-4 rounded-2xl bg-primary-contrast/10 border border-primary-contrast/30 text-xs font-medium text-primary-contrast flex items-center justify-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>You're subscribed! Your subscription preference is saved safely in local storage.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2.5 max-w-md mx-auto pt-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="w-full px-5 py-3 rounded-full bg-primary-contrast/10 border border-primary-contrast/20 text-primary-contrast placeholder:text-primary-contrast/50 text-xs focus:outline-2 focus:outline-focus focus:border-primary-contrast focus:bg-primary-contrast/15 min-h-[44px]"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-surface hover:bg-surface-raised text-primary font-bold text-xs shadow-soft-xs transition active:scale-95 shrink-0 cursor-pointer min-h-[44px] focus-visible:outline-2 focus-visible:outline-focus"
            >
              Subscribe
            </button>
          </form>
        )}

        <div className="flex items-center justify-center gap-3 text-[11px] text-primary-contrast/60 pt-2 font-normal">
          <span>🔒 Zero spam</span>
          <span>•</span>
          <span>🌱 Private & Local</span>
          <span>•</span>
          <span>Unsubscribe anytime</span>
        </div>
      </div>
    </div>
  );
}
