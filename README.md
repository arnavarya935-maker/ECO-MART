# EcoMart — Premium Sustainable E-Commerce Platform Powered by an Eco Agent

> *"Don't just shop. Shop with purpose."*

EcoMart is a premium, offline-first sustainable e-commerce web application built with **React 19**, **Vite**, **Tailwind CSS v4**, **Framer Motion**, and **React Three Fiber (Three.js)**. It empowers users to make conscious purchasing decisions through an automated **Eco Agent**, transparent 5-pillar lifecycle scoring, real local product photography, dual authentication (Firebase Google + Web Crypto SHA-256 fallback + Guest), interactive 3D visualizations, and gamified planetary impact tracking.

---

## 🌟 Key Upgraded Highlights

### 1. 🔐 Dual Authentication & Offline Guest Mode
- **Dual Flow**: Sign Up and Log In with email + password, dynamic password strength meter, show/hide toggle, and real-time validation.
- **Firebase Google Authentication**: Optional Google provider reading securely from environment variables (`VITE_FIREBASE_*`).
- **Offline / Local Web Crypto SHA-256 Fallback**: When Firebase is unconfigured or the network is offline, user credentials are encrypted with Web Crypto SHA-256 + salt and persisted in `localStorage`.
  > *⚠️ Demo Limitation Note: Local Web Crypto SHA-256 hashing is designed for offline demonstration and educational purposes only. In production environments, authentication should be managed with an enterprise identity provider or salted bcrypt/argon2 hashing on a hardened server.*
- **1-Click Guest Mode**: "Continue as Conscious Explorer" enables instant access with no sign-in or network required.
- **Protected Sessions**: Saved addresses, wishlist, order history, and gamified eco-points persist across refreshes.

### 2. 📸 60+ Products Catalogue & Real Photographic Assets
- **Expanded Catalogue**: 64 audited items across **8 categories**:
  - *Kitchen, Personal Care, Fashion, Stationery, Home, Bags, Outdoor & Travel, Cleaning & Laundry*.
- **100% Local Photographic Imagery**: Real product photographs stored in `/public/images/products/` with WebP/JPG compression (max 800px). Zero hotlinked external URLs.
- **Graceful Fallbacks**: Every product includes blur-up loading, hover zoom, and a local handcrafted SVG fallback (`/public/images/products/<id>.svg`).
- **Product Gallery**: High-resolution image gallery with thumbnails, zoom-on-hover lens, and a fullscreen lightbox.
- **Attribution & Licensing**: Full credits documented in `/public/images/CREDITS.md` adhering to the Unsplash license.

### 3. 🎨 Design System & Theme
- **Curated Earthy Palette**:
  - Forest Green (`#0F3D2E`), Emerald (`#10B981`), Mint (`#D1FAE5`), Cream (`#FAF7F0`), Warm Sand (`#E9DFC8`), Amber Accent (`#F59E0B`), Charcoal Text.
- **Polished Dark Mode**: Seamless toggle persisted in `localStorage` with glassmorphic cards (`backdrop-blur-md`), soft elevation shadows, and rounded-3xl corners.
- **Global "Reduce Effects" Toggle**: Disables intensive 3D models and heavy Framer Motion transitions (respects `prefers-reduced-motion`).

### 4. 🌐 3D Interactive Features (React Three Fiber + Drei)
- **Hero Section (`LeafyGlobe3D.jsx`)**: Interactive 3D Earth globe with wireframe continents, atmospheric glow, and orbiting low-poly crystal/leaf particles reacting to mouse movement.
- **Impact Dashboard (`EcoForest3D.jsx`)**: Procedural 3D forest that visibly sprouts and blossoms as the cart's average Eco-Score rises towards Grade A.
- **Product 3D Inspect (`Product3DFlipCard.jsx`)**: Interactive CSS 3D card flip showcasing front product imagery and back lifecycle environmental specifications.
- **Automatic Fallback**: If WebGL is unavailable or "Reduce Effects" is turned on, cleanly transitions to static animated SVGs.

### 5. 🤖 Voice-Enabled Eco Agent
- **Web Speech API Voice Input**: Click the microphone icon to speak naturally (progressively enhanced; hidden if unsupported).
- **Streaming Responses**: Live typewriter-style streaming responses for incoming recommendations.
- **Transparent Reasoning**: Expandable *"Why I picked this"* breakdown revealing carbon, plastic, and regional distance metrics.
- **Personalization**: Remembers user preferences (budget limit, favorite categories) stored locally.
- **Weekly Eco Challenge**: Track weekly goals (e.g. swap 3 plastic items), streak counter (🔥), and community leaderboard.
- **Optional Serverless LLM**: Integrated with `/api/agent` (Vercel serverless function); falls back silently to local rule templates if offline or unconfigured.

### 6. 🛍️ Advanced Shopping Capabilities
- **Wishlist**: Save favorite products with 1-click move-to-cart and localStorage persistence.
- **Side-by-Side Product Comparison (`ProductCompareModal.jsx`)**: Compare up to 3 products with visual eco-score breakdown bars.
- **Advanced Filters**: Price range slider, Eco Grade (A-E), packaging material, plastic-free toggle, certifications, rating, material, and active filter chips with a "Clear all" button.
- **Verified Eco Reviews**: Star ratings with verified eco buyer badges saved locally.
- **Coupons & Pincode Estimator**: Discount codes (`GREEN10`, `EARTHDAY`, `ZERO15`) and instant 6-digit Indian PIN delivery estimator for EV fleet transit.
- **Multi-Step Checkout**:
  1. Address & Shipping Details
  2. Plastic-Free Packaging & Gold Standard Carbon Offset (+₹20)
  3. Mock Payment Processing (UPI, Card, Cash on Delivery)
- **Shareable Impact Card**: Downloadable / copyable "I shopped with purpose" achievement card.

### 7. 📈 Gamified Profile & Planetary Ledger (Recharts)
- **User Profile Page**: Tier level (Seedling 🌱, Sapling 🌿, Tree 🌳, Forest Guardian 🛡️) with animated XP progress bar.
- **Animated Recharts**:
  - Monthly avoided carbon footprint area chart.
  - Category breakdown bar chart.
- **Badges Gallery**: Unlocked and locked achievements (*Planetary Steward*, *Zero Plastic Pioneer*, *Eco Alchemist*, *Tree Planter*).
- **Order History**: Complete log with carbon avoidance receipts.

---

## 🔬 The 5-Pillar Eco-Score Formula (`src/lib/ecoScore.js`)

Every product receives a mathematical score from **0 to 100** based on 5 audited sustainability pillars:

$$\text{Eco-Score} = \text{Materials (30\%)} + \text{Packaging (20\%)} + \text{Carbon (25\%)} + \text{Certifications (15\%)} + \text{Proximity (10\%)}$$

| Pillar | Weight | Scoring Logic |
| :--- | :---: | :--- |
| **Renewable & Organic Materials** | **30%** | Upcycled/Organic = 28-30 pts; Wood/Bamboo = 22-26 pts; Recycled/Metal = 15-20 pts; Virgin Plastic = 0-5 pts |
| **Plastic-Free Packaging** | **20%** | 100% Plastic-free / Kraft seed paper = 20 pts; Post-consumer recycled = 14 pts; Virgin plastic packaging = 3 pts |
| **Carbon Footprint** | **25%** | Under 1.0kg CO₂ = 25 pts; 1.0-3.0kg = 18-22 pts; 3.0-6.0kg = 12-16 pts; >10.0kg = 2-6 pts |
| **Third-Party Certifications** | **15%** | 5 pts per certified body (GOTS, FSC, Fair Trade, Zero Waste, Cruelty-Free), capped at 15 pts |
| **Local Sourcing Proximity** | **10%** | < 100km = 10 pts; 100-300km = 8 pts; 300-800km = 5 pts; > 800km = 2 pts |

### Grade Scale
- **Grade A (85–100)**: Exceptional Sustainable Standard (Emerald)
- **Grade B (70–84)**: Very Good Conscious Pick (Teal)
- **Grade C (55–69)**: Moderate Environmental Footprint (Amber)
- **Grade D (40–54)**: High Resource Intensity (Orange)
- **Grade E (0–39)**: Petrochemical / Low Sustainability (Crimson)

---

## 🛠️ Environment Variables Configuration

Copy `.env.example` to `.env` to configure optional online features:

```bash
cp .env.example .env
```

```ini
# Optional: Firebase Authentication (Google Provider)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Optional: Serverless Gemini / LLM Key for /api/agent
ECO_AGENT_API_KEY=
```

*If no environment variables are provided, EcoMart automatically runs in 100% offline-native mode with local Web Crypto SHA-256 auth, rule-based NLP, and zero network dependency.*

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start Vite dev server
npm run dev

# 3. Build for production (Code-split into lean chunks)
npm run build

# 4. Preview production build
npm run preview
```

The application will be live at `http://127.0.0.1:5173/`.

---

## 🚢 Deployment to Vercel

EcoMart includes a preconfigured `vercel.json` with Single Page Application (SPA) rewrite rules:

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Deploy in one command with the Vercel CLI:
```bash
vercel
```

---

## 📄 License
MIT — Original code built for EcoMart. Real photographic product credits are detailed in `/public/images/CREDITS.md`.
