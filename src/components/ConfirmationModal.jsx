import React from 'react';
import { CheckCircle2, Wind, Ban, Droplets, Sparkles, Award, ArrowRight, Printer, Share2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ConfirmationModal() {
  const { orderConfirmation, setOrderConfirmation } = useCart();

  if (!orderConfirmation) return null;

  const { orderId, date, customer, items, totalPrice, impactSaved } = orderConfirmation;

  const handleClose = () => {
    setOrderConfirmation(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-xl bg-[#FAF8F5] dark:bg-stone-900 border border-emerald-400/40 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto text-stone-800 dark:text-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Celebration Icon */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-full inline-block">
            Order Confirmed • {orderId}
          </span>
          <h2 className="text-2xl font-black text-stone-900 dark:text-stone-100">
            Thank You for Shopping with Purpose!
          </h2>
          <p className="text-xs text-stone-500">
            Placed on {date} by {customer.name} • Dispatched via Electric Courier
          </p>
        </div>

        {/* Environmental Impact Receipt Card */}
        <div className="my-6 p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/40 dark:from-emerald-950/40 dark:to-stone-850 border border-emerald-200 dark:border-emerald-800/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-200/60 dark:border-emerald-800/60 pb-2.5">
            <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Official Environmental Impact Receipt</span>
            </div>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
              Score: {impactSaved.averageEcoScore}/100
            </span>
          </div>

          {/* Impact Stats Grid */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-white/80 dark:bg-stone-800/80 border border-emerald-100 dark:border-emerald-900/40">
              <Wind className="w-5 h-5 text-sky-500 mx-auto mb-1" />
              <div className="text-lg font-black text-stone-900 dark:text-stone-100">
                {impactSaved.co2Saved} kg
              </div>
              <div className="text-[10px] text-stone-500 uppercase font-bold">CO₂ Saved</div>
            </div>

            <div className="p-3 rounded-xl bg-white/80 dark:bg-stone-800/80 border border-emerald-100 dark:border-emerald-900/40">
              <Ban className="w-5 h-5 text-rose-500 mx-auto mb-1" />
              <div className="text-lg font-black text-stone-900 dark:text-stone-100">
                {impactSaved.plasticAvoided} g
              </div>
              <div className="text-[10px] text-stone-500 uppercase font-bold">Plastic Diverted</div>
            </div>

            <div className="p-3 rounded-xl bg-white/80 dark:bg-stone-800/80 border border-emerald-100 dark:border-emerald-900/40">
              <Droplets className="w-5 h-5 text-teal-500 mx-auto mb-1" />
              <div className="text-lg font-black text-stone-900 dark:text-stone-100">
                {impactSaved.waterSaved} L
              </div>
              <div className="text-[10px] text-stone-500 uppercase font-bold">Water Conserved</div>
            </div>
          </div>

          {/* Human-understandable impact summary */}
          <div className="p-3 rounded-xl bg-white/70 dark:bg-stone-900/70 border border-emerald-200/60 dark:border-emerald-800/60 text-xs text-emerald-950 dark:text-emerald-200 leading-relaxed font-medium">
            🌳 By choosing these conscious alternatives over conventional retail goods, you prevented{' '}
            <strong>{impactSaved.equivalents.plasticBottles} single-use plastic bottles</strong> from entering
            landfills and offset the equivalent of <strong>{impactSaved.equivalents.carKm} km</strong> of car travel!
          </div>

          <div className="flex items-center justify-between text-xs font-semibold text-emerald-800 dark:text-emerald-300 pt-1">
            <span>Eco Points Credited:</span>
            <span className="font-extrabold text-amber-600 dark:text-amber-400">
              +{impactSaved.ecoPoints} points
            </span>
          </div>
        </div>

        {/* Purchased Items List */}
        <div className="space-y-2 mb-6">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Order Summary ({items.length} items)
          </div>
          <div className="divide-y divide-stone-200 dark:divide-stone-800 max-h-40 overflow-y-auto pr-1">
            {items.map((i, idx) => (
              <div key={idx} className="py-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span>{i.product.icon}</span>
                  <span className="font-medium text-stone-800 dark:text-stone-200 line-clamp-1">
                    {i.product.name} (x{i.quantity})
                  </span>
                </div>
                <span className="font-bold text-stone-900 dark:text-stone-100 shrink-0">
                  ₹{(i.product.price * i.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between font-bold text-sm">
            <span>Total Paid</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-black">
              ₹{totalPrice.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Shareable "I shopped with purpose" Card */}
        <div className="mb-6 p-4 rounded-2xl bg-stone-900 text-white border border-emerald-500/30 text-center space-y-2">
          <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
            Shareable Impact Badge
          </div>
          <p className="text-xs text-stone-300 italic">
            "I shopped with purpose on EcoMart and avoided {(impactSaved.co2Saved || impactSaved.savedCo2 || 0).toFixed(1)}kg of CO₂! 🌍🌱"
          </p>
          <button
            type="button"
            onClick={() => {
              try {
                navigator.clipboard.writeText(
                  `I shopped with purpose on EcoMart and avoided ${(impactSaved.co2Saved || impactSaved.savedCo2 || 0).toFixed(1)}kg of lifecycle CO₂! Check your eco-score at EcoMart. 🌿`
                );
                alert('Copied shareable impact card to clipboard!');
              } catch (_e) {}
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Copy Impact Card</span>
          </button>
        </div>

        {/* Close Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all active:scale-95"
          >
            Continue Conscious Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
