import React, { useState } from 'react';
import { Mail, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';

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
    <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-950 to-stone-900 text-white shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto text-center space-y-4 relative z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-400/30">
          <Mail className="w-3.5 h-3.5 text-emerald-400" />
          <span>The Conscious Dispatch</span>
        </span>

        <h3 className="text-2xl sm:text-3xl font-black text-white">
          Weekly Zero-Waste Swaps & Artisan Stories
        </h3>

        <p className="text-xs sm:text-sm text-emerald-100/80 max-w-lg mx-auto font-medium">
          Receive curated seasonal produce guides, craft cluster highlights, and new product lifecycle audits. 100% offline-safe subscription.
        </p>

        {subscribed ? (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-xs font-bold text-emerald-300 flex items-center justify-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>You're subscribed! Your offline subscription token is saved safely in local storage.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto pt-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-stone-400 text-xs focus:outline-hidden focus:border-emerald-400 focus:bg-white/15"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs shadow-md transition active:scale-95 shrink-0 cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        )}

        <div className="flex items-center justify-center gap-4 text-[11px] text-stone-400 pt-2">
          <span>🔒 Zero spam</span>
          <span>•</span>
          <span>🌱 100% Offline-safe</span>
          <span>•</span>
          <span>Unsubscribe anytime</span>
        </div>
      </div>
    </div>
  );
}
