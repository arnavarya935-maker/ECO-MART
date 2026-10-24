import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Clock,
  Droplets,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { playSound } from '../lib/audio';
import ShareableImpactCard from '../components/community/ShareableImpactCard';
import EmptyState from '../components/ui/EmptyState';

const TRACKING_STAGES = [
  { id: 'placed', title: 'Order Placed', subtitle: 'Plastic-free manifest generated', icon: CheckCircle2 },
  { id: 'packed', title: 'Packed at Hub', subtitle: 'Kraft paper tape & seed cushions', icon: Box },
  { id: 'shipped', title: 'EV Courier Dispatched', subtitle: 'Zero-emission delivery in transit', icon: Truck },
  { id: 'delivered', title: 'Delivered Consciously', subtitle: 'Handed over in 100% recyclable box', icon: Home }
];

export default function OrdersPage() {
  const navigate = useNavigate();
  const { orders, showToast } = useCart();
  // Maintain simulated status map orderId -> stageIndex (0 to 3)
  const [orderStages, setOrderStages] = useState({});
  const [showCertForOrder, setShowCertForOrder] = useState({});

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
              Fulfillment Log
            </span>
            <span className="text-xs text-muted font-medium">{orders.length} Order{orders.length !== 1 ? 's' : ''}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-heading mt-1.5 tracking-tight">
            Order History & Tracking
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            Every conscious purchase logged with verified lifecycle carbon avoidance and real-time status simulation.
          </p>
        </div>

        <Link
          to="/shop"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-primary-contrast font-medium text-xs transition shadow-soft-xs w-fit min-h-[44px]"
        >
          <span>Explore Catalog</span>
          <ArrowRight className="w-4 h-4 text-accent" />
        </Link>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders placed yet"
          description="Once you complete a simulated conscious checkout, your environmental impact receipt and live tracking simulation will appear here."
          actionLabel="Start Shopping"
          onAction={() => navigate('/shop')}
        />
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const co2Saved = (order.impact?.savedCo2 || order.impact?.co2Saved || 1.4).toFixed(1);
            const plasticDiverted = Math.round(order.impact?.plasticAvoided || order.impact?.plasticSaved || 140);
            const activeStageIdx = getStageIndex(order.id);

            return (
              <div
                key={order.id}
                className="p-6 sm:p-8 rounded-3xl bg-surface border border-line shadow-soft-sm space-y-6"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-heading text-base sm:text-lg">
                        Order #{order.id}
                      </span>
                      <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {TRACKING_STAGES[activeStageIdx].title}
                      </span>
                    </div>
                    <div className="text-xs text-muted mt-1">Placed on {order.date}</div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => advanceStage(order.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-surface-sunken hover:bg-surface border border-line text-heading text-xs font-medium transition min-h-[44px] cursor-pointer"
                      title="Click to simulate advancing the tracking stepper"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-primary" />
                      <span>Simulate Next Step</span>
                    </button>

                    <div className="text-right">
                      <div className="text-[11px] text-muted font-normal">Total Paid</div>
                      <div className="text-lg font-serif font-bold text-heading">
                        ₹{order.total.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tracking Stepper Simulation (Feature 25) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-surface-sunken border border-line">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-heading flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-primary" />
                      Live Delivery Timeline
                    </span>
                    <span className="text-[11px] text-primary font-semibold">
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
                                  ? 'bg-primary text-primary-contrast shadow-soft-xs'
                                  : isCurrent
                                  ? 'bg-primary/15 text-primary ring-4 ring-primary/10'
                                  : 'bg-surface border border-line text-muted'
                              }`}
                            >
                              {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : <Icon className="w-4 h-4" />}
                            </div>
                            <div
                              className={`hidden md:block flex-1 h-1 rounded-full ${
                                isCompleted ? 'bg-primary' : 'bg-line'
                              }`}
                            />
                          </div>
                          <div>
                            <div className={`text-xs font-semibold ${isCurrent ? 'text-heading' : 'text-secondary'}`}>
                              {stage.title}
                            </div>
                            <div className="text-[10px] text-muted leading-tight mt-0.5">
                              {stage.subtitle}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Impact Receipt (Feature 15) */}
                <div className="p-4 rounded-2xl bg-surface-sunken border border-line space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <span className="flex items-center gap-1.5 font-semibold text-primary">
                        <Wind className="w-4 h-4 text-primary" /> {co2Saved} kg CO₂ Saved
                      </span>
                      <span className="flex items-center gap-1.5 font-semibold text-accent">
                        <Ban className="w-4 h-4 text-accent" /> {plasticDiverted} g Plastic Diverted
                      </span>
                      <span className="flex items-center gap-1.5 font-semibold text-secondary">
                        <Droplets className="w-4 h-4 text-secondary" /> {Math.round(order.impact?.waterSaved || 65)} L Water Saved
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-surface text-[10px] font-bold text-heading border border-line">
                        Avg EcoScore: {order.impact?.averageEcoScore || 88}/100
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowCertForOrder((prev) => ({ ...prev, [order.id]: !prev[order.id] }));
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer min-h-[44px]"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{showCertForOrder[order.id] ? 'Hide Certificate' : 'View Impact Card'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(
                            `I avoided ${co2Saved}kg of CO₂ and ${plasticDiverted}g plastic on order ${order.id} with EcoMart! 🌍`
                          );
                          playSound('click');
                          showToast('Copied impact receipt text to clipboard!', 'success');
                        }}
                        className="inline-flex items-center gap-1 text-xs font-medium text-muted hover:text-heading cursor-pointer min-h-[44px]"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {showCertForOrder[order.id] && (
                    <div className="pt-3 border-t border-line animate-fade-in">
                      <ShareableImpactCard />
                    </div>
                  )}
                </div>

                {/* Ordered Items List */}
                <div className="divide-y divide-line">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl p-1.5 rounded-lg bg-surface-sunken border border-line">{item.product.icon}</span>
                        <div>
                          <span className="font-semibold text-heading">
                            {item.product.name}
                          </span>
                          <span className="text-muted ml-1.5">(x{item.quantity})</span>
                        </div>
                      </div>
                      <span className="font-semibold text-heading">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Shipping address & packaging notes */}
                <div className="pt-2 text-xs text-muted flex flex-wrap items-center justify-between gap-2 border-t border-line">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-muted" />
                    <span>Delivering to: {order.shippingAddress || 'Indiranagar, Bengaluru, Karnataka (560038)'}</span>
                  </div>
                  <span className="text-primary font-medium">
                    100% Recycled Kraft Box • Plastic-Free Sealed
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
