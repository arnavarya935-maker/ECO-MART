import React, { useState } from 'react';
import { TreePine, Sprout, Sparkles, Droplets, HeartHandshake, Sun } from 'lucide-react';

const TREE_STAGES = [
  { level: 1, name: 'Sprouting Seedling', emoji: '🌱', minXp: 0, desc: 'A tiny organic neem seedling taking root in fertile vermicompost.' },
  { level: 2, name: 'Young Sapling', emoji: '🌿', minXp: 100, desc: 'Growing strong leaves, absorbing ambient CO₂ and binding rich topsoil.' },
  { level: 3, name: 'Flowering Shrub', emoji: '🪴', minXp: 300, desc: 'Flowering blossoms attract native bees and pollinators.' },
  { level: 4, name: 'Mature Canopy Tree', emoji: '🌳', minXp: 600, desc: 'Provides cooling micro-climate shade and shelters bird nests.' },
  { level: 5, name: 'Biosphere Ancient Grove', emoji: '🌲', minXp: 1000, desc: 'A regenerative sacred grove sequestering 48kg of CO₂ annually.' }
];

export default function PlantATreeGarden() {
  const [gardenXp, setGardenXp] = useState(() => {
    try {
      return Number(localStorage.getItem('eco_garden_xp') || 240);
    } catch {
      return 240;
    }
  });

  const [waterAnimation, setWaterAnimation] = useState(false);

  const handleWater = () => {
    const updated = gardenXp + 40;
    setGardenXp(updated);
    setWaterAnimation(true);
    setTimeout(() => setWaterAnimation(false), 1200);
    try {
      localStorage.setItem('eco_garden_xp', String(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  const currentStage = [...TREE_STAGES].reverse().find((s) => gardenXp >= s.minXp) || TREE_STAGES[0];
  const nextStage = TREE_STAGES.find((s) => s.minXp > gardenXp);
  const progressToNext = nextStage
    ? Math.round(((gardenXp - currentStage.minXp) / (nextStage.minXp - currentStage.minXp)) * 100)
    : 100;

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-md max-w-2xl mx-auto space-y-6 text-center">
      <div>
        <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
          Gamified Biosphere
        </span>
        <h3 className="text-2xl font-black text-stone-900 dark:text-stone-100 mt-2">
          Plant-a-Tree Virtual Grove
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 max-w-md mx-auto">
          Every sustainable swap, audited checkout, and daily challenge nourishes your tree!
        </p>
      </div>

      {/* Virtual Tree Canvas Visual */}
      <div className="p-8 rounded-3xl bg-gradient-to-b from-sky-50 via-emerald-50/50 to-stone-100 dark:from-stone-900 dark:via-stone-850 dark:to-stone-800 border border-emerald-300 dark:border-emerald-800 relative overflow-hidden">
        {/* Animated Sun */}
        <div className="absolute top-4 right-4 text-amber-400 animate-spin-slow">
          <Sun className="w-8 h-8 fill-amber-300" />
        </div>

        {/* Tree Stage Emoji Display */}
        <div className={`text-8xl transition-transform duration-300 my-4 ${waterAnimation ? 'scale-125' : 'scale-100'}`}>
          {currentStage.emoji}
        </div>

        <div className="space-y-1">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white dark:bg-stone-800 text-emerald-800 dark:text-emerald-300 shadow-2xs border border-emerald-200 dark:border-emerald-700">
            Stage {currentStage.level}: {currentStage.name}
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-300 max-w-sm mx-auto font-medium">
            {currentStage.desc}
          </p>
        </div>

        {/* Progress to Next Growth Stage */}
        {nextStage && (
          <div className="max-w-xs mx-auto mt-5 space-y-1">
            <div className="flex justify-between text-[11px] font-bold text-stone-500">
              <span>Next Growth: {nextStage.name}</span>
              <span>{gardenXp} / {nextStage.minXp} XP</span>
            </div>
            <div className="w-full h-2.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                style={{ width: `${progressToNext}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleWater}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md transition active:scale-95 cursor-pointer"
        >
          <Droplets className="w-4 h-4 text-cyan-300" />
          <span>Nourish Tree with Water (+40 XP)</span>
        </button>
      </div>
    </div>
  );
}
