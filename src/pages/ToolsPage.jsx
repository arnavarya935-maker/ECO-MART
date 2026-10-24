import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, Calculator, MapPin, Flame, Target, IndianRupee,
  Recycle, Calendar, BookOpen, Droplets, TreePine, ShoppingBag,
  FileSearch, Scale, Bug
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
import ClassImpactGarden from '../components/tools/ClassImpactGarden';
import BudgetBasketBuilder from '../components/tools/BudgetBasketBuilder';

const TOOL_TABS = [
  { id: 'basket', label: 'Budget Basket Builder', icon: ShoppingBag },
  { id: 'class-garden', label: 'Class Impact Garden', icon: TreePine },
  { id: 'quiz', label: 'Eco Quiz', icon: Sparkles },
  { id: 'carbon', label: 'Carbon Calculator', icon: Calculator },
  { id: 'map', label: 'Artisan Eco Map', icon: MapPin },
  { id: 'challenge', label: 'Daily Challenge', icon: Flame },
  { id: 'goals', label: 'Eco Goals', icon: Target },
  { id: 'savings', label: 'Savings vs Impact', icon: IndianRupee },
  { id: 'recycling', label: 'Recycling Guide', icon: Recycle },
  { id: 'seasonal', label: 'Seasonal Produce', icon: Calendar },
  { id: 'glossary', label: 'Eco Glossary', icon: BookOpen },
  { id: 'water', label: 'Water & Energy', icon: Droplets },
  { id: 'garden', label: 'Virtual Tree', icon: TreePine }
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
          Explore interactive tools designed to audit your habits, optimize budget baskets, calculate your carbon footprint, and decode zero-waste living.
        </p>
      </div>

      {/* Featured Flagship AI Tools: Cart Transformer, Greenwash Detective & Eco Check */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-primary/5 border border-primary/30 shadow-card flex flex-col justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="font-serif text-base font-bold text-heading">Cart Transformer</h2>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                  Star
                </span>
              </div>
              <p className="text-xs text-secondary mt-1">
                Paste ordinary shopping lists to get a sustainable, budget-respecting cart.
              </p>
            </div>
          </div>
          <Link
            to="/transform"
            className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast text-xs font-semibold text-center transition shadow-soft-sm cursor-pointer whitespace-nowrap"
          >
            Launch Transformer →
          </Link>
        </div>

        <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30 shadow-card flex flex-col justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <FileSearch className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="font-serif text-base font-bold text-heading">Greenwash Detective</h2>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Auditor
                </span>
              </div>
              <p className="text-xs text-secondary mt-1">
                Audit product packaging claims for vague buzzwords, missing proof & Trust Score 0-100.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('open-greenwashing-detective'))}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold text-center transition shadow-soft-sm cursor-pointer whitespace-nowrap"
          >
            Open Detective File →
          </button>
        </div>

        <div className="p-5 rounded-3xl bg-surface-raised border border-line shadow-card flex flex-col justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-surface-sunken border border-line flex items-center justify-center text-primary shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="font-serif text-base font-bold text-heading">Eco Check</h2>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary-subtle text-primary border border-primary/20">
                  Heuristic
                </span>
              </div>
              <p className="text-xs text-secondary mt-1">
                Paste external product text to score item lifecycle and discover greener alternatives.
              </p>
            </div>
          </div>
          <Link
            to="/eco-check"
            className="w-full py-2.5 px-4 rounded-xl bg-surface hover:bg-surface-sunken text-heading border border-line text-xs font-semibold text-center transition shadow-soft-sm cursor-pointer whitespace-nowrap active:scale-98"
          >
            Open Eco Check →
          </Link>
        </div>

        <div className="p-5 rounded-3xl bg-surface-raised border border-line shadow-card flex flex-col justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
              <Scale className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="font-serif text-base font-bold text-heading">Fairness Lab</h2>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Parity Audit
                </span>
              </div>
              <p className="text-xs text-secondary mt-1">
                Evaluate linguistic equity across Hindi, Hinglish, English, and student budget personas.
              </p>
            </div>
          </div>
          <Link
            to="/fairness"
            className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold text-center transition shadow-soft-sm cursor-pointer whitespace-nowrap"
          >
            Open Fairness Lab →
          </Link>
        </div>

        <div className="p-5 rounded-3xl bg-surface-raised border border-line shadow-card flex flex-col justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
              <Bug className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="font-serif text-base font-bold text-heading">Break the AI</h2>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                  Safety Sandbox
                </span>
              </div>
              <p className="text-xs text-secondary mt-1">
                Launch adversarial jailbreaks & fake certification attacks to test 5 ethical guardrails.
              </p>
            </div>
          </div>
          <Link
            to="/playground"
            className="w-full py-2.5 px-4 rounded-xl bg-red-600/90 hover:bg-red-600 text-white text-xs font-semibold text-center transition shadow-soft-sm cursor-pointer whitespace-nowrap"
          >
            Launch AI Sandbox →
          </Link>
        </div>
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
        {activeTab === 'class-garden' && <ClassImpactGarden />}
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
