import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle2 } from 'lucide-react';

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
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 mb-2">
          <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-primary bg-primary-subtle px-3 py-1 rounded-full border border-primary/20">
            Stories of Conscious Living
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted bg-surface-sunken border border-line px-2 py-0.5 rounded-full">
            Demo Data
          </span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-heading tracking-tight">
          Loved by Mindful Shoppers & Artisans
        </h2>
      </div>

      <div className="relative p-8 sm:p-12 rounded-3xl bg-surface-raised border border-line shadow-soft-lg transition-all">
        <Quote className="w-12 h-12 text-primary/10 absolute top-6 left-6" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-5">
          <div className="flex items-center gap-1">
            {Array.from({ length: t.rating }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-accent text-accent" />
            ))}
          </div>

          <p className="font-serif italic text-lg sm:text-xl text-heading max-w-2xl font-normal leading-relaxed">
            "{t.quote}"
          </p>

          <div className="flex flex-col items-center space-y-1 pt-2">
            <div className="w-14 h-14 rounded-full bg-surface-sunken border border-line flex items-center justify-center text-2xl shadow-soft-sm">
              {t.avatar}
            </div>
            <div className="font-sans font-bold text-sm text-heading mt-2">
              {t.name}
            </div>
            <div className="text-xs font-sans text-muted">
              {t.role}
            </div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-sans font-medium text-primary bg-primary-subtle px-3 py-1 rounded-full mt-1 border border-primary/20">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              <span>{t.impact} • {t.verified}</span>
            </div>
          </div>
        </div>

        {/* Navigation Arrows with min 44px targets */}
        <div className="flex items-center justify-between absolute inset-x-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <button
            type="button"
            onClick={() => setCurrent((prev) => (prev > 0 ? prev - 1 : TESTIMONIALS.length - 1))}
            className="pointer-events-auto min-w-[44px] min-h-[44px] rounded-full bg-surface-raised border border-line shadow-soft-sm text-secondary hover:text-heading hover:bg-surface-sunken flex items-center justify-center cursor-pointer transition"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setCurrent((prev) => (prev + 1) % TESTIMONIALS.length)}
            className="pointer-events-auto min-w-[44px] min-h-[44px] rounded-full bg-surface-raised border border-line shadow-soft-sm text-secondary hover:text-heading hover:bg-surface-sunken flex items-center justify-center cursor-pointer transition"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                current === i ? 'w-6 bg-primary' : 'w-2 bg-line hover:bg-muted'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

