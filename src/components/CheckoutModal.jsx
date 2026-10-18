import React, { useState } from 'react';
import { X, Truck, Leaf, Lock, ArrowRight, ArrowLeft, Box } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CheckoutModal() {
  const {
    checkoutModalOpen,
    setCheckoutModalOpen,
    impact,
    recordOrder,
    appliedCoupon
  } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
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
      recordOrder({
        address: `${formData.address}, ${formData.city} - ${formData.pincode}`,
        total: finalPayable,
        carbonOffset: formData.carbonOffset,
        plasticFreePackaging: formData.plasticFreePackaging
      });
      setIsSubmitting(false);
      setCheckoutModalOpen(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-xl bg-[#FAF8F5] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto text-stone-800 dark:text-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full">
                Step {step} of 3
              </span>
              <span className="text-xs text-stone-500 font-medium">
                {step === 1 ? 'Shipping Address' : step === 2 ? 'Conscious Packaging & Offset' : 'Payment Method'}
              </span>
            </div>
            <h3 className="text-xl font-black mt-1 text-stone-900 dark:text-stone-100">
              Conscious Checkout
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setCheckoutModalOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="grid grid-cols-3 gap-2 my-4">
          <div className={`h-1.5 rounded-full transition ${step >= 1 ? 'bg-emerald-600' : 'bg-stone-200 dark:bg-stone-800'}`} />
          <div className={`h-1.5 rounded-full transition ${step >= 2 ? 'bg-emerald-600' : 'bg-stone-200 dark:bg-stone-800'}`} />
          <div className={`h-1.5 rounded-full transition ${step >= 3 ? 'bg-emerald-600' : 'bg-stone-200 dark:bg-stone-800'}`} />
        </div>

        <form onSubmit={handleNextStep} className="space-y-4">
          {/* STEP 1: ADDRESS */}
          {step === 1 && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-600 dark:text-stone-300 uppercase mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 dark:text-stone-300 uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 dark:text-stone-300 uppercase mb-1">
                  Delivery Street Address
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-600 dark:text-stone-300 uppercase mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 dark:text-stone-300 uppercase mb-1">
                    PIN Code (6 Digits)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength="6"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Delivery Speed Pill */}
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-emerald-900 dark:text-emerald-200">
                    Estimated Transit: 2-3 Business Days (EV Fleet)
                  </span>
                </div>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">FREE</span>
              </div>
            </div>
          )}

          {/* STEP 2: PACKAGING & OFFSET */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-3">
                <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-sm">
                  <Box className="w-4 h-4 text-emerald-600" />
                  <span>Plastic-Free Packaging</span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Every parcel is packaged in 100% recycled unbleached kraft cardboard sealed with cornstarch water-activated tape.
                </p>
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.plasticFreePackaging}
                    onChange={(e) => setFormData({ ...formData, plasticFreePackaging: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded-sm"
                  />
                  <span>Confirm plastic-free packing (Free)</span>
                </label>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-sm">
                    <Leaf className="w-4 h-4 text-emerald-600" />
                    <span>Gold Standard Carbon Offset (+₹20)</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">+₹20</span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Fund community agroforestry and solar cooking kits across rural India to neutralize freight carbon emissions.
                </p>
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.carbonOffset}
                    onChange={(e) => setFormData({ ...formData, carbonOffset: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded-sm"
                  />
                  <span>Neutralize freight emissions (+₹20)</span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT MOCK */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <label className="block text-xs font-bold text-stone-600 dark:text-stone-300 uppercase">
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
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                      formData.paymentMethod === pm.id
                        ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/30'
                        : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={pm.id}
                      checked={formData.paymentMethod === pm.id}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="text-emerald-600"
                    />
                    <span className="text-xl">{pm.icon}</span>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-stone-900 dark:text-stone-100">{pm.title}</div>
                      <div className="text-[11px] text-stone-500">{pm.desc}</div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Order breakdown review */}
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-750 text-xs space-y-1.5">
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span>Cart Subtotal</span>
                  <span>₹{impact.totalPrice.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Coupon ({appliedCoupon.code})</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {formData.carbonOffset && (
                  <div className="flex justify-between text-stone-600 dark:text-stone-300">
                    <span>Carbon Offset Contribution</span>
                    <span>+₹20</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-stone-900 dark:text-stone-100 pt-2 border-t border-stone-200 dark:border-stone-700 text-sm">
                  <span>Total Amount</span>
                  <span>₹{finalPayable.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Buttons */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : <div />}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs shadow-md transition active:scale-95"
            >
              {step < 3 ? (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>{isSubmitting ? 'Placing Order...' : `Pay ₹${finalPayable.toLocaleString('en-IN')}`}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
