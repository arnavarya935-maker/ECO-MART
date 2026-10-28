import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  ALLOWED_TOPICS,
  resolveTopicQuery,
  sanitizeText,
  normalizeArticles,
  fetchEcoNews
} from '../server/newsAdapter.js';
import { summarizeNewsSnippet } from '../src/lib/newsService.js';

describe('Phase 3: Eco News Feature Test Suite', () => {
  describe('Server News Adapter - Topic Resolution & Allowlisting', () => {
    it('returns default greenwashing query when topic is missing or invalid', () => {
      expect(resolveTopicQuery(null)).toBe(ALLOWED_TOPICS[0].searchQuery);
      expect(resolveTopicQuery('')).toBe(ALLOWED_TOPICS[0].searchQuery);
      expect(resolveTopicQuery(undefined)).toBe(ALLOWED_TOPICS[0].searchQuery);
    });

    it('resolves direct allowlisted topic IDs accurately', () => {
      expect(resolveTopicQuery('greenwashing')).toContain('greenwashing');
      expect(resolveTopicQuery('sustainable fashion')).toContain('organic cotton');
      expect(resolveTopicQuery('India policy such as EPR and single-use plastic')).toContain('EPR');
    });

    it('matches partial topic names case-insensitively', () => {
      const plasticQuery = resolveTopicQuery('plastic and packaging');
      expect(plasticQuery).toContain('plastic waste');

      const certsQuery = resolveTopicQuery('eco certifications');
      expect(certsQuery).toContain('FSC');
    });

    it('sanitizes free-text queries to prevent query injection and enforces length ceiling', () => {
      const malicious = 'solar panels <script>alert(1)</script> && DROP TABLE;';
      const resolved = resolveTopicQuery(malicious);
      expect(resolved).not.toContain('<script>');
      expect(resolved).not.toContain(';');
      expect(resolved).not.toContain('&');
      expect(resolved.length).toBeLessThanOrEqual(60);
    });
  });

  describe('Server News Adapter - Text Sanitization', () => {
    it('strips HTML tags and script elements', () => {
      const dirty = '<p>The <b>EU</b> approved new green claims rules.<script>steal()</script></p>';
      expect(sanitizeText(dirty)).toBe('The EU approved new green claims rules.steal()');
    });

    it('strips non-printable ASCII control characters', () => {
      const withControl = 'Eco\x00Sense\x07 News\x1B';
      expect(sanitizeText(withControl)).toBe('EcoSense News');
    });

    it('truncates text to specified length ceiling', () => {
      const longText = 'A'.repeat(500);
      expect(sanitizeText(longText, 100).length).toBe(100);
    });
  });

  describe('Server News Adapter - Normalization & Deduplication', () => {
    it('normalizes GNews provider responses correctly', () => {
      const rawGNews = [
        {
          title: 'Regulators Probe Misleading Carbon Neutral Claims',
          description: 'A coalition of watchdogs announced scrutiny of corporate net zero statements.',
          url: 'https://example.com/news/1',
          publishedAt: '2026-03-15T10:00:00Z',
          image: 'https://example.com/img1.jpg',
          source: { name: 'Reuters Environment' }
        }
      ];

      const normalized = normalizeArticles(rawGNews, 'gnews');
      expect(normalized).toHaveLength(1);
      expect(normalized[0].title).toBe('Regulators Probe Misleading Carbon Neutral Claims');
      expect(normalized[0].source).toBe('Reuters Environment');
      expect(normalized[0].snippet).toContain('watchdogs announced scrutiny');
      expect(normalized[0].url).toBe('https://example.com/news/1');
    });

    it('normalizes NewsData provider responses correctly', () => {
      const rawNewsData = [
        {
          title: 'India Updates EPR Targets for Plastic Packaging',
          description: 'Ministry issues new framework for extended producer responsibility.',
          link: 'https://example.com/news/india-epr',
          pubDate: '2026-04-01T08:00:00Z',
          image_url: 'https://example.com/epr.jpg',
          source_id: 'livemint'
        }
      ];

      const normalized = normalizeArticles(rawNewsData, 'newsdata');
      expect(normalized).toHaveLength(1);
      expect(normalized[0].title).toBe('India Updates EPR Targets for Plastic Packaging');
      expect(normalized[0].source).toBe('livemint');
      expect(normalized[0].url).toBe('https://example.com/news/india-epr');
    });

    it('deduplicates articles by URL and by normalized title', () => {
      const duplicates = [
        {
          title: 'Green claims update 2026',
          url: 'https://example.com/item1',
          source: { name: 'Source A' }
        },
        {
          title: 'Green claims update 2026', // Duplicate title
          url: 'https://example.com/item2',
          source: { name: 'Source B' }
        },
        {
          title: 'Unique Article',
          url: 'https://example.com/item1', // Duplicate URL
          source: { name: 'Source C' }
        },
        {
          title: 'Truly Unique Article',
          url: 'https://example.com/item3',
          source: { name: 'Source D' }
        }
      ];

      const normalized = normalizeArticles(duplicates, 'gnews');
      expect(normalized).toHaveLength(2);
      expect(normalized[0].title).toBe('Green claims update 2026');
      expect(normalized[1].title).toBe('Truly Unique Article');
    });

    it('limits output to a maximum of 10 articles', () => {
      const many = Array.from({ length: 25 }, (_, i) => ({
        title: `Article Number ${i + 1}`,
        url: `https://example.com/item/${i + 1}`,
        source: { name: 'Source' }
      }));

      const normalized = normalizeArticles(many, 'gnews');
      expect(normalized).toHaveLength(10);
    });
  });

  describe('Server News Adapter - Real-data Integrity & Empty States', () => {
    it('returns honest idle message when no API key is provided and never invents fake articles', async () => {
      const prevKey = process.env.NEWS_API_KEY;
      delete process.env.NEWS_API_KEY;

      const result = await fetchEcoNews('greenwashing');
      expect(result.articles).toEqual([]);
      expect(result.message).toContain('No news API key configured');

      if (prevKey) process.env.NEWS_API_KEY = prevKey;
    });
  });

  describe('Client News Service', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('summarizeNewsSnippet returns deterministic 2 bullet points with required label', async () => {
      const title = 'Government cracks down on vague eco labels';
      const snippet = 'New standards require verifiable proof for terms like carbon neutral. Brand owners face fines for unsubstantiated claims.';

      const summary = await summarizeNewsSnippet({ title, snippet });
      expect(summary.label).toBe('AI summary of the snippet, not the full article');
      expect(summary.bullets.length).toBeGreaterThanOrEqual(1);
      expect(summary.bullets.length).toBeLessThanOrEqual(2);
    });

    it('handles empty snippet and title gracefully in summarizeNewsSnippet', async () => {
      const summary = await summarizeNewsSnippet({ title: '', snippet: '' });
      expect(summary.label).toBe('AI summary of the snippet, not the full article');
      expect(summary.bullets).toEqual(['No snippet available to summarize.']);
    });
  });
});
