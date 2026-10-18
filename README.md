# EcoMart — Sustainable E-Commerce Platform Powered by Eco Agent

> *"Don't just shop. Shop with purpose."*

EcoMart is a complete, fully offline-native sustainable e-commerce web application built with **React**, **Vite**, **Tailwind CSS tokens & CSS Variables**, and **React Three Fiber (Three.js)**. EcoMart transparently scores products with a 0-100 lifecycle formula, suggests greener product swaps, and provides interactive calculators and tools—all running 100% locally with zero CDN dependencies.

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
The application works **100% offline without Firebase**. When Firebase is unconfigured or when your device is offline:
- Google Sign-In is automatically hidden or gracefully disabled with a tooltip.
- Authentication falls back seamlessly to local salted SHA-256 password hashing or 1-click **Guest Mode**.
- Keys are kept safely in a local `.env`.

To optionally enable Google Sign-In via Firebase, create a `.env` file in the project root:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 🛡️ Core Architectural Rules Verification

1. **FULLY OFFLINE**:
   - Every font, texture, 3D model, icon, image, and sound is a local file in `/public` and `src`.
   - Zero runtime CDNs, zero hotlinked images, zero external network requests.
   - Grep verification across `src` and `public` confirms zero external URL dependencies.
2. **GRACEFUL DEGRADATION**:
   - Google login via Firebase detects offline or unconfigured states and hides/disables itself with friendly indicators without blanking or crashing the app.
3. **DESIGN SYSTEM**:
   - One bright LIGHT theme in a single CSS-variables tokens file (`src/styles/tokens.css`).
   - Pure white (`#ffffff`) and soft off-white (`#faf9f6`) backgrounds.
   - Deep forest green headings (`#0B3B2C`).
   - Emerald (`#059669` / `#10b981`) and teal (`#0d9488`) primary accents.
   - Amber highlights (`#d97706` / `#f59e0b`).
   - Subtle mint-to-white gradient for hero sections (`linear-gradient(180deg, #E8F5EE 0%, #FFFFFF 100%)`).
4. **ACCESSIBILITY**:
   - WCAG AA contrast, visible focus rings on all interactive elements (`*:focus-visible`), keyboard navigation, aria labels, alt text, and automatic `prefers-reduced-motion` compliance.
5. **PERFORMANCE (School Laptops)**:
   - Global **"Reduce effects"** toggle (persisted in `localStorage`, default ON if `prefers-reduced-motion` is active or WebGL is missing).
   - Disables 3D canvases, floating particle layers, cursor glow, sound, and heavy animations.
   - Particle counts capped (10 leaves), automatically paused when tab is hidden (`document.hidden`).
6. **SAFE 3D WRAPPER**:
   - Every 3D feature (`LeafyGlobe3D`, `Product3DViewer`, `EcoForest3D`) is wrapped in `<Safe3D>`.
   - Includes a loading progress bar, a friendly loading message, and a static-image fallback when WebGL is unavailable or Reduce effects is on.

---

## 📋 Complete 60-Feature Implementation Checklist

| # | Feature | Status | Implementation Details |
|---|---|:---:|---|
| 1 | **Design tokens and global theme** | **Done** | Single `src/styles/tokens.css` with CSS variables for pure white / soft off-white backgrounds, deep forest green headings (`#0B3B2C`), emerald and teal primary accents, and amber highlights. |
| 2 | **Local font loading and type scale** | **Done** | Zero external fonts or Google Fonts requests. Local system typography stack (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, `Helvetica Neue`) with a harmonic type scale. |
| 3 | **Reusable component library** | **Done** | Complete UI kit in `src/components/ui/`: `Button`, `Card`, `Badge`, `Modal`, `Tabs`, `Toast`, and `Skeleton`. |
| 4 | **Global "Reduce effects" toggle** | **Done** | Persisted toggle in header and Settings; auto-defaults ON if `prefers-reduced-motion` is detected or WebGL is missing. Wired to pause 3D, particles, parallax, and audio. |
| 5 | **Offline/online detector with status banner** | **Done** | `OfflineDetector.jsx` listens to network state and displays a non-intrusive sticky offline banner notifying the user that the entire app is offline-capable. |
| 6 | **PWA with service worker and manifest caching all assets** | **Done** | `public/manifest.json` and `public/sw.js` cache static assets, icons, fonts, and application routes offline. |
| 7 | **Error boundary and friendly 404 page** | **Done** | `ErrorBoundary.jsx` traps runtime crashes with a recovery button; `NotFoundPage.jsx` guides lost users back to catalog. |
| 8 | **Responsive layout and sticky navigation** | **Done** | Sticky header with mobile drawer, brand identity, navigation links, theme toggle, and live cart impact badges. |
| 9 | **Local email/password signup and login** | **Done** | Web Crypto salted SHA-256 password hashing stored safely in `localStorage` via `AuthContext.jsx`. |
| 10 | **"Continue as Guest"** | **Done** | Instant 1-click access with full feature availability and persistent local session state. |
| 11 | **Optional Google login via Firebase, hidden when offline** | **Done** | Gracefully detects offline state and hides the Google button with an offline note; disables when unconfigured in `.env`. |
| 12 | **Profile page with local avatar picker and eco level** | **Done** | 8 local avatars (`LOCAL_AVATARS`), level ranks (Seedling to Forest Guardian), XP progress, and order history in `ProfilePage.jsx`. |
| 13 | **Wishlist** | **Done** | Add/remove items with persistent `localStorage` storage and 1-tap move-to-cart on `WishlistPage.jsx`. |
| 14 | **Cart with quantity controls and persistent state** | **Done** | Slide-out `CartDrawer.jsx` with item increment/decrement, live eco score recalculation, and persistent state in `CartContext.jsx`. |
| 15 | **Checkout simulation with local order history** | **Done** | Multi-step `CheckoutModal.jsx` generating realistic order numbers, digital impact receipts, and persistent orders in `OrdersPage.jsx`. |
| 16 | **Product grid with locally saved real product images** | **Done** | High-resolution local WebP/SVG images in `/public/images/products/` with fallback icons in `ProductCard.jsx`. |
| 17 | **Product detail page with gallery and zoom** | **Done** | `ProductDetailModal.jsx` and `ProductGallery.jsx` featuring multi-angle thumbnails, cursor zoom, and fullscreen lightbox. |
| 18 | **Smart search with fuzzy matching, suggestions, and recent searches** | **Done** | Dropdown search suggestions, query fuzzy matching, and recent search history chips in `ShopPage.jsx`. |
| 19 | **Filters (category, price, eco score, certification) and sorting** | **Done** | Price range sliders, category tabs, eco score grade filters, certification checkboxes, and multi-criteria sorting in `ShopPage.jsx`. |
| 20 | **Eco score on every product** | **Done** | 0-100 lifecycle formula with grades (A through E) and 5-pillar breakdown popovers via `EcoScoreBadge.jsx`. |
| 21 | **Product badges** | **Done** | Distinct visual badges for Plastic-free, Recycled, Vegan, Fair Trade, Local, and Low-carbon items. |
| 22 | **Live swap demo** | **Done** | `LiveSwapDemo.jsx` showcasing conventional items side-by-side with eco alternatives, highlighting CO₂, plastic, and water saved. |
| 23 | **Compare tool for up to 3 products** | **Done** | Side-by-side metric comparison modal (`ProductCompareModal.jsx`) comparing price, materials, packaging, certifications, and distance. |
| 24 | **"Better alternative" suggestions on product pages** | **Done** | Proactive greener alternative swaps integrated directly into `ProductDetailModal.jsx` with 1-click swap. |
| 25 | **Product reviews (local) with star ratings** | **Done** | Local review submission system with star ratings, author badges, verified customer tags, and timestamping. |
| 26 | **Recently viewed products** | **Done** | Persisted carousel tracking recently inspected items in `ShopPage.jsx`. |
| 27 | **Category landing pages** | **Done** | Category spotlight views with educational environmental impact summaries and filtered catalogs. |
| 28 | **Animated hero with mint-to-white gradient** | **Done** | `Hero.jsx` styled with the signature `--hero-gradient` (`linear-gradient(180deg, #E8F5EE 0%, #FFFFFF 100%)`). |
| 29 | **3D hero object inside `<Safe3D>`** | **Done** | `LeafyGlobe3D.jsx` planetary biosphere with clickable regional pins wrapped inside `<Safe3D>` with loading progress and fallback. |
| 30 | **Interactive 3D product viewer on product pages** | **Done** | `Product3DViewer.jsx` built with React Three Fiber, OrbitControls 360° spin, wireframe/materials inspect mode, wrapped in `<Safe3D>` with photo fallback. |
| 31 | **Cursor-reactive effects (parallax, glow)** | **Done** | `CursorGlow.jsx` smooth tracking radial glow; automatically disabled when Reduce Effects is enabled. |
| 32 | **Scroll storytelling section ("From waste to wonder")** | **Done** | 4-stage interactive reveal (`StorytellingSection.jsx`) illustrating the linear-to-circular transition. |
| 33 | **Animated impact counters** | **Done** | `AnimatedImpactCounters.jsx` animating CO₂ diverted, plastic avoided, trees equivalent, and water conserved. |
| 34 | **Floating leaf particle layer (capped, pausable)** | **Done** | `LeafParticles.jsx` capped at 10 particles; automatically paused when tab is hidden or Reduce Effects is active. |
| 35 | **Page transitions** | **Done** | Smooth CSS transitions and keyframe animations between routes (`home`, `shop`, `tools`, `community`, `impact`, `profile`). |
| 36 | **Micro-interactions on buttons, cards, and cart icon** | **Done** | Hover scale, active compressions, bouncy cart badge animations (`cart-icon-bounce`), and interactive pill states. |
| 37 | **Before/after image slider** | **Done** | Draggable before/after slider (`BeforeAfterSlider.jsx`) contrasting plastic clutter with circular living spaces. |
| 38 | **Interactive Eco Quiz** | **Done** | 4-question quiz (`EcoQuiz.jsx`) with scoring tiers, percentage breakdown, and shareable result card. |
| 39 | **Carbon footprint calculator with a chart** | **Done** | `CarbonFootprintCalculator.jsx` with transport, diet, energy, and shopping sliders, Recharts BarChart, and breakdown bars. |
| 40 | **Eco Map as a bundled static SVG map** | **Done** | Clickable artisan regions (`EcoMap.jsx`) with craft details and products (zero external map tiles or libraries). |
| 41 | **Sticky "Impact Pulse" mini-widget** | **Done** | Floating collapsible widget (`ImpactPulseWidget.jsx`) displaying real-time personal impact totals. |
| 42 | **Savings vs. impact calculator for switching products** | **Done** | `SavingsImpactCalculator.jsx` calculates annual financial savings (₹) and CO₂ diverted from common swaps. |
| 43 | **Eco goals tracker with progress rings** | **Done** | `EcoGoalsTracker.jsx` with SVG circular progress rings tracking plastic-free, local buying, and green habits. |
| 44 | **Daily eco challenge with streak counter** | **Done** | `DailyEcoChallenge.jsx` offering daily actionable eco challenges with XP rewards and streak tracking. |
| 45 | **Recycling guide: "Where does this go?" lookup** | **Done** | Searchable circular disposal guide (`RecyclingGuide.jsx`) with composting, e-waste, and recycling instructions. |
| 46 | **Barcode-style scan simulation for swap finder** | **Done** | `BarcodeScannerModal.jsx` simulating barcode scanning with instant greener swap recommendation and manual code entry fallback. |
| 47 | **Virtual garden that grows with user actions (3D with 2D fallback)** | **Done** | `PlantATreeGarden.jsx` integrated with `EcoForest3D.jsx` inside `<Safe3D>` with 3D/2D toggle and growth stages. |
| 48 | **Water and energy usage estimator** | **Done** | `WaterEnergyEstimator.jsx` calculates shower, laundry, and dishwasher consumption with water-saving recommendations. |
| 49 | **Community section with local posts, tips, and likes** | **Done** | `CommunityFeed.jsx` and `CommunityPage.jsx` allowing users to post eco tips, filter tags, and like community contributions. |
| 50 | **Leaderboard (local users plus sample data)** | **Done** | `EcoLeaderboard.jsx` displaying top planetary champions with local user ranking and sample community members. |
| 51 | **Achievements with unlock animations** | **Done** | `AchievementUnlockedModal.jsx` triggered on milestone completions with badge celebrations. |
| 52 | **XP and level system** | **Done** | Points accumulated through swaps, quizzes, and checkouts unlocking progressive ranks from Seedling to Forest Guardian. |
| 53 | **Shareable impact summary card exported as PNG, offline** | **Done** | `ShareableImpactCard.jsx` rendering personal impact stats on an offline HTML5 `<canvas>` and exporting as a downloadable PNG. |
| 54 | **Pledge wall** | **Done** | `PledgeWall.jsx` interactive community wall where users sign and persist personal sustainability commitments. |
| 55 | **Newsletter signup stored locally with an offline-safe message** | **Done** | `NewsletterSignup.jsx` persists email signups locally with immediate offline-friendly confirmation. |
| 56 | **Sound effects** | **Done** | `audio.js` with local audio files in `/public/sounds/` (`pop.wav`, `success.wav`, `swap.wav`, `click.wav`), muted by default, and disabled under Reduce Effects. |
| 57 | **Guided onboarding tour on first visit** | **Done** | `WelcomeModal.jsx` 4-step interactive onboarding tour, skippable and replayable anytime from Settings. |
| 58 | **Hidden Easter egg (Konami code)** | **Done** | `EasterEggKonami.jsx` listens for `↑ ↑ ↓ ↓ ← → ← → B A` to trigger a leaf-confetti celebration and unlock a secret achievement. |
| 59 | **Settings page** | **Done** | `SettingsPage.jsx` comprehensive preferences for Reduce Effects, audio effects, theme accent colors, and local data reset. |
| 60 | **Final accessibility and QA pass** | **Done** | WCAG AA color contrast, visible focus rings, aria roles, zero external URLs, passing offline build and verification tests. |

---

## 🧪 Testing Verification Run

- **Offline Verification**: All assets tested with network requests disabled.
- **Reduce Effects Test**: Toggled ON and OFF to verify proper suspension of 3D objects, particle emitters, audio synthesis, and animations.
- **Build Verification**: `npm run build` runs cleanly with 0 errors.
- **Dataset & Engine Verification**: `node test_verification.mjs` verifies 64 products, 5-pillar lifecycle score engine, impact calculations, and NLP intent parsing.
