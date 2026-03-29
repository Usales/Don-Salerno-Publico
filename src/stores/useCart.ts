import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getProdutoPorId } from '@/data/produtos'
import type { CarrinhoAdicional, CarrinhoSegundoSabor, PartesPizza, Produto, TamanhoCodigo } from '@/types'

export interface LinhaCarrinho {
  id: string
  produtoId: string
  nome: string
  imagem: string
  tamanho: TamanhoCodigo
  /** Preço unitário (tamanho + adicionais por unidade). */
  precoUnit: number
  quantidade: number
  /** Apenas pizzas. */
  partes?: PartesPizza
  /** Metade complementar (meio a meio). */
  segundoSabor?: CarrinhoSegundoSabor
  adicionais?: CarrinhoAdicional[]
}

export interface OpcoesAdicionarCarrinho {
  quantidade?: number
  partes?: PartesPizza
  segundoSabor?: CarrinhoSegundoSabor
  adicionais?: CarrinhoAdicional[]
}

interface CupomAplicado {
  codigo: string
  percentual: number
}

const OBSERVACAO_MAX_LEN = 2000

interface CartState {
  itens: LinhaCarrinho[]
  cupomAplicado: CupomAplicado | null
  /** Comentário do cliente (pizza, ponto da massa, retirada etc.) — enviado no WhatsApp. */
  observacaoPedido: string
  adicionar: (produto: Produto, tamanho: TamanhoCodigo, opcoes?: OpcoesAdicionarCarrinho) => void
  definirQuantidade: (linhaId: string, quantidade: number) => void
  remover: (linhaId: string) => void
  limparCarrinho: () => void
  definirObservacaoPedido: (texto: string) => void
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

function chaveAdicionais(ads: CarrinhoAdicional[] | undefined): string {
  if (!ads?.length) return ''
  return [...ads]
    .map((a) => a.id)
    .sort()
    .join('|')
}

function chaveSegundoSabor(s: CarrinhoSegundoSabor | undefined): string {
  return s?.produtoId ?? ''
}

/** Preço da pizza no tamanho (base para meio a meio: cobra-se o maior dos dois sabores). */
function basePrecoPizza(produto: Produto, tamanho: TamanhoCodigo, segundo: CarrinhoSegundoSabor | undefined): number {
  const p1 = produto.precos[tamanho]
  if (!segundo) return p1
  const p2 = getProdutoPorId(segundo.produtoId)
  if (!p2) return p1
  return Math.max(p1, p2.precos[tamanho])
}

function nomeMeioMeio(nomePrincipal: string, segundo: CarrinhoSegundoSabor | undefined): string {
  if (!segundo) return nomePrincipal
  return `${nomePrincipal} + ${segundo.nome} (meio a meio)`
}

function partesNormalizada(cat: Produto['categoria'], p: PartesPizza | undefined): PartesPizza | null {
  if (cat !== 'pizzas') return null
  return p ?? 'inteira'
}

function precoComAdicionais(base: number, ads: CarrinhoAdicional[] | undefined): number {
  const extra = ads?.reduce((s, a) => s + a.preco, 0) ?? 0
  return Math.round((base + extra) * 100) / 100
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
      observacaoPedido: '',

      adicionar: (produto, tamanho, opcoes) => {
        const imagem = produto.imagemDestaque ?? produto.imagem
        const ads = opcoes?.adicionais?.length ? [...opcoes.adicionais] : undefined
        const partesEff = partesNormalizada(produto.categoria, opcoes?.partes)
        const segundo =
          partesEff === 'meio-meio' && opcoes?.segundoSabor?.produtoId
            ? { ...opcoes.segundoSabor }
            : undefined
        const base = basePrecoPizza(produto, tamanho, segundo)
        const precoUnit = precoComAdicionais(base, ads)
        const nomeLinha = nomeMeioMeio(produto.nome, segundo)
        const qtdAdd = Math.min(99, Math.max(1, Math.floor(opcoes?.quantidade ?? 1)))

        set((s) => {
          const idx = s.itens.findIndex(
            (i) =>
              i.produtoId === produto.id &&
              i.tamanho === tamanho &&
              partesNormalizada(produto.categoria, i.partes) === partesEff &&
              chaveAdicionais(i.adicionais) === chaveAdicionais(ads) &&
              chaveSegundoSabor(i.segundoSabor) === chaveSegundoSabor(segundo),
          )
          if (idx >= 0) {
            const next = [...s.itens]
            const linha = next[idx]
            next[idx] = {
              ...linha,
              quantidade: Math.min(99, linha.quantidade + qtdAdd),
              precoUnit,
              imagem,
              nome: nomeLinha,
              partes: partesEff ?? undefined,
              segundoSabor: segundo,
              adicionais: ads,
            }
            return { itens: next }
          }
          const linha: LinhaCarrinho = {
            id: novoIdLinha(),
            produtoId: produto.id,
            nome: nomeLinha,
            imagem,
            tamanho,
            precoUnit,
            quantidade: qtdAdd,
            partes: partesEff ?? undefined,
            segundoSabor: segundo,
            adicionais: ads,
          }
          return { itens: [...s.itens, linha] }
        })
      },

      definirQuantidade: (linhaId, quantidade) => {
        const raw = Math.floor(quantidade)
        if (raw < 1) {
          set((s) => ({ itens: s.itens.filter((i) => i.id !== linhaId) }))
          return
        }
        const q = Math.min(99, raw)
        set((s) => ({
          itens: s.itens.map((i) => (i.id === linhaId ? { ...i, quantidade: q } : i)),
        }))
      },

      remover: (linhaId) => set((s) => ({ itens: s.itens.filter((i) => i.id !== linhaId) })),

      limparCarrinho: () => set({ itens: [], cupomAplicado: null, observacaoPedido: '' }),

      definirObservacaoPedido: (texto) =>
        set({ observacaoPedido: texto.slice(0, OBSERVACAO_MAX_LEN) }),

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
              const adsAtualizados: CarrinhoAdicional[] | undefined = i.adicionais?.map((a) => {
                const ref = p.adicionais.find((x) => x.id === a.id)
                return ref ? { id: ref.id, nome: ref.nome, preco: ref.preco } : a
              })
              const p2 = i.segundoSabor?.produtoId ? getProdutoPorId(i.segundoSabor.produtoId) : undefined
              const segundoAtual =
                p2 && i.segundoSabor ? { produtoId: p2.id, nome: p2.nome } : undefined
              const partesSync: PartesPizza | undefined =
                i.partes === 'meio-meio' && !segundoAtual ? 'inteira' : i.partes
              const base = basePrecoPizza(p, i.tamanho, segundoAtual)
              const nomeAtual = nomeMeioMeio(p.nome, segundoAtual)
              return {
                ...i,
                nome: nomeAtual,
                imagem: p.imagemDestaque ?? p.imagem,
                partes: partesSync,
                segundoSabor: segundoAtual,
                adicionais: adsAtualizados,
                precoUnit: precoComAdicionais(base, adsAtualizados),
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
