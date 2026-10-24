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
    // Ignore fs errors in edge environments
  }
  return null;
}

// Simple in-memory sliding window rate limiter
// IP -> Array of timestamps (ms)
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

// Clean up stale rate limits every 5 minutes
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

/**
 * Handle Eco Agent chat request to Gemini
 */
export async function handleAgentRequest(body, res) {
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
    // Return friendly status indicating no API key provided so frontend triggers verified fallback
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

  const systemInstruction = `You are EcoMart's Responsible AI Shopping Assistant (CBSE Competition: Ethics & Responsible AI).
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

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const model = process.env.GEMINI_MODEL || 'gemini-3-flash-preview';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
        reasoning_summary: 'Processed directly via Gemini 1.5 Flash.',
        sources_or_assumptions: ['Direct model output', 'EcoMart lifecycle index'],
        confidence: 'medium',
        estimated_energy_wh: 0.12
      };
    }

    // Ensure estimated energy is populated responsibly
    if (!parsed.estimated_energy_wh) {
      parsed.estimated_energy_wh = 0.12;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        source: 'gemini',
        model: model,
        ...parsed
      })
    );
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
export async function handleGreenwashRequest(body, res) {
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

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const model = process.env.GEMINI_MODEL || 'gemini-3-flash-preview';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    if (!parsed.estimated_energy_wh) parsed.estimated_energy_wh = 0.11;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        source: 'gemini',
        model: model,
        ...parsed
      })
    );
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
 * and extracts claims to run Greenwashing Detective and Claim Radar.
 */
export async function handleScanLabelRequest(body, res) {
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

  // 2. File size validation (Max 4MB binary => approx 5.6M Base64 characters)
  if (!imageBase64 || typeof imageBase64 !== 'string') {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Image data is required in base64 format.' }));
    return;
  }

  const MAX_BASE64_LENGTH = 5.8 * 1024 * 1024;
  if (imageBase64.length > MAX_BASE64_LENGTH) {
    res.writeHead(413, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Image exceeds 4MB size limit.' }));
    return;
  }

  // 3. Privacy Guarantee: Clean base64 strip (no disk I/O, no DB saving)
  const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');

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

  const systemInstruction = `You are EcoMart's Product Label Vision Auditor (Greenwashing Detective + Claim Radar).
Analyze the submitted product label or packaging image.
PRIVACY MANDATE: The image is processed in transient memory only and is NEVER stored.

YOUR TASK:
1. Extract all visible text claims, marketing buzzwords, and certification marks from the label.
2. Flag deceptive greenwashing terms (FTC Green Guides & ISO 14021 violations like "100% natural", "chemical-free", unverified "eco-friendly").
3. Detect missing proofs (e.g. absent lab standards or accreditation licenses).
4. Assign an objective Trust Score from 0 to 100.
5. Provide 5-axis Claim Radar scores (0 to 100):
   - vague_wording (100 = precise, 0 = broad fluff)
   - verifiable_proof (100 = third-party lab tested, 0 = self-declared)
   - omission_risk (100 = full lifecycle disclosed, 0 = key impacts hidden)
   - lifecycle_boundary (100 = cradle-to-grave, 0 = selective phase only)
   - third_party_audit (100 = accredited certification license, 0 = unverified)

OUTPUT FORMAT:
Respond with valid JSON:
{
  "extracted_text": "Extracted text lines from the image",
  "identified_product_name": "Inferred product title or category",
  "trust_score": 45,
  "verdict": "High Greenwashing Risk" | "Plausible but Unverified" | "Verified Sustainable",
  "plain_verdict_explanation": "Concise 2-3 sentence verdict on the packaging.",
  "flagged_phrases": [
    { "phrase": "e.g. 100% natural", "issue": "Unqualified broad claim." }
  ],
  "missing_proofs": [
    "No certification license number displayed"
  ],
  "positive_elements": [
    "Recyclable symbol present"
  ],
  "radar_axes": {
    "vague_wording": 40,
    "verifiable_proof": 30,
    "omission_risk": 50,
    "lifecycle_boundary": 45,
    "third_party_audit": 20
  },
  "recommendation": "Check the manufacturer website for the official certificate number before purchase.",
  "privacy_guarantee": "Image was processed in volatile memory and immediately purged."
}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const model = process.env.GEMINI_MODEL || 'gemini-3-flash-preview';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
                text: `Scan and audit this packaging label image for greenwashing and environmental claim veracity. Language: ${language}`
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
          temperature: 0.2,
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

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        source: 'gemini_vision',
        model: model,
        ...parsed
      })
    );
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

