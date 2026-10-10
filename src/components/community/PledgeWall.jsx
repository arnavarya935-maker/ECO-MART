import React, { useState } from 'react';
import { HeartHandshake, CheckCircle2, Send, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const INITIAL_PLEDGES = [
  { id: 1, name: 'Aakash Verma', pledge: 'I pledge to refuse all single-use plastic cutlery and carry my bamboo travel kit.', date: 'Today' },
  { id: 2, name: 'Divya Sen', pledge: 'I pledge to swap synthetic bathroom bottles for solid cold-pressed bars.', date: 'Yesterday' },
  { id: 3, name: 'Rahul Nair', pledge: 'I pledge to always carry reusable organic cotton totes for weekend grocery shopping.', date: '2 days ago' },
  { id: 4, name: 'Zoya Khan', pledge: 'I pledge to audit all home food wraps and switch 100% to washable beeswax wraps.', date: '3 days ago' }
];

export default function PledgeWall() {
  const { user } = useAuth();
  const [pledges, setPledges] = useState(() => {
    try {
      const saved = localStorage.getItem('eco_pledges_wall');
      return saved ? JSON.parse(saved) : INITIAL_PLEDGES;
    } catch {
      return INITIAL_PLEDGES;
    }
  });

  const [pledgeInput, setPledgeInput] = useState('');
  const [pledgedSuccess, setPledgedSuccess] = useState(false);

  const handleSubmitPledge = (e) => {
    e.preventDefault();
    if (!pledgeInput.trim()) return;

    const newPledge = {
      id: Date.now(),
      name: user?.name || 'Conscious Explorer',
      pledge: pledgeInput.trim(),
      date: 'Just now'
    };

    const updated = [newPledge, ...pledges];
    setPledges(updated);
    setPledgeInput('');
    setPledgedSuccess(true);
    setTimeout(() => setPledgedSuccess(false), 3000);

    try {
      localStorage.setItem('eco_pledges_wall', JSON.stringify(updated));
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-md max-w-2xl mx-auto space-y-6">
      <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
        <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
          Collective Commitment
        </span>
        <h3 className="text-xl font-black text-stone-900 dark:text-stone-100 mt-2">
          The Planetary Pledge Wall
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
          Sign your commitment to sustainable living and join thousands making daily conscious choices.
        </p>
      </div>

      <form onSubmit={handleSubmitPledge} className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-3">
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
            Write your personal eco pledge:
          </span>
        </div>

        <input
          type="text"
          value={pledgeInput}
          onChange={(e) => setPledgeInput(e.target.value)}
          placeholder="I pledge to never buy single-use plastic water bottles..."
          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:border-emerald-500"
        />

        <button
          type="submit"
          className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {pledgedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Pledge Signed & Recorded! 🎉</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Sign & Pin to Pledge Wall</span>
            </>
          )}
        </button>
      </form>

      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {pledges.map((p) => (
          <div
            key={p.id}
            className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/80 space-y-1"
          >
            <div className="flex items-center justify-between text-xs font-black text-emerald-900 dark:text-emerald-200">
              <span>{p.name}</span>
              <span className="text-[10px] font-normal text-stone-400">{p.date}</span>
            </div>
            <p className="text-xs text-stone-700 dark:text-stone-300 italic font-medium">
              "{p.pledge}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
