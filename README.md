# Eco Sense — Shop with Purpose

> A transparent shopping app with an honest AI agent. Built with React 19, Vite, and Tailwind v4.

Eco Sense helps everyday shoppers find green alternatives, spot vague marketing claims, scan barcodes and labels, and make budget-friendly choices. It works in both **English** and **Hindi (हिंदी)**.

---

## ⚡ Quick Start

```bash
git clone https://github.com/example/ecomart-agent.git
cd ecomart-agent
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

---

## 🔑 Environment Variables Setup

Create a `.env` file in the project root:

```ini
# Google Gemini API Key from Google AI Studio (free tier)
GEMINI_API_KEY=your_gemini_api_key_here

# Recommended model
GEMINI_MODEL=gemini-3-flash-preview
AGENT_MODEL=gemini-3-flash-preview

# Supabase (for live catalogue and contact message storage)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Web3Forms Key (for /contact form email delivery)
VITE_WEB3FORMS_KEY=your_web3forms_key_here
```

> **Important Note for Vercel Deployment:**
> After adding or changing environment variables in the Vercel dashboard, **you must redeploy** for changes to take effect.

---

## 📦 Supabase Setup

1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to the **SQL Editor** tab.
3. Paste the contents of `supabase/schema.sql` and click **Run**.
4. To populate the catalogue with 64 products, run:
   ```bash
   node scripts/seed-supabase.mjs
   ```

---

## 📬 Contact Us & Web3Forms Setup

The `/contact` page delivers customer and auditor inquiries using:
1. **Supabase `contact_messages` table:** Saves messages directly to the database via authenticated/anon insert RLS policy.
2. **Web3Forms email delivery:** Dispatches email notifications to your inbox without requiring a complex SMTP server. Get a free key at [web3forms.com](https://web3forms.com/) and paste it as `VITE_WEB3FORMS_KEY`.

---

## 🔍 Barcode & Label Scanner

- **Barcode Scanner (`/scan` or Modal):**
  - Cross-browser decoding using `@zxing/browser` (EAN-13, EAN-8, UPC-A, UPC-E, Code 128, QR).
  - Rear camera detection with camera switcher, torch toggle, and live scan frame overlay.
  - Three-tier lookup cascade:
    1. Supabase / local catalogue
    2. Open Food Facts, Open Beauty Facts, Open Products Facts via `/api/barcode` proxy
    3. Friendly fallback to Label Scanner or manual checksum-validated entry
  - Rich result view with packaging, ingredients, eco-score breakdown estimate, and greener catalogue alternatives.

- **Label Scanner (`/scan`):**
  - Camera capture or photo upload with client-side downscaling (max 1280px, JPEG quality 0.8).
  - Transcribes visible packaging text via Gemini Vision (`/api/scan-label`).
  - Audits printed claims against visible certifications, flags vague buzzwords, and links directly to the Eco Agent.

---

## 🛠️ Verification & Test Commands

```bash
# Run oxlint check (0 errors)
npm run lint

# Run all 438+ automated unit and integration tests
npm test

# Run production build
npm run build
```
