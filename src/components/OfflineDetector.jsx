import React, { useState, useEffect } from 'react';
import { WifiOff, X, Sparkles, CheckCircle2 } from 'lucide-react';

export default function OfflineDetector() {
  const [isOnline, setIsOnline] = useState(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [dismissed, setDismissed] = useState(false);
  const [swWaitingRegistration, setSwWaitingRegistration] = useState(null);
  const [isOfflineReady, setIsOfflineReady] = useState(false);

  // 1. Online / Offline network listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setDismissed(false);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setDismissed(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 2. Listen for SW update waiting
  useEffect(() => {
    const handleUpdateWaiting = (e) => {
      if (e.detail?.registration) {
        setSwWaitingRegistration(e.detail.registration);
      }
    };
    window.addEventListener('sw-update-waiting', handleUpdateWaiting);
    return () => window.removeEventListener('sw-update-waiting', handleUpdateWaiting);
  }, []);

  // 3. Background idle caching for offline availability (only when not on metered/save-data)
  useEffect(() => {
    if (typeof window === 'undefined' || !('caches' in window)) return;

    // Check metered or save-data connection
    const conn = navigator.connection;
    const isSaveData = Boolean(conn?.saveData);
    const isMetered = conn?.type === 'cellular' || conn?.effectiveType === '2g' || conn?.effectiveType === 'slow-2g';

    if (isSaveData || isMetered) return;

    const runIdlePrefetch = () => {
      fetch('/offline-manifest.json')
        .then((res) => {
          if (!res.ok) return null;
          return res.json();
        })
        .then(async (manifest) => {
          if (!manifest || !manifest.idleAssets || !manifest.cacheName) return;

          const cache = await caches.open(manifest.cacheName);
          const assets = manifest.idleAssets;

          // Chunk the idle caching in slices so main thread remains 100% responsive
          let index = 0;
          function cacheNextBatch() {
            const batch = assets.slice(index, index + 5);
            index += 5;

            Promise.all(
              batch.map(async (asset) => {
                try {
                  const match = await cache.match(asset);
                  if (!match) {
                    await cache.add(asset);
                  }
                } catch {
                  // Ignore single asset fetch failure during background idle
                }
              })
            ).then(() => {
              if (index < assets.length) {
                if ('requestIdleCallback' in window) {
                  window.requestIdleCallback(cacheNextBatch, { timeout: 2000 });
                } else {
                  setTimeout(cacheNextBatch, 500);
                }
              } else {
                // All assets cached!
                const alreadyNotified = sessionStorage.getItem('ecomart_offline_ready_notified');
                if (!alreadyNotified) {
                  sessionStorage.setItem('ecomart_offline_ready_notified', 'true');
                  setIsOfflineReady(true);
                  setTimeout(() => setIsOfflineReady(false), 4500);
                }
              }
            });
          }

          if ('requestIdleCallback' in window) {
            window.requestIdleCallback(cacheNextBatch, { timeout: 3000 });
          } else {
            setTimeout(cacheNextBatch, 1500);
          }
        })
        .catch(() => {});
    };

    if (document.readyState === 'complete') {
      runIdlePrefetch();
    } else {
      window.addEventListener('load', runIdlePrefetch, { once: true });
    }
  }, []);

  const handleApplyUpdate = () => {
    if (swWaitingRegistration?.waiting) {
      swWaitingRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  return (
    <>
      {/* Service Worker Update Prompt (No silent skipWaiting) */}
      {swWaitingRegistration && (
        <div
          role="alert"
          className="bg-primary text-primary-contrast px-4 py-2.5 text-xs font-semibold flex items-center justify-between shadow-soft-md select-none sticky top-0 z-50 border-b border-primary-hover animate-slide-up"
        >
          <div className="flex items-center gap-2.5 max-w-7xl mx-auto px-4">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>New version available with catalog & performance updates.</span>
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

      {/* Offline Mode Alert Banner */}
      {!isOnline && !dismissed && (
        <div
          role="status"
          className="bg-warning/10 text-warning px-4 py-2.5 text-xs font-medium flex items-center justify-between shadow-soft-xs select-none sticky top-0 z-50 border-b border-warning/30"
        >
          <div className="flex items-center gap-2.5 max-w-7xl mx-auto px-4">
            <WifiOff className="w-4 h-4 shrink-0 text-warning" />
            <span>
              <strong className="font-semibold text-warning">Offline Mode Active</strong> — Catalog browsing, calculators, and cart audits continue to work locally without an internet connection.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss offline banner"
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-warning/20 text-warning transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-focus"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Ready For Offline Small Indicator */}
      {isOfflineReady && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 md:bottom-6 right-6 z-toasts animate-slide-up pointer-events-auto"
        >
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary text-primary-contrast shadow-soft-lg border border-primary/40 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Ready for offline — catalog & textures cached</span>
            <button
              type="button"
              onClick={() => setIsOfflineReady(false)}
              aria-label="Dismiss offline ready indicator"
              className="ml-1 text-primary-contrast/80 hover:text-primary-contrast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
