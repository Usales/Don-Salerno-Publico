import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getProdutoPorId } from '@/data/produtos'
import type { Produto, TamanhoCodigo } from '@/types'

export interface LinhaCarrinho {
  id: string
  produtoId: string
  nome: string
  imagem: string
  tamanho: TamanhoCodigo
  precoUnit: number
  quantidade: number
}

interface CupomAplicado {
  codigo: string
  percentual: number
}

interface CartState {
  itens: LinhaCarrinho[]
  cupomAplicado: CupomAplicado | null
  adicionar: (produto: Produto, tamanho: TamanhoCodigo) => void
  definirQuantidade: (linhaId: string, quantidade: number) => void
  remover: (linhaId: string) => void
  limparCupom: () => void
  aplicarCupom: (codigo: string) => { ok: boolean; mensagem?: string }
  sincronizarPrecos: () => void
  totalItens: () => number
  subtotal: () => number
  descontoValor: () => number
  total: () => number
}

function novoIdLinha() {
  return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `c-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/** Cupons demo (maiúsculas/minúsculas ignoradas). */
function resolverCupom(codigo: string): CupomAplicado | null {
  const c = codigo.trim().toUpperCase()
  if (c === 'SALERNO10' || c === 'DON10') return { codigo: c, percentual: 10 }
  if (c === 'PIZZA15') return { codigo: c, percentual: 15 }
  return null
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      itens: [],
      cupomAplicado: null,

      adicionar: (produto, tamanho) => {
        const precoUnit = produto.precos[tamanho]
        const imagem = produto.imagemDestaque ?? produto.imagem
        set((s) => {
          const idx = s.itens.findIndex((i) => i.produtoId === produto.id && i.tamanho === tamanho)
          if (idx >= 0) {
            const next = [...s.itens]
            const linha = next[idx]
            next[idx] = { ...linha, quantidade: linha.quantidade + 1, precoUnit, imagem, nome: produto.nome }
            return { itens: next }
          }
          const linha: LinhaCarrinho = {
            id: novoIdLinha(),
            produtoId: produto.id,
            nome: produto.nome,
            imagem,
            tamanho,
            precoUnit,
            quantidade: 1,
          }
          return { itens: [...s.itens, linha] }
        })
      },

      definirQuantidade: (linhaId, quantidade) => {
        const q = Math.floor(quantidade)
        if (q < 1) {
          set((s) => ({ itens: s.itens.filter((i) => i.id !== linhaId) }))
          return
        }
        set((s) => ({
          itens: s.itens.map((i) => (i.id === linhaId ? { ...i, quantidade: q } : i)),
        }))
      },

      remover: (linhaId) => set((s) => ({ itens: s.itens.filter((i) => i.id !== linhaId) })),

      limparCupom: () => set({ cupomAplicado: null }),

      aplicarCupom: (codigo) => {
        const raw = codigo.trim()
        if (!raw) {
          set({ cupomAplicado: null })
          return { ok: true }
        }
        const cupom = resolverCupom(raw)
        if (!cupom) {
          return { ok: false, mensagem: 'Cupom inválido ou expirado.' }
        }
        set({ cupomAplicado: cupom })
        return { ok: true }
      },

      sincronizarPrecos: () => {
        set((s) => ({
          itens: s.itens
            .map((i) => {
              const p = getProdutoPorId(i.produtoId)
              if (!p) return i
              return {
                ...i,
                nome: p.nome,
                imagem: p.imagemDestaque ?? p.imagem,
                precoUnit: p.precos[i.tamanho],
              }
            })
            .filter((i) => getProdutoPorId(i.produtoId)),
        }))
      },

      totalItens: () => get().itens.reduce((acc, i) => acc + i.quantidade, 0),

      subtotal: () => get().itens.reduce((acc, i) => acc + i.precoUnit * i.quantidade, 0),

      descontoValor: () => {
        const sub = get().subtotal()
        const cup = get().cupomAplicado
        if (!cup || sub <= 0) return 0
        return Math.round(sub * (cup.percentual / 100) * 100) / 100
      },

      total: () => {
        const sub = get().subtotal()
        return Math.max(0, Math.round((sub - get().descontoValor()) * 100) / 100)
      },
    }),
    { name: 'don-salerno-cart' },
  ),
)
