import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Newspaper,
  Search,
  ExternalLink,
  Sparkles,
  Clock,
  RefreshCw,
  Info,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { getEcoNews, summarizeNewsSnippet, NEWS_TOPICS } from '../lib/newsService.js';

export default function NewsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTopic = searchParams.get('topic') || searchParams.get('q') || 'greenwashing';

  const [activeTopic, setActiveTopic] = useState(initialTopic);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [newsData, setNewsData] = useState({ articles: [], provider: 'gnews', lastUpdated: '', cached: false });
  const [loading, setLoading] = useState(true);
  const [expandedSummary, setExpandedSummary] = useState({}); // articleUrl -> { bullets, loading }

  useEffect(() => {
    loadNews(activeTopic);
  }, [activeTopic]);

  const loadNews = async (topicOrQuery) => {
    setLoading(true);
    try {
      const data = await getEcoNews({ topic: topicOrQuery, query: searchQuery });
      setNewsData(data || { articles: [] });
    } catch {
      setNewsData({ articles: [], provider: 'gnews', cached: false });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setActiveTopic(searchQuery.trim());
    setSearchParams({ q: searchQuery.trim() });
    loadNews(searchQuery.trim());
  };

  const handleTopicClick = (topicId) => {
    setActiveTopic(topicId);
    setSearchQuery('');
    setSearchParams({ topic: topicId });
  };

  const handleToggleSummary = async (article) => {
    const url = article.url;
    if (expandedSummary[url]) {
      setExpandedSummary((prev) => {
        const copy = { ...prev };
        delete copy[url];
        return copy;
      });
      return;
    }

    setExpandedSummary((prev) => ({
      ...prev,
      [url]: { loading: true, bullets: [] }
    }));

    try {
      const result = await summarizeNewsSnippet({
        title: article.title,
        snippet: article.snippet
      });
      setExpandedSummary((prev) => ({
        ...prev,
        [url]: { loading: false, bullets: result.bullets, label: result.label }
      }));
    } catch {
      setExpandedSummary((prev) => ({
        ...prev,
        [url]: {
          loading: false,
          bullets: [article.snippet || article.title],
          label: 'AI summary of the snippet, not the full article'
        }
      }));
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="min-h-screen bg-surface py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation Breadcrumb back to Learn */}
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <Link to="/learn" className="hover:text-primary transition flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Learn Hub</span>
          </Link>
          <span>/</span>
          <span className="text-heading font-medium">Eco News</span>
        </div>

        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-raised border border-line text-xs font-medium text-heading">
            <Newspaper className="w-3.5 h-3.5 text-accent" />
            <span>Curated Environmental News</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-heading">
            Eco News & Industry Watch
          </h1>
          <p className="text-sm sm:text-base text-secondary max-w-3xl leading-relaxed">
            Timely reporting on corporate greenwashing, plastic policy regulations, EPR laws, and sustainable material breakthroughs.
          </p>

          {/* Honest Transparency Attribution Notice */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted bg-surface-sunken p-3 rounded-2xl border border-line">
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>Via GNews • May be up to 12 hours delayed • Snippet and headline index</span>
            </div>
            {newsData.lastUpdated && (
              <div className="flex items-center gap-1 ml-auto text-[11px]">
                <Clock className="w-3 h-3" />
                <span>Last updated: {new Date(newsData.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                {newsData.cached && (
                  <span className="px-2 py-0.5 rounded-full bg-surface-raised border border-line text-[10px] font-semibold text-primary">
                    Saved {newsData.savedAt ? formatDate(newsData.savedAt) : 'Cache'}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Filter Chips & Search Bar */}
        <div className="space-y-4">
          {/* Allowlisted Topic Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {NEWS_TOPICS.map((t) => {
              const isSelected = activeTopic.toLowerCase() === t.id.toLowerCase();
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleTopicClick(t.id)}
                  className={`px-3.5 py-2 rounded-full text-xs font-medium transition cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'bg-primary text-primary-contrast shadow-soft-xs font-semibold'
                      : 'bg-surface-raised hover:bg-surface border border-line text-heading'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Manual Search Form (Never fetches per keystroke) */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics (e.g. EPR India, packaging, fast fashion)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-line text-xs font-medium text-heading placeholder:text-text-muted focus:outline-2 focus:outline-focus min-h-[44px]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast font-medium text-xs shadow-soft-sm transition cursor-pointer min-h-[44px]"
            >
              Search
            </button>
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-6 rounded-3xl bg-surface-raised border border-line space-y-4 h-64">
                <div className="h-4 bg-surface-sunken rounded w-1/3" />
                <div className="h-6 bg-surface-sunken rounded w-3/4" />
                <div className="h-16 bg-surface-sunken rounded w-full" />
                <div className="h-8 bg-surface-sunken rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Articles Grid */}
        {!loading && newsData.articles && newsData.articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsData.articles.map((article, idx) => {
              const summaryState = expandedSummary[article.url];
              return (
                <article
                  key={`${article.url}-${idx}`}
                  className="p-6 rounded-3xl bg-surface-raised border border-line shadow-soft-sm flex flex-col justify-between space-y-4 hover:border-primary/40 transition group"
                >
                  <div className="space-y-3">
                    {/* Source and Publish Date */}
                    <div className="flex items-center justify-between text-xs text-text-muted">
                      <span className="font-semibold text-heading">{article.source}</span>
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>

                    {/* Headline */}
                    <h2 className="font-serif font-bold text-lg text-heading group-hover:text-primary transition line-clamp-2">
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline focus-visible:outline-2 focus-visible:outline-focus rounded"
                      >
                        {article.title}
                      </a>
                    </h2>

                    {/* Provider Snippet Only */}
                    <p className="text-xs text-secondary leading-relaxed line-clamp-3">
                      {article.snippet}
                    </p>

                    {/* Optional "Explain simply" Accordion */}
                    {summaryState && (
                      <div className="p-3.5 rounded-2xl bg-surface-sunken border border-line space-y-2 animate-slide-up text-xs">
                        <div className="flex items-center gap-1.5 font-semibold text-primary text-[11px]">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{summaryState.label || 'AI summary of the snippet, not the full article'}</span>
                        </div>
                        {summaryState.loading ? (
                          <div className="text-xs text-text-muted animate-pulse">Summarizing snippet...</div>
                        ) : (
                          <ul className="space-y-1 list-disc pl-4 text-xs text-heading">
                            {summaryState.bullets.map((b, bi) => (
                              <li key={bi}>{b}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions: Explain Simply & Read Original Link */}
                  <div className="pt-3 border-t border-line flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleSummary(article)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface hover:bg-surface-sunken border border-line text-xs font-semibold text-heading transition cursor-pointer min-h-[36px]"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      <span>{summaryState ? 'Hide summary' : 'Explain simply'}</span>
                      {summaryState ? <ChevronUp className="w-3 h-3 text-text-muted" /> : <ChevronDown className="w-3 h-3 text-text-muted" />}
                    </button>

                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover hover:underline min-h-[36px] items-center"
                    >
                      <span>Read article</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Empty State (Never shows fake articles) */}
        {!loading && (!newsData.articles || newsData.articles.length === 0) && (
          <div className="p-12 rounded-3xl bg-surface-raised border border-line text-center space-y-4 max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-full bg-surface-sunken flex items-center justify-center mx-auto text-text-muted">
              <Newspaper className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-serif font-bold text-xl text-heading">No Recent Articles Found</h3>
              <p className="text-xs sm:text-sm text-secondary">
                {newsData.message || 'No current articles found for this topic query. The news feed updates periodically.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleTopicClick('all')}
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-contrast font-medium text-xs shadow-soft-sm cursor-pointer"
            >
              Browse All Topics
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
