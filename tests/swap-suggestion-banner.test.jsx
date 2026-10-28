import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import SwapSuggestionBanner from '../src/components/EcoAgent/SwapSuggestionBanner';
import { CartProvider } from '../src/context/CartContext';

describe('SwapSuggestionBanner Component', () => {
  it('renders without throwing ReferenceError when cart is empty', () => {
    expect(() => {
      renderToString(
        <MemoryRouter>
          <CartProvider>
            <SwapSuggestionBanner />
          </CartProvider>
        </MemoryRouter>
      );
    }).not.toThrow();
  });

  it('renders correctly without ReferenceError for isCartOpen', () => {
    const html = renderToString(
      <MemoryRouter>
        <CartProvider>
          <SwapSuggestionBanner />
        </CartProvider>
      </MemoryRouter>
    );
    // When no active nudge, returns null (empty string in SSR)
    expect(html).toBe('');
  });
});
