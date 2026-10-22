import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { playSound } from '../lib/audio';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginAsGuest } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ email, password });
      playSound('success');
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4 pb-20 animate-fade-in">
      <div className="p-8 sm:p-10 rounded-3xl bg-surface border border-line shadow-soft-md space-y-6">
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Welcome Back
          </span>
          <h1 className="text-3xl font-serif font-bold text-heading tracking-tight">
            Sign In to EcoMart
          </h1>
          <p className="text-xs sm:text-sm text-secondary">
            Access your conscious cart, orders, and planetary savings ledger.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-danger/10 border border-danger/30 text-xs text-danger flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-danger shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-heading uppercase tracking-wider mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-11 pr-4 py-3 rounded-full bg-surface-sunken border border-line text-xs text-text placeholder-muted focus:outline-hidden focus:border-primary focus:bg-surface transition min-h-[44px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-heading uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-3 rounded-full bg-surface-sunken border border-line text-xs text-text placeholder-muted focus:outline-hidden focus:border-primary focus:bg-surface transition min-h-[44px]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1.5 text-muted hover:text-text absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-primary hover:bg-primary-hover disabled:opacity-50 text-primary-contrast font-medium text-xs shadow-soft-xs transition flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
          >
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4 text-accent" />
          </button>
        </form>

        <div className="pt-2 space-y-2 border-t border-line">
          <button
            type="button"
            onClick={() => {
              loginAsGuest();
              playSound('success');
              navigate('/');
            }}
            className="w-full py-3 rounded-full bg-surface-sunken hover:bg-surface border border-line text-heading font-medium text-xs transition min-h-[44px] cursor-pointer"
          >
            Continue as Guest (100% Offline)
          </button>

          <div className="text-center pt-2 text-xs text-muted">
            Don't have an account yet?{' '}
            <Link
              to="/signup"
              className="font-semibold text-primary hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
