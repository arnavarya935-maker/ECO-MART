import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Store } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6 animate-fade-in pb-28">
      <div className="w-20 h-20 rounded-3xl bg-surface-sunken text-heading flex items-center justify-center mx-auto text-4xl border border-line shadow-soft-xs">
        🌱
      </div>

      <div className="space-y-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-3.5 py-1 rounded-full inline-block">
          Error 404 • Page Not Found
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-heading tracking-tight">
          Lost in the Canopy?
        </h1>
        <p className="text-sm sm:text-base text-secondary max-w-md mx-auto leading-relaxed font-normal">
          The page or product you're looking for doesn't exist or has been relocated to another branch of our ecosystem.
        </p>
      </div>

      <div className="flex justify-center gap-3 pt-2">
        <Link
          to="/"
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary-hover text-primary-contrast font-medium text-xs shadow-soft-xs transition min-h-[44px]"
        >
          <Home className="w-4 h-4 text-accent" />
          <span>Return to Home</span>
        </Link>
        <Link
          to="/shop"
          className="flex items-center gap-2 px-6 py-3 rounded-full border border-line bg-surface hover:bg-surface-sunken text-heading font-medium text-xs shadow-soft-xs transition min-h-[44px]"
        >
          <Store className="w-4 h-4 text-primary" />
          <span>Explore Catalog</span>
        </Link>
      </div>
    </div>
  );
}
