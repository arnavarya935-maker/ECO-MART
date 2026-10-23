import React from 'react';
import { CheckCircle2, AlertCircle, Info, Sparkles, X } from 'lucide-react';

/**
 * Single Unified Accessible Toast Component
 * Features:
 * - role="status" and aria-live="polite"
 * - Action buttons such as "Undo"
 * - Dismiss button
 * - Stable position in z-toasts scale
 */
export default function Toast({ toasts = [], onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="false"
      className="fixed top-20 right-4 sm:right-6 z-toasts flex flex-col gap-2.5 max-w-sm w-[calc(100vw-2rem)] sm:w-auto pointer-events-none"
    >
      {toasts.map((toast) => {
        const type = toast.type || 'info';

        const icons = {
          success: <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />,
          swap: <Sparkles className="w-4 h-4 text-primary shrink-0" />,
          error: <AlertCircle className="w-4 h-4 text-danger shrink-0" />,
          info: <Info className="w-4 h-4 text-info shrink-0" />
        };

        const borders = {
          success: 'border-primary/30 bg-surface-raised/95 text-heading',
          swap: 'border-primary/40 bg-surface-accent/95 text-heading',
          error: 'border-danger/30 bg-danger-subtle/95 text-danger',
          info: 'border-line bg-surface-raised/95 text-heading'
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border shadow-soft-lg backdrop-blur-md transition-all duration-300 animate-slide-up ${
              borders[type] || borders.info
            }`}
          >
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              {icons[type] || icons.info}
              <span className="text-xs font-sans font-medium leading-snug truncate-2">
                {toast.message}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {toast.action && (
                <button
                  type="button"
                  onClick={() => {
                    toast.action.onClick?.();
                    onDismiss?.(toast.id);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast text-[11px] font-sans font-bold transition-all active:scale-95 shadow-soft-xs cursor-pointer min-h-[28px]"
                >
                  {toast.action.label || 'Undo'}
                </button>
              )}

              <button
                type="button"
                onClick={() => onDismiss?.(toast.id)}
                aria-label="Dismiss notification"
                className="p-1 rounded-lg text-muted hover:text-text hover:bg-black/5 transition cursor-pointer min-w-[28px] min-h-[28px] flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
