import { describe, it, expect } from 'vitest';
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
import NotFoundPage from '../src/pages/NotFoundPage.jsx';

const allRoutes = [
  { name: 'Home (/)', path: '/', component: HomePage },
  { name: 'Shop (/shop)', path: '/shop', component: ShopPage },
  { name: 'Product (/product/kit-01)', path: '/product/kit-01', pattern: '/product/:id', component: ProductPage },
  { name: 'Product (/product/care-01)', path: '/product/care-01', pattern: '/product/:id', component: ProductPage },
  { name: 'Product (/product/fash-01)', path: '/product/fash-01', pattern: '/product/:id', component: ProductPage },
  { name: 'Truth Lab (/truth-lab)', path: '/truth-lab', component: TruthLabPage },
  { name: 'Learn (/learn)', path: '/learn', component: LearnPage },
  { name: 'News (/news)', path: '/news', component: NewsPage },
  { name: 'Transform (/transform)', path: '/transform', component: TransformPage },
  { name: 'Eco Check (/eco-check)', path: '/eco-check', component: EcoCheckPage },
  { name: 'Tools (/tools)', path: '/tools', component: ToolsPage },
  { name: 'Community (/community)', path: '/community', component: CommunityPage },
  { name: 'Impact (/impact)', path: '/impact', component: ImpactPage },
  { name: 'Fairness (/fairness)', path: '/fairness', component: FairnessPage },
  { name: 'Playground (/playground)', path: '/playground', component: PlaygroundPage },
  { name: 'BlackBox (/blackbox -> /)', path: '/blackbox', component: () => <Navigate to="/" replace /> },
  { name: 'Duel (/duel)', path: '/duel', component: DuelPage },
  { name: 'Trust Passport (/passport/kit-01)', path: '/passport/kit-01', pattern: '/passport/:id', component: TrustPassportPage },
  { name: 'Counterfactual (/counterfactual)', path: '/counterfactual', component: CounterfactualPage },
  { name: 'Courtroom (/courtroom)', path: '/courtroom', component: CourtroomPage },
  { name: 'Scan (/scan)', path: '/scan', component: LabelScannerPage },
  { name: 'Scanner (/scanner -> /scan)', path: '/scanner', component: () => <Navigate to="/scan" replace /> },
  { name: 'Dilemmas (/dilemmas)', path: '/dilemmas', component: DilemmasPage },
  { name: 'Self Audit (/self-audit)', path: '/self-audit', component: AISelfAuditPage },
  { name: 'Kirana (/kirana)', path: '/kirana', component: KiranaPage },
  { name: 'How It Works (/how-it-works)', path: '/how-it-works', component: HowItWorksPage },
  { name: 'Wishlist (/wishlist)', path: '/wishlist', component: WishlistPage },
  { name: 'Profile (/profile)', path: '/profile', component: ProfilePage },
  { name: 'Transparency (/transparency -> /)', path: '/transparency', component: () => <Navigate to="/" replace /> },
  { name: 'Orders (/orders)', path: '/orders', component: OrdersPage },
  { name: 'Settings (/settings)', path: '/settings', component: SettingsPage },
  { name: 'Login (/login)', path: '/login', component: LoginPage },
  { name: 'Signup (/signup)', path: '/signup', component: SignupPage },
  { name: 'Not Found (*)', path: '/non-existent-route-for-testing', pattern: '*', component: NotFoundPage }
];

describe('Phase 7: Full Route Smoke Suite (English & Hindi)', () => {
  ['en', 'hi'].forEach((lang) => {
    describe(`Language: ${lang.toUpperCase()}`, () => {
      allRoutes.forEach((route) => {
        it(`renders route ${route.name} without errors or undefined/NaN in ${lang}`, () => {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('ecomart_lang', lang);
          }

          let consoleErrors = [];
          const originalError = console.error;
          console.error = (...args) => {
            const msg = args.join(' ');
            if (!msg.includes('act(')) {
              consoleErrors.push(msg);
            }
          };

          try {
            const pattern = route.pattern || route.path;
            const html = renderToString(
              <MemoryRouter initialEntries={[route.path]}>
                <ThemeProvider>
                  <I18nProvider defaultLang={lang}>
                    <AuthProvider>
                      <CartProvider>
                        <Routes>
                          <Route path={pattern} element={React.createElement(route.component)} />
                        </Routes>
                      </CartProvider>
                    </AuthProvider>
                  </I18nProvider>
                </ThemeProvider>
              </MemoryRouter>
            );

            console.error = originalError;

            expect(consoleErrors).toHaveLength(0);
            if (route.path === '/scanner' || route.path === '/blackbox' || route.path === '/transparency') {
              expect(html.length).toBeGreaterThanOrEqual(0);
            } else {
              expect(html.length).toBeGreaterThan(50);
            }
            expect(html).not.toMatch(/\bundefined\b/);
            expect(html).not.toMatch(/\bNaN\b/);
          } catch (err) {
            console.error = originalError;
            throw err;
          }
        });
      });
    });
  });
});

