import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Heart, Package, Award, Sparkles, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function UserMenu({ setActivePage }) {
  const {
    currentUser,
    isAuthenticated,
    isGuest,
    userLevel,
    logout,
    setAuthModalOpen,
    setAuthModalMode
  } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => {
            setAuthModalMode('login');
            setAuthModalOpen(true);
          }}
          className="px-3.5 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-850 dark:text-stone-200 text-xs font-bold transition active:scale-95 border border-stone-200 dark:border-stone-700"
        >
          Sign In
        </button>
      </div>
    );
  }

  // Generate initials from name
  const initials = (currentUser.name || 'User')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 p-1.5 pr-2.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-emerald-400 transition shadow-2xs group"
      >
        {currentUser.avatar ? (
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-7 h-7 rounded-xl object-cover"
          />
        ) : (
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-black text-xs flex items-center justify-center">
            {initials}
          </div>
        )}
        <div className="text-left hidden sm:block">
          <div className="text-xs font-extrabold text-stone-900 dark:text-stone-100 leading-none line-clamp-1">
            {currentUser.name.split(' ')[0]}
          </div>
          <div className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 leading-none mt-0.5">
            {userLevel.icon} {userLevel.name.split(' ')[1] || userLevel.name}
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-600 transition" />
      </button>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-3xl bg-[#FAF7F0] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl p-2 z-50 animate-slide-up text-stone-850 dark:text-stone-100">
          {/* User info banner */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200/80 dark:border-stone-750 space-y-1 mb-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs text-stone-900 dark:text-stone-100">
                {currentUser.name}
              </span>
              {isGuest ? (
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                  Guest
                </span>
              ) : (
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  Member
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-500 line-clamp-1">{currentUser.email}</p>

            {/* Eco Points pill */}
            <div className="pt-2 flex items-center justify-between text-xs border-t border-stone-100 dark:border-stone-800 mt-2">
              <span className="text-stone-500 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Eco Points:</span>
              </span>
              <span className="font-black text-emerald-700 dark:text-emerald-400">
                {currentUser.ecoPoints || 0} pts
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setActivePage('profile');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-emerald-700 transition"
            >
              <User className="w-4 h-4 text-emerald-600" />
              <span>My Profile & Level</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setActivePage('orders');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-emerald-700 transition"
            >
              <Package className="w-4 h-4 text-emerald-600" />
              <span>Order History</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setActivePage('wishlist');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-emerald-700 transition"
            >
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Saved Wishlist</span>
            </button>

            <div className="border-t border-stone-200 dark:border-stone-800 my-1 pt-1" />

            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
