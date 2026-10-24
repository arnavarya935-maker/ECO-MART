/**
 * Eco Copilot Decision & Rate-Limiting Engine
 * Pure logic module: Handles trigger rules, 20s rate limiter, 5/session budget,
 * and transparent "Why am I seeing this?" reasoning.
 */

import { calculateEcoScore } from './ecoScore.js';
import { getSwapSuggestion } from './ecoAgent.js';

export class CopilotEngine {
  constructor(options = {}) {
    this.cooldownMs = options.cooldownMs ?? 20000; // 20s
    this.maxSessionNudges = options.maxSessionNudges ?? 5; // 5 per session
    this.lastNudgeTime = 0;
    this.nudgeCount = 0;
    this.categoryViews = {};
    this.dismissedNudges = new Set();
  }

  /**
   * Reset session state
   */
  reset() {
    this.lastNudgeTime = 0;
    this.nudgeCount = 0;
    this.categoryViews = {};
    this.dismissedNudges.clear();
  }

  /**
   * Checks whether a nudge can be presented under current constraints
   */
  canNudge({
    now = Date.now(),
    isMuted = false
  } = {}) {
    if (isMuted) return false;
    if (this.nudgeCount >= this.maxSessionNudges) return false;
    if (this.lastNudgeTime > 0 && now - this.lastNudgeTime < this.cooldownMs) return false;
    return true;
  }

  /**
   * Record that a nudge was shown
   */
  recordNudge(now = Date.now()) {
    this.lastNudgeTime = now;
    this.nudgeCount += 1;
  }

  /**
   * Trigger 1: Low-grade item added to cart
   */
  checkCartAdd(product, allProducts, env = {}) {
    if (!product) return null;
    const now = env.now ?? Date.now();
    if (!this.canNudge({ ...env, now })) return null;

    const scoreData = calculateEcoScore(product);
    const isLowGrade = !product.isEcoFriendly || (scoreData && ['C', 'D', 'E'].includes(scoreData.grade));

    if (!isLowGrade) return null;

    const swap = getSwapSuggestion(product, allProducts);
    if (!swap || !swap.greenerProduct) return null;

    this.recordNudge(now);

    return {
      id: `copilot-swap-${product.id}-${now}`,
      type: 'swap',
      title: 'Greener Swap Recommended 🌱',
      message: `Swap "${product.name}" with "${swap.greenerProduct.name}" to eliminate plastic waste.`,
      trigger: 'Conventional or low-grade item added to cart',
      reasoning: `The added item has an EcoScore of ${scoreData?.score ?? 0}/100. Swapping to ${swap.greenerProduct.name} improves impact: ${swap.impact?.summary || 'significantly lowers carbon and plastic'}.`,
      product,
      greenerProduct: swap.greenerProduct,
      impact: swap.impact,
      actionLabel: '1-Tap Swap',
      actionType: 'swap'
    };
  }

  /**
   * Trigger 2: Cart average EcoScore changed by 5+ points
   */
  checkCartScoreChange(prevScore, newScore, env = {}) {
    if (typeof prevScore !== 'number' || typeof newScore !== 'number') return null;
    const now = env.now ?? Date.now();
    if (!this.canNudge({ ...env, now })) return null;

    const diff = Math.round(newScore - prevScore);
    if (Math.abs(diff) < 5) return null;

    this.recordNudge(now);

    const improved = diff > 0;
    return {
      id: `copilot-score-${now}`,
      type: 'score_change',
      title: improved ? 'Cart EcoScore Improved! 🌟' : 'Cart EcoScore Alert ⚠️',
      message: improved
        ? `Your basket average EcoScore just jumped +${diff} points to ${newScore}/100!`
        : `Your basket average EcoScore dropped by ${Math.abs(diff)} points to ${newScore}/100.`,
      trigger: 'Cart average EcoScore changed by 5+ points',
      reasoning: `Real-time basket tracking ensures that items you add or swap keep your shopping aligned with your personal eco priorities.`,
      diff,
      newScore,
      actionLabel: 'View Impact',
      actionType: 'open_cart'
    };
  }

  /**
   * Trigger 3: User within 15% of stated agent budget
   */
  checkBudgetProximity(cartTotal, statedBudget, env = {}) {
    if (!statedBudget || statedBudget <= 0 || !cartTotal || cartTotal <= 0) return null;
    const now = env.now ?? Date.now();
    if (!this.canNudge({ ...env, now })) return null;

    const threshold = statedBudget * 0.85;
    if (cartTotal >= threshold && cartTotal <= statedBudget) {
      this.recordNudge(now);
      const remaining = statedBudget - cartTotal;
      return {
        id: `copilot-budget-${now}`,
        type: 'budget',
        title: 'Approaching Your Budget 🎯',
        message: `Your cart is at ₹${cartTotal}, within 15% of your stated ₹${statedBudget} budget.`,
        trigger: 'Cart total is within 15% of stated budget',
        reasoning: `You mentioned a ₹${statedBudget} budget in agent chat. You have ₹${remaining} remaining before reaching your limit.`,
        cartTotal,
        statedBudget,
        actionLabel: 'Review Cart',
        actionType: 'open_cart'
      };
    }
    return null;
  }

  /**
   * Trigger 4: Category viewed 3 times
   */
  checkCategoryBrowsing(category, env = {}) {
    if (!category || category === 'All') return null;
    this.categoryViews[category] = (this.categoryViews[category] || 0) + 1;

    if (this.categoryViews[category] === 3) {
      const now = env.now ?? Date.now();
      if (!this.canNudge({ ...env, now })) return null;

      this.recordNudge(now);
      return {
        id: `copilot-cat-${category}-${now}`,
        type: 'category',
        title: `Explore ${category} Starter Kit? 🧺`,
        message: `You've viewed ${category} items 3 times. Would you like a guided zero-waste starter basket?`,
        trigger: `Viewed ${category} department 3 times`,
        reasoning: `Browsing multiple items in the same department indicates an intent to transition that lifestyle area to zero waste.`,
        category,
        actionLabel: 'Build Guided Basket',
        actionType: 'build_basket'
      };
    }
    return null;
  }

}

export const copilotEngine = new CopilotEngine();
