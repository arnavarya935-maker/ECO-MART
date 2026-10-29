import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './lib/devErrorLog';
import './index.css';
import App from './App.jsx';

// Vite dynamic chunk import error handler (prevents blank screen/error on new deployments)
if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (event) => {
    console.warn('[Vite] Preload error detected, reloading page for fresh assets...', event);
    const reloadKey = 'ecomart_vite_preload_reload';
    const lastReload = Number(sessionStorage.getItem(reloadKey) || 0);
    if (Date.now() - lastReload > 8000) {
      sessionStorage.setItem(reloadKey, String(Date.now()));
      window.location.reload();
    }
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

if (typeof window !== 'undefined' && 'serviceWorker' in navigator && (import.meta.env.PROD || process.env.NODE_ENV === 'production')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        // Check if an update is already waiting and activate it immediately
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          window.dispatchEvent(new CustomEvent('sw-update-waiting', { detail: { registration } }));
        }

        // Check for updates on network
        registration.update?.();

        // Listen for new updates found
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              newWorker.postMessage({ type: 'SKIP_WAITING' });
              window.dispatchEvent(new CustomEvent('sw-update-waiting', { detail: { registration } }));
            }
          });
        });
      })
      .catch((err) => {
        console.warn('[SW] Registration failed:', err);
      });

    // Reload window when new service worker takes control (guarded against multiple firings)
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  });
}
