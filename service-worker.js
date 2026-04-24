const CACHE_NAME = "nepa-lawn-v1";
const ASSETS = ["/", "/index.html", "/booking.html", "/styles/site.css", "/scripts/booking.js", "/scripts/pwa.js", "/app.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("fetch", (event) => {
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
