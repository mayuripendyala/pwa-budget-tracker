const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/index.js",
    "/indexDB.js",
    "/assets/icons/icon-192x192.png",
    "/assets/icons/icon-512x512.png",
    "/manifest.webmanifest",
    "/styles.css",
    "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
    "https://cdn.jsdelivr.net/npm/chart.js@2.8.0"
    
];

const CACHE_NAME ="static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

self.addEventListener("install", function(event) {
    console.log("used to register the service worker");
    event.waitUntil(
        caches
          .open(CACHE_NAME)
          .then((cache) => {
              return cache.addAll(FILES_TO_CACHE)
            })
          .then(self.skipWaiting())
      )
});


self.addEventListener("fetch", (event) => {
    console.log('used to intercept requests so we can check for the file or data in the cache');
    

    event.respondWith(
        fetch(event.request)
        .catch(() => {
            return caches.open(CACHE_NAME)
                .then((cache) => {
                    return cache.match(event.request)
                })
        })
    );
}); 



self.addEventListener('activate', (event)=>{
    console.log('this event triggers  when the service worker is activates');
    event.waitUntil(
        caches.keys()
            .then((keyList) => {
                return Promise.all(keyList.map((key) => {
                    if(key !== CACHE_NAME) {
                        console.log('[service worker] removing old cache',key);
                        return caches.delete(key);
                    }
                }))
            })
            .then(() => self.clients.claim())
    )

})