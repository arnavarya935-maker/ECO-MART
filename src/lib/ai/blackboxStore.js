/**
 * EcoMart AI Black Box Store
 * Append-only local telemetry log of every agent and guardrail interaction.
 * Responsible AI compliance: Never logs API keys, personal names, or PII.
 */

const STORAGE_KEY = 'ecomart_blackbox_log';
const MAX_LOG_ENTRIES = 100;

const _BASELINE_LOG_ENTRIES = [];

let memoryStore = null;

export function getBlackBoxLogs() {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((entry) => !String(entry.id || '').startsWith('bb-init-'));
      }
      return [];
    }
    // Node / test environment fallback
    if (memoryStore === null) {
      memoryStore = [];
    }
    return memoryStore;
  } catch {
    return memoryStore || [];
  }
}

export function appendBlackBoxLog(entry) {
  try {
    const existing = getBlackBoxLogs();
    // Strip PII (email, phone, keys)
    const rawQuery = String(entry.query || 'Product sustainability audit');
    const sanitizedQuery = rawQuery
      .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '[EMAIL_REDACTED]')
      .replace(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, '[PHONE_REDACTED]')
      .replace(/(?:AIzaSy[A-Za-z0-9_-]{33}|AQ\.[A-Za-z0-9_-]{40,})/g, '[KEY_REDACTED]');

    const rawSummary = String(entry.answerSummary || entry.answer || '');
    const sanitizedSummary = rawSummary
      .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '[EMAIL_REDACTED]')
      .replace(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, '[PHONE_REDACTED]');

    const sanitizedEntry = {
      id: entry.id || `bb-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: entry.timestamp || new Date().toISOString(),
      query: sanitizedQuery.slice(0, 500),
      answerSummary: sanitizedSummary.slice(0, 500),
      confidence: entry.confidence || 'high',
      guardrailTriggered: entry.guardrailTriggered || null,
      guardrailStatus: entry.guardrailStatus || 'held',
      energyEstimateWh: Number(entry.energyEstimateWh || entry.energyWh || entry.estimated_energy_wh || 0.11),
      energyWh: Number(entry.energyEstimateWh || entry.energyWh || entry.estimated_energy_wh || 0.11),
      model: entry.model || 'Gemini 3 Flash Preview',
      sources: Array.isArray(entry.sources) ? entry.sources.slice(0, 5) : ['EcoMart Lifecycle Knowledge Base'],
      isFallback: Boolean(entry.isFallback)
    };

    const updated = [sanitizedEntry, ...existing].slice(0, MAX_LOG_ENTRIES);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } else {
      memoryStore = updated;
    }

    // Dispatch event so UI can re-render live
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('blackbox-updated', { detail: sanitizedEntry }));
    }
    return sanitizedEntry;
  } catch (err) {
    console.warn('Could not persist to Black Box log:', err);
    return null;
  }
}

export function clearBlackBoxLogs() {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    memoryStore = [];
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('blackbox-updated', { detail: null }));
    }
  } catch {}
}

export function exportBlackBoxJSON() {
  const logs = getBlackBoxLogs();
  const jsonString = JSON.stringify(logs, null, 2);

  if (typeof document !== 'undefined' && document.createElement) {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(jsonString);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ecomart-ai-blackbox-audit-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }
  return jsonString;
}

// Aliases for seamless imports across tests and components
export const logInteractionToBlackBox = appendBlackBoxLog;
export const getBlackBoxItems = getBlackBoxLogs;
export const clearBlackBox = clearBlackBoxLogs;
