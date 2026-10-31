import React, { useState } from 'react';
import { X, Check, ArrowRight, ArrowLeft, Building2, Home, Sparkles, Trash2, ShieldCheck, Calendar, Clock, CheckCircle2, Loader2 } from 'lucide-react';

const COMPLIANCE_TIERS = [
  {
    id: 'essential',
    name: 'Essential Eco',
    badge: 'Baseline Clean',
    desc: 'Bio-based botanical formulas, 80%+ solid waste diversion, standard VOC mitigation.',
    rate: 'Standard'
  },
  {
    id: 'gold',
    name: 'Gold Circular',
    badge: 'Popular B2B',
    desc: 'Zero-waste certified standard, on-site compost accelerators, dry bio-atomization sanitization, continuous air quality logging.',
    rate: '+15% Eco Premium'
  },
  {
    id: 'platinum',
    name: 'Platinum Net-Zero',
    badge: 'Ultra Compliance',
    desc: 'Full closed-loop zero-landfill protocol, hospital-grade non-toxic pathogen defense, certified carbon-neutral transport fleet.',
    rate: '+25% Net-Zero Tier'
  }
];

export default function MultiStepBookingEngine({ isOpen, onClose, initialData = {} }) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    sector: initialData.sector || 'commercial',
    facilityType: initialData.sector === 'residential' ? 'Apartment / Residence' : 'Corporate Office / Campus',
    services: ['eco-cleaning', 'waste-management'],
    areaSqFt: initialData.areaSqFt || (initialData.sector === 'residential' ? 1800 : 5000),
    cadence: 'monthly',
    complianceTier: 'gold',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    preferredDate: '',
    preferredTime: 'morning'
  });

  if (!isOpen) return null;

  const toggleService = (srvId) => {
    setFormData((prev) => {
      const exists = prev.services.includes(srvId);
      if (exists && prev.services.length === 1) return prev; // Keep at least one
      return {
        ...prev,
        services: exists
          ? prev.services.filter((s) => s !== srvId)
          : [...prev.services, srvId]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate high-end micro-frontend network dispatch with shimmer state
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  const handleReset = () => {
    setStep(1);
    setSubmitted(false);
    onClose();
  };

  // Live estimated impact forecast for this specific booking
  const estLiters = Math.round(formData.areaSqFt * (formData.sector === 'commercial' ? 0.42 : 0.28));
  const estWasteKg = Math.round(formData.areaSqFt * (formData.sector === 'commercial' ? 1.25 : 0.82));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Modal / Bottom Sheet Card Container */}
      <div
        className="w-full sm:max-w-2xl bg-[#F8F9FA] rounded-t-[32px] sm:rounded-3xl border border-[#0F3D2E]/10 shadow-[0px_20px_50px_rgba(15,61,46,0.25)] overflow-hidden max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-wizard-title"
      >
        {/* Wizard Header & Progress Bar */}
        <div className="p-6 bg-white border-b border-[#0F3D2E]/8 shrink-0">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#2ECC71] bg-[#0F3D2E] px-2 py-0.5 rounded-md">
                Step {step} of 4
              </span>
              <h2 id="booking-wizard-title" className="font-sans font-bold text-lg text-[#0F3D2E] mt-1">
                {step === 1 && 'Select Scope & Service Protocols'}
                {step === 2 && 'Facility Footprint & Cadence'}
                {step === 3 && 'Choose Green-Compliance Level'}
                {step === 4 && 'Confirm Schedule & Contact Details'}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#F0F5F2] text-[#2C3E50] cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close booking engine"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s <= step ? 'bg-[#2ECC71]' : 'bg-[#0F3D2E]/10'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Wizard Step Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {submitted ? (
            /* Confirmation State with Live Impact Summary */
            <div className="py-8 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-[#2ECC71]/20 border border-[#2ECC71]/40 text-[#0F3D2E] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-[#2ECC71]" />
              </div>
              <h3 className="text-2xl font-sans font-bold text-[#0F3D2E]">
                Eco-Audit Scheduled Successfully
              </h3>
              <p className="text-sm text-[#2C3E50] max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.clientName || 'Partner'}</strong>. Our certified environmental hygiene team has recorded your schedule request and will confirm via <strong>{formData.clientEmail || 'email'}</strong>.
              </p>

              {/* Instant Booking Impact Forecast */}
              <div className="p-5 rounded-2xl bg-white border border-[#2ECC71]/30 max-w-md mx-auto grid grid-cols-2 gap-3 text-left">
                <div>
                  <div className="text-[10px] font-mono text-[#2C3E50]/70 uppercase">Est. Annual Runoff Avoided</div>
                  <div className="text-xl font-mono font-bold text-[#0F3D2E]">{estLiters.toLocaleString()} L</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-[#2C3E50]/70 uppercase">Est. Landfill Diverted</div>
                  <div className="text-xl font-mono font-bold text-[#0F3D2E]">{estWasteKg.toLocaleString()} kg</div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-full bg-[#0F3D2E] text-white text-xs font-semibold cursor-pointer shadow-soft-xs"
                >
                  Done & Return to Overview
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* STEP 1: Sector & Service Selection */}
              {step === 1 && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <label className="text-xs font-bold text-[#0F3D2E] uppercase font-mono block mb-2">
                      1. Sector & Client Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, sector: 'residential' })}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                          formData.sector === 'residential'
                            ? 'bg-white border-[#2ECC71] shadow-soft-xs'
                            : 'bg-[#F0F5F2]/70 border-[#0F3D2E]/8 hover:bg-white'
                        }`}
                      >
                        <Home className="w-5 h-5 text-[#2ECC71]" />
                        <div>
                          <div className="font-bold text-xs text-[#0F3D2E]">Residential</div>
                          <div className="text-[10px] text-[#2C3E50]/70">Estates, Villas, Condos</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, sector: 'commercial' })}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                          formData.sector === 'commercial'
                            ? 'bg-white border-[#2ECC71] shadow-soft-xs'
                            : 'bg-[#F0F5F2]/70 border-[#0F3D2E]/8 hover:bg-white'
                        }`}
                      >
                        <Building2 className="w-5 h-5 text-[#0F3D2E]" />
                        <div>
                          <div className="font-bold text-xs text-[#0F3D2E]">Commercial B2B</div>
                          <div className="text-[10px] text-[#2C3E50]/70">Tech Campuses, Retail, Offices</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#0F3D2E] uppercase font-mono block mb-2">
                      2. Required Services (Select all that apply)
                    </label>
                    <div className="space-y-2.5">
                      {[
                        { id: 'eco-cleaning', title: 'Eco-Cleaning Services', desc: 'Plant-based botanical bio-enzymes, zero VOC solvents', icon: Sparkles },
                        { id: 'waste-management', title: 'Solid Waste Management', desc: 'Closed-loop 98%+ landfill diversion, compost management', icon: Trash2 },
                        { id: 'green-sanitization', title: 'Green Sanitization', desc: 'Hospital-grade dry bio-atomization (HOCl, no bleach)', icon: ShieldCheck }
                      ].map((srv) => {
                        const Icon = srv.icon;
                        const isSelected = formData.services.includes(srv.id);

                        return (
                          <div
                            key={srv.id}
                            onClick={() => toggleService(srv.id)}
                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? 'bg-white border-[#2ECC71] shadow-soft-xs'
                                : 'bg-[#F0F5F2]/50 border-[#0F3D2E]/8 hover:bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isSelected ? 'bg-[#2ECC71]/20 text-[#0F3D2E]' : 'bg-[#0F3D2E]/5 text-[#2C3E50]'}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-[#0F3D2E]">{srv.title}</div>
                                <div className="text-[10px] text-[#2C3E50]/70">{srv.desc}</div>
                              </div>
                            </div>
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${isSelected ? 'bg-[#2ECC71] border-[#2ECC71] text-white' : 'border-[#0F3D2E]/20 bg-white'}`}>
                              {isSelected && <Check className="w-3.5 h-3.5" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Footprint & Cadence */}
              {step === 2 && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-[#0F3D2E] uppercase font-mono">
                        Approximate Facility Size (sq. ft.)
                      </label>
                      <span className="font-mono font-bold text-xs text-[#0F3D2E] bg-[#2ECC71]/15 px-2.5 py-0.5 rounded-md">
                        {formData.areaSqFt.toLocaleString()} sq. ft.
                      </span>
                    </div>
                    <input
                      type="range"
                      min={formData.sector === 'commercial' ? 1000 : 500}
                      max={formData.sector === 'commercial' ? 50000 : 10000}
                      step={formData.sector === 'commercial' ? 500 : 100}
                      value={formData.areaSqFt}
                      onChange={(e) => setFormData({ ...formData, areaSqFt: Number(e.target.value) })}
                      className="w-full h-2 rounded-lg bg-[#0F3D2E]/10 accent-[#2ECC71] cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#0F3D2E] uppercase font-mono block mb-2">
                      Service Frequency / Cadence
                    </label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { id: 'onetime', label: 'One-Time Audit', desc: 'Comprehensive hygiene review' },
                        { id: 'biweekly', label: 'Bi-Weekly', desc: 'Regular maintenance' },
                        { id: 'monthly', label: 'Monthly Retainer', desc: 'Highest impact & continuous audit' }
                      ].map((cad) => (
                        <button
                          key={cad.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, cadence: cad.id })}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                            formData.cadence === cad.id
                              ? 'bg-white border-[#2ECC71] shadow-soft-xs'
                              : 'bg-[#F0F5F2]/70 border-[#0F3D2E]/8 hover:bg-white'
                          }`}
                        >
                          <div className="text-xs font-bold text-[#0F3D2E]">{cad.label}</div>
                          <div className="text-[10px] text-[#2C3E50]/70 mt-0.5">{cad.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Green Compliance Level */}
              {step === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <label className="text-xs font-bold text-[#0F3D2E] uppercase font-mono block">
                    Select Green-Compliance Standard
                  </label>
                  <div className="space-y-3">
                    {COMPLIANCE_TIERS.map((tier) => {
                      const isSelected = formData.complianceTier === tier.id;
                      return (
                        <div
                          key={tier.id}
                          onClick={() => setFormData({ ...formData, complianceTier: tier.id })}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                            isSelected
                              ? 'bg-white border-[#2ECC71] shadow-soft-xs ring-1 ring-[#2ECC71]'
                              : 'bg-[#F0F5F2]/60 border-[#0F3D2E]/8 hover:bg-white'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-[#0F3D2E]">{tier.name}</span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0F3D2E]/6 text-[#0F3D2E]">
                                {tier.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#2C3E50] leading-relaxed">
                              {tier.desc}
                            </p>
                          </div>
                          <span className="text-[11px] font-mono font-semibold text-[#0F3D2E] whitespace-nowrap">
                            {tier.rate}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 4: Scheduling & Contact Details */}
              {step === 4 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-[#0F3D2E] block mb-1">
                        Full Name / Organization
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Acme Corp / Sarah Jenkins"
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#0F3D2E]/15 text-xs text-[#0F3D2E] focus:outline-none focus:border-[#2ECC71]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#0F3D2E] block mb-1">
                        Work / Primary Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="contact@domain.com"
                        value={formData.clientEmail}
                        onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#0F3D2E]/15 text-xs text-[#0F3D2E] focus:outline-none focus:border-[#2ECC71]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-[#0F3D2E] block mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.clientPhone}
                        onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#0F3D2E]/15 text-xs text-[#0F3D2E] focus:outline-none focus:border-[#2ECC71]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#0F3D2E] block mb-1">
                        Preferred Audit Date
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#0F3D2E]/15 text-xs text-[#0F3D2E] focus:outline-none focus:border-[#2ECC71]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Wizard Nav Buttons */}
              <div className="pt-4 border-t border-[#0F3D2E]/8 flex items-center justify-between gap-3">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-4 py-2.5 rounded-xl bg-white border border-[#0F3D2E]/15 text-xs font-semibold text-[#0F3D2E] hover:bg-[#F0F5F2] flex items-center gap-1.5 cursor-pointer min-h-[44px]"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div />
                )}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="px-6 py-2.5 rounded-full bg-[#0F3D2E] text-white hover:bg-[#0F3D2E]/90 text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-soft-xs min-h-[44px]"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#2ECC71]" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-7 py-3 rounded-full bg-[#0F3D2E] text-white hover:bg-[#0F3D2E]/90 text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-[0px_10px_20px_rgba(15,61,46,0.2)] disabled:opacity-70 min-h-[44px]"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#2ECC71]" />
                        <span>Confirming Protocol...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Eco-Audit Request</span>
                        <Check className="w-4 h-4 text-[#2ECC71]" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
