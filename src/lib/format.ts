export function brl(n: number) {
  if (typeof n !== 'number' || Number.isNaN(n)) {
    return '—'
  }
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
