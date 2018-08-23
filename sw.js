// static cache versions

const staticCacheName = 'restaurant-reviews-v1';


self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(staticCacheName).then(cache => {
      return cache.addAll([
          '/',
         './index.html',
         './restaurant.html',
         './idb.js',
         './js/dbhelper.js',
         './js/leaflet.js',
         './js/main.js',
         './js/map.js',
         './js/restaurant_info.js',
         './js/script.js',
         './data/restaurants.json',
         './css/styles.css',
         './css/fontawesome-all.css',
         './css/leaflet.css',
         './css/responsive.cs',
         './css/styles.css',
         './css/images/marker-icon.png',
         './css/images/marker-icon-2x.png',
         './css/images/marker-shadow.png'
      ]);
    })
  );
});


self.addEventListener('activate', event => {
event.waitUntil(clients.claim());
});


//fetch cache

self.addEventListener('fetch', event => {
 event.respondWith(caches.match(event.request).then(response => {
  return response || fetch(event.request);
 }).catch(event => {
   console.log('Service Worker error caching and fetching');
 }))
});