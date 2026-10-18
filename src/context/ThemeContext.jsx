import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('ecomart_theme');
      if (saved === 'dark') return 'dark';
      return 'light'; // Default to img2m3 light editorial theme
    } catch (_e) {
      return 'light';
    }
  });

  const [reduceEffects, setReduceEffects] = useState(() => {
    try {
      const saved = localStorage.getItem('ecomart_reduce_effects');
      if (saved !== null) return JSON.parse(saved);

      const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let webglMissing = false;
      try {
        const canvas = document.createElement('canvas');
        webglMissing = !(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
      } catch (_e) {
        webglMissing = true;
      }
      return prefersReduced || webglMissing;
    } catch (_e) {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ecomart_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
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
