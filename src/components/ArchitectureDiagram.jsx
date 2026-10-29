import React, { useState } from 'react';

export default function ArchitectureDiagram() {
  const [activeNode, setActiveNode] = useState('agent');

  const nodes = [
    {
      id: 'input',
      title: '1. User Actions & Natural Language',
      icon: '💬',
      desc: 'Freeform search queries (e.g. "gift under 1000 for teacher") or Cart Add events.'
    },
    {
      id: 'score-engine',
      title: '2. 5-Pillar Eco-Score Engine',
      icon: '⚖️',
      desc: 'Calculates 0-100 score from Material (30%), Packaging (20%), Carbon (25%), Certifications (15%), Distance (10%).'
    },
    {
      id: 'nlp-parser',
      title: '3. Local Intent & NLP Parser',
      icon: '🧠',
      desc: 'Deterministic rule-based parsing extracts budget, category, packaging constraints, and intent without external latency.'
    },
    {
      id: 'swap-engine',
      title: '4. Swap Recommendation Engine',
      icon: '🔄',
      desc: 'Evaluates lifecycle footprints of cart items, suggests 1-tap greener upgrades, and details tangible delta savings.'
    },
    {
      id: 'impact-ledger',
      title: '5. Real-Time Planetary Impact Ledger',
      icon: '🌍',
      desc: 'Aggregates live CO2 kg, plastic grams, and water litres saved vs conventional equivalents with plain-language badges.'
    }
  ];

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-surface border border-line shadow-soft-sm space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
            System Architecture
          </span>
          <span className="text-xs text-muted font-medium">Presentation Ready</span>
        </div>
        <h3 className="text-2xl font-serif font-bold text-heading mt-1">
          How Eco Sense Works
        </h3>
        <p className="text-sm text-secondary max-w-xl">
          A mathematically transparent system combining multi-attribute lifecycle assessment with proactive swapping logic.
        </p>
      </div>

      {/* Visual Pipeline Flow */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
        {nodes.map((node) => (
          <div
            key={node.id}
            onClick={() => setActiveNode(node.id)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
              activeNode === node.id
                ? 'bg-primary/10 border-primary shadow-soft-xs ring-2 ring-primary/20'
                : 'bg-surface-sunken border-line hover:border-primary/40'
            }`}
          >
            <div>
              <div className="text-3xl mb-2">{node.icon}</div>
              <h4 className="font-semibold text-xs text-heading">
                {node.title}
              </h4>
            </div>
            <p className="text-[11px] text-secondary mt-2 leading-relaxed font-normal">
              {node.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Interactive Detail Box */}
      <div className="p-5 rounded-2xl bg-surface-sunken border border-line flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">
            Connected AI & Verification Engine
          </div>
          <div className="text-xs sm:text-sm text-secondary leading-relaxed font-normal">
            Eco Sense uses deterministic eco-scoring formulas for core calculations. For conversational advice and reasoning, it connects to Gemini via a secure server proxy.
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
            Connected AI Active
          </span>
          <span className="px-3 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-medium border border-secondary/20">
            0ms Search Latency
          </span>
        </div>
      </div>
    </div>
  );
}
