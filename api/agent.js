/**
 * Vercel Serverless Function: /api/agent
 * Uses the EcoMart Responsible AI Proxy handler with rate limiting
 */
import { handleAgentRequest, applyRateLimit } from '../server/proxyServer.js';
import { computePriorityRanking, detectPriorityPhrase, filterProductsByRequestedType } from '../src/lib/decisionEngine.js';

export { computePriorityRanking, detectPriorityPhrase, filterProductsByRequestedType };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  if (applyRateLimit(req, res)) return;

  await handleAgentRequest(req.body || {}, res, req);
}
