import React, { useState, useEffect } from 'react';
import {
  Inbox,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export default function EthicsInboxPreview() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ecomart_ethics_inbox');
      if (stored) {
        setAlerts(JSON.parse(stored).slice(0, 3));
      } else {
        // Sample alerts backed by Black Box telemetry
        setAlerts([
          {
            id: 'alert_1',
            type: 'low_confidence',
            title: 'Low Confidence Recommendation',
            detail: 'Agent recommended silicone food bag with confidence: low (lack of municipal recycling data in tier-3 cities).',
            time: '12m ago',
            status: 'pending'
          },
          {
            id: 'alert_2',
            type: 'flagged_claim',
            title: 'Deceptive Marketing Intercept',
            detail: 'Manufacturer claim "100% ocean-dissolvable plastic" intercepted under ISO 14021 rule.',
            time: '34m ago',
            status: 'pending'
          },
          {
            id: 'alert_3',
            type: 'user_report',
            title: 'Reported Inaccurate Lifecycle Fact',
            detail: 'User reported transport mileage calculation discrepancy on ceramic cup from Khurja.',
            time: '1h ago',
            status: 'pending'
          }
        ]);
      }
    } catch {}
  }, []);

  const handleOpenInbox = () => {
    window.dispatchEvent(new CustomEvent('open-ethics-inbox'));
  };

  return (
    <section className="py-16 bg-surface border-b border-line" id="ethics-inbox">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Inbox className="w-3.5 h-3.5 text-primary" />
              Human-In-The-Loop Supervision
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-heading mt-1">
              Ethics Inbox
            </h2>
            <p className="text-xs font-sans text-text-secondary mt-1 max-w-lg">
              Low-confidence answers, contested claims, and user reports are queued for human review. Transparent, accountable, and tamper-evident.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenInbox}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-raised border border-primary/40 text-primary hover:bg-primary/10 text-xs font-mono font-semibold transition cursor-pointer shadow-soft-xs"
          >
            <span>Launch Ethics Inbox Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Alerts Preview List */}
        <div className="rounded-3xl border border-line bg-surface-raised overflow-hidden divide-y divide-line/60">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface/50 transition-colors"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-sm text-heading">
                      {alert.title}
                    </span>
                    <span className="text-[10px] font-mono text-text-muted">
                      • {alert.time}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                    {alert.detail}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={handleOpenInbox}
                  className="px-3 py-1.5 rounded-lg border border-line bg-surface hover:bg-surface-sunken text-xs font-sans font-medium text-heading transition cursor-pointer"
                >
                  Review Decision
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
