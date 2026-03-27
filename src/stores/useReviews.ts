import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Avaliacao } from '@/types'

interface ReviewsState {
  avaliacoes: Avaliacao[]
  adicionar: (a: Omit<Avaliacao, 'id' | 'data'>) => void
  porProduto: (produtoId: string) => Avaliacao[]
}

function novoId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `av-${Date.now()}`
}

export const useReviews = create<ReviewsState>()(
  persist(
    (set, get) => ({
      avaliacoes: [],

      adicionar: (a) =>
        set((s) => ({
          avaliacoes: [
            ...s.avaliacoes,
            {
              ...a,
              id: novoId(),
              data: new Date().toISOString(),
            },
          ],
        })),

      porProduto: (produtoId) => get().avaliacoes.filter((x) => x.produtoId === produtoId),
    }),
    { name: 'don-salerno-reviews' },
  ),
)
