import React from 'react';
import ArchitectureDiagram from '../components/ArchitectureDiagram';
import { useCart } from '../context/CartContext';
import { Sparkles, ShieldCheck, Cpu, Database, RefreshCw, Layers, Award, Terminal } from 'lucide-react';

export default function HowItWorksPage() {
  const { setIsAgentOpen } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-full inline-block">
          Judge & Presentation Guide
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-stone-900 dark:text-stone-100">
          How EcoMart Agent Works
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
          An in-depth look at our transparent 0-100 Eco-Score Engine, offline-native NLP parser,
          and automated greener swap recommendation algorithms.
        </p>
      </div>

      {/* Interactive System Architecture Diagram */}
      <ArchitectureDiagram />

      {/* Detailed 5-Pillar Eco-Score Formula Section */}
      <section className="p-8 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full">
            Mathematical Engine
          </span>
          <h2 className="text-2xl font-black text-stone-900 dark:text-stone-100 mt-2">
            The 5-Pillar Eco-Score Formula (0–100)
          </h2>
          <p className="text-xs text-stone-500 max-w-2xl mt-1">
            Located in <code>src/lib/ecoScore.js</code>, our open algorithm calculates an objective score
            combining cradle-to-gate lifecycle parameters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Pillar 1 */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2">
            <div className="flex items-center justify-between font-bold">
              <span className="text-sm text-stone-900 dark:text-stone-100">1. Material Integrity</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                Weight: 30%
              </span>
            </div>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
              Rewards renewable, organic, and upcycled feedstocks (bamboo, khadi cotton, coconut shell, reclaimed teak).
              Heavily penalizes petrochemical plastics, virgin polyester, PVC, and melamine.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2">
            <div className="flex items-center justify-between font-bold">
              <span className="text-sm text-stone-900 dark:text-stone-100">2. Packaging Waste</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                Weight: 20%
              </span>
            </div>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
              <strong>Plastic-Free:</strong> 20 pts (Seed paper, compostable kraft).<br />
              <strong>Recycled:</strong> 14 pts (Post-consumer paper, infinitely recyclable tin).<br />
              <strong>Plastic:</strong> 3 pts (Shrink-wrap, bubble films).
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2">
            <div className="flex items-center justify-between font-bold">
              <span className="text-sm text-stone-900 dark:text-stone-100">3. Carbon Lifecycle</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                Weight: 25%
              </span>
            </div>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
              Evaluates cradle-to-gate CO₂e emissions per unit.
              ≤0.4 kg: 25 pts; ≤0.8 kg: 21 pts; ≤1.5 kg: 17 pts; ≤3.0 kg: 11 pts; &gt;3.0 kg: 4 pts.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2">
            <div className="flex items-center justify-between font-bold">
              <span className="text-sm text-stone-900 dark:text-stone-100">4. Third-Party Certifications</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                Weight: 15%
              </span>
            </div>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
              Awards points based on verifiable rigorous eco-standards:
              GOTS Organic, FSC Certified, Fair Trade, Zero Waste Assured, and PETA Vegan.
            </p>
          </div>

          {/* Pillar 5 */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2">
            <div className="flex items-center justify-between font-bold">
              <span className="text-sm text-stone-900 dark:text-stone-100">5. Sourcing Proximity</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                Weight: 10%
              </span>
            </div>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
              Hyperlocal proximity (&lt;150 km) cuts freight mileage. Long-haul interstate routes reduce this rating.
            </p>
          </div>

          {/* Grading Scale */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
            <div className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
              Grade Distribution
            </div>
            <div className="text-stone-700 dark:text-stone-300 space-y-1">
              <div>• <strong>Grade A:</strong> 85–100 (Exceptional Choice)</div>
              <div>• <strong>Grade B:</strong> 70–84 (Very Good Sustainable)</div>
              <div>• <strong>Grade C:</strong> 55–69 (Moderate Impact)</div>
              <div>• <strong>Grade D:</strong> 40–54 (High Resource Intensity)</div>
              <div>• <strong>Grade E:</strong> 0–39 (Conventional / Petrochemical)</div>
            </div>
          </div>
        </div>
      </section>

      {/* Offline Intelligence & Resilience */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              Natural Language Intent Parser
            </h3>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            The parser in <code>src/lib/ecoAgent.js</code> analyzes freeform text for:
          </p>
          <ul className="text-xs text-stone-500 dark:text-stone-400 space-y-1 list-disc list-inside">
            <li><strong>Budget constraints:</strong> "under 1000", "below 500"</li>
            <li><strong>Categories:</strong> "kitchen", "stationery", "bags", "personal care"</li>
            <li><strong>Gifting intent:</strong> "gift for my teacher"</li>
            <li><strong>Packaging preferences:</strong> "plastic-free", "zero plastic"</li>
            <li><strong>Cart actions:</strong> "review my cart", "audit my items"</li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              Offline First with Optional LLM Layer
            </h3>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            Every feature works <strong>completely offline</strong> without internet connectivity.
            If a connection exists and a backend LLM responds at <code>/api/agent</code>, the agent
            phrases responses more conversationally; otherwise, it seamlessly returns instant rule-based matches.
          </p>
          <div className="p-3 rounded-xl bg-stone-900 text-stone-300 text-[11px] font-mono">
            try &#123; await fetch('/api/agent', &#123; signal &#125;) &#125; catch &#123; return localRuleEngine() &#125;
          </div>
        </div>
      </section>

      {/* Presentation CTA */}
      <div className="text-center py-6">
        <button
          type="button"
          onClick={() => setIsAgentOpen(true)}
          className="px-8 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-xl transition active:scale-95 inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span>Launch Eco Agent Live Demo</span>
        </button>
      </div>
    </div>
  );
}
