import React, { useState } from 'react';
import { HeartHandshake, CheckCircle2, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const _INITIAL_PLEDGES = [];

export default function PledgeWall() {
  const { user } = useAuth();
  const [pledges, setPledges] = useState(() => {
    try {
      const saved = localStorage.getItem('eco_pledges_wall');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed)
          ? parsed.filter((p) => !['Aakash Verma', 'Divya Sen', 'Rahul Nair', 'Zoya Khan'].includes(p.name))
          : [];
      }
      return [];
    } catch {
      return [];
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
        {pledges.length === 0 ? (
          <div className="py-8 text-center text-secondary space-y-1 border border-dashed border-line rounded-2xl bg-surface-sunken/30">
            <p className="text-xs font-semibold text-heading">Nothing here yet</p>
            <p className="text-[11px] text-secondary">Be the first to record a sustainability pledge above.</p>
          </div>
        ) : (
          pledges.map((p) => (
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
          ))
        )}
      </div>
    </div>
  );
}
