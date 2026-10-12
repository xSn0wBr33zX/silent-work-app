/*
  Service Worker: speichert die App-Dateien im Handy-Cache,
  damit die App auch offline startet.

  WICHTIG: Wenn du etwas an der App änderst, erhöhe die Versionsnummer
  (z. B. auf "v2"). Sonst sehen die Handys weiter die alte Version.
*/
const CACHE_NAME = "care-plus-v3";
const DATEIEN = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png"
];

// Beim Installieren: alle Dateien in den Cache legen
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(DATEIEN)));
  self.skipWaiting();
});

// Beim Aktivieren: alte Cache-Versionen löschen
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(namen =>
      Promise.all(namen.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)))
    )
  );
  self.clients.claim();
});

// Bei jeder Anfrage: erst im Internet versuchen, sonst aus dem Cache
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then(antwort => {
        const kopie = antwort.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, kopie));
        return antwort;
      })
      .catch(() => caches.match(event.request).then(t => t || caches.match("./index.html")))
  );
});
