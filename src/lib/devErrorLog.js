/**
 * Dev-only Error Recorder
 * Captures window 'error', 'unhandledrejection', console.error, and ErrorBoundary errors
 * with route and timestamp for fast diagnostics. Disabled in production.
 */

const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';
const MAX_LOG_SIZE = 50;
const recordedErrors = [];

function getCurrentRoute() {
  if (typeof window === 'undefined') return '/';
  try {
    return window.location.pathname + window.location.search + window.location.hash;
  } catch {
    return '/';
  }
}

export function recordError({ type = 'error', message = '', stack = '', componentStack = '', route = null }) {
  if (!isDev) return;

  const entry = {
    id: `err-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    message: typeof message === 'string' ? message : String(message || 'Unknown error'),
    stack: stack || null,
    componentStack: componentStack || null,
    route: route || getCurrentRoute(),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    timestamp: Date.now()
  };

  recordedErrors.unshift(entry);
  if (recordedErrors.length > MAX_LOG_SIZE) {
    recordedErrors.pop();
  }
}

export function recordErrorBoundaryError(error, errorInfo) {
  recordError({
    type: 'ErrorBoundary',
    message: error?.message || String(error),
    stack: error?.stack,
    componentStack: errorInfo?.componentStack
  });
}

export function getRecordedErrors() {
  return [...recordedErrors];
}

export function clearRecordedErrors() {
  recordedErrors.length = 0;
}

// Auto-initialize dev listeners once in browser
if (isDev && typeof window !== 'undefined' && !window.__devErrorLogInitialized) {
  window.__devErrorLogInitialized = true;

  window.addEventListener('error', (event) => {
    recordError({
      type: 'window.onerror',
      message: event.message || 'Window error',
      stack: event.error?.stack || `${event.filename}:${event.lineno}:${event.colno}`
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    recordError({
      type: 'unhandledrejection',
      message: reason?.message || String(reason || 'Unhandled promise rejection'),
      stack: reason?.stack
    });
  });

  // Intercept console.error to record dev warnings/errors
  const originalConsoleError = console.error;
  console.error = (...args) => {
    try {
      const msg = args.map((a) => (typeof a === 'string' ? a : (a?.message || JSON.stringify(a) || String(a)))).join(' ');
      recordError({
        type: 'console.error',
        message: msg,
        stack: args.find((a) => a instanceof Error)?.stack || null
      });
    } catch {}
    originalConsoleError.apply(console, args);
  };
}

