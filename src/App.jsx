import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileBottomTabs from './components/MobileBottomTabs';
import CommandPalette from './components/CommandPalette';

// Route Pages - Lazy loaded for code-splitting & performance
const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const ToolsPage = lazy(() => import('./pages/ToolsPage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const ImpactPage = lazy(() => import('./pages/ImpactPage'));
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Widgets, Modals and Drawers
import ImpactPulseWidget from './components/tools/ImpactPulseWidget';
import CartDrawer from './components/CartDrawer';
import ProductDetailModal from './components/ProductDetailModal';
import CheckoutModal from './components/CheckoutModal';
import ConfirmationModal from './components/ConfirmationModal';
import AuthModal from './components/AuthModal';
import WelcomeModal from './components/WelcomeModal';
import ExitIntentModal from './components/ExitIntentModal';
import AchievementUnlockedModal from './components/AchievementUnlockedModal';
import ProductCompareModal from './components/ProductCompareModal';
import SwapSuggestionBanner from './components/EcoAgent/SwapSuggestionBanner';
import EcoAgentChat from './components/EcoAgent/EcoAgentChat';
import OfflineDetector from './components/OfflineDetector';
import CursorGlow from './components/CursorGlow';
import LeafParticles from './components/LeafParticles';
import EasterEggKonami from './components/EasterEggKonami';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';
import { CheckCircle2, Sparkles, Info } from 'lucide-react';

function PageLoadingFallback() {
  return (
    <div className="min-h-[60vh] max-w-7xl mx-auto px-4 py-12 animate-pulse space-y-6">
      <div className="h-10 bg-stone-200/80 rounded-2xl w-1/3" />
      <div className="h-4 bg-stone-200/60 rounded-lg w-1/2" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-4/5 bg-stone-100 rounded-3xl border border-stone-200/60" />
        ))}
      </div>
    </div>
  );
}

function AppContent() {
  const {
    selectedProduct,
    setSelectedProduct,
    toastMessage
  } = useCart();

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#0a0a0a] flex flex-col font-sans transition-colors relative selection:bg-emerald-100 selection:text-emerald-950">
      {/* Scroll restoration on every route change */}
      <ScrollToTop />

      {/* Offline Status Banner */}
      <OfflineDetector />

      {/* Floating Leaf Particles (Respects Reduce Effects) */}
      <LeafParticles />

      {/* Cursor Parallax Glow (Respects Reduce Effects) */}
      <CursorGlow />

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
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/impact" element={<ImpactPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/orders" element={<OrdersPage />} />
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
      <CommandPalette />

      {/* Cart Drawer Slide-out with Swap My Cart */}
      <CartDrawer />

      {/* Detailed Product Specifications Modal (Quick-view) */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Checkout and Confirmation Modals */}
      <CheckoutModal />
      <ConfirmationModal />

      {/* Authentication Modal */}
      <AuthModal />

      {/* Product Compare Modal */}
      <ProductCompareModal />

      {/* Welcome & Exit Intent Modals */}
      <WelcomeModal />
      <ExitIntentModal />

      {/* Achievement Unlocked Pop-up */}
      <AchievementUnlockedModal />

      {/* Konami Code Easter Egg */}
      <EasterEggKonami />

      {/* Keyboard Shortcuts Overlay */}
      <KeyboardShortcutsModal />

      {/* Floating Eco Agent AI Chat Widget */}
      <EcoAgentChat />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 left-6 z-50 animate-slide-up pointer-events-none">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-stone-900 text-white shadow-2xl border border-stone-800 text-xs font-semibold">
            {toastMessage.type === 'swap' ? (
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-sky-400 shrink-0" />
            )}
            <span>{toastMessage.message}</span>
          </div>
        </div>
      )}

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
        <AuthProvider>
          <CartProvider>
            <HashRouter>
              <AppContent />
            </HashRouter>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
