// Minimal cache-first service worker for static assets
const CACHE_NAME = 'familex-cache-v1';
const ASSET_PATTERNS = [/\/_next\//, /\.css$/, /\.js$/, /\.woff2?$/];

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  const isAsset = ASSET_PATTERNS.some((re) => re.test(url.pathname));
  if (request.method !== 'GET' || !isAsset) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request);
      if (cached) return cached;
      const resp = await fetch(request);
      if (resp && resp.status === 200) {
        cache.put(request, resp.clone());
      }
      return resp;
    })
  );
});
