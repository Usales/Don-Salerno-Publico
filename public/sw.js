/* Estratégia defensiva para evitar white screen por HTML/chunks antigos. */
const CACHE = 'don-salerno-v5'
const APP_SHELL = ['/manifest.json', '/logo.svg']

self.addEventListener('install', (e) => {
  self.skipWaiting()
  e.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.allSettled(APP_SHELL.map((asset) => cache.add(asset))),
    ),
  )
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

  // Navegação SPA: network-first para não ficar preso em index.html antigo.
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request, { cache: 'no-store' })
        .catch(async () => {
          const cached = await caches.match('/index.html')
          if (cached) return cached
          return Response.redirect('/', 302)
        }),
    )
    return
  }

  // JS/CSS/workers locais: network-first para reduzir risco de chunk desatualizado.
  if (isSameOrigin) {
    const isCriticalAsset =
      e.request.destination === 'script' ||
      e.request.destination === 'style' ||
      e.request.destination === 'worker'

    if (isCriticalAsset) {
      e.respondWith(
        fetch(e.request, { cache: 'no-store' })
          .then((response) => {
            if (response.ok) {
              const copy = response.clone()
              caches.open(CACHE).then((cache) => cache.put(e.request, copy))
            }
            return response
          })
          .catch(async () => {
            const cached = await caches.match(e.request)
            return cached || Response.error()
          }),
      )
      return
    }

    // Demais assets locais: cache-first com fallback para rede.
    e.respondWith(
      caches.match(e.request).then((cached) => {
        if (cached) return cached
        return fetch(e.request).then((response) => {
          if (response.ok) {
            const copy = response.clone()
            caches.open(CACHE).then((cache) => cache.put(e.request, copy))
          }
          return response
        })
      }),
    )
    return
  }

  // Requisições externas: apenas rede.
  e.respondWith(fetch(e.request))
})
