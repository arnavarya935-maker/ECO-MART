import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import productsData from '../src/data/products.json';
import { CopilotEngine } from '../src/lib/copilotEngine';

describe('Phase 3 - Proactive Copilot', () => {
  let engine;

  beforeEach(() => {
    vi.useFakeTimers();
    engine = new CopilotEngine({ cooldownMs: 20000, maxSessionNudges: 5 });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('triggers swap nudge when conventional low-grade item is added to cart', () => {
    const convItem = productsData.find((p) => !p.isEcoFriendly);
    expect(convItem).toBeDefined();

    const nudge = engine.checkCartAdd(convItem, productsData, { now: 1000 });
    expect(nudge).not.toBeNull();
    expect(nudge.type).toBe('swap');
    expect(nudge.trigger).toContain('item added to cart');
    expect(nudge.reasoning).toBeDefined();
    expect(nudge.actionLabel).toBe('1-Tap Swap');
  });

  it('rate-limits nudges to at most one per 20 seconds', () => {
    const convItem = productsData.find((p) => !p.isEcoFriendly);

    // 1st nudge at t = 1,000ms -> should succeed
    const nudge1 = engine.checkCartAdd(convItem, productsData, { now: 1000 });
    expect(nudge1).not.toBeNull();

    // 2nd nudge at t = 10,000ms (10s later, cooldown 20s) -> should be blocked!
    const nudge2 = engine.checkCartScoreChange(80, 70, { now: 10000 });
    expect(nudge2).toBeNull();

    // Fast-forward time past 20s: t = 22,000ms (21s later) -> should succeed!
    const nudge3 = engine.checkCartScoreChange(80, 70, { now: 22000 });
    expect(nudge3).not.toBeNull();
  });

  it('enforces maximum 5 nudges per session', () => {
    const convItem = productsData.find((p) => !p.isEcoFriendly);

    // Fire 5 nudges separated by 25s
    for (let i = 0; i < 5; i++) {
      const time = (i + 1) * 25000;
      const n = engine.checkCartAdd(convItem, productsData, { now: time });
      expect(n).not.toBeNull();
    }

    // 6th nudge at 6 * 25000ms -> must be blocked due to session cap
    const nudge6 = engine.checkCartAdd(convItem, productsData, { now: 6 * 25000 });
    expect(nudge6).toBeNull();
  });

  it('respects isMuted to suppress nudges', () => {
    const convItem = productsData.find((p) => !p.isEcoFriendly);

    // Muted -> blocked
    const mutedNudge = engine.checkCartAdd(convItem, productsData, {
      now: 1000,
      isMuted: true
    });
    expect(mutedNudge).toBeNull();

    // Not muted -> allowed
    const unmutedNudge = engine.checkCartAdd(convItem, productsData, {
      now: 1000,
      isMuted: false
    });
    expect(unmutedNudge).not.toBeNull();
  });

  it('triggers budget nudge when cart total is within 15% of stated budget', () => {
    // Budget 1000, 15% threshold is 850
    const below = engine.checkBudgetProximity(800, 1000, { now: 1000 });
    expect(below).toBeNull();

    const within15Percent = engine.checkBudgetProximity(900, 1000, { now: 1000 });
    expect(within15Percent).not.toBeNull();
    expect(within15Percent.trigger).toContain('within 15%');
    expect(within15Percent.reasoning).toContain('1000');
  });

  it('triggers category guided basket nudge when viewing the same category 3 times', () => {
    // 1st and 2nd view: no nudge
    expect(engine.checkCategoryBrowsing('Kitchen', { now: 1000 })).toBeNull();
    expect(engine.checkCategoryBrowsing('Kitchen', { now: 2000 })).toBeNull();

    // 3rd view: triggers nudge
    const nudge3 = engine.checkCategoryBrowsing('Kitchen', { now: 3000 });
    expect(nudge3).not.toBeNull();
    expect(nudge3.type).toBe('category');
    expect(nudge3.trigger).toContain('3 times');
  });

  it('each nudge includes a valid trigger and transparent reasoning', () => {
    const convItem = productsData.find((p) => !p.isEcoFriendly);
    const nudge = engine.checkCartAdd(convItem, productsData, { now: 1000 });
    expect(nudge).not.toBeNull();
    expect(nudge.trigger).toBeDefined();
    expect(nudge.reasoning).toBeDefined();
    expect(nudge.reasoning.length).toBeGreaterThan(10);
  });
});
