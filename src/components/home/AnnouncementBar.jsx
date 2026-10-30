import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useT } from '../../context/I18nContext';

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('ecomart_announcement_dismissed') === 'true';
    } catch {
      return false;
    }
  });
  const { t } = useT();

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem('ecomart_announcement_dismissed', 'true');
    } catch {
      // ignore storage error in restricted modes
    }
  };

  return (
    <aside
      aria-label={t('home.announcement_label', 'Announcement')}
      className="relative z-50 bg-surface-accent border-b border-line text-heading text-xs font-sans py-2 px-4 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-center">
        <div className="flex-1 flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />
          <span className="font-medium tracking-wide">
            {t('home.announcement', 'Free shipping over ₹499 · Shop with purpose')}
          </span>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="p-1 rounded-full text-text-muted hover:text-heading hover:bg-surface transition cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center shrink-0 focus-visible:outline-2 focus-visible:outline-focus"
          aria-label={t('common.dismiss', 'Dismiss announcement')}
        >
          <X className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
