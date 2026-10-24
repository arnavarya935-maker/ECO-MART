import React, { useState } from 'react';
import { Truck, Leaf, Lock, ArrowRight, ArrowLeft, Box } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Modal } from './ui/Modal';
import ImpactReceiptModal from './impact/ImpactReceiptModal';

export default function CheckoutModal() {
  const {
    checkoutModalOpen,
    setCheckoutModalOpen,
    cartItems,
    impact,
    recordOrder,
    appliedCoupon
  } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Ayush Sharma',
    email: user?.email || 'ayush@example.com',
    phone: '9876543210',
    address: 'Flat 402, Green Meadows Residency',
    city: 'Bengaluru',
    pincode: '560034',
    paymentMethod: 'upi',
    plasticFreePackaging: true,
    carbonOffset: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (receiptOpen && completedOrder) {
    return (
      <ImpactReceiptModal
        isOpen={receiptOpen}
        onClose={() => {
          setReceiptOpen(false);
          setCompletedOrder(null);
        }}
        orderData={completedOrder}
      />
    );
  }

  if (!checkoutModalOpen) return null;

  // Coupon discount calculation
  const discountAmount = appliedCoupon
    ? Math.round((impact.totalPrice * appliedCoupon.percent) / 100)
    : 0;
  const offsetFee = formData.carbonOffset ? 20 : 0;
  const finalPayable = Math.max(0, impact.totalPrice - discountAmount + offsetFee);

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const order = {
        id: `ECO-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }),
        items: cartItems || [],
        address: `${formData.address}, ${formData.city} - ${formData.pincode}`,
        total: finalPayable,
        carbonOffset: formData.carbonOffset,
        plasticFreePackaging: formData.plasticFreePackaging,
        impact
      };
      recordOrder(order);
      setIsSubmitting(false);
      setCompletedOrder(order);
      setReceiptOpen(true);
      setCheckoutModalOpen(false);
      setStep(1);
    }, 700);
  };

  const modalTitle = (
    <div>
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-primary bg-primary-subtle px-3 py-1 rounded-full border border-primary/20">
          Step {step} of 3
        </span>
        <span className="text-xs text-muted font-medium">
          {step === 1 ? 'Shipping Address' : step === 2 ? 'Conscious Packaging & Offset' : 'Payment Method'}
        </span>
      </div>
      <h3 className="font-serif text-2xl font-bold mt-2 text-heading tracking-tight">
        Conscious Checkout
      </h3>
    </div>
  );

  return (
    <Modal
      isOpen={checkoutModalOpen}
      onClose={() => setCheckoutModalOpen(false)}
      title={modalTitle}
      maxWidth="max-w-xl"
    >

        {/* Stepper Progress Bar */}
        <div className="grid grid-cols-3 gap-2 my-5">
          <div className={`h-1.5 rounded-full transition ${step >= 1 ? 'bg-primary' : 'bg-surface-sunken'}`} />
          <div className={`h-1.5 rounded-full transition ${step >= 2 ? 'bg-primary' : 'bg-surface-sunken'}`} />
          <div className={`h-1.5 rounded-full transition ${step >= 3 ? 'bg-primary' : 'bg-surface-sunken'}`} />
        </div>

        <form onSubmit={handleNextStep} className="space-y-4">
          {/* STEP 1: ADDRESS */}
          {step === 1 && (
            <div className="space-y-3.5 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-secondary uppercase mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-2xl bg-surface-raised border border-line text-sm text-heading focus-visible:outline-2 focus-visible:outline-focus"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-secondary uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-2xl bg-surface-raised border border-line text-sm text-heading focus-visible:outline-2 focus-visible:outline-focus"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary uppercase mb-1">
                  Delivery Street Address
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 min-h-[44px] rounded-2xl bg-surface-raised border border-line text-sm text-heading focus-visible:outline-2 focus-visible:outline-focus"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-secondary uppercase mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-2xl bg-surface-raised border border-line text-sm text-heading focus-visible:outline-2 focus-visible:outline-focus"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-secondary uppercase mb-1">
                    PIN Code (6 Digits)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength="6"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-2xl bg-surface-raised border border-line text-sm text-heading focus-visible:outline-2 focus-visible:outline-focus"
                  />
                </div>
              </div>

              {/* Delivery Speed Pill */}
              <div className="p-3.5 rounded-2xl bg-primary-subtle border border-primary/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-primary" />
                  <span className="font-medium text-heading">
                    Estimated Transit: 2-3 Business Days (EV Fleet)
                  </span>
                </div>
                <span className="font-bold text-primary">FREE</span>
              </div>
            </div>
          )}

          {/* STEP 2: PACKAGING & OFFSET */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-surface-sunken border border-line space-y-3">
                <div className="flex items-center gap-2 text-heading font-semibold text-sm">
                  <Box className="w-4 h-4 text-primary" />
                  <span>Plastic-Free Packaging</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Every parcel is packaged in 100% recycled unbleached kraft cardboard sealed with cornstarch water-activated tape.
                </p>
                <label className="flex items-center gap-2.5 text-xs font-medium cursor-pointer min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={formData.plasticFreePackaging}
                    onChange={(e) => setFormData({ ...formData, plasticFreePackaging: e.target.checked })}
                    className="w-4 h-4 text-primary accent-primary rounded-sm cursor-pointer"
                  />
                  <span>Confirm plastic-free packing (Free)</span>
                </label>
              </div>

              <div className="p-4 rounded-2xl bg-surface-sunken border border-line space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-heading font-semibold text-sm">
                    <Leaf className="w-4 h-4 text-primary" />
                    <span>Gold Standard Carbon Offset (+₹20)</span>
                  </div>
                  <span className="text-xs font-bold text-primary">+₹20</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Fund community agroforestry and solar cooking kits across rural India to neutralize freight carbon emissions.
                </p>
                <label className="flex items-center gap-2.5 text-xs font-medium cursor-pointer min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={formData.carbonOffset}
                    onChange={(e) => setFormData({ ...formData, carbonOffset: e.target.checked })}
                    className="w-4 h-4 text-primary accent-primary rounded-sm cursor-pointer"
                  />
                  <span>Neutralize freight emissions (+₹20)</span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT MOCK */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <label className="block text-xs font-semibold text-secondary uppercase">
                Choose Mock Payment Method
              </label>

              <div className="space-y-2">
                {[
                  { id: 'upi', title: 'UPI Instant Pay', desc: 'Google Pay, PhonePe, BHIM (Zero Network Fee)', icon: '📱' },
                  { id: 'card', title: 'Debit / Credit Card', desc: 'Secure 256-bit encrypted simulated gateway', icon: '💳' },
                  { id: 'cod', title: 'Conscious Cash on Delivery', desc: 'Pay on arrival with verified OTP', icon: '📦' }
                ].map((pm) => (
                  <label
                    key={pm.id}
                    className={`flex items-center gap-3.5 p-3.5 rounded-2xl border cursor-pointer transition min-h-[44px] ${
                      formData.paymentMethod === pm.id
                        ? 'border-primary bg-surface-accent'
                        : 'border-line bg-surface-raised hover:bg-surface-sunken'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={pm.id}
                      checked={formData.paymentMethod === pm.id}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="text-primary accent-primary cursor-pointer"
                    />
                    <span className="text-xl">{pm.icon}</span>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-heading">{pm.title}</div>
                      <div className="text-[11px] text-muted">{pm.desc}</div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Order breakdown review */}
              <div className="p-4 rounded-2xl bg-surface-sunken border border-line text-xs space-y-2">
                <div className="flex justify-between text-secondary">
                  <span>Cart Subtotal</span>
                  <span>₹{impact.totalPrice.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-primary font-semibold">
                    <span>Coupon ({appliedCoupon.code})</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {formData.carbonOffset && (
                  <div className="flex justify-between text-secondary">
                    <span>Carbon Offset Contribution</span>
                    <span>+₹20</span>
                  </div>
                )}
                {/* Environmental Impact Summary */}
                <div className="p-3 rounded-xl bg-primary-subtle border border-primary/20 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-medium text-heading">
                    <Leaf className="w-3.5 h-3.5 text-primary" />
                    <span>Estimated Planetary Impact:</span>
                  </div>
                  <span className="font-bold text-primary font-mono text-[11px]">
                    ~{impact.plasticAvoided || 120}g Plastic • ~{impact.co2Saved || '0.8'}kg CO₂
                  </span>
                </div>
                <div className="flex justify-between font-bold text-heading pt-2 border-t border-line text-sm">
                  <span>Total Amount</span>
                  <span className="font-serif text-lg font-bold text-heading">₹{finalPayable.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Buttons */}
          <div className="pt-4 border-t border-line flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-2xl border border-line text-xs font-sans font-medium text-secondary hover:bg-surface-sunken transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : <div />}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 min-h-[44px] rounded-2xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-text-inverted font-sans font-medium text-xs shadow-soft-sm transition active:scale-95 cursor-pointer"
            >
              {step < 3 ? (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4 text-text-inverted" />
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-text-inverted" />
                  <span>{isSubmitting ? 'Placing Order...' : `Pay ₹${finalPayable.toLocaleString('en-IN')}`}</span>
                </>
              )}
            </button>
          </div>
        </form>
    </Modal>
  );
}

