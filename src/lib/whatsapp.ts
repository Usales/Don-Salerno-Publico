export const WHATSAPP_PIZZARIA = '5562995227774'

export type ItemPedido = {
  nome: string
  quantidade: number
  precoCentavos: number
  observacao?: string
}

const brl = (centavos: number) =>
  (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export function montarLinkWhatsApp(params: {
  itens: ItemPedido[]
  nomeCliente: string
  pagamento: 'Pix' | 'Dinheiro' | 'Cartão'
  horarioRetirada?: string
}): string {
  const { itens, nomeCliente, pagamento, horarioRetirada } = params
  const total = itens.reduce((s, i) => s + i.precoCentavos * i.quantidade, 0)

  const linhas = [
    '*Novo pedido — Don Salerno*',
    `Cliente: ${nomeCliente}`,
    'Tipo: *Retirada no balcão*',
    horarioRetirada ? `Retirada: ${horarioRetirada}` : '',
    '',
    ...itens.map(
      (i) =>
        `${i.quantidade}x ${i.nome} — ${brl(i.precoCentavos * i.quantidade)}` +
        (i.observacao ? `\n   Obs: ${i.observacao}` : ''),
    ),
    '',
    `*Total: ${brl(total)}*`,
    `Pagamento: ${pagamento}`,
  ].filter((l, idx, arr) => !(l === '' && arr[idx - 1] === ''))

  return `https://wa.me/${WHATSAPP_PIZZARIA}?text=${encodeURIComponent(linhas.join('\n'))}`
}