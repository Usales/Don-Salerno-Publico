import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoritesState {
  ids: string[]
  toggle: (produtoId: string) => void
  isFav: (produtoId: string) => boolean
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],

      toggle: (produtoId) =>
        set((s) => ({
          ids: s.ids.includes(produtoId)
            ? s.ids.filter((id) => id !== produtoId)
            : [...s.ids, produtoId],
        })),

      isFav: (produtoId) => get().ids.includes(produtoId),
    }),
    {
      name: 'don-salerno-favorites',
      onRehydrateStorage: () => {
        return (state) => {
          if (!state) console.warn('[useFavorites] Falha ao restaurar favoritos do localStorage.')
        }
      },
    },
  ),
)
