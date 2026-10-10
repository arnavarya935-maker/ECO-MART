import React, { useState } from 'react';
import { Trophy, Medal, Crown, Sparkles, TrendingUp } from 'lucide-react';
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
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-md max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
            Planetary Honor Roll
          </span>
          <h3 className="text-xl font-black text-stone-900 dark:text-stone-100 mt-2">
            Eco Champions Leaderboard
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Recognizing conscious consumers making the largest audited diversion impact this season.
          </p>
        </div>
        <Trophy className="w-8 h-8 text-amber-500 shrink-0" />
      </div>

      <div className="space-y-3">
        {CHAMPIONS.map((champ) => (
          <div
            key={champ.rank}
            className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
              champ.rank === 1
                ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 shadow-xs'
                : 'bg-stone-50 dark:bg-stone-800/80 border-stone-200 dark:border-stone-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-8 text-center font-black text-base text-stone-700 dark:text-stone-300">
                {champ.rank === 1 ? '🥇' : champ.rank === 2 ? '🥈' : champ.rank === 3 ? '🥉' : `#${champ.rank}`}
              </span>

              <div>
                <div className="font-black text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                  {champ.name}
                </div>
                <div className="text-[10px] text-stone-400 font-medium">
                  {champ.location} • {champ.level}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="font-black text-xs sm:text-sm text-emerald-700 dark:text-emerald-400">
                {champ.points} XP
              </div>
              <div className="text-[10px] text-stone-500 font-bold">
                {champ.plasticSaved} plastic saved
              </div>
            </div>
          </div>
        ))}

        {/* Current User Row */}
        <div className="p-4 rounded-2xl bg-emerald-100/70 dark:bg-emerald-950/60 border-2 border-emerald-500 dark:border-emerald-700 flex items-center justify-between gap-3 mt-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="w-8 text-center font-black text-xs px-1.5 py-0.5 rounded-full bg-emerald-700 text-white">
              #{userRank}
            </span>
            <div>
              <div className="font-black text-xs sm:text-sm text-emerald-950 dark:text-emerald-100 flex items-center gap-1.5">
                <span>{user?.name || 'You (Conscious Explorer)'}</span>
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded-full bg-emerald-600 text-white">You</span>
              </div>
              <div className="text-[10px] text-emerald-800 dark:text-emerald-300 font-medium">
                Keep adopting swaps to climb up the ranks!
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="font-black text-sm text-emerald-900 dark:text-emerald-200">
              {userPoints} XP
            </div>
            <div className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold">
              Level Active
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
