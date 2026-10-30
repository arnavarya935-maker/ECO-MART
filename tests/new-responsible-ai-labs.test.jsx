import { describe, it, expect, beforeEach } from 'vitest';
import {
  logInteractionToBlackBox,
  getBlackBoxItems,
  clearBlackBox,
  exportBlackBoxJSON
} from '../src/lib/ai/blackboxStore';

describe('AI Black Box Store (Append-Only Telemetry)', () => {
  beforeEach(() => {
    clearBlackBox();
  });

  it('appends an interaction event to local store', () => {
    const item = logInteractionToBlackBox({
      query: 'Are bamboo plates dishwasher safe?',
      answerSummary: 'Not recommended for harsh cycles.',
      confidence: 'high',
      energyWh: 0.08,
      guardrailTriggered: null
    });

    expect(item).toBeDefined();
    expect(item.id).toMatch(/^bb/);

    const items = getBlackBoxItems();
    expect(items.length).toBe(1);
    expect(items[0].query).toBe('Are bamboo plates dishwasher safe?');
    expect(items[0].confidence).toBe('high');
    expect(items[0].energyWh).toBe(0.08);
  });

  it('sanitizes personal data and strips PII before saving', () => {
    logInteractionToBlackBox({
      query: 'My email is test.user@example.com and phone is +91 9876543210. Suggest shampoo.',
      answerSummary: 'Solid shampoo bar avoids single-use plastic.',
      confidence: 'medium',
      energyWh: 0.12
    });

    const items = getBlackBoxItems();
    expect(items.length).toBe(1);
    // Personal email and phone must be sanitized
    expect(items[0].query).not.toContain('test.user@example.com');
    expect(items[0].query).not.toContain('+91 9876543210');
    expect(items[0].query).toContain('[EMAIL_REDACTED]');
    expect(items[0].query).toContain('[PHONE_REDACTED]');
  });

  it('exports JSON without sensitive tokens or API keys', () => {
    logInteractionToBlackBox({
      query: 'Check certification FSC-12345',
      answerSummary: 'FSC verified.',
      confidence: 'high',
      energyWh: 0.07
    });

    const json = exportBlackBoxJSON();
    expect(typeof json).toBe('string');
    const parsed = JSON.parse(json);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed.length).toBe(1);
    expect(json).not.toContain('GEMINI_API_KEY');
    expect(json).not.toContain('secret');
  });

  it('clears log on explicit user command', () => {
    logInteractionToBlackBox({ query: 'Q1', answerSummary: 'A1' });
    expect(getBlackBoxItems().length).toBe(1);

    clearBlackBox();
    expect(getBlackBoxItems().length).toBe(0);
  });
});

