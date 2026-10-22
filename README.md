# EcoMart — Sustainable E-Commerce Platform Powered by Eco Agent

> *"Don't just shop. Shop with purpose."*  
> **School Competition Edition (31 Oct 2026)** • **100% Offline-Native**

EcoMart is a fast, offline-native sustainable e-commerce web application built with **React 19**, **Vite**, **Tailwind CSS v4 & semantic design tokens**, **React Three Fiber (Three.js)**, **Framer Motion**, and **Recharts**. EcoMart transparently scores products with a verified 0–100 lifecycle formula, suggests cleaner product swaps, detects greenwashing, and provides an autonomous, visibly intelligent Eco Agent—all running 100% locally with zero external network or CDN dependencies.

For live competition presentation instructions and judge Q&A, refer to the [Competition Demo Script & Judge Q&A](DEMO_SCRIPT.md).

---

## 🚀 Quick Setup & CI Verification

```bash
# 1. Install dependencies
npm install

# 2. Run comprehensive CI verification (lint, image audit, 75 tests, build, url purity & bundle budget)
npm run verify

# 3. Or run individual validation steps:
npm run lint          # oxlint with 103 rules, 0 errors & 0 warnings across 152 files
npm run check         # 100% unique product images, zero broken links
npm test              # 75 Vitest tests across 8 test suites (all passing)
npm run check:urls    # confirms 0 external URLs in src/ or public/ (100% offline)
npm run bundle:report # verifies Home route JS is 148.5 kB gzipped (budget: 200 kB)

# 4. Run acceptance checks script:
node scripts/run-acceptance-checks.mjs

# 5. Start local development server
npm run dev

# 6. Preview production build locally
npm run preview
```

---

## 🏆 Key Features & Competition Architecture

### 1. Priority-Weighted Decision Engine (`src/lib/decisionEngine.js`)
- **Multi-Criteria Mathematical Scoring**: Normalizes candidates across **7 independent dimensions**: Price, Carbon, Plastic, Water, Local transit distance, Certifications, and EcoScore.
- **Interactive "My Priorities" Sliders**: Live in Shop filter bar, filter drawer, and Eco Agent chat. Adjusting any slider re-ranks products in real-time with smooth Framer Motion card animations.
- **"Why this rank?" Popover**: Every product card provides an auditable breakdown of exact point contributions from the user's active priorities.
- **Natural Language Priority Tuning**: In chat, saying *"I care most about price"* or *"plastic matters more"* updates the active weights dynamically.

### 2. "Eco Check Any Product" Paste Analyzer (`src/pages/EcoCheckPage.jsx`, `src/lib/ecoCheck.js`)
- **Real-World Heuristic Parser**: Users paste or type external product descriptions (e.g. *"Plastic water bottle, eco friendly, BPA free"*).
- **Greenwashing & Material Detection**: Identifies petrochemical synthetic materials (*plastic, polyester, nylon, PVC*), unverified marketing buzzwords (*"100% eco friendly", "natural", "non-toxic"*), and verifies third-party credentials (*GOTS, FSC, Fair Trade*).
- **Catalog Alternatives Mapping**: Assigns an estimated EcoScore with a confidence grade and recommends up to 3 catalog alternatives with estimated CO₂ and plastic savings.
- **Honesty in UI**: Every calculation is stamped **"Estimate"** or **"Qualitative"**; vague inputs trigger a clarifying question with quick-reply chips rather than guessing.

### 3. Proactive Copilot (`src/lib/copilotEngine.js`, `SwapSuggestionBanner.jsx`)
- **Autonomous Reasoning**: Speaks up without waiting to be prompted when a conventional or low-grade product enters the cart, the cart EcoScore drops by 5+ points, or browsing frequency indicates category interest.
- **Non-Blocking Ergonomics**: Renders a floating, accessible copilot toast with a 1-tap greener swap and a collapsible **"Why am I seeing this?"** explanation revealing the underlying trigger and environmental delta.
- **Rate-Limiter**: Enforces a strict cooldown of at least **20 seconds** between nudges and a hard session limit of **at most 5 nudges**. Muted in Judge Mode and configurable in Settings.

### 4. Product Lifecycle Explorer (`ProductLifecycleTimeline.jsx`, `lifecycleEngine.js`)
- **5-Stage Animated Timeline**: Displays the physical journey: Material Extraction → Making → Transport → Packaging → End of Life.
- **Comparative Deltas**: Interactive toggle compares each stage against conventional alternatives using quantitative metrics (*water consumed, kg CO₂e, plastic grams*) and qualitative audit notes.
- **Accessible & Static**: Built with lightweight SVG and CSS (zero Three.js overhead) and respects the "Reduce effects" toggle.

### 5. Year-Ahead Projection & Purpose Report (`YearAheadProjection.jsx`, `PurposeReportModal.jsx`)
- **12-Month Impact Simulation**: Users configure rebuy cadence (weekly, monthly, quarterly, yearly); projects annual CO₂, water, and plastic diverted vs conventional items with lazy-loaded Recharts curves.
- **Purpose Report Card Export**: One-page high-resolution shareable card export via `html-to-image` and dedicated `@media print` print styles for clean PDF export.
- **Documented Conversion Factors (`src/lib/conversionConstants.js`)**: All tree equivalents, passenger car km, and shower equivalents reference documented EPA and EEA conversion constants.

### 6. Personalised "For You" On-Device Learning (`preferenceModel.js`, `ForYouRow.jsx`)
- **100% Local Privacy**: Lightweight local signals (category views, product opens, wishlist, cart adds, swaps accepted/declined, priority weights) are stored only in `localStorage`.
- **Explainable Recommendations**: Renders a curated "For You" row on Home and Shop with transparent one-line explanations (*"Because you chose plastic-free swaps"*).
- **1-Click Reset**: Visible note and button to reset learned preferences immediately.

### 7. Hindi/English Bilingual Support (`src/i18n/`, `I18nContext.jsx`)
- **Bilingual Interface**: Seamless `EN / हिंदी` language toggle in Navbar and Settings.
- **100% Offline Devanagari Font**: Local `@fontsource/noto-sans-devanagari` bundled offline and lazy-loaded only when Hindi is selected.
- **Natural Language Parsing**: Eco Agent understands Hindi and Hinglish queries in Latin or Devanagari script (*"sabse sasta"*, *"kam dam"*, *"thela check karo"*, *"tohfa"*, *"झोला"*, *"रसोई के बर्तन"*).

### 8. Speech Synthesis & Presenter Pitch Mode (`PitchModeModal.jsx`)
- **Offline Browser Speech**: Optional read-aloud button on Eco Agent messages using the browser's native `speechSynthesis` API (gracefully hidden when unavailable).
- **Pitch Mode Shortcut (`P`)**: Pressing `P` anywhere opens a 2-minute guided presenter walkthrough stepping through the 5 flagship competition features in a fixed sequence.

---

## 🎛️ Safety Feature Flags (`src/lib/features.js`)

Every new feature sits behind a simple boolean flag in `src/lib/features.js` so it can be disabled in one line if needed before judging:

| Feature Flag | Default | Description |
|---|:---:|---|
| `DECISION_ENGINE` | `true` | Priority-Weighted Multi-Criteria Decision Engine |
| `ECO_CHECK` | `true` | Eco Check Any Product paste analyzer |
| `PROACTIVE_COPILOT` | `true` | Rate-limited non-blocking copilot reasoning nudges |
| `LIFECYCLE_EXPLORER` | `true` | 5-stage product lifecycle timeline |
| `YEAR_AHEAD_REPORT` | `true` | 12-month projection and shareable Purpose Report |
| `FOR_YOU_LEARNING` | `true` | On-device privacy-first personalization row |
| `HINDI_LANGUAGE` | `true` | Hindi/English bilingual switcher and offline font |
| `SPEECH_SYNTHESIS` | `true` | Offline browser read-aloud for agent replies |
| `PITCH_MODE` | `true` | 2-minute presenter tour overlay (shortcut 'P') |

---

## 📊 Performance Budget & Offline Compliance

| Check | Target / Budget | Result | Status |
|---|:---:|:---:|:---:|
| **Initial JS (Home route)** | $\le 200\text{ kB}$ gzip | **148.50 kB** gzip | ✅ **PASSED** |
| **Offline Purity (`check:urls`)** | 0 external URLs in `src/` or `public/` | **0 external URLs** | ✅ **PASSED** |
| **Oxlint Quality** | 0 errors, 0 warnings | **0 errors, 0 warnings (103 rules)** | ✅ **PASSED** |
| **Automated Tests (`npm test`)** | 100% pass | **75 / 75 tests passing** | ✅ **PASSED** |
| **Guest-First Persistence** | No mandatory login | 100% LocalStorage with in-memory fallbacks | ✅ **PASSED** |

---

## 🧪 Verified Acceptance Checks

| Acceptance Check | Result |
|---|---|
| **Plastic 100 / Price 0 Re-ranking** | Lowest-plastic (0g) items rank #1 with score 100; reverse puts cheapest (₹80) #1 with score 100 |
| **Agent Priority Tuning** | *"I care most about price"* updates price weight to 100 and confirms in agent reasoning trace |
| **Eco Check Analyzer** | *"Plastic water bottle, eco friendly, BPA free"* flags synthetic polymer & vague claims, assigns Grade E, recommends 3 certified catalog alternatives |
| **Proactive Copilot** | Adding conventional product triggers exactly 1 swap nudge with working *"Why am I seeing this?"* and 20s cooldown |
| **Product Lifecycle Robustness** | All 64 catalog products + sparse products render 5 lifecycle stages without errors |
| **Offline Purity** | 100% guest flow verified with zero external CDN requests or console network errors |
