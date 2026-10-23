/**
 * Vercel Serverless Function: /api/agent
 * Uses the EcoMart Responsible AI Proxy handler
 */
import { handleAgentRequest } from '../server/proxyServer.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  await handleAgentRequest(req.body || {}, res);
}
