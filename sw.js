const CACHE_NAME = 'jadwal-pelajaran-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  'https://cdn.tailwindcss.com',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Event: Install
// Saat service worker di-install, buka cache dan tambahkan file-file utama
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Event: Fetch
// Saat aplikasi meminta resource (seperti file atau data),
// service worker akan mencegatnya dan menyajikan dari cache jika ada.
// Jika tidak ada di cache, baru akan mengambil dari network.
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

// Event: Activate
// Membersihkan cache lama jika ada versi cache yang baru.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});