const CACHE = 'eisurvey-v8';
const SHELL = ['./field-recorder.html', './manifest.json', './icon.svg'];

self.addEventListener('install', ev => {
  ev.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', ev => {
  ev.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', ev => {
  // Cache-first for app shell; skip for non-GET and cross-origin
  if (ev.request.method !== 'GET') return;
  const url = new URL(ev.request.url);
  if (url.origin !== location.origin) return;
  ev.respondWith(
    caches.match(ev.request).then(cached => {
      if (cached) return cached;
      return fetch(ev.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(ev.request, clone));
        return res;
      });
    })
  );
});
