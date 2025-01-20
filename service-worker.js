self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('patheticai-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/icon.png',
        '/manifest.json',
        '/styles.css',
        '/app.js'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
