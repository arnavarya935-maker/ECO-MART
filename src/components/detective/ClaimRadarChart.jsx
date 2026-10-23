import React, { useState } from 'react';
import { Table, Radar as RadarIcon } from 'lucide-react';

const AXES = [
  { key: 'vague_wording', label: 'Wording Integrity', description: 'Absence of misleading buzzwords like "100% green"' },
  { key: 'verifiable_proof', label: 'Verifiable Proof', description: 'Independent scientific lifecycle data or lab proofs cited' },
  { key: 'certification', label: '3rd-Party Certs', description: 'Accredited registry standards (FSC, GOTS, USDA, ASTM)' },
  { key: 'specificity', label: 'Material Specificity', description: 'Quantified material percentages and lifecycle boundaries' },
  { key: 'comparison_basis', label: 'Comparison Basis', description: 'Honest comparative disclosures without false equivalence' }
];

export default function ClaimRadarChart({
  claimA = { label: 'Claim A', axes: {} },
  claimB = null // Optional comparison claim
}) {
  const [showTable, setShowTable] = useState(false);
  const [hoveredAxis, setHoveredAxis] = useState(null);

  const size = 300;
  const center = size / 2;
  const radius = 105;
  const totalAxes = AXES.length;

  // Convert polar coordinates to Cartesian
  const getCoordinates = (value, index) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const r = (Math.max(10, Math.min(100, value)) / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  // Generate polygon points string
  const getPolygonPoints = (axesValues) => {
    return AXES.map((axis, i) => {
      const val = axesValues[axis.key] || 50;
      const { x, y } = getCoordinates(val, i);
      return `${x},${y}`;
    }).join(' ');
  };

  const pointsA = getPolygonPoints(claimA.axes || {});
  const pointsB = claimB ? getPolygonPoints(claimB.axes || {}) : null;

  return (
    <div className="p-5 rounded-2xl bg-surface-sunken border border-line space-y-4">
      {/* Chart Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <div className="text-xs font-serif font-bold text-heading flex items-center gap-1.5">
            <RadarIcon className="w-3.5 h-3.5 text-primary" />
            5-Axis Environmental Claim Radar
          </div>
          <span className="text-[10px] font-mono text-muted">
            ISO 14021 Rigor Evaluation (Higher is Better)
          </span>
        </div>

        <button
          onClick={() => setShowTable(!showTable)}
          className="text-[11px] font-mono px-2.5 py-1 rounded-full border border-line bg-surface hover:border-primary/50 text-secondary transition flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-focus"
          aria-label="Toggle accessible tabular view for claim radar chart"
        >
          <Table className="w-3 h-3" />
          {showTable ? 'View Radar' : 'View Table'}
        </button>
      </div>

      {showTable ? (
        /* Accessible Table View */
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono" aria-label="Claim Radar 5-Axis Score Table">
            <thead>
              <tr className="border-b border-line text-[10px] uppercase text-muted">
                <th className="py-2 px-2">Evaluated Axis</th>
                <th className="py-2 px-2 text-emerald-400">{claimA.label || 'Claim A'} (/100)</th>
                {claimB && <th className="py-2 px-2 text-amber-400">{claimB.label || 'Claim B'} (/100)</th>}
                <th className="py-2 px-2">Criteria Focus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60 text-[11px]">
              {AXES.map((axis) => {
                const valA = claimA.axes?.[axis.key] || 50;
                const valB = claimB?.axes?.[axis.key];
                return (
                  <tr key={axis.key} className="hover:bg-surface/50">
                    <td className="py-2 px-2 font-semibold text-heading font-sans">{axis.label}</td>
                    <td className="py-2 px-2 text-emerald-400 font-bold">{valA}</td>
                    {claimB && <td className="py-2 px-2 text-amber-400 font-bold">{valB}</td>}
                    <td className="py-2 px-2 text-muted font-sans text-[10px]">{axis.description}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Pure SVG Radar Chart */
        <div className="relative flex flex-col items-center justify-center">
          <svg
            viewBox={`0 0 ${size} ${size}`}
            className="w-full max-w-[280px] h-[280px] select-none"
            role="img"
            aria-label={`Claim radar displaying 5 axes: Wording Integrity, Verifiable Proof, 3rd-Party Certs, Specificity, Comparison Basis.`}
          >
            {/* Concentric Web Rings (25%, 50%, 75%, 100%) */}
            {[0.25, 0.5, 0.75, 1.0].map((pct, ringIdx) => {
              const ringPoints = AXES.map((_, i) => {
                const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
                const r = radius * pct;
                return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
              }).join(' ');

              return (
                <polygon
                  key={ringIdx}
                  points={ringPoints}
                  fill="none"
                  stroke="currentColor"
                  className="text-line/60"
                  strokeWidth="1"
                  strokeDasharray={pct === 1 ? '' : '3 3'}
                />
              );
            })}

            {/* Radial Spokes */}
            {AXES.map((_, i) => {
              const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
              const x2 = center + radius * Math.cos(angle);
              const y2 = center + radius * Math.sin(angle);
              return (
                <line
                  key={i}
                  x1={center}
                  y1={center}
                  x2={x2}
                  y2={y2}
                  stroke="currentColor"
                  className="text-line"
                  strokeWidth="1"
                />
              );
            })}

            {/* Claim B Polygon Overlay (if comparing) */}
            {pointsB && (
              <polygon
                points={pointsB}
                fill="rgba(245, 158, 11, 0.22)"
                stroke="#F59E0B"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeDasharray="4 2"
              />
            )}

            {/* Claim A Polygon (Emerald) */}
            <polygon
              points={pointsA}
              fill="rgba(16, 185, 129, 0.28)"
              stroke="#10B981"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Axis Nodes & Interactive Dots */}
            {AXES.map((axis, i) => {
              const valA = claimA.axes?.[axis.key] || 50;
              const coordA = getCoordinates(valA, i);
              const isHovered = hoveredAxis === axis.key;

              return (
                <g key={axis.key}>
                  <circle
                    cx={coordA.x}
                    cy={coordA.y}
                    r={isHovered ? 5 : 3.5}
                    className="fill-surface stroke-primary cursor-pointer transition-all"
                    strokeWidth="2"
                    onMouseEnter={() => setHoveredAxis(axis.key)}
                    onMouseLeave={() => setHoveredAxis(null)}
                    tabIndex={0}
                    aria-label={`${axis.label}: ${valA}/100`}
                  />
                </g>
              );
            })}

            {/* Axis Labels outside perimeter */}
            {AXES.map((axis, i) => {
              const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
              const labelRadius = radius + 22;
              const lx = center + labelRadius * Math.cos(angle);
              const ly = center + labelRadius * Math.sin(angle);

              return (
                <text
                  key={axis.key}
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={`text-[9px] font-mono select-none transition-colors ${
                    hoveredAxis === axis.key ? 'fill-primary font-bold' : 'fill-text-secondary'
                  }`}
                >
                  {axis.label.split(' ')[0]}
                </text>
              );
            })}
          </svg>

          {/* Radar Legend */}
          <div className="flex items-center gap-4 text-[10px] font-mono pt-1">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/80 border border-emerald-400 inline-block" />
              {claimA.label || 'Analyzed Claim'}
            </span>
            {claimB && (
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/80 border border-amber-400 inline-block" />
                {claimB.label || 'Benchmark Comparison'}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
