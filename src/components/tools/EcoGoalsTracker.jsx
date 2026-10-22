import React, { useState } from 'react';
import { Target } from 'lucide-react';

const INITIAL_GOALS = [
  { id: 'g1', title: 'Eliminate 15kg Single-Use Plastic', current: 11.2, target: 15, unit: 'kg', ringColor: 'var(--color-primary)' },
  { id: 'g2', title: 'Avoid 50kg CO₂ Household Emissions', current: 38.5, target: 50, unit: 'kg', ringColor: 'var(--color-accent)' },
  { id: 'g3', title: 'Adopt 10 Sustainable Swaps', current: 7, target: 10, unit: 'swaps', ringColor: 'var(--color-info)' }
];

export default function EcoGoalsTracker() {
  const [goals] = useState(INITIAL_GOALS);

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-line shadow-soft-sm max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
            Personal Targets
          </span>
          <h3 className="text-xl font-serif font-bold text-heading mt-2">
            Eco Goals & Habit Rings
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
          <Target className="w-4 h-4" />
          <span>Active Goals: {goals.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {goals.map((g) => {
          const progressPercent = Math.min(100, Math.round((g.current / g.target) * 100));
          const strokeDashoffset = 100 - progressPercent;

          return (
            <div
              key={g.id}
              className="p-5 rounded-2xl bg-surface-sunken border border-line flex flex-col items-center text-center space-y-3"
            >
              {/* Circular SVG Progress Ring */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background Track */}
                  <path
                    className="text-line"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Progress Arc */}
                  <path
                    style={{ stroke: g.ringColor }}
                    strokeDasharray="100, 100"
                    strokeDashoffset={strokeDashoffset}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-sm font-bold text-heading">
                    {progressPercent}%
                  </span>
                  <span className="text-[9px] text-muted font-semibold uppercase">Done</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-heading line-clamp-1">
                  {g.title}
                </h4>
                <div className="text-[11px] text-secondary mt-0.5">
                  <strong className="text-heading">{g.current}</strong> / {g.target} {g.unit}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
