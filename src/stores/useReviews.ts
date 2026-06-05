import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Avaliacao } from '@/types'

interface ReviewsState {
  avaliacoes: Avaliacao[]
  adicionar: (a: Omit<Avaliacao, 'id' | 'data'>) => { ok: boolean; erro?: string }
  editar: (id: string, usuarioId: string, nota: number, comentario: string) => void
  remover: (id: string, usuarioId: string) => void
  porProduto: (produtoId: string) => Avaliacao[]
  jaAvaliou: (produtoId: string, usuarioId: string) => boolean
}

function novoId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `av-${Date.now()}`
}

/** Limite de caracteres no comentário. */
const COMENTARIO_MAX = 500

function sanitizarComentario(texto: string): string {
  return texto.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;').slice(0, COMENTARIO_MAX)
}

export const useReviews = create<ReviewsState>()(
  persist(
    (set, get) => ({
      avaliacoes: [],

      adicionar: (a) => {
        const ja = get().avaliacoes.some(
          (x) => x.produtoId === a.produtoId && x.usuarioId === a.usuarioId,
        )
        if (ja) return { ok: false, erro: 'Você já avaliou este produto.' }
        if (a.nota < 1 || a.nota > 5) return { ok: false, erro: 'Nota deve ser entre 1 e 5.' }
        set((s) => ({
          avaliacoes: [
            ...s.avaliacoes,
            {
              ...a,
              comentario: sanitizarComentario(a.comentario) || 'Sem comentário',
              id: novoId(),
              data: new Date().toISOString(),
            },
          ],
        }))
        return { ok: true }
      },

      editar: (id, usuarioId, nota, comentario) =>
        set((s) => ({
          avaliacoes: s.avaliacoes.map((a) =>
            a.id === id && a.usuarioId === usuarioId
              ? { ...a, nota, comentario: sanitizarComentario(comentario) }
              : a,
          ),
        })),

      remover: (id, usuarioId) =>
        set((s) => ({
          avaliacoes: s.avaliacoes.filter((a) => !(a.id === id && a.usuarioId === usuarioId)),
        })),

      porProduto: (produtoId) => get().avaliacoes.filter((x) => x.produtoId === produtoId),

      jaAvaliou: (produtoId, usuarioId) =>
        get().avaliacoes.some((x) => x.produtoId === produtoId && x.usuarioId === usuarioId),
    }),
    {
      name: 'don-salerno-reviews',
      onRehydrateStorage: () => {
        return (state) => {
          if (!state) console.warn('[useReviews] Falha ao restaurar avaliações do localStorage.')
        }
      },
    },
  ),
)
