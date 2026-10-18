/**
 * Vercel Serverless Function: /api/agent
 * Optional LLM phrasing enhancement.
 * Reads API key from process.env.ECO_AGENT_API_KEY or process.env.GEMINI_API_KEY.
 * Returns gracefully formatted response or fallback.
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, products, context } = req.body || {};
  const apiKey = process.env.ECO_AGENT_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({
      fallback: true,
      message: 'Local rule engine active (no cloud LLM key configured).'
    });
  }

  try {
    // If external LLM endpoint is provided, call it with 3-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are EcoMart AI, an expert sustainable shopping assistant. The user asked: "${query}". Context: ${JSON.stringify(context || {})}. Products considered: ${JSON.stringify(products?.slice(0, 5) || [])}. Give a warm, helpful, eco-focused response in 2-3 sentences.`
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
      success: true,
      message: replyText || 'Recommendation generated.',
      source: 'cloud-llm'
    });
  } catch {
    // Graceful offline fallback
    return res.status(200).json({
      fallback: true,
      message: 'Local intelligent template active.'
    });
  }
}
