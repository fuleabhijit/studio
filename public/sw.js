// This is a basic service worker for PWA functionality.
// It will cache the main assets of the app.
const CACHE_NAME = 'agrimedic-ai-cache-v1';
const urlsToCache = [
  '/',
  '/styles/globals.css',
  // Add other important assets here. For a Next.js app, this would be more complex
  // and is often handled by libraries like next-pwa.
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
