import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function pwaManifestPlugin() {
  return {
    name: 'pwa-manifest-plugin',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      if (!fs.existsSync(distDir)) return;

      const precacheAssets = [];
      function scan(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            scan(fullPath);
          } else if (entry.isFile()) {
            const rel = path.relative(distDir, fullPath).replace(/\\/g, '/');
            if (rel !== 'sw.js' && !rel.endsWith('.map')) {
              precacheAssets.push('/' + rel);
            }
          }
        }
      }
      scan(distDir);

      const hash = crypto
        .createHash('sha256')
        .update(precacheAssets.sort().join('|'))
        .digest('hex')
        .slice(0, 10);
      const cacheName = `ecomart-cache-${hash}`;

      const swContent = `// Auto-generated Service Worker with Build-Time Precache Manifest
const CACHE_NAME = ${JSON.stringify(cacheName)};
const OFFLINE_FALLBACK = '/offline.html';

const PRECACHE_ASSETS = ${JSON.stringify(precacheAssets, null, 2)};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        PRECACHE_ASSETS.map((asset) =>
          cache.add(asset).catch((err) => {
            console.warn('[SW] Could not precache:', asset, err);
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Purging old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Stale-While-Revalidate for HTML navigations
  if (event.request.mode === 'navigate' || event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            }
            return networkResponse;
          })
          .catch(() => {
            return cachedResponse || caches.match(OFFLINE_FALLBACK) || caches.match('/index.html');
          });

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const clone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone);
        });
        return networkResponse;
      }).catch(() => {
        if (event.request.destination === 'image') {
          return caches.match('/icons.svg');
        }
      });
    })
  );
});
`;

      fs.writeFileSync(path.join(distDir, 'sw.js'), swContent, 'utf-8');
      console.log(`[PWA Plugin] Generated dist/sw.js with ${precacheAssets.length} precached assets (Cache: ${cacheName})`);
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    pwaManifestPlugin(),
  ],
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three') || id.includes('@react-three')) {
            return 'three';
          }
          if (id.includes('node_modules/recharts')) {
            return 'recharts';
          }
          if (id.includes('node_modules/firebase')) {
            return 'firebase';
          }
        }
      }
    }
  }
});
