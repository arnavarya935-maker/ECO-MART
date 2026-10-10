import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import productsData from '../data/products.json';
import { calculateCartImpact } from '../lib/impactCalculator';
import { getSwapSuggestion } from '../lib/ecoAgent';
import { calculateEcoScore } from '../lib/ecoScore';

const CartContext = createContext();

// Helper to fire green celebratory confetti
export const fireGreenConfetti = () => {
  try {
    confetti({
      particleCount: 55,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#10B981', '#059669', '#34D399', '#F59E0B', '#FAF7F0']
    });
  } catch (_e) {}
};

// Initial mock reviews for offline realism
const INITIAL_REVIEWS = {
  'prod-001': [
    { id: 'r1', author: 'Aarav P.', rating: 5, comment: 'Incredible bamboo craftsmanship. Replaced all plastic boards!', date: '2026-03-12', verifiedEco: true },
    { id: 'r2', author: 'Neha S.', rating: 5, comment: 'Zero plastic in the parcel. Smells natural and durable.', date: '2026-03-24', verifiedEco: true }
  ],
  'prod-002': [
    { id: 'r3', author: 'Vikram M.', rating: 5, comment: 'Keeps water cold all day, feel great avoiding plastic bottles.', date: '2026-03-18', verifiedEco: true }
  ],
  'prod-007': [
    { id: 'r4', author: 'Pooja R.', rating: 5, comment: 'The bristles are soft and the handle feels solid. Excellent!', date: '2026-02-28', verifiedEco: true }
  ]
};

export function CartProvider({ children }) {
  // Cart items
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('ecomart_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (_e) {
      return [];
    }
  });

  // Wishlist items
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('ecomart_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (_e) {
      return [];
    }
  });

  // Compare items (max 3)
  const [compareList, setCompareList] = useState(() => {
    try {
      const saved = localStorage.getItem('ecomart_compare');
      return saved ? JSON.parse(saved) : [];
    } catch (_e) {
      return [];
    }
  });

  // Recently viewed
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      const saved = localStorage.getItem('ecomart_recent');
      return saved ? JSON.parse(saved) : [];
    } catch (_e) {
      return [];
    }
  });

  // Reviews
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('ecomart_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch (_e) {
      return INITIAL_REVIEWS;
    }
  });

  // Order history
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('ecomart_orders');
      return saved ? JSON.parse(saved) : [];
    } catch (_e) {
      return [];
    }
  });

  // Applied Coupon
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Modals & Popups state
  const [activeSwapAlert, setActiveSwapAlert] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAgentOpen, setIsAgentOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [unlockedBadge, setUnlockedBadge] = useState(null);

  // First-time welcome modal
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(() => {
    try {
      return !localStorage.getItem('ecomart_welcome_seen');
    } catch (_e) {
      return false;
    }
  });

  // Exit intent modal
  const [exitIntentOpen, setExitIntentOpen] = useState(false);
  const [hasTriggeredExitIntent, setHasTriggeredExitIntent] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ecomart_cart', JSON.stringify(cartItems));
    } catch (_e) {}
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('ecomart_wishlist', JSON.stringify(wishlist));
    } catch (_e) {}
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('ecomart_compare', JSON.stringify(compareList));
    } catch (_e) {}
  }, [compareList]);

  useEffect(() => {
    try {
      localStorage.setItem('ecomart_recent', JSON.stringify(recentlyViewed));
    } catch (_e) {}
  }, [recentlyViewed]);

  useEffect(() => {
    try {
      localStorage.setItem('ecomart_reviews', JSON.stringify(reviews));
    } catch (_e) {}
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem('ecomart_orders', JSON.stringify(orders));
    } catch (_e) {}
  }, [orders]);

  // Exit intent detection (mouse leaving window top)
  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (e.clientY <= 10 && !hasTriggeredExitIntent && cartItems.length > 0) {
        setExitIntentOpen(true);
        setHasTriggeredExitIntent(true);
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasTriggeredExitIntent, cartItems.length]);

  const dismissWelcomeModal = () => {
    setWelcomeModalOpen(false);
    try {
      localStorage.setItem('ecomart_welcome_seen', 'true');
    } catch (_e) {}
  };

  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Add to recently viewed
  const trackRecentlyViewed = useCallback((product) => {
    if (!product) return;
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      return [product, ...filtered].slice(0, 8);
    });
  }, []);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    // Check eco score for celebratory green confetti
    const score = calculateEcoScore(product);
    if (score.grade === 'A') {
      fireGreenConfetti();
    }

    // Check if added item has a greener swap suggestion
    const swap = getSwapSuggestion(product, productsData);
    if (swap) {
      setActiveSwapAlert({
        conventionalProduct: product,
        greenerProduct: swap.greenerProduct,
        impact: swap,
        quantity
      });
      showToast(
        `Added to cart! Greener alternative available: ${swap.greenerProduct.name}`,
        'swap'
      );
    } else {
      showToast(`Added "${product.name}" to cart`, 'success');
    }
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    if (activeSwapAlert && activeSwapAlert.conventionalProduct.id === productId) {
      setActiveSwapAlert(null);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Perform 1-tap greener swap
  const swapItemInCart = (oldProductId, newProduct) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.product.id === oldProductId);
      const qty = existingItem ? existingItem.quantity : 1;
      const filtered = prev.filter((item) => item.product.id !== oldProductId);
      const existingNewItem = filtered.find((item) => item.product.id === newProduct.id);

      if (existingNewItem) {
        return filtered.map((item) =>
          item.product.id === newProduct.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }

      return [...filtered, { product: newProduct, quantity: qty }];
    });

    fireGreenConfetti();
    setActiveSwapAlert(null);
    showToast(`🌱 Swapped to ${newProduct.name}! Impact improved.`, 'success');

    // Trigger achievement popup if first swap
    try {
      const swappedBefore = localStorage.getItem('ecomart_achievement_first_swap');
      if (!swappedBefore) {
        localStorage.setItem('ecomart_achievement_first_swap', 'true');
        setUnlockedBadge({
          title: 'Eco Alchemist',
          desc: 'Completed your first 1-tap sustainable product swap!',
          icon: '✨',
          points: 50
        });
      }
    } catch (_e) {}
  };

  const clearCart = () => {
    setCartItems([]);
    setActiveSwapAlert(null);
    setAppliedCoupon(null);
  };

  // Wishlist Actions
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`Removed "${product.name}" from wishlist`, 'info');
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast(`Saved "${product.name}" to wishlist`, 'success');
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => wishlist.some((p) => p.id === productId);

  const moveWishlistToCart = (product) => {
    addToCart(product);
    setWishlist((prev) => prev.filter((p) => p.id !== product.id));
  };

  // Compare Actions (max 3)
  const addToCompare = (product) => {
    setCompareList((prev) => {
      if (prev.some((p) => p.id === product.id)) return prev;
      if (prev.length >= 3) {
        showToast('You can compare up to 3 products at a time', 'info');
        return prev;
      }
      showToast(`Added "${product.name}" to compare list`, 'success');
      return [...prev, product];
    });
  };

  const removeFromCompare = (productId) => {
    setCompareList((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearCompare = () => setCompareList([]);

  // Reviews Actions
  const addReview = (productId, review) => {
    const newRev = {
      id: 'rev_' + Date.now(),
      author: review.author || 'Conscious Shopper',
      rating: review.rating || 5,
      comment: review.comment,
      date: new Date().toISOString().split('T')[0],
      verifiedEco: true
    };
    setReviews((prev) => ({
      ...prev,
      [productId]: [newRev, ...(prev[productId] || [])]
    }));
    showToast('Thank you! Your verified eco-review has been posted.', 'success');
  };

  const getProductReviews = (productId) => {
    return reviews[productId] || [];
  };

  // Order Placement
  const recordOrder = (orderData) => {
    const newOrder = {
      id: 'ECO-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }),
      items: [...cartItems],
      total: orderData.total,
      shippingAddress: orderData.address,
      carbonOffset: orderData.carbonOffset || false,
      plasticFreePackaging: orderData.plasticFreePackaging || true,
      impact: impact,
      couponApplied: appliedCoupon
    };

    setOrders((prev) => [newOrder, ...prev]);
    setOrderConfirmation(newOrder);
    clearCart();

    // Trigger celebration badge
    setUnlockedBadge({
      title: 'Planetary Steward',
      desc: `Order placed with ${impact.savedCo2.toFixed(1)}kg CO₂ avoided!`,
      icon: '🌍',
      points: Math.round(orderData.total / 10)
    });
    fireGreenConfetti();
  };

  // Coupon handling
  const applyCouponCode = (code) => {
    const clean = (code || '').trim().toUpperCase();
    if (clean === 'GREEN10') {
      const discount = 10;
      setAppliedCoupon({ code: clean, percent: discount, label: '10% Green Pioneer Discount' });
      showToast('Coupon GREEN10 applied! 10% off', 'success');
      return { success: true, message: '10% discount applied!' };
    }
    if (clean === 'EARTHDAY') {
      const discount = 15;
      setAppliedCoupon({ code: clean, percent: discount, label: '15% Earth Day Special' });
      showToast('Coupon EARTHDAY applied! 15% off', 'success');
      return { success: true, message: '15% discount applied!' };
    }
    if (clean === 'ZERO15') {
      const discount = 15;
      setAppliedCoupon({ code: clean, percent: discount, label: '15% Plastic-Free Movement' });
      showToast('Coupon ZERO15 applied! 15% off', 'success');
      return { success: true, message: '15% discount applied!' };
    }
    showToast('Invalid or expired coupon code', 'info');
    return { success: false, message: 'Invalid coupon code. Try GREEN10 or EARTHDAY.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  // Calculate live impact
  const impact = calculateCartImpact(cartItems, productsData);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        allProducts: productsData,
        addToCart,
        removeFromCart,
        updateQuantity,
        swapItemInCart,
        clearCart,
        impact,
        activeSwapAlert,
        dismissSwapAlert: () => setActiveSwapAlert(null),
        isCartOpen,
        setIsCartOpen,
        isAgentOpen,
        setIsAgentOpen,
        selectedProduct,
        setSelectedProduct,
        checkoutModalOpen,
        setCheckoutModalOpen,
        orderConfirmation,
        setOrderConfirmation,
        toastMessage,
        showToast,
        // Wishlist
        wishlist,
        toggleWishlist,
        isInWishlist,
        moveWishlistToCart,
        // Compare
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isCompareOpen,
        setIsCompareOpen,
        // Recently Viewed
        recentlyViewed,
        trackRecentlyViewed,
        // Reviews
        reviews,
        addReview,
        getProductReviews,
        // Orders
        orders,
        recordOrder,
        // Coupons
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
        // Popups & Gamification
        unlockedBadge,
        dismissBadge: () => setUnlockedBadge(null),
        welcomeModalOpen,
        dismissWelcomeModal,
        exitIntentOpen,
        dismissExitIntent: () => setExitIntentOpen(false)
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

