import React, { useState } from 'react';
import {
  User, Award, ShieldCheck, Leaf, Wind, Droplets, Ban, MapPin,
  Clock, Package, ArrowRight, Sparkles, Flame, CheckCircle, ExternalLink
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

// Historical impact data for Recharts area visualization
const IMPACT_HISTORY_DATA = [
  { month: 'Nov', co2: 2.1, plastic: 180, water: 45 },
  { month: 'Dec', co2: 4.8, plastic: 320, water: 90 },
  { month: 'Jan', co2: 6.5, plastic: 490, water: 160 },
  { month: 'Feb', co2: 9.2, plastic: 650, water: 220 },
  { month: 'Mar', co2: 14.6, plastic: 980, water: 340 }
];

const CATEGORY_IMPACT_DATA = [
  { category: 'Kitchen', co2Saved: 5.4 },
  { category: 'Personal', co2Saved: 3.2 },
  { category: 'Bags', co2Saved: 2.8 },
  { category: 'Home', co2Saved: 2.1 },
  { category: 'Stationery', co2Saved: 1.1 }
];

export default function ProfilePage({ setActivePage }) {
  const { user, isGuest } = useAuth();
  const { orders } = useCart();

  // Tier calculation based on orders / points
  const points = (orders.length * 80) + 120;
  let level = { title: '🌱 Conscious Seedling', next: '🌿 Sapling', target: 250, progress: (points / 250) * 100 };
  if (points >= 500) {
    level = { title: '🛡️ Forest Guardian', next: 'Max Level', target: 1000, progress: 100 };
  } else if (points >= 300) {
    level = { title: '🌳 Mature Tree', next: '🛡️ Forest Guardian', target: 500, progress: ((points - 300) / 200) * 100 };
  } else if (points >= 200) {
    level = { title: '🌿 Thriving Sapling', next: '🌳 Mature Tree', target: 300, progress: ((points - 200) / 100) * 100 };
  }

  // Lifetime saved aggregates
  const totalCo2Saved = (orders.reduce((acc, o) => acc + (o.impact?.savedCo2 || o.impact?.co2Saved || 1.4), 0) + 4.8).toFixed(1);
  const totalPlasticAvoided = Math.round(orders.reduce((acc, o) => acc + (o.impact?.plasticAvoided || 120), 0) + 450);
  const totalWaterSaved = Math.round(orders.reduce((acc, o) => acc + (o.impact?.waterSaved || 60), 0) + 190);

  const badges = [
    { id: 'b1', name: 'Planetary Steward', icon: '🌍', desc: 'Placed orders with verified carbon savings', unlocked: true },
    { id: 'b2', name: 'Zero Plastic Pioneer', icon: '🎋', desc: 'Opted for 100% plastic-free packaging', unlocked: true },
    { id: 'b3', name: 'Eco Alchemist', icon: '✨', desc: 'Completed a 1-tap cleaner product swap', unlocked: true },
    { id: 'b4', name: 'Local Champion', icon: '📍', desc: 'Supported regional artisans < 150km away', unlocked: points >= 200 },
    { id: 'b5', name: 'Tree Planter', icon: '🌳', desc: 'Avoided over 10kg of lifecycle CO₂', unlocked: points >= 300 },
    { id: 'b6', name: 'Forest Guardian', icon: '🛡️', desc: 'Reached the highest environmental echelon', unlocked: points >= 500 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-900 to-stone-900 text-white border border-emerald-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border-2 border-emerald-400/40 flex items-center justify-center text-3xl font-black text-emerald-300 shadow-inner">
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-3xl" />
            ) : (
              user?.name ? user.name.slice(0, 2).toUpperCase() : 'CE'
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {user?.name || 'Conscious Explorer'}
              </h1>
              {isGuest && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-stone-950">
                  Guest Session
                </span>
              )}
            </div>
            <div className="text-xs text-stone-300 mt-1">{user?.email || 'guest@ecomart.local'}</div>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold border border-white/20">
              <span>{level.title}</span>
            </div>
          </div>
        </div>

        {/* Tier Progress & Points */}
        <div className="bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/10 w-full md:w-72 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-stone-300">Level Progression</span>
            <span className="text-amber-400">{points} Eco-Points</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, Math.max(10, level.progress))}%` }}
            />
          </div>
          <div className="text-[10px] text-stone-400 text-right">
            Next Tier: {level.next} ({points}/{level.target} pts)
          </div>
        </div>
      </div>

      {/* Lifetime Saved Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
            <Wind className="w-4 h-4 text-sky-500" /> Lifecycle CO₂ Avoided
          </div>
          <div className="text-3xl font-black text-stone-900 dark:text-stone-100">
            {totalCo2Saved} <span className="text-base font-normal text-stone-400">kg</span>
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
            ~{(totalCo2Saved * 4.2).toFixed(0)} km car travel offset
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
            <Ban className="w-4 h-4 text-rose-500" /> Plastic Waste Diverted
          </div>
          <div className="text-3xl font-black text-stone-900 dark:text-stone-100">
            {totalPlasticAvoided} <span className="text-base font-normal text-stone-400">g</span>
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
            ~{Math.round(totalPlasticAvoided / 20)} single-use bottles prevented
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
            <Droplets className="w-4 h-4 text-blue-500" /> Freshwater Conserved
          </div>
          <div className="text-3xl font-black text-stone-900 dark:text-stone-100">
            {totalWaterSaved} <span className="text-base font-normal text-stone-400">L</span>
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
            Zero toxic textile dye runoff
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
            <Package className="w-4 h-4 text-emerald-600" /> Conscious Orders
          </div>
          <div className="text-3xl font-black text-stone-900 dark:text-stone-100">
            {orders.length}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 font-semibold">
            100% plastic-free packaging
          </div>
        </div>
      </div>

      {/* Interactive Recharts Impact Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cumulative Savings Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
                Monthly Saved Carbon (kg CO₂)
              </h3>
              <p className="text-xs text-stone-500">Live progression across your shopping history</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
              +58% vs baseline
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={IMPACT_HISTORY_DATA}>
                <defs>
                  <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1C1917',
                    borderRadius: '12px',
                    border: '1px solid #444',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="co2" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorCo2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Savings Breakdown */}
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
                CO₂ Avoidance by Category (kg)
              </h3>
              <p className="text-xs text-stone-500">Where your eco choices create the highest impact</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CATEGORY_IMPACT_DATA}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="category" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1C1917',
                    borderRadius: '12px',
                    border: '1px solid #444',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="co2Saved" fill="#059669" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Gamification Badges Gallery */}
      <div className="p-6 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
          <div>
            <h3 className="text-lg font-black text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              Sustainability Badges Gallery
            </h3>
            <p className="text-xs text-stone-500">Earn badges through conscious swaps and zero-waste orders.</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-full">
            {badges.filter((b) => b.unlocked).length} of {badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-3.5 rounded-2xl border text-center transition ${
                b.unlocked
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                  : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 opacity-40'
              }`}
            >
              <div className="text-3xl mb-1.5">{b.icon}</div>
              <div className="font-bold text-xs text-stone-900 dark:text-stone-100">{b.name}</div>
              <div className="text-[10px] text-stone-500 mt-1 leading-snug">{b.desc}</div>
              {b.unlocked && (
                <span className="inline-block mt-2 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                  ✓ Unlocked
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Saved Addresses & Orders Link Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-sm">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Saved Conscious Delivery Address</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300">
            <div className="font-bold text-stone-900 dark:text-stone-100">{user?.name || 'Ayush Sharma'}</div>
            <div className="mt-1">Flat 402, Green Meadows Residency, Bengaluru, Karnataka - 560034</div>
            <div className="mt-2 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
              ⚡ EV Courier Route Verified
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-sm">
              <Package className="w-4 h-4 text-emerald-600" />
              <span>Order History & Impact Receipts</span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              You have {orders.length} placed orders with verified lifecycle carbon receipts.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActivePage('orders')}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition shadow-sm"
          >
            <span>View All Orders ({orders.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
