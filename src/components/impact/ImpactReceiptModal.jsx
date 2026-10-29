import React from 'react';
import {
  Printer,
  X,
  CheckCircle2,
  Wind,
  Ban,
  Droplets
} from 'lucide-react';
import { translateImpactEquivalents } from '../../lib/impactEconomics';

export default function ImpactReceiptModal({ isOpen, onClose, orderData }) {
  if (!isOpen || !orderData) return null;

  const orderId = orderData.id || `ECO-${Math.floor(100000 + Math.random() * 900000)}`;
  const orderDate = orderData.date || new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const items = orderData.items || [];
  const total = orderData.total || 0;
  const impact = orderData.impact || { co2Saved: 0, plasticAvoided: 0, waterSaved: 0 };

  const eq = translateImpactEquivalents({
    co2Kg: impact.co2Saved,
    plasticGrams: impact.plasticAvoided,
    waterLitres: impact.waterSaved
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[90vh] bg-surface-raised border border-line rounded-3xl shadow-soft-xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-line flex items-center justify-between bg-surface-sunken">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-heading">
                Estimated Impact Receipt
              </h3>
              <div className="text-[10px] font-mono text-text-muted">
                Sample receipt. No real order is placed. • Order #{orderId}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl border border-line bg-surface hover:bg-surface-sunken text-xs font-mono text-heading flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl border border-line text-text-muted hover:text-heading hover:bg-surface transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Content */}
        <div id="impact-receipt-content" className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-left font-sans">
          {/* Simulation Notice Banner (Strict Rule) */}
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-[11px] text-amber-800 dark:text-amber-200">
            <strong>Prototype checkout:</strong> No real payment is processed. All lifecycle numbers are model-derived estimates computed from open catalog disclosures.
          </div>

          {/* Environmental Savings Summary */}
          <div className="p-4 rounded-3xl bg-surface-sunken border border-line space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold">
                Lifetime Planetary Savings
              </span>
              <span className="text-[10px] font-mono text-text-muted">
                Disclosed Baseline
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-2xl bg-surface border border-line">
                <div className="text-primary text-xs font-bold flex items-center justify-center gap-1">
                  <Wind className="w-3 h-3" />
                  <span>CO₂ Saved</span>
                </div>
                <div className="font-serif font-bold text-base text-heading mt-0.5">
                  {impact.co2Saved} kg
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-surface border border-line">
                <div className="text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center justify-center gap-1">
                  <Ban className="w-3 h-3" />
                  <span>Plastic Diverted</span>
                </div>
                <div className="font-serif font-bold text-base text-heading mt-0.5">
                  {impact.plasticAvoided} g
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-surface border border-line">
                <div className="text-teal-600 dark:text-teal-400 text-xs font-bold flex items-center justify-center gap-1">
                  <Droplets className="w-3 h-3" />
                  <span>Water Conserved</span>
                </div>
                <div className="font-serif font-bold text-base text-heading mt-0.5">
                  {impact.waterSaved || 0} L
                </div>
              </div>
            </div>

            <p className="text-[11px] text-text-secondary leading-snug pt-1">
              Equivalent to avoiding {eq.plastic.headline} and saving {eq.carbon.headline}.
            </p>
          </div>

          {/* Purchased Items List */}
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-text-muted border-b border-line pb-1">
              Order Items Breakdown
            </div>
            {items.map((item, idx) => {
              const p = item.product || item;
              const qty = item.quantity || 1;
              return (
                <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-line/60">
                  <div className="space-y-0.5">
                    <span className="font-medium text-heading block">{p.name}</span>
                    <span className="text-[10px] text-text-muted font-mono">
                      Qty {qty} • {p.packaging === 'plastic-free' ? 'Plastic-Free Packaging' : 'Recycled packaging'}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-heading">
                    ₹{(p.price * qty).toLocaleString('en-IN')}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Order Timeline View (Feature 51: Clearly Marked Prototype) */}
          <div className="p-4 rounded-3xl bg-surface border border-line space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold">
                Low-Carbon Fulfillment Journey
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-200 border border-amber-500/20">
                Simulated Prototype
              </span>
            </div>

            <div className="space-y-3 pt-1">
              {[
                { title: 'Order Reserved', desc: 'Sample order reserved; paper packing tape.', time: '0m', done: true },
                { title: 'Kraft Corrugated Consolidation', desc: 'Multi-item sample packing in paper box.', time: '+2h', done: true },
                { title: 'Hub Aggregation Transit', desc: 'Consolidated route dispatch to minimize vehicle km per parcel.', time: '+18h', done: false },
                { title: 'Electric / Low-Emission Delivery', desc: 'Final-mile allocation via local low-emission delivery fleet.', time: 'Est. Tomorrow', done: false }
              ].map((stage, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <div className="flex flex-col items-center">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      stage.done ? 'bg-primary text-primary-contrast' : 'bg-surface-sunken border border-line text-text-muted'
                    }`}>
                      {stage.done ? '✓' : idx + 1}
                    </div>
                    {idx < 3 && <div className="w-0.5 h-6 bg-line my-0.5" />}
                  </div>
                  <div className="flex-1 pb-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-heading">{stage.title}</span>
                      <span className="text-[10px] font-mono text-text-muted">{stage.time}</span>
                    </div>
                    <p className="text-[11px] text-text-secondary leading-snug mt-0.5">
                      {stage.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[10px] text-text-muted font-mono pt-1 border-t border-line/60">
              Note: Prototype timeline view demonstrating low-carbon fulfillment steps. No third-party carrier API is queried.
            </div>
          </div>

          {/* Totals */}
          <div className="pt-2 border-t border-line space-y-1 text-xs">
            <div className="flex items-center justify-between text-heading font-serif font-bold text-base">
              <span>Total Simulated Amount</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
            <div className="text-[10px] font-mono text-text-muted flex items-center justify-between pt-1">
              <span>Packaging Type:</span>
              <span>Plastic-Free Consolidated Carton (Sample)</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-line bg-surface-sunken flex items-center justify-between text-[11px] font-mono text-text-muted">
          <span>Eco Sense Receipt (Sample)</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-primary text-white font-semibold text-xs transition cursor-pointer"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
