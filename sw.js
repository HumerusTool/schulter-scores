/* Offlinebetrieb: alle Dateien beim ersten Aufruf ablegen */
const CACHE = 'score-erhebung-v1';
const DATEIEN = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(DATEIEN)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k =>
    Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(treffer => treffer || fetch(e.request).then(antwort => {
      const kopie = antwort.clone();
      caches.open(CACHE).then(c => c.put(e.request, kopie));
      return antwort;
    }).catch(() => caches.match('./index.html')))
  );
});
