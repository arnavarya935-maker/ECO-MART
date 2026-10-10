import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, X } from 'lucide-react';

export default function OfflineDetector() {
  const [isOnline, setIsOnline] = useState(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [dismissed, setDismissed] = useState(false);

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

  if (isOnline || dismissed) return null;

  return (
    <div
      role="status"
      className="bg-amber-500 text-stone-950 px-4 py-2 text-xs font-extrabold flex items-center justify-between shadow-xs select-none sticky top-0 z-50 border-b border-amber-600/30"
    >
      <div className="flex items-center gap-2 max-w-7xl mx-auto px-4">
        <WifiOff className="w-4 h-4 shrink-0 text-stone-950" />
        <span>
          ⚡ Offline Mode Active — EcoMart is 100% offline-native! All product catalog browsing, cart audits, and local features work with zero internet.
        </span>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss offline banner"
        className="p-1 rounded-lg hover:bg-amber-600/30 transition cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
