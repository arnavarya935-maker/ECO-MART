# EcoMart Asset Credits & Attribution

All assets used in EcoMart are strictly local (zero runtime external CDN dependencies), licensed for open use or custom created.

## 1. Product Photography
High-resolution photography bundled offline in `/public/images/products/` sourced under the Unsplash Open License:
- **Bamboo Cutlery & Dining**: Eiliv Aceron, Pawel Czerwinski, Kelly Sikkema
- **Personal Care & Soaps**: Sarah Chai, Vie Studio, Monstera Production
- **Fashion & Organic Cottons**: Tamara Bellis, Priscilla Du Preez, Dan Gold
- **Stationery & Seed Paper**: Joanna Kosinska, Sincerely Media, Green Chameleon
- **Home & Decor**: Spacejoy, Sven Brandsma, Nathan Dumlao
- **Bags & Totes**: Sarah Brown, Mel Poole, Laura Chouette
- **Outdoor & Drinkware**: Bluewater Globe, Patrick Hendry, Kateryna Hliznitsova
- **Cleaning & Eco-Friendly Living**: Anton Darius, Daiga Ellaby, Towfiqu barbhuiya

## 2. Branded Vector Illustrations
All product illustration cards, category badges, and swap visual cards in `/public/images/products/*.svg` were custom-crafted for EcoMart. They feature:
- Clean SVG vectors with accessible color gradients
- Consistent typography hierarchy
- 100% offline compatibility with no external font or image dependencies
- Unique visual identity and zero asset duplication

## 3. Audio & Sound FX
Procedural chimes, clicks, pops, and celebratory chimes located in `/public/sounds/` and synthesized via the Web Audio API in `src/lib/audio.js`.
Generated offline with `scripts/generate_audio.mjs`.

## 4. Typography
- Pure local system typography stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- Dyslexia-friendly font fallback using local OpenDyslexic / clean high-legibility geometric letterforms.
