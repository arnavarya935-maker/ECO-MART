/**
 * Vercel Serverless Function: /api/agent
 * Optional LLM phrasing enhancement.
 * Reads API key from process.env.ECO_AGENT_API_KEY or process.env.GEMINI_API_KEY.
 * Reads model from process.env.GEMINI_MODEL (default: 'gemini-1.5-flash').
 * Request contract: { query, context }
 * Response contract: { reply, source }
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, context } = req.body || {};
  const apiKey = process.env.ECO_AGENT_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({
      reply: null,
      source: 'local-rules'
    });
  }

  const model = process.env.GEMINI_MODEL || 'gemini-3-flash-preview';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are EcoMart AI, an expert sustainable shopping assistant. The user asked: "${query}". Context: ${JSON.stringify(context || {})}. Give a warm, helpful, eco-focused response in 2-3 sentences.`
              }
            ]
          }
        ]
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`LLM upstream error ${response.status}`);
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return res.status(200).json({
      reply: replyText || null,
      source: replyText ? 'cloud-llm' : 'local-rules'
    });
  } catch {
    // Graceful offline fallback
    return res.status(200).json({
      reply: null,
      source: 'local-rules'
    });
  }
}
