import React, { useState } from 'react';
import {
  Sparkles, Wrench, Calculator, MapPin, Flame, Target, IndianRupee,
  Recycle, Calendar, BookOpen, Droplets, TreePine
} from 'lucide-react';
import EcoQuiz from '../components/tools/EcoQuiz';
import CarbonFootprintCalculator from '../components/tools/CarbonFootprintCalculator';
import EcoMap from '../components/tools/EcoMap';
import DailyEcoChallenge from '../components/tools/DailyEcoChallenge';
import EcoGoalsTracker from '../components/tools/EcoGoalsTracker';
import SavingsImpactCalculator from '../components/tools/SavingsImpactCalculator';
import RecyclingGuide from '../components/tools/RecyclingGuide';
import SeasonalGuide from '../components/tools/SeasonalGuide';
import EcoGlossary from '../components/tools/EcoGlossary';
import WaterEnergyEstimator from '../components/tools/WaterEnergyEstimator';
import PlantATreeGarden from '../components/tools/PlantATreeGarden';

const TOOL_TABS = [
  { id: 'quiz', label: 'Eco Quiz', icon: Sparkles, feature: 'Feature 43' },
  { id: 'carbon', label: 'Carbon Calculator', icon: Calculator, feature: 'Feature 44' },
  { id: 'map', label: 'Artisan Eco Map', icon: MapPin, feature: 'Feature 45' },
  { id: 'challenge', label: 'Daily Challenge', icon: Flame, feature: 'Feature 46' },
  { id: 'goals', label: 'Eco Goals', icon: Target, feature: 'Feature 47' },
  { id: 'savings', label: 'Savings vs Impact', icon: IndianRupee, feature: 'Feature 49' },
  { id: 'recycling', label: 'Recycling Guide', icon: Recycle, feature: 'Feature 50' },
  { id: 'seasonal', label: 'Seasonal Produce', icon: Calendar, feature: 'Feature 51' },
  { id: 'glossary', label: 'Eco Glossary', icon: BookOpen, feature: 'Feature 52' },
  { id: 'water', label: 'Water & Energy', icon: Droplets, feature: 'Feature 53' },
  { id: 'garden', label: 'Virtual Tree', icon: TreePine, feature: 'Feature 54' }
];

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState('quiz');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-full inline-block">
          Interactive Sustainable Studio
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-stone-900 dark:text-stone-100">
          Tools, Calculators & Guides
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
          Explore 11 interactive tools designed to audit your habits, calculate your personal carbon delta, and decode circular zero-waste living.
        </p>
      </div>

      {/* Tool Selector Tabs Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-stone-200 dark:border-stone-800">
        {TOOL_TABS.map((t) => {
          const Icon = t.icon;
          const isSelected = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render Active Tool */}
      <div className="pt-2">
        {activeTab === 'quiz' && <EcoQuiz />}
        {activeTab === 'carbon' && <CarbonFootprintCalculator />}
        {activeTab === 'map' && <EcoMap />}
        {activeTab === 'challenge' && <DailyEcoChallenge />}
        {activeTab === 'goals' && <EcoGoalsTracker />}
        {activeTab === 'savings' && <SavingsImpactCalculator />}
        {activeTab === 'recycling' && <RecyclingGuide />}
        {activeTab === 'seasonal' && <SeasonalGuide />}
        {activeTab === 'glossary' && <EcoGlossary />}
        {activeTab === 'water' && <WaterEnergyEstimator />}
        {activeTab === 'garden' && <PlantATreeGarden />}
      </div>
    </div>
  );
}
