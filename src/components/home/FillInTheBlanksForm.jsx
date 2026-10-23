import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Bot } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useT } from '../../context/I18nContext';

const QUICK_PROMPTS = [
  {
    label: 'Bathroom Kit',
    query: 'bamboo toothbrush, neem shampoo bar, organic cotton towel',
    budget: '850',
  },
  {
    label: 'Kitchen Swaps',
    query: 'beeswax food wraps, coconut coir scrub, bamboo cutlery set',
    budget: '1400',
  },
  {
    label: 'Student Essentials',
    query: 'recycled seed paper notebook, metal fountain pen, jute tote',
    budget: '600',
  },
];

export default function FillInTheBlanksForm() {
  const [name, setName] = useState('Aarav');
  const [query, setQuery] = useState('bamboo toothbrush, beeswax food wraps, plastic-free dish soap');
  const [budget, setBudget] = useState('1200');

  const { setIsAgentOpen } = useCart();
  const navigate = useNavigate();
  const { lang } = useT();

  const handleTransformList = (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    navigate('/transform', {
      state: {
        prefilledList: query,
        budget: budget.trim(),
        userName: name.trim(),
      },
    });
  };

  const handleOpenAgent = () => {
    setIsAgentOpen(true);
  };

  const applyPrompt = (prompt) => {
    setQuery(prompt.query);
    setBudget(prompt.budget);
  };

  return (
    <section
      id="quick-query"
      aria-labelledby="query-heading"
      className="relative bg-surface py-20 md:py-28 border-b border-line"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        {/* Eyebrow */}
        <div className="font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-primary flex items-center gap-2">
          <span>04</span>
          <span className="w-4 h-px bg-primary/40" />
          <span>NATURAL LANGUAGE QUERY</span>
        </div>

        <div className="mt-4">
          <h2
            id="query-heading"
            className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-heading text-balance"
          >
            State your intent. The agent does the rest.
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed max-w-2xl">
            Type your shopping list conversationally. Our offline algorithm calculates item functional equivalence, verifies plastic elimination, and optimizes for your budget ceiling.
          </p>
        </div>

        {/* Fill-in-the-blanks Sentence Form Card */}
        <div className="mt-10 rounded-2xl border border-line bg-surface-raised/70 p-6 sm:p-10 lg:p-12 shadow-soft-lg backdrop-blur-md">
          <form onSubmit={handleTransformList} className="space-y-8">
            <div className="text-xl sm:text-2xl lg:text-3xl font-sans font-medium text-heading leading-[1.8] sm:leading-[2]">
              <span>Hi, I'm </span>
              <label htmlFor="fill-name" className="sr-only">
                Your Name
              </label>
              <input
                id="fill-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="cf-input min-w-[120px] max-w-[200px] text-primary font-semibold text-center border-b-2 border-primary/50 focus:border-primary focus:outline-none bg-surface-sunken/60 px-3 py-1 rounded-md mx-1"
              />
              <span> and I want </span>
              <label htmlFor="fill-query" className="sr-only">
                Items or shopping list
              </label>
              <input
                id="fill-query"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="items you need..."
                className="cf-input min-w-[240px] sm:min-w-[360px] max-w-full text-primary font-semibold border-b-2 border-primary/50 focus:border-primary focus:outline-none bg-surface-sunken/60 px-3 py-1 rounded-md mx-1"
              />
              <span> under ₹</span>
              <label htmlFor="fill-budget" className="sr-only">
                Budget limit in rupees
              </label>
              <input
                id="fill-budget"
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="1000"
                className="cf-input min-w-[90px] max-w-[140px] text-primary font-semibold text-center border-b-2 border-primary/50 focus:border-primary focus:outline-none bg-surface-sunken/60 px-3 py-1 rounded-md mx-1"
              />
              <span>.</span>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] uppercase tracking-wider text-text-muted mr-1">
                Preset scenarios:
              </span>
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => applyPrompt(p)}
                  className="px-3 py-1 rounded-full bg-surface-sunken hover:bg-surface border border-line hover:border-line-subtle text-text-secondary text-xs font-mono transition-colors cursor-pointer"
                >
                  {p.label} (₹{p.budget})
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-line/60 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                className="liquid-pill liquid-pill-emerald group cursor-pointer"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                <span>Audit & Transform List</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={handleOpenAgent}
                className="liquid-pill liquid-pill-dark group cursor-pointer"
              >
                <Bot className="w-4 h-4 mr-2 text-primary" />
                <span>{lang === 'hi' ? 'सीधे एजेंट से पूछें' : 'Consult Agent Directly'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
