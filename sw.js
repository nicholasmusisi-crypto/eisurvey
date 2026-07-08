const CACHE = 'eisurvey-v9';
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
  // Cache-first only for the field-recorder app shell; this service worker
  // registers at root scope, so without this check it would also intercept
  // and permanently stale-cache unrelated pages (e.g. the fundraiser tools).
  if (ev.request.method !== 'GET') return;
  const url = new URL(ev.request.url);
  if (url.origin !== location.origin) return;
  const path = '.' + url.pathname;
  if (!SHELL.includes(path)) return;
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
