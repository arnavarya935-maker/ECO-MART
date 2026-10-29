/**
 * EcoMart Confidence Brake Engine
 * Implements strictness thresholding for Responsible AI compliance.
 *
 * When the agent's confidence in an answer falls below the user's configured
 * strictness threshold, the agent declines to answer, explains what specific
 * missing data is required, and logs the refusal to the Black Box & Honesty Meter.
 */

const STRICTNESS_STORAGE_KEY = 'ecomart_agent_strictness';
export const DEFAULT_STRICTNESS = 70; // 70% threshold

let memoryStrictness = null;

export function getStrictnessThreshold() {
  if (memoryStrictness !== null) {
    return memoryStrictness;
  }
  try {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(STRICTNESS_STORAGE_KEY);
      if (saved !== null) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
          return parsed;
        }
      }
    }
  } catch {
    // In-memory fallback
  }
  return DEFAULT_STRICTNESS;
}

export function setStrictnessThreshold(val) {
  const clamped = Math.max(0, Math.min(100, Math.round(Number(val) || DEFAULT_STRICTNESS)));
  memoryStrictness = clamped;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STRICTNESS_STORAGE_KEY, String(clamped));
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('strictness-updated', { detail: clamped }));
      }
    }
  } catch {
    // Ignore in edge environments
  }
  return clamped;
}

/**
 * Calculates numerical confidence (0 to 100) for a query and response
 */
export function estimateQueryConfidence(query = '', rawConfidence = 'medium', answerText = '') {
  const qLower = (query || '').toLowerCase();
  const aLower = (answerText || '').toLowerCase();

  let score = 75;

  if (rawConfidence === 'high') score = 92;
  else if (rawConfidence === 'low') score = 42;
  else if (rawConfidence === 'medium') score = 68;

  // Unsubstantiated or high-risk claims pull confidence down
  if (/100%\s*(eco|green|natural|pure)|chemical[\s-]*free|zero[\s-]*harm|save\s*the\s*earth/i.test(qLower)) {
    score -= 25;
  }
  if (/cure|disease|cancer|health\s*benefit|medical/i.test(qLower)) {
    score -= 35;
  }
  if (/plastic.*(eco|biodegradable|ocean)/i.test(qLower)) {
    score -= 15;
  }

  // Accredited standards boost confidence
  if (/fsc|gots|usda|india\s*organic|astm|en\s*13432|fair\s*trade/i.test(qLower + ' ' + aLower)) {
    score += 18;
  }

  return Math.max(15, Math.min(98, score));
}

/**
 * Evaluates whether Confidence Brake should halt the agent's answer
 */
export function evaluateConfidenceBrake({
  query = '',
  rawConfidence = 'medium',
  answerText = '',
  strictness = getStrictnessThreshold()
}) {
  const confidenceScore = estimateQueryConfidence(query, rawConfidence, answerText);
  const brakeTriggered = confidenceScore < strictness;

  const neededInfo = [
    'Third-party laboratory test report (e.g. ASTM D6400 / EN 13432 for degradation)',
    'Exact percentage breakdown of polymers or composite materials by weight',
    'Valid certification license number from an accredited registry (FSC, GOTS)'
  ];

  if (/plastic|bottle|packaging/i.test(query)) {
    neededInfo.unshift('Municipal waste sorting resin code (#1 to #7) and industrial composting access');
  }

  if (/artisan|cotton|textile|shirt|tote/i.test(query)) {
    neededInfo.unshift('Direct supply-chain origin and regional artisan fair-wage documentation');
  }

  const refusalMessage = `🛡️ Confidence Brake Engaged: My calculated certainty for this query is ${confidenceScore}%, which is below your strictness threshold of ${strictness}%. 

In accordance with Eco Sense's Responsible AI policies, I decline to make assumptions or risk greenwashing without seller lifecycle documentation.

To provide an evidence-based assessment, I need:
${neededInfo.map((info, idx) => `${idx + 1}. ${info}`).join('\n')}

You can adjust your Strictness threshold in Settings or provide additional packaging data.`;

  return {
    brakeTriggered,
    confidenceScore,
    strictness,
    neededInfo,
    refusalMessage
  };
}
