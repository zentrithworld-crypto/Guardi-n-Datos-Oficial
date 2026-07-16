const CACHE_NOMBRE = 'guardian-v4-final';
const ARCHIVOS_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './icono-192.png',
    './icono-512.png'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NOMBRE).then(cache => cache.addAll(ARCHIVOS_CACHE))
        .then(() => self.skipWaiting())
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(respuesta => respuesta || fetch(e.request))
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(nombres => {
            return Promise.all(
                nombres.filter(n => n !== CACHE_NOMBRE).map(n => caches.delete(n))
            );
        }).then(() => self.clients.claim())
    );
});
