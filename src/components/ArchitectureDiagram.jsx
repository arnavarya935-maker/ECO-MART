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
      desc: 'Offline rule-based parsing extracts budget, category, packaging constraints, and intent without external latency.'
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
    <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-sm space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full">
            System Architecture
          </span>
          <span className="text-xs text-stone-500">Presentation Ready</span>
        </div>
        <h3 className="text-2xl font-black text-stone-900 dark:text-stone-100 mt-1">
          How EcoMart Agent Works
        </h3>
        <p className="text-sm text-stone-500 max-w-xl">
          An offline-first, mathematically transparent system combining multi-attribute lifecycle assessment with proactive swapping logic.
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
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 hover:border-emerald-300'
            }`}
          >
            <div>
              <div className="text-3xl mb-2">{node.icon}</div>
              <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100">
                {node.title}
              </h4>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-2 leading-relaxed">
              {node.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Interactive Detail Box */}
      <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Offline Integrity & Optional AI Layer
          </div>
          <div className="text-sm text-stone-700 dark:text-stone-300">
            EcoMart requires <strong>zero internet connectivity</strong> for core scoring, NLP parsing, and swap logic.
            If a connection exists, it asynchronously calls <code>/api/agent</code> behind a protected <code>try/catch</code> block without ever blocking the UI.
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800">
            100% Offline Capable
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-xs font-bold border border-teal-300 dark:border-teal-800">
            0ms Search Latency
          </span>
        </div>
      </div>
    </div>
  );
}
