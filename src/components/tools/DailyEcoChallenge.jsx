import React, { useState, useEffect } from 'react';
import { Flame, CheckCircle2, Trophy, Sparkles, RefreshCw } from 'lucide-react';

const CHALLENGES = [
  { id: 'c1', title: 'Zero Single-Use Day', task: 'Carry your own reusable bottle and cotton tote bag everywhere today.', xp: 50, impact: 'Saves 2 plastic bottles and 1 bag' },
  { id: 'c2', title: 'Cold Water Laundry', task: 'Wash your laundry cycle in cold tap water to save heating power.', xp: 40, impact: 'Cuts laundry energy footprint by 75%' },
  { id: 'c3', title: 'Leftovers First', task: 'Plan dinner around leftover pantry items to achieve zero food waste today.', xp: 45, impact: 'Diverts 0.8kg methane-producing food waste' },
  { id: 'c4', title: '5-Minute Power Down', task: 'Unplug idle phone chargers and microwave displays at night.', xp: 30, impact: 'Eliminates phantom vampire power drain' },
  { id: 'c5', title: 'Plastic-Free Bathroom', task: 'Swap out a plastic liquid soap bottle for a natural cold-pressed soap bar.', xp: 60, impact: 'Eliminates 35g virgin plastic packaging' }
];

export default function DailyEcoChallenge() {
  const [streak, setStreak] = useState(() => {
    try {
      return Number(localStorage.getItem('eco_streak_count') || 3);
    } catch {
      return 3;
    }
  });

  const [completedToday, setCompletedToday] = useState(() => {
    try {
      const lastCompleted = localStorage.getItem('eco_streak_last_date');
      const today = new Date().toDateString();
      return lastCompleted === today;
    } catch {
      return false;
    }
  });

  // Pick challenge based on day of year
  const dayIndex = new Date().getDate() % CHALLENGES.length;
  const todayChallenge = CHALLENGES[dayIndex];

  const handleComplete = () => {
    if (completedToday) return;
    const newStreak = streak + 1;
    const today = new Date().toDateString();
    setStreak(newStreak);
    setCompletedToday(true);
    try {
      localStorage.setItem('eco_streak_count', String(newStreak));
      localStorage.setItem('eco_streak_last_date', today);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-md max-w-xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400">
            <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <h4 className="font-black text-sm text-stone-900 dark:text-stone-100">Daily Eco Challenge</h4>
            <div className="text-[11px] text-stone-500">Keep your sustainable streak alive!</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-black text-xs">
          <Flame className="w-3.5 h-3.5 fill-amber-500" />
          <span>{streak} Day Streak</span>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
            {todayChallenge.title}
          </span>
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
            +{todayChallenge.xp} XP
          </span>
        </div>

        <p className="text-xs text-stone-700 dark:text-stone-300 font-medium">
          {todayChallenge.task}
        </p>

        <div className="text-[11px] text-stone-500 flex items-center gap-1 pt-1">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          <span>Impact: {todayChallenge.impact}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleComplete}
        disabled={completedToday}
        className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
          completedToday
            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 cursor-default'
            : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm active:scale-98'
        }`}
      >
        {completedToday ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Challenge Completed for Today! 🎉</span>
          </>
        ) : (
          <span>Mark Challenge as Done (+{todayChallenge.xp} XP)</span>
        )}
      </button>
    </div>
  );
}
