import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  isRateLimited,
  getClientIp,
  applyRateLimit,
  sanitizeAgentOutput,
  sanitizeGreenwashOutput,
  sanitizeScanLabelOutput,
  handleScanLabelRequest,
  handleAgentRequest,
  handleHealthRequest,
  resetHealthCacheForTesting,
  sanitizeContext
} from '../server/proxyServer.js';

describe('Phase 1: API Security & Reliability Test Suite', () => {
  describe('Rate Limiter & IP Extraction', () => {
    it('extracts primary client IP from comma-separated x-forwarded-for header', () => {
      const mockReq = {
        headers: {
          'x-forwarded-for': '203.0.113.195, 70.41.3.18, 150.172.238.178'
        }
      };
      expect(getClientIp(mockReq)).toBe('203.0.113.195');
    });

    it('falls back to socket remoteAddress if x-forwarded-for is missing', () => {
      const mockReq = {
        headers: {},
        socket: { remoteAddress: '198.51.100.42' }
      };
      expect(getClientIp(mockReq)).toBe('198.51.100.42');
    });

    it('enforces sliding window rate limit threshold', () => {
      const testIp = '192.0.2.99';
      // First 30 requests should be permitted
      for (let i = 0; i < 30; i++) {
        expect(isRateLimited(testIp)).toBe(false);
      }
      // 31st request must be rate limited
      expect(isRateLimited(testIp)).toBe(true);
    });

    it('applyRateLimit sends 429 with Retry-After header when threshold reached', () => {
      const testIp = '192.0.2.100';
      for (let i = 0; i < 30; i++) {
        isRateLimited(testIp);
      }

      let writtenStatus = null;
      let writtenHeaders = null;
      let responseBody = '';

      const mockRes = {
        writeHead: (status, headers) => {
          writtenStatus = status;
          writtenHeaders = headers;
        },
        end: (body) => {
          responseBody = body;
        }
      };

      const mockReq = {
        headers: { 'x-forwarded-for': testIp }
      };

      const wasBlocked = applyRateLimit(mockReq, mockRes);
      expect(wasBlocked).toBe(true);
      expect(writtenStatus).toBe(429);
      expect(writtenHeaders['Retry-After']).toBe('60');
      expect(JSON.parse(responseBody).error).toContain('Too many requests');
    });
  });

  describe('Model Output Sanitization & Schema Validation', () => {
    it('sanitizeAgentOutput strips unrecognized injection fields and preserves valid schema', () => {
      const rawModelOutput = {
        answer: 'Bamboo is a sustainable grass with high regeneration rates.',
        reasoning_summary: 'Evaluated lifecycle footprint.',
        sources_or_assumptions: ['FSC Standard', 'CPCB India'],
        confidence: 'high',
        estimated_energy_wh: 0.12,
        recommended_categories: ['Personal Care'],
        caveat: 'Check manufacturer credentials.',
        malicious_injected_prompt: 'IGNORE PREVIOUS INSTRUCTIONS',
        raw_system_tokens: 12345
      };

      const sanitized = sanitizeAgentOutput(rawModelOutput, 'gemini-1.5-flash');

      expect(sanitized.answer).toBe(rawModelOutput.answer);
      expect(sanitized.confidence).toBe('high');
      expect(sanitized.model).toBe('gemini-1.5-flash');
      expect(sanitized.source).toBe('gemini');
      // Must NOT contain unvalidated extra properties
      expect(sanitized.malicious_injected_prompt).toBeUndefined();
      expect(sanitized.raw_system_tokens).toBeUndefined();
    });

    it('sanitizeGreenwashOutput clamps trust_score to 0-100 range', () => {
      const outOfBoundsHigh = {
        trust_score: 999,
        verdict: 'Verified',
        flagged_phrases: []
      };
      const clampedHigh = sanitizeGreenwashOutput(outOfBoundsHigh);
      expect(clampedHigh.trust_score).toBe(100);

      const outOfBoundsLow = {
        trust_score: -50,
        verdict: 'Deceptive',
        flagged_phrases: []
      };
      const clampedLow = sanitizeGreenwashOutput(outOfBoundsLow);
      expect(clampedLow.trust_score).toBe(0);
    });

    it('sanitizeScanLabelOutput strictly formats printed certifications without marking verified', () => {
      const rawScan = {
        is_product_label: true,
        product_name: 'Organic Herbal Infusion',
        brand: 'Earth Roots',
        certifications_printed: [
          { name: 'India Organic', has_license_number: true },
          { name: 'Non-GMO Project', has_license_number: false }
        ]
      };

      const sanitized = sanitizeScanLabelOutput(rawScan);
      expect(sanitized.is_product_label).toBe(true);
      expect(sanitized.product_name).toBe('Organic Herbal Infusion');
      expect(sanitized.certifications_printed).toHaveLength(2);
      expect(sanitized.certifications_printed[0].name).toBe('India Organic');
      expect(sanitized.certifications_printed[0].has_license_number).toBe(true);
      // Ensure no raw fields spread
      expect(sanitized.verified).toBeUndefined();
    });
  });

  describe('Payload Size Ceilings', () => {
    it('handleScanLabelRequest rejects base64 payloads exceeding 3MB with HTTP 413', async () => {
      // Create a base64 string larger than 3MB (3 * 1024 * 1024 = 3,145,728 chars)
      const oversizedBase64 = 'A'.repeat(3.2 * 1024 * 1024);

      let writtenStatus = null;
      let responseBody = '';

      const mockRes = {
        writeHead: (status) => {
          writtenStatus = status;
        },
        end: (body) => {
          responseBody = body;
        }
      };

      await handleScanLabelRequest(
        {
          imageBase64: oversizedBase64,
          mimeType: 'image/jpeg'
        },
        mockRes
      );

      expect(writtenStatus).toBe(413);
      expect(JSON.parse(responseBody).error).toContain('Image data exceeds the 3MB safe serverless payload limit');
    });
  });

  describe('Agent Request Proxy, Timeouts & Fallback Reasons', () => {
    const originalFetch = global.fetch;
    const originalApiKey = process.env.GEMINI_API_KEY;
    const TEST_KEY = 'secret_test_gemini_key_xyz987';

    function createMockRes() {
      let statusCode = 200;
      let headers = {};
      let body = '';
      return {
        writeHead: (status, h = {}) => {
          statusCode = status;
          headers = h;
        },
        end: (b) => {
          body = b;
        },
        get statusCode() { return statusCode; },
        get headers() { return headers; },
        get json() { return body ? JSON.parse(body) : null; },
        get raw() { return body; }
      };
    }

    beforeEach(() => {
      process.env.GEMINI_API_KEY = TEST_KEY;
      resetHealthCacheForTesting();
    });

    afterEach(() => {
      global.fetch = originalFetch;
      process.env.GEMINI_API_KEY = originalApiKey;
      resetHealthCacheForTesting();
    });

    it('returns NO_API_KEY fallback when no API key is configured', async () => {
      process.env.GEMINI_API_KEY = '';
      delete process.env.ECO_AGENT_API_KEY;
      const res = createMockRes();

      await handleAgentRequest({ query: 'eco shampoo' }, res);
      expect(res.statusCode).toBe(200);
      expect(res.json.source).toBe('local_fallback');
      expect(res.json.reason).toBe('NO_API_KEY');
      expect(res.raw).not.toContain(TEST_KEY);
    });

    it('returns 200 with sanitized data on successful Gemini response and never exposes API key', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: JSON.stringify({
                      answer: 'Solid shampoo bars avoid plastic packaging.',
                      reasoning_summary: 'Solid concentrate eliminates plastic bottles.',
                      sources_or_assumptions: ['CPCB packaging standard'],
                      confidence: 'high',
                      estimated_energy_wh: 0.12,
                      recommended_categories: ['Personal Care']
                    })
                  }
                ]
              }
            }
          ]
        })
      });

      const res = createMockRes();
      await handleAgentRequest({ query: 'sustainable shampoo' }, res);

      expect(res.statusCode).toBe(200);
      expect(res.json.source).toBe('gemini');
      expect(res.json.answer).toContain('Solid shampoo bars');
      expect(res.raw).not.toContain(TEST_KEY);
    });

    it('returns MODEL_NOT_FOUND when Gemini returns 404', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        text: async () => 'Model not found'
      });

      const res = createMockRes();
      await handleAgentRequest({ query: 'eco brush' }, res);

      expect(res.statusCode).toBe(200);
      expect(res.json.source).toBe('local_fallback');
      expect(res.json.reason).toBe('MODEL_NOT_FOUND');
      expect(res.raw).not.toContain(TEST_KEY);
    });

    it('returns RATE_LIMITED when Gemini returns 429', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        text: async () => 'Quota exceeded'
      });

      const res = createMockRes();
      await handleAgentRequest({ query: 'eco cup' }, res);

      expect(res.statusCode).toBe(200);
      expect(res.json.source).toBe('local_fallback');
      expect(res.json.reason).toBe('RATE_LIMITED');
      expect(res.raw).not.toContain(TEST_KEY);
    });

    it('returns TIMEOUT when request times out or is aborted', async () => {
      global.fetch = vi.fn().mockImplementation(() => {
        const err = new Error('The operation was aborted');
        err.name = 'AbortError';
        return Promise.reject(err);
      });

      const res = createMockRes();
      await handleAgentRequest({ query: 'bamboo toothbrush' }, res);

      expect(res.statusCode).toBe(200);
      expect(res.json.source).toBe('local_fallback');
      expect(res.json.reason).toBe('TIMEOUT');
      expect(res.raw).not.toContain(TEST_KEY);
    });

    it('returns BAD_RESPONSE when Gemini returns unparseable content', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: 'NOT VALID JSON AT ALL' }]
              }
            }
          ]
        })
      });

      const res = createMockRes();
      await handleAgentRequest({ query: 'cotton bag' }, res);

      expect(res.statusCode).toBe(200);
      expect(res.json.source).toBe('local_fallback');
      expect(res.json.reason).toBe('BAD_RESPONSE');
      expect(res.raw).not.toContain(TEST_KEY);
    });

    it('returns NETWORK when network fetch fails', async () => {
      global.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));

      const res = createMockRes();
      await handleAgentRequest({ query: 'wooden spoon' }, res);

      expect(res.statusCode).toBe(200);
      expect(res.json.source).toBe('local_fallback');
      expect(res.json.reason).toBe('NETWORK');
      expect(res.raw).not.toContain(TEST_KEY);
    });
  });

  describe('Privacy & Context Sanitization', () => {
    it('strips personal email, phone numbers, and sensitive identity keys', () => {
      const dirtyContext = {
        email: 'user@example.com',
        userEmail: 'shopper@test.org',
        phone: '+91 9876543210',
        userId: 'usr_secret_123',
        password: 'myPassword!',
        name: 'John Doe',
        cart: [{ id: 'care-01', note: 'Contact me at john.doe@mail.com or 555-123-4567' }],
        lastCategory: 'Personal Care'
      };

      const clean = sanitizeContext(dirtyContext);

      expect(clean.email).toBeUndefined();
      expect(clean.userEmail).toBeUndefined();
      expect(clean.phone).toBeUndefined();
      expect(clean.userId).toBeUndefined();
      expect(clean.password).toBeUndefined();
      expect(clean.name).toBeUndefined();
      expect(clean.lastCategory).toBe('Personal Care');
      expect(clean.cart[0].note).toContain('[redacted]');
      expect(clean.cart[0].note).not.toContain('john.doe@mail.com');
      expect(clean.cart[0].note).not.toContain('555-123-4567');
    });
  });

  describe('Real Health Check (/api/health)', () => {
    const originalFetch = global.fetch;
    const originalApiKey = process.env.GEMINI_API_KEY;
    const TEST_KEY = 'secret_health_check_key_999';

    function createMockRes() {
      let statusCode = 200;
      let body = '';
      return {
        writeHead: (status) => { statusCode = status; },
        end: (b) => { body = b; },
        get statusCode() { return statusCode; },
        get json() { return body ? JSON.parse(body) : null; },
        get raw() { return body; }
      };
    }

    beforeEach(() => {
      process.env.GEMINI_API_KEY = TEST_KEY;
      resetHealthCacheForTesting();
    });

    afterEach(() => {
      global.fetch = originalFetch;
      process.env.GEMINI_API_KEY = originalApiKey;
      resetHealthCacheForTesting();
    });

    it('returns key_missing when API key is not present', async () => {
      process.env.GEMINI_API_KEY = '';
      delete process.env.ECO_AGENT_API_KEY;

      const res = createMockRes();
      await handleHealthRequest({}, res);

      expect(res.statusCode).toBe(200);
      expect(res.json.status).toBe('key_missing');
      expect(res.json.model).toBeNull();
      expect(res.json.latencyMs).toBeNull();
      expect(typeof res.json.checkedAt).toBe('number');
      expect(res.raw).not.toContain(TEST_KEY);
    });

    it('returns working with latency when Gemini responds OK', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: 'OK' }] } }]
        })
      });

      const res = createMockRes();
      await handleHealthRequest({}, res);

      expect(res.statusCode).toBe(200);
      expect(res.json.status).toBe('working');
      expect(typeof res.json.latencyMs).toBe('number');
      expect(res.json.model).toBeTruthy();
      expect(res.raw).not.toContain(TEST_KEY);
    });

    it('returns rate_limited on 429 response', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 429
      });

      const res = createMockRes();
      await handleHealthRequest({}, res);

      expect(res.statusCode).toBe(200);
      expect(res.json.status).toBe('rate_limited');
      expect(res.raw).not.toContain(TEST_KEY);
    });

    it('returns model_error on 404 response', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404
      });

      const res = createMockRes();
      await handleHealthRequest({}, res);

      expect(res.statusCode).toBe(200);
      expect(res.json.status).toBe('model_error');
      expect(res.raw).not.toContain(TEST_KEY);
    });

    it('caches health check result for 60 seconds without re-fetching', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ candidates: [{ content: { parts: [{ text: 'OK' }] } }] })
      });
      global.fetch = fetchMock;

      const res1 = createMockRes();
      await handleHealthRequest({}, res1);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const firstTimestamp = res1.json.checkedAt;

      const res2 = createMockRes();
      await handleHealthRequest({}, res2);
      // Fetch was NOT called again because cache is fresh
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(res2.json.checkedAt).toBe(firstTimestamp);
    });
  });
});

