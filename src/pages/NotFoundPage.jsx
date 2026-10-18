import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Store } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6 animate-fade-in pb-28">
      <div className="w-24 h-24 rounded-3xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto text-5xl border border-emerald-200/80 shadow-xs">
        🌱
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
          Error 404 • Page Not Found
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#0B3B2C]">
          Lost in the Canopy?
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
          The page or product you're looking for doesn't exist or has been relocated to another branch of our ecosystem.
        </p>
      </div>

      <div className="flex justify-center gap-3 pt-2">
        <Link
          to="/"
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-xs transition min-h-[44px]"
        >
          <Home className="w-4 h-4" />
          <span>Return to Home</span>
        </Link>
        <Link
          to="/shop"
          className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-extrabold text-xs shadow-2xs transition min-h-[44px]"
        >
          <Store className="w-4 h-4 text-emerald-700" />
          <span>Explore Catalog</span>
        </Link>
      </div>
    </div>
  );
}
