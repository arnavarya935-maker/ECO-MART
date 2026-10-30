/**
 * EcoMart Label Scanner Engine
 * Reads labels of packaged food, drinks, personal care, and cleaning products.
 * Extracts nutrition panels, ingredients, packaging, claims, and certifications verbatim.
 */

export const SAMPLE_LABELS = [
  {
    id: 'sample-nutrition-facts',
    title: 'Nutrition Facts Panel (Uploaded Sample)',
    productType: 'food',
    labelType: 'Sample label (fictional product)',
    subType: 'Nutrition Facts Panel',
    previewColor: 'from-amber-600 to-emerald-800',
    transcription: {
      readable: true,
      is_readable: true,
      is_product_label: true,
      product_type: 'food',
      name: 'Whole Grain Harvest Cereal',
      product_name: 'Whole Grain Harvest Cereal',
      brand: 'Harvest Fields (Fictional)',
      serving_size: '1/2 cup (114g)',
      nutrition_table: [
        { nutrient: 'Calories', amount: '90', dv_percent: null },
        { nutrient: 'Total Fat', amount: '3g', dv_percent: 5 },
        { nutrient: 'Sodium', amount: '300mg', dv_percent: 13 },
        { nutrient: 'Total Carbohydrate', amount: '13g', dv_percent: 5 },
        { nutrient: 'Dietary Fibre', amount: '3g', dv_percent: 12 },
        { nutrient: 'Sugars', amount: '3g', dv_percent: null },
        { nutrient: 'Protein', amount: '3g', dv_percent: null },
        { nutrient: 'Vitamin A', amount: null, dv_percent: 80 },
        { nutrient: 'Vitamin C', amount: null, dv_percent: 60 },
        { nutrient: 'Calcium', amount: null, dv_percent: 4 },
        { nutrient: 'Iron', amount: null, dv_percent: 4 }
      ],
      ingredients: null, // Explicitly null: no ingredient list on panel photo
      allergens: null,
      packaging_material: 'Cardboard outer carton',
      packaging_type: 'Cardboard Box',
      recycling_symbols: ['PAP 21'],
      claims: [
        'Good source of fibre',
        'Rich in vitamins A & C',
        'Low in saturated fat'
      ],
      certifications_visible: [],
      certifications_printed: [],
      country_of_origin: 'India',
      raw_transcription: `Nutrition Facts
Serving Size: 1/2 cup (114g)
Calories: 90
Total Fat: 3g (5% DV)
Sodium: 300mg (13% DV)
Total Carbohydrate: 13g
Dietary Fibre: 3g (12% DV)
Sugars: 3g
Protein: 3g
Vitamin A: 80% DV
Vitamin C: 60% DV
Calcium: 4% DV
Iron: 4% DV`
    }
  },
  {
    id: 'sample-packaged-food',
    title: 'Peanut Butter Granola Bar (Food & Recycling)',
    productType: 'food',
    labelType: 'Sample label (fictional product)',
    subType: 'Packaged Food with Ingredients & Recyclability',
    previewColor: 'from-amber-700 to-yellow-900',
    transcription: {
      readable: true,
      is_readable: true,
      is_product_label: true,
      product_type: 'food',
      name: 'Artisan Peanut Butter Granola Bar',
      product_name: 'Artisan Peanut Butter Granola Bar',
      brand: 'Nature Crunch (Fictional)',
      serving_size: '1 bar (40g)',
      nutrition_table: [
        { nutrient: 'Calories', amount: '180', dv_percent: null },
        { nutrient: 'Total Fat', amount: '8g', dv_percent: 10 },
        { nutrient: 'Saturated Fat', amount: '1.5g', dv_percent: 8 },
        { nutrient: 'Sodium', amount: '140mg', dv_percent: 6 },
        { nutrient: 'Total Carbohydrate', amount: '22g', dv_percent: 8 },
        { nutrient: 'Dietary Fibre', amount: '4g', dv_percent: 14 },
        { nutrient: 'Sugars', amount: '9g', dv_percent: 18 },
        { nutrient: 'Protein', amount: '5g', dv_percent: 10 }
      ],
      ingredients: [
        'Rolled Oats',
        'Roasted Peanuts',
        'Cane Sugar',
        'Palm Oil',
        'Brown Rice Syrup',
        'Sea Salt'
      ],
      allergens: ['Peanuts', 'Gluten (Oats)'],
      packaging_material: 'Metallized Polypropylene film',
      packaging_type: 'Snack Wrapper',
      recycling_symbols: ['PP 5', 'Mobius Loop'],
      claims: [
        '100% Whole Grain Oats',
        'No artificial preservatives',
        'Eco-friendly healthy choice'
      ],
      certifications_visible: [],
      certifications_printed: [],
      country_of_origin: 'India',
      raw_transcription: `Nature Crunch Granola Bar
Serving Size: 1 bar (40g) | Calories: 180
Total Fat: 8g (10% DV) | Saturated Fat: 1.5g (8% DV) | Sodium: 140mg (6% DV)
Carbohydrate: 22g | Fibre: 4g (14% DV) | Sugars: 9g | Protein: 5g
Ingredients: Rolled Oats, Roasted Peanuts, Cane Sugar, Palm Oil, Brown Rice Syrup, Sea Salt.
Allergens: Contains Peanuts and Oats.
Packaging: PP 5 Recyclable Wrapper. Product of India.`
    }
  },
  {
    id: 'sample-shampoo',
    title: 'Tea Tree & Neem Shampoo (Personal Care)',
    productType: 'personal_care',
    labelType: 'Sample label (fictional product)',
    subType: 'Personal Care Product Label',
    previewColor: 'from-emerald-700 to-teal-900',
    transcription: {
      readable: true,
      is_readable: true,
      is_product_label: true,
      product_type: 'personal_care',
      name: 'Clarifying Tea Tree & Neem Shampoo',
      product_name: 'Clarifying Tea Tree & Neem Shampoo',
      brand: 'EcoGlide (Fictional)',
      serving_size: null,
      nutrition_table: null,
      ingredients: [
        'Aqua (Purified Water)',
        'Sodium Laureth Sulfate',
        'Cocamidopropyl Betaine',
        'Melaleuca Alternifolia (Tea Tree) Leaf Oil',
        'Azadirachta Indica (Neem) Leaf Extract',
        'Methylparaben',
        'Synthetic Fragrance (Parfum)',
        'Citric Acid'
      ],
      allergens: ['Parfum / Fragrance compounds'],
      packaging_material: '100% Post-Consumer Recycled HDPE Bottle with PP Cap',
      packaging_type: 'Recyclable Plastic Bottle',
      recycling_symbols: ['HDPE 2 (Bottle)', 'PP 5 (Cap)'],
      claims: [
        'Herbal clarifying formula',
        'Contains organic neem extract',
        'Save our planet initiative'
      ],
      certifications_visible: [],
      certifications_printed: [],
      country_of_origin: 'India',
      raw_transcription: `EcoGlide Clarifying Shampoo (250ml)
Ingredients: Aqua, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Melaleuca Alternifolia Leaf Oil, Azadirachta Indica Leaf Extract, Methylparaben, Synthetic Fragrance, Citric Acid.
Claims: Herbal clarifying formula, Contains organic neem extract, Save our planet initiative.
Bottle: HDPE 2 / Cap: PP 5. Made in New Delhi, India.`
    }
  },
  {
    id: 'sample-cleaning',
    title: 'Multi-Surface Cleaner Pods (Cleaning)',
    productType: 'cleaning',
    labelType: 'Sample label (fictional product)',
    subType: 'Household Cleaning Product Label',
    previewColor: 'from-teal-600 to-cyan-900',
    transcription: {
      readable: true,
      is_readable: true,
      is_product_label: true,
      product_type: 'cleaning',
      name: 'Zero-Waste Laundry & Surface Pods',
      product_name: 'Zero-Waste Laundry & Surface Pods',
      brand: 'BioClean Home (Fictional)',
      serving_size: '1 pod (20g)',
      nutrition_table: null,
      ingredients: [
        'Sodium Carbonate',
        'Sodium Percarbonate',
        'Sodium Tripolyphosphate',
        'Polyvinyl Alcohol (PVA) film wrapper',
        'Citrus Limon Essential Oil'
      ],
      allergens: null,
      packaging_material: 'Uncoated FSC-certified kraft board box',
      packaging_type: 'Plastic-free Box',
      recycling_symbols: ['PAP 20 (Cardboard)', 'Plastic-Free Standard'],
      claims: [
        'Dissolvable plant-based PVA film',
        'Zero synthetic fragrance',
        'Septic tank safe'
      ],
      certifications_visible: [],
      certifications_printed: [],
      country_of_origin: 'India',
      raw_transcription: `BioClean Zero-Waste Pods (30 Pods)
Ingredients: Sodium Carbonate, Sodium Percarbonate, Sodium Tripolyphosphate, Polyvinyl Alcohol Film, Citrus Limon Essential Oil.
Packaging: 100% Plastic-free uncoated kraft board (PAP 20).
Claims: Dissolvable plant-based PVA film, Zero synthetic fragrance, Septic tank safe.`
    }
  }
];

/**
 * Scan and transcribe a product label image via /api/scan-label
 */
export async function scanProductLabel({
  imageBase64 = null,
  mimeType = 'image/jpeg',
  language = 'en',
  sampleId = null
}) {
  // 1. Direct sample selection
  if (sampleId) {
    const sample = SAMPLE_LABELS.find((s) => s.id === sampleId);
    if (sample) {
      return {
        source: 'sample_label',
        sampleId: sample.id,
        sampleTitle: sample.title,
        labelType: sample.labelType,
        ...sample.transcription,
        privacy_guarantee: 'Image is not saved. Processed in transient memory only.'
      };
    }
    throw new Error('Sample label not found.');
  }

  if (!imageBase64) {
    throw new Error('No image data provided for scanning.');
  }

  // 2. Client image size limits
  const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
  if (cleanBase64.length > 3 * 1024 * 1024) {
    throw new Error('Image data exceeds safe 3MB payload limit. Please downscale the image.');
  }

  // 3. Server-side Vision Transcription via Gemini Proxy
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 18000);

    const res = await fetch('/api/scan-label', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        imageBase64: cleanBase64,
        mimeType,
        language
      })
    });

    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data && data.source === 'gemini_vision') {
        const certs = Array.isArray(data.certifications_visible || data.certifications_printed)
          ? (data.certifications_visible || data.certifications_printed).map((c) => ({
              name: c.name || (typeof c === 'string' ? c : ''),
              has_license_number: Boolean(c.has_license_number)
            }))
          : [];

        const recycling = Array.isArray(data.recycling_symbols || data.packaging_marks)
          ? (data.recycling_symbols || data.packaging_marks)
          : [];

        const hasExtractedText = Boolean(
          (data.raw_transcription && data.raw_transcription.trim().length > 10) ||
          (Array.isArray(data.ingredients) && data.ingredients.length > 0) ||
          (Array.isArray(data.nutrition_table) && data.nutrition_table.length > 0) ||
          data.name ||
          data.product_name ||
          (Array.isArray(data.claims) && data.claims.length > 0)
        );

        // Outcome A: Unreadable photo (only when zero legible text could be extracted)
        if ((data.readable === false || data.is_readable === false) && !hasExtractedText) {
          return {
            source: 'gemini_vision',
            readable: false,
            is_readable: false,
            is_product_label: data.is_product_label ?? true,
            unreadable_reason: data.unreadable_reason || 'The text on this packaging label is blurry or unreadable. Please retake a well-lit photo closer to the text.',
            privacy_guarantee: 'Image is not saved.'
          };
        }

        // Outcome B: Non-product label photo
        if (data.is_product_label === false && !hasExtractedText) {
          return {
            source: 'gemini_vision',
            readable: false,
            is_readable: false,
            is_product_label: false,
            reason_if_not: data.reason_if_not || 'No product packaging or label detected in this photo. Please photograph a physical product label.',
            privacy_guarantee: 'Image is not saved.'
          };
        }

        // Outcome C: Valid readable label (or partial label with extracted text)
        return {
          source: 'gemini_vision',
          readable: true,
          is_readable: true,
          is_product_label: true,
          product_type: data.product_type || 'other',
          name: data.name || data.product_name || null,
          product_name: data.name || data.product_name || null,
          brand: data.brand || null,
          serving_size: data.serving_size || null,
          nutrition_table: data.nutrition_table || null,
          ingredients: Array.isArray(data.ingredients) && data.ingredients.length > 0 ? data.ingredients : null,
          allergens: Array.isArray(data.allergens) && data.allergens.length > 0 ? data.allergens : null,
          packaging_material: data.packaging_material || data.packaging_type || null,
          packaging_type: data.packaging_type || data.packaging_material || null,
          recycling_symbols: recycling,
          claims: Array.isArray(data.claims) ? data.claims : [],
          certifications_visible: certs,
          certifications_printed: certs,
          country_of_origin: data.country_of_origin || null,
          raw_transcription: data.raw_transcription || data.raw_ocr_text || '',
          legibility: data.legibility || 'good',
          confidence: data.confidence || {
            product_name: 'high',
            nutrition: 'high',
            ingredients: 'high',
            claims: 'high'
          },
          privacy_guarantee: 'Image is not saved.'
        };
      } else if (data && data.source === 'local_fallback') {
        const reason = data.reason || '';
        if (reason === 'NO_API_KEY_CONFIGURED') {
          throw new Error('AI Vision is running in offline mode. Please test with one of the sample labels below!');
        }
        if (reason.includes('429')) {
          throw new Error('The AI vision service reached its temporary request limit. Please wait a moment and try again, or test with a sample label below.');
        }
        if (reason.includes('503')) {
          throw new Error('The AI vision service is currently experiencing peak traffic. Please try again in a few seconds or test a sample label.');
        }
        if (reason === 'API_TIMEOUT') {
          throw new Error('The scanner request timed out while analyzing the label. Please check your internet connection.');
        }
        throw new Error(`The AI scanner service is temporarily unavailable (${reason}). Please try again or test a sample label.`);
      } else if (data && data.error) {
        throw new Error(data.error);
      }
    } else {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || `Server responded with status ${res.status}`);
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Label scanner request timed out. Please check your internet connection.');
    }
    throw err;
  }

  throw new Error('Could not read product label. Please ensure the label text is sharp, glare-free, and well-illuminated.');
}
