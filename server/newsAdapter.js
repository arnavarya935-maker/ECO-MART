/**
 * EcoMart Curated News Provider Adapter
 *
 * Supports GNews (default) and NewsData providers.
 * Enforces server-side caching, allowlisted queries, deduplication,
 * and string sanitization.
 * Never invents or generates fake articles.
 */

// Allowlisted environmental topics
export const ALLOWED_TOPICS = [
  {
    id: 'greenwashing',
    label: 'Greenwashing & Claims',
    searchQuery: 'greenwashing OR "environmental claims" OR "green claims"'
  },
  {
    id: 'plastic and packaging',
    label: 'Plastic & Packaging',
    searchQuery: 'plastic waste OR "single use plastic" OR packaging OR "ocean plastic"'
  },
  {
    id: 'recycling and circular economy',
    label: 'Recycling & Circular Economy',
    searchQuery: 'recycling OR "circular economy" OR upcycling OR composting'
  },
  {
    id: 'sustainable fashion',
    label: 'Sustainable Fashion',
    searchQuery: '"sustainable fashion" OR "organic cotton" OR "textile recycling"'
  },
  {
    id: 'organic and eco certifications',
    label: 'Eco Certifications',
    searchQuery: '"eco certification" OR "organic standard" OR GOTS OR FSC OR ecolabel'
  },
  {
    id: 'India policy such as EPR and single-use plastic',
    label: 'India EPR & Plastic Policy',
    searchQuery: 'India EPR OR "extended producer responsibility" OR "single use plastic ban"'
  },
  {
    id: 'carbon and climate',
    label: 'Carbon & Climate',
    searchQuery: '"carbon footprint" OR "climate change" OR "net zero emissions"'
  }
];

// In-memory query cache: queryKey -> { articles, timestamp }
const newsCache = new Map();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes in-memory cache

export function getNewsApiKey() {
  return process.env.NEWS_API_KEY || null;
}

export function getNewsProviderName() {
  const p = (process.env.NEWS_PROVIDER || 'gnews').toLowerCase();
  return p === 'newsdata' ? 'newsdata' : 'gnews';
}

/**
 * Strips HTML tags, trims, and enforces max length
 */
export function sanitizeText(str, maxLen = 300) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Strip control chars
    .trim()
    .slice(0, maxLen);
}

/**
 * Map or sanitize requested topic/search query to an allowlisted query
 */
export function resolveTopicQuery(rawTopicOrQuery) {
  if (!rawTopicOrQuery || typeof rawTopicOrQuery !== 'string') {
    return ALLOWED_TOPICS[0].searchQuery;
  }

  const normalized = rawTopicOrQuery.toLowerCase().trim();

  // 1. Direct match on allowlist topic ID or label
  const matched = ALLOWED_TOPICS.find(
    (t) =>
      t.id.toLowerCase() === normalized ||
      t.label.toLowerCase() === normalized ||
      normalized.includes(t.id.toLowerCase())
  );

  if (matched) {
    return matched.searchQuery;
  }

  // 2. Free-text search sanitization (safe search string without query injection)
  const safeText = normalized.replace(/[^a-z0-9\s"-]/g, '').slice(0, 60).trim();
  return safeText || ALLOWED_TOPICS[0].searchQuery;
}

/**
 * Normalize and deduplicate articles from raw provider response
 */
export function normalizeArticles(rawArticles, provider = 'gnews') {
  if (!Array.isArray(rawArticles)) return [];

  const seenUrls = new Set();
  const seenTitles = new Set();
  const normalized = [];

  for (const item of rawArticles) {
    if (!item || typeof item !== 'object') continue;

    let title = '';
    let source = '';
    let url = '';
    let publishedAt = '';
    let image = null;
    let snippet = '';

    if (provider === 'newsdata') {
      title = sanitizeText(item.title, 250);
      source = sanitizeText(item.source_id || item.source_name || 'NewsData', 80);
      url = item.link || '';
      publishedAt = item.pubDate || new Date().toISOString();
      image = item.image_url || null;
      snippet = sanitizeText(item.description, 400);
    } else {
      // GNews (default)
      title = sanitizeText(item.title, 250);
      source = sanitizeText(item.source?.name || 'GNews', 80);
      url = item.url || '';
      publishedAt = item.publishedAt || new Date().toISOString();
      image = item.image || null;
      snippet = sanitizeText(item.description, 400);
    }

    if (!title || !url) continue;

    // Deduplication check
    const normTitle = title.toLowerCase();
    if (seenUrls.has(url) || seenTitles.has(normTitle)) continue;

    seenUrls.add(url);
    seenTitles.add(normTitle);

    normalized.push({
      title,
      source,
      url,
      publishedAt,
      image,
      snippet: snippet || 'Click article link to read full coverage from original publisher.'
    });

    if (normalized.length >= 10) break; // Max 10 articles per request (GNews free tier limit)
  }

  return normalized;
}

/**
 * Fetch environmental news with in-memory cache and graceful fallback
 */
export async function fetchEcoNews(topicParam = 'greenwashing') {
  const searchQuery = resolveTopicQuery(topicParam);
  const cacheKey = searchQuery.toLowerCase();
  const now = Date.now();

  // Check valid cache entry
  const cached = newsCache.get(cacheKey);
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return {
      articles: cached.articles,
      provider: getNewsProviderName(),
      cached: true,
      lastUpdated: new Date(cached.timestamp).toISOString(),
      topicQuery: searchQuery
    };
  }

  const apiKey = getNewsApiKey();
  const provider = getNewsProviderName();

  // If no API key configured, return cached data if available or honest empty state
  if (!apiKey || apiKey === 'your_news_api_key_here') {
    if (cached?.articles?.length) {
      return {
        articles: cached.articles,
        provider,
        cached: true,
        savedAt: new Date(cached.timestamp).toISOString(),
        lastUpdated: new Date(cached.timestamp).toISOString(),
        topicQuery: searchQuery
      };
    }
    return {
      articles: [],
      provider,
      cached: false,
      message: 'No news API key configured on server. Live news feed is idle.',
      lastUpdated: new Date().toISOString(),
      topicQuery: searchQuery
    };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    let apiUrl = '';
    if (provider === 'newsdata') {
      apiUrl = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${encodeURIComponent(searchQuery)}&language=en`;
    } else {
      // GNews default: 100 requests/day, 10 articles/request
      apiUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(searchQuery)}&lang=en&max=10&apikey=${apiKey}`;
    }

    const res = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const rawList = provider === 'newsdata' ? data.results : data.articles;
      const articles = normalizeArticles(rawList, provider);

      // Save to in-memory cache
      newsCache.set(cacheKey, {
        articles,
        timestamp: now
      });

      return {
        articles,
        provider,
        cached: false,
        lastUpdated: new Date().toISOString(),
        topicQuery: searchQuery
      };
    }
  } catch {
    // Fetch failed or timed out
  }

  // If API failed or quota hit: return last cached items labeled "Saved <time>"
  if (cached && cached.articles?.length) {
    return {
      articles: cached.articles,
      provider,
      cached: true,
      savedAt: new Date(cached.timestamp).toISOString(),
      lastUpdated: new Date(cached.timestamp).toISOString(),
      topicQuery: searchQuery,
      note: 'Live news fetch unavailable; displaying last saved articles.'
    };
  }

  // Clear honest empty state (never invent fake articles!)
  return {
    articles: [],
    provider,
    cached: false,
    message: 'Live news service is temporarily unavailable. Please try again later.',
    lastUpdated: new Date().toISOString(),
    topicQuery: searchQuery
  };
}
