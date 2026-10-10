# EcoMart Agent Upgrade Plan (66 Features / 7 Phases)

This roadmap outlines the complete implementation of all 66 features across 7 sequential phases. The application is built with React 19, Vite, Tailwind CSS v4, and React Three Fiber / Drei / Three.js, operating 100% offline with graceful degradation and strict adherence to the WCAG AA light-first design system.

---

## Non-Negotiable Core Architecture Rules
1. **100% Fully Offline**: Every font, texture, icon, asset, sound, and data file is strictly local. Zero external CDNs or hotlinks.
2. **Graceful Degradation**: Online-dependent capabilities (Google Firebase auth) degrade silently with offline tooltips and local fallbacks.
3. **Design System & Palette Tokens**: Single tokens definition (`--color-forest: #0B3B2C`, `--color-emerald: #10B981`, `--color-teal: #14B8A6`, `--color-amber: #F59E0B`, pure white `#FFFFFF`, soft off-white `#F7FAF8`, mint hero gradient `#E8F5EE` to `#FFFFFF`).
4. **Accessibility (WCAG AA)**: Minimum 4.5:1 text contrast, visible focus rings, full keyboard traversal, ARIA labels, semantic landmark elements.
5. **School Laptop Performance & "Reduce Effects"**: Global toggle defaulting to ON if `prefers-reduced-motion` or WebGL is missing. Pauses 3D, particles, parallax, and heavy animations.
6. **`<Safe3D>` Wrapper**: Loading progress bar, fallback notification, and static visual fallback for all 3D features.

---

## Phase Execution Breakdown

### Phase 1: Foundation (Features 1–8)
- [x] Feature 1: Design tokens file (`src/styles/tokens.css`) and global theme system
- [x] Feature 2: Local font loading (pure offline system typography, removal of external Google Fonts link)
- [x] Feature 3: Reusable component library (`Button`, `Card`, `Badge`, `Modal`, `Tooltip`, `Tabs`, `Toast`, `Skeleton`)
- [x] Feature 4: "Reduce Effects" global toggle wired to app context & header
- [x] Feature 5: Offline/online network status detector with subtle dismissible banner
- [x] Feature 6: Service worker (`public/sw.js`) and PWA web app manifest (`public/manifest.json`)
- [x] Feature 7: Resilient Error Boundary and friendly offline-native 404 page
- [x] Feature 8: Responsive layout grid (mobile, tablet, desktop) and sticky navigation

### Phase 2: Accounts and Data (Features 9–16)
- [x] Feature 9: Local email/password signup and login with Web Crypto SHA-256 + salt
- [x] Feature 10: "Continue as Guest" one-click offline entry
- [x] Feature 11: Optional Firebase Google login with offline detection and disabled tooltip
- [x] Feature 12: Profile page with local SVG avatar picker and eco level tier
- [x] Feature 13: Local persistent Wishlist & saved items
- [x] Feature 14: Shopping cart with quantity controls, persistent state, and live impact calculator
- [x] Feature 15: Local order history with checkout simulation and digital receipt
- [x] Feature 16: Comprehensive Settings page (accents, Reduce effects, sound toggle, local data reset)

### Phase 3: Catalog and Search (Features 17–30)
- [x] Feature 17: Product grid with bundled offline SVG illustrations
- [x] Feature 18: Product detail modal/page with image gallery and lens zoom
- [x] Feature 19: Smart search with fuzzy keyword matching, instant suggestions, and recent searches
- [x] Feature 20: Multidimensional filters (categories, price range, eco-score grade, certifications)
- [x] Feature 21: Sort options (price low/high, eco-score, carbon footprint, alphabetical)
- [x] Feature 22: Universal 0-100 Eco-Score badge on all items
- [x] Feature 23: Environmental product attribute badges (Plastic-Free, Recycled, Vegan, Fair Trade, Hyperlocal, Low-Carbon)
- [x] Feature 24: Interactive Live Swap Demo comparing conventional products side-by-side with eco alternatives
- [x] Feature 25: Compare tool for up to 3 products with synchronized spec matrix
- [x] Feature 26: Recently viewed products tracking in localStorage
- [x] Feature 27: Contextual "Better Alternative" swap recommendations on product modals
- [x] Feature 28: Dedicated Category Landing views with curated hero highlights
- [x] Feature 29: Local star ratings and customer review submission
- [x] Feature 30: Barcode simulation scanner for instant swap identification with manual code entry

### Phase 4: Hero and Visual Experience (Features 31–42)
- [x] Feature 31: Hero section with subtle mint-to-white gradient (`#E8F5EE` to `#FFFFFF`)
- [x] Feature 32: 3D Earth Biosphere hero object safely wrapped inside `<Safe3D>`
- [x] Feature 33: Cursor-reactive subtle tilt/parallax disabled when Reduce Effects is active
- [x] Feature 34: Scroll storytelling section "From Waste to Wonder" with staged lifecycle reveals
- [x] Feature 35: Animated impact counters (CO₂ avoided, plastic diverted, water conserved, trees equivalent)
- [x] Feature 36: Ambient floating leaf particle layer (pauses when tab hidden or Reduce Effects is on)
- [x] Feature 37: Smooth page and view transition animations
- [x] Feature 38: Micro-interactions on buttons, cards, and shopping bag icon
- [x] Feature 39: Skeleton loaders for lazy-loaded sections and modals
- [x] Feature 40: Marquee of partner and certification logos (bundled offline SVGs)
- [x] Feature 41: Testimonials carousel with user review endorsements
- [x] Feature 42: Interactive Before/After split image slider

### Phase 5: Interactive Tools (Features 43–54)
- [x] Feature 43: Interactive Eco-Personality Quiz with score tiers and downloadable result card
- [x] Feature 44: Carbon Footprint Calculator with interactive sliders and category breakdown chart
- [x] Feature 45: Bundled static SVG Eco Map of India with clickable regional artisan clusters
- [x] Feature 46: Daily Eco Challenge with streak counter and point bonuses
- [x] Feature 47: Eco Goals Tracker with animated SVG progress rings
- [x] Feature 48: Sticky "Impact Pulse" mini-widget displaying personal impact totals
- [x] Feature 49: Savings vs. Impact monetary/carbon trade-off calculator
- [x] Feature 50: "Where Does This Go?" waste sorting and recycling directory
- [x] Feature 51: Seasonal Produce and Sustainable Harvesting guide
- [x] Feature 52: Interactive Eco Glossary with terminology tooltips
- [x] Feature 53: Household Water & Energy Conservation estimator
- [x] Feature 54: Plant-a-Tree Virtual Garden with progression milestones

### Phase 6: Community and Gamification (Features 55–61)
- [x] Feature 55: Community Feed with local posts, eco tips, and likes
- [x] Feature 56: Community Leaderboard with local top conscious consumers
- [x] Feature 57: Sustainability achievements and unlock milestone badges
- [x] Feature 58: User XP and conscious leveling system
- [x] Feature 59: Shareable Impact Summary Card exportable to PNG via `html-to-image`
- [x] Feature 60: Interactive Community Sustainability Pledge Wall
- [x] Feature 61: Newsletter signup form with local storage and offline-safe confirmation

### Phase 7: Polish and Delight (Features 62–66)
- [x] Feature 62: Web Audio API sound effects (synthesized chimes/clicks, zero audio downloads, muted by default)
- [x] Feature 63: Guided Onboarding Tour for first-time visitors, replayable from Settings
- [x] Feature 64: Konami Code easter egg triggering a celebratory leaf-confetti shower
- [x] Feature 65: Keyboard Shortcuts overlay triggered by pressing "?"
- [x] Feature 66: Accessibility audit, zero external URL verification, offline validation, and comprehensive README update
