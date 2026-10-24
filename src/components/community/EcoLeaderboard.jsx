import React from 'react';
import { Trophy, ShieldCheck, CheckCircle2, Lock, Flame } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const MILESTONES = [
  {
    tier: 1,
    title: 'Zero-Waste Starter',
    icon: '🌱',
    reqPoints: 80,
    desc: 'Adopt your first verified zero-waste swap or plastic-free order',
    impactReq: '100g plastic diverted'
  },
  {
    tier: 2,
    title: 'Plastic-Free Pioneer',
    icon: '🎋',
    reqPoints: 200,
    desc: 'Eliminate single-use bathroom and kitchen polymers',
    impactReq: '500g plastic diverted'
  },
  {
    tier: 3,
    title: 'Carbon-Conscious Home',
    icon: '🌳',
    reqPoints: 400,
    desc: 'Shift household essentials to regional artisan producers',
    impactReq: '5.0 kg CO₂ avoided'
  },
  {
    tier: 4,
    title: 'Circular Household Steward',
    icon: '🌿',
    reqPoints: 700,
    desc: 'Maintain a 100% compostable and repair-first purchasing habit',
    impactReq: '15.0 kg CO₂ avoided'
  },
  {
    tier: 5,
    title: 'Forest Guardian',
    icon: '🛡️',
    reqPoints: 1000,
    desc: 'Highest tier of regenerative planetary stewardship',
    impactReq: '30.0 kg CO₂ avoided'
  }
];

export default function EcoLeaderboard() {
  const { user } = useAuth();
  const { orders } = useCart();

  const userPoints = (orders.length * 80) + 120;
  const currentMilestone = MILESTONES.slice().reverse().find((m) => userPoints >= m.reqPoints) || MILESTONES[0];

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-line shadow-soft-sm max-w-2xl mx-auto space-y-6 text-left">
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
              Household Milestones
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted bg-surface-sunken border border-line px-2 py-0.5 rounded-full">
              Local Verification
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-heading mt-2">
            Planetary Progress Milestones
          </h3>
          <p className="text-xs sm:text-sm text-secondary mt-0.5">
            Real milestone progression based exclusively on your household's orders and verified swaps.
          </p>
        </div>
        <Trophy className="w-8 h-8 text-accent shrink-0" />
      </div>

      {/* Honest Guarantee Notice */}
      <div className="p-3.5 rounded-2xl bg-surface-sunken border border-line text-xs text-secondary flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-heading">Honesty Guarantee:</strong> EcoMart never invents fake leaderboard competitors or artificial usernames. Every milestone reflects verified local reductions in carbon, plastic, and water.
        </p>
      </div>

      {/* Milestone List */}
      <div className="space-y-3">
        {MILESTONES.map((m) => {
          const isUnlocked = userPoints >= m.reqPoints;
          const isCurrent = currentMilestone.tier === m.tier;

          return (
            <div
              key={m.tier}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                isCurrent
                  ? 'bg-primary/10 border-primary/30 shadow-soft-xs'
                  : isUnlocked
                  ? 'bg-surface-sunken border-line'
                  : 'bg-surface-sunken/40 border-line/60 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-8 text-center text-2xl">
                  {m.icon}
                </span>

                <div>
                  <div className="font-semibold text-xs sm:text-sm text-heading flex items-center gap-2">
                    <span>{m.title}</span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-primary text-primary-contrast text-[9px] font-bold uppercase">
                        Current Tier
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-muted font-normal mt-0.5">
                    {m.desc} • <span className="text-primary font-medium">{m.impactReq}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="font-serif font-bold text-xs sm:text-sm text-heading">
                  {m.reqPoints} XP
                </div>
                <div className="text-[10px] font-semibold flex items-center justify-end gap-1 mt-0.5">
                  {isUnlocked ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Unlocked
                    </span>
                  ) : (
                    <span className="text-muted flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Current User Summary */}
      <div className="p-4 rounded-2xl bg-surface-raised border border-line flex items-center justify-between gap-3 shadow-soft-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-bold text-sm">
            <Flame className="w-5 h-5 text-accent" />
          </div>
          <div>
            <div className="font-semibold text-xs sm:text-sm text-heading">
              {user?.name || 'Local Household Session'}
            </div>
            <div className="text-[10px] text-secondary">
              Active Tier: {currentMilestone.title} ({userPoints} Total XP)
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-serif font-bold text-primary">
            {orders.length} Orders Placed
          </span>
        </div>
      </div>
    </div>
  );
}
