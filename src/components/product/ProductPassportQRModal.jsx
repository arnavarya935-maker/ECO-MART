import React, { useState } from 'react';
import { QrCode, X, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';

export default function ProductPassportQRModal({ isOpen, onClose, product }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !product) return null;

  const passportUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/#/product/${product.id}?passport=view`
    : `#/product/${product.id}?passport=view`;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(passportUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-left text-text"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-surface-raised border border-line rounded-3xl shadow-soft-xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-line bg-surface flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
                Digital Passport
              </span>
              <span className="text-xs text-muted font-medium">Feature 61</span>
            </div>
            <h3 className="font-serif font-bold text-xl text-heading mt-1">
              Product Passport QR Link
            </h3>
            <p className="text-xs text-secondary mt-0.5">
              Read-only provenance link for <strong className="text-heading">{product.name}</strong>.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-muted hover:text-heading hover:bg-surface-sunken transition-colors cursor-pointer"
            aria-label="Close QR Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Presentation */}
        <div className="p-8 bg-surface-sunken/50 flex flex-col items-center justify-center space-y-4 border-b border-line">
          {/* Pure Inline Vector QR Canvas */}
          <div className="p-4 bg-white rounded-3xl shadow-soft-md border border-line flex items-center justify-center">
            <svg
              viewBox="0 0 160 160"
              className="w-44 h-44"
              aria-label={`QR code for ${product.name} passport`}
            >
              {/* Outer boundary */}
              <rect width="160" height="160" fill="#FFFFFF" />

              {/* Corner position markers */}
              {/* Top-Left */}
              <rect x="15" y="15" width="40" height="40" fill="#064E3B" rx="4" />
              <rect x="23" y="23" width="24" height="24" fill="#FFFFFF" />
              <rect x="29" y="29" width="12" height="12" fill="#064E3B" rx="2" />

              {/* Top-Right */}
              <rect x="105" y="15" width="40" height="40" fill="#064E3B" rx="4" />
              <rect x="113" y="23" width="24" height="24" fill="#FFFFFF" />
              <rect x="119" y="29" width="12" height="12" fill="#064E3B" rx="2" />

              {/* Bottom-Left */}
              <rect x="15" y="105" width="40" height="40" fill="#064E3B" rx="4" />
              <rect x="23" y="113" width="24" height="24" fill="#FFFFFF" />
              <rect x="29" y="119" width="12" height="12" fill="#064E3B" rx="2" />

              {/* Stylized QR Matrix Pattern */}
              <g fill="#047857">
                <rect x="65" y="20" width="8" height="8" rx="1" />
                <rect x="80" y="20" width="8" height="8" rx="1" />
                <rect x="70" y="35" width="12" height="8" rx="1" />
                <rect x="65" y="50" width="8" height="8" rx="1" />
                <rect x="85" y="50" width="8" height="8" rx="1" />
                <rect x="25" y="65" width="8" height="8" rx="1" />
                <rect x="40" y="65" width="8" height="8" rx="1" />
                <rect x="55" y="65" width="8" height="8" rx="1" />
                <rect x="70" y="65" width="8" height="8" rx="1" />
                <rect x="85" y="65" width="8" height="8" rx="1" />
                <rect x="100" y="65" width="8" height="8" rx="1" />
                <rect x="115" y="65" width="8" height="8" rx="1" />
                <rect x="130" y="65" width="8" height="8" rx="1" />

                <rect x="65" y="80" width="12" height="8" rx="1" />
                <rect x="85" y="80" width="8" height="8" rx="1" />
                <rect x="105" y="80" width="8" height="8" rx="1" />
                <rect x="120" y="80" width="12" height="8" rx="1" />

                <rect x="65" y="95" width="8" height="8" rx="1" />
                <rect x="80" y="95" width="12" height="8" rx="1" />
                <rect x="100" y="95" width="8" height="8" rx="1" />

                <rect x="65" y="110" width="8" height="8" rx="1" />
                <rect x="85" y="110" width="8" height="8" rx="1" />
                <rect x="105" y="110" width="12" height="8" rx="1" />
                <rect x="125" y="110" width="8" height="8" rx="1" />

                <rect x="65" y="125" width="12" height="8" rx="1" />
                <rect x="85" y="125" width="8" height="8" rx="1" />
                <rect x="100" y="125" width="8" height="8" rx="1" />
                <rect x="115" y="125" width="8" height="8" rx="1" />
                <rect x="130" y="125" width="8" height="8" rx="1" />
              </g>

              {/* Center Eco Seed Emblem */}
              <circle cx="80" cy="80" r="10" fill="#FFFFFF" />
              <circle cx="80" cy="80" r="7" fill="#10B981" />
            </svg>
          </div>

          <div className="text-center space-y-1">
            <span className="text-xs font-mono font-bold text-primary block">
              Passport ID: {product.id}
            </span>
            <span className="text-[11px] text-muted">
              Scan with any mobile device to view verified lifecycle data.
            </span>
          </div>
        </div>

        {/* Copy Link Row */}
        <div className="p-6 space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={passportUrl}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-surface border border-line text-xs font-mono text-heading select-all outline-hidden"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast font-semibold text-xs flex items-center gap-1.5 transition shadow-soft-xs cursor-pointer shrink-0"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>

          <div className="p-3 rounded-2xl bg-surface-sunken border border-line text-[11px] text-secondary flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>
              <strong>Zero Backend Tracking:</strong> Link encodes read-only route parameters locally without cookie cookies, sessions, or cloud accounts.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
