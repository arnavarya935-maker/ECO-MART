import React, { useEffect, useState } from 'react';
import { Keyboard, X, Sparkles, Command } from 'lucide-react';
import Modal from './ui/Modal';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const SHORTCUTS = [
  { key: '?', label: 'Open / close this keyboard shortcuts guide' },
  { key: 'H', label: 'Navigate to Home' },
  { key: 'S', label: 'Open Shop Catalog' },
  { key: 'T', label: 'Open Eco Tools & Calculators' },
  { key: 'C', label: 'Toggle Shopping Cart Drawer' },
  { key: 'E', label: 'Ask Eco Agent AI Assistant' },
  { key: 'M', label: 'Toggle Dark / Light Theme Mode' },
  { key: 'Esc', label: 'Close any open modal or drawer' }
];

export default function KeyboardShortcutsModal({ setActivePage }) {
  const [isOpen, setIsOpen] = useState(false);
  const { setIsCartOpen, setIsAgentOpen } = useCart();
  const { toggleTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is currently typing in an input, textarea, or select
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'h' || e.key === 'H') {
        if (setActivePage) setActivePage('home');
      } else if (e.key === 's' || e.key === 'S') {
        if (setActivePage) setActivePage('shop');
      } else if (e.key === 't' || e.key === 'T') {
        if (setActivePage) setActivePage('tools');
      } else if (e.key === 'c' || e.key === 'C') {
        setIsCartOpen((prev) => !prev);
      } else if (e.key === 'e' || e.key === 'E') {
        setIsAgentOpen(true);
      } else if (e.key === 'm' || e.key === 'M') {
        toggleTheme();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActivePage, setIsCartOpen, setIsAgentOpen, toggleTheme]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Keyboard Shortcuts"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
          Navigate EcoMart rapidly without touching your mouse. Press <kbd className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 border font-mono font-bold">?</kbd> anytime to open this guide.
        </p>

        <div className="space-y-2">
          {SHORTCUTS.map((sc, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 text-xs"
            >
              <span className="text-stone-700 dark:text-stone-300 font-medium">
                {sc.label}
              </span>
              <kbd className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 font-mono font-black text-stone-900 dark:text-stone-100 shadow-2xs">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
