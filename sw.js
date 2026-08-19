/* TruckRoute Pro service worker v2 — network-first HTML so updates show immediately */
const CACHE = 'truckroute-v2';
const SHELL = ['./manifest.webmanifest','./icon-192.png','./icon-512.png','https://unpkg.com/leaflet@1.9.4/dist/leaflet.css','https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(SHELL.map(u => c.add(u)))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const isHTML = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');
  if (isHTML) { e.respondWith(fetch(req).catch(() => caches.match(req).then(h => h || caches.match('./index.html')))); return; }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req)));
});