import React, { useState } from 'react';
import { Search, Sparkles, X } from 'lucide-react';
import { parseIntentSearch } from '../../lib/personaEngine';

export default function IntentSearchInput({ onApplyIntent, className = '' }) {
  const [query, setQuery] = useState('');
  const [intentState, setIntentState] = useState(() => parseIntentSearch(''));

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    const parsed = parseIntentSearch(val);
    setIntentState(parsed);
    onApplyIntent?.(parsed);
  };

  const handleClearChip = (chipText) => {
    // Remove the keyword from query
    let updated = query;
    if (chipText.startsWith('Max ₹')) {
      updated = updated.replace(/(?:under|below|less than|max|<|rs\.?|₹)\s*(\d{2,5})/i, '');
    } else if (chipText === 'Plastic-Free Only') {
      updated = updated.replace(/plastic-free|plastic free|zero plastic|no plastic/gi, '');
    } else if (chipText === 'Eco-Certified Only') {
      updated = updated.replace(/eco only|green only|organic only/gi, '');
    } else {
      updated = updated.replace(new RegExp(`\\b${chipText}\\b`, 'gi'), '');
    }
    updated = updated.replace(/\s+/g, ' ').trim();
    setQuery(updated);
    const parsed = parseIntentSearch(updated);
    setIntentState(parsed);
    onApplyIntent?.(parsed);
  };

  const handleClearAll = () => {
    setQuery('');
    const parsed = parseIntentSearch('');
    setIntentState(parsed);
    onApplyIntent?.(parsed);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Try: 'plastic-free kitchen under 800' or 'zero waste dental'..."
          className="w-full pl-10 pr-9 py-2.5 text-xs rounded-2xl bg-surface-raised border border-line text-heading placeholder:text-text-muted font-sans focus:outline-none focus:border-primary shadow-soft-xs"
        />
        {query && (
          <button
            type="button"
            onClick={handleClearAll}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-heading p-1 rounded-lg"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Transparent Recognized Chips Bar */}
      {intentState.recognizedChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 animate-fade-in text-left">
          <span className="text-[10px] font-mono text-primary font-semibold flex items-center gap-1 mr-1">
            <Sparkles className="w-3 h-3" />
            <span>Parsed Filters:</span>
          </span>
          {intentState.recognizedChips.map((chip, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-primary/10 text-primary border border-primary/20 shadow-soft-xs"
            >
              <span>{chip}</span>
              <button
                type="button"
                onClick={() => handleClearChip(chip)}
                className="hover:opacity-75 cursor-pointer ml-0.5"
                title={`Remove ${chip} filter`}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
