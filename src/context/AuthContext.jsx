import React, { createContext, useContext, useState, useEffect } from 'react';
import { hashPassword, generateSalt } from '../lib/crypto';
import { isFirebaseConfigured, loginWithFirebaseGoogle } from '../lib/firebase';

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
    } catch (_e) {
      return null;
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'signup'

  // Persist session
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('ecomart_session', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('ecomart_session');
      }
    } catch (_e) {}
  }, [currentUser]);

  // Read local users database
  const getLocalUsers = () => {
    try {
      const users = localStorage.getItem('ecomart_users');
      return users ? JSON.parse(users) : [];
    } catch (_e) {
      return [];
    }
  };

  const saveLocalUsers = (users) => {
    try {
      localStorage.setItem('ecomart_users', JSON.stringify(users));
    } catch (_e) {}
  };

  // Sign up locally
  const signup = async ({ name, email, password }) => {
    const users = getLocalUsers();
    const cleanEmail = email.trim().toLowerCase();

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
  };

  // Log in locally
  const login = async ({ email, password }) => {
    const users = getLocalUsers();
    const cleanEmail = email.trim().toLowerCase();
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
  };

  // Log in with Google via Firebase
  const loginWithGoogle = async () => {
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
  };

  // Log in as Guest (100% offline, zero network requirement)
  const loginAsGuest = () => {
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
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addEcoPoints = (points) => {
    if (!currentUser) return;
    setCurrentUser((prev) => {
      const updated = {
        ...prev,
        ecoPoints: (prev.ecoPoints || 0) + points
      };
      // If local user, update in db too
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
  };

  const updateUserAvatar = (avatar) => {
    if (!currentUser) return;
    setCurrentUser((prev) => {
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
  };

  const userLevel = calculateEcoLevel(currentUser?.ecoPoints || 0);

  return (
    <AuthContext.Provider
      value={{
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
        isFirebaseConfigured
      }}
    >
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
