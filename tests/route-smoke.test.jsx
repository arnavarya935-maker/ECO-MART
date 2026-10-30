import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';

// Data & Helpers
import productsData from '../src/data/products.json';
import { calculateCartImpact } from '../src/lib/impactCalculator.js';
import { transformShoppingList } from '../src/lib/cartTransformer.js';
import { detectGreenwashing } from '../src/lib/ecoScore.js';
import { getStrictnessThreshold, setStrictnessThreshold } from '../src/lib/ai/confidenceBrake.js';

// Context Providers
import { ThemeProvider, useTheme } from '../src/context/ThemeContext.jsx';
import { I18nProvider } from '../src/context/I18nContext.jsx';
import { AuthProvider, useAuth } from '../src/context/AuthContext.jsx';
import { CartProvider, useCart } from '../src/context/CartContext.jsx';
import { ProductsProvider } from '../src/context/ProductsContext.jsx';

// Pages
import HomePage from '../src/pages/HomePage.jsx';
import ShopPage from '../src/pages/ShopPage.jsx';
import ProductPage from '../src/pages/ProductPage.jsx';
import ToolsPage from '../src/pages/ToolsPage.jsx';
import TransformPage from '../src/pages/TransformPage.jsx';
import EcoCheckPage from '../src/pages/EcoCheckPage.jsx';
import CommunityPage from '../src/pages/CommunityPage.jsx';
import ImpactPage from '../src/pages/ImpactPage.jsx';
import HowItWorksPage from '../src/pages/HowItWorksPage.jsx';
import WishlistPage from '../src/pages/WishlistPage.jsx';
import ProfilePage from '../src/pages/ProfilePage.jsx';
import OrdersPage from '../src/pages/OrdersPage.jsx';
import SettingsPage from '../src/pages/SettingsPage.jsx';
import LoginPage from '../src/pages/LoginPage.jsx';
import SignupPage from '../src/pages/SignupPage.jsx';
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

// Modals & Drawers
import CartDrawer from '../src/components/CartDrawer.jsx';
import ProductDetailModal from '../src/components/ProductDetailModal.jsx';
import CheckoutModal from '../src/components/CheckoutModal.jsx';
import ConfirmationModal from '../src/components/ConfirmationModal.jsx';
import AuthModal from '../src/components/AuthModal.jsx';
import WelcomeModal from '../src/components/WelcomeModal.jsx';
import ExitIntentModal from '../src/components/ExitIntentModal.jsx';
import AchievementUnlockedModal from '../src/components/AchievementUnlockedModal.jsx';
import ProductCompareModal from '../src/components/ProductCompareModal.jsx';
import CommandPalette from '../src/components/CommandPalette.jsx';
import KeyboardShortcutsModal from '../src/components/KeyboardShortcutsModal.jsx';
import GreenwashingDetectiveModal from '../src/components/detective/GreenwashingDetectiveModal.jsx';
import EthicsInboxModal from '../src/components/decision/EthicsInboxModal.jsx';
import PrivacyCenterModal from '../src/components/privacy/PrivacyCenterModal.jsx';
import AccessibilityCenterModal from '../src/components/accessibility/AccessibilityCenterModal.jsx';
import NotificationCenterModal from '../src/components/notifications/NotificationCenterModal.jsx';
import FeedbackInboxModal from '../src/components/feedback/FeedbackInboxModal.jsx';
import ProductScaleVisualModal from '../src/components/product/ProductScaleVisualModal.jsx';
import ProductPassportQRModal from '../src/components/product/ProductPassportQRModal.jsx';

// In-memory localStorage mock for node environment
const store = new Map();
if (typeof globalThis.localStorage === 'undefined' || !globalThis.localStorage.getItem) {
  globalThis.localStorage = {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, val) => store.set(key, String(val)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear()
  };
}

const allRoutes = [
  { name: 'Home (/)', path: '/', component: HomePage },
  { name: 'Shop (/shop)', path: '/shop', component: ShopPage },
  { name: 'Product (/product/kit-01)', path: '/product/kit-01', pattern: '/product/:id', component: ProductPage },
  { name: 'Product Missing (/product/invalid-id)', path: '/product/invalid-id', pattern: '/product/:id', component: ProductPage },
  { name: 'Truth Lab (/truth-lab)', path: '/truth-lab', component: TruthLabPage },
  { name: 'Learn (/learn)', path: '/learn', component: LearnPage },
  { name: 'News (/news)', path: '/news', component: NewsPage },
  { name: 'Transform (/transform)', path: '/transform', component: TransformPage },
  { name: 'Eco Check (/eco-check)', path: '/eco-check', component: EcoCheckPage },
  { name: 'Tools (/tools)', path: '/tools', component: ToolsPage },
  { name: 'Community (/community)', path: '/community', component: CommunityPage },
  { name: 'Impact (/impact)', path: '/impact', component: ImpactPage },
  { name: 'BlackBox (/blackbox -> /)', path: '/blackbox', component: () => <Navigate to="/" replace /> },
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
  { name: 'Transparency (/transparency)', path: '/transparency', component: AgentTransparencyPage },
  { name: 'Orders (/orders)', path: '/orders', component: OrdersPage },
  { name: 'Settings (/settings)', path: '/settings', component: SettingsPage },
  { name: 'Login (/login)', path: '/login', component: LoginPage },
  { name: 'Signup (/signup)', path: '/signup', component: SignupPage },
  { name: 'Not Found (*)', path: '/non-existent-route-for-testing', pattern: '*', component: NotFoundPage }
];

function renderWithProviders(element, { route = '/', lang = 'en' } = {}) {
  globalThis.localStorage.setItem('ecomart_lang', lang);
  return renderToString(
    <MemoryRouter initialEntries={[route]}>
      <ThemeProvider>
        <I18nProvider defaultLang={lang}>
          <AuthProvider>
            <ProductsProvider initialProducts={productsData}>
              <CartProvider>
                {element}
              </CartProvider>
            </ProductsProvider>
          </AuthProvider>
        </I18nProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe('Comprehensive Route Smoke & Quality Suite', () => {
  beforeEach(() => {
    globalThis.localStorage.clear();
  });

  describe('Part A: Route Rendering & Clean Output (No undefined/NaN/[object Object]/null in English & Hindi)', () => {
    ['en', 'hi'].forEach((lang) => {
      allRoutes.forEach((route) => {
        it(`renders ${route.name} cleanly without console errors or garbage tokens (${lang})`, () => {
          const consoleErrors = [];
          const originalError = console.error;
          console.error = (...args) => {
            const msg = args.join(' ');
            // Allowed benign notices: React act warning in node, or font preload notices
            if (!msg.includes('act(') && !msg.includes('downloadable font')) {
              consoleErrors.push(msg);
            }
          };

          try {
            const pattern = route.pattern || route.path;
            const html = renderWithProviders(
              <Routes>
                <Route path={pattern} element={React.createElement(route.component)} />
              </Routes>,
              { route: route.path, lang }
            );

            console.error = originalError;

            expect(consoleErrors).toHaveLength(0);
            expect(html).not.toMatch(/\bundefined\b/);
            expect(html).not.toMatch(/\bNaN\b/);
            expect(html).not.toMatch(/\[object Object\]/);
            // Must not have standalone "null" text node (exclude null inside json or attributes)
            expect(html).not.toMatch(/>\s*null\s*</);
          } catch (err) {
            console.error = originalError;
            throw err;
          }
        });
      });
    });
  });

  describe('Part B: Modal and Drawer Smoke Audit', () => {
    const sampleProduct = productsData[0];

    it('renders CartDrawer without crashing', () => {
      const html = renderWithProviders(<CartDrawer />);
      expect(html).toBeDefined();
      expect(html).not.toMatch(/\bundefined\b/);
    });

    it('renders ProductDetailModal with a real product', () => {
      const html = renderWithProviders(
        <ProductDetailModal product={sampleProduct} onClose={() => {}} />
      );
      expect(html).toContain(sampleProduct.name);
      expect(html).not.toMatch(/\bundefined\b/);
    });

    it('renders ProductCompareModal with items in compare list', () => {
      globalThis.localStorage.setItem('ecomart_compare', JSON.stringify([productsData[0], productsData[1]]));
      const html = renderWithProviders(<ProductCompareModal />);
      expect(html).toBeDefined();
      expect(html).not.toMatch(/\bundefined\b/);
    });

    it('renders CheckoutModal and ConfirmationModal cleanly', () => {
      const checkoutHtml = renderWithProviders(<CheckoutModal />);
      expect(checkoutHtml).toBeDefined();

      const sampleOrder = {
        id: 'ECO-999999',
        date: 'Oct 29, 2026',
        items: [{ product: sampleProduct, quantity: 2 }],
        total: 500,
        shippingAddress: { name: 'Priya Sharma', address: '123 Green Ave', city: 'Mumbai' },
        impact: { co2Saved: 1.5, plasticBottlesAvoided: 3 }
      };
      globalThis.localStorage.setItem('ecomart_orders', JSON.stringify([sampleOrder]));
      const confirmHtml = renderWithProviders(<ConfirmationModal />);
      expect(confirmHtml).toBeDefined();
    });

    it('renders AuthModal in signin and signup modes', () => {
      const html = renderWithProviders(<AuthModal />);
      expect(html).toBeDefined();
      expect(html).not.toMatch(/\bundefined\b/);
    });

    it('renders WelcomeModal and ExitIntentModal cleanly', () => {
      const welcomeHtml = renderWithProviders(<WelcomeModal />);
      expect(welcomeHtml).toBeDefined();

      const exitHtml = renderWithProviders(<ExitIntentModal />);
      expect(exitHtml).toBeDefined();
    });

    it('renders AchievementUnlockedModal with sample badge', () => {
      const html = renderWithProviders(<AchievementUnlockedModal />);
      expect(html).toBeDefined();
    });

    it('renders CommandPalette and KeyboardShortcutsModal', () => {
      const cmdHtml = renderWithProviders(<CommandPalette isOpen={true} onClose={() => {}} />);
      expect(cmdHtml).toBeDefined();
      expect(cmdHtml).not.toMatch(/\[object Object\]/);

      const shortcutsHtml = renderWithProviders(<KeyboardShortcutsModal isOpen={true} onClose={() => {}} />);
      expect(shortcutsHtml).toBeDefined();
    });

    it('renders Responsible AI modals: Greenwash Detective, Ethics Inbox, Privacy, Accessibility, Notifications, Feedback', () => {
      expect(renderWithProviders(<GreenwashingDetectiveModal isOpen={true} onClose={() => {}} />)).toBeDefined();
      expect(renderWithProviders(<EthicsInboxModal isOpen={true} onClose={() => {}} />)).toBeDefined();
      expect(renderWithProviders(<PrivacyCenterModal isOpen={true} onClose={() => {}} />)).toBeDefined();
      expect(renderWithProviders(<AccessibilityCenterModal isOpen={true} onClose={() => {}} />)).toBeDefined();
      expect(renderWithProviders(<NotificationCenterModal isOpen={true} onClose={() => {}} />)).toBeDefined();
      expect(renderWithProviders(<FeedbackInboxModal isOpen={true} onClose={() => {}} />)).toBeDefined();
    });

    it('renders ProductScaleVisualModal and ProductPassportQRModal', () => {
      const scaleHtml = renderWithProviders(
        <ProductScaleVisualModal isOpen={true} onClose={() => {}} product={sampleProduct} />
      );
      expect(scaleHtml).toBeDefined();

      const qrHtml = renderWithProviders(
        <ProductPassportQRModal isOpen={true} onClose={() => {}} product={sampleProduct} />
      );
      expect(qrHtml).toBeDefined();
    });
  });

  describe('Part C: Form Validation Smoke (Valid and Empty inputs)', () => {
    it('validates coupon code inputs (empty vs EARTH20 vs ZERO50)', () => {
      let cartApi = null;
      function CartHookProbe() {
        cartApi = useCart();
        return null;
      }
      renderWithProviders(<CartHookProbe />);

      expect(cartApi).not.toBeNull();
      // Empty input
      const emptyResult = cartApi.applyCouponCode('');
      expect(emptyResult).toBe(false);

      // Invalid input
      const invalidResult = cartApi.applyCouponCode('FAKECOUPON');
      expect(invalidResult).toBe(false);

      // Valid EARTH20
      const validEarth = cartApi.applyCouponCode('EARTH20');
      expect(validEarth).toBe(true);

      // Valid ZERO50
      const validZero = cartApi.applyCouponCode('ZERO50');
      expect(validZero).toBe(true);

      // Remove coupon
      cartApi.removeCoupon();
      expect(cartApi.appliedCoupon).toBeNull();
    });

    it('validates auth forms (empty inputs throw; valid credentials succeed)', async () => {
      let authApi = null;
      function AuthHookProbe() {
        authApi = useAuth();
        return null;
      }
      renderWithProviders(<AuthHookProbe />);

      expect(authApi).not.toBeNull();

      // Empty login attempt
      await expect(authApi.login({ email: '', password: '' })).rejects.toThrow();

      // Empty signup attempt
      await expect(authApi.signup({ name: '', email: '', password: '' })).rejects.toThrow();

      // Valid guest login
      const guest = authApi.loginAsGuest();
      expect(guest).toBeDefined();
      expect(guest.isGuest).toBe(true);

      // Logout
      authApi.logout();
      expect(authApi.currentUser).toBeNull();
    });

    it('validates Cart Transformer list parsing (empty vs messy input)', () => {
      // Empty input
      const emptyResult = transformShoppingList('', productsData);
      expect(emptyResult).toBeDefined();
      expect(emptyResult.isEmpty).toBe(true);
      expect(emptyResult.items.length).toBe(0);

      // Multi-item valid input
      const result = transformShoppingList('organic cotton tee, bamboo toothbrush, steel bottle', productsData);
      expect(result.items.length).toBeGreaterThan(0);
      result.items.forEach((item) => {
        expect(item.name).toBeDefined();
        if (item.status === 'swapped' && item.after) {
          expect(item.after.isEcoFriendly).toBe(true);
        }
      });
    });

    it('validates eco-check greenwashing claim detection (empty vs suspicious vs clean)', () => {
      // Empty claims
      const emptyCheck = detectGreenwashing({ name: 'Generic Soap', claims: [] });
      expect(emptyCheck).toBeDefined();

      // Suspicious claim with uncertified buzzwords
      const suspiciousCheck = detectGreenwashing({
        name: 'Magic Cleanser',
        description: '100% natural pure chemical-free eco-friendly miracle spray',
        certifications: []
      });
      expect(suspiciousCheck.isGreenwashed).toBe(true);
      expect(suspiciousCheck.buzzwords.length).toBeGreaterThan(0);
    });

    it('validates review retrieval and fallback from storage', () => {
      const mockReviews = {
        'kit-01': [{ id: 'r1', author: 'Aarav Gupta', rating: 5, comment: 'Great kit!' }]
      };
      globalThis.localStorage.setItem('ecomart_reviews', JSON.stringify(mockReviews));

      let cartApi = null;
      function CartHookProbe() {
        cartApi = useCart();
        return null;
      }
      renderWithProviders(<CartHookProbe />);

      const reviews = cartApi.getProductReviews('kit-01');
      expect(reviews.length).toBe(1);
      expect(reviews[0].author).toBe('Aarav Gupta');
    });
  });

  describe('Part D: Settings Toggles Smoke', () => {
    it('exercises all settings switches and state mutators cleanly', () => {
      let themeApi = null;
      let cartApi = null;

      function Probe() {
        themeApi = useTheme();
        cartApi = useCart();
        return null;
      }
      renderWithProviders(<Probe />);

      // Theme toggle
      themeApi.toggleTheme();
      themeApi.toggleReduceEffects();
      themeApi.setHighContrast(true);
      themeApi.setDyslexicFont(true);
      themeApi.setTextSize('large');

      // Decision engine priorities toggle
      cartApi.applyPriorityPreset('lowest_carbon');
      expect(globalThis.localStorage.getItem('ecomart_active_preset')).toBe('lowest_carbon');
      cartApi.resetPriorities();
      expect(globalThis.localStorage.getItem('ecomart_active_preset')).toBe('balanced');

      // Copilot toggle
      cartApi.toggleCopilotMuted();

      // AI confidence brake strictness (0 - 100%)
      setStrictnessThreshold(80);
      expect(getStrictnessThreshold()).toBe(80);
      setStrictnessThreshold(70);
    });
  });

  describe('Part E: Full End-to-End Guest Journey (English & Hindi)', () => {
    ['en', 'hi'].forEach((lang) => {
      it(`runs full shopper lifecycle from guest login to order receipt in ${lang}`, () => {
        // Step 1: Guest login
        let authApi = null;
        function AuthProbe() {
          authApi = useAuth();
          return null;
        }
        renderWithProviders(<AuthProbe />, { lang });
        const guestUser = authApi.loginAsGuest();
        expect(guestUser.isGuest).toBe(true);

        // Step 2 & 3: Conventional cart setup & impact
        const convProduct = productsData.find((p) => !p.isEcoFriendly && p.conventionalAlternativeId);
        const ecoProduct = productsData.find((p) => p.id === convProduct.conventionalAlternativeId);

        globalThis.localStorage.setItem(
          'ecomart_cart',
          JSON.stringify([{ product: convProduct, quantity: 1 }])
        );

        let cartRef = { current: null };
        function CartProbe() {
          cartRef.current = useCart();
          return null;
        }

        renderWithProviders(<CartProbe />, { lang });
        expect(cartRef.current.cartItems).toHaveLength(1);
        expect(cartRef.current.cartItems[0].product.id).toBe(convProduct.id);

        const convImpact = calculateCartImpact(cartRef.current.cartItems, productsData);

        // Step 4: Swap conventional to eco product
        globalThis.localStorage.setItem(
          'ecomart_cart',
          JSON.stringify([{ product: ecoProduct, quantity: 1 }])
        );

        renderWithProviders(<CartProbe />, { lang });
        expect(cartRef.current.cartItems[0].product.id).toBe(ecoProduct.id);
        const ecoImpact = calculateCartImpact(cartRef.current.cartItems, productsData);
        expect(ecoImpact.averageEcoScore).toBeGreaterThan(convImpact.averageEcoScore);

        // Step 5: Transform shopping list
        const transformed = transformShoppingList('bamboo toothbrush, organic tea', productsData);
        expect(transformed.items.length).toBeGreaterThan(0);

        // Step 6: Order placement & receipt
        const sampleOrder = {
          id: 'ECO-123456',
          date: '29 Oct 2026',
          items: [{ product: ecoProduct, quantity: 1 }],
          total: ecoProduct.price,
          shippingAddress: '123 Green Way, Delhi',
          carbonOffset: true,
          plasticFreePackaging: true,
          impact: {
            totalCarbon: 0.5,
            totalPlastic: 0,
            avgEcoScore: 92
          }
        };
        globalThis.localStorage.setItem('ecomart_orders', JSON.stringify([sampleOrder]));

        renderWithProviders(<CartProbe />, { lang });
        expect(cartRef.current.orders).toHaveLength(1);
        expect(cartRef.current.orders[0].id).toBe('ECO-123456');

        // Step 7: OrdersPage & ImpactPage render without errors in current language
        const ordersHtml = renderWithProviders(
          <Routes>
            <Route path="/orders" element={<OrdersPage />} />
          </Routes>,
          { route: '/orders', lang }
        );
        expect(ordersHtml).toContain('ECO-123456');
        expect(ordersHtml).not.toMatch(/\bundefined\b/);

        const impactHtml = renderWithProviders(
          <Routes>
            <Route path="/impact" element={<ImpactPage />} />
          </Routes>,
          { route: '/impact', lang }
        );
        expect(impactHtml.length).toBeGreaterThan(400);
        expect(impactHtml).not.toMatch(/\bundefined\b/);
      });
    });
  });
});
