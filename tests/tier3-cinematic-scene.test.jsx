import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';

// Ensure mock localStorage in Node.js test environment
const mockStorage = {};
globalThis.localStorage = {
  getItem: (k) => mockStorage[k] ?? null,
  setItem: (k, v) => { mockStorage[k] = String(v); },
  removeItem: (k) => { delete mockStorage[k]; },
  clear: () => { for (const k in mockStorage) delete mockStorage[k]; }
};

import { ThemeProvider } from '../src/context/ThemeContext';
import { I18nProvider } from '../src/context/I18nContext';
import { ProductsProvider } from '../src/context/ProductsContext';
import { CartProvider } from '../src/context/CartContext';
import { FEATURES, isFeatureEnabled } from '../src/lib/features';
import CinematicHome from '../src/components/cinematic/CinematicHome';
import CinematicHero from '../src/components/cinematic/CinematicHero';
import Cinematic3DWorld from '../src/components/cinematic/Cinematic3DWorld';
import LayeredCanvasBackground from '../src/components/cinematic/LayeredCanvasBackground';

function wrapWithProviders(children, lang = 'en') {
  return (
    <MemoryRouter>
      <ThemeProvider>
        <I18nProvider defaultLang={lang}>
          <ProductsProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </ProductsProvider>
        </I18nProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe('Tier 3: Cinematic 3D Scene Test Suite', () => {
  beforeEach(() => {
    FEATURES.CINEMATIC_SHELL = true;
    FEATURES.cinematicShell = true;
    FEATURES.CINEMATIC_LANDING = true;
    FEATURES.cinematicLanding = true;
    FEATURES.CINEMATIC_SCENE = true;
    FEATURES.cinematicScene = true;

    try {
      localStorage.setItem('ecomart_reduce_effects', 'false');
      localStorage.setItem('ecomart_judge_mode', 'false');
      localStorage.setItem('ecomart_high_contrast', 'false');
    } catch {}
  });

  it('verifies Tier 3 feature flag cinematicScene is enabled', () => {
    expect(isFeatureEnabled('cinematicScene')).toBe(true);
    expect(isFeatureEnabled('cinematicLanding')).toBe(true);
    expect(isFeatureEnabled('cinematicShell')).toBe(true);
  });

  it('renders CinematicHero containing the rising hero word "Eco Sense"', () => {
    const html = renderToString(wrapWithProviders(<CinematicHero />));
    expect(html).toContain('Eco Sense');
    expect(html).toContain('font-display');
  });

  it('renders Cinematic3DWorld container and canvas element', () => {
    const html = renderToString(wrapWithProviders(<Cinematic3DWorld fallback={<LayeredCanvasBackground />} />));
    expect(html).toContain('<canvas');
    expect(html).toContain('fixed inset-0 pointer-events-none');
  });

  it('falls back to LayeredCanvasBackground when cinematicScene is false', () => {
    FEATURES.CINEMATIC_SCENE = false;
    FEATURES.cinematicScene = false;
    const html = renderToString(wrapWithProviders(<CinematicHome />));
    // SVG silhouettes from Tier 2 LayeredCanvasBackground are present
    expect(html).toContain('<svg');
    expect(html).toContain('radial-gradient');
  });

  it('falls back to LayeredCanvasBackground when reduceEffects is enabled', () => {
    try {
      localStorage.setItem('ecomart_reduce_effects', 'true');
    } catch {}
    const html = renderToString(wrapWithProviders(<CinematicHome />));
    expect(html).toContain('radial-gradient');
  });

  it('disables 3D canvas when Judge Mode is enabled', () => {
    try {
      localStorage.setItem('ecomart_judge_mode', 'true');
    } catch {}
    const html = renderToString(wrapWithProviders(<CinematicHome />));
    expect(html).not.toContain('<canvas');
  });

  it('disables 3D canvas when High Contrast is enabled', () => {
    try {
      localStorage.setItem('ecomart_high_contrast', 'true');
    } catch {}
    const html = renderToString(wrapWithProviders(<CinematicHome />));
    expect(html).not.toContain('<canvas');
  });

  it('renders all 5 chapters within CinematicHome with Tier 3 active', () => {
    const html = renderToString(wrapWithProviders(<CinematicHome />));
    expect(html).toContain('Chapter 00 — The First Choice');
    expect(html).toContain('01 — The Living Ledger');
    expect(html).toContain('02 — Selected Alternatives');
    expect(html).toContain('03 — How Eco Sense Works');
    expect(html).toContain('04 — Take Action');
  });
});
