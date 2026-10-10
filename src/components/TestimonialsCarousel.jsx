import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle2, ShieldCheck } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Ananya Sharma',
    role: 'Zero-Waste Homemaker, Bengaluru',
    avatar: '👩🏽‍🌾',
    rating: 5,
    quote: 'EcoMart changed our daily routine completely. The swap finder helped us replace cling film with beeswax wraps and shampoo bottles with bars—saving nearly 18kg of plastic in our first 6 months!',
    impact: '18.4 kg plastic eliminated',
    verified: 'Verified Eco Shopper'
  },
  {
    id: 2,
    name: 'Rohan Mehra',
    role: 'Sustainable Design Architect, Mumbai',
    avatar: '👨🏽‍💼',
    rating: 5,
    quote: 'The 0-100 Eco-Score is brilliantly transparent. Instead of greenwashing buzzwords, you see the exact water litres and carbon footprint right on the product card.',
    impact: '142 kg CO₂ avoided',
    verified: 'Eco Level 4 Member'
  },
  {
    id: 3,
    name: 'Meenakshi Sundaram',
    role: 'Artisan Cooperative Lead, Tamil Nadu',
    avatar: '👵🏽',
    rating: 5,
    quote: 'EcoMart brings our handwoven cotton totes directly to mindful customers across the country with fair compensation and zero plastic packaging along the way.',
    impact: '42 artisan families supported',
    verified: 'Fair Trade Artisan Partner'
  }
];

export default function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const t = TESTIMONIALS[current];

  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-full">
          Stories of Conscious Living
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 mt-2">
          Loved by Shoppers & Artisans Alike
        </h2>
      </div>

      <div className="relative p-8 sm:p-12 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-xl transition-all">
        <Quote className="w-12 h-12 text-emerald-500/20 absolute top-6 left-6" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-5">
          <div className="flex items-center gap-1">
            {Array.from({ length: t.rating }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>

          <p className="text-base sm:text-lg text-stone-800 dark:text-stone-200 italic max-w-2xl font-medium leading-relaxed">
            "{t.quote}"
          </p>

          <div className="flex flex-col items-center space-y-1 pt-2">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-2xl shadow-xs">
              {t.avatar}
            </div>
            <div className="font-black text-sm text-stone-900 dark:text-stone-100 mt-2">
              {t.name}
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400">
              {t.role}
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full mt-1 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3 h-3" />
              <span>{t.impact} • {t.verified}</span>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center justify-between absolute inset-x-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <button
            type="button"
            onClick={() => setCurrent((prev) => (prev > 0 ? prev - 1 : TESTIMONIALS.length - 1))}
            className="pointer-events-auto p-2 rounded-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-md text-stone-700 dark:text-stone-300 hover:bg-stone-50"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setCurrent((prev) => (prev + 1) % TESTIMONIALS.length)}
            className="pointer-events-auto p-2 rounded-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-md text-stone-700 dark:text-stone-300 hover:bg-stone-50"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${
                current === i ? 'w-6 bg-emerald-600' : 'w-2 bg-stone-300 dark:bg-stone-700'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
