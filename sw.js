const CACHE_NAME='ecell-v1';
const urlsToCache=['/','/index.html','/manifest.json','/icon-192.png','/icon-512.png','/qris-e-cell.jpg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(urlsToCache)))});
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});
