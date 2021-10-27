const cacheV = "chattenger-v6";
const assets = [
  "/",
  "/index.html",
  "/offline.html",  
  "/css/f_o1.css",
  "/css/main_font.css",
  "/css/main.css",
  "/script/jquery.js",
  "/script/kit.js",
  "/script/main.js",
  "/script/crypto.js",
  "/script/nextstep.js",
  "/script/photofilter.js",
  "/script/setup.js",
  "/script/socket.io.js",
  "/dejavu-serif.book.ttf",
  "/manifest.json",
  "/sel.png",
  "/assets/bg3.jpg",
  "/assets/smoothbg.jpg",
  "/assets/ring.mp3",
  "/assets/c9.mp3",
  "/assets/messenger.mp3",
  "/assets/offline.gif",
  "/assets/spinner.svg",
  "/assets/icons/icon-72x72.png",
  "/assets/icons/icon-96x96.png",
  "/assets/icons/icon-128x128.png",
  "/assets/icons/icon-144x144.png",
  "/assets/icons/icon-192x192.png",
  "/assets/icons/icon-384x384.png",
  "/assets/icons/icon-512x512.png",
]

self.addEventListener("install", installer => {
  installer.waitUntil(
    caches.open(cacheV).then(cache => {
      cache.addAll(assets)
    })
  )
})
self.addEventListener("fetch", fetcher => {    
    //if(!navigator.onLine){
    fetcher.respondWith(
      caches.match(fetcher.request).then(res => {
        return res || fetch(fetcher.request)
      })
    )
    //}
  })
  self.addEventListener('activate', function(event) {
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.filter(function(cacheName) {            
          }).map(function(cacheName) {
            return caches.delete(cacheName);
          })
        );
      })
    );
  });
  