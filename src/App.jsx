import React, { Suspense, lazy, useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { I18nProvider } from './context/I18nContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProductsProvider } from './context/ProductsContext';
import { CartProvider, useCart } from './context/CartContext';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileBottomTabs from './components/MobileBottomTabs';
import OfflineDetector from './components/OfflineDetector';
import SwapSuggestionBanner from './components/EcoAgent/SwapSuggestionBanner';
import ImpactPulseWidget from './components/tools/ImpactPulseWidget';
import Toast from './components/ui/Toast';

// Route Pages - Lazy loaded for code-splitting & performance
const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const ToolsPage = lazy(() => import('./pages/ToolsPage'));
const TransformPage = lazy(() => import('./pages/TransformPage'));
const EcoCheckPage = lazy(() => import('./pages/EcoCheckPage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const ImpactPage = lazy(() => import('./pages/ImpactPage'));
const FairnessPage = lazy(() => import('./pages/FairnessPage'));
const PlaygroundPage = lazy(() => import('./pages/PlaygroundPage'));
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const DuelPage = lazy(() => import('./pages/DuelPage'));
const TrustPassportPage = lazy(() => import('./pages/TrustPassportPage'));
const CounterfactualPage = lazy(() => import('./pages/CounterfactualPage'));
const CourtroomPage = lazy(() => import('./pages/CourtroomPage'));
const LabelScannerPage = lazy(() => import('./pages/LabelScannerPage'));
const BarcodeDemoPage = lazy(() => import('./pages/BarcodeDemoPage'));
const DilemmasPage = lazy(() => import('./pages/DilemmasPage'));
const AISelfAuditPage = lazy(() => import('./pages/AISelfAuditPage'));
const KiranaPage = lazy(() => import('./pages/KiranaPage'));
const TruthLabPage = lazy(() => import('./pages/TruthLabPage'));
const LearnPage = lazy(() => import('./pages/LearnPage'));
const NewsPage = lazy(() => import('./pages/NewsPage'));
const AgentTransparencyPage = lazy(() => import('./pages/AgentTransparencyPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Widgets, Modals and Drawers - Lazy loaded on demand
const CartDrawer = lazy(() => import('./components/CartDrawer'));
const ProductDetailModal = lazy(() => import('./components/ProductDetailModal'));
const CheckoutModal = lazy(() => import('./components/CheckoutModal'));
const ConfirmationModal = lazy(() => import('./components/ConfirmationModal'));
const AuthModal = lazy(() => import('./components/AuthModal'));
const WelcomeModal = lazy(() => import('./components/WelcomeModal'));
const ExitIntentModal = lazy(() => import('./components/ExitIntentModal'));
const AchievementUnlockedModal = lazy(() => import('./components/AchievementUnlockedModal'));
const ProductCompareModal = lazy(() => import('./components/ProductCompareModal'));
const EcoAgentChat = lazy(() => import('./components/EcoAgent/EcoAgentChat'));
const CommandPalette = lazy(() => import('./components/CommandPalette'));
const KeyboardShortcutsModal = lazy(() => import('./components/KeyboardShortcutsModal'));
const EasterEggKonami = lazy(() => import('./components/EasterEggKonami'));
const CursorGlow = lazy(() => import('./components/CursorGlow'));
const LeafParticles = lazy(() => import('./components/LeafParticles'));
const GreenwashingDetectiveModal = lazy(() => import('./components/detective/GreenwashingDetectiveModal'));
const EthicsInboxModal = lazy(() => import('./components/decision/EthicsInboxModal'));
const PrivacyCenterModal = lazy(() => import('./components/privacy/PrivacyCenterModal'));
const AccessibilityCenterModal = lazy(() => import('./components/accessibility/AccessibilityCenterModal'));
const NotificationCenterModal = lazy(() => import('./components/notifications/NotificationCenterModal'));
const FeedbackInboxModal = lazy(() => import('./components/feedback/FeedbackInboxModal'));

function PageLoadingFallback() {
  return (
    <div className="min-h-[60vh] max-w-7xl mx-auto px-4 py-12 animate-pulse space-y-6">
      <div className="h-10 bg-surface-sunken rounded-2xl w-1/3" />
      <div className="h-4 bg-surface-sunken/60 rounded-lg w-1/2" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-4/5 bg-surface-sunken rounded-3xl border border-line" />
        ))}
      </div>
    </div>
  );
}

function AppContent() {
  const { reduceEffects } = useTheme();
  const { authModalOpen } = useAuth();
  const {
    isCartOpen,
    selectedProduct,
    setSelectedProduct,
    checkoutModalOpen,
    orderConfirmation,
    welcomeModalOpen,
    exitIntentOpen,
    unlockedBadge,
    isCompareOpen,
    isAgentOpen,
    toasts,
    dismissToast
  } = useCart();

  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [konamiActive, setKonamiActive] = useState(false);
  const [greenwashingModalOpen, setGreenwashingModalOpen] = useState(false);
  const [ethicsInboxOpen, setEthicsInboxOpen] = useState(false);
  const [privacyCenterOpen, setPrivacyCenterOpen] = useState(false);
  const [accessibilityCenterOpen, setAccessibilityCenterOpen] = useState(false);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [feedbackInboxOpen, setFeedbackInboxOpen] = useState(false);

  // Global listeners for Command Palette, Shortcuts, and Tier 3 modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      } else if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        return;
      } else if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
        e.preventDefault();
        setShortcutsOpen((prev) => !prev);
      } else if (e.key === 'ArrowUp') {
        setKonamiActive(true);
      }
    };

    const handleCustomToggle = () => setCommandPaletteOpen((prev) => !prev);
    const handleGreenwashingToggle = () => setGreenwashingModalOpen(true);
    const handleEthicsInboxToggle = () => setEthicsInboxOpen(true);
    const handlePrivacyToggle = () => setPrivacyCenterOpen(true);
    const handleAccessibilityToggle = () => setAccessibilityCenterOpen(true);
    const handleNotificationToggle = () => setNotificationCenterOpen(true);
    const handleFeedbackToggle = () => setFeedbackInboxOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('toggle-command-palette', handleCustomToggle);
    window.addEventListener('open-greenwashing-detective', handleGreenwashingToggle);
    window.addEventListener('open-ethics-inbox', handleEthicsInboxToggle);
    window.addEventListener('open-privacy-center', handlePrivacyToggle);
    window.addEventListener('open-accessibility-center', handleAccessibilityToggle);
    window.addEventListener('open-notification-center', handleNotificationToggle);
    window.addEventListener('open-feedback-inbox', handleFeedbackToggle);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('toggle-command-palette', handleCustomToggle);
      window.removeEventListener('open-greenwashing-detective', handleGreenwashingToggle);
      window.removeEventListener('open-ethics-inbox', handleEthicsInboxToggle);
      window.removeEventListener('open-privacy-center', handlePrivacyToggle);
      window.removeEventListener('open-accessibility-center', handleAccessibilityToggle);
      window.removeEventListener('open-notification-center', handleNotificationToggle);
      window.removeEventListener('open-feedback-inbox', handleFeedbackToggle);
    };
  }, []);

  return (
    <div className="min-h-screen bg-surface text-text flex flex-col font-sans transition-colors relative selection:bg-primary/20 selection:text-heading">
      {/* Scroll restoration on every route change */}
      <ScrollToTop />

      {/* Offline Status Banner */}
      <OfflineDetector />

      {/* Floating Leaf Particles (Skipped entirely when Reduce effects is on) */}
      {!reduceEffects && (
        <Suspense fallback={null}>
          <LeafParticles />
        </Suspense>
      )}

      {/* Cursor Parallax Glow (Skipped entirely when Reduce effects is on) */}
      {!reduceEffects && (
        <Suspense fallback={null}>
          <CursorGlow />
        </Suspense>
      )}

      {/* Top Proactive Swap Alert Banner */}
      <SwapSuggestionBanner />

      {/* Main Navigation */}
      <Navbar />

      {/* Page Content with Routes & Suspense */}
      <main className="flex-1 pb-16 md:pb-0">
        <Suspense fallback={<PageLoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/truth-lab" element={<TruthLabPage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/transform" element={<TransformPage />} />
            <Route path="/eco-check" element={<EcoCheckPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/community" element={<Navigate to="/" replace />} />
            <Route path="/impact" element={<ImpactPage />} />
            <Route path="/fairness" element={<FairnessPage />} />
            <Route path="/playground" element={<PlaygroundPage />} />
            <Route path="/blackbox" element={<Navigate to="/" replace />} />
            <Route path="/duel" element={<DuelPage />} />
            <Route path="/passport/:id" element={<TrustPassportPage />} />
            <Route path="/counterfactual" element={<CounterfactualPage />} />
            <Route path="/courtroom" element={<CourtroomPage />} />
            <Route path="/scan" element={<LabelScannerPage />} />
            <Route path="/barcodes" element={<BarcodeDemoPage />} />
            <Route path="/scanner" element={<Navigate to="/scan" replace />} />
            <Route path="/dilemmas" element={<DilemmasPage />} />
            <Route path="/self-audit" element={<AISelfAuditPage />} />
            <Route path="/kirana" element={<KiranaPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/transparency" element={<Navigate to="/" replace />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      {/* Mobile Bottom Tab Bar (Home, Shop, Tools, Cart, Profile) */}
      <MobileBottomTabs />

      {/* Command Palette (Ctrl/Cmd+K) */}
      {commandPaletteOpen && (
        <Suspense fallback={null}>
          <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
        </Suspense>
      )}

      {/* Cart Drawer Slide-out with Swap My Cart */}
      {isCartOpen && (
        <Suspense fallback={null}>
          <CartDrawer />
        </Suspense>
      )}

      {/* Detailed Product Specifications Modal (Quick-view) */}
      {selectedProduct && (
        <Suspense fallback={null}>
          <ProductDetailModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        </Suspense>
      )}

      {/* Checkout and Confirmation Modals */}
      {checkoutModalOpen && (
        <Suspense fallback={null}>
          <CheckoutModal />
        </Suspense>
      )}
      {orderConfirmation && (
        <Suspense fallback={null}>
          <ConfirmationModal />
        </Suspense>
      )}

      {/* Authentication Modal */}
      {authModalOpen && (
        <Suspense fallback={null}>
          <AuthModal />
        </Suspense>
      )}

      {/* Product Compare Modal */}
      {isCompareOpen && (
        <Suspense fallback={null}>
          <ProductCompareModal />
        </Suspense>
      )}

      {/* Welcome & Exit Intent Modals */}
      {welcomeModalOpen && (
        <Suspense fallback={null}>
          <WelcomeModal />
        </Suspense>
      )}
      {exitIntentOpen && (
        <Suspense fallback={null}>
          <ExitIntentModal />
        </Suspense>
      )}

      {/* Achievement Unlocked Pop-up */}
      {Boolean(unlockedBadge) && (
        <Suspense fallback={null}>
          <AchievementUnlockedModal />
        </Suspense>
      )}

      {/* Konami Code Easter Egg */}
      {konamiActive && (
        <Suspense fallback={null}>
          <EasterEggKonami />
        </Suspense>
      )}

      {/* Keyboard Shortcuts Overlay */}
      {shortcutsOpen && (
        <Suspense fallback={null}>
          <KeyboardShortcutsModal isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
        </Suspense>
      )}

      {/* Responsible AI: Greenwashing Detective Dossier */}
      {greenwashingModalOpen && (
        <Suspense fallback={null}>
          <GreenwashingDetectiveModal isOpen={greenwashingModalOpen} onClose={() => setGreenwashingModalOpen(false)} />
        </Suspense>
      )}

      {/* Responsible AI: Ethics Inbox Human-in-the-Loop Oversight Modal */}
      {ethicsInboxOpen && (
        <Suspense fallback={null}>
          <EthicsInboxModal isOpen={ethicsInboxOpen} onClose={() => setEthicsInboxOpen(false)} />
        </Suspense>
      )}

      {/* Tier 3: Privacy Center Modal */}
      {privacyCenterOpen && (
        <Suspense fallback={null}>
          <PrivacyCenterModal isOpen={privacyCenterOpen} onClose={() => setPrivacyCenterOpen(false)} />
        </Suspense>
      )}

      {/* Tier 3: Accessibility Center Modal */}
      {accessibilityCenterOpen && (
        <Suspense fallback={null}>
          <AccessibilityCenterModal isOpen={accessibilityCenterOpen} onClose={() => setAccessibilityCenterOpen(false)} />
        </Suspense>
      )}

      {/* Tier 3: Notification Center Modal */}
      {notificationCenterOpen && (
        <Suspense fallback={null}>
          <NotificationCenterModal isOpen={notificationCenterOpen} onClose={() => setNotificationCenterOpen(false)} />
        </Suspense>
      )}

      {/* Tier 3: Feedback Inbox Modal */}
      {feedbackInboxOpen && (
        <Suspense fallback={null}>
          <FeedbackInboxModal isOpen={feedbackInboxOpen} onClose={() => setFeedbackInboxOpen(false)} />
        </Suspense>
      )}

      {/* Floating Eco Agent AI Chat Widget */}
      {isAgentOpen && (
        <Suspense fallback={null}>
          <EcoAgentChat />
        </Suspense>
      )}

      {/* Unified Accessible Toast Provider */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Sticky Impact Pulse Mini-Widget */}
      <ImpactPulseWidget />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <I18nProvider>
          <AuthProvider>
            <ProductsProvider>
              <CartProvider>
                <HashRouter>
                  <AppContent />
                </HashRouter>
              </CartProvider>
            </ProductsProvider>
          </AuthProvider>
        </I18nProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
