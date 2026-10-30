import React, { useState, useMemo } from 'react';
import { ArrowRight, ShieldCheck, Sparkles, Droplets, Trash2, Wind, Building2, Home, CheckCircle2 } from 'lucide-react';

export default function GreenTechHero({ onRequestAuditWithData }) {
  // Sector Mode: 'residential' | 'commercial'
  const [sector, setSector] = useState('commercial');
  // Area in sq ft
  const [areaSqFt, setAreaSqFt] = useState(sector === 'commercial' ? 5000 : 1800);

  // When sector switches, set intuitive default area
  const handleSectorChange = (newSector) => {
    setSector(newSector);
    setAreaSqFt(newSector === 'commercial' ? 5000 : 1800);
  };

  // Real-time environmental savings estimation formula
  const metrics = useMemo(() => {
    const isComm = sector === 'commercial';
    // Chemical runoff: ~0.42L per sq ft commercial annually vs ~0.28L residential
    const runoffRate = isComm ? 0.42 : 0.28;
    const chemicalRunoffLiters = Math.round(areaSqFt * runoffRate);

    // Solid waste diversion: ~1.25kg per sq ft annually for commercial zero-landfill vs ~0.8kg residential
    const wasteRate = isComm ? 1.25 : 0.82;
    const wasteDivertedKg = Math.round(areaSqFt * wasteRate);

    // Carbon offset: ~0.18kg CO2e per sq ft avoided through bio-enzymes & zero-landfill methane prevention
    const co2OffsetKg = Math.round(areaSqFt * (isComm ? 0.19 : 0.14));

    // Plastic packaging containers diverted
    const plasticBottlesDiverted = Math.round(chemicalRunoffLiters / 2.5);

    return {
      chemicalRunoffLiters,
      wasteDivertedKg,
      co2OffsetKg,
      plasticBottlesDiverted
    };
  }, [sector, areaSqFt]);

  return (
    <section className="relative overflow-hidden pt-8 sm:pt-14 pb-16 lg:pb-24 bg-[#F8F9FA]">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#2ECC71]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-10 w-[450px] h-[450px] bg-[#0F3D2E]/4 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-[120px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
          
          {/* LEFT: Editorial-Grade Typographic Hierarchy & Trust Metrics */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F3D2E]/5 border border-[#0F3D2E]/10 text-[#0F3D2E] text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#2ECC71] animate-pulse" />
              <span>Next-Gen Ecological Environmental Hygiene</span>
            </div>

            <h1 className="text-3xl sm:text-5xl xl:text-6xl font-sans font-bold text-[#0F3D2E] tracking-tight leading-[1.12]">
              Clinical Cleanliness. <br className="hidden sm:inline" />
              <span className="text-[#2ECC71]">Pure Ecological</span> Integrity.
            </h1>

            <p className="text-base sm:text-lg text-[#2C3E50] leading-[1.6] max-w-xl font-normal">
              Reimagining commercial and residential hygiene as high-end green-tech SaaS. We pair plant-derived bio-enzymes with zero-landfill circular waste logistics—eliminating toxic runoff without compromising sterile purity.
            </p>

            {/* Real-time trust metrics strip */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl">
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-[#0F3D2E]/8 shadow-[0px_4px_16px_rgba(15,61,46,0.03)]">
                <div className="w-8 h-8 rounded-xl bg-[#2ECC71]/15 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-[#0F3D2E]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0F3D2E]">100% Non-Toxic</div>
                  <div className="text-[10px] text-[#2C3E50]/75">Plant-derived botanical</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-[#0F3D2E]/8 shadow-[0px_4px_16px_rgba(15,61,46,0.03)]">
                <div className="w-8 h-8 rounded-xl bg-[#2ECC71]/15 flex items-center justify-center shrink-0">
                  <Trash2 className="w-4 h-4 text-[#0F3D2E]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0F3D2E]">Zero-Waste Certified</div>
                  <div className="text-[10px] text-[#2C3E50]/75">Closed-loop diversion</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-[#0F3D2E]/8 shadow-[0px_4px_16px_rgba(15,61,46,0.03)]">
                <div className="w-8 h-8 rounded-xl bg-[#2ECC71]/15 flex items-center justify-center shrink-0">
                  <Droplets className="w-4 h-4 text-[#0F3D2E]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0F3D2E]">Microplastic-Free</div>
                  <div className="text-[10px] text-[#2C3E50]/75">Zero persistent runoff</div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={() => onRequestAuditWithData({ sector, areaSqFt, metrics })}
                className="px-7 py-3.5 rounded-full bg-[#0F3D2E] text-white hover:bg-[#0F3D2E]/90 text-sm font-semibold shadow-[0px_10px_25px_rgba(15,61,46,0.18)] hover:shadow-[0px_14px_28px_rgba(46,204,113,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
              >
                <span>Request Eco-Audit</span>
                <ArrowRight className="w-4 h-4 text-[#2ECC71]" />
              </button>
              <a
                href="#core-services"
                className="px-6 py-3.5 rounded-full bg-white hover:bg-[#F0F5F2] text-[#0F3D2E] border border-[#0F3D2E]/15 text-sm font-semibold text-center transition-colors cursor-pointer min-h-[48px] flex items-center justify-center"
              >
                Explore Services & Specs
              </a>
            </div>
          </div>

          {/* RIGHT: Interactive Green Impact Estimator Card */}
          <div className="lg:col-span-5" id="impact-estimator">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#0F3D2E]/10 shadow-[0px_10px_30px_rgba(15,61,46,0.05)] relative overflow-hidden transition-all duration-300 hover:shadow-[0px_14px_35px_rgba(15,61,46,0.08)]">
              {/* Header with Sector Toggle */}
              <div className="flex items-center justify-between gap-2 pb-5 border-b border-[#0F3D2E]/8">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#2ECC71] bg-[#0F3D2E] px-2 py-0.5 rounded-md">
                    Interactive SaaS Tool
                  </span>
                  <h3 className="font-sans font-bold text-lg text-[#0F3D2E] mt-1.5">
                    Green Impact Estimator
                  </h3>
                </div>

                {/* Residential vs Commercial Segmented Control */}
                <div className="flex items-center p-1 rounded-2xl bg-[#F0F5F2] border border-[#0F3D2E]/8 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => handleSectorChange('residential')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      sector === 'residential'
                        ? 'bg-[#0F3D2E] text-white shadow-soft-xs'
                        : 'text-[#2C3E50] hover:text-[#0F3D2E]'
                    }`}
                  >
                    <Home className="w-3 h-3" />
                    <span>Res</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSectorChange('commercial')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      sector === 'commercial'
                        ? 'bg-[#0F3D2E] text-white shadow-soft-xs'
                        : 'text-[#2C3E50] hover:text-[#0F3D2E]'
                    }`}
                  >
                    <Building2 className="w-3 h-3" />
                    <span>B2B</span>
                  </button>
                </div>
              </div>

              {/* Slider for Facility Footprint */}
              <div className="py-5 space-y-3">
                <div className="flex justify-between items-center text-xs font-sans">
                  <span className="text-[#2C3E50] font-medium">Facility / Space Footprint:</span>
                  <span className="font-mono font-bold text-[#0F3D2E] text-sm bg-[#2ECC71]/15 px-2.5 py-0.5 rounded-lg border border-[#2ECC71]/30">
                    {areaSqFt.toLocaleString()} sq. ft.
                  </span>
                </div>
                <input
                  type="range"
                  min={sector === 'commercial' ? 1000 : 400}
                  max={sector === 'commercial' ? 50000 : 8000}
                  step={sector === 'commercial' ? 500 : 100}
                  value={areaSqFt}
                  onChange={(e) => setAreaSqFt(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-[#F0F5F2] accent-[#2ECC71] cursor-pointer"
                  aria-label="Adjust facility square footage"
                />
                <div className="flex justify-between text-[10px] text-[#2C3E50]/60 font-mono">
                  <span>{sector === 'commercial' ? '1,000 sq ft (Studio)' : '400 sq ft'}</span>
                  <span>{sector === 'commercial' ? '50,000+ sq ft (Tech Campus)' : '8,000 sq ft (Villa)'}</span>
                </div>
              </div>

              {/* Live Environmental Computed Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 pt-1 pb-5">
                <div className="p-3.5 rounded-2xl bg-[#F0F5F2]/80 border border-[#0F3D2E]/6">
                  <div className="flex items-center gap-1.5 text-xs text-[#2C3E50] font-medium">
                    <Droplets className="w-3.5 h-3.5 text-[#2ECC71]" />
                    <span>Runoff Prevented</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-mono font-bold text-[#0F3D2E] mt-1">
                    {metrics.chemicalRunoffLiters.toLocaleString()} <span className="text-xs font-sans font-normal text-[#2C3E50]">Liters</span>
                  </div>
                  <p className="text-[10px] text-[#2C3E50]/70 mt-0.5">Bio-enzyme replacement</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F0F5F2]/80 border border-[#0F3D2E]/6">
                  <div className="flex items-center gap-1.5 text-xs text-[#2C3E50] font-medium">
                    <Trash2 className="w-3.5 h-3.5 text-[#2ECC71]" />
                    <span>Waste Diverted</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-mono font-bold text-[#0F3D2E] mt-1">
                    {metrics.wasteDivertedKg.toLocaleString()} <span className="text-xs font-sans font-normal text-[#2C3E50]">kg</span>
                  </div>
                  <p className="text-[10px] text-[#2C3E50]/70 mt-0.5">Closed-loop circular recovery</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F0F5F2]/80 border border-[#0F3D2E]/6">
                  <div className="flex items-center gap-1.5 text-xs text-[#2C3E50] font-medium">
                    <Wind className="w-3.5 h-3.5 text-[#2ECC71]" />
                    <span>CO2e Avoided</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-mono font-bold text-[#0F3D2E] mt-1">
                    {metrics.co2OffsetKg.toLocaleString()} <span className="text-xs font-sans font-normal text-[#2C3E50]">kg</span>
                  </div>
                  <p className="text-[10px] text-[#2C3E50]/70 mt-0.5">Methane & transit offset</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F0F5F2]/80 border border-[#0F3D2E]/6">
                  <div className="flex items-center gap-1.5 text-xs text-[#2C3E50] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2ECC71]" />
                    <span>Plastic Diversion</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-mono font-bold text-[#0F3D2E] mt-1">
                    {metrics.plasticBottlesDiverted.toLocaleString()} <span className="text-xs font-sans font-normal text-[#2C3E50]">jugs</span>
                  </div>
                  <p className="text-[10px] text-[#2C3E50]/70 mt-0.5">Zero single-use canisters</p>
                </div>
              </div>

              {/* Bottom Card Action */}
              <button
                type="button"
                onClick={() => onRequestAuditWithData({ sector, areaSqFt, metrics })}
                className="w-full py-3.5 rounded-2xl bg-[#0F3D2E] text-white hover:bg-[#0F3D2E]/95 text-xs font-semibold flex items-center justify-center gap-2 border border-[#2ECC71]/30 transition-all cursor-pointer shadow-soft-xs"
              >
                <span>Schedule Audit with this Estimate</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#2ECC71]" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

