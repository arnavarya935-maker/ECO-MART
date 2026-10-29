/**
 * EcoMart Label Scanner Engine (Phase 2 Rebuild)
 *
 * GOAL: The scanner ONLY reads what is printed on the label and shows it accurately.
 * No scoring, no verdicts, no extra fluff.
 * Certifications are never marked verified ("Printed on label. Check the issuer's registry.").
 *
 * PRIVACY:
 * Images are downscaled client-side, processed in transient memory, and NEVER saved.
 */

export const SAMPLE_LABELS = [
  {
    id: 'sample-shampoo',
    title: 'Botanical Herbal Shampoo',
    labelType: 'Sample label (fictional product)',
    previewColor: 'from-emerald-700 to-teal-900',
    transcription: {
      is_product_label: true,
      reason_if_not: null,
      product_name: 'Botanical Herbal Shampoo',
      brand: 'EcoGlide (Fictional)',
      net_quantity: '250 ml',
      ingredients: [
        'Aqua (Purified Water)',
        'Sodium Lauroyl Sarcosinate (Coconut-derived)',
        'Aloe Barbadensis Leaf Juice',
        'Azadirachta Indica (Neem) Leaf Extract',
        'Citric Acid'
      ],
      claims: [
        'Herbal botanical formula',
        'Plant-derived surfactants',
        'Contains organic neem extract',
        'Save our planet initiative'
      ],
      certifications_printed: [],
      packaging_marks: [
        'HDPE 2 recycling symbol',
        'Please rinse and recycle bottle'
      ],
      manufacturer: 'Nature Care Laboratories Ltd, Okhla Industrial Area, New Delhi',
      country_of_origin: 'India',
      batch_mfg_expiry: 'Mfg: 04/2026, Exp: 03/2028, Batch: NL-26A',
      barcode_number: '8901234567890',
      usage_instructions: 'Apply generous amount to wet hair, massage into lather, rinse thoroughly with water.',
      disposal_instructions: 'Rinse empty bottle thoroughly and place in designated municipal dry plastic bin.',
      warnings: 'For external use only. Avoid contact with eyes. In case of contact, flush immediately with water.',
      language_detected: 'en',
      legibility: 'good',
      confidence: {
        product_name: 'high',
        ingredients: 'high',
        claims: 'high',
        certifications: 'high'
      }
    }
  },
  {
    id: 'sample-khadi-tote',
    title: 'Hand-loomed Cotton Tote Bag',
    labelType: 'Sample label (fictional product)',
    previewColor: 'from-amber-700 to-stone-800',
    transcription: {
      is_product_label: true,
      reason_if_not: null,
      product_name: 'Hand-loomed Cotton Tote Bag',
      brand: 'Kaveri Valley Textiles (Fictional)',
      net_quantity: '1 Unit (38cm x 42cm)',
      ingredients: [
        '100% Cotton'
      ],
      claims: [
        '100% Organic Cotton',
        'Hand-loomed by artisan cooperative',
        'Azo-free natural vegetable dyes'
      ],
      certifications_printed: [
        {
          name: 'GOTS Certified Organic',
          has_license_number: true
        }
      ],
      packaging_marks: [
        '100% post-consumer recycled paper hangtag'
      ],
      manufacturer: 'Kaveri Valley Artisan Cooperative, Erode, Tamil Nadu',
      country_of_origin: 'India',
      batch_mfg_expiry: 'Lot: KV-2026-T4',
      barcode_number: '8905551234567',
      usage_instructions: 'Gentle hand wash in cold water with mild detergent. Line dry in shade.',
      disposal_instructions: 'Biodegradable natural cotton fiber. Suitable for backyard composting at end of life.',
      warnings: 'Natural vegetable dyes may release minor color during initial wash.',
      language_detected: 'en',
      legibility: 'good',
      confidence: {
        product_name: 'high',
        ingredients: 'high',
        claims: 'high',
        certifications: 'high'
      }
    }
  },
  {
    id: 'sample-detergent-pods',
    title: 'Dishwasher Detergent Pods',
    labelType: 'Sample label (fictional product)',
    previewColor: 'from-teal-600 to-cyan-900',
    transcription: {
      is_product_label: true,
      reason_if_not: null,
      product_name: 'Zero-Waste Dishwasher Detergent Pods',
      brand: 'BioClean Home (Fictional)',
      net_quantity: '30 Pods (Net Wt. 600g)',
      ingredients: [
        'Sodium Carbonate',
        'Sodium Percarbonate',
        'Citric Acid',
        'Polyvinyl Alcohol (PVA) film wrapper',
        'Citrus Limon (Lemon) Essential Oil'
      ],
      claims: [
        'Dissolvable plant-based PVA film',
        'Zero synthetic fragrance',
        'Septic tank safe'
      ],
      certifications_printed: [],
      packaging_marks: [
        'Uncoated kraft board box',
        'Plastic-free packaging'
      ],
      manufacturer: 'BioClean Eco Innovations Pvt Ltd, Whitefield, Bengaluru, Karnataka',
      country_of_origin: 'India',
      batch_mfg_expiry: 'Batch: BC-882, Mfg: 02/2026',
      barcode_number: '8908889990001',
      usage_instructions: 'Handle with dry hands only. Place one pod in dishwasher main dispenser cup. Do not puncture.',
      disposal_instructions: 'Recycle cardboard box with paper stream or place in home compost bin.',
      warnings: 'Keep out of reach of children. Causes serious eye irritation. If swallowed, call poison control.',
      language_detected: 'en',
      legibility: 'good',
      confidence: {
        product_name: 'high',
        ingredients: 'high',
        claims: 'high',
        certifications: 'high'
      }
    }
  }
];

/**
 * Lazy-load on-device OCR using Tesseract.js
 * Shows honest raw OCR text if offline or API unavailable
 */
async function performOnDeviceOcr(imageSource) {
  if (typeof window === 'undefined' || typeof Worker === 'undefined') {
    throw new Error('On-device OCR is only supported in browser environments.');
  }

  try {
    const tesseract = await import('tesseract.js');
    const createWorker = tesseract.createWorker || tesseract.default?.createWorker;

    if (!createWorker) {
      throw new Error('Tesseract worker constructor unavailable');
    }

    const worker = await createWorker('eng', 1, {
      workerPath: '/ocr/worker.min.js',
      corePath: '/ocr/tesseract-core.wasm.js',
      langPath: '/ocr',
      logger: () => {}
    });

    const result = await worker.recognize(imageSource);
    await worker.terminate();

    const text = result?.data?.text?.trim();
    if (!text) {
      throw new Error('No legible text detected');
    }

    return text;
  } catch {
    throw new Error('On-device OCR could not transcribe text from this image.');
  }
}

/**
 * Scan and transcribe a product label image
 *
 * @param {Object} options
 * @param {string} [options.imageBase64] - Base64 encoded image string (already downscaled)
 * @param {string} [options.mimeType='image/jpeg']
 * @param {string} [options.language='en']
 * @param {string} [options.sampleId] - Pick an offline sample label
 * @returns {Promise<Object>} Transcribed label data matching strict schema
 */
export async function scanProductLabel({
  imageBase64 = null,
  mimeType = 'image/jpeg',
  language = 'en',
  sampleId = null
}) {
  // 1. Direct offline sample selection
  if (sampleId) {
    const sample = SAMPLE_LABELS.find((s) => s.id === sampleId);
    if (sample) {
      return {
        source: 'sample_label',
        sampleId: sample.id,
        sampleTitle: sample.title,
        labelType: sample.labelType,
        ...sample.transcription,
        privacy_guarantee: 'Image is not saved.'
      };
    }
    throw new Error('Sample label not found.');
  }

  if (!imageBase64) {
    throw new Error('No image data provided for scanning.');
  }

  // 2. Serverless safe transmission limit guard
  const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
  if (cleanBase64.length > 3 * 1024 * 1024) {
    throw new Error('Image data exceeds safe 3MB limit. Please downscale the image.');
  }

  // 3. Attempt Server-side Vision Transcription via Gemini Proxy (if online)
  const isOnline = typeof window !== 'undefined'
    ? true
    : true;

  if (isOnline) {
    try {
      const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

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
        // If the model determined it is not a product label, return non-label verdict honestly
        if (data.is_product_label === false) {
          return {
            source: 'gemini_vision',
            is_product_label: false,
            reason_if_not: data.reason_if_not || 'No product label detected in photo.',
            privacy_guarantee: 'Image is not saved.'
          };
        }

        return {
          source: 'gemini_vision',
          is_product_label: true,
          product_name: data.product_name || null,
          brand: data.brand || null,
          net_quantity: data.net_quantity || null,
          ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
          claims: Array.isArray(data.claims) ? data.claims : [],
          certifications_printed: Array.isArray(data.certifications_printed)
            ? data.certifications_printed.map((c) => ({
                name: c.name || (typeof c === 'string' ? c : ''),
                has_license_number: Boolean(c.has_license_number)
              }))
            : [],
          packaging_marks: Array.isArray(data.packaging_marks) ? data.packaging_marks : [],
          manufacturer: data.manufacturer || null,
          country_of_origin: data.country_of_origin || null,
          batch_mfg_expiry: data.batch_mfg_expiry || null,
          barcode_number: data.barcode_number || null,
          usage_instructions: data.usage_instructions || null,
          disposal_instructions: data.disposal_instructions || null,
          warnings: data.warnings || null,
          language_detected: data.language_detected || 'en',
          legibility: data.legibility || 'good',
          confidence: data.confidence || {
            product_name: 'medium',
            ingredients: 'medium',
            claims: 'medium',
            certifications: 'medium'
          },
          privacy_guarantee: 'Image is not saved.'
        };
      }
    }
  } catch {
    // API unavailable or timed out; proceed to offline OCR fallback
  }
}

  // 4. Offline Fallback: Lazy-load On-Device Tesseract.js OCR
  // Note: NEVER invent fake claims, ingredients, or scores.
  try {
    const rawOcrText = await performOnDeviceOcr(imageBase64);
    if (rawOcrText && rawOcrText.length > 5) {
      return {
        source: 'on_device_ocr',
        is_product_label: true,
        ocr_note: 'OCR text, may contain errors',
        raw_ocr_text: rawOcrText,
        product_name: null,
        brand: null,
        net_quantity: null,
        ingredients: [],
        claims: [],
        certifications_printed: [],
        packaging_marks: [],
        manufacturer: null,
        country_of_origin: null,
        batch_mfg_expiry: null,
        barcode_number: null,
        usage_instructions: null,
        disposal_instructions: null,
        warnings: null,
        language_detected: 'en',
        legibility: 'partial',
        confidence: {
          product_name: 'low',
          ingredients: 'low',
          claims: 'low',
          certifications: 'low'
        },
        privacy_guarantee: 'Image is not saved.'
      };
    }
  } catch {
    // OCR also failed
  }

  // 5. Honest Error: Do not guess or invent data
  throw new Error('Could not read product label. Please upload a closer, well-lit photo of the label text.');
}
