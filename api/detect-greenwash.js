/**
 * Vercel Serverless Function: /api/detect-greenwash
 * Uses the EcoMart Greenwashing Detective Proxy handler
 */
import { handleGreenwashRequest } from '../server/proxyServer.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  await handleGreenwashRequest(req.body || {}, res);
}
