/**
 * Vercel Serverless Function: /api/news
 * Curated Eco News Provider Proxy with rate limiting
 */
import { handleNewsRequest, applyRateLimit } from '../server/proxyServer.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  if (applyRateLimit(req, res)) return;

  await handleNewsRequest(req.query || {}, res, req);
}
