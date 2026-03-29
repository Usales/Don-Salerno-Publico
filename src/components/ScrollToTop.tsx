import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Em SPA, o scroll do documento não é resetado ao trocar de rota.
 * Garante que, ao abrir qualquer página (ex.: /produto/:id), a vista comece no topo.
 */
export function ScrollToTop() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, search])

  return null
}
