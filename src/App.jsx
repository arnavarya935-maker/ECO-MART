import React, { useState, Suspense, lazy } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import HowItWorksPage from './pages/HowItWorksPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import WishlistPage from './pages/WishlistPage';
import OrdersPage from './pages/OrdersPage';
import NotFoundPage from './pages/NotFoundPage';

// Lazy load chart and 3D heavy pages for fast first load
const ImpactPage = lazy(() => import('./pages/ImpactPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const ToolsPage = lazy(() => import('./pages/ToolsPage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));

import ImpactPulseWidget from './components/tools/ImpactPulseWidget';

// Modals and Drawers
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
import { CheckCircle2, Sparkles, Info } from 'lucide-react';

function AppContent() {
  const [activePage, setActivePage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const {
    selectedProduct,
    setSelectedProduct,
    toastMessage
  } = useCart();

  const handleCategorySelectFromHome = (category) => {
    setSelectedCategory(category);
    setActivePage('shop');
  };

  const validPages = ['home', 'shop', 'tools', 'community', 'impact', 'how-it-works', 'login', 'signup', 'wishlist', 'profile', 'orders', 'settings'];
  const is404 = !validPages.includes(activePage);

  return (
    <div className="min-h-screen bg-[#F7FAF8] dark:bg-[#06110D] text-stone-900 dark:text-stone-100 flex flex-col selection:bg-emerald-200 selection:text-emerald-950 font-sans transition-colors relative">
      {/* Offline Status Banner */}
      <OfflineDetector />

      {/* Floating Leaf Particles (Feature 36) */}
      <LeafParticles />

      {/* Cursor Parallax Glow (Feature 33) */}
      <CursorGlow />

      {/* Top Proactive Swap Alert Banner */}
      <SwapSuggestionBanner />

      {/* Main Navigation */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Page Content with Suspense */}
      <main className="flex-1">
        <Suspense fallback={
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
          </div>
        }>
          {activePage === 'home' && (
            <HomePage
              setActivePage={setActivePage}
              onCategorySelect={handleCategorySelectFromHome}
            />
          )}
          {activePage === 'shop' && (
            <ShopPage
              initialCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          )}
          {activePage === 'tools' && <ToolsPage />}
          {activePage === 'community' && <CommunityPage />}
          {activePage === 'impact' && <ImpactPage setActivePage={setActivePage} />}
          {activePage === 'how-it-works' && <HowItWorksPage />}
          {activePage === 'login' && <LoginPage setActivePage={setActivePage} />}
          {activePage === 'signup' && <SignupPage setActivePage={setActivePage} />}
          {activePage === 'wishlist' && <WishlistPage setActivePage={setActivePage} />}
          {activePage === 'profile' && <ProfilePage setActivePage={setActivePage} />}
          {activePage === 'orders' && <OrdersPage setActivePage={setActivePage} />}
          {activePage === 'settings' && <SettingsPage setActivePage={setActivePage} />}
          {is404 && <NotFoundPage setActivePage={setActivePage} />}
        </Suspense>
      </main>

      {/* Cart Drawer Slide-out */}
      <CartDrawer />

      {/* Detailed Product Specifications Modal */}
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

      {/* Floating Eco Agent AI Chat Widget */}
      <EcoAgentChat />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 animate-slide-up">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-2xl border border-stone-700 dark:border-stone-200 text-xs font-semibold">
            {toastMessage.type === 'swap' ? (
              <Sparkles className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
            ) : toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-sky-400 dark:text-sky-600 shrink-0" />
            )}
            <span>{toastMessage.message}</span>
          </div>
        </div>
      )}

      {/* Sticky Impact Pulse Mini-Widget (Feature 48) */}
      <ImpactPulseWidget />

      {/* Footer */}
      <Footer setActivePage={setActivePage} />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
