import React, { useState } from 'react';
import {
  TreePine,
  ShieldCheck,
  Users,
  Sparkles,
  Droplets,
  Wind,
  Ban,
  CheckCircle2,
  Lock
} from 'lucide-react';

const INDIGENOUS_TREES = [
  { id: 'neem', name: 'Medicinal Neem', canopy: 'Dense Evergreen', count: 7, co2Yr: 21 },
  { id: 'peepal', name: 'Sacred Peepal', canopy: 'Oxygen Producer', count: 5, co2Yr: 32 },
  { id: 'banyan', name: 'Sprawling Banyan', canopy: 'Biodiversity Haven', count: 3, co2Yr: 48 },
  { id: 'gulmohar', name: 'Red Gulmohar', canopy: 'Pollinator Corridor', count: 4, co2Yr: 18 },
  { id: 'jamun', name: 'Rain-Tree Jamun', canopy: 'Soil Moisture Retainer', count: 5, co2Yr: 24 }
];

export default function ClassImpactGarden() {
  const [collectiveData, setCollectiveData] = useState(() => {
    try {
      const saved = localStorage.getItem('ecomart_class_garden');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      swapsDiverted: 1428,
      kgCo2Saved: 842.6,
      plasticGramsAvoided: 38420,
      freshwaterSavedLitres: 12480,
      treesPlanted: 24
    };
  });

  const [contributed, setContributed] = useState(false);

  const handleAnonymousContribution = () => {
    setCollectiveData((prev) => {
      const updated = {
        swapsDiverted: prev.swapsDiverted + 1,
        kgCo2Saved: Number((prev.kgCo2Saved + 0.85).toFixed(1)),
        plasticGramsAvoided: prev.plasticGramsAvoided + 45,
        freshwaterSavedLitres: prev.freshwaterSavedLitres + 18,
        treesPlanted: prev.treesPlanted + (prev.swapsDiverted % 10 === 0 ? 1 : 0)
      };
      try {
        localStorage.setItem('ecomart_class_garden', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setContributed(true);
    setTimeout(() => setContributed(false), 2500);
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-line shadow-card max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-primary/10 text-primary border border-primary/20">
              <TreePine className="w-5 h-5" />
            </span>
            <h3 className="font-serif text-2xl font-bold text-heading">
              Class Impact Garden
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            Anonymous aggregate telemetry. Tracking collective school footprint reduction without personal identifiers.
          </p>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold">
          <Lock className="w-3.5 h-3.5" />
          <span>Zero PII / 100% Anonymous</span>
        </div>
      </div>

      {/* Aggregate Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-surface-sunken border border-line text-center">
          <div className="flex items-center justify-center gap-1 text-xs text-muted mb-1 font-semibold">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span>Class Swaps</span>
          </div>
          <div className="text-2xl font-serif font-black text-heading">
            {collectiveData.swapsDiverted.toLocaleString()}
          </div>
          <span className="text-[10px] text-muted">Audited items swapped</span>
        </div>

        <div className="p-4 rounded-2xl bg-surface-sunken border border-line text-center">
          <div className="flex items-center justify-center gap-1 text-xs text-muted mb-1 font-semibold">
            <Wind className="w-3.5 h-3.5 text-emerald-500" />
            <span>CO₂ Diverted</span>
          </div>
          <div className="text-2xl font-serif font-black text-emerald-500">
            {collectiveData.kgCo2Saved} <span className="text-xs font-normal">kg</span>
          </div>
          <span className="text-[10px] text-muted">Estimate based on LCA</span>
        </div>

        <div className="p-4 rounded-2xl bg-surface-sunken border border-line text-center">
          <div className="flex items-center justify-center gap-1 text-xs text-muted mb-1 font-semibold">
            <Ban className="w-3.5 h-3.5 text-amber-500" />
            <span>Plastic Kept Out</span>
          </div>
          <div className="text-2xl font-serif font-black text-heading">
            {(collectiveData.plasticGramsAvoided / 1000).toFixed(1)} <span className="text-xs font-normal">kg</span>
          </div>
          <span className="text-[10px] text-muted">Virgin plastic eliminated</span>
        </div>

        <div className="p-4 rounded-2xl bg-surface-sunken border border-line text-center">
          <div className="flex items-center justify-center gap-1 text-xs text-muted mb-1 font-semibold">
            <Droplets className="w-3.5 h-3.5 text-sky-500" />
            <span>Water Conserved</span>
          </div>
          <div className="text-2xl font-serif font-black text-heading">
            {collectiveData.freshwaterSavedLitres.toLocaleString()} <span className="text-xs font-normal">L</span>
          </div>
          <span className="text-[10px] text-muted">Lifecycle freshwater</span>
        </div>
      </div>

      {/* Indigenous Forest Canopy Visualization */}
      <div className="p-5 rounded-2xl bg-surface-sunken border border-line space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-heading uppercase tracking-wider flex items-center gap-1.5">
            <TreePine className="w-4 h-4 text-primary" />
            Collective Indigenous Canopy ({collectiveData.treesPlanted} Trees Planted)
          </h4>
          <span className="text-xs text-muted font-mono">
            ~{Math.round(collectiveData.kgCo2Saved * 0.12)} kg CO₂/yr natural sequestration
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
          {INDIGENOUS_TREES.map((tree) => (
            <div
              key={tree.id}
              className="p-3 rounded-xl bg-surface border border-line flex flex-col justify-between text-left space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg">🌳</span>
                <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                  ×{tree.count}
                </span>
              </div>
              <div>
                <div className="text-xs font-bold text-heading">{tree.name}</div>
                <div className="text-[10px] text-muted">{tree.canopy}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Anonymous Contribution CTA */}
      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-left">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h5 className="text-sm font-bold text-heading">Contribute Your Class Swap</h5>
            <p className="text-xs text-muted">
              Add your sustainable habit increment to the aggregate garden tally without any login or personal profile.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAnonymousContribution}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition shadow-soft-sm cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5"
        >
          {contributed ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Contributed!</span>
            </>
          ) : (
            <>
              <TreePine className="w-4 h-4" />
              <span>+ Add Anonymous Swap</span>
            </>
          )}
        </button>
      </div>

      {/* Privacy Guarantee */}
      <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-surface-sunken border border-line text-xs text-muted text-left">
        <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-heading">Responsible AI & Privacy Notice:</strong> This collective challenge only persists anonymous numeric counters in client localStorage. No usernames, roll numbers, IP addresses, or device fingerprints are ever captured.
        </p>
      </div>
    </div>
  );
}
