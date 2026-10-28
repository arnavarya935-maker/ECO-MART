import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  Download,
  CheckCircle2,
  Trash2
} from 'lucide-react';

const CATEGORIES = [
  'Sustainability Suggestion',
  'EcoScore / Carbon Inaccuracy',
  'Greenwash Packaging Report',
  'Bug / Interface Glitch',
  'General Thought'
];

export default function FeedbackInboxModal({ isOpen, onClose }) {
  const [submissions, setSubmissions] = useState(() => {
    try {
      const saved = localStorage.getItem('ecomart_feedback_inbox');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [category, setCategory] = useState(CATEGORIES[0]);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('ecomart_feedback_inbox', JSON.stringify(submissions));
    } catch {}
  }, [submissions]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newEntry = {
      id: `fb-${Date.now()}`,
      category,
      comment: comment.trim(),
      timestamp: new Date().toLocaleString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setSubmissions((prev) => [newEntry, ...prev]);
    setComment('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(submissions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ecomart-feedback-log-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClearAll = () => {
    setSubmissions([]);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-left text-text"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-surface-raised border border-line rounded-3xl shadow-soft-xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-line bg-surface flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
                Feedback &amp; Audits
              </span>
              <span className="text-xs text-muted font-medium">Feature 62</span>
            </div>
            <h3 className="font-serif font-bold text-2xl text-heading mt-1">
              Local Feedback Inbox
            </h3>
            <p className="text-xs text-secondary mt-0.5">
              Submit observations on product scoring, report bugs, or log greenwash claims. Stored on your device with JSON export.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-muted hover:text-heading hover:bg-surface-sunken transition-colors cursor-pointer"
            aria-label="Close Feedback Inbox"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Submission Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-heading block mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-line text-xs font-medium text-heading focus:outline-2 focus:outline-focus"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-heading block mb-1.5">
                Your Observation or Suggestion
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe your feedback, specify product name if reporting an inaccuracy, or suggest a new conscious feature..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-line text-xs font-medium text-heading placeholder:text-muted focus:outline-2 focus:outline-focus"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted">
                {submitted && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Logged locally!
                  </span>
                )}
              </span>

              <button
                type="submit"
                disabled={!comment.trim()}
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-40 text-primary-contrast font-semibold text-xs flex items-center gap-1.5 transition shadow-soft-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Save Observation</span>
              </button>
            </div>
          </form>

          {/* Submissions History */}
          <div className="space-y-3 pt-4 border-t border-line">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-heading font-mono uppercase tracking-wider">
                Logged Submissions ({submissions.length})
              </span>
              {submissions.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportJSON}
                    className="text-xs text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export JSON</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="text-xs text-muted hover:text-danger ml-2 cursor-pointer"
                    title="Clear list"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {submissions.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted border border-line rounded-2xl bg-surface-sunken">
                No observations logged yet in this browser.
              </div>
            ) : (
              <div className="space-y-2.5">
                {submissions.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-surface border border-line text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-muted font-mono">{item.timestamp}</span>
                    </div>
                    <p className="text-secondary leading-relaxed pt-1 font-sans">
                      {item.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-surface border-t border-line flex items-center justify-between text-[11px] text-muted">
          <span>🔒 Stored exclusively in local storage ('ecomart_feedback_inbox').</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-surface-sunken hover:bg-surface border border-line text-xs font-semibold text-heading cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
