import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Theme state: defaults to light per design system rules
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('ecomart_theme');
      if (saved === 'dark') return 'dark';
      return 'light';
    } catch {
      return 'light';
    }
  });

  // Global "Reduce effects" toggle (Rule 5 & Feature 4)
  const [reduceEffects, setReduceEffects] = useState(() => {
    try {
      const saved = localStorage.getItem('ecomart_reduce_effects');
      if (saved !== null) return JSON.parse(saved);

      const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let webglMissing = false;
      try {
        const canvas = document.createElement('canvas');
        webglMissing = !(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
      } catch {
        webglMissing = true;
      }
      return prefersReduced || webglMissing;
    } catch {
      return false;
    }
  });

  // Feature 29: Accessibility options (High Contrast, Dyslexia Font, Text Size)
  const [highContrast, setHighContrast] = useState(() => {
    try {
      return localStorage.getItem('ecomart_high_contrast') === 'true';
    } catch {
      return false;
    }
  });

  const [dyslexicFont, setDyslexicFont] = useState(() => {
    try {
      return localStorage.getItem('ecomart_dyslexic_font') === 'true';
    } catch {
      return false;
    }
  });

  const [textSize, setTextSize] = useState(() => {
    try {
      return localStorage.getItem('ecomart_text_size') || 'normal';
    } catch {
      return 'normal';
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
    } catch {}
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('ecomart_reduce_effects', JSON.stringify(reduceEffects));
      if (reduceEffects) {
        document.documentElement.classList.add('reduced-motion');
      } else {
        document.documentElement.classList.remove('reduced-motion');
      }
    } catch {}
  }, [reduceEffects]);

  useEffect(() => {
    try {
      localStorage.setItem('ecomart_high_contrast', JSON.stringify(highContrast));
      if (highContrast) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
    } catch {}
  }, [highContrast]);

  useEffect(() => {
    try {
      localStorage.setItem('ecomart_dyslexic_font', JSON.stringify(dyslexicFont));
      if (dyslexicFont) {
        document.documentElement.classList.add('font-dyslexic');
      } else {
        document.documentElement.classList.remove('font-dyslexic');
      }
    } catch {}
  }, [dyslexicFont]);

  useEffect(() => {
    try {
      localStorage.setItem('ecomart_text_size', textSize);
      document.documentElement.classList.remove('text-size-large', 'text-size-xlarge');
      if (textSize === 'large') {
        document.documentElement.classList.add('text-size-large');
      } else if (textSize === 'xlarge') {
        document.documentElement.classList.add('text-size-xlarge');
      }
    } catch {}
  }, [textSize]);

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
        setReduceEffects,
        highContrast,
        setHighContrast,
        dyslexicFont,
        setDyslexicFont,
        textSize,
        setTextSize
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
