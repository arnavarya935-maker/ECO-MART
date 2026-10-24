import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Award,
  Leaf,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  MapPin,
  Wrench,
  Repeat
} from 'lucide-react';
import CityRecyclingGuideModal from '../components/tools/CityRecyclingGuideModal';
import RepairGuidesModal from '../components/lifecycle/RepairGuidesModal';
import SecondLifeBoardModal from '../components/lifecycle/SecondLifeBoardModal';
import CertificationDecoderModal from '../components/detective/CertificationDecoderModal';
import TShirtStoryMode from '../components/learn/TShirtStoryMode';
import MythBusterCards from '../components/learn/MythBusterCards';
import ShoppersChecklistModal from '../components/tools/ShoppersChecklistModal';
import { CheckSquare } from 'lucide-react';

const MYTHS = [
  {
    id: 'myth-1',
    myth: '“Compostable plastics break down safely in standard municipal landfills.”',
    truth: 'False. Compostable plastics (like PLA) require high-temperature industrial composting facilities (58°C+ with moisture and oxygen). In airtight anaerobic landfills, they break down very slowly and can generate methane gas.',
    recommendation: 'Check if your municipality has industrial organics collection before purchasing bioplastics.'
  },
  {
    id: 'myth-2',
    myth: '“Paper bags always have a lower carbon footprint than plastic bags.”',
    truth: 'Not initially. Producing a kraft paper bag consumes approximately 3x to 4x more energy and water than a thin plastic bag due to tree harvesting and chemical pulping. A paper bag must be reused at least 4 to 8 times to break even on greenhouse emissions.',
    recommendation: 'Reuse your existing bags as many times as possible, regardless of whether they are paper, jute, or cotton.'
  },
  {
    id: 'myth-3',
    myth: '“The chasing arrows recycling symbol means the package is 100% recyclable everywhere.”',
    truth: 'Misleading. The Mobius loop symbol often indicates only the resin identification code (e.g. #7 Other, #3 PVC), not whether your local municipal recycling center actually has equipment to recycle that resin.',
    recommendation: 'Look for #1 PET and #2 HDPE for high domestic recycling rates; avoid unnumbered mixed multilayer pouches.'
  }
];

const CERTS = [
  {
    name: 'GOTS (Global Organic Textile Standard)',
    issuer: 'International Working Group on GOTS',
    covers: 'Organic cotton, linen, silk',
    guarantee: 'At least 95% certified organic fibers, zero toxic pesticides, fair living wages in manufacturing.',
    registryTip: 'Verify certificate license numbers on the public gots-org.com registry.'
  },
  {
    name: 'FSC (Forest Stewardship Council 100%)',
    issuer: 'Forest Stewardship Council A.C.',
    covers: 'Wood, bamboo, paper, cardboard',
    guarantee: 'Harvested from responsibly managed forests preventing deforestation and respecting indigenous land rights.',
    registryTip: 'Look for FSC Chain-of-Custody (CoC) code formatted as FSC-C######.'
  },
  {
    name: 'OEKO-TEX Standard 100',
    issuer: 'International Association for Research and Testing in Textile Ecology',
    covers: 'Apparel, towels, bedding',
    guarantee: 'Every thread, button, and zipper is rigorously tested for over 300 harmful chemical substances.',
    registryTip: 'Verify label check at oeko-tex.com/label-check.'
  },
  {
    name: 'Fair Trade Certified',
    issuer: 'Fairtrade International',
    covers: 'Coffee, cocoa, cotton, handicrafts',
    guarantee: 'Guaranteed minimum price floor and Community Development Premium paid directly to producers.',
    registryTip: 'Protects smallholder farmers from global commodity price crashes.'
  }
];

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState('how'); // 'how' | 'tshirt' | 'certs' | 'myths'
  const [cityRecycleOpen, setCityRecycleOpen] = useState(false);
  const [repairGuidesOpen, setRepairGuidesOpen] = useState(false);
  const [secondLifeOpen, setSecondLifeOpen] = useState(false);
  const [certDecoderOpen, setCertDecoderOpen] = useState(false);
  const [checklistOpen, setChecklistOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface text-text pb-28 sm:pb-20 text-left">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-line pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                Hub 5 of 5
              </span>
              <span className="text-xs text-muted font-medium">
                Conscious Consumer Knowledge &amp; Standards
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-heading mt-2 tracking-tight">
              Learn &amp; Truth Academy
            </h1>
            <p className="font-sans text-xs sm:text-sm text-secondary mt-1 max-w-2xl">
              Understand cradle-to-grave lifecycle accounting, decode eco-certifications, debunk greenwashing myths, and follow product journeys.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setChecklistOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-surface-raised hover:bg-surface border border-line text-heading text-xs font-semibold shadow-soft-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <CheckSquare className="w-3.5 h-3.5 text-primary" />
              <span>Checklist</span>
            </button>
            <button
              type="button"
              onClick={() => setCityRecycleOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-surface-raised hover:bg-surface border border-line text-heading text-xs font-semibold shadow-soft-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>City Recycling</span>
            </button>
            <button
              type="button"
              onClick={() => setRepairGuidesOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-surface-raised hover:bg-surface border border-line text-heading text-xs font-semibold shadow-soft-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Wrench className="w-3.5 h-3.5 text-primary" />
              <span>Repair Guides</span>
            </button>
            <button
              type="button"
              onClick={() => setSecondLifeOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-surface-raised hover:bg-surface border border-line text-heading text-xs font-semibold shadow-soft-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Repeat className="w-3.5 h-3.5 text-primary" />
              <span>Second Life Board</span>
            </button>
            <Link
              to="/how-it-works"
              className="px-3 py-1.5 rounded-xl bg-surface-raised hover:bg-surface border border-line text-heading text-xs font-semibold shadow-soft-xs transition-colors inline-flex items-center gap-1.5"
            >
              <span>Algorithm</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2">
          {[
            { id: 'how', label: '🔬 Lifecycle Accounting', desc: '5 Environmental Pillars' },
            { id: 'tshirt', label: '👕 Journey of a T-Shirt', desc: 'Cradle to Second Life' },
            { id: 'certs', label: '🏅 Certification Decoder', desc: 'GOTS, FSC, OEKO-TEX' },
            { id: 'myths', label: '💡 Sustainability Myth-Busters', desc: 'Landfill, Paper & Recycling' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl border text-xs font-sans transition-all whitespace-nowrap cursor-pointer text-left ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-contrast border-primary shadow-soft-xs font-bold'
                  : 'bg-surface-raised text-secondary border-line hover:text-heading hover:bg-surface'
              }`}
            >
              <div>{tab.label}</div>
              <div className={`text-[10px] font-normal ${activeTab === tab.id ? 'text-primary-contrast/80' : 'text-muted'}`}>
                {tab.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Tab 1: How It Works Lifecycle Pillars */}
        {activeTab === 'how' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: '1. Material Renewability (30%)',
                badge: '30 Pts Max',
                desc: 'Evaluates the feedstock origin. Prioritizes certified organic fibers, agricultural byproducts (bamboo, coconut coir, jute), and post-consumer recycled glass/metal over virgin petroleum synthetics.'
              },
              {
                title: '2. Low-Emission Carbon Footprint (25%)',
                badge: '25 Pts Max',
                desc: 'Calculates cradle-to-gate greenhouse emissions (kg CO₂e) covering agricultural energy, industrial heat, and processing fuel using open LCA benchmark data.'
              },
              {
                title: '3. Plastic-Free Packaging (20%)',
                badge: '20 Pts Max',
                desc: 'Rewards 100% paperboard, seed paper, tin, and biodegradable packaging. Heavily penalizes virgin blister packs and plastic wrap that outlast the product itself.'
              },
              {
                title: '4. Third-Party Certifications (15%)',
                badge: '15 Pts Max',
                desc: 'Validates independent audits (FSC, GOTS, Fair Trade, Leaping Bunny). Self-declarations receive zero points in this category to prevent greenwashing.'
              },
              {
                title: '5. Local Shipping & Proximity (10%)',
                badge: '10 Pts Max',
                desc: 'Measures transport distance from artisan manufacturing centers to consumer hubs. Local intra-state crafts receive maximum proximity credits.'
              },
              {
                title: 'Data Completeness & Confidence',
                badge: 'Uncertainty Bands',
                desc: 'Every score carries a transparent confidence band (±4 to ±12 pts). Verified suppliers receive tight margins; material benchmark estimates show truthful wider bands.'
              }
            ].map((pillar, i) => (
              <div
                key={i}
                className="bg-surface-raised rounded-3xl p-6 border border-line shadow-soft-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-primary px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                    {pillar.badge}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg text-heading">{pillar.title}</h3>
                <p className="text-xs text-secondary leading-relaxed font-sans">{pillar.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Story of a T-Shirt (Feature 41) */}
        {activeTab === 'tshirt' && (
          <TShirtStoryMode />
        )}

        {/* Tab 3: Certification Decoder */}
        {activeTab === 'certs' && (
          <div className="space-y-4">
            <div className="bg-surface-raised rounded-3xl p-6 border border-line shadow-soft-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif font-bold text-xl text-heading">
                  Third-Party Eco-Certification Decoder
                </h3>
                <p className="text-xs text-secondary mt-1">
                  Learn what each recognized label guarantees and how to verify certificates against public registries.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCertDecoderOpen(true)}
                className="px-4 py-2 rounded-xl bg-primary text-primary-contrast text-xs font-bold hover:bg-primary-hover transition-colors shadow-soft-xs cursor-pointer shrink-0"
              >
                Open Registry Lookup
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CERTS.map((c) => (
                <div
                  key={c.name}
                  className="bg-surface-raised rounded-3xl p-6 border border-line shadow-soft-xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-base text-heading">{c.name}</h4>
                      <span className="text-[10px] text-muted font-mono">{c.issuer}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold">
                      {c.covers}
                    </span>
                  </div>

                  <p className="text-xs text-secondary leading-relaxed font-sans">{c.guarantee}</p>

                  <div className="p-3 rounded-2xl bg-surface-sunken border border-line text-[11px] text-primary font-medium flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>{c.registryTip}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Myth Busters (Feature 42) */}
        {activeTab === 'myths' && (
          <MythBusterCards />
        )}
      </div>

      {/* Circularity & Certification Modals */}
      <CityRecyclingGuideModal
        isOpen={cityRecycleOpen}
        onClose={() => setCityRecycleOpen(false)}
      />

      <RepairGuidesModal
        isOpen={repairGuidesOpen}
        onClose={() => setRepairGuidesOpen(false)}
      />

      <SecondLifeBoardModal
        isOpen={secondLifeOpen}
        onClose={() => setSecondLifeOpen(false)}
      />

      <CertificationDecoderModal
        isOpen={certDecoderOpen}
        onClose={() => setCertDecoderOpen(false)}
      />

      <ShoppersChecklistModal
        isOpen={checklistOpen}
        onClose={() => setChecklistOpen(false)}
      />
    </div>
  );
}
