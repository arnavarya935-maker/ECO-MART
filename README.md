# Eco Sense — Shop with Purpose

> A transparent shopping app with an honest AI helper. Built for school competition presentation on 31 October 2026.

Eco Sense helps everyday shoppers find green alternatives, spot vague claims, and make budget-friendly choices. It works in both **English** and **Hindi (हिंदी)**.

---

## ⚡ Quick Start in 3 Commands

```bash
git clone https://github.com/example/ecomart-agent.git
cd ecomart-agent
npm install && npm run dev
```

Then open `http://localhost:5173` in your browser.

---

## 🔑 Environment Variables

To enable the cloud AI helper, create a `.env` file in the project root:

```ini
# Google Gemini API Key from Google AI Studio (free tier)
GEMINI_API_KEY=your_gemini_api_key_here

# Recommended model (check names in Google AI Studio before the event)
GEMINI_MODEL=gemini-1.5-flash
```

> **Important Note for Vercel Deployment:**
> After adding or changing environment variables in the Vercel dashboard, **you must redeploy** for changes to take effect.

If no API key is provided, the app continues to work smoothly using its built-in rule engine.

---

## 🩺 How to Verify the Gemini AI Connection

You can verify whether the AI helper is connected in two easy ways:

1. **In the App:**
   Open the **Settings** page (`/settings`). Under "AI Helper Status", you will see:
   - `AI helper: working, 1.2 s` (when Gemini is connected and fast)
   - `AI helper: not connected - using the built-in helper (NO_API_KEY)` (when running locally without a key)

2. **Via the Health Endpoint:**
   Visit `http://localhost:5173/api/health` or run:
   ```bash
   curl http://localhost:5173/api/health
   ```
   Example healthy response:
   ```json
   {
     "status": "working",
     "model": "gemini-1.5-flash",
     "latencyMs": 840,
     "checkedAt": "2026-10-29T01:45:00.000Z"
   }
   ```
   > **Security Guarantee:** The health check never returns your API key or any part of it.

---

## 🏛️ How the System Works (2 Layers)

```
┌─────────────────────────────────────────────────────────────┐
│                      LAYER 1: USER'S BROWSER                │
│  - React 19 + Vite + Tailwind v4                            │
│  - 64 Products Catalogue (English & Hindi)                  │
│  - Transparent 5-Pillar EcoScore Math Formula               │
│  - Built-in Local Helper (Fast, deterministic rules)         │
│  - Local Cart & Saved Orders in localStorage                │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               │ HTTPS /api/agent (20s total client timeout)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 LAYER 2: VERCEL SERVERLESS PROXY            │
│  - /api/agent & /api/health                                 │
│  - Keeps GEMINI_API_KEY safe (never sent to browser)        │
│  - Rate Limiter (30 requests/min per IP)                    │
│  - Redacts personal data (emails, phone numbers)            │
│  - 12s primary model timeout, fast fallback to secondary    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               │ Authenticated API Call (Server-to-Server)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     EXTERNAL AI (OPTIONAL)                  │
│  Google Gemini 1.5 Flash (Google AI Studio)                 │
└─────────────────────────────────────────────────────────────┘
```

- **Price & Score Safety Rule:** The cloud model only suggests category names and explains reasoning in plain words. Product prices, EcoScores, and carbon savings ALWAYS come strictly from our verified local catalogue data. If an external model hallucinates a non-existent product or fake price, our proxy automatically drops it.

---

## 🔍 Honest Honesty Audit: What is Real vs Simulated?

To be 100% honest with the competition judges:

| Feature | Status | Details |
| :--- | :--- | :--- |
| **Product Catalogue** | **Real** | 64 curated eco-friendly and conventional comparison products with real prices, specs, and materials. |
| **EcoScore (0-100)** | **Real** | Computed mathematically via an open 5-pillar formula: Materials (30%), Packaging (20%), Carbon (25%), Certifications (15%), Proximity (10%). |
| **Search & Filters** | **Real** | Full instant text search, price filters, category filters, and sorting. |
| **Bilingual UI** | **Real** | Complete key parity between English and Hindi (`src/i18n/en.js` & `src/i18n/hi.js`) plus localized product names and descriptions. |
| **Basket Planner** | **Real** | Multi-choice knapsack algorithm that optimizes items to fit a custom budget while maximizing EcoScore. |
| **AI Helper Explanations** | **Real** | When `GEMINI_API_KEY` is present, real Gemini calls generate natural explanations; otherwise, the built-in rule helper answers. |
| **Connection Health Check** | **Real** | Real 5-second health probe to Gemini with 60-second in-memory caching. |
| **News Feed** | *Curated Demo* | Realistic curated eco-news articles loaded from clean static data (no live paid RSS subscriptions). |
| **Label Scanner** | *Simulated* | Client-side OCR simulation using standard browser canvas/image processing. |
| **Barcode Lookup** | *Simulated* | Matches barcodes against our sample catalogue database. |
| **Payment Gateway** | *Simulated* | Instant mock checkout (UPI, Card, Cash on Delivery) to demonstrate orders and receipts without charging real money. |
| **Seller Certifications** | *Claimed* | Listed as claimed by the seller in our sample data; our "Truth Lab" audits them for vague buzzwords. |

---

## 🌙 5 Things to Check the Night Before 31 Oct 2026

1. **Verify AI Health:** Open `/settings` and confirm it shows `AI helper: working`. Check `curl http://localhost:5173/api/health`.
2. **Confirm Gemini Quota:** Log in to [Google AI Studio](https://aistudio.google.com/) and check that your API key is active and within free tier limits.
3. **Run Code Verification:** Run `npm run verify` in terminal. Confirm:
   - `0 lint errors`
   - All tests pass (350+ tests)
   - Clean production build (`npm run build`)
4. **Offline Test:** Disconnect Wi-Fi on your demo laptop and browse the store. The Service Worker and built-in local helper should continue answering questions smoothly.
5. **Screen & Audio Prep:** Test your laptop screen at 100% zoom. Check sound volume if demonstrating text-to-speech voice answers in English or Hindi.

---

## 🛠️ Verification Commands

```bash
# Run lint check (0 errors)
npm run lint

# Run all 350+ automated unit & integration tests
npm test

# Run production build
npm run build

# Run complete verification suite
npm run verify
```

---

## 📜 License & Ethics

Created for school competition exhibition. Code is open and transparent. Built with purpose, honesty, and simple words.
