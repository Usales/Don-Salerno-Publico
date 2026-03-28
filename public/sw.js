/* Cache mínimo — incremente CACHE em cada deploy relevante para evitar index.html antigo (tela branca). */
const CACHE = 'don-salerno-v3'
const ASSETS = ['/', '/index.html', '/manifest.json', '/logo.svg']

self.addEventListener('install', (e) => {
  self.skipWaiting()
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)))
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => r || fetch(e.request).catch(() => caches.match('/index.html'))),
  )
})
