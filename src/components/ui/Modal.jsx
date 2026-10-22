import React, { useEffect, useRef, useId } from 'react';
import { X } from 'lucide-react';

/**
 * Shared Accessible Modal & Drawer Primitive
 * Features:
 * - Focus Trap with Tab / Shift+Tab cycling
 * - Escape key to close
 * - Restores focus to the trigger element when closed
 * - Body scroll lock
 * - WAI-ARIA role="dialog", aria-modal="true", and aria-labelledby
 * - Click-outside backdrop dismissal
 * - Modal (centered) & Drawer (slide-over sheet) variants
 */
export function Modal({
  isOpen,
  onClose,
  title,
  ariaLabel,
  children,
  variant = 'modal', // 'modal' | 'drawer'
  drawerPosition = 'right', // 'right' | 'bottom'
  maxWidth = 'max-w-xl',
  className = '',
  showCloseButton = true,
  headerActions = null
}) {
  const dialogRef = useRef(null);
  const previousActiveElementRef = useRef(null);
  const titleId = useId();

  // 1. Return focus to trigger when closing + remember previous active element
  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = document.activeElement;
    } else if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === 'function') {
      previousActiveElementRef.current.focus();
      previousActiveElementRef.current = null;
    }
  }, [isOpen]);

  // 2. Scroll lock & Escape key handling
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // 3. Focus trap: Focus first element and cycle with Tab / Shift+Tab
  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;

    const getFocusable = () => {
      if (!dialogRef.current) return [];
      return Array.from(
        dialogRef.current.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement);
    };

    // Auto-focus first focusable element or the dialog itself
    const timer = setTimeout(() => {
      const focusables = getFocusable();
      if (focusables.length > 0) {
        focusables[0].focus();
      } else {
        dialogRef.current?.focus();
      }
    }, 50);

    const handleTab = (e) => {
      if (e.key !== 'Tab') return;
      const focusables = getFocusable();
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleTab);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleTab);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isDrawer = variant === 'drawer';
  const zClass = isDrawer ? 'z-drawers' : 'z-modals';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
      aria-label={!title ? ariaLabel : undefined}
      className={`fixed inset-0 ${zClass} flex ${
        isDrawer
          ? drawerPosition === 'bottom'
            ? 'items-end justify-center'
            : 'items-stretch justify-end'
          : 'items-center justify-center p-4 sm:p-6'
      }`}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-heading/50 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      {/* Content Dialog */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={`relative bg-surface-raised text-text border-line shadow-soft-xl flex flex-col focus:outline-hidden ${
          isDrawer
            ? drawerPosition === 'bottom'
              ? `w-full max-h-[85vh] rounded-t-3xl border-t animate-slide-up ${className}`
              : `w-full ${maxWidth || 'max-w-md'} h-full border-l animate-slide-left ${className}`
            : `w-full ${maxWidth} rounded-3xl border animate-slide-up overflow-hidden my-auto max-h-[90vh] ${className}`
        }`}
      >
        {/* Header */}
        {(title || showCloseButton || headerActions) && (
          <div className="flex items-center justify-between p-5 sm:p-6 border-b border-line shrink-0">
            {title ? (
              typeof title === 'string' ? (
                <h2 id={titleId} className="font-serif text-lg sm:text-xl font-bold text-heading tracking-tight">
                  {title}
                </h2>
              ) : (
                <div id={titleId} className="flex-1">
                  {title}
                </div>
              )
            ) : <div />}

            <div className="flex items-center gap-2">
              {headerActions}
              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="w-9 h-9 rounded-xl text-muted hover:text-heading hover:bg-surface-sunken transition-colors cursor-pointer flex items-center justify-center focus-visible:outline-2 focus-visible:outline-focus"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Dedicated Drawer wrapper around Modal
 */
export function Drawer(props) {
  return <Modal {...props} variant="drawer" />;
}

export default Modal;
