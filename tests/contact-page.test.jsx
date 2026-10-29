import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().trim().email('Please enter a valid email address'),
  subject: z.string().min(1, 'Please select a subject from the list'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(2000, 'Message cannot exceed 2000 characters'),
  botcheck: z.string().max(0, 'Spam detected')
});

describe('Part 4: Contact Us Form & Integration Test Suite', () => {
  describe('Zod Schema Validation', () => {
    it('accepts valid contact submission data', () => {
      const valid = {
        name: 'Aranya Sen',
        email: 'aranya@example.com',
        subject: 'Sustainability Question',
        message: 'Could you please explain how the carbon factor is calculated for the bamboo toothbrush?',
        botcheck: ''
      };

      const result = contactSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects names shorter than 2 characters', () => {
      const invalid = {
        name: 'A',
        email: 'a@example.com',
        subject: 'Product Inquiry',
        message: 'Hello I have a detailed question.',
        botcheck: ''
      };

      const result = contactSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toContain('at least 2 characters');
    });

    it('rejects invalid email addresses', () => {
      const invalid = {
        name: 'Maya Devi',
        email: 'not-an-email',
        subject: 'Report Greenwashing',
        message: 'I would like to report an unverified label.',
        botcheck: ''
      };

      const result = contactSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toContain('valid email address');
    });

    it('rejects empty subject dropdown selection', () => {
      const invalid = {
        name: 'Rohan Verma',
        email: 'rohan@example.com',
        subject: '',
        message: 'I have a question about shipping.',
        botcheck: ''
      };

      const result = contactSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toContain('select a subject');
    });

    it('rejects messages shorter than 10 characters', () => {
      const invalid = {
        name: 'Rohan Verma',
        email: 'rohan@example.com',
        subject: 'Order Help',
        message: 'Help me',
        botcheck: ''
      };

      const result = contactSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toContain('at least 10 characters');
    });

    it('rejects automated bot submissions where honeypot is populated', () => {
      const botSubmission = {
        name: 'Spam Bot',
        email: 'bot@spam.com',
        subject: 'Other',
        message: 'Buy our fake crypto tokens now at low price!',
        botcheck: 'http://malicious-link.com'
      };

      const result = contactSchema.safeParse(botSubmission);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toContain('Spam detected');
    });
  });

  describe('Rate Limiting Logic', () => {
    it('allows up to 3 submissions within a 5-minute window', () => {
      const timestamps = [];
      const now = Date.now();

      function attemptSubmission() {
        const recent = timestamps.filter((ts) => now - ts < 5 * 60 * 1000);
        if (recent.length >= 3) return false;
        timestamps.push(now);
        return true;
      }

      expect(attemptSubmission()).toBe(true);
      expect(attemptSubmission()).toBe(true);
      expect(attemptSubmission()).toBe(true);
      expect(attemptSubmission()).toBe(false); // 4th attempt rejected
    });
  });
});
