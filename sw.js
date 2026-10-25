const VERSIONE = "ur-scheda-20261025-1217";
const FILE = ["./", "index.html", "manifest.webmanifest", "icona-192.png", "icona-512.png", "icona-maschera.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSIONE).then(c => c.addAll(FILE))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== VERSIONE).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const u = new URL(e.request.url);
  const metti = r => { const copia = r.clone(); caches.open(VERSIONE).then(c => c.put(e.request, copia)); return r; };
  if (u.origin === location.origin) {
    e.respondWith(fetch(e.request).then(metti).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match("index.html"))));
  } else if (/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)) {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(metti)));
  }
});