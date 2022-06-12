const cacheV = "chattenger-v17.3";
const assets = [
  "/",  
  "/offline.html",  
  "/css/f_o1.css",
  "/css/main_font.css",
  "/css/main.css",
  "/script/jquery.js",
  "/script/Extrafeatures.js",
  "/script/serviceworkersetup.js",
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
  "/assets/wallpaper.jpeg",
  "/assets/rose.jpg",
  "/assets/bg2.jpeg",
  "/assets/bg3.jpg",
  "/assets/new2.jpg",
  "/assets/new.jpg",
  "/assets/rose-red.jpg",
  "/assets/new4.jpg",
  "/assets/new5.jpg",
  "/assets/new8.jpg",
  "/assets/new6.jpg",
  "/assets/leaf.jpg",
  "/assets/new8.png",  
  "/assets/smoothbg.jpg",
  "/assets/ring.mp3",
  "/assets/disconnect.mp3",
  "/assets/c9.mp3",
  "/assets/fav.mp3",
  "/assets/a1.mp3",
  "/assets/beap.mp3",
  "/assets/reconnecting.mp3",
  "/assets/rocket.gif",
  "/assets/sel.png",
  "/assets/typing.mp3",
  "/assets/messenger.mp3",
  "/assets/Astroblaster.png",
  "/assets/offline.gif",
  "/assets/spinner.svg",
  "/assets/spinner.gif",
  "/assets/chess.jpeg",
  "/assets/mario.jpeg",
  "/assets/car_race.jpeg",
  "/assets/flappybird.jpeg",  
  "/assets/icons/icon-72x72.png",
  "/assets/icons/icon-96x96.png",
  "/assets/icons/icon-128x128.png",
  "/assets/icons/icon-144x144.png",
  "/assets/icons/icon-192x192.png",
  "/assets/icons/icon-384x384.png",
  "/assets/icons/icon-512x512.png",
]

self.addEventListener("install", installer => {
  self.skipWaiting();
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
        if(!res){
          console.log("Fetching ",fetcher.request);
        }
        return res || fetch(fetcher.request)
      })
    )
    //}
  })
  self.addEventListener('activate', function(event) {
    event.waitUntil(
      (async () => {
        const keys = await caches.keys();
        return keys.map(async (cache) => {
          if(cache !== cacheV) {
            console.log('Service Worker: Removing old cache: '+cache);
            await caches.delete(cache);
            window.location.reload();
            return;
          }
        })
      })()
    )
  });
  