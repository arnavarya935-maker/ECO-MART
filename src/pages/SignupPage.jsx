import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { calculatePasswordStrength } from '../lib/crypto';
import { playSound } from '../lib/audio';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, loginAsGuest } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const strength = calculatePasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await signup({ name, email, password });
      playSound('success');
      navigate('/');
    } catch (err) {
      setError(err.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4 pb-20 animate-fade-in">
      <div className="p-8 sm:p-10 rounded-3xl bg-surface border border-line shadow-soft-md space-y-6">
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Start Your Journey
          </span>
          <h1 className="text-3xl font-serif font-bold text-heading tracking-tight">
            Join Eco Sense
          </h1>
          <p className="text-xs sm:text-sm text-secondary">
            Track your personal carbon offset & turn shopping into responsible living.
          </p>
        </div>

        {/* Device-Only Account Privacy Notice */}
        <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 text-xs text-text flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div className="leading-snug">
            <span className="font-semibold text-heading">Privacy Notice:</span> Accounts are stored safely and solely on this device in private storage. No account or profile data is ever uploaded to external servers.
          </div>
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
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Maya Patel"
                className="w-full pl-11 pr-4 py-3 rounded-full bg-surface-sunken border border-line text-xs text-text placeholder-muted focus:outline-hidden focus:border-primary focus:bg-surface transition min-h-[44px]"
              />
            </div>
          </div>

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

            {/* Password strength meter */}
            {password && (
              <div className="mt-2.5 px-1 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-medium">
                  <span className="text-muted">Security:</span>
                  <span className={strength.text}>{strength.label}</span>
                </div>
                <div className="w-full h-1.5 bg-surface-sunken border border-line rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${strength.color}`}
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-primary hover:bg-primary-hover disabled:opacity-50 text-primary-contrast font-medium text-xs shadow-soft-xs transition flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
          >
            <span>{loading ? 'Creating...' : 'Create Account (+100 Eco Points)'}</span>
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
            Continue as Guest
          </button>

          <div className="text-center pt-2 text-xs text-muted">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-primary hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
