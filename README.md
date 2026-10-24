# EcoMart — Transparent Sustainable E-Commerce & Agentic Shopping Platform

> *"Shop with clarity. Every claim grounded, every estimate transparent."*

EcoMart is a production-grade, local-first sustainable e-commerce web application built with **React 19**, **Vite**, **Tailwind CSS v4 & semantic design tokens**, **React Three Fiber (Three.js)**, **Framer Motion**, and **Recharts**. EcoMart transparently scores products with an open lifecycle formula, suggests cleaner product swaps, detects greenwashing, and provides a multi-agent shopping assistant—all running with zero external CDN dependencies and honest uncertainty boundaries.

---

## 🏛️ Architecture Overview

```
                                  ┌──────────────────────────────────────────────┐
                                  │           EcoMart Client (Browser)          │
                                  │  - React 19 + Vite + Tailwind CSS v4 Tokens  │
                                  │  - Local-First Storage (localStorage/IDB)    │
                                  │  - Service Worker (App Shell + Offline Mode) │
                                  │  - Deterministic Offline AI Engines          │
                                  └──────────────────────┬───────────────────────┘
                                                         │
                                        API Requests (/api/*)
                                                         │
                                                         ▼
                                  ┌──────────────────────────────────────────────┐
                                  │      Edge / Serverless Proxy Gateway         │
                                  │   (server/proxyServer.js & api/*.js)         │
                                  │  - In-Memory Rate Limiting (30 req/min/IP)   │
                                  │  - Payload Validation (Max 3MB base64)       │
                                  │  - Header Injection (x-goog-api-key)         │
                                  │  - Output Schema Validation & Sanitization   │
                                  └───────┬──────────────┬──────────────┬────────┘
                                          │              │              │
                                          ▼              ▼              ▼
                                  ┌──────────────┐┌──────────────┐┌──────────────┐
                                  │Google Gemini ││ GNews /      ││Open Food     │
                                  │2.5 Flash API ││ NewsData API ││Facts Registry│
                                  └──────────────┘└──────────────┘└──────────────┘
```

1. **Local-First PWA Architecture**:
   - Zero external CDN scripts, fonts, or images. 100% self-hosted assets in `public/` and `src/assets/`.
   - All cart, preference, and agent memory state is local-first (`localStorage`) with a dedicated **Privacy Center** to inspect, export (JSON), or permanently delete data.
   - Progressive Web App with service worker pre-caching the core application shell and providing offline fallback.

2. **Server-Side API Security & Rate Limiting**:
   - Zero API keys are ever leaked to client bundles. API keys are injected server-side via `x-goog-api-key`.
   - Sliding-window rate limiter enforces 30 requests/minute per client IP with `429 Too Many Requests` responses.
   - Strict payload size ceilings (3MB base64) protect against memory denial-of-service.
   - Responses are strictly validated and mapped against schema models before reaching the client; raw model payloads are never directly forwarded.

3. **Multi-Provider AI & Offline Fallback**:
   - Powered by Google Gemini 2.5 Flash (`gemini-2.5-flash`), with deterministic rule-based client fallbacks for all features when offline or unconfigured.
   - All AI-generated estimates are clearly labeled with uncertainty ranges and assumption notices.

4. **Curated Eco News Adapter**:
   - Multi-provider news adapter (`/api/news`) supporting GNews and NewsData.
   - Restricts queries to 7 allowlisted sustainability topics (*Climate, Supply Chain, Policy, Tech, Biodiversity, Energy, Circular Economy*) with an in-memory 1-hour cache.

5. **Open Food Facts Barcode Integration**:
   - `/api/barcode` queries public product registries for packaging and certification data with a 6-second timeout and sanitization layer.

---

## 🔄 Before vs. After Comparison

| Dimension | Before (Initial Codebase) | After (EcoMart Production Upgrade) |
| :--- | :--- | :--- |
| **API Security** | API keys passed in URL query strings or exposed client-side; no rate limiting or payload limits. | Server-side gateway with `x-goog-api-key` header injection, 30 req/min sliding-window rate limit, 3MB body limit, and output sanitization. |
| **Label Scanner** | Hardcoded fake scores, simulated camera scans, fabricated certainty verdicts. | Real canvas downscaling (max 1024px), Tesseract OCR verbatim text transcription, Open Food Facts barcode registry lookups, zero invented scores. |
| **Eco News Hub** | Missing news feature or static placeholder links. | Production news adapter supporting GNews and NewsData with 7 allowlisted topics, 1-hour caching, and honest empty states. |
| **Honesty & Copy** | Blanket claims ("100% offline", "Zero Plastic", "Verified Impact"), fake customer reviews, and seeded leaderboard users. | Complete purge of synthetic traction and unverified claims; ISO 14040 open formulas, uncertainty min-max bands, and labeled estimates. |
| **Codebase Health** | 11 orphaned/dead components, duplicate styling classes, unused state hooks, ad-hoc buttons. | 11 dead components removed; design system components wired (`GlossaryTooltip`, `EmptyState`, `Tabs`, `Chip`, `Skeleton`, `Input`). |
| **UI Polish & Viewports** | Mobile collisions between floating widgets and bottom nav; sub-12px micro-text (`text-[9px]`); fixed-height button clipping. | Quiet luxury styling with Fraunces & Inter; standard z-index scale; min 12px micro-eyebrows and 14px body; `min-h-[44px]` touch targets. |
| **Automated Testing** | 75 unit tests with baseline test regressions and missing integration coverage. | **243 passing tests** across 27 suites, including automated forbidden-terms regression test and full route rendering suite. |
| **Asset & URL Purity** | Inconsistent image assets and unverified links. | 64/64 unique images verified; **0 external URLs** in `src/` or `public/`; Home route JS 182.98 kB (within 200 kB budget). |

---

## 🧭 How Each Hub Works (Plain-Language Guide)

### 1. Shop Hub (`/shop`)
The Shop Hub presents a curated catalog of 64 sustainable products with real-time multi-criteria ranking. Shoppers can adjust interactive priority sliders (Price, Carbon, Plastic, Water, Local Distance) to reorder products dynamically, with every card featuring a "Why this rank?" audit popover. When a conventional item is added to the cart, the proactive copilot suggests a cleaner swap and shows the exact environmental delta.

### 2. Agent Hub (`/agent`)
The Agent Hub provides a transparent multi-agent shopping assistant featuring visible collaboration between Planner, Researcher, Skeptic, and Advisor roles. It can solve constraint-based shopping goals (e.g., "dorm essentials under ₹3,000"), critiquing its own recommendations via Skeptic mode. All conversation context and preference memory are stored locally on-device and can be edited or wiped with one click.

### 3. Truth Lab Hub (`/truth-lab`)
The Truth Lab is an environmental claims audit center unifying four specialized tools:
- **Greenwashing Detective**: Analyzes product descriptions against FTC and ASCI regulatory lexicons.
- **Claim Radar**: Plots marketing statements across 5 independent axes (Vague Wording, Proof, Certification, Specificity, Benchmarking).
- **Label Scanner (`/scan`)**: Extracts verbatim packaging text via client-side OCR and queries the Open Food Facts barcode registry without storing images.
- **AI Courtroom (`/courtroom`)**: Simulates a three-role legal debate where a Prosecutor exposes vague claims, a Defender highlights genuine merits, and an impartial Judge delivers an evidentiary verdict.

### 4. Impact Hub (`/impact`)
The Impact Hub translates abstract environmental metrics into actionable personal accountability. It tracks a live monthly personal carbon budget consumed by cart purchases, visualizes product lifecycle digital twins (from material extraction to second life), and calculates cost-per-use economics against single-use disposables. Shoppers can export a printable Purpose Receipt using EPA/EEA conversion factors.

### 5. Learn Hub (`/learn`)
The Learn Hub builds long-term sustainability literacy through interactive, engaging storytelling. It features the scroll-driven "Life of a T-Shirt" story mode, verified myth-buster cards, category repair and reuse guides, and an inline glossary for eco terminology. Includes full bilingual support (English and Hindi) with offline typography and accessible high-contrast modes.

---

## ⚙️ Environment Variables

EcoMart works out of the box in offline-first mode without any required environment variables. To enable live cloud AI and news providers, create a `.env` or `.env.local` file:

```env
# -----------------------------------------------------------------------------
# Google Gemini AI Configuration
# -----------------------------------------------------------------------------
# Required for live generative responses; if omitted, EcoMart seamlessly uses
# verified deterministic offline heuristics.
GEMINI_API_KEY=your_gemini_api_key_here

# Model identifier (defaults to gemini-2.5-flash)
GEMINI_MODEL=gemini-2.5-flash

# -----------------------------------------------------------------------------
# Curated Eco News Configuration
# -----------------------------------------------------------------------------
# Supported providers: 'gnews' or 'newsdata'
NEWS_PROVIDER=gnews

# API key for the selected news provider
NEWS_API_KEY=your_news_api_key_here

# -----------------------------------------------------------------------------
# Server Configuration (Optional)
# -----------------------------------------------------------------------------
# Port for standalone proxy server (default: 3001)
PORT=3001
```

---

## 🎛️ Safety Feature Flags (`src/lib/features.js`)

Every key capability is guarded by a boolean flag in `src/lib/features.js` for safe deployment and granular control:

| Feature Flag | Default | Description |
|---|:---:|---|
| `DECISION_ENGINE` | `true` | Multi-criteria priority-weighted ranking engine |
| `ECO_CHECK` | `true` | Text paste greenwashing and material analyzer |
| `PROACTIVE_COPILOT` | `true` | Rate-limited non-blocking sustainable swap nudges |
| `LIFECYCLE_EXPLORER` | `true` | 5-stage product lifecycle timeline scrubber |
| `YEAR_AHEAD_REPORT` | `true` | 12-month projection and printable Purpose Report |
| `FOR_YOU_LEARNING` | `true` | On-device privacy-first personalization row |
| `HINDI_LANGUAGE` | `true` | Hindi/English bilingual switcher and offline fonts |
| `AI_COURTROOM` | `true` | Simulated 3-role courtroom debate with objections |
| `LABEL_SCANNER` | `true` | Verbatim OCR label scanner & barcode registry lookup |
| `CONFIDENCE_BRAKE` | `true` | Strictness threshold slider & accountable refusal |
| `ETHICS_DILEMMAS` | `true` | Dilemma cards with explicit algorithmic refusal |
| `CHOICE_RIPPLE` | `true` | Animated Sankey lifecycle flow with table view |
| `PRODUCT_TIME_MACHINE` | `true` | Future scenario outcomes (Now / 2030 / 2035) |
| `AI_SELF_AUDIT` | `true` | Printable session self-audit accountability report |
| `KIRANA_MODE` | `true` | High-contrast Hindi-first layout with Web Speech |

---

## 🚀 Getting Started & CI Verification

### Prerequisites
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

### Installation & Development

```bash
# 1. Install dependencies
npm install

# 2. Start local development server (with built-in API proxy)
npm run dev

# 3. Open in your browser
# Default: http://localhost:5173 (or 5174 if 5173 is occupied)
```

### Comprehensive CI Quality Suite

```bash
# Run the complete verification gate:
npm run verify
```

`npm run verify` runs the following automated checks in sequence:
1. `npm run lint`: Oxlint static analysis across all files (0 errors).
2. `npm run check`: Image integrity check (64/64 unique images, zero broken assets).
3. `npm test`: 243 Vitest tests across 27 suites (100% passing).
4. `npm run build`: Production bundle compilation via Vite.
5. `npm run check:urls`: Scans `src/` and `public/` for external CDN URLs (0 external URLs).
6. `npm run bundle:report`: Verifies initial Home JS bundle is under the 200 kB gzipped threshold.

---

## 📄 License & Attribution

EcoMart is open-source software built for educational sustainability research and transparent e-commerce design. All conversion factors and impact formulas are grounded in public ISO 14040/14044 lifecycle standards, EPA guidelines, and the Open Food Facts public registry.
