import React from 'react';
import ArchitectureDiagram from '../components/ArchitectureDiagram';
import { useCart } from '../context/CartContext';
import { Sparkles, ShieldCheck, Cpu } from 'lucide-react';

export default function HowItWorksPage() {
  const { setIsAgentOpen } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-fade-in pb-24">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-3.5 py-1 rounded-full inline-block">
          Methodology & Architecture
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-heading tracking-tight">
          How Eco Sense Agent Works
        </h1>
        <p className="text-sm sm:text-base text-secondary leading-relaxed max-w-xl mx-auto font-normal">
          An in-depth look at our transparent 0-100 Eco-Score Engine, local-first NLP parser,
          and automated greener swap recommendation algorithms.
        </p>
      </div>

      {/* Interactive System Architecture Diagram */}
      <ArchitectureDiagram />

      {/* Detailed 5-Pillar Eco-Score Formula Section */}
      <section className="p-8 rounded-3xl bg-surface border border-line shadow-soft-sm space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
            Mathematical Engine
          </span>
          <h2 className="text-2xl font-serif font-bold text-heading mt-2">
            The 5-Pillar Eco-Score Formula (0–100)
          </h2>
          <p className="text-xs text-muted max-w-2xl mt-1 font-normal">
            Located in <code className="text-primary font-mono">src/lib/ecoScore.js</code>, our open algorithm calculates an objective score
            combining cradle-to-gate lifecycle parameters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Pillar 1 */}
          <div className="p-5 rounded-2xl bg-surface-sunken border border-line space-y-2">
            <div className="flex items-center justify-between font-semibold">
              <span className="text-sm text-heading">1. Material Integrity</span>
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[11px]">
                Weight: 30%
              </span>
            </div>
            <p className="text-secondary leading-relaxed font-normal">
              Rewards renewable, organic, and upcycled feedstocks (bamboo, khadi cotton, coconut shell, reclaimed teak).
              Heavily penalizes petrochemical plastics, virgin polyester, PVC, and melamine.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-5 rounded-2xl bg-surface-sunken border border-line space-y-2">
            <div className="flex items-center justify-between font-semibold">
              <span className="text-sm text-heading">2. Packaging Waste</span>
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[11px]">
                Weight: 20%
              </span>
            </div>
            <p className="text-secondary leading-relaxed font-normal">
              <strong className="text-heading">Plastic-Free:</strong> 20 pts (Seed paper, compostable kraft).<br />
              <strong className="text-heading">Recycled:</strong> 14 pts (Post-consumer paper, infinitely recyclable tin).<br />
              <strong className="text-heading">Plastic:</strong> 3 pts (Shrink-wrap, bubble films).
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-5 rounded-2xl bg-surface-sunken border border-line space-y-2">
            <div className="flex items-center justify-between font-semibold">
              <span className="text-sm text-heading">3. Carbon Lifecycle</span>
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[11px]">
                Weight: 25%
              </span>
            </div>
            <p className="text-secondary leading-relaxed font-normal">
              Evaluates cradle-to-gate CO₂e emissions per unit.
              ≤0.4 kg: 25 pts; ≤0.8 kg: 21 pts; ≤1.5 kg: 17 pts; ≤3.0 kg: 11 pts; &gt;3.0 kg: 4 pts.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-5 rounded-2xl bg-surface-sunken border border-line space-y-2">
            <div className="flex items-center justify-between font-semibold">
              <span className="text-sm text-heading">4. Third-Party Certifications</span>
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[11px]">
                Weight: 15%
              </span>
            </div>
            <p className="text-secondary leading-relaxed font-normal">
              Awards points based on verifiable rigorous eco-standards:
              GOTS Organic, FSC Certified, Fair Trade, Zero Waste Assured, and PETA Vegan.
            </p>
          </div>

          {/* Pillar 5 */}
          <div className="p-5 rounded-2xl bg-surface-sunken border border-line space-y-2">
            <div className="flex items-center justify-between font-semibold">
              <span className="text-sm text-heading">5. Sourcing Proximity</span>
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[11px]">
                Weight: 10%
              </span>
            </div>
            <p className="text-secondary leading-relaxed font-normal">
              Hyperlocal proximity (&lt;150 km) cuts freight mileage. Long-haul interstate routes reduce this rating.
            </p>
          </div>

          {/* Grading Scale */}
          <div className="p-5 rounded-2xl bg-surface-sunken border border-line space-y-2">
            <div className="font-semibold text-sm text-heading">
              Grade Distribution
            </div>
            <div className="text-secondary space-y-1 font-normal">
              <div>• <strong className="text-heading">Grade A:</strong> 85–100 (Exceptional Choice)</div>
              <div>• <strong className="text-heading">Grade B:</strong> 70–84 (Very Good Sustainable)</div>
              <div>• <strong className="text-heading">Grade C:</strong> 55–69 (Moderate Impact)</div>
              <div>• <strong className="text-heading">Grade D:</strong> 40–54 (High Resource Intensity)</div>
              <div>• <strong className="text-heading">Grade E:</strong> 0–39 (Conventional / Petrochemical)</div>
            </div>
          </div>
        </div>
      </section>

      {/* Offline Intelligence & Resilience */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-line shadow-soft-sm space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary" />
            <h3 className="font-serif font-bold text-base sm:text-lg text-heading">
              Natural Language Intent Parser
            </h3>
          </div>
          <p className="text-xs text-secondary leading-relaxed font-normal">
            The parser in <code className="text-primary font-mono">src/lib/ecoAgent.js</code> analyzes freeform text for:
          </p>
          <ul className="text-xs text-secondary space-y-1.5 list-disc list-inside font-normal">
            <li><strong className="text-heading">Budget constraints:</strong> "under 1000", "below 500"</li>
            <li><strong className="text-heading">Categories:</strong> "kitchen", "stationery", "bags", "personal care"</li>
            <li><strong className="text-heading">Gifting intent:</strong> "gift for my teacher"</li>
            <li><strong className="text-heading">Packaging preferences:</strong> "plastic-free", "minimal packaging"</li>
            <li><strong className="text-heading">Cart actions:</strong> "review my cart", "audit my items"</li>
          </ul>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-line shadow-soft-sm space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-accent" />
            <h3 className="font-serif font-bold text-base sm:text-lg text-heading">
              Offline First with Optional LLM Layer
            </h3>
          </div>
          <p className="text-xs text-secondary leading-relaxed font-normal">
            Every feature works <strong className="text-heading">completely offline</strong> without internet connectivity.
            If a connection exists and a backend LLM responds at <code className="text-primary font-mono">/api/agent</code>, the agent
            phrases responses more conversationally; otherwise, it seamlessly returns instant rule-based matches.
          </p>
          <div className="p-3.5 rounded-2xl bg-surface-sunken border border-line text-primary text-[11px] font-mono shadow-soft-xs">
            try &#123; await fetch('/api/agent', &#123; signal &#125;) &#125; catch &#123; return localRuleEngine() &#125;
          </div>
        </div>
      </section>

      {/* Interactive Agent CTA */}
      <div className="text-center py-6">
        <button
          type="button"
          onClick={() => setIsAgentOpen(true)}
          className="px-8 py-3.5 rounded-full bg-primary hover:bg-primary-hover text-primary-contrast font-medium text-sm shadow-soft-sm transition active:scale-95 inline-flex items-center gap-2 cursor-pointer min-h-[44px]"
        >
          <Sparkles className="w-4 h-4 text-accent" />
          <span>Try Eco Agent</span>
        </button>
      </div>
    </div>
  );
}
