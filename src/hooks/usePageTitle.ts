import { useEffect } from 'react'

export const PAGE_TITLE_DEFAULT = 'Don Salerno — Pizzaria & Esfiharia em Goiânia'

/** Define `<title>` dinâmico por rota (SEO e preview no WhatsApp). */
export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | Don Salerno` : PAGE_TITLE_DEFAULT
  }, [title])
}
