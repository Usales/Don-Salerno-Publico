import { useEffect, useState } from 'react'
import { statusDaLoja } from '@/lib/horario'
import { montarLinkWhatsApp, type ItemPedido } from '@/lib/whatsapp'

type Props = {
  itens: ItemPedido[]
}

export default function FinalizarPedido({ itens }: Props) {
  const [nome, setNome] = useState('')
  const [pagamento, setPagamento] = useState<'Pix' | 'Dinheiro' | 'Cartão'>('Pix')
  const [status, setStatus] = useState(statusDaLoja())

  // atualiza o status a cada minuto (se o cliente deixar a página aberta)
  useEffect(() => {
    const id = setInterval(() => setStatus(statusDaLoja()), 60_000)
    return () => clearInterval(id)
  }, [])

  const podeEnviar = status.aberta && itens.length > 0 && nome.trim().length > 0

  function enviar() {
    const link = montarLinkWhatsApp({ itens, nomeCliente: nome.trim(), pagamento })
    window.open(link, '_blank', 'noopener')
  }

  return (
    <div>
      <p>{status.mensagem}</p>

      <label>
        Seu nome
        <input value={nome} onChange={(e) => setNome(e.target.value)} />
      </label>

      <label>
        Pagamento na retirada
        <select
          value={pagamento}
          onChange={(e) => setPagamento(e.target.value as 'Pix' | 'Dinheiro' | 'Cartão')}
        >
          <option>Pix</option>
          <option>Dinheiro</option>
          <option>Cartão</option>
        </select>
      </label>

      <button disabled={!podeEnviar} onClick={enviar}>
        {status.aberta ? 'Enviar pedido pelo WhatsApp' : status.mensagem}
      </button>
    </div>
  )
}