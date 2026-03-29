var CACHE_VERSION = 'v2';

self.addEventListener('install', function(e){
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(names){
      return Promise.all(
        names.map(function(name){
          return caches.delete(name);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(e){
  e.respondWith(
    fetch(e.request).catch(function(){
      return caches.match(e.request);
    })
  );
});
