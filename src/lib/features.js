/**
 * EcoMart Feature Flags
 * Competition Demo Safety: Any feature can be toggled on/off with a single boolean flag.
 */
export const FEATURES = {
  // Phase 1: Priority-Weighted Multi-Criteria Decision Engine
  DECISION_ENGINE: true,

  // Phase 2: Eco Check Any Product (paste-a-product analyzer)
  ECO_CHECK: true,

  // Phase 3: Proactive Copilot nudges (rate-limited, dismissible)
  PROACTIVE_COPILOT: true,

  // Phase 4: Product Lifecycle Explorer 5-stage timeline
  LIFECYCLE_EXPLORER: true,

  // Phase 5: Year-Ahead Projection and Purpose Report export
  YEAR_AHEAD_REPORT: true,

  // Phase 6: Personalised "For You" on-device recommendation row
  FOR_YOU_LEARNING: true,

  // Phase 7: Hindi / English bilingual toggle with offline font
  HINDI_LANGUAGE: true,

  // Phase 8: Offline Speech Synthesis (read aloud)
  SPEECH_SYNTHESIS: true,

  // Phase 8: Pitch Mode presenter tour (shortcut 'P')
  PITCH_MODE: true
};

/**
 * Helper to check if a feature is enabled
 * @param {keyof typeof FEATURES} featureKey
 * @returns {boolean}
 */
export function isFeatureEnabled(featureKey) {
  return Boolean(FEATURES[featureKey]);
}
