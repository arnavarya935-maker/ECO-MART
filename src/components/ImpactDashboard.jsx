import React from 'react';
import { Wind, Ban, Droplets, Car, Coffee, Trees, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import AnimatedCounter from './AnimatedCounter';

export default function ImpactDashboard({ showHeader = true }) {
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
    <div className="bg-surface rounded-3xl border border-line p-6 md:p-8 shadow-soft-sm">
      {showHeader && (
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-line gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-semibold tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                Live Environmental Ledger
              </span>
              <span className="text-xs font-medium text-muted">Real-Time Cart Impact</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-heading mt-1">
              Your Collective Planetary Impact
            </h2>
            <p className="text-sm text-secondary font-normal">
              Measuring the tangible footprint saved versus conventional shopping alternatives.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-accent/10 border border-accent/30 text-right">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-accent">
                Eco Points Earned
              </div>
              <div className="text-xl font-serif font-bold text-accent flex items-center justify-end gap-1">
                <Sparkles className="w-4 h-4 text-accent fill-accent" />
                <span>
                  <AnimatedCounter value={ecoPoints} decimals={0} /> pts
                </span>
              </div>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-surface-sunken border border-line text-right">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                Cart Eco Rating
              </div>
              <div className="text-xl font-serif font-bold text-heading">
                Grade {averageGrade} ({averageEcoScore}/100)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Living Ecological Tier Tracker */}
      <div className="my-6 p-5 sm:p-6 rounded-3xl bg-surface-sunken border border-line shadow-soft-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center text-primary-contrast text-xl shadow-soft-xs">
              {averageEcoScore >= 85 ? '🌲' : averageEcoScore >= 70 ? '🌿' : averageEcoScore >= 50 ? '🌱' : '🪴'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-heading">
                  Cart Biosphere Health Tier
                </span>
                <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                  {averageGrade === 'A' ? 'Thriving Canopy' : averageGrade === 'B' ? 'Growing Grove' : averageGrade === 'C' ? 'Sprouting' : 'Conscious Seedling'}
                </span>
              </div>
              <p className="text-xs text-secondary font-normal mt-0.5">
                {totalItems > 0
                  ? `Your active cart achieves a collective Eco-Score of ${averageEcoScore}/100 with Grade ${averageGrade}.`
                  : 'Add items or swap conventional products to begin cultivating your verified impact savings.'}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <div className="text-xs font-medium text-muted">
              Next Tier: {averageEcoScore >= 85 ? 'Maximum Grade A Achieved' : 'Grade A (Score ≥ 85)'}
            </div>
            <div className="text-sm font-serif font-bold text-heading">
              {averageEcoScore >= 85 ? '🎉 Peak Planetary Standard' : `${Math.max(0, 85 - averageEcoScore)} pts to Gold Standard`}
            </div>
          </div>
        </div>

        {/* Precision Progress Bar */}
        <div className="w-full bg-line rounded-full h-2.5 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700"
            style={{ width: `${Math.max(8, Math.min(100, averageEcoScore))}%` }}
          />
        </div>
      </div>

      {/* Impact Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {/* Metric 1: CO2 Saved */}
        <div className="relative p-6 rounded-3xl bg-surface border border-line shadow-soft-xs overflow-hidden transition-all hover:shadow-soft-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              CO₂ Lifecycle Saved
            </span>
            <div className="p-2 rounded-xl bg-surface-sunken text-heading">
              <Wind className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-heading">
            <AnimatedCounter value={co2Saved} decimals={2} />{' '}
            <span className="text-sm font-sans font-medium text-muted">kg CO₂e</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-text font-medium bg-surface-sunken p-2.5 rounded-xl border border-line">
            <Car className="w-4 h-4 text-primary shrink-0" />
            <span>≈ <AnimatedCounter value={equivalents.carKm} decimals={1} /> km car driving offset</span>
          </div>
        </div>

        {/* Metric 2: Plastic Avoided */}
        <div className="relative p-6 rounded-3xl bg-surface border border-line shadow-soft-xs overflow-hidden transition-all hover:shadow-soft-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Plastic Waste Avoided
            </span>
            <div className="p-2 rounded-xl bg-surface-sunken text-heading">
              <Ban className="w-4 h-4 text-accent" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-heading">
            <AnimatedCounter value={plasticAvoided} decimals={0} />{' '}
            <span className="text-sm font-sans font-medium text-muted">grams</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-text font-medium bg-surface-sunken p-2.5 rounded-xl border border-line">
            <Coffee className="w-4 h-4 text-accent shrink-0" />
            <span>≈ <AnimatedCounter value={equivalents.plasticBottles} decimals={0} /> single-use bottles diverted</span>
          </div>
        </div>

        {/* Metric 3: Water Saved */}
        <div className="relative p-6 rounded-3xl bg-surface border border-line shadow-soft-xs overflow-hidden transition-all hover:shadow-soft-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Freshwater Conserved
            </span>
            <div className="p-2 rounded-xl bg-surface-sunken text-heading">
              <Droplets className="w-4 h-4 text-secondary" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-heading">
            <AnimatedCounter value={waterSaved} decimals={0} />{' '}
            <span className="text-sm font-sans font-medium text-muted">Litres</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-text font-medium bg-surface-sunken p-2.5 rounded-xl border border-line">
            <Trees className="w-4 h-4 text-secondary shrink-0" />
            <span>≈ <AnimatedCounter value={equivalents.daysDrinkingWater} decimals={0} /> days of drinking water</span>
          </div>
        </div>
      </div>

      {/* Badges and Gamification */}
      <div className="pt-5 border-t border-line">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
            Sustainability Milestones
          </h4>
          <span className="text-xs font-medium text-primary">
            {allPossibleBadges.filter(b => b.unlocked).length} of {allPossibleBadges.length} Earned
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {allPossibleBadges.map((badge) => (
            <div
              key={badge.id}
              className={`relative p-4 rounded-3xl border transition-all flex items-center gap-4 overflow-hidden ${
                badge.unlocked
                  ? 'bg-surface-sunken border-primary/40 text-heading shadow-soft-xs'
                  : 'bg-surface-sunken/40 border-line text-muted'
              }`}
            >
              {/* Badge Icon */}
              <div className="relative shrink-0">
                <div className={`text-2xl p-2.5 rounded-2xl shadow-soft-xs flex items-center justify-center ${
                  badge.unlocked
                    ? 'bg-surface border border-line'
                    : 'bg-surface-sunken grayscale opacity-50'
                }`}>
                  {badge.icon}
                </div>
                {!badge.unlocked && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-contrast flex items-center justify-center text-[9px] shadow-sm">
                    🔒
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold text-sm truncate ${badge.unlocked ? 'text-heading' : 'text-muted'}`}>
                    {badge.name}
                  </span>
                  {badge.unlocked ? (
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-primary text-primary-contrast shadow-soft-xs">
                      Unlocked
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded-full bg-line text-muted">
                      Locked
                    </span>
                  )}
                </div>
                <p className="text-xs text-secondary mt-1 leading-snug line-clamp-2">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Optimizer Prompt */}
      {cartItems.length > 0 && averageEcoScore < 85 && (
        <div className="mt-6 p-4 rounded-2xl bg-surface-sunken border border-line flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <span className="text-2xl">💡</span>
            <div>
              <div className="font-semibold text-sm text-heading">
                Boost your cart score from Grade {averageGrade} to Grade A
              </div>
              <p className="text-xs text-secondary">
                The Eco Agent can automatically swap high-carbon items for sustainable alternatives with 1 tap.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsAgentOpen(true)}
            className="px-4 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-primary-contrast font-medium text-xs shadow-soft-xs transition shrink-0 cursor-pointer min-h-[44px] focus-visible:outline-2 focus-visible:outline-focus"
          >
            Review Swaps with Agent →
          </button>
        </div>
      )}
    </div>
  );
}
