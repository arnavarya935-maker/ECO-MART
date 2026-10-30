import React, { useState } from 'react';
import { Sparkles, Trash2, ShieldCheck, ChevronDown, ChevronUp, CheckCircle, ArrowRight, Layers, Droplet, Activity } from 'lucide-react';

const SERVICES = [
  {
    id: 'eco-cleaning',
    title: 'Eco-Cleaning Services',
    subtitle: 'Enzymatic Botanical Hygiene',
    category: 'Bio-Formulations',
    description: 'Advanced multi-enzyme botanical cleaning protocols that digest organic grease, biofilm, and environmental particulates without petroleum solvents or toxic vapors.',
    icon: Sparkles,
    badge: 'Zero-VOC Standard',
    specs: [
      { label: 'pH Balance', val: '7.0 Pure Neutral Botanical' },
      { label: 'Active Chemistry', val: 'Thyme oil, citric extracts & plant glucosides' },
      { label: 'Water Conservation', val: 'Micro-vapor low-moisture technology (85% saved)' },
      { label: 'Indoor Air Impact', val: 'Zero respiratory irritants, zero off-gassing' },
      { label: 'Compliance Grade', val: 'Exceeds Green Seal & EU Ecolabel criteria' }
    ]
  },
  {
    id: 'waste-management',
    title: 'Solid Waste Management',
    subtitle: 'Zero-Landfill Circular Logistics',
    category: 'Material Recovery',
    description: 'Decentralized source segregation, commercial aerobic composting, and closed-loop material recovery routing 98%+ of facility waste away from municipal landfills.',
    icon: Trash2,
    badge: 'Zero-Landfill Protocol',
    specs: [
      { label: 'Target Diversion', val: '98.4% facility mass diverted from dumpsites' },
      { label: 'Compost Processing', val: 'On-site aerobic digestion with microbial starter' },
      { label: 'Traceability', val: 'Batch weight receipts with monthly ledger export' },
      { label: 'Recycling Chain', val: 'Direct industrial mill delivery (zero incineration)' },
      { label: 'Compliance Grade', val: 'Zero-Waste International Alliance standard' }
    ]
  },
  {
    id: 'green-sanitization',
    title: 'Green Sanitization',
    subtitle: 'Hospital-Grade Bio-Atomization',
    category: 'Pathogen Defense',
    description: 'Ultra-low volume dry atomization delivering natural hypochlorous acid (HOCl) to eradicate 99.99% of airborne and surface pathogens with zero chlorine bleach residue.',
    icon: ShieldCheck,
    badge: 'Clinical Grade',
    specs: [
      { label: 'Kill Rate', val: '99.99% viral & bacterial broad-spectrum efficacy' },
      { label: 'Dwell Time', val: '60 seconds rapid airborne & surface contact' },
      { label: 'Chemical Residue', val: 'Degrades into pure water and trace saline' },
      { label: 'Safety Profile', val: 'Non-corrosive, food-contact and pet friendly' },
      { label: 'Compliance Grade', val: 'OSHA & EPA Design for Environment criteria' }
    ]
  }
];

export default function CoreServicesGrid({ onSelectService }) {
  const [expandedSpecs, setExpandedSpecs] = useState({});
  const [activeSlide, setActiveSlide] = useState(0);

  const toggleSpecs = (id) => {
    setExpandedSpecs((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section id="core-services" className="py-16 sm:py-24 bg-[#F8F9FA] relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-[120px]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2ECC71] bg-[#0F3D2E] px-3 py-1 rounded-full inline-block">
              Core Service Matrix
            </span>
            <h2 className="text-3xl sm:text-4xl font-sans font-bold text-[#0F3D2E] tracking-tight">
              Clinical Purity. Engineered for Circularity.
            </h2>
            <p className="text-sm sm:text-base text-[#2C3E50] leading-relaxed">
              Every service is formulated with rigorous ecological transparency. Inspect full eco-specifications, chemical active ingredients, and certified diversion data below.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs font-sans text-[#2C3E50]/80">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2ECC71]" />
            <span>Interactive Eco-Specs available on all service cards</span>
          </div>
        </div>

        {/* 3-Column Dynamic Cards Grid (Desktop: 3 cols, Tablet/Mobile: Responsive Swipeable Container) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            const isExpanded = Boolean(expandedSpecs[service.id]);

            return (
              <div
                key={service.id}
                className="group p-6 sm:p-8 rounded-3xl bg-[#F0F5F2]/60 hover:bg-white border border-[#0F3D2E]/8 hover:border-[#2ECC71] shadow-[0px_10px_30px_rgba(15,61,46,0.04)] transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header: Icon & Category Tag */}
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-[#0F3D2E] text-white flex items-center justify-center shadow-soft-xs transition-colors group-hover:bg-[#0F3D2E]">
                      <Icon className="w-6 h-6 text-[#2ECC71]" />
                    </div>
                    <span className="text-[11px] font-mono font-bold uppercase px-3 py-1 rounded-full bg-[#0F3D2E]/6 text-[#0F3D2E] border border-[#0F3D2E]/10">
                      {service.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="space-y-1 mb-3">
                    <h3 className="font-sans font-bold text-xl text-[#0F3D2E]">
                      {service.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#2ECC71] tracking-wide uppercase font-mono">
                      {service.subtitle}
                    </p>
                  </div>

                  {/* Body Technical Description */}
                  <p className="text-xs sm:text-sm text-[#2C3E50] leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Expandable "View Eco-Specs" Drawer */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => toggleSpecs(service.id)}
                      className="w-full py-2.5 px-4 rounded-xl bg-white group-hover:bg-[#F0F5F2] border border-[#0F3D2E]/10 hover:border-[#0F3D2E]/25 text-xs font-semibold text-[#0F3D2E] flex items-center justify-between transition-colors cursor-pointer min-h-[44px]"
                      aria-expanded={isExpanded}
                    >
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[#2ECC71]" />
                        <span>{isExpanded ? 'Hide Technical Eco-Specs' : 'View Eco-Specs'}</span>
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[#2ECC71]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#2C3E50]" />
                      )}
                    </button>

                    {/* Collapsible Drawer Content */}
                    {isExpanded && (
                      <div className="mt-3 p-4 rounded-2xl bg-white border border-[#2ECC71]/30 space-y-2.5 text-xs animate-fade-in shadow-soft-xs">
                        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0F3D2E] pb-1 border-b border-[#0F3D2E]/8">
                          Laboratory & Circular Profile
                        </div>
                        {service.specs.map((item, idx) => (
                          <div key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-0.5 text-[11px]">
                            <span className="text-[#2C3E50]/70 font-medium shrink-0">{item.label}:</span>
                            <span className="text-[#0F3D2E] font-semibold sm:text-right">{item.val}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer CTA */}
                <div className="pt-6 mt-6 border-t border-[#0F3D2E]/8 flex items-center justify-between">
                  <span className="text-xs font-mono font-medium text-[#2C3E50]">
                    Residential & B2B
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectService(service)}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#0F3D2E] group-hover:text-[#2ECC71] transition-colors cursor-pointer py-1"
                  >
                    <span>Configure Service</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tablet / Mobile Carousel Visual Indicator */}
        <div className="flex md:hidden items-center justify-center gap-2 mt-8">
          {SERVICES.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                activeSlide === i ? 'w-6 bg-[#2ECC71]' : 'w-2 bg-[#0F3D2E]/20'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

