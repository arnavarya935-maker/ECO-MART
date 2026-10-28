import { describe, it, expect } from 'vitest';
import productsData from '../src/data/products.json';
import { askEcoAgent, generateLocalFallbackAnswer } from '../src/lib/ai/geminiAdapter';
import { runMultiAgentPipeline } from '../src/lib/multiAgentEngine';
import { calculateProductScore } from '../src/lib/decisionEngine';
import { evaluateConfidenceBrake } from '../src/lib/ai/confidenceBrake';

describe('Online & Offline EcoAgent Modes', () => {
  const userPriorities = { price: 50, carbon: 50, plastic: 50, water: 50, local: 50, certifications: 50, ecoScore: 50 };

  it('calculates product score with user priorities without throwing', () => {
    const p = productsData[0];
    const score = calculateProductScore(p, userPriorities);
    expect(typeof score).toBe('number');
    expect(score).toBeGreaterThan(0);
  });

  it('runs multiAgentPipeline with userPriorities successfully without ReferenceError', () => {
    const result = runMultiAgentPipeline({
      query: 'hi',
      allProducts: productsData,
      cartItems: [],
      userPriorities,
      contextProduct: null
    });
    expect(result).toBeDefined();
    expect(result.pipelineHandoffs).toHaveLength(4);
    expect(result.pipelineHandoffs[1].role.name).toBe('Researcher Agent');
  });

  it('handles conversational greetings gracefully with high confidence', () => {
    const greeting = generateLocalFallbackAnswer('hi', 'en');
    expect(greeting.confidence).toBe('high');
    expect(greeting.answer).toContain('Eco Sense Shopping Assistant');
    expect(greeting.recommended_categories.length).toBeGreaterThan(0);
  });

  it('confidence brake does not falsely intercept conversational greetings', () => {
    const greeting = generateLocalFallbackAnswer('hello', 'en');
    const brakeCheck = evaluateConfidenceBrake({
      query: 'hello',
      rawConfidence: greeting.confidence,
      answerText: greeting.answer,
      strictness: 70
    });
    expect(brakeCheck.brakeTriggered).toBe(false);
  });

  it('askEcoAgent honors offline mode without network calls', async () => {
    const res = await askEcoAgent({
      query: 'Find plastic-free kitchen essentials',
      language: 'en',
      mode: 'offline'
    });
    expect(res).toBeDefined();
    expect(res.isFallback).toBe(true);
  });
});
