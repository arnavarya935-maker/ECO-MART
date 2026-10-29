/**
 * Server-side Open Food Facts proxy endpoint
 * Safely queries Open Food Facts without exposing browser to external CORS/tracking.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const code = (req.query?.code || req.body?.code || '').trim();

  if (!code || !/^\d{8,14}$/.test(code)) {
    return res.status(400).json({ error: 'Invalid barcode format. Expected 8-14 numeric digits.' });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const offUrl = `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(code)}.json`;
    const response = await fetch(offUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'EcoSense - School Competition Project - Version 1.0'
      }
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(200).json({
        found: false,
        barcode: code,
        message: 'Product not found in Open Food Facts database.'
      });
    }

    const data = await response.json();
    if (data.status === 1 && data.product) {
      const p = data.product;
      return res.status(200).json({
        found: true,
        source: 'open_food_facts',
        barcode: code,
        name: p.product_name || p.product_name_en || 'Scanned Packaged Product',
        brand: p.brands || 'Unknown Brand',
        packaging: p.packaging || 'Packaged item',
        ecoGrade: p.ecoscore_grade ? p.ecoscore_grade.toUpperCase() : 'C',
        nutriscore: p.nutriscore_grade ? p.nutriscore_grade.toUpperCase() : null,
        imageUrl: p.image_front_url || p.image_url || null,
        ingredientsText: p.ingredients_text || null
      });
    }

    return res.status(200).json({
      found: false,
      barcode: code,
      message: 'Product not found in Open Food Facts database.'
    });
  } catch (err) {
    return res.status(200).json({
      found: false,
      barcode: code,
      message: 'Network offline or lookup timed out. You can browse our sample catalogue.'
    });
  }
}

