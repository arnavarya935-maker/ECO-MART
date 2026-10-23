/**
 * Vercel Serverless Function: /api/health
 * Proxy Health & Operational Status
 */
export default function handler(req, res) {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here');

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      status: hasKey ? 'operational' : 'degraded',
      message: hasKey ? 'All AI systems operational' : 'Operating in offline verified fallback mode',
      provider: process.env.AI_PROVIDER || 'gemini',
      offlineFallbackReady: true,
      timestamp: Date.now()
    })
  );
}
