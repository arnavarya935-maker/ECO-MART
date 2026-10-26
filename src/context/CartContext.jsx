import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import productsData from '../data/products.json';
import { calculateCartImpact } from '../lib/impactCalculator';
import { getSwapSuggestion } from '../lib/ecoAgent';
import { copilotEngine } from '../lib/copilotEngine.js';
import { FEATURES } from '../lib/features.js';
import { recordSignal } from '../lib/preferenceModel.js';
import { fireGreenConfetti } from '../lib/confetti';
import { DEFAULT_PRIORITIES, PRIORITY_PRESETS } from '../lib/decisionEngine';

export { fireGreenConfetti };

const CartContext = createContext();


// Pure order creation helper
function createNewOrder(orderData, cartItems, impact, appliedCoupon) {
  return {
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
}

export function CartProvider({ children }) {
  // Cart items
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('ecomart_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist items
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('ecomart_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Compare items (max 3)
  const [compareList, setCompareList] = useState(() => {
    try {
      const saved = localStorage.getItem('ecomart_compare');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Recently viewed
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      const saved = localStorage.getItem('ecomart_recent');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Reviews
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('ecomart_reviews');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Order history
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('ecomart_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Applied Coupon
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // User Decision Engine Priorities (Phase 1)
  const [userPriorities, setUserPriorities] = useState(() => {
    try {
      const saved = localStorage.getItem('ecomart_user_priorities');
      return saved ? JSON.parse(saved) : DEFAULT_PRIORITIES;
    } catch {
      return DEFAULT_PRIORITIES;
    }
  });

  const [activePreset, setActivePreset] = useState(() => {
    try {
      return localStorage.getItem('ecomart_active_preset') || 'balanced';
    } catch {
      return 'balanced';
    }
  });

  const updateUserPriorities = useCallback((newWeights, presetName = null) => {
    setUserPriorities((prev) => {
      const updated = typeof newWeights === 'function' ? newWeights(prev) : { ...prev, ...newWeights };
      try {
        localStorage.setItem('ecomart_user_priorities', JSON.stringify(updated));
        if (presetName) {
          localStorage.setItem('ecomart_active_preset', presetName);
          setActivePreset(presetName);
        } else {
          localStorage.setItem('ecomart_active_preset', 'custom');
          setActivePreset('custom');
        }
      } catch {}
      return updated;
    });
  }, []);

  const applyPriorityPreset = useCallback((presetId) => {
    const preset = PRIORITY_PRESETS[presetId];
    if (preset) {
      updateUserPriorities(preset.weights, presetId);
    }
  }, [updateUserPriorities]);

  const resetPriorities = useCallback(() => {
    updateUserPriorities(DEFAULT_PRIORITIES, 'balanced');
  }, [updateUserPriorities]);

  // Modals & Popups state
  const [activeSwapAlert, setActiveSwapAlert] = useState(null);
  const [copilotNudge, setCopilotNudge] = useState(null);
  const [copilotMuted, setCopilotMuted] = useState(() => {
    try {
      return localStorage.getItem('ecomart_copilot_muted') === 'true';
    } catch {
      return false;
    }
  });

  const toggleCopilotMuted = useCallback(() => {
    setCopilotMuted((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('ecomart_copilot_muted', String(next));
      } catch {}
      return next;
    });
  }, []);

  const dismissCopilotNudge = useCallback(() => {
    recordSignal('swap_declined');
    setCopilotNudge(null);
    setActiveSwapAlert(null);
  }, []);


  const swapCartItem = useCallback((oldId, newProduct) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === oldId
          ? { ...item, product: newProduct }
          : item
      )
    );
    fireGreenConfetti();
    recordSignal('swap_accepted');
    setCopilotNudge(null);
    setActiveSwapAlert(null);
  }, []);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAgentOpen, setIsAgentOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [unlockedBadge, setUnlockedBadge] = useState(null);

  // AI Agent Online vs Offline Mode (User selectable)
  const [agentMode, setAgentModeState] = useState(() => {
    try {
      return localStorage.getItem('ecomart_agent_mode') || 'online';
    } catch {
      return 'online';
    }
  });

  // First-time welcome modal
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(() => {
    try {
      return !localStorage.getItem('ecomart_welcome_seen');
    } catch {
      return false;
    }
  });

  // Exit intent modal
  const [exitIntentOpen, setExitIntentOpen] = useState(false);
  const [hasTriggeredExitIntent, setHasTriggeredExitIntent] = useState(false);

  // Dismiss a specific toast
  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Show toast with queue capped at 3
  const showToast = useCallback((message, type = 'info', action = null, duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newToast = { id, message, type, action, duration };
    setToasts((prev) => {
      const updated = [...prev, newToast];
      if (updated.length > 3) {
        return updated.slice(updated.length - 3);
      }
      return updated;
    });

    if (duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, duration);
    }
    return id;
  }, [dismissToast]);

  const setAgentMode = useCallback((mode) => {
    setAgentModeState(mode);
    try {
      localStorage.setItem('ecomart_agent_mode', mode);
      window.dispatchEvent(new CustomEvent('ecomart-agent-mode-change', { detail: { mode } }));
    } catch {}
    showToast(
      mode === 'online'
        ? '🌐 Online AI Connected (Cloud Gemini 2.5)'
        : '⚡ Offline Mode Active (Local-First Heuristics)',
      'info'
    );
  }, [showToast]);

  const toggleAgentMode = useCallback(() => {
    setAgentMode(agentMode === 'online' ? 'offline' : 'online');
  }, [agentMode, setAgentMode]);

  const toastMessage = toasts.length > 0 ? toasts[toasts.length - 1] : null;

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ecomart_cart', JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('ecomart_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('ecomart_compare', JSON.stringify(compareList));
    } catch {}
  }, [compareList]);

  useEffect(() => {
    try {
      localStorage.setItem('ecomart_recent', JSON.stringify(recentlyViewed));
    } catch {}
  }, [recentlyViewed]);

  useEffect(() => {
    try {
      localStorage.setItem('ecomart_reviews', JSON.stringify(reviews));
    } catch {}
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem('ecomart_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  // Exit intent detection (mouse leaving window top)
  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (
        e.clientY <= 0 &&
        !hasTriggeredExitIntent &&
        cartItems.length > 0 &&
        !isCartOpen &&
        !checkoutModalOpen
      ) {
        setExitIntentOpen(true);
        setHasTriggeredExitIntent(true);
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasTriggeredExitIntent, cartItems.length, isCartOpen, checkoutModalOpen]);

  const dismissWelcomeModal = () => {
    setWelcomeModalOpen(false);
    try {
      localStorage.setItem('ecomart_welcome_seen', 'true');
    } catch {}
  };

  // Undo removal support
  const [lastRemovedItem, setLastRemovedItem] = useState(null);

  // Cart Actions
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

    // Check for proactive copilot nudge and sustainable swap alert
    recordSignal('cart_add', { id: product.id, category: product.category });
    if (FEATURES.PROACTIVE_COPILOT) {
      const nudge = copilotEngine.checkCartAdd(product, productsData, {
        isMuted: copilotMuted
      });
      if (nudge) {
        setCopilotNudge(nudge);
      }
    }
    const swap = getSwapSuggestion(product, productsData);
    if (swap) {
      setActiveSwapAlert(swap);
    }

    // Badge triggers
    if (cartItems.length === 0) {
      setUnlockedBadge({
        title: 'Green Pioneer',
        desc: 'Started your journey by adding your first verified sustainable item!',
        icon: '🌱',
        points: 20
      });
      fireGreenConfetti();
    }
  };

  const removeFromCart = (productId) => {
    const itemToRemove = cartItems.find((item) => item.product.id === productId);
    if (itemToRemove) {
      setLastRemovedItem(itemToRemove);
      setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
      showToast(
        `Removed "${itemToRemove.product.name}" from cart.`,
        'info',
        {
          label: 'Undo',
          onClick: () => {
            setCartItems((prev) => [...prev, itemToRemove]);
            playSound('success');
          }
        }
      );
    } else {
      setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    }
  };

  const undoLastRemoval = () => {
    if (!lastRemovedItem) return;
    setCartItems((prev) => [...prev, lastRemovedItem]);
    showToast(`Restored ${lastRemovedItem.product.name} to cart.`, 'success');
    setLastRemovedItem(null);
  };

  const updateQuantity = (productId, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const swapItemInCart = useCallback((targetProductId, newProduct) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === targetProductId);
      if (!existing) return prev;
      const quantity = existing.quantity;
      const filtered = prev.filter((item) => item.product.id !== targetProductId);
      const alreadyHasNew = filtered.find((item) => item.product.id === newProduct.id);
      if (alreadyHasNew) {
        return filtered.map((item) =>
          item.product.id === newProduct.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...filtered, { product: newProduct, quantity }];
    });
  }, []);

  const applySwap = (currentProductId, recommendedProduct) => {
    swapItemInCart(currentProductId, recommendedProduct);
    setActiveSwapAlert(null);

    // Gamification milestone
    try {
      const hasSwappedBefore = localStorage.getItem('ecomart_achievement_first_swap');
      if (!hasSwappedBefore) {
        localStorage.setItem('ecomart_achievement_first_swap', 'true');
        setUnlockedBadge({
          title: 'Eco Alchemist',
          desc: 'Completed your first 1-tap sustainable product swap!',
          icon: '✨',
          points: 50
        });
      }
    } catch {}
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
        showToast(`Removed "${product.name}" from wishlist.`);
        return prev.filter((p) => p.id !== product.id);
      } else {
        recordSignal('wishlist_add', { id: product.id });
        showToast(`Saved "${product.name}" to wishlist.`, 'success');
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some((p) => p.id === productId);
  };

  const moveWishlistToCart = (product) => {
    addToCart(product, 1);
    setWishlist((prev) => prev.filter((p) => p.id !== product.id));
    showToast(`Moved "${product.name}" to cart!`, 'success');
  };

  const moveAllWishlistToCart = () => {
    if (wishlist.length === 0) return;
    wishlist.forEach((product) => {
      addToCart(product, 1);
    });
    setWishlist([]);
    showToast(`Moved ${wishlist.length} items from wishlist to cart!`, 'success');
    fireGreenConfetti();
  };

  // Compare Actions
  const addToCompare = (product) => {
    setCompareList((prev) => {
      if (prev.some((p) => p.id === product.id)) return prev;
      if (prev.length >= 3) {
        showToast('You can compare a maximum of 3 items at a time.', 'info');
        return prev;
      }
      showToast(`Added "${product.name}" to comparison.`, 'info');
      return [...prev, product];
    });
  };

  const removeFromCompare = (productId) => {
    setCompareList((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const trackCategoryBrowsing = useCallback((category) => {
    if (!category) return;
    recordSignal('category_view', category);
    if (!FEATURES.PROACTIVE_COPILOT) return;
    const nudge = copilotEngine.checkCategoryBrowsing(category, {
      isMuted: copilotMuted
    });
    if (nudge) {
      setCopilotNudge(nudge);
    }
  }, [copilotMuted]);

  // Recently Viewed tracker
  const trackRecentlyViewed = (product) => {
    if (!product) return;
    recordSignal('product_open', { id: product.id, category: product.category });
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      return [product, ...filtered].slice(0, 8);
    });
    if (product.category) {
      trackCategoryBrowsing(product.category);
    }
  };

  // Reviews
  const addReview = (productId, review) => {
    const newRev = {
      id: 'rev-' + Date.now(),
      author: review.author || 'Eco Shopper',
      rating: review.rating || 5,
      comment: review.comment || '',
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
    const newOrder = createNewOrder(orderData, cartItems, impact, appliedCoupon);

    setOrders((prev) => [newOrder, ...prev]);
    setOrderConfirmation(newOrder);
    clearCart();

    // Trigger celebration badge
    setUnlockedBadge({
      title: 'Planetary Steward',
      desc: `Order placed with ${Number(impact?.savedCo2 ?? impact?.co2Saved ?? 0).toFixed(1)}kg CO₂ avoided!`,
      icon: '🌍',
      points: Math.round(orderData.total / 10)
    });
    fireGreenConfetti();
  };

  // Coupon handling
  const applyCouponCode = (code) => {
    const upper = code.trim().toUpperCase();
    if (upper === 'EARTH20') {
      setAppliedCoupon({ code: 'EARTH20', discountPercent: 20, description: '20% Earth Day Savings' });
      showToast('Coupon EARTH20 applied! 20% discount added.', 'success');
      return true;
    } else if (upper === 'ZERO50') {
      setAppliedCoupon({ code: 'ZERO50', discountFixed: 50, description: '₹50 Plastic-Free Pioneer' });
      showToast('Coupon ZERO50 applied! ₹50 discount added.', 'success');
      return true;
    } else {
      showToast('Invalid coupon code. Try EARTH20 or ZERO50.', 'info');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Aggregated dynamic impact
  const impact = calculateCartImpact(cartItems);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        allProducts: productsData,
        addToCart,
        removeFromCart,
        updateQuantity,
        swapItemInCart,
        applySwap,
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
        toasts,
        dismissToast,
        showToast,
        lastRemovedItem,
        undoLastRemoval,
        // Wishlist
        wishlist,
        toggleWishlist,
        isInWishlist,
        moveWishlistToCart,
        moveAllWishlistToCart,
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
        addRecentlyViewed: trackRecentlyViewed,
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
        dismissExitIntent: () => setExitIntentOpen(false),
        // Decision Engine Priorities (Phase 1)
        userPriorities,
        setUserPriorities: updateUserPriorities,
        updateUserPriorities,
        activePreset,
        applyPriorityPreset,
        resetPriorities,
        // Proactive Copilot (Phase 3)
        copilotNudge,
        setCopilotNudge,
        dismissCopilotNudge,
        copilotMuted,
        toggleCopilotMuted,
        swapCartItem,
        trackCategoryBrowsing,
        // AI Agent Online/Offline Mode
        agentMode,
        setAgentMode,
        toggleAgentMode
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
