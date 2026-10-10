# EcoMart — Sustainable E-Commerce Platform Powered by Eco Agent

> *"Don't just shop. Shop with purpose."*

EcoMart is a complete, fully offline-capable, sustainable e-commerce web application built with **React**, **Vite**, **Vanilla CSS & Tailwind CSS tokens**, and **React Three Fiber (Three.js)**. EcoMart transparently scores products with a 0-100 lifecycle formula, suggests greener product swaps, and provides 11 interactive calculators and tools—all running 100% locally with zero CDN dependencies.

---

## 🚀 Quick Setup & Running Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 🔒 Firebase Configuration (Optional)
The application works **100% offline without Firebase**. When Firebase is unconfigured or when your device is offline, Google Sign-In is automatically hidden or gracefully disabled with a tooltip, falling back seamlessly to local salted SHA-256 password hashing or 1-click **Guest Mode**.

To enable real Google Sign-In via Firebase, create a `.env` file in the project root:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 🛡️ Offline-First Architecture & Graceful Degradation
- **Zero External Assets**: All fonts, SVGs, real product images (`/public/images/products/`), textures, icons, and audio synthesis are bundled locally in `/public` and `src`.
- **Zero Runtime CDNs**: No Google Fonts, no unpkg, no external image links.
- **Service Worker / PWA**: Registered service worker (`/sw.js`) caches app assets for offline use with an installable `manifest.json`.
- **School Laptop Performance**: A persistent **"Reduce Effects"** toggle defaults to ON if `prefers-reduced-motion` is active or if WebGL is unavailable, disabling 3D renders, canvas particle layers, and parallax.
- **Safe 3D Wrapper**: Every 3D visualizer is wrapped in `<Safe3D>` with a loading progress bar and an accessible static-image fallback.

---

## 📋 Complete 66-Feature Checklist

### PHASE 1: FOUNDATION (Features 1–8)
- [x] **1. Design tokens file and global theme**: Single `src/styles/tokens.css` with CSS variables for deep forest green headings, pure white/soft off-white backgrounds, emerald/teal accents, and amber highlights.
- [x] **2. Local font loading (no Google Fonts), type scale**: Local system font stack (`Outfit`, system-ui, sans-serif), zero external font requests in `index.html`.
- [x] **3. Reusable component library**: `Button`, `Card`, `Badge`, `Modal`, `Tooltip`, `Tabs`, `Toast`, and `Skeleton` in `src/components/ui/`.
- [x] **4. "Reduce effects" toggle in the header, wired app-wide**: Dedicated toggle button in header and settings, auto-detecting WebGL and prefers-reduced-motion.
- [x] **5. Offline/online status detector with a small banner**: `OfflineDetector.jsx` listens to network events and notifies the user with a friendly banner.
- [x] **6. Service worker / PWA setup with an installable manifest**: `public/sw.js` offline cache and `public/manifest.json` registered in `src/main.jsx`.
- [x] **7. Error boundary and friendly 404 page**: Reusable `ErrorBoundary.jsx` and `NotFoundPage.jsx` styled with light design tokens.
- [x] **8. Responsive layout system and sticky navigation**: Mobile, tablet, and desktop sticky navbar with navigation links and cart badges.

### PHASE 2: ACCOUNTS AND DATA (Features 9–16)
- [x] **9. Local email/password signup and login**: Web Crypto SHA-256 + salt authentication persisted in `localStorage`.
- [x] **10. "Continue as Guest" option**: Instant 1-click access with guest session indicators and persistent cart.
- [x] **11. Optional Google login via Firebase**: Gracefully disabled with friendly tooltip when offline or unconfigured.
- [x] **12. Profile page with avatar picker and eco level**: 8 local avatars (`LOCAL_AVATARS`), level titles, XP, and order stats in `ProfilePage.jsx`.
- [x] **13. Wishlist / saved items**: Add/remove items with persistent localStorage state and 1-tap move-to-cart on `WishlistPage.jsx`.
- [x] **14. Shopping cart with quantity controls and persistent state**: Slide-out `CartDrawer.jsx` with real-time carbon, plastic, and water savings totals.
- [x] **15. Order history and checkout simulation**: `OrdersPage.jsx` and multi-step `CheckoutModal.jsx` with digital impact receipts.
- [x] **16. Settings page**: Complete controls for theme accents, Reduce Effects, audio effects, and local data reset in `SettingsPage.jsx`.

### PHASE 3: CATALOG AND SEARCH (Features 17–30)
- [x] **17. Product grid with locally saved real product images**: Local WebP images with SVG fallbacks in `ProductCard.jsx`.
- [x] **18. Product detail page with image gallery and zoom**: `ProductGallery.jsx` with thumbnail switcher, cursor zoom, and fullscreen view.
- [x] **19. Smart search with fuzzy matching, suggestions, and recent searches**: Dropdown suggestions and recent search chips in `ShopPage.jsx`.
- [x] **20. Filters (category, price, eco score, certification)**: Interactive sliders, grade pills, and multi-select criteria.
- [x] **21. Sort options**: Highest Eco-Score, Lowest Carbon Footprint, Nearest Origin, and Price Low/High.
- [x] **22. Eco score badge on every product**: Universal 0-100 `EcoScoreBadge.jsx` with letter grades (A–E).
- [x] **23. Product badges**: Plastic-free, Recycled, Vegan, Fair Trade, Local, and Low-carbon chips.
- [x] **24. Live swap demo**: Side-by-side interactive comparison in `LiveSwapDemo.jsx` on Home and Shop pages.
- [x] **25. Compare tool for up to 3 products**: Side-by-side metric comparison modal in `ProductCompareModal.jsx`.
- [x] **26. Recently viewed products**: Local storage carousel showing last viewed items in `ShopPage.jsx`.
- [x] **27. "Better alternative" suggestions on product pages**: Proactive greener swaps highlighted in `ProductDetailModal.jsx`.
- [x] **28. Category landing pages**: Category spotlights with educational environmental facts and banner taglines.
- [x] **29. Product reviews (local) with star rating**: Verified buyer reviews with star ratings and impact tags.
- [x] **30. Barcode-style "scan" simulation for swap finder**: `BarcodeScannerModal.jsx` with quick-scan simulations and manual code entry fallback.

### PHASE 4: HERO AND VISUAL EXPERIENCE (Features 31–42)
- [x] **31. Animated hero with mint-to-white gradient**: Styled in `Hero.jsx` using `#E8F5EE` to white gradients.
- [x] **32. 3D hero object inside `<Safe3D>`**: `LeafyGlobe3D.jsx` planetary biosphere wrapped in `<Safe3D>`.
- [x] **33. Cursor-reactive effects (parallax, glow)**: `CursorGlow.jsx` disabled under Reduce Effects.
- [x] **34. Scroll storytelling section ("From waste to wonder")**: 4-stage interactive reveal in `StorytellingSection.jsx`.
- [x] **35. Animated impact counters**: `AnimatedImpactCounters.jsx` animating CO2, plastic, trees, and water.
- [x] **36. Floating leaf particle layer (capped, pausable)**: `LeafParticles.jsx` capped at 10 particles, paused on tab hidden or Reduce Effects.
- [x] **37. Page transitions**: Smooth fade/slide transitions between application routes.
- [x] **38. Micro-interactions on buttons, cards, and cart icon**: Hover scale, active compress, and `.cart-icon-bounce`.
- [x] **39. Skeleton loaders for lazy sections**: Reusable `Skeleton.jsx` shown during lazy code loading.
- [x] **40. Marquee of partner and certification logos**: Local SVG badges for GOTS, FSC, Fair Trade, and India Organic in `PartnerMarquee.jsx`.
- [x] **41. Testimonials carousel**: Customer and artisan stories with ratings and navigation in `TestimonialsCarousel.jsx`.
- [x] **42. Before/after image slider**: Interactive draggable slider in `BeforeAfterSlider.jsx` comparing conventional clutter vs circular living.

### PHASE 5: INTERACTIVE TOOLS (Features 43–54)
- [x] **43. Interactive Eco Quiz**: 4-question quiz with score percentage, result tiers, and shareable result card in `EcoQuiz.jsx`.
- [x] **44. Carbon footprint calculator**: Interactive transport, diet, energy, and shopping sliders with breakdown bars in `CarbonFootprintCalculator.jsx`.
- [x] **45. Eco Map as a bundled static SVG map**: Interactive clickable craft regions (zero map tiles) in `EcoMap.jsx`.
- [x] **46. Daily eco challenge with streak counter**: Daily tasks with XP and streak count in `DailyEcoChallenge.jsx`.
- [x] **47. Eco goals tracker with progress rings**: SVG circular progress arcs in `EcoGoalsTracker.jsx`.
- [x] **48. Sticky "Impact Pulse" mini-widget**: Collapsible floating widget displaying real-time cart impact in `ImpactPulseWidget.jsx`.
- [x] **49. Savings vs. impact calculator for switching products**: Interactive checkboxes revealing annual ₹ savings and CO2 in `SavingsImpactCalculator.jsx`.
- [x] **50. Recycling guide: "Where does this go?" lookup**: Searchable circular disposal directory in `RecyclingGuide.jsx`.
- [x] **51. Seasonal produce and product guide**: Summer, Monsoon, and Winter local produce guide in `SeasonalGuide.jsx`.
- [x] **52. Eco glossary with tooltips**: Interactive definitions for Cradle-to-Cradle, GOTS, Embodied Carbon, and Greenwashing in `EcoGlossary.jsx`.
- [x] **53. Water and energy usage estimator**: Shower, laundry, and kitchen water/heating calculator in `WaterEnergyEstimator.jsx`.
- [x] **54. Plant-a-tree virtual garden**: Gamified tree that grows across 5 levels from seedling to grove in `PlantATreeGarden.jsx`.

### PHASE 6: COMMUNITY AND GAMIFICATION (Features 55–61)
- [x] **55. Community section with local posts, tips, and likes**: Community feed with tip sharing, tags, and likes in `CommunityFeed.jsx`.
- [x] **56. Leaderboard (local users and sample data)**: Regional champions honor roll in `EcoLeaderboard.jsx`.
- [x] **57. Achievements and badges with unlock animations**: `AchievementUnlockedModal.jsx` and unlock criteria in `ProfilePage.jsx`.
- [x] **58. XP and level system**: Tier levels from Seedling to Forest Guardian with animated progress bars.
- [x] **59. Shareable impact summary card (export as PNG, offline)**: HTML5 `<canvas>` rendering and downloading an official offline PNG in `ShareableImpactCard.jsx`.
- [x] **60. Pledge wall**: Interactive community pledge wall with local storage persistence in `PledgeWall.jsx`.
- [x] **61. Newsletter signup form**: Offline-safe newsletter subscription with confirmation in `NewsletterSignup.jsx`.

### PHASE 7: POLISH AND DELIGHT (Features 62–66)
- [x] **62. Sound effects**: Offline Web Audio API synth (`audio.js`) muted by default, toggleable in settings and disabled under Reduce Effects.
- [x] **63. Guided onboarding tour on first visit**: 4-step guided tour (`WelcomeModal.jsx`), skippable and replayable from Settings.
- [x] **64. Hidden Easter egg (Konami code)**: Entering `↑ ↑ ↓ ↓ ← → ← → B A` triggers a floating leaf-confetti celebration and unlocks a secret badge in `EasterEggKonami.jsx`.
- [x] **65. Keyboard shortcuts overlay (press "?")**: Keyboard cheat sheet modal (`KeyboardShortcutsModal.jsx`) triggered by pressing `?`.
- [x] **66. Accessibility and QA pass**: WCAG AA color contrast, visible focus rings, aria labels, zero external URLs, and offline test pass.

---

## 📄 License & Attribution
- Product photography rights adhere to the Unsplash License (see `/public/images/CREDITS.md`).
- Core codebase licensed under the MIT License.
