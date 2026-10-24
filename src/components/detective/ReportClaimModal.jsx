import React, { useState, useEffect } from 'react';
import {
  Flag,
  X,
  CheckCircle2,
  Download,
  Trash2,
  FileText,
  AlertTriangle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import productsData from '../../data/products.json';

const CLAIM_CATEGORIES = [
  'Vague Unqualified Buzzword (e.g. 100% Eco-Friendly)',
  'Unsubstantiated Carbon Offset / Net-Zero Claim',
  'Missing Lifecycle Scope (Cradle-to-Grave Omission)',
  'Unverified Certification or Misused Seal',
  'Irrelevant Truth (e.g. CFC-Free when already banned)',
  'Hidden Trade-off (e.g. Organic cotton dyed with heavy metals)'
];

export default function ReportClaimModal({ isOpen, onClose, initialProduct = null }) {
  const [selectedProductId, setSelectedProductId] = useState(() => initialProduct?.id || productsData[0]?.id);
  const [claimText, setClaimText] = useState('');
  const [category, setCategory] = useState(CLAIM_CATEGORIES[0]);
  const [notes, setNotes] = useState('');
  const [reports, setReports] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const loadReports = () => {
    try {
      const raw = localStorage.getItem('ecomart_reported_claims');
      if (raw) {
        setReports(JSON.parse(raw));
      }
    } catch {}
  };

  useEffect(() => {
    if (isOpen) {
      loadReports();
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const prod = productsData.find((p) => p.id === selectedProductId) || { name: 'Unknown Product' };

    const newReport = {
      id: `rep_${Date.now()}`,
      productId: selectedProductId,
      productName: prod.name,
      claimText: claimText.trim() || 'General product marketing claims',
      category,
      notes: notes.trim(),
      timestamp: new Date().toISOString()
    };

    const updated = [newReport, ...reports];
    try {
      localStorage.setItem('ecomart_reported_claims', JSON.stringify(updated));
      setReports(updated);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2500);
      setClaimText('');
      setNotes('');
    } catch {}
  };

  const handleDelete = (reportId) => {
    const updated = reports.filter((r) => r.id !== reportId);
    try {
      localStorage.setItem('ecomart_reported_claims', JSON.stringify(updated));
      setReports(updated);
    } catch {}
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reports, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ecomart_reported_claims_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] bg-surface-raised border border-line rounded-3xl shadow-soft-xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-line flex items-center justify-between bg-surface-sunken">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-heading">
                  Report Misleading Claim
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-raised border border-line text-text-muted">
                  Community Truth Desk
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                Flag unverified greenwashing claims. Saved locally in your browser with instant export.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowHowItWorks(!showHowItWorks)}
              className="p-2 rounded-xl border border-line bg-surface hover:bg-surface-sunken text-text-muted hover:text-heading text-xs font-mono flex items-center gap-1 transition"
            >
              <HelpCircle className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline">How it works</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl border border-line text-text-muted hover:text-heading hover:bg-surface transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* How it works drawer */}
        {showHowItWorks && (
          <div className="p-4 bg-surface border-b border-line text-xs space-y-1.5 animate-fade-in">
            <div className="flex items-center gap-1.5 font-serif font-bold text-heading">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>How Claim Reporting Works</span>
            </div>
            <p className="text-text-secondary leading-relaxed">
              Reports are retained in local browser storage without server telemetry. You can export your audit logs as clean JSON or submit them directly to independent advertising self-regulatory bodies (such as ASCI).
            </p>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Submission Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-mono text-text-muted uppercase tracking-wider block mb-1">
                Select Product
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-surface-sunken border border-line text-xs text-heading font-sans focus:outline-none focus:border-primary"
              >
                {productsData.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono text-text-muted uppercase tracking-wider block mb-1">
                Claim Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-surface-sunken border border-line text-xs text-heading font-sans focus:outline-none focus:border-primary"
              >
                {CLAIM_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono text-text-muted uppercase tracking-wider block mb-1">
                Misleading Statement / Quote from Packaging
              </label>
              <input
                type="text"
                value={claimText}
                onChange={(e) => setClaimText(e.target.value)}
                placeholder="e.g. '100% eco-friendly and saves the planet forever'"
                className="w-full p-2.5 rounded-xl bg-surface-sunken border border-line text-xs text-heading placeholder:text-text-muted font-sans focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-text-muted uppercase tracking-wider block mb-1">
                Why is this claim misleading? (Observations &amp; Missing Proof)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Disclose why this claim contradicts lifecycle facts or lacks third-party verification..."
                className="w-full p-2.5 rounded-xl bg-surface-sunken border border-line text-xs text-heading placeholder:text-text-muted font-sans focus:outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-primary text-white font-mono text-xs font-semibold hover:opacity-90 transition shadow-soft-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Flag className="w-4 h-4" />
              <span>Record Claim Report</span>
            </button>
          </form>

          {/* Success Banner */}
          {submitted && (
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Report logged successfully to local browser audit store.</span>
            </div>
          )}

          {/* Local Reports Log */}
          <div className="pt-4 border-t border-line space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-sm text-heading flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-primary" />
                <span>Your Local Claim Reports ({reports.length})</span>
              </span>

              {reports.length > 0 && (
                <button
                  type="button"
                  onClick={handleExportJson}
                  className="px-2.5 py-1 rounded-xl bg-surface-sunken hover:bg-surface border border-line text-[11px] font-mono text-text-muted hover:text-heading flex items-center gap-1 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>
              )}
            </div>

            {reports.length === 0 ? (
              <div className="p-6 text-center text-xs text-text-muted bg-surface-sunken rounded-2xl border border-line">
                No claims reported yet. Submit an audit report above to build your local evidence log.
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                {reports.map((r) => (
                  <div
                    key={r.id}
                    className="p-3 rounded-2xl bg-surface-sunken border border-line text-xs flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-heading">{r.productName}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface border border-line text-text-muted">
                          {new Date(r.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="font-mono text-[11px] text-amber-600 dark:text-amber-400">
                        "{r.claimText}"
                      </div>
                      <div className="text-[11px] text-text-muted font-sans">
                        {r.category}
                      </div>
                      {r.notes && (
                        <div className="text-[11px] text-text-secondary mt-1 bg-surface p-2 rounded-xl border border-line/60">
                          {r.notes}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(r.id)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                      title="Delete report"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
