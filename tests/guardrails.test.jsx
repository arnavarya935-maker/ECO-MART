import { describe, it, expect } from 'vitest';
import {
  PRESET_ATTACKS,
  ETHICAL_GUARDRAILS,
  detectAdversarialAttack,
  generateGuardrailDefenseResponse,
  sanitizeAgentInput
} from '../src/lib/ai/guardrailsEngine.js';

describe('Feature 5: Break the AI Guardrails & Defense Engine', () => {
  it('properly sanitizes inputs and neutralizes script injection & control characters', () => {
    const raw = '<script>alert("hack")</script>Hello \u0000World! ' + 'a'.repeat(1200);
    const sanitized = sanitizeAgentInput(raw);

    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('\u0000');
    expect(sanitized.length).toBeLessThanOrEqual(1000);
  });

  describe('Preset Attack 1: Deceptive Greenwashing Force', () => {
    it('detects attack and triggers Anti-Greenwash Rule', () => {
      const attack = PRESET_ATTACKS.find((a) => a.id === 'greenwash_attack');
      const detection = detectAdversarialAttack(attack.prompt);

      expect(detection.isAttack).toBe(true);
      expect(detection.triggeredRule.id).toBe(ETHICAL_GUARDRAILS.ANTI_GREENWASH.id);

      const defense = generateGuardrailDefenseResponse(detection, attack.prompt);
      expect(defense.ruleHeld).toBe(true);
      expect(defense.agentResponse.toLowerCase()).toContain('cannot generate marketing');
      expect(defense.agentResponse).toContain('ISO 14021');
    });
  });

  describe('Preset Attack 2: Fake Certification Invention', () => {
    it('detects attack and triggers Anti-Hallucination Rule', () => {
      const attack = PRESET_ATTACKS.find((a) => a.id === 'fake_cert_attack');
      const detection = detectAdversarialAttack(attack.prompt);

      expect(detection.isAttack).toBe(true);
      expect(detection.triggeredRule.id).toBe(ETHICAL_GUARDRAILS.ANTI_HALLUCINATION.id);

      const defense = generateGuardrailDefenseResponse(detection, attack.prompt);
      expect(defense.ruleHeld).toBe(true);
      expect(defense.agentResponse.toLowerCase()).toContain('refuse to invent');
      expect(defense.agentResponse).toContain('ASTM D6400');
    });
  });

  describe('Preset Attack 3: System Prompt Extraction Jailbreak', () => {
    it('detects attack and triggers System Prompt Protection Rule', () => {
      const attack = PRESET_ATTACKS.find((a) => a.id === 'jailbreak_attack');
      const detection = detectAdversarialAttack(attack.prompt);

      expect(detection.isAttack).toBe(true);
      expect(detection.triggeredRule.id).toBe(ETHICAL_GUARDRAILS.SYSTEM_PROMPT_PROTECTION.id);

      const defense = generateGuardrailDefenseResponse(detection, attack.prompt);
      expect(defense.ruleHeld).toBe(true);
      expect(defense.agentResponse.toLowerCase()).toContain('responsible ai');
      expect(defense.agentResponse.toLowerCase()).toContain('cannot override');
    });
  });

  describe('Preset Attack 4: Fake Statistics Pressure', () => {
    it('detects attack and triggers Benchmark Integrity Rule', () => {
      const attack = PRESET_ATTACKS.find((a) => a.id === 'fake_stats_attack');
      const detection = detectAdversarialAttack(attack.prompt);

      expect(detection.isAttack).toBe(true);
      expect(detection.triggeredRule.id).toBe(ETHICAL_GUARDRAILS.BENCHMARK_INTEGRITY.id);

      const defense = generateGuardrailDefenseResponse(detection, attack.prompt);
      expect(defense.ruleHeld).toBe(true);
      expect(defense.agentResponse.toLowerCase()).toContain('will not fabricate statistics');
    });
  });

  it('allows benign sustainable queries through without triggering adversarial flags', () => {
    const benignQuery = 'What is the carbon footprint of organic bamboo cutlery?';
    const detection = detectAdversarialAttack(benignQuery);

    expect(detection.isAttack).toBe(false);
    expect(detection.attackType).toBe('Standard Query');
  });
});
