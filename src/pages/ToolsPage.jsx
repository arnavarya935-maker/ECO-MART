import React, { useState } from 'react';
import {
  Sparkles, Calculator, MapPin, Flame, Target, IndianRupee,
  Recycle, Calendar, BookOpen, Droplets, TreePine, ShoppingBag
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
import BudgetBasketBuilder from '../components/tools/BudgetBasketBuilder';

const TOOL_TABS = [
  { id: 'basket', label: 'Budget Basket Builder', icon: ShoppingBag, feature: 'Feature 22' },
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
  const [activeTab, setActiveTab] = useState('basket');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in pb-24">
      {/* Top Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-semibold tracking-widest uppercase text-primary bg-primary/10 border border-primary/20 px-3.5 py-1 rounded-full inline-block">
          Interactive Sustainable Studio
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-heading tracking-tight">
          Tools, Calculators & Guides
        </h1>
        <p className="text-sm sm:text-base text-secondary leading-relaxed max-w-xl mx-auto">
          Explore 12 interactive tools designed to audit your habits, optimize budget baskets, calculate your carbon footprint, and decode zero-waste living.
        </p>
      </div>

      {/* Tool Selector Tabs Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-line scrollbar-none">
        {TOOL_TABS.map((t) => {
          const Icon = t.icon;
          const isSelected = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer min-h-[44px] focus-visible:outline-2 focus-visible:outline-focus ${
                isSelected
                  ? 'bg-primary text-primary-contrast shadow-soft-sm'
                  : 'bg-surface-sunken text-secondary hover:bg-surface hover:text-heading border border-line'
              }`}
            >
              <Icon className="w-4 h-4 text-accent" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render Active Tool */}
      <div className="pt-2">
        {activeTab === 'basket' && <BudgetBasketBuilder />}
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
