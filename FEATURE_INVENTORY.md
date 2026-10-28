# EcoMart — Complete Feature & Architecture Inventory

> **CRITICAL DIRECTIVE (DO NOT VIOLATE):**
> This is a **RESTYLE** task, not a rebuild or a cleanup. You must **NOT** remove, rename, disable, merge, or simplify **ANY** existing feature, page, route, component, data file, API integration, or setting. Every single item documented in this inventory must remain intact, operational, and tested.

---

## 1. Product Catalog & Category Breakdown

The store catalog is driven by [`src/data/products.json`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/data/products.json), containing **64 total products** evenly distributed across **8 distinct categories** (8 products per category: 4 sustainable eco-friendly items and 4 conventional swap-target items for swap simulations).

| # | Category | Total Products | Eco-Friendly Items | Conventional Items (Swap Targets) |
|---|---|:---:|:---:|:---:|
| 1 | **Kitchen** | 8 | 4 | 4 |
| 2 | **Personal Care** | 8 | 4 | 4 |
| 3 | **Fashion** | 8 | 4 | 4 |
| 4 | **Stationery** | 8 | 4 | 4 |
| 5 | **Home** | 8 | 4 | 4 |
| 6 | **Bags** | 8 | 4 | 4 |
| 7 | **Outdoor & Travel** | 8 | 4 | 4 |
| 8 | **Cleaning & Laundry** | 8 | 4 | 4 |
| **Total** | **8 Categories** | **64 Products** | **32 Eco Items** | **32 Conventional Items** |

---

## 2. Complete Routes & Pages Inventory

The application uses `HashRouter` with code-split lazy loading across **31 route page components** in [`src/pages/`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages):

| # | Path / Route | Page Component | Description & Key Features |
|---|---|---|---|
| 1 | `/` | [`HomePage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/HomePage.jsx) | Engineering hero, 3D Leafy Globe, Kinetic type marquee, Guardrails board, Sticky stacked cards, Ethics inbox preview, Responsible AI Labs showcase, Signature showcase, Pinned product journey, Editorial final CTA. |
| 2 | `/shop` | [`ShopPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/ShopPage.jsx) | Full catalog shopping grid, category filters, multi-criteria filter drawer, intent search, active chips, budget sliders, eco-grade filters, certifications filter, household profile selector, gift finder modal, occasion kits modal, tradeoff explorer. |
| 3 | `/product/:id` | [`ProductPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/ProductPage.jsx) | Deep-dive product specification, 3D interactive viewer, 5-pillar EcoScore breakdown, lifecycle scrubber, carbon benchmark diff vs category, repair guide, second-life tab, related news, sustainable alternatives. |
| 4 | `/cart` / Drawer | [`CartDrawer.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/CartDrawer.jsx) | Slide-out cart drawer, quantity selectors, 1-tap "Swap My Cart" cleaner product replacement, plastic-free packaging toggle, coupon code discount input, carbon neutral offset option, live ISO 14040 impact savings tally. |
| 5 | `/wishlist` | [`WishlistPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/WishlistPage.jsx) | Saved favorite products, move-to-cart, export wishlist, price & score comparison. |
| 6 | `/orders` | [`OrdersPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/OrdersPage.jsx) | Real-time and persistent order history, status tracking (Confirmed, Dispatched, Delivered), verified carbon savings receipts, download PNG impact receipt. |
| 7 | `/profile` | [`ProfilePage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/ProfilePage.jsx) | User identity profile, avatar selector modal, user tier status (Conscious Seedling to Forest Guardian), eco-points tally, lifetime impact metrics, environmental milestones & badges grid, PNG shareable impact card export. |
| 8 | `/tools` | [`ToolsPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/ToolsPage.jsx) | Interactive Sustainable Studio tabs: Budget Basket Builder, Class Impact Garden, Eco Quiz, Carbon Calculator, Artisan Eco Map, Daily Challenge, Eco Goals, Savings vs Impact, Recycling Guide, Seasonal Produce, Eco Glossary, Water & Energy Estimator, Virtual Tree Garden. |
| 9 | `/transform` | [`TransformPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/TransformPage.jsx) | Smart Cart Transformer powered by local multi-choice knapsack optimization: paste freeform grocery list, voice-dictate, budget ceiling constraint, carbon minimization, step-by-step reasoning thinking trace. |
| 10 | `/eco-check` | [`EcoCheckPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/EcoCheckPage.jsx) | External product text heuristic parser: paste descriptions/ingredients from Amazon or any site to calculate instantaneous 0-100 EcoScore and find greener catalog substitutes. |
| 11 | `/impact` | [`ImpactPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/ImpactPage.jsx) | Planetary accounting command center (ISO 14040): Category carbon drill-down bar chart, habit trajectory line chart, trust score histogram, What-If Cart Simulator, live cart ledger, personal carbon budget widget, tangible equivalents translator, streaks goal widget, weekly review modal, purpose report modal. |
| 12 | `/community` | [`CommunityPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/CommunityPage.jsx) | Community pledge wall with interactive commitments, live regional eco-leaderboard, community activity feed, newsletter subscription, shareable impact cards. |
| 13 | `/truth-lab` | [`TruthLabPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/TruthLabPage.jsx) | Hub for Responsible AI labs: Greenwashing Detective, Courtroom, Dilemmas, Self-Audit, Black Box, Fairness, and Duel. |
| 14 | `/courtroom` | [`CourtroomPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/CourtroomPage.jsx) | Interactive mock courtroom trial auditing corporate greenwashing claims with prosecution, defense, witness testimonies, evidence exhibits, and judicial verdicts. |
| 15 | `/dilemmas` | [`DilemmasPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/DilemmasPage.jsx) | Moral Machine ethical decision simulator: complex environmental trade-offs (e.g. glass vs plastic, carbon vs water vs local livelihoods), multi-agent debate, user voting. |
| 16 | `/self-audit` | [`AISelfAuditPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/AISelfAuditPage.jsx) | Autonomous AI self-audit dashboard: automated test suites measuring recommendation bias, hallucinations, score calibration, and guideline compliance. |
| 17 | `/blackbox` | [`BlackBoxPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/BlackBoxPage.jsx) | Complete transparent audit ledger of all internal AI reasoning steps, confidence brakes, decision factors, and model prompts. |
| 18 | `/fairness` | [`FairnessPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/FairnessPage.jsx) | Algorithmic fairness sandbox testing recommendation equity across diverse demographic, geographic, and budget persona archetypes. |
| 19 | `/duel` | [`DuelPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/DuelPage.jsx) | Head-to-head Life Cycle Assessment (LCA) comparison arena between any two products across emissions, water, durability, and end-of-life. |
| 20 | `/scan` / `/scanner` | [`LabelScannerPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/LabelScannerPage.jsx) | Live camera OCR and photo upload scanner powered by Gemini Vision to audit physical product labels, detect deceptive marketing claims, and find green swaps. |
| 21 | `/passport/:id` | [`TrustPassportPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/TrustPassportPage.jsx) | Digital Product Passport (DPP) with cryptographic verification hashes, raw supply-chain journey, QR code modal, and raw proof receipts. |
| 22 | `/counterfactual` | [`CounterfactualPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/CounterfactualPage.jsx) | "What-If" lifecycle parameter slider allowing users to adjust transport distance, packaging types, and renewable energy grids to observe score sensitivity. |
| 23 | `/kirana` | [`KiranaPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/KiranaPage.jsx) | Voice-first bilingual Hindi/English local Kirana grocery store interface with quick voice chips, instant audio search, and transliteration matching. |
| 24 | `/how-it-works` | [`HowItWorksPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/HowItWorksPage.jsx) | Step-by-step visual explanation of the 5-pillar EcoScore calculation formula, lifecycle evaluation, and sustainable commerce mission. |
| 25 | `/learn` | [`LearnPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/LearnPage.jsx) | Sustainability academy with interactive T-Shirt lifecycle journey story, MythBuster cards debunking common green myths, and certification standards. |
| 26 | `/news` | [`NewsPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/NewsPage.jsx) | Live curated environmental and greenwashing regulatory news feed with category tags, source verification, and related product links. |
| 27 | `/transparency` | [`AgentTransparencyPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/AgentTransparencyPage.jsx) | Full architectural transparency documentation disclosing multi-agent orchestration, guardrails, fallback cascades, and model configurations. |
| 28 | `/settings` | [`SettingsPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/SettingsPage.jsx) | System preferences: theme mode, reduced motion & visual effects, sound FX toggle, AI Agent strictness slider, copilot mute, offline cache manager, clear browsing data. |
| 29 | `/login` | [`LoginPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/LoginPage.jsx) | Full page login supporting Google OAuth (Firebase), Local Encrypted SHA-256 Auth, and 1-click Guest login. |
| 30 | `/signup` | [`SignupPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/SignupPage.jsx) | Full page registration with password salting, client-side encryption, and welcome bonus eco-points. |
| 31 | `*` | [`NotFoundPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/NotFoundPage.jsx) | 404 error page with eco-friendly suggested destinations and home redirect. |

---

## 3. Complete Component Inventory (169 Files)

### 3.1 Root Components (`src/components/` — 33 files)
1. [`AchievementUnlockedModal.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/AchievementUnlockedModal.jsx) — Pop-up modal celebrating milestone achievements and awarded eco-points.
2. [`AnimatedCounter.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/AnimatedCounter.jsx) — Smooth numerical easing counter for dynamic metrics and scores.
3. [`ArchitectureDiagram.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/ArchitectureDiagram.jsx) — Interactive visual diagram of the multi-agent system architecture.
4. [`AuthModal.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/AuthModal.jsx) — Modal overlay for sign in / sign up / Google login / guest session.
5. [`BarcodeScannerModal.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/BarcodeScannerModal.jsx) — Camera barcode scanning interface for instantaneous product lookup.
6. [`CartDrawer.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/CartDrawer.jsx) — Global slide-out shopping cart with item controls, coupon code, and Swap My Cart.
7. [`CheckoutModal.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/CheckoutModal.jsx) — Multi-step checkout flow (address, payment method, carbon neutral shipping option).
8. [`CommandPalette.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/CommandPalette.jsx) — Global `Ctrl+K` / `Cmd+K` keyboard shortcut search and command palette.
9. [`ConfirmationModal.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/ConfirmationModal.jsx) — Post-order receipt modal with environmental savings breakdown.
10. [`CursorGlow.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/CursorGlow.jsx) — Ambient cursor spotlight follower (respects reduced effects setting).
11. [`EasterEggKonami.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/EasterEggKonami.jsx) — Retro gaming Konami code detector unlocking a secret achievement badge.
12. [`EcoScoreBadge.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/EcoScoreBadge.jsx) — Interactive colored badge showing 0-100 score and letter grade (A through E).
13. [`EcoScorePopover.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/EcoScorePopover.jsx) — Hover/click popover breaking down the 5 pillars of any product's score.
14. [`ErrorBoundary.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/ErrorBoundary.jsx) — React top-level error boundary with graceful fallback screen.
15. [`ExitIntentModal.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/ExitIntentModal.jsx) — Mouseout exit intent detector offering a green coupon discount.
16. [`Footer.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/Footer.jsx) — Comprehensive multi-column footer with links, disclaimers, and newsletter.
17. [`ImpactDashboard.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/ImpactDashboard.jsx) — Core impact metrics visualizer: CO₂ avoided, plastic saved, water conserved.
18. [`KeyboardShortcutsModal.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/KeyboardShortcutsModal.jsx) — `?` key help overlay listing all keyboard shortcuts.
19. [`LeafParticles.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/LeafParticles.jsx) — Ambient floating organic leaf particles (disabled when reduced effects is on).
20. [`MobileBottomTabs.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/MobileBottomTabs.jsx) — Fixed mobile navigation bar (Home, Shop, Tools, Cart, Profile).
21. [`Navbar.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/Navbar.jsx) — Main header navigation with logo, search, links, theme toggle, and cart counter.
22. [`OfflineDetector.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/OfflineDetector.jsx) — Real-time banner notifying user when internet connection drops.
23. [`ProductCard.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/ProductCard.jsx) — Catalog product card with image, badges, EcoScore, price, wishlist, compare, quick-view, and add-to-cart.
24. [`ProductCompareModal.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/ProductCompareModal.jsx) — Side-by-side comparison modal for up to 3 selected products.
25. [`ProductDetailModal.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/ProductDetailModal.jsx) — Quick-view modal showing full specifications, materials, and certificates.
26. [`ProductGallery.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/ProductGallery.jsx) — Interactive multi-angle image gallery with 3D viewer toggle.
27. [`ProductImage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/ProductImage.jsx) — Resilient product image loader with blur placeholder and error fallbacks.
28. [`RecentlyViewedStrip.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/RecentlyViewedStrip.jsx) — Horizontal carousel strip showing recently browsed items.
29. [`ScrollToTop.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/ScrollToTop.jsx) — Router scroll restoration utility.
30. [`SwapMyCartModal.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/SwapMyCartModal.jsx) — Modal detailing all conventional cart items and proposed green replacements.
31. [`ThemeToggle.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/ThemeToggle.jsx) — Accessible toggle button switching between Light and Dark themes.
32. [`UserMenu.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/UserMenu.jsx) — Header profile dropdown with user tier, eco-points, and account links.
33. [`WelcomeModal.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/WelcomeModal.jsx) — First-time visitor onboarding tour introducing the store's mission.

### 3.2 3D Graphics Components (`src/components/3D/` — 4 files)
1. [`EcoForest3D.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/3D/EcoForest3D.jsx) — Three.js interactive 3D virtual forest where tree growth reflects user's CO₂ savings.
2. [`LeafyGlobe3D.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/3D/LeafyGlobe3D.jsx) — Three.js interactive planetary globe with orbiting green particles on Home Hero.
3. [`Product3DViewer.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/3D/Product3DViewer.jsx) — OrbitControls 3D product inspection viewer for sustainable packaging.
4. [`Safe3D.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/3D/Safe3D.jsx) — WebGL capability detector and safe fallback boundary for older browsers.

### 3.3 Accessibility (`src/components/accessibility/` — 1 file)
1. [`AccessibilityCenterModal.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/accessibility/AccessibilityCenterModal.jsx) — Modal controlling high contrast, OpenDyslexic font, animation speed, and text size.

### 3.4 Agent (`src/components/agent/` — 1 file)
1. [`AgentReportCard.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/agent/AgentReportCard.jsx) — Evaluation scorecard reporting AI agent accuracy, adherence to guardrails, and audit scores.

### 3.5 Community (`src/components/community/` — 5 files)
1. [`CommunityFeed.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/community/CommunityFeed.jsx) — Real-time stream of sustainable actions and swaps taken by shoppers.
2. [`EcoLeaderboard.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/community/EcoLeaderboard.jsx) — Gamified community leaderboard showing top eco-point earners.
3. [`NewsletterSignup.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/community/NewsletterSignup.jsx) — Email subscription input with validation and zero-spam assurance.
4. [`PledgeWall.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/community/PledgeWall.jsx) — Interactive community pledge wall allowing users to commit to green habits.
5. [`ShareableImpactCard.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/community/ShareableImpactCard.jsx) — Visually styled impact certificate exportable to PNG image.

### 3.6 Decision Engine (`src/components/decision/` — 5 files)
1. [`AIEthicsCard.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/decision/AIEthicsCard.jsx) — Explanatory card showing ethical considerations in product ranking.
2. [`CounterfactualSlider.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/decision/CounterfactualSlider.jsx) — Interactive slider exploring "what-if" impact score adjustments.
3. [`EthicsInboxModal.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/decision/EthicsInboxModal.jsx) — Human-in-the-loop review inbox for flagged product claims.
4. [`PrioritiesPanel.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/decision/PrioritiesPanel.jsx) — Weight tuning sliders (Price vs Carbon vs Circularity vs Toxicity).
5. [`WhyRankPopover.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/decision/WhyRankPopover.jsx) — Popover explaining exact mathematical reasons behind an item's search rank.

### 3.7 Detective & Anti-Greenwashing (`src/components/detective/` — 8 files)
1. [`BrandTransparencyCard.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/detective/BrandTransparencyCard.jsx) — Scorecard rating brand transparency and disclosure metrics.
2. [`CertificationDecoderModal.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/detective/CertificationDecoderModal.jsx) — Educational decoder explaining FSC, GOTS, Fair Trade, etc.
3. [`ClaimDiffModal.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/detective/ClaimDiffModal.jsx) — Side-by-side diff between marketing claim and verified LCA reality.
4. [`ClaimEvidenceGraph.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/detective/ClaimEvidenceGraph.jsx) — Visual node graph linking claims to empirical evidence sources.
5. [`ClaimRadarChart.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/detective/ClaimRadarChart.jsx) — SVG radar chart plotting 5 dimensions of environmental truthfulness.
6. [`GreenwashingDetectiveModal.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/detective/GreenwashingDetectiveModal.jsx) — Flagship audit tool analyzing product text for 50+ banned buzzwords.
7. [`GreenwashLexiconHighlighter.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/detective/GreenwashLexiconHighlighter.jsx) — Text highlighter marking deceptive phrases with tooltip explanations.
8. [`ReportClaimModal.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/detective/ReportClaimModal.jsx) — User submission modal to flag suspicious greenwashing for audit.

### 3.8 EcoAgent Chat (`src/components/EcoAgent/` — 7 files)
1. [`AgentMemoryDrawer.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/EcoAgent/AgentMemoryDrawer.jsx) — Slide-out showing active conversational memory and detected preferences.
2. [`AIEnergyMeter.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/EcoAgent/AIEnergyMeter.jsx) — Real-time computation energy counter estimating watt-hours per AI query.
3. [`EcoAgentChat.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/EcoAgent/EcoAgentChat.jsx) — Floating chat interface with dual online/offline intelligence, audio input, and suggestions.
4. [`HonestyMeter.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/EcoAgent/HonestyMeter.jsx) — Gauge scoring AI response factual reliability and uncertainty bounds.
5. [`ReasoningExplanationCard.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/EcoAgent/ReasoningExplanationCard.jsx) — Expandable card breaking down why a recommendation was made.
6. [`SwapSuggestionBanner.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/EcoAgent/SwapSuggestionBanner.jsx) — Proactive top banner notifying shoppers of greener alternative items.
7. [`VoiceShoppingModal.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/EcoAgent/VoiceShoppingModal.jsx) — Voice interaction modal with speech-to-text audio visualizer.

### 3.9 Feedback (`src/components/feedback/` — 1 file)
1. [`FeedbackInboxModal.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/feedback/FeedbackInboxModal.jsx) — In-app feedback collector and issue reporting modal.

### 3.10 Home Page Sections (`src/components/home/` — 22 files)
1. [`AgentPipelinePanel.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/home/AgentPipelinePanel.jsx) — Visual flow of the multi-agent decision pipeline.
2. [`AppWindowShowcase.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/home/AppWindowShowcase.jsx) — Styled browser window frame demonstrating the EcoMart interface.
3. [`CheckMarquee.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/home/CheckMarquee.jsx) — Infinite scrolling banner of audited certifications and standards.
4. [`ContourCanvas.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/home/ContourCanvas.jsx) — Canvas rendering organic topographic contour lines.
5. [`EcoJourneyScene.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/home/EcoJourneyScene.jsx) — Step-by-step visual scene of sustainable product transformation.
6. [`EditorialFinalCTA.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/home/EditorialFinalCTA.jsx) — Editorial closing call to action inviting visitors to shop responsibly.
7. [`EngineeringHero.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/home/EngineeringHero.jsx) — Flagship hero section with 3D Leafy Globe, headline, and metric counters.
8. [`EthicsInboxPreview.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/home/EthicsInboxPreview.jsx) — Live preview of human oversight actions.
9. [`GreenwashingStrikethrough.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/home/GreenwashingStrikethrough.jsx) — Interactive text strikethrough revealing reality behind buzzwords.
10. [`GuardrailsBoard.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/home/GuardrailsBoard.jsx) — Interactive board explaining safety rules and confidence thresholds.
11. [`HonestFeedbackSection.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/home/HonestFeedbackSection.jsx) — Testimonials and verified community ratings.
12. [`HorizontalFeatureGallery.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/home/HorizontalFeatureGallery.jsx) — Horizontal scrolling gallery of standout features.
13. [`ImpactTiers.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/home/ImpactTiers.jsx) — Visual guide to the 4 conscious consumer tiers.
14. [`InsightsDashboard.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/home/InsightsDashboard.jsx) — Live planetary metric dashboard.
15. [`KineticTypeStrips.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/home/KineticTypeStrips.jsx) — Diagonal kinetic typography animation ribbons.
16. [`NumberedFeatureCards.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/home/NumberedFeatureCards.jsx) — Grid of numbered feature highlights.
17. [`PinnedProductJourney.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/home/PinnedProductJourney.jsx) — Scroll-driven pinned journey tracking raw material to doorstep.
18. [`ResponsibleAILabsShowcase.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/home/ResponsibleAILabsShowcase.jsx) — Cards linking directly to Courtroom, Dilemmas, Self-Audit, and Duel.
19. [`ScrollProgressBar.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/home/ScrollProgressBar.jsx) — Minimal top progress bar indicating scroll depth.
20. [`SignatureShowcase.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/home/SignatureShowcase.jsx) — Curated showcase of flagship zero-waste products.
21. [`StickyStackedCards.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/home/StickyStackedCards.jsx) — Scroll-stacked cards explaining the 5 pillars.
22. [`WordByWordMission.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/home/WordByWordMission.jsx) — Scroll-linked typography reveal highlighting the mission statement.

### 3.11 Impact Analytics (`src/components/impact/` — 11 files)
1. [`CategoryCarbonBarChart.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/impact/CategoryCarbonBarChart.jsx) — Drill-down bar chart comparing category carbon totals.
2. [`EquivalentsTranslatorCard.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/impact/EquivalentsTranslatorCard.jsx) — Plain-language human impact equivalents (bottles avoided, km driven).
3. [`HabitLineChart.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/impact/HabitLineChart.jsx) — Time-series line chart tracking shopping eco-score progress over time.
4. [`ImpactReceiptModal.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/impact/ImpactReceiptModal.jsx) — Downloadable carbon & plastic receipt modal.
5. [`PersonalCarbonBudgetWidget.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/impact/PersonalCarbonBudgetWidget.jsx) — Monthly personal carbon allowance vs spent emissions.
6. [`PurposeReportModal.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/impact/PurposeReportModal.jsx) — Detailed annual sustainability and planetary purpose audit report.
7. [`StreaksGoalWidget.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/impact/StreaksGoalWidget.jsx) — Habit streaks and weekly goal completion rings.
8. [`TrustScoreHistogram.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/impact/TrustScoreHistogram.jsx) — Distribution histogram of catalog trust scores.
9. [`WeeklyEcoReviewModal.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/impact/WeeklyEcoReviewModal.jsx) — Weekly summary review modal recapping impact savings.
10. [`WhatIfCartSimulator.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/impact/WhatIfCartSimulator.jsx) — Interactive simulator calculating planetary gains if all items swapped.
11. [`YearAheadProjection.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/impact/YearAheadProjection.jsx) — 12-month forward projection of emissions saved if current habits continue.

### 3.12 Learning & Education (`src/components/learn/` — 2 files)
1. [`MythBusterCards.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/learn/MythBusterCards.jsx) — Interactive flip cards debunking environmental misconceptions.
2. [`TShirtStoryMode.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/learn/TShirtStoryMode.jsx) — Interactive lifecycle journey of a cotton t-shirt from seed to landfill.

### 3.13 Lifecycle & Circular Economy (`src/components/lifecycle/` — 9 files)
1. [`ChoiceRippleFlow.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/lifecycle/ChoiceRippleFlow.jsx) — Cascading visualization of compounding downstream lifecycle benefits.
2. [`CostPerUseCalculator.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/lifecycle/CostPerUseCalculator.jsx) — Calculator proving sustainable goods cost less per use over lifetime.
3. [`LifecycleTimelineScrubber.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/lifecycle/LifecycleTimelineScrubber.jsx) — Interactive timeline scrubber traversing extraction, manufacture, use, and end-of-life.
4. [`ProductLifecycleTimeline.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/lifecycle/ProductLifecycleTimeline.jsx) — Visual timeline tracking item lifecycle stages.
5. [`ProductTimeMachine.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/lifecycle/ProductTimeMachine.jsx) — 10-year durability forecast comparing degradation vs conventional plastics.
6. [`RepairGuidesModal.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/lifecycle/RepairGuidesModal.jsx) — Step-by-step DIY repair and maintenance manual for products.
7. [`SecondLifeBoardModal.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/lifecycle/SecondLifeBoardModal.jsx) — Community marketplace board to trade, repair, or upcycle used items.
8. [`SecondLifeTab.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/lifecycle/SecondLifeTab.jsx) — Product page tab providing composting, recycling, and trade-in paths.
9. [`SensitivitySliders.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/lifecycle/SensitivitySliders.jsx) — Sliders dynamically adjusting transport and energy variables in LCA calculations.

### 3.14 News (`src/components/news/` — 1 file)
1. [`RelatedNewsPanel.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/news/RelatedNewsPanel.jsx) — Contextual news feed displaying regulatory updates matching product material.

### 3.15 Notifications (`src/components/notifications/` — 1 file)
1. [`NotificationCenterModal.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/notifications/NotificationCenterModal.jsx) — In-app notification center for restock alerts, milestone badges, and swaps.

### 3.16 Offline (`src/components/offline/` — 1 file)
1. [`OfflineManagerModal.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/offline/OfflineManagerModal.jsx) — Service worker cache controller managing pre-cached catalog data for offline use.

### 3.17 Privacy (`src/components/privacy/` — 1 file)
1. [`PrivacyCenterModal.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/privacy/PrivacyCenterModal.jsx) — Privacy management center with local data wipe and zero-third-party tracking pledge.

### 3.18 Product Specialized (`src/components/product/` — 2 files)
1. [`ProductPassportQRModal.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/product/ProductPassportQRModal.jsx) — Modal displaying scannable QR code linking to verified Digital Product Passport.
2. [`ProductScaleVisualModal.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/product/ProductScaleVisualModal.jsx) — Interactive visual scale comparison against everyday objects (phone, bottle).

### 3.19 Recommendations (`src/components/recommendations/` — 1 file)
1. [`ForYouRow.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/recommendations/ForYouRow.jsx) — Personalized recommendation strip based on user's active priorities and history.

### 3.20 Shop Specialized (`src/components/shop/` — 9 files)
1. [`GiftFinderModal.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/shop/GiftFinderModal.jsx) — Wizard matching eco-gifts based on recipient, occasion, and budget.
2. [`HouseholdProfileSelector.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/shop/HouseholdProfileSelector.jsx) — Profile switcher adapting recommendations (Single, Couple, Family with Kids).
3. [`IntentSearchInput.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/shop/IntentSearchInput.jsx) — Natural language intent search bar with suggestion chips.
4. [`OccasionKitsModal.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/shop/OccasionKitsModal.jsx) — Curated starter kits for specific life occasions (Zero-Waste Kitchen, College Starter).
5. [`ShopActiveChips.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/shop/ShopActiveChips.jsx) — Removable filter chips reflecting active catalog search constraints.
6. [`ShopEmptyState.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/shop/ShopEmptyState.jsx) — Friendly empty state offering filter resets and suggested search queries.
7. [`ShopFilterBar.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/shop/ShopFilterBar.jsx) — Top filter bar with sorting, department tabs, and quick-filter pills.
8. [`ShopFilterDrawer.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/shop/ShopFilterDrawer.jsx) — Mobile slide-out drawer containing full faceted filter controls.
9. [`TradeoffExplorerModal.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/shop/TradeoffExplorerModal.jsx) — Interactive trade-off explorer comparing Price vs Carbon savings.

### 3.21 Tools, Guides & Gardens (`src/components/tools/` — 17 files)
1. [`BudgetBasketBuilder.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/tools/BudgetBasketBuilder.jsx) — Knapsack budget tool generating the highest-impact basket within a strict rupee limit.
2. [`CarbonFootprintCalculator.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/tools/CarbonFootprintCalculator.jsx) — Comprehensive multi-step household carbon footprint assessment calculator.
3. [`CityRecyclingGuideModal.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/tools/CityRecyclingGuideModal.jsx) — City-specific municipal waste segregation guidelines (Delhi, Mumbai, Bengaluru, etc.).
4. [`ClassImpactGarden.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/tools/ClassImpactGarden.jsx) — Collaborative virtual garden designed for school classes and study groups.
5. [`DailyEcoChallenge.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/tools/DailyEcoChallenge.jsx) — Rotating daily micro-challenges awarding eco-points upon completion.
6. [`EcoGlossary.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/tools/EcoGlossary.jsx) — Searchable A-Z dictionary of sustainability standards, certifications, and terms.
7. [`EcoGoalsTracker.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/tools/EcoGoalsTracker.jsx) — Goal-setting tracker for monthly plastic diversion and zero-waste milestones.
8. [`EcoMap.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/tools/EcoMap.jsx) — Interactive regional map showing local craft clusters and artisan distances.
9. [`EcoQuiz.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/tools/EcoQuiz.jsx) — Interactive 5-question sustainability trivia quiz testing green literacy.
10. [`ImpactPulseWidget.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/tools/ImpactPulseWidget.jsx) — Fixed floating pill widget displaying live cart impact savings.
11. [`PlantATreeGarden.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/tools/PlantATreeGarden.jsx) — 3D virtual tree garden that matures as users accumulate verified carbon savings.
12. [`RecyclingGuide.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/tools/RecyclingGuide.jsx) — Material-by-material segregation, washing, and drop-off instructions.
13. [`SavingsImpactCalculator.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/tools/SavingsImpactCalculator.jsx) — Financial vs ecological ROI calculator for reusables vs single-use items.
14. [`SeasonalGuide.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/tools/SeasonalGuide.jsx) — Indian regional seasonal produce calendar advising on lowest-mile crops.
15. [`ShoppersChecklistModal.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/tools/ShoppersChecklistModal.jsx) — Interactive shopping checklist for zero-waste grocery trips.
16. [`StarterKits.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/tools/StarterKits.jsx) — Curated beginner bundles for zero-waste lifestyle transitions.
17. [`WaterEnergyEstimator.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/tools/WaterEnergyEstimator.jsx) — Water and energy consumption estimator comparing lifestyle choices.

### 3.22 Cart Transformer (`src/components/transformer/` — 6 files)
1. [`TransformerActions.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/transformer/TransformerActions.jsx) — Action buttons to add transformed cart to live cart or copy breakdown.
2. [`TransformerComparison.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/transformer/TransformerComparison.jsx) — Side-by-side comparison table showing original items vs green swaps.
3. [`TransformerInputCard.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/transformer/TransformerInputCard.jsx) — Freeform text input card with sample shopping list presets.
4. [`TransformerSummaryBar.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/transformer/TransformerSummaryBar.jsx) — Summary bar totaling budget, CO₂ saved, and plastic avoided.
5. [`TransformerThinking.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/transformer/TransformerThinking.jsx) — Visual animated thinking trace of knapsack optimization steps.
6. [`VoiceInputButton.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/transformer/VoiceInputButton.jsx) — Voice microphone button with Web Speech API and Gemini audio transcription fallback.

### 3.23 UI Design System (`src/components/ui/` — 21 files)
1. [`Accordion.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/ui/Accordion.jsx) — Accessible collapsible accordion items.
2. [`Badge.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/ui/Badge.jsx) — Status pill badge supporting primary, neutral, warning, danger, and success variants.
3. [`Button.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/ui/Button.jsx) — Core button component with loading states, sizes, and icon slots.
4. [`Card.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/ui/Card.jsx) — Surface card container with flat, raised, or sunken variants.
5. [`Checkbox.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/ui/Checkbox.jsx) — Accessible styled checkbox with custom SVG checkmark.
6. [`Chip.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/ui/Chip.jsx) — Interactive selection chip / tag with optional remove button.
7. [`EmptyState.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/ui/EmptyState.jsx) — Generic empty state illustration with title, subtitle, and action button.
8. [`GlossaryTooltip.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/ui/GlossaryTooltip.jsx) — Hover tooltip displaying instant definitions for certified eco terms.
9. [`Input.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/ui/Input.jsx) — Form text input with label, helper text, and error states.
10. [`Modal.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/ui/Modal.jsx) — Accessible modal dialog backdrop with focus trap and escape key handler.
11. [`ProgressBar.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/ui/ProgressBar.jsx) — Linear progress bar with customizable colors and animated transitions.
12. [`ProgressRing.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/ui/ProgressRing.jsx) — Circular SVG progress ring displaying percentages.
13. [`Radio.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/ui/Radio.jsx) — Accessible styled radio button group control.
14. [`SegmentedControl.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/ui/SegmentedControl.jsx) — Segmented button tab group with active sliding indicator.
15. [`Select.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/ui/Select.jsx) — Custom styled select dropdown menu.
16. [`Skeleton.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/ui/Skeleton.jsx) — Animated loading skeleton placeholders for asynchronous data.
17. [`Slider.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/ui/Slider.jsx) — Accessible range slider with min, max, step, and value display.
18. [`Switch.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/ui/Switch.jsx) — Accessible toggle switch component.
19. [`Tabs.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/ui/Tabs.jsx) — Tabbed navigation container with keyboard navigation.
20. [`Toast.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/ui/Toast.jsx) — Accessible toast notification system capped at 3 simultaneous alerts.
21. [`Tooltip.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/ui/Tooltip.jsx) — Generic hovering tooltip component.

---

## 4. Context Providers & State Systems

1. [`AuthContext.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/context/AuthContext.jsx):
   - **Google OAuth Login**: Powered by Firebase Auth (`loginWithFirebaseGoogle`).
   - **Local Encrypted Auth**: Client-side PBKDF2/SHA-256 password salting and hashing via WebCrypto API.
   - **Local-First Guest Session**: Instant 1-click guest login requiring zero network requests.
   - **4-Tier Conscious Consumer Gamification**:
     - *Level 1*: Conscious Seedling (0–499 pts)
     - *Level 2*: Thriving Sapling (500–1,499 pts)
     - *Level 3*: Ancient Tree (1,500–3,499 pts)
     - *Level 4*: Forest Guardian (3,500+ pts)
   - **Avatar Management**: Local avatar picker supporting emoji and custom badges.

2. [`CartContext.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/context/CartContext.jsx):
   - **Cart Items & Quantities**: LocalStorage persistence, item addition, increment, decrement, and removal.
   - **Wishlist & Compare**: Wishlist array and max-3 product compare list.
   - **Recently Viewed & Reviews**: Tracking browsing history and user product reviews.
   - **Order History & Receipts**: Order creation with ISO 14040 impact receipts.
   - **User Decision Engine Priorities**: 4 weight parameters (Price, Carbon, Circularity, Low-Tox) and presets (`balanced`, `carbon_first`, `budget_first`, `circular_purist`, `custom`).
   - **Proactive Swapping & Copilot**: Automatic swap alert detection, copilot nudges, green confetti triggers.
   - **AI Agent Mode**: Seamless toggle between `online` (Cloud Gemini 2.5) and `offline` (Local-First heuristics).
   - **Toast Notifications Queue**: Auto-dismissing toast notifications with action buttons.

3. [`ThemeContext.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/context/ThemeContext.jsx):
   - **Light / Dark Mode**: Reactive theme switching applying `dark` class and root CSS variables.
   - **Reduce Effects**: Disables leaf particles, cursor glow, and heavy animations.
   - **High Contrast & Dyslexic Font**: Accessibility toggles for WCAG AAA conformance.

4. [`I18nContext.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/context/I18nContext.jsx):
   - **Bilingual English & Hindi**: Complete translation dictionaries ([`src/i18n/en.js`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/i18n/en.js), [`src/i18n/hi.js`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/i18n/hi.js)).

---

## 5. Engines, AI Models & Backend Services

### 5.1 Business Logic Engines (`src/lib/`)
- [`ecoScore.js`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/lib/ecoScore.js): 5-pillar mathematical engine (Materials 30%, Packaging 20%, Carbon 25%, Certifications 15%, Local Transport 10%).
- [`impactCalculator.js`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/lib/impactCalculator.js): ISO 14040 planetary impact calculation (CO₂, plastic, water, human equivalents).
- [`cartTransformer.js`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/lib/cartTransformer.js): Multi-choice 0/1 knapsack optimizer for budget and carbon bounds.
- [`decisionEngine.js`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/lib/decisionEngine.js): Multi-criteria utility ranking based on personalized user weights.
- [`duelEngine.js`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/lib/duelEngine.js): Comparative Life Cycle Assessment (LCA) engine for product duels.
- [`ecoCheck.js`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/lib/ecoCheck.js): Heuristic scanner scoring unstructured external product descriptions.
- [`circularityEngine.js`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/lib/circularityEngine.js): Circular economy evaluation, repairability indices, and end-of-life paths.
- [`lifecycleEngine.js`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/lib/lifecycleEngine.js): Stage-by-stage emission breakdown from raw extraction to disposal.
- [`multiAgentEngine.js`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/lib/multiAgentEngine.js): Multi-agent orchestrator assigning roles (Decomposition, Verification, Risk, Synthesis).
- [`copilotEngine.js`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/lib/copilotEngine.js): Context-aware shopping copilot offering opportunistic micro-nudges.
- [`transcribeClient.js`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/lib/transcribeClient.js): Dual speech engine supporting native Web Speech API and Gemini AI audio transcription for Opera/Safari.
- [`transparencyEngine.js`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/lib/transparencyEngine.js): Digital Product Passport verification and hash generation.
- [`personaEngine.js`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/lib/personaEngine.js): Demographic and lifestyle persona profiles for fairness benchmarking.
- [`preferenceModel.js`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/lib/preferenceModel.js): Implicit preference learning tracking accepted/declined swaps.
- [`newsService.js`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/lib/newsService.js): News fetching and caching service.
- [`confetti.js`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/lib/confetti.js): Green bio-leaf confetti celebration emitter.
- [`audio.js`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/lib/audio.js): Web Audio API sound effects synthesizer (click, success, toggle, alert).

### 5.2 AI & Responsible AI Subsystem (`src/lib/ai/`)
- [`geminiAdapter.js`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/lib/ai/geminiAdapter.js): Dual-mode adapter for Gemini 2.5 Flash API with local rule-based fallback.
- [`guardrailsEngine.js`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/lib/ai/guardrailsEngine.js): Input/output safety filters, prompt injection defense, and FTC/ASCI compliance.
- [`confidenceBrake.js`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/lib/ai/confidenceBrake.js): Halts unverified claims when uncertainty exceeds strict thresholds.
- [`courtroomEngine.js`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/lib/ai/courtroomEngine.js): Mock courtroom legal argument simulator.
- [`dilemmasData.js`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/lib/ai/dilemmasData.js): Dataset of environmental ethical dilemmas and trade-offs.
- [`fairnessEngine.js`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/lib/ai/fairnessEngine.js): Demographic parity and bias scoring engine.
- [`selfAuditEngine.js`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/lib/ai/selfAuditEngine.js): Automated self-diagnostic test battery for AI models.
- [`blackboxStore.js`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/lib/ai/blackboxStore.js): Local append-only log storing every AI decision and prompt.
- [`labelScanner.js`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/lib/ai/labelScanner.js): Gemini Vision OCR prompt generator for ingredient scanning.

### 5.3 Backend Serverless Endpoints (`api/` & `server/`)
- [`api/agent.js`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/api/agent.js): EcoAgent serverless query endpoint.
- [`api/barcode.js`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/api/barcode.js): Barcode lookup endpoint.
- [`api/detect-greenwash.js`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/api/detect-greenwash.js): NLP greenwashing claim analyzer endpoint.
- [`api/health.js`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/api/health.js): Backend health check ping.
- [`api/news.js`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/api/news.js): Live environmental news feed aggregator.
- [`api/scan-label.js`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/api/scan-label.js): Gemini Vision label & ingredients OCR endpoint.
- [`api/transcribe.js`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/api/transcribe.js): Gemini AI voice transcription endpoint for universal browser recording.
- [`server/proxyServer.js`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/server/proxyServer.js): Local development Express proxy server (port 3001) mirroring serverless functions.
- [`server/newsAdapter.js`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/server/newsAdapter.js): News feed parser and normalizer.

---

## 6. Verification Status

- **Automated Vitest Test Suites**: 30 test files, **257 passing tests (100%)**.
- **Verification Script**: [`test_verification.mjs`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/test_verification.mjs) passes with 100% verification across Catalog, EcoScore Engine, Impact Calculator, and NLP Agent.
- **Git Status**: Fully up-to-date with remote [`origin/main`](https://github.com/arnavarya935-maker/ECO-MART.git).

---

## 7. Directives for Upcoming Restyle

1. **NO REMOVALS**: Every route, modal, button, and widget must remain available.
2. **NO SIMPLIFICATIONS**: Do not remove the 5-pillar score calculation, 3D canvases, offline fallback mode, or responsible AI pages.
3. **DESIGN SYSTEM FOCUS**: Restyling should focus on visual polish, typography, layout rhythm, color harmony, and micro-interactions while keeping all underlying mechanics and data flows 100% intact.
