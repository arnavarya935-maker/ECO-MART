/**
 * Vercel Serverless Function: /api/scan-label
 * Dispatches label scanning to the Responsible AI Proxy handler with rate limiting
 */
import { handleScanLabelRequest, applyRateLimit } from '../server/proxyServer.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  if (applyRateLimit(req, res)) return;

  await handleScanLabelRequest(req.body || {}, res, req);
}
