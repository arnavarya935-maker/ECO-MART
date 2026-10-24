import { describe, it, expect, beforeEach } from 'vitest';
import {
  isRateLimited,
  getClientIp,
  applyRateLimit,
  sanitizeAgentOutput,
  sanitizeGreenwashOutput,
  sanitizeScanLabelOutput,
  handleScanLabelRequest
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
});
