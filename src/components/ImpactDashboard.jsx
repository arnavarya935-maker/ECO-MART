import React from 'react';
import { Wind, Ban, Droplets, Car, Coffee, Trees, Award, Sparkles, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import AnimatedCounter from './AnimatedCounter';

export default function ImpactDashboard({ showHeader = true, compact = false }) {
  const { impact, setIsAgentOpen, cartItems } = useCart();

  const {
    totalItems,
    co2Saved,
    plasticAvoided,
    waterSaved,
    averageEcoScore,
    averageGrade,
    ecoPoints,
    equivalents,
    badges
  } = impact;

  const allPossibleBadges = [
    {
      id: 'starter',
      name: 'Green Starter',
      description: 'Cart contains conscious eco-rated items (Score ≥ 50)',
      icon: '🌱',
      unlocked: badges.some((b) => b.id === 'starter')
    },
    {
      id: 'protector',
      name: 'Planet Protector',
      description: 'Cart achieves average Grade B or higher (Score ≥ 75)',
      icon: '🛡️',
      unlocked: badges.some((b) => b.id === 'protector')
    },
    {
      id: 'champion',
      name: 'Eco Champion',
      description: 'Exceptional Grade A average with 100% plastic-free packaging',
      icon: '👑',
      unlocked: badges.some((b) => b.id === 'champion')
    }
  ];

  return (
    <div className="bg-white dark:bg-stone-850 rounded-3xl border border-stone-200/90 dark:border-stone-800 p-6 md:p-8 shadow-sm">
      {showHeader && (
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-stone-200/80 dark:border-stone-800 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-900 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-300/50">
                Live Environmental Ledger
              </span>
              <span className="text-xs font-bold text-stone-700 dark:text-stone-300">Real-Time Cart Impact</span>
            </div>
            <h2 className="text-2xl font-black text-[#0B3B2C] dark:text-stone-100 mt-1">
              Your Collective Planetary Impact
            </h2>
            <p className="text-sm text-stone-700 dark:text-stone-300 font-medium">
              Measuring the tangible footprint saved versus conventional shopping alternatives.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-right">
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-400">
                Eco Points Earned
              </div>
              <div className="text-xl font-black text-amber-900 dark:text-amber-300 flex items-center justify-end gap-1">
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>
                  <AnimatedCounter value={ecoPoints} decimals={0} /> pts
                </span>
              </div>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-right">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-400">
                Cart Eco Rating
              </div>
              <div className="text-xl font-black text-emerald-900 dark:text-emerald-300">
                Grade {averageGrade} ({averageEcoScore}/100)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Living Ecological Tier Tracker (Crisp, High-Precision Dashboard Indicator) */}
      <div className="my-6 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50/40 to-white dark:from-[#0D241C] dark:via-[#091D16] dark:to-[#0D1F18] border border-emerald-300/60 dark:border-emerald-800/60 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white text-xl shadow-md shadow-emerald-900/10">
              {averageEcoScore >= 85 ? '🌲' : averageEcoScore >= 70 ? '🌿' : averageEcoScore >= 50 ? '🌱' : '🪴'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#0B3B2C] dark:text-emerald-300">
                  Cart Biosphere Health Tier
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40">
                  {averageGrade === 'A' ? 'Thriving Canopy' : averageGrade === 'B' ? 'Growing Grove' : averageGrade === 'C' ? 'Sprouting' : 'Conscious Seedling'}
                </span>
              </div>
              <p className="text-xs text-stone-700 dark:text-stone-300 font-medium mt-0.5">
                {totalItems > 0
                  ? `Your active cart achieves a collective Eco-Score of ${averageEcoScore}/100 with Grade ${averageGrade}.`
                  : 'Add items or swap conventional products to begin cultivating your verified impact savings.'}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <div className="text-xs font-bold text-stone-600 dark:text-stone-400">
              Next Tier: {averageEcoScore >= 85 ? 'Maximum Grade A Achieved' : 'Grade A (Score ≥ 85)'}
            </div>
            <div className="text-sm font-black text-[#0B3B2C] dark:text-emerald-300">
              {averageEcoScore >= 85 ? '🎉 Peak Planetary Standard' : `${Math.max(0, 85 - averageEcoScore)} pts to Gold Standard`}
            </div>
          </div>
        </div>

        {/* Precision Progress Bar */}
        <div className="w-full bg-stone-200/80 dark:bg-stone-800 rounded-full h-3 overflow-hidden p-0.5 shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 transition-all duration-700 shadow-sm"
            style={{ width: `${Math.max(8, Math.min(100, averageEcoScore))}%` }}
          />
        </div>
      </div>

      {/* Impact Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {/* Metric 1: CO2 Saved */}
        <div className="relative p-6 rounded-3xl bg-white dark:bg-[#0D1F18] border border-stone-200/90 dark:border-[#1B382D] shadow-[0_4px_16px_-2px_rgba(11,59,44,0.06)] overflow-hidden transition-all hover:shadow-lg">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-sky-400 to-sky-600" />
          <div className="flex items-center justify-between mb-3 pt-1">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-900 dark:text-sky-300">
              CO₂ Lifecycle Saved
            </span>
            <div className="p-2.5 rounded-2xl bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 shadow-xs">
              <Wind className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-stone-900 dark:text-stone-100">
            <AnimatedCounter value={co2Saved} decimals={2} />{' '}
            <span className="text-sm font-extrabold text-stone-700 dark:text-stone-300">kg CO₂e</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-sky-900 dark:text-sky-200 font-bold bg-sky-50 dark:bg-sky-950/50 p-2.5 rounded-xl border border-sky-200/70 dark:border-sky-800/60">
            <Car className="w-4 h-4 text-sky-600 shrink-0" />
            <span>≈ <AnimatedCounter value={equivalents.carKm} decimals={1} /> km car driving offset</span>
          </div>
        </div>

        {/* Metric 2: Plastic Avoided */}
        <div className="relative p-6 rounded-3xl bg-white dark:bg-[#0D1F18] border border-stone-200/90 dark:border-[#1B382D] shadow-[0_4px_16px_-2px_rgba(11,59,44,0.06)] overflow-hidden transition-all hover:shadow-lg">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-rose-400 to-rose-600" />
          <div className="flex items-center justify-between mb-3 pt-1">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-900 dark:text-rose-300">
              Plastic Waste Avoided
            </span>
            <div className="p-2.5 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 shadow-xs">
              <Ban className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-stone-900 dark:text-stone-100">
            <AnimatedCounter value={plasticAvoided} decimals={0} />{' '}
            <span className="text-sm font-extrabold text-stone-700 dark:text-stone-300">grams</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-rose-900 dark:text-rose-200 font-bold bg-rose-50 dark:bg-rose-950/50 p-2.5 rounded-xl border border-rose-200/70 dark:border-rose-800/60">
            <Coffee className="w-4 h-4 text-rose-600 shrink-0" />
            <span>≈ <AnimatedCounter value={equivalents.plasticBottles} decimals={0} /> single-use bottles diverted</span>
          </div>
        </div>

        {/* Metric 3: Water Saved */}
        <div className="relative p-6 rounded-3xl bg-white dark:bg-[#0D1F18] border border-stone-200/90 dark:border-[#1B382D] shadow-[0_4px_16px_-2px_rgba(11,59,44,0.06)] overflow-hidden transition-all hover:shadow-lg">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-teal-400 to-emerald-600" />
          <div className="flex items-center justify-between mb-3 pt-1">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-900 dark:text-teal-300">
              Freshwater Conserved
            </span>
            <div className="p-2.5 rounded-2xl bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 shadow-xs">
              <Droplets className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-stone-900 dark:text-stone-100">
            <AnimatedCounter value={waterSaved} decimals={0} />{' '}
            <span className="text-sm font-extrabold text-stone-700 dark:text-stone-300">Litres</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-teal-900 dark:text-teal-200 font-bold bg-teal-50 dark:bg-teal-950/50 p-2.5 rounded-xl border border-teal-200/70 dark:border-teal-800/60">
            <Trees className="w-4 h-4 text-teal-600 shrink-0" />
            <span>≈ <AnimatedCounter value={equivalents.daysDrinkingWater} decimals={0} /> days of human drinking water</span>
          </div>
        </div>
      </div>

      {/* Badges and Gamification */}
      <div className="pt-5 border-t border-stone-200 dark:border-stone-800">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-stone-600 dark:text-stone-300">
            Sustainability Milestones
          </h4>
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
            {allPossibleBadges.filter(b => b.unlocked).length} of {allPossibleBadges.length} Earned
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {allPossibleBadges.map((badge) => (
            <div
              key={badge.id}
              className={`relative p-4 rounded-3xl border transition-all flex items-center gap-4 overflow-hidden ${
                badge.unlocked
                  ? 'badge-earned bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white dark:from-emerald-950/60 dark:to-stone-900 border-emerald-400 dark:border-emerald-700 text-stone-900 dark:text-stone-100 shadow-md'
                  : 'bg-stone-100/80 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400'
              }`}
            >
              {/* Badge Icon with Earned Shine or Lock Ring */}
              <div className="relative shrink-0">
                <div className={`text-3xl p-3 rounded-2xl shadow-sm flex items-center justify-center ${
                  badge.unlocked
                    ? 'bg-white dark:bg-stone-800'
                    : 'bg-stone-200 dark:bg-stone-800 grayscale opacity-50'
                }`}>
                  {badge.icon}
                </div>
                {!badge.unlocked && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-stone-700 text-white flex items-center justify-center text-[10px] shadow-sm">
                    🔒
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-black text-sm truncate ${badge.unlocked ? 'text-[#0B3B2C] dark:text-stone-100' : 'text-stone-700 dark:text-stone-400'}`}>
                    {badge.name}
                  </span>
                  {badge.unlocked ? (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
                      Unlocked
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-stone-300 dark:bg-stone-800 text-stone-700 dark:text-stone-400">
                      Locked
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-snug line-clamp-2">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Optimizer Prompt */}
      {cartItems.length > 0 && averageScore < 85 && (
        <div className="mt-6 p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <span className="text-2xl">💡</span>
            <div>
              <div className="font-bold text-sm text-amber-900 dark:text-amber-200">
                Boost your cart score from Grade {averageGrade} to Grade A
              </div>
              <p className="text-xs text-amber-700 dark:text-amber-400">
                The Eco Agent can automatically swap high-carbon items for sustainable alternatives with 1 tap.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsAgentOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-sm transition shrink-0"
          >
            Review Swaps with Agent →
          </button>
        </div>
      )}
    </div>
  );
}
