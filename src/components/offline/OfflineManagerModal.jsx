import React, { useState, useEffect } from 'react';
import {
  Wifi,
  WifiOff,
  X,
  CheckCircle2,
  HardDrive,
  Download,
  ShieldCheck,
  RefreshCw,
  Cpu,
  Layers
} from 'lucide-react';

export default function OfflineManagerModal({ isOpen, onClose }) {
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));
  const [cacheSizeEst, setCacheSizeEst] = useState('~4.2 MB (Cached)');
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (typeof navigator !== 'undefined' && 'storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then((est) => {
        if (est.usage) {
          const mb = (est.usage / (1024 * 1024)).toFixed(1);
          setCacheSizeEst(`${mb} MB local storage utilized`);
        }
      }).catch(() => {});
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallPWA = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const result = await installPrompt.userChoice;
    if (result.outcome === 'accepted') {
      setInstalled(true);
    }
    setInstallPrompt(null);
  };

  const OFFLINE_CAPABILITIES = [
    { feature: 'Product Catalog & Pricing', status: 'Offline Available', note: 'All 64 products and lifecycle attributes bundled client-side.' },
    { feature: 'EcoScore & Carbon Delta Algorithm', status: 'Offline Available', note: 'ISO 14040 open formula executes in client JavaScript.' },
    { feature: 'Multi-Agent Shopping Intelligence', status: 'Offline Available', note: 'Deterministic rules & local knowledge collective fallback.' },
    { feature: 'Greenwash Detection & Claim Lexicon', status: 'Offline Available', note: 'ASCI and FTC regulatory regex lexicon runs on device.' },
    { feature: 'Impact Command Center & Receipts', status: 'Offline Available', note: 'Generates printable receipts and budget bars without cloud sync.' },
    { feature: 'Registry Verification Lookups', status: 'Online Only', note: 'Clicking out to public registries (GOTS, FSC) requires internet.' }
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-modals flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-left text-text"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-surface-raised border border-line rounded-3xl shadow-soft-xl flex flex-col max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-line bg-surface flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
                Offline Resilience
              </span>
              <span className="text-xs text-muted font-medium">PWA Service Worker</span>
            </div>
            <h3 className="font-serif font-bold text-2xl text-heading mt-1">
              Offline Capability Manager
            </h3>
            <p className="text-xs text-secondary mt-0.5">
              EcoMart is engineered as an offline-first resilient Progressive Web App (PWA).
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-xl text-muted hover:text-heading hover:bg-surface-sunken transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close Offline Manager"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Connection Status Banner */}
        <div className="px-6 py-4 bg-surface-sunken border-b border-line flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              isOnline
                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
            }`}>
              {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
            </div>
            <div>
              <div className="font-bold text-xs text-heading flex items-center gap-2">
                <span>Network Status:</span>
                <span className={`px-2 py-0.5 rounded-full text-xs uppercase font-mono font-bold ${
                  isOnline
                    ? 'bg-emerald-500/15 text-emerald-600'
                    : 'bg-amber-500/15 text-amber-600'
                }`}>
                  {isOnline ? 'Online (Proxy Active)' : 'Offline Mode'}
                </span>
              </div>
              <div className="text-xs text-muted mt-0.5 font-mono">
                {cacheSizeEst}
              </div>
            </div>
          </div>

          {installPrompt && !installed && (
            <button
              type="button"
              onClick={handleInstallPWA}
              className="px-4 py-2.5 min-h-[44px] rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast font-semibold text-xs flex items-center gap-1.5 transition shadow-soft-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
          )}
        </div>

        {/* Capabilities Matrix */}
        <div className="p-6 space-y-3 overflow-y-auto">
          <div className="text-xs font-semibold text-heading uppercase font-mono tracking-wider">
            Offline Operational Matrix
          </div>
          <div className="space-y-2">
            {OFFLINE_CAPABILITIES.map((cap, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-surface border border-line flex items-start justify-between gap-3"
              >
                <div>
                  <div className="font-serif font-bold text-xs text-heading">
                    {cap.feature}
                  </div>
                  <div className="text-xs text-secondary mt-0.5">
                    {cap.note}
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold whitespace-nowrap shrink-0 border ${
                  cap.status === 'Offline Available'
                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                    : 'bg-surface-sunken text-muted border-line'
                }`}>
                  {cap.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-surface border-t border-line flex items-center justify-between text-xs text-muted">
          <span>0 external assets loaded over CDNs; self-hosted and offline-capable.</span>
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
