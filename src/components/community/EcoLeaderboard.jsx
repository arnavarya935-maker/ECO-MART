import React from 'react';
import { Trophy } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const CHAMPIONS = [
  { rank: 1, name: 'Aarav Singhania', location: 'Bengaluru', points: 1420, plasticSaved: '24.2kg', level: '🛡️ Forest Guardian', avatar: '🥇' },
  { rank: 2, name: 'Meera Nambiar', location: 'Kochi', points: 1180, plasticSaved: '19.8kg', level: '🛡️ Forest Guardian', avatar: '🥈' },
  { rank: 3, name: 'Tanvi Deshmukh', location: 'Pune', points: 940, plasticSaved: '16.4kg', level: '🌳 Mature Tree', avatar: '🥉' },
  { rank: 4, name: 'Devendra Joshi', location: 'Ahmedabad', points: 760, plasticSaved: '12.1kg', level: '🌳 Mature Tree', avatar: '🎋' },
  { rank: 5, name: 'Ananya Roy', location: 'Kolkata', points: 610, plasticSaved: '9.5kg', level: '🌿 Thriving Sapling', avatar: '🌱' }
];

export default function EcoLeaderboard() {
  const { user } = useAuth();
  const { orders } = useCart();

  const userPoints = (orders.length * 80) + 120;
  const userRank = userPoints > 1000 ? 3 : userPoints > 600 ? 5 : 6;

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-line shadow-soft-sm max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
            Planetary Honor Roll
          </span>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-heading mt-2">
            Eco Champions Leaderboard
          </h3>
          <p className="text-xs sm:text-sm text-secondary mt-0.5">
            Recognizing conscious consumers making the largest audited diversion impact this season.
          </p>
        </div>
        <Trophy className="w-8 h-8 text-accent shrink-0" />
      </div>

      <div className="space-y-3">
        {CHAMPIONS.map((champ) => (
          <div
            key={champ.rank}
            className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
              champ.rank === 1
                ? 'bg-accent/10 border-accent/30 shadow-soft-xs'
                : 'bg-surface-sunken border-line hover:bg-surface-sunken/80'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-8 text-center font-bold text-base text-heading">
                {champ.rank === 1 ? '🥇' : champ.rank === 2 ? '🥈' : champ.rank === 3 ? '🥉' : `#${champ.rank}`}
              </span>

              <div>
                <div className="font-semibold text-xs sm:text-sm text-heading">
                  {champ.name}
                </div>
                <div className="text-[10px] text-muted font-normal">
                  {champ.location} • {champ.level}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="font-serif font-bold text-xs sm:text-sm text-primary">
                {champ.points} XP
              </div>
              <div className="text-[10px] text-secondary font-medium">
                {champ.plasticSaved} plastic saved
              </div>
            </div>
          </div>
        ))}

        {/* Current User Row */}
        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-between gap-3 mt-4 shadow-soft-xs">
          <div className="flex items-center gap-3">
            <span className="w-8 text-center font-semibold text-xs px-2 py-0.5 rounded-full bg-primary text-primary-contrast">
              #{userRank}
            </span>
            <div>
              <div className="font-semibold text-xs sm:text-sm text-heading flex items-center gap-1.5">
                <span>{user?.name || 'You (Conscious Explorer)'}</span>
                <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded-full bg-primary text-primary-contrast">You</span>
              </div>
              <div className="text-[10px] text-secondary font-normal">
                Keep adopting swaps to climb up the ranks!
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="font-serif font-bold text-sm text-primary">
              {userPoints} XP
            </div>
            <div className="text-[10px] text-muted font-medium">
              Level Active
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
