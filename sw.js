const CACHE_NAME = 'audiobook-player-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/wall-speaks.jpg',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Also cache all your audio files - add additional chapters as needed
const AUDIO_FILES = [
  '/chapters/01_стіна_промовляє.mp3',
  '/chapters/02_вступ.mp3',
  // Add all chapter files here
];

// Combined assets to cache
const ALL_ASSETS = [...ASSETS_TO_CACHE, ...AUDIO_FILES];

// Installation - Cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ALL_ASSETS);
      })
  );
});

// Activation - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => {
          return name !== CACHE_NAME;
        }).map((name) => {
          return caches.delete(name);
        })
      );
    })
  );
});

// Fetch - Serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request).then((fetchResponse) => {
          // Optional: Cache new requests on-the-fly
          return fetchResponse;
        });
      })
      .catch(() => {
        // Fallback for offline experience
        if (event.request.url.includes('.mp3')) {
          return new Response('Audio file not available offline', { status: 404 });
        }
      })
  );
}); 