const cacheName = "Arkana";

self.addEventListener('install', e => {
    e.WaitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll([
                './',
                './index.html',
                './style.css',
                './assets/images/Arkana.svg',
                './assets/images/add_task.svg',
                './assets/images/fun.svg',
                './assets/images/time_management.svg',
                './pages/app.html'
            ]);
        })
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.open(cacheName)
        .then(cache => cache.match(e.request, {ignoreSearch: true}))
        .then(response => {
            return response || fetch(e.request);
        })
    );
});