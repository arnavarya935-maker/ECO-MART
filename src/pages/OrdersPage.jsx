import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ArrowRight,
  Wind,
  Ban,
  CheckCircle2,
  Share2,
  MapPin,
  Truck,
  Box,
  Home,
  Check,
  RefreshCw,
  Clock
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { playSound } from '../lib/audio';

const TRACKING_STAGES = [
  { id: 'placed', title: 'Order Placed', subtitle: 'Plastic-free manifest generated', icon: CheckCircle2 },
  { id: 'packed', title: 'Packed at Hub', subtitle: 'Kraft paper tape & seed cushions', icon: Box },
  { id: 'shipped', title: 'EV Courier Dispatched', subtitle: 'Zero-emission delivery in transit', icon: Truck },
  { id: 'delivered', title: 'Delivered Consciously', subtitle: 'Handed over in 100% recyclable box', icon: Home }
];

export default function OrdersPage() {
  const { orders, showToast } = useCart();
  // Maintain simulated status map orderId -> stageIndex (0 to 3)
  const [orderStages, setOrderStages] = useState({});

  const getStageIndex = (orderId) => {
    return orderStages[orderId] !== undefined ? orderStages[orderId] : 2; // default: shipped
  };

  const advanceStage = (orderId) => {
    setOrderStages((prev) => {
      const current = prev[orderId] !== undefined ? prev[orderId] : 2;
      const next = (current + 1) % TRACKING_STAGES.length;
      playSound(next === 3 ? 'success' : 'click');
      showToast(`Order status updated to: ${TRACKING_STAGES[next].title}`, 'success');
      return { ...prev, [orderId]: next };
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Fulfillment Log
            </span>
            <span className="text-xs text-stone-500 font-bold">{orders.length} Order{orders.length !== 1 ? 's' : ''}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0B3B2C] mt-1.5">
            Order History & Tracking
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Every conscious purchase logged with verified lifecycle carbon avoidance and real-time status simulation.
          </p>
        </div>

        <Link
          to="/shop"
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition shadow-xs w-fit min-h-[44px]"
        >
          <span>Explore Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto text-2xl">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="font-black text-lg text-stone-900">
            No orders placed yet
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
            Once you complete a simulated conscious checkout, your environmental impact receipt and live tracking simulation will appear here.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const co2Saved = (order.impact?.savedCo2 || order.impact?.co2Saved || 1.4).toFixed(1);
            const plasticDiverted = Math.round(order.impact?.plasticAvoided || order.impact?.plasticSaved || 140);
            const activeStageIdx = getStageIndex(order.id);

            return (
              <div
                key={order.id}
                className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs space-y-6"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-stone-900 text-base">
                        Order #{order.id}
                      </span>
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {TRACKING_STAGES[activeStageIdx].title}
                      </span>
                    </div>
                    <div className="text-xs text-stone-400 mt-1">Placed on {order.date}</div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => advanceStage(order.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition min-h-[36px]"
                      title="Click to simulate advancing the tracking stepper"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Simulate Next Step</span>
                    </button>

                    <div className="text-right">
                      <div className="text-[11px] text-stone-400 font-semibold">Total Paid</div>
                      <div className="text-lg font-black text-stone-900">
                        ₹{order.total.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tracking Stepper Simulation (Feature 25) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200/80">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-emerald-700" />
                      Live Delivery Timeline
                    </span>
                    <span className="text-[11px] text-emerald-700 font-bold">
                      Stage {activeStageIdx + 1} of {TRACKING_STAGES.length}
                    </span>
                  </div>

                  {/* Stepper bar */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {TRACKING_STAGES.map((stage, sIdx) => {
                      const Icon = stage.icon;
                      const isCompleted = sIdx < activeStageIdx;
                      const isCurrent = sIdx === activeStageIdx;

                      return (
                        <div key={stage.id} className="flex flex-col items-start gap-2 relative">
                          <div className="flex items-center gap-2 w-full">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                                isCompleted
                                  ? 'bg-emerald-700 text-white shadow-xs'
                                  : isCurrent
                                  ? 'bg-emerald-100 text-emerald-800 ring-4 ring-emerald-50'
                                  : 'bg-stone-200 text-stone-400'
                              }`}
                            >
                              {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : <Icon className="w-4 h-4" />}
                            </div>
                            <div
                              className={`hidden md:block flex-1 h-1 rounded-full ${
                                isCompleted ? 'bg-emerald-600' : 'bg-stone-200'
                              }`}
                            />
                          </div>
                          <div>
                            <div className={`text-xs font-bold ${isCurrent ? 'text-emerald-900' : 'text-stone-800'}`}>
                              {stage.title}
                            </div>
                            <div className="text-[10px] text-stone-500 leading-tight mt-0.5">
                              {stage.subtitle}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Impact Badge */}
                <div className="p-3.5 rounded-2xl bg-[#E8F5EE] border border-emerald-200/80 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1 font-bold text-emerald-900">
                      <Wind className="w-4 h-4 text-emerald-700" /> {co2Saved} kg CO₂ Avoided
                    </span>
                    <span className="flex items-center gap-1 font-bold text-emerald-900">
                      <Ban className="w-4 h-4 text-amber-700" /> {plasticDiverted} g Plastic Diverted
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(
                        `I avoided ${co2Saved}kg of CO₂ on order ${order.id} with EcoMart! 🌍`
                      );
                      playSound('click');
                      showToast('Copied impact receipt text to clipboard!', 'success');
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 underline"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Share Impact Receipt
                  </button>
                </div>

                {/* Ordered Items List */}
                <div className="divide-y divide-stone-100">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{item.product.icon}</span>
                        <div>
                          <span className="font-bold text-stone-900">
                            {item.product.name}
                          </span>
                          <span className="text-stone-400 ml-1.5">(x{item.quantity})</span>
                        </div>
                      </div>
                      <span className="font-bold text-stone-850">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Shipping address & packaging notes */}
                <div className="pt-2 text-xs text-stone-500 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>Delivering to: {order.shippingAddress || 'Indiranagar, Bengaluru, Karnataka (560038)'}</span>
                  </div>
                  <span className="text-emerald-700 font-semibold">
                    100% Recycled Kraft Box • Zero Plastic Sealed
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
