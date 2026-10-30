import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MessageSquare, ShieldCheck } from 'lucide-react';
import { useT } from '../../context/I18nContext';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductsContext';
import { useTheme } from '../../context/ThemeContext';
import EmptyState from '../ui/EmptyState';
import { INITIAL_COMMUNITY_REVIEWS } from '../../data/communityReviews';

export default function ReviewsSummary() {
  const { t } = useT();
  const { reviews } = useCart();
  const { products } = useProducts();
  const { reduceEffects } = useTheme();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('recent'); // 'recent' | 'helpful'

  // Flatten all community reviews, combining stored user reviews with catalog community reflections
  const allReviewsList = useMemo(() => {
    const merged = { ...INITIAL_COMMUNITY_REVIEWS };

    // Overlay user reviews from localStorage
    if (reviews && typeof reviews === 'object') {
      Object.entries(reviews).forEach(([prodId, list]) => {
        if (Array.isArray(list) && list.length > 0) {
          const existing = merged[prodId] || [];
          const combined = [...list];
          existing.forEach((item) => {
            if (!combined.some((c) => c.id === item.id)) {
              combined.push(item);
            }
          });
          merged[prodId] = combined;
        }
      });
    }

    const flattened = [];
    Object.entries(merged).forEach(([prodId, list]) => {
      if (Array.isArray(list)) {
        list.forEach((rev) => {
          flattened.push({
            ...rev,
            productId: prodId
          });
        });
      }
    });
    return flattened;
  }, [reviews]);

  // Compute aggregate statistics
  const stats = useMemo(() => {
    if (allReviewsList.length === 0) return null;
    const total = allReviewsList.length;
    const sum = allReviewsList.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
    const avg = (sum / total).toFixed(1);

    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    allReviewsList.forEach((r) => {
      const star = Math.max(1, Math.min(5, Math.round(Number(r.rating) || 5)));
      counts[star] = (counts[star] || 0) + 1;
    });

    return { total, avg, counts };
  }, [allReviewsList]);

  // Sort reviews according to tab
  const sortedReviews = useMemo(() => {
    const list = [...allReviewsList];
    if (activeTab === 'recent') {
      return list.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    }
    return list.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
  }, [allReviewsList, activeTab]);

  const pMap = useMemo(() => new Map((products || []).map((p) => [p.id, p])), [products]);

  const motionProps = reduceEffects
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
      };

  return (
    <section className="py-12 sm:py-16 lg:py-20 border-b border-line/60 bg-surface-sunken/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...motionProps} className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-accent border border-primary/20 text-primary text-xs font-mono font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Honest Shopper Feedback</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-sans font-bold text-heading tracking-tight">
            Customer Reviews &amp; Reflections
          </h2>
          <p className="text-sm font-sans text-text-secondary leading-relaxed">
            Strict transparency standard: Real community reflections and honest feedback from conscious shoppers across India.
          </p>
        </motion.div>

        {allReviewsList.length === 0 ? (
          /* Clean EmptyState when no reviews exist yet */
          <EmptyState
            icon={MessageSquare}
            title={t('reviews.empty_title', 'No Customer Reviews Yet')}
            description={t(
              'reviews.empty_desc',
              'Be the first to share your experience with our zero-waste essentials. When you leave a review on any product page, it immediately appears here.'
            )}
            actionLabel="Explore Catalog to Review"
            onAction={() => navigate('/shop')}
          />
        ) : (
          /* Real Customer Reviews Overview */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Overall Rating & 5-Star Distribution Bars */}
            <div className="lg:col-span-4 p-7 rounded-3xl bg-surface-raised border border-line shadow-soft-sm space-y-6">
              <div className="text-center pb-4 border-b border-line">
                <div className="text-5xl font-mono font-bold text-heading">
                  {stats.avg}
                </div>
                <div className="flex items-center justify-center gap-1 text-accent my-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(Number(stats.avg)) ? 'fill-accent text-accent' : 'text-line'}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-text-muted">
                  Based on {stats.total} {stats.total === 1 ? 'real review' : 'real reviews'}
                </p>
              </div>

              {/* Star Distribution Bars */}
              <div className="space-y-2.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = stats.counts[star] || 0;
                  const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;

                  return (
                    <div key={star} className="flex items-center gap-3 text-xs">
                      <span className="w-10 font-mono text-text-muted flex items-center gap-1">
                        <span>{star}</span>
                        <Star className="w-3 h-3 fill-accent text-accent" />
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-surface-sunken overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-8 font-mono text-right text-text-muted text-[11px]">
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Tabbed List of Real Reviews */}
            <div className="lg:col-span-8 space-y-4">
              {/* Tabs Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('recent')}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                      activeTab === 'recent'
                        ? 'bg-primary text-white shadow-soft-xs'
                        : 'bg-surface-raised border border-line text-text-muted hover:text-heading'
                    }`}
                  >
                    Most Recent
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('helpful')}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                      activeTab === 'helpful'
                        ? 'bg-primary text-white shadow-soft-xs'
                        : 'bg-surface-raised border border-line text-text-muted hover:text-heading'
                    }`}
                  >
                    Most Helpful
                  </button>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className="text-xs font-mono text-text-muted">
                    {sortedReviews.length} Logged Submissions
                  </span>
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-surface-raised hover:bg-surface-accent border border-line text-primary transition"
                  >
                    <span>+ Write a Review</span>
                  </Link>
                </div>
              </div>

              {/* Review Cards with Product Thumbnails */}
              <div className="space-y-3">
                {sortedReviews.slice(0, 6).map((rev) => {
                  const prod = pMap.get(rev.productId);
                  return (
                    <div
                      key={rev.id || Math.random()}
                      className="p-5 rounded-2xl bg-surface-raised border border-line shadow-soft-xs flex flex-col sm:flex-row gap-4 justify-between"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5 text-accent">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < (Number(rev.rating) || 5)
                                    ? 'fill-accent text-accent'
                                    : 'text-line'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-bold text-heading">
                            {rev.author || rev.name || 'Conscious Shopper'}
                          </span>
                          <span className="text-[10px] font-mono text-text-muted">
                            {rev.date || 'Recent'}
                          </span>
                        </div>

                        <p className="text-xs text-text-secondary leading-relaxed">
                          {rev.comment}
                        </p>
                      </div>

                      {/* Product Thumbnail Chip */}
                      {prod && (
                        <Link
                          to={`/product/${prod.id}`}
                          className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 p-2 rounded-xl bg-surface hover:bg-surface-accent border border-line transition group"
                        >
                          <img
                            src={prod.image}
                            alt=""
                            className="w-10 h-10 object-cover rounded-lg border border-line group-hover:scale-105 transition-transform"
                          />
                          <span className="text-[10px] font-semibold text-heading max-w-[120px] truncate text-right group-hover:text-primary transition-colors">
                            {prod.name}
                          </span>
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
