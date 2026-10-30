import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../src/context/ThemeContext';
import { I18nProvider } from '../src/context/I18nContext';
import { CartProvider } from '../src/context/CartContext';
import { FEATURES, isFeatureEnabled } from '../src/lib/features';
import CinematicNavbar from '../src/components/cinematic/CinematicNavbar';
import CinematicFooter from '../src/components/cinematic/CinematicFooter';
import HamburgerDrawer from '../src/components/cinematic/HamburgerDrawer';
import BackToTop from '../src/components/cinematic/BackToTop';
import VignetteOverlay from '../src/components/cinematic/VignetteOverlay';
import GrainOverlay from '../src/components/cinematic/GrainOverlay';
import CustomCursor from '../src/components/cinematic/CustomCursor';
import FirstVisitPreloader from '../src/components/cinematic/FirstVisitPreloader';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';

function wrapWithProviders(children) {
  return (
    <MemoryRouter>
      <ThemeProvider>
        <I18nProvider defaultLang="en">
          <CartProvider>
            {children}
          </CartProvider>
        </I18nProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe('Tier 1: Cinematic Design Shell Test Suite', () => {
  beforeEach(() => {
    // Reset flags to Tier 1 default
    FEATURES.CINEMATIC_SHELL = true;
    FEATURES.CUSTOM_CURSOR = true;
    FEATURES.GRAIN_OVERLAY = true;
    FEATURES.CINEMATIC_LANDING = false;
    FEATURES.CINEMATIC_SCENE = false;

    // Ensure reduceEffects is false in test environment
    try {
      localStorage.setItem('ecomart_reduce_effects', 'false');
      localStorage.setItem('ecomart_judge_mode', 'false');
      localStorage.setItem('ecomart_high_contrast', 'false');
    } catch {}
  });

  it('verifies Tier 1 feature flags configuration', () => {
    expect(isFeatureEnabled('cinematicShell')).toBe(true);
    expect(isFeatureEnabled('customCursor')).toBe(true);
    expect(isFeatureEnabled('grainOverlay')).toBe(true);
    expect(isFeatureEnabled('cinematicLanding')).toBe(false);
    expect(isFeatureEnabled('cinematicScene')).toBe(false);
  });

  it('renders CinematicNavbar with brand logo, primary nav, cart and hamburger button', () => {
    const html = renderToString(wrapWithProviders(<CinematicNavbar />));
    expect(html).toContain('Eco Sense');
    expect(html).toContain('Shop');
    expect(html).toContain('Swap My List');
    expect(html).toContain('Check a Claim');
    expect(html).toContain('My Impact');
    expect(html).toContain('aria-label="Open all features menu"');
  });

  it('renders HamburgerDrawer grouping all essential features across sections', () => {
    const html = renderToString(wrapWithProviders(<HamburgerDrawer isOpen={true} onClose={() => {}} />));
    // Verify grouping titles
    expect(html).toContain('Core Commerce');
    expect(html).toContain('Fast Scanners');
    expect(html).toContain('Research &amp; Playgrounds');
    expect(html).toContain('Integrity &amp; Community');
    expect(html).toContain('Account &amp; Controls');

    // Verify key destinations are present
    expect(html).toContain('/shop');
    expect(html).toContain('/transform');
    expect(html).toContain('/truth-lab');
    expect(html).toContain('/impact');
    expect(html).toContain('/scan');
    expect(html).toContain('/barcodes');
    expect(html).toContain('/courtroom');
    expect(html).toContain('/dilemmas');
    expect(html).toContain('/self-audit');
    expect(html).toContain('/learn');
    expect(html).toContain('/news');
    expect(html).toContain('/contact');
    expect(html).toContain('/settings');
  });

  it('renders CinematicFooter with school project notice, manifesto statement, and 2026 year', () => {
    const html = renderToString(wrapWithProviders(<CinematicFooter />));
    expect(html).toContain('Eco Sense');
    expect(html).toContain('Sample products for a school project. Prices and impact numbers are estimates.');
    expect(html).toContain('2026');
    expect(html).toContain('/contact');
    expect(html).toContain('/truth-lab');
  });

  it('renders BackToTop with accessible 44px touch target and aria-label', () => {
    const html = renderToString(wrapWithProviders(<BackToTop />));
    expect(html).toContain('aria-label="Scroll back to top"');
    expect(html).toContain('w-11 h-11');
  });

  it('renders VignetteOverlay as fixed background vignette', () => {
    const html = renderToString(wrapWithProviders(<VignetteOverlay />));
    expect(html).toContain('fixed inset-0');
    expect(html).toContain('radial-gradient');
  });

  it('renders GrainOverlay with offline SVG noise filter', () => {
    const html = renderToString(wrapWithProviders(<GrainOverlay />));
    expect(html).toContain('feTurbulence');
    expect(html).toContain('fractalNoise');
  });

  it('renders CustomCursor and FirstVisitPreloader components gracefully', () => {
    const cursorHtml = renderToString(wrapWithProviders(<CustomCursor />));
    expect(cursorHtml).toContain('fixed top-0 left-0');

    const preloaderHtml = renderToString(wrapWithProviders(<FirstVisitPreloader />));
    // SSR renders inactive state or null
    expect(typeof preloaderHtml).toBe('string');
  });

  it('renders CinematicNavbar through root Navbar when cinematicShell is true', () => {
    FEATURES.CINEMATIC_SHELL = true;
    const html = renderToString(wrapWithProviders(<Navbar />));
    expect(html).toContain('aria-label="Open all features menu"');
  });

  it('restores LegacyNavbar through root Navbar when cinematicShell is false', () => {
    FEATURES.CINEMATIC_SHELL = false;
    const html = renderToString(wrapWithProviders(<Navbar />));
    expect(html).toContain('header');
  });

  it('restores LegacyFooter through root Footer when cinematicShell is false', () => {
    FEATURES.CINEMATIC_SHELL = false;
    const html = renderToString(wrapWithProviders(<Footer />));
    expect(html).toContain('footer');
  });
});
