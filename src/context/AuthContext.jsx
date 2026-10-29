import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { hashPassword, generateSalt } from '../lib/crypto';
import { isFirebaseConfigured, loginWithFirebaseGoogle } from '../lib/firebase';
import {
  isSupabaseConfigured,
  getSupabase,
  loginWithSupabaseGoogle,
  loginWithSupabaseEmail,
  signupWithSupabaseEmail
} from '../lib/supabase';

const AuthContext = createContext();

export function calculateEcoLevel(points = 0) {
  if (points >= 3500) {
    return { level: 4, name: 'Forest Guardian', icon: '🌳', nextAt: 5000, progress: 100 };
  }
  if (points >= 1500) {
    const progress = Math.min(100, Math.round(((points - 1500) / (3500 - 1500)) * 100));
    return { level: 3, name: 'Ancient Tree', icon: '🌲', nextAt: 3500, progress };
  }
  if (points >= 500) {
    const progress = Math.min(100, Math.round(((points - 500) / (1500 - 500)) * 100));
    return { level: 2, name: 'Thriving Sapling', icon: '🌿', nextAt: 1500, progress };
  }
  const progress = Math.min(100, Math.round((points / 500) * 100));
  return { level: 1, name: 'Conscious Seedling', icon: '🌱', nextAt: 500, progress };
}

export function AuthProvider({ children }) {
  // Current session
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ecomart_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'signup'

  // Persist session locally
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('ecomart_session', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('ecomart_session');
      }
    } catch {}
  }, [currentUser]);

  // Listen to Supabase Auth state changes (OAuth redirects, token refresh)
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let unsub = null;

    getSupabase().then((client) => {
      if (!client) return;

      // Check existing Supabase session on startup if no local session exists
      client.auth.getSession().then(({ data }) => {
        const session = data?.session;
        if (session?.user) {
          const u = session.user;
          setCurrentUser((prev) => {
            if (prev) return prev;
            return {
              id: u.id,
              name: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'Conscious Shopper',
              email: u.email,
              isGuest: false,
              provider: u.app_metadata?.provider || 'supabase',
              avatar: u.user_metadata?.avatar_url || null,
              ecoPoints: 150,
              createdAt: u.created_at || new Date().toISOString()
            };
          });
        }
      }).catch(() => {});

      const { data: authListener } = client.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const u = session.user;
          setCurrentUser({
            id: u.id,
            name: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'Conscious Shopper',
            email: u.email,
            isGuest: false,
            provider: u.app_metadata?.provider || 'supabase',
            avatar: u.user_metadata?.avatar_url || null,
            ecoPoints: 150,
            createdAt: u.created_at || new Date().toISOString()
          });
          setAuthModalOpen(false);
          if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }
      });

      unsub = authListener?.subscription;
    }).catch(() => {});

    return () => {
      unsub?.unsubscribe?.();
    };
  }, []);

  // Read local users database
  const getLocalUsers = useCallback(() => {
    try {
      const users = localStorage.getItem('ecomart_users');
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  }, []);

  const saveLocalUsers = useCallback((users) => {
    try {
      localStorage.setItem('ecomart_users', JSON.stringify(users));
    } catch {}
  }, []);

  // Sign up locally and in Supabase if configured
  const signup = useCallback(async ({ name, email, password }) => {
    if (!name || !name.trim()) {
      throw new Error('Please provide your name.');
    }
    if (!email || !email.includes('@')) {
      throw new Error('Please provide a valid email address.');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }
    const cleanEmail = email.trim().toLowerCase();

    // 1. If Supabase is configured, register user in Supabase Auth
    if (isSupabaseConfigured) {
      try {
        const data = await signupWithSupabaseEmail(name, cleanEmail, password);
        if (data.user) {
          const sessionUser = {
            id: data.user.id,
            name: name.trim(),
            email: cleanEmail,
            isGuest: false,
            provider: 'supabase',
            avatar: null,
            ecoPoints: 100,
            createdAt: data.user.created_at || new Date().toISOString()
          };
          setCurrentUser(sessionUser);
          setAuthModalOpen(false);
          return sessionUser;
        }
      } catch (err) {
        // If Supabase returned an explicit email collision or validation error, throw it
        if (err.message && (err.message.includes('already registered') || err.message.includes('invalid'))) {
          throw err;
        }
      }
    }

    // 2. Local fallback registration
    const users = getLocalUsers();
    if (users.some((u) => u.email === cleanEmail)) {
      throw new Error('An account with this email address already exists.');
    }

    const salt = generateSalt();
    const hashedPassword = await hashPassword(password, salt);

    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      salt,
      hashedPassword,
      isGuest: false,
      provider: 'local',
      avatar: null,
      ecoPoints: 100, // Welcome bonus points
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveLocalUsers(users);

    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      isGuest: false,
      provider: 'local',
      avatar: null,
      ecoPoints: 100,
      createdAt: newUser.createdAt
    };

    setCurrentUser(sessionUser);
    setAuthModalOpen(false);
    return sessionUser;
  }, [getLocalUsers, saveLocalUsers]);

  // Log in locally or via Supabase
  const login = useCallback(async ({ email, password }) => {
    if (!email || !email.includes('@')) {
      throw new Error('Please provide a valid email address.');
    }
    if (!password) {
      throw new Error('Please enter your password.');
    }
    const cleanEmail = email.trim().toLowerCase();

    // 1. If Supabase is configured, try Supabase login first
    if (isSupabaseConfigured) {
      try {
        const data = await loginWithSupabaseEmail(cleanEmail, password);
        if (data.user) {
          const sessionUser = {
            id: data.user.id,
            name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Conscious Shopper',
            email: data.user.email,
            isGuest: false,
            provider: 'supabase',
            avatar: data.user.user_metadata?.avatar_url || null,
            ecoPoints: 100,
            createdAt: data.user.created_at || new Date().toISOString()
          };
          setCurrentUser(sessionUser);
          setAuthModalOpen(false);
          return sessionUser;
        }
      } catch (err) {
        // If password was incorrect or user not in Supabase, fall through to check local account
        if (err.message && err.message.includes('Invalid login credentials')) {
          // Check local users before giving up
        }
      }
    }

    // 2. Check local users database
    const users = getLocalUsers();
    const user = users.find((u) => u.email === cleanEmail);

    if (!user) {
      throw new Error('No account found with this email address.');
    }

    const testHash = await hashPassword(password, user.salt);
    if (testHash !== user.hashedPassword) {
      throw new Error('Incorrect password. Please try again.');
    }

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      isGuest: false,
      provider: 'local',
      avatar: user.avatar || null,
      ecoPoints: user.ecoPoints || 100,
      createdAt: user.createdAt
    };

    setCurrentUser(sessionUser);
    setAuthModalOpen(false);
    return sessionUser;
  }, [getLocalUsers]);

  // Log in with Google via Supabase or Firebase
  const loginWithGoogle = useCallback(async () => {
    if (isSupabaseConfigured) {
      return await loginWithSupabaseGoogle();
    }
    if (isFirebaseConfigured) {
      const firebaseUser = await loginWithFirebaseGoogle();
      const sessionUser = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'Conscious Shopper',
        email: firebaseUser.email,
        isGuest: false,
        provider: 'google',
        avatar: firebaseUser.photoURL || null,
        ecoPoints: 150,
        createdAt: new Date().toISOString()
      };
      setCurrentUser(sessionUser);
      setAuthModalOpen(false);
      return sessionUser;
    }
    throw new Error('Google Sign-in is not configured. Please add Supabase or Firebase keys to .env');
  }, []);

  // Log in as Guest (local-first session, zero network requirement)
  const loginAsGuest = useCallback(() => {
    const guestUser = {
      id: `guest-${Date.now()}`,
      name: 'Conscious Explorer',
      email: 'guest@ecomart.local',
      isGuest: true,
      provider: 'guest',
      avatar: null,
      ecoPoints: 50,
      createdAt: new Date().toISOString()
    };
    setCurrentUser(guestUser);
    setAuthModalOpen(false);
    return guestUser;
  }, []);

  const logout = useCallback(async () => {
    if (isSupabaseConfigured) {
      try {
        const client = await getSupabase();
        if (client) await client.auth.signOut();
      } catch {}
    }
    setCurrentUser(null);
  }, []);

  const addEcoPoints = useCallback((points) => {
    setCurrentUser((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        ecoPoints: (prev.ecoPoints || 0) + points
      };
      if (!prev.isGuest && prev.provider === 'local') {
        const users = getLocalUsers();
        const idx = users.findIndex((u) => u.id === prev.id);
        if (idx !== -1) {
          users[idx].ecoPoints = updated.ecoPoints;
          saveLocalUsers(users);
        }
      }
      return updated;
    });
  }, [getLocalUsers, saveLocalUsers]);

  const updateUserAvatar = useCallback((avatar) => {
    setCurrentUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, avatar };
      if (!prev.isGuest && prev.provider === 'local') {
        const users = getLocalUsers();
        const idx = users.findIndex((u) => u.id === prev.id);
        if (idx !== -1) {
          users[idx].avatar = avatar;
          saveLocalUsers(users);
        }
      }
      return updated;
    });
  }, [getLocalUsers, saveLocalUsers]);

  const userLevel = useMemo(() => calculateEcoLevel(currentUser?.ecoPoints || 0), [currentUser?.ecoPoints]);
  const isCloudAuthConfigured = isSupabaseConfigured || isFirebaseConfigured;

  const value = useMemo(() => ({
    currentUser,
    user: currentUser,
    isAuthenticated: Boolean(currentUser),
    isGuest: Boolean(currentUser?.isGuest),
    userLevel,
    authModalOpen,
    setAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    signup,
    login,
    loginWithGoogle,
    loginAsGuest,
    logout,
    addEcoPoints,
    updateUserAvatar,
    isFirebaseConfigured,
    isSupabaseConfigured,
    isCloudAuthConfigured
  }), [
    currentUser,
    userLevel,
    authModalOpen,
    authModalMode,
    signup,
    login,
    loginWithGoogle,
    loginAsGuest,
    logout,
    addEcoPoints,
    updateUserAvatar,
    isCloudAuthConfigured
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
