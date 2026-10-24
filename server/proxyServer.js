import fs from 'node:fs';
import path from 'node:path';

function getGeminiApiKey() {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
    return process.env.GEMINI_API_KEY;
  }
  if (process.env.ECO_AGENT_API_KEY && process.env.ECO_AGENT_API_KEY !== 'your_gemini_api_key_here') {
    return process.env.ECO_AGENT_API_KEY;
  }
  try {
    for (const envFileName of ['.env', '.env.local']) {
      const envPath = path.resolve(process.cwd(), envFileName);
      if (fs.existsSync(envPath)) {
        const text = fs.readFileSync(envPath, 'utf-8');
        const match = text.match(/^\s*(?:GEMINI_API_KEY|ECO_AGENT_API_KEY)\s*=\s*["']?([^"'\r\n]+)["']?/m);
        if (match && match[1] && match[1] !== 'your_gemini_api_key_here') {
          return match[1].trim();
        }
      }
    }
  } catch {
    // Ignore fs errors in edge / serverless environments
  }
  return null;
}

// In-memory sliding window rate limiter
// IP -> Array of timestamps (ms)
// Note: Best-effort on ephemeral serverless instances
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30; // 30 requests / minute

export function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitMap.set(ip, validTimestamps);
    return true;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return false;
}

export function getClientIp(req) {
  if (!req) return '127.0.0.1';
  const forwarded = req.headers?.['x-forwarded-for'] || req.headers?.['x-real-ip'] || '';
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || '127.0.0.1';
}

export function applyRateLimit(req, res) {
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    res.writeHead(429, {
      'Content-Type': 'application/json',
      'Retry-After': '60'
    });
    res.end(
      JSON.stringify({
        error: 'Too many requests. Please wait a minute and try again.',
        retryAfterSeconds: 60
      })
    );
    return true;
  }
  return false;
}

// Clean up stale rate limits periodically (safe on persistent Node servers)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, timestamps] of rateLimitMap.entries()) {
      const valid = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
      if (valid.length === 0) {
        rateLimitMap.delete(ip);
      } else {
        rateLimitMap.set(ip, valid);
      }
    }
  }, 5 * 60 * 1000).unref?.();
}

// --- Strict Schema Sanitizers & Output Validators ---

export function sanitizeString(val, maxLen = 2000, fallback = '') {
  if (typeof val !== 'string') return fallback;
  const cleaned = val.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
  return cleaned.slice(0, maxLen);
}

export function sanitizeNumber(val, fallback = 0, min = -Infinity, max = Infinity) {
  const num = Number(val);
  if (isNaN(num) || !isFinite(num)) return fallback;
  return Math.min(Math.max(num, min), max);
}

export function sanitizeStringArray(val, maxItems = 20, maxLen = 300) {
  if (!Array.isArray(val)) return [];
  return val
    .filter((item) => typeof item === 'string')
    .map((item) => sanitizeString(item, maxLen))
    .filter(Boolean)
    .slice(0, maxItems);
}

export function sanitizeAgentOutput(parsed, modelName = 'gemini-1.5-flash') {
  if (!parsed || typeof parsed !== 'object') {
    return {
      source: 'gemini',
      model: modelName,
      answer: 'Response format could not be verified.',
      reasoning_summary: 'Output validation check completed.',
      sources_or_assumptions: [],
      confidence: 'low',
      estimated_energy_wh: 0.12,
      recommended_categories: [],
      caveat: 'AI estimates are probabilistic. Verify manufacturer certifications on package.'
    };
  }

  const confidence = ['high', 'medium', 'low'].includes(parsed.confidence) ? parsed.confidence : 'medium';

  return {
    source: 'gemini',
    model: modelName,
    answer: sanitizeString(parsed.answer, 4000, 'Direct answer unavailable.'),
    reasoning_summary: sanitizeString(parsed.reasoning_summary, 1000, 'Evaluated against sustainability criteria.'),
    sources_or_assumptions: sanitizeStringArray(parsed.sources_or_assumptions, 10, 300),
    confidence,
    estimated_energy_wh: sanitizeNumber(parsed.estimated_energy_wh, 0.12, 0.01, 10.0),
    recommended_categories: sanitizeStringArray(parsed.recommended_categories, 8, 100),
    caveat: sanitizeString(parsed.caveat, 500, 'AI estimates are probabilistic. Verify manufacturer certifications on package.')
  };
}

export function sanitizeGreenwashOutput(parsed, modelName = 'gemini-1.5-flash') {
  if (!parsed || typeof parsed !== 'object') {
    return {
      source: 'gemini',
      model: modelName,
      trust_score: 50,
      verdict: 'Plausible but Unverified',
      plain_verdict_explanation: 'Claim analysis completed.',
      flagged_phrases: [],
      missing_proofs: [],
      positive_elements: [],
      recommendation: 'Check packaging for verifiable certifications.',
      estimated_energy_wh: 0.11
    };
  }

  const trust_score = Math.round(sanitizeNumber(parsed.trust_score, 50, 0, 100));
  const verdict = sanitizeString(parsed.verdict, 100, 'Plausible but Unverified');
  const plain_verdict_explanation = sanitizeString(parsed.plain_verdict_explanation, 1000, '');

  const flagged_phrases = Array.isArray(parsed.flagged_phrases)
    ? parsed.flagged_phrases
        .filter((f) => f && typeof f === 'object')
        .slice(0, 15)
        .map((f) => ({
          phrase: sanitizeString(f.phrase, 200),
          issue: sanitizeString(f.issue, 500)
        }))
        .filter((f) => f.phrase)
    : [];

  const missing_proofs = sanitizeStringArray(parsed.missing_proofs, 10, 300);
  const positive_elements = sanitizeStringArray(parsed.positive_elements, 10, 300);
  const recommendation = sanitizeString(parsed.recommendation, 500, 'Look for explicit certification numbers.');
  const estimated_energy_wh = sanitizeNumber(parsed.estimated_energy_wh, 0.11, 0.01, 10.0);

  return {
    source: 'gemini',
    model: modelName,
    trust_score,
    verdict,
    plain_verdict_explanation,
    flagged_phrases,
    missing_proofs,
    positive_elements,
    recommendation,
    estimated_energy_wh
  };
}

export function sanitizeScanLabelOutput(parsed, modelName = 'gemini-1.5-flash') {
  if (!parsed || typeof parsed !== 'object') {
    return {
      source: 'gemini_vision',
      model: modelName,
      is_product_label: false,
      reason_if_not: 'Could not parse response structure.',
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
      legibility: 'poor',
      confidence: 'low'
    };
  }

  const is_product_label = Boolean(parsed.is_product_label ?? true);

  const certifications_printed = Array.isArray(parsed.certifications_printed)
    ? parsed.certifications_printed
        .slice(0, 20)
        .map((c) => {
          if (typeof c === 'string') {
            return { name: sanitizeString(c, 100), has_license_number: false };
          }
          return {
            name: sanitizeString(c?.name, 100),
            has_license_number: Boolean(c?.has_license_number)
          };
        })
        .filter((c) => c.name)
    : [];

  const legibility = ['good', 'partial', 'poor'].includes(parsed.legibility) ? parsed.legibility : 'good';

  return {
    source: 'gemini_vision',
    model: modelName,
    is_product_label,
    reason_if_not: is_product_label ? null : sanitizeString(parsed.reason_if_not, 300, 'No product label detected.'),
    product_name: sanitizeString(parsed.product_name, 200, null),
    brand: sanitizeString(parsed.brand, 200, null),
    net_quantity: sanitizeString(parsed.net_quantity, 100, null),
    ingredients: sanitizeStringArray(parsed.ingredients, 100, 200),
    claims: sanitizeStringArray(parsed.claims, 30, 200),
    certifications_printed,
    packaging_marks: sanitizeStringArray(parsed.packaging_marks, 20, 200),
    manufacturer: sanitizeString(parsed.manufacturer, 300, null),
    country_of_origin: sanitizeString(parsed.country_of_origin, 100, null),
    batch_mfg_expiry: sanitizeString(parsed.batch_mfg_expiry, 200, null),
    barcode_number: sanitizeString(parsed.barcode_number, 50, null),
    usage_instructions: sanitizeString(parsed.usage_instructions, 500, null),
    disposal_instructions: sanitizeString(parsed.disposal_instructions, 500, null),
    warnings: sanitizeString(parsed.warnings, 500, null),
    language_detected: sanitizeString(parsed.language_detected, 50, 'en'),
    legibility,
    confidence: typeof parsed.confidence === 'object' && parsed.confidence !== null
      ? parsed.confidence
      : (['high', 'medium', 'low'].includes(parsed.confidence) ? parsed.confidence : 'medium')
  };
}

/**
 * Handle Eco Agent chat request to Gemini
 */
export async function handleAgentRequest(body, res, req = null) {
  if (req && applyRateLimit(req, res)) return;

  const { query, language = 'en', context = {} } = body || {};

  // Input length validation
  if (!query || typeof query !== 'string') {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Query is required and must be text.' }));
    return;
  }

  if (query.length > 1000) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Input query exceeds 1000 character security limit.' }));
    return;
  }

  const apiKey = getGeminiApiKey();

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        source: 'local_fallback',
        reason: 'NO_API_KEY_CONFIGURED',
        message: 'Gemini API key not configured. Running offline verified intelligence fallback.'
      })
    );
    return;
  }

  const systemInstruction = `You are EcoMart's Responsible AI Shopping Assistant.
Your purpose: Guide shoppers toward verified sustainable alternatives, lower lifecycle carbon footprints, and zero-plastic choices.

ETHICAL RESPONSIBILITY RULES (STRICT):
1. Language: Answer in the user's language (English, Hindi, or Hinglish).
2. Honesty: NEVER invent fake certifications or statistics. If unsure of lifecycle numbers, say "I'm not sure" and state realistic assumptions.
3. Carbon & Energy: Only cite verified benchmarks (e.g. bamboo absorbs ~35% more CO2 than timber; cotton requires ~2,700L water/shirt; plastic degrades over 450+ years).
4. Unbiased: State trade-offs honestly (e.g., bamboo cutlery is compostable but requires gentle hand-washing; beeswax wrap cannot be washed in hot water).

OUTPUT FORMAT:
You MUST respond with valid JSON matching this exact structure:
{
  "answer": "Direct, empathetic answer to the user in their language",
  "reasoning_summary": "Transparent 2-3 step explanation of how you evaluated the request",
  "sources_or_assumptions": ["Assumption or standard 1", "Assumption or standard 2"],
  "confidence": "high" | "medium" | "low",
  "estimated_energy_wh": 0.12,
  "recommended_categories": ["Kitchen", "Personal Care"],
  "caveat": "AI estimates are probabilistic. Verify manufacturer certifications on package."
}`;

  const userPrompt = `User question: "${query}"
Context memory: ${JSON.stringify(context)}
User preferred language: ${language}`;

  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    // Security: API key transmitted exclusively via x-goog-api-key header, not URL query parameter
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      signal: controller.signal,
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemInstruction }]
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: userPrompt }]
          }
        ],
        generationConfig: {
          response_mime_type: 'application/json',
          temperature: 0.3,
          max_output_tokens: 2500
        }
      })
    });

    clearTimeout(timeout);

    if (!apiResponse.ok) {
      const errText = await apiResponse.text().catch(() => '');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          source: 'local_fallback',
          reason: `API_HTTP_${apiResponse.status}`,
          details: errText.slice(0, 200)
        })
      );
      return;
    }

    const data = await apiResponse.json();
    const rawContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawContent) {
      throw new Error('Empty response from Gemini');
    }

    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      parsed = {
        answer: rawContent,
        reasoning_summary: 'Processed directly via Gemini.',
        sources_or_assumptions: ['Direct model output', 'EcoMart lifecycle index'],
        confidence: 'medium',
        estimated_energy_wh: 0.12
      };
    }

    // Validate and sanitize output against strict schema - NEVER spread raw model output
    const sanitizedResponse = sanitizeAgentOutput(parsed, model);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(sanitizedResponse));
  } catch (err) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        source: 'local_fallback',
        reason: err.name === 'AbortError' ? 'API_TIMEOUT' : 'API_NETWORK_ERROR',
        message: err.message
      })
    );
  }
}

/**
 * Handle Greenwashing Detective request to Gemini
 */
export async function handleGreenwashRequest(body, res, req = null) {
  if (req && applyRateLimit(req, res)) return;

  const { text: claimText, language = 'en' } = body || {};

  if (!claimText || typeof claimText !== 'string') {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Product text or claim is required.' }));
    return;
  }

  if (claimText.length > 1500) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Text exceeds 1500 character security limit.' }));
    return;
  }

  const apiKey = getGeminiApiKey();

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        source: 'local_fallback',
        reason: 'NO_API_KEY_CONFIGURED'
      })
    );
    return;
  }

  const systemInstruction = `You are EcoMart's Greenwashing Detective, trained on ISO 14021 environmental claims and FTC Green Guides.
Analyze the user's submitted product packaging text or marketing claim for greenwashing.

ETHICAL DETECTIVE RULES:
1. Identify vague, unqualified buzzwords (e.g., "100% natural", "eco-friendly", "pure green", "ocean plastic" without certified chain-of-custody).
2. Point out missing proofs (e.g., absence of FSC, USDA Organic, GOTS, ISO certification number, or compostability lab standard ASTM D6400).
3. Compute an objective Trust Score from 0 to 100 (0 = egregious greenwashing / deceptive; 100 = fully transparent with third-party verifiable audit).
4. Deliver an impartial, plain-language verdict.

OUTPUT FORMAT:
Respond with valid JSON:
{
  "trust_score": 35,
  "verdict": "High Greenwashing Risk" | "Plausible but Unverified" | "Verified Sustainable",
  "plain_verdict_explanation": "Concise 2-3 sentence detective verdict.",
  "flagged_phrases": [
    {
      "phrase": "e.g. 100% eco-friendly",
      "issue": "Unsubstantiated broad claim prohibited by FTC Green Guides without specific lifecycle boundaries."
    }
  ],
  "missing_proofs": [
    "No third-party compostability certification cited (e.g. ASTM D6400 / EN 13432)",
    "Recycled content percentage not quantified"
  ],
  "positive_elements": [
    "Packaging is cardboard"
  ],
  "recommendation": "Look for explicit certification numbers rather than self-declared green claims.",
  "estimated_energy_wh": 0.11
}`;

  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      signal: controller.signal,
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemInstruction }]
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: `Audit this packaging / marketing claim:\n"${claimText}"\nLanguage: ${language}` }]
          }
        ],
        generationConfig: {
          response_mime_type: 'application/json',
          temperature: 0.2,
          max_output_tokens: 2500
        }
      })
    });

    clearTimeout(timeout);

    if (!apiResponse.ok) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ source: 'local_fallback', reason: `API_HTTP_${apiResponse.status}` }));
      return;
    }

    const data = await apiResponse.json();
    const rawContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawContent) throw new Error('Empty response from Gemini');

    const parsed = JSON.parse(rawContent);

    // Validate and sanitize output against strict schema - NEVER spread raw model output
    const sanitizedResponse = sanitizeGreenwashOutput(parsed, model);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(sanitizedResponse));
  } catch (err) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        source: 'local_fallback',
        reason: err.name === 'AbortError' ? 'API_TIMEOUT' : 'API_NETWORK_ERROR'
      })
    );
  }
}

/**
 * Handle Label Scanner request to Gemini Vision API
 * Validates file type and size server-side, NEVER writes images to disk,
 * and extracts verbatim text accurately without fabrication.
 */
export async function handleScanLabelRequest(body, res, req = null) {
  if (req && applyRateLimit(req, res)) return;

  const { imageBase64, mimeType = 'image/jpeg', language = 'en' } = body || {};

  // 1. File type validation
  const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  if (!mimeType || !ALLOWED_MIME_TYPES.includes(mimeType.toLowerCase())) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        error: 'Invalid file type. Only JPEG, PNG, and WebP images are permitted.'
      })
    );
    return;
  }

  // 2. File size validation (Max ~3MB base64 to stay safely within Vercel's 4.5MB payload limit)
  if (!imageBase64 || typeof imageBase64 !== 'string') {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Image data is required in base64 format.' }));
    return;
  }

  // 3. Privacy Guarantee: Clean base64 strip (no disk I/O, no DB saving)
  const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');

  const MAX_BASE64_LENGTH = 3 * 1024 * 1024; // 3MB limit
  if (cleanBase64.length > MAX_BASE64_LENGTH) {
    res.writeHead(413, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        error: 'Image data exceeds the 3MB safe serverless payload limit. Please upload a smaller or downscaled image.'
      })
    );
    return;
  }

  const apiKey = getGeminiApiKey();

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        source: 'local_fallback',
        reason: 'NO_API_KEY_CONFIGURED',
        message: 'No API key configured. Offline label scanner fallback active.'
      })
    );
    return;
  }

  const systemInstruction = `You are EcoMart's Product Label Scanner.
Goal: Transcribe only what is printed on the label accurately.
SYSTEM MANDATE: Transcribe only text that is visibly printed. Never infer, guess or add facts. Use null for anything not visible or unreadable.
Certifications are never marked verified.

OUTPUT SCHEMA (STRICT JSON):
{
  "is_product_label": boolean,
  "reason_if_not": string or null,
  "product_name": string or null,
  "brand": string or null,
  "net_quantity": string or null,
  "ingredients": [string],
  "claims": [string],
  "certifications_printed": [{"name": string, "has_license_number": boolean}],
  "packaging_marks": [string],
  "manufacturer": string or null,
  "country_of_origin": string or null,
  "batch_mfg_expiry": string or null,
  "barcode_number": string or null,
  "usage_instructions": string or null,
  "disposal_instructions": string or null,
  "warnings": string or null,
  "language_detected": string,
  "legibility": "good" | "partial" | "poor",
  "confidence": {
    "product_name": "high" | "medium" | "low",
    "ingredients": "high" | "medium" | "low",
    "claims": "high" | "medium" | "low",
    "certifications": "high" | "medium" | "low"
  }
}`;

  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      signal: controller.signal,
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemInstruction }]
        },
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Scan and transcribe the printed text on this product label. Language: ${language}`
              },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: cleanBase64
                }
              }
            ]
          }
        ],
        generationConfig: {
          response_mime_type: 'application/json',
          temperature: 0.0,
          max_output_tokens: 3000
        }
      })
    });

    clearTimeout(timeout);

    if (!apiResponse.ok) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          source: 'local_fallback',
          reason: `API_HTTP_${apiResponse.status}`
        })
      );
      return;
    }

    const data = await apiResponse.json();
    const rawContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawContent) throw new Error('Empty response from Gemini Vision');

    const parsed = JSON.parse(rawContent);

    // Validate and sanitize output against strict schema - NEVER spread raw model output
    const sanitizedResponse = sanitizeScanLabelOutput(parsed, model);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(sanitizedResponse));
  } catch (err) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        source: 'local_fallback',
        reason: err.name === 'AbortError' ? 'API_TIMEOUT' : 'API_NETWORK_ERROR'
      })
    );
  }
}

/**
 * Handle Eco News request (forward-compatible for Phase 3 news provider adapter)
 */
export async function handleNewsRequest(query = {}, res, req = null) {
  if (req && applyRateLimit(req, res)) return;

  // Placeholder handler for Phase 3 news route with cached response structure
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600'
  });
  res.end(
    JSON.stringify({
      articles: [],
      provider: process.env.NEWS_PROVIDER || 'gnews',
      cached: true,
      lastUpdated: new Date().toISOString()
    })
  );
}
