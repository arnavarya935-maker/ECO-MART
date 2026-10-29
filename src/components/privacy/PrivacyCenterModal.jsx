import React, { useState } from 'react';
import {
  X,
  Download,
  Upload,
  Trash2,
  Eye,
  Server,
  CheckCircle2
} from 'lucide-react';

export default function PrivacyCenterModal({ isOpen, onClose }) {
  const [resetConfirm, setResetConfirm] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  const handleExportAll = () => {
    try {
      const dump = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('ecomart_')) {
          try {
            dump[key] = JSON.parse(localStorage.getItem(key));
          } catch {
            dump[key] = localStorage.getItem(key);
          }
        }
      }

      const jsonStr = JSON.stringify(dump, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ecomart-privacy-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);

      setStatusMessage('✓ All local data exported as JSON backup.');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch {
      setStatusMessage('✕ Export failed.');
    }
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        Object.entries(parsed).forEach(([key, value]) => {
          if (key.startsWith('ecomart_')) {
            localStorage.setItem(
              key,
              typeof value === 'object' ? JSON.stringify(value) : value
            );
          }
        });
        setStatusMessage('✓ Backup imported successfully! Reloading...');
        setTimeout(() => window.location.reload(), 1200);
      } catch {
        setStatusMessage('✕ Invalid JSON backup format.');
      }
    };
    reader.readAsText(file);
  };

  const handleDeleteAll = () => {
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('ecomart_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      setResetConfirm(false);
      setStatusMessage('✓ All local data deleted cleanly. Reloading...');
      setTimeout(() => window.location.reload(), 1200);
    } catch {
      setStatusMessage('✕ Deletion failed.');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-modals flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-left text-text"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-surface-raised border border-line rounded-3xl shadow-soft-xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-line bg-surface flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
                Privacy Center
              </span>
            </div>
            <h3 className="font-serif font-bold text-2xl text-heading mt-1">
              Data Inventory &amp; Privacy Sovereignty
            </h3>
            <p className="text-xs text-secondary mt-0.5">
              Inspect exactly what is stored on your device, what reaches the AI API proxy, and export or erase everything in 1 click.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-xl text-muted hover:text-heading hover:bg-surface-sunken transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close Privacy Center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback alert */}
        {statusMessage && (
          <div className="px-6 py-2.5 bg-primary/10 border-b border-primary/20 text-xs font-semibold text-primary">
            {statusMessage}
          </div>
        )}

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Section 1: Data Inventory */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-base text-heading flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              <span>1. Complete Local Data Inventory</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                { title: 'Cart & Wishlist', key: 'ecomart_cart / ecomart_wishlist', where: '100% on device', note: 'Never shared with any remote ad networks.' },
                { title: 'Personal Priorities', key: 'ecomart_user_priorities', where: '100% on device', note: 'Weights for price vs carbon vs plastic.' },
                { title: 'Reported Claims', key: 'ecomart_reported_claims', where: '100% on device', note: 'Your local audit log of misleading packaging.' },
                { title: 'Agent Black Box Log', key: 'ecomart_blackbox_log', where: '100% on device', note: 'Local telemetry on model latency & energy.' }
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-surface border border-line space-y-1">
                  <div className="font-bold text-heading">{item.title}</div>
                  <div className="text-xs font-mono text-muted">{item.key}</div>
                  <div className="text-xs text-secondary mt-1">{item.note}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: What is Sent to the AI API & News Proxy */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-base text-heading flex items-center gap-2">
              <Server className="w-4 h-4 text-primary" />
              <span>2. What is Transmitted to Remote Proxies?</span>
            </h4>
            <div className="p-4 rounded-2xl bg-surface-sunken border border-line space-y-2 text-xs text-secondary leading-relaxed font-sans">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Zero Personally Identifiable Information (PII) Transmission</span>
              </div>
              <p>
                When you query the Eco Agent, only your sanitized search prompt and anonymous priority weight numbers are forwarded through our server-side proxy.
              </p>
              <p>
                For the <strong>Eco News</strong> feature, only the selected search topic or keyword (e.g. "greenwashing" or "plastic packaging") is transmitted to fetch headlines. No browsing history, IP logs, or personal tracking are ever shared.
              </p>
              <div className="pt-2 border-t border-line/60 grid grid-cols-2 gap-2 text-xs font-mono">
                <div>✓ 0 Usernames or Emails</div>
                <div>✓ 0 Tracking Identifiers</div>
                <div>✓ 0 Third-Party Ad Cookies</div>
                <div>✓ 0 Personal Tracking</div>
              </div>
            </div>
          </div>

          {/* Section 3: Data Import / Export (Feature 58) */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-base text-heading flex items-center gap-2">
              <Download className="w-4 h-4 text-primary" />
              <span>3. Data Sovereignty &amp; JSON Backup</span>
            </h4>
            <div className="p-4 rounded-2xl bg-surface border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="font-bold text-xs text-heading">Export / Import JSON Data Package</div>
                <div className="text-[11px] text-secondary mt-0.5">
                  Download a full machine-readable JSON backup of your cart, wishlist, persona, and memory.
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleExportAll}
                  className="px-4 py-2.5 min-h-[44px] rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast font-semibold text-xs flex items-center gap-1.5 transition shadow-soft-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>
                <label className="px-4 py-2.5 min-h-[44px] rounded-xl bg-surface-sunken hover:bg-surface border border-line text-heading font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-primary" />
                  <span>Import JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportFile}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Section 4: Nuclear Delete All */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-base text-heading flex items-center gap-2 text-danger">
              <Trash2 className="w-4 h-4 text-danger" />
              <span>4. Erase All Data from This Device</span>
            </h4>
            <div className="p-4 rounded-2xl bg-danger/5 border border-danger/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="font-bold text-xs text-heading">Purge Local Storage</div>
                <div className="text-xs text-secondary mt-0.5">
                  Permanently wipe all cart items, orders, preferences, and cached AI inferences.
                </div>
              </div>

              {!resetConfirm ? (
                <button
                  type="button"
                  onClick={() => setResetConfirm(true)}
                  className="px-4 py-2.5 min-h-[44px] rounded-xl bg-danger text-white font-semibold text-xs hover:bg-rose-700 transition cursor-pointer shrink-0"
                >
                  Delete All Data
                </button>
              ) : (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleDeleteAll}
                    className="px-4 py-2.5 min-h-[44px] rounded-xl bg-danger text-white font-bold text-xs hover:bg-rose-700 transition cursor-pointer"
                  >
                    Confirm Permanent Erase
                  </button>
                  <button
                    type="button"
                    onClick={() => setResetConfirm(false)}
                    className="px-3.5 py-2.5 min-h-[44px] rounded-xl bg-surface border border-line text-xs font-semibold text-heading cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-surface border-t border-line flex items-center justify-between text-xs text-muted">
          <span>Eco Sense Privacy Notice: We never monetize user attention or personal data.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 min-h-[44px] rounded-xl bg-surface-sunken hover:bg-surface border border-line text-xs font-semibold text-heading cursor-pointer inline-flex items-center justify-center"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
