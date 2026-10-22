import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import productsData from '../src/data/products.json';
import ProductLifecycleTimeline from '../src/components/lifecycle/ProductLifecycleTimeline';
import { ThemeProvider } from '../src/context/ThemeContext';

describe('Phase 4 - Product Lifecycle Explorer', () => {
  it('renders the 5-stage timeline for every catalog product without crashing', () => {
    expect(productsData.length).toBe(64);

    for (const product of productsData) {
      const html = renderToString(
        <ThemeProvider>
          <ProductLifecycleTimeline product={product} />
        </ThemeProvider>
      );
      expect(html).toContain('5-Stage Lifecycle Assessment');
      expect(html).toContain('Material');
      expect(html).toContain('Making');
      expect(html).toContain('Transport');
      expect(html).toContain('Packaging');
      expect(html).toContain('End of Life');
    }
  });

  it('gracefully handles a minimal product with missing fields', () => {
    const minimalProduct = { id: 'min-1', name: 'Minimal Item' };
    const html = renderToString(
      <ThemeProvider>
        <ProductLifecycleTimeline product={minimalProduct} />
      </ThemeProvider>
    );
    expect(html).toBeDefined();
    expect(html).toContain('Minimal Item');
    expect(html).toContain('Qualitative');
  });

  it('labels estimates and qualitative claims honestly', () => {
    const product = productsData[0];
    const html = renderToString(
      <ThemeProvider>
        <ProductLifecycleTimeline product={product} />
      </ThemeProvider>
    );
    expect(html).toContain('Estimate');
    expect(html).toContain('Qualitative');
  });
});
