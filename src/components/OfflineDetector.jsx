import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';

export default function OfflineDetector() {
  const [swWaitingRegistration, setSwWaitingRegistration] = useState(null);

  // Listen for SW update waiting
  useEffect(() => {
    const handleUpdateWaiting = (e) => {
      if (e.detail?.registration) {
        setSwWaitingRegistration(e.detail.registration);
      }
    };
    window.addEventListener('sw-update-waiting', handleUpdateWaiting);
    return () => window.removeEventListener('sw-update-waiting', handleUpdateWaiting);
  }, []);

  const handleApplyUpdate = () => {
    if (swWaitingRegistration?.waiting) {
      swWaitingRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  return (
    <>
      {/* Service Worker Update Prompt */}
      {swWaitingRegistration && (
        <div
          role="alert"
          className="bg-primary text-primary-contrast px-4 py-2.5 text-xs font-semibold flex items-center justify-between shadow-soft-md select-none sticky top-0 z-50 border-b border-primary-hover animate-slide-up"
        >
          <div className="flex items-center gap-2.5 max-w-7xl mx-auto px-4">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>New version available with catalog &amp; performance updates.</span>
            <button
              type="button"
              onClick={handleApplyUpdate}
              className="ml-2 px-3 py-1 rounded-xl bg-surface hover:bg-surface-sunken text-primary font-bold transition-colors cursor-pointer min-h-[32px] focus-visible:outline-2 focus-visible:outline-focus"
            >
              Refresh to Update
            </button>
          </div>
          <button
            type="button"
            onClick={() => setSwWaitingRegistration(null)}
            aria-label="Dismiss update banner"
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-primary-hover text-primary-contrast transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
}
