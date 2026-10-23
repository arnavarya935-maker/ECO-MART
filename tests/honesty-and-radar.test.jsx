import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { calculateHonestyMetrics } from '../src/components/EcoAgent/HonestyMeter';
import { computeClaimRadarAxes } from '../src/lib/ai/geminiAdapter';
import { getProductLifecycleStages } from '../src/lib/lifecycleEngine.js';
import LifecycleTimelineScrubber from '../src/components/lifecycle/LifecycleTimelineScrubber';
import ClassImpactGarden from '../src/components/tools/ClassImpactGarden';
import productsData from '../src/data/products.json';

describe('Feature 7: Honesty Meter & Uncertainty Engine', () => {
  it('provides calibrated baseline honesty metrics so session is never an empty void', () => {
    const metrics = calculateHonestyMetrics([]);
    expect(metrics.notSureCount).toBeGreaterThan(0);
    expect(metrics.avgConfidence).toBeGreaterThan(50);
    expect(metrics.avgConfidence).toBeLessThanOrEqual(100);
    expect(metrics.uncertaintyLog.length).toBeGreaterThan(0);
    expect(metrics.historyConfidence.length).toBeGreaterThanOrEqual(5);
  });

  it('detects admitted uncertainty and low confidence in agent messages', () => {
    const messages = [
      {
        id: 'msg-1',
        sender: 'agent',
        text: "I am not sure if this packaging degrades in 5 days without commercial heat.",
        confidence: 'low',
        query: 'Does it degrade in 5 days?'
      },
      {
        id: 'msg-2',
        sender: 'agent',
        text: 'This bamboo toothbrush has verified FSC chain of custody.',
        confidence: 'high',
        query: 'Is bamboo verified?'
      }
    ];

    const metrics = calculateHonestyMetrics(messages);
    expect(metrics.uncertaintyLog.some((u) => u.query === 'Does it degrade in 5 days?')).toBe(true);
    expect(metrics.notSureCount).toBeGreaterThan(2);
    expect(metrics.historyConfidence[metrics.historyConfidence.length - 2]).toBe(45);
  });
});

describe('Feature 3: Claim Radar 5-Axis Engine', () => {
  it('calculates 5 scored axes between 0 and 100 for any marketing claim', () => {
    const axes = computeClaimRadarAxes('100% eco-friendly natural green plastic bottle');
    expect(axes).toBeDefined();
    expect(typeof axes.vague_wording).toBe('number');
    expect(typeof axes.proof).toBe('number');
    expect(typeof axes.certification).toBe('number');
    expect(typeof axes.specificity).toBe('number');
    expect(typeof axes.comparison_basis).toBe('number');

    expect(axes.vague_wording).toBeLessThanOrEqual(60);
    expect(axes.proof).toBeLessThanOrEqual(50);
  });

  it('rewards specific claims with legitimate certifications and benchmarks', () => {
    const vagueAxes = computeClaimRadarAxes('Pure miraculous all-natural cleaner');
    const certifiedAxes = computeClaimRadarAxes(
      'FSC certified Moso bamboo toothbrush replacing 80g plastic with backyard compostable handle verified by ISO 14044 LCA.'
    );

    expect(certifiedAxes.certification).toBeGreaterThan(vagueAxes.certification);
    expect(certifiedAxes.specificity).toBeGreaterThan(vagueAxes.specificity);
  });
});

describe('Feature 6: Lifecycle Timeline Scrubber & Engine', () => {
  it('generates 5 lifecycle stages for catalog products', () => {
    const stages = getProductLifecycleStages(productsData[0], productsData);
    expect(stages.length).toBe(5);
    const ids = stages.map((s) => s.id);
    expect(ids).toContain('material');
    expect(ids).toContain('making');
    expect(ids).toContain('transport');
    expect(ids).toContain('packaging');
    expect(ids).toContain('end-of-life');
  });

  it('renders LifecycleTimelineScrubber with Make, Ship, Use, Second Life and Estimate label', () => {
    const html = renderToString(<LifecycleTimelineScrubber product={productsData[0]} />);
    expect(html).toContain('Make');
    expect(html).toContain('Ship');
    expect(html).toContain('Use');
    expect(html).toContain('Second Life');
    expect(html).toContain('Estimate');
  });
});

describe('Feature 9: Class Impact Garden', () => {
  it('renders anonymous collective school garden without personal identifiers', () => {
    const html = renderToString(<ClassImpactGarden />);
    expect(html).toContain('Class Impact Garden');
    expect(html).toContain('Zero PII / 100% Anonymous');
    expect(html).toContain('Collective Indigenous Canopy');
  });
});
