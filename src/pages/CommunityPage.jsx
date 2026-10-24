import React, { useState } from 'react';
import { Users, Trophy, HeartHandshake, Share2 } from 'lucide-react';
import CommunityFeed from '../components/community/CommunityFeed';
import EcoLeaderboard from '../components/community/EcoLeaderboard';
import ShareableImpactCard from '../components/community/ShareableImpactCard';
import PledgeWall from '../components/community/PledgeWall';
import NewsletterSignup from '../components/community/NewsletterSignup';

const TABS = [
  { id: 'feed', label: 'Community Feed & Tips', icon: Users },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'pledges', label: 'Pledge Wall', icon: HeartHandshake },
  { id: 'share', label: 'Shareable Certificate', icon: Share2 }
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('feed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fade-in pb-24">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-3.5 py-1 rounded-full inline-block">
          Conscious Collective
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-heading tracking-tight">
          Community & Gamification
        </h1>
        <p className="text-sm sm:text-base text-secondary leading-relaxed max-w-xl mx-auto">
          Connect with local shoppers, celebrate seasonal eco champions, pin your pledge, and download your logged impact summary.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TABS.map((t) => {
          const Icon = t.icon;
          const isSelected = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium transition-all cursor-pointer min-h-[44px] focus-visible:outline-2 focus-visible:outline-focus ${
                isSelected
                  ? 'bg-primary text-primary-contrast shadow-soft-sm'
                  : 'bg-surface-sunken text-secondary hover:bg-surface-sunken/80 border border-line'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-primary-contrast' : 'text-primary'}`} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab View */}
      <div className="pt-2">
        {activeTab === 'feed' && <CommunityFeed />}
        {activeTab === 'leaderboard' && <EcoLeaderboard />}
        {activeTab === 'pledges' && <PledgeWall />}
        {activeTab === 'share' && <ShareableImpactCard />}
      </div>

      {/* Newsletter Signup Banner (Feature 61) */}
      <NewsletterSignup />
    </div>
  );
}
