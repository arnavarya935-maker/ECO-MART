import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import ErrorBoundary from '../src/components/ErrorBoundary';

function ProblemChild({ shouldThrow, message }) {
  if (shouldThrow) {
    throw new Error(message || 'Simulated failure in test component');
  }
  return <div data-testid="child">Normal content</div>;
}

describe('ErrorBoundary Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children when no error occurs', () => {
    const html = renderToString(
      <ErrorBoundary>
        <ProblemChild shouldThrow={false} />
      </ErrorBoundary>
    );
    expect(html).toContain('Normal content');
  });

  it('renders fallback UI with friendly message and reload options when error occurs', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    // In static SSR renderToString, errors propagate unless caught by try/catch or class component
    // Let's test ErrorBoundary's state and getDerivedStateFromError directly
    const error = new Error('Test component crash');
    const derivedState = ErrorBoundary.getDerivedStateFromError(error);
    expect(derivedState).toEqual({ hasError: true, error });

    // Test render output when state hasError is true
    const boundary = new ErrorBoundary({});
    boundary.state = { hasError: true, error, errorInfo: null, copied: false, isResetting: false };
    const rendered = boundary.render();
    const html = renderToString(rendered);

    expect(html).toContain('Something went sideways');
    expect(html).toContain('Reload Application');
    expect(html).toContain('Clear Cache &amp; Reset');
    expect(html).toContain('Diagnostic details');
    expect(html).toContain('Test component crash');

    consoleError.mockRestore();
  });

  it('detects chunk import errors and adapts the title accordingly', () => {
    const chunkError = new Error('Failed to fetch dynamically imported module: https://eco-mart-shop.vercel.app/assets/ShopPage-123.js');
    const boundary = new ErrorBoundary({});
    boundary.state = { hasError: true, error: chunkError, errorInfo: null, copied: false, isResetting: false };

    const rendered = boundary.render();
    const html = renderToString(rendered);

    expect(html).toContain('App Update in Progress');
    expect(html).toContain('A new version of Eco Sense was just published');
  });
});
