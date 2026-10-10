import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      // Purge all legacy and current theme keys so it strictly resets to light
      ['ecomart_theme', 'ecomart_theme_v2', 'ecomart_theme_v3', 'ecomart_theme_v4', 'theme'].forEach((k) => {
        localStorage.removeItem(k);
      });
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('dark');
      }
    } catch (_e) {}
    return 'light'; // Strictly light theme
  });

  const [reduceEffects, setReduceEffects] = useState(() => {
    try {
      const saved = localStorage.getItem('ecomart_reduce_effects');
      if (saved !== null) return JSON.parse(saved);

      // Default to ON if user prefers reduced motion or if WebGL is unavailable (school laptops)
      const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let hasWebGL = true;
      try {
        const canvas = document.createElement('canvas');
        hasWebGL = !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
      } catch (_e) {
        hasWebGL = false;
      }
      return prefersReduced || !hasWebGL;
    } catch (_e) {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (_e) {}
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('ecomart_reduce_effects', JSON.stringify(reduceEffects));
      if (reduceEffects) {
        document.documentElement.classList.add('reduced-motion');
      } else {
        document.documentElement.classList.remove('reduced-motion');
      }
    } catch (_e) {}
  }, [reduceEffects]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleReduceEffects = () => {
    setReduceEffects((prev) => !prev);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === 'dark',
        toggleTheme,
        setTheme,
        reduceEffects,
        reducedMotion: reduceEffects,
        toggleReduceEffects,
        toggleReducedMotion: toggleReduceEffects,
        setReduceEffects
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
