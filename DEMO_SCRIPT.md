# EcoMart Agent — Competition Demo Script & Judge Q&A

**Theme**: *"Don't just shop. Shop with purpose."*  
**Date of Demo**: 31 October 2026  
**Presentation Time**: 5 Minutes Total (including 2-minute Live Scripted Demo)

---

## ⏱️ Part 1: Competition Live Demo Script (< 2 Minutes)

Judges can launch the automated presenter walkthrough by pressing **`P`** on the keyboard anywhere in the app, or follow these 5 steps manually:

| Time | Feature / Step | Action & Visual | Voiceover Script |
|---|---|---|---|
| **0:00 – 0:25** | **1. Multi-Criteria Decision Engine** | Navigate to `/shop`. Open **"My Priorities"**. Drag the **Plastic** slider to 100 and **Price** to 0. Watch cards reorder live. Click **"Why this rank?"** on the #1 card. | *"Judges, EcoMart replaces opaque recommendation algorithms with an autonomous, visible multi-criteria decision engine. Here we rank products across 7 normalized dimensions: Price, Carbon, Plastic, Water, Local radius, Certifications, and EcoScore. When I raise the Plastic priority to 100, zero-plastic items instantly take the top rank. Notice the 'Why this rank?' popover breaking down exact point contributions."* |
| **0:25 – 0:50** | **2. Eco Check Any Product** | Click **"Eco Check"** in the Navbar or Command Palette (`⌘K`). Paste: *"Plastic water bottle, eco friendly, BPA free"*. Click **"Analyze Product"**. | *"Shoppers don't just shop on EcoMart; they evaluate purchases from anywhere. Our offline heuristic analyzer extracts material keywords, packaging clues, and buzzwords. Notice the instant greenwashing alert: it flags the vague 'eco friendly' claim and petroleum plastic, assigns an honest Grade E estimate with medium confidence, and presents 3 certified catalog alternatives with CO₂ avoidance numbers."* |
| **0:50 – 1:15** | **3. Proactive Copilot** | Add a conventional product (e.g., *Single-Use Plastic Cutlery Pack*) to cart. | *"The Eco Agent doesn't wait to be asked. It acts as an autonomous copilot. A non-blocking toast immediately appears offering a 1-tap greener swap to Organic Bamboo Cutlery. Clicking 'Why am I seeing this?' exposes the agent's trigger rule and underlying reasoning. Notice that nudges are strictly rate-limited to 1 per 20s and max 5 per session, and automatically muted in Judge Mode."* |
| **1:15 – 1:35** | **4. Product Lifecycle Explorer** | Open any product detail modal or page (e.g. *Bamboo Toothbrush*), select the **"Lifecycle"** tab. Toggle **"vs Conventional Alternative"**. | *"Sustainability is a full lifecycle story. Here judges can inspect the 5 physical stages: Material Extraction, Making, Transport, Packaging, and End of Life. Each stage compares the eco pick with its conventional alternative using verified quantitative metrics and qualitative audit notes, all clearly labelled 'Estimate' or 'Qualitative'."* |
| **1:35 – 2:00** | **5. Year-Ahead Projection & Purpose Report** | Navigate to `/impact`. Adjust rebuy cadence to monthly, then click **"Export Purpose Report"**. | *"Finally, our Purpose Engine projects the cumulative 12-month community impact of shopping consciously. Shoppers can export a shareable, print-ready Purpose Report card as a high-resolution PNG or PDF, calculating exact kilograms of carbon avoided and liters of water saved using documented EPA/EEA conversion factors."* |

---

## ❓ Part 2: Comprehensive Judge Q&A Guide

### Q1: How does the Priority-Weighted Decision Engine work mathematically?
**Answer**:
The Decision Engine (`src/lib/decisionEngine.js`) implements multi-criteria decision-making (MCDM) across **7 independent dimensions**:
1. **Price** (lower is better, normalized: $(max - val) / (max - min)$)
2. **Carbon footprint** (lower is better)
3. **Plastic grams** (lower is better)
4. **Water consumption** (lower is better)
5. **Local transit distance / madeInKm** (lower is better)
6. **Verified certifications count** (higher is better: $val / max$)
7. **Lifecycle EcoScore** (higher is better: $val / 100$)

Each criterion has a user weight $w_i \in [0, 100]$. The composite score is:
$$\text{Final Score} = \frac{\sum_{i=1}^{7} w_i \times \text{norm}_i}{\sum_{i=1}^{7} w_i} \times 100$$
The engine identifies the top 2 dominant positive contributions for every candidate and generates human-readable explanations (e.g., *"Top factors: Zero plastic packaging (0g) and 3 verified certifications"*). Users can also adjust these weights naturally in conversation with the Eco Agent (e.g., typing *"I care most about price"* automatically sets price priority to 100).

---

### Q2: How does "Eco Check" estimate scores, and what are its limits?
**Answer**:
`Eco Check` (`src/lib/ecoCheck.js`) is an **offline heuristic sustainability parser**:
- **Material Extraction**: Cross-references tokens against dictionaries of renewable materials (*bamboo, organic cotton, jute, stainless steel, glass, cork*) and petrochemical synthetics (*plastic, polyester, nylon, PVC, acrylic, vinyl*).
- **Packaging Clues**: Identifies plastic-free compostable boxes vs. shrink wrap and polybags.
- **Greenwashing Auditing**: Detects overused marketing buzzwords (*"100% eco friendly", "natural", "chemical-free", "biodegradable"*) when unaccompanied by third-party credentials.
- **Confidence Scoring**: 
  - **High**: Multiple verified materials + certifications detected.
  - **Medium**: Clear single-material signal detected.
  - **Low / Clarification Prompt**: Vague or single-word inputs trigger a clarifying question with quick-reply chips rather than guessing.
- **Honesty in UI**: Every calculation is explicitly stamped **"Estimate"** with an explanation of why the score was derived. It never claims laboratory life-cycle assessment precision.

---

### Q3: How does the Proactive Copilot decide when to speak up?
**Answer**:
The Copilot (`src/lib/copilotEngine.js`) is event-driven and non-blocking:
1. **Trigger Conditions**:
   - A conventional or Grade C/D/E product is added to the cart (offers a 1-tap swap).
   - Cart average EcoScore drops by 5+ points.
   - User approaches within 15% of their stated spending budget.
   - User views the same category 3 times in a session (offers a curated starter kit basket).
2. **Rate Limiting & Ergonomics**:
   - Strict cooldown of at least **20 seconds** between consecutive nudges.
   - Hard session ceiling of **at most 5 nudges per session**.
   - Always 1-tap dismissible.
   - Settings toggle allows complete muting.
   - **Judge Mode Suppression**: Automatically silenced in Judge Mode unless explicitly triggered or previewed.
3. **Transparent Reasoning**:
   - Every nudge carries a **"Why am I seeing this?"** dropdown revealing the exact trigger and environmental delta.

---

### Q4: How do user preferences stay on-device without telemetry or cloud tracking?
**Answer**:
EcoMart respects user privacy by operating **100% on-device**:
- Signals tracked: category page views, product modal views, wishlist saves, cart additions, accepted/declined swaps, and priority slider positions.
- All signals are written to the browser's local `localStorage` (keys: `ecomart_preferences`, `ecomart_priorities`, `ecomart_cart`), wrapped in defensive `try/catch` blocks.
- **Guest-First**: Works immediately for guests with zero login, cookies, or remote analytics.
- **User Control**: Both the "For You" section and Settings page provide a prominent **"Reset My Preferences"** button that instantly clears all learned weights back to defaults.

---

### Q5: How does the bilingual Hindi/English system work offline?
**Answer**:
- Local dictionary files (`src/i18n/en.js` and `src/i18n/hi.js`) mapped via a React context hook `useT()`.
- **Devanagari Font Bundling**: Instead of relying on Google Fonts CDN, `@fontsource/noto-sans-devanagari` is bundled as an offline npm package.
- **Dynamic Code-Splitting**: The font stylesheet is dynamically loaded via `import()` only when the user selects Hindi, keeping the default English bundle ultra-lean.
- **Hinglish/Hindi NLP**: The agent understands both Latin script (*"sasta"*, *"sabse sasta"*, *"thela check"*, *"tohfa"*) and Devanagari (*"सस्ता"*, *"झोला"*, *"उपहार"*).

---

### Q6: Which AI tools and engineering stack were used to build the app?
**Answer**:
- **Front-End Framework**: React 19, Vite 8, Tailwind CSS v4 using semantic tokens in `src/styles/tokens.css` ("Aesop meets Apple" editorial design).
- **AI Assisted Development**: Built with Google DeepMind's Antigravity AI pair programmer for autonomous code generation, refactoring, and test-driven verification.
- **Interactive Visuals**: React Three Fiber / Three.js (lazy-loaded biosphere) and Framer Motion for accessible micro-interactions.
- **Reporting & Data**: Recharts for impact projections and `html-to-image` for offline PNG report card rendering.
- **Linting & Testing**: Oxlint running 103 rules (0 errors, 0 warnings) and Vitest running 75 unit/integration tests with 100% pass rate.
- **Offline Purity**: Verified by automated CI script `check-offline-urls.mjs` ensuring 0 remote CDN URLs.
