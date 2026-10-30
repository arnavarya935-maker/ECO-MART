import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../src/context/ThemeContext';
import { I18nProvider } from '../src/context/I18nContext';
import { ProductsProvider } from '../src/context/ProductsContext';
import { CartProvider } from '../src/context/CartContext';
import { FEATURES, isFeatureEnabled } from '../src/lib/features';
import CinematicHero from '../src/components/cinematic/CinematicHero';
import CinematicStory from '../src/components/cinematic/CinematicStory';
import CinematicMosaic from '../src/components/cinematic/CinematicMosaic';
import CinematicAtlas from '../src/components/cinematic/CinematicAtlas';
import CinematicClosing from '../src/components/cinematic/CinematicClosing';
import ChapterRail from '../src/components/cinematic/ChapterRail';
import LayeredCanvasBackground from '../src/components/cinematic/LayeredCanvasBackground';
import CinematicHome from '../src/components/cinematic/CinematicHome';
import HomePage from '../src/pages/HomePage';

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

describe('Tier 2: Cinematic Landing Page Test Suite', () => {
  beforeEach(() => {
    FEATURES.CINEMATIC_SHELL = true;
    FEATURES.cinematicShell = true;
    FEATURES.CINEMATIC_LANDING = true;
    FEATURES.cinematicLanding = true;
    FEATURES.CINEMATIC_SCENE = false;
    FEATURES.cinematicScene = false;

    try {
      localStorage.setItem('ecomart_reduce_effects', 'false');
      localStorage.setItem('ecomart_judge_mode', 'false');
    } catch {}
  });

  it('verifies Tier 2 feature flags configuration', () => {
    expect(isFeatureEnabled('cinematicLanding')).toBe(true);
    expect(isFeatureEnabled('cinematicShell')).toBe(true);
    expect(isFeatureEnabled('cinematicScene')).toBe(false);
  });

  it('renders Chapter 00 CinematicHero with split layout, numbered chips, and live preview card', () => {
    const html = renderToString(wrapWithProviders(<CinematicHero />));
    expect(html).toContain('Chapter 00 — The First Choice');
    expect(html).toContain('Shop with purpose.');
    expect(html).toContain('01');
    expect(html).toContain('Discover');
    expect(html).toContain('02');
    expect(html).toContain('Swap');
    expect(html).toContain('03');
    expect(html).toContain('Decide');
    expect(html).toContain('04');
    expect(html).toContain('Impact');
    expect(html).toContain('Featured Alternative');
    expect(html).toContain('Grade');
    expect(html).not.toMatch(/\bNaN\b/);
    expect(html).not.toMatch(/\bundefined\b/);
  });

  it('renders CinematicHero in Hindi without layout breakage', () => {
    const html = renderToString(wrapWithProviders(<CinematicHero />, 'hi'));
    expect(html).toContain('सोच समझकर खरीदारी करें।');
    expect(html).toContain('सामान्य प्लास्टिक की वस्तुओं को आसान टिकाऊ विकल्पों से बदलें');
  });

  it('renders Chapter 01 CinematicStory with ruled stats band and real computed numbers', () => {
    const html = renderToString(wrapWithProviders(<CinematicStory />));
    expect(html).toContain('01 — The Living Ledger');
    expect(html).toContain('Sample Products');
    expect(html).toContain('Everyday Categories');
    expect(html).toContain('Plastic-Free Packaging');
    expect(html).toContain('Catalog EcoScore Mean');
    // Ensure real numbers appear and no NaN or undefined
    expect(html).not.toMatch(/\bNaN\b/);
    expect(html).not.toMatch(/\bundefined\b/);
  });

  it('renders Chapter 02 CinematicMosaic with 1 large and 2 stacked featured cards', () => {
    const html = renderToString(wrapWithProviders(<CinematicMosaic />));
    expect(html).toContain('02 — Selected Alternatives');
    expect(html).toContain('Replace conventional with conscious.');
    expect(html).toContain('Add to Cart');
    expect(html).toContain('Inspect');
    expect(html).not.toMatch(/\bNaN\b/);
    expect(html).not.toMatch(/\bundefined\b/);
  });

  it('renders Chapter 03 CinematicAtlas with 5 numbered architectural plates', () => {
    const html = renderToString(wrapWithProviders(<CinematicAtlas />));
    expect(html).toContain('03 — How Eco Sense Works');
    expect(html).toContain('Understand');
    expect(html).toContain('Match');
    expect(html).toContain('Optimise');
    expect(html).toContain('Explain');
    expect(html).toContain('Share');
    expect(html).toContain('/scan');
    expect(html).toContain('/shop');
    expect(html).toContain('/transform');
    expect(html).toContain('/truth-lab');
    expect(html).toContain('/impact');
  });

  it('renders Chapter 04 CinematicClosing with oversized title and CTA to Swap My List', () => {
    const html = renderToString(wrapWithProviders(<CinematicClosing />));
    expect(html).toContain('04 — Take Action');
    expect(html).toContain('Start with your list.');
    expect(html).toContain('/transform');
    expect(html).toContain('Sample products for a school project. Prices and impact numbers are estimates.');
  });

  it('renders ChapterRail with 5 navigational jump points', () => {
    const html = renderToString(wrapWithProviders(<ChapterRail />));
    expect(html).toContain('aria-label="Chapter navigation rail"');
    expect(html).toContain('Chapter 00');
    expect(html).toContain('Chapter 01');
    expect(html).toContain('Chapter 02');
    expect(html).toContain('Chapter 03');
    expect(html).toContain('Chapter 04');
  });

  it('renders LayeredCanvasBackground with radial gradients and botanical foliage SVG', () => {
    const html = renderToString(wrapWithProviders(<LayeredCanvasBackground />));
    expect(html).toContain('radial-gradient');
    expect(html).toContain('<svg');
  });

  it('renders full CinematicHome component and through HomePage when cinematicLanding is true', () => {
    FEATURES.CINEMATIC_LANDING = true;
    FEATURES.cinematicLanding = true;
    const directHtml = renderToString(wrapWithProviders(<CinematicHome />));
    expect(directHtml).toContain('Chapter 00 — The First Choice');

    const html = renderToString(wrapWithProviders(<HomePage />));
    expect(html).toContain('Chapter 00 — The First Choice');
    expect(html).toContain('01 — The Living Ledger');
    expect(html).toContain('02 — Selected Alternatives');
    expect(html).toContain('03 — How Eco Sense Works');
    expect(html).toContain('04 — Take Action');
  });

  it('restores LegacyHomePage through HomePage when cinematicLanding is false', () => {
    FEATURES.CINEMATIC_LANDING = false;
    FEATURES.cinematicLanding = false;
    const html = renderToString(wrapWithProviders(<HomePage />));
    expect(html).toContain('w-full bg-surface antialiased');
  });
});
