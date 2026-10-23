import { defineConfig, loadEnv } from 'vite';
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

      const allAssets = [];
      function scan(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            scan(fullPath);
          } else if (entry.isFile()) {
            const rel = path.relative(distDir, fullPath).replace(/\\/g, '/');
            if (rel !== 'sw.js' && rel !== 'offline-manifest.json' && !rel.endsWith('.map')) {
              allAssets.push('/' + rel);
            }
          }
        }
      }
      scan(distDir);

      // Extract entry scripts and stylesheets from dist/index.html
      const indexHtmlPath = path.join(distDir, 'index.html');
      const entryAssetsFromHtml = new Set();
      if (fs.existsSync(indexHtmlPath)) {
        const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
        const scriptMatch = indexHtml.matchAll(/<(?:script|link)[^>]+(?:src|href)="([^">]+)"/g);
        for (const m of scriptMatch) {
          const url = m[1];
          if (url.startsWith('/assets/') || url.startsWith('assets/')) {
            entryAssetsFromHtml.add(url.startsWith('/') ? url : '/' + url);
          }
        }
      }

      // App shell assets: HTML, entry JS and CSS, fonts, icons, offline.html, manifest
      const appShell = [];
      const idleAssets = [];

      for (const asset of allAssets) {
        const isCoreShell =
          asset === '/index.html' ||
          asset === '/offline.html' ||
          asset === '/manifest.json' ||
          asset === '/favicon.svg' ||
          asset === '/icons.svg';
        const isFont = asset.startsWith('/fonts/');
        const isEntryAsset = entryAssetsFromHtml.has(asset);

        if (isCoreShell || isFont || isEntryAsset) {
          appShell.push(asset);
        } else {
          idleAssets.push(asset);
        }
      }

      // Ensure root URL is included in app shell
      if (!appShell.includes('/')) {
        appShell.unshift('/');
      }

      const buildTimestamp = Date.now();
      const hash = crypto
        .createHash('sha256')
        .update(`${buildTimestamp}|${allAssets.sort().join('|')}`)
        .digest('hex')
        .slice(0, 10);
      const cacheName = `ecomart-cache-${hash}`;

      // Write offline manifest for client idle caching
      const offlineManifest = {
        cacheName,
        buildTimestamp,
        appShell,
        idleAssets
      };
      fs.writeFileSync(
        path.join(distDir, 'offline-manifest.json'),
        JSON.stringify(offlineManifest, null, 2),
        'utf-8'
      );

      const swContent = `// EcoMart Service Worker - App Shell Precached, Runtime First-Use & Immediate Activation
const CACHE_NAME = ${JSON.stringify(cacheName)};
const OFFLINE_FALLBACK = '/offline.html';
const APP_SHELL = ${JSON.stringify(appShell, null, 2)};
const IDLE_ASSETS = ${JSON.stringify(idleAssets, null, 2)};

// 1. Install: Precache App Shell and activate immediately (skipWaiting)
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        APP_SHELL.map((asset) =>
          cache.add(asset).catch((err) => {
            console.warn('[SW] App Shell precache failed for:', asset, err);
          })
        )
      );
    })
  );
});

// 2. Activate: Clean stale caches and claim clients immediately
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

// 3. Message: User-prompted skipWaiting and background idle asset filling
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data.type === 'FILL_IDLE_CACHE') {
    event.waitUntil(
      caches.open(CACHE_NAME).then(async (cache) => {
        for (const asset of IDLE_ASSETS) {
          try {
            const existing = await cache.match(asset);
            if (!existing) {
              await cache.add(asset);
            }
          } catch (err) {
            console.warn('[SW] Idle background cache skipped:', asset, err);
          }
        }
        const clients = await self.clients.matchAll();
        clients.forEach((c) => c.postMessage({ type: 'OFFLINE_READY' }));
      })
    );
  }
});

// 4. Fetch: Navigation stale-while-revalidate & Cache-First with runtime caching
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Navigation requests: HTML shell with offline fallback
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

  // All other GET requests: Cache-First, dynamically cache on first use
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
          return networkResponse;
        })
        .catch(() => {
          if (event.request.destination === 'image') {
            return caches.match('/icons.svg');
          }
        });
    })
  );
});
`;

      fs.writeFileSync(path.join(distDir, 'sw.js'), swContent, 'utf-8');
      console.log(`[PWA Plugin] Generated dist/sw.js (App Shell: ${appShell.length}, Idle: ${idleAssets.length}, Cache: ${cacheName})`);
    }
  };
}

function apiProxyPlugin() {
  return {
    name: 'api-proxy-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0];
        if (url !== '/api/agent' && url !== '/api/detect-greenwash') {
          return next();
        }

        const { isRateLimited, handleAgentRequest, handleGreenwashRequest } = await import('./server/proxyServer.js');
        const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';

        if (isRateLimited(ip)) {
          res.writeHead(429, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Rate limit exceeded. Please wait a minute.' }));
          return;
        }

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
          res.writeHead(204);
          res.end();
          return;
        }

        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let raw = '';
        req.on('data', (chunk) => {
          raw += chunk;
          if (raw.length > 50000) {
            req.destroy();
          }
        });

        req.on('end', async () => {
          try {
            const body = JSON.parse(raw || '{}');
            if (url === '/api/agent') {
              await handleAgentRequest(body, res);
            } else if (url === '/api/detect-greenwash') {
              await handleGreenwashRequest(body, res);
            }
          } catch {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Malformed JSON payload' }));
          }
        });
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  if (env.GEMINI_API_KEY) process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
  if (env.ECO_AGENT_API_KEY) process.env.ECO_AGENT_API_KEY = env.ECO_AGENT_API_KEY;

  return {
    plugins: [
      react(),
      tailwindcss(),
      pwaManifestPlugin(),
      apiProxyPlugin(),
    ],
    build: {
    }
  };
});
