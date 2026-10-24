import React from 'react';
import { AlertTriangle, RefreshCw, RotateCcw, Copy, Check } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
      isResetting: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary captured error:', error, errorInfo);
    this.setState({ errorInfo });

    // Detect Vite dynamic import chunk mismatch errors following deployments
    const msg = error?.message || '';
    const isChunkError =
      msg.includes('Failed to fetch dynamically imported module') ||
      msg.includes('Loading chunk') ||
      error?.name === 'ChunkLoadError' ||
      msg.includes('Importing a module script failed');

    if (isChunkError && typeof window !== 'undefined') {
      const reloadKey = 'ecomart_chunk_reload_ts';
      const lastReload = Number(sessionStorage.getItem(reloadKey) || 0);
      if (Date.now() - lastReload > 8000) {
        sessionStorage.setItem(reloadKey, String(Date.now()));
        console.warn('[ErrorBoundary] Chunk mismatch detected. Attempting auto-reload for fresh build...');
        window.location.reload();
      }
    }
  }

  handleCopyDiagnostics = () => {
    const { error, errorInfo } = this.state;
    const diagnosticText = [
      `EcoMart Error Diagnostic:`,
      `Time: ${new Date().toISOString()}`,
      `URL: ${typeof window !== 'undefined' ? window.location.href : 'unknown'}`,
      `User Agent: ${typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'}`,
      `Error Name: ${error?.name || 'Error'}`,
      `Error Message: ${error?.message || 'Unknown error'}`,
      `Stack Trace:\n${error?.stack || 'No stack trace available'}`,
      `Component Stack:\n${errorInfo?.componentStack || 'No component stack'}`
    ].join('\n\n');

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(diagnosticText).then(() => {
        this.setState({ copied: true });
        setTimeout(() => this.setState({ copied: false }), 2000);
      }).catch(() => {});
    }
  };

  handleHardReset = async () => {
    this.setState({ isResetting: true });
    try {
      if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.unregister();
        }
      }
      if (typeof window !== 'undefined' && 'caches' in window) {
        const keys = await caches.keys();
        for (const key of keys) {
          await caches.delete(key);
        }
      }
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.clear();
      }
    } catch (err) {
      console.warn('Cache purge failed:', err);
    }
    if (typeof window !== 'undefined') {
      window.location.replace('/?reset=' + Date.now());
    }
  };

  render() {
    if (this.state.hasError) {
      const { error, copied, isResetting } = this.state;
      const isChunkError =
        error?.message?.includes('Failed to fetch dynamically imported module') ||
        error?.message?.includes('Loading chunk') ||
        error?.name === 'ChunkLoadError';

      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-surface text-heading font-sans">
          <div className="max-w-lg w-full p-8 rounded-3xl bg-surface border border-line shadow-soft-lg text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-serif font-bold text-heading">
                {isChunkError ? 'App Update in Progress' : 'Something went sideways'}
              </h2>
              <p className="text-xs text-text-secondary leading-relaxed">
                {isChunkError
                  ? 'A new version of EcoMart was just published. Reloading will sync your browser with the latest version.'
                  : "EcoMart encountered an unexpected visual issue. Don't worry — your cart and saved impact data are safely preserved in offline storage."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary hover:bg-primary-hover text-primary-contrast font-medium text-xs shadow-soft-sm transition min-h-[44px] cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>

              <button
                type="button"
                onClick={this.handleHardReset}
                disabled={isResetting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-surface-raised hover:bg-surface-sunken border border-line text-heading font-medium text-xs shadow-soft-sm transition min-h-[44px] cursor-pointer disabled:opacity-50"
              >
                <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
                <span>{isResetting ? 'Purging Cache...' : 'Clear Cache & Reset'}</span>
              </button>
            </div>

            {/* Expandable Technical Diagnostics */}
            <details className="text-left mt-4 pt-3 border-t border-line group">
              <summary className="cursor-pointer text-xs font-mono text-text-muted hover:text-text select-none flex items-center justify-between">
                <span>Diagnostic details</span>
                <span className="text-[10px] text-text-muted group-open:hidden">Show</span>
              </summary>

              <div className="mt-3 p-3 rounded-2xl bg-surface-sunken/60 border border-line/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-semibold text-danger">
                    {error?.name || 'Error'}: {error?.message || 'Unknown error'}
                  </span>
                  <button
                    type="button"
                    onClick={this.handleCopyDiagnostics}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface border border-line text-[10px] font-mono text-text hover:text-primary transition"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {error?.stack && (
                  <pre className="font-mono text-[10px] text-text-muted overflow-x-auto max-h-36 p-2 rounded-lg bg-surface/80 leading-relaxed whitespace-pre-wrap">
                    {error.stack}
                  </pre>
                )}
              </div>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

