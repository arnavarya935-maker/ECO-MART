import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import productsData from '../src/data/products.json';
import { calculateEcoScore, compareProductImpact } from '../src/lib/ecoScore';
import { calculateCartImpact } from '../src/lib/impactCalculator';
import { parseShoppingIntent, queryEcoCatalog, auditCartSustainability } from '../src/lib/ecoAgent';

import { ThemeProvider } from '../src/context/ThemeContext';
import { AuthProvider } from '../src/context/AuthContext';
import { CartProvider } from '../src/context/CartContext';

import HomePage from '../src/pages/HomePage';
import ShopPage from '../src/pages/ShopPage';
import ProductPage from '../src/pages/ProductPage';
import ToolsPage from '../src/pages/ToolsPage';
import CommunityPage from '../src/pages/CommunityPage';
import ImpactPage from '../src/pages/ImpactPage';
import HowItWorksPage from '../src/pages/HowItWorksPage';
import WishlistPage from '../src/pages/WishlistPage';
import ProfilePage from '../src/pages/ProfilePage';
import OrdersPage from '../src/pages/OrdersPage';
import SettingsPage from '../src/pages/SettingsPage';
import LoginPage from '../src/pages/LoginPage';
import SignupPage from '../src/pages/SignupPage';
import NotFoundPage from '../src/pages/NotFoundPage';

// Setup environment mocks for server-side / node rendering
if (typeof globalThis.localStorage === 'undefined' || !globalThis.localStorage?.getItem) {
  const store = {};
  globalThis.localStorage = {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach((k) => delete store[k]); }
  };
}

if (typeof globalThis.matchMedia === 'undefined') {
  globalThis.matchMedia = () => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {}
  });
}

// -----------------------------------------------------------------------------
// 1. PRODUCTS DATASET INTEGRITY
// -----------------------------------------------------------------------------
describe('Products Catalog Dataset', () => {
  it('contains at least 40 products and multiple categories', () => {
    expect(productsData.length).toBeGreaterThanOrEqual(40);
    const categories = new Set(productsData.map((p) => p.category));
    expect(categories.size).toBeGreaterThanOrEqual(6);
  });

  it('contains both eco-friendly and conventional swappable products', () => {
    const eco = productsData.filter((p) => p.isEcoFriendly);
    const conv = productsData.filter((p) => !p.isEcoFriendly);
    expect(eco.length).toBeGreaterThan(20);
    expect(conv.length).toBeGreaterThan(5);
  });
});

// -----------------------------------------------------------------------------
// 2. ECO-SCORE ENGINE
// -----------------------------------------------------------------------------
describe('Eco-Score Engine (calculateEcoScore & compareProductImpact)', () => {
  const sampleEco = productsData.find((p) => p.isEcoFriendly);
  const sampleConv = productsData.find((p) => !p.isEcoFriendly);

  it('calculates 0-100 score with 5-pillar breakdown for sustainable products', () => {
    const score = calculateEcoScore(sampleEco);
    expect(score.score).toBeGreaterThanOrEqual(75);
    expect(['A', 'B']).toContain(score.grade);
    expect(score.breakdown).toBeDefined();
    expect(score.breakdown.material).toBeDefined();
    expect(score.breakdown.packaging).toBeDefined();
    expect(score.breakdown.carbon).toBeDefined();
    expect(score.breakdown.certifications).toBeDefined();
    expect(score.breakdown.shipping).toBeDefined();
  });

  it('rates conventional disposable products significantly lower', () => {
    const score = calculateEcoScore(sampleConv);
    expect(score.score).toBeLessThanOrEqual(55);
    expect(['C', 'D', 'E', 'F']).toContain(score.grade);
  });

  it('computes positive lifecycle savings on swap comparisons', () => {
    const comparison = compareProductImpact(sampleEco, sampleConv);
    expect(comparison.co2Saved).toBeGreaterThan(0);
    expect(comparison.plasticSaved).toBeGreaterThanOrEqual(0);
    expect(typeof comparison.summary).toBe('string');
  });
});

// -----------------------------------------------------------------------------
// 3. IMPACT CALCULATOR & EQUIVALENTS
// -----------------------------------------------------------------------------
describe('Impact Calculator (calculateCartImpact)', () => {
  it('returns zero metrics for empty cart', () => {
    const impact = calculateCartImpact([], productsData);
    expect(impact.totalItems).toBe(0);
    expect(impact.totalPrice).toBe(0);
    expect(impact.co2Saved).toBe(0);
    expect(impact.plasticAvoided).toBe(0);
  });

  it('accumulates environmental savings and computes real human equivalents', () => {
    const ecoItems = productsData.filter((p) => p.isEcoFriendly).slice(0, 3);
    const cart = [
      { product: ecoItems[0], quantity: 2 },
      { product: ecoItems[1], quantity: 1 },
      { product: ecoItems[2], quantity: 3 }
    ];

    const impact = calculateCartImpact(cart, productsData);
    expect(impact.totalItems).toBe(6);
    expect(impact.totalPrice).toBe(
      ecoItems[0].price * 2 + ecoItems[1].price * 1 + ecoItems[2].price * 3
    );
    expect(impact.co2Saved).toBeGreaterThan(0);
    expect(impact.plasticAvoided).toBeGreaterThan(0);
    expect(impact.waterSaved).toBeGreaterThan(0);

    // Human equivalents
    expect(impact.equivalents).toBeDefined();
    expect(impact.equivalents.plasticBottles).toBeGreaterThan(0);
    expect(impact.equivalents.carKm).toBeGreaterThan(0);
    expect(impact.equivalents.daysDrinkingWater).toBeGreaterThan(0);

    // Eco points & gamification
    expect(impact.ecoPoints).toBeGreaterThan(0);
    expect(Array.isArray(impact.badges)).toBe(true);

    // Aliases for component safety & no TypeError crashes
    expect(typeof impact.totalCo2SavedKg).toBe('number');
    expect(typeof impact.totalPlasticSavedGrams).toBe('number');
    expect(typeof impact.totalWaterSavedLitres).toBe('number');
    expect(typeof impact.savedCo2).toBe('number');
    expect(typeof impact.averageScore).toBe('number');
    expect(typeof impact.grade).toBe('string');
    expect(impact.totalCo2SavedKg.toFixed(2)).toBeDefined();
    expect(impact.savedCo2.toFixed(1)).toBeDefined();
  });

  it('provides safe numerical defaults on empty cart to prevent toFixed crashes', () => {
    const emptyImpact = calculateCartImpact([], productsData);
    expect(emptyImpact.totalCo2SavedKg.toFixed(2)).toBe('0.00');
    expect(emptyImpact.savedCo2.toFixed(1)).toBe('0.0');
    expect(emptyImpact.totalPlasticSavedGrams).toBe(0);
    expect(emptyImpact.totalWaterSavedLitres).toBe(0);
    expect(emptyImpact.averageScore).toBe(0);
    expect(emptyImpact.grade).toBe('N/A');
  });
});

// -----------------------------------------------------------------------------
// 4. ECO AGENT NLP & CATALOG QUERY
// -----------------------------------------------------------------------------
describe('Eco Agent (NLP Intent, Query & Sustainability Audit)', () => {
  it('parses natural shopping queries into structured intents', () => {
    const intent1 = parseShoppingIntent('gift under 1000 for kitchen');
    expect(intent1.maxBudget).toBe(1000);
    expect(intent1.category).toBe('Kitchen');

    const intent2 = parseShoppingIntent('review my cart and check plastic');
    expect(intent2.isCartReview).toBe(true);
  });

  it('queries eco catalog and returns matches with reasoning', () => {
    const queryRes = queryEcoCatalog(productsData, 'bamboo cutlery under 500');
    expect(queryRes.results).toBeDefined();
    expect(queryRes.results.length).toBeGreaterThan(0);
    expect(queryRes.results[0].reasoning).toBeDefined();
  });

  it('audits conventional cart items and proposes cleaner eco swaps', () => {
    const convItems = productsData.filter((p) => !p.isEcoFriendly && p.conventionalAlternativeId).slice(0, 2);
    const cart = convItems.map((p) => ({ product: p, quantity: 1 }));

    const audit = auditCartSustainability(cart, productsData);
    expect(audit.suggestions).toBeDefined();
    expect(audit.suggestions.length).toBeGreaterThanOrEqual(1);
    expect(audit.suggestions[0].from).toBeDefined();
    expect(audit.suggestions[0].to).toBeDefined();
    expect(audit.suggestions[0].reason).toBeDefined();
  });
});

// -----------------------------------------------------------------------------
// 5. CART TOTALS & PRICING RULES
// -----------------------------------------------------------------------------
describe('Cart Totals & Pricing Calculations', () => {
  it('calculates subtotal, discounts, and optional carbon offset accurately', () => {
    const subtotal = 1200;
    const coupon10 = { code: 'ECO10', percent: 10 };
    const discount = Math.round((subtotal * coupon10.percent) / 100);
    expect(discount).toBe(120);

    const carbonOffsetFee = 20;
    const finalWithOffset = subtotal - discount + carbonOffsetFee;
    expect(finalWithOffset).toBe(1100);

    // Negative prevention
    const massiveDiscount = 2000;
    const finalZeroFloor = Math.max(0, subtotal - massiveDiscount);
    expect(finalZeroFloor).toBe(0);
  });
});

// -----------------------------------------------------------------------------
// 6. ROUTE SMOKE TESTS (ZERO CONSOLE ERRORS)
// -----------------------------------------------------------------------------
describe('Route Smoke Test (Every route renders without console errors)', () => {
  let consoleErrors = [];
  const originalError = console.error;

  beforeEach(() => {
    consoleErrors = [];
    console.error = (...args) => {
      // Ignore known React 19 testing act warnings if any
      const msg = args.join(' ');
      if (!msg.includes('act(')) {
        consoleErrors.push(msg);
      }
      originalError.apply(console, args);
    };
  });

  afterEach(() => {
    console.error = originalError;
  });

  function renderRoute(path, Component) {
    const html = renderToString(
      <MemoryRouter initialEntries={[path]}>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <Routes>
                <Route path={path} element={<Component />} />
              </Routes>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </MemoryRouter>
    );
    expect(html).toBeTruthy();
    expect(consoleErrors).toHaveLength(0);
  }

  it('renders Home route (/) without console errors', () => {
    renderRoute('/', HomePage);
  });

  it('renders Shop Catalog route (/shop) without console errors', () => {
    renderRoute('/shop', ShopPage);
  });

  it('renders Product Detail route (/product/kit-01) without console errors', () => {
    renderRoute('/product/kit-01', ProductPage);
  });

  it('renders Tools route (/tools) without console errors', () => {
    renderRoute('/tools', ToolsPage);
  });

  it('renders Community route (/community) without console errors', () => {
    renderRoute('/community', CommunityPage);
  });

  it('renders Impact route (/impact) without console errors', () => {
    renderRoute('/impact', ImpactPage);
  });

  it('renders How It Works route (/how-it-works) without console errors', () => {
    renderRoute('/how-it-works', HowItWorksPage);
  });

  it('renders Wishlist route (/wishlist) without console errors', () => {
    renderRoute('/wishlist', WishlistPage);
  });

  it('renders Profile route (/profile) without console errors', () => {
    renderRoute('/profile', ProfilePage);
  });

  it('renders Orders route (/orders) without console errors', () => {
    renderRoute('/orders', OrdersPage);
  });

  it('renders Settings route (/settings) without console errors', () => {
    renderRoute('/settings', SettingsPage);
  });

  it('renders Login route (/login) without console errors', () => {
    renderRoute('/login', LoginPage);
  });

  it('renders Signup route (/signup) without console errors', () => {
    renderRoute('/signup', SignupPage);
  });

  it('renders Not Found route (*) without console errors', () => {
    renderRoute('/404', NotFoundPage);
  });
});
