/**
 * Vercel Serverless Function: /api/barcode
 * Look up barcode against Open Food Facts public database with rate limiting
 */
import { handleBarcodeRequest, applyRateLimit } from '../server/proxyServer.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  if (applyRateLimit(req, res)) return;

  await handleBarcodeRequest(req.query || {}, res, req);
}
