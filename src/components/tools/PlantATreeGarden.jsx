import React, { useState } from 'react';
import { Droplets, Sun, Box, Image as ImageIcon } from 'lucide-react';
import Safe3D from '../3D/Safe3D';

const EcoForest3D = React.lazy(() => import('../3D/EcoForest3D'));

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
  const [viewMode, setViewMode] = useState('3d'); // '3d' | '2d'

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

  // Compute calculated eco score for 3D forest density
  const calculatedScore = Math.min(100, Math.round((gardenXp / 1000) * 100));
  const co2SavedEstimate = Number((gardenXp * 0.05).toFixed(1));

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-line shadow-soft-sm max-w-2xl mx-auto space-y-6 text-center">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-left">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
            Gamified Biosphere
          </span>
          <h3 className="text-2xl font-serif font-bold text-heading mt-2">
            Plant-a-Tree Virtual Grove
          </h3>
          <p className="text-xs sm:text-sm text-secondary mt-0.5 max-w-md">
            Every sustainable swap, completed checkout, and daily challenge nourishes your tree!
          </p>
        </div>

        {/* 3D vs 2D Mode Switcher */}
        <div className="inline-flex p-1 rounded-full bg-surface-sunken border border-line shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('3d')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition cursor-pointer min-h-[36px] ${
              viewMode === '3d'
                ? 'bg-primary text-primary-contrast shadow-soft-xs'
                : 'text-secondary hover:text-heading'
            }`}
          >
            <Box className="w-3.5 h-3.5 text-accent" />
            <span>3D Grove</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('2d')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition cursor-pointer min-h-[36px] ${
              viewMode === '2d'
                ? 'bg-primary text-primary-contrast shadow-soft-xs'
                : 'text-secondary hover:text-heading'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-accent" />
            <span>2D View</span>
          </button>
        </div>
      </div>

      {/* Virtual Tree Canvas Visual */}
      {viewMode === '3d' ? (
        <Safe3D
          autoLoad={true}
          fallbackTitle="Virtual Grove (2D Fallback)"
          fallbackEmoji={currentStage.emoji}
          fallbackSubtitle="3D virtual grove is paused under Reduce Effects or when WebGL is unavailable. Displaying 2D garden."
          loadingMessage="Growing 3D Virtual Biosphere Canopy..."
          className="h-80 sm:h-96 w-full rounded-3xl overflow-hidden"
        >
          <EcoForest3D score={calculatedScore} co2Saved={co2SavedEstimate} className="h-80 sm:h-96 w-full" />
        </Safe3D>
      ) : (
        <div className="p-8 rounded-3xl bg-surface-sunken border border-line relative overflow-hidden">
          {/* Animated Sun */}
          <div className="absolute top-4 right-4 text-warning">
            <Sun className="w-8 h-8 fill-warning/30" />
          </div>

          {/* Tree Stage Emoji Display */}
          <div className={`text-8xl transition-transform duration-300 my-4 ${waterAnimation ? 'scale-125' : 'scale-100'}`}>
            {currentStage.emoji}
          </div>

          <div className="space-y-1">
            <div className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-surface text-heading shadow-soft-xs border border-line">
              Stage {currentStage.level}: {currentStage.name}
            </div>
            <p className="text-xs text-secondary max-w-sm mx-auto font-medium">
              {currentStage.desc}
            </p>
          </div>
        </div>
      )}

      {/* Progress to Next Growth Stage */}
      {nextStage && (
        <div className="max-w-md mx-auto space-y-1.5">
          <div className="flex justify-between text-[11px] font-medium text-muted">
            <span>Next Stage: {nextStage.name}</span>
            <span>{gardenXp} / {nextStage.minXp} XP</span>
          </div>
          <div className="w-full h-2.5 bg-surface-sunken border border-line rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progressToNext}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleWater}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary-hover text-primary-contrast font-medium text-xs shadow-soft-sm transition active:scale-95 cursor-pointer min-h-[44px]"
        >
          <Droplets className="w-4 h-4 text-accent" />
          <span>Nourish Tree with Water (+40 XP)</span>
        </button>
      </div>
    </div>
  );
}
