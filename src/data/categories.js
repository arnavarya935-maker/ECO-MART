/**
 * Single Source of Truth for Product Categories in Eco Sense
 * Used across CategoryTiles, ShopFilterBar, ShopFilterDrawer, ShopPage, URL params, and the Eco Agent.
 */

export const CATEGORIES = [
  {
    id: 'kitchen',
    label: 'Kitchen',
    tagline: 'Zero-waste culinary essentials',
    image: '/images/products/kit-01-400.webp',
    fallbackJpg: '/images/products/kit-01.jpg',
    badge: 'Plastic-Free',
    aliases: ['kitchen', 'cooking', 'culinary', 'cookware', 'cutlery', 'dining', 'food & kitchen']
  },
  {
    id: 'personal-care',
    label: 'Personal Care',
    tagline: 'Clean, toxin-free self-care',
    image: '/images/products/care-01-400.webp',
    fallbackJpg: '/images/products/care-01.jpg',
    badge: '100% Organic',
    aliases: ['personal care', 'personal_care', 'personal-care', 'care', 'self-care', 'grooming', 'hygiene', 'beauty']
  },
  {
    id: 'fashion',
    label: 'Fashion',
    tagline: 'Circular, regenerative apparel',
    image: '/images/products/fash-01-400.webp',
    fallbackJpg: '/images/products/fash-01.jpg',
    badge: 'GOTS Certified',
    aliases: ['fashion', 'apparel', 'clothing', 'clothes', 'wear', 'textiles']
  },
  {
    id: 'stationery',
    label: 'Stationery',
    tagline: 'Plantable & post-consumer tools',
    image: '/images/products/stat-01-400.webp',
    fallbackJpg: '/images/products/stat-01.jpg',
    badge: 'Tree-Free',
    aliases: ['stationery', 'stationary', 'office', 'school', 'desk', 'paper', 'notebooks', 'pens']
  },
  {
    id: 'home',
    label: 'Home',
    tagline: 'Artisanal sustainable living',
    image: '/images/products/home-02-400.webp',
    fallbackJpg: '/images/products/home-02.jpg',
    badge: 'Low Carbon',
    aliases: ['home', 'living', 'decor', 'household', 'furniture', 'planters']
  },
  {
    id: 'bags',
    label: 'Bags',
    tagline: 'Heavy-duty natural fiber totes',
    image: '/images/products/bag-01-400.webp',
    fallbackJpg: '/images/products/bag-01.jpg',
    badge: 'Biodegradable',
    aliases: ['bags', 'bag', 'totes', 'backpacks', 'duffels', 'luggage', 'pouches']
  },
  {
    id: 'outdoor-travel',
    label: 'Outdoor & Travel',
    tagline: 'Durable gear built for reuse',
    image: '/images/products/out-02-400.webp',
    fallbackJpg: '/images/products/out-02.jpg',
    badge: 'Closed-Loop',
    aliases: ['outdoor & travel', 'outdoor-travel', 'outdoor_travel', 'outdoor', 'travel', 'outdoors', 'camping', 'adventure']
  },
  {
    id: 'cleaning-laundry',
    label: 'Cleaning & Laundry',
    tagline: 'Greywater-safe plant detergents',
    image: '/images/products/clean-03-400.webp',
    fallbackJpg: '/images/products/clean-03.jpg',
    badge: 'Zero Petrochemicals',
    aliases: ['cleaning & laundry', 'cleaning-laundry', 'cleaning_laundry', 'cleaning', 'laundry', 'cleaners', 'wash', 'detergents']
  }
];

/**
 * Find category by ID (slug)
 */
export function getCategoryById(id) {
  if (!id) return null;
  const cleanId = String(id).trim().toLowerCase();
  return CATEGORIES.find((c) => c.id === cleanId) || null;
}

/**
 * Find category by any identifier (slug, label, or alias)
 */
export function findCategory(identifier) {
  if (!identifier) return null;
  const clean = String(identifier).trim().toLowerCase().replace(/[\s_]+/g, '-');
  const direct = CATEGORIES.find((c) => c.id === clean);
  if (direct) return direct;

  const rawLower = String(identifier).trim().toLowerCase();
  return (
    CATEGORIES.find(
      (c) =>
        c.label.toLowerCase() === rawLower ||
        c.aliases.includes(rawLower) ||
        c.aliases.some((a) => a.replace(/[\s_]+/g, '-') === clean)
    ) || null
  );
}

/**
 * Normalize any category input to its canonical category object or 'all'
 */
export function normalizeCategory(categoryInput) {
  if (!categoryInput || categoryInput === 'All' || categoryInput === 'all') {
    return { id: 'all', label: 'All' };
  }
  const matched = findCategory(categoryInput);
  return matched || { id: 'all', label: 'All' };
}

/**
 * Checks if a product's category matches a filter query (whether id, label, or alias)
 */
export function isMatchingCategory(productCategory, filterInput) {
  if (!filterInput || filterInput === 'All' || filterInput === 'all') {
    return true;
  }
  const filterCat = findCategory(filterInput);
  if (!filterCat) return true;

  const prodCat = findCategory(productCategory);
  if (!prodCat) return false;

  return filterCat.id === prodCat.id;
}
