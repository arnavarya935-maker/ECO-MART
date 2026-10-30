# Eco Sense — 2-Minute Live Demo Script & Judge Q&As

> **Competition Date:** 31 October 2026  
> **Team Goal:** Deliver a clear, confident, 2-minute walkthrough showing judges how Eco Sense makes sustainable shopping transparent, honest, and accessible to everyone.

---

## ⏱️ Word-for-Word 2-Minute Live Presentation

### **[0:00 - 0:20] The Hook: Why We Built Eco Sense**
- **What to click:** Start on the Home page (`/`). Scroll down gently past the headline: *"Shop with purpose. Every score open, every choice honest."*
- **What to say:**  
  *"Good morning, judges. When people want to buy eco-friendly products today, they run into two big problems: vague marketing words like 'pure' or 'natural' that mean nothing, and high prices that don't fit a student budget. We built **Eco Sense** to fix this. It is a bilingual shopping app that rates products on an open mathematical formula and pairs you with an honest AI shopping helper."*

---

### **[0:20 - 0:45] The AI Helper: Real Questions, Real Budgets**
- **What to click:** Click the green **Eco Agent** button in the top navigation. The chat drawer smoothly opens. Click or type:  
  `Show cheapest green option under 300`
- **What to say:**  
  *"Let's ask our Eco Agent a real question: 'Show cheapest green option under 300'. Notice two things right away: first, the chat shows whether the reply came from our cloud Gemini model or our built-in local helper. Second, every single item returned is strictly under 300 rupees and sorted by price. The AI cannot make up prices or fake products because prices come directly from our catalogue code."*

---

### **[0:45 - 1:10] Transparent Math: "How Did I Decide This?"**
- **What to click:** Click on the **Coconut Bowl Set** or any product card. Click **Why this score?** to expand the 5-pillar breakdown.
- **What to say:**  
  *"Instead of a mystery 5-star rating, Eco Sense uses an open 5-pillar formula: Materials 30%, Packaging 20%, Carbon footprint 25%, Certifications 15%, and Local Proximity 10%. Under the answer, judges can click 'How did I decide this?' to inspect the full trace: what keywords were parsed, what filters were applied, and the confidence level. Nothing is hidden in a black box."*

---

### **[1:10 - 1:35] Cart Transformer: Swap My List**
- **What to click:** Click **Swap My List** in the top navigation (`/transform`). Click **Load Sample List** (bamboo toothbrush, steel bottle, cotton bag), set budget to ₹1500, and click **Transform List**.
- **What to say:**  
  *"Most people already have a handwritten grocery list. With our 'Swap My List' feature, shoppers can paste a plain text list. Our multi-choice knapsack algorithm finds green swaps and fits them into your exact budget while maximizing your total EcoScore. In one click, you see before and after: plastic avoided, carbon saved, and total cost."*

---

### **[1:35 - 1:50] Bilingual Hindi Support & Real Health Status**
- **What to click:** Click the language pill **हिंदी** in the top bar. The entire interface, navigation, and product descriptions instantly switch to natural Hindi. Then click **Settings** (`/settings`).
- **What to say:**  
  *"Over 500 million people speak Hindi. With one click, the entire app—including all 64 products, categories, and AI explanations—switches to simple spoken Hindi. In Settings, judges can inspect our live AI Helper health check: it measures latency down to the millisecond, caches safely for 60 seconds, and never exposes our private API key."*

---

### **[1:50 - 2:00] Closing & Summary**
- **What to click:** Click back to the Home page or show the Cart with the green impact badge.
- **What to say:**  
  *"Eco Sense proves that AI in e-commerce doesn't need to be flashy trickery. It should be honest, explainable, and accessible to everyone. Thank you, and we welcome your questions!"*

---

## 🛡️ What Could Go Wrong & How to Recover Live

| Risk | What Happens | How to Recover |
| :--- | :--- | :--- |
| **School Wi-Fi drops completely** | Gemini API call cannot connect. | **Smile and say:** *"Notice that Eco Sense doesn't break! Our built-in local helper takes over automatically with 0ms latency. The reply tag updates honestly from 'Gemini' to 'Built-in helper'."* |
| **Gemini rate limits (429) or times out** | Cloud call takes over 12 seconds or hits free quota. | Our server automatically returns `{ source: 'local_fallback', reason: 'RATE_LIMITED' }` and the local rule engine provides the catalogue response. |
| **Judge asks to test a joke or off-topic question** (e.g. *"Will you go on a date with me?"*) | Off-topic safety filter kicks in immediately. | The assistant replies kindly: *"I am the Eco Sense shopping helper. I can help you find eco-friendly products, compare, plan a basket, or check a claim."* and provides 3 helpful suggestion chips. |
| **Typo while typing on stage** (e.g. *"toothbrsh"*) | Typo tolerance detects Levenshtein distance <= 2. | The app offers a friendly *"Did you mean toothbrush?"* chip without breaking search. |

---

## 🎯 15 Judge Q&As with Honest Answers

### 1. "Is this really AI or just a bunch of if-statements?"
> **Answer:**  
> *"It is a hybrid system built on the principle of using the right tool for the job. For natural language understanding and conversational explanations, we use Google Gemini 1.5 Flash when online. But for product prices, EcoScores, and inventory, we deliberately use deterministic mathematical algorithms and rules. If an AI LLM calculated prices, it could hallucinate ₹100 instead of ₹499. We use Gemini for language, and math for truth."*

---

### 2. "Where does the 89 EcoScore come from? Did you make up the numbers?"
> **Answer:**  
> *"The 89 score is computed dynamically using a published 5-pillar lifecycle formula:  
> - **Materials (30%):** biodegradable bamboo vs virgin plastic.  
> - **Packaging (20%):** kraft paper vs plastic wrap.  
> - **Carbon Footprint (25%):** estimated kg CO₂e from raw materials to store.  
> - **Certifications (15%):** FSC, USDA Organic, or Fair Trade.  
> - **Proximity (10%):** distance from local maker hubs in India.  
> Every product card allows you to click 'Why this score?' to inspect the exact math."*

---

### 3. "Can this application work completely offline?"
> **Answer:**  
> *"Yes. Eco Sense is a Progressive Web App (PWA). All 64 products, images, fonts, styles, and the local rule engine are bundled directly into the browser. If you turn off Wi-Fi right now, you can still search products, filter by budget, calculate scores, swap lists, and checkout to a local order receipt."*

---

### 4. "What happens if Gemini is down or the API key runs out of quota?"
> **Answer:**  
> *"Our server enforces a 12-second primary timeout and a 20-second client limit. If the Gemini API fails, returns 429 (rate limit), or 404, the server gracefully returns a structured JSON fallback. The app never crashes or shows a raw error. It displays the built-in helper's answer with a small honest tag stating: 'Built-in helper'."*

---

### 5. "Why didn't you just call Gemini directly from the browser?"
> **Answer:**  
> *"Calling Gemini directly from the browser would expose our private `GEMINI_API_KEY` in DevTools network tabs where any user could steal it. Instead, we built a secure Vercel serverless proxy (`/api/agent`). The proxy keeps the key hidden in server environment variables, enforces a 30 req/min rate limit, and strips personal data like emails or phone numbers before forwarding to Gemini."*

---

### 6. "What did you build yourselves versus what came from libraries?"
> **Answer:**  
> *"We used industry-standard UI libraries: React 19, Vite, Tailwind v4, Lucide icons, and Recharts for charts.  
> **What we wrote ourselves:**  
> - The entire 5-pillar EcoScore calculation engine.  
> - The Cart Transformer knapsack optimization algorithm.  
> - The bilingual English and Hindi translation dictionary and Devanagari typography setup.  
> - The greenwashing detection heuristics.  
> - The serverless proxy with PII sanitization and health monitoring.  
> - Over 350 automated unit, integration, and smoke tests."*

---

### 7. "How do you prevent the AI from hallucinating prices or products?"
> **Answer:**  
> *"We use **Strict Catalogue Grounding**. The cloud model is only allowed to suggest category names and write friendly sentences. Product prices, IDs, and impact metrics are injected strictly from our verified local `products.json` catalogue. If the model mentions a product ID or price not in our database, our code automatically discards it."*

---

### 8. "How does the Cart Transformer decide which items to buy under a budget?"
> **Answer:**  
> *"It solves a Multi-Choice Knapsack Problem (MCKP). For each item on your list, it identifies viable eco-friendly alternatives from our catalogue. Then, using dynamic programming, it picks the combination of products that minimizes total carbon and plastic waste while staying strictly within your rupee budget limit."*

---

### 9. "How do you check for greenwashing without a laboratory?"
> **Answer:**  
> *"Our 'Truth Lab' audits product descriptions against two checks:  
> 1. Does the seller use vague buzzwords ('pure', 'natural', 'eco', 'earth-friendly')?  
> 2. Does the product actually possess a verified third-party certification (e.g. FSC, GOTS, USDA Organic) to back up those words?  
> If buzzwords are found with zero certifications and a low score, the app flags the item with 'Worth a second look — vague claims'."*

---

### 10. "Why did you build full Hindi support instead of using Google Translate on the fly?"
> **Answer:**  
> *"Live browser translation often mangles technical words and breaks responsive layouts. We created `src/i18n/hi.js` with natural spoken Hindi (for example 'बैग में डालें' instead of weird literal translations), generated localized names for all 64 products (`products.hi.json`), and crafted Devanagari typography with 1.65 line-height so Hindi reads beautifully without text clipping."*

---

### 11. "Where are user carts and orders stored? Is there any tracking?"
> **Answer:**  
> *"Everything is stored locally on the user's device in `localStorage`. There are no external tracking cookies, no Google Analytics pixels, and no user surveillance. Shoppers can visit our **Privacy Center** at any time to view, export their data as JSON, or wipe it in one click."*

---

### 12. "What happens if a user asks a personal question or tries to troll the AI?"
> **Answer:**  
> *"We have an upfront Intent Guardrail. Off-topic questions—like dating, politics, math homework, or weather—are intercepted before calling the model. The assistant gives a polite, kind response stating its purpose as an eco shopping helper, gives 3 sample shopping chips, and never modifies the saved user cart or context."*

---

### 13. "How did you ensure accessibility for users with disabilities?"
> **Answer:**  
> *"We followed WCAG 2.1 AA standards:  
> - Minimum touch target size of 44x44 pixels (`min-h-[44px]`) on all interactive buttons.  
> - A dedicated 'High Contrast' mode in Settings for visually impaired users.  
> - A 'Reduce effects' mode that disables 3D canvas and animations for users sensitive to motion.  
> - Screen reader labels (`aria-label`) on all icon-only buttons."*

---

### 14. "What makes your EcoScore better than an ordinary star rating?"
> **Answer:**  
> *"Star ratings on shopping websites are subjective customer opinions—often influenced by delivery speed or packaging condition rather than actual environmental impact. EcoScore is an objective, standardized metric based on materials, cradle-to-gate carbon estimates, and recyclability. It treats sustainability as an engineering metric, not a popularity contest."*

---

### 15. "If a seller claims a certification, does your app blindly trust them?"
> **Answer:**  
> *"No. We make it completely clear in our honesty audit and on the product page that certifications in our sample catalogue are 'Claimed by Seller'. Furthermore, our system audits whether those claimed certifications match recognized registry standards. If an unverified seller claims '100% Organic' without a standard body, our Trust Passport highlights it for scrutiny."*

