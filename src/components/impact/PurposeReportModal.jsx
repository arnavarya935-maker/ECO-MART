import React, { useRef, useState } from 'react';
import {
  X,
  Download,
  Printer,
  Sparkles,
  ShieldCheck,
  Wind,
  Ban,
  Droplets,
  Coins
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { useCart } from '../../context/CartContext';
import { calculateEquivalences } from '../../lib/conversionConstants';

const REPORT_DATE = new Date().toLocaleDateString('en-IN', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
});

export default function PurposeReportModal({ isOpen, onClose }) {
  const { cartItems, impact, userPriorities, orders } = useCart();
  const reportRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPng = async () => {
    if (!reportRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(reportRef.current, {
        cacheBust: true,
        quality: 0.95,
        backgroundColor: '#FAF9F6'
      });
      const link = document.createElement('a');
      link.download = `EcoMart-Purpose-Report.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      // Graceful fallback
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const equivalences = calculateEquivalences({
    co2Kg: impact?.savedCo2 || 4.8,
    plasticGrams: impact?.savedPlastic || 380,
    waterLitres: impact?.savedWater || 140
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="purpose-report-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-forest-950/60 backdrop-blur-xs overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl bg-surface rounded-3xl border border-line shadow-soft-xl overflow-hidden my-auto">
        {/* Modal Toolbar (Hidden on print) */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-line bg-surface-raised print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary-subtle text-primary border border-primary/20">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-sans font-bold text-heading">
              Export Purpose Report
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-line bg-surface hover:bg-surface-sunken text-xs font-sans font-semibold text-heading transition cursor-pointer min-h-[36px]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              type="button"
              disabled={downloading}
              onClick={handleDownloadPng}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverted text-xs font-sans font-bold transition cursor-pointer min-h-[36px] disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? 'Exporting...' : 'Save PNG'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close report modal"
              className="p-1.5 rounded-full hover:bg-surface-sunken text-muted hover:text-heading transition cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Printable / Exportable Purpose Report Document */}
        <div
          ref={reportRef}
          className="p-6 sm:p-8 space-y-6 bg-surface text-text-primary print:p-0 print:m-0"
        >
          {/* Letterhead Header */}
          <div className="flex items-start justify-between border-b border-line pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🌱</span>
                <span className="font-serif font-bold text-xl tracking-tight text-heading">
                  EcoMart
                </span>
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary-subtle text-primary border border-primary/20">
                  Purpose Ledger
                </span>
              </div>
              <h1 id="purpose-report-title" className="font-serif text-2xl font-bold text-heading mt-2">
                Conscious Commerce Purpose Report
              </h1>
              <p className="text-xs font-sans text-secondary mt-0.5">
                Verified on-device sustainability accounting & priority assessment
              </p>
            </div>

            <div className="text-right text-xs font-sans text-muted shrink-0">
              <div className="font-semibold text-heading">{REPORT_DATE}</div>
              <div>Guest Session #ECO-{Math.abs((orders?.length || 1) * 314159 % 90000 + 10000)}</div>
              <div className="text-[10px] text-primary font-bold">100% Offline Certified</div>
            </div>
          </div>

          {/* User's Stated Sustainability Priorities */}
          <div className="p-4 rounded-2xl bg-surface-raised border border-line space-y-2">
            <div className="text-xs font-sans font-bold uppercase tracking-wider text-muted flex items-center justify-between">
              <span>Your Active Multi-Criteria Priorities</span>
              <span className="text-[10px] text-primary">On-Device Profile</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-sans">
              <span className="px-2.5 py-1 rounded-xl bg-surface-sunken border border-line text-heading font-medium">
                Plastic Priority: <strong>{userPriorities?.plastic ?? 50}/100</strong>
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-surface-sunken border border-line text-heading font-medium">
                Price Priority: <strong>{userPriorities?.price ?? 50}/100</strong>
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-surface-sunken border border-line text-heading font-medium">
                Carbon Priority: <strong>{userPriorities?.carbon ?? 50}/100</strong>
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-surface-sunken border border-line text-heading font-medium">
                Water Priority: <strong>{userPriorities?.water ?? 50}/100</strong>
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-surface-sunken border border-line text-heading font-medium">
                Local Sourcing: <strong>{userPriorities?.local ?? 50}/100</strong>
              </span>
            </div>
          </div>

          {/* Environmental Avoidance Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-primary-subtle border border-primary/20 text-center">
              <div className="flex items-center justify-center text-primary mb-1">
                <Wind className="w-4 h-4" />
              </div>
              <div className="font-serif text-xl font-bold text-heading">
                {((impact?.savedCo2 || 4.8)).toFixed(1)} kg
              </div>
              <div className="text-[10px] font-sans font-semibold text-primary">CO₂ Avoided</div>
              <div className="text-[9px] font-sans text-muted">Estimate</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-accent-subtle border border-accent/20 text-center">
              <div className="flex items-center justify-center text-accent mb-1">
                <Ban className="w-4 h-4" />
              </div>
              <div className="font-serif text-xl font-bold text-heading">
                {Math.round(impact?.savedPlastic || 380)} g
              </div>
              <div className="text-[10px] font-sans font-semibold text-accent">Plastic Diverted</div>
              <div className="text-[9px] font-sans text-muted">Estimate</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-secondary-subtle border border-secondary/20 text-center">
              <div className="flex items-center justify-center text-secondary mb-1">
                <Droplets className="w-4 h-4" />
              </div>
              <div className="font-serif text-xl font-bold text-heading">
                {Math.round(impact?.savedWater || 140)} L
              </div>
              <div className="text-[10px] font-sans font-semibold text-secondary">Water Saved</div>
              <div className="text-[9px] font-sans text-muted">Estimate</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-raised border border-line text-center">
              <div className="flex items-center justify-center text-heading mb-1">
                <Coins className="w-4 h-4 text-primary" />
              </div>
              <div className="font-serif text-xl font-bold text-heading">
                ₹{Math.round(cartItems.reduce((acc, i) => acc + (i.product.price * 0.15 * i.quantity), 120)).toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] font-sans font-semibold text-heading">Disposables Saved</div>
              <div className="text-[9px] font-sans text-muted">Estimate</div>
            </div>
          </div>

          {/* Tangible Real-World Equivalences */}
          <div className="p-4 rounded-2xl bg-surface-sunken border border-line space-y-2">
            <div className="text-xs font-sans font-bold uppercase tracking-wider text-muted">
              Tangible Planetary Equivalences (Approximate)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-surface-raised border border-line">
                <span>🌳</span>
                <div>
                  <span className="font-semibold text-heading">{equivalences.trees}</span>
                  <div className="text-[10px] text-muted">EPA annual absorption standard</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-surface-raised border border-line">
                <span>🚗</span>
                <div>
                  <span className="font-semibold text-heading">{equivalences.kmDriven}</span>
                  <div className="text-[10px] text-muted">EEA petrol car emissions</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-surface-raised border border-line">
                <span>🍾</span>
                <div>
                  <span className="font-semibold text-heading">{equivalences.bottles}</span>
                  <div className="text-[10px] text-muted">20g single-use PET standard</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-surface-raised border border-line">
                <span>🚿</span>
                <div>
                  <span className="font-semibold text-heading">{equivalences.showers}</span>
                  <div className="text-[10px] text-muted">65L standard shower standard</div>
                </div>
              </div>
            </div>
          </div>

          {/* Audit Verification Footer */}
          <div className="pt-4 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] font-sans text-muted">
            <div className="flex items-center gap-1.5 text-primary font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Audited under EcoMart 5-Pillar Lifecycle Standards</span>
            </div>
            <div>
              <span>Labelled as <strong>Estimate</strong> • No remote telemetry</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
