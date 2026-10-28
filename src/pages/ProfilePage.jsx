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
  { id: 'av-1', name: 'Bamboo Forester', emoji: '🎋' },
  { id: 'av-2', name: 'Ocean Rescuer', emoji: '🌊' },
  { id: 'av-3', name: 'Solar Pioneer', emoji: '☀️' },
  { id: 'av-4', name: 'Wildlife Guardian', emoji: '🐘' },
  { id: 'av-5', name: 'Pollinator Keeper', emoji: '🐝' },
  { id: 'av-6', name: 'Zero Waste Guide', emoji: '🥗' },
  { id: 'av-7', name: 'Seed Planter', emoji: '🌱' },
  { id: 'av-8', name: 'Canopy Steward', emoji: '🌲' }
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
    { id: 'b1', name: 'Planetary Steward', icon: '🌍', desc: 'Carbon savings receipt logged', unlocked: true },
    { id: 'b2', name: 'Plastic-Free Pioneer', icon: '🎋', desc: 'Opted for plastic-free packaging', unlocked: true },
    { id: 'b3', name: 'Eco Alchemist', icon: '✨', desc: 'Completed a 1-tap cleaner product swap', unlocked: true },
    { id: 'b4', name: 'Local Champion', icon: '📍', desc: 'Supported regional artisans < 150km away', unlocked: points >= 200 },
    { id: 'b5', name: 'Tree Planter', icon: '🌳', desc: 'Avoided over 10kg of lifecycle CO₂', unlocked: points >= 300 },
    { id: 'b6', name: 'Forest Guardian', icon: '🛡️', desc: 'Reached top conscious consumer tier', unlocked: points >= 500 }
  ];

  // Export shareable impact card
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
      <div className="p-6 sm:p-8 rounded-3xl bg-primary text-primary-contrast shadow-soft-md border border-primary/20 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4 z-10">
          <button
            type="button"
            onClick={() => setAvatarModalOpen(true)}
            className="w-20 h-20 rounded-2xl bg-surface/15 border border-primary-contrast/20 flex items-center justify-center text-3xl font-bold text-primary-contrast shadow-soft-xs hover:scale-105 transition cursor-pointer relative group shrink-0 min-h-[44px]"
            title="Click to choose a local avatar"
          >
            {currentUser?.avatar || '🌱'}
            <div className="absolute inset-0 bg-primary-hover/90 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-semibold text-primary-contrast transition">
              Change
            </div>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary-contrast tracking-tight">
                {currentUser?.name || 'Conscious Explorer'}
              </h1>
              {isGuest && (
                <span className="text-xs uppercase font-semibold tracking-wider px-2.5 py-0.5 rounded-full bg-warning text-primary-contrast">
                  Guest
                </span>
              )}
            </div>
            <p className="text-xs text-primary-contrast/80 mt-0.5 font-normal">
              {currentUser?.email || 'Offline Guest Session'}
            </p>
            <div className="flex items-center gap-3 mt-2 text-xs font-medium text-primary-contrast/90">
              <span className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-warning" /> {currentStreakDays} Day Streak
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-accent" /> {points} Eco Points
              </span>
            </div>
          </div>
        </div>

        {/* Level Progression Card */}
        <div className="p-4 rounded-2xl bg-surface/15 border border-primary-contrast/15 min-w-[260px] space-y-2 z-10">
          <div className="flex items-center justify-between text-xs font-medium">
            <span>{level.title}</span>
            <span className="text-accent font-semibold">{level.progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-black/20 overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-700"
              style={{ width: `${level.progress}%` }}
            />
          </div>
          <div className="text-xs text-primary-contrast/80 flex justify-between font-normal">
            <span>Next: {level.next}</span>
            <span>{points}/{level.target} pts</span>
          </div>
        </div>
      </div>

      {/* Feature 24: Weekly Timeline Impact Chart & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Weekly Timeline Chart (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-surface border border-line shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-base sm:text-lg text-heading">
                Weekly Environmental Timeline
              </h2>
              <p className="text-xs text-secondary font-normal">Cumulative CO₂ avoided throughout the week</p>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              7-Day Activity
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEEKLY_IMPACT_DATA}>
                <defs>
                  <linearGradient id="impactCo2Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="var(--color-muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--color-muted)" fontSize={11} tickLine={false} unit="kg" />
                <Tooltip
                  formatter={(value) => [`${value} kg`, 'CO₂ Avoided']}
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    borderRadius: '12px',
                    borderColor: 'var(--color-line)',
                    color: 'var(--color-text)',
                    fontSize: '12px',
                    boxShadow: 'var(--shadow-soft-md)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="co2"
                  stroke="var(--color-primary)"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#impactCo2Grad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Accessible Table for Screen Readers */}
          <div className="sr-only">
            <h3>Weekly CO₂ Avoided Ledger</h3>
            <table>
              <thead>
                <tr>
                  <th scope="col">Day</th>
                  <th scope="col">CO₂ Avoided (kg)</th>
                  <th scope="col">Plastic Diverted (g)</th>
                </tr>
              </thead>
              <tbody>
                {WEEKLY_IMPACT_DATA.map((row) => (
                  <tr key={row.day}>
                    <td>{row.day}</td>
                    <td>{row.co2} kg</td>
                    <td>{row.plastic} g</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shareable Impact Card (5 Cols) (Feature 24 & Feature 59) */}
        <div className="lg:col-span-5 space-y-3">
          <div
            ref={shareCardRef}
            className="p-6 rounded-3xl bg-surface-sunken border border-line shadow-soft-sm space-y-4 text-text"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Eco Sense Impact Ledger
              </span>
              <span className="text-xs font-medium text-muted">Local Data</span>
            </div>

            <div className="flex items-center gap-3 py-1">
              <div className="w-12 h-12 rounded-2xl bg-primary text-primary-contrast flex items-center justify-center text-2xl shadow-soft-xs">
                {currentUser?.avatar || '🌱'}
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-heading leading-snug">
                  {currentUser?.name || 'Conscious Explorer'}
                </h3>
                <span className="text-xs font-medium text-primary">{level.title}</span>
              </div>
            </div>

            {/* Impact Metric Numbers */}
            <div className="grid grid-cols-3 gap-2 text-center py-2 border-y border-line">
              <div>
                <div className="flex items-center justify-center text-primary mb-0.5">
                  <Wind className="w-4 h-4" />
                </div>
                <div className="font-serif font-bold text-base text-heading">{totalCo2Saved} kg</div>
                <div className="text-xs text-muted font-medium">CO₂ Avoided</div>
              </div>
              <div>
                <div className="flex items-center justify-center text-warning mb-0.5">
                  <Ban className="w-4 h-4" />
                </div>
                <div className="font-serif font-bold text-base text-heading">{totalPlasticAvoided} g</div>
                <div className="text-xs text-muted font-medium">Plastic Diverted</div>
              </div>
              <div>
                <div className="flex items-center justify-center text-accent mb-0.5">
                  <Droplets className="w-4 h-4" />
                </div>
                <div className="font-serif font-bold text-base text-heading">{totalWaterSaved} L</div>
                <div className="text-xs text-muted font-medium">Water Saved</div>
              </div>
            </div>

            <div className="text-xs text-muted flex justify-between font-normal">
              <span>{orders.length} conscious orders placed</span>
              <span>Minimal Waste Packing</span>
            </div>
          </div>

          {/* Download / Share Card Button */}
          <button
            type="button"
            onClick={handleExportCard}
            disabled={exportingCard}
            className="w-full py-3 px-5 rounded-full bg-surface hover:bg-surface-sunken border border-line text-heading font-medium text-xs flex items-center justify-center gap-2 shadow-soft-xs transition active:scale-98 min-h-[44px] cursor-pointer"
          >
            {exportingCard ? <Sparkles className="w-4 h-4 text-primary animate-spin" /> : <Download className="w-4 h-4 text-primary" />}
            <span>{exportingCard ? 'Rendering Card...' : 'Download Shareable Impact Card (PNG)'}</span>
          </button>
        </div>
      </div>

      {/* Achievements & Badges Grid */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-line shadow-soft-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            <h2 className="font-serif font-bold text-base sm:text-lg text-heading">
              Environmental Milestones & Badges
            </h2>
          </div>
          <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
            {badges.filter((b) => b.unlocked).length} of {badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border text-center transition ${
                b.unlocked
                  ? 'bg-surface-sunken border-primary/30 shadow-soft-xs'
                  : 'bg-surface-sunken/40 border-line opacity-40'
              }`}
            >
              <div className="text-3xl mb-1.5">{b.icon}</div>
              <div className="font-semibold text-xs text-heading">{b.name}</div>
              <div className="text-xs text-muted mt-1 leading-snug">{b.desc}</div>
              {b.unlocked && (
                <span className="inline-block mt-2 text-xs font-semibold text-primary">
                  ✓ Unlocked
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Orders & Address Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-surface border border-line shadow-soft-sm space-y-3">
          <div className="flex items-center gap-2 text-heading font-semibold text-sm">
            <MapPin className="w-4 h-4 text-primary" />
            <span>Saved Conscious Delivery Address</span>
          </div>
          <div className="p-4 rounded-2xl bg-surface-sunken border border-line text-xs text-secondary">
            <div className="font-semibold text-heading">{currentUser?.name || 'Ayush Sharma'}</div>
            <div className="mt-1 leading-relaxed">Flat 402, Green Meadows Residency, Bengaluru, Karnataka - 560034</div>
            <div className="mt-2 text-xs text-primary font-medium">
              ⚡ EV Courier Route Optimized
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-surface border border-line shadow-soft-sm flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center gap-2 text-heading font-semibold text-sm">
              <Package className="w-4 h-4 text-primary" />
              <span>Order History & Status</span>
            </div>
            <p className="text-xs text-muted mt-1">
              You have {orders.length} order{orders.length !== 1 ? 's' : ''} logged with estimated carbon savings.
            </p>
          </div>

          <Link
            to="/orders"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-primary hover:bg-primary-hover text-primary-contrast font-medium text-xs transition shadow-soft-xs min-h-[44px]"
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
          <p className="text-xs text-secondary font-normal">
            Select an eco persona. Stored locally on your device with no cloud uploads.
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
                className={`p-4 rounded-2xl border text-center transition-all duration-200 hover:scale-105 cursor-pointer flex flex-col items-center gap-2 min-h-[44px] ${
                  currentUser?.avatar === av.emoji
                    ? 'border-primary bg-primary/10 shadow-soft-xs ring-2 ring-primary/20'
                    : 'border-line bg-surface hover:border-primary/40'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-surface-sunken border border-line flex items-center justify-center text-3xl shadow-soft-xs">
                  {av.emoji}
                </div>
                <div className="text-xs font-semibold text-heading">
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
