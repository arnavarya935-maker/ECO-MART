import React, { useState } from 'react';
import { Flame, CheckCircle2, Sparkles } from 'lucide-react';

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

  // Pick challenge based on day of month with stable state initializer
  const [todayChallenge] = useState(() => {
    const dayIndex = new Date().getDate() % CHALLENGES.length;
    return CHALLENGES[dayIndex];
  });

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
    <div className="p-6 rounded-3xl bg-surface border border-line shadow-soft-sm max-w-xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-accent/10 text-accent">
            <Flame className="w-5 h-5 fill-accent text-accent" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-heading">Daily Eco Challenge</h4>
            <div className="text-[11px] text-muted">Keep your sustainable streak alive!</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent font-bold text-xs">
          <Flame className="w-3.5 h-3.5 fill-accent" />
          <span>{streak} Day Streak</span>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-surface-sunken border border-line space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-primary">
            {todayChallenge.title}
          </span>
          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-primary/20 text-primary">
            +{todayChallenge.xp} XP
          </span>
        </div>

        <p className="text-xs text-secondary font-medium">
          {todayChallenge.task}
        </p>

        <div className="text-[11px] text-muted flex items-center gap-1 pt-1">
          <Sparkles className="w-3 h-3 text-primary" />
          <span>Impact: {todayChallenge.impact}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleComplete}
        disabled={completedToday}
        className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer min-h-[44px] focus-visible:outline-2 focus-visible:outline-focus ${
          completedToday
            ? 'bg-primary/10 text-primary border border-primary/20 cursor-default'
            : 'bg-primary hover:bg-primary-hover text-primary-contrast shadow-soft-xs active:scale-98'
        }`}
      >
        {completedToday ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span>Challenge Completed for Today! 🎉</span>
          </>
        ) : (
          <span>Mark Challenge as Done (+{todayChallenge.xp} XP)</span>
        )}
      </button>
    </div>
  );
}
