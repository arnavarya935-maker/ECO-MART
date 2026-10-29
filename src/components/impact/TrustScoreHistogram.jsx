import React, { useState, useMemo } from 'react';
import { Table, Info } from 'lucide-react';

const CALIBRATED_AUDIT_BASELINE = [
  { claim: '100% natural pure ocean bottle', score: 18, bucket: '0-20' },
  { claim: 'Completely chemical-free eco packaging', score: 24, bucket: '21-40' },
  { claim: 'Green earth zero footprint bag', score: 35, bucket: '21-40' },
  { claim: 'Biodegradable bamboo cutlery ASTM D6400', score: 92, bucket: '81-100' },
  { claim: 'GOTS certified organic cotton tote', score: 88, bucket: '81-100' },
  { claim: 'FSC certified unbleached kraft paper', score: 85, bucket: '81-100' },
  { claim: 'Made with recycled content without percentage', score: 52, bucket: '41-60' },
  { claim: 'Plant-based wax with soy blend', score: 68, bucket: '61-80' },
  { claim: 'Clean energy manufactured toothbrush', score: 72, bucket: '61-80' },
  { claim: 'Zero-plastic packaging claim with PE window', score: 38, bucket: '21-40' }
];

export default function TrustScoreHistogram() {
  const [showTable, setShowTable] = useState(false);
  const [hoveredBucket, setHoveredBucket] = useState(null);

  // Group into 5 calibrated audit bins
  const buckets = useMemo(() => {
    // Read session audits if present
    let sessionAudits = [];
    try {
      const stored = localStorage.getItem('ecomart_gw_audits');
      if (stored) sessionAudits = JSON.parse(stored);
    } catch {}

    const all = [...CALIBRATED_AUDIT_BASELINE, ...sessionAudits];

    const bins = [
      {
        range: '0–20',
        label: 'Severe Greenwashing Risk',
        color: 'bg-red-500/80 hover:bg-red-500',
        border: 'border-red-500/30',
        textColor: 'text-red-400',
        count: 0,
        claims: []
      },
      {
        range: '21–40',
        label: 'High Misleading Risk',
        color: 'bg-amber-500/80 hover:bg-amber-500',
        border: 'border-amber-500/30',
        textColor: 'text-amber-400',
        count: 0,
        claims: []
      },
      {
        range: '41–60',
        label: 'Unverified / Vague',
        color: 'bg-yellow-500/80 hover:bg-yellow-500',
        border: 'border-yellow-500/30',
        textColor: 'text-yellow-400',
        count: 0,
        claims: []
      },
      {
        range: '61–80',
        label: 'Plausible Standards',
        color: 'bg-teal-500/80 hover:bg-teal-500',
        border: 'border-teal-500/30',
        textColor: 'text-teal-400',
        count: 0,
        claims: []
      },
      {
        range: '81–100',
        label: 'High Trust',
        color: 'bg-emerald-500/80 hover:bg-emerald-500',
        border: 'border-emerald-500/30',
        textColor: 'text-emerald-400',
        count: 0,
        claims: []
      }
    ];

    all.forEach((item) => {
      const s = Number(item.score || item.trust_score || 50);
      let idx = 0;
      if (s > 80) idx = 4;
      else if (s > 60) idx = 3;
      else if (s > 40) idx = 2;
      else if (s > 20) idx = 1;
      bins[idx].count++;
      bins[idx].claims.push(item.claim || item.text || 'Sample claim');
    });

    const total = all.length || 1;
    return bins.map((b) => ({
      ...b,
      percentage: Math.round((b.count / total) * 100)
    }));
  }, []);

  const totalAudits = buckets.reduce((acc, b) => acc + b.count, 0);
  const maxCount = Math.max(...buckets.map((b) => b.count), 1);

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-line shadow-card space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
              Integrity Telemetry
            </span>
            <span className="text-[10px] font-mono text-muted uppercase">
              {totalAudits} Total Packaging Claims Checked
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-heading">
            Greenwashing Trust Score Distribution
          </h3>
          <p className="text-xs text-secondary">
            Histogram of trust scores evaluated by our Greenwashing Detective simple rules.
          </p>
        </div>

        <button
          onClick={() => setShowTable(!showTable)}
          className="text-xs font-mono px-3.5 py-1.5 rounded-full border border-line bg-surface-sunken hover:border-primary/50 text-secondary transition-colors flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-focus"
          aria-label="Toggle accessible table view for greenwashing score histogram"
        >
          <Table className="w-3.5 h-3.5" />
          {showTable ? 'View as Chart' : 'View as Table'}
        </button>
      </div>

      {/* Assumptions Label */}
      <div className="flex items-center gap-2 text-[11px] text-muted font-mono bg-surface-sunken/60 px-3 py-1.5 rounded-xl border border-line/40">
        <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span><strong>Sample Dataset & Session Logs:</strong> Aggregates session check results with sample benchmark data.</span>
      </div>

      {showTable ? (
        /* Accessible Table View */
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-secondary border-collapse" aria-label="Trust Score Distribution Data Table">
            <thead>
              <tr className="border-b border-line text-[11px] font-mono uppercase text-muted">
                <th className="py-2.5 px-3">Score Range</th>
                <th className="py-2.5 px-3">Integrity Verdict</th>
                <th className="py-2.5 px-3">Audit Count</th>
                <th className="py-2.5 px-3">Frequency (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60 font-mono">
              {buckets.map((b) => (
                <tr key={b.range} className="hover:bg-surface-sunken/50 transition-colors">
                  <td className={`py-2.5 px-3 font-bold ${b.textColor}`}>{b.range}</td>
                  <td className="py-2.5 px-3 font-sans font-medium text-heading">{b.label}</td>
                  <td className="py-2.5 px-3">{b.count}</td>
                  <td className="py-2.5 px-3">{b.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Accessible SVG / CSS Histogram Bars */
        <div className="space-y-4">
          <div className="grid grid-cols-5 gap-3 pt-4">
            {buckets.map((b, i) => {
              const heightPct = Math.max(12, Math.round((b.count / maxCount) * 100));
              const isHovered = hoveredBucket === i;

              return (
                <div
                  key={b.range}
                  onMouseEnter={() => setHoveredBucket(i)}
                  onMouseLeave={() => setHoveredBucket(null)}
                  className={`p-3.5 rounded-2xl border flex flex-col items-center justify-end h-56 transition-all text-center relative ${
                    isHovered
                      ? 'bg-surface-raised border-primary/60 shadow-soft-sm'
                      : 'bg-surface-sunken border-line'
                  }`}
                  tabIndex={0}
                  aria-label={`${b.label} (${b.range}): ${b.count} audits, ${b.percentage}% of claims.`}
                >
                  {/* Tooltip on top */}
                  <div className="font-mono text-xs font-bold text-heading mb-2">
                    {b.count}
                    <span className="text-[10px] text-muted ml-0.5">({b.percentage}%)</span>
                  </div>

                  {/* Histogram Bar Column */}
                  <div className="w-full h-32 bg-surface-raised rounded-xl p-1 flex items-end overflow-hidden border border-line/40">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-lg transition-all duration-500 ${b.color}`}
                    />
                  </div>

                  {/* Bin Range & Label */}
                  <div className="mt-3 space-y-0.5">
                    <span className={`text-xs font-mono font-bold block ${b.textColor}`}>
                      {b.range}
                    </span>
                    <span className="text-[10px] text-muted line-clamp-1 block">
                      {b.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-muted px-2 pt-2 border-t border-line/50">
            <span>0 = Deceptive / Fictitious Claims</span>
            <span>100 = Rigorous 3rd-Party Lab Certified</span>
          </div>
        </div>
      )}
    </div>
  );
}
