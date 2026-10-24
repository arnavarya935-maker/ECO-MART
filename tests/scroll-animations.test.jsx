import { describe, it, expect } from 'vitest';
import {
  clampVelocity,
  computeScrollProgress,
  getStageForProgress,
  isReducedMotion
} from '../src/lib/scrollAnimation';

describe('Scroll Animation Utilities', () => {
  describe('clampVelocity', () => {
    it('clamps velocity within limits', () => {
      expect(clampVelocity(25, 40)).toBe(25);
      expect(clampVelocity(100, 40)).toBe(40);
      expect(clampVelocity(-85, 40)).toBe(-40);
      expect(clampVelocity(-15, 40)).toBe(-15);
    });

    it('handles NaN or non-number velocity gracefully', () => {
      expect(clampVelocity(NaN, 40)).toBe(0);
      expect(clampVelocity(undefined, 40)).toBe(0);
      expect(clampVelocity(null, 40)).toBe(0);
    });
  });

  describe('computeScrollProgress', () => {
    it('computes standard in-view progress correctly', () => {
      const viewportHeight = 1000;
      // Element top at 1000, height 500: total travel = 1500, current = 1000 - 1000 = 0 -> progress 0
      expect(computeScrollProgress({ top: 1000, height: 500 }, viewportHeight)).toBe(0);

      // Element top at 250, height 500: current = 1000 - 250 = 750 / 1500 = 0.5
      expect(computeScrollProgress({ top: 250, height: 500 }, viewportHeight)).toBeCloseTo(0.5);

      // Element top at -500, height 500: current = 1000 - (-500) = 1500 / 1500 = 1.0
      expect(computeScrollProgress({ top: -500, height: 500 }, viewportHeight)).toBe(1);
    });

    it('clamps progress strictly between 0 and 1', () => {
      const viewportHeight = 800;
      expect(computeScrollProgress({ top: 2000, height: 400 }, viewportHeight)).toBe(0);
      expect(computeScrollProgress({ top: -2000, height: 400 }, viewportHeight)).toBe(1);
    });

    it('computes pinned scroll progress correctly when pinTravel > 0', () => {
      const pinTravel = 600;
      expect(computeScrollProgress({ top: 50, height: 800 }, 800, pinTravel)).toBe(0);
      expect(computeScrollProgress({ top: 0, height: 800 }, 800, pinTravel)).toBe(0);
      expect(computeScrollProgress({ top: -300, height: 800 }, 800, pinTravel)).toBe(0.5);
      expect(computeScrollProgress({ top: -600, height: 800 }, 800, pinTravel)).toBe(1);
      expect(computeScrollProgress({ top: -900, height: 800 }, 800, pinTravel)).toBe(1);
    });

    it('returns 0 for invalid inputs', () => {
      expect(computeScrollProgress(null, 800)).toBe(0);
      expect(computeScrollProgress({ top: 100, height: 200 }, 0)).toBe(0);
      expect(computeScrollProgress({ top: 100, height: 200 }, -100)).toBe(0);
    });
  });

  describe('getStageForProgress', () => {
    it('partitions 4 stages evenly', () => {
      expect(getStageForProgress(0.0, 4)).toBe(0);
      expect(getStageForProgress(0.24, 4)).toBe(0);
      expect(getStageForProgress(0.25, 4)).toBe(1);
      expect(getStageForProgress(0.49, 4)).toBe(1);
      expect(getStageForProgress(0.50, 4)).toBe(2);
      expect(getStageForProgress(0.74, 4)).toBe(2);
      expect(getStageForProgress(0.75, 4)).toBe(3);
      expect(getStageForProgress(0.99, 4)).toBe(3);
      expect(getStageForProgress(1.0, 4)).toBe(3);
    });

    it('handles edge stages count', () => {
      expect(getStageForProgress(0.5, 0)).toBe(0);
      expect(getStageForProgress(0.5, -1)).toBe(0);
    });
  });

  describe('isReducedMotion', () => {
    it('returns a boolean', () => {
      expect(typeof isReducedMotion()).toBe('boolean');
    });
  });
});
