import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, ExternalLink, ArrowRight, Sparkles } from 'lucide-react';
import { getEcoNews } from '../../lib/newsService.js';
import Skeleton from '../ui/Skeleton';

export default function RelatedNewsPanel({
  topic = 'greenwashing',
  title = 'Industry & News Watch',
  description = 'Curated reporting and updates from environmental publications.',
  maxArticles = 3,
  className = ''
}) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await getEcoNews({ topic });
        if (isMounted) {
          setArticles((res.articles || []).slice(0, maxArticles));
        }
      } catch {
        if (isMounted) setArticles([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [topic, maxArticles]);

  if (!loading && articles.length === 0) {
    return null; // Gracefully hidden if no news available for this topic
  }

  return (
    <section className={`p-6 sm:p-8 rounded-3xl bg-surface-raised border border-line shadow-soft-sm space-y-5 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
            <Newspaper className="w-4 h-4 text-accent" />
            <span>Curated News</span>
          </div>
          <h3 className="font-serif font-bold text-xl text-heading">{title}</h3>
          <p className="text-xs text-secondary">{description}</p>
        </div>

        <Link
          to={`/news?topic=${encodeURIComponent(topic)}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover hover:underline"
        >
          <span>All news on this topic</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(maxArticles)].map((_, i) => (
            <div key={i} className="p-4 rounded-2xl bg-surface border border-line space-y-3">
              <Skeleton width="w-20" height="h-3" />
              <Skeleton width="w-3/4" height="h-5" />
              <Skeleton width="w-full" height="h-8" />
              <div className="pt-2 flex items-center justify-between">
                <Skeleton width="w-12" height="h-3" />
                <Skeleton width="w-10" height="h-3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {articles.map((item, idx) => (
            <div
              key={`${item.url}-${idx}`}
              className="p-4 rounded-2xl bg-surface border border-line flex flex-col justify-between space-y-2 hover:border-primary/40 transition group"
            >
              <div className="space-y-1.5">
                <div className="text-[11px] font-medium text-text-muted">{item.source}</div>
                <h4 className="font-serif font-bold text-sm text-heading group-hover:text-primary transition line-clamp-2">
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.title}
                  </a>
                </h4>
                <p className="text-xs text-secondary line-clamp-2">{item.snippet}</p>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-[10px] text-text-muted">Via GNews</span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline font-semibold text-[11px]"
                >
                  <span>Read</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
