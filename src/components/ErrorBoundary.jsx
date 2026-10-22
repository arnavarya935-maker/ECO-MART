import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary captured error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-surface text-heading font-sans">
          <div className="max-w-md w-full p-8 rounded-3xl bg-surface border border-line shadow-soft-lg text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-warning/10 text-warning mx-auto flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-heading">
              Something went sideways
            </h2>
            <p className="text-xs text-secondary leading-relaxed">
              EcoMart encountered an unexpected visual issue. Don’t worry — your cart and saved impact data are safely preserved in offline storage.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary hover:bg-primary-hover text-primary-contrast font-medium text-xs shadow-soft-sm transition min-h-[44px]"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
