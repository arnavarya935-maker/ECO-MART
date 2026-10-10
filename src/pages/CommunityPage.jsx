import React, { useState } from 'react';
import { Users, Trophy, HeartHandshake, Share2, Mail, Sparkles } from 'lucide-react';
import CommunityFeed from '../components/community/CommunityFeed';
import EcoLeaderboard from '../components/community/EcoLeaderboard';
import ShareableImpactCard from '../components/community/ShareableImpactCard';
import PledgeWall from '../components/community/PledgeWall';
import NewsletterSignup from '../components/community/NewsletterSignup';

const TABS = [
  { id: 'feed', label: 'Community Feed & Tips', icon: Users, feature: 'Feature 55' },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, feature: 'Feature 56' },
  { id: 'pledges', label: 'Pledge Wall', icon: HeartHandshake, feature: 'Feature 60' },
  { id: 'share', label: 'Shareable Certificate', icon: Share2, feature: 'Feature 59' }
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('feed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-full inline-block">
          Conscious Collective
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-stone-900 dark:text-stone-100">
          Community & Gamification
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
          Connect with local shoppers, celebrate seasonal eco champions, pin your pledge, and download your verified impact certificate.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1">
        {TABS.map((t) => {
          const Icon = t.icon;
          const isSelected = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              <Icon className="w-4 h-4" />
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
