import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, Heart, Package, Sparkles, ChevronDown, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function UserMenu() {
  const navigate = useNavigate();
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
          className="px-3.5 py-2 rounded-2xl bg-surface-sunken hover:bg-surface-sunken text-heading text-xs font-sans font-medium transition active:scale-95 border border-line min-h-[44px] cursor-pointer"
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
        className="flex items-center gap-2 p-1.5 pr-2.5 rounded-2xl bg-surface-raised border border-line hover:border-primary transition shadow-2xs group min-h-[44px] cursor-pointer"
      >
        {currentUser.avatar ? (
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            width="28"
            height="28"
            loading="lazy"
            decoding="async"
            className="w-7 h-7 rounded-xl object-cover"
          />
        ) : (
          <div className="w-7 h-7 rounded-xl bg-primary text-primary-contrast font-sans font-bold text-xs flex items-center justify-center">
            {initials}
          </div>
        )}
        <div className="text-left hidden sm:block">
          <div className="text-xs font-sans font-semibold text-heading leading-none line-clamp-1">
            {currentUser.name.split(' ')[0]}
          </div>
          <div className="text-[10px] font-sans font-medium text-primary leading-none mt-0.5">
            {userLevel.icon} {userLevel.name.split(' ')[1] || userLevel.name}
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-muted group-hover:text-text transition" />
      </button>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-3xl bg-surface-raised border border-line shadow-soft-lg p-2.5 z-50 animate-slide-up text-heading">
          {/* User info banner */}
          <div className="p-3.5 rounded-2xl bg-surface-sunken border border-line space-y-1 mb-2">
            <div className="flex items-center justify-between">
              <span className="font-sans font-bold text-xs text-heading">
                {currentUser.name}
              </span>
              {isGuest ? (
                <span className="text-[10px] font-sans font-bold uppercase px-1.5 py-0.5 rounded bg-warning-subtle text-warning">
                  Guest
                </span>
              ) : (
                <span className="text-[10px] font-sans font-bold uppercase px-1.5 py-0.5 rounded bg-success-subtle text-primary">
                  Member
                </span>
              )}
            </div>
            <p className="text-[11px] font-sans text-muted line-clamp-1">{currentUser.email}</p>

            {/* Eco Points pill */}
            <div className="pt-2 flex items-center justify-between text-xs border-t border-line mt-2">
              <span className="text-secondary flex items-center gap-1 font-sans">
                <Sparkles className="w-3.5 h-3.5 text-warning" />
                <span>Eco Points:</span>
              </span>
              <span className="font-sans font-bold text-primary">
                {currentUser.ecoPoints || 0} pts
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-0.5 text-xs font-sans font-medium">
            <Link
              to="/profile"
              onClick={() => setMenuOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-surface-sunken text-secondary hover:text-heading transition min-h-[44px]"
            >
              <User className="w-4 h-4 text-primary" />
              <span>My Profile & Level</span>
            </Link>

            <Link
              to="/orders"
              onClick={() => setMenuOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-surface-sunken text-secondary hover:text-heading transition min-h-[44px]"
            >
              <Package className="w-4 h-4 text-primary" />
              <span>Order History</span>
            </Link>

            <Link
              to="/wishlist"
              onClick={() => setMenuOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-surface-sunken text-secondary hover:text-heading transition min-h-[44px]"
            >
              <Heart className="w-4 h-4 text-danger" />
              <span>Saved Wishlist</span>
            </Link>

            <Link
              to="/settings"
              onClick={() => setMenuOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-surface-sunken text-secondary hover:text-heading transition min-h-[44px]"
            >
              <Settings className="w-4 h-4 text-secondary" />
              <span>Settings & Preferences</span>
            </Link>

            <div className="border-t border-line my-1 pt-1" />

            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                logout();
                navigate('/');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-danger hover:bg-danger-subtle transition min-h-[44px] cursor-pointer"
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

