import React from 'react';
import { Package, ArrowRight, Wind, Ban, Droplets, Sparkles, CheckCircle2, Share2, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function OrdersPage({ setActivePage }) {
  const { orders } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full">
              Fulfillment Log
            </span>
            <span className="text-xs text-stone-500 font-medium">{orders.length} Orders</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0B3B2C] dark:text-stone-100 mt-1">
            Order History & Impact Receipts
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Every conscious purchase logged with verified lifecycle carbon avoidance.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActivePage('shop')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition shadow-sm w-fit"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-stone-850 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100">
            No orders placed yet
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Once you complete a conscious checkout, your environmental impact receipt and order summary will appear here.
          </p>
          <button
            type="button"
            onClick={() => setActivePage('shop')}
            className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow transition"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const co2Saved = (order.impact?.savedCo2 || order.impact?.co2Saved || 1.4).toFixed(1);
            const plasticDiverted = Math.round(order.impact?.plasticAvoided || order.impact?.plasticSaved || 140);

            return (
              <div
                key={order.id}
                className="p-6 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-xs space-y-5"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-stone-900 dark:text-stone-100 text-base">
                        {order.id}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        ✓ Dispatched via EV Courier
                      </span>
                    </div>
                    <div className="text-xs text-stone-400 mt-0.5">Placed on {order.date}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-stone-400">Total Paid</div>
                    <div className="text-lg font-black text-stone-900 dark:text-stone-100">
                      ₹{order.total.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Impact Badge */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1 font-bold text-emerald-900 dark:text-emerald-200">
                      <Wind className="w-4 h-4 text-sky-500" /> {co2Saved}kg CO₂ Saved
                    </span>
                    <span className="flex items-center gap-1 font-bold text-emerald-900 dark:text-emerald-200">
                      <Ban className="w-4 h-4 text-rose-500" /> {plasticDiverted}g Plastic Diverted
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      try {
                        navigator.clipboard.writeText(
                          `I avoided ${co2Saved}kg of CO₂ on order ${order.id} with EcoMart! 🌍`
                        );
                        alert('Copied impact card text!');
                      } catch (_e) {}
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Share Receipt
                  </button>
                </div>

                {/* Items */}
                <div className="divide-y divide-stone-100 dark:divide-stone-800">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{item.product.icon}</span>
                        <div>
                          <span className="font-bold text-stone-900 dark:text-stone-100">
                            {item.product.name}
                          </span>
                          <span className="text-stone-400 ml-1.5">(x{item.quantity})</span>
                        </div>
                      </div>
                      <span className="font-bold text-stone-850 dark:text-stone-200">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Shipping address & packaging notes */}
                <div className="pt-2 text-xs text-stone-500 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>Delivered to: {order.shippingAddress}</span>
                  </div>
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                    100% Recycled Kraft Box • Zero Plastic
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
