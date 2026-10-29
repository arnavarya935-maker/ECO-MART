import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Keyboard } from 'lucide-react';
import { Modal } from './ui/Modal';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const SHORTCUTS = [
  { key: '?', label: 'Open / close this keyboard shortcuts guide' },
  { key: 'Cmd/Ctrl + K', label: 'Open Command Palette' },
  { key: 'H', label: 'Navigate to Home' },
  { key: 'S', label: 'Open Shop Catalog' },
  { key: 'T', label: 'Open Eco Tools & Calculators' },
  { key: 'C', label: 'Toggle Shopping Cart Drawer' },
  { key: 'E', label: 'Ask Eco Agent AI Assistant' },
  { key: 'R', label: 'Toggle Reduce Effects mode' },
  { key: 'Esc', label: 'Close any open modal or drawer' }
];

export default function KeyboardShortcutsModal({ isOpen: controlledOpen, onClose: controlledClose }) {
  const [internalOpen, setInternalOpen] = useState(true);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const handleClose = useCallback(() => {
    if (controlledClose) controlledClose();
    else setInternalOpen(false);
  }, [controlledClose]);

  const navigate = useNavigate();
  const { setIsCartOpen, setIsAgentOpen } = useCart();
  const { toggleReduceEffects } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is currently typing in an input, textarea, or select
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
        e.preventDefault();
        if (isOpen) {
          handleClose();
        } else {
          if (controlledClose) controlledClose(true);
          else setInternalOpen(true);
        }
      } else if (e.key === 'Escape' && isOpen) {
        handleClose();
      } else if (e.key === 'h' || e.key === 'H') {
        navigate('/');
      } else if (e.key === 's' || e.key === 'S') {
        navigate('/shop');
      } else if (e.key === 't' || e.key === 'T') {
        navigate('/tools');
      } else if (e.key === 'c' || e.key === 'C') {
        setIsCartOpen((prev) => !prev);
      } else if (e.key === 'e' || e.key === 'E') {
        setIsAgentOpen(true);
      } else if (e.key === 'r' || e.key === 'R') {
        toggleReduceEffects();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, controlledClose, handleClose, navigate, setIsCartOpen, setIsAgentOpen, toggleReduceEffects]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Keyboard Shortcuts"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <p className="text-xs text-muted leading-relaxed font-normal">
          Navigate Eco Sense rapidly without touching your mouse. Press <kbd className="px-1.5 py-0.5 rounded-md bg-surface-sunken border border-line text-heading font-mono font-semibold text-[11px]">?</kbd> anytime to open this guide, or <kbd className="px-1.5 py-0.5 rounded-md bg-surface-sunken border border-line text-heading font-mono font-semibold text-[11px]">Ctrl/Cmd + K</kbd> for the Command Palette.
        </p>

        <div className="divide-y divide-line border border-line rounded-2xl overflow-hidden bg-surface shadow-soft-xs">
          {SHORTCUTS.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between px-3.5 py-2.5 text-xs">
              <span className="text-text font-medium">{item.label}</span>
              <kbd className="px-2 py-1 rounded-md bg-surface-sunken border border-line text-heading font-mono font-semibold text-[11px] shadow-soft-xs">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-1 text-[11px] text-muted font-medium">
          <Keyboard className="w-3.5 h-3.5 text-muted" />
          <span>Full keyboard accessibility supported across the entire site</span>
        </div>
      </div>
    </Modal>
  );
}
