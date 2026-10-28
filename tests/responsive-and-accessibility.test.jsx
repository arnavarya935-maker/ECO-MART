import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';

import ReasoningExplanationCard from '../src/components/EcoAgent/ReasoningExplanationCard.jsx';
import ProductCard from '../src/components/ProductCard.jsx';
import { ThemeProvider, useTheme } from '../src/context/ThemeContext.jsx';
import { I18nProvider } from '../src/context/I18nContext.jsx';
import { CartProvider } from '../src/context/CartContext.jsx';
import productsData from '../src/data/products.json';

describe('Phase 7: Responsive and Accessibility Suite', () => {
  it('ReasoningExplanationCard uses flex-wrap and gap to prevent badge overlap on 390px mobile and 1366px desktop', () => {
    const mockTrace = {
      userQuery: 'bamboo toothbrush under 200',
      confidence: 'High',
      confidencePct: 94,
      modelUsed: 'Decision Engine (Smart rules)',
      categoryDetected: 'Personal Care',
      matchedProducts: [productsData[0]],
      steps: [
        { title: 'Understood request', detail: 'Parsed keywords and budget filter <= 200' },
        { title: 'Filtered catalog', detail: 'Found 1 green product matching category' }
      ]
    };

    const html = renderToString(
      <MemoryRouter>
        <ReasoningExplanationCard trace={mockTrace} />
      </MemoryRouter>
    );

    // Verify layout uses flex-wrap and gap
    expect(html).toContain('flex-wrap');
    expect(html).toContain('gap-2');
    expect(html).toContain('High');
    expect(html).not.toMatch(/\bundefined\b/);
  });

  it('ProductCard contains accessible min-h-[44px] touch target for buttons', () => {
    const html = renderToString(
      <MemoryRouter>
        <ThemeProvider>
          <I18nProvider defaultLang="en">
            <CartProvider>
              <ProductCard product={productsData[0]} />
            </CartProvider>
          </I18nProvider>
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(html).toContain('min-h-[44px]');
    expect(html).not.toMatch(/\bundefined\b/);
  });

  it('Accessibility modes: ThemeProvider exposes highContrast and reduceEffects states', () => {
    const themeHolder = { current: null };
    function ThemeProbe() {
      themeHolder.current = useTheme();
      return null;
    }

    renderToString(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    );

    expect(themeHolder.current).toBeDefined();
    expect(typeof themeHolder.current.highContrast).toBe('boolean');
    expect(typeof themeHolder.current.reduceEffects).toBe('boolean');
    expect(typeof themeHolder.current.setHighContrast).toBe('function');
    expect(typeof themeHolder.current.toggleReduceEffects).toBe('function');
  });
});
