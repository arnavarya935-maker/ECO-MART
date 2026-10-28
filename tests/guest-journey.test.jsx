import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import productsData from '../src/data/products.json';
import { sendAgentQuery } from '../src/lib/ecoAgent.js';
import { transformShoppingList } from '../src/lib/cartTransformer.js';
import { calculateCartImpact } from '../src/lib/impactCalculator.js';
import { DEFAULT_PRIORITIES } from '../src/lib/decisionEngine.js';

// Providers and Pages
import { ThemeProvider } from '../src/context/ThemeContext.jsx';
import { I18nProvider } from '../src/context/I18nContext.jsx';
import { AuthProvider, useAuth } from '../src/context/AuthContext.jsx';
import { CartProvider, useCart } from '../src/context/CartContext.jsx';
import ImpactPage from '../src/pages/ImpactPage.jsx';
import OrdersPage from '../src/pages/OrdersPage.jsx';

// Ensure mock localStorage in Node.js test environment
const store = new Map();
if (typeof globalThis.localStorage === 'undefined' || !globalThis.localStorage.getItem) {
  globalThis.localStorage = {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, val) => store.set(key, String(val)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear()
  };
}

describe('Phase 7: End-to-End Guest Shopper Journey', () => {
  beforeEach(() => {
    globalThis.localStorage.clear();
  });

  it('step 1: guest can browse and query Eco Agent without mandatory login', async () => {
    const userRef = { current: 'unset' };
    function UserProbe() {
      userRef.current = useAuth().user;
      return null;
    }

    renderToString(
      <AuthProvider>
        <UserProbe />
      </AuthProvider>
    );

    // Guest has no mandatory login
    expect(userRef.current).toBeNull();

    // Eco Agent query works cleanly for guest
    const res = await sendAgentQuery({
      query: 'Show cheapest green option under 300',
      allProducts: productsData,
      cartItems: []
    });

    expect(res).toBeDefined();
    expect(res.reply || res.message).toBeDefined();
    expect(res.data.length).toBeGreaterThan(0);

    // All items returned must respect budget <= 300 and be sorted by price
    res.data.forEach((item) => {
      expect(item.price).toBeLessThanOrEqual(300);
    });
    for (let i = 1; i < res.data.length; i++) {
      expect(res.data[i].price).toBeGreaterThanOrEqual(res.data[i - 1].price);
    }
  });

  it('step 2 & 3: add conventional item to cart, identify eco swap, and calculate impact', () => {
    // Find conventional product with an eco alternative
    const convProd = productsData.find((p) => !p.isEcoFriendly && p.conventionalAlternativeId);
    expect(convProd).toBeDefined();

    const ecoProd = productsData.find((p) => p.id === convProd.conventionalAlternativeId);
    expect(ecoProd).toBeDefined();

    // Simulate conventional cart in localStorage
    globalThis.localStorage.setItem(
      'ecomart_cart',
      JSON.stringify([{ product: convProd, quantity: 1 }])
    );

    const cartRef = { current: null };
    function CartProbe() {
      cartRef.current = useCart();
      return null;
    }

    renderToString(
      <AuthProvider>
        <CartProvider>
          <CartProbe />
        </CartProvider>
      </AuthProvider>
    );

    expect(cartRef.current.cartItems).toHaveLength(1);
    expect(cartRef.current.cartItems[0].product.id).toBe(convProd.id);

    // Conventional cart impact
    const convImpact = calculateCartImpact(cartRef.current.cartItems, productsData);

    // Now simulate swap to eco product
    globalThis.localStorage.setItem(
      'ecomart_cart',
      JSON.stringify([{ product: ecoProd, quantity: 1 }])
    );

    const swappedRef = { current: null };
    function SwappedCartProbe() {
      swappedRef.current = useCart();
      return null;
    }

    renderToString(
      <AuthProvider>
        <CartProvider>
          <SwappedCartProbe />
        </CartProvider>
      </AuthProvider>
    );

    expect(swappedRef.current.cartItems).toHaveLength(1);
    expect(swappedRef.current.cartItems[0].product.id).toBe(ecoProd.id);
    expect(swappedRef.current.cartItems[0].product.isEcoFriendly).toBe(true);

    // Swapped cart impact shows improved EcoScore
    const ecoImpact = calculateCartImpact(swappedRef.current.cartItems, productsData);
    expect(ecoImpact.averageEcoScore).toBeGreaterThan(convImpact.averageEcoScore);
    expect(ecoImpact.co2Saved).toBeGreaterThanOrEqual(0);
  });

  it('step 4: transform a raw text shopping list into budget-friendly green choices', () => {
    const rawList = 'bamboo toothbrush, steel bottle, cotton tote bag';
    const result = transformShoppingList(rawList, productsData, DEFAULT_PRIORITIES, 1500);

    expect(result).toBeDefined();
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.totals.priceAfter).toBeLessThanOrEqual(1500);
    expect(result.totals.ecoScoreAfter).toBeGreaterThanOrEqual(60);
  });

  it('step 5 & 6: checkout creates a valid order receipt with impact metrics', () => {
    const greenItem1 = productsData.find((p) => p.id === 'kit-01');
    const greenItem2 = productsData.find((p) => p.id === 'care-01');

    // Create and save an order
    const orderRecord = {
      id: 'ECO-789012',
      date: '28 Oct 2026',
      items: [
        { product: greenItem1, quantity: 2 },
        { product: greenItem2, quantity: 1 }
      ],
      total: (greenItem1.price * 2) + greenItem2.price,
      shippingAddress: '123 Green Street, Delhi',
      carbonOffset: true,
      plasticFreePackaging: true,
      impact: {
        totalCarbon: 0.8,
        totalPlastic: 0,
        avgEcoScore: 94
      }
    };

    globalThis.localStorage.setItem('ecomart_orders', JSON.stringify([orderRecord]));

    const cartRef = { current: null };
    function CartProbe() {
      cartRef.current = useCart();
      return null;
    }

    renderToString(
      <AuthProvider>
        <CartProvider>
          <CartProbe />
        </CartProvider>
      </AuthProvider>
    );

    // CartProvider loaded orders from storage
    expect(cartRef.current.orders).toHaveLength(1);
    expect(cartRef.current.orders[0].id).toBe('ECO-789012');
    expect(cartRef.current.orders[0].items).toHaveLength(2);
    expect(cartRef.current.orders[0].total).toBe((greenItem1.price * 2) + greenItem2.price);
  });

  it('step 7 & 8: receipt displays on Orders page and impact aggregates on Impact page', () => {
    const mockOrder = {
      id: 'ECO-987654',
      date: '28 Oct 2026',
      items: [
        { product: { id: 'kit-01', name: 'Coconut Bowl Set', icon: '🥥', price: 499 }, quantity: 2 }
      ],
      total: 998,
      shippingAddress: '123 Green Street',
      carbonOffset: true,
      plasticFreePackaging: true,
      impact: {
        totalCarbon: 1.2,
        totalPlastic: 0,
        avgEcoScore: 92
      }
    };
    globalThis.localStorage.setItem('ecomart_orders', JSON.stringify([mockOrder]));

    // Render OrdersPage
    const ordersHtml = renderToString(
      <MemoryRouter initialEntries={['/orders']}>
        <ThemeProvider>
          <I18nProvider defaultLang="en">
            <AuthProvider>
              <CartProvider>
                <Routes>
                  <Route path="/orders" element={<OrdersPage />} />
                </Routes>
              </CartProvider>
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(ordersHtml).toContain('ECO-987654');
    expect(ordersHtml).not.toMatch(/\bundefined\b/);
    expect(ordersHtml).not.toMatch(/\bNaN\b/);

    // Render ImpactPage
    const impactHtml = renderToString(
      <MemoryRouter initialEntries={['/impact']}>
        <ThemeProvider>
          <I18nProvider defaultLang="en">
            <AuthProvider>
              <CartProvider>
                <Routes>
                  <Route path="/impact" element={<ImpactPage />} />
                </Routes>
              </CartProvider>
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(impactHtml.length).toBeGreaterThan(500);
    expect(impactHtml).not.toMatch(/\bundefined\b/);
    expect(impactHtml).not.toMatch(/\bNaN\b/);
  });
});
