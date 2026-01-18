const CACHE_NAME = "cantaloop-v1";
const URLS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  // Сюди SW автоматично додасть JS та CSS після збірки
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE)),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Повертаємо файл з кешу, якщо він там є, інакше йдемо в мережу
      return response || fetch(event.request);
    }),
  );
});
