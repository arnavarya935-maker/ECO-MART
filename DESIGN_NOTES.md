# EcoMart Design Notes: Reference Analysis & Eco-Identity Adaptation

Visual direction inspired by the dark editorial engineering-studio website (`https://ave-engineers.vercel.app` — "Northline Studio | Engineering & Design").
In accordance with competition guideline 6 (Originality), **zero source code, SVG assets, text, or templates were copied**. All tokens, styles, components, and assets are 100% original, authored from scratch for EcoMart's eco-shopping intelligence platform.

---

## 1. Reference Token Extraction vs. EcoMart Eco Adaptation

| Token Category | Reference Website (`ave-engineers.vercel.app`) | EcoMart Eco-Dark Adaptation | EcoMart Light Theme (Preserved) |
|---|---|---|---|
| **Canvas Background** | `#050505` (`bg-void`), theme-color `#050505` | Deep Forest-Black: `#04100B` to `#07140F` (`--color-surface`) | Warm Sand / Alabaster: `#F6FAF7` |
| **Raised Surfaces** | `#101013`, `#0A0A0B`, `#111111` | Forest Charcoal & Raised Panels: `#0D1C16`, `#12241C` | Crisp White: `#FFFFFF` |
| **Sunken Containers** | `#070707`, `#18181c` | Deep Moss Sunken: `#06120D` | Muted Sand: `#EBF3EE` |
| **Primary Text** | `#F4F4F1` / `#FFFFFF` | Crisp Off-White: `#F4F7F5` (15.8:1 contrast on `#05100B`) | Deep Evergreen: `#11251E` (14.2:1 contrast) |
| **Muted Text** | `text-white/55` (`#8C8C8C`), `text-white/40` | Muted Sage Silver: `#98AAA0` (6.2:1 contrast $\ge 4.5:1$) | Muted Evergreen: `#566B61` (5.1:1 contrast) |
| **Subtle Hairlines** | `rgba(255, 255, 255, 0.06 - 0.12)` | Hairline Emerald/White: `rgba(255, 255, 255, 0.08)` to `0.12` | Soft Line: `#D8E6DD` |
| **Primary Accent** | Acid Lime `#ccff00` | Emerald Glow: `#34D399` / `#10B981` (`--color-primary`) | Forest Emerald: `#047857` |
| **Secondary Accent**| Steel Cyan / Zinc `#a1a1aa` | Bio-Teal: `#2DD4BF` / `#14B8A6` (`--color-secondary`) | Deep Teal: `#0F766E` |
| **Highlight Accent**| Rare Acid Pop | Warm Amber Pop: `#F59E0B` / `#FBBF24` (rare alerts/savings) | Amber 700: `#B45309` |
| **Display Headings** | Archivo Variable (font-stretch: 115%) | Plus Jakarta Sans / Inter Variable (`tracking-tight`) + Fraunces italic serif highlight | Fraunces Variable & Plus Jakarta Sans |
| **Monospace / Labels**| Geist Mono Variable, uppercase, `tracking-[0.18em]` | System Mono / Inter Mono, `0.18em - 0.22em`, small-caps | Mono uppercase, `tracking-[0.18em]` |
| **Heading Sizes (Desktop 1440px)** | `clamp(3rem, 6.4vw, 5.5rem)`, line-height `1.02` | `clamp(3rem, 6.2vw, 5.25rem)`, line-height `1.03`, `text-balance` | Fluid clamp scale |
| **Heading Sizes (Mobile 390px)** | `clamp(2.6rem, 7.6vw, 3.6rem)` | `clamp(2.2rem, 7.2vw, 3.2rem)`, tight line-height `1.05` | Fluid clamp scale |
| **Section Spacing** | `py-28 md:py-36` (7rem to 9rem) | `py-24 md:py-32` with clean negative space | `py-20 md:py-28` |
| **Container Width** | `max-w-6xl` (72rem / 1152px) | `max-w-6xl` (72rem) with `px-6 md:px-10` padding | `max-w-6xl` |
| **Border Radii** | `rounded-xl` (12px), `rounded-full` (pills) | `rounded-xl` (cards), `rounded-2xl` (frames), `rounded-full` (pills) | `rounded-xl` / `rounded-2xl` |
| **Shadows & Glows** | Deep ambient dark shadows, top-rim light `inset 0 1px #fff3` | Forest emerald radial aura, soft glass rim, `box-shadow: 0 -10px 40px rgba(0,0,0,0.6)` | Soft diffuse shadow |
| **Button Style** | Liquid Pill: glass rim, backdrop-blur, uppercase tracking | Liquid Pill: glass border `rgba(255,255,255,0.18)`, emerald aura, uppercase mono | Solid & gradient primary |
| **Motion Character**| Subtle fade-up 0.7s `cubic-bezier(0.22, 1, 0.36, 1)`, scale `1.04` | Smooth 0.6s transform/opacity only; zero blur/jitter on laptops | Instant under `reduced-motion` |

---

## 2. Key Design Principles Translated into EcoMart

1. **Dark Cinematic Canvas**: Near-black forest `#04100B` with subtle radial emerald ambient glow behind hero and wordmark.
2. **Hero Expression**: Large display headline with one emphasized word in an editorial italic serif highlight (`Fraunces`), accompanied by a mono eyebrow (`"EST. 2026 · AI-POWERED RESPONSIBLE SHOPPING"`).
3. **Numbered Editorial Sections**: High-contrast small-caps eyebrow markers (`"01 · PURPOSE"`, `"02 · ARCHITECTURE"`, `"03 · AGENT ENGINE"`, `"04 · VERIFIED IMPACT"`).
4. **Interactive Feature Grid with Live Mini-Visuals**: Cards featuring live CSS/SVG indicators:
   - Dynamic EcoScore Grade Ring (A–F)
   - Cart Transformer Before vs After Mini-Diagram
   - Real-time Lifecycle Carbon Meter
   - Circular Packaging Metric
5. **Signature Showcase ("Selected Innovations")**: Large high-res product packshots on soft contrasting panels, metadata chips (Category / Packaging / EcoScore / Carbon), and direct links.
6. **Sticky "How Eco Agent Works" Journey**: Side-by-side progression (Understand $\rightarrow$ Match $\rightarrow$ Optimise $\rightarrow$ Explain) with active state tracking.
7. **Fill-in-the-Blanks Interactive Entry**: *"Hi, I'm [Name] and I want to find [Item/List] under [₹ Budget]"* which pre-populates and opens the Eco Agent or Cart Transformer.
8. **Monumental Wordmark Footer**: Low-contrast, wide-tracked `"ECOMART®"` spanning the screen width above an emerald atmospheric planet glow.
9. **Accessibility & Performance Guards**:
   - Strictly 100% offline, zero CDN calls (`npm run check:urls` passes).
   - Under `html.reduced-motion` and `prefers-reduced-motion`, all transforms and pulses turn off instantly.
   - Under `html.high-contrast`, all glow gradients are removed and borders are boosted to pure solid lines.
   - Text contrast on all surfaces exceeds WCAG AA ($\ge 4.5:1$ for body, $\ge 3:1$ for large headings).
