import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

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
        console.log('[SW] Registered successfully with scope:', registration.scope);

        // Check if an update is already waiting
        if (registration.waiting && navigator.serviceWorker.controller) {
          window.dispatchEvent(new CustomEvent('sw-update-waiting', { detail: { registration } }));
        }

        // Listen for new updates found
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              window.dispatchEvent(new CustomEvent('sw-update-waiting', { detail: { registration } }));
            }
          });
        });
      })
      .catch((err) => {
        console.warn('[SW] Registration failed:', err);
      });

    // Reload window when new service worker takes control
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  });
}
