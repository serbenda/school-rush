// Service worker: primero intenta la red (para tener siempre la última versión)
// y, si no hay conexión, sirve lo guardado. Sube la versión si cambian los archivos.
const VERSION = 'school-rush-v2';
const JS = ['base', 'sonido', 'dibujo', 'personajes', 'peques', 'fondos', 'obstaculos', 'partida', 'pantalla', 'controles', 'menus'];
const ARCHIVOS = ['./', 'index.html', 'css/estilos.css', ...JS.map(n => `js/${n}.js`), 'manifest.webmanifest',
  'fonts/Fredoka.ttf', 'fonts/LilitaOne-Regular.ttf', 'icons/icon-192.png', 'icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(r => {
      const copia = r.clone();
      caches.open(VERSION).then(c => c.put(e.request, copia));
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('index.html')))
  );
});
