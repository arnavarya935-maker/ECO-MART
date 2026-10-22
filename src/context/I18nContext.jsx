import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { en } from '../i18n/en.js';
import { hi } from '../i18n/hi.js';
import { FEATURES } from '../lib/features.js';

const I18nContext = createContext(null);

const DICTIONARIES = {
  en,
  hi
};

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      if (!FEATURES.HINDI_LANGUAGE) return 'en';
      const saved = localStorage.getItem('ecomart_lang');
      return saved === 'hi' ? 'hi' : 'en';
    } catch {
      return 'en';
    }
  });

  const setLang = useCallback((newLang) => {
    const valid = newLang === 'hi' && FEATURES.HINDI_LANGUAGE ? 'hi' : 'en';
    setLangState(valid);
    try {
      localStorage.setItem('ecomart_lang', valid);
    } catch {}
  }, []);

  const toggleLanguage = useCallback(() => {
    setLang(lang === 'en' ? 'hi' : 'en');
  }, [lang, setLang]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (lang === 'hi') {
      document.documentElement.lang = 'hi';
      document.documentElement.classList.add('lang-hi');
      // Lazy load local Devanagari font chunk offline
      import('@fontsource/noto-sans-devanagari/index.css').catch(() => {});
    } else {
      document.documentElement.lang = 'en';
      document.documentElement.classList.remove('lang-hi');
    }
  }, [lang]);

  const t = useCallback((key, fallback) => {
    const dict = DICTIONARIES[lang];
    if (dict && dict[key] !== undefined) {
      return dict[key];
    }
    // Fallback to English dictionary
    if (DICTIONARIES.en[key] !== undefined) {
      return DICTIONARIES.en[key];
    }
    return fallback !== undefined ? fallback : key;
  }, [lang]);

  const contextValue = useMemo(() => ({
    lang,
    setLang,
    toggleLanguage,
    t
  }), [lang, setLang, toggleLanguage, t]);

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    const fallbackT = (key, fallback) => en[key] !== undefined ? en[key] : (fallback !== undefined ? fallback : key);
    return {
      t: fallbackT,
      lang: 'en',
      setLang: () => {},
      toggleLanguage: () => {}
    };
  }
  return context;
}

/**
 * Hook returning translation function and language state.
 * Usage: const { t, lang, setLang, toggleLanguage } = useT();
 */
export function useT() {
  const context = useI18n();
  return useMemo(() => ({
    t: context.t,
    lang: context.lang,
    setLang: context.setLang,
    toggleLanguage: context.toggleLanguage
  }), [context]);
}
