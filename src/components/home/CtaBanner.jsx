import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tag, ArrowRight, Check, Copy } from 'lucide-react';
import { useT } from '../../context/I18nContext';
import { useTheme } from '../../context/ThemeContext';

export default function CtaBanner() {
  const { t } = useT();
  const { reduceEffects } = useTheme();
  const [copied, setCopied] = useState(false);

  const couponCode = 'PURPOSE20';

  const copyCoupon = () => {
    try {
      navigator.clipboard.writeText(couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
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
    <section className="relative overflow-hidden py-20 sm:py-28 my-4 border-y border-line">
      {/* Background Image with Dark Nature Backdrop */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/products/kit-01-1200.webp"
          alt=""
          width="1600"
          height="900"
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        {/* Multilayer gradient for contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/95 via-forest-900/90 to-forest-950/95" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8">
        <motion.div {...motionProps} className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-mono font-medium">
            <Tag className="w-3.5 h-3.5 text-primary" />
            <span>Welcome Offer · New Shoppers</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight leading-tight text-balance">
            Begin your transition to a lighter, circular footprint.
          </h2>

          <p className="text-sm sm:text-base font-sans text-forest-100 max-w-2xl mx-auto leading-relaxed">
            Every conscious swap removes single-use plastic and synthetic chemical runoff from our shared waterways.
            Join thousands of mindful households today.
          </p>

          {/* Coupon Code Line with Click-to-Copy */}
          <div className="pt-2">
            <div className="inline-flex items-center gap-3 p-2 pl-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm">
              <span>Use voucher for 20% off your initial swap:</span>
              <button
                type="button"
                onClick={copyCoupon}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white font-mono font-bold hover:bg-primary-hover transition cursor-pointer shadow-soft-xs"
                title="Click to copy coupon code"
              >
                <span>{couponCode}</span>
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 opacity-80" />}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-forest-900 hover:bg-forest-50 text-sm font-semibold shadow-soft-lg hover:shadow-soft-xl transition cursor-pointer min-h-[48px]"
            >
              <span>{t('cta.register', 'Register & Claim Offer')}</span>
              <ArrowRight className="w-4 h-4 text-primary" />
            </Link>

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white text-sm font-semibold transition cursor-pointer min-h-[48px]"
            >
              <span>Browse Catalog First</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
