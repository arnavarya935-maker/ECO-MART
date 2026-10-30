# Eco Sense — Complete Feature, Route, Component & Architecture Inventory

> **PROTECTED RULES FOR RESTYLE TASK:**
> 1. Do NOT delete, disable, rename or simplify any existing feature, route, page, component, data record or integration, except items explicitly instructed to remove.
> 2. Work ONE step at a time. After each step: list changed files, test in browser, show result, and wait for "next".
> 3. Never leave a console error or a visible error screen.

---

## 1. Product Categories & Product Counts

The catalog is sourced from [`src/data/products.json`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/data/products.json) and synced live with Supabase with **124 total products** distributed across **8 distinct categories** with a full mix of Eco Grades A through E in every department:

| # | Product Category | Total Products | Eco-Friendly Items | Conventional Items (Swap Targets) | Eco Grades Present |
|---|---|:---:|:---:|:---:|:---:|
| 1 | **Kitchen** | 16 | 9 | 7 | A, B, C, D, E |
| 2 | **Personal Care** | 16 | 9 | 7 | A, B, C, D, E |
| 3 | **Home** | 16 | 9 | 7 | A, B, C, D, E |
| 4 | **Cleaning & Laundry** | 16 | 9 | 7 | A, B, C, D, E |
| 5 | **Fashion** | 15 | 8 | 7 | A, B, C, D, E |
| 6 | **Stationery** | 15 | 8 | 7 | A, B, C, D, E |
| 7 | **Bags** | 15 | 8 | 7 | A, B, C, D, E |
| 8 | **Outdoor & Travel** | 15 | 8 | 7 | A, B, C, D, E |
| **Total** | **8 Categories** | **124 Products** | **68 Items** | **56 Items** | **A to E in All** |

---

## 2. Items Currently Inside the "More" Menu

The "More" dropdown in [`src/components/Navbar.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/Navbar.jsx) contains **14 research labs & deep features**, plus 3 quick toggles in its sub-bar. All 14 must be migrated into the new hamburger drawer in Step 4:

### 2.1 Research Labs & Feature Links (14 Items)
| # | Menu Item Label | Route / Path | Icon | Description |
|---|---|---|---|---|
| 1 | **Truth Lab** | `/truth-lab` | `ShieldCheck` | Compare products and test claims with facts |
| 2 | **AI Courtroom** | `/courtroom` | `Swords` | A fun mock trial testing marketing claims with smart rules |
| 3 | **Moral Dilemmas** | `/dilemmas` | `Scale` | Explore trade-offs between price, carbon, and plastic |
| 4 | **AI Self-Audit** | `/self-audit` | `FileCheck` | See tests for fairness and rules used by our helper |
| 5 | **BlackBox Audit** | `/blackbox` | `ShieldCheck` | See what our helper thought and how it decided |
| 8 | **Label Scanner** | `/scan` | `Camera` | Use your camera to read product packaging |
| 9 | **Kirana Mode** | `/kirana` | `Store` | Quick voice shopping for everyday household staples |
| 11 | **Agent Transparency** | `/transparency` | `ShieldCheck` | How our smart rules and cloud helper work together |
| 12 | **How It Works** | `/how-it-works` | `HelpCircle` | Simple guide to how we score products and impact |
| 13 | **Community** | `/community` | `Bot` | See sample pledges and tips from conscious shoppers |
| 14 | **Tools** | `/tools` | `RefreshCw` | Helpful calculators and starter bundles |

### 2.2 Quick Toggles in "More" Menu Footer Sub-bar
1. **AI Mode Selector**: Switch between Cloud AI and Built-in Rules.
2. **Dark Mode Toggle**: Toggle between Light and Dark visual themes.
3. **Language Toggle**: Toggle between English and Hindi (`en` / `hi`).

---

## 3. Complete Routes & Pages Inventory (31 Routes)

All routes are declared in [`src/App.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/App.jsx) and rendered via `HashRouter` with lazy loading and `Suspense`:

| # | Route Path | Page Component | Key Features & Capabilities |
|---|---|---|---|
| 1 | `/` | [`HomePage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/HomePage.jsx) | Engineering hero, 3D Leafy Globe, Kinetic type marquee, Guardrails board, Sticky stacked cards, Ethics inbox preview, Responsible AI Labs showcase, Signature showcase, Pinned product journey, Editorial final CTA. |
| 2 | `/shop` | [`ShopPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/ShopPage.jsx) | Full catalog shopping grid, category filters, multi-criteria filter drawer, intent search, active chips, budget sliders, eco-grade filters, certifications filter, household profile selector, gift finder modal, occasion kits modal, tradeoff explorer. |
| 3 | `/product/:id` | [`ProductPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/ProductPage.jsx) | Deep-dive product specification, 3D interactive viewer, 5-pillar EcoScore breakdown, lifecycle scrubber, carbon benchmark diff vs category, repair guide, second-life tab, related news, sustainable alternatives. |
| 4 | `/transform` | [`TransformPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/TransformPage.jsx) | Smart Cart Transformer powered by local multi-choice knapsack optimization: paste freeform grocery list, voice-dictate, budget ceiling constraint, carbon minimization, step-by-step reasoning thinking trace. |
| 5 | `/eco-check` | [`EcoCheckPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/EcoCheckPage.jsx) | External product text heuristic parser: paste descriptions/ingredients from Amazon or any site to calculate instantaneous 0-100 EcoScore and find greener catalog substitutes. |
| 6 | `/impact` | [`ImpactPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/ImpactPage.jsx) | Planetary accounting command center (ISO 14040): Category carbon drill-down bar chart, habit trajectory line chart, trust score histogram, What-If Cart Simulator, live cart ledger, personal carbon budget widget, tangible equivalents translator, streaks goal widget, weekly review modal, purpose report modal. |
| 7 | `/learn` | [`LearnPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/LearnPage.jsx) | Sustainability academy with interactive T-Shirt lifecycle journey story, MythBuster cards debunking common green myths, and certification standards. |
| 8 | `/news` | [`NewsPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/NewsPage.jsx) | Live curated environmental and greenwashing regulatory news feed with category tags, source verification, and related product links. |
| 9 | `/settings` | [`SettingsPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/SettingsPage.jsx) | System preferences: theme mode, reduced motion & visual effects, sound FX toggle, AI Agent strictness slider, copilot mute, offline cache manager, clear browsing data. |
| 10 | `/truth-lab` | [`TruthLabPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/TruthLabPage.jsx) | Hub for Responsible AI labs: Greenwashing Detective, Courtroom, Dilemmas, Self-Audit, Black Box, Fairness, and Duel. |
| 11 | `/courtroom` | [`CourtroomPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/CourtroomPage.jsx) | Interactive mock courtroom trial auditing corporate greenwashing claims with prosecution, defense, witness testimonies, evidence exhibits, and judicial verdicts. |
| 12 | `/dilemmas` | [`DilemmasPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/DilemmasPage.jsx) | Moral Machine ethical decision simulator: complex environmental trade-offs (e.g. glass vs plastic, carbon vs water vs local livelihoods), multi-agent debate, user voting. |
| 13 | `/self-audit` | [`AISelfAuditPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/AISelfAuditPage.jsx) | Autonomous AI self-audit dashboard: automated test suites measuring recommendation bias, hallucinations, score calibration, and guideline compliance. |
| 14 | `/blackbox` | [`BlackBoxPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/BlackBoxPage.jsx) | Complete transparent audit ledger of all internal AI reasoning steps, confidence brakes, decision factors, and model prompts. |
| 17 | `/scan` | [`LabelScannerPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/LabelScannerPage.jsx) | Product label health and environmental effects explainer with 4 tabs (Overview, Health, Environment, Full Text), in-code %DV nutrition rules, compound database, and claim audit. |
| 18 | `/scanner` | — | Direct alias route navigating to `/scan`. |
| 19 | `/kirana` | [`KiranaPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/KiranaPage.jsx) | Voice-first bilingual Hindi/English local Kirana grocery store interface with quick voice chips, instant audio search, and transliteration matching. |
| 21 | `/transparency` | [`AgentTransparencyPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/AgentTransparencyPage.jsx) | Full architectural transparency documentation disclosing multi-agent orchestration, guardrails, fallback cascades, and model configurations. |
| 22 | `/how-it-works` | [`HowItWorksPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/HowItWorksPage.jsx) | Step-by-step visual explanation of the 5-pillar EcoScore calculation formula, lifecycle evaluation, and sustainable commerce mission. |
| 23 | `/community` | [`CommunityPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/CommunityPage.jsx) | Community pledge wall with interactive commitments, live regional eco-leaderboard, community activity feed, newsletter subscription, shareable impact cards. |
| 24 | `/tools` | [`ToolsPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/ToolsPage.jsx) | Interactive Sustainable Studio tabs: Budget Basket Builder, Class Impact Garden, Eco Quiz, Carbon Calculator, Artisan Eco Map, Daily Challenge, Eco Goals, Savings vs Impact, Recycling Guide, Seasonal Produce, Eco Glossary, Water & Energy Estimator, Virtual Tree Garden. |
| 25 | `/wishlist` | [`WishlistPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/WishlistPage.jsx) | Saved favorite products, move-to-cart, export wishlist, price & score comparison. |
| 26 | `/orders` | [`OrdersPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/OrdersPage.jsx) | Real-time and persistent order history, status tracking (Confirmed, Dispatched, Delivered), verified carbon savings receipts, download PNG impact receipt. |
| 27 | `/profile` | [`ProfilePage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/ProfilePage.jsx) | User identity profile, avatar selector modal, user tier status (Conscious Seedling to Forest Guardian), eco-points tally, lifetime impact metrics, environmental milestones & badges grid, PNG shareable impact card export. |
| 28 | `/passport/:id` | [`TrustPassportPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/TrustPassportPage.jsx) | Digital Product Passport (DPP) with cryptographic verification hashes, raw supply-chain journey, QR code modal, and raw proof receipts. |
| 29 | `/counterfactual` | [`CounterfactualPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/CounterfactualPage.jsx) | "What-If" lifecycle parameter slider allowing users to adjust transport distance, packaging types, and renewable energy grids to observe score sensitivity. |
| 30 | `/login` | [`LoginPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/LoginPage.jsx) | Full page login supporting Google OAuth (Firebase), Local Encrypted SHA-256 Auth, and 1-click Guest login. |
| 31 | `/signup` | [`SignupPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/SignupPage.jsx) | Full page registration with password salting, client-side encryption, and welcome bonus eco-points. |
| 32 | `*` | [`NotFoundPage.jsx`](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/pages/NotFoundPage.jsx) | 404 error page with eco-friendly suggested destinations and home redirect. |

---

## 4. Complete Component Inventory (170 Files Across 23 Folders)

### 4.1 Root Components (`src/components/` — 32 files)
1. `AchievementUnlockedModal.jsx` — Pop-up modal celebrating milestone achievements and awarded eco-points.
2. `AnimatedCounter.jsx` — Smooth numerical easing counter for dynamic metrics and scores.
3. `ArchitectureDiagram.jsx` — Interactive visual diagram of the multi-agent system architecture.
4. `AuthModal.jsx` — Modal overlay for sign in / sign up / Google login / guest session.
5. `CartDrawer.jsx` — Global slide-out shopping cart with item controls, coupon code, and Swap My Cart.
7. `CheckoutModal.jsx` — Multi-step checkout flow (address, payment method, carbon neutral shipping option).
8. `CommandPalette.jsx` — Global `Ctrl+K` / `Cmd+K` keyboard shortcut search and command palette.
9. `ConfirmationModal.jsx` — Post-order receipt modal with environmental savings breakdown.
10. `CursorGlow.jsx` — Ambient cursor spotlight follower (respects reduced effects setting).
11. `EasterEggKonami.jsx` — Retro gaming Konami code detector unlocking a secret achievement badge.
12. `EcoScoreBadge.jsx` — Interactive colored badge showing 0-100 score and letter grade (A through E).
13. `EcoScorePopover.jsx` — Hover/click popover breaking down the 5 pillars of any product's score.
14. `ErrorBoundary.jsx` — React top-level error boundary with graceful in-place retry and home navigation.
15. `ExitIntentModal.jsx` — Mouseout exit intent detector offering a green coupon discount.
16. `Footer.jsx` — Multi-column footer with links, status, and copyright.
17. `ImpactDashboard.jsx` — Core impact metrics visualizer: CO₂ avoided, plastic saved, water conserved.
18. `KeyboardShortcutsModal.jsx` — `?` key help overlay listing all keyboard shortcuts.
19. `LeafParticles.jsx` — Ambient floating organic leaf particles (disabled when reduced effects is on).
20. `MobileBottomTabs.jsx` — Fixed mobile navigation bar (Home, Shop, Tools, Cart, Profile).
21. `Navbar.jsx` — Main header navigation with logo, search, links, "More" menu, theme toggle, and cart counter.
22. `OfflineDetector.jsx` — Service worker update notification prompt.
23. `ProductCard.jsx` — Catalog product card with image, badges, EcoScore, price, wishlist, compare, quick-view, and add-to-cart.
24. `ProductCompareModal.jsx` — Side-by-side comparison modal for up to 3 selected products.
25. `ProductDetailModal.jsx` — Quick-view modal showing full specifications, materials, and certificates.
26. `ProductGallery.jsx` — Interactive multi-angle image gallery with 3D viewer toggle.
27. `ProductImage.jsx` — Resilient product image loader with blur placeholder and error fallbacks.
28. `RecentlyViewedStrip.jsx` — Horizontal carousel strip showing recently browsed items.
29. `ScrollToTop.jsx` — Router scroll restoration utility.
30. `SwapMyCartModal.jsx` — Modal detailing all conventional cart items and proposed green replacements.
31. `ThemeToggle.jsx` — Accessible toggle button switching between Light and Dark themes.
32. `UserMenu.jsx` — Header profile dropdown with user tier, eco-points, and account links.
33. `WelcomeModal.jsx` — First-time visitor onboarding tour introducing the store's mission.

### 4.2 3D Graphics Components (`src/components/3D/` — 4 files)
1. `EcoForest3D.jsx` — Three.js interactive 3D virtual forest where tree growth reflects user's CO₂ savings.
2. `LeafyGlobe3D.jsx` — Three.js interactive planetary globe with orbiting green particles on Home Hero.
3. `Product3DViewer.jsx` — OrbitControls 3D product inspection viewer for sustainable packaging.
4. `Safe3D.jsx` — WebGL capability detector and safe fallback boundary for older browsers.

### 4.3 Accessibility (`src/components/accessibility/` — 1 file)
1. `AccessibilityCenterModal.jsx` — Modal controlling high contrast, OpenDyslexic font, animation speed, and text size.

### 4.4 Agent (`src/components/agent/` — 1 file)
1. `AgentReportCard.jsx` — Evaluation scorecard reporting AI agent accuracy, adherence to guardrails, and audit scores.

### 4.5 Community (`src/components/community/` — 5 files)
1. `CommunityFeed.jsx` — Real-time stream of sustainable actions and swaps taken by shoppers.
2. `EcoLeaderboard.jsx` — Gamified community leaderboard showing top eco-point earners.
3. `NewsletterSignup.jsx` — Email subscription input with validation and zero-spam assurance.
4. `PledgeWall.jsx` — Interactive community pledge wall allowing users to commit to green habits.
5. `ShareableImpactCard.jsx` — Visually styled impact certificate exportable to PNG image.

### 4.6 Decision Engine (`src/components/decision/` — 5 files)
1. `AIEthicsCard.jsx` — Explanatory card showing ethical considerations in product ranking.
2. `CounterfactualSlider.jsx` — Interactive slider exploring "what-if" impact score adjustments.
3. `EthicsInboxModal.jsx` — Human-in-the-loop review inbox for flagged product claims.
4. `PrioritiesPanel.jsx` — Weight tuning sliders (Price vs Carbon vs Circularity vs Toxicity).
5. `WhyRankPopover.jsx` — Popover explaining exact mathematical reasons behind an item's search rank.

### 4.7 Detective & Anti-Greenwashing (`src/components/detective/` — 8 files)
1. `BrandTransparencyCard.jsx` — Scorecard rating brand transparency and disclosure metrics.
2. `CertificationDecoderModal.jsx` — Educational decoder explaining FSC, GOTS, Fair Trade, etc.
3. `ClaimDiffModal.jsx` — Side-by-side diff between marketing claim and verified LCA reality.
4. `ClaimEvidenceGraph.jsx` — Visual node graph linking claims to empirical evidence sources.
5. `ClaimRadarChart.jsx` — SVG radar chart plotting 5 dimensions of environmental truthfulness.
6. `GreenwashingDetectiveModal.jsx` — Flagship audit tool analyzing product text for 50+ banned buzzwords.
7. `GreenwashLexiconHighlighter.jsx` — Text highlighter marking deceptive phrases with tooltip explanations.
8. `ReportClaimModal.jsx` — User submission modal to flag suspicious greenwashing for audit.

### 4.8 EcoAgent Chat (`src/components/EcoAgent/` — 7 files)
1. `AgentMemoryDrawer.jsx` — Slide-out showing active conversational memory and detected preferences.
2. `AIEnergyMeter.jsx` — Real-time computation energy counter estimating watt-hours per AI query.
3. `EcoAgentChat.jsx` — Floating chat interface with dual online/rule intelligence, audio input, and suggestions.
4. `HonestyMeter.jsx` — Gauge scoring AI response factual reliability and uncertainty bounds.
5. `ReasoningExplanationCard.jsx` — Expandable card breaking down why a recommendation was made.
6. `SwapSuggestionBanner.jsx` — Proactive top banner notifying shoppers of greener alternative items.
7. `VoiceShoppingModal.jsx` — Voice interaction modal with speech-to-text audio visualizer.

### 4.9 Feedback (`src/components/feedback/` — 1 file)
1. `FeedbackInboxModal.jsx` — In-app feedback collector and issue reporting modal.

### 4.10 Home Page Sections (`src/components/home/` — 22 files)
1. `AgentPipelinePanel.jsx` — Visual flow of the multi-agent decision pipeline.
2. `AppWindowShowcase.jsx` — Styled browser window frame demonstrating the EcoMart interface.
3. `CheckMarquee.jsx` — Infinite scrolling banner of audited certifications and standards.
4. `ContourCanvas.jsx` — Canvas rendering organic topographic contour lines.
5. `EcoJourneyScene.jsx` — Step-by-step visual scene of sustainable product transformation.
6. `EditorialFinalCTA.jsx` — Editorial closing call to action inviting visitors to shop responsibly.
7. `EngineeringHero.jsx` — Flagship hero section with 3D Leafy Globe, headline, and metric counters.
8. `EthicsInboxPreview.jsx` — Live preview of human oversight actions.
9. `GreenwashingStrikethrough.jsx` — Interactive text strikethrough revealing reality behind buzzwords.
10. `GuardrailsBoard.jsx` — Interactive board explaining safety rules and confidence thresholds.
11. `HonestFeedbackSection.jsx` — Testimonials and verified community ratings.
12. `HorizontalFeatureGallery.jsx` — Horizontal scrolling gallery of standout features.
13. `ImpactTiers.jsx` — Visual guide to the 4 conscious consumer tiers.
14. `InsightsDashboard.jsx` — Live planetary metric dashboard.
15. `KineticTypeStrips.jsx` — Diagonal kinetic typography animation ribbons.
16. `NumberedFeatureCards.jsx` — Grid of numbered feature highlights.
17. `PinnedProductJourney.jsx` — Scroll-driven pinned journey tracking raw material to doorstep.
18. `ResponsibleAILabsShowcase.jsx` — Cards linking directly to Courtroom, Dilemmas, and Self-Audit.
19. `ScrollProgressBar.jsx` — Minimal top progress bar indicating scroll depth.
20. `SignatureShowcase.jsx` — Curated showcase of flagship zero-waste products.
21. `StickyStackedCards.jsx` — Scroll-stacked cards explaining the 5 pillars.
22. `WordByWordMission.jsx` — Scroll-linked typography reveal highlighting the mission statement.

### 4.11 Impact Analytics (`src/components/impact/` — 11 files)
1. `CategoryCarbonBarChart.jsx` — Drill-down bar chart comparing category carbon totals.
2. `EquivalentsTranslatorCard.jsx` — Plain-language human impact equivalents (bottles avoided, km driven).
3. `HabitLineChart.jsx` — Time-series line chart tracking shopping eco-score progress over time.
4. `ImpactReceiptModal.jsx` — Downloadable carbon & plastic receipt modal.
5. `PersonalCarbonBudgetWidget.jsx` — Monthly personal carbon allowance vs spent emissions.
6. `PurposeReportModal.jsx` — Detailed annual sustainability and planetary purpose audit report.
7. `StreaksGoalWidget.jsx` — Habit streaks and weekly goal completion rings.
8. `TrustScoreHistogram.jsx` — Distribution histogram of catalog trust scores.
9. `WeeklyEcoReviewModal.jsx` — Weekly summary review modal recapping impact savings.
10. `WhatIfCartSimulator.jsx` — Interactive simulator calculating planetary gains if all items swapped.
11. `YearAheadProjection.jsx` — 12-month forward projection of emissions saved if current habits continue.

### 4.12 Learning & Education (`src/components/learn/` — 2 files)
1. `MythBusterCards.jsx` — Interactive flip cards debunking environmental misconceptions.
2. `TShirtStoryMode.jsx` — Interactive lifecycle journey of a cotton t-shirt from seed to landfill.

### 4.13 Lifecycle & Circular Economy (`src/components/lifecycle/` — 9 files)
1. `ChoiceRippleFlow.jsx` — Cascading visualization of compounding downstream lifecycle benefits.
2. `CostPerUseCalculator.jsx` — Calculator proving sustainable goods cost less per use over lifetime.
3. `LifecycleTimelineScrubber.jsx` — Interactive timeline scrubber traversing extraction, manufacture, use, and end-of-life.
4. `ProductLifecycleTimeline.jsx` — Visual timeline tracking item lifecycle stages.
5. `ProductTimeMachine.jsx` — 10-year durability forecast comparing degradation vs conventional plastics.
6. `RepairGuidesModal.jsx` — Step-by-step DIY repair and maintenance manual for products.
7. `SecondLifeBoardModal.jsx` — Community marketplace board to trade, repair, or upcycle used items.
8. `SecondLifeTab.jsx` — Product page tab providing composting, recycling, and trade-in paths.
9. `SensitivitySliders.jsx` — Sliders dynamically adjusting transport and energy variables in LCA calculations.

### 4.14 News (`src/components/news/` — 1 file)
1. `RelatedNewsPanel.jsx` — Contextual news feed displaying regulatory updates matching product material.

### 4.15 Notifications (`src/components/notifications/` — 1 file)
1. `NotificationCenterModal.jsx` — In-app notification center for restock alerts, milestone badges, and swaps.

### 4.16 Privacy (`src/components/privacy/` — 1 file)
1. `PrivacyCenterModal.jsx` — Privacy management center with local data wipe and zero-third-party tracking pledge.

### 4.18 Product Specialized (`src/components/product/` — 2 files)
1. `ProductPassportQRModal.jsx` — Modal displaying scannable QR code linking to verified Digital Product Passport.
2. `ProductScaleVisualModal.jsx` — Interactive visual scale comparison against everyday objects (phone, bottle).

### 4.19 Recommendations (`src/components/recommendations/` — 1 file)
1. `ForYouRow.jsx` — Personalized recommendation strip based on user's active priorities and history.

### 4.20 Shop Specialized (`src/components/shop/` — 10 files)
1. `CategoryTiles.jsx` — Department navigation grid displaying icon, description, and item count.
2. `GiftFinderModal.jsx` — Wizard matching eco-gifts based on recipient, occasion, and budget.
3. `HouseholdProfileSelector.jsx` — Profile switcher adapting recommendations (Single, Couple, Family with Kids).
4. `IntentSearchInput.jsx` — Natural language intent search bar with suggestion chips.
5. `OccasionKitsModal.jsx` — Curated starter kits for specific life occasions (Zero-Waste Kitchen, College Starter).
6. `ShopActiveChips.jsx` — Removable filter chips reflecting active catalog search constraints.
7. `ShopEmptyState.jsx` — Friendly empty state offering filter resets and suggested search queries.
8. `ShopFilterBar.jsx` — Top filter bar with sorting, department tabs, and quick-filter pills.
9. `ShopFilterDrawer.jsx` — Mobile slide-out drawer containing full faceted filter controls.
10. `TradeoffExplorerModal.jsx` — Interactive trade-off explorer comparing Price vs Carbon savings.

### 4.21 Tools, Guides & Gardens (`src/components/tools/` — 17 files)
1. `BudgetBasketBuilder.jsx` — Knapsack budget tool generating the highest-impact basket within a strict rupee limit.
2. `CarbonFootprintCalculator.jsx` — Comprehensive multi-step household carbon footprint assessment calculator.
3. `CityRecyclingGuideModal.jsx` — City-specific municipal waste segregation guidelines (Delhi, Mumbai, Bengaluru, etc.).
4. `ClassImpactGarden.jsx` — Collaborative virtual garden designed for school classes and study groups.
5. `DailyEcoChallenge.jsx` — Rotating daily micro-challenges awarding eco-points upon completion.
6. `EcoGlossary.jsx` — Searchable A-Z dictionary of sustainability standards, certifications, and terms.
7. `EcoGoalsTracker.jsx` — Goal-setting tracker for monthly plastic diversion and zero-waste milestones.
8. `EcoMap.jsx` — Interactive regional map showing local craft clusters and artisan distances.
9. `EcoQuiz.jsx` — Interactive 5-question sustainability trivia quiz testing green literacy.
10. `ImpactPulseWidget.jsx` — Fixed floating pill widget displaying live cart impact savings.
11. `PlantATreeGarden.jsx` — 3D virtual tree garden that matures as users accumulate verified carbon savings.
12. `RecyclingGuide.jsx` — Material-by-material segregation, washing, and drop-off instructions.
13. `SavingsImpactCalculator.jsx` — Financial vs ecological ROI calculator for reusables vs single-use items.
14. `SeasonalGuide.jsx` — Indian regional seasonal produce calendar advising on lowest-mile crops.
15. `ShoppersChecklistModal.jsx` — Interactive shopping checklist for zero-waste grocery trips.
16. `StarterKits.jsx` — Curated beginner bundles for zero-waste lifestyle transitions.
17. `WaterEnergyEstimator.jsx` — Water and energy consumption estimator comparing lifestyle choices.

### 4.22 Cart Transformer (`src/components/transformer/` — 6 files)
1. `TransformerActions.jsx` — Action buttons to add transformed cart to live cart or copy breakdown.
2. `TransformerComparison.jsx` — Side-by-side comparison table showing original items vs green swaps.
3. `TransformerInputCard.jsx` — Freeform text input card with sample shopping list presets.
4. `TransformerSummaryBar.jsx` — Summary bar totaling budget, CO₂ saved, and plastic avoided.
5. `TransformerThinking.jsx` — Visual animated thinking trace of knapsack optimization steps.
6. `VoiceInputButton.jsx` — Voice microphone button with Web Speech API and Gemini audio transcription fallback.

### 4.23 UI Design System (`src/components/ui/` — 21 files)
1. `Accordion.jsx` — Accessible collapsible accordion items.
2. `Badge.jsx` — Status pill badge supporting primary, neutral, warning, danger, and success variants.
3. `Button.jsx` — Core button component with loading states, sizes, and icon slots.
4. `Card.jsx` — Surface card container with flat, raised, or sunken variants.
5. `Checkbox.jsx` — Accessible styled checkbox with custom SVG checkmark.
6. `Chip.jsx` — Interactive selection chip / tag with optional remove button.
7. `EmptyState.jsx` — Generic empty state illustration with title, subtitle, and action button.
8. `GlossaryTooltip.jsx` — Hover tooltip displaying instant definitions for certified eco terms.
9. `Input.jsx` — Form text input with label, helper text, and error states.
10. `Modal.jsx` — Accessible modal dialog backdrop with focus trap and escape key handler.
11. `ProgressBar.jsx` — Linear progress bar with customizable colors and animated transitions.
12. `ProgressRing.jsx` — Circular SVG progress ring displaying percentages.
13. `Radio.jsx` — Accessible styled radio button group control.
14. `SegmentedControl.jsx` — Segmented button tab group with active sliding indicator.
15. `Select.jsx` — Custom styled select dropdown menu.
16. `Skeleton.jsx` — Animated loading skeleton placeholders for asynchronous data.
17. `Slider.jsx` — Accessible range slider with min, max, step, and value display.
18. `Switch.jsx` — Accessible toggle switch component.
19. `Tabs.jsx` — Tabbed navigation container with keyboard navigation.
20. `Toast.jsx` — Accessible toast notification system capped at 3 simultaneous alerts.
21. `Tooltip.jsx` — Generic hovering tooltip component.

---

## 5. Verification Status

- **Automated Tests:** 39 test files, **475 tests passing (100%)**.
- **Oxlint:** 0 errors.
- **Catalogue & Images:** Exactly 124 products across 8 categories (16, 16, 16, 16, 15, 15, 15, 15). 100% of products have unique images (1,364 image files including 9 responsive variants, alt, LQIP blur, and photo credit), passing `npm run check:images` and `npm run check:data`.
- **Database:** All 124 products live in Supabase and seeded via `npm run seed:products`.
- **Offline Purity:** 0 external URLs in `src/` or `public/` (passing `npm run check:urls`).
- **Home Route Initial Bundle:** 225.05 kB gzipped (within 250.00 kB budget for 124 products).
