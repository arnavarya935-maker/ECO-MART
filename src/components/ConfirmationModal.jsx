import React from 'react';
import { CheckCircle2, Wind, Ban, Droplets, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Modal } from './ui/Modal';
import ShareableImpactCard from './community/ShareableImpactCard';

export default function ConfirmationModal() {
  const { orderConfirmation, setOrderConfirmation } = useCart();

  if (!orderConfirmation) return null;

  const { orderId, date, customer, items, totalPrice, impactSaved } = orderConfirmation;

  const handleClose = () => {
    setOrderConfirmation(null);
  };

  return (
    <Modal
      isOpen={!!orderConfirmation}
      onClose={handleClose}
      maxWidth="max-w-xl"
      ariaLabel="Order Confirmation"
    >
        {/* Top Celebration Icon */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-surface-sunken text-primary mx-auto flex items-center justify-center border border-line shadow-soft-sm">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary-subtle border border-primary/20 px-3 py-1 rounded-full inline-block">
            Order Confirmed • {orderId}
          </span>
          <h2 id="confirmation-modal-title" className="text-2xl font-serif font-bold text-heading">
            Thank You for Shopping with Purpose
          </h2>
          <p className="text-xs text-secondary">
            Placed on {date} by {customer.name} • Dispatched via Electric Courier
          </p>
        </div>

        {/* Environmental Impact Receipt Card */}
        <div className="my-6 p-5 rounded-2xl bg-gradient-to-br from-surface-accent via-surface to-surface-raised border border-primary/20 shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-2.5">
            <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-heading">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Official Environmental Impact Receipt</span>
            </div>
            <span className="text-xs font-serif font-bold text-primary">
              Score: {impactSaved.averageEcoScore}/100
            </span>
          </div>

          {/* Impact Stats Grid */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-surface-raised border border-line shadow-soft-sm">
              <Wind className="w-5 h-5 text-primary mx-auto mb-1" />
              <div className="text-lg font-serif font-bold text-heading">
                {impactSaved.co2Saved} kg
              </div>
              <div className="text-[10px] text-muted uppercase font-bold tracking-wider">CO₂ Saved</div>
            </div>

            <div className="p-3 rounded-xl bg-surface-raised border border-line shadow-soft-sm">
              <Ban className="w-5 h-5 text-accent mx-auto mb-1" />
              <div className="text-lg font-serif font-bold text-heading">
                {impactSaved.plasticAvoided} g
              </div>
              <div className="text-[10px] text-muted uppercase font-bold tracking-wider">Plastic Diverted</div>
            </div>

            <div className="p-3 rounded-xl bg-surface-raised border border-line shadow-soft-sm">
              <Droplets className="w-5 h-5 text-secondary mx-auto mb-1" />
              <div className="text-lg font-serif font-bold text-heading">
                {impactSaved.waterSaved} L
              </div>
              <div className="text-[10px] text-muted uppercase font-bold tracking-wider">Water Conserved</div>
            </div>
          </div>

          {/* Human-understandable impact summary */}
          <div className="p-3.5 rounded-xl bg-surface-raised/90 border border-line text-xs text-heading leading-relaxed font-normal">
            🌳 By choosing these conscious alternatives over conventional retail goods, you prevented{' '}
            <strong className="font-semibold text-primary">{impactSaved.equivalents.plasticBottles} single-use plastic bottles</strong> from entering
            landfills and offset the equivalent of <strong className="font-semibold text-primary">{impactSaved.equivalents.carKm} km</strong> of car travel!
          </div>

          <div className="flex items-center justify-between text-xs font-medium text-heading pt-1">
            <span>Eco Points Credited:</span>
            <span className="font-serif font-bold text-accent">
              +{impactSaved.ecoPoints} points
            </span>
          </div>
        </div>

        {/* Purchased Items List */}
        <div className="space-y-2 mb-6">
          <div className="text-xs font-bold uppercase tracking-wider text-muted">
            Order Summary ({items.length} items)
          </div>
          <div className="divide-y divide-line max-h-40 overflow-y-auto pr-1">
            {items.map((i, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span>{i.product.icon}</span>
                  <span className="font-medium text-heading line-clamp-1">
                    {i.product.name} (x{i.quantity})
                  </span>
                </div>
                <span className="font-serif font-bold text-heading shrink-0">
                  ₹{(i.product.price * i.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-line flex items-center justify-between font-bold text-sm">
            <span className="text-secondary">Total Paid</span>
            <span className="text-heading font-serif font-bold text-base">
              ₹{totalPrice.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Shareable Impact Card (Feature 15) */}
        <div className="mb-6 space-y-3">
          <ShareableImpactCard />
        </div>

        {/* Close Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="w-full min-h-[44px] py-3 rounded-xl btn-gradient-heading text-surface-raised font-bold text-sm shadow-soft-sm hover:shadow-lift transition-all focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
          >
            Continue Conscious Shopping
          </button>
        </div>
    </Modal>
  );
}
