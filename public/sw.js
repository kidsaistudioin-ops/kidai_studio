// KidAI Studio Official PWA Service Worker (v1.0.0)
const CACHE_NAME = 'kidai-studio-cache-v1';

const STATIC_ASSETS = [
  '/',
  '/home',
  '/seekho',
  '/studio',
  '/play',
  '/chat',
  '/manifest.json',
  '/icons/icon.svg',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg'
];

// 1. Install Event: Cache Core Static Shell
self.addEventListener('install', (event) => {
  console.log('⚡ [KidAI PWA] Service Worker Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 [KidAI PWA] Caching App Shell & Core Assets');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('⚠️ Some static assets could not be cached immediately:', err);
      });
    })
  );
  self.skipWaiting();
});

// 2. Activate Event: Clean Old Caches
self.addEventListener('activate', (event) => {
  console.log('🚀 [KidAI PWA] Service Worker Activated');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('🧹 [KidAI PWA] Deleting Outdated Cache:', name);
            return caches.delete(name);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 3. Fetch Event: Stale-While-Revalidate Caching Strategy
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET and API / auth requests (Always fetch fresh from server)
  if (event.request.method !== 'GET' || url.pathname.startsWith('/api/') || url.pathname.startsWith('/auth/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          // Cache successful responses for future offline use
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline and not in cache, fallback to root or cached shell
          return cachedResponse || caches.match('/home') || caches.match('/');
        });

      // Return cached response immediately if available, then update in background
      return cachedResponse || fetchPromise;
    })
  );
});
