import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, Calendar } from 'lucide-react';
import { useT } from '../../context/I18nContext';
import { useTheme } from '../../context/ThemeContext';

export default function FromTheBlog() {
  const { t } = useT();
  const { reduceEffects } = useTheme();

  const motionProps = reduceEffects
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
      };

  const articles = [
    {
      id: 'blog-1',
      title: 'Decoding Packaging Claims: Why "Biodegradable" Often Disappoints',
      excerpt: 'Exploring the vital distinction between commercial industrial facilities and true backyard home compostability.',
      date: 'October 28, 2026',
      readTime: '4 min read',
      tag: 'Field Guide',
      image: '/images/products/care-01-800.webp',
      link: '/learn'
    },
    {
      id: 'blog-2',
      title: 'The Lifecycle of an Organic Cotton Tee: Farm to Fiber',
      excerpt: 'How regenerative agriculture reduces freshwater contamination and synthetic pesticide runoff across the sub-continent.',
      date: 'October 20, 2026',
      readTime: '6 min read',
      tag: 'Circular Sourcing',
      image: '/images/products/fash-01-800.webp',
      link: '/learn'
    },
    {
      id: 'blog-3',
      title: "India's EPR Regulations: A Structural Shift in Packaging",
      excerpt: 'Analyzing Extended Producer Responsibility mandates and how they incentivize mono-material, recyclable designs.',
      date: 'October 12, 2026',
      readTime: '5 min read',
      tag: 'Policy Watch',
      image: '/images/products/kit-01-800.webp',
      link: '/news'
    }
  ];

  return (
    <section className="py-16 sm:py-24 border-b border-line/60 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <motion.div {...motionProps} className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-accent border border-primary/20 text-primary text-xs font-mono font-semibold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t('blog.eyebrow', 'Knowledge & Insights')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-sans font-bold text-heading tracking-tight">
              From the EcoMart Journal
            </h2>
            <p className="text-sm font-sans text-text-secondary">
              Field dispatches, scientific breakdowns, and zero-waste guides for informed everyday living.
            </p>
          </motion.div>

          <Link
            to="/learn"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover group"
          >
            <span>Explore all articles &amp; tools</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 3 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {articles.map((art, idx) => {
            const cardMotion = reduceEffects
              ? {}
              : {
                  initial: { opacity: 0, y: 20 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true },
                  transition: { duration: 0.6, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }
                };

            return (
              <motion.article
                key={art.id}
                {...cardMotion}
                className="rounded-3xl bg-surface-raised border border-line/80 hover:border-primary/40 shadow-soft-xs hover:shadow-soft-md transition-all overflow-hidden flex flex-col group"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[16/10] overflow-hidden bg-surface-sunken">
                  <img
                    src={art.image}
                    alt={art.title}
                    width="600"
                    height="375"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-surface/90 backdrop-blur-md border border-line text-[10px] font-mono font-semibold text-primary">
                    {art.tag}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-text-muted">
                      <Calendar className="w-3 h-3" />
                      <span>{art.date}</span>
                      <span>·</span>
                      <span>{art.readTime}</span>
                    </div>

                    <h3 className="font-sans font-bold text-base text-heading group-hover:text-primary transition line-clamp-2">
                      <Link to={art.link}>{art.title}</Link>
                    </h3>

                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                      {art.excerpt}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-line/60">
                    <Link
                      to={art.link}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:underline"
                    >
                      <span>Read Story</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
