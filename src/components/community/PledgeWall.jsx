import React, { useState } from 'react';
import { HeartHandshake, CheckCircle2, Send } from 'lucide-react';
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
    <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-line shadow-soft-sm max-w-2xl mx-auto space-y-6">
      <div className="border-b border-line pb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
            Collective Commitment
          </span>
          <span
            className="text-[10px] font-semibold uppercase tracking-wider text-muted bg-surface-sunken border border-line px-2 py-0.5 rounded-full cursor-help"
            title="Sample content for demonstration"
            aria-label="Sample content for demonstration"
          >
            Demo Data
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-heading mt-2">
          The Planetary Pledge Wall
        </h3>
        <p className="text-xs sm:text-sm text-secondary mt-0.5">
          Sign your commitment to sustainable living. Seeded pledges represent community goals for demonstration.
        </p>
      </div>

      <form onSubmit={handleSubmitPledge} className="p-5 rounded-2xl bg-surface-sunken border border-line space-y-3">
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-heading">
            Write your personal eco pledge:
          </span>
        </div>

        <input
          type="text"
          value={pledgeInput}
          onChange={(e) => setPledgeInput(e.target.value)}
          placeholder="I pledge to never buy single-use plastic water bottles..."
          className="w-full px-4 py-3 rounded-full bg-surface border border-line text-xs text-heading placeholder:text-muted focus:outline-2 focus:outline-focus focus:border-primary shadow-soft-xs min-h-[44px]"
        />

        <button
          type="submit"
          className="w-full py-3 rounded-full bg-primary hover:bg-primary-hover text-primary-contrast font-medium text-xs shadow-soft-xs transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer min-h-[44px] focus-visible:outline-2 focus-visible:outline-focus"
        >
          {pledgedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
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
            className="p-4 rounded-2xl bg-surface-sunken border border-line space-y-1.5 transition hover:bg-surface-sunken/80"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-heading">
              <span>{p.name}</span>
              <span className="text-[10px] font-normal text-muted">{p.date}</span>
            </div>
            <p className="text-xs text-secondary italic font-normal">
              "{p.pledge}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
