import type { Produto } from '@/types'

/** URL canônica do produto (SEO + compartilhamento). */
export function produtoPath(p: Pick<Produto, 'slug' | 'categoria'>): string {
  return `/cardapio/${p.categoria}/${p.slug}`
}

/** Atalho legado — redirecionado para a URL canônica em Produto. */
export function produtoPathCurto(slug: string): string {
  return `/produto/${slug}`
}
