/**
 * Vercel Serverless Function: /api/scan-label
 * Dispatches label scanning to the Responsible AI Proxy handler
 */
import { handleScanLabelRequest } from '../server/proxyServer.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  await handleScanLabelRequest(req.body || {}, res);
}
