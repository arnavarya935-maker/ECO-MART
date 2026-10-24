/**
 * EcoMart Feature Flags
 * Modular switches for application capabilities.
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

  // Flagship Feature: Cart Transformer (Offline Shopping List to Sustainable Basket)
  CART_TRANSFORMER: true,
  cartTransformer: true,

  // Additional Responsible AI Features (F1-F8)
  AI_COURTROOM: true,
  LABEL_SCANNER: true,
  CONFIDENCE_BRAKE: true,
  ETHICS_DILEMMAS: true,
  CHOICE_RIPPLE: true,
  PRODUCT_TIME_MACHINE: true,
  AI_SELF_AUDIT: true,
  KIRANA_MODE: true
};

/**
 * Helper to check if a feature is enabled
 * @param {keyof typeof FEATURES | string} featureKey
 * @returns {boolean}
 */
export function isFeatureEnabled(featureKey) {
  if (!featureKey) return false;
  if (FEATURES[featureKey] !== undefined) return Boolean(FEATURES[featureKey]);
  const upper = String(featureKey).toUpperCase();
  if (FEATURES[upper] !== undefined) return Boolean(FEATURES[upper]);
  return false;
}
