# EcoMart Agent — Chat History & Architectural Context

This document captures the design philosophy, architectural decisions, solved issues, and code conventions established during previous development sessions (conversations `922faed8-7240-4003-a347-3434a6dd82a7` and `a5c60296-bb5b-4ca4-bd87-20b970bd76c7`).

---

## 1. Project Overview & Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 + Vanilla CSS Design Tokens ([src/index.css](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/index.css))
- **3D Visualization**: React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`), Three.js
- **Animation**: Framer Motion (`framer-motion`)
- **Data Visualization**: Recharts
- **Routing**: `react-router-dom` using `HashRouter` (ensuring 100% offline-native reload capability and GitHub Pages / static hosting compatibility)
- **State & Storage**: 100% offline-first local state with IndexedDB / LocalStorage persistence + optional Firebase hybrid sync.

---

## 2. Design System: "Aesop Meets Apple"

- **Aesthetic Direction**: Editorial, warm minimalist, calm sustainable-brand experience.
- **Color Philosophy**:
  - No generic or neon colors. Uses bespoke earthy neutrals, muted sage greens, stone grays, and warm bone/off-whites defined via CSS variables.
  - High WCAG contrast compliance for readability across desktop and low-end devices.
- **Micro-interactions**: Subtle tactile button states, fluid modal overlays (`ConfirmationModal.jsx`), animated segment switchers (`SegmentedControl.jsx`), and smooth 3D product inspection.

---

## 3. Core Modules & Key Features

### A. EcoScore Engine ([src/lib/ecoScore.js](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/lib/ecoScore.js))
- Evaluates products on a transparent 0–100 scale across 5 sustainability pillars:
  1. **Carbon Footprint**
  2. **Water Usage**
  3. **Packaging Recyclability**
  4. **Ethical Labor & Fair Trade**
  5. **Durability & Lifespan**
- Exposed via interactive UI popovers ([src/components/EcoScorePopover.jsx](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/EcoScorePopover.jsx)).

### B. 3D Product Viewer ([src/components/3D/Product3DViewer.jsx](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/3D/Product3DViewer.jsx))
- Interactive 3D preview with customizable materials, lighting, and rotation controls.
- Code-split / lazy-loaded to prevent slowing down initial page loads.

### C. Shopping & Tools Experience
- **Starter Kits**: Bundle-based sustainable kits ([src/components/tools/StarterKits.jsx](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/tools/StarterKits.jsx)).
- **Active Filter Chips**: Instant tag and criteria filtering ([src/components/shop/ShopActiveChips.jsx](file:///c:/Users/AYUSH/Desktop/ecomart%20agent/src/components/shop/ShopActiveChips.jsx)).
- **Intelligent Swaps**: Recommends higher-scoring eco alternatives with quantified carbon/water savings.

---

## 4. Engineering & Code Quality Guarantees

- **Zero-Lint Policy**: All code strictly satisfies `npm run lint` with **0 warnings and 0 errors**.
- **Asset Integrity**: Verified via `test_verification.mjs` and `npm run check` (validates no duplicate or broken image hashes across products).
- **Bundle Optimization**: Lazy chunking for Three.js, lucide icons, and Recharts.
