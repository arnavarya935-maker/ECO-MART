import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { ThemeProvider } from '../src/context/ThemeContext.jsx';
import { I18nProvider } from '../src/context/I18nContext.jsx';
import { AuthProvider } from '../src/context/AuthContext.jsx';
import { CartProvider } from '../src/context/CartContext.jsx';

// Pages
import HomePage from '../src/pages/HomePage.jsx';
import ShopPage from '../src/pages/ShopPage.jsx';
import ProductPage from '../src/pages/ProductPage.jsx';
import ToolsPage from '../src/pages/ToolsPage.jsx';
import TransformPage from '../src/pages/TransformPage.jsx';
import EcoCheckPage from '../src/pages/EcoCheckPage.jsx';
import CommunityPage from '../src/pages/CommunityPage.jsx';
import ImpactPage from '../src/pages/ImpactPage.jsx';
import FairnessPage from '../src/pages/FairnessPage.jsx';
import PlaygroundPage from '../src/pages/PlaygroundPage.jsx';
import HowItWorksPage from '../src/pages/HowItWorksPage.jsx';
import WishlistPage from '../src/pages/WishlistPage.jsx';
import ProfilePage from '../src/pages/ProfilePage.jsx';
import OrdersPage from '../src/pages/OrdersPage.jsx';
import SettingsPage from '../src/pages/SettingsPage.jsx';
import LoginPage from '../src/pages/LoginPage.jsx';
import SignupPage from '../src/pages/SignupPage.jsx';
import DuelPage from '../src/pages/DuelPage.jsx';
import TrustPassportPage from '../src/pages/TrustPassportPage.jsx';
import CounterfactualPage from '../src/pages/CounterfactualPage.jsx';
import CourtroomPage from '../src/pages/CourtroomPage.jsx';
import LabelScannerPage from '../src/pages/LabelScannerPage.jsx';
import DilemmasPage from '../src/pages/DilemmasPage.jsx';
import AISelfAuditPage from '../src/pages/AISelfAuditPage.jsx';
import KiranaPage from '../src/pages/KiranaPage.jsx';
import TruthLabPage from '../src/pages/TruthLabPage.jsx';
import LearnPage from '../src/pages/LearnPage.jsx';
import NewsPage from '../src/pages/NewsPage.jsx';
import AgentTransparencyPage from '../src/pages/AgentTransparencyPage.jsx';
import NotFoundPage from '../src/pages/NotFoundPage.jsx';

// Polyfill window & localStorage for Node run
if (typeof globalThis.window === 'undefined') {
  globalThis.window = {
    location: { href: 'http://localhost/', pathname: '/' },
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
    scrollTo: () => {},
    localStorage: {
      store: {},
      getItem(k) { return this.store[k] || null; },
      setItem(k, v) { this.store[k] = String(v); },
      removeItem(k) { delete this.store[k]; },
      clear() { this.store = {}; }
    }
  };
  globalThis.localStorage = globalThis.window.localStorage;
  globalThis.navigator = { userAgent: 'Node', onLine: true };
}

const routesToTest = [
  { path: '/', component: HomePage },
  { path: '/shop', component: ShopPage },
  { path: '/product/kit-01', routePattern: '/product/:id', component: ProductPage },
  { path: '/product/care-01', routePattern: '/product/:id', component: ProductPage },
  { path: '/product/fash-01', routePattern: '/product/:id', component: ProductPage },
  { path: '/truth-lab', component: TruthLabPage },
  { path: '/learn', component: LearnPage },
  { path: '/news', component: NewsPage },
  { path: '/transform', component: TransformPage },
  { path: '/eco-check', component: EcoCheckPage },
  { path: '/tools', component: ToolsPage },
  { path: '/community', component: CommunityPage },
  { path: '/impact', component: ImpactPage },
  { path: '/fairness', component: FairnessPage },
  { path: '/playground', component: PlaygroundPage },
  { path: '/blackbox', component: () => React.createElement(Navigate, { to: '/', replace: true }) },
  { path: '/duel', component: DuelPage },
  { path: '/passport/kit-01', routePattern: '/passport/:id', component: TrustPassportPage },
  { path: '/counterfactual', component: CounterfactualPage },
  { path: '/courtroom', component: CourtroomPage },
  { path: '/scan', component: LabelScannerPage },
  { path: '/scanner', component: () => React.createElement(Navigate, { to: '/scan', replace: true }) },
  { path: '/dilemmas', component: DilemmasPage },
  { path: '/self-audit', component: AISelfAuditPage },
  { path: '/kirana', component: KiranaPage },
  { path: '/how-it-works', component: HowItWorksPage },
  { path: '/wishlist', component: WishlistPage },
  { path: '/profile', component: ProfilePage },
  { path: '/transparency', component: AgentTransparencyPage },
  { path: '/orders', component: OrdersPage },
  { path: '/settings', component: SettingsPage },
  { path: '/login', component: LoginPage },
  { path: '/signup', component: SignupPage },
  { path: '/page-that-does-not-exist', routePattern: '*', component: NotFoundPage }
];

export function runSmokeTest(lang = 'en') {
  globalThis.localStorage.setItem('ecomart_lang', lang);
  const results = [];
  const errors = [];

  for (const r of routesToTest) {
    const pattern = r.routePattern || r.path;
    let consoleErrors = [];
    const origError = console.error;
    console.error = (...args) => {
      const msg = args.join(' ');
      if (!msg.includes('act(')) {
        consoleErrors.push(msg);
      }
    };

    try {
      const html = renderToString(
        React.createElement(
          MemoryRouter,
          { initialEntries: [r.path] },
          React.createElement(
            ThemeProvider,
            null,
            React.createElement(
              I18nProvider,
              null,
              React.createElement(
                AuthProvider,
                null,
                React.createElement(
                  CartProvider,
                  null,
                  React.createElement(
                    Routes,
                    null,
                    React.createElement(Route, { path: pattern, element: React.createElement(r.component) })
                  )
                )
              )
            )
          )
        )
      );

      console.error = origError;

      const hasUndefined = /\bundefined\b/.test(html);
      const hasNaN = /\bNaN\b/.test(html);
      const isEmpty = !html || html.length < 50;

      if (consoleErrors.length > 0 || hasUndefined || hasNaN || isEmpty) {
        errors.push({
          path: r.path,
          lang,
          consoleErrors,
          hasUndefined,
          hasNaN,
          isEmpty
        });
      } else {
        results.push({ path: r.path, lang, status: 'PASS', len: html.length });
      }
    } catch (err) {
      console.error = origError;
      errors.push({
        path: r.path,
        lang,
        crash: err.message || String(err)
      });
    }
  }

  return { results, errors };
}

// When run directly: node scripts/smoke-test.mjs
const isDirectRun = process.argv[1] && (
  process.argv[1].endsWith('smoke-test.mjs') ||
  process.argv[1].endsWith('smoke-test')
);

if (isDirectRun) {
  console.log('=== RUNNING ROUTE SMOKE TEST IN ENGLISH & HINDI ===\n');

  console.log('Testing English (en)...');
  const enRes = runSmokeTest('en');
  console.log(`Passed: ${enRes.results.length}/${routesToTest.length}`);
  if (enRes.errors.length > 0) {
    console.error('Errors in EN:', enRes.errors);
  }

  console.log('\nTesting Hindi (hi)...');
  const hiRes = runSmokeTest('hi');
  console.log(`Passed: ${hiRes.results.length}/${routesToTest.length}`);
  if (hiRes.errors.length > 0) {
    console.error('Errors in HI:', hiRes.errors);
  }

  if (enRes.errors.length === 0 && hiRes.errors.length === 0) {
    console.log('\n✅ ALL ROUTES PASSED SMOKE TEST IN BOTH LANGUAGES WITH ZERO ERRORS!');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

