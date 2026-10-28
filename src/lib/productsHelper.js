import productsHi from '../data/products.hi.json';

/**
 * Returns a product object localized for the current language.
 * When lang === 'hi', substitutes Hindi name, description, badge and ecoHighlights
 * if available in src/data/products.hi.json; falls back gracefully to English.
 */
export function getLocalizedProduct(product, lang = 'en') {
  if (!product) return product;
  if (lang !== 'hi') return product;

  const hiData = productsHi[product.id];
  if (!hiData) return product;

  return {
    ...product,
    name: hiData.name || product.name,
    description: hiData.description || product.description,
    badge: hiData.badge || product.badge,
    ecoHighlights: hiData.ecoHighlights || product.ecoHighlights
  };
}

/**
 * Returns an array of localized products.
 */
export function getLocalizedProducts(products, lang = 'en') {
  if (!Array.isArray(products)) return [];
  if (lang !== 'hi') return products;
  return products.map((p) => getLocalizedProduct(p, lang));
}

