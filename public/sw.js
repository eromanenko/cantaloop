const VERSION = 1.1;
const CACHE_NAME = `cantaloop-v${VERSION}`;
const URLS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "./avatars/alice.png",
  "./avatars/barkeeper.png",
  "./avatars/bouncer.png",
  "./avatars/fly.png",
  "./avatars/girl.png",
  "./avatars/guard.png",
  "./avatars/hook.png",
  "./avatars/mike.png",
  "./avatars/secretary.png",
  "./avatars/woman.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-96x96.png",
  "./icons/favicon.ico",
  "./icons/favicon.svg",
  "./icons/favicon-192x192.png",
  "./icons/favicon-512x512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE)),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});
