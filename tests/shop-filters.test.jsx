import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';

import productsData from '../src/data/products.json';
import { CATEGORIES, findCategory, isMatchingCategory } from '../src/data/categories.js';
import { hasVerifiedCertification } from '../src/lib/certificationUtils.js';
import { rankProducts, DEFAULT_PRIORITIES } from '../src/lib/decisionEngine.js';

import { ThemeProvider } from '../src/context/ThemeContext.jsx';
import { I18nProvider } from '../src/context/I18nContext.jsx';
import { AuthProvider } from '../src/context/AuthContext.jsx';
import { CartProvider } from '../src/context/CartContext.jsx';
import { ProductsProvider } from '../src/context/ProductsContext.jsx';
import ShopPage from '../src/pages/ShopPage.jsx';

function getCleanText(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function renderShopWithRoute(initialUrl = '/shop') {
  const html = renderToString(
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <CartProvider>
            <ProductsProvider initialProducts={productsData}>
              <MemoryRouter initialEntries={[initialUrl]}>
                <ShopPage />
              </MemoryRouter>
            </ProductsProvider>
          </CartProvider>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
  return { html, text: getCleanText(html) };
}

describe('Step 2: Shop Filters, Category Selection & Live Count Test Suite', () => {
  // Test 1: No filter is active by default
  describe('Default State: No filters active', () => {
    it('shows all products on default mount without hiding conventional items', () => {
      const { text } = renderShopWithRoute('/shop');
      expect(text).toContain(`${productsData.length} Products Indexed`);
      expect(text).not.toContain('Eco Certified Only');
      expect(text).toContain(`Showing 1–24 of ${productsData.length} products`);
    });
  });

  // Test 2: Categories Single Source of Truth & Live Tile Matching
  describe('Category Single Source of Truth & Category Filtering', () => {
    it('exports all 8 canonical categories with id and label', () => {
      expect(CATEGORIES).toHaveLength(8);
      const expectedIds = [
        'kitchen',
        'personal-care',
        'fashion',
        'stationery',
        'home',
        'bags',
        'outdoor-travel',
        'cleaning-laundry'
      ];
      expect(CATEGORIES.map((c) => c.id)).toEqual(expectedIds);
    });

    it('matches categories by slug, display label, and aliases robustly', () => {
      expect(isMatchingCategory('Kitchen', 'kitchen')).toBe(true);
      expect(isMatchingCategory('Kitchen', 'culinary')).toBe(true);
      expect(isMatchingCategory('Personal Care', 'personal-care')).toBe(true);
      expect(isMatchingCategory('Personal Care', 'self-care')).toBe(true);
      expect(isMatchingCategory('Cleaning & Laundry', 'cleaning-laundry')).toBe(true);
      expect(isMatchingCategory('Cleaning & Laundry', 'cleaning')).toBe(true);
      expect(isMatchingCategory('Outdoor & Travel', 'outdoor-travel')).toBe(true);
      expect(isMatchingCategory('Outdoor & Travel', 'travel')).toBe(true);
      expect(isMatchingCategory('Home', 'decor')).toBe(true);
    });

    // Test each category tile shows exactly that category's products
    CATEGORIES.forEach((cat) => {
      it(`filters accurately for category "${cat.label}" (?category=${cat.id})`, () => {
        const { text } = renderShopWithRoute(`/shop?category=${cat.id}`);
        const expectedCount = productsData.filter((p) => isMatchingCategory(p.category, cat.id)).length;
        expect(expectedCount).toBeGreaterThanOrEqual(15);
        if (expectedCount <= 24) {
          expect(text).toContain(`Showing all ${expectedCount} product`);
        } else {
          expect(text).toContain(`Showing 1–24 of ${expectedCount} products`);
        }
        expect(text).toContain(`Department: ${cat.label}`);
      });
    });
  });

  // Test 3: All filters combine with AND
  describe('Filter Combinations: Logical AND Composition', () => {
    it('filters by Price Range correctly (?price=400)', () => {
      const { text } = renderShopWithRoute('/shop?price=400');
      const expectedCount = productsData.filter((p) => p.price <= 400).length;
      if (expectedCount <= 24) {
        expect(text).toContain(`Showing all ${expectedCount} product`);
      } else {
        expect(text).toContain(`Showing 1–24 of ${expectedCount} products`);
      }
      expect(text).toContain('Under ₹400');
    });

    it('filters by Eco Grade correctly (?grade=A)', () => {
      const { text } = renderShopWithRoute('/shop?grade=A');
      expect(text).toContain('Grade A');
    });

    it('filters by Plastic-Free correctly (?plasticFree=true)', () => {
      const { text } = renderShopWithRoute('/shop?plasticFree=true');
      expect(text).toContain('Plastic-Free Only');
    });

    it('filters by Eco Certified Only with stored source URLs (?ecoCertified=true)', () => {
      const { text } = renderShopWithRoute('/shop?ecoCertified=true');
      expect(text).toContain('Eco Certified Only');
    });

    it('combines Category + Price + Plastic-Free with AND (?category=kitchen&price=400&plasticFree=true)', () => {
      const { text } = renderShopWithRoute('/shop?category=kitchen&price=400&plasticFree=true');
      const expectedCount = productsData.filter(
        (p) =>
          isMatchingCategory(p.category, 'kitchen') &&
          p.price <= 400 &&
          (p.packaging === 'plastic-free' || p.plasticGrams === 0)
      ).length;

      expect(text).toContain(`Showing all ${expectedCount} product`);
      expect(text).toContain('Department: Kitchen');
      expect(text).toContain('Under ₹400');
      expect(text).toContain('Plastic-Free Only');
    });
  });

  // Test 4: My Priorities sliders re-rank without removing products
  describe('My Priorities Decision Engine: Re-ranking without hiding items', () => {
    it('scores and re-ranks all products without dropping a single item', () => {
      const candidates = productsData.slice(0, 10);
      const ranked = rankProducts(candidates, { price: 100, carbon: 0, plastic: 0, water: 0, local: 0, certs: 0, ecoScore: 0 }, {});
      expect(ranked).toHaveLength(10);
      expect(ranked[0].price).toBeLessThanOrEqual(ranked[ranked.length - 1].price);
    });

    it('prioritizes low plastic when plastic priority is 100 without dropping non-zero items', () => {
      const ranked = rankProducts(productsData, { price: 0, carbon: 0, plastic: 100, water: 0, local: 0, certs: 0, ecoScore: 0 }, {});
      expect(ranked).toHaveLength(productsData.length);
      expect(ranked[0].plasticGrams).toBe(0);
    });
  });

  // Test 5: Reset All returns the full count
  describe('Reset All Filters & URL Persistence', () => {
    it(`returns full count of ${productsData.length} products when reset (/shop)`, () => {
      const { text } = renderShopWithRoute('/shop');
      expect(text).toContain(`${productsData.length} Products Indexed`);
      expect(text).toContain(`Showing 1–24 of ${productsData.length} products`);
    });
  });

  // Test 6: Empty state when filters match 0 products
  describe('Shop Empty State', () => {
    it('renders clean empty state with reset button when price is impossibly low (?price=10)', () => {
      const { text } = renderShopWithRoute('/shop?price=10');
      expect(text).toContain('No products match the selected filters');
      expect(text).toContain('Reset All Filters');
    });
  });
});
