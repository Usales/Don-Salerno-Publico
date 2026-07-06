import { getProdutoPorId } from '@/data/produtos'
import type { ComboSelecao, Produto, TamanhoCodigo } from '@/types'

type ComboSelecoesInput = Record<string, string> | ComboSelecao[] | undefined

function produtoIdDoSlot(selecoes: ComboSelecoesInput, slotId: string): string | undefined {
  if (!selecoes) return undefined
  if (Array.isArray(selecoes)) return selecoes.find((s) => s.slotId === slotId)?.produtoId
  return selecoes[slotId]
}

function somaBebidasComboMinimas(produto: Produto, tamanho: TamanhoCodigo): number {
  if (!produto.comboItens?.length) return 0
  let total = 0
  for (const slot of produto.comboItens) {
    let minSlot = Infinity
    for (const oid of slot.opcoesIds) {
      const item = getProdutoPorId(oid)
      if (item?.categoria !== 'bebidas') continue
      minSlot = Math.min(minSlot, item.precos[tamanho] * slot.quantidade)
    }
    if (Number.isFinite(minSlot)) total += minSlot
  }
  return total
}

function somaBebidasCombo(
  produto: Produto,
  tamanho: TamanhoCodigo,
  selecoes: ComboSelecoesInput,
): number {
  if (!produto.comboItens?.length) return 0
  let total = 0
  for (const slot of produto.comboItens) {
    const pid = produtoIdDoSlot(selecoes, slot.id)
    if (!pid) continue
    const item = getProdutoPorId(pid)
    if (item?.categoria !== 'bebidas') continue
    total += item.precos[tamanho] * slot.quantidade
  }
  return total
}

/** Preço unitário do combo; quando `comboPrecoBebidaSeparado`, soma o valor das bebidas escolhidas. */
export function precoComboUnitario(
  produto: Produto,
  tamanho: TamanhoCodigo,
  selecoes?: ComboSelecoesInput,
): number {
  const base = produto.precos[tamanho]
  if (produto.categoria !== 'combos' || !produto.comboPrecoBebidaSeparado) return base
  const bebidas = somaBebidasCombo(produto, tamanho, selecoes ?? {})
  return Math.round((base + bebidas) * 100) / 100
}

/** Menor preço possível no cardápio (base + bebida mais barata de cada slot). */
export function precoComboMinimo(produto: Produto, tamanho: TamanhoCodigo = 'P'): number {
  if (produto.categoria !== 'combos' || !produto.comboPrecoBebidaSeparado || !produto.comboItens?.length) {
    return produto.precos[tamanho]
  }
  const extra = somaBebidasComboMinimas(produto, tamanho)
  return Math.round((produto.precos[tamanho] + extra) * 100) / 100
}
