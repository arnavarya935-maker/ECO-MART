import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, Info, X } from 'lucide-react';
import { GREENWASH_LEXICON } from '../../lib/transparencyEngine';

/**
 * GreenwashLexiconHighlighter
 * Parses product text and highlights regulated or vague marketing buzzwords inline.
 * Clicking a highlighted phrase opens an explanatory card.
 */
export default function GreenwashLexiconHighlighter({ text, className = '' }) {
  const [activeFlag, setActiveFlag] = useState(null);

  if (!text || typeof text !== 'string') {
    return <span className={className}>{text}</span>;
  }

  // Find all matches and their spans
  const matches = [];
  GREENWASH_LEXICON.forEach((lex) => {
    // Reset regex index
    const regex = new RegExp(lex.pattern.source, 'gi');
    let m;
    while ((m = regex.exec(text)) !== null) {
      matches.push({
        start: m.index,
        end: m.index + m[0].length,
        matchedText: m[0],
        rule: lex
      });
    }
  });

  if (matches.length === 0) {
    return <span className={className}>{text}</span>;
  }

  // Sort matches by start position and deduplicate overlaps
  matches.sort((a, b) => a.start - b.start);
  const nonOverlapping = [];
  let lastEnd = 0;
  for (const m of matches) {
    if (m.start >= lastEnd) {
      nonOverlapping.push(m);
      lastEnd = m.end;
    }
  }

  // Build segments
  const segments = [];
  let cursor = 0;
  nonOverlapping.forEach((m, idx) => {
    if (m.start > cursor) {
      segments.push({
        type: 'text',
        content: text.slice(cursor, m.start),
        key: `text-${cursor}`
      });
    }
    segments.push({
      type: 'flag',
      content: m.matchedText,
      rule: m.rule,
      key: `flag-${idx}-${m.start}`
    });
    cursor = m.end;
  });

  if (cursor < text.length) {
    segments.push({
      type: 'text',
      content: text.slice(cursor),
      key: `text-tail`
    });
  }

  return (
    <span className={`relative inline leading-relaxed ${className}`}>
      {segments.map((seg) => {
        if (seg.type === 'text') {
          return <span key={seg.key}>{seg.content}</span>;
        }

        const isCurrentActive = activeFlag?.key === seg.key;

        return (
          <span key={seg.key} className="relative inline-block mx-0.5">
            <button
              type="button"
              onClick={() => setActiveFlag(isCurrentActive ? null : { key: seg.key, ...seg })}
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md font-medium text-xs border transition cursor-pointer ${
                seg.rule.severity === 'high'
                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/25'
                  : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
              }`}
              title="Click to view why this claim is flagged"
            >
              <AlertTriangle className="w-3 h-3 text-amber-500" />
              <span className="underline decoration-dotted underline-offset-2">
                {seg.content}
              </span>
            </button>

            {/* Interactive Explanatory Popover */}
            {isCurrentActive && (
              <span
                className="absolute z-40 left-0 top-full mt-2 w-72 sm:w-80 p-3 rounded-2xl bg-surface-raised border border-line shadow-soft-lg text-left block text-xs space-y-2 animate-fade-in"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-line pb-1.5">
                  <span className="font-serif font-bold text-heading flex items-center gap-1.5 text-xs">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                    <span>Regulated Marketing Flag</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveFlag(null)}
                    className="p-1 rounded text-text-muted hover:text-heading cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-semibold">
                  {seg.rule.term} ({seg.rule.category})
                </div>

                <p className="text-[11px] text-text-secondary leading-snug">
                  {seg.rule.reason}
                </p>

                <div className="pt-1.5 border-t border-line flex items-center justify-between text-[10px] font-mono text-text-muted">
                  <span className="flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    {seg.rule.regulatoryStandard}
                  </span>
                  <span className="capitalize">{seg.rule.severity} audit risk</span>
                </div>
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}
