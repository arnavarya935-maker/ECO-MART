import React, { useState } from 'react';
import { Target, CheckCircle2, Plus, Sparkles } from 'lucide-react';

const INITIAL_GOALS = [
  { id: 'g1', title: 'Eliminate 15kg Single-Use Plastic', current: 11.2, target: 15, unit: 'kg', color: 'text-emerald-600', ringColor: '#10B981' },
  { id: 'g2', title: 'Avoid 50kg CO₂ Household Emissions', current: 38.5, target: 50, unit: 'kg', color: 'text-teal-600', ringColor: '#14B8A6' },
  { id: 'g3', title: 'Adopt 10 Sustainable Swaps', current: 7, target: 10, unit: 'swaps', color: 'text-cyan-600', ringColor: '#06B6D4' }
];

export default function EcoGoalsTracker() {
  const [goals, setGoals] = useState(INITIAL_GOALS);

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-md max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
            Personal Targets
          </span>
          <h3 className="text-xl font-black text-stone-900 dark:text-stone-100 mt-1">
            Eco Goals & Habit Rings
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-bold">
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
              className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex flex-col items-center text-center space-y-3"
            >
              {/* Circular SVG Progress Ring */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background Track */}
                  <path
                    className="text-stone-200 dark:text-stone-700"
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
                  <span className="text-sm font-black text-stone-900 dark:text-stone-100">
                    {progressPercent}%
                  </span>
                  <span className="text-[9px] text-stone-400 font-bold uppercase">Done</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 line-clamp-1">
                  {g.title}
                </h4>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  <strong>{g.current}</strong> / {g.target} {g.unit}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
