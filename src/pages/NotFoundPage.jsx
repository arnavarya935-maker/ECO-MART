import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage({ setActivePage }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6 animate-fadeIn">
      <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center mx-auto text-5xl">
        🌱
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full">
          Error 404 • Page Not Found
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100">
          Lost in the Canopy?
        </h1>
        <p className="text-sm text-stone-500 max-w-md mx-auto">
          The page or product you're looking for doesn't exist or has been relocated to another branch of our ecosystem.
        </p>
      </div>

      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={() => setActivePage('home')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </button>
        <button
          type="button"
          onClick={() => setActivePage('shop')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs hover:bg-stone-100 dark:hover:bg-stone-800 transition"
        >
          <span>Explore Catalog</span>
        </button>
      </div>
    </div>
  );
}
