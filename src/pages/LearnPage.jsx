import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  MapPin,
  Wrench,
  Repeat,
  Newspaper
} from 'lucide-react';
import CityRecyclingGuideModal from '../components/tools/CityRecyclingGuideModal';
import RepairGuidesModal from '../components/lifecycle/RepairGuidesModal';
import SecondLifeBoardModal from '../components/lifecycle/SecondLifeBoardModal';
import CertificationDecoderModal from '../components/detective/CertificationDecoderModal';
import TShirtStoryMode from '../components/learn/TShirtStoryMode';
import MythBusterCards from '../components/learn/MythBusterCards';
import ShoppersChecklistModal from '../components/tools/ShoppersChecklistModal';
import { CheckSquare } from 'lucide-react';
import Tabs from '../components/ui/Tabs';
import GlossaryTooltip from '../components/ui/GlossaryTooltip';

const LEARN_TABS = [
  { id: 'how', label: 'Lifecycle Accounting' },
  { id: 'tshirt', label: 'Journey of a T-Shirt' },
  { id: 'certs', label: 'Certification Decoder' },
  { id: 'myths', label: 'Myth-Busters' }
];


const CERTS = [
  {
    name: 'GOTS (Global Organic Textile Standard)',
    issuer: 'International Working Group on GOTS',
    covers: 'Organic cotton, linen, silk',
    meaning: 'At least 95% certified organic fibers, zero toxic pesticides, fair living wages in manufacturing.',
    registryTip: 'Verify certificate license numbers on the public gots-org.com registry.'
  },
  {
    name: 'FSC (Forest Stewardship Council 100%)',
    issuer: 'Forest Stewardship Council A.C.',
    covers: 'Wood, bamboo, paper, cardboard',
    meaning: 'Harvested from responsibly managed forests preventing deforestation and respecting indigenous land rights.',
    registryTip: 'Look for FSC Chain-of-Custody (CoC) code formatted as FSC-C######.'
  },
  {
    name: 'OEKO-TEX Standard 100',
    issuer: 'International Association for Research and Testing in Textile Ecology',
    covers: 'Apparel, towels, bedding',
    meaning: 'Every thread, button, and zipper is rigorously tested for over 300 harmful chemical substances.',
    registryTip: 'Verify label check at oeko-tex.com/label-check.'
  },
  {
    name: 'Fair Trade Certified',
    issuer: 'Fairtrade International',
    covers: 'Coffee, cocoa, cotton, handicrafts',
    meaning: 'Guaranteed minimum price floor and Community Development Premium paid directly to producers.',
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
              Understand <GlossaryTooltip term="Cradle-to-Grave">cradle-to-grave</GlossaryTooltip> lifecycle accounting, <GlossaryTooltip term="Circular Economy">circular economy</GlossaryTooltip> pathways, decode eco-certifications, and debunk greenwashing myths.
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
              to="/news"
              className="px-3 py-1.5 rounded-xl bg-surface-raised hover:bg-surface border border-line text-heading text-xs font-semibold shadow-soft-xs transition-colors inline-flex items-center gap-1.5"
            >
              <Newspaper className="w-3.5 h-3.5 text-accent" />
              <span>Eco News Watch</span>
            </Link>
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
        <div className="mt-6 overflow-x-auto pb-2">
          <Tabs tabs={LEARN_TABS} activeTab={activeTab} onChange={setActiveTab} />
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
                desc: (
                  <span>
                    Evaluates the feedstock origin. Prioritizes certified organic fibers, agricultural byproducts (bamboo, coconut coir, jute), and post-consumer recycled glass/metal over virgin petroleum synthetics.
                  </span>
                )
              },
              {
                title: '2. Low-Emission Carbon Footprint (25%)',
                badge: '25 Pts Max',
                desc: (
                  <span>
                    Calculates <GlossaryTooltip term="Cradle-to-Grave">cradle-to-gate</GlossaryTooltip> greenhouse emissions (<GlossaryTooltip term="Embodied Carbon">embodied carbon</GlossaryTooltip> in kg CO₂e) covering agricultural energy, industrial heat, and processing fuel using open LCA benchmark data.
                  </span>
                )
              },
              {
                title: '3. Plastic-Free Packaging (20%)',
                badge: '20 Pts Max',
                desc: (
                  <span>
                    Rewards 100% paperboard, seed paper, tin, and compostable packaging (<GlossaryTooltip term="Biodegradable vs Compostable">compostable vs biodegradable</GlossaryTooltip>). Heavily penalizes virgin blister packs and plastic wrap that outlast the product itself.
                  </span>
                )
              },
              {
                title: '4. Third-Party Certifications (15%)',
                badge: '15 Pts Max',
                desc: (
                  <span>
                    Validates independent audits (<GlossaryTooltip term="FSC 100% Certified">FSC</GlossaryTooltip>, <GlossaryTooltip term="GOTS Certified">GOTS</GlossaryTooltip>, Fair Trade, Leaping Bunny). Self-declarations receive zero points in this category to prevent greenwashing.
                  </span>
                )
              },
              {
                title: '5. Local Shipping & Proximity (10%)',
                badge: '10 Pts Max',
                desc: (
                  <span>
                    Measures transport distance (<GlossaryTooltip term="Food Miles & Freight Proximity">food miles &amp; freight proximity</GlossaryTooltip>) from artisan manufacturing centers to consumer hubs. Local intra-state crafts receive maximum proximity credits.
                  </span>
                )
              },
              {
                title: 'Data Completeness & Confidence',
                badge: 'Uncertainty Bands',
                desc: 'Every score carries a transparent score range (±4 to ±12 pts). Products listing multiple certifications receive tighter margins; material estimates show truthful wider bands.'
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
                  Learn what each recognized label means and how to check certificates on public registries.
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
