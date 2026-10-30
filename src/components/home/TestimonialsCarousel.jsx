import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, MessageCircle } from 'lucide-react';
import { useT } from '../../context/I18nContext';
import { useTheme } from '../../context/ThemeContext';

export default function TestimonialsCarousel() {
  const { t } = useT();
  const { reduceEffects } = useTheme();

  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Honest illustrative slots (Zero invented quotes or fake names)
  const testimonialSlots = [
    {
      id: 'slot-1',
      slotTitle: 'Community Voice Slot #1',
      badge: 'Illustrative Slot · Ready for User Input',
      prompt: 'Share how switching to compostable kitchen staples eliminated plastic waste from your countertop routines.',
      category: 'Kitchen Essentials'
    },
    {
      id: 'slot-2',
      slotTitle: 'Community Voice Slot #2',
      badge: 'Illustrative Slot · Ready for User Input',
      prompt: 'Reflect on personal care bars, natural deodorants, and toxin-free bathroom swaps.',
      category: 'Personal Care'
    },
    {
      id: 'slot-3',
      slotTitle: 'Community Voice Slot #3',
      badge: 'Illustrative Slot · Ready for User Input',
      prompt: 'Experience notes on organic cotton textiles, longevity in wash cycles, and plastic-free laundry.',
      category: 'Circular Fashion'
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonialSlots.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonialSlots.length) % testimonialSlots.length);
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      nextSlide();
    } else if (touchEndX.current - touchStartX.current > 50) {
      prevSlide();
    }
  };

  const motionProps = reduceEffects
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
      };

  return (
    <section
      className="py-16 sm:py-24 border-b border-line/60 bg-surface"
      role="region"
      aria-roledescription="carousel"
      aria-label="Community Testimonials"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...motionProps} className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-accent border border-primary/20 text-primary text-xs font-mono font-semibold">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Community Perspectives</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-sans font-bold text-heading tracking-tight">
            Voices for Thoughtful Consumption
          </h2>
          <p className="text-sm font-sans text-text-secondary leading-relaxed">
            Honest reflection slots for authentic community reviews.
            (Accessible carousel template with keyboard arrow &amp; touch swipe support).
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div
          className="relative max-w-3xl mx-auto"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Active Testimonial Card */}
          <div className="p-8 sm:p-12 rounded-3xl bg-surface-raised border border-line/80 shadow-soft-sm relative overflow-hidden text-center space-y-6">
            <Quote className="w-10 h-10 text-primary/20 mx-auto" aria-hidden="true" />

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-surface-accent text-primary text-[10px] font-mono uppercase tracking-wider font-semibold">
                {testimonialSlots[currentIndex].badge}
              </span>
              <h3 className="text-xl sm:text-2xl font-serif italic text-heading max-w-xl mx-auto leading-relaxed">
                "{testimonialSlots[currentIndex].prompt}"
              </h3>
            </div>

            <div className="pt-4 border-t border-line/60 flex items-center justify-between text-xs font-mono text-text-muted">
              <span>{testimonialSlots[currentIndex].slotTitle}</span>
              <span className="text-primary font-semibold">{testimonialSlots[currentIndex].category}</span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-6">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous testimonial"
              className="p-2.5 rounded-full border border-line bg-surface-raised hover:bg-surface text-heading transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center shadow-soft-xs focus-visible:outline-2 focus-visible:outline-focus"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Pagination Indicators */}
            <div className="flex items-center gap-2">
              {testimonialSlots.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to testimonial ${idx + 1}`}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx ? 'w-8 bg-primary' : 'w-2 bg-line hover:bg-text-muted'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next testimonial"
              className="p-2.5 rounded-full border border-line bg-surface-raised hover:bg-surface text-heading transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center shadow-soft-xs focus-visible:outline-2 focus-visible:outline-focus"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
