import React, { useState } from 'react';
import { HelpCircle, Search, ShieldCheck } from 'lucide-react';
import Tooltip from '../ui/Tooltip';
import { GLOSSARY_TERMS, searchGlossary } from '../../lib/glossary';

export default function EcoGlossary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTerm, setSelectedTerm] = useState(GLOSSARY_TERMS[0]);

  const terms = searchGlossary(searchTerm);

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-line shadow-soft-sm max-w-3xl mx-auto space-y-6 text-left">
      <div className="border-b border-line pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full font-mono">
            Knowledge Base
          </span>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-heading mt-2">
            Eco Glossary &amp; Jargon Decoder
          </h3>
          <p className="text-xs sm:text-sm text-secondary mt-0.5">
            Hover over or click any term to demystify environmental science and certification acronyms.
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search eco terms..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-surface-sunken border border-line text-xs font-medium text-heading placeholder:text-muted focus:outline-2 focus:outline-focus"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {terms.map((item) => {
          const isSelected = selectedTerm?.term === item.term;
          return (
            <Tooltip key={item.term} content={item.shortDef} position="top">
              <button
                type="button"
                onClick={() => setSelectedTerm(item)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition flex items-center gap-1.5 cursor-pointer min-h-[40px] focus-visible:outline-2 focus-visible:outline-focus ${
                  isSelected
                    ? 'bg-primary text-primary-contrast shadow-soft-xs font-bold'
                    : 'bg-surface-sunken text-secondary border border-line hover:bg-surface-sunken/80'
                }`}
              >
                <span>{item.term}</span>
                <HelpCircle className="w-3.5 h-3.5 opacity-60" />
              </button>
            </Tooltip>
          );
        })}
      </div>

      {selectedTerm && (
        <div className="p-5 rounded-2xl bg-surface-sunken border border-line space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-serif font-bold text-heading">
              {selectedTerm.term}
            </h4>
            <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
              {selectedTerm.category}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-secondary leading-relaxed font-normal">
            {selectedTerm.fullDef}
          </p>

          <div className="pt-2 border-t border-line/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-muted">
            <div className="flex items-center gap-1.5 font-medium text-primary">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Standard: {selectedTerm.source}</span>
            </div>
            <span className="text-secondary">{selectedTerm.registryTip}</span>
          </div>
        </div>
      )}
    </div>
  );
}
