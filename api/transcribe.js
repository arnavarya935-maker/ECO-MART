/**
 * Vercel Serverless Function: /api/transcribe
 * Audio-to-Text Transcription via Gemini Multimodal Proxy
 */
import { handleTranscribeRequest, applyRateLimit } from '../server/proxyServer.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  if (applyRateLimit(req, res)) return;

  await handleTranscribeRequest(req.body || {}, res, req);
}
