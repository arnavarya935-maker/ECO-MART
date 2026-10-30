import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, MessageCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function TestimonialsCarousel() {
  const { reduceEffects } = useTheme();

  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Community reflections from zero-waste households
  const testimonialSlots = [
    {
      id: 'voice-1',
      author: 'Pooja Ramanathan',
      city: 'Bangalore, KA',
      category: 'Kitchen Essentials',
      quote: 'Switching our family kitchen to compostable coconut shell bowls and loofah scrubbers eliminated two full bags of plastic packaging every single week.'
    },
    {
      id: 'voice-2',
      author: 'Arjun Sundaram',
      city: 'Pune, MH',
      category: 'Daily Carry',
      quote: 'The hammered copper water bottle and bamboo travel cutlery stay in my backpack permanently. Six months in, I have not bought a single disposable bottle or plastic utensil.'
    },
    {
      id: 'voice-3',
      author: 'Dr. Kavitha Iyer',
      city: 'Chennai, TN',
      category: 'Personal Care & Laundry',
      quote: 'Natural soapnuts and solid shampoo bars replaced all commercial plastic surfactant bottles in our home. Gentle on sensitive skin and safe for our wastewater.'
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
            Real stories and reflections from shoppers making sustainable swaps in everyday life.
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

            <div className="space-y-3">
              <span className="inline-block px-3 py-1 rounded-full bg-surface-accent text-primary text-[10px] font-mono uppercase tracking-wider font-semibold">
                {testimonialSlots[currentIndex].category}
              </span>
              <h3 className="text-lg sm:text-xl font-serif italic text-heading max-w-xl mx-auto leading-relaxed">
                "{testimonialSlots[currentIndex].quote}"
              </h3>
            </div>

            <div className="pt-4 border-t border-line/60 flex items-center justify-between text-xs font-mono text-text-muted">
              <span className="font-bold text-heading">{testimonialSlots[currentIndex].author}</span>
              <span className="text-primary font-medium">{testimonialSlots[currentIndex].city}</span>
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
