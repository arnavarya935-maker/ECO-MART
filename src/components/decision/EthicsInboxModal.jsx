import React, { useState, useEffect } from 'react';
import {
  Inbox,
  AlertTriangle,
  CheckCircle2,
  X,
  ShieldAlert,
  Check,
  Info
} from 'lucide-react';
import { getBlackBoxLogs } from '../../lib/ai/blackboxStore';

export function getEthicsAlerts() {
  const alerts = [];
  const logs = getBlackBoxLogs();

  // 1. Scan Black Box for intercepted guardrails or low-confidence replies
  logs.forEach((log) => {
    if (log.guardrailStatus === 'intercepted') {
      alerts.push({
        id: `alert-guardrail-${log.id}`,
        type: 'guardrail_intercept',
        severity: 'high',
        title: `Adversarial Interception: ${log.guardrailTriggered}`,
        summary: `Query: "${log.query}" was intercepted and sanitized.`,
        timestamp: log.timestamp,
        status: 'pending',
        evidence: log.answerSummary
      });
    } else if (log.confidence === 'low') {
      alerts.push({
        id: `alert-confidence-${log.id}`,
        type: 'low_confidence',
        severity: 'medium',
        title: 'Low Confidence Response Caveat',
        summary: `Agent flagged missing lifecycle data for: "${log.query}"`,
        timestamp: log.timestamp,
        status: 'pending',
        evidence: log.answerSummary
      });
    }
  });

  // 2. Scan user reported answers
  try {
    const reported = JSON.parse(localStorage.getItem('ecomart_reported_answers') || '[]');
    reported.forEach((rep) => {
      alerts.unshift({
        id: `alert-reported-${rep.id}`,
        type: 'user_reported_error',
        severity: 'high',
        title: `Shopper Feedback: ${rep.category}`,
        summary: `Shopper reported inaccurate claim on query: "${rep.query || 'Product'}"`,
        timestamp: rep.timestamp,
        status: 'pending',
        evidence: rep.note || 'User flagged contradictory claims on packaging.'
      });
    });
  } catch {}

  // Baseline demo fallback if inbox is empty
  if (alerts.length === 0) {
    alerts.push({
      id: 'alert-baseline-1',
      type: 'greenwash_flag',
      severity: 'high',
      title: 'Flagged Packaging: "100% Eco-Bottle"',
      summary: 'Greenwashing Detective flagged unqualified absolute claim without certified LCA.',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      status: 'pending',
      evidence: 'Missing OceanBound Plastic chain-of-custody documentation.'
    });
    alerts.push({
      id: 'alert-baseline-2',
      type: 'low_confidence',
      severity: 'medium',
      title: 'Missing Microbe Degradation Data',
      summary: 'Agent admitted uncertainty for 30-day decomposition claim under backyard conditions.',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      status: 'pending',
      evidence: 'Lab standards require 90-180 days; agent refused to hallucinate 30-day claim.'
    });
  }

  return alerts;
}

export default function EthicsInboxModal({ isOpen, onClose }) {
  const [alerts, setAlerts] = useState(() => getEthicsAlerts());
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'resolved'

  useEffect(() => {
    if (isOpen) {
      setAlerts(getEthicsAlerts());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAction = (alertId, resolution) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: resolution } : a))
    );
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'pending') return a.status === 'pending';
    if (filter === 'resolved') return a.status === 'approved' || a.status === 'dismissed';
    return true;
  });

  const pendingCount = alerts.filter((a) => a.status === 'pending').length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ethics-inbox-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xs animate-fade-in text-text"
    >
      <div className="w-full max-w-2xl max-h-[88vh] rounded-3xl bg-surface border border-line shadow-2xl flex flex-col overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-surface-raised border-b border-line flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/15 border border-amber-400/30 text-amber-400 flex items-center justify-center">
              <Inbox className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="ethics-inbox-title" className="font-serif font-bold text-base text-heading">
                  Responsible AI Ethics Inbox
                </h3>
                {pendingCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {pendingCount} Pending
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted">
                Human-in-the-loop oversight queue reviewing flagged claims, low-confidence answers & user reports.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-muted hover:text-heading hover:bg-surface transition-colors cursor-pointer"
            aria-label="Close Ethics Inbox"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-5 py-2.5 bg-surface-sunken/60 border-b border-line flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5">
            {[
              { id: 'all', label: `All Alerts (${alerts.length})` },
              { id: 'pending', label: `Pending Triage (${pendingCount})` },
              { id: 'resolved', label: 'Reviewed / Resolved' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                  filter === tab.id
                    ? 'bg-primary text-white font-bold'
                    : 'bg-surface text-muted border border-line hover:text-heading'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-[10px] text-muted hidden sm:inline">
            Open AI Governance & Safety
          </span>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="py-12 text-center text-muted space-y-2">
              <CheckCircle2 className="w-8 h-8 text-primary mx-auto" />
              <h4 className="text-sm font-bold text-heading">Ethics Inbox Clean</h4>
              <p className="text-xs">No pending ethical flags or unresolved model errors.</p>
            </div>
          ) : (
            filteredAlerts.map((item) => {
              const isResolved = item.status === 'approved' || item.status === 'dismissed';

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all space-y-2.5 text-left ${
                    isResolved
                      ? 'bg-surface-sunken/40 border-line/60 opacity-60'
                      : item.severity === 'high'
                      ? 'bg-surface-raised border-rose-500/30'
                      : 'bg-surface border-line'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-1 text-[11px] font-bold text-heading">
                      {item.severity === 'high' ? (
                        <ShieldAlert className="w-4 h-4 text-rose-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                      )}
                      <span>{item.title}</span>
                    </span>

                    <span className="text-[10px] text-muted">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs text-secondary leading-relaxed">
                    {item.summary}
                  </p>

                  <div className="p-2.5 rounded-xl bg-surface-sunken border border-line/60 text-[11px] text-muted font-mono">
                    <span className="text-[10px] font-bold text-primary uppercase block">Audit Evidence:</span>
                    {item.evidence}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1 border-t border-line/40 text-xs">
                    <span className="text-[10px] font-mono text-muted">
                      Status: <strong className="capitalize text-heading">{item.status}</strong>
                    </span>

                    {!isResolved ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleAction(item.id, 'dismissed')}
                          className="px-2.5 py-1 rounded-lg bg-surface-sunken border border-line hover:border-line-subtle text-[11px] text-muted hover:text-heading transition-colors cursor-pointer"
                        >
                          Dismiss False Flag
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAction(item.id, 'approved')}
                          className="px-3 py-1 rounded-lg bg-primary hover:bg-primary-hover text-white text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Verify & Log Correction</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Triage complete
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-surface-raised border-t border-line flex items-center justify-between text-xs text-muted">
          <span className="flex items-center gap-1 text-[11px]">
            <Info className="w-3.5 h-3.5 text-primary" />
            Backed by append-only Black Box audit store
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-surface-sunken border border-line text-heading font-semibold hover:bg-surface transition-colors cursor-pointer"
          >
            Close Inbox
          </button>
        </div>
      </div>
    </div>
  );
}
