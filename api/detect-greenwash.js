/**
 * Vercel Serverless Function: /api/detect-greenwash
 * Uses the EcoMart Greenwashing Detective Proxy handler with rate limiting
 */
import { handleGreenwashRequest, applyRateLimit } from '../server/proxyServer.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  if (applyRateLimit(req, res)) return;

  await handleGreenwashRequest(req.body || {}, res, req);
}
