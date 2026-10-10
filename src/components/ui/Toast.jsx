import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  if (!message) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-600 shrink-0" />
  };

  const borders = {
    success: 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/95 dark:bg-[#0D241C]/95 text-emerald-950 dark:text-emerald-200',
    error: 'border-rose-300 dark:border-rose-700 bg-rose-50/95 dark:bg-[#2A0F17]/95 text-rose-950 dark:text-rose-200',
    info: 'border-sky-300 dark:border-sky-700 bg-sky-50/95 dark:bg-[#0C2233]/95 text-sky-950 dark:text-sky-200'
  };

  return (
    <div
      role="status"
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-slide-up ${borders[type] || borders.success}`}
    >
      {icons[type] || icons.success}
      <span className="text-xs sm:text-sm font-extrabold">{message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg opacity-60 hover:opacity-100 transition"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
