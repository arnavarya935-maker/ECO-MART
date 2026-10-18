import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Wind,
  Ban,
  Droplets,
  Package,
  ArrowRight,
  Sparkles,
  Flame,
  Download,
  MapPin
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { toPng } from 'html-to-image';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { playSound } from '../lib/audio';

// Weekly timeline impact simulation data (Feature 24)
const WEEKLY_IMPACT_DATA = [
  { day: 'Mon', co2: 0.8, plastic: 45 },
  { day: 'Tue', co2: 1.4, plastic: 90 },
  { day: 'Wed', co2: 1.1, plastic: 60 },
  { day: 'Thu', co2: 2.2, plastic: 140 },
  { day: 'Fri', co2: 2.9, plastic: 180 },
  { day: 'Sat', co2: 3.8, plastic: 240 },
  { day: 'Sun', co2: 4.6, plastic: 310 }
];

const LOCAL_AVATARS = [
  { id: 'av-1', name: 'Bamboo Forester', emoji: '🎋', bg: 'from-emerald-600 to-teal-700' },
  { id: 'av-2', name: 'Ocean Rescuer', emoji: '🌊', bg: 'from-sky-600 to-blue-700' },
  { id: 'av-3', name: 'Solar Pioneer', emoji: '☀️', bg: 'from-amber-500 to-orange-600' },
  { id: 'av-4', name: 'Wildlife Guardian', emoji: '🐘', bg: 'from-emerald-700 to-stone-800' },
  { id: 'av-5', name: 'Pollinator Keeper', emoji: '🐝', bg: 'from-yellow-500 to-amber-600' },
  { id: 'av-6', name: 'Zero Waste Guide', emoji: '🥗', bg: 'from-teal-600 to-emerald-800' },
  { id: 'av-7', name: 'Seed Planter', emoji: '🌱', bg: 'from-green-600 to-emerald-700' },
  { id: 'av-8', name: 'Canopy Steward', emoji: '🌲', bg: 'from-emerald-800 to-teal-900' }
];

export default function ProfilePage() {
  const { currentUser, isGuest, updateUserAvatar } = useAuth();
  const { orders, showToast } = useCart();
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [exportingCard, setExportingCard] = useState(false);
  const shareCardRef = useRef(null);

  // Level & streak calculations (Feature 24)
  const currentStreakDays = 5; // Active daily streak
  const points = (orders.length * 80) + 160;

  let level = {
    title: '🌱 Conscious Seedling',
    next: '🌿 Thriving Sapling',
    target: 300,
    progress: Math.min(100, Math.round((points / 300) * 100))
  };

  if (points >= 500) {
    level = { title: '🛡️ Forest Guardian', next: 'Supreme Planet Champion', target: 1000, progress: 100 };
  } else if (points >= 300) {
    level = { title: '🌳 Mature Tree', next: '🛡️ Forest Guardian', target: 500, progress: Math.min(100, Math.round(((points - 300) / 200) * 100)) };
  }

  // Lifetime saved aggregates
  const totalCo2Saved = (orders.reduce((acc, o) => acc + (o.impact?.savedCo2 || o.impact?.co2Saved || 1.4), 0) + 4.8).toFixed(1);
  const totalPlasticAvoided = Math.round(orders.reduce((acc, o) => acc + (o.impact?.plasticAvoided || 120), 0) + 450);
  const totalWaterSaved = Math.round(orders.reduce((acc, o) => acc + (o.impact?.waterSaved || 60), 0) + 190);

  const badges = [
    { id: 'b1', name: 'Planetary Steward', icon: '🌍', desc: 'Verified carbon savings receipt logged', unlocked: true },
    { id: 'b2', name: 'Zero Plastic Pioneer', icon: '🎋', desc: 'Opted for 100% plastic-free packaging', unlocked: true },
    { id: 'b3', name: 'Eco Alchemist', icon: '✨', desc: 'Completed a 1-tap cleaner product swap', unlocked: true },
    { id: 'b4', name: 'Local Champion', icon: '📍', desc: 'Supported regional artisans < 150km away', unlocked: points >= 200 },
    { id: 'b5', name: 'Tree Planter', icon: '🌳', desc: 'Avoided over 10kg of lifecycle CO₂', unlocked: points >= 300 },
    { id: 'b6', name: 'Forest Guardian', icon: '🛡️', desc: 'Reached top conscious consumer tier', unlocked: points >= 500 }
  ];

  // Export shareable impact card (Feature 24 & Feature 59)
  const handleExportCard = async () => {
    if (!shareCardRef.current) return;
    try {
      setExportingCard(true);
      playSound('click');
      const dataUrl = await toPng(shareCardRef.current, { quality: 0.95 });
      const link = document.createElement('a');
      link.download = `ecomart-impact-${currentUser?.name?.replace(/\s+/g, '-').toLowerCase() || 'explorer'}.png`;
      link.href = dataUrl;
      link.click();
      playSound('success');
      showToast('Impact card downloaded as PNG image!', 'success');
    } catch {
      showToast('Could not export image. Please take a screenshot.', 'info');
    } finally {
      setExportingCard(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in pb-24">
      {/* Profile Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0B3B2C] to-[#047857] text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4 z-10">
          <button
            type="button"
            onClick={() => setAvatarModalOpen(true)}
            className="w-20 h-20 rounded-3xl bg-white/15 border-2 border-white/30 flex items-center justify-center text-3xl font-black text-white shadow-inner hover:scale-105 transition cursor-pointer relative group shrink-0"
            title="Click to choose a local avatar"
          >
            {currentUser?.avatar || '🌱'}
            <div className="absolute inset-0 bg-black/60 rounded-3xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-black text-white transition">
              Change
            </div>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {currentUser?.name || 'Conscious Explorer'}
              </h1>
              {isGuest && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-stone-950">
                  Guest
                </span>
              )}
            </div>
            <p className="text-xs text-emerald-200 mt-0.5">
              {currentUser?.email || 'Offline Guest Session'}
            </p>
            <div className="flex items-center gap-3 mt-2 text-xs font-bold text-emerald-100">
              <span className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-amber-400" /> {currentStreakDays} Day Streak
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-emerald-300" /> {points} Eco Points
              </span>
            </div>
          </div>
        </div>

        {/* Level Progression Card */}
        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 min-w-[260px] space-y-2 z-10">
          <div className="flex items-center justify-between text-xs font-bold">
            <span>{level.title}</span>
            <span className="text-emerald-300">{level.progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-black/20 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-700"
              style={{ width: `${level.progress}%` }}
            />
          </div>
          <div className="text-[11px] text-emerald-200 flex justify-between">
            <span>Next: {level.next}</span>
            <span>{points}/{level.target} pts</span>
          </div>
        </div>
      </div>

      {/* Feature 24: Weekly Timeline Impact Chart & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Weekly Timeline Chart (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-base text-[#0B3B2C]">
                Weekly Environmental Timeline
              </h2>
              <p className="text-xs text-stone-500">Cumulative CO₂ avoided throughout the week</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              7-Day Activity
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEEKLY_IMPACT_DATA}>
                <defs>
                  <linearGradient id="impactCo2Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stop-color="#059669" stopOpacity={0.4} />
                    <stop offset="95%" stop-color="#059669" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#9ca3af" fontSize={11} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} unit="kg" />
                <Tooltip
                  formatter={(value) => [`${value} kg`, 'CO₂ Avoided']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#e5e7eb', fontSize: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="co2"
                  stroke="#059669"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#impactCo2Grad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Shareable Impact Card (5 Cols) (Feature 24 & Feature 59) */}
        <div className="lg:col-span-5 space-y-3">
          <div
            ref={shareCardRef}
            className="p-6 rounded-3xl bg-gradient-to-br from-white via-[#E8F5EE] to-white border border-emerald-300 shadow-md space-y-4 text-stone-900"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
                EcoMart Impact Ledger
              </span>
              <span className="text-xs font-bold text-stone-400">Verified Local</span>
            </div>

            <div className="flex items-center gap-3 py-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-2xl shadow-xs">
                {currentUser?.avatar || '🌱'}
              </div>
              <div>
                <h3 className="font-black text-lg text-[#0B3B2C] leading-snug">
                  {currentUser?.name || 'Conscious Explorer'}
                </h3>
                <span className="text-xs font-bold text-emerald-700">{level.title}</span>
              </div>
            </div>

            {/* Impact Metric Numbers */}
            <div className="grid grid-cols-3 gap-2 text-center py-2 border-y border-emerald-200/60">
              <div>
                <div className="flex items-center justify-center text-emerald-700 mb-0.5">
                  <Wind className="w-4 h-4" />
                </div>
                <div className="font-black text-base text-emerald-900">{totalCo2Saved} kg</div>
                <div className="text-[10px] text-stone-500 font-bold">CO₂ Avoided</div>
              </div>
              <div>
                <div className="flex items-center justify-center text-amber-600 mb-0.5">
                  <Ban className="w-4 h-4" />
                </div>
                <div className="font-black text-base text-amber-900">{totalPlasticAvoided} g</div>
                <div className="text-[10px] text-stone-500 font-bold">Plastic Diverted</div>
              </div>
              <div>
                <div className="flex items-center justify-center text-sky-600 mb-0.5">
                  <Droplets className="w-4 h-4" />
                </div>
                <div className="font-black text-base text-sky-900">{totalWaterSaved} L</div>
                <div className="text-[10px] text-stone-500 font-bold">Water Saved</div>
              </div>
            </div>

            <div className="text-[10px] text-stone-500 flex justify-between font-medium">
              <span>{orders.length} conscious orders placed</span>
              <span>100% Zero-Waste Packing</span>
            </div>
          </div>

          {/* Download / Share Card Button */}
          <button
            type="button"
            onClick={handleExportCard}
            disabled={exportingCard}
            className="w-full py-3 px-5 rounded-2xl bg-white hover:bg-stone-50 border border-stone-200 text-[#0B3B2C] font-black text-xs flex items-center justify-center gap-2 shadow-2xs transition active:scale-98 min-h-[44px]"
          >
            {exportingCard ? <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" /> : <Download className="w-4 h-4 text-emerald-600" />}
            <span>{exportingCard ? 'Rendering Card...' : 'Download Shareable Impact Card (PNG)'}</span>
          </button>
        </div>
      </div>

      {/* Achievements & Badges Grid (Feature 24) */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-700" />
            <h2 className="font-black text-base text-[#0B3B2C]">
              Environmental Milestones & Badges
            </h2>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {badges.filter((b) => b.unlocked).length} of {badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-3.5 rounded-2xl border text-center transition ${
                b.unlocked
                  ? 'bg-emerald-50/50 border-emerald-300 shadow-2xs'
                  : 'bg-stone-50 border-stone-200 opacity-40'
              }`}
            >
              <div className="text-3xl mb-1.5">{b.icon}</div>
              <div className="font-bold text-xs text-stone-900">{b.name}</div>
              <div className="text-[10px] text-stone-500 mt-1 leading-snug">{b.desc}</div>
              {b.unlocked && (
                <span className="inline-block mt-2 text-[10px] font-extrabold text-emerald-700">
                  ✓ Unlocked
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Orders & Address Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Saved Conscious Delivery Address</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-700">
            <div className="font-bold text-stone-900">{currentUser?.name || 'Ayush Sharma'}</div>
            <div className="mt-1">Flat 402, Green Meadows Residency, Bengaluru, Karnataka - 560034</div>
            <div className="mt-2 text-[11px] text-emerald-700 font-semibold">
              ⚡ EV Courier Route Verified
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-2xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
              <Package className="w-4 h-4 text-emerald-600" />
              <span>Order History & Real-Time Tracking</span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              You have {orders.length} order{orders.length !== 1 ? 's' : ''} logged with verified lifecycle carbon receipts.
            </p>
          </div>

          <Link
            to="/orders"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition shadow-2xs min-h-[44px]"
          >
            <span>View All Orders & Tracking ({orders.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Local Avatar Picker Modal (Feature 12) */}
      <Modal
        isOpen={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
        title="Choose Your Eco Avatar"
      >
        <div className="space-y-4">
          <p className="text-xs text-stone-600 font-medium">
            Select an eco persona. Stored 100% locally on your machine with zero external uploads.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {LOCAL_AVATARS.map((av) => (
              <button
                key={av.id}
                type="button"
                onClick={() => {
                  updateUserAvatar(av.emoji);
                  setAvatarModalOpen(false);
                }}
                className={`p-4 rounded-2xl border text-center transition-all duration-200 hover:scale-105 cursor-pointer flex flex-col items-center gap-2 ${
                  currentUser?.avatar === av.emoji
                    ? 'border-emerald-500 bg-emerald-50 shadow-md ring-2 ring-emerald-500/30'
                    : 'border-stone-200 bg-white hover:border-emerald-300'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${av.bg} flex items-center justify-center text-3xl shadow-sm text-white`}>
                  {av.emoji}
                </div>
                <div className="text-xs font-black text-[#0B3B2C]">
                  {av.name}
                </div>
              </button>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="secondary" size="sm" onClick={() => setAvatarModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
