/* Estratégia segura contra tela branca por cache antigo. */
const CACHE = 'don-salerno-v4'
const APP_SHELL = ['/', '/index.html', '/manifest.json', '/logo.svg']

self.addEventListener('install', (e) => {
  self.skipWaiting()
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(APP_SHELL)))
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
  if (e.request.method !== 'GET') return

  const url = new URL(e.request.url)
  const isSameOrigin = url.origin === self.location.origin

  // Navegação SPA: sempre tenta rede primeiro para evitar index/chunks desatualizados.
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then((response) => {
          const copy = response.clone()
          caches.open(CACHE).then((cache) => cache.put('/index.html', copy))
          return response
        })
        .catch(async () => {
          const cached = await caches.match('/index.html')
          return cached || Response.error()
        }),
    )
    return
  }

  // Assets locais: cache-first com fallback de rede.
  if (isSameOrigin) {
    e.respondWith(
      caches.match(e.request).then((cached) => {
        if (cached) return cached
        return fetch(e.request).then((response) => {
          const copy = response.clone()
          caches.open(CACHE).then((cache) => cache.put(e.request, copy))
          return response
        })
      }),
    )
    return
  }

  // Requisições externas: apenas rede.
  e.respondWith(fetch(e.request))
})
