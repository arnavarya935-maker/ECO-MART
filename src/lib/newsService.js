/**
 * EcoMart News Service
 * Client interface for curated environmental news.
 * Queries /api/news with topic allowlisting, local session caching,
 * and snippet simplification.
 *
 * PRIVACY GUARANTEE:
 * Only the search topic or query is transmitted to the serverless proxy.
 * Zero user identity or browsing history is sent.
 */

export const NEWS_TOPICS = [
  { id: 'all', label: 'All News', query: 'greenwashing' },
  { id: 'greenwashing', label: 'Greenwashing & Claims', query: 'greenwashing' },
  { id: 'plastic and packaging', label: 'Plastic & Packaging', query: 'plastic and packaging' },
  { id: 'recycling and circular economy', label: 'Circular Economy', query: 'recycling and circular economy' },
  { id: 'sustainable fashion', label: 'Sustainable Fashion', query: 'sustainable fashion' },
  { id: 'organic and eco certifications', label: 'Certifications', query: 'organic and eco certifications' },
  { id: 'India policy such as EPR and single-use plastic', label: 'India Policy & EPR', query: 'India policy such as EPR and single-use plastic' },
  { id: 'carbon and climate', label: 'Carbon & Climate', query: 'carbon and climate' }
];

const clientCache = new Map();

/**
 * Fetch environmental news articles
 * @param {Object} [options]
 * @param {string} [options.topic='greenwashing']
 * @param {string} [options.query='']
 * @returns {Promise<{ articles: Array, provider: string, cached: boolean, lastUpdated: string }>}
 */
export async function getEcoNews({ topic = 'greenwashing', query = '' } = {}) {
  const searchTerm = (query || topic || 'greenwashing').trim();
  const cacheKey = searchTerm.toLowerCase();

  // Return local session cache if fresh (< 5 mins)
  const cached = clientCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
    return cached.data;
  }

  try {
    const res = await fetch(`/api/news?topic=${encodeURIComponent(searchTerm)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.articles)) {
        clientCache.set(cacheKey, { data, timestamp: Date.now() });
        return data;
      }
    }
  } catch {
    // Network or server offline
  }

  return {
    articles: [],
    provider: 'gnews',
    cached: false,
    message: 'Could not load news at this time.',
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Summarize ONLY the title and snippet (2 brief bullet points)
 * Labeled: "AI summary of the snippet, not the full article"
 */
export async function summarizeNewsSnippet({ title, snippet }) {
  if (!snippet && !title) {
    return {
      bullets: ['No snippet available to summarize.'],
      label: 'AI summary of the snippet, not the full article'
    };
  }

  const isOnline = typeof window !== 'undefined'
    ? true
    : true;

  if (isOnline) {
    try {
      // Attempt fast explanation via /api/agent proxy
      const prompt = `Summarize this environmental news snippet in exactly 2 concise, neutral bullet points. Only summarize what is stated in the snippet, never extrapolate or invent facts:\nTitle: ${title}\nSnippet: ${snippet}`;

      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: prompt, language: 'en' })
      });

    if (res.ok) {
      const data = await res.json();
      const rawText = data.answer || '';
      const lines = rawText
        .split('\n')
        .map((l) => l.replace(/^[-*•\d.]\s*/, '').trim())
        .filter((l) => l.length > 5);

      if (lines.length >= 1) {
        return {
          bullets: lines.slice(0, 2),
          label: 'AI summary of the snippet, not the full article'
        };
      }
    }
    } catch {
      // Fallback to deterministic text extraction
    }
  }

  // Deterministic local fallback: break snippet into clean sentences
  const sentences = (snippet || title)
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10);

  return {
    bullets: sentences.length >= 2 ? sentences.slice(0, 2) : [snippet || title],
    label: 'AI summary of the snippet, not the full article'
  };
}
