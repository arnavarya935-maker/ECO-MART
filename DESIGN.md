# EcoMart Visual Design System & Specification

> **"Aesop meets Apple"** — calm, tactile, editorial sustainable-brand architecture. Built for instant responsiveness across all devices, from entry-level school Chromebooks to high-DPI desktop displays.

---

## 1. Design Philosophy & Editorial Principles

EcoMart reconciles two design ideals:
1. **The Tactile Warmth of Aesop**: Literary typography (*Fraunces Variable* serif), serene off-white alabaster canvases, botanical forest deep greens, warm amber accents, and generous, unhurried negative space.
2. **The Precision and Speed of Apple**: Razor-sharp digital legibility (*Inter Variable* sans-serif), instantaneous tactile feedback (<100ms active states), container-aware responsive layouts, zero layout shift (CLS: 0.0), and uncompromising accessibility (WCAG AA+).

### Core Pillars
- **Serenity Over Noise**: Sustainability communication often overwhelms users with harsh reds, frantic banners, and cluttered metric dials. EcoMart adopts a calm, editorial voice—every badge, chart, and card feels considered, like an exhibition catalog.
- **Single Source of Truth**: All colors and spatial measurements stem from `src/styles/tokens.css` and are mapped into Tailwind CSS v4 via `@theme`. Components use strictly semantic utilities (`bg-surface`, `bg-surface-raised`, `text-heading`, `text-primary`, `text-muted`, `border-line`, `bg-primary`, `bg-secondary`, `bg-accent`, `bg-success`, `bg-warning`, `bg-danger`, `bg-info`). Raw palette classes (`stone-*`, `emerald-*`, `gray-*`) and arbitrary hex codes are forbidden in application components.
- **100% Offline-Native Reliability**: Zero external CDN calls (`check:urls` verified). Variable fonts (*Fraunces* and *Inter*) are installed via `@fontsource-variable` npm packages and bundled directly into static woff2 files.
- **Adaptive Performance & Low-End Hardware First**:
  - Animations are strictly limited to hardware-accelerated `transform` and `opacity`.
  - Glassmorphic `backdrop-filter: blur()` is restricted strictly to the global navigation bar and floating toasts.
  - When **"Reduce Effects"** or `prefers-reduced-motion` is active, all 3D viewports, particles, blur, parallax, and transitions are completely replaced by static, high-contrast, high-readability 2D editorial cards.

---

## 2. Complete Design System Tokens

### A. Color Scales & Canonical Semantic Mapping
```css
/* Forest Scale (Authoritative typography & deep botanical brand identity) */
--color-forest-50:  #f0f5f2;
--color-forest-100: #dcebe3;
--color-forest-200: #bbd7ca;
--color-forest-300: #8ebda9;
--color-forest-400: #5d9e84;
--color-forest-500: #3b8166;
--color-forest-600: #29664f;
--color-forest-700: #1f4f3e;
--color-forest-800: #173d30;
--color-forest-900: #0B3B2C; /* Core Heading & Identity */
--color-forest-950: #051d16;

/* Emerald Scale (Primary action, verified eco credentials, positive delta) */
--color-emerald-50:  #ecfdf5;
--color-emerald-100: #d1fae5;
--color-emerald-200: #a7f3d0;
--color-emerald-300: #6ee7b7;
--color-emerald-400: #34d399;
--color-emerald-500: #10b981;
--color-emerald-600: #059669; /* Primary Brand Green */
--color-emerald-700: #047857;
--color-emerald-800: #065f46;
--color-emerald-900: #064e3b;

/* Teal Scale (Water conservation, secondary metrics, logistics) */
--color-teal-50:  #f0fdfa;
--color-teal-100: #ccfbf1;
--color-teal-200: #99f6e4;
--color-teal-300: #5eead4;
--color-teal-400: #2dd4bf;
--color-teal-500: #14b8a6;
--color-teal-600: #0d9488; /* Secondary Brand Accent */
--color-teal-700: #0f766e;
--color-teal-800: #115e59;
--color-teal-900: #134e4a;

/* Amber Scale (Highlights, savings incentives, warnings, tier badges) */
--color-amber-50:  #fffbeb;
--color-amber-100: #fef3c7;
--color-amber-200: #fde68a;
--color-amber-300: #fcd34d;
--color-amber-400: #fbbf24;
--color-amber-500: #f59e0b;
--color-amber-600: #d97706; /* Warm Accent */
--color-amber-700: #b45309;
--color-amber-800: #92400e;
--color-amber-900: #78350f;

/* Warm Sand / Neutral Scale (Tactile editorial surfaces & dividers) */
--color-sand-50:  #FAF9F6; /* Primary Canvas Surface */
--color-sand-100: #F3EFEA; /* Sunken Containers & Wells */
--color-sand-200: #E6E2DA; /* Structural Dividing Lines */
--color-sand-300: #D8D2C6;
--color-sand-400: #BCB4A4;
--color-sand-500: #9F9583;
--color-sand-600: #7E7462;
--color-sand-700: #62594A;
--color-sand-800: #463E32;
--color-sand-900: #25201A;

/* Canonical Semantic Tokens */
--color-surface:          var(--color-sand-50);
--color-surface-raised:   #FFFFFF;
--color-surface-sunken:   var(--color-sand-100);
--color-surface-accent:   #E8F4ED;
--color-line:             var(--color-sand-200);
--color-line-subtle:      rgba(11, 59, 44, 0.08);
--color-border:           var(--color-line);
--color-border-subtle:    var(--color-line-subtle);
--color-border-focus:     var(--color-emerald-600);
--color-heading:          var(--color-forest-900);
--color-text:             #11251E;
--color-text-primary:     #11251E;
--color-text-secondary:   #3F534B;
--color-text-muted:       #6E8379;
--color-text-inverted:    #FFFFFF;
--color-primary:          var(--color-emerald-600);
--color-primary-hover:    var(--color-emerald-700);
--color-primary-subtle:   var(--color-emerald-50);
--color-secondary:        var(--color-teal-600);
--color-secondary-hover:  var(--color-teal-700);
--color-secondary-subtle: var(--color-teal-50);
--color-accent:           var(--color-amber-600);
--color-accent-hover:     var(--color-amber-700);
--color-accent-subtle:    var(--color-amber-50);
--color-focus:            var(--color-emerald-600);
--color-success:          var(--color-emerald-600);
--color-success-subtle:   var(--color-emerald-50);
--color-warning:          var(--color-amber-600);
--color-warning-subtle:   var(--color-amber-50);
--color-danger:           #DC2626;
--color-danger-subtle:    #FEF2F2;
--color-info:             var(--color-teal-600);
--color-info-subtle:      var(--color-teal-50);
```

### B. Typography Matrix
- **Display Serif**: *Fraunces Variable* (`@fontsource-variable/fraunces`)
  - Fluid Display: `clamp(2.5rem, 5vw + 1rem, 4.25rem)` | leading: `1.08` | tracking: `-0.035em`
  - Fluid H1: `clamp(2rem, 3.5vw + 0.5rem, 3rem)` | leading: `1.15` | tracking: `-0.03em`
  - Fluid H2: `clamp(1.5rem, 2.5vw + 0.25rem, 2.25rem)` | leading: `1.2` | tracking: `-0.025em`
- **UI & Data Sans**: *Inter Variable* (`@fontsource-variable/inter`)
  - Fluid H3: `clamp(1.25rem, 1.5vw + 0.25rem, 1.625rem)` | leading: `1.3` | tracking: `-0.02em`
  - Fluid H4: `clamp(1.05rem, 1vw + 0.2rem, 1.25rem)` | leading: `1.4` | tracking: `-0.015em`
  - Body Large: `1.125rem` (18px) | leading: `1.6` | tracking: `0`
  - Body Base: `1rem` (16px) | leading: `1.6` | tracking: `0`
  - Body Small: `0.875rem` (14px) | leading: `1.5` | tracking: `0`
  - Caption / Micro: `0.75rem` (12px) | leading: `1.4` | tracking: `0.02em`
- **Dyslexic Support**: *OpenDyslexic* (`@fontsource/opendyslexic`) toggled dynamically via `.font-dyslexic`.

### C. Spacing (4/8 Scale), Radii & Layered Elevations
- **Spacing**: `0px`, `4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`, `40px`, `48px`, `64px`, `80px`, `96px`
- **Radii**:
  - `radius-sm`: `6px` (badges, chips, tooltips)
  - `radius-md`: `12px` (buttons, form inputs, segmented tabs)
  - `radius-lg`: `18px` (cards, dialog header blocks)
  - `radius-xl`: `28px` (hero panels, drawers, modals)
  - `radius-pill`: `9999px` (circular score rings, avatars, pill badges)
- **Forest-Tinted Elevations**:
  - `shadow-soft-sm`: `0 2px 8px -2px rgba(11, 59, 44, 0.05), 0 1px 3px rgba(11, 59, 44, 0.04)`
  - `shadow-soft-md`: `0 10px 25px -5px rgba(11, 59, 44, 0.06), 0 4px 10px -2px rgba(11, 59, 44, 0.03)`
  - `shadow-soft-lg`: `0 20px 40px -10px rgba(11, 59, 44, 0.08), 0 8px 16px -4px rgba(11, 59, 44, 0.04)`
  - `shadow-card`: `0 8px 24px rgba(11, 59, 44, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.9)`

### D. Motion Tokens
- `duration-micro`: `120ms` (hover, active press, toggle clicks)
- `duration-fast`: `200ms` (tab switches, dropdown expand)
- `duration-std`: `320ms` (modal entrances, drawer slides)
- `duration-deliberate`: `500ms` (score ring progress sweep, count-ups)
- `ease-spring`: `cubic-bezier(0.16, 1, 0.3, 1)` (tactile spring physics)
- `ease-enter`: `cubic-bezier(0, 0, 0.2, 1)`
- `ease-exit`: `cubic-bezier(0.4, 0, 1, 1)`

---

## 3. Responsive Layout Strategy Across 6 Breakpoints

| Breakpoint | Window Width | Layout Characteristics |
|---|---|---|
| **Compact Mobile** | `360px` | 1-column product list/grid; bottom navigation tab bar active; bottom sheets for filters & cart; all primary buttons full-width with 44px min tap targets; floating widgets collapsed into icon pills. |
| **Standard Mobile** | `390px` | 1-to-2 column adaptive grid; sticky bottom Add-to-Cart bar on product pages; zero horizontal scrolling; thumb-zone reach for all primary CTAs. |
| **Tablet Portrait** | `768px` | 2-column shop grid; multi-step horizontal checkout stepper; slide-over cart drawer; segmented controls expanded with icons and text. |
| **Compact Laptop** | `1024px` | 3-column shop grid; sticky left-hand filter sidebar; persistent desktop navbar with search pill and cart counter; hero section reveals 3D planetary model alongside serif headline. |
| **Standard Desktop** | `1280px` | 4-column product grid; sticky buy panel on product pages with dual-column editorial story split; side-by-side impact comparison bars. |
| **Ultra-Wide** | `1536px+` | `max-w-7xl` container containment with generous symmetric margins; comfortable line length (max 72 characters for editorial text). |

---

## 4. Component State Reference

All UI components adhere to complete interactive state specifications:

| Component | Default | Hover | Active / Pressed (<100ms) | Focus-Visible | Disabled | Loading / Error |
|---|---|---|---|---|---|---|
| **Button (Primary)** | `bg-forest-900 text-surface-raised` | `bg-forest-800` | `scale-[0.98] bg-forest-950` | `ring-2 ring-focus ring-offset-2` | `opacity-50 pointer-events-none` | `animate-spin` inline circle |
| **Button (Secondary)** | `bg-surface-raised text-heading border border-line` | `bg-surface-sunken border-line` | `scale-[0.98]` | `ring-2 ring-focus ring-offset-2` | `opacity-50 pointer-events-none` | `animate-spin` inline circle |
| **Button (Emerald)** | `bg-primary text-surface-raised` | `bg-primary-hover` | `scale-[0.98]` | `ring-2 ring-focus ring-offset-2` | `opacity-50 pointer-events-none` | `animate-spin` inline circle |
| **Input & Select** | `bg-surface-raised border-line text-text` | `border-line-subtle` | `border-primary` | `ring-2 ring-primary/25 border-primary` | `bg-surface-sunken opacity-60` | Red border + `AlertCircle` + helper |
| **Switch** | `bg-line` (off), `bg-primary` (on) | Soft brightness increase | Thumb scales slightly | `ring-2 ring-focus ring-offset-2` | `opacity-50 cursor-not-allowed` | Immediate toggle response |
| **Slider** | Gradient fill to percentage | Track expands to 10px | Active thumb ring | `ring-2 ring-focus` | `opacity-50 cursor-not-allowed` | Numerical feedback label |
| **Chip & Badge** | `border border-line bg-surface-raised` | `bg-surface-sunken` | Instant toggle | `ring-2 ring-focus` | `opacity-40` | Dismissible `X` button |
| **Progress Ring** | Clean SVG circle with brand track | Hover scale 1.05 | Click opens 5-pillar popover | `ring-2 ring-focus` | — | Smooth 500ms sweep animation |
| **Modal / Drawer** | `bg-surface-raised border-line shadow-soft-xl` | Focus trapped within dialog | Click outside / Esc dismiss | Trap focus cycle (Tab / Shift+Tab) | — | Slide-up sheet on mobile, centered on desktop |
| **Toast** | `backdrop-blur bg-surface-raised/95 border-line shadow-soft-lg` | Pauses timer on hover | Dismiss icon or Undo CTA | Direct keyboard accessible | — | Smooth `slideUpFade` entrance |

---

## 5. Screen & State Verification Checklist

Every route and dialog is verified across three key widths: **Mobile (390px)**, **Tablet (768px)**, and **Desktop (1280px)**.

### A. Core Pages
- [x] **Home Page (`#/`)**:
  - [x] 390px: Full-width editorial hero, clean single-column story sequence, touch-friendly live swap cards, static 2D planetary visualizer fallback when motion reduced.
  - [x] 768px: 2-column category grid, side-by-side swap demo, balanced architectural counter blocks.
  - [x] 1280px: Interactive 3D Safe3D Earth globe, wide editorial typographic masthead, alternating calm surfaces (`surface` and `surface-raised`).
- [x] **Shop Page (`#/shop`)**:
  - [x] 390px: Sticky mobile filter pill bar, bottom-sheet filter drawer with thumb-reach sliders, 1-to-2 column uniform product card grid.
  - [x] 768px: 2-to-3 column grid, quick-filter chips, accessible search input.
  - [x] 1280px: Persistent sticky left-hand filter sidebar, 4-column product grid with uniform 4:3 image aspect ratios.
- [x] **Product Detail Page (`#/product/:id`)**:
  - [x] 390px: Swipeable gallery thumbnails, compact 3-pillar impact cards, sticky bottom add-to-cart bar with price and quantity selector.
  - [x] 768px: Dual-column layout with gallery on left and product information on right.
  - [x] 1280px: Sticky buy panel, comprehensive lifecycle spec table, side-by-side conventional vs eco comparison bars.
- [x] **Cart & Checkout Flow**:
  - [x] 390px: Slide-over sheet cart drawer, free-delivery progress indicator (₹999 threshold), single-column 3-step checkout with instant coupon chips.
  - [x] 768px: Step progress stepper, clean order review breakdown with tax and shipping lines.
  - [x] 1280px: Generous modal checkout with side-by-side cart summary and address/payment forms.
- [x] **Tools Page (`#/tools`)**:
  - [x] 390px: Full-width segmented category tabs, vertical tool cards with 44px tap targets.
  - [x] 768px: 2-column tools directory, interactive carbon and savings sliders.
  - [x] 1280px: 3-column tools grid, instant mathematical feedback without blocking spinners.
- [x] **Community Page (`#/community`)**:
  - [x] 390px: Mobile-optimized pledge wall, clean discussion thread cards, shareable impact card preview.
  - [x] 768px: Leaderboard table with rank badges, clean newsletter subscription card.
  - [x] 1280px: Dual-panel layout (community feed on left, leaderboard and pledges on right).
- [x] **Impact Page (`#/impact`)**:
  - [x] 390px: Stacked metric cards with accessible tabular alternatives for screen readers.
  - [x] 768px: Recharts impact progress chart with brand semantic palette and soft gridlines.
  - [x] 1280px: Full architectural impact dashboard with real-time aggregated community savings.
- [x] **Profile & Orders Pages (`#/profile`, `#/orders`)**:
  - [x] 390px: Order history cards with collapsible status steppers, personal eco badge gallery.
  - [x] 768px: Order detail drawer with downloadable receipt preview.
  - [x] 1280px: Multi-tab account center with addresses, sustainability targets, and order timeline.
- [x] **Settings Page (`#/settings`)**:
  - [x] 390px: Large touch toggles for Reduce Effects, High Contrast, Dyslexia Font, and Text Scaling.
  - [x] 768px: Grouped settings cards with clear descriptive captions.
  - [x] 1280px: Multi-section preference console with real-time live preview.
- [x] **Login & Signup (`#/login`, `#/signup`)**:
  - [x] 390px: Single-column clean form with 44px inputs, offline-safe guest mode option, password strength meter.
  - [x] 768px: Centered card with serene botanical watermark.
  - [x] 1280px: Calm editorial entrance with brand mission sidebar.
- [x] **How It Works Page (`#/how-it-works`)**:
  - [x] 390px: Step-by-step vertical roadmap with icon illustrations and clear micro-copy.
  - [x] 768px: 2-column alternating workflow blocks.
  - [x] 1280px: Architectural timeline diagram showing EcoScore calculation and swap engine.
- [x] **Wishlist Page (`#/wishlist`)**:
  - [x] 390px: 1-column cards with one-tap "Move to Cart" action.
  - [x] 768px: 2-column grid with bulk actions.
  - [x] 1280px: 4-column product grid with instant optimistic removal and Undo toast.
- [x] **404 Page**:
  - [x] 390px: Friendly botanical empty state with primary CTA back to Home.
  - [x] 768px / 1280px: Serene illustration, suggested popular categories, and search bar.

- [x] `WelcomeModal`: 3-step onboarding questionnaire with eco goal selection chips.
- [x] `ProductDetailModal`: Quick-view overlay with gallery, metric badges, sticky buy bar, and Lifecycle tab.
- [x] `ProductCompareModal`: Side-by-side 3-way lifecycle comparison with diff highlighting.
- [x] `BarcodeScannerModal`: Viewfinder frame, matched eco alternatives, and instant simulation triggers.
- [x] `AchievementUnlockedModal`: Editorial celebration badge with gold/amber accent glow.
- [x] `ConfirmationModal`: Environmental impact receipt with order summary and social share actions.
- [x] `ExitIntentModal`: Eco grade recovery offer with 1-click discount application.
- [x] `KeyboardShortcutsModal`: Clean `<kbd>` tags detailing all keyboard commands (including P for Pitch Mode).
- [x] `EcoScorePopover`: 5-pillar mathematical breakdown with accessible visual progress rings.
- [x] `SwapMyCartModal`: Complete before-and-after comparison with bulk swap CTA.
- [x] `CartDrawer`: Slide-over drawer with item steppers, delivery meter, and undo notifications.
- [x] `ShopFilterDrawer`: Mobile bottom-sheet with slider controls, Priorities sliders, and category checkboxes.
- [x] `CommandPalette`: `Cmd/Ctrl+K` searchable index with fuzzy matching, quick actions, and Pitch Mode launcher.
- [x] `PitchModeModal`: 5-step presenter tour dialog with progress dots and keyboard shortcuts (P, Esc, Arrows).
- [x] `PurposeReportModal`: High-resolution exportable Purpose Report card with print stylesheet for clean PDF generation.
- [x] `PrioritiesPanel`: Accessible slider controls (0-100) with 5 presets (Balanced, Save Money, Cut Plastic, Lowest Carbon, Support Local).
- [x] `WhyRankPopover`: Multi-criteria contribution breakdown bar displaying normalized score factors.
- [x] `EcoCheckPage` (`#/eco-check`): Real-world product analyzer with material breakdown, greenwash warnings, and 3 catalog alternatives.
- [x] `ProductLifecycleTimeline`: 5-stage lightweight SVG/CSS horizontal roadmap (Material -> Making -> Transport -> Packaging -> End of Life).

---

## 6. Style Guide Quick Reference

```
Surfaces:
  --color-surface:         #FAF9F6 (Warm Alabaster Canvas)
  --color-surface-raised:  #FFFFFF (Pure Porcelain Card)
  --color-surface-sunken:  #F3EFEA (Sunken Well / Control Background)
  --color-surface-accent:  #E8F4ED (Mint Tinted Surface)

Borders:
  --color-line:            #E6E2DA (Structural 1px Border)
  --color-line-subtle:     rgba(11, 59, 44, 0.08)

Text:
  --color-heading:         #0B3B2C (Botanical Forest 900)
  --color-text:            #11251E (High-Contrast Body)
  --color-text-secondary:  #3F534B (Supporting Descriptions)
  --color-text-muted:      #6E8379 (Micro-Copy & Dividers)

Action Accents:
  --color-primary:         #059669 (Emerald 600 - Primary Action)
  --color-secondary:       #0D9488 (Teal 600 - Secondary Action)
  --color-accent:          #D97706 (Amber 600 - Incentives & Savings)
  --color-danger:          #DC2626 (Alerts & Destructive Actions)
```
