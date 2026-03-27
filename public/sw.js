/* Cache mínimo para PWA — substitua URLs em produção */
const CACHE = 'don-salerno-v1'
const ASSETS = ['/', '/index.html', '/manifest.json', '/logo.svg']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)))
})

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => r || fetch(e.request).catch(() => caches.match('/index.html'))),
  )
})
